#!/usr/bin/env python3
"""Audit HEAD baseline and preview sources; no network or customer data."""
from pathlib import Path
import subprocess, re, json, html, hashlib, collections
from bs4 import BeautifulSoup
ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
BASE = 'fdd3d2ad2107023ecd7be6eb0b21a9dbf0f1d402'
PATTERNS = {
    'Gründung / Fachbetrieb seit 2002': r'Fachbetrieb\s+seit\s+2002|seit\s+2002|foundingDate[^\n]*?2002',
    '25+ Jahre': r'25\s*\+\s*Jahre',
    '2.400 Anlagen': r'2[.\s]?400',
    'Leistungsgarantie': r'Leistungsgarantie',
    'Kostenlos / kostenloses Angebot': r'kostenlos\w*',
    'SAB-Förderhinweis': r'\bSAB\b',
    'Festpreis-Garantie': r'Festpreis[\s-]?Garantie',
}
FILES = subprocess.check_output(['git','ls-tree','-r','--name-only',BASE,'src'], cwd=ROOT, text=True).splitlines()
FILES = [f for f in FILES if Path(f).suffix in {'.astro','.tsx','.ts'}]

def original(f):
    return subprocess.check_output(['git','show',f'{BASE}:{f}'],cwd=ROOT,text=True)

def visible_line(line):
    text = BeautifulSoup(line, 'html.parser').get_text(' ',strip=True)
    text = re.sub(r'\s+',' ',html.unescape(text)).strip()
    return text or line.strip()

entries=[]; changes=[]; protected_diffs=[]
for f in FILES:
    old=original(f); new=(ROOT/f).read_text()
    for label,patt in PATTERNS.items():
        before=re.findall(patt,old,re.I); after=re.findall(patt,new,re.I)
        if collections.Counter(before)!=collections.Counter(after):
            protected_diffs.append({'file':f,'label':label,'before':before,'after':after})
        for n,line in enumerate(old.splitlines(),1):
            if re.search(patt,line,re.I):
                entries.append({'category':label,'file':f,'baseline_line':n,'wording':visible_line(line),
                                'source_line':line.strip(), 'matches':re.findall(patt,line,re.I)})
    if old != new:
        # Full public-source diff retained locally; user-facing text is HTML text only.
        a=BeautifulSoup(re.sub(r'<script\b[^>]*>.*?</script>','',old,flags=re.S|re.I),'html.parser')
        b=BeautifulSoup(re.sub(r'<script\b[^>]*>.*?</script>','',new,flags=re.S|re.I),'html.parser')
        for s in (a,b):
            for el in s(['style']):el.decompose()
        ta=[x.strip() for x in a.stripped_strings if x.strip()]
        tb=[x.strip() for x in b.stripped_strings if x.strip()]
        import difflib
        for tag,i,j,k,l in difflib.SequenceMatcher(a=ta,b=tb,autojunk=False).get_opcodes():
            if tag!='equal': changes.append({'file':f,'before':ta[i:j], 'after':tb[k:l]})
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'geschuetzte-aussagen.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
(OUT/'textaenderungen.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2)+'\n')
(OUT/'claims-validation.json').write_text(json.dumps({'protected_matches_changed':protected_diffs,'entries':len(entries)},ensure_ascii=False,indent=2)+'\n')
lines=['# Geschützte Aussagen – vollständige Fundstellen','',
       'Wortlaut aus dem unveränderten Remote-Basisstand. Zeilennummern beziehen sich auf diesen Stand; wiederverwendete Komponenten gelten auf allen Seiten, die sie einbinden. Auch Metadaten, strukturierte Daten und im Code hinterlegte Texte sind enthalten. Bestehende Aussagen werden dokumentiert, nicht neu bestätigt oder erweitert.','']
for label in PATTERNS:
    rows=[e for e in entries if e['category']==label]
    lines.extend([f'## {label}', ''])
    if not rows:lines += ['Im Basis-Quellbestand kein Treffer für diese exakte Formulierung.','']
    for e in rows:
        lines.extend([f"**{e['file']}:{e['baseline_line']}**",'',f"> {e['wording']}",''])
(OUT/'Geschuetzte-Aussagen-Fundstellen.md').write_text('\n'.join(lines).rstrip()+'\n')
print(json.dumps({'baseline_files':len(FILES),'claim_occurrences':len(entries),'changed_protected_matches':len(protected_diffs),'text_change_blocks':len(changes)},ensure_ascii=False))
if protected_diffs:
    print(json.dumps(protected_diffs,ensure_ascii=False,indent=2))
    raise SystemExit(1)
