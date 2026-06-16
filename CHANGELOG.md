# Changelog

## 16.06.2026 (Version 1.3.0)

- ENH: KPI-Erklärtexte nur nach Klick auf Info-Icon (ⓘ) ausklappbar (statt immer sichtbar).

## 16.06.2026 (Version 1.2.0)

- ENH: Methodikbox (ausklappbar) mit Datenquelle-Hinweis und Datenstand ergaenzt (`datenquelleHinweis`, `datenStand`).
- ENH: KPI-Erklaerungstexte unter den Kennzahlen ergaenzt (`kpiKontext1`–`kpiKontext4`).
- ENH: Abschnitt „Weitere Informationen" optisch ins App-Panel-Design eingepasst.
- FIX: Datenquelle-Link auf der Beschreibungsseite als anklickbaren Link dargestellt.

## 16.06.2026 (Version 1.1.0)

- ENH: Schale-4-Verstaendlichkeit ergaenzt – „Fuer wen ist diese App?"-Block in Beschreibung und README.
- ENH: Konfigurierbarer Abschnitt „Weitere Informationen" mit weiterfuehrenden Links (neues Feld `weiterfuehrendeLinks`, leer = ausgeblendet).

## 11.06.2026

- ENH: App-Name von "Brunnenkarte Stuttgart" auf "Brunnenkarte" vereinheitlicht (name-in-url, Titel, Schema, Icon).

## 22.05.2026 (Version 1.0.0)

- ENH: Brunnenkarte mit WFS-Datenquellen, Leaflet-Karte, Marker-Clustering, KPIs, Filtern, Tabelle und Typ-Verteilung.
- ENH: ODAS-Metadaten, lokale Config, Schema, README und App-Icon fuer die Brunnen-App angepasst.
- ENH: Node-Test fuer Datenquellen-Parsing, Normalisierung, Dublettenlogik und Filter ergaenzt.
- PERF: Scroll-Wheel-Zoom der Karte deaktiviert und Chart.js durch eine leichte HTML-Verteilung ersetzt.

## ToDo

- Config über Nginx laden

## 21.02.2025

- ENH: app-package mit Multiline Strings
- ENH: Feldtypen von HTML auf Markdown umgestellt

## 17.02.2025

- FIX: Loadpage Funktion optimiert

## 12.2.2025 (Version 1.0.0)

- ENH: Anzeige config.json
- ENH: Config-File mit Multiline-String (als Array)
- FIX: Code-Teilung in app-base und app
- FIX: Docker korrigiert, läuft wieder
