import React, { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Battery, Leaf, Zap, Car, Home, Download, MapPin, CheckCircle2, Info, Flame, Moon } from "lucide-react";
import { postLead } from "@/lib/leadForms";
import { simulateSolarEnergy, type SolarSimulationResult } from "@/lib/solarSimulation";
import { leipzigPvReference } from "@/data/leipzigPvReference";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";


// ==================== TYPEN ====================

interface CalculationResults {
  anlagengroesse: number;
  modulanzahl: number;
  dachflaeche: number;
  jahresertrag: number;
  tagesertrag: number;
  ertragProKwp: number;
  jahresverbrauch: number;
  eigenverbrauchsquote: number;
  eigenverbrauch: number;
  netzeinspeisung: number;
  netzbezug: number;
  autarkiegrad: number;
  anschaffungskosten: number;
  kostenProKwp: number;
  speicherkosten: number;
  stromkostenVorher: number;
  stromkostenNachher: number;
  jahresersparnis: number;
  einspeiseverguetung: number;
  gesamtersparnis: number;
  ersparnisProMonat: number;
  ersparnis25Jahre: number;
  amortisationszeit: number;
  roi: number;
  co2Einsparung: number;
  co2Einsparung25Jahre: number;
  baeume: number;
  simulation: SolarSimulationResult;
  verguetungProKwh: number;
}

interface EnergyFlowData {
  solarProduction: number;
  directConsumption: number;
  batteryCharge: number;
  gridFeedIn: number;
  batteryDischarge: number;
  gridConsumption: number;
  totalConsumption: number;
}

// ==================== KONSTANTEN ====================

const CONSTANTS = {
  // Wirtschaftlichkeit
  STROMPREIS: 0.40,              // €/kWh
  VERGUETUNG_BIS_10_KWP: 0.077,  // €/kWh, BNetzA: Inbetriebnahme Aug–Dez 2026
  VERGUETUNG_BIS_40_KWP: 0.0666, // €/kWh für den Leistungsanteil über 10 kWp
  KOSTEN_PRO_KWP: 1400,          // €/kWp (ohne Speicher)
  SPEICHER_KOSTEN_PRO_KWH: 800,  // €/kWh Speicherkapazität
  
  // Technische Werte
  MODUL_LEISTUNG: 0.4,           // kWp pro Modul
  MODUL_FLAECHE: 1.7,            // m² pro Modul
  
  // Umwelt
  CO2_PRO_KWH: 0.485,            // kg CO2/kWh (Strommix Deutschland)
  CO2_PRO_BAUM: 10,              // kg CO2/Jahr pro Baum
  
  // Wärmepumpe
  WAERMEPUMPE_VERBRAUCH: 3000,   // kWh pauschal

  // E-Mobilität
  E_AUTO_VERBRAUCH_PRO_100KM: 20, // kWh
};

// Faktor für Dachausrichtung (Süd = 100%, Ost/West = 85%, Nord = 60%)
const ORIENTATION_FACTORS: Record<string, number> = {
  "Süd": 1.0,
  "Süd-Ost": 0.95,
  "Süd-West": 0.95,
  "Ost": 0.85,
  "West": 0.85,
  "Nord": 0.60
};

// Faktor für Dachneigung (Optimal ~30-35°)
const PITCH_FACTORS: Record<string, number> = {
  "0° (Flach)": 0.90,
  "30° (Optimal)": 1.0,
  "45° (Steil)": 0.95,
  "60° (Sehr steil)": 0.85
};

// ==================== BERECHNUNGS-FUNKTIONEN ====================

function calculateResults(
  anlagengroesse: number,
  jahresverbrauchBasis: number, // Nur Haushaltsstrom
  mitSpeicher: boolean,
  speichergroesse: number,
  strompreis: number, // in Euro/kWh
  ausrichtung: string,
  neigung: string,
  mitWaermepumpe: boolean,
  mitEAuto: boolean,
  eAutoKm: number,
  eAutoLadezeit: 'tag' | 'abend'
): CalculationResults {
  // Anlagendaten
  const modulanzahl = Math.ceil(anlagengroesse / CONSTANTS.MODUL_LEISTUNG);
  const dachflaeche = modulanzahl * CONSTANTS.MODUL_FLAECHE;
  
  // Jede Stunde einzeln bilanzieren: Ein Sommervorrat darf den Winter nicht versorgen.
  const simulation = simulateSolarEnergy({
    pvKwp: anlagengroesse, householdKwh: jahresverbrauchBasis,
    storageEnabled: mitSpeicher, storageKwh: speichergroesse,
    orientation: ausrichtung, pitch: neigung,
    heatPumpEnabled: mitWaermepumpe, evEnabled: mitEAuto,
    evKm: eAutoKm, evCharging: eAutoLadezeit,
  }, leipzigPvReference);
  const jahresertrag = simulation.pvGeneratedKwh;
  const gesamtVerbrauch = simulation.loadKwh;
  const eigenverbrauch = simulation.directConsumptionKwh + simulation.batteryDischargeKwh;
  const netzeinspeisung = simulation.gridExportKwh;
  const netzbezug = simulation.gridImportKwh;
  const autarkiegrad = simulation.autarkyPct;
  const tagesertrag = jahresertrag / 365;
  const ertragProKwp = anlagengroesse > 0 ? jahresertrag / anlagengroesse : 0;
  const verguetungProKwh = anlagengroesse > 0
    ? (Math.min(anlagengroesse, 10) * CONSTANTS.VERGUETUNG_BIS_10_KWP
       + Math.max(0, anlagengroesse - 10) * CONSTANTS.VERGUETUNG_BIS_40_KWP) / anlagengroesse
    : 0;

  // Kosten
  const anschaffungskosten = anlagengroesse * CONSTANTS.KOSTEN_PRO_KWP;
  const speicherkosten = mitSpeicher ? speichergroesse * CONSTANTS.SPEICHER_KOSTEN_PRO_KWH : 0;
  const gesamtkosten = anschaffungskosten + speicherkosten;
  const kostenProKwp = CONSTANTS.KOSTEN_PRO_KWP;
  
  // Ersparnis
  const stromkostenVorher = gesamtVerbrauch * strompreis;
  const stromkostenNachher = netzbezug * strompreis;
  const jahresersparnis = stromkostenVorher - stromkostenNachher;
  const einspeiseverguetung = netzeinspeisung * verguetungProKwh;
  const gesamtersparnis = jahresersparnis + einspeiseverguetung;
  const ersparnisProMonat = gesamtersparnis / 12;
  const ersparnis25Jahre = gesamtersparnis * 25;
  
  // Amortisation
  const amortisationszeit = gesamtkosten / gesamtersparnis;
  const roi = ((ersparnis25Jahre - gesamtkosten) / gesamtkosten) * 100;
  
  // Umwelt
  const co2Einsparung = eigenverbrauch * CONSTANTS.CO2_PRO_KWH;
  const co2Einsparung25Jahre = co2Einsparung * 25;
  const baeume = Math.floor(co2Einsparung / CONSTANTS.CO2_PRO_BAUM);
  
  return {
    anlagengroesse,
    modulanzahl,
    dachflaeche,
    jahresertrag,
    tagesertrag,
    ertragProKwp,
    jahresverbrauch: gesamtVerbrauch, // Hier jetzt Gesamtverbrauch zurückgeben
    eigenverbrauchsquote: simulation.selfConsumptionPct,
    eigenverbrauch,
    netzeinspeisung,
    netzbezug,
    autarkiegrad,
    anschaffungskosten: gesamtkosten,
    kostenProKwp,
    speicherkosten,
    stromkostenVorher,
    stromkostenNachher,
    jahresersparnis,
    einspeiseverguetung,
    gesamtersparnis,
    ersparnisProMonat,
    ersparnis25Jahre,
    amortisationszeit,
    roi,
    co2Einsparung,
    co2Einsparung25Jahre,
    baeume,
    simulation,
    verguetungProKwh,
  };
}

function calculateEnergyFlow(results: CalculationResults): EnergyFlowData {
  return {
    solarProduction: results.jahresertrag,
    totalConsumption: results.jahresverbrauch,
    directConsumption: results.simulation.directConsumptionKwh,
    batteryCharge: results.simulation.batteryChargeKwh,
    batteryDischarge: results.simulation.batteryDischargeKwh,
    gridFeedIn: results.netzeinspeisung,
    gridConsumption: results.netzbezug,
  };
}

const formatKwh = (value: number) => Math.round(value).toLocaleString('de-DE');
const formatPct = (value: number) => value < 100 && value >= 99.95
  ? '>99,9' : value.toLocaleString('de-DE', { maximumFractionDigits: 1 });
const MONTH_NAMES = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

// ==================== ENERGIEFLUSS-DIAGRAMM ====================

const EnergyFlowDiagram: React.FC<{ data: EnergyFlowData }> = ({ data }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, [data]);
  
  const formatValue = (value: number) => Math.round(value).toLocaleString('de-DE');
  
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
      {/* Sonne (Oben Mitte) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-20 h-20 bg-[var(--primary-yellow)] rounded-full flex items-center justify-center shadow-lg cursor-help">
              <Sun className="w-10 h-10 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-center">
            <p className="font-bold mb-1">Berechnungsgrundlage</p>
            <p>Stündliche PVGIS-Wetterreferenz für Leipzig, Jahr {leipzigPvReference.year}.</p>
            <p className="mt-2 text-xs opacity-80">Modellierter PV-Ertrag, keine Messung Ihres Dachs. Andere Dachausrichtungen und Neigungen werden vereinfacht angepasst.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--primary-blue)]">
          {formatValue(data.solarProduction)} kWh/Jahr
        </div>
        <div className="text-xs text-gray-500">Solar-Ertrag</div>
      </div>
      
      {/* Batterie (Links Mitte) */}
      <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-16 h-24 bg-[var(--primary-turquoise)] rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden cursor-help border-2 border-white">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-[#009ca6] transition-transform duration-1000 origin-bottom"
                style={{ 
                  height: '70%',
                  transform: animate ? 'scaleY(1)' : 'scaleY(0.714)'
                }}
              />
              <Battery className="w-8 h-8 text-white relative z-10" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Summe der Speicherladung im Jahr, nicht der aktuelle Ladezustand. Entladung und Verluste werden separat bilanziert.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--primary-blue)]">
          {formatValue(data.batteryCharge)} kWh/Jahr
        </div>
        <div className="text-xs text-gray-500">Gespeichert</div>
      </div>
      
      {/* Haus (Rechts Mitte) */}
      <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-20 h-20 bg-[var(--primary-blue)] rounded-lg flex items-center justify-center shadow-lg cursor-help border-2 border-white">
              <Home className="w-10 h-10 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gesamtbedarf von Haushalt und gewählten Zusatzverbrauchern. Versorgung aus direktem Solarstrom, Speicher und Netz.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--primary-blue)]">
          {formatValue(data.totalConsumption)} kWh/Jahr
        </div>
        <div className="text-xs text-gray-500">Verbrauch</div>
      </div>
      
      {/* Netz (Unten Mitte) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center shadow-lg cursor-help border-2 border-white">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Überschuss ins öffentliche Netz. Er ersetzt keinen Netzbezug in einer anderen Stunde.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--primary-blue)]">
          {formatValue(data.gridFeedIn)} kWh/Jahr
        </div>
        <div className="text-xs text-gray-500">Einspeisung</div>
      </div>
      
      {/* EV (Unten Rechts - Optional) */}
      <div className="absolute bottom-12 right-12 text-center z-10 opacity-50">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
              <Car className="w-6 h-6 text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Optionale Wallbox für E-Auto.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>

      {/* Verbindungen (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,165,0,0.2)" />
            <stop offset="50%" stopColor="rgba(255,165,0,0.8)" />
            <stop offset="100%" stopColor="rgba(255,165,0,0.2)" />
          </linearGradient>
        </defs>
        
        {/* PV -> Haus */}
        <path d="M 50% 15% Q 80% 15% 90% 45%" fill="none" stroke="url(#flowGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
        
        {/* PV -> Batterie */}
        <path d="M 50% 15% Q 20% 15% 10% 45%" fill="none" stroke="url(#flowGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
        
        {/* PV -> Netz */}
        <path d="M 50% 15% L 50% 85%" fill="none" stroke="url(#flowGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse opacity-50" />
        
        {/* Batterie -> Haus */}
        <path d="M 10% 55% Q 50% 55% 90% 55%" fill="none" stroke="#00b0f0" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse opacity-70" />

        {/* Partikel Animation */}
        {animate && (
          <>
            <circle r="4" fill="orange">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 350 60 Q 550 60 600 180" />
            </circle>
            <circle r="4" fill="orange">
              <animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M 350 60 Q 150 60 100 180" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

// ==================== HAUPTKOMPONENTE ====================

export default function SolarCalculator() {
  // State
  const [anlagengroesse, setAnlagengroesse] = useState(8); // kWp
  const [jahresverbrauch, setJahresverbrauch] = useState(4000); // kWh (Haushalt)
  const [mitSpeicher, setMitSpeicher] = useState(true);
  const [speichergroesse, setSpeichergroesse] = useState(5); // kWh
  const [strompreis, setStrompreis] = useState(0.40); // Euro/kWh
  const [adresse, setAdresse] = useState("");
  const [ausrichtung, setAusrichtung] = useState("Süd");
  const [neigung, setNeigung] = useState("30° (Optimal)");
  const [mitWaermepumpe, setMitWaermepumpe] = useState(false);
  const [mitEAuto, setMitEAuto] = useState(false);
  const [eAutoKm, setEAutoKm] = useState(10000); // km/Jahr
  const [eAutoLadezeit, setEAutoLadezeit] = useState<'tag' | 'abend'>('abend');
  
  const results = useMemo(() => calculateResults(
    anlagengroesse, jahresverbrauch, mitSpeicher, speichergroesse, strompreis,
    ausrichtung, neigung, mitWaermepumpe, mitEAuto, eAutoKm, eAutoLadezeit
  ), [anlagengroesse, jahresverbrauch, mitSpeicher, speichergroesse, strompreis,
      ausrichtung, neigung, mitWaermepumpe, mitEAuto, eAutoKm, eAutoLadezeit]);
  const energyFlow = useMemo(() => calculateEnergyFlow(results), [results]);

  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [formStep, setFormStep] = useState<'form' | 'success'>('form');
  const [leadError, setLeadError] = useState('');
  const [sendingLead, setSendingLead] = useState(false);
  const [leadOpenedAt, setLeadOpenedAt] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Handler
  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingLead || !e.currentTarget.reportValidity()) return;
    setSendingLead(true);
    setLeadError('');
    const summary =
      `STANDORT:\n` +
      `Adresse: ${adresse || 'Nicht angegeben'}\n` +
      `Dachausrichtung: ${ausrichtung}\n` +
      `Dachneigung: ${neigung}\n\n` +
      `KONFIGURATION:\n` +
      `PV-Leistung: ${anlagengroesse} kWp\n` +
      `Stromverbrauch: ${jahresverbrauch} kWh/Jahr\n` +
      `Strompreis: ${(strompreis * 100).toFixed(0)} ct/kWh\n` +
      `Speicher: ${mitSpeicher ? `Ja, ${speichergroesse} kWh` : 'Nein'}\n` +
      `Wärmepumpe: ${mitWaermepumpe ? 'Ja' : 'Nein'}\n` +
      `E-Auto: ${mitEAuto ? `Ja, ${eAutoKm} km/Jahr, Laden ${eAutoLadezeit === 'tag' ? 'tagsüber' : 'abends'}` : 'Nein'}\n\n` +
      `MODELLERGEBNISSE (PVGIS-Wetterreferenz Leipzig ${leipzigPvReference.year}, keine Dachmessung):\n` +
      `Autarkie im Jahr: ${formatPct(results.autarkiegrad)}%\n` +
      `PV-Eigenverbrauch inkl. Speicherladung: ${formatPct(results.eigenverbrauchsquote)}%\n` +
      `PV-Ertrag: ${formatKwh(results.jahresertrag)} kWh/Jahr\n` +
      `Netzbezug: ${formatKwh(results.netzbezug)} kWh/Jahr\n` +
      `Winterhalbjahr Okt-März: ${formatPct(results.simulation.winter.autarkyPct)}% Autarkie; ${formatKwh(results.simulation.winter.gridImportKwh)} kWh Netzbezug\n` +
      `Speicherladung: ${formatKwh(results.simulation.batteryChargeKwh)} kWh/Jahr; nutzbare Entladung: ${formatKwh(results.simulation.batteryDischargeKwh)} kWh/Jahr\n` +
      `Stromkostenvorteil inkl. Einspeisung, vor Betriebskosten: ${results.gesamtersparnis.toFixed(0)} Euro/Jahr\n` +
      `Modellannahmen: Haushaltsprofil; WP +3000 kWh saisonal; E-Auto 20 kWh/100 km. Keine Ertrags- oder Amortisationsgarantie.`;

    const payload = new FormData();
    payload.set('subject', 'Neue Solarrechner-Anfrage von leipzig-photovoltaik.de');
    payload.set('source', 'solarrechner');
    payload.set('privacy', 'on'); // Das Formular wurde zuvor via reportValidity() geprüft.
    payload.set('form_started_at', String(leadOpenedAt));
    payload.set('name', formData.name.trim());
    payload.set('email', formData.email.trim());
    payload.set('phone', formData.phone.trim());
    payload.set('message', `${formData.message || 'Keine Nachricht'}\n\n${summary}`);
    try {
      await postLead(payload);
      setFormStep('success');
    } catch (error) {
      console.error('Solarrechner-Anfrage fehlgeschlagen:', error);
      setLeadError(error instanceof Error && error.message ? error.message : 'Die Anfrage konnte nicht versendet werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 341 98 99 03 91.');
    } finally {
      setSendingLead(false);
    }
  };

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFillColor(13, 29, 55);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Presolaris Solar-Modellrechnung', 10, 15);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const lines = [
      `Erstellt am: ${new Date().toLocaleDateString('de-DE')}`,
      `Projektadresse: ${adresse || 'Nicht angegeben (keine automatische Dachanalyse)'}`,
      `Dach: ${ausrichtung}, ${neigung}`,
      `Anlage: ${anlagengroesse} kWp; Speicher: ${mitSpeicher ? `${speichergroesse} kWh nominal` : 'ohne'}`,
      `Haushalt: ${jahresverbrauch} kWh/Jahr; WP: ${mitWaermepumpe ? '+3.000 kWh/Jahr (Annahme)' : 'nein'}`,
      `E-Auto: ${mitEAuto ? `${eAutoKm} km/Jahr; Laden ${eAutoLadezeit}` : 'nein'}`,
      `Gesamtbedarf: ${formatKwh(results.jahresverbrauch)} kWh/Jahr`,
      '', 'Energetische Ergebnisse (stündliche Modellbilanz)',
      `PV-Ertrag: ${formatKwh(results.jahresertrag)} kWh/Jahr`,
      `Autarkie im Jahr: ${formatPct(results.autarkiegrad)} %`,
      `PV-Eigenverbrauch inkl. Speicherladung: ${formatPct(results.eigenverbrauchsquote)} %`,
      `Netzbezug: ${formatKwh(results.netzbezug)} kWh/Jahr`,
      `Einspeisung: ${formatKwh(results.netzeinspeisung)} kWh/Jahr`,
      `Speicherladung / Entladung: ${formatKwh(results.simulation.batteryChargeKwh)} / ${formatKwh(results.simulation.batteryDischargeKwh)} kWh/Jahr`,
      `Speicherverluste: ${formatKwh(results.simulation.batteryLossesKwh)} kWh/Jahr`,
      '', 'Winterhalbjahr (Oktober bis März, Monate des Referenzjahrs)',
      `Winter-Autarkie: ${formatPct(results.simulation.winter.autarkyPct)} %`,
      `Winter-Netzbezug: ${formatKwh(results.simulation.winter.gridImportKwh)} kWh`,
      '', 'Stromkostenvorteil vor laufenden Kosten',
      `Vermiedener Netzbezug: ${Math.round(results.jahresersparnis)} Euro/Jahr`,
      `Einspeiseerlös (Modell): ${Math.round(results.einspeiseverguetung)} Euro/Jahr`,
      `Summe: ${Math.round(results.gesamtersparnis)} Euro/Jahr; Strompreis: ${(strompreis * 100).toFixed(0)} ct/kWh`,
      `Vergütung: ${(results.verguetungProKwh * 100).toFixed(2)} ct/kWh, Inbetriebnahme Aug-Dez 2026`,
    ];
    let y = 30;
    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, 188);
      doc.text(wrapped, 10, y);
      y += wrapped.length * 6;
    }
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(`PVGIS-Wetterreferenz Leipzig ${leipzigPvReference.year}. Modellierter PV-Ertrag und angenommene Lastprofile, keine Messdaten Ihres Dachs. Speicher: 90 % nutzbar, 95 % Wirkungsgrad je Richtung, max. 5 kW bzw. 0,5 C. Verschattung, Standby-Verbrauch, tatsächliches Verhalten, Alterung und Betriebskosten sind nicht vollständig erfasst. Keine Garantie für Ertrag, Autarkie oder Wirtschaftlichkeit.`, 188), 10, 220);
    doc.addPage();
    doc.setFontSize(16); doc.text('Monatsbilanz der Modellrechnung', 10, 20);
    doc.setFontSize(11); doc.text('Monat       PV (kWh)        Bedarf (kWh)       Netz (kWh)        Autarkie', 10, 34);
    results.simulation.monthly.forEach((month, i) => {
      const y = 44 + i * 9;
      doc.text(MONTH_NAMES[i], 10, y);
      doc.text(formatKwh(month.pvGeneratedKwh), 38, y);
      doc.text(formatKwh(month.loadKwh), 76, y);
      doc.text(formatKwh(month.gridImportKwh), 117, y);
      doc.text(`${formatPct(month.autarkyPct)} %`, 160, y);
    });
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize('Mehr PV-Ertrag im Sommer bedeutet nicht, dass dieser Strom im Winter zur Verfügung steht. Der Speicher verschiebt Energie nur, solange sein stündlich bilanzierter Ladezustand ausreicht. Dachausrichtung/Neigung außerhalb der Süd-30-Grad-Referenz sind Näherungen. Quelle: PVGIS/JRC, Modellstand 07.11.2026.',188),10,170);
    doc.save('presolaris-solar-report.pdf');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      
      {/* 1. DACH-CHECK & ADRESSE */}
      <Card className="border-none shadow-lg bg-white overflow-hidden">
         <div className="bg-[var(--primary-blue)] p-4 text-white flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[var(--primary-turquoise)]" />
            <h2 className="text-xl font-bold">1. Angaben zum Dach</h2>
         </div>
         <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-4">Dies ist eine Modellrechnung für Leipzig und Umgebung. Es werden keine Satelliten- oder Dachflächen automatisch geprüft. Geben Sie die Ihnen bekannten Dachwerte selbst an.</p>
            <div className="space-y-2 mb-5">
                <Label htmlFor="address">Projektadresse (optional, nur für Ihre Anfrage)</Label>
                <Input id="address" placeholder="Musterstraße 1, 04316 Leipzig" value={adresse}
                    onChange={(e) => setAdresse(e.target.value)} className="border-gray-300" />
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="orientation" className="flex items-center gap-2">
                            Dachausrichtung (selbst wählen)
                        </Label>
                        <select 
                            id="orientation"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-[var(--primary-blue)]"
                            value={ausrichtung}
                            onChange={(e) => setAusrichtung(e.target.value)}
                        >
                            {Object.keys(ORIENTATION_FACTORS).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pitch" className="flex items-center gap-2">
                            Dachneigung (selbst wählen)
                        </Label>
                        <select 
                            id="pitch"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-[var(--primary-blue)]"
                            value={neigung}
                            onChange={(e) => setNeigung(e.target.value)}
                        >
                            {Object.keys(PITCH_FACTORS).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LINKS: KONFIGURATOR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden h-full">
            <div className="bg-[var(--primary-blue)] p-4 text-white flex items-center gap-3">
              <Sun className="w-6 h-6 text-[var(--primary-yellow)]" />
              <h2 className="text-xl font-bold">2. Konfiguration</h2>
            </div>
            
            <CardContent className="p-6 space-y-8">
              
              {/* PV Leistung - GELB */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">PV-Leistung</Label>
                  <span className="text-lg font-bold text-[var(--primary-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {anlagengroesse} kWp
                  </span>
                </div>
                <Slider
                  value={[anlagengroesse]}
                  min={3}
                  max={25}
                  step={0.5}
                  onValueChange={(val) => setAnlagengroesse(val[0])}
                  className="py-2 [&_.bg-primary]:bg-[var(--primary-yellow)] [&_.border-primary]:border-[var(--primary-yellow)]"
                  aria-label="Anlagengröße in Kilowatt-Peak"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Ca. {Math.ceil(anlagengroesse / 0.4)} Module benötigt
                </p>
              </div>

              {/* Jahresverbrauch - BLAU */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">Stromverbrauch</Label>
                  <span className="text-lg font-bold text-[var(--primary-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {jahresverbrauch} kWh
                  </span>
                </div>
                <Slider
                  value={[jahresverbrauch]}
                  min={1000}
                  max={10000}
                  step={100}
                  onValueChange={(val) => setJahresverbrauch(val[0])}
                  className="py-2 [&_.bg-primary]:bg-[var(--primary-blue)] [&_.border-primary]:border-[var(--primary-blue)]"
                  aria-label="Jahresverbrauch in Kilowattstunden"
                />
                
                {/* Wärmepumpe Switch */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[var(--senec-orange)]" />
                        <Label htmlFor="wp-mode" className="text-sm font-medium text-gray-700 cursor-pointer">Wärmepumpe (+3.000 kWh)</Label>
                    </div>
                    <Switch 
                        id="wp-mode"
                        checked={mitWaermepumpe}
                        onCheckedChange={setMitWaermepumpe}
                        className="data-[state=checked]:bg-[var(--senec-orange)]"
                        aria-label="Wärmepumpe aktivieren"
                    />
                </div>
                
                {/* E-Auto Switch */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-green-600" />
                        <Label htmlFor="ev-mode" className="text-sm font-medium text-gray-700 cursor-pointer">E-Auto vorhanden</Label>
                    </div>
                    <Switch 
                        id="ev-mode"
                        checked={mitEAuto}
                        onCheckedChange={setMitEAuto}
                        className="data-[state=checked]:bg-green-600"
                        aria-label="E-Auto aktivieren"
                    />
                </div>
                
                {mitEAuto && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <Label className="text-xs text-gray-600">Fahrleistung / Jahr</Label>
                           <span className="text-xs font-bold text-green-700">{eAutoKm.toLocaleString()} km</span>
                        </div>
                        <Slider
                          value={[eAutoKm]}
                          min={2000}
                          max={40000}
                          step={1000}
                          onValueChange={(val) => setEAutoKm(val[0])}
                          className="py-2 [&_.bg-primary]:bg-green-600 [&_.border-primary]:border-green-600"
                          aria-label="E-Auto Fahrleistung pro Jahr in Kilometern"
                        />
                    </div>
                    
                    {/* Ladezeit Toggle */}
                    <div className="bg-green-50 p-2 rounded-md border border-green-100">
                        <Label className="text-xs text-gray-600 mb-2 block">Wann wird geladen?</Label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEAutoLadezeit('tag')}
                                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                                    eAutoLadezeit === 'tag' 
                                    ? 'bg-green-600 text-white shadow-sm' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Sun className="w-3 h-3 mr-1" /> Tagsüber
                            </button>
                            <button
                                onClick={() => setEAutoLadezeit('abend')}
                                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                                    eAutoLadezeit === 'abend' 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Moon className="w-3 h-3 mr-1" /> Abends
                            </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Strompreis - GRAU */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">Aktueller Strompreis</Label>
                  <span className="text-lg font-bold text-[var(--primary-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {(strompreis * 100).toFixed(0)} ct/kWh
                  </span>
                </div>
                <Slider
                  value={[strompreis * 100]}
                  min={20}
                  max={80}
                  step={1}
                  onValueChange={(val) => setStrompreis(val[0] / 100)}
                  className="py-2 [&_.bg-primary]:bg-gray-500 [&_.border-primary]:border-gray-500"
                  aria-label="Aktueller Strompreis in Cent pro Kilowattstunde"
                />
              </div>

              {/* Speicher Option - TÜRKIS */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold text-gray-700">Stromspeicher</Label>
                  <Switch
                    checked={mitSpeicher}
                    onCheckedChange={setMitSpeicher}
                    className="data-[state=checked]:bg-[var(--primary-turquoise)]"
                    aria-label="Stromspeicher aktivieren"
                  />
                </div>
                
                {mitSpeicher && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-gray-600">Kapazität</Label>
                      <span className="font-bold text-[var(--primary-turquoise)]">
                        {speichergroesse} kWh
                      </span>
                    </div>
                    <Slider
                      value={[speichergroesse]}
                      min={2.5}
                      max={15}
                      step={2.5}
                      onValueChange={(val) => setSpeichergroesse(val[0])}
                      className="py-2 [&_.bg-primary]:bg-[var(--primary-turquoise)] [&_.border-primary]:border-[var(--primary-turquoise)]"
                      aria-label="Speichergröße in Kilowattstunden"
                    />
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RECHTS: VISUALISIERUNG & ERGEBNISSE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Energiefluss */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
             <div className="bg-[var(--primary-blue)] p-4 text-white flex items-center gap-3">
                <Zap className="w-6 h-6 text-[var(--primary-yellow)]" />
                <h2 className="text-xl font-bold">3. Energie-Simulation</h2>
             </div>
             <CardContent className="p-6">
                <EnergyFlowDiagram data={energyFlow} />
             </CardContent>
          </Card>

          {/* KPI Karten */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[var(--primary-blue)] to-[#1a3b6e] text-white border-none shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Leaf className="w-8 h-8 mb-2 text-[var(--primary-turquoise)]" />
                <div className="text-3xl font-bold mb-1">{formatPct(results.autarkiegrad)}%</div>
                <div className="text-sm opacity-80">Autarkie im Jahr (Modell)</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-[var(--primary-yellow)] shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Sun className="w-8 h-8 mb-2 text-[var(--primary-yellow)]" />
                <div className="text-3xl font-bold mb-1 text-gray-800">{formatPct(results.eigenverbrauchsquote)}%</div>
                <div className="text-sm text-gray-500">PV-Eigenverbrauch</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-[var(--primary-turquoise)] shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="text-3xl font-bold mb-1 text-[var(--primary-blue)]">{Math.round(results.gesamtersparnis).toLocaleString()} €</div>
                <div className="text-sm text-gray-500">Stromkostenvorteil / Jahr*</div>
                <div className="text-xs text-green-600 mt-1 font-medium">
                   Netzbezug: {formatKwh(results.netzbezug)} kWh/Jahr
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3" data-testid="solar-seasonal-balance">
            <h3 className="font-bold text-[var(--primary-blue)]">Winterhalbjahr: Versorgung und Netzbezug</h3>
            <p className="text-sm text-gray-700">
              Oktober–März: <strong>{formatPct(results.simulation.winter.autarkyPct)} % Autarkie</strong> und{' '}
              <strong>{formatKwh(results.simulation.winter.gridImportKwh)} kWh Netzbezug</strong> im Modell.
              Ein Hausspeicher überbrückt Stunden, keine ganze Jahreszeit.
            </p>
            <details className="text-sm text-gray-700">
              <summary className="cursor-pointer font-semibold">Monatswerte und Berechnungsannahmen anzeigen</summary>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-right">
                  <caption className="text-left text-gray-500 mb-2">Stündliche Bilanz, Monatswerte gerundet</caption>
                  <thead><tr><th className="py-2 text-left">Monat</th><th>PV kWh</th><th>Bedarf kWh</th><th>Netz kWh</th><th>Autarkie</th></tr></thead>
                  <tbody>{results.simulation.monthly.map((month, i) => <tr key={i} className="border-t border-gray-200">
                    <th className="py-1 text-left font-normal">{MONTH_NAMES[i]}</th><td>{formatKwh(month.pvGeneratedKwh)}</td>
                    <td>{formatKwh(month.loadKwh)}</td><td>{formatKwh(month.gridImportKwh)}</td><td>{formatPct(month.autarkyPct)} %</td>
                  </tr>)}</tbody>
                </table>
              </div>
              <p className="mt-3">PVGIS-Wetterreferenz für Leipzig, Jahr {leipzigPvReference.year}; PV-Leistung modelliert, nicht an Ihrem Dach gemessen. Referenz Süd/30°, andere Ausrichtungen und Neigungen vereinfacht angepasst. Haushalt mit angenommenem Tages-/Saisonprofil; Wärmepumpe +3.000 kWh saisonal verteilt, E-Auto 20 kWh/100 km und gewählte Ladezeit.</p>
              <p className="mt-2">Speicher: 90 % der eingestellten Kapazität nutzbar; 95 % Wirkungsgrad je Richtung, Lade-/Entladeleistung maximal 5 kW bzw. 0,5 C. Keine Netzladung. Speicherladung {formatKwh(results.simulation.batteryChargeKwh)} kWh/Jahr, nutzbare Entladung {formatKwh(results.simulation.batteryDischargeKwh)} kWh/Jahr, Verluste {formatKwh(results.simulation.batteryLossesKwh)} kWh/Jahr.</p>
              <p className="mt-2">Stündliche Werte glätten kurze Verbrauchsspitzen. Der Standby-Verbrauch des Speichers wird nicht separat berechnet. Der tatsächliche Netzbezug kann deshalb höher ausfallen; die Werte sind keine zugesicherte Mindestautarkie.</p>
              <p className="mt-2">*Vermiedene Stromkosten plus Einspeiseerlös, vor Betriebskosten. Vergütung {(results.verguetungProKwh * 100).toLocaleString('de-DE', { maximumFractionDigits: 2 })} ct/kWh: Leistungsstaffel für Inbetriebnahme August–Dezember 2026, nicht garantiert für spätere Inbetriebnahme. Alterung, negative Strompreise, Abregelung und individuelle Verschattung sind nicht vollständig abgebildet. Das Modell ersetzt keine konkrete Dach- und Verbrauchsplanung.</p>
              <p className="mt-2"><a href="https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en" target="_blank" rel="noopener noreferrer" className="underline">Datenquelle: PVGIS/JRC</a>{' · '}<a href="https://solar.htw-berlin.de/faq-unabhaengigkeitsrechner/" target="_blank" rel="noopener noreferrer" className="underline">Autarkie und Modellgrenzen: HTW Berlin</a></p>
            </details>
          </div>

          {/* CTA Bereich */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-800">Interesse geweckt?</h3>
                <p className="text-sm text-gray-600">Fordern Sie jetzt Ihr unverbindliches Angebot an.</p>
             </div>
             
             <div className="flex gap-3 w-full md:w-auto flex-col sm:flex-row">
                <Dialog open={isLeadFormOpen} onOpenChange={(open) => { setIsLeadFormOpen(open); if (open) { setLeadOpenedAt(Date.now()); setFormStep('form'); setLeadError(''); } }}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold h-12 px-8 text-lg uppercase tracking-wide shadow-md transition-all hover:scale-105">
                       Angebot anfordern
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white">
                    {formStep === 'form' ? (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-[var(--primary-blue)]">Kostenloses Angebot anfordern</DialogTitle>
                          <DialogDescription>
                            Basierend auf Ihrer Konfiguration für: <br/>
                            <span className="font-semibold text-gray-900">{adresse || "Ihr Gebäude"}</span>
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleLeadSubmit} className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              required 
                              placeholder="Max Mustermann"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-Mail</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              required 
                              placeholder="max@beispiel.de"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefon *</Label>
                            <Input 
                              id="phone" 
                              type="tel" 
                              required
                              pattern="^[+]?([0-9]|[ ]|-|[.]){6,22}$"
                              title="Bitte geben Sie eine gültige Telefonnummer ein"
                              placeholder="+49 123 456789"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                          
                          {/* Verstecktes Feld zur Bestätigung der Datenübernahme */}
                          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-100">
                             <p className="font-semibold mb-1">Ihre Projektdaten:</p>
                             <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>Adresse: {adresse || "Nicht angegeben"}</li>
                                <li>Anlage: {results.anlagengroesse} kWp ({ausrichtung}, {neigung})</li>
                                <li>Speicher: {mitSpeicher ? `${speichergroesse} kWh` : "Kein Speicher"}</li>
                                {mitWaermepumpe && <li>Inkl. Wärmepumpe</li>}
                                {mitEAuto && <li>Inkl. E-Auto ({eAutoKm.toLocaleString()} km/a)</li>}
                             </ul>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Nachricht (Optional)</Label>
                            <Input 
                              id="message" 
                              placeholder="Ihre Fragen oder Anmerkungen..."
                              value={formData.message}
                              onChange={(e) => setFormData({...formData, message: e.target.value})}
                            />
                          </div>
                          <label className="flex items-start gap-2 text-sm text-gray-700">
                            <input type="checkbox" required className="mt-1" />
                            <span>Ich habe die <a href="/datenschutz/" className="underline">Datenschutzerklärung</a> gelesen und bin mit der Kontaktaufnahme zu meiner Anfrage einverstanden.</span>
                          </label>
                          {leadError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-900">{leadError}</p>}
                          <DialogFooter className="pt-4">
                            <Button type="submit" disabled={sendingLead} className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold">
                              {sendingLead ? 'Anfrage wird gesendet …' : 'Jetzt unverbindlich anfragen'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </>
                    ) : (
                      <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-[var(--primary-blue)] text-center">Vielen Dank!</DialogTitle>
                          <DialogDescription className="text-center">
                            Fast geschafft: Bitte bestätigen Sie jetzt den Link, den wir an Ihre E-Mail-Adresse gesendet haben. Erst danach wird Ihre Anfrage an unser Beratungsteam weitergegeben.
                          </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setIsLeadFormOpen(false)} variant="outline" className="mt-4">
                          Zurück zum Rechner
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button onClick={generatePDF} variant="outline" className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700 h-12 gap-2">
                  <Download className="h-4 w-4" /> PDF speichern
                </Button>
             </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 italic pb-8">
        *Stündliche Modellrechnung mit Wetterreferenz und Lastprofilannahmen. Keine Ertrags-, Autarkie- oder Wirtschaftlichkeitsgarantie.
      </div>
    </div>
  );
}
