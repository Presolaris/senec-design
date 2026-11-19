#!/usr/bin/env python3
"""Browser-QA nur gegen einen vorhandenen lokalen Build; GA/API vollständig gestubbt."""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_ROOT = Path('/home/ubuntu/pv-preview-kontakt-messbarkeit-20261119-RoIv')
assert ROOT == EXPECTED_ROOT
OUT = Path(__file__).with_suffix('.browser.json')
BASE = os.environ.get('QA_BASE_URL', 'http://127.0.0.1:4321').rstrip('/')
parsed = urlsplit(BASE)
if (parsed.scheme != 'http' or parsed.hostname not in {'localhost', '127.0.0.1', '::1'}
        or not parsed.port or parsed.path or parsed.query or parsed.fragment
        or parsed.username or parsed.password):
    raise ValueError('Nur HTTP-Loopback mit explizitem Port ist als QA_BASE_URL erlaubt.')

INIT = """(() => {
  sessionStorage.setItem('exitIntentShown', 'true');
  window.__contactQaEvents = [];
  window.__contactQaAllCommands = [];
  window.__contactQaLeadAccepted = [];
  let queue;
  const instrument = layer => {
    if (layer.__contactQaInstrumented) return layer;
    const push = layer.push.bind(layer);
    layer.push = (...entries) => {
      for (const entry of entries) {
        const command = Array.from(entry || []);
        window.__contactQaAllCommands.push(command);
        if (command[0] === 'event') window.__contactQaEvents.push(command);
      }
      return push(...entries);
    };
    layer.__contactQaInstrumented = true;
    return layer;
  };
  Object.defineProperty(window, 'dataLayer', { configurable:true,
    get:()=>queue, set:layer=>{queue=instrument(layer);} });
  window.dataLayer = [];
  window.addEventListener('presolaris:lead-accepted', event => {
    window.__contactQaLeadAccepted.push(event.detail);
  });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a[data-contact-qa]')) event.preventDefault();
  });
})();"""


def main():
    rows = []
    with sync_playwright() as p:
        executable = os.environ.get('QA_CHROMIUM_PATH') or (
            '/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path)
        browser = p.chromium.launch(executable_path=executable, headless=True,
                                   args=['--no-sandbox', '--disable-dev-shm-usage'])
        for width in (1365, 390):
            context = browser.new_context(viewport={'width': width, 'height': 900 if width == 1365 else 844},
                                          service_workers='block')
            context.add_init_script(INIT)
            state = {'ga_script_stubs': 0, 'local_stub_scripts': 0, 'blocked_external': 0,
                     'blocked_mutations': 0, 'api_stubs': 0, 'mode': 'error'}

            def intercept(route):
                req = route.request
                url = urlsplit(req.url)
                is_local = (url.scheme, url.netloc) == (parsed.scheme, parsed.netloc)
                if url.hostname == 'www.googletagmanager.com' and url.path == '/gtag/js' and req.method == 'GET':
                    state['ga_script_stubs'] += 1
                    route.fulfill(status=200, content_type='application/javascript',
                                  body='window.__contactQaGaStubLoaded = true;')
                elif is_local and url.path == '/_preview/ga-stub.js' and req.method == 'GET':
                    state['local_stub_scripts'] += 1
                    route.fulfill(status=200, content_type='application/javascript',
                                  body='window.__contactQaGaStubLoaded = true;')
                elif is_local and url.path == '/api/lead/' and req.method == 'POST':
                    state['api_stubs'] += 1
                    mode = state['mode']
                    response = {'success': False, 'message': 'Lokal gestubbter API-Fehler.'}
                    if mode == 'accepted':
                        response = {'success': True, 'verificationRequired': True,
                                    'messageId': 'qa-api-accepted-memory-only'}
                    elif mode == 'invalid_acceptance':
                        response = {'success': True, 'verificationRequired': False,
                                    'messageId': 'qa-invalid-memory-only'}
                    route.fulfill(status=200, content_type='application/json', body=json.dumps(response))
                elif not is_local:
                    state['blocked_external'] += 1
                    route.abort()
                elif req.method != 'GET':
                    state['blocked_mutations'] += 1
                    route.abort()
                elif url.path.startswith('/api/'):
                    route.abort()
                else:
                    route.continue_()

            context.route('**/*', intercept)
            context.route_web_socket('**/*', lambda socket: socket.close())
            page = context.new_page()
            row = {'width': width, 'checks': {}}
            checks = row['checks']
            try:
                page.goto(BASE + '/kontakt/?utm_campaign=person%40example.test&phone=%2B493410000000#private',
                          wait_until='networkidle')
                page.locator('#cookie-decline').wait_for(state='visible')
                checks['zero_ga_without_optin'] = state['ga_script_stubs'] == 0 and state['local_stub_scripts'] == 0
                boxes = page.evaluate("""() => ['cookie-decline', 'cookie-accept'].map(id => {
                  const el = document.getElementById(id), r = el.getBoundingClientRect(), s = getComputedStyle(el);
                  return { width:r.width, height:r.height, background:s.backgroundColor, color:s.color,
                    border:s.border, font:s.font, padding:s.padding, borderRadius:s.borderRadius };
                })""")
                checks['equal_banner_dimensions_styles'] = boxes[0] == boxes[1]
                screenshot = Path(__file__).with_name(f'test_contact_analytics_banner_{width}.png')
                page.screenshot(path=str(screenshot), full_page=False)
                page.evaluate("""() => {
                  const box = document.createElement('div'); box.id='contact-qa-links';
                  box.style='position:relative;z-index:9999;background:white;padding:8px';
                  for (const [id, href] of [['phone','tel:+493410000000'],
                    ['email','mailto:person@example.test?subject=private'],
                    ['whatsapp','https://wa.me/493410000000?text=person%40example.test'],
                    ['external','https://example.test/'], ['evil','https://wa.me.evil.test/123']]) {
                    const a=document.createElement('a');a.href=href;a.dataset.contactQa='true';a.id='contact-qa-'+id;
                    a.innerHTML='<span>'+id+'</span>';a.style='display:inline-block;margin:8px';box.append(a);
                  }
                  document.body.prepend(box);
                  document.querySelector('#contact-qa-phone span').click();
                  window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
                    detail:{form_name:'kontakt',page:'/kontakt/',receipt:'qa-before-consent-memory-only'} }));
                }""")
                checks['zero_events_without_optin'] = page.evaluate('window.__contactQaEvents.length') == 0
                page.locator('#cookie-accept').click()
                page.wait_for_function('window.__contactQaGaStubLoaded === true', timeout=10000)
                defaults = page.evaluate("""() => window.__contactQaAllCommands.find(c=>c[0]==='config')?.[2]""")
                checks['pii_safe_defaults'] = bool(defaults) and (
                    defaults.get('page_location') == 'https://leipzig-photovoltaik.de/kontakt/'
                    and defaults.get('page_title') == 'Presolaris – Photovoltaik Leipzig'
                    and defaults.get('allow_google_signals') is False
                    and defaults.get('allow_ad_personalization_signals') is False
                    and not any(s in json.dumps(defaults) for s in ('person@', '493410000000', 'utm_', '#private')))
                page.evaluate("""() => {
                  window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
                    detail:{form_name:'kontakt',page:'/kontakt/',receipt:'qa-before-consent-memory-only'} }));
                  for(const id of ['phone','email','whatsapp','external','evil'])
                    document.querySelector('#contact-qa-'+id+' span').click();
                  for(let i=0;i<2;i++) window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
                    detail:{form_name:'kontakt',page:'/kontakt/?email=person@example.test#private',
                      receipt:'qa-after-consent-memory-only',email:'person@example.test',value:999} }));
                }""")
                events = page.evaluate('window.__contactQaEvents')
                checks['nested_links_and_receipt_dedup'] = [event[1] for event in events] == [
                    'click_phone', 'click_email', 'click_whatsapp', 'generate_lead']
                checks['event_payload_allowlist'] = all(
                    set(event[2]) == ({'form_name', 'page'} if event[1] == 'generate_lead' else {'page'})
                    and event[2]['page'] == '/kontakt/' for event in events)
                checks['no_pii_receipt_value_in_events'] = not any(s in json.dumps(events) for s in (
                    'person@', '493410000000', 'receipt', 'revenue', 'currency', 'value', 'utm_'))
                page.evaluate('window.openCookieSettings()')
                checks['preloaded_actual_consent'] = page.locator('#cookie-analytics').is_checked() and page.locator('#cookie-marketing').is_checked()
                page.locator('#cookie-decline-modal').click()
                count_before = page.evaluate('window.__contactQaEvents.length')
                page.evaluate("""() => {document.querySelector('#contact-qa-phone span').click();
                  window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
                    detail:{form_name:'kontakt',page:'/kontakt/',receipt:'qa-denied-memory-only'} }));} """)
                checks['withdrawal_stops_after_onload'] = page.evaluate('window.__contactQaEvents.length') == count_before and page.evaluate("window['ga-disable-G-08NXYDBB4F']") is True
                page.evaluate('window.openCookieSettings()')
                checks['preloaded_actual_denial'] = not page.locator('#cookie-analytics').is_checked() and not page.locator('#cookie-marketing').is_checked()
                page.locator('#cookie-accept-all-modal').click()
                page.evaluate("""() => {document.querySelector('#contact-qa-email span').click();
                  window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
                    detail:{form_name:'kontakt',page:'/kontakt/',receipt:'qa-denied-memory-only'} }));} """)
                checks['re_enable_no_replay_or_duplicate_script'] = (
                    page.evaluate('window.__contactQaEvents.length') == count_before + 1
                    and state['ga_script_stubs'] + state['local_stub_scripts'] == 1
                    and page.evaluate("window['ga-disable-G-08NXYDBB4F']") is False)
                page.evaluate('window.openCookieSettings()')
                page.locator('#cookie-decline-modal').click()
                ga_before_reload = state['ga_script_stubs'] + state['local_stub_scripts']
                page.reload(wait_until='networkidle')
                checks['denied_reload_no_ga'] = state['ga_script_stubs'] + state['local_stub_scripts'] == ga_before_reload and page.evaluate('window.__contactQaEvents.length') == 0

                # Real contact-form handler, only synthetic fields and a fully intercepted API.
                page.evaluate('window.openCookieSettings()')
                page.locator('#cookie-accept-all-modal').click()
                page.locator('#contact-form').wait_for(state='attached')
                page.evaluate("""() => {
                  const form=document.querySelector('#contact-form');
                  for(const input of form.querySelectorAll('input')) {
                    if(input.name==='website') input.value='';
                    else if(input.type==='email') input.value='qa@example.invalid';
                    else if(input.type==='tel') input.value='+493410000000';
                    else if(input.name==='plz') input.value='04109';
                    else if(input.name==='hausnummer') input.value='12';
                    else if(input.type==='checkbox') input.checked=input.required;
                    else if(['text'].includes(input.type)) input.value='QA Vorschau';
                  }
                  for(const el of form.querySelectorAll('textarea')) el.value='Lokale QA, kein Versand.';
                  form.querySelector('[name=form_started_at]').value=String(Date.now()-3000);
                }""")
                form_valid = page.locator('#contact-form').evaluate('form=>form.checkValidity()')
                checks['synthetic_contact_form_valid'] = form_valid
                if not form_valid:
                    row['invalid_field_names'] = page.locator('#contact-form').evaluate('form=>Array.from(form.elements).filter(el=>el.willValidate && !el.validity.valid).map(el=>el.name)')
                    raise AssertionError('Synthetisches Kontaktformular nicht valide')
                for mode in ('error', 'invalid_acceptance', 'accepted'):
                    state['mode'] = mode
                    before = page.evaluate("window.__contactQaEvents.filter(c=>c[1]==='generate_lead').length")
                    page.locator('#contact-form').evaluate("""form=>{
                      form.querySelector('[name=form_started_at]').value=String(Date.now()-3000);
                      form.requestSubmit();} """)
                    page.wait_for_function("document.querySelector('#contact-form')?.dataset.submitState !== 'sending'")
                    after = page.evaluate("window.__contactQaEvents.filter(c=>c[1]==='generate_lead').length")
                    checks['api_' + mode] = after == before + (1 if mode == 'accepted' else 0)
                checks['no_real_mail_or_ga_requests'] = state['blocked_mutations'] == 0
                row['passed'] = bool(checks) and all(checks.values())
                row['request_counters'] = {k: v for k, v in state.items() if k != 'mode'}
                row['screenshot'] = str(screenshot)
            except Exception as error:
                # Do not persist Playwright raw errors: may contain URL or synthetic form values.
                row['error'] = type(error).__name__ + ': Browser-QA fehlgeschlagen; keine Rohdaten gespeichert.'
                row['passed'] = False
                row['request_counters'] = {k: v for k, v in state.items() if k != 'mode'}
            finally:
                context.close()
            rows.append(row)
            print(f"{width}px: {'PASS' if row['passed'] else 'FAIL'}; Checks {sum(checks.values())}/{len(checks)}", flush=True)
        browser.close()
    OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    print('Ergebnis: ' + str(OUT), flush=True)
    if not all(row['passed'] for row in rows):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
