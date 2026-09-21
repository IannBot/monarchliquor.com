import { test } from "node:test";
import assert from "node:assert/strict";
import { getStatus, weeklySummary, weeklyRows, fmt12, upcomingHolidays, statutoryHolidays } from "./hours.js";
import business from "../src/_data/business.js";

const TZ = business.timezone;
const hours = business.hours;
// Central Daylight Time is UTC-5. 2026-09-21 is a Monday, 2026-09-20 a Sunday.
const cdt = (iso, hhmm) => new Date(`${iso}T${hhmm}:00-05:00`);

test("open during Monday business hours", () => {
  const s = getStatus(hours, cdt("2026-09-21", "14:30"), TZ);
  assert.equal(s.isOpen, true);
  assert.equal(s.status, "Open now");
  assert.equal(s.detail, "closes 9pm");
  assert.equal(s.todayRange, "10am–9pm");
});

test("closed before opening shows today's opening time", () => {
  const s = getStatus(hours, cdt("2026-09-21", "08:00"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.status, "Closed");
  assert.equal(s.detail, "opens 10am today");
});

test("boundaries: opens at exactly 10:00, closed at exactly 21:00", () => {
  assert.equal(getStatus(hours, cdt("2026-09-21", "10:00"), TZ).isOpen, true);
  assert.equal(getStatus(hours, cdt("2026-09-21", "20:59"), TZ).isOpen, true);
  assert.equal(getStatus(hours, cdt("2026-09-21", "21:00"), TZ).isOpen, false);
});

test("after close on Saturday points to Monday (Sunday closed)", () => {
  const s = getStatus(hours, cdt("2026-09-19", "21:30"), TZ); // Saturday
  assert.equal(s.isOpen, false);
  assert.equal(s.detail, "opens 10am Monday");
});

test("Sunday is closed all day", () => {
  const s = getStatus(hours, cdt("2026-09-20", "12:00"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.status, "Closed");
  assert.equal(s.detail, "Sundays · opens 10am tomorrow");
  assert.equal(s.todayRange, "Closed");
});

test("holiday closure overrides weekly hours", () => {
  const h = { ...hours, holidays: [{ date: "2026-12-25", label: "Christmas Day", closed: true }] };
  const s = getStatus(h, cdt("2026-12-25", "12:00"), "America/Chicago"); // Friday, CST is -6 but noon is safe
  assert.equal(s.isOpen, false);
  assert.equal(s.status, "Closed");
  assert.equal(s.detail, "Christmas Day · opens 10am tomorrow");
});

test("holiday short hours are honored", () => {
  const h = { ...hours, holidays: [{ date: "2026-12-24", label: "Christmas Eve", open: "10:00", close: "18:00" }] };
  const s = getStatus(h, new Date("2026-12-24T17:00:00-06:00"), "America/Chicago");
  assert.equal(s.isOpen, true);
  assert.equal(s.detail, "closes 6pm");
  const later = getStatus(h, new Date("2026-12-24T18:30:00-06:00"), "America/Chicago");
  assert.equal(later.isOpen, false);
});

test("visitor time zone does not matter: 3am UTC Tuesday is 10pm Monday Central", () => {
  const s = getStatus(hours, new Date("2026-09-22T03:00:00Z"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.detail, "opens 10am tomorrow");
});

test("weekly summary and table rows", () => {
  assert.deepEqual(weeklySummary(hours), ["Mon–Sat 10am–9pm", "Sun Closed"]);
  const rows = weeklyRows(hours);
  assert.equal(rows[0].day, "Monday");
  assert.equal(rows[0].range, "10am–9pm");
  assert.equal(rows[6].day, "Sunday");
  assert.equal(rows[6].range, "Closed");
});

test("fmt12 formatting", () => {
  assert.equal(fmt12("10:00"), "10am");
  assert.equal(fmt12("21:00"), "9pm");
  assert.equal(fmt12("17:30"), "5:30pm");
  assert.equal(fmt12("00:00"), "12am");
  assert.equal(fmt12("12:00"), "12pm");
});

test("upcoming holidays window", () => {
  const h = { ...hours, holidays: [{ date: "2026-09-25", label: "Test", closed: true }, { date: "2026-11-26", label: "Far", closed: true }] };
  const up = upcomingHolidays(h, cdt("2026-09-21", "12:00"), TZ, 14);
  assert.deepEqual(up.map((x) => x.label), ["Test"]);
});

test("statutory Texas closures: Thanksgiving is the fourth Thursday; Sunday rule adds the Monday", () => {
  const h2026 = statutoryHolidays(2026);
  assert.deepEqual(h2026.map((x) => x.date), ["2026-01-01", "2026-11-26", "2026-12-25"]);
  const h2022 = statutoryHolidays(2022); // Christmas 2022 fell on a Sunday
  assert.ok(h2022.some((x) => x.date === "2022-12-26"));
  const h2023 = statutoryHolidays(2023); // New Year's Day 2023 fell on a Sunday
  assert.ok(h2023.some((x) => x.date === "2023-01-02"));
});

test("business data includes this year's statutory closures and the live status reflects them", () => {
  const year = new Date().getFullYear();
  assert.ok(business.hours.holidays.some((h) => h.date === `${year}-12-25` && h.closed));
  const s = getStatus(business.hours, new Date(`${year}-12-25T18:00:00Z`), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.status, "Closed");
  assert.equal(s.reason, "Christmas Day");
});
