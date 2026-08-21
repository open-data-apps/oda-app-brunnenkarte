let brInstanzZaehler = 0;

// F-43: Registrierte Instanzen (Container -> State), damit der Top-Level-Hook
// onPageLeave() alle gemounteten Instanzen aufraeumen kann. Die Base ruft den
// Hook global ohne Container-Parameter auf; eine iterierbare Map ist daher das
// zur App passende Muster (schulwegsicherheit-Portfoliomuster).
const brunnenInstances = new Map();

const BRUNNEN_APP_VERSION = "1.0.0";

const BRUNNEN_TYPE_META = {
  brunnen: {
    label: "Brunnen",
    shortLabel: "Sonstige",
    color: "#1d6fd6",
    markerClass: "brunnen-marker-blue",
  },
  trinkwasser: {
    label: "Trinkwasserbrunnen",
    shortLabel: "Trinkwasser",
    color: "#14804a",
    markerClass: "brunnen-marker-green",
  },
  mineralwasser: {
    label: "Mineralwasserbrunnen",
    shortLabel: "Mineralwasser",
    color: "#7154b8",
    markerClass: "brunnen-marker-violet",
  },
};

function isOdasProxyEnabled(configdata = {}) {
  return String(configdata.proxyAktiv || "").trim().toLowerCase() === "ja";
}

function extractPathFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search;
  } catch (_error) {
    return String(url || "");
  }
}

function getOdasAppBasePath(pathname) {
  let appPath =
    pathname === undefined
      ? typeof window !== "undefined"
        ? window.location.pathname
        : "/"
      : String(pathname || "/");

  if (!appPath.endsWith("/")) {
    const lastSlashIndex = appPath.lastIndexOf("/");
    const lastSegment = appPath.substring(lastSlashIndex + 1);
    if (lastSegment.includes(".")) {
      appPath = appPath.substring(0, lastSlashIndex + 1);
    }
  }

  return appPath.replace(/\/+$/, "");
}

function getOdasProxyEndpoint(targetUrl, pathname) {
  const appPath = getOdasAppBasePath(pathname);
  return `${appPath}/odp-data?path=${encodeURIComponent(
    extractPathFromUrl(targetUrl),
  )}`;
}

async function fetchViaOdasProxy(targetUrl) {
  const response = await fetch(getOdasProxyEndpoint(targetUrl), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`ODAS-Proxy-Fehler: HTTP ${response.status}`);
  }

  const proxyData = await response.json();
  if (!proxyData || typeof proxyData.content !== "string") {
    throw new Error("ODAS-Proxy-Antwort enthält keinen content-String.");
  }

  return proxyData.content;
}

async function fetchOdasResource(targetUrl, configdata = {}) {
  if (isOdasProxyEnabled(configdata)) {
    return fetchViaOdasProxy(targetUrl);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  } catch (error) {
    throw new Error(
      `Direkter Datenabruf fehlgeschlagen (${error.message}). Bitte prüfen Sie die Daten-URL und die CORS-Freigabe der Datenquelle.`,
    );
  }
}

async function fetchOdasJson(targetUrl, configdata = {}) {
  const rawContent = await fetchOdasResource(targetUrl, configdata);
  try {
    return JSON.parse(rawContent);
  } catch (_error) {
    throw new Error(
      `Die konfigurierte Daten-URL liefert kein JSON, sondern ${describeNonJsonPayload(rawContent)}. ` +
        "Bitte in der Instanzkonfiguration den API-Endpunkt der Datenquelle eintragen, " +
        "nicht den Datensatz- oder Download-Link.",
    );
  }
}

function describeNonJsonPayload(rawContent) {
  const text = String(rawContent == null ? "" : rawContent).trim();
  if (!text) return "eine leere Antwort";
  if (text.startsWith("<")) return "eine HTML-Seite";
  const firstLine = text.split(/\r?\n/, 1)[0];
  if (/[,;]/.test(firstLine)) return "eine CSV- oder Textdatei";
  return "unlesbaren Inhalt";
}

/*
 * Template-Hook (oda-generic 1.4.0). Die Base ruft ihn vor dem Rendern der neuen
 * Seite auf. Diese App haelt eine Leaflet-Karte mit MarkerCluster-Layer und
 * Marker-Referenzen; der Hook entfernt die Karte (raeumt dabei den
 * markerClusterGroup-Layer mit ab), leert die Marker-Referenzen und macht
 * späte Async-Renders durch das disposed-Flag wirkungslos.
 */
function onPageLeave(page) {
  brunnenInstances.forEach((state, container) => {
    state.disposed = true;
    if (state.map) {
      try {
        state.map.remove();
      } catch (error) {
        console.warn("Fehler beim Entfernen der Leaflet-Karte:", error);
      }
      state.map = null;
    }
    state.markerLayer = null;
    state.markersByKey.clear();
    brunnenInstances.delete(container);
  });
}

function app(configdata = {}, enclosingHtmlDivElement) {
  const brUid = "i" + ++brInstanzZaehler;
  // Instanzkennung: brUid ("i" + N) und rootId ("brunnenkarte-" + N) teilen
  // sich denselben Zählerstand N — damit bleibt die Root-ID je Instanz monoton
  // eindeutig (ersetzt Date.now(), das bei zwei Renders im selben ms kollidiert).
  const rootId = "brunnenkarte-" + brInstanzZaehler;
  const state = {
    config: configdata || {},
    rootId,
    uid: brUid,
    map: null,
    markerLayer: null,
    markersByKey: new Map(),
    allRecords: [],
    filteredRecords: [],
    loadErrors: [],
    skippedRecords: 0,
    sourceSummaries: [],
    leafletReady: false,
    suppressMapMove: false,
    currentPage: 1,
    pageSize: 15,
    sortField: "name",
    sortDirection: "asc",
    disposed: false,
    loadToken: 0,
  };

  brunnenInstances.set(enclosingHtmlDivElement, state);

  if (!parseDataSources(configdata.apiurls).length) {
    enclosingHtmlDivElement.innerHTML =
      '<div class="alert alert-info" role="alert">Es ist keine Datenquelle konfiguriert.</div>';
    return null;
  }

  enclosingHtmlDivElement.innerHTML = renderLayout(rootId, configdata, brUid);
  bindUiEvents(enclosingHtmlDivElement, state);
  initializeApp(state);
  return null;
}

async function initializeApp(state) {
  // Monotoner Lade-Token (F-70): jeder Aufruf (initialer Load, "Aktualisieren"-Klick)
  // erhoeht den Token und vergleicht ihn nach dem Warten auf async Arbeit erneut mit
  // state.loadToken. Ueberholte, noch laufende Aufrufe erkennen so, dass ein neuerer
  // Aufruf inzwischen gestartet wurde, und verwerfen ihr (jetzt veraltetes) Ergebnis
  // still, statt es ueber den zwischenzeitlich aktuellen Stand zu schreiben.
  const token = ++state.loadToken;
  state.loadErrors = [];
  setBusy(state, true, "Datenquellen und Kartenbibliotheken werden geladen...");

  const leafletTask = loadLeaflet()
    .then(() => {
      if (state.loadToken !== token) return;
      state.leafletReady = true;
    })
    .catch((error) => {
      if (state.loadToken !== token) return;
      state.loadErrors.push({
        label: "Leaflet",
        message: error.message,
      });
    });

  const dataTask = fetchAllSources(state.config);
  const [dataResult] = await Promise.all([dataTask, leafletTask]);

  if (state.disposed || state.loadToken !== token) return;

  state.allRecords = dataResult.records;
  state.loadErrors.push(...dataResult.errors);
  state.skippedRecords = dataResult.skippedRecords;
  state.sourceSummaries = dataResult.sourceSummaries;

  populateFilterOptions(state);
  renderAlerts(state);
  applyFilters(state, { fitMap: true });
  setBusy(state, false);
}

function renderLayout(rootId, configdata = {}, uid) {
  const title = escapeHtml(configdata.titel || "Brunnenkarte");
  const dataUrl = escapeAttribute(
    safeUrl(configdata.urlDaten) || "https://opendata.stuttgart.de/dataset/brunnen",
  );

  return `
    <div class="brunnen-app" id="${rootId}">
      <section class="brunnen-intro mb-4">
        <div>
          <p class="brunnen-eyebrow mb-1">OpenData@Stuttgart</p>
          <h2 class="h3 mb-2">${title}</h2>
          <p class="mb-0 text-secondary">
            Interaktive Übersicht der Brunnen, Trinkwasserbrunnen und Mineralwasserbrunnen in Stuttgart.
          </p>
        </div>
        <div class="brunnen-intro-actions">
          <a class="btn btn-outline-primary btn-sm" href="${dataUrl}" target="_blank" rel="noopener">
            Datenquelle
          </a>
          <button class="btn btn-primary btn-sm" type="button" data-action="refresh">
            Aktualisieren
          </button>
        </div>
      </section>

      <div class="brunnen-status mb-3" id="${rootId}-status" role="status">
        Daten werden vorbereitet...
      </div>
      <div id="${rootId}-alerts"></div>

      <section class="row g-3 mb-3" id="${rootId}-kpis" aria-label="Kennzahlen"></section>

      <section class="brunnen-filter-band mb-3" aria-label="Filter">
        <div class="row g-2 align-items-end">
          <div class="col-12 col-lg-3">
            <label class="form-label" for="${rootId}-search">Suche</label>
            <input class="form-control" id="${rootId}-search" type="search" placeholder="Name, Lage, Amt..." autocomplete="off" />
          </div>
          <div class="col-12 col-sm-6 col-lg-2">
            <label class="form-label" for="${rootId}-type">Brunnenart</label>
            <select class="form-select" id="${rootId}-type">
              <option value="all">Alle</option>
              <option value="brunnen">Brunnen</option>
              <option value="trinkwasser">Trinkwasser</option>
              <option value="mineralwasser">Mineralwasser</option>
            </select>
          </div>
          <div class="col-12 col-sm-6 col-lg-2">
            <label class="form-label" for="${rootId}-district">Bezirk / Stadtteil</label>
            <select class="form-select" id="${rootId}-district">
              <option value="all">Alle</option>
            </select>
          </div>
          <div class="col-12 col-sm-6 col-lg-2">
            <label class="form-label" for="${rootId}-source">Datenquelle</label>
            <select class="form-select" id="${rootId}-source">
              <option value="all">Alle</option>
            </select>
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="brunnen-filter-actions">
              <div class="form-check">
                <input class="form-check-input" id="${rootId}-visible" type="checkbox" />
                <label class="form-check-label" for="${rootId}-visible">Nur Kartenausschnitt</label>
              </div>
              <button class="btn btn-outline-secondary btn-sm" type="button" data-action="reset">
                Zuruecksetzen
              </button>
              <button class="btn btn-outline-secondary btn-sm" type="button" data-action="export">
                CSV
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="row g-3 mb-4">
        <div class="col-12 col-xl-8">
          <div class="brunnen-map-shell">
            <div id="${rootId}-map" class="brunnen-map" aria-label="Karte der Brunnenstandorte"></div>
          </div>
        </div>
        <div class="col-12 col-xl-4">
          <div class="brunnen-chart-shell">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h3 class="h6 mb-0">Verteilung</h3>
              <span class="text-secondary small" id="${rootId}-chart-total">0 Standorte</span>
            </div>
            <div class="brunnen-chart-fallback" id="${rootId}-chart-fallback"></div>
          </div>
        </div>
      </section>

      <section class="brunnen-table-shell">
        <div class="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-2">
          <h3 class="h5 mb-0">Standorte</h3>
          <span class="text-secondary small" id="${rootId}-result-count">0 Ergebnisse</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle brunnen-table">
            <thead>
              <tr>
                <th scope="col"><button type="button" class="brunnen-sort" data-sort="name">Name</button></th>
                <th scope="col"><button type="button" class="brunnen-sort" data-sort="type">Typ</button></th>
                <th scope="col"><button type="button" class="brunnen-sort" data-sort="address">Lage</button></th>
                <th scope="col" class="d-none d-md-table-cell"><button type="button" class="brunnen-sort" data-sort="district">Bezirk</button></th>
                <th scope="col" class="text-end">Aktion</th>
              </tr>
            </thead>
            <tbody id="${rootId}-table-body"></tbody>
          </table>
        </div>
        <div class="brunnen-pagination" id="${rootId}-pagination"></div>
      </section>

      ${renderMethodikbox(configdata, uid)}
      ${renderWeitereInfos(configdata)}
    </div>
  `;
}

function renderMethodikbox(configdata = {}, uid) {
  const hinweis = String(configdata.datenquelleHinweis || "").trim();
  const stand = String(configdata.datenStand || "").trim();
  if (!hinweis && !stand) return "";
  const standHtml = stand
    ? `<p class="brunnen-methodik-stand">${escapeHtml(stand)}</p>`
    : "";
  return `
    <section class="brunnen-methodik mt-4">
      <button class="brunnen-methodik-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brunnen-methodik-body-${uid}" aria-expanded="false" aria-controls="brunnen-methodik-body-${uid}">
        <span class="h5 mb-0">Methodik &amp; Datenquelle</span>
        <span class="brunnen-methodik-chevron" aria-hidden="true">&#9662;</span>
      </button>
      <div id="brunnen-methodik-body-${uid}" class="collapse">
        <div class="brunnen-methodik-content">
          ${standHtml}
          ${hinweis}
        </div>
      </div>
    </section>
  `;
}

function renderWeitereInfos(configdata = {}) {
  const links = String(configdata.weiterfuehrendeLinks || "").trim();
  if (!links) return "";
  return `
    <section class="brunnen-weitere-infos mt-4">
      <h3 class="h5 mb-3">Weitere Informationen</h3>
      <div class="brunnen-weitere-infos-content">${links}</div>
    </section>
  `;
}

function bindUiEvents(container, state) {
  const root = getRoot(state);
  const search = root.querySelector(`#${state.rootId}-search`);
  const type = root.querySelector(`#${state.rootId}-type`);
  const district = root.querySelector(`#${state.rootId}-district`);
  const source = root.querySelector(`#${state.rootId}-source`);
  const visible = root.querySelector(`#${state.rootId}-visible`);

  const filterChanged = () => {
    state.currentPage = 1;
    applyFilters(state, { fitMap: true });
  };

  [search, type, district, source, visible].forEach((element) => {
    if (!element) return;
    element.addEventListener(
      element.type === "search" ? "input" : "change",
      filterChanged,
    );
  });

  container.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      const action = actionTarget.getAttribute("data-action");
      if (action === "reset") {
        resetFilters(state);
      } else if (action === "export") {
        exportCsv(state.filteredRecords);
      } else if (action === "refresh") {
        initializeApp(state);
      } else if (action === "focus") {
        focusRecord(state, actionTarget.getAttribute("data-key"));
      }
      return;
    }

    const sortTarget = event.target.closest("[data-sort]");
    if (sortTarget) {
      updateSort(state, sortTarget.getAttribute("data-sort"));
      renderTable(state);
      return;
    }

    const pageTarget = event.target.closest("[data-page]");
    if (pageTarget) {
      state.currentPage = Number(pageTarget.getAttribute("data-page")) || 1;
      renderTable(state);
    }
  });
}

async function fetchAllSources(configdata = {}) {
  const sources = parseDataSources(configdata.apiurls);
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        // Daten laden: direkt oder ueber den ODAS-Proxy (proxyAktiv)
        const text = await fetchOdasResource(source.url, configdata);
        const parsed = parsePayload(text, source);
        const features = extractFeatures(parsed);
        let skipped = 0;
        const records = features
          .map((feature, index) => normalizeRecord(feature, source, index))
          .filter((record) => {
            if (
              !record ||
              !Number.isFinite(record.lat) ||
              !Number.isFinite(record.lng)
            ) {
              skipped += 1;
              return false;
            }
            return true;
          });

        return {
          source,
          records,
          skipped,
          error: null,
          totalFeatures:
            parsed.totalFeatures || parsed.numberMatched || features.length,
        };
      } catch (error) {
        return {
          source,
          records: [],
          skipped: 0,
          error,
          totalFeatures: 0,
        };
      }
    }),
  );

  const errors = [];
  const records = [];
  let skippedRecords = 0;
  const sourceSummaries = [];

  results.forEach((result) => {
    if (result.error) {
      errors.push({
        label: result.source.label,
        message: result.error.message,
      });
    }
    skippedRecords += result.skipped;
    records.push(...result.records);
    sourceSummaries.push({
      label: result.source.label,
      count: result.records.length,
      totalFeatures: result.totalFeatures,
      failed: Boolean(result.error),
    });
  });

  return {
    records: dedupeRecords(records),
    errors,
    skippedRecords,
    sourceSummaries,
  };
}

/**
 * configdata.apiurls ist das Array-Feld (typ: "array") mit den drei
 * Brunnenkategorien. Jeder Eintrag ist bereits ein sauberes Objekt
 * { name, label, url } - keine JSON-String- oder Legacy-Objekt-Faelle
 * mehr zu behandeln (das fruehere dataSources-Markdown-Array ist entfallen).
 */
function parseDataSources(value) {
  const liste = Array.isArray(value) ? value : [];
  return liste.map(normalizeSource).filter(Boolean);
}

function normalizeSource(source) {
  if (!source || typeof source !== "object" || !source.url) {
    return null;
  }

  return {
    label: String(source.label || source.name || "Datenquelle").trim(),
    type: normalizeType(source.type || source.typ || source.name || source.label),
    url: String(source.url).trim(),
  };
}

function parsePayload(text, source) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${source.label}: Antwort ist kein JSON/GeoJSON`);
  }
}

function extractFeatures(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.features)) return payload.features;
  if (payload.result && Array.isArray(payload.result.records))
    return payload.result.records;
  if (Array.isArray(payload.records)) return payload.records;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function normalizeRecord(rawRecord, source, index) {
  const properties = rawRecord.properties || rawRecord.attributes || rawRecord;
  const geometry = rawRecord.geometry || properties.geometry || null;
  const coordinates = extractCoordinates(geometry, properties);
  const id = stringifyValue(
    rawRecord.id ||
      properties.ID ||
      properties.Id ||
      properties.id ||
      properties.OBJECTID ||
      properties.objectid ||
      `${source.label}-${index}`,
  );
  const name = firstText(properties, [
    "NAME",
    "Name",
    "name",
    "BEZEICHNUNG",
    "bezeichnung",
    "BEZEICHNUNG_STANDORT",
    "standort",
  ]);
  const address = firstText(properties, [
    "BEZEICHNUNG_STANDORT",
    "ADRESSE",
    "Adresse",
    "adresse",
    "LAGE",
    "lage",
    "STANDORT",
    "standort",
  ]);
  const district = firstText(properties, [
    "STADTBEZIRK",
    "stadtbezirk",
    "BEZIRK",
    "bezirk",
    "STADTTEIL",
    "stadtteil",
    "QUARTIER",
    "quartier",
  ]);
  const status = firstText(properties, [
    "STATUS",
    "status",
    "ZUSTAND",
    "zustand",
  ]);
  const operator = firstText(properties, [
    "UNTERHALTUNG",
    "unterhaltung",
    "BETREIBER",
    "betreiber",
    "ZUSTAENDIG",
    "zustaendig",
  ]);
  const type = inferRecordType(properties, source);
  const fallbackName = address || getTypeMeta(type).label;
  const sourceLabel = String(source.label || "Datenquelle");

  return {
    id,
    dedupeKey: createDedupeKey(id, coordinates, name || address),
    name: name || fallbackName,
    type,
    typeLabel: getTypeMeta(type).label,
    district,
    address,
    status,
    operator,
    sourceLabel,
    sourceLabels: [sourceLabel],
    lat: coordinates ? coordinates.lat : null,
    lng: coordinates ? coordinates.lng : null,
    raw: properties,
  };
}

function extractCoordinates(geometry, properties) {
  if (geometry && geometry.type && Array.isArray(geometry.coordinates)) {
    const pair = findCoordinatePair(geometry.coordinates);
    if (pair) {
      return normalizeCoordinatePair(pair);
    }
  }

  const lat = Number(
    firstText(properties, ["lat", "latitude", "LAT", "Y", "y"]),
  );
  const lng = Number(
    firstText(properties, ["lng", "lon", "longitude", "LON", "X", "x"]),
  );
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  return null;
}

function findCoordinatePair(value) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const pair = findCoordinatePair(item);
      if (pair) return pair;
    }
  }

  return null;
}

function normalizeCoordinatePair(pair) {
  const first = Number(pair[0]);
  const second = Number(pair[1]);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;

  const lng = first;
  const lat = second;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

function inferRecordType(properties, source) {
  const sourceType = normalizeType(source.type);
  const typeText = [
    source.type,
    source.label,
    properties.ANLAGENART,
    properties.KATEGORIE,
    properties.TYP,
    properties.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const drinkingWaterText = stringifyValue(
    properties.TRINKWASSER,
  ).toLowerCase();
  const positiveDrinkingWater =
    drinkingWaterText.includes("trinkwasser") &&
    !/(kein|keine|nicht|nein|no)\s+trinkwasser/.test(drinkingWaterText);

  if (typeText.includes("mineral") || drinkingWaterText.includes("mineral")) {
    return "mineralwasser";
  }
  if (typeText.includes("trink") || positiveDrinkingWater) {
    return "trinkwasser";
  }
  return sourceType || "brunnen";
}

function normalizeType(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("mineral")) return "mineralwasser";
  if (normalized.includes("trink")) return "trinkwasser";
  if (normalized.includes("brunnen")) return "brunnen";
  return ["brunnen", "trinkwasser", "mineralwasser"].includes(normalized)
    ? normalized
    : "brunnen";
}

function dedupeRecords(records) {
  const byKey = new Map();
  records.forEach((record) => {
    if (!record || !record.dedupeKey) return;
    const existing = byKey.get(record.dedupeKey);
    if (!existing) {
      byKey.set(record.dedupeKey, {
        ...record,
        sourceLabels: [...record.sourceLabels],
      });
      return;
    }

    const merged = mergeRecords(existing, record);
    byKey.set(record.dedupeKey, merged);
  });

  return [...byKey.values()].sort((a, b) => compareText(a.name, b.name));
}

function mergeRecords(existing, incoming) {
  const preferred =
    typePriority(incoming.type) >= typePriority(existing.type)
      ? incoming
      : existing;
  const secondary = preferred === incoming ? existing : incoming;
  const sourceLabels = [
    ...new Set([
      ...(existing.sourceLabels || []),
      ...(incoming.sourceLabels || []),
    ]),
  ];

  return {
    ...secondary,
    ...preferred,
    name: preferred.name || secondary.name,
    address: preferred.address || secondary.address,
    district: preferred.district || secondary.district,
    status: preferred.status || secondary.status,
    operator: preferred.operator || secondary.operator,
    sourceLabel: sourceLabels[0],
    sourceLabels,
  };
}

function typePriority(type) {
  return (
    {
      brunnen: 1,
      trinkwasser: 2,
      mineralwasser: 3,
    }[type] || 0
  );
}

function createDedupeKey(id, coordinates, label) {
  const idToken = String(id || "").match(/(\d+)(?!.*\d)/);
  if (idToken) return idToken[1];
  if (coordinates) {
    return `${coordinates.lat.toFixed(5)}:${coordinates.lng.toFixed(5)}:${slugify(label || "")}`;
  }
  return slugify(`${id}-${label}`);
}

function filterRecords(records, filters = {}) {
  const search = normalizeSearch(filters.search);
  const type = filters.type && filters.type !== "all" ? filters.type : "";
  const district =
    filters.district && filters.district !== "all" ? filters.district : "";
  const source =
    filters.source && filters.source !== "all" ? filters.source : "";

  return records.filter((record) => {
    if (type && record.type !== type) return false;
    if (district && record.district !== district) return false;
    if (source && !(record.sourceLabels || []).includes(source)) return false;
    if (search && !getSearchBlob(record).includes(search)) return false;
    if (filters.visibleOnly && filters.bounds) {
      return filters.bounds.contains({ lat: record.lat, lng: record.lng });
    }
    return true;
  });
}

function applyFilters(state, options = {}) {
  const filters = readFilters(state);
  state.filteredRecords = filterRecords(state.allRecords, filters);
  renderKpis(state);
  renderMap(state, options);
  renderChart(state);
  renderTable(state);
  updateStatus(state);
}

function readFilters(state) {
  const root = getRoot(state);
  const visibleOnly =
    root.querySelector(`#${state.rootId}-visible`)?.checked || false;
  const bounds = visibleOnly && state.map ? state.map.getBounds() : null;

  return {
    search: root.querySelector(`#${state.rootId}-search`)?.value || "",
    type: root.querySelector(`#${state.rootId}-type`)?.value || "all",
    district: root.querySelector(`#${state.rootId}-district`)?.value || "all",
    source: root.querySelector(`#${state.rootId}-source`)?.value || "all",
    visibleOnly,
    bounds,
  };
}

function resetFilters(state) {
  const root = getRoot(state);
  root.querySelector(`#${state.rootId}-search`).value = "";
  root.querySelector(`#${state.rootId}-type`).value = "all";
  root.querySelector(`#${state.rootId}-district`).value = "all";
  root.querySelector(`#${state.rootId}-source`).value = "all";
  root.querySelector(`#${state.rootId}-visible`).checked = false;
  state.currentPage = 1;
  applyFilters(state, { fitMap: true });
}

function populateFilterOptions(state) {
  const root = getRoot(state);
  const districtSelect = root.querySelector(`#${state.rootId}-district`);
  const sourceSelect = root.querySelector(`#${state.rootId}-source`);

  setSelectOptions(
    districtSelect,
    [
      "all",
      ...uniqueSorted(
        state.allRecords.map((record) => record.district).filter(Boolean),
      ),
    ],
    "Alle",
  );
  setSelectOptions(
    sourceSelect,
    [
      "all",
      ...uniqueSorted(
        state.allRecords.flatMap((record) => record.sourceLabels || []),
      ),
    ],
    "Alle",
  );
}

function setSelectOptions(select, values, allLabel) {
  const current = select.value || "all";
  select.innerHTML = values
    .map((value) => {
      const label = value === "all" ? allLabel : value;
      return `<option value="${escapeAttribute(value)}">${escapeHtml(label)}</option>`;
    })
    .join("");
  select.value = values.includes(current) ? current : "all";
}

function renderKpis(state) {
  const counts = countByType(state.filteredRecords);
  const total = state.filteredRecords.length;
  const drinkingShare =
    total > 0 ? Math.round((counts.trinkwasser / total) * 100) : 0;
  const cfg = state.config || {};
  const kpis = [
    {
      label: "Alle Brunnen",
      value: formatNumber(total),
      note: `${formatNumber(state.allRecords.length)} geladen`,
      type: "total",
      kontext: cfg.kpiKontext1,
    },
    {
      label: "Trinkwasser",
      value: formatNumber(counts.trinkwasser),
      note: `${drinkingShare} % der Auswahl`,
      type: "trinkwasser",
      kontext: cfg.kpiKontext2,
    },
    {
      label: "Mineralwasser",
      value: formatNumber(counts.mineralwasser),
      note: "Mineralbrunnen im Betrieb",
      type: "mineralwasser",
      kontext: cfg.kpiKontext3,
    },
    {
      label: "Sonstige",
      value: formatNumber(counts.brunnen),
      note: "Weitere Brunnenanlagen",
      type: "brunnen",
      kontext: cfg.kpiKontext4,
    },
  ];

  getRoot(state).querySelector(`#${state.rootId}-kpis`).innerHTML = kpis
    .map((kpi, idx) => {
      const n = idx + 1;
      const kontext = String(kpi.kontext || "").trim();
      const kontextHtml = kontext
        ? (
          '<button class="brunnen-kpi-info-toggle collapsed" type="button" ' +
          'data-bs-toggle="collapse" data-bs-target="#brunnen-kpi-kontext-' + n + '-' + state.uid + '" ' +
          'aria-expanded="false" aria-controls="brunnen-kpi-kontext-' + n + '-' + state.uid + '" ' +
          'aria-label="Erklärung zu diesem Wert">' +
          '<span class="brunnen-kpi-info-icon" aria-hidden="true">ⓘ</span>' +
          '</button>' +
          '<div id="brunnen-kpi-kontext-' + n + '-' + state.uid + '" class="collapse">' +
          '<div class="brunnen-kpi-kontext">' + escapeHtml(kontext) + '</div>' +
          '</div>'
        )
        : "";
      return `
        <div class="col-12 col-sm-6 col-xl-3">
          <article class="brunnen-kpi brunnen-kpi-${kpi.type}">
            <span>${escapeHtml(kpi.label)}</span>
            <strong>${escapeHtml(kpi.value)}</strong>
            <small>${escapeHtml(kpi.note)}</small>
            ${kontextHtml}
          </article>
        </div>
      `;
    })
    .join("");
}

function renderMap(state, options = {}) {
  const root = getRoot(state);
  const mapElement = root.querySelector(`#${state.rootId}-map`);
  if (!state.leafletReady || !window.L || !mapElement) {
    mapElement.innerHTML =
      '<div class="brunnen-map-message">Karte konnte nicht geladen werden.</div>';
    return;
  }

  if (!state.map) {
    state.map = window.L.map(mapElement, getMapOptions()).setView(
      [48.7758, 9.1829],
      12,
    );

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(state.map);

    state.markerLayer = window.L.markerClusterGroup
      ? window.L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 48,
        })
      : window.L.layerGroup();
    state.markerLayer.addTo(state.map);

    state.map.on("moveend", () => {
      const visible = root.querySelector(`#${state.rootId}-visible`)?.checked;
      if (visible && !state.suppressMapMove) {
        applyFilters(state, { fitMap: false });
      }
    });
  }

  state.markerLayer.clearLayers();
  state.markersByKey.clear();

  const bounds = [];
  state.filteredRecords.forEach((record) => {
    const marker = window.L.marker([record.lat, record.lng], {
      icon: createMarkerIcon(record.type),
      title: record.name,
    }).bindPopup(renderPopup(record));

    marker.on("click", () => highlightTableRow(state, record.dedupeKey));
    state.markerLayer.addLayer(marker);
    state.markersByKey.set(record.dedupeKey, marker);
    bounds.push([record.lat, record.lng]);
  });

  if (options.fitMap && bounds.length) {
    state.suppressMapMove = true;
    state.map.fitBounds(window.L.latLngBounds(bounds), {
      padding: [24, 24],
      maxZoom: 16,
    });
    setTimeout(() => {
      state.suppressMapMove = false;
    }, 350);
  } else if (options.fitMap && !bounds.length) {
    state.map.setView([48.7758, 9.1829], 12);
  }
}

function createMarkerIcon(type) {
  const meta = getTypeMeta(type);
  return window.L.divIcon({
    className: `brunnen-marker ${meta.markerClass}`,
    html: "<span></span>",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function renderPopup(record) {
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(record.lat)}&mlon=${encodeURIComponent(record.lng)}#map=18/${encodeURIComponent(record.lat)}/${encodeURIComponent(record.lng)}`;
  return `
    <div class="brunnen-popup">
      <strong>${escapeHtml(record.name)}</strong>
      <dl class="mb-2">
        <dt>Typ</dt><dd>${escapeHtml(record.typeLabel)}</dd>
        <dt>Lage</dt><dd>${escapeHtml(record.address || "Keine Angabe")}</dd>
        <dt>Bezirk</dt><dd>${escapeHtml(record.district || "Keine Angabe")}</dd>
        <dt>Status</dt><dd>${escapeHtml(record.status || "Keine Angabe")}</dd>
        <dt>Quelle</dt><dd>${escapeHtml((record.sourceLabels || [record.sourceLabel]).join(", "))}</dd>
      </dl>
      <a href="${mapsUrl}" target="_blank" rel="noopener">In OpenStreetMap oeffnen</a>
    </div>
  `;
}

function renderChart(state) {
  const root = getRoot(state);
  const totalElement = root.querySelector(`#${state.rootId}-chart-total`);
  const fallback = root.querySelector(`#${state.rootId}-chart-fallback`);
  totalElement.textContent = `${formatNumber(state.filteredRecords.length)} Standorte`;
  fallback.innerHTML = getChartSegments(state.filteredRecords)
    .map(
      (segment) => `
        <div class="brunnen-chart-row">
          <span><i style="background:${segment.color}"></i>${escapeHtml(segment.label)}</span>
          <strong>${formatNumber(segment.count)}</strong>
          <div class="brunnen-chart-bar" aria-hidden="true">
            <b style="width:${segment.percent}% ; background:${segment.color}"></b>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTable(state) {
  const root = getRoot(state);
  const sorted = [...state.filteredRecords].sort((a, b) =>
    compareRecords(a, b, state),
  );
  const maxPage = Math.max(1, Math.ceil(sorted.length / state.pageSize));
  state.currentPage = Math.min(state.currentPage, maxPage);
  const start = (state.currentPage - 1) * state.pageSize;
  const pageRecords = sorted.slice(start, start + state.pageSize);

  root.querySelector(`#${state.rootId}-result-count`).textContent =
    `${formatNumber(sorted.length)} Ergebnisse`;
  root.querySelector(`#${state.rootId}-table-body`).innerHTML =
    pageRecords.length
      ? pageRecords.map(renderTableRow).join("")
      : `
      <tr>
        <td colspan="5">
          <div class="brunnen-empty">Keine Brunnen fuer diese Filterkombination gefunden.</div>
        </td>
      </tr>
    `;

  renderPagination(state, maxPage);
}

function renderTableRow(record) {
  return `
    <tr data-row-key="${escapeAttribute(record.dedupeKey)}">
      <td>
        <strong>${escapeHtml(record.name)}</strong>
        <div class="text-secondary small">${escapeHtml(record.status || "Status unbekannt")}</div>
      </td>
      <td><span class="brunnen-type-pill brunnen-type-${record.type}">${escapeHtml(record.typeLabel)}</span></td>
      <td>${escapeHtml(record.address || "Keine Angabe")}</td>
      <td class="d-none d-md-table-cell">${escapeHtml(record.district || "Keine Angabe")}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" type="button" data-action="focus" data-key="${escapeAttribute(record.dedupeKey)}">
          Karte
        </button>
      </td>
    </tr>
  `;
}

function renderPagination(state, maxPage) {
  const pagination = getRoot(state).querySelector(
    `#${state.rootId}-pagination`,
  );
  if (maxPage <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const pages = createPageWindow(state.currentPage, maxPage);
  pagination.innerHTML = `
    <button class="btn btn-sm btn-outline-secondary" type="button" data-page="${Math.max(1, state.currentPage - 1)}" ${state.currentPage === 1 ? "disabled" : ""}>Zurueck</button>
    ${pages
      .map(
        (page) => `
          <button class="btn btn-sm ${page === state.currentPage ? "btn-primary" : "btn-outline-secondary"}" type="button" data-page="${page}">
            ${page}
          </button>
        `,
      )
      .join("")}
    <button class="btn btn-sm btn-outline-secondary" type="button" data-page="${Math.min(maxPage, state.currentPage + 1)}" ${state.currentPage === maxPage ? "disabled" : ""}>Weiter</button>
  `;
}

function createPageWindow(current, maxPage) {
  const start = Math.max(1, current - 2);
  const end = Math.min(maxPage, start + 4);
  const pages = [];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
}

function focusRecord(state, key) {
  const marker = state.markersByKey.get(key);
  const record = state.filteredRecords.find((item) => item.dedupeKey === key);
  if (!marker || !record || !state.map) return;

  state.map.setView(
    [record.lat, record.lng],
    Math.max(state.map.getZoom(), 16),
  );
  marker.openPopup();
  highlightTableRow(state, key);
}

function highlightTableRow(state, key) {
  const root = getRoot(state);
  root.querySelectorAll("[data-row-key]").forEach((row) => {
    row.classList.toggle(
      "brunnen-row-active",
      row.getAttribute("data-row-key") === key,
    );
  });
}

function updateSort(state, field) {
  if (state.sortField === field) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortField = field;
    state.sortDirection = "asc";
  }
}

function compareRecords(a, b, state) {
  const direction = state.sortDirection === "asc" ? 1 : -1;
  const field = state.sortField;
  if (field === "type") {
    return direction * compareText(a.typeLabel, b.typeLabel);
  }
  return direction * compareText(a[field] || "", b[field] || "");
}

function renderAlerts(state) {
  const root = getRoot(state);
  const alertElement = root.querySelector(`#${state.rootId}-alerts`);
  const alerts = [];

  if (state.loadErrors.length) {
    alerts.push(`
      <div class="alert alert-warning" role="alert">
        <strong>Einige Datenquellen konnten nicht geladen werden.</strong>
        ${state.loadErrors.map((error) => `${escapeHtml(error.label)}: ${escapeHtml(error.message)}`).join("<br>")}
      </div>
    `);
  }

  if (state.skippedRecords > 0) {
    alerts.push(`
      <div class="alert alert-info" role="alert">
        ${formatNumber(state.skippedRecords)} Datensaetze ohne verwertbare Koordinaten wurden ausgelassen.
      </div>
    `);
  }

  alertElement.innerHTML = alerts.join("");
}

function updateStatus(state) {
  const loaded = state.sourceSummaries
    .map((source) => `${source.label}: ${formatNumber(source.count)}`)
    .join(" | ");
  const summary = loaded || "Keine Daten geladen";
  getRoot(state).querySelector(`#${state.rootId}-status`).textContent =
    `${summary} | App-Version ${BRUNNEN_APP_VERSION}`;
}

function setBusy(state, busy, text = "") {
  const root = getRoot(state);
  const status = root?.querySelector(`#${state.rootId}-status`);
  if (!status) return;
  status.classList.toggle("brunnen-status-loading", busy);
  if (text) status.textContent = text;
}

function exportCsv(records) {
  const rows = [
    [
      "Name",
      "Typ",
      "Lage",
      "Bezirk",
      "Status",
      "Quelle",
      "Latitude",
      "Longitude",
    ],
    ...records.map((record) => [
      record.name,
      record.typeLabel,
      record.address,
      record.district,
      record.status,
      (record.sourceLabels || []).join("; "),
      record.lat,
      record.lng,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "brunnenkarte.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function loadLeaflet() {
  return Promise.all([
    loadStylesheetOnce(
      "leaflet-css",
      "vendor/leaflet/leaflet.css",
    ),
    loadScriptOnce(
      "leaflet-js",
      "vendor/leaflet/leaflet.js",
      () => window.L,
    ),
  ]).then(() =>
    Promise.all([
      loadStylesheetOnce(
        "leaflet-markercluster-css",
        "vendor/markercluster/MarkerCluster.css",
      ),
      loadStylesheetOnce(
        "leaflet-markercluster-default-css",
        "vendor/markercluster/MarkerCluster.Default.css",
      ),
      loadScriptOnce(
        "leaflet-markercluster-js",
        "vendor/markercluster/leaflet.markercluster.js",
        () => window.L && window.L.markerClusterGroup,
      ),
    ]),
  );
}

function loadStylesheetOnce(id, href) {
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = () =>
      reject(new Error(`Stylesheet konnte nicht geladen werden: ${href}`));
    document.head.appendChild(link);
  });
}

function loadScriptOnce(id, src, readyCheck) {
  if (readyCheck && readyCheck()) return Promise.resolve();
  if (document.getElementById(id)) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id);
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Skript konnte nicht geladen werden: ${src}`)),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Skript konnte nicht geladen werden: ${src}`));
    document.head.appendChild(script);
  });
}

function countByType(records) {
  return records.reduce(
    (counts, record) => {
      counts[record.type] = (counts[record.type] || 0) + 1;
      return counts;
    },
    { brunnen: 0, trinkwasser: 0, mineralwasser: 0 },
  );
}

function getMapOptions() {
  return {
    scrollWheelZoom: false,
    zoomControl: true,
    preferCanvas: true,
  };
}

function getChartSegments(records) {
  const counts = countByType(records);
  const total = Math.max(1, records.length);
  return ["brunnen", "trinkwasser", "mineralwasser"].map((key) => {
    const meta = getTypeMeta(key);
    const count = counts[key] || 0;
    return {
      key,
      label: meta.shortLabel,
      color: meta.color,
      count,
      percent: Math.round((count / total) * 100),
    };
  });
}

function firstText(source, keys) {
  for (const key of keys) {
    const value = source ? source[key] : undefined;
    const text = stringifyValue(value);
    if (text) return text;
  }
  return "";
}

function stringifyValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function getSearchBlob(record) {
  return normalizeSearch(
    [
      record.name,
      record.typeLabel,
      record.address,
      record.district,
      record.status,
      record.operator,
      record.sourceLabel,
      ...(record.sourceLabels || []),
    ].join(" "),
  );
}

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value) {
  return normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueSorted(values) {
  return [...new Set(values)].sort(compareText);
}

function compareText(a, b) {
  return String(a || "").localeCompare(String(b || ""), "de", {
    sensitivity: "base",
    numeric: true,
  });
}

function getTypeMeta(type) {
  return BRUNNEN_TYPE_META[type] || BRUNNEN_TYPE_META.brunnen;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE").format(value || 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

// Laesst nur http- und https-URLs durch. Maskierung allein reicht hier nicht:
// eine javascript:-URL aus der Instanz-Konfiguration bliebe sonst ausfuehrbar.
function safeUrl(value = "") {
  try {
    const url = new URL(String(value), window.location.href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function getRoot(state) {
  return document.getElementById(state.rootId);
}

function addToHead() {
  return;
}

if (
  typeof globalThis !== "undefined" &&
  globalThis.__BRUNNENKARTE_ENABLE_TEST_API__
) {
  globalThis.__brunnenkarteTestApi = {
    parseDataSources,
    normalizeRecord,
    dedupeRecords,
    filterRecords,
    getMapOptions,
    getChartSegments,
  };
}
