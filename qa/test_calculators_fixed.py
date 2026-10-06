#!/usr/bin/env python3
"""Lokale Desktop-/Mobilprüfung beider Rechner; alle POSTs blockiert."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

HOST=os.environ.get('QA_BASE_URL','http://127.0.0.1:4321').rstrip('/')
OUT=Path(__file__).with_name('calculator-fixed-regression.json')


def main():
    rows=[]
    with sync_playwright() as p:
        executable = os.environ.get('QA_CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path)
        browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for width in (1365,390):
            context=browser.new_context(viewport={'width':width,'height':844 if width==390 else 900},accept_downloads=True)
            context.add_init_script("sessionStorage.setItem('exitIntentShown','true')")
            def intercept(route):
                req=route.request
                if req.method!='GET': route.abort()
                elif req.url.startswith(HOST) and req.resource_type not in ('image','font','media'):route.continue_()
                else:route.abort()
            context.route('**/*',intercept)
            page=context.new_page();r={'type':'solar','width':width,'checks':{}}
            try:
                page.goto(HOST+'/',wait_until='domcontentloaded')
                page.locator('#rechner').scroll_into_view_if_needed()
                page.wait_for_function('!document.querySelector("astro-island[component-url*=SolarCalculator]")?.hasAttribute("ssr")',timeout=20000)
                sliders=page.get_by_role('slider')
                sliders.nth(2).wait_for(timeout=10000)
                before=page.locator('#rechner').inner_text()
                sliders.first.focus();sliders.first.press('End')
                page.wait_for_timeout(450)
                r['checks']['slider_modifies_results']=before!=page.locator('#rechner').inner_text() and '25 kWp' in page.locator('#rechner').inner_text()
                page.get_by_role('switch',name='Stromspeicher aktivieren').click()
                page.wait_for_timeout(300)
                stored=page.get_by_text('Gespeichert',exact=True).first.locator('..').inner_text()
                r['checks']['storage_off_is_zero']=stored.split(' kWh',1)[0].strip()=='0'
                with page.expect_download(timeout=15000) as download:
                    page.get_by_role('button',name='PDF speichern').click()
                pdf=Path(download.value.path()).read_bytes()
                r['checks']['pdf_valid']=pdf.startswith(b'%PDF-') and len(pdf)>1000
                r['checks']['no_false_address_analysis']=page.get_by_text('Jetzt prüfen',exact=True).count()==0
            except Exception as exc:r['error']=f'{type(exc).__name__}: {str(exc)[:200]}'
            rows.append(r)
            page.close()
            page=context.new_page();r={'type':'gewerbe','width':width,'checks':{}}
            try:
                page.goto(HOST+'/gewerbe-photovoltaik-leipzig/',wait_until='domcontentloaded')
                page.locator('#rechner').scroll_into_view_if_needed()
                page.locator('#calculator-summary').wait_for(state='attached')
                page.wait_for_function('document.querySelector("#result-jahresertrag")?.textContent?.includes("95.000")',timeout=10000)
                r['checks']['baseline_yield']=page.locator('#result-jahresertrag').inner_text()=='95.000 kWh'
                r['checks']['baseline_saving']=page.locator('#result-ersparnis').inner_text()=='18.240 €'
                slider=page.locator('#dachflaeche')
                slider.evaluate("el=>{el.value=el.min;el.dispatchEvent(new Event('input',{bubbles:true}))}")
                r['checks']['min_yield']=page.locator('#result-jahresertrag').inner_text()=='19.000 kWh'
                slider.evaluate("el=>{el.value=el.max;el.dispatchEvent(new Event('input',{bubbles:true}))}")
                r['checks']['max_yield']=page.locator('#result-jahresertrag').inner_text()=='96.900 kWh'
                r['checks']['summary_transferred']='Jahresertrag: 96900 kWh' in page.locator('#calculator-summary').get_attribute('value') or 'Jahresertrag: 96900 kWh' in page.locator('#calculator-summary').input_value()
            except Exception as exc:r['error']=f'{type(exc).__name__}: {str(exc)[:200]}'
            rows.append(r)
            page.close();context.close()
        browser.close()
    for r in rows:
        r['passed']=bool(r['checks']) and all(r['checks'].values()) and 'error' not in r
        print(r['width'],r['type'],'OK' if r['passed'] else f"FEHLER {r.get('error',r['checks'])}",flush=True)
    OUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    count=sum(r['passed'] for r in rows)
    print(f'Bestanden {count}/{len(rows)}, echte POSTs 0. Details: {OUT}',flush=True)
    if count!=len(rows):raise SystemExit(1)

if __name__=='__main__':main()
