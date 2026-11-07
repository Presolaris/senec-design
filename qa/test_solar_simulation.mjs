/**
 * Run: node qa/test_solar_simulation.mjs
 * No build output or QA report files are written. Synthetic fixtures below are
 * ONLY unit-test inputs, not weather observations, PVGIS data or yield evidence.
 * The optional real-reference integration test is skipped when not yet present;
 * set REQUIRE_REAL_SOLAR_REFERENCE=1 to require the data-agent delivery in CI.
 */
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const root = new URL('../', import.meta.url);
async function importTypeScript(url) {
  const source = await readFile(url, 'utf8');
  const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' });
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const { simulateSolarEnergy } = await importTypeScript(new URL('src/lib/solarSimulation.ts', root));
const YEAR = 2023;
const START = Date.UTC(YEAR, 0, 1);
const HOURS = 8760;
const metadata = { year: YEAR, startUtc: `${YEAR}-01-01T00:00:00Z` };
const BASE_CONFIG = {
  pvKwp: 8, householdKwh: 4000, storageEnabled: true, storageKwh: 5,
  orientation: 'Süd', pitch: '30° (Optimal)', heatPumpEnabled: false,
  evEnabled: false, evKm: 10000, evCharging: 'abend',
};
// Explicitly synthetic daylight fixture: no real-world yield claim is derived.
const SYNTHETIC_DAYLIGHT_WH = Array.from({ length: HOURS }, (_, i) => {
  const date = new Date(START + i * 3_600_000);
  const hour = date.getUTCHours();
  const month = date.getUTCMonth();
  const season = [0.35, 0.45, 0.65, 0.8, 0.95, 1, 1, 0.9, 0.75, 0.55, 0.35, 0.3][month];
  return hour >= 8 && hour <= 16 ? Math.round((650 - Math.abs(12 - hour) * 110) * season) : 0;
});
const ZERO_PV = Array(HOURS).fill(0);
let passed = 0;
let skipped = 0;
async function test(name, fn) {
  await fn();
  passed++;
  console.log(`PASS ${name}`);
}
function close(actual, expected, message = '', tolerance = 1e-7) {
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected), `${message}: finite values required`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${message}: ${actual} != ${expected}`);
}
const ENERGY_FIELDS = [
  'pvGeneratedKwh', 'householdKwh', 'heatPumpKwh', 'evKwh', 'loadKwh',
  'directConsumptionKwh', 'batteryChargeInputKwh', 'batteryDischargeDeliveredKwh',
  'batteryChargeLossKwh', 'batteryDischargeLossKwh', 'batteryLossKwh',
  'batteryChargeKwh', 'batteryDischargeKwh', 'batteryLossesKwh',
  'gridImportKwh', 'gridExportKwh', 'selfConsumedPvKwh', 'suppliedLoadKwh',
];
function totalBalance(result, label) {
  for (const field of ENERGY_FIELDS) {
    assert.ok(Number.isFinite(result[field]) && result[field] >= 0, `${label}.${field}: nonnegative and finite`);
  }
  close(result.pvGeneratedKwh,
    result.directConsumptionKwh + result.batteryChargeInputKwh + result.gridExportKwh, `${label}: PV balance`);
  close(result.loadKwh,
    result.directConsumptionKwh + result.batteryDischargeDeliveredKwh + result.gridImportKwh, `${label}: load balance`);
  close(result.pvGeneratedKwh + result.gridImportKwh,
    result.loadKwh + result.gridExportKwh + result.batteryLossKwh + result.socChangeKwh, `${label}: full energy balance`);
  close(result.batteryChargeInputKwh * 0.95 - result.batteryDischargeDeliveredKwh / 0.95,
    result.socChangeKwh, `${label}: stored energy balance`);
  close(result.batteryChargeLossKwh, result.batteryChargeInputKwh * 0.05, `${label}: charge loss`);
  close(result.batteryDischargeLossKwh, result.batteryDischargeDeliveredKwh * (1 / 0.95 - 1), `${label}: discharge loss`);
  close(result.batteryLossKwh, result.batteryChargeLossKwh + result.batteryDischargeLossKwh, `${label}: total losses`);
  close(result.selfConsumedPvKwh, result.directConsumptionKwh + result.batteryChargeInputKwh, `${label}: PV used incl. losses`);
  close(result.suppliedLoadKwh, result.directConsumptionKwh + result.batteryDischargeDeliveredKwh, `${label}: useful load served`);
  close(result.autarkyPct, result.loadKwh ? result.suppliedLoadKwh / result.loadKwh * 100 : 0, `${label}: autarky`);
  close(result.selfConsumptionPct, result.pvGeneratedKwh ? result.selfConsumedPvKwh / result.pvGeneratedKwh * 100 : 0, `${label}: self consumption`);
  for (const field of ['autarkyPct', 'selfConsumptionPct']) {
    assert.ok(Number.isFinite(result[field]) && result[field] >= 0 && result[field] <= 100 + 1e-9, `${label}: bounded physical ratio`);
  }
}
function allBalances(result) {
  totalBalance(result, 'annual');
  assert.equal(result.hourly.length, HOURS);
  assert.equal(result.monthly.length, 12);
  assert.equal(result.initialSocKwh, 0);
  close(result.finalSocKwh, result.socChangeKwh, 'annual final SOC');
  let previousSoc = 0;
  for (const [index, hour] of result.hourly.entries()) {
    for (const [key, value] of Object.entries(hour)) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value) && value >= 0, `hour ${index} ${key}`);
    }
    close(hour.socStartKwh, previousSoc, `hour ${index}: continuous SOC`);
    assert.ok(hour.socEndKwh <= result.usableStorageKwh + 1e-9, `hour ${index}: usable capacity`);
    assert.ok(hour.batteryChargeInputKwh <= result.storagePowerLimitKw + 1e-9, `hour ${index}: charge power`);
    assert.ok(hour.batteryDischargeDeliveredKwh <= result.storagePowerLimitKw + 1e-9, `hour ${index}: discharge power`);
    assert.ok(!(hour.batteryChargeInputKwh > 1e-10 && hour.batteryDischargeDeliveredKwh > 1e-10), `hour ${index}: no simultaneous charge/discharge`);
    close(hour.pvGeneratedKwh, hour.directConsumptionKwh + hour.batteryChargeInputKwh + hour.gridExportKwh, `hour ${index}: PV balance`);
    close(hour.loadKwh, hour.directConsumptionKwh + hour.batteryDischargeDeliveredKwh + hour.gridImportKwh, `hour ${index}: load balance`);
    close(hour.socEndKwh - hour.socStartKwh,
      hour.batteryChargeInputKwh * 0.95 - hour.batteryDischargeDeliveredKwh / 0.95, `hour ${index}: storage balance`);
    previousSoc = hour.socEndKwh;
  }
  for (const [index, month] of result.monthly.entries()) {
    assert.equal(month.month, index + 1);
    totalBalance(month, month.label);
    close(month.finalSocKwh - month.initialSocKwh, month.socChangeKwh, `${month.label}: month SOC balance`);
    if (index) close(month.initialSocKwh, result.monthly[index - 1].finalSocKwh, `${month.label}: no month reset`);
  }
  for (const field of [...ENERGY_FIELDS, 'socChangeKwh', 'hours']) {
    close(result.monthly.reduce((sum, month) => sum + month[field], 0), result[field], `${field}: monthly sum`);
    close(result.monthly.filter(month => [1, 2, 3, 10, 11, 12].includes(month.month))
      .reduce((sum, month) => sum + month[field], 0), result.winter[field], `${field}: winter sum`);
  }
  totalBalance(result.winter, 'winter (non-contiguous SOC changes)');
}
function run(config = {}, reference = SYNTHETIC_DAYLIGHT_WH, meta = metadata) {
  return simulateSolarEnergy({ ...BASE_CONFIG, ...config }, reference, meta);
}

await test('hourly / monthly / winter balances; charge efficiency, SOC and AC power limits', () => {
  const result = run({ heatPumpEnabled: true, evEnabled: true });
  allBalances(result);
  close(result.loadKwh, 9000, '4,000 household + 3,000 HP + 2,000 EV');
  close(result.usableStorageKwh, 4.5);
  close(result.storagePowerLimitKw, 2.5);
  assert.ok(result.gridImportKwh > 0 && result.winter.gridImportKwh > 0);
  assert.ok(result.autarkyPct < 100);
  assert.ok(result.selfConsumedPvKwh > result.suppliedLoadKwh);
});
await test('zero PV cannot supply free energy, even with a huge initially empty battery', () => {
  const result = run({ pvKwp: 0, storageKwh: 1_000_000, heatPumpEnabled: true, evEnabled: true });
  allBalances(result);
  assert.equal(result.autarkyPct, 0);
  assert.equal(result.batteryChargeInputKwh, 0);
  assert.equal(result.batteryDischargeDeliveredKwh, 0);
  assert.equal(result.finalSocKwh, 0);
  close(result.gridImportKwh, 9000);
  const zeroReference = run({ storageKwh: 1_000_000 }, ZERO_PV);
  close(zeroReference.gridImportKwh, 4000);
  assert.equal(zeroReference.suppliedLoadKwh, 0);
});
await test('storage disabled and nominal capacity zero produce identical flows', () => {
  const off = run({ storageEnabled: false, storageKwh: 15 });
  const zero = run({ storageEnabled: true, storageKwh: 0 });
  for (const field of [...ENERGY_FIELDS, 'autarkyPct', 'selfConsumptionPct', 'finalSocKwh']) {
    assert.equal(off[field], zero[field], field);
  }
  assert.deepEqual(off.hourly, zero.hourly);
  allBalances(off);
});
await test('zero load has finite percentages and exports or stores all production', () => {
  const result = run({ householdKwh: 0, storageKwh: 15 });
  allBalances(result);
  assert.equal(result.loadKwh, 0);
  assert.equal(result.autarkyPct, 0);
  assert.equal(result.gridImportKwh, 0);
  assert.equal(result.batteryDischargeDeliveredKwh, 0);
  const empty = run({ pvKwp: 0, householdKwh: 0, storageKwh: 0 });
  assert.equal(empty.selfConsumptionPct, 0);
  assert.equal(empty.autarkyPct, 0);
});
await test('storage capacity is monotonic for supplied useful energy (fixed dispatch/profile)', () => {
  let previous = 0;
  for (const capacity of [0, 2.5, 5, 10, 15, 50]) {
    const result = run({ storageKwh: capacity, heatPumpEnabled: true, evEnabled: true });
    assert.ok(result.suppliedLoadKwh >= previous - 1e-7, `capacity ${capacity}`);
    previous = result.suppliedLoadKwh;
  }
});
await test('same input is deterministic and input arrays are not mutated', () => {
  const fixture = [...SYNTHETIC_DAYLIGHT_WH];
  const first = run({ orientation: 'Ost', pitch: '45° (Steil)' }, fixture);
  const second = run({ orientation: 'Ost', pitch: '45° (Steil)' }, fixture);
  assert.deepEqual(first, second);
  assert.deepEqual(fixture, SYNTHETIC_DAYLIGHT_WH);
  assert.deepEqual(first, simulateSolarEnergy({ ...BASE_CONFIG, orientation: 'Ost', pitch: '45° (Steil)' }, {
    ...metadata, hourlyWhPerKwp: fixture,
  }));
});
await test('preserves actual reference energy; orientation/pitch factors, local-day conservation and no night wrap', () => {
  const south = run({ pvKwp: 1, storageEnabled: false });
  const actualFixtureYield = SYNTHETIC_DAYLIGHT_WH.reduce((sum, wh) => sum + wh, 0) / 1000;
  close(south.pvGeneratedKwh, actualFixtureYield);
  assert.notEqual(actualFixtureYield, 1000, 'fixture must expose a hidden 1000 kWh renormalization');
  const dayEnergy = result => {
    const days = new Map();
    for (const hour of result.hourly) days.set(hour.localDate, (days.get(hour.localDate) ?? 0) + hour.pvGeneratedKwh);
    return days;
  };
  const sourceDays = dayEnergy(south);
  const orientations = [['Süd', 1], ['Süd-Ost', 0.95], ['Süd-West', 0.95], ['Ost', 0.85], ['West', 0.85], ['Nord', 0.6]];
  for (const [orientation, factor] of orientations) {
    const result = run({ pvKwp: 1, orientation, pitch: '0° (Flach)', storageEnabled: false });
    close(result.pvGeneratedKwh, actualFixtureYield * factor * 0.9);
    for (const [date, energy] of dayEnergy(result)) close(energy, sourceDays.get(date) * factor * 0.9, `day ${date}`);
    for (let i = 0; i < HOURS; i++) {
      if (SYNTHETIC_DAYLIGHT_WH[i] === 0) assert.equal(result.hourly[i].pvGeneratedKwh, 0, 'no fabricated night PV');
    }
  }
  for (const [pitch, factor] of [[0, 0.9], [30, 1], [45, 0.95], [60, 0.85]]) {
    close(run({ pvKwp: 1, pitch }).pvGeneratedKwh, actualFixtureYield * factor);
  }
  const centroid = (result, day) => {
    const hours = result.hourly.filter(hour => hour.localDate === day);
    return hours.reduce((sum, hour) => sum + hour.localHour * hour.pvGeneratedKwh, 0) /
      hours.reduce((sum, hour) => sum + hour.pvGeneratedKwh, 0);
  };
  assert.ok(centroid(run({ orientation: 'Ost' }), '2023-06-15') < centroid(south, '2023-06-15'));
  assert.ok(centroid(run({ orientation: 'West' }), '2023-06-15') > centroid(south, '2023-06-15'));
});
await test('profiles normalize independently; household winter uplift; winter-heavy HP; EV local charging windows', () => {
  const result = run({ heatPumpEnabled: true, evEnabled: true });
  close(result.householdKwh, 4000);
  close(result.heatPumpKwh, 3000);
  close(result.evKwh, 2000);
  const january = result.monthly[0].householdKwh / 31;
  const july = result.monthly[6].householdKwh / 31;
  assert.ok(january >= july * 1.15, 'winter household daily average exceeds summer');
  assert.ok(result.winter.heatPumpKwh > 3000 * 0.7, 'HP annual energy is clearly winter-heavy');
  for (const charging of ['tag', 'abend']) {
    const evResult = run({ evEnabled: true, evCharging: charging });
    const [from, to] = charging === 'tag' ? [10, 16] : [18, 23];
    for (const hour of evResult.hourly) {
      if (hour.evKwh > 0) assert.ok(hour.localHour >= from && hour.localHour <= to);
    }
    close(evResult.evKwh, 2000);
  }
});
await test('temperature-driven heating-degree + hot-water profile and warm-reference fallback', () => {
  // Deliberately synthetic temperatures, only for exercising the optional API.
  const temperatureC = Array.from({ length: HOURS }, (_, i) => {
    const month = new Date(START + i * 3_600_000).getUTCMonth() + 1;
    return [1, 2, 3, 10, 11, 12].includes(month) ? -2 : 20;
  });
  const result = run({ heatPumpEnabled: true }, SYNTHETIC_DAYLIGHT_WH, { ...metadata, temperatureC });
  close(result.heatPumpKwh, 3000);
  assert.ok(result.winter.heatPumpKwh > 2600);
  assert.ok(result.assumptions.heatPumpProfile.includes('heating degrees'));
  const warm = run({ heatPumpEnabled: true }, SYNTHETIC_DAYLIGHT_WH,
    { ...metadata, temperatureC: Array(HOURS).fill(25) });
  close(warm.heatPumpKwh, 3000, 'no annual consumption lost in all-warm fallback');
});
await test('UTC → CET/CEST conversion, spring missing hour and autumn repeated hour', () => {
  const result = run();
  const at = timestamp => result.hourly.find(hour => hour.utcTimestampMs === Date.parse(timestamp));
  assert.equal(at('2023-01-15T12:00:00Z').localHour, 13);
  assert.equal(at('2023-07-15T12:00:00Z').localHour, 14);
  assert.equal(at('2023-03-26T00:00:00Z').localHour, 1);
  assert.equal(at('2023-03-26T01:00:00Z').localHour, 3);
  assert.equal(at('2023-10-29T00:00:00Z').localHour, 2);
  assert.equal(at('2023-10-29T01:00:00Z').localHour, 2);
  assert.equal(at('2023-12-31T23:00:00Z').localDate, '2024-01-01');
  assert.equal(result.monthly[11].hours, 31 * 24, 'UTC month bins remain contiguous');
  const sampled = simulateSolarEnergy(BASE_CONFIG, {
    year: YEAR, startTimeUtc: '2023-01-01T00:10:00Z', hourlyWhPerKwp: SYNTHETIC_DAYLIGHT_WH,
  });
  assert.equal(sampled.hourly[0].utcTimestampMs, START, 'PVGIS HH:10 belongs to the corresponding hourly slot');
  assert.deepEqual(sampled.hourly, result.hourly);
  assert.ok(sampled.assumptions.referenceTimestampInterpretation.includes('00:10:00'));
});
await test('physical 100% is allowed when all load occurs during sufficient PV production; no arbitrary cap', () => {
  const result = run({ pvKwp: 100, householdKwh: 0, storageEnabled: false, evEnabled: true, evKm: 1000, evCharging: 'tag' });
  assert.equal(result.gridImportKwh, 0);
  close(result.autarkyPct, 100);
});
await test('SOC survives month/season boundaries; initial state empty; five-kW upper limit', () => {
  const boundaryFixture = Array(HOURS).fill(0);
  const index = Math.floor((Date.UTC(YEAR, 0, 31, 12) - START) / 3_600_000);
  boundaryFixture[index] = 100_000;
  const result = run({ householdKwh: 0, pvKwp: 1, storageKwh: 100 }, boundaryFixture);
  allBalances(result);
  assert.equal(result.storagePowerLimitKw, 5);
  assert.equal(result.hourly[index].batteryChargeInputKwh, 5);
  close(result.finalSocKwh, 4.75);
  close(result.monthly[1].initialSocKwh, 4.75);
  close(result.monthly[9].initialSocKwh, 4.75, 'no seasonal reset');
});
await test('invalid/nonfinite values, length, unsupported geometry and leap year are rejected', () => {
  for (const config of [{ pvKwp: -1 }, { householdKwh: NaN }, { storageKwh: Infinity },
    { evKm: -10 }, { orientation: 'unknown' }, { pitch: 10 }, { evCharging: 'night' }]) {
    assert.throws(() => run(config), RangeError);
  }
  assert.throws(() => run({}, [1, 2, 3]), RangeError);
  const bad = [...SYNTHETIC_DAYLIGHT_WH]; bad[42] = -1;
  assert.throws(() => run({}, bad), RangeError);
  bad[42] = NaN;
  assert.throws(() => run({}, bad), RangeError);
  assert.throws(() => run({}, SYNTHETIC_DAYLIGHT_WH, { year: 2024 }), RangeError);
  assert.throws(() => run({}, SYNTHETIC_DAYLIGHT_WH, { year: YEAR, startUtc: '2023-01-01T00:00:00' }), RangeError);
  assert.throws(() => run({}, SYNTHETIC_DAYLIGHT_WH, { year: YEAR, temperatureC: [5] }), RangeError);
});

const realDataUrl = new URL('src/data/leipzigPvReference.ts', root);
let realExists = true;
try { await access(realDataUrl); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
  realExists = false;
}
if (!realExists) {
  if (process.env.REQUIRE_REAL_SOLAR_REFERENCE === '1') throw new Error('Required real PVGIS reference has not been delivered');
  skipped++;
  console.log('SKIP real PVGIS reference integration — data module not yet delivered; no synthetic fixture is used for calibration');
} else {
  await test('actual supplied PVGIS reference: screenshot/default configuration, honest winter grid and broad plausibility guards', async () => {
    const exported = await importTypeScript(realDataUrl);
    const source = exported.leipzigPvReference ?? exported.LEIPZIG_PV_REFERENCE ?? exported.default;
    assert.ok(source, 'Data module must export leipzigPvReference (adapt this test if its contract differs)');
    const hourlyWhPerKwp = source.hourlyWhPerKwp ?? source.hourlyPvWhPerKwp;
    const year = source.year ?? source.metadata?.year;
    const startUtc = source.startUtc ?? source.startTimeUtc ?? source.metadata?.startUtc;
    const temperatureC = source.temperatureC ?? source.hourlyTemperatureC;
    assert.ok(Array.isArray(hourlyWhPerKwp), 'Reference hourlyWhPerKwp array required');
    assert.equal(hourlyWhPerKwp.length, HOURS);
    assert.ok(hourlyWhPerKwp.every(value => Number.isInteger(value) && value >= 0), 'quantized integer Wh reference');
    // Parent may set the actual screenshot inputs as JSON, without modifying files.
    const screenshotConfig = process.env.SOLAR_SCREENSHOT_CONFIG
      ? { ...BASE_CONFIG, ...JSON.parse(process.env.SOLAR_SCREENSHOT_CONFIG) } : BASE_CONFIG;
    const result = simulateSolarEnergy(screenshotConfig, hourlyWhPerKwp, { year, startUtc, temperatureC });
    const objectResult = simulateSolarEnergy(screenshotConfig, source);
    assert.deepEqual(objectResult.hourly, result.hourly, 'parent UI can pass the supplied reference object directly');
    if (source.metadata?.annualKwhPerKwp !== undefined) {
      close(result.assumptions.referenceSpecificYieldKwhPerKwp, source.metadata.annualKwhPerKwp,
        'annual PV energy exactly follows supplied quantized source, not 1000 kWh/kWp');
    }
    allBalances(result);
    assert.ok(result.winter.gridImportKwh > 0, 'real reference has winter grid dependence');
    assert.ok(result.autarkyPct < 100, 'actual screenshot configuration is not falsely 100% autonomous');
    // Guards are deliberately broad, apply only to actual supplied PVGIS data,
    // and do not alter any energy flow or calibrate to a fabricated percentage.
    assert.ok(result.assumptions.referenceSpecificYieldKwhPerKwp > 650 &&
      result.assumptions.referenceSpecificYieldKwhPerKwp < 1400, 'broad Leipzig reference yield sanity range');
    if (!process.env.SOLAR_SCREENSHOT_CONFIG) {
      assert.ok(result.autarkyPct > 30 && result.autarkyPct < 95, 'broad default 8 kWp / 4,000 kWh / 5 kWh sanity range');
    }
    console.log('REAL_REFERENCE', JSON.stringify({
      year, config: screenshotConfig,
      pvGeneratedKwh: result.pvGeneratedKwh, loadKwh: result.loadKwh,
      autarkyPct: result.autarkyPct, selfConsumptionPct: result.selfConsumptionPct,
      gridImportKwh: result.gridImportKwh, winterGridImportKwh: result.winter.gridImportKwh,
      winterAutarkyPct: result.winter.autarkyPct, batteryLossesKwh: result.batteryLossesKwh,
    }));
  });
}
console.log(`Solar simulation tests: ${passed} passed, ${skipped} skipped (${fileURLToPath(root)})`);
