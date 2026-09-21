import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGraph, openingHours, specialOpeningHours } from "./schema.js";
import site from "../src/_data/site.js";
import business from "../src/_data/business.js";
import faqs from "../src/_data/faqs.js";
import delivery from "../src/_data/delivery.js";

const byType = (graph, type) => graph["@graph"].filter((n) => n["@type"] === type);

test("every schema page carries Organization, WebSite and WebPage with stable @ids", () => {
  const g = buildGraph({ site, business, faqs, delivery, page: { url: "/about.html", title: "About" }, schema: {} });
  const org = byType(g, "Organization")[0];
  const web = byType(g, "WebSite")[0];
  const page = byType(g, "WebPage")[0];
  assert.equal(org["@id"], "https://monarchliquor.com/#org");
  assert.equal(web["@id"], "https://monarchliquor.com/#website");
  assert.equal(page["@id"], "https://monarchliquor.com/about.html");
  assert.equal(page.isPartOf["@id"], web["@id"]);
  assert.deepEqual(org.sameAs, [business.social.facebook, business.social.instagram]);
});

test("LiquorStore nodes come from business.js with E.164 phones and OrderAction", () => {
  const g = buildGraph({ site, business, faqs, delivery, page: { url: "/" }, schema: { stores: true } });
  const stores = byType(g, "LiquorStore");
  assert.equal(stores.length, 2);
  const east = stores.find((s) => s["@id"].includes("east-austin"));
  assert.equal(east.url, "https://monarchliquor.com/east-austin.html");
  assert.equal(east.telephone, "+15126144949");
  assert.equal(east.address.streetAddress, "1902 E. Martin Luther King Jr. Blvd");
  assert.equal(east.address.postalCode, "78702");
  assert.equal(east.potentialAction["@type"], "OrderAction");
  assert.equal(east.potentialAction.target.urlTemplate, site.bottlecapps.home);
  assert.equal(east.parentOrganization["@id"], "https://monarchliquor.com/#org");
});

test("a store page marks its store as the main entity", () => {
  const g = buildGraph({ site, business, faqs, delivery, page: { url: "/lakeway.html", title: "Lakeway" }, schema: { store: "lakeway" } });
  const page = byType(g, "WebPage")[0];
  assert.equal(page.mainEntity["@id"], "https://monarchliquor.com/lakeway.html#store");
  assert.equal(byType(g, "LiquorStore").length, 1);
});

test("opening hours collapse identical consecutive days and omit closed days", () => {
  const spec = openingHours(business.hours);
  assert.equal(spec["@type"], "OpeningHoursSpecification");
  assert.deepEqual(spec.dayOfWeek, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  assert.equal(spec.opens, "10:00");
  assert.equal(spec.closes, "21:00");
});

test("holidays become specialOpeningHoursSpecification", () => {
  const hours = { ...business.hours, holidays: [{ date: "2026-12-25", label: "Christmas Day", closed: true }, { date: "2026-12-24", label: "Eve", open: "10:00", close: "18:00" }] };
  const special = specialOpeningHours(hours);
  assert.equal(special.length, 2);
  assert.equal(special[0].opens, "00:00");
  assert.equal(special[1].closes, "18:00");
  const g = buildGraph({ site, business: { ...business, hours }, faqs, delivery, page: { url: "/" }, schema: { stores: true } });
  assert.equal(byType(g, "LiquorStore")[0].specialOpeningHoursSpecification.length, 2);
});

test("FAQPage text matches faqs.js and honors the confirmed-terms guard", () => {
  const unconfirmed = { ...delivery, terms: { ...delivery.terms, fee: { ...delivery.terms.fee, confirmed: false } } };
  const g = buildGraph({ site, business, faqs, delivery: unconfirmed, page: { url: "/delivery.html" }, schema: { faqs: ["delivery"] } });
  const faq = byType(g, "FAQPage")[0];
  assert.equal(faq.mainEntity.length, faqs.delivery.length);
  const cost = faq.mainEntity.find((q) => q.name === "How much does delivery cost?");
  assert.equal(cost.acceptedAnswer.text, delivery.terms.fee.fallback);
  assert.ok(!cost.acceptedAnswer.text.includes("$5,"));

  const confirmed = { ...delivery, terms: { ...delivery.terms, fee: { ...delivery.terms.fee, confirmed: true } } };
  const g2 = buildGraph({ site, business, faqs, delivery: confirmed, page: { url: "/delivery.html" }, schema: { faqs: ["delivery"] } });
  const cost2 = byType(g2, "FAQPage")[0].mainEntity.find((q) => q.name === "How much does delivery cost?");
  assert.ok(cost2.acceptedAnswer.text.includes("$5"));
});

test("Recipe nodes are built from page front matter", () => {
  const page = {
    url: "/guides/x.html", title: "X", image: "/images/champagne-toast-1280.jpg",
    recipes: [{ name: "Ranch Water", description: "d", ingredients: ["2 oz tequila"], steps: ["Build over ice"] }],
  };
  const g = buildGraph({ site, business, faqs, delivery, page, schema: { recipes: true } });
  const r = byType(g, "Recipe")[0];
  assert.equal(r.name, "Ranch Water");
  assert.equal(r.recipeInstructions[0]["@type"], "HowToStep");
  assert.equal(r.image, "https://monarchliquor.com/images/champagne-toast-1280.jpg");
});

test("pages without a schema declaration emit no JSON-LD", () => {
  assert.equal(buildGraph({ site, business, faqs, delivery, page: { url: "/x.html" }, schema: undefined }), null);
});
