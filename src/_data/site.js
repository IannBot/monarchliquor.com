// Site-wide settings. Business facts (addresses, hours, phones) live in business.js.
export default {
  url: "https://monarchliquor.com",
  name: "Monarch Liquor",
  logo: "/images/logo-512.png",
  defaultImage: "/images/hero-banner-1280.jpg",
  themeColor: "#212f56",

  // Google Analytics 4 measurement ID (G-XXXXXXXXXX). Empty string disables analytics entirely.
  ga4Id: "",

  // Online ordering (BottleCapps). Category URLs are filled in when the owner supplies them.
  bottlecapps: {
    home: "https://monarchliquor.bottlecapps.com/",
    categories: { spirits: null, wine: null, beer: null },
  },

  // Third-party delivery apps. OWNER TODO: paste each store listing URL; badges
  // render as plain (non-link) badges until a url is set. Icons are the
  // owner-supplied brand symbols in src/images/marketplaces/.
  marketplaces: [
    { id: "ubereats", name: "Uber Eats", url: null, logo: "/images/marketplaces/ubereats.png" },
    { id: "doordash", name: "DoorDash", url: null, logo: "/images/marketplaces/doordash.png" },
    { id: "grubhub", name: "Grubhub", url: null, logo: "/images/marketplaces/grubhub.png" },
    { id: "instacart", name: "Instacart", url: null, logo: "/images/marketplaces/instacart.svg" },
  ],

  announcement: {
    enabled: true,
    href: "/delivery.html",
  },

  nav: {
    left: [
      { label: "HOME", href: "/" },
      { label: "DELIVERY", href: "/delivery.html" },
      { label: "LOCATIONS", href: "/#visit" },
    ],
    right: [
      { label: "GUIDES", href: "/guides/" },
      { label: "ABOUT", href: "/about.html" },
    ],
    mobile: [
      { label: "HOME", href: "/" },
      { label: "DELIVERY", href: "/delivery.html" },
      { label: "EAST AUSTIN STORE", href: "/east-austin.html" },
      { label: "LAKEWAY STORE", href: "/lakeway.html" },
      { label: "ABOUT", href: "/about.html" },
      { label: "GUIDES", href: "/guides/" },
      { label: "BARS &amp; RESTAURANTS", href: "/bars-restaurants.html" },
      { label: "FAQ", href: "/faq.html" },
      { label: "CONTACT", href: "/contact.html" },
      { label: "CAREERS", href: "/careers.html" },
    ],
    footer: [
      { label: "HOME", href: "/" },
      { label: "ABOUT", href: "/about.html" },
      { label: "DELIVERY", href: "/delivery.html" },
      { label: "GUIDES", href: "/guides/" },
      { label: "CONTACT", href: "/contact.html" },
    ],
    footerSub: [
      { label: "Careers", href: "/careers.html" },
      { label: "East Austin Store", href: "/east-austin.html" },
      { label: "Lakeway Store", href: "/lakeway.html" },
      { label: "Bars &amp; Restaurants", href: "/bars-restaurants.html" },
      { label: "Privacy Policy", href: "/privacy-policy.html" },
      { label: "FAQ", href: "/faq.html" },
    ],
  },
};
