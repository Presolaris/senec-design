import assert from 'node:assert/strict';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { test, beforeEach, after } from 'node:test';
import leadRoute, { decodeConfirmation } from '../api/lead.ts';
import confirmRoute from '../api/confirm.ts';

const originalFetch = globalThis.fetch;
const envKeys = ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'BREVO_LEAD_RECIPIENT', 'LEAD_CONFIRMATION_SECRET'];
const originalEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
beforeEach(() => {
  globalThis.fetch = async () => { throw new Error('Ungeplanter Fetch: reale Netzwerkaufrufe sind in diesen Tests gesperrt'); };
});
after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

const origin = 'https://leipzig-photovoltaik.de';
const endpoint = `${origin}/api/lead/`;
const confirmEndpoint = `${origin}/api/confirm/`;
const internalOrigin = 'https://leipzig-photovoltaik-ppcgxpama-presolaris-projects.vercel.app';
const nativeHeaders = {
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-dest': 'document',
};
const prepare = (form, requestOrigin = origin, url = endpoint) => new Request(url, { method: 'POST', body: form, headers: { origin: requestOrigin } });

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

function confirmationBody(token) {
  const body = new FormData();
  body.set('token', token);
  return body;
}

function encryptedToken(payload) {
  const key = createHash('sha256').update(process.env.LEAD_CONFIRMATION_SECRET).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map(value => value.toString('base64url')).join('.');
}

test('Nur öffentliche Herkunft und POST mit FormData', async () => {
  assert.equal((await leadRoute.fetch(new Request(endpoint))).status, 405);
  assert.equal((await leadRoute.fetch(prepare(form(), 'https://example.invalid'))).status, 403);
  assert.equal((await leadRoute.fetch(new Request(endpoint, { method: 'POST', body: '{}', headers: { origin, 'content-type': 'application/json' } }))).status, 415);
});

test('Lead blockiert fremde, interne, fehlende und null Origins unabhängig von Hostheadern und FetchMetadata', async () => {
  configure();
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ messageId: 'darf-nicht-gesendet-werden' }, { status: 201 });
  };
  for (const requestOrigin of [
    'https://example.invalid', internalOrigin, 'null', null, '',
    'http://leipzig-photovoltaik.de', 'https://leipzig-photovoltaik.de.evil.invalid',
    `${origin}/`, `${origin}:444`,
  ]) {
    const headers = { ...nativeHeaders, host: 'leipzig-photovoltaik.de', 'x-forwarded-host': 'www.leipzig-photovoltaik.de' };
    if (requestOrigin !== null) headers.origin = requestOrigin;
    const response = await leadRoute.fetch(new Request(`${internalOrigin}/api/lead/`, { method: 'POST', body: form(), headers }));
    assert.equal(response.status, 403, `Origin ${requestOrigin}`);
    assert.equal((await response.json()).success, false);
  }
  assert.equal(sends, 0, 'Abgelehnte Origins dürfen keinen Brevo-Aufruf auslösen');
});

test('Lead akzeptiert beide öffentlichen Origins bei interner Vercel-URL und sendet ausschließlich kanonische Mail-Links', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  for (const publicOrigin of [origin, 'https://www.leipzig-photovoltaik.de']) {
    const request = prepare(form(), publicOrigin, `${internalOrigin}/api/lead/`);
    request.headers.set('host', 'attacker.invalid');
    request.headers.set('x-forwarded-host', 'attacker.invalid');
    const response = await leadRoute.fetch(request);
    assert.equal(response.status, 202, publicOrigin);
    assert.equal((await response.json()).success, true);
    const message = sends.at(-1);
    const token = tokenFromMessage(message);
    const canonicalLink = `${confirmEndpoint}?token=${encodeURIComponent(token)}`;
    assert.ok(message.textContent.includes(canonicalLink));
    assert.ok(message.htmlContent.includes(`href="${canonicalLink}"`));
    assert.doesNotMatch(`${message.textContent}\n${message.htmlContent}`, /vercel\.app|attacker\.invalid|https:\/\/www\./);
    assert.ok(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), 'Mail-Link enthält einen gültigen verschlüsselten Token');
  }
  assert.equal(sends.length, 2);
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

test('Der erste Schritt sendet ausschließlich einen genau 24 Stunden gültigen Bestätigungslink mit beiden 24-Stunden-Mailformaten', async t => {
  configure();
  const now = Date.now();
  t.mock.method(Date, 'now', () => now);
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
  assert.match(sends[0].textContent, /innerhalb von 24 Stunden/);
  assert.match(sends[0].htmlContent, /Der Link ist 24 Stunden gültig/);
  assert.doesNotMatch(`${sends[0].textContent}\n${sends[0].htmlContent}`, /30 Minuten/);
  const payload = decodeConfirmation(tokenFromMessage(sends[0]), process.env.LEAD_CONFIRMATION_SECRET);
  assert.ok(payload);
  assert.equal(payload.issuedAt, now);
  assert.equal(payload.expiresAt, now + 24 * 60 * 60 * 1_000);
  assert.equal(payload.expiresAt - payload.issuedAt, 24 * 60 * 60 * 1_000);
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

  const confirmed = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }));
  assert.equal(confirmed.status, 200);
  assert.equal(sends.length, 2);
  assert.deepEqual(sends[1].to, [{ email: 'intern@example.invalid' }]);
  assert.equal(sends[1].replyTo.email, 'qa@example.invalid');
  assert.match(sends[1].textContent, /0341 1234567/);
  assert.match(sends[1].subject, /Bestätigte Anfrage/);
});

test('Native same-origin Browserposts bestätigen ohne Origin und Referer oder mit literal null Origin', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  for (const requestOrigin of [null, 'null']) {
    assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
    const token = tokenFromMessage(sends.at(-1));
    const headers = { ...nativeHeaders };
    if (requestOrigin !== null) headers.origin = requestOrigin;
    const nativePost = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers }));
    assert.match(await nativePost.text(), /Anfrage bestätigt/);
  }
  assert.equal(sends.length, 4);
});

test('Confirm blockiert fremde explizite Origins und unvollständige oder fremde null-Origin-Navigationen', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
  const token = tokenFromMessage(sends[0]);
  const cases = [
    ['fremder expliziter Origin trotz same-origin Metadata', { ...nativeHeaders, origin: 'https://example.invalid' }],
    ['interner Vercel-Origin trotz same-origin Metadata', { ...nativeHeaders, origin: internalOrigin }],
    ['leerer expliziter Origin', { ...nativeHeaders, origin: '' }],
  ];
  for (const requestOrigin of [null, 'null']) {
    const headers = { ...nativeHeaders };
    if (requestOrigin !== null) headers.origin = requestOrigin;
    cases.push(
      [`Origin ${requestOrigin}: cross-site`, { ...headers, 'sec-fetch-site': 'cross-site' }],
      [`Origin ${requestOrigin}: same-site`, { ...headers, 'sec-fetch-site': 'same-site' }],
      [`Origin ${requestOrigin}: kein navigate`, { ...headers, 'sec-fetch-mode': 'cors' }],
      [`Origin ${requestOrigin}: kein document`, { ...headers, 'sec-fetch-dest': 'empty' }],
    );
    for (const key of Object.keys(nativeHeaders)) {
      const incomplete = { ...headers }; delete incomplete[key];
      cases.push([`Origin ${requestOrigin}: ${key} fehlt`, incomplete]);
    }
  }
  for (const [description, headers] of cases) {
    const response = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers }));
    const html = await response.text();
    assert.match(html, /ungültig oder bereits abgelaufen/, description);
    assert.doesNotMatch(html, /Anfrage bestätigt|an unser Beratungsteam weitergegeben\./, description);
    assert.equal(sends.length, 1, `${description}: kein Betreiberlead`);
  }
});

test('Öffentliche Produktions-Origins bleiben bei interner Vercel-Confirm-URL zulässig', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (_url, options) => {
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  for (const publicOrigin of [origin, 'https://www.leipzig-photovoltaik.de']) {
    assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
    const token = tokenFromMessage(sends.at(-1));
    const confirmed = await confirmRoute.fetch(new Request(`${internalOrigin}/api/confirm/`, { method: 'POST', body: confirmationBody(token), headers: { origin: publicOrigin } }));
    assert.match(await confirmed.text(), /Anfrage bestätigt/);
  }
  assert.equal(sends.length, 4);
});

test('Falsche Bestätigungen und Lead-Providerfehler erzeugen keinen Betreiberlead', async () => {
  configure();
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ code: 'invalid_sender' }, { status: 400 });
  };
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 502);
  const invalid = await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=ungueltig`));
  assert.equal(invalid.status, 200);
  assert.match(await invalid.text(), /ungültig oder bereits abgelaufen/);
  assert.equal(sends, 1);
});

test('Ein alter bereits abgelaufener 30-Minuten-Token bleibt in beiden Decodern und bei GET/POST ohne Versand abgewiesen', async t => {
  configure();
  const now = Date.now();
  t.mock.method(Date, 'now', () => now);
  const payload = {
    source: 'kontakt', email: 'qa@example.invalid', name: 'QA Test', phone: '0341 1234567',
    fields: [['nachricht', 'Testanfrage']], issuedAt: now - 31 * 60 * 1_000, expiresAt: now - 60 * 1_000,
  };
  assert.equal(payload.expiresAt - payload.issuedAt, 30 * 60 * 1_000);
  assert.ok(now < payload.issuedAt + 24 * 60 * 60 * 1_000, 'Eine Neuberechnung auf 24 Stunden würde diesen Altlink fälschlich reaktivieren');
  // Derselbe Payload ist mit aktuellen Zeitstempeln gültig; der Ablauf ist der Ablehnungsgrund.
  assert.ok(decodeConfirmation(encryptedToken({ ...payload, issuedAt: now, expiresAt: now + 30 * 60 * 1_000 }), process.env.LEAD_CONFIRMATION_SECRET));
  const token = encryptedToken(payload);
  assert.equal(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), null);
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ messageId: 'darf-nicht-gesendet-werden' }, { status: 201 });
  };
  for (const request of [
    new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`),
    new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }),
  ]) {
    const html = await (await confirmRoute.fetch(request)).text();
    assert.match(html, /ungültig oder bereits abgelaufen/);
    assert.doesNotMatch(html, /Anfrage bestätigt|Anfrage verbindlich bestätigen/);
  }
  assert.equal(sends, 0);
});

test('Ein neu ausgestellter Token bleibt nach 23 Stunden 59 Minuten in Lead-Decoder und Confirm-GET/POST gültig (Brevo-Stub)', async t => {
  configure();
  let now = Date.now();
  const issuedAt = now;
  t.mock.method(Date, 'now', () => now);
  const sends = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `mail-${sends.length}` }, { status: 201 });
  };
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
  const token = tokenFromMessage(sends[0]);
  now = issuedAt + (23 * 60 + 59) * 60 * 1_000;
  assert.ok(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET));
  const get = await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`));
  assert.match(await get.text(), /Anfrage verbindlich bestätigen/);
  assert.equal(sends.length, 1, 'GET löst keinen Provideraufruf aus');
  const post = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }));
  assert.match(await post.text(), /Ihre Anfrage wurde bestätigt und an unser Beratungsteam weitergegeben/);
  assert.equal(sends.length, 2);
  assert.deepEqual(sends[1].to, [{ email: 'intern@example.invalid' }]);
});

test('Neu ausgestellter 24-Stunden-Token ist genau am Ablauf und 1 ms danach in beiden Decodern ungültig, ohne Provideraufruf', async t => {
  configure();
  let now = Date.now();
  const issuedAt = now;
  t.mock.method(Date, 'now', () => now);
  let message;
  globalThis.fetch = async (_url, options) => {
    message = JSON.parse(options.body);
    return Response.json({ messageId: 'bestaetigungs-mail' }, { status: 201 });
  };
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
  const token = tokenFromMessage(message);
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ messageId: 'darf-nicht-gesendet-werden' }, { status: 201 });
  };
  now = issuedAt + 24 * 60 * 60 * 1_000 - 1;
  assert.ok(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), 'Bis 1 ms vor Ablauf gültig');
  assert.match(await (await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`))).text(), /Anfrage verbindlich bestätigen/);
  for (const offset of [0, 1]) {
    now = issuedAt + 24 * 60 * 60 * 1_000 + offset;
    assert.equal(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), null, `Ablauf + ${offset} ms`);
    for (const request of [
      new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`),
      new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }),
    ]) {
      const html = await (await confirmRoute.fetch(request)).text();
      assert.match(html, /ungültig oder bereits abgelaufen/, `Ablauf + ${offset} ms: ${request.method}`);
      assert.match(html, /Neue Bestätigungslinks sind aus Sicherheitsgründen 24 Stunden gültig/);
      assert.doesNotMatch(html, /30 Minuten|Anfrage bestätigt|Anfrage verbindlich bestätigen/);
    }
  }
  assert.equal(sends, 0);
});

test('Authentische Token mit mehr als 24 Stunden, negativer oder Null-Laufzeit werden ohne Provideraufruf abgewiesen', async t => {
  configure();
  const now = Date.now();
  t.mock.method(Date, 'now', () => now);
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ messageId: 'darf-nicht-gesendet-werden' }, { status: 201 });
  };
  for (const [description, issuedAt, expiresAt] of [
    ['24 Stunden + 1 ms', now, now + 24 * 60 * 60 * 1_000 + 1],
    ['negative Laufzeit', now + 2 * 60 * 1_000, now + 60 * 1_000],
    ['Null-Laufzeit', now + 60 * 1_000, now + 60 * 1_000],
  ]) {
    assert.ok(expiresAt > now, 'Ein zukünftiges Ablaufdatum isoliert die Laufzeitprüfung');
    const token = encryptedToken({
      source: 'kontakt', email: 'qa@example.invalid', name: 'QA Test', phone: '0341 1234567',
      fields: [['nachricht', 'Testanfrage']], issuedAt, expiresAt,
    });
    assert.equal(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), null, description);
    for (const request of [
      new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`),
      new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }),
    ]) {
      const html = await (await confirmRoute.fetch(request)).text();
      assert.match(html, /ungültig oder bereits abgelaufen/, `${description}: ${request.method}`);
      assert.doesNotMatch(html, /Anfrage bestätigt|Anfrage verbindlich bestätigen/);
    }
  }
  assert.equal(sends, 0);
});

test('Ein noch gültiger alter 30-Minuten-Token wird bis zu seinem ursprünglichen Ablauf akzeptiert, nicht bis 24 Stunden', async t => {
  configure();
  let now = Date.now();
  const issuedAt = now;
  t.mock.method(Date, 'now', () => now);
  const token = encryptedToken({
    source: 'kontakt', email: 'qa@example.invalid', name: 'QA Test', phone: '0341 1234567',
    fields: [['nachricht', 'Testanfrage']], issuedAt, expiresAt: issuedAt + 30 * 60 * 1_000,
  });
  let sends = 0;
  globalThis.fetch = async () => {
    sends++;
    return Response.json({ messageId: 'altlink-stub' }, { status: 201 });
  };
  now = issuedAt + 30 * 60 * 1_000 - 1;
  assert.ok(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET));
  assert.match(await (await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`))).text(), /Anfrage verbindlich bestätigen/);
  assert.equal(sends, 0);
  assert.match(await (await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }))).text(), /Ihre Anfrage wurde bestätigt und an unser Beratungsteam weitergegeben/);
  assert.equal(sends, 1);
  now = issuedAt + 30 * 60 * 1_000;
  assert.equal(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET), null);
  for (const request of [
    new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`),
    new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }),
  ]) {
    assert.match(await (await confirmRoute.fetch(request)).text(), /ungültig oder bereits abgelaufen/);
  }
  assert.equal(sends, 1, 'Am alten Ablaufdatum keine weiteren Provideraufrufe');
});

test('Brevo-Idempotenz verwendet pro Token dieselbe gültige UUID und verarbeitet einen Replay im Provider-Mock nur einmal', async () => {
  configure();
  const confirmationMails = [];
  const operatorAttempts = [];
  const operatorDeliveries = new Map();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    const message = JSON.parse(options.body);
    if (message.tags.includes('website-anfrage-bestaetigung')) {
      confirmationMails.push(message);
      assert.equal(message.headers, undefined, 'Der Replay-Key gehört nur zur Betreiberbenachrichtigung');
      return Response.json({ messageId: `confirmation-${confirmationMails.length}` }, { status: 201 });
    }
    operatorAttempts.push(message);
    const key = message.headers?.idempotencyKey;
    assert.match(key, /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'UUIDv8 mit gültiger RFC-Variant');
    if (operatorDeliveries.has(key)) {
      return Response.json({ code: 'duplicate_parameter', message: 'Email for the idempotency key has already been processed' }, { status: 400 });
    }
    operatorDeliveries.set(key, message);
    return Response.json({ messageId: `operator-${operatorDeliveries.size}` }, { status: 201 });
  };
  assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
  const token = tokenFromMessage(confirmationMails[0]);
  const first = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }));
  assert.match(await first.text(), /Anfrage bestätigt/);
  assert.equal(operatorDeliveries.size, 1);

  const replay = await confirmRoute.fetch(new Request(`${internalOrigin}/api/confirm/`, { method: 'POST', body: confirmationBody(token), headers: { ...nativeHeaders, origin: 'null' } }));
  const replayHtml = await replay.text();
  assert.match(replayHtml, /Anfrage bereits verarbeitet/);
  assert.match(replayHtml, /keine neue Benachrichtigung ausgelöst/);
  assert.doesNotMatch(replayHtml, /Bestätigung derzeit nicht möglich|Anfrage bestätigt|an unser Beratungsteam weitergegeben/);
  assert.equal(operatorAttempts.length, 2, 'Der zweite API-Aufruf erreicht den Provider-Mock');
  assert.equal(operatorDeliveries.size, 1, 'Der Provider-Mock verarbeitet denselben Key nicht erneut');
  assert.deepEqual(operatorAttempts[0], operatorAttempts[1], 'Gleicher Token sendet denselben Payload und Key');

  const expectedBytes = createHash('sha256').update('leipzig-photovoltaik.de:confirmed-lead:v1\0').update(token).digest().subarray(0, 16);
  expectedBytes[6] = (expectedBytes[6] & 0x0f) | 0x80;
  expectedBytes[8] = (expectedBytes[8] & 0x3f) | 0x80;
  assert.equal(operatorAttempts[0].headers.idempotencyKey.replaceAll('-', ''), expectedBytes.toString('hex'), 'Key bindet den gesamten Crypto-Token an den Versand-Namespace');

  assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
  const differentToken = tokenFromMessage(confirmationMails[1]);
  assert.notEqual(differentToken, token);
  const different = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(differentToken), headers: { origin } }));
  assert.match(await different.text(), /Anfrage bestätigt/);
  assert.equal(operatorAttempts.length, 3);
  assert.equal(operatorDeliveries.size, 2);
  assert.notEqual(operatorAttempts[2].headers.idempotencyKey, operatorAttempts[0].headers.idempotencyKey, 'Verschiedene Tokens verwenden verschiedene UUID-Keys');
});

test('Confirm-Providerfehler 400 oder fehlende messageId zeigen keinen Erfolgstext', async () => {
  configure();
  for (const [description, providerResponse] of [
    ['Provider 400', () => Response.json({ code: 'invalid_sender' }, { status: 400 })],
    ['Provider 400 trotz messageId', () => Response.json({ messageId: 'nicht-erfolgreich' }, { status: 400 })],
    ['Provider 201 ohne messageId', () => Response.json({}, { status: 201 })],
    ['Generischer duplicate_parameter ist kein Idempotenz-Replay', () => Response.json({ code: 'duplicate_parameter', message: 'Duplicate recipient already processed' }, { status: 400 })],
    ['Idempotenz-Hinweis mit anderem Fehlercode', () => Response.json({ code: 'invalid_parameter', message: 'Email for the idempotency key has already been processed' }, { status: 400 })],
    ['Ungültiger Idempotenz-Key ist kein Replay', () => Response.json({ code: 'duplicate_parameter', message: 'Invalid idempotencyKey format' }, { status: 400 })],
    ['Idempotenz-Fehlermeldung bei Provider 500', () => Response.json({ code: 'duplicate_parameter', message: 'Email for the idempotency key has already been processed' }, { status: 500 })],
  ]) {
    const sends = [];
    globalThis.fetch = async (_url, options) => {
      sends.push(JSON.parse(options.body));
      return sends.length === 1 ? Response.json({ messageId: 'bestaetigungs-mail' }, { status: 201 }) : providerResponse();
    };
    assert.equal((await leadRoute.fetch(prepare(form()))).status, 202);
    const token = tokenFromMessage(sends[0]);
    const response = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }));
    const html = await response.text();
    assert.match(html, /Bestätigung derzeit nicht möglich/, description);
    assert.match(html, /konnte noch nicht an unser Beratungsteam weitergegeben werden/, description);
    assert.doesNotMatch(html, /Anfrage bestätigt|Anfrage bereits verarbeitet|Ihre Anfrage wurde bestätigt und an unser Beratungsteam weitergegeben/, description);
    assert.equal(sends.length, 2, description);
    assert.deepEqual(sends[1].to, [{ email: 'intern@example.invalid' }]);
  }
});

test('Alle zehn vorgesehenen Quellen durchlaufen Lead, Confirm-GET ohne Versand und bewussten Confirm-POST (Brevo-Stub)', async () => {
  configure();
  const sends = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    sends.push(JSON.parse(options.body));
    return Response.json({ messageId: `quellen-test-${sends.length}` }, { status: 201 });
  };
  const sources = [
    'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
    'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
    'pv-reinigung-leipzig', 'solarpark-betreuung',
  ];
  assert.equal(new Set(sources).size, 10);
  for (const source of sources) {
    const before = sends.length;
    const data = form(source);
    if (source === 'Exit-Intent-Popup' || source === 'solarrechner') { data.delete('datenschutz'); data.set('privacy', 'on'); }
    assert.equal((await leadRoute.fetch(prepare(data))).status, 202, source);
    assert.equal(sends.length, before + 1, `${source}: nur eine Bestätigungsmail`);
    assert.deepEqual(sends.at(-1).to, [{ email: 'qa@example.invalid', name: 'QA Test' }]);
    const token = tokenFromMessage(sends.at(-1));
    const payload = decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET);
    assert.ok(payload, source);
    assert.equal(payload.source, source);
    assert.equal(payload.expiresAt - payload.issuedAt, 24 * 60 * 60 * 1_000, source);
    const get = await confirmRoute.fetch(new Request(`${confirmEndpoint}?token=${encodeURIComponent(token)}`));
    assert.match(await get.text(), /Anfrage verbindlich bestätigen/, source);
    assert.equal(sends.length, before + 1, `${source}: GET sendet nichts`);
    const post = await confirmRoute.fetch(new Request(confirmEndpoint, { method: 'POST', body: confirmationBody(token), headers: { origin } }));
    assert.match(await post.text(), /Ihre Anfrage wurde bestätigt und an unser Beratungsteam weitergegeben/, source);
    assert.equal(sends.length, before + 2, `${source}: ein Betreiberlead nach POST`);
    assert.deepEqual(sends.at(-1).to, [{ email: 'intern@example.invalid' }]);
    assert.match(sends.at(-1).textContent, new RegExp(`Formular: ${source}`));
  }
  assert.equal(sends.length, 20);
});
