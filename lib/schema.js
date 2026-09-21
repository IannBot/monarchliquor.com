// JSON-LD graph builder. Pure function of site data + page front matter.
// Every page's structured data is generated here so facts can never drift
// between pages: addresses, hours, and phones come from business.js only.
//
// Every page with `schema` gets: Organization (#org), WebSite (#website),
// WebPage (this URL) and, when `schema.breadcrumbs` is set, BreadcrumbList.
// Page front matter then declares intent:
//   schema:
//     stores: true                         # both LiquorStore nodes
//     store: east-austin                   # this page IS the store's page
//     faqs: [delivery, hours]              # FAQPage from faqs.js groups
//     article: true                        # Article from page front matter
//     recipes: true                        # Recipe nodes from page.recipes
//     pageType: ContactPage | CollectionPage | AboutPage   (default WebPage)
//     breadcrumbs: [{ name, url }, ...]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function absolute(site, path) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return site.url.replace(/\/$/, "") + path;
}

const orgId = (site) => site.url + "/#org";
const siteId = (site) => site.url + "/#website";
const storeId = (site, store) => absolute(site, store.url) + "#store";

export function organization(site, business) {
  return {
    "@type": "Organization",
    "@id": orgId(site),
    name: business.name,
    legalName: business.legalName,
    url: site.url + "/",
    logo: { "@type": "ImageObject", url: absolute(site, site.logo) },
    image: absolute(site, site.defaultImage),
    description: business.description,
    foundingDate: String(business.foundingYear),
    email: business.email,
    telephone: business.phone.tel,
    sameAs: [business.social.facebook, business.social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phone.tel,
      contactType: "customer service",
      areaServed: "US-TX",
      availableLanguage: "English",
    },
  };
}

export function website(site, business) {
  return {
    "@type": "WebSite",
    "@id": siteId(site),
    url: site.url + "/",
    name: business.name,
    publisher: { "@id": orgId(site) },
    inLanguage: "en-US",
  };
}

export function openingHours(hours) {
  const specs = [];
  DAY_KEYS.forEach((key, i) => {
    const h = hours.weekly[key];
    if (!h) return;
    const last = specs[specs.length - 1];
    if (last && last.opens === h.open && last.closes === h.close) {
      last.dayOfWeek.push(DAYS[i]);
    } else {
      specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek: [DAYS[i]], opens: h.open, closes: h.close });
    }
  });
  return specs.length === 1 ? specs[0] : specs;
}

export function specialOpeningHours(hours) {
  return (hours.holidays || []).map((h) =>
    h.closed
      ? { "@type": "OpeningHoursSpecification", validFrom: h.date, validThrough: h.date, opens: "00:00", closes: "00:00" }
      : { "@type": "OpeningHoursSpecification", validFrom: h.date, validThrough: h.date, opens: h.open, closes: h.close }
  );
}

export function liquorStore(site, business, store, opts = {}) {
  const node = {
    "@type": "LiquorStore",
    "@id": storeId(site, store),
    name: store.name,
    image: absolute(site, opts.image || site.defaultImage),
    url: absolute(site, store.url),
    telephone: store.phone.tel,
    email: store.email,
    parentOrganization: { "@id": orgId(site) },
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address.street,
      addressLocality: store.address.locality,
      addressRegion: store.address.region,
      postalCode: store.address.postalCode,
      addressCountry: store.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: store.geo.lat, longitude: store.geo.lng },
    hasMap: store.directionsUrl,
    openingHoursSpecification: openingHours(business.hours),
    areaServed: store.areaServed.map((name) => ({ "@type": "Place", name })),
    priceRange: business.priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: business.paymentAccepted,
    potentialAction: {
      "@type": "OrderAction",
      target: { "@type": "EntryPoint", urlTemplate: site.bottlecapps.home, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
      deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModeOwnFleet", "http://purl.org/goodrelations/v1#DeliveryModePickUp"],
    },
  };
  const special = specialOpeningHours(business.hours);
  if (special.length) node.specialOpeningHoursSpecification = special;
  if (store.gbpUrl) node.sameAs = [store.gbpUrl];
  return node;
}

/** Answer text for a FAQ entry, honoring the delivery confirmed-terms guard. */
export function faqAnswer(f, delivery) {
  if (!delivery) return f.a;
  if (f.term) {
    const t = delivery.terms[f.term];
    if (t && !t.confirmed) return t.fallback;
  }
  if (f.zone) {
    const z = (delivery.zones || []).find((x) => x.storeId === f.zone);
    if (z && !z.confirmed) return delivery.zoneFallback;
  }
  return f.a;
}

export function faqPage(faqs, groups, delivery, pageUrl) {
  const items = groups.flatMap((g) => faqs[g] || []);
  return {
    "@type": "FAQPage",
    "@id": pageUrl + "#faq",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswer(f, delivery) },
    })),
  };
}

export function breadcrumbs(site, items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(site, it.url),
    })),
  };
}

export function article(site, business, page) {
  return {
    "@type": "Article",
    "@id": page.url + "#article",
    headline: page.headline || page.title,
    description: page.summary || page.description,
    image: absolute(site, page.image),
    url: page.url,
    mainEntityOfPage: page.url,
    datePublished: page.datePublished,
    dateModified: page.dateModified || page.datePublished,
    author: { "@id": orgId(site) },
    publisher: { "@id": orgId(site) },
    inLanguage: "en-US",
  };
}

export function recipes(site, page) {
  return (page.recipes || []).map((r) => ({
    "@type": "Recipe",
    name: r.name,
    description: r.description,
    image: absolute(site, r.image || page.image),
    author: { "@id": orgId(site) },
    recipeCategory: "Cocktail",
    recipeCuisine: r.cuisine || "American",
    recipeYield: r.yield || "1 cocktail",
    totalTime: r.time || "PT5M",
    recipeIngredient: r.ingredients,
    recipeInstructions: r.steps.map((text) => ({ "@type": "HowToStep", text })),
    keywords: r.keywords,
  }));
}

export function buildGraph({ site, business, faqs, delivery, page, schema }) {
  if (!schema) return null;
  const graph = [];
  const pageUrl = absolute(site, page.url);

  graph.push(organization(site, business));
  graph.push(website(site, business));

  const webPage = {
    "@type": schema.pageType || "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: schema.pageName || page.title,
    description: page.description,
    isPartOf: { "@id": siteId(site) },
    about: { "@id": orgId(site) },
    inLanguage: "en-US",
  };
  if (page.image) webPage.primaryImageOfPage = absolute(site, page.image);
  if (page.dateModified) webPage.dateModified = page.dateModified;
  if (schema.breadcrumbs) webPage.breadcrumb = { "@id": pageUrl + "#breadcrumb" };
  graph.push(webPage);

  if (schema.breadcrumbs) graph.push({ "@id": pageUrl + "#breadcrumb", ...breadcrumbs(site, schema.breadcrumbs) });

  if (schema.stores) business.stores.forEach((s) => graph.push(liquorStore(site, business, s)));

  if (schema.store) {
    const store = business.stores.find((s) => s.id === schema.store);
    if (!store) throw new Error(`schema.store: unknown store "${schema.store}"`);
    graph.push(liquorStore(site, business, store, { image: page.image }));
    webPage.mainEntity = { "@id": storeId(site, store) };
  }

  if (schema.faqs) graph.push(faqPage(faqs, schema.faqs, delivery, pageUrl));

  if (schema.article) graph.push(article(site, business, { ...page, url: pageUrl }));

  if (schema.recipes) recipes(site, page).forEach((r) => graph.push(r));

  return { "@context": "https://schema.org", "@graph": graph };
}
