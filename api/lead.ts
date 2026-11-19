import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const ALLOWED_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);

const PUBLIC_ORIGINS = new Set([
  'https://leipzig-photovoltaik.de',
  'https://www.leipzig-photovoltaik.de',
]);
const CONFIRMATION_URL = 'https://leipzig-photovoltaik.de/api/confirm/';

const FIELDS = [
  'name', 'vorname', 'nachname', 'email', 'phone', 'telefon', 'company', 'contact',
  'plz', 'ort', 'strasse', 'hausnummer', 'anliegen', 'nachricht', 'message',
  'projekttyp', 'anlagengroesse', 'zeitrahmen', 'stromspeicher',
  'calculator_summary', 'roof_size', 'consumption', 'size', 'service',
  'area', 'type', 'location',
] as const;

const MAX_FILE = 3 * 1024 * 1024;
const MAX_BODY = 4 * 1024 * 1024;
const MIN_COMPLETION_MS = 2_500;
const MAX_FORM_AGE_MS = 48 * 60 * 60 * 1_000;
const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1_000;
const FILE_TYPES = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']);

// Kept self-contained here and in confirm.ts: Vercel deploys independent Functions.
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
function attributionFromForm(value: FormDataEntryValue | null): LeadAttribution | undefined {
  if (typeof value !== 'string' || value.length > 4096) return undefined;
  try { return sanitizeAttribution(JSON.parse(value)); } catch { return undefined; }
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

type BrevoResult = { ok: true; messageId: string } | { ok: false; status: number };

const json = (status: number, body: object) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
});

const clean = (value: FormDataEntryValue | null, limit = 2500): string =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const base64Url = (value: Buffer): string => value.toString('base64url');
const fromBase64Url = (value: string): Buffer => Buffer.from(value, 'base64url');

async function readLimitedBody(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    return Buffer.concat(chunks, length);
  } finally { reader.releaseLock(); }
}

function keyFromSecret(secret: string): Buffer {
  return createHash('sha256').update(secret).digest();
}

function encodeConfirmation(payload: LeadPayload, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFromSecret(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  return [base64Url(iv), base64Url(cipher.getAuthTag()), base64Url(ciphertext)].join('.');
}

export function decodeConfirmation(token: string, secret: string): LeadPayload | null {
  try {
    if (token.length > 512 * 1024) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [ivEncoded, tagEncoded, ciphertextEncoded] = parts;
    const decipher = createDecipheriv('aes-256-gcm', keyFromSecret(secret), fromBase64Url(ivEncoded));
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

function validPhone(value: string): boolean {
  if (!/^\+?[0-9 .-]{6,22}$/.test(value)) return false;
  return value.replace(/\D/g, '').length >= 6;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  // Deployment URLs and host headers are not authoritative public origins.
  return origin !== null && PUBLIC_ORIGINS.has(origin);
}

function getSecret(): string | null {
  const secret = process.env.LEAD_CONFIRMATION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

async function sendBrevo(payload: Record<string, unknown>): Promise<BrevoResult> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, status: 503 };
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': key,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    const body: unknown = await response.json().catch(() => null);
    const messageId = body && typeof body === 'object' && 'messageId' in body && typeof body.messageId === 'string'
      ? body.messageId
      : null;
    if (!response.ok || !messageId) {
      console.error('Brevo verweigert die Transaktionsnachricht:', response.status);
      return { ok: false, status: 502 };
    }
    return { ok: true, messageId };
  } catch {
    console.error('Brevo-Versandverbindung fehlgeschlagen');
    return { ok: false, status: 502 };
  }
}

function confirmationMail(token: string): { textContent: string; htmlContent: string } {
  const url = `${CONFIRMATION_URL}?token=${encodeURIComponent(token)}`;
  return {
    textContent: [
      'Bitte bestätigen Sie Ihre Anfrage bei Leipzig Photovoltaik.',
      '',
      'Öffnen Sie dazu innerhalb von 24 Stunden diesen Link:',
      url,
      '',
      'Falls Sie diese Anfrage nicht gestellt haben, müssen Sie nichts weiter tun.',
    ].join('\n'),
    htmlContent: `<!doctype html><html lang="de"><body style="font-family:Arial,sans-serif;line-height:1.5;color:#172033"><p>Guten Tag,</p><p>bitte bestätigen Sie Ihre Anfrage bei Leipzig Photovoltaik. Erst danach wird sie an unser Beratungsteam weitergegeben.</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#009eb4;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:700">Anfrage bestätigen</a></p><p>Der Link ist 24 Stunden gültig. Falls Sie diese Anfrage nicht gestellt haben, müssen Sie nichts weiter tun.</p></body></html>`,
  };
}

async function requestConfirmation(form: FormData): Promise<Response> {
  if ([...form.keys()].length > 55) return json(413, { success: false, message: 'Zu viele Felder.' });
  if (clean(form.get('website')) || clean(form.get('company_url')) || clean(form.get('botcheck'))) {
    return json(400, { success: false, message: 'Die Anfrage konnte nicht verarbeitet werden.' });
  }

  const source = clean(form.get('source'), 80);
  const email = clean(form.get('email'), 254).toLowerCase();
  const phone = clean(form.get('phone') || form.get('telefon'), 30);
  const consent = clean(form.get('datenschutz') || form.get('privacy'));
  const startedAt = Number(clean(form.get('form_started_at'), 16));
  const elapsed = Date.now() - startedAt;

  if (!ALLOWED_SOURCES.has(source) ||
      !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      !validPhone(phone) ||
      consent !== 'on' ||
      !Number.isFinite(startedAt) ||
      elapsed < MIN_COMPLETION_MS ||
      elapsed > MAX_FORM_AGE_MS) {
    return json(400, { success: false, message: 'Bitte prüfen Sie E-Mail-Adresse, Telefonnummer und Einwilligung.' });
  }

  const attachment = form.get('attachment');
  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.size > MAX_FILE) return json(413, { success: false, message: 'Der Anhang darf höchstens 3 MB groß sein.' });
    const ext = attachment.name.toLowerCase().split('.').pop() || '';
    if (!FILE_TYPES.has(ext)) return json(415, { success: false, message: 'Nur PDF, JPG, PNG, DOC und DOCX sind als Anhang erlaubt.' });
    return json(400, { success: false, message: 'Bitte bestätigen Sie Ihre Anfrage zunächst ohne Anhang. Auf die Bestätigungs-E-Mail können Sie anschließend mit der Datei antworten.' });
  }

  const secret = getSecret();
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!secret || !sender) {
    console.error('Double-Opt-in ist nicht vollständig konfiguriert');
    return json(503, { success: false, message: 'Das Anfrageformular ist momentan nicht verfügbar. Bitte rufen Sie uns an.' });
  }

  const name = clean(form.get('name') || form.get('contact') || form.get('vorname'), 100);
  const fields = FIELDS
    .map(field => [field, clean(form.get(field), ['message', 'nachricht', 'calculator_summary'].includes(field) ? 8_000 : 300)] as [string, string])
    .filter(([field, value]) => value && field !== 'email');
  const issuedAt = Date.now();
  const confirmationToken = encodeConfirmation({
    source,
    email,
    name,
    phone,
    fields,
    issuedAt,
    expiresAt: issuedAt + CONFIRMATION_TTL_MS,
    attribution: attributionFromForm(form.get('attribution')),
  }, secret);
  const content = confirmationMail(confirmationToken);
  const result = await sendBrevo({
    sender: { email: sender, name: 'Leipzig Photovoltaik' },
    to: [{ email, ...(name ? { name } : {}) }],
    subject: 'Bitte bestätigen Sie Ihre Anfrage bei Leipzig Photovoltaik',
    ...content,
    tags: ['website-anfrage-bestaetigung'],
  });
  if (!result.ok) return json(result.status, { success: false, message: 'Die Bestätigungs-E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.' });
  return json(202, { success: true, verificationRequired: true, messageId: result.messageId });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return json(405, { success: false, message: 'Nur POST-Anfragen sind erlaubt.' });
    if (!isSameOrigin(request)) return json(403, { success: false, message: 'Anfrage stammt nicht von dieser Website.' });
    const type = request.headers.get('content-type') || '';
    if (!type.toLowerCase().startsWith('multipart/form-data;')) {
      return json(415, { success: false, message: 'Formulardaten erforderlich.' });
    }
    const size = Number(request.headers.get('content-length'));
    if (Number.isFinite(size) && size > MAX_BODY) return json(413, { success: false, message: 'Die Anfrage ist zu groß.' });
    let form: FormData;
    try {
      const body = await readLimitedBody(request);
      if (body === null) return json(413, { success: false, message: 'Die Anfrage ist zu groß.' });
      form = await new Response(body, { headers: { 'content-type': type } }).formData();
    } catch {
      return json(400, { success: false, message: 'Ungültige Formulardaten.' });
    }
    return requestConfirmation(form);
  },
};

export async function forwardConfirmedLead(payload: LeadPayload): Promise<BrevoResult> {
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
    tags: ['website-anfrage', 'email-bestaetigt'],
  });
}
