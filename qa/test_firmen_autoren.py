#!/usr/bin/env python3
"""Read-only validation of rendered corporate/article JSON-LD and scope guards."""
from pathlib import Path
import collections
import json
import re
import subprocess
import sys
from urllib.parse import urlsplit, unquote
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.manus/firmen-autoren-2026-11-20'
BASE = 'c3bb8b1d93c0b2565fdb15c560efc797a6a422bc'
COMPANY = 'Presolaris UG (haftungsbeschränkt)'
ADDRESS = {'streetAddress': 'An der Hebemärchte 1', 'postalCode': '04316', 'addressLocality': 'Leipzig'}
ALLOWED_SOURCE = {'src/components/LocalBusinessSchema.astro', 'src/pages/index.astro', 'src/pages/solaranlage-leipzig.astro', 'src/pages/ueber-uns.astro', 'src/pages/blog.astro'}
ALLOWED_SOURCE.update(str(p.relative_to(ROOT)) for d in ['src/pages/standorte', 'src/pages/blog'] for p in (ROOT/d).glob('*.astro'))
errors = []
notes = []
EXPECTED_HEADING_PAIRS = {
    'src/pages/ueber-uns.astro': ('Unsere Standorte', 'Unser Standort und Einsatzgebiete'),
    'src/pages/standorte/borna.astro': ('Photovoltaik Borna – Ihr Fachbetrieb im Landkreis Leipzig', 'Photovoltaik Borna – Betreuung vom Standort Leipzig'),
    'src/pages/standorte/grimma.astro': ('Photovoltaik Grimma – Ihr Fachbetrieb im Muldental', 'Photovoltaik Grimma – Betreuung vom Standort Leipzig'),
    'src/pages/standorte/saalekreis.astro': ('Weitere Standorte im Saalekreis', 'Weitere Einsatzgebiete im Saalekreis'),
}
EXPECTED_HEADING_PAIRS.update({'src/pages/standorte/'+place+'.astro': ('Lokaler Fachbetrieb', 'Betreuung vom Standort Leipzig') for place in ['burgenlandkreis', 'elbe-elster', 'erfurt', 'gera', 'magdeburg']})
EXPECTED_HEADING_PAIRS.update({'src/pages/standorte/'+place+'.astro': ('Alle Standorte', 'Alle Einsatzgebiete') for place in ['naumburg', 'weissenfels', 'zeitz']})
approved = json.loads((OUT/'approved-exceptions.json').read_text())
approved_headings = approved['heading_changes']
assert len(approved_headings) == 12
assert {x['file']: (x['visible_before'], x['visible_after']) for x in approved_headings} == EXPECTED_HEADING_PAIRS
for entry in approved_headings:
    assert BeautifulSoup(entry['before'], 'html.parser').get_text(' ', strip=True) == entry['visible_before']
    assert BeautifulSoup(entry['after'], 'html.parser').get_text(' ', strip=True) == entry['visible_after']


def baseline(name):
    return subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT, text=True)


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


source_files = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASE, 'src', 'api', 'public', 'astro.config.mjs', 'package.json', 'package-lock.json', 'vercel.json', '.github'], cwd=ROOT, text=True).splitlines()
changed = []
for name in source_files:
    path = ROOT/name
    old_bytes = subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT)
    if not path.exists() or path.read_bytes() != old_bytes:
        changed.append(name)
        if name not in ALLOWED_SOURCE:
            errors.append(f'Unapproved runtime/config change: {name}')
    if path.suffix == '.astro' and path.exists():
        old = old_bytes.decode()
        new = path.read_text()
        for pattern, label in [(r'<h[1-6]\b[^>]*>.*?</h[1-6]>', 'headings'), (r'<Layout\s+[^>]*\btitle\s*=\s*(?:\{[^}]+\}|"[^"]*")', 'layout title'), (r'(?:const\s+pageTitle|const\s+title)\s*=\s*[^;\n]+', 'title variables')]:
            expected_old = old
            if label == 'headings':
                for entry in approved_headings:
                    if entry['file'] == name:
                        assert expected_old.count(entry['before']) == 1
                        expected_old = expected_old.replace(entry['before'], entry['after'], 1)
            if re.findall(pattern, expected_old, re.S) != re.findall(pattern, new, re.S):
                errors.append(f'Protected {label} changed: {name}')

rendered = sorted((ROOT/'dist').rglob('*.html'))
page_summaries = []
internal_broken = []
for path in rendered:
    soup = BeautifulSoup(path.read_text(), 'html.parser')
    relative = path.relative_to(ROOT/'dist')
    page = '/' if str(relative) == 'index.html' else '/' + str(relative).removesuffix('index.html')
    schemas = []
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            schemas.extend(nodes(json.loads(script.string or script.get_text())))
        except Exception as exc:
            errors.append(f'Invalid JSON-LD: {page}: {type(exc).__name__}')
    businesses = [n for n in schemas if n.get('@type') in ['LocalBusiness', 'Organization'] and ('address' in n or n.get('@type') == 'LocalBusiness')]
    for business in businesses:
        if business.get('name') != COMPANY:
            errors.append(f'Inconsistent business name: {page}: {business.get("name")}')
        if business.get('alternateName') != 'Leipzig Photovoltaik':
            errors.append(f'Missing business alternateName: {page}')
        address = business.get('address', {})
        if not isinstance(address, dict) or any(str(address.get(k)) != v for k, v in ADDRESS.items()):
            errors.append(f'Inconsistent business address: {page}')
        phone = re.sub(r'[^0-9+]', '', str(business.get('telephone', '')))
        if phone not in {'034198990391', '+4934198990391', '4934198990391'}:
            errors.append(f'Unexpected business phone: {page}')
    articles = [n for n in schemas if n.get('@type') in ['Article', 'BlogPosting']]
    for article in articles:
        author = article.get('author')
        if author != {'@type': 'Organization', 'name': COMPANY}:
            errors.append(f'Unexpected article author: {page}')
        if 'Markus Schmidt' in json.dumps(article, ensure_ascii=False) or '15 Jahre Erfahrung' in json.dumps(article, ensure_ascii=False):
            errors.append(f'Legacy article author biography: {page}')
        if page == '/blog/wartungstipps-winter/' and (article.get('headline') == '{pageTitle}' or article.get('description') == 'Blog Article'):
            errors.append(f'Unresolved winter placeholders: {page}')
        elif article.get('headline') == '{pageTitle}':
            notes.append(f'Pre-existing headline placeholder outside explicitly named winter article: {page}')
    if page.startswith('/blog/'):
        if 'Presolaris-Team' not in soup.get_text(' ', strip=True):
            errors.append(f'Missing visible team author: {page}')
        if not articles:
            notes.append(f'No pre-existing Article schema: {page}')
    if page.startswith('/standorte/') and businesses and not any(b.get('areaServed') for b in businesses):
        errors.append(f'Missing service area: {page}')
    websites = [n for n in schemas if n.get('@type') == 'WebSite']
    if page == '/':
        if len(websites) == 0:
            notes.append('WebSite schema awaits canonical-URL owner clarification; not ready for publication.')
        elif len(websites) != 1:
            errors.append('Homepage has competing WebSite schemas')
        else:
            site = websites[0]
            canonical = soup.select_one('link[rel="canonical"]')
            canonical_url = canonical.get('href') if canonical else None
            if site.get('name') != 'Leipzig Photovoltaik' or site.get('alternateName') != 'leipzig-photovoltaik.de':
                errors.append('Incorrect WebSite name/alternateName')
            if site.get('url') != canonical_url:
                errors.append('WebSite URL differs from actual canonical homepage')
    for a in soup.select('a[href]'):
        href = a.get('href', '')
        parsed = urlsplit(href)
        if not parsed.path.startswith('/') or parsed.netloc or parsed.path.startswith('/api/'):
            continue
        candidate = ROOT/'dist'/unquote(parsed.path).lstrip('/')
        if not candidate.is_file() and not (candidate/'index.html').is_file():
            internal_broken.append({'page': page, 'target': parsed.path})
    if businesses or articles or websites:
        page_summaries.append({'page': page, 'businesses': len(businesses), 'articles': len(articles), 'websites': len(websites)})

# Compare known link issues with unchanged baseline source targets instead of
# pretending that pre-existing issues were introduced by this scoped change.
old_targets = set()
for name in source_files:
    if name.endswith('.astro'):
        old_targets.update(re.findall(r'href=["\'](/[^"\']*)["\']', baseline(name)))
introduced_broken = [x for x in internal_broken if x['target'] not in old_targets]
for item in introduced_broken:
    errors.append(f'New broken internal target: {item["page"]} -> {item["target"]}')
OUT.mkdir(parents=True, exist_ok=True)
result = {'baseline': BASE, 'source_changes': changed, 'html_pages': len(rendered), 'schema_pages': page_summaries, 'errors': errors, 'notes': sorted(set(notes)), 'internal_link_issues_existing': internal_broken, 'introduced_broken_links': introduced_broken, 'real_post_requests': 0, 'publication_ready': not errors and not any('awaits' in n for n in notes)}
(OUT/'schema-scope-validation.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'html_pages': len(rendered), 'source_changes': len(changed), 'errors': errors, 'notes': sorted(set(notes)), 'introduced_broken_links': introduced_broken}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
