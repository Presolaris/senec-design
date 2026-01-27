import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Battery, Leaf, Zap, Car, Home } from "lucide-react";

export default function SolarCalculator() {
  const [consumption, setConsumption] = useState(3500); // kWh per year
  const [roofArea, setRoofArea] = useState(40); // m²
  const [hasBattery, setHasBattery] = useState(true);
  const [hasEV, setHasEV] = useState(false);
  const [hasHeatPump, setHasHeatPump] = useState(false);
  const [smartCharging, setSmartCharging] = useState(false);
  const [orientation, setOrientation] = useState("south"); // south, east-west, north
  const [roofPitch, setRoofPitch] = useState(30); // degrees
  
  const [results, setResults] = useState({
    systemSize: 0, // kWp
    annualProduction: 0, // kWh
    savings: 0, // Euro
    co2: 0, // kg
    autarky: 0 // %
  });

  useEffect(() => {
    // Calculation Logic
    // 1 kWp needs approx 5-6 m²
    const systemSize = Math.floor(roofArea / 6); 
    
    // Efficiency factors based on orientation and pitch
    let efficiencyFactor = 1.0;
    
    // Orientation impact
    if (orientation === "south") efficiencyFactor *= 1.0;
    else if (orientation === "east" || orientation === "west") efficiencyFactor *= 0.85;
    else if (orientation === "north") efficiencyFactor *= 0.60;
    
    // Pitch impact (simplified: optimal is 30-35°)
    if (roofPitch < 15 || roofPitch > 50) efficiencyFactor *= 0.90;
    
    // 1 kWp produces approx 1000 kWh in Germany (optimal)
    const annualProduction = Math.round(systemSize * 1000 * efficiencyFactor);
    
    // Autarky rate estimation
    let autarkyRate = 0.30; // Base without battery
    if (hasBattery) autarkyRate = 0.75; // With battery
    
    // Adjust autarky based on production/consumption ratio
    // EV Impact
    let totalConsumption = consumption;
    if (hasEV) {
      totalConsumption += 3000; // Approx 15.000km/year
      if (hasBattery) {
        autarkyRate += 0.05; // Battery helps buffer for EV
      } else {
        autarkyRate -= 0.05; // Without battery, EV draws mostly from grid
      }

      // Smart Charging Impact
      if (smartCharging) {
        if (hasBattery) {
          autarkyRate += 0.10; // Massive boost: Battery + Smart Charging
        } else {
          autarkyRate += 0.05;
        }
      }
    }
    
    // Heat Pump Impact
    if (hasHeatPump) {
      totalConsumption += 4000; // Approx for modern house
      // Heat pump runs mostly in winter when PV is low -> lowers autarky
      autarkyRate -= 0.10; 
      if (hasBattery) autarkyRate += 0.05; // Battery helps a bit
    }

    // Cap autarky at reasonable max (e.g. 85-90% is very hard to exceed)
    autarkyRate = Math.min(0.88, Math.max(0.15, autarkyRate));
    
    // Production limit impact (if system is too small for consumption)
    const coverageRatio = annualProduction / totalConsumption;
    if (coverageRatio < 1.0) {
      autarkyRate *= coverageRatio; // Can't be self-sufficient if you don't produce enough
    }

    // Financials
    const electricityPrice = 0.40; // €/kWh
    const feedInTariff = 0.08; // €/kWh
    
    const selfConsumedEnergy = Math.min(annualProduction, totalConsumption * autarkyRate);
    const fedInEnergy = Math.max(0, annualProduction - selfConsumedEnergy);
    
    const savings = Math.round((selfConsumedEnergy * electricityPrice) + (fedInEnergy * feedInTariff));
    const co2 = Math.round(annualProduction * 0.4); // Approx 400g CO2 avoided per kWh solar

    setResults({
      systemSize,
      annualProduction,
      savings,
      co2,
      autarky: Math.round(autarkyRate * 100)
    });

  }, [consumption, roofArea, hasBattery, hasEV, hasHeatPump, smartCharging, orientation, roofPitch]);

  return (
    <Card className="w-full shadow-xl border-0 overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Controls Section */}
          <div className="p-6 md:p-8 flex-1 space-y-8 bg-white">
            <div>
              <h3 className="text-2xl font-bold text-[var(--senec-blue)] mb-2 flex items-center gap-2">
                <Sun className="h-6 w-6 text-[var(--senec-orange)]" /> Solarrechner
              </h3>
              <p className="text-gray-500 text-sm">Berechnen Sie Ihr persönliches Sparpotenzial.</p>
            </div>

            <div className="space-y-6">
              {/* Sliders */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)] flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[var(--senec-turquoise)]" /> Stromverbrauch
                    </Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded-sm text-sm">{consumption} kWh</span>
                  </div>
                  <Slider 
                    value={[consumption]} 
                    onValueChange={(v) => setConsumption(v[0])} 
                    min={1000} 
                    max={10000} 
                    step={100}
                    className="py-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-base font-bold text-[var(--senec-blue)] flex items-center gap-2">
                      <Home className="h-4 w-4 text-[var(--senec-turquoise)]" /> Dachfläche
                    </Label>
                    <span className="text-[var(--senec-blue)] font-bold bg-gray-100 px-3 py-1 rounded-sm text-sm">{roofArea} m²</span>
                  </div>
                  <Slider 
                    value={[roofArea]} 
                    onValueChange={(v) => setRoofArea(v[0])} 
                    min={20} 
                    max={200} 
                    step={5}
                    className="py-2"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="text-sm font-bold text-[var(--senec-blue)] flex items-center gap-2 cursor-pointer" htmlFor="battery-switch">
                    <Battery className="h-5 w-5 text-[var(--senec-turquoise)]" /> 
                    <span>Stromspeicher?</span>
                  </Label>
                  <Switch 
                    id="battery-switch"
                    checked={hasBattery}
                    onCheckedChange={setHasBattery}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="text-sm font-bold text-[var(--senec-blue)] flex items-center gap-2 cursor-pointer" htmlFor="ev-switch">
                    <Car className="h-5 w-5 text-[var(--senec-turquoise)]" /> 
                    <span>E-Auto?</span>
                  </Label>
                  <Switch 
                    id="ev-switch"
                    checked={hasEV}
                    onCheckedChange={setHasEV}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-6 md:p-8 flex-1 bg-[var(--senec-blue)] text-white flex flex-col justify-center space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[var(--senec-turquoise)] font-bold uppercase tracking-wide text-xs">Ihre geschätzte Ersparnis</p>
              <div className="text-5xl font-bold text-[var(--senec-yellow)] flex items-center justify-center gap-1">
                {results.savings} <span className="text-2xl text-white">€/Jahr</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 text-[var(--senec-turquoise)] text-xs mb-1 uppercase tracking-wider font-bold">
                  <Sun className="h-3 w-3" /> Ertrag
                </div>
                <div className="font-bold text-xl">{results.annualProduction.toLocaleString()} kWh</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 text-[var(--senec-turquoise)] text-xs mb-1 uppercase tracking-wider font-bold">
                  <Battery className="h-3 w-3" /> Autarkie
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

            <Button className="w-full bg-[var(--senec-orange)] hover:bg-[#d68000] text-white font-bold text-lg h-14 rounded-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl border-0">
              Angebot anfordern
            </Button>
            
            <p className="text-[10px] text-center text-gray-400">
              *Unverbindliche Schätzung basierend auf Standardwerten.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
