import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Shield, Leaf, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img 
            src="/images/hero-solar-home.jpg" 
            alt="Modernes Haus mit Solaranlage" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-20">
          <div className="max-w-2xl space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-sm backdrop-blur-sm">
              <Zap className="w-3 h-3 fill-primary" />
              <span>Energie der Zukunft</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Unabhängigkeit <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">neu definiert.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Hochleistungs-Photovoltaik und intelligente Speicherlösungen für Ihr Zuhause. 
              Technologische Präzision trifft auf nachhaltige Ästhetik.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/kontakt">
                <Button size="lg" className="text-base font-bold px-8 h-14 rounded-none border-0">
                  Kostenloses Angebot
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/loesungen">
                <Button variant="outline" size="lg" className="text-base font-bold px-8 h-14 rounded-none bg-transparent backdrop-blur-sm hover:bg-background/20">
                  Lösungen entdecken
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 border-t border-l border-primary/20 bg-background/5 backdrop-blur-[2px] hidden md:block z-10">
          <div className="absolute top-4 left-4 text-xs font-mono text-primary/60">SYS.STATUS: ACTIVE</div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-primary/60">EFFICIENCY: 98.4%</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-primary/20 animate-pulse" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Installierte Anlagen", value: "2.500+", icon: CheckCircle2 },
              { label: "Jahre Garantie", value: "20", icon: Shield },
              { label: "CO2 Einsparung", value: "15.000t", icon: Leaf },
              { label: "Autarkiegrad", value: "bis 80%", icon: BarChart3 },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-start gap-2 p-4 border-l-2 border-primary/20 hover:border-primary transition-colors duration-300">
                <stat.icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Split Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rotate-2 group-hover:rotate-1 transition-transform duration-500 rounded-sm" />
              <img 
                src="/images/tech-battery-storage.jpg" 
                alt="SENEC Speichertechnologie" 
                className="relative w-full shadow-2xl rounded-sm grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur p-4 border-l-4 border-primary max-w-xs shadow-lg">
                <p className="font-mono text-xs text-primary mb-1">TECH.SPEC.01</p>
                <p className="font-bold text-sm">Integrierte Speicherlösung mit 100% Tiefenentladungskapazität.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technologie, die <br/>mitdenkt.</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Unsere Systeme sind mehr als nur Solarmodule. Wir vernetzen Erzeugung, Speicherung und Verbrauch zu einem intelligenten Ökosystem.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Smarte Steuerung", desc: "Automatische Optimierung Ihres Eigenverbrauchs durch KI-gestützte Prognosen." },
                  { title: "Notstrom-Ready", desc: "Bleiben Sie auch bei Netzausfall versorgt – automatisch und zuverlässig." },
                  { title: "Made in Germany", desc: "Höchste Qualitätsstandards und Langlebigkeit für Ihre Investition." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-sm bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/loesungen">
                <Button variant="ghost" className="group px-0 hover:bg-transparent hover:text-primary font-bold">
                  Mehr über Technik erfahren <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break Section */}
      <section className="relative py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
            src="/images/nature-tech-concept.jpg" 
            alt="Hintergrund" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ihre Energie. Ihre Entscheidung.</h2>
          <p className="text-xl text-muted-foreground">
            Starten Sie jetzt in eine unabhängige Zukunft. Wir begleiten Sie von der ersten Beratung bis zur fertigen Installation.
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="h-16 px-10 text-lg font-bold shadow-xl shadow-primary/20">
              Jetzt Beratungstermin vereinbaren
            </Button>
          </Link>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Der Weg zur eigenen Anlage</h2>
            <p className="text-muted-foreground text-lg">
              In vier einfachen Schritten zu Ihrer persönlichen Energiewende. Transparent und effizient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />
            
            {[
              { step: "01", title: "Anfrage", desc: "Füllen Sie unser Formular aus oder rufen Sie uns an." },
              { step: "02", title: "Beratung", desc: "Wir analysieren Ihren Bedarf vor Ort oder digital." },
              { step: "03", title: "Planung", desc: "Sie erhalten ein maßgeschneidertes Konzept." },
              { step: "04", title: "Installation", desc: "Unsere Profis montieren und schließen alles an." },
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-background p-6 border border-border hover:border-primary transition-colors duration-300 group text-center md:text-left">
                <div className="w-12 h-12 bg-secondary text-primary font-mono font-bold text-xl flex items-center justify-center rounded-sm mb-4 mx-auto md:mx-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Image */}
      <section className="grid md:grid-cols-2 bg-secondary/20">
        <div className="relative h-64 md:h-auto order-2 md:order-1">
          <img 
            src="/images/consultation-modern.jpg" 
            alt="Beratung" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        </div>
        <div className="p-12 md:p-24 flex flex-col justify-center space-y-8 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Noch Fragen?</h2>
          <p className="text-lg text-muted-foreground">
            Unsere Experten stehen Ihnen Rede und Antwort. Erfahren Sie, wie viel Sie mit einer eigenen PV-Anlage sparen können.
          </p>
          <div className="space-y-4">
            <Link href="/kontakt">
              <Button size="lg" className="w-full md:w-auto font-bold">Kontakt aufnehmen</Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Oder rufen Sie uns an: <a href="tel:034112345678" className="text-foreground font-medium hover:underline">0341 123 456 78</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
