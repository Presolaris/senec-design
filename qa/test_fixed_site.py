#!/usr/bin/env python3
"""Regression der bestätigten Hauptdomain; alle POSTs werden vor dem Netzwerk simuliert."""
from __future__ import annotations
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

HOST = os.environ.get('QA_BASE_URL', 'http://127.0.0.1:4321').rstrip('/')
OUT = Path(__file__).with_name('fixed-site-regression.json')
FORMS = [
    ('/', '#multi-step-form', 'mehrstufig'),
    ('/', '#exit-intent-form', 'popup'),
    ('/kontakt/', '#contact-form', 'standard'),
    ('/gewerbe/', 'main form', 'standard'),
    ('/service/', 'main form', 'standard'),
    ('/gewerbe-photovoltaik-leipzig/', 'main form', 'standard'),
    ('/pv-wartung-leipzig/', 'main form', 'standard'),
    ('/pv-reinigung-leipzig/', 'main form', 'standard'),
    ('/solarpark-betreuung/', 'main form', 'standard'),
]


def setup(browser, width):
    ctx = browser.new_context(viewport={'width': width, 'height': 844 if width < 500 else 900}, locale='de-DE', accept_downloads=True)
    ctx.add_init_script("sessionStorage.setItem('exitIntentShown','true')")
    ctx.add_cookies([{'name': 'cookie-consent', 'value': json.dumps({'necessary': True, 'analytics': False, 'marketing': False}), 'url': HOST}])
    state = {'success': False, 'posts': [], 'navigations': []}

    def intercept(route):
        req = route.request
        if req.method == 'POST':
            if 'api.web3forms.com/submit' in req.url:
                state['posts'].append({'url': req.url, 'body': req.post_data or ''})
                response = {'success': state['success'], 'message': 'Simulierte Antwort'}
                route.fulfill(status=200, headers={'content-type': 'application/json', 'access-control-allow-origin': '*'}, body=json.dumps(response))
            else:
                # Auch Supabase/andere Dienste verlassen den Browser nicht.
                route.fulfill(status=200, headers={'content-type': 'application/json', 'access-control-allow-origin': '*'}, body='{"data":null}')
        elif req.url.startswith(HOST):
            if req.is_navigation_request() and '?' in req.url:
                state['navigations'].append(req.url.split('?')[0])
                route.fulfill(status=200, content_type='text/html', body='TEST-NAVIGATION (unzulässiges GET)')
            elif req.resource_type in ('image', 'font', 'media'):
                route.abort()
            else:
                route.continue_()
        else:
            route.abort()
    ctx.route('**/*', intercept)
    return ctx, state


def fill(form):
    for field in form.locator('input,textarea').all():
        typ = (field.get_attribute('type') or 'text').lower()
        name = (field.get_attribute('name') or '').lower()
        if typ in ('hidden', 'file', 'button', 'submit'): continue
        if typ == 'checkbox':
            if field.get_attribute('required') is not None: field.evaluate('el=>{el.checked=true;el.dispatchEvent(new Event("change",{bubbles:true}))}')
        elif typ == 'radio':
            if name and not form.locator(f'input[name="{name}"]:checked').count():
                field.evaluate("el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}))}")
        else:
            value = ('qa@example.invalid' if typ == 'email' else '0341 1234567' if typ == 'tel' else
                     '04109' if 'plz' in name else 'Leipzig' if name == 'ort' else
                     '12' if 'hausnummer' in name else 'QA Testperson' if any(k in name for k in ('name','contact','company')) else 'QA Beispiel')
            field.fill(value, force=True)


def test_form(browser, path, selector, kind, width):
    ctx, state = setup(browser, width)
    page = ctx.new_page()
    row = {'page': path, 'kind': kind, 'width': width, 'checks': {}}
    try:
        page.goto(HOST+path, wait_until='domcontentloaded', timeout=30000)
        form = page.locator(selector).first
        form.wait_for(state='attached', timeout=12000)
        page.wait_for_function('(selector) => document.querySelector(selector)?.dataset.leadReady === "true"', arg=selector, timeout=15000)
        if kind == 'popup': page.locator('#exit-intent-popup').evaluate("el => el.classList.add('show')")
        if kind == 'mehrstufig':
            form.locator('input[name=projekttyp]').first.evaluate('el=>{el.checked=true}')
            form.locator('input[name=anlagengroesse]').first.evaluate('el=>{el.checked=true}')
            page.locator('#next-btn').click(force=True)
            form.locator('input[name=zeitrahmen]').first.evaluate('el=>{el.checked=true}')
            page.locator('#next-btn').click(force=True)
            row['checks']['step3_reached'] = not page.locator('#step-3').evaluate("el=>el.classList.contains('hidden')")
        form.locator('button[type=submit]').click()
        page.wait_for_timeout(200)
        row['checks']['invalid_stays_local'] = not state['posts'] and not state['navigations']
        fill(form)
        assert form.evaluate('el=>el.checkValidity()'), 'Pflichtfelder bleiben ungültig'
        email_field = form.locator('input[type=email]').first
        email_field.fill('ungueltig-ohne-at')
        form.locator('button[type=submit]').click()
        page.wait_for_timeout(100)
        row['checks']['invalid_email_stays_local'] = not state['posts'] and not state['navigations']
        email_field.fill('qa@example.invalid')
        form.locator('button[type=submit]').click()
        page.wait_for_function('(selector) => document.querySelector(selector)?.dataset.submitState === "error"' if kind == 'standard' else
                               '(selector) => document.querySelector(selector)?.textContent?.includes("nicht versendet")',
                               arg=selector if kind == 'standard' else '#multi-step-status' if kind == 'mehrstufig' else '#exit-form-status', timeout=10000)
        row['checks']['false_response_error_no_data_loss'] = len(state['posts']) == 1 and bool(form.locator('input[type=email]').first.input_value())
        state['success'] = True
        form.locator('button[type=submit]').click()
        if kind == 'standard':
            page.wait_for_function('(selector) => document.querySelector(selector)?.dataset.submitState === "success"', arg=selector, timeout=10000)
        else:
            page.wait_for_function('(selector) => document.querySelector(selector)?.textContent?.includes("wurde übermittelt")',
                                   arg='#multi-step-status' if kind == 'mehrstufig' else '#exit-form-status', timeout=10000)
        body = state['posts'][-1]['body'] if state['posts'] else ''
        row['checks']['confirmed_success'] = len(state['posts']) == 2
        row['checks']['correct_endpoint'] = all(x['url'] == 'https://api.web3forms.com/submit' for x in state['posts'])
        expected_source = 'multi_step_form' if kind == 'mehrstufig' else 'Exit-Intent-Popup' if kind == 'popup' else path.strip('/')
        row['checks']['source_and_key'] = ('name="source"' in body and expected_source in body and
                                           'name="access_key"' in body and 'YOUR_WEB3FORMS_KEY' not in body)
        row['checks']['no_wrong_redirect'] = not state['navigations'] and page.url == HOST+path
        if path == '/gewerbe-photovoltaik-leipzig/': row['checks']['calculator_summary'] = 'calculator_summary' in body and 'Jahresertrag' in body
    except Exception as exc:
        row['error'] = f'{type(exc).__name__}: {str(exc)[:250]}'
    finally:
        page.close(); ctx.close()
    row['passed'] = bool(row['checks']) and all(row['checks'].values()) and 'error' not in row
    return row


def test_solar_dialog(browser, width):
    ctx, state = setup(browser, width)
    page = ctx.new_page()
    row = {'page': '/', 'kind': 'solarrechner_dialog', 'width': width, 'checks': {}}
    try:
        page.goto(HOST, wait_until='domcontentloaded', timeout=30000)
        page.locator('#address').wait_for(state='visible', timeout=20000)
        page.locator('#address').scroll_into_view_if_needed()
        page.wait_for_function('!document.querySelector("astro-island[component-url*=SolarCalculator]")?.hasAttribute("ssr")', timeout=20000)
        row['checks']['no_fake_analysis'] = page.get_by_text('Es werden keine Satelliten- oder Dachflächen automatisch geprüft.').count() == 1 and page.get_by_text('Jetzt prüfen', exact=True).count() == 0
        offer_button = page.get_by_role('button', name='Angebot anfordern', exact=True).last
        offer_button.wait_for(state='visible', timeout=15000)
        offer_button.scroll_into_view_if_needed(timeout=15000)
        offer_button.click(timeout=15000)
        dialog = page.get_by_role('dialog')
        dialog.wait_for(timeout=10000)
        dialog.locator('#name').fill('QA Testperson')
        dialog.locator('#email').fill('qa@example.invalid')
        dialog.locator('#phone').fill('0341 1234567')
        dialog.locator('input[type=checkbox]').check()
        submit=dialog.get_by_role('button', name='Jetzt unverbindlich anfragen')
        submit.click()
        dialog.get_by_role('alert').wait_for(timeout=10000)
        row['checks']['provider_error_keeps_values'] = len(state['posts']) == 1 and dialog.locator('#email').input_value() == 'qa@example.invalid'
        state['success'] = True
        submit.click()
        dialog.get_by_text('Ihre Anfrage wurde erfolgreich übermittelt.', exact=False).wait_for(timeout=10000)
        body=state['posts'][-1]['body'] if state['posts'] else ''
        row['checks']['actual_post_and_summary'] = len(state['posts']) == 2 and 'source' in body and 'solarrechner' in body and '40 ct/kWh' in body
        row['checks']['no_mailto'] = page.url == HOST+'/' and not state['navigations']
    except Exception as exc:
        row['error'] = f'{type(exc).__name__}: {str(exc)[:250]}'
    finally:
        page.close();ctx.close()
    row['passed'] = bool(row['checks']) and all(row['checks'].values()) and 'error' not in row
    return row


def test_checklist(browser):
    ctx,state=setup(browser,1365)
    page=ctx.new_page(); row={'page':'/ratgeber/','kind':'checkliste','width':1365,'checks':{}}
    try:
        page.goto(HOST+'/ratgeber/',wait_until='domcontentloaded')
        link=page.get_by_role('link',name='Checkliste der Verbraucherzentrale öffnen (PDF)')
        row['checks']['real_pdf_link']=(link.get_attribute('href') or '').endswith('.pdf')
        row['checks']['no_fake_email_form']=page.locator('main form').count()==0
    except Exception as exc: row['error']=f'{type(exc).__name__}: {str(exc)[:250]}'
    finally: page.close();ctx.close()
    row['passed']=bool(row['checks']) and all(row['checks'].values()) and 'error' not in row
    return row


def test_upload(browser, width):
    ctx, state = setup(browser, width)
    page = ctx.new_page()
    row = {'page': '/', 'kind': 'dateianhang', 'width': width, 'checks': {}}
    try:
        page.goto(HOST, wait_until='domcontentloaded', timeout=30000)
        form = page.locator('#multi-step-form')
        page.wait_for_function('document.querySelector("#multi-step-form")?.dataset.leadReady === "true"', timeout=15000)
        for name in ('projekttyp', 'anlagengroesse'):
            form.locator(f'input[name="{name}"]').first.evaluate('el => {el.checked=true}')
        page.locator('#next-btn').click()
        form.locator('input[name="zeitrahmen"]').first.evaluate('el => {el.checked=true}')
        page.locator('#next-btn').click()
        fill(form)
        upload = form.locator('#attachments')
        upload.set_input_files({'name': 'zu-gross.pdf', 'mimeType': 'application/pdf', 'buffer': b'x' * (5 * 1024 * 1024 + 1)})
        row['checks']['oversize_rejected'] = (upload.evaluate('el => el.files.length') == 0
                                               and 'zu groß' in page.locator('#file-preview').inner_text()
                                               and not state['posts'])
        upload.set_input_files({'name': 'qa-anlage.pdf', 'mimeType': 'application/pdf', 'buffer': b'%PDF-1.7\n%%EOF'})
        row['checks']['small_file_selected'] = 'qa-anlage.pdf' in page.locator('#file-preview').inner_text()
        state['success'] = True
        form.locator('#submit-btn').click()
        page.wait_for_function('document.querySelector("#multi-step-status")?.textContent?.includes("wurde übermittelt")', timeout=10000)
        row['checks']['attachment_sent_to_mock'] = (len(state['posts']) == 1
                                                    and 'name="attachment"; filename="qa-anlage.pdf"' in state['posts'][0]['body'])
    except Exception as exc:
        row['error'] = f'{type(exc).__name__}: {str(exc)[:250]}'
    finally:
        page.close(); ctx.close()
    row['passed'] = bool(row['checks']) and all(row['checks'].values()) and 'error' not in row
    return row


def main():
    rows=[]
    with sync_playwright() as p:
        executable = os.environ.get('QA_CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path)
        browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for width in (1365,390):
            for path,selector,kind in FORMS:
                row=test_form(browser,path,selector,kind,width);rows.append(row)
                print(width,path,kind,'OK' if row['passed'] else f"FEHLER {row.get('error',row['checks'])}",flush=True)
            row=test_solar_dialog(browser,width);rows.append(row)
            print(width,'Solarrechner-Dialog','OK' if row['passed'] else f"FEHLER {row.get('error',row['checks'])}",flush=True)
            row=test_upload(browser,width);rows.append(row)
            print(width,'Dateianhang','OK' if row['passed'] else f"FEHLER {row.get('error',row['checks'])}",flush=True)
        row=test_checklist(browser);rows.append(row)
        print('Ratgeber-Checkliste','OK' if row['passed'] else f"FEHLER {row.get('error',row['checks'])}",flush=True)
        browser.close()
    OUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    count=sum(r['passed'] for r in rows)
    print(f'Bestanden {count}/{len(rows)}; echte POSTs: 0; Details: {OUT}',flush=True)
    if count != len(rows): raise SystemExit(1)

if __name__ == '__main__': main()
