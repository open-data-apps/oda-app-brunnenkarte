Hier ist das vollständige **App-Konzept in Markdown**, so formuliert, dass du es direkt an eine Coding-KI weitergeben kannst.

# App-Konzept: Brunnenkarte Stuttgart

## 1. Ziel der App

Die App soll eine kommunal nutzbare ODAS-Anwendung für den Datensatz **„Brunnen“** aus Stuttgart bereitstellen. Sie visualisiert die in Betrieb befindlichen Brunnenstandorte auf einer Karte, ergänzt um Filter, KPIs, Detailansicht und eine tabellarische Übersicht. Der zugrunde liegende Datensatz wird auf daten.bw und OpenData@Stuttgart veröffentlicht und umfasst getrennte Ressourcen für Brunnen in Betrieb, Trinkwasserbrunnen im Betrieb und Mineralwasserbrunnen im Betrieb. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

Die App richtet sich **nicht an Privatnutzung im engeren Sinne**, sondern an Städte, Verwaltungen, kommunale Betriebe, Tourismus, Klimaanpassung und Open-Data-Stellen. Sie eignet sich besonders zur öffentlichen Darstellung von Wasserinfrastruktur, Aufenthaltsqualität und hitzerelevanten Standorten im Stadtraum. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

## 2. Datensatz

### Datensatzname

**Brunnen** [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

### Portale

- [daten.bw – Datensatzseite](https://www.daten-bw.de/web/guest/daten/-/details/brunnen) [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- [OpenData@Stuttgart – Datensatzseite](https://opendata.stuttgart.de/dataset/brunnen) [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

### Fachlicher Inhalt

Der Datensatz beschreibt Brunnenstandorte in Stuttgart und verweist auf mehrere Ressourcen, darunter:

- Brunnen in Betrieb [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Trinkwasserbrunnen im Betrieb [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Mineralwasserbrunnen im Betrieb [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

### Zuständige Stellen

Als Datenquellen bzw. fachlich beteiligte Stellen werden auf der Datensatzseite das **Tiefbauamt** sowie das **Garten-, Friedhofs- und Forstamt** genannt; als veröffentlichende Stelle ist das **Stadtmessungsamt Stuttgart** angegeben. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

### Aktualität

Der Datensatz wurde laut Such- und Datensatzinformationen zuletzt am **17.11.2025** aktualisiert. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

### Technische Besonderheit

Die Ressourcen werden als **WFS** bereitgestellt und nicht als CKAN-`datastore_search`-Ressource. Für die App muss daher nicht die CKAN-Datastore-API, sondern die Geodaten-Ressource des Stuttgarter Portals verwendet werden. Das ist im ODAS-Kontext zulässig, da auch andere Open-Data-APIs genutzt werden können, sofern der Datensatz fachlich geeignet ist. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/searchresult/f/format:wfs%7Ctype:dataset%7Csourceportal:a9cc982f-12de-4087-b509-cc935793736f%7C/s/lastmodification_desc)

## 3. Warum dieser Datensatz geeignet ist

Der Datensatz ist für eine ODAS-App geeignet, weil er:

- einen klaren kommunalen Anwendungsfall hat, nämlich die Sichtbarmachung öffentlicher Brunneninfrastruktur, [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- geografische Standorte enthält und damit ideal für eine Kartenanwendung ist, [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)
- verschiedene Brunnenarten unterscheidet, was Filter, KPIs und einfache Auswertungen ermöglicht, [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- fachlich zu Hitzeschutz, Aufenthaltsqualität, Tourismus und Stadtinformation passt. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

Zusätzlich ist das Thema im ODAS bisher offenbar nicht als prominente Standard-App sichtbar, während andere Felder wie Mobilität, Ladeinfrastruktur oder generische Kartenanwendungen deutlich naheliegender bzw. verbreiteter sind. In den öffentlich auffindbaren ODAS-Treffern ließ sich keine Brunnen-App identifizieren. [open-data-app-store](https://open-data-app-store.de/apps)

## 4. App-Name und Kurzbeschreibung

### Empfohlener App-Name

**Brunnenkarte Stuttgart** [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

### Kurzbeschreibung

Interaktive Karten- und Analyse-App für die Brunnenstandorte in Stuttgart. Die Anwendung zeigt Brunnen, Trinkwasserbrunnen und Mineralwasserbrunnen auf einer Karte, bietet Filter- und Suchfunktionen, Kennzahlen sowie eine tabellarische Übersicht für kommunale Nutzung. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

### Alternative Namen

- Trink- und Mineralbrunnen Stuttgart [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Wasserpunkte Stuttgart [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Öffentliche Brunnen Stuttgart [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

## 5. Zielgruppen

### Primäre Zielgruppen

- Stadtverwaltungen und Fachämter
- Open-Data- und Smart-City-Teams
- Tourismus und Stadtmarketing
- Klimaanpassungs- und Gesundheitskommunikation
- Bürgerinformationsportale kommunaler Institutionen

### Typische Nutzungsszenarien

- Visualisierung aller öffentlich relevanten Brunnenstandorte einer Stadt [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Darstellung von Trinkwasserbrunnen im Rahmen von Sommer- oder Hitzeschutzkommunikation [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Bereitstellung eines übersichtlichen kommunalen Stadtinformationsdienstes [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)
- Einbindung in kommunale Portale mit Such-, Karten- und Tabellenfunktion

## 6. Kernfunktionen der App

Die App soll dem typischen ODAS-Aufbau folgen: **oben KPI-Kacheln**, darunter **Filterbereich**, anschließend **Karte und Tabelle**. Diese Struktur ist für schnelle Orientierung und operative Nutzung sinnvoll. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

### 6.1 KPI-Kacheln

Oben sollen 3 bis 5 Kennzahlen als Karten angezeigt werden.

Empfohlene KPIs:

1. **Alle Brunnen gesamt**  
   Anzahl aller geladenen Datensätze. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

2. **Trinkwasserbrunnen**  
   Anzahl aller als Trinkwasserbrunnen klassifizierten Einträge. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

3. **Mineralwasserbrunnen**  
   Anzahl aller als Mineralwasserbrunnen klassifizierten Einträge. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

4. **Sonstige Brunnen / Brunnen in Betrieb**  
   Anzahl der übrigen Brunnen bzw. der Ressource „Brunnen in Betrieb“. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

5. **Anteil Trinkwasserbrunnen**  
   Prozentualer Anteil der Trinkwasserbrunnen an allen angezeigten Einträgen; dieser Wert wird clientseitig berechnet. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

### 6.2 Filter

Die App soll mindestens folgende Filter bereitstellen:

- **Brunnenart**  
  Dropdown mit Werten wie „Alle“, „Brunnen“, „Trinkwasserbrunnen“, „Mineralwasserbrunnen“. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

- **Freitextsuche**  
  Suche über Name, Lagebezeichnung, Adresse oder andere textuelle Felder, falls vorhanden. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

- **Stadtbezirk / Stadtteil**  
  Nur wenn ein entsprechendes Attribut im WFS geliefert wird; dies muss bei der technischen Feldanalyse geprüft werden. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

- **Nur sichtbaren Kartenausschnitt anzeigen**  
  Optional: Tabelle und KPIs basieren nur auf den aktuell im Kartenausschnitt sichtbaren Einträgen.

- **Datenquelle / Ressource**  
  Optional: Umschalter zwischen den Ressourcen „Brunnen in Betrieb“, „Trinkwasserbrunnen im Betrieb“ und „Mineralwasserbrunnen im Betrieb“. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

### 6.3 Kartenansicht

Die Karte ist die Hauptansicht der App, weil es sich um einen standortbezogenen Datensatz handelt. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

Anforderungen:

- Leaflet-Karte mit Marker-Clustering
- Initialer Kartenausschnitt auf Stuttgart
- Unterschiedliche Markerfarben oder Icons je Brunnenart
- Klick auf Marker öffnet Detail-Popup
- Optional: automatische Zoom-Anpassung auf gefilterte Ergebnisse
- Optional: Standortsuche oder „in meiner Nähe“-Funktion, falls Browser-Geolocation gewünscht ist

### 6.4 Detailansicht / Popup

Beim Klick auf einen Marker oder einen Tabelleneintrag soll ein Detail-Popup bzw. Offcanvas erscheinen.

Empfohlene Inhalte:

- Name / Bezeichnung des Brunnens
- Brunnenart
- Adresse oder Lagebeschreibung
- Stadtbezirk / Stadtteil, falls vorhanden
- Koordinaten
- Link zur Navigation in externem Kartendienst
- Hinweis auf Datenquelle

### 6.5 Tabellenansicht

Unter oder neben der Karte soll eine Tabelle mit den gefilterten Einträgen erscheinen.

Empfohlene Spalten:

- Name / Bezeichnung
- Brunnenart
- Lage / Adresse
- Bezirk / Stadtteil, falls vorhanden
- Koordinaten oder Geometrie-Hinweis
- Aktion „Auf Karte anzeigen“

Tabellenfunktionen:

- Sortierung nach Name oder Typ
- Paginierung
- Freitextsuche
- Klick auf Zeile zentriert Karte auf den Eintrag
- Optional CSV-Export der gefilterten Datensätze

### 6.6 Diagramm

Ein Diagramm ist sinnvoll, aber nicht der zentrale Fokus.

Empfehlung:

- **Donut-Chart nach Brunnenart**
- alternativ **Balkendiagramm nach Bezirk**, wenn Bezirksfelder vorhanden sind

Das Diagramm soll aus den aktuell gefilterten Datensätzen berechnet werden, damit Karte, Tabelle, KPIs und Chart konsistent bleiben.

## 7. Benötigte Datenfelder

Da der Datensatz öffentlich vor allem als WFS beschrieben ist, müssen die tatsächlich verfügbaren Attribute bei der technischen Umsetzung zuerst ausgelesen werden. Die folgenden Felder werden fachlich erwartet oder sollten bei der Implementierung geprüft werden: [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

| Feldtyp                 | Erwarteter Inhalt    | Verwendung              |
| ----------------------- | -------------------- | ----------------------- |
| ID                      | Eindeutige Kennung   | Schlüssel im Frontend   |
| Name / Bezeichnung      | Name des Brunnens    | Tabelle, Suche, Popup   |
| Typ / Kategorie         | Brunnenart           | Filter, KPI, Chart      |
| Adresse / Lage          | Lagebeschreibung     | Tabelle, Popup, Suche   |
| Bezirk / Stadtteil      | Räumliche Einordnung | Filter, KPI, Chart      |
| Koordinaten / Geometrie | Punktgeometrie       | Karte                   |
| Status                  | z. B. „in Betrieb“   | Filter oder Anzeige     |
| Quelle / Ressource      | Ursprung der Daten   | Transparenz / Debugging |

Wenn einzelne Felder im WFS anders heißen, sollen sie im Code über ein Mapping normalisiert werden, zum Beispiel:

- `nameField`
- `typeField`
- `districtField`
- `latField`
- `lonField`

## 8. UX- und UI-Konzept

### Seitenaufbau

1. Titel und Kurzbeschreibung
2. KPI-Kacheln
3. Filterleiste
4. Karte
5. Tabelle
6. Optional Chart
7. Footer mit Datenquelle und Aktualitätsinfo

### Darstellungslogik

- KPI-Kacheln reagieren auf aktive Filter
- Karte und Tabelle sind synchron
- Klick in Tabelle fokussiert Marker auf Karte
- Klick auf Marker markiert ggf. Tabellenzeile
- Leerer Zustand wird freundlich behandelt, zum Beispiel: „Keine Brunnen für diese Filterkombination gefunden.“

### Mobile Verhalten

- KPI-Kacheln untereinander
- Filter in Accordion oder Offcanvas
- Karte zuerst, Tabelle darunter
- Tabelle mobil als Kartenliste / kompakte Card-Liste statt breiter Grid-Tabelle

## 9. Technisches Konzept für die Coding-KI

### Rahmenbedingungen

- **Vanilla JavaScript**
- **Kein Framework**
- **Kein Build-Tool**
- **Bootstrap 5.3**
- **Leaflet dynamisch per Script-Tag laden**
- Optional Chart.js dynamisch laden
- App muss in `enclosingHtmlDivElement` rendern
- `addToHead()` muss außerhalb von `app()` definiert sein

### Einstiegspunkte

```javascript
function app(configdata, enclosingHtmlDivElement) { ... return null; }
function addToHead() { return; }
```

### Empfohlene config.json

Da keine CKAN-`datastore_search`-Ressource verwendet wird, sollte die Konfiguration auf die externe WFS- oder GeoJSON-Quelle angepasst werden.

Beispiel:

```json
{
  "title": "Brunnenkarte Stuttgart",
  "subtitle": "Interaktive Übersicht öffentlicher Brunnen in Stuttgart",
  "dataSources": [
    {
      "label": "Brunnen in Betrieb",
      "url": "WFS-ODER-GEOJSON-URL-1",
      "type": "brunnen"
    },
    {
      "label": "Trinkwasserbrunnen im Betrieb",
      "url": "WFS-ODER-GEOJSON-URL-2",
      "type": "trinkwasser"
    },
    {
      "label": "Mineralwasserbrunnen im Betrieb",
      "url": "WFS-ODER-GEOJSON-URL-3",
      "type": "mineralwasser"
    }
  ],
  "map": {
    "lat": 48.7758,
    "lng": 9.1829,
    "zoom": 12
  }
}
```

### Datenlade-Logik

Die Coding-KI soll:

1. Alle konfigurierten Ressourcen laden
2. Die Datensätze in ein einheitliches internes Format transformieren
3. Fehlende Feldnamen über Mapping behandeln
4. Alle Datensätze in einem gemeinsamen Array speichern
5. Darauf Filter, KPIs, Karte, Tabelle und Chart berechnen

### Internes Datenmodell

Empfohlenes Normalformat im Frontend:

```javascript
{
  id: "...",
  name: "...",
  type: "brunnen | trinkwasser | mineralwasser",
  district: "...",
  address: "...",
  lat: 0,
  lng: 0,
  status: "...",
  sourceLabel: "..."
}
```

### Komponenten

Die Coding-KI soll diese Funktionen getrennt implementieren:

- `loadLeaflet()`
- `loadChartJs()` optional
- `fetchAllSources()`
- `normalizeRecord(rawRecord, sourceType)`
- `renderLayout()`
- `renderKpis(records)`
- `renderFilters(records)`
- `renderMap(records)`
- `renderTable(records)`
- `renderChart(records)`
- `applyFilters()`

### Fehlerbehandlung

- Wenn eine Datenquelle fehlschlägt, App nicht komplett abbrechen
- Fehlende Koordinaten überspringen und zählen
- Leere Ergebnisse klar anzeigen
- Netzwerkfehler mit Bootstrap-Alert darstellen

## 10. Empfohlene Visualisierung

### Marker-Logik

- Allgemeine Brunnen: Blau
- Trinkwasserbrunnen: Grün
- Mineralwasserbrunnen: Violett oder Türkis

### KPI-Farben

- Neutrales Bootstrap-Design
- Klare Icons, aber keine überladene Visualisierung
- Zahlen groß, Labels kurz

### Diagramm

- Donut-Chart mit 3 Segmenten für die Brunnenarten
- Farben konsistent zu Markerfarben

## 11. Inhalte für Popups und Tabelle

### Popup-Template

```text
Name / Bezeichnung
Typ: Trinkwasserbrunnen
Adresse / Lage: ...
Bezirk: ...
Koordinaten: ...
Quelle: Trinkwasserbrunnen im Betrieb
```

### Tabellen-Template

| Spalte | Inhalt                        |
| ------ | ----------------------------- |
| Name   | Bezeichnung des Brunnens      |
| Typ    | Brunnenart                    |
| Lage   | Adresse oder Lagebeschreibung |
| Bezirk | sofern vorhanden              |
| Aktion | Karte fokussieren             |

## 12. Nutzenargumentation für ODAS

Diese App ist für den Open Data App Store gut geeignet, weil sie einen klaren kommunalen Mehrwert aus einem öffentlichen Standortdatensatz erzeugt. Statt nur einzelne Geodaten-Ressourcen bereitzustellen, übersetzt die App die Daten in eine unmittelbar nutzbare Verwaltungs- und Bürgerinformationsanwendung. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

Besonders stark ist das Thema in folgenden Kontexten:

- Hitzeschutz und Aufenthaltsqualität im öffentlichen Raum [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Transparente kommunale Infrastrukturinformation [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)
- Touristische und städtische Serviceangebote [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- Wiederverwendbare Blaupause für andere Städte mit ähnlichen Geodaten

## 13. Abgrenzung und Erweiterungen

### Mögliche Erweiterungen

- Favoriten oder Merkliste im Session-State
- Routing-Link zu externem Kartendienst
- Einblendung weiterer Wasserinfrastruktur
- Sommermodus mit Fokus auf Trinkwasserbrunnen
- Kombination mit Hitzedaten oder Aufenthaltsorten

### Spätere Ausbaustufen

- Mehrsprachigkeit
- Barrierefreie Detaildarstellung
- Druckansicht
- Export gefilterter Daten
- Bezirksstatistik mit Diagramm

## 14. Anforderungen an die Coding-KI

Die Coding-KI soll auf Basis dieses Konzepts eine vollständige `app.js` für ODAS erzeugen.

### Pflichtvorgaben

- Vanilla JS
- Bootstrap 5.3
- kein Framework
- kein Build-Tool
- `app(configdata, enclosingHtmlDivElement)` als Einstieg
- `addToHead()` außerhalb und nach `app()`
- Leaflet **nicht** über `addToHead()`, sondern dynamisch in `loadLeaflet()`
- App rendert vollständig in `enclosingHtmlDivElement`
- Karte + KPI + Filter + Tabelle müssen vorhanden sein
- Datenquellen kommen aus `configdata`

### Erwartetes Ergebnis

Die Coding-KI soll eine produktionsnahe ODAS-kompatible App erzeugen, die:

- mehrere Brunnen-Datenquellen laden kann,
- die Daten vereinheitlicht,
- interaktive Filter unterstützt,
- eine Karte mit Markern rendert,
- KPIs berechnet,
- eine Tabelle mit Such- und Fokusfunktion darstellt,
- optional ein Chart ergänzt.

## 15. Kurzbriefing für die Coding-KI

```md
Baue eine ODAS-kompatible App in Vanilla JS für den Datensatz „Brunnen“ aus Stuttgart. Die App heißt „Brunnenkarte Stuttgart“ und soll Brunnen, Trinkwasserbrunnen und Mineralwasserbrunnen aus externen WFS- oder GeoJSON-Quellen laden. Ziel ist eine kommunale Kartenanwendung mit KPI-Kacheln, Filterleiste, Leaflet-Karte, synchronisierter Tabelle und optionalem Donut-Chart.

Verwende:

- Vanilla JS
- Bootstrap 5.3
- kein Framework
- kein Build-Tool

Technische Regeln:

- Einstieg über function app(configdata, enclosingHtmlDivElement)
- addToHead() außerhalb und nach app()
- Leaflet dynamisch in loadLeaflet() laden
- Datenquellen aus configdata.dataSources laden
- Alle Datensätze in ein internes Normalformat transformieren:
  { id, name, type, district, address, lat, lng, status, sourceLabel }

Pflichtfunktionen:

- KPI-Kacheln oben
- Filter für Brunnenart und Freitext
- Kartenansicht mit Marker-Clustering
- Tabelle mit Klick auf „auf Karte zeigen“
- Popup/Detailansicht je Marker
- Robuste Fehlerbehandlung

UI-Reihenfolge:

1. Titel
2. KPIs
3. Filter
4. Karte
5. Tabelle
6. Optional Chart

Die App muss für kommunale Nutzer geeignet, übersichtlich und ODAS-kompatibel sein.
```

Wenn du willst, kann ich dir im nächsten Schritt daraus direkt die **vollständige ODAS-`app.js`** erzeugen.
Ja — hier sind die **nötigen Links für den Datensatz „Brunnen“ (Stuttgart)**, so dass du sie direkt in ein Konzept oder an eine Coding-KI weitergeben kannst. Der Datensatz ist auf daten.bw und OpenData@Stuttgart öffentlich gelistet, wird als **WFS** angeboten und enthält laut Beschreibung Brunnen in Betrieb, Trinkwasserbrunnen im Betrieb und Mineralwasserbrunnen im Betrieb. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

## Datensatz-Links

- **daten.bw Datensatzseite:** [https://www.daten-bw.de/web/guest/daten/-/details/brunnen](https://www.daten-bw.de/web/guest/daten/-/details/brunnen) [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)
- **OpenData@Stuttgart Datensatzseite:** [https://opendata.stuttgart.de/dataset/brunnen](https://opendata.stuttgart.de/dataset/brunnen) [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)
- **OpenData@Stuttgart Datensatzsuche mit WFS-Filter:** [https://opendata.stuttgart.de/de/dataset/?\_groups_limit=0&\_tags_limit=0&res_format=WFS&tags=Brunnen](https://opendata.stuttgart.de/de/dataset/?_groups_limit=0&_tags_limit=0&res_format=WFS&tags=Brunnen) [opendata.stuttgart](https://opendata.stuttgart.de/de/dataset/?_groups_limit=0&_tags_limit=0&res_format=WFS&tags=Brunnen)
- **daten.bw Suchtreffer für Brunnen:** [https://www.daten-bw.de/suchen/-/searchresult/f/groups:envi%7Cgroups:heal%7Ctags:brunnen%7C/s/relevance_asc](https://www.daten-bw.de/suchen/-/searchresult/f/groups:envi%7Cgroups:heal%7Ctags:brunnen%7C/s/relevance_asc) [daten-bw](https://www.daten-bw.de/suchen/-/searchresult/f/groups:envi%7Cgroups:heal%7Ctags:brunnen%7C/s/relevance_asc)

## Technische Hinweise

Die Such- und Datensatzseiten bestätigen, dass der Datensatz im Format **WFS** bereitgestellt wird und vom **Stadtmessungsamt** veröffentlicht ist. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/searchresult/f/format:wfs%7Ctype:dataset%7Csourceportal:a9cc982f-12de-4087-b509-cc935793736f%7C/s/lastmodification_desc)
Außerdem beschreibt die daten.bw-Seite explizit drei inhaltliche Bereiche beziehungsweise Distributionen: **Brunnen in Betrieb**, **Trinkwasserbrunnen im Betrieb** und **Mineralwasserbrunnen im Betrieb**. [daten-bw](https://www.daten-bw.de/web/guest/daten/-/details/brunnen)

## Für die Coding-KI

Diesen Block kannst du direkt weitergeben:

```md
Relevante Links für den Datensatz „Brunnen“ (Stuttgart):

- daten.bw Datensatzseite:
  https://www.daten-bw.de/web/guest/daten/-/details/brunnen

- OpenData@Stuttgart Datensatzseite:
  https://opendata.stuttgart.de/dataset/brunnen

- OpenData@Stuttgart WFS-Suche:
  https://opendata.stuttgart.de/de/dataset/?_groups_limit=0&_tags_limit=0&res_format=WFS&tags=Brunnen

- daten.bw Suchseite:
  https://www.daten-bw.de/suchen/-/searchresult/f/groups:envi%7Cgroups:heal%7Ctags:brunnen%7C/s/relevance_asc

Hinweis:
Der Datensatz wird als WFS bereitgestellt, nicht als CKAN datastore_search.
Laut Datensatzbeschreibung gibt es Ressourcen für:

- Brunnen in Betrieb
- Trinkwasserbrunnen im Betrieb
- Mineralwasserbrunnen im Betrieb
```

## Noch offen

Was noch **fehlt**, sind die **direkten WFS-Request-URLs** für die eigentlichen Feature-Layer, also die Endpunkte, die du im Frontend wirklich abrufst. Die öffentlich sichtbaren Suchtreffer zeigen den Datensatz und das Format WFS, aber nicht die vollständigen Layer-URLs selbst. [opendata.stuttgart](https://opendata.stuttgart.de/de/dataset/?_groups_limit=0&_tags_limit=0&res_format=WFS&tags=Brunnen)
Der nächste sinnvolle Schritt ist daher, die OpenData@Stuttgart-Datensatzseite beziehungsweise die verlinkten Ressourcen konkret auszulesen, um die exakten `GetCapabilities`- oder `GetFeature`-Links für die drei Brunnen-Layer zu extrahieren. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

Soll ich dir jetzt als Nächstes die **direkten WFS-Endpunkte** für die drei Brunnen-Ressourcen heraussuchen?
Ja — die **direkten WFS-Ressourcen** lassen sich jetzt sauber eingrenzen. Die OpenData@Stuttgart-Datensatzseite bestätigt den Datensatz **„Brunnen“** mit genau drei WFS-Ressourcen: **Brunnen in Betrieb**, **Trinkwasserbrunnen im Betrieb** und **Mineralwasserbrunnen im Betrieb**. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/brunnen)

## Direkte Ressourcen-Links

Hier sind die direkt referenzierbaren **Ressourcenseiten** im Portal:

- **Brunnen in Betrieb**  
  [https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/2647bd64-9036-4f95-b2d2-9b40ba980001](https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/2647bd64-9036-4f95-b2d2-9b40ba980001) [opendata.stuttgart](https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/2647bd64-9036-4f95-b2d2-9b40ba980001)

- **Trinkwasserbrunnen im Betrieb**  
  [https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d](https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d) [opendata.stuttgart](https://opendata.stuttgart.de/sv/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d)

- **Mineralwasserbrunnen im Betrieb**  
  [https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea](https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea) [opendata.stuttgart](https://opendata.stuttgart.de/en_AU/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea)

## WFS-Basis

Die Ressourcenseiten zeigen als Zielhost **`https://geoserver.stuttgart.de/gdc`** beziehungsweise **`https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?...`** für die WFS-Auslieferung. Das ist bei den Trinkwasser- und Mineralwasser-Ressourcen direkt in den Snippets sichtbar. [opendata.stuttgart](https://opendata.stuttgart.de/uk_UA/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d)
Damit ist der relevante WFS-Server für die Coding-KI eindeutig: **`https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows`**. [opendata.stuttgart](https://opendata.stuttgart.de/es/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea)

## Nützliche WFS-Requests

Für die technische Weitergabe kannst du mit diesen Basis-URLs arbeiten:

- **GetCapabilities**  
  [https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?service=WFS&version=1.1.0&request=GetCapabilities](https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?service=WFS&version=1.1.0&request=GetCapabilities) [opendata.stuttgart](https://opendata.stuttgart.de/uk_UA/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d)

- **Basis für GetFeature-Requests**  
  `https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=LAYERNAME&outputFormat=application/json` [opendata.stuttgart](https://opendata.stuttgart.de/es/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea)

Wichtig ist: Die **genauen `typeName`-Layernamen** sind aus den Snippets noch nicht vollständig sichtbar; sicher belegt sind bislang der Geoserver-Endpunkt und die drei Resource-IDs im Portal. [opendata.stuttgart](https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/2647bd64-9036-4f95-b2d2-9b40ba980001)

## Block für die Coding-KI

Diesen Block kannst du direkt übernehmen:

```md
Datensatz: Brunnen (Stuttgart)

Datensatzseiten:

- https://www.daten-bw.de/web/guest/daten/-/details/brunnen
- https://opendata.stuttgart.de/dataset/brunnen

Ressourcen:

- Brunnen in Betrieb
  https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/2647bd64-9036-4f95-b2d2-9b40ba980001

- Trinkwasserbrunnen im Betrieb
  https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d

- Mineralwasserbrunnen im Betrieb
  https://opendata.stuttgart.de/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/d68c9d8d-ba8c-41f7-a91c-abfaf919e3ea

WFS-Server:

- https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows

GetCapabilities:

- https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?service=WFS&version=1.1.0&request=GetCapabilities

GetFeature-Schema:

- https://geoserver.stuttgart.de/gdc/Natur_Umwelt/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=LAYERNAME&outputFormat=application/json
```

## Noch sinnvoll

Der letzte offene technische Schritt ist jetzt das **Ermitteln der exakten `typeName`-Layernamen** aus der WFS-`GetCapabilities`, damit daraus sofort funktionierende GeoJSON-URLs für `config.json` gebaut werden können. [opendata.stuttgart](https://opendata.stuttgart.de/uk_UA/dataset/6b596b4e-b825-4565-a8cf-a84dba362c5f/resource/38a54cf2-a325-4f46-8598-746e60986d6d)
