import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import leadRoute from '../api/lead.ts';
import confirmRoute from '../api/confirm.ts';

const originalFetch = globalThis.fetch;
const envKeys = ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'BREVO_LEAD_RECIPIENT', 'LEAD_CONFIRMATION_SECRET'];
const originalEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

const origin = 'https://leipzig-photovoltaik.de';
const endpoint = `${origin}/api/lead/`;
const confirmEndpoint = `${origin}/api/confirm/`;
const prepare = (form, requestOrigin = origin) => new Request(endpoint, { method: 'POST', body: form, headers: { origin: requestOrigin } });

function form(source = 'kontakt') {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    source, email: 'qa@example.invalid', vorname: 'QA Test', nachname: 'Person',
    telefon: '0341 1234567', datenschutz: 'on', nachricht: 'Testanfrage',
    form_started_at: String(Date.now() - 3_000),
  })) data.set(key, value);
  return data;
}

function configure() {
  Object.assign(process.env, {
    BREVO_API_KEY: 'test-secret',
    BREVO_SENDER_EMAIL: 'absender@example.invalid',
    BREVO_LEAD_RECIPIENT: 'intern@example.invalid',
    LEAD_CONFIRMATION_SECRET: 'this-is-a-test-secret-with-at-least-thirty-two-characters',
  });
}

function tokenFromMessage(payload) {
  const match = payload.htmlContent.match(/token=([^"&]+)/);
  assert.ok(match, 'Bestätigungslink fehlt');
  return decodeURIComponent(match[1]);
}

test('Nur gleiche Herkunft und POST mit FormData', async () => {
  assert.equal((await leadRoute.fetch(new Request(endpoint))).status, 405);
  assert.equal((await leadRoute.fetch(prepare(form(), 'https://example.invalid'))).status, 403);
  assert.equal((await leadRoute.fetch(new Request(endpoint, { method: 'POST', body: '{}', headers: { origin, 'content-type': 'application/json' } }))).status, 415);
});

test('Telefon, Einwilligung, Ausfüllzeit, Quelle und Honeypot werden serverseitig erzwungen', async () => {
  configure();
  for (const [description, mutate] of [
    ['unbekannte Quelle', data => data.set('source', 'fremd')],
    ['ungültige E-Mail', data => data.set('email', 'ungültig')],
    ['fehlende Telefonnummer', data => data.delete('telefon')],
    ['ungültige Telefonnummer', data => data.set('telefon', 'nicht-telefon')],
    ['fehlende Einwilligung', data => data.delete('datenschutz')],
    ['zu schneller Submit', data => data.set('form_started_at', String(Date.now()))],
    ['gefüllter Honeypot', data => data.set('website', 'https://spam.invalid')],
  ]) {
    const data = form();
    mutate(data);
    assert.equal((await leadRoute.fetch(prepare(data))).status, 400, description);
  }
});

test('Der erste Schritt sendet ausschließlich einen Bestätigungslink an die angegebene E-Mail', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: 'bestaetigungs-mail' }, { status: 201 });
  };
  const response = await leadRoute.fetch(prepare(form()));
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { success: true, verificationRequired: true, messageId: 'bestaetigungs-mail' });
  assert.equal(sends.length, 1);
  assert.deepEqual(sends[0].to, [{ email: 'qa@example.invalid', name: 'QA Test' }]);
  assert.doesNotMatch(sends[0].htmlContent, /intern@example\.invalid/);
  assert.match(sends[0].subject, /bestätigen/i);
});

test('Erst die bewusste POST-Bestätigung gibt den Lead an den festen Betreiberempfänger weiter', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  const initial = await leadRoute.fetch(prepare(form('pv-wartung-leipzig')));
  assert.equal(initial.status, 202);
  const token = tokenFromMessage(sends[0]);

  const get = await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`));
  assert.equal(get.status, 200);
  assert.match(await get.text(), /Anfrage verbindlich bestätigen/);
  assert.equal(sends.length, 1, 'GET darf noch keinen Betreiberlead auslösen');

  const body = new FormData(); body.set('token', token);
  const confirmed = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body, headers: { origin } }));
  assert.equal(confirmed.status, 200);
  assert.equal(sends.length, 2);
  assert.deepEqual(sends[1].to, [{ email: 'intern@example.invalid' }]);
  assert.equal(sends[1].replyTo.email, 'qa@example.invalid');
  assert.match(sends[1].textContent, /0341 1234567/);
  assert.match(sends[1].subject, /Bestätigte Anfrage/);
});

test('Native same-origin Browserposts bestätigen auch ohne Origin und Referer, fremde Navigationen nicht', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  await leadRoute.fetch(prepare(form()));
  const token = tokenFromMessage(sends[0]);
  const body = new FormData(); body.set('token', token);
  const nativeHeaders = {
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
  };
  const nativePost = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body, headers: nativeHeaders }));
  assert.match(await nativePost.text(), /Anfrage bestätigt/);
  assert.equal(sends.length, 2);

  const crossSiteBody = new FormData(); crossSiteBody.set('token', token);
  const crossSite = await confirmRoute.fetch(new Request(confirmEndpoint, {
    method: 'POST', body: crossSiteBody,
    headers: { ...nativeHeaders, 'sec-fetch-site': 'cross-site' },
  }));
  assert.match(await crossSite.text(), /ungültig oder bereits abgelaufen/);
  assert.equal(sends.length, 2);
});

test('Falsche oder abgelaufene Bestätigungen sowie Providerfehler erzeugen keinen Betreiberlead', async () => {
  configure();
  globalThis.fetch = async () => Response.json({ code: 'invalid_sender' }, { status: 400 });
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 502);
  const invalid = await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=ungueltig`));
  assert.equal(invalid.status, 200);
  assert.match(await invalid.text(), /ungültig oder bereits abgelaufen/);
});

test('Alle vorgesehenen Quellen akzeptieren ausschließlich den Bestätigungsschritt', async () => {
  configure();
  globalThis.fetch = async () => Response.json({ messageId: 'quellen-test' }, { status: 201 });
  for (const source of ['solarrechner', 'pv-wartung-leipzig', 'gewerbe-photovoltaik-leipzig', 'Exit-Intent-Popup']) {
    const data = form(source);
    if (source === 'Exit-Intent-Popup' || source === 'solarrechner') { data.delete('datenschutz'); data.set('privacy', 'on'); }
    assert.equal((await leadRoute.fetch(prepare(data))).status, 202, source);
  }
});
