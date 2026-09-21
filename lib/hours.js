// Isomorphic store-hours engine. Runs at build time (Node) and in the browser
// (copied to /js/hours-core.js). No dependencies. All times are interpreted in
// the business time zone via Intl, so the result is correct for any visitor.
//
// hours shape (see src/_data/business.js):
//   { weekly: { mon: {open:"10:00", close:"21:00"}, ..., sun: null },
//     holidays: [{ date:"YYYY-MM-DD", label, closed:true } | { date, label, open, close }] }

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Break a Date into calendar parts in the given IANA time zone. */
export function localParts(date, timeZone) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false, weekday: "short",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  const p = {};
  for (const part of fmt.formatToParts(date)) p[part.type] = part.value;
  const hour = Number(p.hour) % 24;
  return {
    iso: `${p.year}-${p.month}-${p.day}`,
    weekday: DAY_SHORT.indexOf(p.weekday),
    minutes: hour * 60 + Number(p.minute),
  };
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "10:00" -> "10am", "21:00" -> "9pm", "17:30" -> "5:30pm" */
export function fmt12(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

/** Add n days to an ISO date string (calendar arithmetic, no time zones). */
function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return { iso: dt.toISOString().slice(0, 10), weekday: dt.getUTCDay() };
}

/** Hours in effect on a given calendar day: holiday override, else weekly. */
export function dayHours(hours, iso, weekday) {
  const holiday = (hours.holidays || []).find((h) => h.date === iso);
  if (holiday) {
    return holiday.closed
      ? { closed: true, label: holiday.label, holiday: true }
      : { open: holiday.open, close: holiday.close, label: holiday.label, holiday: true };
  }
  const w = hours.weekly[DAY_KEYS[weekday]];
  return w ? { open: w.open, close: w.close } : { closed: true };
}

/** Next day (today included if `fromToday`) with opening hours, up to 14 days out. */
export function nextOpening(hours, iso, weekday, fromToday) {
  for (let n = fromToday ? 0 : 1; n <= 14; n++) {
    const day = addDays(iso, n);
    const h = dayHours(hours, day.iso, day.weekday);
    if (!h.closed) return { offset: n, weekday: day.weekday, open: h.open };
  }
  return null;
}

function whenLabel(offset, weekday) {
  if (offset === 0) return "today";
  if (offset === 1) return "tomorrow";
  return DAY_NAMES[weekday];
}

/**
 * Live status for the business hours at `now`.
 * Returns { isOpen, status, detail, todayRange, today }.
 *   status: "Open now" | "Closed" | "Closed today" | "Closed for <holiday>"
 *   detail: "closes 9pm" | "opens 10am today" | "opens 10am tomorrow" | "opens 10am Monday"
 */
export function getStatus(hours, now = new Date(), timeZone = "America/Chicago") {
  const { iso, weekday, minutes } = localParts(now, timeZone);
  const today = dayHours(hours, iso, weekday);
  const todayRange = today.closed ? "Closed" : `${fmt12(today.open)}–${fmt12(today.close)}`;
  const base = { todayRange, today, weekday, iso };

  if (!today.closed) {
    const open = toMinutes(today.open), close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { ...base, isOpen: true, status: "Open now", detail: `closes ${fmt12(today.close)}` };
    }
    if (minutes < open) {
      return { ...base, isOpen: false, status: "Closed", detail: `opens ${fmt12(today.open)} today` };
    }
  }

  const next = nextOpening(hours, iso, weekday, false);
  const detail = next ? `opens ${fmt12(next.open)} ${whenLabel(next.offset, next.weekday)}` : "";
  let status = "Closed";
  if (today.closed && today.holiday) status = `Closed for ${today.label}`;
  else if (today.closed) status = `Closed today`;
  return { ...base, isOpen: false, status, detail };
}

/** "Mon–Sat 10am–9pm" style summary of the weekly schedule. */
export function weeklySummary(hours) {
  const groups = [];
  for (let i = 1; i <= 7; i++) {
    const wd = i % 7; // mon..sun
    const w = hours.weekly[DAY_KEYS[wd]];
    const key = w ? `${w.open}-${w.close}` : "closed";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(wd);
    else groups.push({ key, days: [wd], w });
  }
  return groups.map((g) => {
    const days = g.days.length > 1 ? `${DAY_SHORT[g.days[0]]}–${DAY_SHORT[g.days[g.days.length - 1]]}` : DAY_SHORT[g.days[0]];
    return g.w ? `${days} ${fmt12(g.w.open)}–${fmt12(g.w.close)}` : `${days} Closed`;
  });
}

/** Rows for an hours table: [{ day: "Monday", key: "mon", range: "10am–9pm" | "Closed" }] */
export function weeklyRows(hours) {
  return [1, 2, 3, 4, 5, 6, 0].map((wd) => {
    const w = hours.weekly[DAY_KEYS[wd]];
    return { day: DAY_NAMES[wd], key: DAY_KEYS[wd], weekday: wd, range: w ? `${fmt12(w.open)}–${fmt12(w.close)}` : "Closed" };
  });
}

/** Holidays within the next `days` days from `now` (for notices). */
export function upcomingHolidays(hours, now = new Date(), timeZone = "America/Chicago", days = 14) {
  const { iso } = localParts(now, timeZone);
  const end = addDays(iso, days).iso;
  return (hours.holidays || []).filter((h) => h.date >= iso && h.date <= end);
}
