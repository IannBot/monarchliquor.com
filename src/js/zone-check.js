// Delivery zone checker: matches a ZIP or neighborhood against delivery.js zones.
(function () {
  var form = document.querySelector("[data-zone-checker]");
  var dataEl = document.getElementById("zone-data");
  if (!form || !dataEl) return;
  var zones = JSON.parse(dataEl.textContent);
  var names = { "east-austin": "East Austin", lakeway: "Lakeway" };
  var out = form.querySelector(".zone-checker__result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (form.q.value || "").trim().toLowerCase();
    if (!q) return;
    var hit = null;
    zones.forEach(function (z) {
      if (hit) return;
      var zipHit = (z.zips || []).some(function (zip) { return String(zip) === q; });
      var nameHit = (z.neighborhoods || []).some(function (n) { return n.toLowerCase() === q; });
      if (zipHit || nameHit) hit = z;
    });
    if (hit) {
      out.innerHTML = "Yes! Delivered from our <strong>" + (names[hit.storeId] || hit.storeId) + "</strong> store. " +
        '<a class="shop-link" data-cta="zone-checker" href="https://monarchliquor.bottlecapps.com/" target="_blank" rel="noopener">Start your order</a>.';
    } else {
      out.innerHTML = "We're not sure about that address yet. Call East Austin <a href=\"tel:5126144949\">(512) 614-4949</a> or Lakeway <a href=\"tel:5123000065\">(512) 300-0065</a> and we'll check.";
    }
  });
})();
