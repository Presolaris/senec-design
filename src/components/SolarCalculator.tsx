import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Battery, Leaf, Zap, Car, Home, ArrowRight, Download, MapPin, CheckCircle2, ArrowLeft, Send, Info } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
  // Eigenverbrauch (abhängig von Speicher)
  EIGENVERBRAUCH_OHNE_SPEICHER: 0.30,  // 30%
  EIGENVERBRAUCH_MIT_SPEICHER: 0.70,   // 70%
};

// ==================== BERECHNUNGS-FUNKTIONEN ====================

function calculateResults(
  anlagengroesse: number,
  jahresverbrauch: number,
  mitSpeicher: boolean,
  speichergroesse: number,
  strompreis: number // in Euro/kWh
): CalculationResults {
  // Anlagendaten
  const modulanzahl = Math.ceil(anlagengroesse / CONSTANTS.MODUL_LEISTUNG);
  const dachflaeche = modulanzahl * CONSTANTS.MODUL_FLAECHE;
  
  // Ertrag
  const jahresertrag = anlagengroesse * CONSTANTS.ERTRAG_PRO_KWP_LEIPZIG;
  const tagesertrag = jahresertrag / 365;
  const ertragProKwp = CONSTANTS.ERTRAG_PRO_KWP_LEIPZIG;
  
  // Eigenverbrauch
  const eigenverbrauchsquote = mitSpeicher 
    ? CONSTANTS.EIGENVERBRAUCH_MIT_SPEICHER 
    : CONSTANTS.EIGENVERBRAUCH_OHNE_SPEICHER;
  
  const eigenverbrauch = Math.min(jahresertrag * eigenverbrauchsquote, jahresverbrauch);
  const netzeinspeisung = jahresertrag - eigenverbrauch;
  const netzbezug = Math.max(0, jahresverbrauch - eigenverbrauch);
  const autarkiegrad = (eigenverbrauch / jahresverbrauch) * 100;
  
  // Kosten
  const anschaffungskosten = anlagengroesse * CONSTANTS.KOSTEN_PRO_KWP;
  const speicherkosten = mitSpeicher ? speichergroesse * CONSTANTS.SPEICHER_KOSTEN_PRO_KWH : 0;
  const gesamtkosten = anschaffungskosten + speicherkosten;
  const kostenProKwp = CONSTANTS.KOSTEN_PRO_KWP;
  
  // Ersparnis
  const stromkostenVorher = jahresverbrauch * strompreis;
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
    jahresverbrauch,
    eigenverbrauchsquote: eigenverbrauchsquote * 100,
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
  // Vereinfachte Tageswerte für Visualisierung
  const solarProduction = results.tagesertrag;
  const totalConsumption = results.jahresverbrauch / 365;
  const directConsumption = solarProduction * 0.3; // 30% Direktverbrauch
  const batteryCharge = solarProduction * 0.4;     // 40% in Batterie
  const gridFeedIn = solarProduction * 0.3;        // 30% Einspeisung
  const batteryDischarge = batteryCharge * 0.9;    // 90% Effizienz
  const gridConsumption = Math.max(0, totalConsumption - directConsumption - batteryDischarge);
  
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
  
  const formatValue = (value: number) => value.toFixed(1);
  
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
          <TooltipContent>
            <p>Ihre Solaranlage produziert sauberen Strom.</p>
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <div className="mt-2 text-sm font-bold text-[var(--senec-blue)]">
          {formatValue(data.solarProduction)} kWh
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
        <div className="text-xs text-gray-500">Speicher</div>
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
          {formatValue(data.totalConsumption)} kWh
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
          {formatValue(data.gridFeedIn)} kWh
        </div>
        <div className="text-xs text-gray-500">Einspeisung</div>
      </div>
      
      {/* Animierte Pfeile (SVG Overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--senec-turquoise)" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--senec-blue)" />
          </marker>
          <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--senec-yellow)" />
          </marker>
        </defs>
        
        {/* Verbindungen zeichnen - Positionen müssen relativ zu den Containern sein */}
        {/* Da wir hier feste Pixelwerte im Originalcode hatten, passen wir sie dynamisch an die Containergröße an oder nutzen % */}
        
        {/* Vereinfachte Darstellung für Responsive Container: */}
        {/* Sonne -> Mitte */}
        <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="var(--senec-yellow)" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Mitte -> Haus */}
        <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="var(--senec-blue)" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
        
        {/* Mitte -> Batterie */}
        <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="var(--senec-turquoise)" strokeWidth="2" markerEnd="url(#arrowhead-green)" />
        
        {/* Mitte -> Netz */}
        <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="gray" strokeWidth="2" />

      </svg>
      
      {/* Legende */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 space-y-1 bg-white/80 p-2 rounded backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[var(--senec-turquoise)] rounded-full"></div>
          <span>Speicherladung</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[var(--senec-blue)] rounded-full"></div>
          <span>Direktverbrauch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Netzeinspeisung</span>
        </div>
      </div>
    </div>
  );
};

// ==================== HAUPT-KOMPONENTE ====================

export default function SolarCalculator() {
  // State
  const [anlagengroesse, setAnlagengroesse] = useState(8);
  const [jahresverbrauch, setJahresverbrauch] = useState(4000);
  const [mitSpeicher, setMitSpeicher] = useState(true);
  const [speichergroesse, setSpeichergroesse] = useState(10);
  const [strompreis, setStrompreis] = useState(40); // Cent/kWh
  
  // Berechnungen
  const results = calculateResults(anlagengroesse, jahresverbrauch, mitSpeicher, speichergroesse, strompreis / 100);
  const energyFlow = calculateEnergyFlow(results);

  // PDF Generierung
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(0, 0, 153); // SENEC Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Ihr Solar-Ertragsrechner", 20, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Anlagengröße: ${results.anlagengroesse} kWp`, 20, 60);
    doc.text(`Jahresertrag: ${results.jahresertrag.toLocaleString()} kWh`, 20, 70);
    doc.text(`Jahresverbrauch: ${results.jahresverbrauch.toLocaleString()} kWh`, 20, 80);
    doc.text(`Autarkiegrad: ${results.autarkiegrad.toFixed(0)}%`, 20, 90);
    doc.text(`Gesamtersparnis (25 Jahre): ${results.ersparnis25Jahre.toLocaleString()} €`, 20, 110);
    doc.text(`Amortisationszeit: ${results.amortisationszeit.toFixed(1)} Jahre`, 20, 120);
    
    doc.save("solar-ertragsrechnung.pdf");
  };
  
  return (
    <Card className="w-full shadow-xl border-0 overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col xl:flex-row">
          {/* LEFT: Controls */}
          <div className="p-6 lg:p-8 flex-1 space-y-8 bg-white border-r border-gray-100">
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[var(--senec-blue)] flex items-center gap-2">
                  <Sun className="h-6 w-6 text-[var(--senec-orange)]" /> Solar-Konfigurator
                </h3>
                <p className="text-gray-500 text-sm">Passen Sie die Werte an Ihren Haushalt an.</p>
             </div>

             <div className="space-y-8">
                {/* Anlagengröße */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)]">Anlagengröße</Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded text-sm">{anlagengroesse} kWp</span>
                  </div>
                  <Slider value={[anlagengroesse]} onValueChange={(v) => setAnlagengroesse(v[0])} min={3} max={20} step={0.5} className="py-2 [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-[var(--senec-yellow)] [&>span:last-child]:border-[var(--senec-yellow)] [&>span:last-child]:bg-white" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>3 kWp</span>
                    <span>20 kWp</span>
                  </div>
                </div>

                {/* Jahresverbrauch */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)]">Jahresverbrauch</Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded text-sm">{jahresverbrauch.toLocaleString()} kWh</span>
                  </div>
                  <Slider value={[jahresverbrauch]} onValueChange={(v) => setJahresverbrauch(v[0])} min={2000} max={10000} step={500} className="py-2 [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-[var(--senec-blue)] [&>span:last-child]:border-[var(--senec-blue)] [&>span:last-child]:bg-white" />
                   <div className="flex justify-between text-xs text-gray-400">
                    <span>2.000 kWh</span>
                    <span>10.000 kWh</span>
                  </div>
                </div>

                {/* Strompreis */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)]">Aktueller Strompreis</Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded text-sm">{strompreis} ct/kWh</span>
                  </div>
                  <Slider value={[strompreis]} onValueChange={(v) => setStrompreis(v[0])} min={20} max={80} step={1} className="py-2 [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-gray-500 [&>span:last-child]:border-gray-500 [&>span:last-child]:bg-white" />
                   <div className="flex justify-between text-xs text-gray-400">
                    <span>20 ct</span>
                    <span>80 ct</span>
                  </div>
                </div>

                {/* Speicher */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center justify-between">
                      <Label className="text-base font-bold text-[var(--senec-blue)] flex items-center gap-2" htmlFor="speicher-switch">
                        <Battery className="h-5 w-5 text-[var(--senec-turquoise)]" /> Mit Stromspeicher
                      </Label>
                      <Switch id="speicher-switch" checked={mitSpeicher} onCheckedChange={setMitSpeicher} />
                   </div>

                   {mitSpeicher && (
                    <div className="space-y-3 pl-4 border-l-2 border-[var(--senec-turquoise)]">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium text-gray-600">Speichergröße</Label>
                        <span className="text-[var(--senec-turquoise)] font-bold text-sm">{speichergroesse} kWh</span>
                      </div>
                      <Slider value={[speichergroesse]} onValueChange={(v) => setSpeichergroesse(v[0])} min={5} max={20} step={1} className="py-2 [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-[var(--senec-turquoise)] [&>span:last-child]:border-[var(--senec-turquoise)] [&>span:last-child]:bg-white" />
                    </div>
                   )}
                </div>
             </div>
          </div>

          {/* MIDDLE: Energy Flow */}
          <div className="p-6 lg:p-8 flex-1 bg-slate-50 flex flex-col items-center justify-center border-r border-gray-100 relative min-h-[650px]">
             <h4 className="absolute top-6 left-6 text-[var(--senec-blue)] font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                Live-Simulation
             </h4>
             <EnergyFlowDiagram data={energyFlow} />
          </div>

          {/* RIGHT: Results */}
          <div className="p-6 lg:p-8 flex-1 bg-[var(--senec-blue)] text-white flex flex-col justify-center space-y-6">
             <div className="text-center space-y-1">
                <p className="text-[var(--senec-turquoise)] font-bold uppercase tracking-wide text-xs">Ihre Ersparnis</p>
                <div className="text-4xl font-bold text-[var(--senec-yellow)]">
                   {results.gesamtersparnis.toLocaleString()} €
                   <span className="text-lg text-white block mt-1 font-normal">pro Jahr</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 p-3 rounded border border-white/10">
                   <div className="text-[var(--senec-turquoise)] text-xs uppercase font-bold mb-1">Amortisation</div>
                   <div className="font-bold text-lg">{results.amortisationszeit.toFixed(1)} Jahre</div>
                </div>
                <div className="bg-white/10 p-3 rounded border border-white/10">
                   <div className="text-[var(--senec-turquoise)] text-xs uppercase font-bold mb-1">Autarkie</div>
                   <div className="font-bold text-lg">{results.autarkiegrad.toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 p-3 rounded border border-white/10 col-span-2">
                   <div className="text-[var(--senec-turquoise)] text-xs uppercase font-bold mb-1">CO2-Einsparung</div>
                   <div className="font-bold text-lg">{(results.co2Einsparung / 1000).toFixed(1)} Tonnen <span className="text-xs font-normal text-gray-300">/ Jahr</span></div>
                </div>
             </div>

             <div className="space-y-3 pt-2">
                <Button className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold h-12 text-lg uppercase tracking-wide">
                   Angebot anfordern
                </Button>
                <Button onClick={generatePDF} variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white h-10 gap-2">
                  <Download className="h-4 w-4" /> PDF speichern
                </Button>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
