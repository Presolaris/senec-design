// Vercel Function: Transaktionale Anfrage, niemals Marketinglisten-Kontakt.
// Die Browserseite wird erst nach verifizierter Brevo-/Vercel-Konfiguration hierher umgestellt.
const ALLOWED_SOURCES = new Set([
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
]);
const FIELDS = [
  'name', 'vorname', 'nachname', 'email', 'phone', 'telefon', 'company', 'contact',
  'plz', 'ort', 'strasse', 'hausnummer', 'anliegen', 'nachricht', 'message',
  'projekttyp', 'anlagengroesse', 'zeitrahmen', 'stromspeicher',
  'calculator_summary', 'roof_size', 'consumption', 'size', 'service',
  'area', 'type', 'location',
] as const;
const MAX_FILE = 3 * 1024 * 1024; // Vercel Function: max. 4,5 MB Requestkörper
const MAX_BODY = 4 * 1024 * 1024;
const FILE_TYPES = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']);
const json = (status: number, body: object) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const clean = (value: FormDataEntryValue | null, limit = 2500): string =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';

function isAllowedFile(name: string, bytes: Uint8Array): boolean {
  const ext = name.toLowerCase().split('.').pop() || '';
  if (!FILE_TYPES.has(ext)) return false;
  if (ext === 'pdf') return bytes.length >= 4 && String.fromCharCode(...bytes.slice(0, 4)) === '%PDF';
  if (ext === 'jpg' || ext === 'jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (ext === 'png') return bytes[0] === 0x89 && String.fromCharCode(...bytes.slice(1, 4)) === 'PNG';
  if (ext === 'docx') return bytes[0] === 0x50 && bytes[1] === 0x4b; // ZIP-Container
  return bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0; // OLE2
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return json(405, { success: false, message: 'Nur POST-Anfragen sind erlaubt.' });
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin) {
      return json(403, { success: false, message: 'Anfrage stammt nicht von dieser Website.' });
    }
    const type = request.headers.get('content-type') || '';
    if (!type.toLowerCase().startsWith('multipart/form-data;')) {
      return json(415, { success: false, message: 'Formulardaten erforderlich.' });
    }
    const size = Number(request.headers.get('content-length'));
    if (Number.isFinite(size) && size > MAX_BODY) {
      return json(413, { success: false, message: 'Die Anfrage ist zu groß.' });
    }
    let form: FormData;
    try { form = await request.formData(); }
    catch { return json(400, { success: false, message: 'Ungültige Formulardaten.' }); }
    // Keine unbeschränkte Verarbeitung unerwarteter Eingaben (etwa viele Zusatzfelder).
    if ([...form.keys()].length > 55) return json(413, { success: false, message: 'Zu viele Felder.' });
    if (clean(form.get('botcheck')) || clean(form.get('website'))) {
      return json(400, { success: false, message: 'Ungültige Anfrage.' });
    }
    const source = clean(form.get('source'), 80);
    const email = clean(form.get('email'), 254);
    if (!ALLOWED_SOURCES.has(source) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      return json(400, { success: false, message: 'Bitte prüfen Sie Ihre E-Mail-Adresse und die Anfrage.' });
    }
    const name = clean(form.get('name') || form.get('contact') || form.get('vorname'), 100);
    const consent = clean(form.get('datenschutz') || form.get('privacy'));
    if (['multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe', 'service'].includes(source) && consent !== 'on') {
      return json(400, { success: false, message: 'Bitte bestätigen Sie die Datenschutzhinweise.' });
    }
    const key = process.env.BREVO_API_KEY;
    const sender = process.env.BREVO_SENDER_EMAIL;
    const recipient = process.env.BREVO_LEAD_RECIPIENT;
    if (!key || !sender || !recipient) {
      return json(503, { success: false, message: 'Anfragen sind derzeit nicht verfügbar. Bitte rufen Sie uns an.' });
    }
    const fields = FIELDS.map(field => [field, clean(form.get(field), field === 'message' || field === 'nachricht' || field === 'calculator_summary' ? 8000 : 300)] as const)
      .filter(([field, value]) => value && field !== 'email');
    const text = ['Neue Anfrage – leipzig-photovoltaik.de', `Formular: ${source}`, `E-Mail: ${email}`, ...fields.map(([field, value]) => `${field}: ${value}`)].join('\n\n');
    const payload: Record<string, unknown> = {
      sender: { email: sender, name: 'Leipzig Photovoltaik' },
      to: [{ email: recipient }],
      replyTo: { email, ...(name ? { name } : {}) },
      subject: `Anfrage von leipzig-photovoltaik.de – ${source}`,
      textContent: text,
      tags: ['website-anfrage'],
    };
    const attachment = form.get('attachment');
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > MAX_FILE) return json(413, { success: false, message: 'Der Anhang darf höchstens 3 MB groß sein.' });
      const filename = attachment.name.replace(/[^\p{L}\p{N}. _-]/gu, '_').slice(0, 100);
      const bytes = new Uint8Array(await attachment.arrayBuffer());
      if (!isAllowedFile(filename, bytes)) return json(415, { success: false, message: 'Nur PDF, JPG, PNG, DOC und DOCX sind als Anhang erlaubt.' });
      payload.attachment = [{ name: filename, content: Buffer.from(bytes).toString('base64') }];
    }
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      });
      const body: unknown = await response.json().catch(() => null);
      const messageId = body && typeof body === 'object' && 'messageId' in body && typeof body.messageId === 'string' ? body.messageId : null;
      if (!response.ok || !messageId) {
        console.error('Brevo verweigert Anfrage:', response.status);
        return json(502, { success: false, message: 'Ihre Anfrage wurde nicht bestätigt. Bitte versuchen Sie es später erneut oder rufen Sie uns an.' });
      }
      // messageId bestätigt Annahme bei Brevo, nicht den Postfacheingang.
      return json(200, { success: true, messageId });
    } catch {
      console.error('Brevo-Versandverbindung fehlgeschlagen');
      return json(502, { success: false, message: 'Der Versand konnte nicht bestätigt werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.' });
    }
  },
};
