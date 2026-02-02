#!/usr/bin/env python3
"""
Fetch Google Search Console data for leipzig-photovoltaik.de
"""

import json
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
CREDENTIALS_FILE = '/home/ubuntu/senec-design/scripts/google-credentials.json'
SITE_URL = 'https://leipzig-photovoltaik.de/'  # or 'sc-domain:leipzig-photovoltaik.de'
OUTPUT_FILE = '/home/ubuntu/senec-design/public/data/search-console-data.json'

def get_search_console_service():
    """Create Search Console API service."""
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly']
    )
    return build('searchconsole', 'v1', credentials=credentials)

def fetch_keyword_data(service, site_url, days=28):
    """Fetch keyword performance data."""
    end_date = datetime.now() - timedelta(days=3)  # Data has 3-day delay
    start_date = end_date - timedelta(days=days)
    
    request = {
        'startDate': start_date.strftime('%Y-%m-%d'),
        'endDate': end_date.strftime('%Y-%m-%d'),
        'dimensions': ['query', 'page'],
        'rowLimit': 100,
        'startRow': 0
    }
    
    response = service.searchanalytics().query(siteUrl=site_url, body=request).execute()
    return response.get('rows', [])

def transform_to_dashboard_format(rows):
    """Transform Search Console data to dashboard format."""
    keywords = []
    
    for row in rows:
        query = row['keys'][0]
        page = row['keys'][1]
        
        # Determine priority based on position and impressions
        position = row.get('position', 100)
        impressions = row.get('impressions', 0)
        
        if position <= 3 and impressions > 100:
            priority = 'high'
        elif position <= 10 and impressions > 50:
            priority = 'high'
        elif position <= 20:
            priority = 'medium'
        else:
            priority = 'low'
        
        # Determine trend (would need historical data for accurate trend)
        trend = 'stable'  # Default, can be updated with historical comparison
        
        # Determine category based on keyword
        category = 'allgemein'
        if 'leipzig' in query.lower():
            category = 'lokal'
        elif 'speicher' in query.lower() or 'batterie' in query.lower():
            category = 'produkt'
        elif 'preis' in query.lower() or 'kosten' in query.lower():
            category = 'transaktional'
        elif 'förderung' in query.lower() or 'zuschuss' in query.lower():
            category = 'informational'
        
        keywords.append({
            'keyword': query,
            'target_url': page.replace('https://leipzig-photovoltaik.de', ''),
            'current_rank': round(position, 1),
            'previous_rank_7d': None,  # Would need historical data
            'impressions': impressions,
            'clicks': row.get('clicks', 0),
            'ctr': round(row.get('ctr', 0) * 100, 1),
            'trend': trend,
            'priority': priority,
            'category': category
        })
    
    # Sort by impressions (most important keywords first)
    keywords.sort(key=lambda x: x['impressions'], reverse=True)
    
    return keywords

def main():
    print(f"\n🔍 Fetching Google Search Console data for: {SITE_URL}\n")
    
    try:
        service = get_search_console_service()
        print("✅ API connection established")
        
        # Try different site URL formats
        site_urls_to_try = [
            'https://leipzig-photovoltaik.de/',
            'http://leipzig-photovoltaik.de/',
            'sc-domain:leipzig-photovoltaik.de'
        ]
        
        rows = None
        used_url = None
        
        for url in site_urls_to_try:
            try:
                print(f"   Trying: {url}")
                rows = fetch_keyword_data(service, url)
                used_url = url
                print(f"✅ Data retrieved from: {url}")
                break
            except Exception as e:
                print(f"   ❌ Failed: {str(e)[:50]}")
                continue
        
        if rows is None:
            print("\n❌ Could not fetch data from any site URL format.")
            print("   Please ensure the service account email is added to Search Console.")
            return
        
        print(f"✅ Found {len(rows)} keyword rows")
        
        # Transform data
        keywords = transform_to_dashboard_format(rows)
        
        # Save to JSON
        import os
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
        output_data = {
            'site_url': used_url,
            'fetched_at': datetime.now().isoformat(),
            'total_keywords': len(keywords),
            'keywords': keywords
        }
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Data saved to: {OUTPUT_FILE}")
        print(f"\n📊 Top 10 Keywords:")
        for i, kw in enumerate(keywords[:10], 1):
            print(f"   {i}. {kw['keyword']} - Position: {kw['current_rank']}, Impressionen: {kw['impressions']}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
