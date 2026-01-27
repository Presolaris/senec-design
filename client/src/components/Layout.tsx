import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Battery, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/loesungen", label: "Lösungen" },
    { href: "/referenzen", label: "Referenzen" },
    { href: "/ueber-uns", label: "Über Uns" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/90 backdrop-blur-md border-border/40 py-4 shadow-sm" : "bg-transparent py-6"
        )}
      >
        <div className="container flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-sm">
                <Sun className="w-6 h-6" />
              </div>
              <span>SENEC<span className="text-primary">.Design</span></span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={cn(
                  "text-sm font-medium transition-colors hover:text-primary uppercase tracking-wide",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}>
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/kontakt">
              <Button size="sm" className="font-bold">
                Beratung anfordern
              </Button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={cn(
                  "block py-2 text-lg font-medium",
                  location === link.href ? "text-primary" : "text-foreground"
                )}>
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/kontakt">
              <Button className="w-full">Beratung anfordern</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-border">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Sun className="w-5 h-5 text-primary" />
              <span>SENEC.Design</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ihr Partner für innovative Energielösungen. Wir verbinden modernste Photovoltaik-Technik mit ästhetischem Anspruch für Ihr Zuhause.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Lösungen</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/loesungen"><a className="hover:text-primary transition-colors">Photovoltaik</a></Link></li>
              <li><Link href="/loesungen"><a className="hover:text-primary transition-colors">Stromspeicher</a></Link></li>
              <li><Link href="/loesungen"><a className="hover:text-primary transition-colors">Wallboxen</a></Link></li>
              <li><Link href="/loesungen"><a className="hover:text-primary transition-colors">SENEC.Cloud</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/impressum"><a className="hover:text-primary transition-colors">Impressum</a></Link></li>
              <li><Link href="/datenschutz"><a className="hover:text-primary transition-colors">Datenschutz</a></Link></li>
              <li><Link href="/agb"><a className="hover:text-primary transition-colors">AGB</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Kontakt</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>
                  0341 123 456 78<br/>
                  Mo-Fr 08:00 - 18:00
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-primary shrink-0">@</div>
                <span>info@leipzig-photovoltaik.de</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SENEC.Design / Leipzig Photovoltaik. Alle Rechte vorbehalten.</p>
          <p>Designed with Modern Industrial Minimalism.</p>
        </div>
      </footer>
    </div>
  );
}
