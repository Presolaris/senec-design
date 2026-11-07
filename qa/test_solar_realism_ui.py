#!/usr/bin/env python3
"""Lokale Rechner-Abnahme. Keine externen Requests oder echte Formular-POSTs."""
import json
import os
import re
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_safety import install_network_guard, local_base_url, output_path

HOST=local_base_url(os.environ.get('QA_BASE_URL','http://127.0.0.1:4321'))

def set_slider(page, label, target):
    slider=page.locator(f'[aria-label="{label}"]').get_by_role('slider')
    slider.focus()
    value=float(slider.get_attribute('aria-valuenow'))
    slider.press('ArrowRight' if target>value else 'ArrowLeft') if target!=value else None
    value=float(slider.get_attribute('aria-valuenow'))
    step=0.5 if 'Kilowatt-Peak' in label else 2.5 if 'Speichergröße' in label else 100 if 'Jahresverbrauch' in label else 1
    for _ in range(round(abs(target-value)/step)):
        slider.press('ArrowRight' if target>value else 'ArrowLeft')
    assert float(slider.get_attribute('aria-valuenow'))==target

def main():
    rows=[]
    with sync_playwright() as p:
        exe=os.environ.get('QA_CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path)
        browser=p.chromium.launch(executable_path=exe,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for width in (1365,390):
            context=browser.new_context(viewport={'width':width,'height':900},accept_downloads=True,service_workers='block')
            context.add_init_script("sessionStorage.setItem('exitIntentShown','true')")
            network=install_network_guard(context,HOST)
            page=context.new_page(); errors=[]
            page.on('pageerror',lambda err:errors.append(str(err)))
            page.goto(HOST+'/',wait_until='domcontentloaded')
            page.locator('#rechner').scroll_into_view_if_needed()
            page.wait_for_function('!document.querySelector("astro-island[component-url*=SolarCalculator]")?.hasAttribute("ssr")',timeout=25000)
            set_slider(page,'Anlagengröße in Kilowatt-Peak',11)
            set_slider(page,'Speichergröße in Kilowattstunden',10)
            set_slider(page,'Aktueller Strompreis in Cent pro Kilowattstunde',37)
            page.wait_for_timeout(300)
            root=page.locator('#rechner'); seasonal=root.get_by_test_id('solar-seasonal-balance')
            text=root.inner_text()
            checks={'screenshot_inputs':all(x in text for x in ['11 kWp','4000 kWh','10 kWh','37 ct/kWh']),
                    'annual_not_false_100':not bool(re.search(r'(?<![\d,.])100%\s*Autarkie im Jahr',text)),
                    'winter_visible':'Netzbezug' in seasonal.inner_text() and 'Oktober–März' in seasonal.inner_text(),
                    'no_roi_promise':'ROI:' not in text}
            seasonal.locator('summary').click()
            checks['twelve_months']=seasonal.locator('tbody tr').count()==12
            checks['assumptions_visible']=all(x in seasonal.inner_text() for x in ['PVGIS','95 %','90 %','keine Messdaten']) if 'keine Messdaten' in seasonal.inner_text() else all(x in seasonal.inner_text() for x in ['PVGIS','95 %','90 %','nicht an Ihrem Dach gemessen'])
            january=seasonal.locator('tbody tr').first.inner_text()
            numbers=seasonal.locator('tbody tr').first.locator('td').all_inner_texts()
            checks['january_grid_positive']=int(numbers[2].replace('.',''))>0
            checks['no_body_horizontal_overflow']=page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
            with page.expect_download(timeout=20000) as d:root.get_by_role('button',name='PDF speichern').click()
            pdf=Path(d.value.path()); saved=output_path(f'solar-realism-{width}.pdf');saved.write_bytes(pdf.read_bytes())
            extracted=subprocess.check_output(['pdftotext',str(saved),'-'],text=True)
            checks['pdf_physical_and_winter']=saved.read_bytes().startswith(b'%PDF') and all(x in extracted for x in ['Winter','Netzbezug','Monatsbilanz','PVGIS'])
            checks['pdf_two_pages']=subprocess.check_output(['pdfinfo',str(saved)],text=True).find('Pages:           2')>=0
            baseline=seasonal.inner_text()
            root.get_by_role('switch',name='Wärmepumpe aktivieren').click();page.wait_for_timeout(200)
            checks['heatpump_seasonal_change']=seasonal.inner_text()!=baseline and '7.000 kWh/Jahr' in root.inner_text()
            root.get_by_role('switch',name='E-Auto aktivieren').click();page.wait_for_timeout(200)
            checks['ev_consumption_added']='9.000 kWh/Jahr' in root.inner_text()
            before=seasonal.inner_text();root.get_by_role('button',name='Tagsüber',exact=True).click();page.wait_for_timeout(200)
            checks['ev_time_changes_balance']=before!=seasonal.inner_text()
            root.get_by_role('switch',name='Stromspeicher aktivieren').click();page.wait_for_timeout(200)
            checks['storage_off_zero']=root.get_by_text('Gespeichert',exact=True).first.locator('..').inner_text().startswith('0 kWh/Jahr')
            checks['no_browser_errors']=len(errors)==0
            checks['no_unplanned_non_get']=network['blocked_non_get']==0
            rows.append({'width':width,'checks':checks,'january_text':january,'passed':all(checks.values())})
            print(width,'OK' if rows[-1]['passed'] else 'FAIL',checks,flush=True)
            context.close()
        browser.close()
    out=output_path('solar-realism-ui.json');out.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    print('Report:',out,'; echte POSTs: 0')
    if not all(x['passed'] for x in rows):raise SystemExit(1)

if __name__=='__main__':main()
