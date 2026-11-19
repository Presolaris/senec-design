#!/usr/bin/env python3
"""Run existing intercepted browser tests on local preview only.

CSP remains strict for preview visitors. Only Playwright debugger contexts bypass CSP,
because wait_for_function string compilation needs eval. Individual suites still
intercept every API write and all external requests; no mail or Google transmission.
"""
from pathlib import Path
from urllib.parse import urlsplit
import os,importlib.util
from playwright.sync_api import Browser
ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4328'
os.environ['QA_BASE_URL']=BASE
if urlsplit(BASE).hostname!='127.0.0.1':raise RuntimeError('Only local isolated preview is permitted')
original_context=Browser.new_context

def local_debug_context(self,*args,**kwargs):
 kwargs['bypass_csp']=True
 return original_context(self,*args,**kwargs)
Browser.new_context=local_debug_context
OUT=ROOT/'.manus/contact-preview-2026-11-19'
SUITES=[
 (ROOT/'.manus/contact-preview-2026-11-19/test_contact_analytics.py',None),
 (ROOT/'qa/test_fixed_site.py',OUT/'fixed-site-regression.json'),
 (ROOT/'qa/test_calculators_fixed.py',OUT/'calculator-fixed-regression.json'),
]
for i,(file,out) in enumerate(SUITES):
 print('Lokale Browser-Abnahme:',file.name,flush=True)
 spec=importlib.util.spec_from_file_location(f'contact_preview_check_{i}',file)
 module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 if out is not None: module.OUT=out
 module.main()
print('Alle lokalen Suites fertig. Besucher-CSP unverändert; keine echten E-Mails oder Analytics-Aufrufe.',flush=True)
