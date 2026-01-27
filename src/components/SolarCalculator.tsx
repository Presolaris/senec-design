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

// --- Google Maps Solar API Types (Simplified) ---
interface SolarPotential {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
}

export default function SolarCalculator() {
  const [step, setStep] = useState<'address' | 'calculator' | 'lead-form' | 'success'>('calculator');
  const [address, setAddress] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [solarData, setSolarData] = useState<SolarPotential | null>(null);

  // Calculator States
  const [consumption, setConsumption] = useState(3500); // kWh per year
  const [roofArea, setRoofArea] = useState(40); // m²
  const [hasBattery, setHasBattery] = useState(true);
  const [hasEV, setHasEV] = useState(false);
  const [hasHeatPump, setHasHeatPump] = useState(false);
  
  // Lead Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [results, setResults] = useState({
    systemSize: 0,
    annualProduction: 0,
    savings: 0,
    co2: 0,
    autarky: 0
  });

  // Instantaneous values for Energy Flow
  const [flowValues, setFlowValues] = useState({
    pvPower: 0, // kW produced right now
    homeConsumption: 0, // kW consumed right now
    gridFlow: 0, // kW (positive = export, negative = import)
    batteryFlow: 0, // kW (positive = charge, negative = discharge)
    batteryLevel: 65 // %
  });

  // --- Address & Solar API Logic ---
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsChecking(true);

    try {
      // 1. Geocoding (Simulation/Placeholder for actual API call)
      console.log(`Geocoding address: ${address}`);
      
      // 2. Solar API (Simulation)
      // Mock delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock Data based on "analysis"
      const mockSolarData: SolarPotential = {
        maxArrayPanelsCount: 24,
        maxArrayAreaMeters2: 45, // Auto-detected roof area
        maxSunshineHoursPerYear: 1100,
        carbonOffsetFactorKgPerMwh: 0.4
      };

      setSolarData(mockSolarData);
      setRoofArea(mockSolarData.maxArrayAreaMeters2); // Auto-fill roof area
      setStep('calculator');

    } catch (error) {
      console.error("Error fetching solar data:", error);
      setStep('calculator');
    } finally {
      setIsChecking(false);
    }
  };

  // --- Calculation Logic ---
  useEffect(() => {
    // 1. Basic Annual Calculation
    const systemSize = Math.floor(roofArea / 6); 
    const annualProduction = Math.round(systemSize * 1000); // Rule of thumb: 1000 kWh per kWp in Germany
    
    let autarkyRate = hasBattery ? 0.70 : 0.30;
    if (hasEV) autarkyRate += hasBattery ? 0.10 : 0.05; // EV increases self-consumption potential
    if (hasHeatPump) autarkyRate += 0.05; // Heat pump adds base load
    
    // Cap autarky realistic max
    autarkyRate = Math.min(0.85, autarkyRate);
    
    const electricityPrice = 0.40; // €/kWh
    const feedInTariff = 0.08; // €/kWh
    const selfConsumed = annualProduction * autarkyRate;
    const fedIn = annualProduction - selfConsumed;
    
    // Simple savings calculation: Avoided cost + Feed-in revenue
    const savings = Math.round((selfConsumed * electricityPrice) + (fedIn * feedInTariff));
    const co2 = Math.round(annualProduction * 0.4); // 400g/kWh avoided

    setResults({ systemSize, annualProduction, savings, co2, autarky: Math.round(autarkyRate * 100) });

    // 2. Flow Simulation Logic (Instantaneous)
    // Scenario: Sunny Afternoon
    const peakPower = systemSize * 0.75; // 75% output currently
    
    let currentConsumption = 0.5; // Base load 500W
    if (hasHeatPump) currentConsumption += 1.2;
    if (hasEV) currentConsumption += 3.7; // Charging

    let availablePower = peakPower - currentConsumption;
    let batteryAction = 0;
    let gridAction = 0;

    if (availablePower > 0) {
      // Surplus
      if (hasBattery) {
        batteryAction = Math.min(availablePower, 3.0); // Charge max 3kW
        availablePower -= batteryAction;
      }
      gridAction = availablePower; // Export rest
    } else {
      // Deficit
      const deficit = Math.abs(availablePower);
      if (hasBattery) {
        batteryAction = -Math.min(deficit, 3.0); // Discharge max 3kW
        availablePower += Math.abs(batteryAction); // Reduce deficit
      }
      gridAction = availablePower; // Import rest (negative)
    }

    setFlowValues({
      pvPower: parseFloat(peakPower.toFixed(1)),
      homeConsumption: parseFloat(currentConsumption.toFixed(1)),
      gridFlow: parseFloat(gridAction.toFixed(1)),
      batteryFlow: parseFloat(batteryAction.toFixed(1)),
      batteryLevel: 65
    });

  }, [consumption, roofArea, hasBattery, hasEV, hasHeatPump]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(0, 0, 153); // SENEC Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Ihr Solar-Check", 20, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Objektadresse: ${address}`, 20, 50);
    doc.text(`PV-Anlage: ${results.systemSize} kWp`, 20, 70);
    doc.text(`Ertrag: ${results.annualProduction} kWh/Jahr`, 20, 80);
    doc.text(`Ersparnis: ${results.savings} €/Jahr`, 20, 90);
    
    doc.save("solar-check.pdf");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Lead submitted:", { ...formData, ...results, address });
    setIsSubmitting(false);
    setStep('success');
  };

  // --- SVG Animation Components ---
  const EnergyParticle = ({ path, delay = 0, color }: { path: string, delay?: number, color: string }) => (
    <circle r="3" fill={color}>
      <animateMotion
        dur="2s"
        repeatCount="indefinite"
        path={path}
        begin={`${delay}s`}
        keyPoints="0;1"
        keyTimes="0;1"
      />
    </circle>
  );

  // --- Render Steps ---

  if (step === 'address') {
    return (
      <Card className="w-full shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-slate-900 to-[var(--senec-blue)] text-white min-h-[500px] flex items-center justify-center">
        <CardContent className="max-w-lg w-full p-8 text-center space-y-8">
          <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center backdrop-blur-sm mb-6">
            <MapPin className="h-10 w-10 text-[var(--senec-orange)]" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Kostenloser Dach-Check</h2>
            <p className="text-gray-300 text-lg">Prüfen Sie jetzt das Solarpotenzial Ihres Hauses in Leipzig & Umgebung.</p>
          </div>
          
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Straße, Hausnummer, PLZ, Ort" 
                className="pl-10 h-12 bg-white text-gray-900 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-[var(--senec-orange)]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-[var(--senec-orange)] hover:bg-[#d68000] text-white uppercase tracking-wide transition-all"
              disabled={isChecking}
            >
              {isChecking ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Analysiere Dachdaten...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Jetzt Dach prüfen <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-400">Kostenlos & unverbindlich. Analyse basiert auf Satellitendaten (Google Solar API).</p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'lead-form') {
    return (
      <Card className="w-full shadow-xl border-0 overflow-hidden bg-white min-h-[500px]">
        <CardContent className="p-0 h-full flex flex-col md:flex-row">
           {/* Left: Summary */}
           <div className="md:w-1/3 bg-[var(--senec-blue)] p-8 text-white space-y-6">
              <Button onClick={() => setStep('calculator')} variant="ghost" className="p-0 h-auto text-white/70 hover:text-white mb-4 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zum Rechner
              </Button>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Ihre Konfiguration</h3>
                <p className="text-sm text-white/70">{address}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded border border-white/10">
                  <div className="text-xs text-[var(--senec-turquoise)] uppercase font-bold">Anlagengröße</div>
                  <div className="text-lg font-bold">{results.systemSize} kWp</div>
                </div>
                <div className="bg-white/10 p-3 rounded border border-white/10">
                  <div className="text-xs text-[var(--senec-turquoise)] uppercase font-bold">Ersparnis</div>
                  <div className="text-lg font-bold">{results.savings} € / Jahr</div>
                </div>
                <div className="bg-white/10 p-3 rounded border border-white/10">
                  <div className="text-xs text-[var(--senec-turquoise)] uppercase font-bold">Ausstattung</div>
                  <ul className="text-sm list-disc list-inside">
                    {hasBattery && <li>Stromspeicher</li>}
                    {hasEV && <li>Wallbox (E-Auto)</li>}
                    {hasHeatPump && <li>Wärmepumpe</li>}
                    {!hasBattery && !hasEV && !hasHeatPump && <li>PV-Basisinstallation</li>}
                  </ul>
                </div>
              </div>
           </div>

           {/* Right: Form */}
           <div className="md:w-2/3 p-8 md:p-12 bg-white">
              <div className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[var(--senec-blue)]">Kostenloses Angebot anfordern</h2>
                  <p className="text-gray-500">Hinterlassen Sie Ihre Kontaktdaten. Einer unserer Experten aus Leipzig meldet sich innerhalb von 24 Stunden bei Ihnen.</p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Max Mustermann" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="0171 12345678" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="max@beispiel.de" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nachricht (Optional)</Label>
                    <textarea 
                      id="message" 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Haben Sie spezielle Wünsche oder Fragen?"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--senec-orange)] focus:ring-[var(--senec-orange)]"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    />
                    <label htmlFor="consent" className="text-sm text-gray-500 leading-tight">
                      Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden.
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold bg-[var(--senec-orange)] hover:bg-[#d68000] text-white transition-all mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Senden...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        Anfrage absenden <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
           </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="w-full shadow-2xl border-0 overflow-hidden bg-white min-h-[500px] flex items-center justify-center">
        <CardContent className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--senec-blue)]">Vielen Dank!</h2>
          <p className="text-gray-600 text-lg">
            Wir haben Ihre Anfrage erhalten. Einer unserer Solarexperten wird sich in Kürze bei Ihnen melden, um Ihr persönliches Angebot zu besprechen.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-8">
            <h4 className="font-bold text-gray-900 mb-2">Nächste Schritte:</h4>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-[var(--senec-blue)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                Telefonische Erstberatung & Bedarfsanalyse
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[var(--senec-blue)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                Vor-Ort-Termin oder digitale Planung
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[var(--senec-blue)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                Unverbindliches Festpreis-Angebot
              </li>
            </ul>
          </div>
          <Button onClick={() => setStep('calculator')} variant="outline" className="mt-6">
            Zurück zum Rechner
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
    <Card className="w-full shadow-xl border-0 overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col xl:flex-row">
          {/* LEFT: Controls */}
          <div className="p-6 lg:p-8 flex-1 space-y-8 bg-white border-r border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[var(--senec-blue)] mb-1 flex items-center gap-2">
                  <Sun className="h-6 w-6 text-[var(--senec-orange)]" /> Solar-Konfigurator
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" /> {address} 
                  <button onClick={() => setStep('address')} className="text-[var(--senec-turquoise)] hover:underline text-xs">(Ändern)</button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)]">Stromverbrauch</Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded text-sm">{consumption} kWh</span>
                  </div>
                  <Slider value={[consumption]} onValueChange={(v) => setConsumption(v[0])} min={1000} max={10000} step={100} className="py-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)]">Dachfläche</Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded text-sm">{roofArea} m²</span>
                  </div>
                  <Slider value={[roofArea]} onValueChange={(v) => setRoofArea(v[0])} min={20} max={200} step={5} className="py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="font-bold text-[var(--senec-blue)] flex items-center gap-2" htmlFor="battery">
                    <Battery className="h-5 w-5 text-[var(--senec-turquoise)]" /> Stromspeicher
                  </Label>
                  <Switch id="battery" checked={hasBattery} onCheckedChange={setHasBattery} />
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="font-bold text-[var(--senec-blue)] flex items-center gap-2" htmlFor="ev">
                    <Car className="h-5 w-5 text-[var(--senec-turquoise)]" /> E-Auto
                  </Label>
                  <Switch id="ev" checked={hasEV} onCheckedChange={setHasEV} />
                </div>
                 <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="font-bold text-[var(--senec-blue)] flex items-center gap-2" htmlFor="heatpump">
                    <Leaf className="h-5 w-5 text-[var(--senec-turquoise)]" /> Wärmepumpe
                  </Label>
                  <Switch id="heatpump" checked={hasHeatPump} onCheckedChange={setHasHeatPump} />
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Advanced SVG Energy Flow */}
          <div className="p-6 lg:p-8 flex-1 bg-slate-50 flex flex-col items-center justify-center border-r border-gray-100 relative min-h-[500px]">
             <h4 className="absolute top-6 left-6 text-[var(--senec-blue)] font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                Live-Simulation <Info className="h-3 w-3 text-gray-400 cursor-help" />
             </h4>
             
             {/* SVG Diagram */}
             <div className="relative w-full max-w-[400px] aspect-square">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
                  {/* Defs for gradients/filters */}
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* --- Connections (Gray Base Lines) --- */}
                  <path d="M200 60 L200 200" stroke="#e2e8f0" strokeWidth="4" />
                  <path d="M200 200 L60 300" stroke="#e2e8f0" strokeWidth="4" />
                  <path d="M200 200 L200 340" stroke="#e2e8f0" strokeWidth="4" />
                  <path d="M200 200 L340 300" stroke="#e2e8f0" strokeWidth="4" />


                  {/* --- Active Flow Animations (Colored Particles) --- */}
                  {flowValues.pvPower > 0 && (
                    <>
                      <path id="path-pv-house" d="M200 60 L200 200" fill="none" />
                      <EnergyParticle path="#path-pv-house" color="var(--senec-orange)" />
                      <EnergyParticle path="#path-pv-house" delay={1} color="var(--senec-orange)" />
                    </>
                  )}

                  {flowValues.gridFlow > 0 ? (
                    <>
                      <path id="path-house-grid" d="M200 200 L60 300" fill="none" />
                      <EnergyParticle path="#path-house-grid" color="var(--senec-turquoise)" />
                    </>
                  ) : (
                    <>
                      <path id="path-grid-house" d="M60 300 L200 200" fill="none" />
                      <EnergyParticle path="#path-grid-house" color="#94a3b8" />
                    </>
                  )}

                  {hasBattery && (
                    flowValues.batteryFlow > 0 ? (
                      <>
                        <path id="path-house-batt" d="M200 200 L200 340" fill="none" />
                        <EnergyParticle path="#path-house-batt" color="var(--senec-turquoise)" />
                      </>
                    ) : flowValues.batteryFlow < 0 ? (
                      <>
                        <path id="path-batt-house" d="M200 340 L200 200" fill="none" />
                        <EnergyParticle path="#path-batt-house" color="var(--senec-turquoise)" />
                      </>
                    ) : null
                  )}

                  {hasEV && (
                     <>
                        <path id="path-house-ev" d="M200 200 L340 300" fill="none" />
                        <EnergyParticle path="#path-house-ev" color="var(--senec-turquoise)" />
                     </>
                  )}


                  {/* --- Nodes (Icons) with Tooltips --- */}
                  
                  {/* PV Node (Top) */}
                  <foreignObject x="170" y="20" width="60" height="60">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center cursor-help">
                            {/* Invisible trigger area over SVG elements */}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[var(--senec-blue)] text-white border-none">
                        <p>Ihre PV-Anlage erzeugt Strom aus Sonnenlicht.</p>
                      </TooltipContent>
                    </Tooltip>
                  </foreignObject>
                  <circle cx="200" cy="50" r="30" fill="white" stroke="var(--senec-orange)" strokeWidth="3" pointerEvents="none" />
                  <foreignObject x="185" y="35" width="30" height="30" pointerEvents="none">
                    <div className="flex items-center justify-center h-full text-[var(--senec-orange)]"><Sun size={20} /></div>
                  </foreignObject>
                  <text x="240" y="55" fontSize="12" fontWeight="bold" fill="var(--senec-blue)">{flowValues.pvPower} kW</text>

                  {/* House Node (Center) */}
                  <foreignObject x="160" y="160" width="80" height="80">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center cursor-help"></div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[var(--senec-blue)] text-white border-none">
                        <p>Ihr Haus verbraucht den Solarstrom direkt.</p>
                      </TooltipContent>
                    </Tooltip>
                  </foreignObject>
                  <circle cx="200" cy="200" r="40" fill="var(--senec-blue)" stroke="white" strokeWidth="4" pointerEvents="none" />
                  <foreignObject x="180" y="180" width="40" height="40" pointerEvents="none">
                    <div className="flex items-center justify-center h-full text-white"><Home size={24} /></div>
                  </foreignObject>
                  <text x="200" y="260" textAnchor="middle" fontSize="10" fill="var(--senec-blue)" fontWeight="bold">Verbrauch: {flowValues.homeConsumption} kW</text>

                  {/* Grid Node (Bottom Left) */}
                  <foreignObject x="35" y="275" width="50" height="50">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center cursor-help"></div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[var(--senec-blue)] text-white border-none">
                        <p>{flowValues.gridFlow > 0 ? "Überschüssiger Strom wird ins Netz eingespeist." : "Strom wird aus dem Netz bezogen, wenn keine Sonne scheint."}</p>
                      </TooltipContent>
                    </Tooltip>
                  </foreignObject>
                  <circle cx="60" cy="300" r="25" fill="white" stroke={flowValues.gridFlow > 0 ? "var(--senec-turquoise)" : "#cbd5e1"} strokeWidth="3" pointerEvents="none" />
                  <foreignObject x="48" y="288" width="24" height="24" pointerEvents="none">
                    <div className="flex items-center justify-center h-full text-gray-500"><Zap size={16} /></div>
                  </foreignObject>
                  <text x="60" y="340" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">Netz</text>

                  {/* Battery Node (Bottom Center) */}
                  {hasBattery && (
                    <>
                      <foreignObject x="175" y="315" width="50" height="50">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full h-full flex items-center justify-center cursor-help"></div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[var(--senec-blue)] text-white border-none">
                            <p>Der Speicher speichert überschüssigen Strom für die Nacht.</p>
                          </TooltipContent>
                        </Tooltip>
                      </foreignObject>
                      <circle cx="200" cy="340" r="25" fill="white" stroke="var(--senec-turquoise)" strokeWidth="3" pointerEvents="none" />
                      <foreignObject x="188" y="328" width="24" height="24" pointerEvents="none">
                        <div className="flex items-center justify-center h-full text-[var(--senec-turquoise)]"><Battery size={16} /></div>
                      </foreignObject>
                      <text x="200" y="380" textAnchor="middle" fontSize="10" fill="var(--senec-turquoise)" fontWeight="bold">{Math.abs(flowValues.batteryFlow)} kW</text>
                    </>
                  )}

                  {/* EV Node (Bottom Right) */}
                  {hasEV && (
                    <>
                      <foreignObject x="315" y="275" width="50" height="50">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full h-full flex items-center justify-center cursor-help"></div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[var(--senec-blue)] text-white border-none">
                            <p>Laden Sie Ihr E-Auto mit eigenem Sonnenstrom.</p>
                          </TooltipContent>
                        </Tooltip>
                      </foreignObject>
                      <circle cx="340" cy="300" r="25" fill="white" stroke="var(--senec-turquoise)" strokeWidth="3" pointerEvents="none" />
                      <foreignObject x="328" y="288" width="24" height="24" pointerEvents="none">
                        <div className="flex items-center justify-center h-full text-[var(--senec-turquoise)]"><Car size={16} /></div>
                      </foreignObject>
                      <text x="340" y="340" textAnchor="middle" fontSize="10" fill="var(--senec-turquoise)" fontWeight="bold">3.7 kW</text>
                    </>
                  )}

                </svg>
             </div>
          </div>

          {/* RIGHT: Results */}
          <div className="p-6 lg:p-8 flex-1 bg-[var(--senec-blue)] text-white flex flex-col justify-center space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[var(--senec-turquoise)] font-bold uppercase tracking-wide text-xs">Ihr Potenzial</p>
              <div className="text-5xl font-bold text-[var(--senec-yellow)] flex items-center justify-center gap-1">
                {results.savings} <span className="text-2xl text-white">€/Jahr</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 text-[var(--senec-turquoise)] text-xs mb-1 uppercase tracking-wider font-bold">
                  <Sun className="h-3 w-3" /> Ertrag
                </div>
                <div className="font-bold text-xl">{results.annualProduction.toLocaleString()} <span className="text-sm font-normal text-gray-300">kWh</span></div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 text-[var(--senec-turquoise)] text-xs mb-1 uppercase tracking-wider font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Autarkie
                </div>
                <div className="font-bold text-xl">{results.autarky}%</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 col-span-2">
                <div className="flex items-center gap-2 text-[var(--senec-turquoise)] text-xs mb-1 uppercase tracking-wider font-bold">
                  <Leaf className="h-3 w-3" /> CO2-Einsparung
                </div>
                <div className="font-bold text-xl">{results.co2} kg <span className="text-sm font-normal text-gray-300">pro Jahr</span></div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button onClick={() => setStep('lead-form')} className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold text-lg h-14 rounded-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl border-0">
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
    </TooltipProvider>
  );
}
