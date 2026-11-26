#!/usr/bin/env python3
"""Wallbox-Ausbau prüfen: lokale Builds, kein realer Versand und keine Analytics."""
import hashlib
import json
import os
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
BASELINE = Path(os.environ.get('QA_BASELINE_DIST', '/tmp/pv-wallbox-baseline-dist'))
OUT = ROOT / '.manus/wallbox-2026-11-26'
HOST = os.environ.get('QA_BASE_URL', 'http://127.0.0.1:4321').rstrip('/')
CANONICAL = 'https://leipzig-photovoltaik.de/wallbox/'
ROUTES = ['/wallbox/', '/wallbox-leipzig/', '/standorte/wallbox-leipzig/']
result = {'static': {}, 'browser': [], 'real_posts': 0, 'analytics_requests': 0}


def htmlfile(base, route):
    return base / route.strip('/') / 'index.html'


def normalized_html(content):
    return re.sub(r'/_astro/[^"\s<>]+\.css', '/_astro/STYLES.css', content)


def broken_links(base):
    broken = set()
    for file in base.rglob('*.html'):
        soup = BeautifulSoup(file.read_text(), 'html.parser')
        for tag in soup.select('a[href]'):
            href = tag['href']
            url = urlsplit(href)
            if url.scheme or url.netloc or not url.path.startswith('/') or url.path.startswith('/api/'):
                continue
            target = base / unquote(url.path).lstrip('/')
            if target.is_dir():
                target = target / 'index.html'
            if not target.exists():
                broken.add((str(file.relative_to(base)), url.path))
    return broken


for route in ROUTES:
    soup = BeautifulSoup(htmlfile(DIST, route).read_text(), 'html.parser')
    assert len(soup.select('main h1')) == 1
    assert soup.select_one('link[rel=canonical]')['href'] == CANONICAL
    assert soup.select_one('meta[property="og:url"]')['content'] == CANONICAL
    schemas = [json.loads(tag.get_text()) for tag in soup.select('script[type="application/ld+json"]')]
    by_type = {item['@type']: item for item in schemas}
    assert set(by_type) == {'LocalBusiness', 'Service', 'FAQPage', 'BreadcrumbList'}
    business = by_type['LocalBusiness']
    assert business['address']['streetAddress'] == 'An der Hebemärchte 1'
    assert business['address']['postalCode'] == '04316'
    assert business['telephone'] == '+49-341-98990391'
    assert by_type['Service']['provider']['@id'] == business['@id']
    assert by_type['Service']['url'] == CANONICAL
    assert 'offers' not in by_type['Service']
    details = soup.select('main #faq details')
    faqs = by_type['FAQPage']['mainEntity']
    assert len(details) == len(faqs) == 10
    for detail, faq in zip(details, faqs):
        assert detail.summary.get_text(' ', strip=True) == faq['name']
        assert detail.p.get_text(' ', strip=True) == faq['acceptedAnswer']['text']
    main = soup.main.get_text(' ', strip=True)
    for phrase in ['KfW-Förderung bis', 'ab 1.200', '8-10 Cent', '100% CO', '1.500€', 'Installation in 1-2 Tagen']:
        assert phrase not in main, phrase
    for tag in soup.select('main img[src]'):
        assert (DIST / tag['src'].lstrip('/')).exists()
    result['static'][route] = 'passed'

sitemap = ''.join(p.read_text() for p in DIST.glob('sitemap*.xml'))
assert CANONICAL in sitemap
assert 'https://leipzig-photovoltaik.de/wallbox-leipzig/' not in sitemap
assert 'https://leipzig-photovoltaik.de/standorte/wallbox-leipzig/' not in sitemap
result['static']['sitemap_wallbox_single_target'] = 'passed'
new_broken = broken_links(DIST) - broken_links(BASELINE)
assert not new_broken, sorted(new_broken)
result['static']['new_broken_internal_links'] = len(new_broken)
untouched = 0
for file in BASELINE.rglob('*.html'):
    relative = file.relative_to(BASELINE)
    route = '/' + str(relative.parent) + '/'
    if route in ROUTES or route == '/standorte/':
        continue
    updated = DIST / relative
    assert updated.exists(), relative
    assert normalized_html(file.read_text()) == normalized_html(updated.read_text()), str(relative)
    untouched += 1
result['static']['unchanged_other_html_files'] = untouched
js_old = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (BASELINE / '_astro').glob('*.js')}
js_new = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (DIST / '_astro').glob('*.js')}
assert js_old == js_new, 'Client-JavaScript changed'
result['static']['client_js_byte_identical'] = True
result['static']['css_bytes_before'] = sum(p.stat().st_size for p in (BASELINE / '_astro').glob('*.css'))
result['static']['css_bytes_after'] = sum(p.stat().st_size for p in (DIST / '_astro').glob('*.css'))
result['static']['html_count_before'] = len(list(BASELINE.rglob('*.html')))
result['static']['html_count_after'] = len(list(DIST.rglob('*.html')))

with sync_playwright() as p:
    for engine in ['chromium', 'webkit']:
        options = {'headless': True}
        if engine == 'chromium':
            options.update(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        browser = getattr(p, engine).launch(**options)
        for width in [1365, 390]:
            for route in ROUTES:
                row = {'engine': engine, 'width': width, 'route': route, 'checks': {}}
                ctx = browser.new_context(viewport={'width': width, 'height': 900}, locale='de-DE')
                ctx.add_cookies([{'name': 'cookie-consent', 'value': json.dumps({'necessary': True, 'analytics': False, 'marketing': False}), 'url': HOST}])
                ctx.add_init_script("sessionStorage.setItem('exitIntentShown','true')")
                blocked = []
                def intercept(r):
                    if r.request.method not in ['GET', 'HEAD'] or not r.request.url.startswith(HOST + '/'):
                        blocked.append(r.request.url)
                        r.abort()
                    else:
                        r.continue_()
                ctx.route('**/*', intercept)
                page = ctx.new_page()
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                response = page.goto(HOST + route, wait_until='networkidle')
                assert response.status == 200
                assert page.locator('main h1').count() == 1
                assert page.locator('main h1').is_visible()
                row['checks']['heading_visible'] = True
                assert page.locator('main img').first.evaluate('el => el.complete && el.naturalWidth > 0')
                row['checks']['hero_loaded'] = True
                assert page.locator('link[rel=canonical]').get_attribute('href') == CANONICAL
                row['checks']['canonical'] = True
                assert page.locator('main a[href="/kontakt/"]').count() >= 2
                assert page.locator('main a[href="tel:+4934198990391"]').count() == 2
                row['checks']['contact_routes'] = True
                overflow = page.locator('main').evaluate('(el) => [...el.querySelectorAll("h1,h2,h3,p,summary,a,article,li,img")].filter(x => { const r=x.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1); }).map(x => x.tagName)')
                assert not overflow, overflow
                row['checks']['no_horizontal_overflow'] = True
                summary = page.locator('#faq summary').first
                summary.focus()
                summary.press('Enter')
                assert page.locator('#faq details').first.get_attribute('open') is not None
                row['checks']['faq_keyboard'] = True
                assert not errors, errors
                row['checks']['no_javascript_errors'] = True
                assert not blocked, blocked
                row['checks']['no_external_or_write_requests'] = True
                if engine == 'chromium' and route == '/wallbox/':
                    page.evaluate('window.scrollTo({top:0, behavior:"instant"})')
                    page.screenshot(path=str(OUT / f'wallbox-{width}.png'))
                result['browser'].append(row)
                print(f'PASS {engine} {width}px {route}', flush=True)
                ctx.close()
        browser.close()
OUT.mkdir(exist_ok=True, parents=True)
(OUT / 'qa-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result['static'], ensure_ascii=False, indent=2))
