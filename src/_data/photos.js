// Photo manifest. The owner is supplying new photos; until each arrives the
// template renders the listed stand-in and marks it data-placeholder so the
// build can count what is still missing.
//
// To replace a placeholder: drop the original in images-src/, add it to the
// IMAGES table in scripts/optimize-images.mjs, run `npm run images`, then set
// `placeholder: false` and point src/webp at the generated files.

export default {
  "east-storefront": {
    neededShot: "East Austin storefront exterior showing the giant Monarch sign at E. MLK Jr. Blvd and Chicon St.",
    usedOn: ["/east-austin.html hero", "homepage store card"],
    ratio: "16:9, at least 1920px wide",
    src: "/images/scotch-bottles-1080.jpg", webp: "/images/scotch-bottles-1080.webp",
    width: 1080, height: 1350,
    alt: "Monarch Liquor East Austin storefront",
    placeholder: true,
  },
  "east-interior": {
    neededShot: "East Austin interior: shelves of local spirits and specialty drinks.",
    usedOn: ["/east-austin.html"],
    ratio: "4:5, at least 1080px wide",
    src: "/images/scotch-bottles-720.jpg", webp: "/images/scotch-bottles-720.webp",
    width: 720, height: 900,
    alt: "Inside Monarch Liquor East Austin",
    placeholder: true,
  },
  "lakeway-storefront": {
    neededShot: "Lakeway storefront exterior on RR 620 N, next to Don Mario Mexican Restaurant.",
    usedOn: ["/lakeway.html hero", "homepage store card"],
    ratio: "16:9, at least 1920px wide",
    src: "/images/titos-bottles-1080.jpg", webp: "/images/titos-bottles-1080.webp",
    width: 1080, height: 1350,
    alt: "Monarch Liquor Lakeway storefront",
    placeholder: true,
  },
  "lakeway-beer-cave": {
    neededShot: "Lakeway walk-in beer cave and the 17-door cooler wall.",
    usedOn: ["/lakeway.html"],
    ratio: "4:5, at least 1080px wide",
    src: "/images/titos-bottles-720.jpg", webp: "/images/titos-bottles-720.webp",
    width: 720, height: 900,
    alt: "Beer cave at Monarch Liquor Lakeway",
    placeholder: true,
  },
  "staff-team": {
    neededShot: "Staff behind the counter or in the aisles (either store).",
    usedOn: ["/about.html", "/careers.html"],
    ratio: "3:2, at least 1600px wide",
    src: "/images/wines-display-1280.jpg", webp: "/images/wines-display-1280.webp",
    width: 1280, height: 720,
    alt: "The Monarch Liquor team",
    placeholder: true,
  },
  "delivery-driver": {
    neededShot: "Monarch driver or van handing an order at a customer's door.",
    usedOn: ["/delivery.html", "homepage"],
    ratio: "3:2, at least 1600px wide",
    src: "/images/champagne-toast-1280.jpg", webp: "/images/champagne-toast-1280.webp",
    width: 1280, height: 720,
    alt: "Monarch Liquor delivery at the door",
    placeholder: true,
  },
  "owners": {
    neededShot: "The father-and-son owners in the East Austin store.",
    usedOn: ["/about.html"],
    ratio: "1:1, at least 800px",
    src: "/images/about-photo-700.jpg", webp: "/images/about-photo-700.webp",
    width: 700, height: 700,
    alt: "The owners of Monarch Liquor",
    placeholder: true,
  },
  "hero-wide": {
    neededShot: "Wide hero: storefront at golden hour or a full shelf shot, 2400x1350 or larger.",
    usedOn: ["homepage hero"],
    ratio: "16:9, at least 2400px wide",
    src: "/images/hero-banner-1920.jpg", webp: "/images/hero-banner-1920.webp",
    width: 1920, height: 1080,
    alt: "Monarch Liquor",
    placeholder: true,
  },
};
