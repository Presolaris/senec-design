# Supabase Lead-CMS Setup-Anleitung

## Schritt 1: Supabase-Account erstellen

1. Gehe zu https://supabase.com
2. Klicke auf "Start your project"
3. Registriere dich mit Email oder GitHub
4. Bestätige deine Email-Adresse

## Schritt 2: Neues Projekt erstellen

1. Klicke auf "New Project"
2. Wähle deine Organisation (oder erstelle eine neue)
3. Projekt-Einstellungen:
   - **Project Name:** `senec-design-leads` (oder beliebig)
   - **Database Password:** [Sicheres Passwort generieren lassen - WICHTIG: Speichern!]
   - **Region:** **Frankfurt (eu-central-1)** ← DSGVO-konform!
   - **Pricing Plan:** Free (ausreichend für Start)
4. Klicke auf "Create new project"
5. Warte ~2 Minuten bis Projekt bereit ist

## Schritt 3: API-Credentials finden

1. Gehe zu **Settings** (linke Sidebar)
2. Klicke auf **API**
3. Kopiere folgende Werte:

### Project URL
```
https://[DEIN-PROJEKT-ID].supabase.co
```

### Anon/Public Key (anon public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Schritt 4: Credentials an Manus übergeben

Sende mir diese 2 Werte:
- Project URL
- Anon Key

**WICHTIG:** Der Anon Key ist sicher für Frontend-Nutzung (Row Level Security schützt Daten).

---

## Was danach passiert (automatisch)

Ich werde:
1. ✅ Supabase-Client in dein Projekt integrieren
2. ✅ Datenbank-Tabellen erstellen (exit_popup_events, leads, lead_status)
3. ✅ Row Level Security (RLS) Policies konfigurieren
4. ✅ Exit-Popup Event-Tracking implementieren
5. ✅ Lead-Formular-Integration
6. ✅ Admin-Panel unter `/admin` erstellen
7. ✅ Email-Benachrichtigungen konfigurieren

**Zeitaufwand:** ~25 Minuten nach Erhalt der Credentials
