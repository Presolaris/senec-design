# DNS-Konfiguration für leipzig-photovoltaik.de

## Schnellübersicht

Nach dem Vercel-Deployment müssen Sie DNS-Einträge bei Ihrem Domain-Anbieter konfigurieren.

---

## Benötigte DNS-Einträge

### Für Root-Domain (leipzig-photovoltaik.de)

```
Type: A
Name: @ (oder leer lassen)
Value: 76.76.21.21
TTL: 3600 (oder Auto)
```

### Für www-Subdomain (www.leipzig-photovoltaik.de)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (oder Auto)
```

---

## Anleitung nach Domain-Anbieter

### 1&1 / IONOS

1. Einloggen auf https://www.ionos.de
2. Domains → Domain auswählen
3. DNS-Einstellungen → DNS-Verwaltung
4. "Neuer Eintrag" klicken
5. **A-Record hinzufügen:**
   - Typ: A
   - Host: @ (oder leer)
   - Ziel: 76.76.21.21
   - TTL: 3600
6. **CNAME hinzufügen:**
   - Typ: CNAME
   - Host: www
   - Ziel: cname.vercel-dns.com
   - TTL: 3600
7. Speichern

**Propagation-Zeit**: 15-60 Minuten

---

### Strato

1. Einloggen auf https://www.strato.de
2. Domains → Domain-Verwaltung
3. Domain auswählen → DNS-Einstellungen
4. "Erweiterte Einstellungen" aktivieren
5. **A-Record hinzufügen:**
   - Typ: A
   - Subdomain: (leer lassen)
   - IPv4-Adresse: 76.76.21.21
6. **CNAME hinzufügen:**
   - Typ: CNAME
   - Subdomain: www
   - Ziel: cname.vercel-dns.com
7. Speichern

**Propagation-Zeit**: 30-120 Minuten

---

### GoDaddy

1. Einloggen auf https://www.godaddy.com
2. Meine Produkte → Domains
3. Domain auswählen → DNS verwalten
4. **A-Record hinzufügen:**
   - Typ: A
   - Name: @
   - Wert: 76.76.21.21
   - TTL: 1 Stunde
5. **CNAME hinzufügen:**
   - Typ: CNAME
   - Name: www
   - Wert: cname.vercel-dns.com
   - TTL: 1 Stunde
6. Speichern

**Propagation-Zeit**: 10-60 Minuten

---

### Namecheap

1. Einloggen auf https://www.namecheap.com
2. Domain List → Manage
3. Advanced DNS Tab
4. **A-Record hinzufügen:**
   - Type: A Record
   - Host: @
   - Value: 76.76.21.21
   - TTL: Automatic
5. **CNAME hinzufügen:**
   - Type: CNAME Record
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic
6. Save All Changes

**Propagation-Zeit**: 5-30 Minuten

---

### Cloudflare (als DNS-Provider)

1. Einloggen auf https://dash.cloudflare.com
2. Domain auswählen
3. DNS Tab
4. **A-Record hinzufügen:**
   - Type: A
   - Name: @
   - IPv4 address: 76.76.21.21
   - Proxy status: DNS only (grau)
   - TTL: Auto
5. **CNAME hinzufügen:**
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy status: DNS only (grau)
   - TTL: Auto
6. Save

**WICHTIG**: Proxy-Status MUSS "DNS only" sein (grauer Wolke-Icon)!

**Propagation-Zeit**: 1-10 Minuten

---

## DNS-Propagation prüfen

### Online-Tools

**DNSChecker** (empfohlen):
https://dnschecker.org/#A/leipzig-photovoltaik.de

Zeigt DNS-Status weltweit an. Warten Sie, bis alle Standorte grün sind.

**WhatsMyDNS**:
https://www.whatsmydns.net/#A/leipzig-photovoltaik.de

**Google DNS**:
https://dns.google/query?name=leipzig-photovoltaik.de&type=A

### Terminal-Befehle

**Windows (CMD/PowerShell):**
```cmd
nslookup leipzig-photovoltaik.de
```

**Mac/Linux:**
```bash
dig leipzig-photovoltaik.de
```

**Erwartetes Ergebnis:**
```
leipzig-photovoltaik.de.  3600  IN  A  76.76.21.21
```

---

## Häufige Probleme

### Problem: "DNS not found" nach 24 Stunden

**Ursache**: Falsche Nameserver

**Lösung**:
1. Prüfen Sie, ob Nameserver korrekt sind
2. Bei Domain-Anbieter: Nameserver sollten auf deren eigene zeigen
3. Wenn Cloudflare genutzt: Nameserver müssen auf Cloudflare zeigen

**Nameserver prüfen:**
```bash
nslookup -type=NS leipzig-photovoltaik.de
```

### Problem: "Certificate error" im Browser

**Ursache**: SSL-Zertifikat noch nicht erstellt

**Lösung**:
1. Warten Sie 5-10 Minuten nach DNS-Propagation
2. Vercel erstellt Let's Encrypt Zertifikat automatisch
3. Prüfen Sie Status: Vercel Dashboard → Settings → Domains

### Problem: www funktioniert, aber Root-Domain nicht (oder umgekehrt)

**Ursache**: Nur ein DNS-Eintrag konfiguriert

**Lösung**:
1. Fügen Sie BEIDE Einträge hinzu (A + CNAME)
2. In Vercel: Beide Domains hinzufügen
   - leipzig-photovoltaik.de
   - www.leipzig-photovoltaik.de
3. Vercel leitet automatisch um

### Problem: Alte Website wird noch angezeigt

**Ursache**: Browser-Cache oder DNS-Cache

**Lösung**:
1. **Browser-Cache leeren**: Strg+Shift+R (Windows) oder Cmd+Shift+R (Mac)
2. **DNS-Cache leeren**:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Linux: `sudo systemd-resolve --flush-caches`
3. **Inkognito-Modus** testen

---

## Vercel DNS-Verifizierung

### Schritt 1: TXT-Record für Verifizierung

Vercel zeigt einen TXT-Record an, wenn Sie die Domain hinzufügen:

```
Type: TXT
Name: _vercel
Value: vc-domain-verify=xxx...xxx
TTL: 3600
```

Fügen Sie diesen bei Ihrem Domain-Anbieter hinzu.

### Schritt 2: Verifizierung in Vercel

1. Warten Sie 5-10 Minuten
2. Vercel prüft automatisch
3. Status ändert sich zu "Valid Configuration"

---

## Redirect-Konfiguration (optional)

### www → Root (leipzig-photovoltaik.de)

In Vercel automatisch! Fügen Sie beide Domains hinzu:

1. Settings → Domains
2. Fügen Sie hinzu: `leipzig-photovoltaik.de` (Primary)
3. Fügen Sie hinzu: `www.leipzig-photovoltaik.de`
4. Vercel leitet www automatisch zu Root um

### Root → www (www.leipzig-photovoltaik.de)

Falls Sie www bevorzugen:

1. Settings → Domains
2. Fügen Sie hinzu: `www.leipzig-photovoltaik.de` (Primary)
3. Fügen Sie hinzu: `leipzig-photovoltaik.de`
4. Vercel leitet Root automatisch zu www um

**Empfehlung**: Root ohne www (leipzig-photovoltaik.de) ist SEO-freundlicher.

---

## Checkliste

Nach DNS-Konfiguration:

- [ ] A-Record für @ → 76.76.21.21 hinzugefügt
- [ ] CNAME für www → cname.vercel-dns.com hinzugefügt
- [ ] TXT-Record für _vercel hinzugefügt (Verifizierung)
- [ ] DNS-Propagation geprüft (dnschecker.org)
- [ ] Vercel zeigt "Valid Configuration"
- [ ] SSL-Zertifikat aktiv (Schloss-Symbol im Browser)
- [ ] Website lädt unter leipzig-photovoltaik.de
- [ ] Website lädt unter www.leipzig-photovoltaik.de
- [ ] Redirect funktioniert (www → Root oder umgekehrt)

---

## Support

**Bei DNS-Problemen:**
1. Kontaktieren Sie Ihren Domain-Anbieter Support
2. Vercel Support: https://vercel.com/support
3. Vercel Community: https://github.com/vercel/vercel/discussions

**Typische Wartezeiten:**
- Cloudflare: 1-10 Minuten
- Namecheap: 5-30 Minuten
- GoDaddy: 10-60 Minuten
- 1&1/IONOS: 15-60 Minuten
- Strato: 30-120 Minuten

**Geduld ist wichtig!** DNS-Propagation kann bis zu 48 Stunden dauern (selten).
