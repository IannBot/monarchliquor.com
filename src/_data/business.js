// Single source of truth for business facts: name, addresses, phones, hours, links.
// Every template and every JSON-LD block reads from here. Edit facts here only.
//
// OWNER TODO markers indicate values still to be confirmed or supplied.

import { statutoryHolidays } from "../../lib/hours.js";

const SHARED_PHONE = { display: "(512) 614-4949", tel: "+15126144949", href: "tel:5126144949" };

// Statutory Texas closures for this year and next, plus any manual overrides.
function mergeHolidays(manual) {
  const year = new Date().getFullYear();
  const auto = [...statutoryHolidays(year), ...statutoryHolidays(year + 1)];
  const byDate = new Map(auto.map((h) => [h.date, h]));
  for (const h of manual) byDate.set(h.date, h);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export default {
  name: "Monarch Liquor",
  legalName: "Monarch Liquor",
  foundingYear: 2020,
  timezone: "America/Chicago",
  priceRange: "$",
  paymentAccepted: "Cash, Credit Card, Debit Card", // OWNER TODO: confirm
  description:
    "Family-owned liquor store in East Austin and Lakeway. Specialty spirits, curated wines, and eclectic beer. In-store, delivery, and curbside. Est. 2020.",

  phone: SHARED_PHONE,
  email: "Retail@monarchliquor.com",
  careersEmail: "monarch.liquor.atx@gmail.com",

  social: {
    facebook: "https://www.facebook.com/MonarchLiquor",
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
    holidayNote: "Open every holiday except Sundays, Thanksgiving Day, Christmas Day, and New Year's Day.",
    // Holiday overrides. OWNER TODO: supply the coming year's holiday hours.
    // Shape: { date: "2026-12-25", label: "Christmas Day", closed: true }
    //     or { date: "2026-12-24", label: "Christmas Eve", open: "10:00", close: "18:00" }
    // Manual entries here override the automatic ones for the same date.
    holidays: mergeHolidays([
      // e.g. { date: "2026-12-24", label: "Christmas Eve", open: "10:00", close: "18:00" },
    ]),
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
      url: "/east-austin.html",
      neighborhood: "East Austin",
      tagline: "The O.G. store at MLK and Chicon",
      blurb:
        "The O.G. store in the heart of East Austin. You can't miss the giant sign towering over MLK and Chicon, and you probably know our neighbors: JuiceLand, Austin Daily Press, and The Wheel! The store may seem small, but we pack in a lot of local products, specialty drinks, and seasonal favorites. You'll definitely find your new favorite drink here.",
      landmarks:
        "At the corner of E. Martin Luther King Jr. Blvd and Chicon St. Look for the giant Monarch sign. We're next to JuiceLand, Austin Daily Press, and The Wheel.",
      parking: null, // OWNER TODO: e.g. "Free parking in the lot out front."
      highlights: ["Local Texas spirits and craft beer", "Specialty and seasonal drinks", "Curbside pickup out front"],
      photos: { hero: "east-storefront", interior: "east-interior" },
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
      phone: { display: "(512) 300-0065", tel: "+15123000065", href: "tel:5123000065" },
      email: "Monarch.liquor.atx@gmail.com",
      areaServed: ["Lakeway", "West Austin", "Steiner Ranch", "Lake Travis"],
      directionsUrl: "https://maps.google.com/?q=1700+RR+620+107B+Austin+TX",
      // OWNER TODO: replace with the Lakeway Google review link (needs the listing's Place ID).
      reviewUrl:
        "https://www.google.com/maps/search/?api=1&query=Monarch+Liquor+1700+Ranch+Road+620+N+107B+Austin+TX+78734",
      mapEmbedUrl:
        "https://www.google.com/maps?q=1700+Ranch+Road+620+N+107B+Austin+TX+78734&output=embed",
      url: "/lakeway.html",
      neighborhood: "Lakeway",
      tagline: "Our biggest store, near Lake Travis",
      blurb:
        "Technically in Austin and teetering on the edge of Lakeway, our second location boasts huge quantities of spirits, wines, and beers – especially with a 17 door cooler and built-in beer cave! Conveniently located near Lake Travis, this is where you go to get the best deals in West Austin and Lakeway. We're right next to Don Mario Mexican Restaurant.",
      landmarks:
        "On Ranch Road 620 N near Lake Travis, in the same center as Don Mario Mexican Restaurant (suite 107B).",
      parking: null, // OWNER TODO
      highlights: ["17-door beer cooler", "Walk-in beer cave", "Huge spirits and wine selection"],
      photos: { hero: "lakeway-storefront", interior: "lakeway-beer-cave" },
    },
  ],
};
