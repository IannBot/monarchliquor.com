// Google Analytics 4 with outbound-intent events. Loads only when the page
// carries data-ga4 (set from site.ga4Id). Events: order_click (BottleCapps),
// call_click (tel:), directions_click (maps), email_click (mailto:).
(function () {
  var id = document.documentElement.getAttribute("data-ga4");
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var placement = a.getAttribute("data-cta") || "unlabeled";
    var common = { placement: placement, page_path: location.pathname, link_text: (a.textContent || "").trim().slice(0, 60) };

    if (a.classList.contains("shop-link") || href.indexOf("bottlecapps.com") !== -1) {
      gtag("event", "order_click", common);
    } else if (href.indexOf("tel:") === 0) {
      gtag("event", "call_click", common);
    } else if (href.indexOf("mailto:") === 0) {
      gtag("event", "email_click", common);
    } else if (href.indexOf("maps.google") !== -1 || href.indexOf("google.com/maps") !== -1) {
      gtag("event", "directions_click", common);
    }
  }, { passive: true });
})();
