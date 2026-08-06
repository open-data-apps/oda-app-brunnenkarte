# Brunnenkarte

Die App **Brunnenkarte** ist eine ODAS-kompatible Single Page Application fuer den Open Data App Store. Sie visualisiert offene Brunnenstandorte einer Stadt aus WFS/GeoJSON-Daten und bereitet sie als kommunale Karten- und Analyseansicht auf.

Die App entspricht dem ODAS-V1-Modell auf Basis des `oda-generic` Templates: Die Runtime-Dateien bleiben im Template, die app-spezifische Logik liegt in `app/app.js`, das app-spezifische Styling in `app/app.css`.

## Funktionen

- KPI-Kacheln fuer alle Brunnen, Trinkwasserbrunnen, Mineralwasserbrunnen und sonstige Brunnen
- Filter fuer Brunnenart, Freitext, Datenquelle und Bezirk/Stadtteil, falls im Datensatz vorhanden
- Leaflet-Karte mit Marker-Clustering, farbigen Markern und Detail-Popups
- Synchronisierte Tabelle mit Sortierung, Paginierung und Kartenfokus
- Schlanke HTML-Verteilung nach Brunnenart ohne zusaetzliche Chart-Bibliothek
- CSV-Export der aktuell gefilterten Datensaetze
- Robuste Fehleranzeige, wenn einzelne Quellen nicht geladen werden koennen

## Fuer wen ist diese App?

Diese App richtet sich an Buergerinnen und Buerger in Stuttgart sowie an kommunale Stellen. Voraussetzung ist kein spezielles Datenwissen – wer im Stadtgebiet unterwegs ist und einen Trinkwasserbrunnen sucht, kann die App direkt nutzen.

## Datenquellen-Beispiel

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

## Betriebsarten

Die App kann lokal, eigenstaendig hinter einem Traefik-Reverse-Proxy oder ueber den ODAS
betrieben werden.

### Datenabruf: `proxyAktiv`

| Wert   | Bedeutung                                                                   |
| ------ | --------------------------------------------------------------------------- |
| `nein` | Direkter Abruf der Daten-URL. Standard fuer Entwicklung und Standalone.      |
| `ja`   | Abruf ueber den ODAS-Proxy `…/odp-data`. Nur im ODAS-Live-System verfuegbar. |

Bei `nein` muss die Datenquelle CORS freigeben.

### Standalone-Betrieb

Voraussetzung: ein laufender Traefik mit dem externen Docker-Netzwerk `proxynet`,
dem EntryPoint `websecure` und dem Zertifikatsresolver `letsencrypt`.

1. In `docker-compose.standalone.yml` den Platzhalter `app1.example.com` durch den
   echten FQDN ersetzen.
2. In `odas-config/config.json` `proxyAktiv` auf `nein` belassen.
3. Starten:

```bash
STANDALONE=true make up
STANDALONE=true make logs
STANDALONE=true make down
```

Im Standalone-Betrieb entfaellt die lokale Portfreigabe; Traefik terminiert TLS und
leitet auf den internen Nginx-Port 80 weiter. Die Konfiguration wird aus derselben
`odas-config/config.json` gelesen wie in der Entwicklung und von Nginx unter `/config`
ausgeliefert.

### Beim Aufruf kontaktierte Drittanbieter

Beim Aufruf dieser App werden folgende externe Server kontaktiert:

- `unpkg.com` — Leaflet MarkerCluster (Gruppierung von Kartenmarkern)
- `tile.openstreetmap.org` — Kartenkacheln (OpenStreetMap)

Diese Anbieter bleiben auch im Standalone-Betrieb extern; ein vollständig autarker Betrieb ohne Internetzugang ist derzeit nicht möglich. Bootstrap, Leaflet und Chart.js werden seit Version 1.10.0 lokal aus `app/vendor/` ausgeliefert und nicht mehr extern geladen.

### Auslieferung an den ODAS

`make zip` erzeugt das Liefer-ZIP mit `app/`, `assets/`, `app-package.json` und
`CHANGELOG.md`. Die Infrastrukturdateien (`Dockerfile`, `docker-compose*.yml`,
`nginx.conf`, `Makefile`) sind nicht Teil der Auslieferung.

## Autor

(C) 2026, Ondics GmbH
