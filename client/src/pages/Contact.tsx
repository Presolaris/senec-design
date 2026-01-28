import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    interest: "" as "pv-anlage" | "speicher" | "wallbox" | "service" | "gewerbe" | "sonstiges" | "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        toast.success("Ihre Anfrage wurde erfolgreich gesendet!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          interest: "",
        });
      } else {
        toast.error(data.error || "Ein Fehler ist aufgetreten");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Ein Fehler ist aufgetreten");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
      interest: formData.interest || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[var(--senec-blue)] text-white py-4">
          <div className="container flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/images/logo.webp" alt="SENEC Logo" className="h-10 w-auto bg-white p-1 rounded" />
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="hover:text-[var(--senec-turquoise)] transition-colors">Home</a>
              <a href="/contact" className="text-[var(--senec-turquoise)]">Kontakt</a>
            </nav>
          </div>
        </header>

        <main className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <CheckCircle className="w-20 h-20 text-[var(--senec-turquoise)] mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-[var(--senec-blue)] mb-4">
                Vielen Dank für Ihre Anfrage!
              </h1>
              <p className="text-gray-600 mb-8">
                Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
                In der Regel antworten wir innerhalb von 24 Stunden.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Neue Anfrage stellen
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[var(--senec-blue)] text-white py-4">
        <div className="container flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/images/logo.webp" alt="SENEC Logo" className="h-10 w-auto bg-white p-1 rounded" />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="hover:text-[var(--senec-turquoise)] transition-colors">Home</a>
            <a href="/contact" className="text-[var(--senec-turquoise)]">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[var(--senec-blue)] text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontaktieren Sie uns</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Wir freuen uns auf Ihre Anfrage. Unser Team steht Ihnen für alle Fragen rund um Photovoltaik zur Verfügung.
          </p>
        </div>
      </section>

      <main className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--senec-blue)]">Kontaktdaten</CardTitle>
                <CardDescription>So erreichen Sie uns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--senec-turquoise)] mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">Musterstraße 123<br />04109 Leipzig</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[var(--senec-turquoise)] mt-1" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a href="tel:+4934112345678" className="text-gray-600 hover:text-[var(--senec-turquoise)]">
                      +49 341 123 456 78
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[var(--senec-turquoise)] mt-1" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <a href="mailto:info@senec-design.de" className="text-gray-600 hover:text-[var(--senec-turquoise)]">
                      info@senec-design.de
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--senec-blue)]">Öffnungszeiten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Montag - Freitag</span>
                    <span className="font-medium">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samstag</span>
                    <span className="font-medium">09:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sonntag</span>
                    <span className="text-gray-500">Geschlossen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--senec-blue)]">Anfrage senden</CardTitle>
                <CardDescription>
                  Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Ihr vollständiger Name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre.email@beispiel.de"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+49 123 456789"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest">Interesse an</Label>
                      <Select
                        value={formData.interest}
                        onValueChange={(value) => handleChange("interest", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pv-anlage">PV-Anlage</SelectItem>
                          <SelectItem value="speicher">Stromspeicher</SelectItem>
                          <SelectItem value="wallbox">Wallbox / E-Mobilität</SelectItem>
                          <SelectItem value="service">Service & Wartung</SelectItem>
                          <SelectItem value="gewerbe">Gewerbelösung</SelectItem>
                          <SelectItem value="sonstiges">Sonstiges</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Betreff</Label>
                    <Input
                      id="subject"
                      placeholder="Worum geht es?"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nachricht *</Label>
                    <Textarea
                      id="message"
                      placeholder="Beschreiben Sie Ihr Anliegen..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="btn-primary flex items-center gap-2"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Anfrage senden
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500">
                      * Pflichtfelder
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Mit dem Absenden stimmen Sie unserer{" "}
                    <a href="/datenschutz" className="underline hover:text-[var(--senec-blue)]">
                      Datenschutzerklärung
                    </a>{" "}
                    zu.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--senec-blue)] text-white py-8">
        <div className="container text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} SENEC-Design / Leipzig Photovoltaik. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
