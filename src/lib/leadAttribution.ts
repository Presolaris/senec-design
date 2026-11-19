export type LeadAttribution = {
  entry_path: string;
  form_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer_domain: string;
  capture_mode: 'consented_first_touch' | 'current_page_fallback';
  reporting_limit: '' | 'no_analytics_consent' | 'session_storage_unavailable';
};

export const LEAD_ATTRIBUTION_STORAGE_KEY = 'presolaris:lead-first-touch:v1';
export const LEAD_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);

// Only existing public routes: arbitrary/customer paths and internal dashboards stay out.
const PUBLIC_PATHS = new Set([
  '/', '/agb', '/blog', '/datenschutz', '/faq', '/gewerbe-photovoltaik-leipzig',
  '/gewerbe', '/heizung', '/impressum', '/kontakt', '/privat', '/pv-reinigung-leipzig',
  '/pv-wartung-leipzig', '/ratgeber', '/referenzen', '/service', '/solaranlage-leipzig',
  '/solarmanager', '/solarpark-betreuung', '/standorte', '/stromspeicher', '/ueber-uns',
  '/wallbox-leipzig', '/wallbox',
  '/blog/fehler-solarkauf', '/blog/neue-speicher-technologien-2026',
  '/blog/photovoltaik-foerderung-2026', '/blog/photovoltaik-kosten-2026',
  '/blog/solar-leipzig', '/blog/solaranlage-wartung', '/blog/stromspeicher-2026-lohnt-sich',
  '/blog/stromspeicher-nachruesten', '/blog/stromspeicher-vergleich-2026',
  '/blog/wartungstipps-winter', '/ratgeber/foerderung', '/ratgeber/kosten',
  '/ratgeber/wirtschaftlichkeit', '/standorte/anhalt-bitterfeld', '/standorte/borna',
  '/standorte/burgenlandkreis', '/standorte/dresden', '/standorte/elbe-elster',
  '/standorte/erfurt', '/standorte/gera', '/standorte/grimma', '/standorte/halle',
  '/standorte/leipzig', '/standorte/magdeburg', '/standorte/naumburg',
  '/standorte/nordsachsen', '/standorte/photovoltaik-anbieter-leipzig',
  '/standorte/photovoltaik-delitzsch', '/standorte/photovoltaik-eilenburg',
  '/standorte/photovoltaik-firma-leipzig', '/standorte/photovoltaik-markkleeberg',
  '/standorte/photovoltaik-taucha', '/standorte/photovoltaik-wurzen',
  '/standorte/saalekreis', '/standorte/solaranlage-kaufen-leipzig',
  '/standorte/solarteur-leipzig', '/standorte/stromspeicher-leipzig',
  '/standorte/wallbox-leipzig', '/standorte/weissenfels', '/standorte/zeitz',
]);

export function sanitizeLeadPath(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//')) return '';
  const path = value.split(/[?#]/, 1)[0];
  if (path.length > 200 || !PUBLIC_PATHS.has(path === '/' ? '/' : path.replace(/\/$/, ''))) return '';
  return path;
}

export function sanitizeLeadUtm(value: unknown): string {
  if (typeof value !== 'string' || value.length > 4096) return '';
  const text = value.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim();
  // Check BEFORE truncation: never retain the prefix of a URL/email/phone payload.
  if (!/^[\p{L}\p{N} _.-]*$/u.test(text) ||
      /(?:https?|mailto|tel):|www\.|[\p{L}\p{N}_-]+\.[a-z]{2,}(?:\b|\/)|(?:\+?\d[\s().-]*){6,}/iu.test(text)) return '';
  return text.slice(0, 120);
}

export function sanitizeLeadReferrerDomain(value: unknown): string {
  if (typeof value !== 'string' || value.length > 253 || !/^[a-z0-9.-]+$/i.test(value)) return '';
  const domain = value.toLowerCase();
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain) ||
      /(?:^|\.)(?:leipzig-photovoltaik\.de|localhost|local|internal|invalid|vercel\.app|manus\.computer)$/.test(domain)) return '';
  return domain;
}

export function sanitizeLeadAttribution(value: unknown): LeadAttribution | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  const firstTouch = input.capture_mode === 'consented_first_touch' && input.reporting_limit === '';
  return {
    entry_path: sanitizeLeadPath(input.entry_path),
    form_path: sanitizeLeadPath(input.form_path),
    utm_source: sanitizeLeadUtm(input.utm_source),
    utm_medium: sanitizeLeadUtm(input.utm_medium),
    utm_campaign: sanitizeLeadUtm(input.utm_campaign),
    utm_content: sanitizeLeadUtm(input.utm_content),
    referrer_domain: sanitizeLeadReferrerDomain(input.referrer_domain),
    capture_mode: firstTouch ? 'consented_first_touch' : 'current_page_fallback',
    reporting_limit: firstTouch ? '' : input.reporting_limit === 'session_storage_unavailable'
      ? 'session_storage_unavailable' : 'no_analytics_consent',
  };
}

let documentEntry: LeadAttribution | undefined;
let consentedEntry: LeadAttribution | undefined;
let initialized = false;
let analyticsAllowed = false;
let storageAvailable = false;

function readAnalyticsConsent(): boolean {
  try {
    const cookie = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith('cookie-consent='));
    if (!cookie) return false;
    const raw = cookie.slice('cookie-consent='.length);
    let value: unknown;
    try { value = JSON.parse(raw); } catch { value = JSON.parse(decodeURIComponent(raw)); }
    return Boolean(value && typeof value === 'object' && (value as { analytics?: unknown }).analytics === true);
  } catch { return false; }
}

function captureDocumentEntry(): LeadAttribution {
  let path = '';
  let params = new URLSearchParams();
  let referrer = '';
  try {
    const url = new URL(window.location.href);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      path = sanitizeLeadPath(url.pathname);
      params = url.searchParams;
    }
    if (document.referrer) {
      const url = new URL(document.referrer);
      if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password) {
        referrer = sanitizeLeadReferrerDomain(url.hostname);
      }
    }
  } catch { /* Invalid/inaccessible URLs do not block an enquiry. */ }
  return {
    entry_path: path, form_path: path,
    utm_source: sanitizeLeadUtm(params.get('utm_source')),
    utm_medium: sanitizeLeadUtm(params.get('utm_medium')),
    utm_campaign: sanitizeLeadUtm(params.get('utm_campaign')),
    utm_content: sanitizeLeadUtm(params.get('utm_content')),
    referrer_domain: referrer,
    capture_mode: 'current_page_fallback', reporting_limit: 'no_analytics_consent',
  };
}

function removeStoredEntry(): void {
  // Deletion only (never read/set) is also permitted for withdrawal/expired consent.
  try { window.sessionStorage.removeItem(LEAD_ATTRIBUTION_STORAGE_KEY); } catch { /* blocked storage */ }
}

function syncConsent(forceDenied = false): void {
  const allowed = !forceDenied && readAnalyticsConsent();
  if (!allowed) {
    if (analyticsAllowed) removeStoredEntry();
    analyticsAllowed = false;
    consentedEntry = undefined;
    storageAvailable = false;
    return;
  }
  if (analyticsAllowed) return;
  analyticsAllowed = true;
  const candidate = { ...documentEntry!, capture_mode: 'consented_first_touch' as const, reporting_limit: '' as const };
  try {
    const raw = window.sessionStorage.getItem(LEAD_ATTRIBUTION_STORAGE_KEY);
    let stored: LeadAttribution | undefined;
    if (raw && raw.length <= 4096) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) &&
            Object.keys(candidate).every(key => typeof parsed[key] === 'string')) {
          stored = sanitizeLeadAttribution(parsed);
        }
      } catch { /* repair malformed storage */ }
    }
    consentedEntry = stored?.capture_mode === 'consented_first_touch' ? stored : candidate;
    // Re-write sanitized allowlisted data, never raw storage. First touch values remain unchanged.
    window.sessionStorage.setItem(LEAD_ATTRIBUTION_STORAGE_KEY, JSON.stringify(consentedEntry));
    storageAvailable = true;
  } catch {
    consentedEntry = candidate;
    storageAvailable = false;
  }
}

export function initializeLeadAttribution(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!initialized) {
    initialized = true;
    documentEntry = captureDocumentEntry();
    // Expired/absent consent must not reactivate stale first-touch data after a reload.
    if (!readAnalyticsConsent()) removeStoredEntry();
    window.addEventListener('presolaris:consent-updated', event => {
      const detail = (event as CustomEvent<{ analytics?: unknown }>).detail;
      if (detail?.analytics !== true) removeStoredEntry();
      syncConsent(detail?.analytics !== true);
    });
  }
  syncConsent();
}

export function getLeadAttribution(): LeadAttribution | undefined {
  initializeLeadAttribution();
  if (!documentEntry) return undefined;
  const entry = analyticsAllowed && storageAvailable && consentedEntry ? consentedEntry : documentEntry;
  return {
    ...entry,
    form_path: sanitizeLeadPath(window.location.pathname),
    capture_mode: analyticsAllowed && storageAvailable ? 'consented_first_touch' : 'current_page_fallback',
    reporting_limit: analyticsAllowed && storageAvailable ? '' : analyticsAllowed
      ? 'session_storage_unavailable' : 'no_analytics_consent',
  };
}

// Imported centrally by leadForms: capture the first document URL before submit/navigation.
initializeLeadAttribution();
