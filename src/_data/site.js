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

  announcement: {
    enabled: true,
    href: "/delivery.html",
  },

  nav: {
    left: [
      { label: "HOME", href: "/" },
      { label: "ABOUT", href: "/about.html" },
      { label: "DELIVERY", href: "/delivery.html" },
    ],
    right: [
      { label: "GUIDES", href: "/guides/" },
      { label: "BARS &amp; RESTAURANTS", href: "/bars-restaurants.html" },
    ],
    mobile: [
      { label: "HOME", href: "/" },
      { label: "ABOUT", href: "/about.html" },
      { label: "DELIVERY", href: "/delivery.html" },
      { label: "GUIDES", href: "/guides/" },
      { label: "BARS &amp; RESTAURANTS", href: "/bars-restaurants.html" },
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
      { label: "Locations", href: "/about.html#locations" },
      { label: "Bars &amp; Restaurants", href: "/bars-restaurants.html" },
      { label: "Privacy Policy", href: "/privacy-policy.html" },
      { label: "FAQ", href: "/delivery.html#faq" },
    ],
  },
};
