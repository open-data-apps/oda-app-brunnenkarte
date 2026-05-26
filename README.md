# Brunnenkarte Stuttgart

Die App **Brunnenkarte Stuttgart** ist eine ODAS-kompatible Single Page Application fuer den Open Data App Store. Sie visualisiert offene Brunnenstandorte der Landeshauptstadt Stuttgart aus WFS/GeoJSON-Daten und bereitet sie als kommunale Karten- und Analyseansicht auf.

Die App entspricht dem ODAS-V1-Modell auf Basis des `oda-generic` Templates: Die Runtime-Dateien bleiben im Template, die app-spezifische Logik liegt in `app/app.js`, das app-spezifische Styling in `app/app.css`.

## Funktionen

- KPI-Kacheln fuer alle Brunnen, Trinkwasserbrunnen, Mineralwasserbrunnen und sonstige Brunnen
- Filter fuer Brunnenart, Freitext, Datenquelle und Bezirk/Stadtteil, falls im Datensatz vorhanden
- Leaflet-Karte mit Marker-Clustering, farbigen Markern und Detail-Popups
- Synchronisierte Tabelle mit Sortierung, Paginierung und Kartenfokus
- Schlanke HTML-Verteilung nach Brunnenart ohne zusaetzliche Chart-Bibliothek
- CSV-Export der aktuell gefilterten Datensaetze
- Robuste Fehleranzeige, wenn einzelne Quellen nicht geladen werden koennen

## Datenquellen

Die lokale Beispielkonfiguration nutzt den Datensatz **Brunnen** von OpenData@Stuttgart:

- Datensatz: https://opendata.stuttgart.de/dataset/brunnen
- WFS-Server: https://geoserver.stuttgart.de/gdc/Natur_Umwelt/wfs

Verwendete WFS-Layer:

| Quelle | WFS typeName |
| --- | --- |
| Brunnen in Betrieb | `Natur_Umwelt:A62_BRU_BRUNNEN_Brunnen_in_Betr_EPSG25832` |
| Trinkwasserbrunnen im Betrieb | `Natur_Umwelt:A62_BRU_BRUNNEN_Trinkwasserbr_in_Betr_EPSG25832` |
| Mineralwasserbrunnen im Betrieb | `Natur_Umwelt:A62_BRU_BRUNNEN_Mineralbr_in_Betr_EPSG25832` |

Die App fordert die Daten als GeoJSON mit `srsName=EPSG:4326` an. Der Stuttgarter GeoServer liefert fuer diese Endpunkte `Access-Control-Allow-Origin: *`, deshalb laeuft die App im Standardfall im Direktmodus ohne ODAS-Proxy.

## Konfiguration

Die ODAS-Instanzkonfiguration wird in `app-package.json` beschrieben. Fuer lokale Tests spiegelt `odas-config/config.json` dieselben app-spezifischen Felder.

Wichtige Parameter:

| Parameter | Beschreibung |
| --- | --- |
| `dataSources` | Array oder JSON-String mit Objekten aus `label`, `type` und `url` |
| `urlDaten` | Katalogseite des Datensatzes |
| `titel` | Sichtbarer App-Titel |
| `seitentitel` | Titel im Browser-Tab |

`type` unterstuetzt `brunnen`, `trinkwasser` und `mineralwasser`. Die App erkennt Trinkwasser- und Mineralwasserbrunnen zusaetzlich anhand typischer Felder wie `ANLAGENART` und `TRINKWASSER`.

## Lokale Entwicklung

Empfohlen ist VS Code Live Server aus der Projektwurzel:

```json
{
  "liveServer.settings.host": "127.0.0.1",
  "liveServer.settings.root": "/",
  "liveServer.settings.file": "app/index.html"
}
```

Dann die App unter `http://127.0.0.1:<live-server-port>/app/` oeffnen. Live Server nutzt standardmaessig Port `5500`.

Fuer lokale Live-Server-Tests muss in `app/app-base.js` der bereits vorhandene localhost-Block in `getConfigUrl()` temporaer aktiviert werden, damit `../odas-config/config.json` geladen wird. Vor ZIP-Erstellung oder ODAS-Live-Auslieferung muss dieser Block wieder auskommentiert sein.

## Docker

```bash
make build
make up
```

Die Docker-Variante nutzt die Template-Dateien `Dockerfile`, `docker-compose.yml` und `nginx.conf`.

## Tests

Die wichtigsten Normalisierungs- und Filterfunktionen werden mit einem kleinen Node-Test geprueft:

```bash
node tools/test_app_logic.mjs
```

## Lieferumfang

Der ODAS-ZIP-Befehl aus dem Template packt:

- `app/`
- `assets/`
- `app-package.json`
- `CHANGELOG.md`

```bash
make zip
```

## Wichtige Dateien

| Datei | Beschreibung |
| --- | --- |
| `app/app.js` | App-Logik, Datenladen, Normalisierung, Filter, Karte, Tabelle, Verteilung |
| `app/app.css` | App-spezifisches Styling |
| `app-package.json` | ODAS-Metadaten und Instanz-Konfiguration |
| `odas-config/config.json` | Lokale Testkonfiguration |
| `assets/schema.json` | Normalisiertes Datenmodell |
| `assets/odas-app-icon.svg` | ODAS-App-Icon |

## Autor

(C) 2026, Ondics GmbH
