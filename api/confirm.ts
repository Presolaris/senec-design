import { decodeConfirmation, forwardConfirmedLead } from './lead.ts';

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

function validOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}

function secret(): string | null {
  const value = process.env.LEAD_CONFIRMATION_SECRET;
  return value && value.length >= 32 ? value : null;
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
