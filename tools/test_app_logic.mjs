import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app/app.js", import.meta.url), "utf8");
const sandbox = {
  console,
  URL,
  __BRUNNENKARTE_ENABLE_TEST_API__: true,
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "app/app.js" });

const api = sandbox.__brunnenkarteTestApi;
assert.ok(api, "test api should be exposed when explicitly enabled");

const {
  parseDataSources,
  normalizeRecord,
  dedupeRecords,
  filterRecords,
  getMapOptions,
  getChartSegments,
} = api;

const wfsSource = {
  label: "Brunnen in Betrieb",
  type: "brunnen",
  url: "https://example.test/wfs?service=WFS",
};

const trinkwasserFeature = {
  type: "Feature",
  id: "A62_BRU_BRUNNEN_Brunnen_in_Betr_EPSG25832.346383",
  geometry: {
    type: "Point",
    coordinates: [9.179, 48.7763],
  },
  properties: {
    NAME: "Ceresbrunnen",
    BEZEICHNUNG_STANDORT: "Dorotheenstrasse 4",
    ANLAGENART: "Trinkwasserbrunnen",
    TRINKWASSER: "Trinkwasser",
    STATUS: "in Betrieb",
    UNTERHALTUNG: "Tiefbauamt",
  },
};

const parsedSources = parseDataSources(JSON.stringify([wfsSource]));
assert.equal(parsedSources.length, 1);
assert.equal(parsedSources[0].label, "Brunnen in Betrieb");

const normalized = normalizeRecord(trinkwasserFeature, wfsSource, 0);
assert.equal(normalized.id, "A62_BRU_BRUNNEN_Brunnen_in_Betr_EPSG25832.346383");
assert.equal(normalized.name, "Ceresbrunnen");
assert.equal(normalized.type, "trinkwasser");
assert.equal(normalized.address, "Dorotheenstrasse 4");
assert.equal(normalized.status, "in Betrieb");
assert.equal(normalized.operator, "Tiefbauamt");
assert.equal(normalized.lat, 48.7763);
assert.equal(normalized.lng, 9.179);
assert.equal(normalized.dedupeKey, "346383");

const nonDrinking = normalizeRecord(
  {
    type: "Feature",
    id: "A62_BRU_BRUNNEN_Brunnen_in_Betr_EPSG25832.346083",
    geometry: {
      type: "Point",
      coordinates: [9.1999, 48.8432],
    },
    properties: {
      NAME: "Flurbrunnen",
      BEZEICHNUNG_STANDORT: "Blankensteinstrasse",
      ANLAGENART: "Wasserspiel",
      TRINKWASSER: "kein Trinkwasser",
      STATUS: "in Betrieb",
    },
  },
  wfsSource,
  1,
);
assert.equal(nonDrinking.type, "brunnen");

const specialSource = {
  label: "Trinkwasserbrunnen im Betrieb",
  type: "trinkwasser",
  url: "https://example.test/wfs?service=WFS&typeName=trinkwasser",
};
const special = normalizeRecord(
  {
    ...trinkwasserFeature,
    id: "A62_BRU_BRUNNEN_Trinkwasserbr_in_Betr_EPSG25832.346383",
  },
  specialSource,
  0,
);

const deduped = dedupeRecords([normalized, special]);
assert.equal(deduped.length, 1);
assert.equal(deduped[0].type, "trinkwasser");
assert.equal(
  JSON.stringify(deduped[0].sourceLabels),
  JSON.stringify(["Brunnen in Betrieb", "Trinkwasserbrunnen im Betrieb"]),
);

const records = [
  deduped[0],
  {
    ...normalized,
    id: "another",
    dedupeKey: "another",
    name: "Flurbrunnen",
    type: "brunnen",
    address: "Blankensteinstrasse",
    district: "Zuffenhausen",
    sourceLabel: "Brunnen in Betrieb",
    sourceLabels: ["Brunnen in Betrieb"],
    lat: 48.8432,
    lng: 9.1999,
  },
];

assert.equal(filterRecords(records, { type: "trinkwasser" }).length, 1);
assert.equal(filterRecords(records, { search: "flur" }).length, 1);
assert.equal(filterRecords(records, { district: "Zuffenhausen" }).length, 1);
assert.equal(
  filterRecords(records, {
    visibleOnly: true,
    bounds: {
      contains(point) {
        return point.lat === 48.7763 && point.lng === 9.179;
      },
    },
  }).length,
  1,
);

assert.equal(getMapOptions().scrollWheelZoom, false);

const chartSegments = getChartSegments(records);
assert.equal(
  JSON.stringify(chartSegments.map((segment) => [segment.key, segment.count])),
  JSON.stringify([
    ["brunnen", 1],
    ["trinkwasser", 1],
    ["mineralwasser", 0],
  ]),
);

console.log("app logic tests passed");
