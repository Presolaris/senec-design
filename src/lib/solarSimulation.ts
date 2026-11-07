/**
 * Hourly energy-balance MODEL, not a measured household profile or a roof survey.
 * Reference values are actual supplied hourly Wh for 1 kWp, never normalized to
 * an assumed 1,000 kWh/kWp/year. PVGIS's hourly power samples may be supplied as
 * Wh for a one-hour interval; that approximation belongs in source metadata.
 */
export interface SolarSimulationConfig {
  pvKwp: number;
  householdKwh: number;
  storageEnabled: boolean;
  storageKwh: number;
  orientation: string;
  pitch: string | number;
  heatPumpEnabled?: boolean;
  evEnabled?: boolean;
  evKm?: number;
  evCharging?: "tag" | "abend";
}

/** One complete, non-leap UTC reference year, in chronological hourly order. */
export interface SolarReferenceMetadata {
  year: number;
  /** ISO timestamp of the first UTC sample; defaults to YYYY-01-01T00:00:00Z. */
  startUtc?: string;
  /** PVGIS source sample, e.g. 00:10 UTC; treated as the 00 UTC hourly slot. */
  startTimeUtc?: string;
  /** Optional supplied temperature observations/reference values, same order. */
  temperatureC?: readonly number[];
}

export interface SolarHourlyReference extends SolarReferenceMetadata {
  hourlyWhPerKwp: readonly number[];
}

/** All energy fields are kWh; percentages are 0–100, not fractions. */
export interface SolarEnergyTotals {
  pvGeneratedKwh: number;
  householdKwh: number;
  heatPumpKwh: number;
  evKwh: number;
  loadKwh: number;
  directConsumptionKwh: number;
  batteryChargeInputKwh: number;
  batteryDischargeDeliveredKwh: number;
  batteryChargeLossKwh: number;
  batteryDischargeLossKwh: number;
  batteryLossKwh: number;
  /** UI aliases: AC charge input, AC delivered discharge, both-direction losses. */
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  batteryLossesKwh: number;
  /** Signed stored-energy change; also valid for non-contiguous winter hours. */
  socChangeKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  /** PV diverted from export: direct consumption + AC battery charge input. */
  selfConsumedPvKwh: number;
  /** Useful load served by PV: direct consumption + delivered discharge. */
  suppliedLoadKwh: number;
  autarkyPct: number;
  selfConsumptionPct: number;
  hours: number;
}

export interface SolarHourlyResult {
  utcTimestampMs: number;
  localDate: string;
  localHour: number;
  localMonth: number;
  pvGeneratedKwh: number;
  householdKwh: number;
  heatPumpKwh: number;
  evKwh: number;
  loadKwh: number;
  directConsumptionKwh: number;
  batteryChargeInputKwh: number;
  batteryDischargeDeliveredKwh: number;
  batteryChargeLossKwh: number;
  batteryDischargeLossKwh: number;
  batteryLossKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  socStartKwh: number;
  socEndKwh: number;
}

export interface SolarMonthlyResult extends SolarEnergyTotals {
  month: number;
  label: string;
  initialSocKwh: number;
  finalSocKwh: number;
}

export interface SolarSimulationResult extends SolarEnergyTotals {
  year: number;
  annualAutarkyPct: number;
  initialSocKwh: number;
  finalSocKwh: number;
  usableStorageKwh: number;
  storagePowerLimitKw: number;
  monthly: SolarMonthlyResult[];
  winter: SolarEnergyTotals & { months: readonly number[] };
  hourly: SolarHourlyResult[];
  assumptions: {
    kind: "hourly-energy-balance-model";
    referenceYear: number;
    referenceSpecificYieldKwhPerKwp: number;
    sourceTimeZone: "UTC";
    loadTimeZone: "Europe/Berlin";
    referenceTimestampInterpretation: string;
    aggregationBasis: string;
    orientationFactor: number;
    pitchFactor: number;
    orientationShiftHours: number;
    roofGeometry: string;
    householdProfile: string;
    evProfile: string;
    heatPumpProfile: string;
    usableStorageFraction: number;
    chargeEfficiency: number;
    dischargeEfficiency: number;
    batteryModel: string;
    selfConsumptionDefinition: string;
    autarkyDefinition: string;
  };
}

const HOURS = 8760;
const HOUR_MS = 3_600_000;
const CHARGE_EFFICIENCY = 0.95;
const DISCHARGE_EFFICIENCY = 0.95;
const USABLE_FRACTION = 0.9;
const WINTER_MONTHS = [1, 2, 3, 10, 11, 12] as const;
const MONTH_LABELS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Relative hourly weights, not observations or an official standard load profile.
const HOUSEHOLD_HOURS = [0.35, 0.3, 0.28, 0.28, 0.3, 0.45, 0.8, 1.25, 1.15, 0.8, 0.7, 0.75, 0.95, 0.9, 0.8, 0.85, 1.05, 1.45, 1.8, 1.95, 1.7, 1.3, 0.85, 0.5];
const HOUSEHOLD_MONTHS = [1.16, 1.12, 1.06, 1, 0.94, 0.9, 0.88, 0.9, 0.96, 1.04, 1.1, 1.16];
const HEATING_MONTHS = [1.8, 1.6, 1.2, 0.65, 0.25, 0.05, 0.02, 0.03, 0.2, 0.7, 1.25, 1.75];

const ORIENTATIONS: Record<string, { factor: number; shift: number }> = {
  "süd": { factor: 1, shift: 0 }, "south": { factor: 1, shift: 0 },
  "süd-ost": { factor: 0.95, shift: -1 }, "südost": { factor: 0.95, shift: -1 },
  "south-east": { factor: 0.95, shift: -1 }, "southeast": { factor: 0.95, shift: -1 },
  "süd-west": { factor: 0.95, shift: 1 }, "südwest": { factor: 0.95, shift: 1 },
  "south-west": { factor: 0.95, shift: 1 }, "southwest": { factor: 0.95, shift: 1 },
  "ost": { factor: 0.85, shift: -2 }, "east": { factor: 0.85, shift: -2 },
  "west": { factor: 0.85, shift: 2 },
  "nord": { factor: 0.6, shift: 0 }, "north": { factor: 0.6, shift: 0 },
};
const PITCHES: Record<string, number> = {
  "0": 0.9, "0° (flach)": 0.9, "flat": 0.9,
  "30": 1, "30° (optimal)": 1,
  "45": 0.95, "45° (steil)": 0.95,
  "60": 0.85, "60° (sehr steil)": 0.85,
};

interface LocalHour {
  utcTimestampMs: number;
  date: string;
  month: number;
  utcMonth: number;
  hour: number;
  weekend: boolean;
}

// Intl correctly handles CET/CEST; UTC is not UK civil time. Build once per
// reference start, not 8,760 date conversions on every slider movement.
const calendarCache = new Map<number, readonly LocalHour[]>();
function calendar(start: number): readonly LocalHour[] {
  const cached = calendarCache.get(start);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23", weekday: "short",
  });
  const result: LocalHour[] = [];
  const offsetAt = (utcTimestampMs: number): number => {
    const values: Record<string, string> = {};
    for (const part of formatter.formatToParts(utcTimestampMs)) values[part.type] = part.value;
    return Date.UTC(Number(values.year), Number(values.month) - 1,
      Number(values.day), Number(values.hour)) - utcTimestampMs;
  };
  // Two Intl calls per UTC day; only a clock-change day needs hourly calls.
  // This preserves the platform's historical Europe/Berlin timezone rules,
  // without hard-coding DST legislation or running 8,760 Intl conversions.
  for (let first = 0; first < HOURS; first += 24) {
    const end = Math.min(HOURS, first + 24);
    const firstOffset = offsetAt(start + first * HOUR_MS);
    const lastOffset = offsetAt(start + (end - 1) * HOUR_MS);
    for (let i = first; i < end; i++) {
      const utcTimestampMs = start + i * HOUR_MS;
      const offset = firstOffset === lastOffset ? firstOffset : offsetAt(utcTimestampMs);
      const local = new Date(utcTimestampMs + offset);
      const weekday = local.getUTCDay();
      result.push({
        utcTimestampMs,
        date: local.toISOString().slice(0, 10),
        month: local.getUTCMonth() + 1, hour: local.getUTCHours(),
        utcMonth: new Date(utcTimestampMs).getUTCMonth() + 1,
        weekend: weekday === 0 || weekday === 6,
      });
    }
  }
  // Avoid unbounded memory if this standalone API is used with many years.
  if (calendarCache.size >= 4) calendarCache.delete(calendarCache.keys().next().value!);
  calendarCache.set(start, result);
  return result;
}

function nonnegative(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative`);
  return value;
}

function normalize(weights: readonly number[], annualKwh: number): number[] {
  const sum = weights.reduce((total, value) => total + value, 0);
  if (!annualKwh) return weights.map(() => 0);
  // No cold hours in an optional warm reference: spread the heating component
  // over the year instead of losing part of the requested annual consumption.
  if (!sum) return weights.map(() => annualKwh / weights.length);
  return weights.map(weight => weight / sum * annualKwh);
}

/**
 * Bounded local-solar-time shape approximation: translate within each day's
 * reference daylight envelope, concentrating clipped energy at its edge. This
 * preserves every local day's scaled PV energy and cannot wrap PV into night
 * or the following day. It is NOT an exact PVGIS roof-geometry recalculation.
 * CET/CEST shifts the clock label, not the physical one-/two-hour solar shift.
 */
function shiftedPv(reference: readonly number[], dates: readonly LocalHour[], scale: number, shift: number): number[] {
  const pv = reference.map(value => value / 1000 * scale);
  if (!shift || !scale) return pv;
  const shifted = pv.map(() => 0);
  let first = 0;
  while (first < HOURS) {
    let end = first + 1;
    while (end < HOURS && dates[end].date === dates[first].date) end++;
    let dawn = first;
    let dusk = end - 1;
    while (dawn < end && pv[dawn] === 0) dawn++;
    while (dusk >= dawn && pv[dusk] === 0) dusk--;
    for (let i = dawn; i <= dusk; i++) {
      // An index is a physical UTC hour: DST does not change solar elapsed time.
      const target = Math.max(dawn, Math.min(dusk, i + shift));
      shifted[target] += pv[i];
    }
    first = end;
  }
  return shifted;
}

function emptyTotals(): SolarEnergyTotals {
  return {
    pvGeneratedKwh: 0, householdKwh: 0, heatPumpKwh: 0, evKwh: 0, loadKwh: 0,
    directConsumptionKwh: 0, batteryChargeInputKwh: 0, batteryDischargeDeliveredKwh: 0,
    batteryChargeLossKwh: 0, batteryDischargeLossKwh: 0, batteryLossKwh: 0,
    batteryChargeKwh: 0, batteryDischargeKwh: 0, batteryLossesKwh: 0,
    socChangeKwh: 0, gridImportKwh: 0, gridExportKwh: 0,
    selfConsumedPvKwh: 0, suppliedLoadKwh: 0, autarkyPct: 0, selfConsumptionPct: 0, hours: 0,
  };
}

function accumulate(total: SolarEnergyTotals, hour: SolarHourlyResult): void {
  total.pvGeneratedKwh += hour.pvGeneratedKwh;
  total.householdKwh += hour.householdKwh;
  total.heatPumpKwh += hour.heatPumpKwh;
  total.evKwh += hour.evKwh;
  total.loadKwh += hour.loadKwh;
  total.directConsumptionKwh += hour.directConsumptionKwh;
  total.batteryChargeInputKwh += hour.batteryChargeInputKwh;
  total.batteryDischargeDeliveredKwh += hour.batteryDischargeDeliveredKwh;
  total.batteryChargeLossKwh += hour.batteryChargeLossKwh;
  total.batteryDischargeLossKwh += hour.batteryDischargeLossKwh;
  total.batteryLossKwh += hour.batteryLossKwh;
  total.gridImportKwh += hour.gridImportKwh;
  total.gridExportKwh += hour.gridExportKwh;
  total.socChangeKwh += hour.socEndKwh - hour.socStartKwh;
  total.hours++;
}

function percentages(total: SolarEnergyTotals): void {
  total.selfConsumedPvKwh = total.directConsumptionKwh + total.batteryChargeInputKwh;
  total.suppliedLoadKwh = total.directConsumptionKwh + total.batteryDischargeDeliveredKwh;
  total.batteryChargeKwh = total.batteryChargeInputKwh;
  total.batteryDischargeKwh = total.batteryDischargeDeliveredKwh;
  total.batteryLossesKwh = total.batteryLossKwh;
  // No empirical percentage caps. These ratios follow only from physical flows.
  total.autarkyPct = total.loadKwh > 0 ? total.suppliedLoadKwh / total.loadKwh * 100 : 0;
  total.selfConsumptionPct = total.pvGeneratedKwh > 0 ? total.selfConsumedPvKwh / total.pvGeneratedKwh * 100 : 0;
}

/**
 * Simulate exactly 8,760 one-hour intervals. Battery starts at 0 kWh and carries
 * SOC across nights and all month/season boundaries; never charges from grid.
 * Household, EV and heat-pump loads are deterministic MODELS normalized to
 * the specified annual electrical consumption (HP +3,000; EV 0.2 kWh/km).
 * Loads/daylight shapes use Berlin local time. Monthly/winter energy bins use
 * UTC reference months, keeping monthly initial/final SOC physically contiguous.
 */
export function simulateSolarEnergy(
  config: SolarSimulationConfig,
  referenceHourlyWhPerKwp: readonly number[],
  metadata: SolarReferenceMetadata,
): SolarSimulationResult;
export function simulateSolarEnergy(
  config: SolarSimulationConfig,
  reference: SolarHourlyReference,
): SolarSimulationResult;
export function simulateSolarEnergy(
  config: SolarSimulationConfig,
  reference: readonly number[] | SolarHourlyReference,
  referenceMetadata?: SolarReferenceMetadata,
): SolarSimulationResult {
  const objectReference = !Array.isArray(reference) ? reference as SolarHourlyReference : undefined;
  const referenceHourlyWhPerKwp = objectReference?.hourlyWhPerKwp ?? reference as readonly number[];
  const metadata = objectReference ?? referenceMetadata;
  if (!metadata) throw new RangeError("Reference year metadata is required");
  const pvKwp = nonnegative(config.pvKwp, "pvKwp");
  const householdAnnual = nonnegative(config.householdKwh, "householdKwh");
  const nominalStorage = nonnegative(config.storageKwh, "storageKwh");
  const evKm = nonnegative(config.evKm ?? 0, "evKm");
  if (config.evCharging !== undefined && config.evCharging !== "tag" && config.evCharging !== "abend") {
    throw new RangeError("evCharging must be tag or abend");
  }
  const orientation = ORIENTATIONS[config.orientation.trim().toLowerCase()];
  const pitch = PITCHES[String(config.pitch).trim().toLowerCase().replace(/^([0-9]+)°$/, "$1")];
  if (!orientation) throw new RangeError("Unsupported orientation");
  if (pitch === undefined) throw new RangeError("Unsupported pitch");
  if (!Number.isInteger(metadata.year) || metadata.year < 1900 || metadata.year > 9998) {
    throw new RangeError("Reference year must be an integer between 1900 and 9998");
  }
  if (new Date(Date.UTC(metadata.year, 1, 29)).getUTCMonth() === 1) {
    throw new RangeError("Reference must be a non-leap year with 8760 hours");
  }
  if (referenceHourlyWhPerKwp.length !== HOURS) throw new RangeError("Reference must contain exactly 8760 hourly Wh/kWp values");
  for (const value of referenceHourlyWhPerKwp) nonnegative(value, "Reference hourly Wh/kWp");
  const temperature = metadata.temperatureC;
  if (temperature && (temperature.length !== HOURS || temperature.some(value => !Number.isFinite(value)))) {
    throw new RangeError("temperatureC must contain 8760 finite Celsius values");
  }
  const sourceStart = metadata.startUtc ?? metadata.startTimeUtc;
  const sourceTimestamp = sourceStart === undefined ? Date.UTC(metadata.year, 0, 1) : Date.parse(sourceStart);
  const firstDate = new Date(sourceTimestamp);
  if (!Number.isFinite(sourceTimestamp) || firstDate.getUTCFullYear() !== metadata.year ||
      firstDate.getUTCMonth() !== 0 || firstDate.getUTCDate() !== 1 || firstDate.getUTCHours() !== 0 ||
      (sourceStart !== undefined && !/(Z|\+00:00)$/i.test(sourceStart))) {
    throw new RangeError("startUtc must explicitly identify the first UTC hour of the reference year");
  }
  // PVGIS SARAH HH:10 is a representative sample of the corresponding UTC
  // hour, not a reason to shift household charging windows by ten minutes.
  const start = Math.floor(sourceTimestamp / HOUR_MS) * HOUR_MS;
  const dates = calendar(start);
  const roofScale = pvKwp * orientation.factor * pitch;
  const pv = shiftedPv(referenceHourlyWhPerKwp, dates, roofScale, orientation.shift);
  const householdWeights = dates.map(date => {
    const weekend = date.weekend && date.hour >= 10 && date.hour <= 16 ? 1.15 : 1;
    return HOUSEHOLD_HOURS[date.hour] * HOUSEHOLD_MONTHS[date.month - 1] * weekend;
  });
  const household = normalize(householdWeights, householdAnnual);
  const evDaytime = config.evCharging === "tag";
  const ev = normalize(dates.map(date => evDaytime
    ? (date.hour >= 10 && date.hour <= 16 ? 1 : 0)
    : (date.hour >= 18 && date.hour <= 23 ? 1 : 0)), config.evEnabled ? evKm * 0.2 : 0);
  const hotWater = normalize(dates.map(date => (date.hour >= 6 && date.hour <= 8) ||
    (date.hour >= 18 && date.hour <= 21) ? 1 : 0.15), config.heatPumpEnabled ? 600 : 0);
  const heating = normalize(dates.map((date, i) => {
    const degree = temperature ? Math.max(0, 15 - temperature[i]) : HEATING_MONTHS[date.month - 1];
    return degree * (date.hour >= 5 && date.hour <= 9 ? 1.15 : 1);
  }), config.heatPumpEnabled ? 2400 : 0);

  const usableStorageKwh = config.storageEnabled ? nominalStorage * USABLE_FRACTION : 0;
  const storagePowerLimitKw = usableStorageKwh > 0 ? Math.min(5, nominalStorage / 2) : 0;
  const annual = emptyTotals();
  const monthly: SolarMonthlyResult[] = MONTH_LABELS.map((label, index) => ({
    ...emptyTotals(), month: index + 1, label, initialSocKwh: 0, finalSocKwh: 0,
  }));
  const winter = { ...emptyTotals(), months: WINTER_MONTHS };
  const hourly: SolarHourlyResult[] = [];
  let soc = 0;
  for (let i = 0; i < HOURS; i++) {
    const date = dates[i];
    const heatPumpKwh = hotWater[i] + heating[i];
    const load = household[i] + heatPumpKwh + ev[i];
    const direct = Math.min(pv[i], load);
    const surplus = Math.max(0, pv[i] - direct);
    const deficit = Math.max(0, load - direct);
    const socStartKwh = soc;
    const charge = Math.min(surplus, storagePowerLimitKw,
      Math.max(0, usableStorageKwh - soc) / CHARGE_EFFICIENCY);
    const discharge = Math.min(deficit, storagePowerLimitKw, soc * DISCHARGE_EFFICIENCY);
    const chargeLoss = charge * (1 - CHARGE_EFFICIENCY);
    const dischargeLoss = discharge / DISCHARGE_EFFICIENCY - discharge;
    // Bounds apply only to physical quantities, removing floating-point noise.
    soc = Math.max(0, Math.min(usableStorageKwh,
      soc + charge * CHARGE_EFFICIENCY - discharge / DISCHARGE_EFFICIENCY));
    const hour: SolarHourlyResult = {
      utcTimestampMs: date.utcTimestampMs, localDate: date.date,
      localHour: date.hour, localMonth: date.month,
      pvGeneratedKwh: pv[i], householdKwh: household[i], heatPumpKwh, evKwh: ev[i], loadKwh: load,
      directConsumptionKwh: direct, batteryChargeInputKwh: charge,
      batteryDischargeDeliveredKwh: discharge, batteryChargeLossKwh: chargeLoss,
      batteryDischargeLossKwh: dischargeLoss, batteryLossKwh: chargeLoss + dischargeLoss,
      gridImportKwh: Math.max(0, deficit - discharge),
      gridExportKwh: Math.max(0, surplus - charge), socStartKwh, socEndKwh: soc,
    };
    hourly.push(hour);
    accumulate(annual, hour);
    const month = monthly[date.utcMonth - 1];
    if (!month.hours) month.initialSocKwh = socStartKwh;
    month.finalSocKwh = soc;
    accumulate(month, hour);
    if ((WINTER_MONTHS as readonly number[]).includes(date.utcMonth)) accumulate(winter, hour);
  }
  percentages(annual);
  monthly.forEach(percentages);
  percentages(winter);
  return {
    ...annual, year: metadata.year, annualAutarkyPct: annual.autarkyPct,
    initialSocKwh: 0, finalSocKwh: soc, usableStorageKwh, storagePowerLimitKw,
    monthly, winter, hourly,
    assumptions: {
      kind: "hourly-energy-balance-model", referenceYear: metadata.year,
      referenceSpecificYieldKwhPerKwp: referenceHourlyWhPerKwp.reduce((sum, value) => sum + value, 0) / 1000,
      sourceTimeZone: "UTC", loadTimeZone: "Europe/Berlin",
      referenceTimestampInterpretation: `First source sample ${new Date(sourceTimestamp).toISOString()} treated as its containing UTC hour; supplied Wh values unchanged. Hourly power-to-energy approximation is defined by reference source metadata.`,
      aggregationBasis: "UTC reference-month bins; load/daylight profiles in Europe/Berlin. Winter = Jan–Mar + Oct–Dec; use socChangeKwh for its non-contiguous storage balance.",
      orientationFactor: orientation.factor, pitchFactor: pitch,
      orientationShiftHours: orientation.shift,
      roofGeometry: "MODEL factors relative to supplied south/30° reference; bounded daylight-only shift E −2 h, SE −1 h, SW +1 h, W +2 h, no midnight wrap. Not exact PVGIS for each roof.",
      householdProfile: "MODEL morning/evening peaks, modest weekend midday uplift; monthly weights Jan 1.16 to Jul 0.88, normalized to household annual kWh. Not measured household data.",
      evProfile: "MODEL daily charging 10–16 local (tag) or 18–23 local (abend), normalized to 20 kWh/100 km; no measured driving schedule or smart charging.",
      heatPumpProfile: temperature
        ? "MODEL +3,000 kWh/year: 80% proportional to supplied hourly heating degrees max(15°C − T, 0), 20% hot water. No building-specific thermal/COP model; all-warm reference uses uniform heating fallback."
        : "MODEL +3,000 kWh/year: 80% heating with winter-heavy monthly weights, 20% hot water. No temperature observations invented; no building-specific thermal/COP model.",
      usableStorageFraction: USABLE_FRACTION, chargeEfficiency: CHARGE_EFFICIENCY,
      dischargeEfficiency: DISCHARGE_EFFICIENCY,
      batteryModel: "MODEL 90% usable nominal capacity, 95% charge and 95% discharge efficiency, AC power limit min(5 kW, nominal kWh/2); initially empty, no grid charge, no standby loss, no month/season resets. These are assumptions, not measured product/HTW specifications.",
      selfConsumptionDefinition: "(directConsumptionKwh + batteryChargeInputKwh) / pvGeneratedKwh; includes storage losses and energy still stored at year end.",
      autarkyDefinition: "(directConsumptionKwh + batteryDischargeDeliveredKwh) / loadKwh; delivered useful energy only. Zero denominator gives 0%, no percentage cap.",
    },
  };
}
