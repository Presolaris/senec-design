#!/usr/bin/env python3
"""
Fetch SimilarWeb traffic data for leipzig-photovoltaik.de
"""

import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json
from datetime import datetime
from dateutil.relativedelta import relativedelta

def fetch_domain_data(domain: str):
    """Fetch all available SimilarWeb data for a domain."""
    client = ApiClient()
    
    # Calculate date range
    last_complete_month = datetime.now().replace(day=1) - relativedelta(months=1)
    start_date = (last_complete_month - relativedelta(months=5)).strftime("%Y-%m")
    end_date = last_complete_month.strftime("%Y-%m")
    
    results = {}
    
    # Try to get global rank
    try:
        rank_data = client.call_api(
            'SimilarWeb/get_global_rank',
            path_params={'domain': domain},
            query={
                'main_domain_only': False,
                'start_date': start_date,
                'end_date': end_date
            }
        )
        results['global_rank'] = rank_data
        print(f"✅ Global Rank data retrieved")
    except Exception as e:
        print(f"❌ Global Rank error: {e}")
        results['global_rank'] = None
    
    # Try to get traffic data
    try:
        traffic_data = client.call_api(
            'SimilarWeb/get_visits',
            path_params={'domain': domain},
            query={
                'main_domain_only': False,
                'start_date': start_date,
                'end_date': end_date,
                'granularity': 'monthly'
            }
        )
        results['traffic'] = traffic_data
        print(f"✅ Traffic data retrieved")
    except Exception as e:
        print(f"❌ Traffic error: {e}")
        results['traffic'] = None
    
    # Try to get engagement data
    try:
        engagement_data = client.call_api(
            'SimilarWeb/get_engagement',
            path_params={'domain': domain},
            query={
                'main_domain_only': False,
                'start_date': start_date,
                'end_date': end_date,
                'granularity': 'monthly'
            }
        )
        results['engagement'] = engagement_data
        print(f"✅ Engagement data retrieved")
    except Exception as e:
        print(f"❌ Engagement error: {e}")
        results['engagement'] = None
    
    return results

def main():
    domain = "leipzig-photovoltaik.de"
    print(f"\n🔍 Fetching SimilarWeb data for: {domain}\n")
    
    data = fetch_domain_data(domain)
    
    # Save to JSON file
    output_file = "/home/ubuntu/senec-design/public/data/similarweb-data.json"
    
    # Ensure directory exists
    import os
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'domain': domain,
            'fetched_at': datetime.now().isoformat(),
            'data': data
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Data saved to: {output_file}")
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
