import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildGraph, openingHours } from "./schema.js";
import site from "../src/_data/site.js";
import business from "../src/_data/business.js";
import faqs from "../src/_data/faqs.js";

const snapshot = JSON.parse(fs.readFileSync(new URL("./__snapshots__/delivery.jsonld.json", import.meta.url), "utf8"));

test("delivery page JSON-LD matches the pre-migration snapshot", () => {
  const graph = buildGraph({
    site, business, faqs,
    page: { url: "/delivery.html" },
    schema: { faqs: ["delivery"], stores: true },
  });
  assert.deepEqual(graph, snapshot);
});

test("opening hours collapse identical consecutive days and omit closed days", () => {
  const spec = openingHours(business.hours);
  assert.equal(spec["@type"], "OpeningHoursSpecification");
  assert.deepEqual(spec.dayOfWeek, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  assert.equal(spec.opens, "10:00");
  assert.equal(spec.closes, "21:00");
});

test("pages without a schema declaration emit no JSON-LD", () => {
  assert.equal(buildGraph({ site, business, faqs, page: { url: "/x.html" }, schema: undefined }), null);
});
