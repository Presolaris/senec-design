import { createDecipheriv, createHash } from 'node:crypto';

const ALLOWED_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);
const CONFIRMATION_TTL_MS = 30 * 60 * 1_000;

type LeadPayload = {
  source: string;
  email: string;
  name: string;
  phone: string;
  fields: Array<[string, string]>;
  issuedAt: number;
  expiresAt: number;
};

type BrevoResult = { ok: true; messageId: string } | { ok: false; status: number };

const page = (title: string, message: string, body: string): Response => new Response(`<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Leipzig Photovoltaik</title>
<style>body{margin:0;background:#f4f7fa;color:#14233d;font-family:Arial,sans-serif;line-height:1.5}.card{box-sizing:border-box;max-width:620px;margin:8vh auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 8px 32px #14233d18}h1{margin-top:0;font-size:1.75rem}p{margin:0 0 1.2rem}button{border:0;border-radius:6px;background:#009eb4;color:#fff;cursor:pointer;font:inherit;font-weight:700;padding:13px 20px}button:hover{background:#007f92}.small{font-size:.9rem;color:#4d5b71}</style></head>
<body><main class="card"><h1>${title}</h1><p>${message}</p>${body}</main></body></html>`, {
  headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' },
});

const invalid = () => page(
  'Link nicht verfügbar',
  'Dieser Bestätigungslink ist ungültig oder bereits abgelaufen. Bitte senden Sie Ihre Anfrage erneut über unsere Website.',
  '<p class="small">Aus Sicherheitsgründen sind Bestätigungslinks nur 30 Minuten gültig.</p>',
);

const fromBase64Url = (value: string): Buffer => Buffer.from(value, 'base64url');
const keyFromSecret = (value: string): Buffer => createHash('sha256').update(value).digest();

function validOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}

function secret(): string | null {
  const value = process.env.LEAD_CONFIRMATION_SECRET;
  return value && value.length >= 32 ? value : null;
}

function decodeConfirmation(token: string, signingSecret: string): LeadPayload | null {
  try {
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
        Date.now() > parsed.expiresAt ||
        parsed.expiresAt - parsed.issuedAt > CONFIRMATION_TTL_MS) return null;
    return parsed;
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

async function forwardConfirmedLead(payload: LeadPayload): Promise<BrevoResult> {
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
  ].filter(Boolean).join('\n\n');
  return sendBrevo({
    sender: { email: sender, name: 'Leipzig Photovoltaik' },
    to: [{ email: recipient }],
    replyTo: { email: payload.email, ...(payload.name ? { name: payload.name } : {}) },
    subject: `Bestätigte Anfrage von leipzig-photovoltaik.de – ${payload.source}`,
    textContent: text,
    tags: ['website-anfrage', 'email-bestaetigt'],
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const token = request.method === 'GET'
      ? url.searchParams.get('token') || ''
      : (await request.formData().catch(() => null))?.get('token')?.toString() || '';
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
    if (request.method !== 'POST' || !validOrigin(request)) return invalid();

    const result = await forwardConfirmedLead(payload);
    if (!result.ok) {
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
