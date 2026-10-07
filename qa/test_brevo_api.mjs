import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import route from '../api/lead.ts';

const originalFetch = globalThis.fetch;
const originalEnv = {
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_LEAD_RECIPIENT: process.env.BREVO_LEAD_RECIPIENT,
};
after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
const endpoint = 'https://leipzig-photovoltaik.de/api/lead';
const prepare = (form, origin = 'https://leipzig-photovoltaik.de') => new Request(endpoint, {
  method: 'POST', body: form, headers: { origin },
});
function form(source = 'kontakt') {
  const data = new FormData();
  for (const [k, v] of Object.entries({
    source, email: 'qa@example.invalid', vorname: 'QA Test', nachname: 'Person',
    telefon: '0341 1234567', datenschutz: 'on', nachricht: 'Testanfrage',
  })) data.set(k, v);
  return data;
}
const invoke = async request => ({ response: await route.fetch(request) });

test('Nur gleiche Herkunft und POST mit FormData', async () => {
  assert.equal((await invoke(new Request(endpoint))).response.status, 405);
  assert.equal((await invoke(prepare(form(), 'https://example.invalid'))).response.status, 403);
  assert.equal((await invoke(new Request(endpoint, { method: 'POST', body: '{}' , headers: { origin: 'https://leipzig-photovoltaik.de', 'content-type': 'application/json' } }))).response.status, 415);
});

test('Quellen, E-Mail, Einwilligung und unkonfigurierter Provider', async () => {
  delete process.env.BREVO_API_KEY;
  assert.equal((await invoke(prepare(form('irgendein-fremdes-formular')))).response.status, 400);
  const badEmail = form(); badEmail.set('email', 'ungueltig');
  assert.equal((await invoke(prepare(badEmail))).response.status, 400);
  const withoutConsent = form(); withoutConsent.delete('datenschutz');
  assert.equal((await invoke(prepare(withoutConsent))).response.status, 400);
  assert.equal((await invoke(prepare(form()))).response.status, 503);
});

test('Nur der feste Betreiberempfänger und verifizierte Konfiguration gehen an Brevo', async () => {
  Object.assign(process.env, {
    BREVO_API_KEY: 'test-secret',
    BREVO_SENDER_EMAIL: 'absender@example.invalid',
    BREVO_LEAD_RECIPIENT: 'intern@example.invalid',
  });
  let sends = 0;
  globalThis.fetch = async (url, options) => {
    sends++;
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    assert.equal(options.headers['api-key'], 'test-secret');
    const data = JSON.parse(options.body);
    assert.deepEqual(data.to, [{ email: 'intern@example.invalid' }]);
    assert.equal(data.sender.email, 'absender@example.invalid');
    assert.equal(data.replyTo.email, 'qa@example.invalid');
    assert.match(data.textContent, /Testanfrage/);
    assert.doesNotMatch(data.textContent, /access_key/);
    return Response.json({ messageId: 'Brevo-Test-Message-ID' }, { status: 201 });
  };
  const input = form(); input.set('to', 'fremd@example.invalid');
  input.set('access_key', 'oeffentlicher-vorheriger-schluessel');
  const { response } = await invoke(prepare(input));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(sends, 1);
});

test('Provider-Ablehnung und Netzfehler erzeugen niemals Erfolg', async () => {
  globalThis.fetch = async () => Response.json({ code: 'invalid_sender' }, { status: 400 });
  assert.equal((await invoke(prepare(form()))).response.status, 502);
  globalThis.fetch = async () => { throw new Error('Netzwerk'); };
  assert.equal((await invoke(prepare(form()))).response.status, 502);
});

test('Dateityp, Größenlimit und Base64-Anhang', async () => {
  const big = form('multi_step_form');
  big.set('attachment', new File([new Uint8Array(3 * 1024 * 1024 + 1)], 'zu-gross.pdf', { type: 'application/pdf' }));
  assert.equal((await invoke(prepare(big))).response.status, 413);
  const unsafe = form('multi_step_form');
  unsafe.set('attachment', new File(['Schein-PDF'], 'schein.pdf', { type: 'application/pdf' }));
  assert.equal((await invoke(prepare(unsafe))).response.status, 415);
  const valid = form('multi_step_form');
  valid.set('attachment', new File(['%PDF-1.7\n%%EOF'], 'angebot.pdf', { type: 'application/pdf' }));
  globalThis.fetch = async (_url, options) => {
    const data = JSON.parse(options.body);
    assert.equal(data.attachment[0].name, 'angebot.pdf');
    assert.match(Buffer.from(data.attachment[0].content, 'base64').toString(), /^%PDF/);
    return Response.json({ messageId: 'mit-Anhang' }, { status: 201 });
  };
  assert.equal((await invoke(prepare(valid))).response.status, 200);
});

test('Calculator-, Landingpage- und Exit-Intent-Quelle sind vorgesehen', async () => {
  globalThis.fetch = async (_url, options) => {
    assert.equal(JSON.parse(options.body).to[0].email, 'intern@example.invalid');
    return Response.json({ messageId: 'sonstige' }, { status: 201 });
  };
  for (const source of ['solarrechner', 'pv-wartung-leipzig', 'gewerbe-photovoltaik-leipzig', 'Exit-Intent-Popup']) {
    const data = form(source);
    if (source === 'Exit-Intent-Popup') { data.delete('datenschutz'); data.set('privacy', 'on'); }
    if (source === 'solarrechner') { data.delete('datenschutz'); data.set('privacy', 'on'); }
    assert.equal((await invoke(prepare(data))).response.status, 200, source);
  }
});
