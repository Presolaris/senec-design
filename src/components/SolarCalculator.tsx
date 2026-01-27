import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Battery, Leaf, Zap, Car, Home, ArrowDown, ArrowRight, ArrowLeft, ArrowUp, Download, MapPin, Search, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";

export default function SolarCalculator() {
  const [step, setStep] = useState<'address' | 'calculator'>('address');
  const [address, setAddress] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  // Calculator States
  const [consumption, setConsumption] = useState(3500); // kWh per year
  const [roofArea, setRoofArea] = useState(40); // m²
  const [hasBattery, setHasBattery] = useState(true);
  const [hasEV, setHasEV] = useState(false);
  const [hasHeatPump, setHasHeatPump] = useState(false);
  
  const [results, setResults] = useState({
    systemSize: 0,
    annualProduction: 0,
    savings: 0,
    co2: 0,
    autarky: 0
  });

  // Instantaneous values for Energy Flow (simulated)
  const [flowValues, setFlowValues] = useState({
    pvPower: 0, // kW produced right now
    homeConsumption: 0, // kW consumed right now
    gridFlow: 0, // kW (positive = export, negative = import)
    batteryFlow: 0, // kW (positive = charge, negative = discharge)
    batteryLevel: 50 // %
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsChecking(true);
    // Simulate API check delay
    setTimeout(() => {
      setIsChecking(false);
      setStep('calculator');
    }, 1500);
  };

  useEffect(() => {
    // 1. Basic Annual Calculation (same as before)
    const systemSize = Math.floor(roofArea / 6); 
    const annualProduction = Math.round(systemSize * 1000);
    
    let autarkyRate = hasBattery ? 0.75 : 0.30;
    if (hasEV) autarkyRate += hasBattery ? 0.05 : -0.05;
    if (hasHeatPump) autarkyRate -= 0.10;
    autarkyRate = Math.min(0.88, Math.max(0.15, autarkyRate));
    
    const electricityPrice = 0.40;
    const feedInTariff = 0.08;
    const selfConsumed = annualProduction * autarkyRate;
    const fedIn = annualProduction - selfConsumed;
    const savings = Math.round((selfConsumed * electricityPrice) + (fedIn * feedInTariff));
    const co2 = Math.round(annualProduction * 0.4);

    setResults({ systemSize, annualProduction, savings, co2, autarky: Math.round(autarkyRate * 100) });

    // 2. Advanced Flow Simulation Logic
    // Simulate a "sunny noon" scenario
    const peakPower = systemSize * 0.8; // 80% efficiency at noon
    const baseLoad = (consumption / 365 / 24) * 2; // Active household
    let currentConsumption = baseLoad;
    if (hasEV) currentConsumption += 3.7; // Charging
    if (hasHeatPump) currentConsumption += 1.5; // Running

    let batteryAction = 0; // 0=idle, >0 charge, <0 discharge
    let gridAction = 0; // >0 export, <0 import

    let availablePower = peakPower;

    // First: Power the house
    availablePower -= currentConsumption;

    // Second: Charge Battery (if excess) or Discharge (if deficit)
    if (hasBattery) {
      if (availablePower > 0) {
        batteryAction = Math.min(availablePower, 3.0); // Max charge rate 3kW
        availablePower -= batteryAction;
      } else {
        // Deficit - try to discharge
        const needed = Math.abs(availablePower);
        batteryAction = -Math.min(needed, 3.0); // Max discharge rate
        availablePower -= batteryAction; // Adding negative value (discharging) increases available power (technically reducing deficit)
      }
    }

    // Third: Grid interaction
    gridAction = availablePower; // Remaining goes to grid (export) or comes from grid (import)

    setFlowValues({
      pvPower: parseFloat(peakPower.toFixed(1)),
      homeConsumption: parseFloat(currentConsumption.toFixed(1)),
      gridFlow: parseFloat(gridAction.toFixed(1)),
      batteryFlow: parseFloat(batteryAction.toFixed(1)),
      batteryLevel: 65 // Static for demo
    });

  }, [consumption, roofArea, hasBattery, hasEV, hasHeatPump]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(0, 0, 153);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Ihr Solar-Check", 20, 25);
    doc.setFontSize(12);
    doc.text("Leipzig Photovoltaik", 150, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Objektadresse: ${address}`, 20, 50);
    
    doc.text("Ergebnis:", 20, 70);
    doc.text(`PV-Anlage: ${results.systemSize} kWp`, 20, 80);
    doc.text(`Ertrag: ${results.annualProduction} kWh/Jahr`, 20, 90);
    doc.text(`Ersparnis: ${results.savings} €/Jahr`, 20, 100);
    
    doc.save("solar-check.pdf");
  };

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
          <p className="text-xs text-gray-400">Kostenlos & unverbindlich. Analyse basiert auf Satellitendaten.</p>
        </CardContent>
      </Card>
    );
  }

  return (
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

          {/* MIDDLE: Advanced Energy Flow */}
          <div className="p-6 lg:p-8 flex-1 bg-slate-50 flex flex-col items-center justify-center border-r border-gray-100 relative min-h-[500px]">
             <h4 className="absolute top-6 left-6 text-[var(--senec-blue)] font-bold uppercase tracking-wider text-xs">Live-Simulation</h4>
             
             {/* Diagram Container */}
             <div className="relative w-full max-w-[320px] aspect-[3/4] flex flex-col justify-between items-center py-8">
                
                {/* TOP: PV */}
                <div className="relative z-10 flex flex-col items-center">
                   <div className="bg-white p-4 rounded-full shadow-lg border-2 border-[var(--senec-orange)] mb-2">
                      <Sun className="h-8 w-8 text-[var(--senec-orange)]" />
                   </div>
                   <div className="bg-[var(--senec-orange)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {flowValues.pvPower} kW
                   </div>
                </div>

                {/* CENTER: House/Distribution */}
                <div className="relative z-10 flex flex-col items-center my-8 w-full">
                   {/* Connection Lines */}
                   <div className="absolute top-[-40px] left-1/2 w-1 h-[40px] bg-[var(--senec-orange)] -translate-x-1/2 overflow-hidden">
                      <div className="w-full h-full bg-white/50 animate-pulse"></div>
                   </div>

                   <div className="bg-[var(--senec-blue)] p-6 rounded-full shadow-xl border-4 border-white relative">
                      <Home className="h-10 w-10 text-white" />
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--senec-blue)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border border-white">
                         Verbrauch: {flowValues.homeConsumption} kW
                      </div>
                   </div>
                </div>

                {/* BOTTOM ROW: Grid, Battery, EV */}
                <div className="grid grid-cols-3 gap-4 w-full relative">
                   
                   {/* Left: Grid */}
                   <div className="flex flex-col items-center relative">
                      {/* Line to Center */}
                      <div className={`absolute -top-[50px] right-[-20px] w-[60px] h-1 bg-gray-300 rotate-[60deg] origin-right`}></div>
                      
                      <div className="bg-white p-3 rounded-full shadow border border-gray-200 z-10">
                         <Zap className={`h-6 w-6 ${flowValues.gridFlow > 0 ? 'text-[var(--senec-turquoise)]' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-[10px] font-bold mt-1 text-gray-500">
                         {flowValues.gridFlow > 0 ? 'Einspeisung' : 'Netzbezug'}
                      </span>
                      <span className="text-xs font-bold">{Math.abs(flowValues.gridFlow)} kW</span>
                   </div>

                   {/* Center: Battery */}
                   {hasBattery ? (
                     <div className="flex flex-col items-center relative -mt-4">
                        <div className="absolute -top-[30px] left-1/2 w-1 h-[30px] bg-[var(--senec-turquoise)] -translate-x-1/2"></div>
                        <div className="bg-white p-3 rounded-full shadow border-2 border-[var(--senec-turquoise)] z-10 relative overflow-hidden">
                           <div className="absolute bottom-0 left-0 w-full bg-[var(--senec-turquoise)]/20 transition-all duration-1000" style={{height: `${flowValues.batteryLevel}%`}}></div>
                           <Battery className="h-6 w-6 text-[var(--senec-turquoise)] relative z-10" />
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-[var(--senec-turquoise)]">
                           {flowValues.batteryFlow > 0 ? 'Lädt' : (flowValues.batteryFlow < 0 ? 'Entlädt' : 'Standby')}
                        </span>
                        <span className="text-xs font-bold">{Math.abs(flowValues.batteryFlow)} kW</span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center opacity-30 grayscale">
                        <div className="bg-gray-100 p-3 rounded-full border border-gray-200">
                           <Battery className="h-6 w-6" />
                        </div>
                     </div>
                   )}

                   {/* Right: EV */}
                   {hasEV ? (
                     <div className="flex flex-col items-center relative">
                        <div className={`absolute -top-[50px] left-[-20px] w-[60px] h-1 bg-[var(--senec-turquoise)] -rotate-[60deg] origin-left`}></div>
                        <div className="bg-white p-3 rounded-full shadow border border-gray-200 z-10">
                           <Car className="h-6 w-6 text-[var(--senec-turquoise)]" />
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-gray-500">Laden</span>
                        <span className="text-xs font-bold">3.7 kW</span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center opacity-30 grayscale">
                        <div className="bg-gray-100 p-3 rounded-full border border-gray-200">
                           <Car className="h-6 w-6" />
                        </div>
                     </div>
                   )}
                </div>

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
              <Button className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold text-lg h-14 rounded-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl border-0">
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
