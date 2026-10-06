// ---- date-range-picker.js ------------------------------------------------------
// Show the month as static text (no dropdown) in every flatpickr calendar; only the year stays a control.
if (typeof flatpickr !== "undefined") {
  flatpickr.defaultConfig = flatpickr.defaultConfig || {};
  flatpickr.defaultConfig.monthSelectorType = "static";
}
(function () {
// Auto-wires a real Flatpickr range picker onto every "date range" trigger project-wide,
// without requiring each page to hand-write its own picker markup/JS.
//
// A trigger is any element that:
//   - has [data-daterange] explicitly, OR
//   - is a <button>/<input> containing an <i class="icon-calendar*"> icon whose visible
//     text looks like a date or date range (e.g. "Jul 1 – Jul 20, 2026", "Jul 2026").
//
// Excluded: elements already wired to something else (id="productsDateRange", the
// full calendar page, and native <input type="date">).

function looksLikeDateLabel(text) {
  const t = text.trim();
  if (!t) return false;
  const MONTHS = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
  return MONTHS.test(t);
}

// Below the sm breakpoint a 2-month grid (~600px) doesn't fit the viewport and
// flatpickr has no built-in way to shrink month count for space — it only
// repositions, so the second month was spilling off-screen on narrow layouts.
function monthsForViewport() {
  return window.innerWidth < 640 ? 1 : 2;
}

const instances = [];

// Shared with the other flatpickr range pickers in script.js (products list, .js-date-range
// inputs) so every range picker on the site collapses to one month below sm, not just the
// auto-wired ones, and all of them respond to the same resize listener below.
window.drpMonthsForViewport = monthsForViewport;
window.drpRegisterInstance = (fp) => instances.push(fp);

function formatRange(dates, fp) {
  if (!dates.length) return "";
  const opts = { month: "short", day: "numeric" };
  if (dates.length === 1) {
    return dates[0].toLocaleDateString("en-US", { ...opts, year: "numeric" });
  }
  const [start, end] = dates;
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return sameYear ? `${startStr} – ${endStr}` : `${start.toLocaleDateString("en-US", { ...opts, year: "numeric" })} – ${endStr}`;
}

function wireTrigger(el) {
  if (el.dataset.drpWired) return;
  el.dataset.drpWired = "true";

  const labelEl = el.querySelector("span, [data-daterange-label]") || el;
  const hasIcon = el.querySelector("i[class*='icon-calendar']");
  const initialText = (labelEl.textContent || "").trim();

  // Hidden input flatpickr actually binds to (keeps the trigger's own markup untouched).
  const hidden = document.createElement("input");
  hidden.type = "text";
  hidden.className = "sr-only";
  hidden.setAttribute("aria-hidden", "true");
  hidden.tabIndex = -1;
  el.appendChild(hidden);

  const fp = window.flatpickr(hidden, {
    mode: "range",
    showMonths: monthsForViewport(),
    dateFormat: "Y-m-d",
    positionElement: el,
    appendTo: document.body,
    onChange: (dates) => {
      if (!dates.length) return;
      if (dates.length === 2 || (dates.length === 1 && fp.selectedDates.length < 2)) {
        labelEl.textContent = formatRange(dates, fp);
      }
    },
    onClose: (dates) => {
      if (dates.length === 2) labelEl.textContent = formatRange(dates, fp);
    },
    // Flatpickr sizes the multi-month grid exactly once, in a requestAnimationFrame
    // scheduled at init — before the trigger (and its calendar) have necessarily
    // settled into their final on-page layout. If that one-shot measurement reads a
    // dayContainer width of 0, it locks in a near-zero calendar width forever. Redo
    // the same measurement flatpickr does internally, but on open (synchronously,
    // before flatpickr's own positionCalendar() call runs right after this fires),
    // so positioning also reacts to the corrected width instead of the stale one.
    onOpen: () => {
      const days = fp.daysContainer && fp.daysContainer.firstChild;
      if (!days || !fp.calendarContainer) return;
      const daysWidth = (days.offsetWidth + 1) * fp.config.showMonths;
      fp.daysContainer.style.width = daysWidth + "px";
      fp.calendarContainer.style.width = daysWidth + (fp.weekWrapper ? fp.weekWrapper.offsetWidth : 0) + "px";
    },
  });

  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.preventDefault();
    fp.open();
  });

  instances.push(fp);

  if (!hasIcon) return; // still wired, just no icon to worry about
}

// Crossing the sm breakpoint (e.g. rotating a tablet, resizing a browser window)
// needs the month count re-evaluated — flatpickr won't do this on its own since
// showMonths is only read at init/set time, not on resize.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const months = monthsForViewport();
    instances.forEach((fp) => {
      if (fp.config.showMonths === months) return;
      if (fp.isOpen) fp.close();
      fp.set("showMonths", months);
    });
  }, 150);
});

function initDateRangePickers() {
  const explicit = document.querySelectorAll("[data-daterange]");
  explicit.forEach(wireTrigger);

  const candidates = document.querySelectorAll("button.btn, input.btn");
  candidates.forEach((el) => {
    if (el.dataset.drpWired) return;
    if (el.id === "productsDateRange") return; // already has bespoke behavior
    if (el.classList.contains("js-date-range")) return; // already wired by list-toolkit.js
    if (el.closest("#calendarView, .fc")) return; // full calendar page manages its own dates
    const icon = el.querySelector("i[class*='icon-calendar']");
    if (!icon) return;
    if (!looksLikeDateLabel(el.textContent)) return;
    wireTrigger(el);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDateRangePickers);
} else {
  initDateRangePickers();
}
})();
