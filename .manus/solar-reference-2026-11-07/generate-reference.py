#!/usr/bin/env python3
"""Regenerate one compact PVGIS data module; never synthesizes missing weather."""
from pathlib import Path
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
import hashlib
import json
import math

ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS = ROOT / '.manus/solar-reference-2026-11-07'
RAW = ARTIFACTS / 'pvgis-leipzig-south30-1kwp-2023.json'
MODULE = ROOT / 'src/data/leipzigPvReference.ts'
PARAMS = {
    'lat': 51.34, 'lon': 12.37, 'startyear': 2023, 'endyear': 2023,
    'raddatabase': 'PVGIS-SARAH3', 'pvcalculation': 1, 'peakpower': 1,
    'loss': 14, 'angle': 30, 'aspect': 0, 'pvtechchoice': 'crystSi',
    'mountingplace': 'free', 'usehorizon': 1, 'outputformat': 'json',
}
URL = 'https://re.jrc.ec.europa.eu/api/v5_3/seriescalc?' + '&'.join(f'{k}={v}' for k,v in PARAMS.items())
raw_bytes = RAW.read_bytes()
data = json.loads(raw_bytes, parse_float=Decimal)
hourly = data['outputs']['hourly']
times = [datetime.strptime(row['time'], '%Y%m%d:%H%M').replace(tzinfo=timezone.utc) for row in hourly]
assert len(hourly) == 8760
assert len(set(times)) == 8760
assert times[0] == datetime(2023, 1, 1, 0, 10, tzinfo=timezone.utc)
assert times[-1] == datetime(2023, 12, 31, 23, 10, tzinfo=timezone.utc)
assert all(b-a == timedelta(hours=1) for a,b in zip(times, times[1:]))
assert data['inputs']['mounting_system']['fixed']['type'] == 'free-standing'
assert data['inputs']['pv_module']['peak_power'] == 1
assert all(Decimal(row['P']).is_finite() and row['P'] >= 0 for row in hourly)
assert all(Decimal(row['T2m']).is_finite() for row in hourly)
wh = [int(Decimal(row['P']).quantize(Decimal(1), rounding=ROUND_HALF_UP)) for row in hourly]
raw_sum = sum(Decimal(row['P']) for row in hourly)
monthly_wh = [sum(w for w,t in zip(wh,times) if t.month == m) for m in range(1,13)]
monthly_raw_kwh = [float(sum(Decimal(row['P']) for row,t in zip(hourly,times) if t.month == m)/1000) for m in range(1,13)]
monthly_temperature = [round(float(sum(Decimal(row['T2m']) for row,t in zip(hourly,times) if t.month == m)/sum(t.month == m for t in times)),4) for m in range(1,13)]
# HDD18 is a declared temperature-derived surrogate, not measured heat-pump electricity.
monthly_hdd = [round(float(sum(max(Decimal(0),Decimal(18)-Decimal(row['T2m'])) for row,t in zip(hourly,times) if t.month == m)/24),4) for m in range(1,13)]
metadata = {
    'source': 'European Commission Joint Research Centre, PVGIS 5.3 seriescalc',
    'sourceURL': URL,
    'sourceDocumentationURL': 'https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/pvgis-5-user-manual_en',
    'requestParams': PARAMS,
    'year': 2023,
    'weatherYear': 2023,
    'isTypicalMeteorologicalYear': False,
    'isMeasuredPvOutput': False,
    'referenceKind': 'Modelled PV output from one complete historical weather year; not measured rooftop output or a multi-year hourly average',
    'latitude': 51.34,
    'longitude': 12.37,
    'radiationDatabase': 'PVGIS-SARAH3',
    'temperatureDatabase': 'ERA5',
    'mountingPlace': 'free',
    'mountingInterpretation': 'PVGIS free-standing thermal reference used for ordinary roof-mounted modules with rear ventilation. Fully building-integrated modules without rear ventilation need the separate building reference.',
    'baselineOrientation': 'south',
    'pvgisAzimuthDegrees': 0,
    'pitchDegrees': 30,
    'referencePeakPowerKwp': 1,
    'systemLossPercent': 14,
    'pvSystemLossAlreadyIncluded': True,
    'storageLossIncluded': False,
    'timezone': 'UTC',
    'hourCount': 8760,
    'hourStepMinutes': 60,
    'timestampFormatInSource': 'YYYYMMDD:HHmm',
    'timestampMinuteOffset': 10,
    'firstSourceTimestamp': '20230101:0010',
    'lastSourceTimestamp': '20231231:2310',
    'lastTimeUtc': '2023-12-31T23:10:00Z',
    'sourceTimestampMetadata': data['meta']['outputs']['hourly']['timestamp'],
    'energyConversion': 'P [W] multiplied by a 1-hour timestep, then rounded half-up to integer Wh for the 1 kWp reference',
    'timestampInterpretation': 'SARAH satellite irradiance sample at HH:10 treated as representative of that hour; ERA5 temperature is the corresponding hourly mean. Not a measured integral over the hour. Use index 0 for the 2023-01-01 00 UTC hour; map household schedules explicitly to Europe/Berlin CET/CEST.',
    'annualRawWhPerKwp': float(raw_sum),
    'annualRawKwhPerKwp': float(raw_sum/1000),
    'annualWhPerKwp': sum(wh),
    'annualKwhPerKwp': sum(wh)/1000,
    'roundingDifferenceWhPerKwp': float(Decimal(sum(wh))-raw_sum),
    'monthlyWhPerKwp': monthly_wh,
    'monthlyRawKwhPerKwp': monthly_raw_kwh,
    'monthlyMeanTemperatureC': monthly_temperature,
    'monthlyHeatingDegreeDays18C': monthly_hdd,
    'heatingDegreeDaysMethod': 'Sum max(0, 18 degC - hourly ERA5 T2m) / 24 by UTC month; declared 18 degC base. A climate-season surrogate, not measured building heat demand or heat-pump electricity; COP, heating limit, building and hot-water model still needed.',
    'hourlyTemperatureOmittedFromModule': True,
    'hourlyTemperatureAvailableInRawJson': 'outputs.hourly[].T2m in degrees Celsius',
    'reconstructedRadiationHours': sum(row['Int'] == 1 for row in hourly),
    'downloadedAtUtc': datetime.fromtimestamp(RAW.stat().st_mtime, timezone.utc).isoformat(),
    'rawDataRelativePath': '.manus/solar-reference-2026-11-07/' + RAW.name,
    'rawDataSha256': hashlib.sha256(raw_bytes).hexdigest(),
    'orientationPitchCaveat': 'One physical south/30-degree hourly baseline only. Annual orientation/pitch multipliers and any hourly time shifts are explicit approximations, not orientation-specific PVGIS simulations. They cannot reproduce seasonal incidence and east/west diffuse/direct differences.',
    'limitations': '2023 is an available nonleap reference year, not proven climatologically typical. No roof-specific shading, battery model, load profile, or subhourly variability is supplied. Do not renormalize to an invented annual weather yield or infer autarky from annual PV surplus.',
}
lines = [
    '// Generated from official PVGIS 5.3 JSON; no synthetic weather or annual rescaling.',
    '// 2023 Leipzig, 1 kWp, south / 30 deg, rear-ventilated reference, loss 14%.',
    '// P [W] * 1h approximated as hourly Wh, rounded half-up; UTC source samples HH:10.',
    '// Raw irradiance, ERA5 temperature and wind remain in .manus/solar-reference-2026-11-07/.',
    'export const leipzigPvReference = {',
    '  year: 2023,',
    '  startTimeUtc: "2023-01-01T00:10:00Z",',
    '  hourlyWhPerKwp: [',
]
for i in range(0,len(wh),24):
    lines.append('    '+','.join(str(v) for v in wh[i:i+24])+',')
lines.extend(['  ],', '  metadata: ' + json.dumps(metadata,ensure_ascii=False,indent=2).replace('\n','\n  ') + ',', '};', ''])
MODULE.write_text('\n'.join(lines))
# Extended provenance stays outside the browser bundle.
tmy_path = ARTIFACTS / 'pvgis-leipzig-tmy-2005-2023.json'
provenance = dict(metadata)
provenance['moduleRelativePath'] = 'src/data/leipzigPvReference.ts'
provenance['moduleBytes'] = MODULE.stat().st_size
if tmy_path.exists():
    tmy = json.loads(tmy_path.read_bytes())
    assert len(tmy['outputs']['tmy_hourly']) == 8760
    provenance['tmy'] = {
        'sourceURL': 'https://re.jrc.ec.europa.eu/api/v5_3/tmy?lat=51.34&lon=12.37&startyear=2005&endyear=2023&usehorizon=1&outputformat=json&browser=1',
        'rawDataRelativePath': '.manus/solar-reference-2026-11-07/' + tmy_path.name,
        'rawDataSha256': hashlib.sha256(tmy_path.read_bytes()).hexdigest(),
        'inputs': tmy['inputs'],
        'selectedMonths': tmy['outputs']['months_selected'],
        'hourCount': len(tmy['outputs']['tmy_hourly']),
        'irradianceTimeOffsetHours': tmy['inputs']['location'].get('irradiance_time_offset'),
        'note': 'Separate optional irradiance/weather dataset; not used to generate this PV module. TMY joins typical months from different years, not a multi-year hourly average; requires transposition and PV modelling.',
    }
(ARTIFACTS / 'provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'module':str(MODULE),'hours':len(wh),'bytes':MODULE.stat().st_size,'rawAnnualKwh':metadata['annualRawKwhPerKwp'],'integerAnnualKwh':metadata['annualKwhPerKwp'],'sha256':metadata['rawDataSha256']},indent=2))
