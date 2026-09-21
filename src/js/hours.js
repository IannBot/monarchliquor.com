// Upgrades server-rendered hours text to a live open/closed status.
// Without JS the static "Mon–Sat 10am–9pm" text remains, so nothing breaks.
import { getStatus } from "/js/hours-core.js";

const dataEl = document.getElementById("business-hours");
if (dataEl) {
  const { hours, timezone } = JSON.parse(dataEl.textContent);

  function render() {
    const s = getStatus(hours, new Date(), timezone);
    document.querySelectorAll("[data-hours-status]").forEach((el) => {
      el.dataset.open = s.isOpen ? "true" : "false";
      const status = el.querySelector("[data-status]");
      const detail = el.querySelector("[data-detail]");
      if (status) status.textContent = s.status;
      if (detail) detail.textContent = s.detail;
      if (!status && !detail) el.textContent = s.detail ? `${s.status} · ${s.detail}` : s.status;
      el.classList.add("is-live");
    });
    // Highlight today's row in any hours table.
    const todayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][s.weekday];
    document.querySelectorAll("[data-hours-row]").forEach((row) => {
      row.classList.toggle("is-today", row.dataset.hoursRow === todayKey);
    });
  }

  render();
  setInterval(render, 60 * 1000);
}
