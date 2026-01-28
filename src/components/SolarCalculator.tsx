import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Battery, Leaf, Zap, Car, Home, ArrowRight, Download, MapPin, CheckCircle2, ArrowLeft, Send, Info, Loader2, Search, Flame } from "lucide-react";
import { jsPDF } from "jspdf";
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
  EINSPEISEVERGUETUNG: 0.082,    // €/kWh
  KOSTEN_PRO_KWP: 1400,          // €/kWp (ohne Speicher)
  SPEICHER_KOSTEN_PRO_KWH: 800,  // €/kWh Speicherkapazität
  
  // Technische Werte
  MODUL_LEISTUNG: 0.4,           // kWp pro Modul
  MODUL_FLAECHE: 1.7,            // m² pro Modul
  ERTRAG_PRO_KWP_LEIPZIG: 1000,  // kWh/kWp/Jahr (Leipzig)
  
  // Umwelt
  CO2_PRO_KWH: 0.485,            // kg CO2/kWh (Strommix Deutschland)
  CO2_PRO_BAUM: 10,              // kg CO2/Jahr pro Baum
  
  // Eigenverbrauch Basiswerte
  EIGENVERBRAUCH_OHNE_SPEICHER: 0.30,  // 30% Basis
  
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
  eAutoKm: number
): CalculationResults {
  // Anlagendaten
  const modulanzahl = Math.ceil(anlagengroesse / CONSTANTS.MODUL_LEISTUNG);
  const dachflaeche = modulanzahl * CONSTANTS.MODUL_FLAECHE;
  
  // Ertragskorrekturfaktoren
  const orientationFactor = ORIENTATION_FACTORS[ausrichtung] || 1.0;
  const pitchFactor = PITCH_FACTORS[neigung] || 1.0;
  const efficiencyFactor = orientationFactor * pitchFactor;

  // Ertrag
  const jahresertrag = anlagengroesse * CONSTANTS.ERTRAG_PRO_KWP_LEIPZIG * efficiencyFactor;
  const tagesertrag = jahresertrag / 365;
  const ertragProKwp = CONSTANTS.ERTRAG_PRO_KWP_LEIPZIG * efficiencyFactor;
  
  // --- EIGENVERBRAUCHS-BERECHNUNG (DYNAMISCH & GEWICHTET) ---
  
  // 1. Haushaltsstrom Quote berechnen
  let quoteHaushalt = CONSTANTS.EIGENVERBRAUCH_OHNE_SPEICHER;
  
  if (mitSpeicher && speichergroesse > 0) {
    const tagesverbrauchHaushalt = jahresverbrauchBasis / 365;
    const speicherVerhaeltnis = speichergroesse / tagesverbrauchHaushalt;
    const speicherBonus = Math.min(0.50, 0.40 * Math.sqrt(speicherVerhaeltnis));
    quoteHaushalt += speicherBonus;
  }
  
  // Sättigung und PV-Verhältnis Korrektur für Haushalt
  quoteHaushalt = Math.min(0.85, quoteHaushalt);
  const pvVerhaeltnisHaushalt = jahresertrag / jahresverbrauchBasis;
  if (pvVerhaeltnisHaushalt < 1.0) {
      quoteHaushalt = Math.min(0.95, quoteHaushalt * (1 + (1 - pvVerhaeltnisHaushalt) * 0.5));
  } else {
      quoteHaushalt = Math.max(0.15, quoteHaushalt * (1 / Math.sqrt(pvVerhaeltnisHaushalt)));
  }

  // 2. Wärmepumpen Quote berechnen (falls aktiv)
  let quoteWaermepumpe = 0;
  let verbrauchWP = 0;
  
  if (mitWaermepumpe) {
      verbrauchWP = CONSTANTS.WAERMEPUMPE_VERBRAUCH;
      
      // Basis-Quote für WP ist gering (Winter!)
      let basisQuoteWP = 0.15; // Ohne Speicher
      
      if (mitSpeicher && speichergroesse > 0) {
          const tagesverbrauchWP = CONSTANTS.WAERMEPUMPE_VERBRAUCH / 365;
          const speicherVerhaeltnisWP = speichergroesse / (tagesverbrauchWP * 2);
          const speicherBonusWP = Math.min(0.25, 0.20 * Math.sqrt(speicherVerhaeltnisWP));
          basisQuoteWP += speicherBonusWP;
      }
      
      const pvVerhaeltnisGesamt = jahresertrag / (jahresverbrauchBasis + verbrauchWP);
       if (pvVerhaeltnisGesamt < 1.0) {
          basisQuoteWP = Math.min(0.60, basisQuoteWP * (1 + (1 - pvVerhaeltnisGesamt) * 0.3));
      } else {
           basisQuoteWP = Math.max(0.10, basisQuoteWP * (1 / Math.pow(pvVerhaeltnisGesamt, 0.3)));
      }
      
      quoteWaermepumpe = basisQuoteWP;
  }

  // 3. E-Auto Quote berechnen (falls aktiv)
  let quoteEAuto = 0;
  let verbrauchEAuto = 0;

  if (mitEAuto) {
      verbrauchEAuto = (eAutoKm / 100) * CONSTANTS.E_AUTO_VERBRAUCH_PRO_100KM;
      
      // E-Autos werden oft abends geladen -> Speicher wichtig!
      // Tagsüber laden (Wochenende) -> Direktverbrauch
      let basisQuoteEAuto = 0.20; // Ohne Speicher (nur Laden am Wochenende tagsüber)

      if (mitSpeicher && speichergroesse > 0) {
          // Speicher hilft massiv, wenn man abends heimkommt
          const tagesverbrauchEAuto = verbrauchEAuto / 365;
          const speicherVerhaeltnisEAuto = speichergroesse / tagesverbrauchEAuto;
          const speicherBonusEAuto = Math.min(0.40, 0.30 * Math.sqrt(speicherVerhaeltnisEAuto));
          basisQuoteEAuto += speicherBonusEAuto;
      }

      // PV Verhältnis Check
      const gesamtVerbrauchBisher = jahresverbrauchBasis + verbrauchWP + verbrauchEAuto;
      const pvVerhaeltnisGesamt = jahresertrag / gesamtVerbrauchBisher;

      if (pvVerhaeltnisGesamt < 1.0) {
           // Wenn Anlage klein ist, wird fast alles was sie produziert auch ins Auto geladen (wenn es da ist)
           basisQuoteEAuto = Math.min(0.70, basisQuoteEAuto * 1.1);
      } else {
           // Wenn Anlage riesig ist, ist der relative Anteil geringer
           basisQuoteEAuto = Math.max(0.15, basisQuoteEAuto * 0.9);
      }

      quoteEAuto = basisQuoteEAuto;
  }

  // 4. Gewichtete Gesamtquote ermitteln
  const gesamtVerbrauch = jahresverbrauchBasis + verbrauchWP + verbrauchEAuto;
  let eigenverbrauchsquote = 0;
  
  const anteilHaushalt = jahresverbrauchBasis / gesamtVerbrauch;
  const anteilWP = verbrauchWP / gesamtVerbrauch;
  const anteilEAuto = verbrauchEAuto / gesamtVerbrauch;

  eigenverbrauchsquote = (quoteHaushalt * anteilHaushalt) + (quoteWaermepumpe * anteilWP) + (quoteEAuto * anteilEAuto);

  // --- FINALE WERTE ---

  const eigenverbrauch = Math.min(jahresertrag * eigenverbrauchsquote, gesamtVerbrauch);
  const netzeinspeisung = Math.max(0, jahresertrag - eigenverbrauch);
  const netzbezug = Math.max(0, gesamtVerbrauch - eigenverbrauch);
  
  // Autarkiegrad = Anteil des Eigenverbrauchs am Gesamtverbrauch
  const autarkiegrad = Math.min(100, (eigenverbrauch / gesamtVerbrauch) * 100);
  
  // Kosten
  const anschaffungskosten = anlagengroesse * CONSTANTS.KOSTEN_PRO_KWP;
  const speicherkosten = mitSpeicher ? speichergroesse * CONSTANTS.SPEICHER_KOSTEN_PRO_KWH : 0;
  const gesamtkosten = anschaffungskosten + speicherkosten;
  const kostenProKwp = CONSTANTS.KOSTEN_PRO_KWP;
  
  // Ersparnis
  const stromkostenVorher = gesamtVerbrauch * strompreis;
  const stromkostenNachher = netzbezug * strompreis;
  const jahresersparnis = stromkostenVorher - stromkostenNachher;
  const einspeiseverguetung = netzeinspeisung * CONSTANTS.EINSPEISEVERGUETUNG;
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
    eigenverbrauchsquote: (eigenverbrauch / jahresertrag) * 100,
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
  };
}

function calculateEnergyFlow(results: CalculationResults): EnergyFlowData {
  const solarProduction = results.jahresertrag;
  const totalConsumption = results.jahresverbrauch;
  
  const directConsumption = results.eigenverbrauch * 0.4;
  const batteryCharge = results.eigenverbrauch * 0.6;
  const gridFeedIn = results.netzeinspeisung;
  const batteryDischarge = batteryCharge * 0.95;
  const gridConsumption = results.netzbezug;
  
  return {
    solarProduction,
    directConsumption,
    batteryCharge,
    gridFeedIn,
    batteryDischarge,
    gridConsumption,
    totalConsumption,
  };
}

// ==================== ENERGIEFLUSS-DIAGRAMM ====================

const EnergyFlowDiagram: React.FC<{ data: EnergyFlowData }> = ({ data }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, [data]);
  
  const formatValue = (value: number) => Math.round(value).toLocaleString();
  
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
      {/* Sonne (Oben Mitte) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-20 h-20 bg-[var(--senec-yellow)] rounded-full flex items-center justify-center shadow-lg cursor-help">
              <Sun className="w-10 h-10 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-center">
            <p className="font-bold mb-1">Berechnungsgrundlage</p>
            <p>Faustformel für Deutschland:</p>
            <p className="font-medium">1 kWp Leistung ≈ 1.000 kWh Ertrag pro Jahr</p>
            <p className="mt-2 text-xs opacity-80">(Abhängig von Dachneigung und Ausrichtung)</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--senec-blue)]">
          {formatValue(data.solarProduction)} kWh/Jahr
        </div>
        <div className="text-xs text-gray-500">Solar-Ertrag</div>
      </div>
      
      {/* Batterie (Links Mitte) */}
      <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-16 h-24 bg-[var(--senec-turquoise)] rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden cursor-help border-2 border-white">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-[#009ca6] transition-all duration-1000"
                style={{ height: animate ? '70%' : '50%' }}
              />
              <Battery className="w-8 h-8 text-white relative z-10" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Überschüssige Energie wird hier gespeichert.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--senec-blue)]">
          {formatValue(data.batteryCharge)} kWh
        </div>
        <div className="text-xs text-gray-500">Gespeichert</div>
      </div>
      
      {/* Haus (Rechts Mitte) */}
      <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 text-center z-10">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-20 h-20 bg-[var(--senec-blue)] rounded-lg flex items-center justify-center shadow-lg cursor-help border-2 border-white">
              <Home className="w-10 h-10 text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Direkter Verbrauch im Haushalt.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--senec-blue)]">
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
            <p>Einspeisung ins öffentliche Netz.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--senec-blue)]">
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
  
  // Analyse Simulation States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0: Start, 1: Geocoding, 2: Solar Data, 3: Done
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const [results, setResults] = useState<CalculationResults>(
    calculateResults(8, 4000, true, 5, 0.40, "Süd", "30° (Optimal)", false, false, 10000)
  );
  
  const [energyFlow, setEnergyFlow] = useState<EnergyFlowData>(
    calculateEnergyFlow(results)
  );

  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [formStep, setFormStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Effekt: Berechnen bei Änderungen
  useEffect(() => {
    const res = calculateResults(anlagengroesse, jahresverbrauch, mitSpeicher, speichergroesse, strompreis, ausrichtung, neigung, mitWaermepumpe, mitEAuto, eAutoKm);
    setResults(res);
    setEnergyFlow(calculateEnergyFlow(res));
  }, [anlagengroesse, jahresverbrauch, mitSpeicher, speichergroesse, strompreis, ausrichtung, neigung, mitWaermepumpe, mitEAuto, eAutoKm]);

  // Handler
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead Data:", { ...formData, adresse, results });
    setFormStep('success');
  };

  const startAnalysis = () => {
    if (!adresse) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);
    
    // Schritt 1: Geocoding simulieren (1.5s)
    setTimeout(() => {
        setAnalysisStep(2);
    }, 1500);

    // Schritt 2: Solar Daten simulieren (2.5s)
    setTimeout(() => {
        setAnalysisStep(3);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
        // Simulierte Ergebnisse setzen (zufällige Variation für Realismus)
        const simulatedOrientation = Math.random() > 0.5 ? "Süd" : "Süd-West";
        const simulatedPitch = Math.random() > 0.5 ? "30° (Optimal)" : "45° (Steil)";
        setAusrichtung(simulatedOrientation);
        setNeigung(simulatedPitch);
    }, 4000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(255, 165, 0); // Senec Orange
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("SENEC Solar-Report", 10, 15);
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Erstellt am: ${new Date().toLocaleDateString()}`, 10, 30);
    
    if (adresse) {
        doc.text(`Projektadresse: ${adresse}`, 10, 40);
        doc.text(`Dach: ${ausrichtung}, ${neigung}`, 10, 46);
    }
    
    doc.setFontSize(16);
    doc.text("Ihre Konfiguration", 10, 60);
    
    doc.setFontSize(12);
    doc.text(`Anlagengröße: ${results.anlagengroesse} kWp`, 10, 70);
    doc.text(`Speicher: ${mitSpeicher ? `${speichergroesse} kWh` : 'Kein Speicher'}`, 10, 76);
    doc.text(`Haushaltsstrom: ${jahresverbrauch} kWh`, 10, 82);
    
    let yPos = 88;
    if (mitWaermepumpe) {
        doc.text(`Wärmepumpe: Ja (+3.000 kWh)`, 10, yPos);
        yPos += 6;
    }
    if (mitEAuto) {
        doc.text(`E-Auto: Ja (${eAutoKm.toLocaleString()} km/Jahr)`, 10, yPos);
        yPos += 6;
    }
    
    doc.text(`Gesamtverbrauch: ${Math.round(results.jahresverbrauch)} kWh`, 10, yPos + 6);
    
    doc.setFontSize(16);
    doc.text("Wirtschaftlichkeit (Prognose)", 10, yPos + 22);
    
    doc.setFontSize(12);
    doc.text(`Autarkiegrad: ${Math.round(results.autarkiegrad)}%`, 10, yPos + 32);
    doc.text(`Eigenverbrauchsquote: ${Math.round(results.eigenverbrauchsquote)}%`, 10, yPos + 38);
    doc.text(`Ersparnis (1. Jahr): ${Math.round(results.gesamtersparnis)} €`, 10, yPos + 44);
    doc.text(`Amortisation: ca. ${Math.round(results.amortisationszeit)} Jahre`, 10, yPos + 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("*Dies ist eine unverbindliche Modellrechnung basierend auf Standardwerten.", 10, 280);
    doc.text("Für ein verbindliches Angebot kontaktieren Sie uns bitte.", 10, 285);
    
    doc.save("senec-solar-report.pdf");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      
      {/* 1. DACH-CHECK & ADRESSE */}
      <Card className="border-none shadow-lg bg-white overflow-hidden">
         <div className="bg-[var(--senec-blue)] p-4 text-white flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[var(--senec-turquoise)]" />
            <h2 className="text-xl font-bold">1. Ihr Dach-Check</h2>
         </div>
         <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-grow w-full">
                    <Label htmlFor="address">Adresse / Standort</Label>
                    <div className="relative">
                        <Input 
                            id="address" 
                            placeholder="Musterstraße 1, 12345 Musterstadt" 
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                            className="border-gray-300 focus:border-[var(--senec-blue)] pl-10"
                            disabled={isAnalyzing}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <Button 
                    onClick={startAnalysis} 
                    disabled={!adresse || isAnalyzing || analysisComplete}
                    className="w-full md:w-auto bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold"
                >
                    {isAnalyzing ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Analysiere...
                        </>
                    ) : analysisComplete ? (
                        <>
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Analyse fertig
                        </>
                    ) : (
                        "Jetzt prüfen"
                    )}
                </Button>
            </div>

            {/* Analyse Status Overlay / Feedback */}
            {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-pulse">
                    <div className="flex items-center gap-3 text-[var(--senec-blue)]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">
                            {analysisStep === 1 && "Standort wird ermittelt..."}
                            {analysisStep === 2 && "Dachfläche und Sonneneinstrahlung werden berechnet..."}
                        </span>
                    </div>
                </div>
            )}

            {/* Ergebnisse der Analyse */}
            {analysisComplete && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                        <Label htmlFor="orientation" className="flex items-center gap-2">
                            Dachausrichtung 
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ermittelt</span>
                        </Label>
                        <select 
                            id="orientation"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-[var(--senec-blue)]"
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
                            Dachneigung
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ermittelt</span>
                        </Label>
                        <select 
                            id="pitch"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-[var(--senec-blue)]"
                            value={neigung}
                            onChange={(e) => setNeigung(e.target.value)}
                        >
                            {Object.keys(PITCH_FACTORS).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LINKS: KONFIGURATOR */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden h-full">
            <div className="bg-[var(--senec-blue)] p-4 text-white flex items-center gap-3">
              <Sun className="w-6 h-6 text-[var(--senec-yellow)]" />
              <h2 className="text-xl font-bold">2. Konfiguration</h2>
            </div>
            
            <CardContent className="p-6 space-y-8">
              
              {/* PV Leistung - GELB */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">PV-Leistung</Label>
                  <span className="text-lg font-bold text-[var(--senec-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {anlagengroesse} kWp
                  </span>
                </div>
                <Slider
                  value={[anlagengroesse]}
                  min={3}
                  max={25}
                  step={0.5}
                  onValueChange={(val) => setAnlagengroesse(val[0])}
                  className="py-2 [&_.bg-primary]:bg-[var(--senec-yellow)] [&_.border-primary]:border-[var(--senec-yellow)]"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Ca. {Math.ceil(anlagengroesse / 0.4)} Module benötigt
                </p>
              </div>

              {/* Jahresverbrauch - BLAU */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">Stromverbrauch</Label>
                  <span className="text-lg font-bold text-[var(--senec-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {jahresverbrauch} kWh
                  </span>
                </div>
                <Slider
                  value={[jahresverbrauch]}
                  min={1000}
                  max={10000}
                  step={100}
                  onValueChange={(val) => setJahresverbrauch(val[0])}
                  className="py-2 [&_.bg-primary]:bg-[var(--senec-blue)] [&_.border-primary]:border-[var(--senec-blue)]"
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
                    />
                </div>
                
                {mitEAuto && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2">
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
                    />
                  </div>
                )}
              </div>

              {/* Strompreis - GRAU */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-gray-700">Aktueller Strompreis</Label>
                  <span className="text-lg font-bold text-[var(--senec-blue)] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
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
                />
              </div>

              {/* Speicher Option - TÜRKIS */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold text-gray-700">Stromspeicher</Label>
                  <Switch
                    checked={mitSpeicher}
                    onCheckedChange={setMitSpeicher}
                    className="data-[state=checked]:bg-[var(--senec-turquoise)]"
                  />
                </div>
                
                {mitSpeicher && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-gray-600">Kapazität</Label>
                      <span className="font-bold text-[var(--senec-turquoise)]">
                        {speichergroesse} kWh
                      </span>
                    </div>
                    <Slider
                      value={[speichergroesse]}
                      min={2.5}
                      max={15}
                      step={2.5}
                      onValueChange={(val) => setSpeichergroesse(val[0])}
                      className="py-2 [&_.bg-primary]:bg-[var(--senec-turquoise)] [&_.border-primary]:border-[var(--senec-turquoise)]"
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
             <div className="bg-[var(--senec-blue)] p-4 text-white flex items-center gap-3">
                <Zap className="w-6 h-6 text-[var(--senec-yellow)]" />
                <h2 className="text-xl font-bold">3. Energie-Simulation</h2>
             </div>
             <CardContent className="p-6">
                <EnergyFlowDiagram data={energyFlow} />
             </CardContent>
          </Card>

          {/* KPI Karten */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[var(--senec-blue)] to-[#1a3b6e] text-white border-none shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Leaf className="w-8 h-8 mb-2 text-[var(--senec-turquoise)]" />
                <div className="text-3xl font-bold mb-1">{Math.round(results.autarkiegrad)}%</div>
                <div className="text-sm opacity-80">Unabhängigkeit</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-[var(--senec-yellow)] shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Sun className="w-8 h-8 mb-2 text-[var(--senec-yellow)]" />
                <div className="text-3xl font-bold mb-1 text-gray-800">{Math.round(results.eigenverbrauchsquote)}%</div>
                <div className="text-sm text-gray-500">Eigenverbrauch</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-[var(--senec-turquoise)] shadow-md">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="text-3xl font-bold mb-1 text-[var(--senec-blue)]">{Math.round(results.gesamtersparnis).toLocaleString()} €</div>
                <div className="text-sm text-gray-500">Ersparnis pro Jahr</div>
                <div className="text-xs text-green-600 mt-1 font-medium">
                   ROI: {results.roi.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Bereich */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-800">Interesse geweckt?</h3>
                <p className="text-sm text-gray-600">Fordern Sie jetzt Ihr unverbindliches Angebot an.</p>
             </div>
             
             <div className="flex gap-3 w-full md:w-auto flex-col sm:flex-row">
                <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold h-12 px-8 text-lg uppercase tracking-wide shadow-md transition-all hover:scale-105">
                       Angebot anfordern
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white">
                    {formStep === 'form' ? (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-[var(--senec-blue)]">Kostenloses Angebot anfordern</DialogTitle>
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
                            <Label htmlFor="phone">Telefon</Label>
                            <Input 
                              id="phone" 
                              type="tel" 
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
                          <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold">
                              Jetzt unverbindlich anfragen
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
                          <DialogTitle className="text-2xl font-bold text-[var(--senec-blue)] text-center">Vielen Dank!</DialogTitle>
                          <DialogDescription className="text-center">
                            Ihre Anfrage wurde erfolgreich übermittelt. Einer unserer Solar-Experten wird sich in Kürze bei Ihnen melden.
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
        *Unverbindliche Schätzung basierend auf Standardwerten.
      </div>
    </div>
  );
}
