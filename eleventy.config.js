export default function (eleventyConfig) {
  // Static assets copied as-is.
  for (const p of ["src/css", "src/js", "src/images", "src/site.webmanifest", "src/CNAME", "src/.nojekyll"]) {
    eleventyConfig.addPassthroughCopy(p);
  }

  // Pretty JSON for the JSON-LD script tag.
  eleventyConfig.addFilter("jsonld", (value) => JSON.stringify(value, null, 2));

  // ISO date (YYYY-MM-DD) for sitemap lastmod.
  eleventyConfig.addFilter("date", (d) => {
    if (typeof d === "string") return d.slice(0, 10);
    return new Date(d).toISOString().slice(0, 10);
  });

  // Absolute URL helper for sitemap/OG.
  eleventyConfig.addFilter("abs", (path, site) => site.url.replace(/\/$/, "") + path);

  // Sitemap entries: HTML pages ordered by priority (desc), then by source order.
  eleventyConfig.addCollection("sitemap", (api) =>
    api.getAll()
      .filter((p) => p.outputPath && p.outputPath.endsWith(".html") && !p.data.noindex)
      .map((p, i) => ({ p, i, pr: parseFloat((p.data.sitemap && p.data.sitemap.priority) || "0.5") }))
      .sort((a, b) => b.pr - a.pr || a.i - b.i)
      .map((x) => x.p)
  );

  eleventyConfig.setServerOptions({ port: 8080, showAllHosts: false });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
