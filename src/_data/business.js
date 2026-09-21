// Single source of truth for business facts: name, addresses, phones, hours, links.
// Every template and every JSON-LD block reads from here. Edit facts here only.
//
// OWNER TODO markers indicate values still to be confirmed or supplied.

const SHARED_PHONE = { display: "(512) 614-4949", tel: "+15126144949", href: "tel:5126144949" };

export default {
  name: "Monarch Liquor",
  legalName: "Monarch Liquor",
  foundingYear: 2020,
  timezone: "America/Chicago",
  priceRange: "$$",
  description:
    "Family-owned liquor store in East Austin and Lakeway. Specialty spirits, curated wines, and eclectic beer. In-store, delivery, and curbside. Est. 2020.",

  phone: SHARED_PHONE,
  email: "Retail@monarchliquor.com",
  careersEmail: "monarch.liquor.atx@gmail.com",

  social: {
    facebook: "https://www.facebook.com/monarchliquoratx",
    instagram: "https://www.instagram.com/monarchliquor/",
  },

  hours: {
    // 24h local time. null = closed all day.
    weekly: {
      mon: { open: "10:00", close: "21:00" },
      tue: { open: "10:00", close: "21:00" },
      wed: { open: "10:00", close: "21:00" },
      thu: { open: "10:00", close: "21:00" },
      fri: { open: "10:00", close: "21:00" },
      sat: { open: "10:00", close: "21:00" },
      sun: null,
    },
    sundayNote: "Closed Sundays (Texas law)",
    // Holiday overrides. OWNER TODO: supply the coming year's holiday hours.
    // Shape: { date: "2026-12-25", label: "Christmas Day", closed: true }
    //     or { date: "2026-12-24", label: "Christmas Eve", open: "10:00", close: "18:00" }
    holidays: [],
  },

  stores: [
    {
      id: "east-austin",
      name: "Monarch Liquor - East Austin",
      shortName: "East Austin",
      address: {
        street: "1902 E. Martin Luther King Jr. Blvd",
        streetShort: "1902 E. MLK Jr. Blvd",
        locality: "Austin",
        region: "TX",
        postalCode: "78702",
        country: "US",
      },
      geo: { lat: 30.2785, lng: -97.7196 },
      phone: SHARED_PHONE,
      email: "Retail@monarchliquor.com",
      areaServed: ["East Austin", "Austin", "Travis County"],
      directionsUrl: "https://maps.google.com/?q=1902+E+Martin+Luther+King+Jr+Blvd+Austin+TX+78702",
      reviewUrl: "https://g.page/monarchliquor/review",
      mapEmbedUrl:
        "https://www.google.com/maps?q=1902+E+Martin+Luther+King+Jr+Blvd+Austin+TX+78702&output=embed",
    },
    {
      id: "lakeway",
      name: "Monarch Liquor - Lakeway",
      shortName: "Lakeway",
      address: {
        street: "1700 Ranch Road 620 N #107B",
        streetShort: "1700 RR 620 N #107B",
        locality: "Austin",
        region: "TX",
        postalCode: "78734",
        country: "US",
      },
      geo: { lat: 30.3515, lng: -97.953 },
      // OWNER TODO: Lakeway has its own direct number; replace SHARED_PHONE when supplied.
      phone: SHARED_PHONE,
      email: "Monarch.liquor.atx@gmail.com",
      areaServed: ["Lakeway", "West Austin", "Steiner Ranch", "Lake Travis"],
      directionsUrl: "https://maps.google.com/?q=1700+RR+620+107B+Austin+TX",
      // OWNER TODO: replace with the Lakeway Google review link (needs the listing's Place ID).
      reviewUrl:
        "https://www.google.com/maps/search/?api=1&query=Monarch+Liquor+1700+Ranch+Road+620+N+107B+Austin+TX+78734",
      mapEmbedUrl:
        "https://www.google.com/maps?q=1700+Ranch+Road+620+N+107B+Austin+TX+78734&output=embed",
    },
  ],
};
