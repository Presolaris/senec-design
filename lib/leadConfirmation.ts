import { createDecipheriv, createHash } from 'node:crypto';

const ALLOWED_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);

export type LeadPayload = {
  source: string;
  email: string;
  name: string;
  phone: string;
  fields: Array<[string, string]>;
  issuedAt: number;
  expiresAt: number;
};

type BrevoResult = { ok: true; messageId: string } | { ok: false; status: number };

const CONFIRMATION_TTL_MS = 30 * 60 * 1_000;

const base64Url = (value: Buffer): string => value.toString('base64url');
const fromBase64Url = (value: string): Buffer => Buffer.from(value, 'base64url');
const keyFromSecret = (secret: string): Buffer => createHash('sha256').update(secret).digest();

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
      console.error('Brevo verweigert die bestätigte Betreiberbenachrichtigung:', response.status);
      return { ok: false, status: 502 };
    }
    return { ok: true, messageId };
  } catch {
    console.error('Brevo-Versandverbindung für Betreiberbenachrichtigung fehlgeschlagen');
    return { ok: false, status: 502 };
  }
}

export function decodeConfirmation(token: string, secret: string): LeadPayload | null {
  try {
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
        Date.now() > parsed.expiresAt ||
        parsed.expiresAt - parsed.issuedAt > CONFIRMATION_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

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
