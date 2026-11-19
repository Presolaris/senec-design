import { createDecipheriv, createHash } from 'node:crypto';

const ALLOWED_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);
const PUBLIC_ORIGINS = new Set([
  'https://leipzig-photovoltaik.de',
  'https://www.leipzig-photovoltaik.de',
]);
const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1_000;
const MAX_CONFIRM_BODY = 768 * 1024;
const MAX_TOKEN_LENGTH = 512 * 1024;

// Kept self-contained here and in lead.ts: Vercel deploys independent Functions.
const ATTRIBUTION_PUBLIC_PATHS = new Set([
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
type LeadAttribution = {
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
function attributionPath(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//')) return '';
  const path = value.split(/[?#]/, 1)[0];
  return path.length <= 200 && ATTRIBUTION_PUBLIC_PATHS.has(path === '/' ? '/' : path.replace(/\/$/, '')) ? path : '';
}
function attributionUtm(value: unknown): string {
  if (typeof value !== 'string' || value.length > 4096) return '';
  const text = value.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim();
  if (!/^[\p{L}\p{N} _.-]*$/u.test(text) ||
      /(?:https?|mailto|tel):|www\.|[\p{L}\p{N}_-]+\.[a-z]{2,}(?:\b|\/)|(?:\+?\d[\s().-]*){6,}/iu.test(text)) return '';
  return text.slice(0, 120);
}
function attributionDomain(value: unknown): string {
  if (typeof value !== 'string' || value.length > 253 || !/^[a-z0-9.-]+$/i.test(value)) return '';
  const domain = value.toLowerCase();
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain) ||
      /(?:^|\.)(?:leipzig-photovoltaik\.de|localhost|local|internal|invalid|vercel\.app|manus\.computer)$/.test(domain)) return '';
  return domain;
}
function sanitizeAttribution(value: unknown): LeadAttribution | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  const firstTouch = input.capture_mode === 'consented_first_touch' && input.reporting_limit === '';
  return {
    entry_path: attributionPath(input.entry_path), form_path: attributionPath(input.form_path),
    utm_source: attributionUtm(input.utm_source), utm_medium: attributionUtm(input.utm_medium),
    utm_campaign: attributionUtm(input.utm_campaign), utm_content: attributionUtm(input.utm_content),
    referrer_domain: attributionDomain(input.referrer_domain),
    capture_mode: firstTouch ? 'consented_first_touch' : 'current_page_fallback',
    reporting_limit: firstTouch ? '' : input.reporting_limit === 'session_storage_unavailable'
      ? 'session_storage_unavailable' : 'no_analytics_consent',
  };
}
function attributionNotification(value: unknown): string {
  const attr = sanitizeAttribution(value);
  if (!attr) return '';
  const mode = attr.capture_mode === 'consented_first_touch'
    ? 'Erster Besuchskontakt dieser Sitzung (Analytics-Einwilligung; Browserangabe)'
    : 'Aktueller Dokumentkontext (Fallback; kein belegter Mehrseiten-Erstbesuch)';
  const limit = attr.reporting_limit === 'no_analytics_consent'
    ? 'Keine Analytics-Einwilligung: keine gespeicherte Kampagnensitzung; frühere Seiten/UTMs unbekannt.'
    : attr.reporting_limit === 'session_storage_unavailable'
      ? 'Sitzungsspeicher nicht verfügbar: frühere Seiten/UTMs unbekannt.' : 'Keine zusätzliche Einschränkung; Angaben sind nicht unabhängig verifiziert.';
  return [
    'Herkunft der Anfrage',
    `Einstiegsseitenpfad${attr.capture_mode === 'current_page_fallback' ? ' (aktuelles Dokument, Fallback)' : ''}: ${attr.entry_path || 'nicht erfasst'}`,
    `Formularseitenpfad: ${attr.form_path || 'nicht erfasst'}`,
    `utm_source: ${attr.utm_source || 'nicht erfasst'}`, `utm_medium: ${attr.utm_medium || 'nicht erfasst'}`,
    `utm_campaign: ${attr.utm_campaign || 'nicht erfasst'}`, `utm_content: ${attr.utm_content || 'nicht erfasst'}`,
    `Verweis-Domain: ${attr.referrer_domain || 'nicht erfasst'}`,
    `Erfassungsart: ${mode}`, `Erfassungsgrenze: ${limit}`,
  ].join('\n');
}
const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

type LeadPayload = {
  source: string;
  email: string;
  name: string;
  phone: string;
  fields: Array<[string, string]>;
  issuedAt: number;
  expiresAt: number;
  attribution?: LeadAttribution;
};

type BrevoResult = { ok: true; messageId: string } | { ok: false; status: number } | { ok: false; alreadyProcessed: true };

const page = (title: string, message: string, body: string): Response => new Response(`<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Leipzig Photovoltaik</title>
<style>body{margin:0;background:#f4f7fa;color:#14233d;font-family:Arial,sans-serif;line-height:1.5}.card{box-sizing:border-box;max-width:620px;margin:8vh auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 8px 32px #14233d18}h1{margin-top:0;font-size:1.75rem}p{margin:0 0 1.2rem}button{border:0;border-radius:6px;background:#009eb4;color:#fff;cursor:pointer;font:inherit;font-weight:700;padding:13px 20px}button:hover{background:#007f92}.small{font-size:.9rem;color:#4d5b71}</style></head>
<body><main class="card"><h1>${title}</h1><p>${message}</p>${body}</main></body></html>`, {
  headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' },
});

const invalid = () => page(
  'Link nicht verfügbar',
  'Dieser Bestätigungslink ist ungültig oder bereits abgelaufen. Bitte senden Sie Ihre Anfrage erneut über unsere Website.',
  '<p class="small">Neue Bestätigungslinks sind aus Sicherheitsgründen 24 Stunden gültig.</p>',
);

const fromBase64Url = (value: string): Buffer => Buffer.from(value, 'base64url');
const keyFromSecret = (value: string): Buffer => createHash('sha256').update(value).digest();

async function confirmationTokenFromPost(request: Request): Promise<string> {
  const declaredSize = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_CONFIRM_BODY) return '';
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_CONFIRM_BODY) { await reader.cancel(); return ''; }
      chunks.push(value);
    }
    const form = await new Response(Buffer.concat(chunks, length), {
      headers: { 'content-type': request.headers.get('content-type') || '' },
    }).formData();
    const token = form.get('token');
    return typeof token === 'string' && token.length <= MAX_TOKEN_LENGTH ? token : '';
  } catch { return ''; } finally { reader.releaseLock(); }
}

function confirmationIdempotencyKey(token: string): string {
  const bytes = createHash('sha256')
    .update('leipzig-photovoltaik.de:confirmed-lead:v1\0')
    .update(token)
    .digest().subarray(0, 16);
  // UUIDv8 permits this deterministic SHA-256 layout; set RFC version/variant.
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isIdempotencyReplay(body: unknown): boolean {
  return Boolean(body && typeof body === 'object' &&
    'code' in body && body.code === 'duplicate_parameter' &&
    'message' in body && typeof body.message === 'string' &&
    /\bidempotency[\s_-]*key\b/i.test(body.message) &&
    /\balready\b.*\b(?:processed|used)\b/i.test(body.message));
}

function validSameOriginPost(request: Request): boolean {
  const origin = request.headers.get('origin');
  // Vercel can present a deployment URL as request.url while the browser's
  // public Origin is the production custom domain. Compare against the
  // explicit public allow-list, never the mutable host header.
  if (origin !== null && origin !== 'null') return PUBLIC_ORIGINS.has(origin);

  // The confirmation page deliberately uses Referrer-Policy: no-referrer.
  // Native top-level form posts can therefore omit Origin or send literal null;
  // accept only the browser metadata pattern for a same-origin navigation.
  return request.headers.get('sec-fetch-site') === 'same-origin' &&
    request.headers.get('sec-fetch-mode') === 'navigate' &&
    request.headers.get('sec-fetch-dest') === 'document';
}

function secret(): string | null {
  const value = process.env.LEAD_CONFIRMATION_SECRET;
  return value && value.length >= 32 ? value : null;
}

function decodeConfirmation(token: string, signingSecret: string): LeadPayload | null {
  try {
    if (token.length > MAX_TOKEN_LENGTH) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [ivEncoded, tagEncoded, ciphertextEncoded] = parts;
    const decipher = createDecipheriv('aes-256-gcm', keyFromSecret(signingSecret), fromBase64Url(ivEncoded));
    decipher.setAuthTag(fromBase64Url(tagEncoded));
    const plaintext = Buffer.concat([
      decipher.update(fromBase64Url(ciphertextEncoded)),
      decipher.final(),
    ]).toString('utf8');
    const parsed = JSON.parse(plaintext) as LeadPayload;
    if (!parsed || typeof parsed !== 'object' ||
        !ALLOWED_SOURCES.has(parsed.source) ||
        typeof parsed.email !== 'string' ||
        typeof parsed.phone !== 'string' ||
        !Array.isArray(parsed.fields) ||
        !Number.isFinite(parsed.issuedAt) ||
        !Number.isFinite(parsed.expiresAt) ||
        // Honor the authenticated expiry, including older 30-minute links.
        Date.now() >= parsed.expiresAt ||
        parsed.expiresAt - parsed.issuedAt <= 0 ||
        parsed.expiresAt - parsed.issuedAt > CONFIRMATION_TTL_MS) return null;
    return { ...parsed, attribution: sanitizeAttribution(parsed.attribution) };
  } catch {
    return null;
  }
}

async function sendBrevo(payload: Record<string, unknown>): Promise<BrevoResult> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, status: 503 };
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    const body: unknown = await response.json().catch(() => null);
    if (response.status === 400 && isIdempotencyReplay(body)) return { ok: false, alreadyProcessed: true };
    const messageId = body && typeof body === 'object' && 'messageId' in body && typeof body.messageId === 'string'
      ? body.messageId
      : null;
    if (!response.ok || !messageId) {
      console.error('Brevo verweigert die bestätigte Betreiberbenachrichtigung:', response.status);
      return { ok: false, status: 502 };
    }
    return { ok: true, messageId };
  } catch {
    console.error('Brevo-Versandverbindung für Betreiberbenachrichtigung fehlgeschlagen');
    return { ok: false, status: 502 };
  }
}

async function forwardConfirmedLead(payload: LeadPayload, token: string): Promise<BrevoResult> {
  const sender = process.env.BREVO_SENDER_EMAIL;
  const recipient = process.env.BREVO_LEAD_RECIPIENT;
  if (!sender || !recipient) return { ok: false, status: 503 };
  const details = payload.fields.map(([field, value]) => `${field}: ${value}`).join('\n\n');
  const text = [
    'Neue, per E-Mail bestätigte Anfrage – leipzig-photovoltaik.de',
    `Formular: ${payload.source}`,
    `E-Mail: ${payload.email}`,
    `Telefon: ${payload.phone}`,
    details,
    attributionNotification(payload.attribution),
  ].filter(Boolean).join('\n\n');
  return sendBrevo({
    sender: { email: sender, name: 'Leipzig Photovoltaik' },
    to: [{ email: recipient }],
    replyTo: { email: payload.email, ...(payload.name ? { name: payload.name } : {}) },
    subject: `Bestätigte Anfrage von leipzig-photovoltaik.de – ${payload.source}`,
    textContent: text,
    htmlContent: `<!doctype html><html lang="de"><body><pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${escapeHtml(text)}</pre></body></html>`,
    // Brevo remembers this key for only 30 minutes, not the full 24-hour token TTL.
    // After that, a still-valid token can resend; this is not persistent replay protection.
    headers: { idempotencyKey: confirmationIdempotencyKey(token) },
    tags: ['website-anfrage', 'email-bestaetigt'],
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'POST') return invalid();
    if (request.method === 'POST' && !validSameOriginPost(request)) return invalid();
    const url = new URL(request.url);
    const token = request.method === 'GET'
      ? url.searchParams.get('token') || ''
      : await confirmationTokenFromPost(request);
    const signingSecret = secret();
    const payload = signingSecret ? decodeConfirmation(token, signingSecret) : null;
    if (!payload) return invalid();

    if (request.method === 'GET') {
      return page(
        'Anfrage bestätigen',
        'Bitte bestätigen Sie mit einem Klick, dass diese Anfrage von Ihnen stammt. Erst dann erhält unser Beratungsteam Ihre Angaben.',
        `<form method="post" action="/api/confirm/"><input type="hidden" name="token" value="${token.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"><button type="submit">Anfrage verbindlich bestätigen</button></form><p class="small">Wenn Sie diese Anfrage nicht gestellt haben, schließen Sie diese Seite einfach.</p>`,
      );
    }
    if (request.method !== 'POST' || !validSameOriginPost(request)) return invalid();

    const result = await forwardConfirmedLead(payload, token);
    if (!result.ok) {
      if ('alreadyProcessed' in result) {
        return page(
          'Anfrage bereits verarbeitet',
          'Diese Bestätigung wurde bereits verarbeitet. Es wurde keine neue Benachrichtigung ausgelöst.',
          '<p class="small">Sie müssen diese Bestätigung nicht erneut absenden.</p>',
        );
      }
      return page(
        'Bestätigung derzeit nicht möglich',
        'Ihre Anfrage konnte noch nicht an unser Beratungsteam weitergegeben werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.',
        '<p class="small">Telefon: +49 341 98 99 03 91</p>',
      );
    }
    return page(
      'Anfrage bestätigt',
      'Vielen Dank. Ihre Anfrage wurde bestätigt und an unser Beratungsteam weitergegeben.',
      '<p class="small">Wir melden uns mit Blick auf Ihre angegebenen Kontaktdaten bei Ihnen.</p>',
    );
  },
};
