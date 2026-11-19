// Offline only: no browser service, no external fetch, no real messages or secrets.
// Run: node --experimental-strip-types --test qa/test_lead_attribution.mjs
import assert from 'node:assert/strict';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test, beforeEach, after } from 'node:test';
import leadRoute, { decodeConfirmation, forwardConfirmedLead } from '../api/lead.ts';
import confirmRoute from '../api/confirm.ts';

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const envKeys = ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'BREVO_LEAD_RECIPIENT', 'LEAD_CONFIRMATION_SECRET'];
const originalEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
beforeEach(() => {
  globalThis.fetch = async () => { throw new Error('Offline QA: external/unplanned fetch is forbidden'); };
  delete globalThis.window;
  delete globalThis.document;
});
after(() => {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
  if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
const origin = 'https://leipzig-photovoltaik.de';
const key = 'presolaris:lead-first-touch:v1';
const sources = [
  'multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
  'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig',
  'pv-reinigung-leipzig', 'solarpark-betreuung',
];
const attributionSource = await readFile(new URL('../src/lib/leadAttribution.ts', import.meta.url), 'utf8');
const formsSource = await readFile(new URL('../src/lib/leadForms.ts', import.meta.url), 'utf8');
let moduleSequence = 0;
function moduleUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(`${stripTypeScriptTypes(source)}\n// isolated-module-${++moduleSequence}\n`).toString('base64')}`;
}
async function modules() {
  const attrUrl = moduleUrl(attributionSource);
  const attribution = await import(attrUrl);
  const leadForms = await import(moduleUrl(formsSource.replace("'./leadAttribution'", JSON.stringify(attrUrl))));
  return { attribution, leadForms };
}
function memoryStorage(initial = {}, mode = 'normal') {
  const values = new Map(Object.entries(initial));
  const calls = { get: 0, set: 0, remove: 0 };
  return {
    values, calls,
    getItem(name) { calls.get++; if (mode === 'blocked') throw new Error('blocked'); return values.get(name) ?? null; },
    setItem(name, value) { calls.set++; if (mode !== 'normal') throw new Error('read-only'); values.set(name, value); },
    removeItem(name) { calls.remove++; if (mode === 'blocked') throw new Error('blocked'); values.delete(name); },
  };
}
function browser({ href = `${origin}/`, analytics = false, cookie, referrer = '', storage = memoryStorage() } = {}) {
  let win = new EventTarget();
  win.location = new URL(href);
  win.sessionStorage = storage;
  let cookieValue = cookie ?? `cookie-consent=${JSON.stringify({ analytics, marketing: false })}`;
  globalThis.window = win;
  globalThis.document = {
    get cookie() { return cookieValue; },
    set cookie(value) { cookieValue = value; },
    referrer, querySelectorAll: () => [],
  };
  return {
    get win() { return win; }, storage,
    navigateDocument(href, referrer = '') {
      // A full document navigation discards the old window and its listeners.
      win = new EventTarget(); win.location = new URL(href); win.sessionStorage = storage;
      globalThis.window = win; globalThis.document.referrer = referrer;
    },
    consent(analytics) {
      cookieValue = `cookie-consent=${JSON.stringify({ analytics, marketing: false })}`;
      win.dispatchEvent(new CustomEvent('presolaris:consent-updated', { detail: { analytics, marketing: false } }));
    },
    expireCookie() { cookieValue = ''; },
  };
}
function validAttribution(overrides = {}) {
  return {
    entry_path: '/privat/', form_path: '/kontakt/', utm_source: 'google', utm_medium: 'cpc',
    utm_campaign: 'Dach Herbst', utm_content: 'Variante-A', referrer_domain: 'google.com',
    capture_mode: 'consented_first_touch', reporting_limit: '', ...overrides,
  };
}
function configure() {
  Object.assign(process.env, {
    BREVO_API_KEY: 'offline-provider-stub', BREVO_SENDER_EMAIL: 'sender@example.invalid',
    BREVO_LEAD_RECIPIENT: 'operator@example.invalid',
    LEAD_CONFIRMATION_SECRET: 'offline-test-secret-with-more-than-thirty-two-characters',
  });
}
function form(source = 'kontakt', attr) {
  const data = new FormData();
  for (const [name, value] of Object.entries({
    source, email: 'qa@example.invalid', name: 'Offline QA', telefon: '0341 1234567',
    datenschutz: 'on', nachricht: 'Isolierter Test', form_started_at: String(Date.now() - 3_000),
  })) data.set(name, value);
  if (attr !== undefined) data.set('attribution', typeof attr === 'string' ? attr : JSON.stringify(attr));
  return data;
}
function providerStub() {
  const messages = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    messages.push(JSON.parse(options.body));
    return Response.json({ messageId: `offline-${messages.length}` }, { status: 201 });
  };
  return messages;
}
function tokenFromMessage(message) {
  const match = message.htmlContent.match(/token=([^"&]+)/);
  assert.ok(match);
  return decodeURIComponent(match[1]);
}
function encrypt(payload) {
  const iv = randomBytes(12);
  const actualCipher = createCipheriv('aes-256-gcm', createHash('sha256').update(process.env.LEAD_CONFIRMATION_SECRET).digest(), iv);
  const ciphertext = Buffer.concat([actualCipher.update(JSON.stringify(payload), 'utf8'), actualCipher.final()]);
  return [iv, actualCipher.getAuthTag(), ciphertext].map(value => value.toString('base64url')).join('.');
}
function payload(attr, ttl = 24 * 60 * 60 * 1_000) {
  const issuedAt = Date.now() - 1_000;
  return { source: 'kontakt', email: 'qa@example.invalid', name: 'QA', phone: '0341 1234567',
    fields: [['nachricht', '<img src=x onerror="unsafe()"> & "Text"']], issuedAt, expiresAt: issuedAt + ttl,
    ...(attr === undefined ? {} : { attribution: attr }) };
}
async function confirmation(token, method = 'POST') {
  if (method === 'GET') return confirmRoute.fetch(new Request(`${origin}/api/confirm/?token=${encodeURIComponent(token)}`));
  const body = new FormData(); body.set('token', token);
  return confirmRoute.fetch(new Request(`${origin}/api/confirm/`, { method, body, headers: { origin } }));
}

// Browser tests use fresh in-memory ESM instances, not a real page or persistent files.
test('Initial capture at import/layout bind, no storage get/set without strict analytics true', async () => {
  for (const cookie of ['', 'cookie-consent=broken', 'cookie-consent={"analytics":"true"}', 'cookie-consent={"analytics":false,"marketing":true}']) {
    const b = browser({ href: `${origin}/privat/?utm_source=google&utm_medium=cpc#secret`, cookie, referrer: 'https://google.com/search?q=private' });
    const { attribution, leadForms } = await modules();
    b.win.location = new URL(`${origin}/kontakt/?utm_source=later#later`);
    leadForms.bindLeadForms();
    const attr = attribution.getLeadAttribution();
    assert.equal(attr.entry_path, '/privat/'); assert.equal(attr.form_path, '/kontakt/');
    assert.equal(attr.utm_source, 'google'); assert.equal(attr.referrer_domain, 'google.com');
    assert.equal(attr.capture_mode, 'current_page_fallback'); assert.equal(attr.reporting_limit, 'no_analytics_consent');
    assert.equal(b.storage.calls.get, 0); assert.equal(b.storage.calls.set, 0);
    assert.equal(b.storage.values.size, 0);
  }
});

test('Consent grant stores sanitized original current-document URL, later UTM never overwrite first touch', async () => {
  const b = browser({ href: `${origin}/privat/?utm_source=first&utm_medium=cpc&utm_campaign=Herbst&utm_content=A`, referrer: 'https://www.google.com/search?email=private' });
  const { attribution } = await modules();
  b.win.location = new URL(`${origin}/kontakt/?utm_source=second`);
  b.consent(true);
  const first = attribution.getLeadAttribution();
  assert.equal(first.entry_path, '/privat/'); assert.equal(first.utm_source, 'first');
  assert.equal(first.utm_medium, 'cpc'); assert.equal(first.utm_campaign, 'Herbst'); assert.equal(first.utm_content, 'A');
  assert.equal(first.capture_mode, 'consented_first_touch'); assert.equal(first.reporting_limit, '');
  const stored = JSON.parse(b.storage.values.get(key));
  b.navigateDocument(`${origin}/service/?utm_source=third&utm_campaign=overwrite`, `${origin}/privat/?private=yes`);
  const next = await modules();
  assert.equal(next.attribution.getLeadAttribution().entry_path, '/privat/');
  assert.equal(next.attribution.getLeadAttribution().form_path, '/service/');
  assert.equal(next.attribution.getLeadAttribution().utm_source, 'first');
  assert.equal(next.attribution.getLeadAttribution().utm_campaign, 'Herbst');
  assert.deepEqual(JSON.parse(b.storage.values.get(key)), stored);
});

test('Raw and URL-encoded cookie-consent are compatible; event alone and another cookie key never grant analytics', async () => {
  for (const cookie of [
    `cookie-consent=${JSON.stringify({ analytics: true, marketing: false })}`,
    `cookie-consent=${encodeURIComponent(JSON.stringify({ analytics: true, marketing: false }))}`,
  ]) {
    const b = browser({ cookie, href: `${origin}/privat/?utm_source=first` });
    const { attribution } = await modules();
    assert.equal(attribution.getLeadAttribution().capture_mode, 'consented_first_touch');
    assert.ok(b.storage.values.has(key));
  }
  const b = browser({ cookie: 'pv-cookie-consent={"analytics":true,"marketing":false}' });
  const { attribution } = await modules();
  b.win.dispatchEvent(new CustomEvent('presolaris:consent-updated', { detail: { analytics: true, marketing: true } }));
  assert.equal(attribution.getLeadAttribution().reporting_limit, 'no_analytics_consent');
  assert.equal(b.storage.calls.get, 0); assert.equal(b.storage.calls.set, 0);
});

test('Missing first-touch UTMs are empty and not backfilled from a later campaign', async () => {
  const b = browser({ analytics: true, href: `${origin}/privat/` });
  await modules();
  b.navigateDocument(`${origin}/kontakt/?utm_source=later&utm_medium=cpc&utm_campaign=Later&utm_content=A`);
  const { attribution } = await modules();
  assert.equal(attribution.getLeadAttribution().utm_source, '');
  assert.equal(attribution.getLeadAttribution().utm_medium, '');
  assert.equal(attribution.getLeadAttribution().utm_campaign, '');
  assert.equal(attribution.getLeadAttribution().utm_content, '');
});

test('Denied navigation never reconstructs the earlier document; all four earlier UTMs are unavailable', async () => {
  const b = browser({ href: `${origin}/privat/?utm_source=first&utm_medium=cpc&utm_campaign=Herbst&utm_content=A` });
  await modules();
  b.navigateDocument(`${origin}/kontakt/`, `${origin}/privat/?utm_source=first&utm_medium=cpc`);
  const { attribution } = await modules();
  const attr = attribution.getLeadAttribution();
  assert.equal(attr.entry_path, '/kontakt/'); assert.equal(attr.referrer_domain, '');
  for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) assert.equal(attr[name], '');
  assert.equal(attr.capture_mode, 'current_page_fallback');
  assert.equal(b.storage.calls.get, 0); assert.equal(b.storage.calls.set, 0);
});

test('Withdrawal deletes first touch, never reads/writes denied storage, acceptance on a later document starts there', async () => {
  const b = browser({ analytics: true, href: `${origin}/privat/?utm_source=first` });
  const { attribution } = await modules();
  assert.ok(b.storage.values.has(key));
  const calls = { ...b.storage.calls };
  b.consent(false);
  const attr = attribution.getLeadAttribution();
  assert.equal(attr.capture_mode, 'current_page_fallback'); assert.equal(b.storage.values.has(key), false);
  assert.equal(b.storage.calls.get, calls.get); assert.equal(b.storage.calls.set, calls.set);
  b.navigateDocument(`${origin}/kontakt/?utm_source=current`);
  const next = await modules();
  b.consent(true);
  assert.equal(next.attribution.getLeadAttribution().entry_path, '/kontakt/');
  assert.equal(next.attribution.getLeadAttribution().utm_source, 'current');
});

test('Expired consent in same document and reload deletes stale first touch before a new grant', async () => {
  const b = browser({ analytics: true, href: `${origin}/privat/?utm_source=old` });
  const { attribution } = await modules();
  b.expireCookie();
  assert.equal(attribution.getLeadAttribution().reporting_limit, 'no_analytics_consent');
  assert.equal(b.storage.values.has(key), false);
  b.storage.values.set(key, JSON.stringify(validAttribution({ utm_source: 'stale' })));
  b.navigateDocument(`${origin}/kontakt/`);
  const next = await modules();
  assert.equal(b.storage.values.has(key), false);
  b.consent(true);
  assert.equal(next.attribution.getLeadAttribution().utm_source, '');
  assert.equal(next.attribution.getLeadAttribution().entry_path, '/kontakt/');
});

test('Malformed, array and structurally incomplete storage repaired; read-only/blocked storage falls back without throwing', async () => {
  for (const raw of ['broken{', '[]', '{}', '{"capture_mode":"consented_first_touch","reporting_limit":""}', 'x'.repeat(5000)]) {
    const b = browser({ analytics: true, href: `${origin}/kontakt/?utm_source=current`, storage: memoryStorage({ [key]: raw }) });
    const { attribution } = await modules();
    assert.equal(attribution.getLeadAttribution().utm_source, 'current');
    assert.equal(JSON.parse(b.storage.values.get(key)).entry_path, '/kontakt/');
  }
  for (const mode of ['readonly', 'blocked']) {
    const b = browser({ analytics: true, href: `${origin}/kontakt/?utm_source=current`, storage: memoryStorage({ [key]: JSON.stringify(validAttribution()) }, mode) });
    const { attribution } = await modules();
    assert.equal(attribution.getLeadAttribution().utm_source, 'current');
    assert.equal(attribution.getLeadAttribution().capture_mode, 'current_page_fallback');
    assert.equal(attribution.getLeadAttribution().reporting_limit, 'session_storage_unavailable');
    b.consent(false); assert.doesNotThrow(() => attribution.getLeadAttribution());
  }
});

test('Path allowlist, query/hash removal, referrer domain only and UTM PII rejection before truncation', async () => {
  browser();
  const { attribution: a } = await modules();
  assert.equal(a.sanitizeLeadPath('/kontakt/?email=private#private'), '/kontakt/');
  for (const path of ['/api/confirm/', '/admin/', '/analytics/', '/dashboard/', '/customer/jane@example.org', '//evil.org/', 'javascript:unsafe()', `/${'a'.repeat(201)}`, '/kontakt/%0a']) assert.equal(a.sanitizeLeadPath(path), '');
  for (const pii of ['https://example.org/private', 'example.org', 'www.example.org', 'jane@example.org', 'mailto:jane@example.org', '+49 341 1234567', 'Tel 0341-1234567', 'x'.repeat(150) + 'jane@example.org', '%2520private', '<script>unsafe()</script>']) assert.equal(a.sanitizeLeadUtm(pii), '', pii);
  assert.equal(a.sanitizeLeadUtm('google\n\u0000'), 'google');
  assert.equal(a.sanitizeLeadUtm('a'.repeat(150)).length, 120);
  assert.equal(a.sanitizeLeadUtm('PV Herbst 2026_A'), 'PV Herbst 2026_A');
  for (const referrer of ['javascript:unsafe()', 'ftp://google.com/private', `${origin}/privat/?email=private`, 'https://preview.vercel.app/', 'https://localhost/path', 'https://user:pass@google.com/private']) {
    browser({ referrer });
    assert.equal((await modules()).attribution.getLeadAttribution().referrer_domain, '', referrer);
  }
  browser({ referrer: 'https://WWW.GOOGLE.COM:443/search?email=private#private' });
  assert.equal((await modules()).attribution.getLeadAttribution().referrer_domain, 'www.google.com');
});

test('All ten sources pass central postLead attribution and accepted event; no direct GA or consent changes', async () => {
  const b = browser({ analytics: true, href: `${origin}/privat/?utm_source=google` });
  const { leadForms } = await modules();
  const events = [];
  b.win.addEventListener('presolaris:lead-accepted', event => events.push(event.detail));
  b.win.location = new URL(`${origin}/kontakt/?email=private#private`);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/lead/');
    const attr = JSON.parse(options.body.get('attribution'));
    assert.equal(attr.entry_path, '/privat/'); assert.equal(attr.form_path, '/kontakt/'); assert.equal(attr.utm_source, 'google');
    assert.equal(Object.hasOwn(attr, 'email'), false);
    return Response.json({ success: true, verificationRequired: true, messageId: `offline-${options.body.get('source')}` }, { status: 202 });
  };
  for (const source of sources) {
    const data = form(source, { email: 'never-keep@example.invalid' });
    data.set('access_key', 'must-delete'); data.set('redirect', 'must-delete');
    await leadForms.postLead(data);
    assert.equal(data.has('access_key'), false); assert.equal(data.has('redirect'), false);
  }
  assert.equal(events.length, 10);
  assert.deepEqual(events.map(event => event.form_name), sources);
  for (const event of events) assert.deepEqual(Object.keys(event).sort(), ['form_name', 'page', 'receipt']);
  assert.equal(events[0].page, '/kontakt/');
  assert.equal(b.storage.values.get(key).includes('offline-'), false, 'receipt is never stored');
  assert.doesNotMatch(formsSource + attributionSource, /gtag\s*\(|dataLayer/);
});

test('Accepted event only after HTTP success + success + verificationRequired + string messageId, never unsafe source', async () => {
  const b = browser(); const { leadForms } = await modules(); let events = 0;
  b.win.addEventListener('presolaris:lead-accepted', () => events++);
  for (const [status, body] of [
    [400, { success: true, verificationRequired: true, messageId: 'x' }],
    [202, { success: false, verificationRequired: true, messageId: 'x' }],
    [202, { success: true, verificationRequired: false, messageId: 'x' }],
    [202, { success: true, verificationRequired: true }],
    [202, { success: true, verificationRequired: true, messageId: 1 }],
  ]) {
    globalThis.fetch = async () => Response.json(body, { status });
    await assert.rejects(leadForms.postLead(form()));
  }
  globalThis.fetch = async () => Response.json({ success: true, verificationRequired: true, messageId: 'x' }, { status: 202 });
  await leadForms.postLead(form('<unsafe-source>'));
  assert.equal(events, 0);
});

test('All sources: optional attribution survives AES token, GET never forwards, German identical block only on confirmed POST', async () => {
  configure(); const messages = providerStub();
  for (const source of sources) {
    const initial = await leadRoute.fetch(new Request(`${origin}/api/lead/`, { method: 'POST', body: form(source, validAttribution()), headers: { origin } }));
    assert.equal(initial.status, 202);
    const message = messages.at(-1); assert.equal(message.to[0].email, 'qa@example.invalid');
    assert.doesNotMatch(message.textContent, /Herkunft der Anfrage/);
    const token = tokenFromMessage(message);
    const decoded = decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET);
    assert.deepEqual(decoded.attribution, validAttribution());
    assert.equal(decoded.expiresAt - decoded.issuedAt, 24 * 60 * 60 * 1_000);
    const count = messages.length;
    assert.match(await (await confirmation(token, 'GET')).text(), /Anfrage verbindlich bestätigen/);
    assert.equal(messages.length, count);
    assert.match(await (await confirmation(token)).text(), /Anfrage wurde bestätigt/);
    const notification = messages.at(-1);
    assert.equal(notification.to[0].email, 'operator@example.invalid');
    for (const label of ['Herkunft der Anfrage', 'Einstiegsseitenpfad: /privat/', 'Formularseitenpfad: /kontakt/', 'utm_source: google', 'Verweis-Domain: google.com', 'Erfassungsgrenze:']) assert.ok(notification.textContent.includes(label));
    await forwardConfirmedLead(decoded);
    assert.equal(messages.at(-1).textContent, notification.textContent);
    assert.equal(messages.at(-1).htmlContent, notification.htmlContent);
  }
  assert.equal(messages.length, 30);
});

test('Both independent functions strip untrusted attribution and escape every notification HTML value', async () => {
  configure(); const messages = providerStub();
  const raw = validAttribution({
    entry_path: '/privat/?email=private#private', form_path: '/kontakt/?phone=private#private',
    utm_source: 'https://example.org/private', utm_medium: 'jane@example.org',
    utm_campaign: '+49 341 1234567', utm_content: 'safe\u0000\n',
    referrer_domain: 'https://google.com/private', email: 'extra@example.org', receipt: 'never-store',
  });
  const response = await leadRoute.fetch(new Request(`${origin}/api/lead/`, { method: 'POST', body: form('kontakt', raw), headers: { origin } }));
  assert.equal(response.status, 202);
  const decoded = decodeConfirmation(tokenFromMessage(messages[0]), process.env.LEAD_CONFIRMATION_SECRET);
  assert.deepEqual(decoded.attribution, validAttribution({ utm_source: '', utm_medium: '', utm_campaign: '', utm_content: 'safe', referrer_domain: '' }));
  // Construct an authenticated malicious token directly: confirm must independently sanitize it.
  const token = encrypt(payload(raw));
  assert.match(await (await confirmation(token)).text(), /Anfrage wurde bestätigt/);
  const notification = messages.at(-1);
  assert.match(notification.htmlContent, /&lt;img src=x onerror=&quot;unsafe\(\)&quot;&gt; &amp; &quot;Text&quot;/);
  assert.doesNotMatch(notification.htmlContent, /<img|<script|jane@example\.org|example\.org\/private|extra@example|never-store|\+49 341 1234567|phone=private|email=private/);
  assert.match(notification.textContent, /utm_source: nicht erfasst/);
  assert.match(notification.textContent, /utm_content: safe/);
  await forwardConfirmedLead(payload(raw));
  assert.equal(messages.at(-1).htmlContent, notification.htmlContent);
});

test('Malformed/overlong optional attribute does not break leads; old tokens remain compatible and expired tokens do not forward', async () => {
  configure(); const messages = providerStub();
  for (const raw of [undefined, 'broken{', '[]', 'null', 'x'.repeat(4097)]) {
    const initial = await leadRoute.fetch(new Request(`${origin}/api/lead/`, { method: 'POST', body: form('kontakt', raw), headers: { origin } }));
    assert.equal(initial.status, 202);
    const decoded = decodeConfirmation(tokenFromMessage(messages.at(-1)), process.env.LEAD_CONFIRMATION_SECRET);
    assert.equal(decoded.attribution, undefined);
  }
  for (const ttl of [30 * 60 * 1_000, 24 * 60 * 60 * 1_000]) {
    const token = encrypt(payload(undefined, ttl));
    assert.ok(decodeConfirmation(token, process.env.LEAD_CONFIRMATION_SECRET));
    assert.match(await (await confirmation(token)).text(), /Anfrage wurde bestätigt/);
    assert.doesNotMatch(messages.at(-1).textContent, /Herkunft der Anfrage/);
  }
  const count = messages.length;
  const old = payload(undefined); old.expiresAt = Date.now();
  const expired = encrypt(old);
  assert.equal(decodeConfirmation(expired, process.env.LEAD_CONFIRMATION_SECRET), null);
  assert.match(await (await confirmation(expired)).text(), /ungültig oder bereits abgelaufen/);
  assert.equal(messages.length, count);
});

test('Fallback notification explicitly states absent consent/reporting limitation', async () => {
  configure(); const messages = providerStub();
  await confirmation(encrypt(payload(validAttribution({ capture_mode: 'current_page_fallback', reporting_limit: 'no_analytics_consent', utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '' }))));
  assert.match(messages[0].textContent, /aktuelles Dokument, Fallback/);
  assert.match(messages[0].textContent, /kein belegter Mehrseiten-Erstbesuch/);
  assert.match(messages[0].textContent, /Keine Analytics-Einwilligung.*frühere Seiten\/UTMs unbekannt/);
});

test('Request limits use actual bytes without trusting Content-Length; field count unchanged with one attribution field', async () => {
  configure(); const messages = providerStub();
  const data = form('kontakt', validAttribution());
  for (let i = [...data.keys()].length; i < 55; i++) data.set(`ignored-${i}`, 'x');
  assert.equal((await leadRoute.fetch(new Request(`${origin}/api/lead/`, { method: 'POST', body: data, headers: { origin } }))).status, 202);
  data.set('too-many', 'x');
  assert.equal((await leadRoute.fetch(new Request(`${origin}/api/lead/`, { method: 'POST', body: data, headers: { origin } }))).status, 413);
  const oversized = form(); oversized.set('ignored-large', 'x'.repeat(4 * 1024 * 1024));
  const count = messages.length;
  const request = new Request(`${origin}/api/lead/`, { method: 'POST', body: oversized, headers: { origin, 'content-length': '1' } });
  assert.equal((await leadRoute.fetch(request)).status, 413);
  const bigConfirm = new FormData(); bigConfirm.set('token', 'x'.repeat(800 * 1024));
  assert.match(await (await confirmRoute.fetch(new Request(`${origin}/api/confirm/`, { method: 'POST', body: bigConfirm, headers: { origin, 'content-length': '1' } }))).text(), /ungültig oder bereits abgelaufen/);
  assert.equal(messages.length, count);
});

test('Independent function imports stay node-only; public path allowlists and sanitizers remain aligned', async () => {
  const lead = await readFile(new URL('../api/lead.ts', import.meta.url), 'utf8');
  const confirm = await readFile(new URL('../api/confirm.ts', import.meta.url), 'utf8');
  for (const code of [lead, confirm]) {
    assert.doesNotMatch(code, /(?:from\s+|import\s*)['"]\.{1,2}\//);
    assert.match(code, /import .* from 'node:crypto'/);
  }
  const paths = code => [...code.match(/const (?:ATTRIBUTION_)?PUBLIC_PATHS = new Set\(\[([\s\S]*?)\]\);/)[1].matchAll(/'([^']+)'/g)].map(match => match[1]).sort();
  assert.deepEqual(paths(lead), paths(confirm)); assert.deepEqual(paths(lead), paths(attributionSource));
});
