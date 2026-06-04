#!/usr/bin/env python3
"""
Neuindexierung via IndexNow (Bing/Yandex) und Ausgabe der GSC-URLs
für manuelle Indexierungsanfragen in der Google Search Console.
"""
import urllib.request
import json

URLS = [
    "https://leipzig-photovoltaik.de/privat/",
    "https://leipzig-photovoltaik.de/gewerbe/",
    "https://leipzig-photovoltaik.de/service/",
    "https://leipzig-photovoltaik.de/faq/",
    "https://leipzig-photovoltaik.de/kontakt/",
    "https://leipzig-photovoltaik.de/referenzen/",
    "https://leipzig-photovoltaik.de/heizung/",
    "https://leipzig-photovoltaik.de/wallbox/",
    "https://leipzig-photovoltaik.de/stromspeicher/",
    # Bereits optimierte Seiten aus vorherigen Sessions:
    "https://leipzig-photovoltaik.de/",
    "https://leipzig-photovoltaik.de/solaranlage-leipzig/",
]

# IndexNow für Bing (sofortige Benachrichtigung)
INDEXNOW_KEY = "presolaris2026"
INDEXNOW_URL = "https://api.indexnow.org/indexnow"

payload = {
    "host": "leipzig-photovoltaik.de",
    "key": INDEXNOW_KEY,
    "keyLocation": f"https://leipzig-photovoltaik.de/{INDEXNOW_KEY}.txt",
    "urlList": URLS
}

print("=" * 60)
print("NEUINDEXIERUNGS-ANFRAGEN")
print("=" * 60)

# IndexNow Anfrage
try:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        INDEXNOW_URL,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"\n✅ IndexNow (Bing/Yandex): HTTP {resp.status} – {len(URLS)} URLs übermittelt")
except Exception as e:
    print(f"\n⚠️  IndexNow Fehler: {e}")

# Google Search Console – manuelle Anleitung
print("\n" + "=" * 60)
print("GOOGLE SEARCH CONSOLE – Manuelle Indexierungsanfragen")
print("URL: https://search.google.com/search-console/inspect")
print("=" * 60)
for url in URLS:
    print(f"  → {url}")

print(f"\nGesamt: {len(URLS)} URLs zur Neuindexierung bereit")
