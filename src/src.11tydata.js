import { buildGraph, absolute } from "../lib/schema.js";

export default {
  layout: "layouts/base.njk",
  date: "git Last Modified",
  ogType: "website",
  twitterCard: "summary_large_image",
  eleventyComputed: {
    // Keep every existing URL: /index.html, /about.html, /guides/index.html, ...
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const stem = data.page.filePathStem; // e.g. "/about", "/guides/index"
      return `${stem}.html`;
    },
    canonical: (data) => {
      const url = data.page.url.replace(/index\.html$/, "");
      return absolute(data.site, url);
    },
    ogTitle: (data) => data.ogTitle || data.title,
    ogDescription: (data) => data.ogDescription || data.description,
    ogImage: (data) => absolute(data.site, data.image || data.site.defaultImage),
    twitterTitle: (data) => data.twitterTitle || data.ogTitle || data.title,
    twitterDescription: (data) => data.twitterDescription || data.ogDescription || data.description,
    jsonld: (data) =>
      buildGraph({
        site: data.site,
        business: data.business,
        faqs: data.faqs,
        page: {
          url: data.page.url.replace(/index\.html$/, ""),
          title: data.title,
          headline: data.headline,
          description: data.description,
          summary: data.summary,
          image: data.image,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
        },
        schema: data.schema,
      }),
  },
};
