import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse } from '@astrojs/compiler';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
assert.equal(root, '/home/ubuntu/pv-preview-kontakt-messbarkeit-20261119-RoIv');
const analyticsPath = path.join(root, 'src/lib/contactAnalytics.ts');
const cookiePath = path.join(root, 'src/components/CookieBanner.astro');
const layoutPath = path.join(root, 'src/layouts/Layout.astro');
const analyticsCode = (await build({ entryPoints: [analyticsPath], bundle: true, write: false,
  platform: 'browser', format: 'iife', globalName: 'contactAnalytics', logLevel: 'silent' })).outputFiles[0].text;
const leadCode = (await build({ entryPoints: [path.join(root, 'src/lib/leadForms.ts')], bundle: true,
  write: false, platform: 'browser', format: 'iife', globalName: 'leadForms', logLevel: 'silent' })).outputFiles[0].text;
const cookieSource = fs.readFileSync(cookiePath, 'utf8');
const cookieScript = cookieSource.match(/<script>([\s\S]*?)<\/script>/)[1];
const cookieCode = (await build({ stdin: { contents: cookieScript, loader: 'ts', resolveDir: path.dirname(cookiePath) },
  bundle: true, write: false, platform: 'browser', format: 'iife', logLevel: 'silent' })).outputFiles[0].text;

class EventHub {
  listeners = new Map();
  addEventListener(type, handler) {
    const list = this.listeners.get(type) || [];
    list.push(handler); this.listeners.set(type, list);
  }
  dispatchEvent(event) {
    if (!event.target) event.target = this;
    for (const handler of this.listeners.get(event.type) || []) handler(event);
    return true;
  }
}
class FakeElement extends EventHub {
  constructor(tag = 'span', parent = null) {
    super(); this.tagName = tag; this.parent = parent;
    this.classList = { values: new Set(['hidden']), add(value) { this.values.add(value); },
      remove(value) { this.values.delete(value); }, contains(value) { return this.values.has(value); } };
    this.checked = false;
  }
  closest(selector) {
    if (selector === 'a[href]' && this instanceof FakeAnchor) return this;
    return this.parent?.closest(selector) || null;
  }
}
class FakeAnchor extends FakeElement {
  constructor(href) { super('a'); this.href = href; }
  getAttribute(name) { return name === 'href' ? this.href : null; }
}
class FakeCustomEvent {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; this.target = null; }
}
const ids = [...cookieSource.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
function setup({ cookie = '', href = 'https://preview.invalid/kontakt/?utm_campaign=person%40example.test&phone=%2B493410000000#private',
  referrer = 'https://name:password@google.com/search?q=person%40example.test#private', readyState = 'complete', code = analyticsCode } = {}) {
  const window = new EventHub(); const document = new EventHub();
  const location = new URL(href); const elements = new Map(ids.map(id => [id, new FakeElement()]));
  const cookies = new Map(); const cookieWrites = [];
  if (cookie) cookies.set('cookie-consent', cookie);
  Object.defineProperty(document, 'cookie', {
    get() { return [...cookies].map(([name, value]) => `${name}=${value}`).join('; '); },
    set(value) {
      cookieWrites.push(value);
      const [entry] = value.split(';'); const index = entry.indexOf('=');
      const name = entry.slice(0, index); const contents = entry.slice(index + 1);
      if (/Max-Age=0/i.test(value)) cookies.delete(name); else cookies.set(name, contents);
    },
  });
  const scripts = []; const allRequests = [];
  document.head = { appendChild(script) {
    scripts.push(script);
    // Script requests are captured only: no browser, http client or real GA call exists.
    allRequests.push({ kind: 'stubbed-ga-script', url: script.src });
  } };
  document.getElementById = id => elements.get(id) || scripts.find(script => script.id === id) || null;
  document.createElement = tag => new FakeElement(tag);
  document.querySelectorAll = () => [];
  document.readyState = readyState; document.referrer = referrer;
  document.title = 'private customer person@example.test +493410000000';
  window.location = location;
  const storage = new Map();
  window.sessionStorage = { getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  window.window = window; window.document = document;
  const context = vm.createContext({ window, document, Element: FakeElement, HTMLAnchorElement: FakeAnchor,
    CustomEvent: FakeCustomEvent, URL, URLSearchParams, Date, console,
    FormData, File, sessionStorage: window.sessionStorage,
    fetch: () => { throw new Error('Network is forbidden: fetch must be explicitly stubbed.'); } });
  vm.runInContext(code, context);
  if (code === analyticsCode) context.contactAnalytics.initContactAnalytics();
  const consent = (analytics, marketing = false) => {
    document.cookie = `cookie-consent=${encodeURIComponent(JSON.stringify({ necessary: true, analytics, marketing }))};path=/`;
    window.dispatchEvent(new FakeCustomEvent('presolaris:consent-updated', { detail: { analytics, marketing } }));
  };
  const lead = (receipt, form_name = 'kontakt', page = '/kontakt/', extra = {}) =>
    window.dispatchEvent(new FakeCustomEvent('presolaris:lead-accepted', { detail: { receipt, form_name, page, ...extra } }));
  const click = (href, nested = true) => {
    const anchor = new FakeAnchor(href);
    document.dispatchEvent({ type: 'click', target: nested ? new FakeElement('span', anchor) : anchor });
  };
  const commands = () => Array.from(window.dataLayer || [], value => Array.from(value));
  const events = () => commands().filter(value => value[0] === 'event');
  const uiClick = id => elements.get(id).dispatchEvent({ type: 'click', target: elements.get(id) });
  return { window, document, context, elements, cookies, cookieWrites, scripts, allRequests,
    consent, lead, click, commands, events, uiClick };
}
const tests = [];
function test(name, handler) { tests.push([name, handler]); }
const jsonConsent = (analytics, marketing = false) => JSON.stringify({ necessary: true, analytics, marketing });

test('Kein Opt-in: keine Scripts, keine Queue, keine Kontakt-/Leadereignisse, kein spätes Replay', () => {
  const env = setup();
  env.click('tel:+493410000000'); env.click('mailto:person@example.test');
  env.click('https://wa.me/493410000000?text=person%40example.test');
  env.lead('accepted-before-consent');
  assert.equal(env.scripts.length, 0); assert.equal(env.window.dataLayer, undefined);
  env.consent(true); env.lead('accepted-before-consent');
  assert.equal(env.events().length, 0);
  env.lead('accepted-after-consent'); assert.equal(env.events().length, 1);
});

test('Rohes und URL-kodiertes Opt-in; false/string/defekte Werte bleiben abgelehnt', () => {
  for (const cookie of [jsonConsent(true), encodeURIComponent(jsonConsent(true))]) {
    const env = setup({ cookie }); assert.equal(env.scripts.length, 1);
    assert.equal(env.window['ga-disable-G-08NXYDBB4F'], false);
  }
  for (const cookie of [jsonConsent(false), encodeURIComponent(jsonConsent(false)), '{broken',
    JSON.stringify({ analytics: 'true', marketing: false }), 'null', '[]', '%E0%A4%A']) {
    const env = setup({ cookie }); assert.equal(env.scripts.length, 0);
    assert.equal(env.window['ga-disable-G-08NXYDBB4F'], true);
    env.click('tel:+493410000000'); assert.equal(env.events().length, 0);
  }
});

test('Datensparsame GA-Defaults: kanonischer Pfad, Referrer-Domain, statischer Titel, keine Queries/PII', () => {
  const env = setup({ cookie: jsonConsent(true) });
  const config = env.commands().find(value => value[0] === 'config');
  assert.equal(config[1], 'G-08NXYDBB4F');
  assert.equal(config[2].page_location, 'https://leipzig-photovoltaik.de/kontakt/');
  assert.equal(config[2].page_referrer, 'google.com');
  assert.equal(config[2].page_title, 'Presolaris – Photovoltaik Leipzig');
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].anonymize_ip, true);
  assert.equal(env.window.location.search.includes('utm_campaign'), true, 'Aktuelle URL bleibt unverändert');
  const serialized = JSON.stringify(env.commands());
  assert(!/person@|password|private|utm_|493410000000|preview\.invalid/.test(serialized));
});

test('Während Script-Load: js/config vor Events, keine verlorenen Events, Onload ohne zweite Config', () => {
  const env = setup(); env.consent(true);
  env.click('tel:+493410000000'); env.lead('load-interval');
  assert.deepEqual(env.commands().map(value => value[0]), ['js', 'config', 'event', 'event']);
  env.scripts[0].onload();
  assert.equal(env.commands().filter(value => value[0] === 'config').length, 1);
  env.consent(true); env.context.contactAnalytics.initContactAnalytics();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.document.listeners.get('click').length, 1);
});

test('Widerruf während Script-Load: Queue verwerfen, spätes Onload bleibt gesperrt, re-enable mit demselben Script', () => {
  const env = setup(); env.consent(true); env.lead('queued-and-withdrawn');
  const gtagBeforeReject = env.window.gtag;
  env.consent(false);
  assert.equal(env.window['ga-disable-G-08NXYDBB4F'], true);
  assert.equal(env.commands().length, 0);
  env.scripts[0].onload(); env.click('tel:+493410000000'); env.lead('withdrawn-accepted');
  gtagBeforeReject('event', 'click_phone', { page: '/kontakt/' });
  assert.equal(env.events().length, 0);
  env.consent(true); assert.equal(env.scripts.length, 1);
  assert.equal(env.window['ga-disable-G-08NXYDBB4F'], false);
  env.lead('queued-and-withdrawn'); env.lead('withdrawn-accepted');
  assert.equal(env.events().length, 0, 'Verworfene/abgelehnte Ereignisse werden nicht wiederholt');
  env.lead('new-after-re-enable'); assert.equal(env.events().length, 1);
});

test('Widerruf nach Onload + Cookies löschen + wieder akzeptieren + erneut ablehnen + Reload', () => {
  const env = setup({ cookie: jsonConsent(true) }); env.scripts[0].onload();
  env.document.cookie = '_ga=synthetic-test-cookie;path=/';
  env.document.cookie = '_ga_08NXYDBB4F=synthetic-test-cookie;path=/';
  env.document.cookie = '_gid=synthetic-test-cookie;path=/';
  env.document.cookie = 'necessary=keep;path=/';
  env.click('mailto:person@example.test'); assert.equal(env.events().length, 1);
  env.consent(false); assert(!env.cookies.has('_ga')); assert(!env.cookies.has('_ga_08NXYDBB4F'));
  assert(!env.cookies.has('_gid')); assert.equal(env.cookies.get('necessary'), 'keep');
  env.click('mailto:person@example.test'); assert.equal(env.events().length, 0);
  env.consent(true); env.click('tel:+493410000000'); assert.equal(env.events().length, 1);
  assert.equal(env.scripts.length, 1);
  env.consent(false); assert.equal(env.events().length, 0);
  const reload = setup({ cookie: env.cookies.get('cookie-consent') });
  reload.click('https://wa.me/493410000000'); assert.equal(reload.scripts.length, 0);
  assert.equal(reload.events().length, 0);
});

test('Delegation: verschachtelte Spans, tel/mailto/wa.me; externe/falsche Hosts ohne Ereignis', () => {
  const env = setup({ cookie: jsonConsent(true) });
  for (const href of ['tel:+493410000000', 'MAILTO:person@example.test?subject=private',
    'https://wa.me/493410000000?text=private']) env.click(href);
  assert.deepEqual(env.events().map(value => value[1]), ['click_phone', 'click_email', 'click_whatsapp']);
  for (const value of env.events()) assert.deepEqual(Object.keys(value[2]), ['page']);
  for (const href of ['https://example.test/', '/kontakt/', 'https://wa.me.evil.test/123',
    'https://wa.me@evil.test/123', 'http://wa.me/123', 'javascript:alert(1)', '#contact']) env.click(href);
  env.document.dispatchEvent({ type: 'click', target: { textContent: 'No Element' } });
  assert.equal(env.events().length, 3);
  assert(!/493410000000|person|mailto|tel:|wa\.me|private/.test(JSON.stringify(env.events())));
});

test('Lead-Receipt dedupliziert rein in Memory; Payload exakt form_name/page, alle echten Formularnamen', () => {
  const env = setup({ cookie: jsonConsent(true) });
  const sources = ['multi_step_form', 'Exit-Intent-Popup', 'solarrechner', 'kontakt', 'gewerbe',
    'service', 'gewerbe-photovoltaik-leipzig', 'pv-wartung-leipzig', 'pv-reinigung-leipzig', 'solarpark-betreuung'];
  for (const [index, source] of sources.entries()) {
    env.lead(`receipt-${index}-private`, source, '/kontakt/?email=person@example.test#private',
      { email: 'person@example.test', phone: '+493410000000', value: 999, currency: 'EUR', revenue: 999 });
    env.lead(`receipt-${index}-private`, source);
  }
  assert.equal(env.events().length, sources.length);
  for (const value of env.events()) {
    assert.equal(value[1], 'generate_lead'); assert.deepEqual(Object.keys(value[2]).sort(), ['form_name', 'page']);
    assert.equal(value[2].page, '/kontakt/');
  }
  assert(!/receipt|person|493410000000|revenue|currency|value/.test(JSON.stringify(env.events())));
  assert(!env.cookieWrites.some(value => value.includes('receipt')));
});

test('Ungültige, Error- und Abbruch-Handoffs erzeugen keine Leads; feste Routen begrenzen Personendaten', () => {
  const env = setup({ cookie: jsonConsent(true) });
  for (const detail of [null, {}, { form_name: 'kontakt', page: '/kontakt/' },
    { receipt: '', form_name: 'kontakt', page: '/kontakt/' },
    { receipt: 'x', form_name: 'person@example.test', page: '/kontakt/' },
    { receipt: 'x', form_name: 'kontakt', page: null }]) {
    env.window.dispatchEvent(new FakeCustomEvent('presolaris:lead-accepted', { detail }));
  }
  for (const type of ['submit', 'presolaris:lead-error', 'presolaris:lead-invalid', 'presolaris:lead-aborted']) {
    env.window.dispatchEvent(new FakeCustomEvent(type, { detail: { form_name: 'kontakt', page: '/kontakt/', receipt: 'no' } }));
  }
  assert.equal(env.events().length, 0);
  for (const [index, page] of ['/customer/person@example.test', '//evil.test/kontakt/',
    'https://evil.test/kontakt/', '/admin/', '/kontakt/%70erson', '/kontakt/../private'].entries()) {
    env.lead(`unsafe-${index}`, 'kontakt', page);
    assert.equal(env.events().at(-1)[2].page, '/');
  }
  assert.equal(env.context.contactAnalytics.safeAnalyticsPage('/service/?utm_source=private#private'), '/service/');
});

test('Echte postLead-Annahme mit API-Stubs: nur strict success+verificationRequired+messageId, keine realen Mails', async () => {
  const env = setup({ cookie: jsonConsent(true) });
  vm.runInContext(leadCode, env.context);
  const requestLog = [];
  let response = { ok: true, body: { success: true, verificationRequired: true, messageId: 'api-receipt-private' } };
  env.context.fetch = async (url, options) => {
    requestLog.push({ url, method: options.method });
    return { ok: response.ok, json: async () => response.body };
  };
  const data = () => { const form = new FormData(); form.set('source', 'kontakt');
    form.set('form_started_at', String(Date.now() - 3000)); return form; };
  await env.context.leadForms.postLead(data()); assert.equal(env.events().length, 1);
  await env.context.leadForms.postLead(data()); assert.equal(env.events().length, 1, 'API-Receipt dedupliziert');
  for (const body of [{ success: false, verificationRequired: true, messageId: 'error' },
    { success: true, verificationRequired: false, messageId: 'error' },
    { success: true, verificationRequired: true }, { success: true, verificationRequired: true, messageId: 1 }]) {
    response = { ok: true, body };
    await assert.rejects(() => env.context.leadForms.postLead(data()));
  }
  response = { ok: false, body: { success: true, verificationRequired: true, messageId: 'http-error' } };
  await assert.rejects(() => env.context.leadForms.postLead(data()));
  const tooFast = data(); tooFast.set('form_started_at', String(Date.now()));
  await assert.rejects(() => env.context.leadForms.postLead(tooFast));
  assert.equal(env.events().length, 1);
  assert(requestLog.every(request => request.url === '/api/lead/' && request.method === 'POST'));
});

test('Banner/UI: gleiche Ablehnen-/Akzeptieren-Klassen, Nur notwendige im Modal, tatsächlicher Toggle-Stand', () => {
  const classes = id => cookieSource.match(new RegExp(`id="${id}"\\s+class="([^"]+)"`))[1];
  assert.equal(classes('cookie-decline'), classes('cookie-accept'));
  assert.equal(classes('cookie-decline-modal'), classes('cookie-accept-all-modal'));
  assert(cookieSource.includes('id="cookie-decline-modal"'));
  const env = setup({ code: cookieCode });
  assert(!env.elements.get('cookie-banner').classList.contains('hidden'));
  const updates = []; env.window.addEventListener('presolaris:consent-updated', event => updates.push(event.detail));
  env.uiClick('cookie-accept'); assert.equal(env.scripts.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(updates.at(-1))), { analytics: true, marketing: true });
  env.window.openCookieSettings();
  assert.equal(env.elements.get('cookie-analytics').checked, true);
  assert.equal(env.elements.get('cookie-marketing').checked, true);
  env.uiClick('cookie-decline-modal'); assert.equal(env.window['ga-disable-G-08NXYDBB4F'], true);
  env.window.openCookieSettings();
  assert.equal(env.elements.get('cookie-analytics').checked, false);
  assert.equal(env.elements.get('cookie-marketing').checked, false);
  env.elements.get('cookie-analytics').checked = true; env.uiClick('cookie-save-settings');
  assert.equal(env.window['ga-disable-G-08NXYDBB4F'], false);
  assert.equal(env.scripts.length, 1);
  env.uiClick('cookie-decline'); assert.equal(env.window['ga-disable-G-08NXYDBB4F'], true);
});

test('Banner initialisiert vor/nach DOM-ready; invalides Cookie zeigt Auswahl; Layout-Reihenfolge und Astro-Syntax', async () => {
  for (const readyState of ['loading', 'complete']) {
    const env = setup({ code: cookieCode, readyState, cookie: '{broken' });
    if (readyState === 'loading') env.document.dispatchEvent({ type: 'DOMContentLoaded' });
    assert(!env.elements.get('cookie-banner').classList.contains('hidden'));
    env.uiClick('cookie-decline'); assert.equal(env.scripts.length, 0);
  }
  const layout = fs.readFileSync(layoutPath, 'utf8');
  assert(layout.indexOf('initContactAnalytics();') < layout.indexOf('bindLeadForms();'));
  assert(!layout.includes('initLeadAttribution'));
  for (const [source, filename] of [[cookieSource, cookiePath], [layout, layoutPath]]) {
    const parsed = await parse(source, { position: true, filename });
    assert(!parsed.diagnostics.some(value => value.severity === 1), `${filename}: Astro-Parsefehler`);
  }
});

let count = 0;
for (const [name, handler] of tests) {
  await handler(); count++;
  console.log(`PASS ${count}: ${name}`);
}
console.log(`\n${count}/${tests.length} Tests bestanden. Alle GA-Scripts/Queues und API-Antworten lokal gestubbt; 0 echte Netzaufrufe. Kein Build, keine Mails, keine GA-Adminänderungen.`);
