// CTA Button Tracking Helper Functions
// Erstellt: 02.02.2026

import { supabase, getSessionId, type CTAButtonClick, type PageView } from './supabase';

/**
 * Track CTA Button Click
 * @param buttonText - Text des geklickten Buttons
 * @param buttonPosition - Position des Buttons (z.B. 'faq_section', 'hero_section')
 */
export async function trackCTAClick(
  buttonText: string,
  buttonPosition: string = 'faq_section'
): Promise<void> {
  try {
    const clickData: CTAButtonClick = {
      page_url: window.location.href,
      page_title: document.title,
      button_text: buttonText,
      button_position: buttonPosition,
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
    };

    const { error } = await supabase
      .from('cta_button_clicks')
      .insert([clickData]);

    if (error) {
      console.error('CTA Tracking Error:', error);
    }
  } catch (err) {
    console.error('CTA Tracking Failed:', err);
  }
}

/**
 * Track Page View (für Conversion-Rate-Berechnung)
 */
export async function trackPageView(): Promise<void> {
  try {
    const pageViewData: PageView = {
      page_url: window.location.href,
      page_title: document.title,
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
    };

    const { error } = await supabase
      .from('page_views')
      .insert([pageViewData]);

    if (error) {
      console.error('Page View Tracking Error:', error);
    }
  } catch (err) {
    console.error('Page View Tracking Failed:', err);
  }
}

/**
 * Initialize CTA Tracking on Page Load
 * Automatisches Tracking von Seitenaufrufen und CTA-Klicks
 */
export function initCTATracking(): void {
  // Track Page View beim Laden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => trackPageView());
  } else {
    trackPageView();
  }

  // Track CTA Button Clicks automatisch
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const ctaButton = target.closest('[data-cta-tracking]');
    
    if (ctaButton) {
      const buttonText = ctaButton.textContent?.trim() || 'Unknown';
      const buttonPosition = ctaButton.getAttribute('data-cta-position') || 'unknown';
      trackCTAClick(buttonText, buttonPosition);
    }
  });
}

/**
 * Fetch CTA Conversion Metrics
 * @param days - Anzahl der Tage zurück (Standard: 30)
 */
export async function getCTAMetrics(days: number = 30) {
  try {
    const { data, error } = await supabase
      .from('cta_conversion_metrics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to fetch CTA metrics:', err);
    return [];
  }
}

/**
 * Fetch Top Performing Pages
 */
export async function getTopPages() {
  try {
    const { data, error } = await supabase
      .from('cta_top_pages')
      .select('*')
      .limit(10);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to fetch top pages:', err);
    return [];
  }
}
