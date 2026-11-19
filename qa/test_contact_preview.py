#!/usr/bin/env python3
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json,re,os
ROOT=Path(__file__).resolve().parents[1]
HOST='http://127.0.0.1:4328'
OUT=ROOT/'.manus/contact-preview-2026-11-19'
results=[]
def record(name,passed,details=''):
 results.append({'test':name,'passed':bool(passed),'details':details})
 if not passed: raise AssertionError(name+': '+str(details))

html_files=list((ROOT/'dist').rglob('index.html'))
phones=0; footers=0
for file in html_files:
 soup=BeautifulSoup(file.read_text(),'html.parser')
 for a in soup.select('a[href^="tel:"]'):
  phones+=1
  record('tel:'+str(file.relative_to(ROOT/'dist')),a['href']=='tel:+4934198990391',a['href'])
 for footer in soup.find_all('footer'):
  footers+=1; hrefs=[a.get('href','') for a in footer.find_all('a')]
  record('Footer:'+str(file.relative_to(ROOT/'dist')),
   all(u in hrefs for u in ['https://wa.me/4934198990391','https://x.com/pv_leipzig','https://presolaris.de/','https://photovoltaik-anlagen-wartung.de/'])
   and 'Unsere Fachseiten' in footer.get_text())
record('Alle öffentlichen Dateien statisch geprüft',len(html_files)>=60,{'html_pages':len(html_files),'telephone_anchors':phones,'footers':footers})
for route in ['/kontakt/','/datenschutz/','/llms.txt']:
 with urlopen(HOST+route) as res:
  data=res.read().decode();record('HTTP '+route,res.status==200 and res.headers.get('X-Robots-Tag')=='noindex, nofollow, noarchive')
  if route=='/llms.txt':record('llms Kontakt und Leistung',all(s in data for s in ['Photovoltaik','Leipzig','0341 98990391','kontakt@leipzig-photovoltaik.de']))
  if route=='/datenschutz/':record('Datenschutzhinweise',all(s in data for s in ['Per WhatsApp','utm_source','Google Analytics und Kontakt-Ereignisse','sessionStorage']))
try:
 urlopen(Request(HOST+'/api/lead/',data=b'preview-only',method='POST'))
 record('Preview kein realer Versand',False)
except HTTPError as e:
 body=json.loads(e.read());record('Preview kein realer Versand',e.code==409 and body['success'] is False and 'keine Anfrage gespeichert' in body['message'])

with sync_playwright() as p:
 executable=os.environ.get('QA_CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path)
 browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(390,844),(1365,900)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1)
  external=[]
  def route(req):
   if not req.request.url.startswith(HOST):external.append(req.request.url);req.abort();return
   req.continue_()
  ctx.route('**/*',route)
  page=ctx.new_page();page.goto(HOST+'/kontakt/',wait_until='networkidle');
  page.locator('footer').scroll_into_view_if_needed();page.wait_for_timeout(250)
  record('Mobiler Footer ohne Seitenüberlauf '+str(width),page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
  record('WhatsApp in Kontakt und Footer '+str(width),page.locator('a[href="https://wa.me/4934198990391"]').count()>=2)
  record('Sichtbarer Vorschauhinweis '+str(width),page.locator('#preview-notice').count()==1)
  record('Kein GA vor Opt-in '+str(width),len(page.evaluate('window.__previewAnalyticsCommands'))==0 and not any('googletagmanager' in u or 'google-analytics' in u for u in external))
  page.screenshot(path=str(OUT/f'vorschau-kontakt-footer-{width}.png'),full_page=False)
  ctx.close()
 browser.close()
(OUT/'preview-ui-validation.json').write_text(json.dumps({'status':'passed','results':results,'outbound_emails':0,'outbound_analytics':0},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'passed_checks':len(results),'failed':0,'html_pages':len(html_files),'tel_anchors':phones,'footer_instances':footers,'desktop_and_mobile':True,'real_emails':0,'real_analytics':0},ensure_ascii=False))
