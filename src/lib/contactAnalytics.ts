import { LEAD_SOURCES, sanitizeLeadPath } from './leadAttribution';

const MEASUREMENT_ID = 'G-08NXYDBB4F';
const CANONICAL_ORIGIN = 'https://leipzig-photovoltaik.de';
const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`;
const SCRIPT_ID = 'presolaris-google-analytics';

type Consent = { analytics: boolean; marketing: boolean };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [DISABLE_KEY]?: boolean;
};

let initialized = false;
let analyticsEnabled = false;
let configured = false;
let script: HTMLScriptElement | null = null;
// Die DOI-Quittung bleibt ausschließlich hier im Arbeitsspeicher (auch vor dem Opt-in).
const acceptedReceipts = new Set<string>();

export function readContactConsent(): Consent | null {
  const entry = document.cookie.split(';').map(value => value.trim())
    .find(value => value.startsWith('cookie-consent='));
  if (!entry) return null;
  const raw = entry.slice('cookie-consent='.length);
  for (const decode of [false, true]) {
    try {
      const value = JSON.parse(decode ? decodeURIComponent(raw) : raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)
        || typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean') continue;
      return { analytics: value.analytics === true, marketing: value.marketing === true };
    } catch {
      // Alte rohe JSON-Werte und URL-kodierte Werte werden unterstützt; sonst kein Opt-in.
    }
  }
  return null;
}

export function safeAnalyticsPage(value: unknown): string {
  // Derselbe feste öffentliche Routenfilter wie bei der Lead-Attribution.
  return sanitizeLeadPath(value) || '/';
}

function safeReferrerDomain(): string {
  try {
    const url = new URL(document.referrer);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    return /^[a-z0-9.-]+$/i.test(url.hostname) ? url.hostname : '';
  } catch {
    return '';
  }
}

function hasAnalyticsConsent(): boolean {
  return analyticsEnabled && readContactConsent()?.analytics === true;
}

function removeAnalyticsCookies(): void {
  const names = document.cookie.split(';').map(value => value.trim().split('=')[0])
    .filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
  const hostname = window.location.hostname;
  const domains = ['', hostname, `.${hostname}`];
  if (hostname === 'leipzig-photovoltaik.de' || hostname.endsWith('.leipzig-photovoltaik.de')) {
    domains.push('.leipzig-photovoltaik.de');
  }
  for (const name of names) {
    for (const domain of new Set(domains)) {
      document.cookie = `${name}=;Max-Age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;${domain ? `domain=${domain};` : ''}SameSite=Lax`;
    }
  }
}

function disableAnalytics(): void {
  analyticsEnabled = false;
  configured = false;
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow[DISABLE_KEY] = true;
  // Noch nicht geladene Events dürfen nach einem Widerruf nicht nachgeliefert werden.
  if (Array.isArray(analyticsWindow.dataLayer)) analyticsWindow.dataLayer.length = 0;
  removeAnalyticsCookies();
}

function loadAnalytics(): void {
  if (!hasAnalyticsConsent() || configured) return;
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow[DISABLE_KEY] = false;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  // Standard-gtag-Queue steht schon während des Script-Loads bereit, nie vor dem Opt-in.
  analyticsWindow.gtag = function (..._args: unknown[]) {
    if (!hasAnalyticsConsent() || analyticsWindow[DISABLE_KEY]) return;
    analyticsWindow.dataLayer!.push(arguments);
  };
  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('config', MEASUREMENT_ID, {
    page_location: `${CANONICAL_ORIGIN}${safeAnalyticsPage(window.location.pathname)}`,
    page_referrer: safeReferrerDomain(),
    page_title: 'Presolaris – Photovoltaik Leipzig',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    cookie_flags: 'SameSite=Lax;Secure',
  });
  configured = true;
  if (script || document.getElementById(SCRIPT_ID)) return;
  script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  // Beim Widerruf während des Ladens niemals nachträglich konfigurieren/reaktivieren.
  script.onload = () => {
    if (!hasAnalyticsConsent()) disableAnalytics();
  };
  document.head.appendChild(script);
}

function applyStoredConsent(): void {
  analyticsEnabled = readContactConsent()?.analytics === true;
  if (analyticsEnabled) loadAnalytics();
  else disableAnalytics();
}

function track(eventName: string, params: { page: string; form_name?: string }): void {
  if (!hasAnalyticsConsent()) return;
  loadAnalytics();
  (window as AnalyticsWindow).gtag?.('event', eventName, params);
}

export function initContactAnalytics(): void {
  if (initialized) return;
  initialized = true;
  // Nur das gespeicherte Opt-in ist maßgeblich, keine Consent-Mode-Pings bei Ablehnung.
  window.addEventListener('presolaris:consent-updated', applyStoredConsent);
  window.addEventListener('presolaris:lead-accepted', (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (!detail || typeof detail !== 'object'
      || typeof detail.receipt !== 'string' || !detail.receipt.trim() || detail.receipt.length > 512
      || typeof detail.form_name !== 'string' || !LEAD_SOURCES.has(detail.form_name)
      || typeof detail.page !== 'string') return;
    if (acceptedReceipts.has(detail.receipt)) return;
    acceptedReceipts.add(detail.receipt);
    // Auch eine vor der Einwilligung akzeptierte Anfrage wird später nicht nachgesendet.
    track('generate_lead', { form_name: detail.form_name, page: safeAnalyticsPage(detail.page) });
  });
  document.addEventListener('click', (event: MouseEvent) => {
    if (!hasAnalyticsConsent() || !(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const href = anchor.getAttribute('href')?.trim() || '';
    let eventName: string | null = null;
    if (/^tel:/i.test(href)) eventName = 'click_phone';
    else if (/^mailto:/i.test(href)) eventName = 'click_email';
    else {
      try {
        const url = new URL(href, window.location.origin);
        if (url.protocol === 'https:' && url.hostname === 'wa.me') eventName = 'click_whatsapp';
      } catch {
        // Kein gültiger Kontakt-Link.
      }
    }
    if (eventName) track(eventName, { page: safeAnalyticsPage(window.location.pathname) });
  });
  applyStoredConsent();
}
