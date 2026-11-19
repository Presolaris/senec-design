## Kontakt- und Messbarkeitsvorschau, 19.11.2026

Nur die acht vorgegebenen Maßnahmen. Vorschau basiert auf Remote main fdd3d2ad; keine Veröffentlichung, kein Push, keine neue GA4-, Domain-, DNS-, Mail-, Zahlungs- oder WAF-Einstellung. Bestehende unveröffentlichte CI- und Live-Mail-Aufgaben werden nicht in den Patch aufgenommen.

Google-Ereignisreferenz https://developers.google.com/analytics/devguides/collection/ga4/reference/events (19.11.2026): generate_lead misst eine Formularanfrage; kein erfundener monetärer value. Im bestehenden Double-Opt-in wird nur die erfolgreiche initiale Annahme gezählt, nicht eine bestätigte Anfrage oder ein Verkauf.

Google-PII-Regel https://support.google.com/analytics/answer/6366371?hl=de (19.11.2026): keine privaten E-Mail-Adressen, Telefonnummern oder personenbezogenen URL-/Kampagnenparameter an GA. Ereignisse enthalten deshalb nur Seitenpfad und gegebenenfalls Formularname. Attribution separat und begrenzt, keine Roh-URLs oder Formulardaten in GA.

WhatsApp-Richtlinie https://www.whatsapp.com/legal/privacy-policy-eea/revisions/20260608 (19.11.2026): Geschäftskommunikation und Drittlandverarbeitung erläutert. Der Preview-Text kennzeichnet den externen Link, keinen Widget-/SDK-Einsatz und alternative Telefon-/E-Mail-Kontakte. Keine Zusage einer ausschließlich europäischen Speicherung oder umfassenden Rechtsprüfung.

Konservative Speicherung: First-Touch-Informationen werden nur nach bestehender Analytics-Einwilligung im sessionStorage über Seitenwechsel hinweg erhalten; Widerruf löscht sie. Ohne Einwilligung bleibt das Formular nutzbar, aber historische UTM-Zuordnung über mehrere Seiten wird nicht behauptet.

Telefonprüfung: statische Firmenlinks mit fehlenden Ziffern sowie Platzhaltern korrigieren; dynamische Kunden-Links in Admin/Dashboard nicht mit Firmenkontakten verwechseln. Neue llms.txt nennt nur auf der Website nachweisbare Leistungen, Firmenkontakt und vorhandene Seiten, keine neuen Zahlen oder Garantien.
