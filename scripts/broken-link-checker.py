#!/usr/bin/env python3
"""
Broken Link Checker für Leipzig Photovoltaik Website
Crawlt alle Seiten und prüft interne sowie externe Links
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
from datetime import datetime
import time
import sys

# Konfiguration
BASE_URL = "https://senec-design.vercel.app"
TIMEOUT = 10
MAX_RETRIES = 2

# Ergebnisse speichern
results = {
    "timestamp": datetime.now().isoformat(),
    "base_url": BASE_URL,
    "pages_checked": 0,
    "total_links": 0,
    "broken_links": [],
    "working_links": [],
    "external_links": [],
    "redirects": [],
    "errors": []
}

# Bereits besuchte URLs
visited_pages = set()
visited_links = set()

def normalize_url(url):
    """URL normalisieren (trailing slash entfernen)"""
    parsed = urlparse(url)
    path = parsed.path.rstrip('/')
    if not path:
        path = '/'
    return f"{parsed.scheme}://{parsed.netloc}{path}"

def is_internal_link(url):
    """Prüfen ob Link intern ist"""
    parsed = urlparse(url)
    base_parsed = urlparse(BASE_URL)
    return parsed.netloc == base_parsed.netloc or parsed.netloc == ''

def check_link(url, source_page):
    """Einzelnen Link prüfen"""
    if url in visited_links:
        return None
    
    visited_links.add(url)
    
    # Spezielle URLs überspringen
    if url.startswith(('mailto:', 'tel:', 'javascript:', '#', 'data:')):
        return None
    
    try:
        response = requests.head(url, timeout=TIMEOUT, allow_redirects=True)
        status = response.status_code
        
        link_info = {
            "url": url,
            "source_page": source_page,
            "status_code": status,
            "is_internal": is_internal_link(url)
        }
        
        if status >= 400:
            results["broken_links"].append(link_info)
            print(f"  ❌ BROKEN [{status}]: {url}")
            return "broken"
        elif status >= 300:
            link_info["redirect_to"] = response.url
            results["redirects"].append(link_info)
            print(f"  ↪️ REDIRECT [{status}]: {url} → {response.url}")
            return "redirect"
        else:
            results["working_links"].append(link_info)
            return "ok"
            
    except requests.exceptions.Timeout:
        results["errors"].append({
            "url": url,
            "source_page": source_page,
            "error": "Timeout"
        })
        print(f"  ⏱️ TIMEOUT: {url}")
        return "error"
    except requests.exceptions.RequestException as e:
        results["errors"].append({
            "url": url,
            "source_page": source_page,
            "error": str(e)
        })
        print(f"  ⚠️ ERROR: {url} - {str(e)[:50]}")
        return "error"

def crawl_page(url):
    """Seite crawlen und alle Links extrahieren"""
    normalized = normalize_url(url)
    
    if normalized in visited_pages:
        return
    
    visited_pages.add(normalized)
    results["pages_checked"] += 1
    
    print(f"\n📄 Crawling: {url}")
    
    try:
        response = requests.get(url, timeout=TIMEOUT)
        if response.status_code != 200:
            print(f"  ⚠️ Seite nicht erreichbar: {response.status_code}")
            return
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Alle Links finden
        links = []
        for tag in soup.find_all(['a', 'link', 'img', 'script']):
            href = tag.get('href') or tag.get('src')
            if href:
                full_url = urljoin(url, href)
                links.append(full_url)
        
        print(f"  📊 {len(links)} Links gefunden")
        results["total_links"] += len(links)
        
        # Links prüfen
        internal_pages = []
        for link in links:
            # Externe Links separat speichern
            if not is_internal_link(link):
                if link not in [l["url"] for l in results["external_links"]]:
                    results["external_links"].append({
                        "url": link,
                        "source_page": url
                    })
                check_link(link, url)
            else:
                check_link(link, url)
                # Interne HTML-Seiten zum Crawlen vormerken
                parsed = urlparse(link)
                if not parsed.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.pdf')):
                    internal_pages.append(link)
        
        # Interne Seiten rekursiv crawlen
        for page in internal_pages:
            crawl_page(page)
            
    except Exception as e:
        print(f"  ❌ Fehler beim Crawlen: {e}")
        results["errors"].append({
            "url": url,
            "error": f"Crawl error: {str(e)}"
        })

def main():
    print("=" * 60)
    print("🔍 BROKEN LINK CHECKER")
    print(f"🌐 Website: {BASE_URL}")
    print("=" * 60)
    
    start_time = time.time()
    
    # Crawling starten
    crawl_page(BASE_URL)
    
    # Wichtige Seiten manuell hinzufügen falls nicht gecrawlt
    important_pages = [
        "/privat", "/gewerbe", "/service", "/wallbox", "/stromspeicher",
        "/faq", "/blog", "/standorte", "/referenzen", "/kontakt",
        "/ratgeber", "/solarmanager", "/impressum", "/datenschutz", "/agb"
    ]
    
    for page in important_pages:
        full_url = urljoin(BASE_URL, page)
        if normalize_url(full_url) not in visited_pages:
            crawl_page(full_url)
    
    elapsed = time.time() - start_time
    
    # Zusammenfassung
    print("\n" + "=" * 60)
    print("📊 ZUSAMMENFASSUNG")
    print("=" * 60)
    print(f"⏱️  Dauer: {elapsed:.1f} Sekunden")
    print(f"📄 Seiten geprüft: {results['pages_checked']}")
    print(f"🔗 Links geprüft: {len(visited_links)}")
    print(f"✅ Funktionierende Links: {len(results['working_links'])}")
    print(f"❌ Defekte Links: {len(results['broken_links'])}")
    print(f"↪️  Weiterleitungen: {len(results['redirects'])}")
    print(f"🌐 Externe Links: {len(results['external_links'])}")
    print(f"⚠️  Fehler: {len(results['errors'])}")
    
    if results["broken_links"]:
        print("\n" + "=" * 60)
        print("❌ DEFEKTE LINKS")
        print("=" * 60)
        for link in results["broken_links"]:
            print(f"  [{link['status_code']}] {link['url']}")
            print(f"      Gefunden auf: {link['source_page']}")
    
    # Ergebnisse speichern
    results["duration_seconds"] = elapsed
    with open("/home/ubuntu/senec-design/broken-links-report.json", "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n📁 Detaillierter Bericht: /home/ubuntu/senec-design/broken-links-report.json")
    
    return len(results["broken_links"])

if __name__ == "__main__":
    broken_count = main()
    sys.exit(0 if broken_count == 0 else 1)
