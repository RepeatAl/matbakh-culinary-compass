
# Matbakh To-Do & Wartungsliste (Nicht-Kritische Bugs & Verbesserungen)

Letztes Update: 2025-06-15

Hier werden alle bekannten Konsolenwarnungen, UX-Reste und mittelfristigen Problemstellen gesammelt, die nicht systemkritisch, aber relevant für Qualität/Barrierefreiheit/Performance sind.  
(Jede erledigte Aufgabe bitte mit ✅ abhaken und mit dem Datum versehen.)

---

### 1. Accessibility-Warnungen (Radix UI Dialog)
- **Warnung:** `DialogContent requires a DialogTitle for accessibility…`
- **Beschreibung:** Jeder `<Dialog>` benötigt zwingend ein `<DialogTitle>` und optional `<DialogDescription>` für Screenreader.
- **Kategorie:** Barrierefreiheit / UX
- **Priorität:** Mittel
- **Status:** ⬜ Offen

**To-Do:**  
- Alle `DialogContent`-Nutzungen prüfen und `<DialogTitle>` ergänzen.
- Gegebenenfalls `<DialogDescription>` für weitere Informationen hinzufügen.

---

### 2. DialogDescription fehlt
- **Warnung:** `Missing Description or aria-describedby={undefined} for DialogContent.`
- **Kategorie:** Barrierefreiheit / UX
- **Priorität:** Mittel
- **Status:** ⬜ Offen

**To-Do:**  
- `<DialogDescription>` oder `aria-describedby` für jeden Dialog setzen.

---

### 3. CSS @import-Regeln in JS-Modulen
- **Warnung:** `@import rules are not allowed here... construct-stylesheets issue`
- **Kategorie:** Build/Performance
- **Priorität:** Niedrig
- **Status:** ⬜ Offen

**To-Do:**  
- CSS-Imports in statische Stylesheets auslagern.

---

### 4. Preload-Warnungen (Ressourcen)
- **Warnung:** `Resource ... was preloaded using link preload but not used within a few seconds...`
- **Kategorie:** Performance / Netzwerk
- **Priorität:** Niedrig
- **Status:** ⬜ Offen

**To-Do:**  
- Unnötige Preloads im HTML/CSS entfernen oder optimieren.

---

### 5. Real User Monitoring (Cloudflare RUM)
- **Log:** `POST .../rum? finished loading`
- **Kategorie:** Monitoring/Info
- **Priorität:** Info
- **Status:** ✅ Keine Aktion nötig

**To-Do:**  
- Nur dokumentieren – keine Codeänderung erforderlich.

---

### 6. Google Tag Manager / Analytics (XHR)
- **Warnung:** `Fetch failed loading: POST "...collect?tid=..."` (HTTP2)
- **Kategorie:** Tracking/Performance
- **Priorität:** Niedrig
- **Status:** ⬜ Offen

**To-Do:**  
- GTM/GA-Konfiguration prüfen (`transport=beacon` usw.).
- Nicht als Bug werten, solange App-Funktionalität besteht.

---

## Weitere Hinweise

- Keine obige Meldung blockiert Kartenanzeige/Suchlogik.
- **Für Google Maps & Places:**  
  Nur API-Key & Aktivierung der jeweiligen API in Google Cloud erforderlich.  
  Falls im Cloud Console Dashboard ("APIs & Dienste" wie im Screenshot) alles freigegeben, muss nichts weiter getan werden – keine Consent-Separatfreigabe bei Google nötig.
- Sollte die Map trotzdem nicht angezeigt werden:
  - Checke Consent im LocalStorage
  - Prüfe, ob Key-Restriktionen (z.B. HTTP-Referrer) korrekt gesetzt sind.

---

*Zur Pflege: Bitte nach Bugfix „Status“ abhaken (✅) und mit Datum ergänzen!*

