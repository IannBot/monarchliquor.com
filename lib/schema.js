// JSON-LD graph builder. Pure function of site data + page front matter.
// Every page's structured data is generated here so facts can never drift
// between pages: addresses, hours, and phones come from business.js only.
//
// Page front matter declares intent via `schema`, e.g.
//   schema:
//     org: basic | founding | contact      # Organization node variant
//     stores: true                         # both LiquorStore nodes, url = this page
//     contactPage: { name, description }
//     webPage: { name, description, publisher: true, organization: true }
//     collectionPage: { name, description }
//     faqs: [delivery]                     # FAQPage from faqs.js groups
//     article: true                        # Article from page front matter
//     breadcrumbs: [{ name, url }, ...]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function absolute(site, path) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return site.url.replace(/\/$/, "") + path;
}

function logoObject(site) {
  return { "@type": "ImageObject", url: absolute(site, site.logo) };
}

export function organization(site, business, variant = "basic") {
  const node = {
    "@type": "Organization",
    name: business.name,
    url: site.url + "/",
    logo: absolute(site, site.logo),
  };
  if (variant === "founding") node.foundingDate = String(business.foundingYear);
  if (variant === "contact") {
    node.email = business.email;
    node.telephone = business.phone.display;
  }
  node.sameAs = [business.social.facebook, business.social.instagram];
  return node;
}

export function openingHours(hours) {
  // Group consecutive days with identical open/close into one spec, matching
  // the hand-written output (Mon-Sat as a single OpeningHoursSpecification).
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

export function liquorStore(site, business, store, pageUrl) {
  return {
    "@type": "LiquorStore",
    name: store.name,
    image: absolute(site, site.defaultImage),
    url: pageUrl,
    telephone: store.phone.display,
    email: store.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address.street,
      addressLocality: store.address.locality,
      addressRegion: store.address.region,
      postalCode: store.address.postalCode,
      addressCountry: store.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: store.geo.lat, longitude: store.geo.lng },
    openingHoursSpecification: openingHours(business.hours),
    areaServed: store.areaServed,
    priceRange: business.priceRange,
  };
}

export function faqPage(faqs, groups) {
  const items = groups.flatMap((g) => faqs[g] || []);
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
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
    headline: page.headline || page.title,
    description: page.summary || page.description,
    image: absolute(site, page.image),
    url: page.url,
    datePublished: page.datePublished,
    dateModified: page.dateModified || page.datePublished,
    author: { "@type": "Organization", name: business.name },
    publisher: { "@type": "Organization", name: business.name, url: site.url + "/", logo: logoObject(site) },
  };
}

export function buildGraph({ site, business, faqs, page, schema }) {
  if (!schema) return null;
  const graph = [];
  const pageUrl = absolute(site, page.url);

  if (schema.org) graph.push(organization(site, business, schema.org === true ? "basic" : schema.org));

  if (schema.contactPage) {
    graph.push({ "@type": "ContactPage", name: schema.contactPage.name, url: pageUrl, description: schema.contactPage.description });
  }

  if (schema.webPage) {
    const wp = { "@type": "WebPage", name: schema.webPage.name, url: pageUrl, description: schema.webPage.description };
    if (schema.webPage.publisher) {
      wp.publisher = { "@type": "Organization", name: business.name, url: site.url + "/", logo: absolute(site, site.logo) };
    }
    graph.push(wp);
  }

  if (schema.collectionPage) {
    graph.push({
      "@type": "CollectionPage",
      name: schema.collectionPage.name,
      url: pageUrl,
      description: schema.collectionPage.description,
      publisher: { "@type": "Organization", name: business.name, url: site.url + "/", logo: logoObject(site) },
    });
  }

  if (schema.faqs) graph.push(faqPage(faqs, schema.faqs));

  if (schema.article) graph.push(article(site, business, { ...page, url: pageUrl }));

  if (schema.orgAfter) graph.push(organization(site, business, schema.orgAfter === true ? "basic" : schema.orgAfter));

  if (schema.stores) business.stores.forEach((s) => graph.push(liquorStore(site, business, s, pageUrl)));

  if (schema.breadcrumbs) graph.push(breadcrumbs(site, schema.breadcrumbs));

  return { "@context": "https://schema.org", "@graph": graph };
}
