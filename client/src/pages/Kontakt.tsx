import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().min(6, "Bitte geben Sie eine gültige Telefonnummer an"),
  message: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "Bitte akzeptieren Sie die Datenschutzbestimmungen"),
});

export default function Kontakt() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Anfrage gesendet", {
      description: "Wir werden uns in Kürze bei Ihnen melden.",
    });
    form.reset();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 py-20 border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Kontakt</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Starten Sie Ihr Projekt mit uns. Wir beraten Sie gerne unverbindlich zu Ihren Möglichkeiten.
          </p>
        </div>
      </div>

      <div className="container py-20">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Wir sind für Sie da</h2>
              <p className="text-muted-foreground mb-8">
                Ob Fragen zur Technik, Finanzierung oder Installation – unser Team steht Ihnen mit Rat und Tat zur Seite.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Telefon</h3>
                    <p className="text-muted-foreground">0341 123 456 78</p>
                    <p className="text-xs text-muted-foreground mt-1">Mo-Fr 08:00 - 18:00 Uhr</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">E-Mail</h3>
                    <p className="text-muted-foreground">info@leipzig-photovoltaik.de</p>
                    <p className="text-xs text-muted-foreground mt-1">Antwort innerhalb von 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-sm shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Standort</h3>
                    <p className="text-muted-foreground">Musterstraße 123<br/>04109 Leipzig</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary/20 border border-border rounded-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Schnell-Check
              </h3>
              <p className="text-sm text-muted-foreground">
                Halten Sie für eine Beratung am besten Ihre letzte Stromrechnung und grobe Dachmaße bereit. So können wir Ihnen direkt konkrete Zahlen nennen.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card p-8 border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h2 className="text-2xl font-bold mb-6">Nachricht senden</h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Max Mustermann" 
                  {...form.register("name")} 
                  className="bg-background border-border focus:border-primary rounded-none h-12"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="max@beispiel.de" 
                    {...form.register("email")} 
                    className="bg-background border-border focus:border-primary rounded-none h-12"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="0123 456789" 
                    {...form.register("phone")} 
                    className="bg-background border-border focus:border-primary rounded-none h-12"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nachricht (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Wie können wir Ihnen helfen?" 
                  {...form.register("message")} 
                  className="bg-background border-border focus:border-primary rounded-none min-h-[120px]"
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  onCheckedChange={(checked) => form.setValue("terms", checked as boolean)}
                  className="mt-1 rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-input"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Datenschutz akzeptieren
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden.
                  </p>
                  {form.formState.errors.terms && (
                    <p className="text-destructive text-sm">{form.formState.errors.terms.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full font-bold rounded-none h-12 text-base">
                Anfrage absenden
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
