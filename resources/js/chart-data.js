// All ApexCharts / Chart.js chart wiring for dashboards and reports, consolidated
// into one file so chart code lives in one place instead of ~35 separate files.
// Each block is IIFE-scoped and guards on its own chart container's existence
// (and on the relevant charting library being loaded) so it safely no-ops on
// pages that don't have that chart.


// ---- analytics-ecommerce-charts.js ----
// ---- analytics-ecommerce-charts.js ---------------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    primary400: cssVar("--color-primary-400"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

function mount(id, options) {
  const el = document.querySelector(id);
  if (!el) return null;
  const chart = new ApexCharts(el, options);
  chart.render();
  charts.push(chart);
  return chart;
}

function mountSparkline(id, data, color, type = "area") {
  const chartType = type === "column" ? "bar" : type;
  const options = {
    chart: { type: chartType, height: 46, sparkline: { enabled: true } },
    series: [{ data }],
    stroke: { curve: "smooth", width: 2 },
    colors: [color],
    tooltip: { enabled: false },
  };
  if (type === "area") options.fill = { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0 } };
  if (type === "column") options.plotOptions = { bar: { columnWidth: "55%", borderRadius: 2 } };
  return mount(id, options);
}

// ============ KPI mini visualizations ============
mountSparkline("#kpiRevenueSpark", [42, 46, 44, 51, 55, 53, 60, 64, 61, 68, 72, 76], c.primary, "area");
mountSparkline("#kpiOrdersCol", [28, 34, 31, 38, 42, 39, 45], c.info, "column");
mountSparkline("#kpiAovTrend", [110, 114, 112, 119, 122, 120, 126, 128], c.warning, "line");

mount("#kpiCustomersRing", {
  chart: { type: "radialBar", height: 64, width: 64 },
  series: [83],
  colors: [c.success],
  plotOptions: { radialBar: { hollow: { size: "58%" }, track: { background: c.border }, dataLabels: { name: { show: false }, value: { show: false } } } },
  stroke: { lineCap: "round" },
});

mount("#kpiConversionRadial", {
  chart: { type: "radialBar", height: 64, width: 64 },
  series: [48],
  colors: [c.accent],
  plotOptions: { radialBar: { hollow: { size: "58%" }, track: { background: c.border }, dataLabels: { name: { show: false }, value: { show: false } } } },
  stroke: { lineCap: "round" },
});

mount("#kpiInventoryGauge", {
  chart: { type: "radialBar", height: 74, width: 74 },
  series: [92],
  colors: [c.info],
  plotOptions: {
    radialBar: {
      startAngle: -90, endAngle: 90, hollow: { size: "56%" }, track: { background: c.border },
      dataLabels: { name: { show: false }, value: { show: true, offsetY: 4, fontSize: "12px", fontWeight: 700, color: c.text, formatter: (v) => v + "%" } },
    },
  },
  stroke: { lineCap: "round" },
});

mount("#kpiRetentionDonut", {
  chart: { type: "donut", height: 64, width: 64 },
  series: [68.4, 31.6],
  colors: [c.success, c.border],
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { size: "70%" } } },
  tooltip: { enabled: false },
});

// ============ Section 2: Revenue Performance Overview (combo) ============
mount("#revenueIntelligenceChart", {
  chart: { height: 300, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText, stacked: false },
  series: [
    { name: "Revenue", type: "area", data: [210, 224, 218, 236, 248, 241, 259, 268, 262, 281, 296, 284, 305] },
    { name: "Orders", type: "column", data: [38, 41, 39, 43, 46, 44, 48, 50, 47, 52, 55, 51, 56] },
    { name: "Profit", type: "line", data: [72, 77, 74, 82, 87, 84, 91, 95, 92, 99, 105, 100, 108] },
    { name: "Refunds", type: "line", data: [9, 11, 8, 10, 12, 9, 11, 13, 10, 12, 14, 11, 13] },
    { name: "Forecast", type: "line", data: [null, null, null, null, null, null, null, null, null, null, null, 284, 342] },
  ],
  xaxis: {
    categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { show: false } },
  grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
  stroke: { curve: "smooth", width: [0, 0, 2.5, 2, 2], dashArray: [0, 0, 0, 0, 6] },
  fill: { type: ["gradient", "solid", "solid", "solid"], gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02 }, opacity: [1, 0.85, 1, 1, 1] },
  colors: [c.primary, c.info, c.success, c.danger, c.subtleText],
  plotOptions: { bar: { columnWidth: "45%", borderRadius: 3 } },
  markers: { size: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { shared: true, intersect: false, y: { formatter: (v) => (v == null ? "—" : "$" + (v * 1000).toLocaleString()) } },
});

// ============ Section 4: Customer Segmentation donut ============
mount("#customerSegmentationDonut", {
  chart: { type: "donut", height: 190, fontFamily: "Inter, sans-serif" },
  series: [12, 28, 31, 19, 10],
  labels: ["VIP", "Loyal", "New", "At Risk", "Lost"],
  colors: [c.accent, c.primary, c.info, c.warning, c.neutral],
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { colors: [c.surface], width: 2 },
  plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Customers", fontSize: "11px", color: c.subtleText, formatter: () => "184K" } } } } },
});

// ============ Customer Lifetime Value trend (index.html replacement for the heatmap) ============
mount("#customerLtvChart", {
  chart: { type: "line", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [{ name: "Avg. LTV", data: [268, 274, 271, 283, 291, 288, 299, 308, 302, 315, 324, 342] }],
  xaxis: { categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (v) => "$" + v.toFixed(0) } },
  grid: baseGrid(),
  stroke: { curve: "smooth", width: 2.5 },
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02 } },
  colors: [c.info],
  markers: { size: 4, strokeWidth: 0 },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v) => "$" + v } },
});

// ============ Section 4: Customer Activity Heatmap ============
(function () {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["6a", "9a", "12p", "3p", "6p", "9p", "12a"];
  const series = days.map((day, di) => ({
    name: day,
    data: hours.map((h, hi) => {
      const base = 20 + Math.round(Math.sin((hi + di) * 0.7) * 15) + (hi >= 4 ? 25 : 5) + (di >= 5 ? 15 : 0);
      return { x: h, y: Math.max(5, Math.min(100, base)) };
    }),
  })).reverse();

  mount("#customerActivityHeatmap", {
    chart: { type: "heatmap", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series,
    dataLabels: { enabled: false },
    colors: [c.primary],
    plotOptions: {
      heatmap: {
        radius: 3,
        colorScale: {
          ranges: [
            { from: 0, to: 25, color: c.border, name: "Low" },
            { from: 26, to: 50, color: c.primary400, name: "Moderate" },
            { from: 51, to: 75, color: c.primary, name: "High" },
            { from: 76, to: 100, color: c.accent, name: "Peak" },
          ],
        },
      },
    },
    grid: { padding: { left: 4, right: 4 } },
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false } },
    tooltip: { y: { formatter: (v) => v + " sessions/100" } },
  });
})();

// ============ Section 5: product sparklines + treemap ============
mountSparkline("#prodSpark1", [12, 18, 15, 22, 20, 26, 28], c.success);
mountSparkline("#prodSpark2", [20, 22, 19, 24, 23, 26, 27], c.success);
mountSparkline("#prodSpark3", [18, 16, 17, 14, 15, 12, 11], c.danger);
mountSparkline("#prodSpark4", [10, 12, 11, 14, 15, 16, 17], c.success);
mountSparkline("#prodSpark5", [9, 8, 9, 7, 6, 6, 5], c.danger);

mount("#categoryTreemap", {
  chart: { type: "treemap", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
  series: [{
    data: [
      { x: "Electronics", y: 842 },
      { x: "Fashion", y: 512 },
      { x: "Beauty", y: 318 },
      { x: "Home", y: 276 },
      { x: "Sports", y: 190 },
      { x: "Accessories", y: 148 },
    ],
  }],
  legend: { show: false },
  dataLabels: { enabled: true, style: { fontSize: "11.5px", fontFamily: "Inter, sans-serif", fontWeight: 600 } },
  plotOptions: { treemap: { distributed: true, enableShades: true, shadeIntensity: 0.45 } },
  colors: [c.primary, c.accent, c.info, c.success, c.warning, c.neutral],
});

// ============ Section 6: Marketing scatter quadrant + radar ============
mount("#marketingBubbleChart", {
  chart: { type: "scatter", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText,
    zoom: { enabled: false } },
  series: [
    { name: "Google Ads", data: [[48.2, 345]] },
    { name: "Facebook Ads", data: [[36.5, 290]] },
    { name: "Email Campaign", data: [[4.8, 1335]] },
    { name: "Affiliate", data: [[21, 278]] },
  ],
  markers: { size: 8, strokeWidth: 0 },
  xaxis: { type: "numeric", min: 0, max: 55, title: { text: "Budget ($K)", style: { fontSize: "10.5px", color: c.subtleText } }, labels: { style: { colors: c.subtleText } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { min: 0, max: 1450, title: { text: "ROI (%)", style: { fontSize: "10.5px", color: c.subtleText } }, labels: { style: { colors: c.subtleText } } },
  grid: baseGrid(),
  colors: [c.info, c.primary, c.warning, c.accent],
  dataLabels: { enabled: false },
  legend: { position: "bottom", fontSize: "11.5px", labels: { colors: c.text }, markers: { size: 6 } },
  tooltip: { shared: false, y: { formatter: (v) => v + "% ROI" } },
  annotations: {
    xaxis: [{ x: 28, borderColor: c.subtleText, strokeDashArray: 4, opacity: 0.35 }],
    yaxis: [{ y: 320, borderColor: c.subtleText, strokeDashArray: 4, opacity: 0.35 }],
    points: [
      { x: 10, y: 1400, marker: { size: 0 }, label: { text: "High ROI · Low Spend", borderWidth: 0, style: { fontSize: "9.5px", color: c.subtleText, background: "transparent" } } },
      { x: 45, y: 1400, marker: { size: 0 }, label: { text: "High ROI · High Spend", borderWidth: 0, style: { fontSize: "9.5px", color: c.subtleText, background: "transparent" } } },
      { x: 10, y: 60, marker: { size: 0 }, label: { text: "Low ROI · Low Spend", borderWidth: 0, style: { fontSize: "9.5px", color: c.subtleText, background: "transparent" } } },
      { x: 45, y: 60, marker: { size: 0 }, label: { text: "Low ROI · High Spend", borderWidth: 0, style: { fontSize: "9.5px", color: c.subtleText, background: "transparent" } } },
    ],
  },
});

mount("#marketingRadarChart", {
  chart: { type: "radar", height: 300, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [
    { name: "Google Ads", data: [88, 74, 79, 92, 70] },
    { name: "Facebook Ads", data: [92, 88, 62, 78, 65] },
    { name: "Email Campaign", data: [52, 60, 91, 96, 88] },
    { name: "Affiliate", data: [66, 55, 58, 70, 74] },
  ],
  xaxis: { categories: ["Reach", "Engagement", "Conversion", "ROI", "Retention"], labels: { style: { colors: [c.subtleText, c.subtleText, c.subtleText, c.subtleText, c.subtleText], fontSize: "11px" } } },
  yaxis: { show: false },
  colors: [c.info, c.primary, c.warning, c.accent],
  markers: { size: 3 },
  stroke: { width: 2 },
  fill: { opacity: 0.12 },
  plotOptions: { radar: { polygons: { strokeColors: c.border, connectorColors: c.border } } },
  legend: { position: "bottom", fontSize: "11.5px", labels: { colors: c.text }, markers: { size: 6 } },
});

// ============ Section 8: Stock overview stacked bar + demand forecast ============
mount("#stockOverviewBar", {
  chart: { type: "bar", height: 260, stacked: true, stackType: "100%", toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [
    { name: "Healthy Stock", data: [68, 71, 65, 74] },
    { name: "Low Stock", data: [18, 16, 21, 14] },
    { name: "Out of Stock", data: [6, 5, 8, 4] },
    { name: "Overstock", data: [8, 8, 6, 8] },
  ],
  xaxis: { categories: ["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { show: false } },
  grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
  colors: [c.success, c.warning, c.danger, c.info],
  plotOptions: { bar: { borderRadius: 3, columnWidth: "48%" } },
  dataLabels: { enabled: false },
  legend: { position: "bottom", fontSize: "11.5px", labels: { colors: c.text }, markers: { size: 6 } },
  tooltip: { y: { formatter: (v) => v + "%" } },
});

mount("#demandForecastChart", {
  chart: { type: "area", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [
    { name: "Current Inventory", data: [420, 398, 375, 340, 312, 280, 245, 210] },
    { name: "Projected Demand", data: [380, 392, 405, 418, 430, 445, 460, 478] },
  ],
  xaxis: { categories: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { show: false } },
  grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
  stroke: { curve: "smooth", width: [2.5, 2], dashArray: [0, 5] },
  fill: { type: ["gradient", "solid"], gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02 }, opacity: [1, 0] },
  colors: [c.info, c.danger],
  markers: { size: 0 },
  dataLabels: { enabled: false },
  legend: { position: "bottom", fontSize: "11.5px", labels: { colors: c.text }, markers: { size: 6 } },
  tooltip: { shared: true, intersect: false, y: { formatter: (v) => v + " units" } },
});

// ============ Section 9: order timeline + payment donut ============
(function () {
  const base = new Date("2026-07-01").getTime();
  const day = 86400000;
  mount("#orderTimelineChart", {
    chart: { type: "rangeBar", height: 190, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{
      data: [
        { x: "Pending", y: [base, base + 0.4 * day] },
        { x: "Processing", y: [base + 0.4 * day, base + 1.1 * day] },
        { x: "Shipped", y: [base + 1.1 * day, base + 3.6 * day] },
        { x: "Delivered", y: [base + 3.6 * day, base + 4.2 * day] },
      ],
    }],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "45%", distributed: true } },
    colors: [c.neutral, c.info, c.accent, c.success],
    xaxis: { type: "datetime", min: base, labels: { formatter: (v) => Math.round((v - base) / 3600000) + "h", style: { colors: c.subtleText } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "11.5px" } } },
    grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { x: { formatter: (v) => Math.round((v - base) / 3600000) + "h elapsed" } },
  });
})();

mount("#paymentMethodsDonut", {
  chart: { type: "donut", height: 190, fontFamily: "Inter, sans-serif" },
  series: [42, 23, 19, 10, 6],
  labels: ["Credit Card", "Stripe", "PayPal", "Wallet", "Bank Transfer"],
  colors: [c.primary, c.accent, c.info, c.success, c.neutral],
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { colors: [c.surface], width: 2 },
  plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Transactions", fontSize: "11px", color: c.subtleText, formatter: () => "48.9K" } } } } },
});

// ============ Section 10: refund trend + return reasons ============
mount("#refundTrendChart", {
  chart: { type: "line", height: 250, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [
    { name: "Refunds", type: "bar", data: [18.2, 21.4, 19.8, 24.1, 22.6, 26.3, 23.9, 21.1] },
    { name: "Trend", type: "line", data: [18.2, 21.4, 19.8, 24.1, 22.6, 26.3, 23.9, 21.1] },
  ],
  xaxis: { categories: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (v) => "$" + v.toFixed(0) + "K" } },
  grid: baseGrid(),
  plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
  stroke: { width: [0, 3], curve: "smooth" },
  colors: [c.danger + "55", c.danger],
  markers: { size: 4, strokeWidth: 2, strokeColors: "#fff" },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { shared: true, y: { formatter: (v) => "$" + v + "K" } },
});

mount("#returnReasonsBar", {
  chart: { type: "bar", height: 220, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
  series: [{ name: "Share", data: [38, 27, 21, 14] }],
  xaxis: { categories: ["Damaged Product", "Wrong Size", "Delivery Delay", "Changed Mind"], labels: { formatter: (v) => v + "%" }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { fontSize: "11.5px" } } },
  grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "55%", distributed: true } },
  colors: [c.danger, c.warning, c.info, c.neutral],
  dataLabels: { enabled: true, formatter: (v) => v + "%", style: { fontSize: "11px", colors: [c.text] }, offsetX: 6 },
  legend: { show: false },
  tooltip: { y: { formatter: (v) => v + "% of returns" } },
});

// ============ Re-theme all charts on dark/light toggle ============
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- bi-overview-charts.js ----
// ---- bi-overview-charts.js -----------------------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
  };
}
})();


// ---- portfolio-explorer.js ----
// ---- portfolio-explorer.js -----------------------------------------------------
(function () {
const PERIODS = {
  "1D": { categories: ["9AM", "11AM", "1PM", "3PM", "5PM", "7PM", "9PM"], data: [262580, 264200, 261900, 268400, 271200, 279800, 284620], total: "$284,620.40", delta: "+8.4% ($22,040.10)" },
  "1W": { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [248900, 252300, 246800, 259400, 268200, 276500, 284620], total: "$284,620.40", delta: "+14.4% ($35,720.00)" },
  "1M": { categories: ["W1", "W2", "W3", "W4"], data: [231400, 244800, 262100, 284620], total: "$284,620.40", delta: "+23.0% ($53,220.00)" },
  "1Y": { categories: ["Aug", "Oct", "Dec", "Feb", "Apr", "Jun", "Jul"], data: [142000, 168400, 195200, 176800, 224600, 258900, 284620], total: "$284,620.40", delta: "+100.4% ($142,620.40)" },
  "ALL": { categories: ["2023", "2024", "2025", "2026"], data: [48200, 96400, 178200, 284620], total: "$284,620.40", delta: "+490.5% ($236,420.40)" },
};

const chartEl = document.querySelector("#portfolioPerfChart");
if (chartEl) {
  const initial = PERIODS["1D"];
  const chart = new ApexCharts(chartEl, {
    chart: { type: "area", height: 140, toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    series: [{ name: "Portfolio Value", data: initial.data }],
    xaxis: { categories: initial.categories, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
    stroke: { curve: "smooth", width: 2.5 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 95, 100] } },
    colors: ["#4ade80"],
    markers: { size: 0 },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: "dark", y: { formatter: (v) => "$" + v.toLocaleString() } },
  });
  chart.render();

  document.querySelectorAll(".portfolio-period-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".portfolio-period-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.style.background = active ? "#fff" : "transparent";
        b.style.color = active ? "#0f172a" : "rgb(255 255 255 / 0.7)";
      });
      const period = PERIODS[btn.dataset.period];
      chart.updateOptions({ xaxis: { categories: period.categories }, series: [{ name: "Portfolio Value", data: period.data }] });
      const totalEl = document.getElementById("portfolioTotalValue");
      const deltaEl = document.getElementById("portfolioTotalDelta");
      if (totalEl) totalEl.textContent = period.total;
      if (deltaEl) deltaEl.textContent = period.delta;
    });
  });
}

// Asset allocation donut + risk gauge (portfolio-explorer.html)
(function () {
  const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const primary = cv('--color-primary-500') || '#0F766E';
  const info = cv('--color-info-500') || '#0EA5E9';
  const warning = cv('--color-warning-500') || '#D97706';
  const gray400 = cv('--text-tertiary') || '#9096A1';

  if (document.getElementById('portfolioAllocationChart')) {
    new ApexCharts(document.getElementById('portfolioAllocationChart'), {
      chart: { type: 'donut', height: 112, width: 112 },
      series: [57, 30, 13],
      labels: ['Bitcoin', 'Ethereum', 'Others'],
      colors: [warning, info, primary],
      stroke: { width: 2, colors: [cv('--surface-card') || '#fff'] },
      legend: { show: false },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true, name: { show: false }, value: { show: true, fontSize: '13px', fontWeight: 700, offsetY: 5 }, total: { show: true, showAlways: true, label: '8 assets', fontSize: '9px', fontWeight: 600, color: gray400, formatter: () => '' } } } } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark', y: { formatter: v => v + '%' } }
    }).render();
  }

  if (document.getElementById('portfolioRiskGaugeChart')) {
    new ApexCharts(document.getElementById('portfolioRiskGaugeChart'), {
      chart: { type: 'radialBar', height: 130, offsetY: 10 },
      series: [62],
      colors: [warning],
      plotOptions: {
        radialBar: {
          startAngle: -90, endAngle: 90,
          hollow: { size: '58%' },
          track: { background: 'var(--surface-sunken)', strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: { show: true, fontSize: '20px', fontWeight: 700, offsetY: -4, formatter: v => v }
          }
        }
      },
      stroke: { lineCap: 'round' },
      labels: ['Risk Score'],
      tooltip: { enabled: false }
    }).render();
  }
})();
})();


// ---- cart-abandonment-report-charts.js ----
// ---- cart-abandonment-report-charts.js -----------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

// ---- Recovery Trend sparkline -----------------------------------------------
const recoveryEl = document.querySelector("#recoveryTrendChart");
if (recoveryEl) {
  const chart = new ApexCharts(recoveryEl, {
    chart: { type: "area", height: 70, sparkline: { enabled: true } },
    series: [{ name: "Recovery Rate", data: [22.4, 23.1, 24.8, 25.6, 26.2, 27.4, 26.9, 27.8, 28.6] }],
    stroke: { curve: "smooth", width: 2 },
    colors: [c.success],
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0 } },
    tooltip: { theme: "dark", y: { formatter: (v) => v + "%" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Lost Revenue area + projection line -----------------------------------------------
const lostRevenueEl = document.querySelector("#lostRevenueChart");
if (lostRevenueEl) {
  const categories = ["Jul 1", "Jul 3", "Jul 5", "Jul 7", "Jul 9", "Jul 11", "Jul 13", "Jul 15", "Jul 17", "Jul 19", "Jul 20"];
  const lost = [24800, 26100, 25400, 28900, 31200, 29800, 33500, 35100, 34200, 37800, 38900];
  const projected = [7100, 7500, 7300, 8300, 8900, 8500, 9600, 10000, 9800, 10800, 11100];

  const chart = new ApexCharts(lostRevenueEl, {
    chart: { type: "area", height: 220, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [
      { name: "Lost Revenue", type: "area", data: lost },
      { name: "Potential Recovery", type: "line", data: projected },
    ],
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: "10.5px" } } },
    yaxis: { labels: { formatter: (v) => "$" + Math.round(v / 1000) + "K", style: { fontSize: "10.5px" } } },
    grid: baseGrid(),
    stroke: { curve: "smooth", width: [2.5, 2], dashArray: [0, 5] },
    fill: { type: ["gradient", "solid"], gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 95, 100] } },
    colors: [c.danger, c.success],
    markers: { size: 0 },
    dataLabels: { enabled: false },
    legend: { show: true, fontSize: "11.5px", labels: { colors: c.text }, markers: { size: 6 } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v) => "$" + v.toLocaleString() } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Device donut -----------------------------------------------
const deviceEl = document.querySelector("#deviceDonutChart");
if (deviceEl) {
  const chart = new ApexCharts(deviceEl, {
    chart: { type: "donut", height: 200, fontFamily: "Inter, sans-serif" },
    series: [61, 29, 10],
    labels: ["Mobile", "Desktop", "Tablet"],
    colors: [c.danger, c.primary, c.warning],
    dataLabels: { enabled: true, style: { fontSize: "10.5px" } },
    legend: { show: true, position: "bottom", fontSize: "11.5px", labels: { colors: c.text } },
    stroke: { colors: [c.surface], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: { show: true, label: "Abandoned", fontSize: "11px", color: c.subtleText, formatter: () => "18.4K" },
          },
        },
      },
    },
  });
  chart.render();
  charts.push(chart);
}

// ---- Browser horizontal bar -----------------------------------------------
const browserEl = document.querySelector("#browserBarChart");
if (browserEl) {
  const chart = new ApexCharts(browserEl, {
    chart: { type: "bar", height: 220, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Abandonment Rate", data: [58.2, 71.4, 66.8, 62.1] }],
    xaxis: {
      categories: ["Chrome", "Safari", "Firefox", "Edge"],
      labels: { formatter: (v) => v + "%", style: { fontSize: "10.5px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: { ...baseGrid(), yaxis: { lines: { show: false } } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "55%", distributed: true } },
    colors: [c.primary, c.danger, c.accent, c.info],
    dataLabels: { enabled: true, formatter: (v) => v + "%", style: { fontSize: "10.5px", colors: [c.text] }, offsetX: 20 },
    legend: { show: false },
    tooltip: { y: { formatter: (v) => v + "%" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Re-theme charts on theme toggle -----------------------------------------------
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- customer-purchase-report-charts.js ----
// ---- customer-purchase-report-charts.js ----------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

// ---- Customer Lifetime Value hero chart -----------------------------------------------
const clvEl = document.querySelector("#clvHeroChart");
if (clvEl) {
  const chart = new ApexCharts(clvEl, {
    chart: { type: "area", height: 300, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [
      { name: "Avg. CLV", data: [412, 438, 455, 470, 462, 489, 512, 534, 548, 561, 579, 604] },
      { name: "VIP Segment CLV", data: [980, 1020, 1065, 1110, 1096, 1148, 1205, 1260, 1298, 1332, 1380, 1442] },
    ],
    xaxis: {
      categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" }, formatter: (v) => "$" + v } },
    grid: baseGrid(),
    stroke: { curve: "smooth", width: 2.5 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 90, 100] } },
    colors: [c.primary, c.accent],
    markers: { size: 0 },
    dataLabels: { enabled: false },
    legend: { show: true, fontSize: "11.5px", position: "top", horizontalAlign: "right", markers: { size: 5 } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v) => "$" + v.toLocaleString() } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Segmentation donut -----------------------------------------------
const segEl = document.querySelector("#segmentationDonut");
if (segEl) {
  const chart = new ApexCharts(segEl, {
    chart: { type: "donut", height: 220, fontFamily: "Inter, sans-serif" },
    series: [312, 486, 158, 94, 61],
    labels: ["New", "Returning", "VIP", "At-Risk", "Churned"],
    colors: [c.info, c.primary, c.accent, c.warning, c.danger],
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { colors: [c.surface], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: { show: true, label: "Customers", fontSize: "11px", color: c.subtleText, formatter: () => "1,111" },
          },
        },
      },
    },
  });
  chart.render();
  charts.push(chart);
}

// ---- Purchase Frequency histogram -----------------------------------------------
const freqEl = document.querySelector("#purchaseFrequencyChart");
if (freqEl) {
  const chart = new ApexCharts(freqEl, {
    chart: { type: "bar", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Customers", data: [386, 298, 224, 132, 71] }],
    xaxis: {
      categories: ["1 order", "2-3 orders", "4-6 orders", "7-10 orders", "10+ orders"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: baseGrid(),
    plotOptions: { bar: { borderRadius: 6, columnWidth: "52%", distributed: true } },
    colors: [c.primary, c.info, c.accent, c.warning, c.success],
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { y: { formatter: (v) => v + " customers" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Preferred Categories horizontal bar -----------------------------------------------
const catEl = document.querySelector("#preferredCategoriesChart");
if (catEl) {
  const chart = new ApexCharts(catEl, {
    chart: { type: "bar", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Customers", data: [428, 356, 301, 244, 189, 122] }],
    xaxis: {
      categories: ["Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Groceries"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11.5px" } } },
    grid: { ...baseGrid(), xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    plotOptions: { bar: { borderRadius: 5, horizontal: true, barHeight: "55%" } },
    colors: [c.primary],
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { y: { formatter: (v) => v + " customers" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Re-theme charts on theme toggle -----------------------------------------------
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- discount-coupon-report-charts.js ----
// ---- discount-coupon-report-charts.js ------------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

// ---- Coupon Usage (grouped columns across weeks) -----------------------------------------------
const usageEl = document.querySelector("#couponUsageChart");
if (usageEl) {
  const chart = new ApexCharts(usageEl, {
    chart: { type: "bar", height: 300, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText, stacked: false },
    series: [
      { name: "SAVE20", data: [120, 145, 132, 168, 190, 176, 210] },
      { name: "WELCOME10", data: [96, 102, 118, 110, 128, 134, 140] },
      { name: "FLASH25", data: [0, 0, 210, 240, 0, 0, 0] },
      { name: "VIP15", data: [40, 44, 41, 48, 52, 55, 58] },
    ],
    xaxis: {
      categories: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: baseGrid(),
    plotOptions: { bar: { columnWidth: "58%", borderRadius: 4, borderRadiusApplication: "end" } },
    colors: [c.primary, c.accent, c.warning, c.info],
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "right", fontSize: "11.5px", markers: { size: 5 } },
    tooltip: { shared: true, intersect: false },
  });
  chart.render();
  charts.push(chart);
}

// ---- Customer Segments (donut) -----------------------------------------------
const segEl = document.querySelector("#segmentDonutChart");
if (segEl) {
  const chart = new ApexCharts(segEl, {
    chart: { type: "donut", height: 220, fontFamily: "Inter, sans-serif" },
    series: [46, 34, 20],
    labels: ["Returning", "New", "VIP"],
    colors: [c.primary, c.info, c.accent],
    dataLabels: { enabled: true, style: { fontSize: "10.5px" }, dropShadow: { enabled: false } },
    legend: { show: true, position: "bottom", fontSize: "11.5px", markers: { size: 5 } },
    stroke: { colors: [c.surface], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: { show: true, label: "Redemptions", fontSize: "11px", color: c.subtleText, formatter: () => "18,420" },
          },
        },
      },
    },
  });
  chart.render();
  charts.push(chart);
}

// ---- Revenue Impact (cumulative area: incremental vs organic) -----------------------------------------------
const impactEl = document.querySelector("#revenueImpactChart");
if (impactEl) {
  const categories = ["Jul 1", "Jul 3", "Jul 5", "Jul 7", "Jul 9", "Jul 11", "Jul 13", "Jul 15", "Jul 17", "Jul 19", "Jul 20"];
  const organic = [42, 88, 130, 178, 232, 284, 330, 386, 432, 480, 512];
  const incremental = [12, 30, 52, 79, 112, 148, 190, 232, 280, 325, 356];
  const chart = new ApexCharts(impactEl, {
    chart: { type: "area", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [
      { name: "Organic Revenue", data: organic },
      { name: "Discount-Attributed Revenue", data: incremental },
    ],
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: "11px" } } },
    yaxis: { labels: { formatter: (v) => "$" + v + "K", style: { fontSize: "11px" } } },
    grid: baseGrid(),
    stroke: { curve: "smooth", width: 2.5 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 95, 100] } },
    colors: [c.neutral, c.success],
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "right", fontSize: "11.5px", markers: { size: 5 } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v) => "$" + v + "K" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Discount ROI comparison (revenue vs discount cost per campaign) -----------------------------------------------
const roiEl = document.querySelector("#discountRoiChart");
if (roiEl) {
  const chart = new ApexCharts(roiEl, {
    chart: { type: "bar", height: 280, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [
      { name: "Revenue Generated", data: [128, 96, 74, 58, 41] },
      { name: "Discount Cost", data: [26, 19, 22, 12, 9] },
    ],
    xaxis: {
      categories: ["SAVE20", "WELCOME10", "FLASH25", "VIP15", "BUNDLE5"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { formatter: (v) => "$" + v + "K", style: { fontSize: "11px" } } },
    grid: baseGrid(),
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 4, borderRadiusApplication: "end" } },
    colors: [c.primary, c.danger],
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "right", fontSize: "11.5px", markers: { size: 5 } },
    tooltip: { shared: true, intersect: false, y: { formatter: (v) => "$" + v + "K" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Re-theme charts on theme toggle -----------------------------------------------
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- order-summary-report-charts.js ----
// ---- order-summary-report-charts.js --------------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

// ---- Order Heatmap (calendar-style, 7 x weeks) -----------------------------------------------
const heatmapEl = document.querySelector("#orderHeatmapChart");
if (heatmapEl) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
  const series = days.map((d) => ({
    name: d,
    data: weeks.map((w) => ({ x: w, y: Math.round(20 + Math.random() * 90) })),
  }));

  const chart = new ApexCharts(heatmapEl, {
    chart: { type: "heatmap", height: 260, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series,
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      heatmap: {
        radius: 3,
        colorScale: {
          ranges: [
            { from: 0, to: 30, name: "Low", color: c.border },
            { from: 31, to: 60, name: "Medium", color: c.info },
            { from: 61, to: 85, name: "High", color: c.primary },
            { from: 86, to: 200, name: "Peak", color: c.accent },
          ],
        },
      },
    },
    grid: { borderColor: c.border, padding: { left: 8, right: 8 } },
    tooltip: { y: { formatter: (v) => v + " orders" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Delivery Performance gauge -----------------------------------------------
const deliveryGaugeEl = document.querySelector("#deliveryPerformanceGauge");
if (deliveryGaugeEl) {
  const chart = new ApexCharts(deliveryGaugeEl, {
    chart: { type: "radialBar", height: 190 },
    series: [92],
    colors: [c.success],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "62%" },
        track: { background: c.border },
        dataLabels: {
          name: { show: true, offsetY: -2, color: c.subtleText, fontSize: "11px", formatter: () => "On-Time" },
          value: { show: true, offsetY: -34, color: c.text, fontSize: "26px", fontWeight: 800, formatter: (v) => v + "%" },
        },
      },
    },
    stroke: { lineCap: "round" },
  });
  chart.render();
  charts.push(chart);
}

// ---- Order Aging bar chart -----------------------------------------------
const agingEl = document.querySelector("#orderAgingChart");
if (agingEl) {
  const chart = new ApexCharts(agingEl, {
    chart: { type: "bar", height: 220, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Orders", data: [186, 94, 42, 11] }],
    xaxis: {
      categories: ["0-1 day", "2-3 days", "4-7 days", "7+ days"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: baseGrid(),
    plotOptions: { bar: { columnWidth: "48%", borderRadius: 4, distributed: true } },
    colors: [c.success, c.info, c.warning, c.danger],
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v) => v + " orders" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Peak Order Hours -----------------------------------------------
const peakHoursEl = document.querySelector("#peakOrderHoursChart");
if (peakHoursEl) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = [4, 3, 2, 2, 3, 6, 12, 22, 34, 41, 47, 52, 58, 55, 49, 44, 40, 46, 61, 68, 57, 38, 21, 10];
  const peakIndex = data.indexOf(Math.max(...data));

  const chart = new ApexCharts(peakHoursEl, {
    chart: { type: "bar", height: 240, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Orders", data }],
    xaxis: {
      categories: hours.map((h) => (h % 3 === 0 ? h + "h" : "")),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "10px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: baseGrid(),
    plotOptions: { bar: { columnWidth: "60%", borderRadius: 3 } },
    colors: [
      function ({ dataPointIndex }) {
        return dataPointIndex === peakIndex ? c.accent : c.primary;
      },
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { y: { formatter: (v) => v + " orders" } },
  });
  chart.render();
  charts.push(chart);
}

// ---- Cancellation Reasons donut -----------------------------------------------
const cancelDonutEl = document.querySelector("#cancellationDonutChart");
if (cancelDonutEl) {
  const chart = new ApexCharts(cancelDonutEl, {
    chart: { type: "donut", height: 190, fontFamily: "Inter, sans-serif" },
    series: [38, 26, 18, 12, 6],
    labels: ["Customer Changed Mind", "Payment Failed", "Out of Stock", "Delivery Delay", "Other"],
    colors: [c.danger, c.warning, c.info, c.neutral, c.accent],
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { colors: [c.surface], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: { show: true, label: "Cancelled", fontSize: "11px", color: c.subtleText, formatter: () => "3.4%" },
          },
        },
      },
    },
  });
  chart.render();
  charts.push(chart);
}

// ---- Re-theme charts on theme toggle -----------------------------------------------
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- product-performance-report-charts.js ----
// ---- product-performance-report-charts.js --------------------------------------
(function () {
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    primary: cssVar("--color-primary-600"),
    accent: cssVar("--color-accent-500"),
    info: cssVar("--color-info-500"),
    success: cssVar("--color-success-500"),
    warning: cssVar("--color-warning-500"),
    danger: cssVar("--color-danger-500"),
    neutral: cssVar("--color-neutral-400"),
    text: cssVar("--text-secondary"),
    subtleText: cssVar("--text-tertiary"),
    border: cssVar("--border-subtle"),
    surface: cssVar("--surface-raised"),
  };
}

const charts = [];
const c = palette();

function baseGrid() {
  return { borderColor: c.border, strokeDashArray: 4, padding: { left: 8, right: 8 } };
}

function mountSparkline(id, data, color, type = "area") {
  const el = document.querySelector(id);
  if (!el) return;

  const options = {
    chart: { type, height: 36, sparkline: { enabled: true } },
    series: [{ data }],
    stroke: { curve: "smooth", width: 2 },
    colors: [color],
    tooltip: { enabled: false },
  };

  if (type === "area") {
    options.fill = { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0 } };
  }

  const chart = new ApexCharts(el, options);
  chart.render();
  charts.push(chart);
}

// ---- 1. Product Performance Matrix (ranked horizontal bar: volume, colored by margin) --------------
const matrixEl = document.querySelector("#productPerformanceMatrix");
if (matrixEl) {
  const products = [
    { name: "Smart Watch Ultra", x: 3420, y: 38, z: 187 },
    { name: "Drift Wireless Charger", x: 3100, y: 27, z: 119 },
    { name: "Aurora Headset", x: 2910, y: 34, z: 143 },
    { name: "Pulse Fitness Band", x: 2680, y: 31, z: 104 },
    { name: "Nimbus Backpack", x: 2210, y: 29, z: 88 },
    { name: "Cascade Jacket", x: 1860, y: 22, z: 97 },
    { name: "Velora Sunglasses", x: 1650, y: 46, z: 61 },
    { name: "Halo Smart Lamp", x: 1504, y: 41, z: 72 },
    { name: "Flex Resistance Set", x: 1120, y: 18, z: 45 },
    { name: "Skyline Desk Lamp", x: 890, y: 12, z: 27 },
    { name: "Terra Hiking Boots", x: 980, y: 15, z: 39 },
    { name: "Origin Ceramic Mug Set", x: 740, y: 52, z: 21 },
  ];
  const marginColor = (m) => (m >= 35 ? c.success : m >= 22 ? c.warning : c.danger);

  const chart = new ApexCharts(matrixEl, {
    chart: { type: "bar", height: 400, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [{ name: "Units Sold", data: products.map((p) => ({ x: p.name, y: p.x, fillColor: marginColor(p.y) })) }],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, distributed: true, barHeight: "62%" } },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: { title: { text: "Sales Volume (units)", style: { fontSize: "11px", color: c.subtleText } }, labels: { style: { fontSize: "10.5px" } } },
    yaxis: { labels: { style: { fontSize: "10.5px" } } },
    grid: baseGrid(),
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const p = products[dataPointIndex];
        return `<div style="padding:8px 10px;font-size:11.5px;">
          <div style="font-weight:700;margin-bottom:2px;">${p.name}</div>
          <div>Volume: ${p.x.toLocaleString()} units</div>
          <div>Margin: ${p.y}%</div>
          <div>Revenue: $${p.z}K</div>
        </div>`;
      },
    },
  });
  chart.render();
  charts.push(chart);
}

// ---- 5. Category Comparison (radar) --------------------------------------------------
const radarEl = document.querySelector("#categoryComparisonRadar");
if (radarEl) {
  const chart = new ApexCharts(radarEl, {
    chart: { type: "radar", height: 320, toolbar: { show: false }, fontFamily: "Inter, sans-serif", foreColor: c.subtleText },
    series: [
      { name: "Electronics", data: [92, 78, 24, 88] },
      { name: "Fashion", data: [68, 54, 42, 74] },
      { name: "Home & Living", data: [58, 61, 30, 82] },
      { name: "Sports", data: [44, 47, 22, 79] },
      { name: "Beauty", data: [37, 66, 18, 85] },
    ],
    labels: ["Revenue", "Growth", "Returns", "Rating"],
    colors: [c.primary, c.accent, c.info, c.success, c.warning],
    stroke: { width: 2 },
    fill: { opacity: 0.08 },
    markers: { size: 3 },
    legend: { position: "bottom", fontSize: "11px", labels: { colors: c.subtleText } },
    yaxis: { show: false },
    plotOptions: { radar: { polygons: { strokeColors: c.border, connectorColors: c.border } } },
  });
  chart.render();
  charts.push(chart);
}

// ---- 6. SKU Performance sparklines --------------------------------------------------
mountSparkline("#skuSpark1", [12, 14, 13, 16, 18, 17, 20], c.success);
mountSparkline("#skuSpark2", [22, 20, 23, 21, 19, 18, 16], c.danger);
mountSparkline("#skuSpark3", [8, 9, 11, 10, 13, 15, 17], c.success);
mountSparkline("#skuSpark4", [30, 29, 31, 28, 32, 33, 35], c.success);
mountSparkline("#skuSpark5", [18, 17, 15, 16, 14, 13, 12], c.danger);
mountSparkline("#skuSpark6", [9, 10, 9, 11, 12, 14, 15], c.success);
mountSparkline("#skuSpark7", [10, 12, 11, 13, 15, 14, 16], c.success);
mountSparkline("#skuSpark8", [12, 11, 13, 12, 11, 12, 11], c.neutral);
mountSparkline("#skuSpark9", [14, 13, 12, 11, 9, 8, 7], c.warning);
mountSparkline("#skuSpark10", [11, 10, 8, 7, 6, 5, 4], c.warning);

// ---- 10. Inventory Health radialBar gauges --------------------------------------------------
function mountGauge(id, value, color) {
  const el = document.querySelector(id);
  if (!el) return;
  const chart = new ApexCharts(el, {
    chart: { type: "radialBar", height: 120 },
    series: [value],
    colors: [color],
    plotOptions: {
      radialBar: {
        hollow: { size: "58%" },
        track: { background: c.border },
        dataLabels: {
          name: { show: false },
          value: { show: true, fontSize: "13px", fontWeight: 700, offsetY: 5, color: c.text, formatter: (v) => v + "%" },
        },
      },
    },
    stroke: { lineCap: "round" },
  });
  chart.render();
  charts.push(chart);
}

mountGauge("#invGauge1", 82, c.success);
mountGauge("#invGauge2", 64, c.warning);
mountGauge("#invGauge3", 91, c.success);
mountGauge("#invGauge4", 38, c.danger);

// ---- Re-theme charts on theme toggle -----------------------------------------------
const observer = new MutationObserver(() => {
  const next = palette();
  charts.forEach((chart) => {
    chart.updateOptions({ chart: { foreColor: next.subtleText }, grid: { borderColor: next.border } }, false, false);
  });
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();


// ---- apex-chart-data.js ----
// ---- apex-chart-data.js --------------------------------------------------------
(function () {
if (typeof ApexCharts === "undefined") return;

'use strict';
	
	document.addEventListener('DOMContentLoaded', function () {
			const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
			const primary = cssVar('--color-primary') || '#0F766E';
			const success = cssVar('--color-success') || '#059669';
			const orange  = cssVar('--color-orange')  || '#E65100';
			const pink    = cssVar('--color-pink')    || '#CC25B0';
			const dark    = cssVar('--color-dark')    || '#1E293B';
			const gray400 = cssVar('--color-gray-400')|| '#9096A1';
				const warning = cssVar('--color-warning') || '#D97706';
				const purple  = cssVar('--color-purple')  || '#6A1B9A';
				const info    = cssVar('--color-info')    || '#0EA5E9';
			const border  = cssVar('--color-border-color') || '#E8E9EC';

			// Employee Distribution (donut)

			// Weekly Attendance Trend (bar)

			// 6-Month Payroll Trend (area)
			
		setTimeout(() => window.dispatchEvent(new Event('resize')), 200);

		// Sparkline: Total Stock

		// Sparkline: Inventory Value

		// Category Distribution horizontal bars
		
		// Product Stock Levels — combo bar + line

		// Inventory Value full-width line

		// Leads Generated (combo: bars + line)

		// Contact By Sources donut
		
	});

	// Sales Revenue Trends chart
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', gray400 = cv('--color-gray-400') || '#9096A1';

	});

	// Procument Dashboard
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', pink = cv('--color-pink') || '#CC25B0', purple = cv('--color-purple') || '#6A1B9A', info = cv('--color-info') || '#0EA5E9', danger = cv('--color-danger') || '#B91C1C', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';


		// Top Suppliers horizontal bars

		// Monthly Spend Trend area

		// Supplier Performance bubble

		// Spend by Category half-donut (semi)

		// Order Status — multi-ring donut
	});
	
	// Finance dashboard charts
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const primary = cv('--color-primary') || '#0F766E', success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', pink = cv('--color-pink') || '#CC25B0', purple = cv('--color-purple') || '#6A1B9A', info = cv('--color-info') || '#0EA5E9', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';

		// Revenue vs Expense

		// Revenue donut (center 73%)

		// Profit Margin vs Sales lines

		// Expense donut (center 50% Salaries)
	});

	// Finance dashboard premium — CFO command center charts
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const primary = cv('--color-primary-600') || '#0F766E';
		const primary300 = cv('--color-primary-300') || '#5EEAD4';
		const success = cv('--color-success-500') || '#059669';
		const warning = cv('--color-warning-500') || '#D97706';
		const danger  = cv('--color-danger-500')  || '#DC2626';
		const accent  = cv('--color-accent-500')  || '#CA8A04';
		const info    = cv('--color-info-500')    || '#0EA5E9';
		const gray300 = cv('--color-gray-300')    || '#D8DCE3';
		const gray400 = cv('--color-gray-400')    || '#9096A1';
		const dark    = cv('--color-dark')        || '#1E293B';

		// Financial Health Score — radial gauge

		// KPI: Revenue sparkline (mini area)

		// KPI: Opex ratio ring

		// KPI: ROI ring

		// Cash Flow Intelligence — stacked bar (operating/investing/financing) + net line

		// Cash Burn gauge (semi circle)

		// Financial Forecast Center — best/expected/worst

		// Investment Portfolio performance line

		// Expense Breakdown — treemap

		// Risk Exposure — radar
	});

	// Pos Dashboard Charts
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const primary = cv('--color-primary') || '#0F766E', success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', pink = cv('--color-pink') || '#CC25B0', purple = cv('--color-purple') || '#6A1B9A', info = cv('--color-info') || '#0EA5E9', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';

		// Product Sales area+bar


		// Sales Vs Returns — bars with positive and negative


		// High Selling Categories — radar
	});

	// Support Dashboard Charts
    document.addEventListener('DOMContentLoaded', function () {
        const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
        const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', danger = cv('--color-danger') || '#B91C1C', info = cv('--color-info') || '#0EA5E9', purple = cv('--color-purple') || '#6A1B9A', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';

        // Ticket Volume — stacked-style bars (Created back, Resolved front)

        // SLA Breaches pie


        // Satisfaction Rate gauge (semi-radial)

        // Ticket Response Rate (multi-line area)
    });

	// Sales Revenue Trends chart
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', gray400 = cv('--color-gray-400') || '#9096A1';

	});

	// Project Dashboard
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', pink = cv('--color-pink') || '#CC25B0', purple = cv('--color-purple') || '#6A1B9A', info = cv('--color-info') || '#0EA5E9', warning = cv('--color-warning') || '#D97706', danger = cv('--color-danger') || '#B91C1C', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';


		// Projects Progress 4-line chart

		// Task Summary donut

	});

	// Project Management Dashboard (new sections)
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const success = cv('--color-success') || '#059669', orange = cv('--color-orange') || '#E65100', purple = cv('--color-purple') || '#6A1B9A', info = cv('--color-info') || '#0EA5E9', warning = cv('--color-warning') || '#D97706', danger = cv('--color-danger') || '#B91C1C', primary = cv('--color-primary') || '#4F46E5', dark = cv('--color-dark') || '#1E293B', gray400 = cv('--color-gray-400') || '#9096A1';

		// 8 KPI sparklines
		[
			{ id: 'kpi-spark-1', color: primary, data: [110,118,112,124,120,130,126,136,132,140,136,148] },
			{ id: 'kpi-spark-2', color: success, data: [60,64,62,70,68,74,72,80,78,86,84,96] },
			{ id: 'kpi-spark-3', color: danger,  data: [360,352,348,336,330,322,318,326,320,314,318,312] },
			{ id: 'kpi-spark-4', color: info,    data: [86,88,87,90,89,92,91,93,92,94,95,96] },
			{ id: 'kpi-spark-5', color: purple,  data: [74,76,78,80,82,84,86,85,88,90,91,92] },
			{ id: 'kpi-spark-6', color: warning, data: [60,62,64,66,68,70,71,73,74,75,77,78] },
			{ id: 'kpi-spark-7', color: danger,  data: [18,20,19,22,21,24,23,25,24,26,25,27] },
			{ id: 'kpi-spark-8', color: success, data: [4.1,4.2,4.2,4.3,4.3,4.4,4.4,4.5,4.5,4.5,4.6,4.6] }
		].forEach(s => { if (document.getElementById(s.id)) new ApexCharts(document.getElementById(s.id), { chart: { type: 'line', height: 32, sparkline: { enabled: true } }, series: [{ data: s.data }], stroke: { curve: 'smooth', width: 2 }, colors: [s.color], tooltip: { enabled: false } }).render(); });

		// Resource Allocation heatmap

		// Risk Assessment scatter matrix

	});

	// Progress Segment Dashboard Chart
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const successColor = cv('--color-success') || '#00966b';
		const lightBg = '#f1f5f9';

});

	// Simple Line
	if (document.getElementById('s-line')) {
		const sline = {
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				},
				toolbar: {
					show: false,
				},
				borderWidth: 1,
				borderColor: '#000',
			},
			colors: ['var(--color-primary)'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight',
				width: 2,
			},
			series: [{
				name: "Desktops",
				data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
			}],
			title: {
				text: 'Product Trends by Month',
				align: 'left',
				style: {
					color: 'var(--color-default)',
				},
			},
			grid: {
				borderColor: 'var(--color-border-color)',
				row: {

					opacity: 0.5
				},
				padding: {
					left: -5,
					right: 0,
				},
			},
			xaxis: {
				labels: {
					style: {
						colors: 'var(--color-default)',
					},
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				},
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
			},
			yaxis: {
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
					},
				},
			},
		}

		const chart = new ApexCharts(
			document.querySelector("#s-line"),
			sline
		);

		chart.render();
	}

	// Simple Line Area
	if (document.getElementById('s-line-area')) {
		const sLineArea = {
			chart: {
				height: 350,
				type: 'area',
				toolbar: {
					show: false,
				}
			},
			colors: ['var(--color-primary)', 'var(--color-warning)'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight',
				width: 1,
			},
			grid: {
				borderColor: 'var(--color-border-color)',
				padding: {
					left: -5,
					right: -15,
				},
			},
			series: [{
				name: 'Income',
				data: [40, 56, 28, 50, 42, 50, 60]
			}, {
				name: 'Expense',
				data: [20, 36, 20, 40, 25, 40, 30]
			}],

			xaxis: {
				labels: {
					style: {
						colors: 'var(--color-default)',
					},
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				},
				type: 'datetime',
				categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T05:35:00"],
			},
			tooltip: {
				x: {
					format: 'dd/MM/yy HH:mm'
				},
			},
			yaxis: {
				min: 0,
				max: 60,
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
					},
				},
			},
			legend: {
				labels: {
					colors: 'var(--color-default)',
				}
			},
		}

		const chart = new ApexCharts(
			document.querySelector("#s-line-area"),
			sLineArea
		);

		chart.render();
	}

	if (document.getElementById('s-col')) {
		const sCol = {
			chart: {
				height: 290,
				type: 'bar',
				toolbar: {
					show: false,
				}
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '50%',
					borderRadius: 5,
					endingShape: 'rounded', // This rounds the top edges of the bars
				},
			},
			colors: ['var(--color-primary-500)', 'var(--color-success-500)', 'var(--color-warning-500)'],
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},

			series: [{
				name: 'Inprogress',
				data: [19, 65, 19, 19, 19, 19, 19]
			}, {
				name: 'Active',
				data: [89, 45, 89, 46, 61, 25, 79]
			},
			{
				name: 'Completed',
				data: [39, 39, 39, 80, 48, 48, 48]
			}],
			xaxis: {
				categories: ['15 Jan', '16 Jan', '17 Jan', '18 Jan', '19 Jan', '20 Jan', '21 Jan'],
				labels: {
					style: {
						colors: 'var(--color-default)',
						fontSize: '12px',
					}
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				},
			},
			yaxis: {
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
						fontSize: '14px',
					}
				}
			},
			grid: {
				borderColor: 'var(--color-border-color)',
				strokeDashArray: 5,
				padding: {
					left: -8,
					right: -15,
				},
			},
			fill: {
				opacity: 1
			},
			tooltip: {
				y: {
					formatter: function (val) {
						return "" + val + "%"
					}
				}
			},
			legend: {
				labels: {
					colors: 'var(--color-default)',
				}
			},
		}

		const chart = new ApexCharts(
			document.querySelector("#s-col"),
			sCol
		);

		chart.render();
	}

	// Simple Column Stacked
	if (document.getElementById('s-col-stacked')) {
		const sColStacked = {
			chart: {
				height: 290,
				type: 'bar',
				stacked: true,
				toolbar: {
					show: false,
				}
			},
			responsive: [{
				breakpoint: 480,
				options: {
					legend: {
						position: 'bottom',
						offsetX: -10,
						offsetY: 0
					}
				}
			}],
			plotOptions: {
				bar: {
					horizontal: false,
				},
			},
			grid: {
				borderColor: 'var(--color-border-color)',
				padding: {
					left: -5,
					right: -15,
				},
			},
			colors: ['var(--color-primary-500)', 'var(--color-success-500)', 'var(--color-warning-500)', 'var(--color-pink-500)'],
			series: [{
				name: 'Laptops',
				data: [44, 55, 41, 67, 22, 43]
			}, {
				name: 'Cosmetics',
				data: [13, 23, 20, 8, 13, 27]
			}, {
				name: 'Medical Devices',
				data: [11, 17, 15, 15, 21, 14]
			}, {
				name: 'Software',
				data: [21, 7, 25, 13, 22, 8]
			}],
			yaxis: {
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
					},
				},
			},
			xaxis: {
				labels: {
					style: {
						colors: 'var(--color-default)',
					},
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				},
				type: 'datetime',
				categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
			},
			legend: {
				labels: {
					colors: 'var(--color-default)',
				},
			},
			fill: {
				opacity: 1
			},
		}

		const chart = new ApexCharts(
			document.querySelector("#s-col-stacked"),
			sColStacked
		);

		chart.render();
	}

	// Simple Bar
	if (document.getElementById('s-bar')) {
		const sBar = {
			chart: {
				height: 350,
				type: 'bar',
				toolbar: {
					show: false,
				}
			},
			colors: ['var(--color-primary-600)'],
			grid: {
				borderColor: 'var(--color-border-color)',
				padding: {
					left: 0,
					right: -15,
				},
			},
			plotOptions: {
				bar: {
					horizontal: true,
				}
			},
			dataLabels: {
				enabled: false
			},
			series: [{
				data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
			}],
			xaxis: {
				labels: {
					style: {
						colors: 'var(--color-default)',
					},
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				},
				categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
			},
			yaxis: {
				labels: {
					offsetX: -10,
					style: {
						colors: 'var(--color-default)',
					},
				},
			},
		}

		const chart = new ApexCharts(
			document.querySelector("#s-bar"),
			sBar
		);

		chart.render();
	}

	// Mixed Chart
	if (document.getElementById('mixed-chart')) {
		const options = {
			chart: {
				height: 350,
				type: 'line',
				toolbar: {
					show: false,
				}
			},
			colors: ['var(--color-primary-600)', 'var(--color-success-600)'],
			series: [{
				name: 'Website Blog',
				type: 'column',
				data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
			}, {
				name: 'Social Media',
				type: 'line',
				data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
			}],
			stroke: {
				width: [0, 4]
			},
			grid: {
				borderColor: 'var(--color-border-color)',
				padding: {
					left: -5,
					right: -15,
				},
			},
			title: {
				text: 'Traffic Sources',
				style: {
					color: 'var(--color-default)',
				},
			},
			legend: {
				labels: {
					colors: 'var(--color-default)',
				}
			},
			labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
			xaxis: {
				type: 'datetime',
				labels: {
					style: {
						colors: 'var(--color-default)',
					},
				},
				axisBorder: {
					color: ['var(--color-border-color)'],
				},
				axisTicks: {
					color: ['var(--color-border-color)'],
				}
			},
			yaxis: [{
				title: {
					text: 'Website Blog',
				},
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
					},
				},

			}, {
				opposite: true,
				title: {
					text: 'Social Media'
				},
				labels: {
					offsetX: -15,
					style: {
						colors: 'var(--color-default)',
					},
				},
			}]

		}

		const chart = new ApexCharts(
			document.querySelector("#mixed-chart"),
			options
		);

		chart.render();
	}

	// Donut Chart
	if (document.getElementById('donut-chart')) {
		const donutChart = {
			chart: {
				height: 330,
				type: 'donut',
				toolbar: {
					show: false,
				}
			},
			legend: {
				position: 'bottom',
				labels: {
					colors: 'var(--color-default)',
				}
			},
			colors: ['var(--color-primary-600)', 'var(--color-success-600)', 'var(--color-warning-600)', 'var(--color-pink-600)'],
			labels: ['Laptops', 'Cosmetics', 'Medical Devices', 'Software'],
			series: [44, 55, 41, 17],
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}]
		}

		const donut = new ApexCharts(
			document.querySelector("#donut-chart"),
			donutChart
		);

		donut.render();
	}

	// Radial Chart
	if (document.getElementById('radial-chart')) {
		const radialChart = {
			chart: {
				height: 350,
				type: 'radialBar',
				toolbar: {
					show: false,
				}
			},
			colors: ['var(--color-primary-600)', 'var(--color-success-600)', 'var(--color-warning-600)', 'var(--color-pink-600)'],
			plotOptions: {
				radialBar: {
					dataLabels: {
						name: {
							fontSize: '22px',
							color: 'var(--color-title)',
						},
						value: {
							fontSize: '16px',
							color: 'var(--color-default)',
						},
						total: {
							show: true,
							label: 'Total',
							color: 'var(--color-default)',
							formatter: function (w) {
								return 249
							}
						}
					}
				}
			},
			series: [44, 55, 67, 83],
			labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
		}

		const chart = new ApexCharts(
			document.querySelector("#radial-chart"),
			radialChart
		);

		chart.render();
	}

	// CRM Dashboard — Admin overview widgets
	document.addEventListener('DOMContentLoaded', function () {
		const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		const primary = cv('--color-primary-600') || '#0F766E';
		const success = cv('--color-success-500') || '#059669';
		const warning = cv('--color-warning-500') || '#D97706';
		const danger  = cv('--color-danger-500')  || '#DC2626';
		const info    = cv('--color-info-500')    || '#0EA5E9';
		const gray300 = cv('--color-gray-300')    || '#D8DCE3';

		// Contact Status — concentric multi-ring radial chart

		// Deal Win Rate — horizontal bar by outcome

		// Revenue Trend — 7-day sparkline area chart

		// Sales Tasks — full radial gauge

		// Sales Overview — monthly income bar

		// ===== Deals Workspace CRM (crmx-*) =====
		const purple = '#6d28d9';

		// Stat strip mini sparklines
		const statSparks = [
			['crmx-stat-pipeline', [30, 33, 31, 35, 38, 40, 42], warning, 'bar'],
			['crmx-stat-deals', [260, 271, 268, 284, 296, 305, 312], primary, 'line'],
			['crmx-stat-winrate', [50, 52, 53, 55, 57, 58, 59], success, 'line']
		];
		statSparks.forEach(([id, data, color, type]) => {
			if (document.getElementById(id)) {
				new ApexCharts(document.getElementById(id), {
					chart: { type, height: 26, sparkline: { enabled: true } },
					series: [{ data }],
					stroke: { curve: 'smooth', width: 2 },
					colors: [color],
					plotOptions: { bar: { columnWidth: '55%', borderRadius: 2 } },
					fill: type === 'line' ? { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.02 } } : {},
					tooltip: { enabled: false }
				}).render();
			}
		});

		// Revenue Forecast Timeline — actual vs forecast
		if (document.getElementById('crmx-revenue-trend')) {
			new ApexCharts(document.getElementById('crmx-revenue-trend'), {
				chart: { type: 'line', height: 240, toolbar: { show: false } },
				series: [
					{ name: 'Actual MRR', data: [142, 151, 158, 163, 171, 178, 184] },
					{ name: 'Forecast', data: [140, 146, 152, 158, 164, 170, 176] }
				],
				stroke: { curve: 'smooth', width: [3, 2.5], dashArray: [0, 5] },
				colors: [purple, gray300],
				fill: { type: ['gradient', 'solid'], gradient: { opacityFrom: 0.35, opacityTo: 0.02 }, opacity: [1, 1] },
				grid: { borderColor: gray300 },
				xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
				legend: { fontSize: '11px', markers: { size: 6 } },
				tooltip: { y: { formatter: (v) => '$' + v + 'K' } }
			}).render();
		}

		// Deal Sources — where opportunities originate (donut)
		if (document.getElementById('crmx-customer-donut')) {
			new ApexCharts(document.getElementById('crmx-customer-donut'), {
				chart: { type: 'donut', height: 220, toolbar: { show: false } },
				series: [246, 168, 122, 74, 38],
				labels: ['Organic Search', 'Referral', 'Paid Ads', 'Email Campaign', 'Events'],
				colors: [purple, primary, info, warning, gray300],
				dataLabels: { enabled: false },
				legend: { position: 'bottom', fontSize: '10.5px', markers: { size: 7 } },
				plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Leads', fontSize: '11px', formatter: () => '648' } } } } },
				stroke: { width: 2 },
				tooltip: { y: { formatter: (v) => v + ' leads' } }
			}).render();
		}

		// Geographic Customer Intelligence — revenue by region
		if (document.getElementById('crmx-region-bar')) {
			new ApexCharts(document.getElementById('crmx-region-bar'), {
				chart: { type: 'bar', height: 240, toolbar: { show: false } },
				series: [{ name: 'Revenue', data: [842, 614, 398, 226, 118] }],
				plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '50%', distributed: true } },
				dataLabels: { enabled: true, offsetX: 20, style: { fontSize: '11px', fontWeight: 700, colors: [cv('--text-primary') || '#1E293B'] }, formatter: (v) => '$' + v + 'K' },
				colors: [primary, purple, info, warning, gray300],
				legend: { show: false },
				grid: { borderColor: gray300, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
				xaxis: { categories: ['North America', 'Europe', 'APAC', 'LATAM', 'MEA'], max: 1000 },
				tooltip: { y: { formatter: (v) => '$' + v + 'K revenue' } }
			}).render();
		}
	});
})();


// ---- agent-performance-report-charts.js ----
// ---- agent-performance-report-charts.js ----------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
        const primary = cssVar('--color-primary-600', '#187F65');
        const success = cssVar('--color-success-500', '#1E9E6B');
        const warning = cssVar('--color-warning-500', '#DC9A2C');
        const danger  = cssVar('--color-danger-500', '#D0504C');

        const gaugeScores = [96, 93, 88, 84, 76];
        gaugeScores.forEach((score, i) => {
          const el = document.getElementById('csatGauge' + (i + 1));
          if (!el) return;
          const color = score >= 90 ? success : score >= 80 ? primary : score >= 70 ? warning : danger;
          new ApexCharts(el, {
            chart: { type: 'radialBar', height: 90, width: 90, fontFamily: 'inherit' },
            series: [score],
            colors: [color],
            plotOptions: { radialBar: { hollow: { size: '58%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { fontSize: '13px', fontWeight: 700, offsetY: 5, formatter: (v) => v + '%' } } } }
          }).render();
        });
});
})();


// ---- audit-log-report-charts.js ----
// ---- audit-log-report-charts.js ------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
        const primary = cssVar('--color-primary-500', '#24997C');
        const info    = cssVar('--color-info-400', '#5A91C2');
        const warning = cssVar('--color-warning-400', '#E7A93F');
        const danger  = cssVar('--color-danger-400', '#DA6763');

        if (document.getElementById('auditTrendChart')) {
          new ApexCharts(document.getElementById('auditTrendChart'), {
            chart: { type: 'bar', height: 260, toolbar: { show: false }, stacked: true, fontFamily: 'inherit' },
            series: [
              { name: 'Create', data: [120, 140, 110, 160, 132, 90, 150] },
              { name: 'Update', data: [80, 96, 74, 102, 88, 60, 98] },
              { name: 'Login', data: [50, 62, 48, 70, 58, 40, 64] },
              { name: 'Delete', data: [30, 38, 28, 44, 34, 20, 40] }
            ],
            xaxis: { categories: ['Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { fontSize: '11px' } } },
            colors: [primary, info, warning, danger],
            plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
            dataLabels: { enabled: false },
            legend: { position: 'bottom', fontSize: '11px' },
            grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
          }).render();
        }

        if (document.getElementById('auditActionChart')) {
          new ApexCharts(document.getElementById('auditActionChart'), {
            chart: { type: 'donut', height: 110, width: 110, fontFamily: 'inherit' },
            series: [40, 28, 18, 14],
            labels: ['Create', 'Update', 'Login', 'Delete'],
            colors: [primary, info, warning, danger],
            legend: { show: false },
            dataLabels: { enabled: false },
            stroke: { width: 1, colors: ['var(--surface-raised)'] },
            plotOptions: { pie: { donut: { size: '68%' } } }
          }).render();
        }
});
})();


// ---- budget-vs-actual-report-charts.js ----
// ---- budget-vs-actual-report-charts.js -----------------------------------------
// Reserved for Budget vs Actual Report chart initialization.


// ---- cash-flow-report-charts.js ----
// ---- cash-flow-report-charts.js ------------------------------------------------
// Reserved for Cash Flow Report chart initialization.


// ---- crm-activity-report-charts.js ----
// ---- crm-activity-report-charts.js ---------------------------------------------
// Reserved for Activity Report chart initialization.


// ---- deals-pipeline-report-charts.js ----
// ---- deals-pipeline-report-charts.js -------------------------------------------
// Reserved for Deals Pipeline Report chart initialization.


// ---- employee-performance-report-charts.js ----
// ---- employee-performance-report-charts.js -------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-500', '#DC9A2C');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('empRadarChart')) {
    new ApexCharts(document.getElementById('empRadarChart'), {
      chart: { type: 'radar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'Priya Sharma', data: [94, 92, 96, 90] },
        { name: 'Team Average', data: [77, 74, 80, 76] }
      ],
      xaxis: { categories: ['Goals Met', 'Quality', 'Collaboration', 'Initiative'], labels: { style: { fontSize: '11px' } } },
      colors: [success, cssVar('--color-neutral-400', '#98A29B')],
      markers: { size: 3 },
      fill: { opacity: [0.3, 0.1] },
      legend: { position: 'bottom', fontSize: '11px' }
    }).render();
  }
});
})();


// ---- hr-attendance-report-charts.js ----
// ---- hr-attendance-report-charts.js --------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-500', '#24997C');
  const warning = cssVar('--color-warning-400', '#E7A93F');
  const danger  = cssVar('--color-danger-400', '#DA6763');
  const info    = cssVar('--color-info-400', '#5A91C2');

  if (document.getElementById('attendanceDonutChart')) {
    new ApexCharts(document.getElementById('attendanceDonutChart'), {
      chart: { type: 'donut', height: 130, width: 130, fontFamily: 'inherit' },
      series: [78, 10, 7, 5],
      labels: ['Present', 'Late', 'Absent', 'Leave'],
      colors: [primary, warning, danger, info],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('attendanceTrendChart')) {
    new ApexCharts(document.getElementById('attendanceTrendChart'), {
      chart: { type: 'bar', height: 200, toolbar: { show: false }, stacked: true, fontFamily: 'inherit' },
      series: [
        { name: 'Present', data: [212, 208, 216, 210, 214, 218, 220] },
        { name: 'Late', data: [22, 26, 20, 24, 18, 20, 16] },
        { name: 'Absent', data: [16, 14, 12, 18, 16, 10, 14] }
      ],
      xaxis: { categories: ['Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary, warning, danger],
      plotOptions: { bar: { borderRadius: 3, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- lead-conversion-report-charts.js ----
// ---- lead-conversion-report-charts.js ------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const accent  = cssVar('--color-accent-500', '#E8830F');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const gray    = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('leadFunnelChart')) {
    new ApexCharts(document.getElementById('leadFunnelChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Count', data: [1840, 882, 344, 93] }],
      xaxis: { categories: ['Leads', 'Qualified', 'Opportunity', 'Won'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '50%', distributed: false } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('leadSourceChart')) {
    new ApexCharts(document.getElementById('leadSourceChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [612, 384, 298, 246, 300],
      labels: ['Organic Search', 'Referral Program', 'LinkedIn Ads', 'Webinar Signup', 'Partner Network'],
      colors: [primary, info, accent, success, gray],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- leave-report-charts.js ----
// ---- leave-report-charts.js ----------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const info    = cssVar('--color-info-400', '#5A91C2');
  const primary = cssVar('--color-primary-500', '#24997C');
  const accent  = cssVar('--color-accent-400', '#F8A22C');
  const danger  = cssVar('--color-danger-400', '#DA6763');

  if (document.getElementById('leaveTypeChart')) {
    new ApexCharts(document.getElementById('leaveTypeChart'), {
      chart: { type: 'donut', height: 130, width: 130, fontFamily: 'inherit' },
      series: [34, 32, 24, 10],
      labels: ['Sick', 'Casual', 'Annual', 'Unpaid'],
      colors: [info, primary, accent, danger],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('leaveTrendChart')) {
    new ApexCharts(document.getElementById('leaveTrendChart'), {
      chart: { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Requests', data: [42, 38, 54, 61, 48, 68] }],
      xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- payroll-report-charts.js ----
// ---- payroll-report-charts.js --------------------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('payrollTrendChart')) {
    new ApexCharts(document.getElementById('payrollTrendChart'), {
      chart: { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Net Pay', data: [148200, 151600, 154800, 158200, 160100, 162250] }],
      xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '$' + Math.round(v / 1000) + 'K' } },
      colors: [primary],
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('payrollCompositionChart')) {
    new ApexCharts(document.getElementById('payrollCompositionChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [162250, 24150, 8600],
      labels: ['Net Pay', 'Deductions', 'Bonuses'],
      colors: [primary, danger, info],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- profit-loss-report-charts.js ----
// ---- profit-loss-report-charts.js ----------------------------------------------
// Reserved for Profit & Loss Report chart initialization.


// ---- project-progress-report-charts.js ----
// ---- project-progress-report-charts.js -----------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-500', '#24997C');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-500', '#DC9A2C');
  const danger  = cssVar('--color-danger-500', '#D0504C');
  const info    = cssVar('--color-info-500', '#3E7EAD');

  if (document.getElementById('projectProgressChart')) {
    new ApexCharts(document.getElementById('projectProgressChart'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Progress', data: [82, 54, 29, 97, 68] }],
      xaxis: { categories: ['Atlas CRM', 'Nimbus Mobile', 'Helios Migration', 'Orion Billing', 'Vertex Design'], labels: { style: { fontSize: '11px' } }, max: 100, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { max: 100, labels: { style: { fontSize: '11px' }, formatter: (v) => v + '%' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%',
        colors: { ranges: [{ from: 0, to: 40, color: danger }, { from: 41, to: 70, color: warning }, { from: 71, to: 100, color: success }] }
      } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('projectStatusChart')) {
    new ApexCharts(document.getElementById('projectStatusChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [2, 1, 1, 1],
      labels: ['On Track', 'At Risk', 'Delayed', 'In Progress'],
      colors: [success, warning, danger, info],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- purchase-order-report-charts.js ----
// ---- purchase-order-report-charts.js -------------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const gray    = cssVar('--color-neutral-400', '#98A29B');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('poVolumeChart')) {
    new ApexCharts(document.getElementById('poVolumeChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'POs Created', data: [26, 32, 28, 38, 34, 30] }],
      xaxis: { categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('poStatusChart')) {
    new ApexCharts(document.getElementById('poStatusChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [18, 32, 146, 7],
      labels: ['Draft', 'Sent', 'Received', 'Cancelled'],
      colors: [gray, primary, success, danger],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- resource-utilization-report-charts.js ----
// ---- resource-utilization-report-charts.js -------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-500', '#DC9A2C');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('utilizationChart')) {
    new ApexCharts(document.getElementById('utilizationChart'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Utilization', data: [95, 110, 75, 103, 90, 55] }],
      xaxis: { categories: ['E. Watson', 'N. Bennett', 'P. Nair', 'L. Fletcher', 'D. Okafor', 'S. Jennings'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => v + '%' } },
      annotations: { yaxis: [{ y: 100, borderColor: 'var(--text-tertiary)', strokeDashArray: 4, label: { text: '100% capacity', style: { fontSize: '10px' } } }] },
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%',
        colors: { ranges: [{ from: 0, to: 79, color: warning }, { from: 80, to: 100, color: success }, { from: 101, to: 200, color: danger }] }
      } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- revenue-report-charts.js ----
// ---- revenue-report-charts.js --------------------------------------------------
// Reserved for Revenue Report chart initialization.


// ---- sales-rep-performance-report-charts.js ----
// ---- sales-rep-performance-report-charts.js ------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-500', '#DC9A2C');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('repRevenueChart')) {
    new ApexCharts(document.getElementById('repRevenueChart'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Revenue', data: [286400, 241900, 213000, 178650, 142300] }],
      xaxis: { categories: ['P. Nathan', 'M. Whitfield', 'E. Ruiz', 'D. Ovbiagele', 'S. Lindqvist'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '$' + Math.round(v / 1000) + 'K' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => '$' + v.toLocaleString() } }
    }).render();
  }

  if (document.getElementById('repQuotaChart')) {
    new ApexCharts(document.getElementById('repQuotaChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [2, 1, 2],
      labels: ['110%+', '90-109%', 'Below 90%'],
      colors: [success, warning, danger],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- shipment-delivery-report-charts.js ----
// ---- shipment-delivery-report-charts.js ----------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-400', '#E7A93F');
  const danger  = cssVar('--color-danger-400', '#DA6763');
  const primary = cssVar('--color-primary-600', '#187F65');

  if (document.getElementById('shipmentStatusChart')) {
    new ApexCharts(document.getElementById('shipmentStatusChart'), {
      chart: { type: 'donut', height: 130, width: 130, fontFamily: 'inherit' },
      series: [78, 15, 7],
      labels: ['On-Time', 'Delayed', 'Failed'],
      colors: [success, warning, danger],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('shipmentCarrierChart')) {
    new ApexCharts(document.getElementById('shipmentCarrierChart'), {
      chart: { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Shipments', data: [612, 486, 398, 346] }],
      xaxis: { categories: ['FedEx', 'UPS', 'DHL', 'USPS'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- sla-compliance-report-charts.js ----
// ---- sla-compliance-report-charts.js -------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const success = cssVar('--color-success-500', '#1E9E6B');
  const primary = cssVar('--color-primary-600', '#187F65');

  if (document.getElementById('slaGaugeChart')) {
    new ApexCharts(document.getElementById('slaGaugeChart'), {
      chart: { type: 'radialBar', height: 200, fontFamily: 'inherit' },
      series: [91.4],
      colors: [success],
      plotOptions: { radialBar: { hollow: { size: '65%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { fontSize: '26px', fontWeight: 700, offsetY: 8, formatter: (v) => v + '%' } } } }
    }).render();
  }

  if (document.getElementById('slaTrendChart')) {
    new ApexCharts(document.getElementById('slaTrendChart'), {
      chart: { type: 'line', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Compliance %', data: [88.2, 89.6, 90.1, 87.4, 92.0, 91.4] }],
      xaxis: { categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { min: 80, max: 100, labels: { style: { fontSize: '11px' }, formatter: (v) => v + '%' } },
      colors: [primary],
      stroke: { curve: 'smooth', width: 2.5 },
      dataLabels: { enabled: false },
      markers: { size: 4 },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- stock-movement-report-charts.js ----
// ---- stock-movement-report-charts.js -------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-500', '#24997C');
  const warning = cssVar('--color-warning-400', '#E7A93F');

  if (document.getElementById('stockMovementChart')) {
    new ApexCharts(document.getElementById('stockMovementChart'), {
      chart: { type: 'line', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'Inbound', data: [980, 1040, 1120, 1210, 1290, 1380] },
        { name: 'Outbound', data: [820, 860, 940, 1010, 1080, 1130] }
      ],
      xaxis: { categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary, warning],
      stroke: { curve: 'smooth', width: 2.5 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- stock-summary-report-charts.js ----
// ---- stock-summary-report-charts.js --------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-500', '#24997C');
  const info    = cssVar('--color-info-400', '#5A91C2');
  const accent  = cssVar('--color-accent-400', '#F8A22C');
  const warning = cssVar('--color-warning-400', '#E7A93F');
  const danger  = cssVar('--color-danger-500', '#D0504C');
  const success = cssVar('--color-success-500', '#1E9E6B');

  if (document.getElementById('stockLevelChart')) {
    new ApexCharts(document.getElementById('stockLevelChart'), {
      chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'In Stock', data: [184, 32, 420, 18, 96] },
        { name: 'Reorder Level', data: [50, 60, 100, 40, 75] }
      ],
      xaxis: { categories: ['Headphones', 'USB-C Cable', 'Crew Socks', 'Mug Set', 'Notebook'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [success, danger],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      dataLabels: { enabled: false },
      legend: { position: 'bottom', fontSize: '11px' },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- supplier-performance-report-charts.js ----
// ---- supplier-performance-report-charts.js -------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const warning = cssVar('--color-warning-500', '#DC9A2C');
  const danger  = cssVar('--color-danger-500', '#D0504C');

  if (document.getElementById('supplierScoreChart')) {
    new ApexCharts(document.getElementById('supplierScoreChart'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Score', data: [96, 92, 81, 74, 58] }],
      xaxis: { categories: ['Nova Components', 'Brightpack', 'Skyline Textiles', 'Everline', 'Harbor Freight'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { max: 100, labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%',
        colors: { ranges: [{ from: 0, to: 65, color: danger }, { from: 66, to: 85, color: warning }, { from: 86, to: 100, color: success }] }
      } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('supplierRadarChart')) {
    new ApexCharts(document.getElementById('supplierRadarChart'), {
      chart: { type: 'radar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Nova Components', data: [97, 96, 92] }],
      xaxis: { categories: ['On-Time', 'Quality', 'Speed'], labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      markers: { size: 3 },
      fill: { opacity: 0.25 }
    }).render();
  }
});
})();


// ---- system-usage-report-charts.js ----
// ---- system-usage-report-charts.js ---------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const warning = cssVar('--color-warning-500', '#DC9A2C');

  if (document.getElementById('usageLoadChart')) {
    new ApexCharts(document.getElementById('usageLoadChart'), {
      chart: { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Requests/min', data: [420, 460, 380, 510, 590, 640, 720, 680, 610, 540, 480, 520] }],
      xaxis: { categories: ['9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [info],
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 100] } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('usageCpuGauge')) {
    new ApexCharts(document.getElementById('usageCpuGauge'), {
      chart: { type: 'radialBar', height: 140, fontFamily: 'inherit' },
      series: [62],
      colors: [warning],
      plotOptions: { radialBar: { hollow: { size: '65%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { fontSize: '20px', fontWeight: 700, offsetY: 6, formatter: (v) => v + '%' } } } }
    }).render();
  }

});
})();


// ---- task-completion-report-charts.js ----
// ---- task-completion-report-charts.js ------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const success = cssVar('--color-success-500', '#1E9E6B');
  const primary = cssVar('--color-primary-500', '#24997C');
  const danger  = cssVar('--color-danger-500', '#D0504C');
  const warning = cssVar('--color-warning-500', '#DC9A2C');

  if (document.getElementById('taskStatusChart')) {
    new ApexCharts(document.getElementById('taskStatusChart'), {
      chart: { type: 'donut', height: 130, width: 130, fontFamily: 'inherit' },
      series: [48, 28, 14, 10],
      labels: ['Done', 'In Progress', 'Overdue', 'To Do'],
      colors: [success, primary, danger, warning],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('taskTrendChart')) {
    new ApexCharts(document.getElementById('taskTrendChart'), {
      chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Completed', data: [22, 28, 24, 34, 30, 38] }],
      xaxis: { categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [success],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '48%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- tax-summary-report-charts.js ----
// ---- tax-summary-report-charts.js ----------------------------------------------
// Reserved for Tax Summary Report chart initialization.


// ---- ticket-summary-report-charts.js ----
// ---- ticket-summary-report-charts.js -------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const info    = cssVar('--color-info-400', '#5A91C2');
  const warning = cssVar('--color-warning-400', '#E7A93F');
  const success = cssVar('--color-success-400', '#47C488');
  const gray    = cssVar('--color-neutral-400', '#98A29B');
  const danger  = cssVar('--color-danger-500', '#D0504C');
  const primary = cssVar('--color-primary-500', '#24997C');

  if (document.getElementById('ticketStatusChart')) {
    new ApexCharts(document.getElementById('ticketStatusChart'), {
      chart: { type: 'donut', height: 130, width: 130, fontFamily: 'inherit' },
      series: [34, 24, 28, 14],
      labels: ['Open', 'Pending', 'Resolved', 'Closed'],
      colors: [info, warning, success, gray],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('ticketPriorityChart')) {
    new ApexCharts(document.getElementById('ticketPriorityChart'), {
      chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Tickets', data: [42, 68, 34] }],
      xaxis: { categories: ['High', 'Medium', 'Low'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [danger],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '40%',
        colors: { ranges: [{ from: 0, to: 1000, color: primary }] }
      } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- time-tracking-report-charts.js ----
// ---- time-tracking-report-charts.js --------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const accent  = cssVar('--color-accent-500', '#E8830F');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const gray    = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('timeTrackingTrendChart')) {
    new ApexCharts(document.getElementById('timeTrackingTrendChart'), {
      chart: { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Hours', data: [32, 36, 34, 40, 38, 44, 42] }],
      xaxis: { categories: ['Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('timeTrackingProjectChart')) {
    new ApexCharts(document.getElementById('timeTrackingProjectChart'), {
      chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
      series: [62, 54, 48, 42, 36.5],
      labels: ['Atlas CRM', 'Nimbus Mobile', 'Orion Billing', 'Vertex Design', 'Helios Migration'],
      colors: [primary, info, accent, success, gray],
      legend: { position: 'bottom', fontSize: '11px' },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] }
    }).render();
  }
});
})();


// ---- ai-analytics charts (migrated from inline) ----
if (document.getElementById('ai-inference-volume-chart')) {
    new ApexCharts(document.getElementById('ai-inference-volume-chart'), {
        chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [{ name: 'Requests', data: [6.1, 6.4, 6.2, 6.8, 7.1, 7.4, 7.2, 7.8, 8.1, 8.4, 8.2, 8.6, 8.9, 8.92] }],
        xaxis: { categories: ['Jul 9','Jul 10','Jul 11','Jul 12','Jul 13','Jul 14','Jul 15','Jul 16','Jul 17','Jul 18','Jul 19','Jul 20','Jul 21','Jul 22'], labels: { style: { fontSize: '10.5px' } } },
        yaxis: { labels: { style: { fontSize: '10.5px' }, formatter: v => v + 'M' } },
        colors: ['var(--color-primary-500)'],
        fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', shadeIntensity: 0.4, gradientToColors: ['var(--color-accent-500)'], inverseColors: false, opacityFrom: 1, opacityTo: 0.85, stops: [0, 100] } },
        plotOptions: { bar: { columnWidth: '70%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4, borderColor: 'var(--border-subtle)' },
        tooltip: { y: { formatter: v => v + 'M requests' } }
    }).render();
}

if (document.getElementById('ai-token-donut-chart')) {
    new ApexCharts(document.getElementById('ai-token-donut-chart'), {
        chart: { type: 'donut', height: 270, fontFamily: 'inherit' },
        series: [104, 78, 62, 34],
        labels: ['Chat completion', 'Code generation', 'Embeddings', 'Summarization'],
        colors: ['var(--color-primary-600)', 'var(--color-primary-400)', 'var(--color-accent-500)', 'var(--color-primary-200)'],
        stroke: { width: 2, colors: ['var(--surface-raised)'] },
        legend: { show: true, position: 'bottom', horizontalAlign: 'left', fontSize: '11.5px', markers: { width: 8, height: 8, offsetY: 1 }, itemMargin: { horizontal: 8, vertical: 4 } },
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: v => v + 'M tokens' } },
        plotOptions: { pie: { donut: { size: '72%', labels: { show: true, name: { show: true, fontSize: '11.5px', offsetY: -4 }, value: { show: true, fontSize: '20px', fontWeight: 'bold', offsetY: 2, formatter: v => v + 'M' }, total: { show: true, fontSize: '10.5px', label: 'Total tokens', color: 'var(--text-tertiary)', fontWeight: 'normal', formatter: w => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + 'M' } } } } }
    }).render();
}


// ---- traffic-report-charts.js ----
// ---- traffic-report-charts.js --------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const accent  = cssVar('--color-accent-500', '#E8830F');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const gray    = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('trafficTrendChart')) {
    new ApexCharts(document.getElementById('trafficTrendChart'), {
      chart: { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'Visits', data: [8200, 8900, 9400, 8700, 10100, 10800, 11260, 9940, 10820, 11480] },
        { name: 'Unique Visitors', data: [5600, 6000, 6400, 5900, 6800, 7300, 7820, 6580, 7140, 7640] }
      ],
      xaxis: { categories: ['Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary, info],
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 100] } },
      legend: { show: false },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('trafficSourcesChart')) {
    new ApexCharts(document.getElementById('trafficSourcesChart'), {
      chart: { type: 'donut', height: 110, width: 110, fontFamily: 'inherit' },
      series: [38, 24, 19, 12, 7],
      labels: ['Organic Search', 'Direct', 'Social', 'Referral', 'Email'],
      colors: [primary, info, accent, success, gray],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('trafficDeviceChart')) {
    new ApexCharts(document.getElementById('trafficDeviceChart'), {
      chart: { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Visits', data: [162400, 96200, 26000] }],
      xaxis: { categories: ['Desktop', 'Mobile', 'Tablet'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => Math.round(v / 1000) + 'K' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- user-activity-report-charts.js ----
// ---- user-activity-report-charts.js --------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const accent  = cssVar('--color-accent-500', '#E8830F');
  const success = cssVar('--color-success-500', '#1E9E6B');
  const gray    = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('uarTrendChart')) {
    new ApexCharts(document.getElementById('uarTrendChart'), {
      chart: { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Active Users', data: [1420, 1510, 1480, 1620, 1690, 1580, 1842] }],
      xaxis: { categories: ['Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [primary],
      stroke: { curve: 'smooth', width: 2.5 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }

  if (document.getElementById('uarModuleChart')) {
    new ApexCharts(document.getElementById('uarModuleChart'), {
      chart: { type: 'donut', height: 110, width: 110, fontFamily: 'inherit' },
      series: [32, 26, 18, 15, 9],
      labels: ['Billing', 'Support', 'Reports', 'Inventory', 'Other'],
      colors: [primary, info, accent, success, gray],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%' } } }
    }).render();
  }

  if (document.getElementById('uarHourChart')) {
    new ApexCharts(document.getElementById('uarHourChart'), {
      chart: { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Logins', data: [40, 28, 22, 60, 142, 168, 190, 210, 184, 96, 58, 34] }],
      xaxis: { categories: ['6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' } } },
      colors: [info],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- analytics-ecommerce charts (migrated from inline) ----
if (document.getElementById('bi-expense-donut-chart')) {
    new ApexCharts(document.getElementById('bi-expense-donut-chart'), {
        chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
        series: [2.1, 1.5, 0.9, 0.7],
        labels: ['Salaries & Benefits', 'Sales & Marketing', 'Infrastructure', 'G&A'],
        colors: ['var(--color-primary-600)', 'var(--color-info-500)', 'var(--color-accent-500)', 'var(--color-neutral-400)'],
        stroke: { width: 2, colors: ['var(--surface-raised)'] },
        legend: { show: true, position: 'bottom', horizontalAlign: 'left', fontSize: '11.5px', markers: { width: 8, height: 8, offsetY: 1 }, itemMargin: { horizontal: 8, vertical: 4 } },
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: v => '$' + v + 'M' } },
        plotOptions: { pie: { donut: { size: '72%', labels: { show: true, name: { show: true, fontSize: '11.5px', offsetY: -4 }, value: { show: true, fontSize: '20px', fontWeight: 'bold', offsetY: 2, formatter: v => '$' + v + 'M' }, total: { show: true, fontSize: '10.5px', label: 'Total spend', color: 'var(--text-tertiary)', fontWeight: 'normal', formatter: w => '$' + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(1) + 'M' } } } } }
    }).render();
}

if (document.getElementById('bi-qoq-bar-chart')) {
    new ApexCharts(document.getElementById('bi-qoq-bar-chart'), {
        chart: { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [
            { name: 'Revenue', data: [15.2, 16.1, 16.5, 18.6] },
            { name: 'Expenses', data: [11.6, 11.9, 12.1, 12.4] }
        ],
        xaxis: { categories: ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'], labels: { style: { fontSize: '10.5px' } } },
        yaxis: { labels: { style: { fontSize: '10.5px' }, formatter: v => '$' + v + 'M' } },
        colors: ['var(--color-primary-500)', 'var(--color-neutral-400)'],
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4, borderColor: 'var(--border-subtle)' },
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '11.5px', markers: { width: 8, height: 8 } },
        tooltip: { y: { formatter: v => '$' + v + 'M' } }
    }).render();
}

var decisionTrackerOpenBtn = document.getElementById('decisionTrackerOpenBtn');
if (decisionTrackerOpenBtn) {
    decisionTrackerOpenBtn.addEventListener('click', function () {
        document.getElementById('decisionDrawer').classList.add('is-open');
        document.getElementById('decisionDrawerBackdrop').classList.remove('hidden');
    });
}
var decisionDrawerBackdropEl = document.getElementById('decisionDrawerBackdrop');
if (decisionDrawerBackdropEl) {
    decisionDrawerBackdropEl.addEventListener('click', function () {
        document.getElementById('decisionDrawer').classList.remove('is-open');
        decisionDrawerBackdropEl.classList.add('hidden');
    });
}
var decisionDrawerCloseBtn = document.getElementById('decisionDrawerCloseBtn');
if (decisionDrawerCloseBtn) {
    decisionDrawerCloseBtn.addEventListener('click', function () {
        document.getElementById('decisionDrawer').classList.remove('is-open');
        document.getElementById('decisionDrawerBackdrop').classList.add('hidden');
    });
}


// ---- accounting-dashboard charts (migrated from inline) ----
(function () {
    var primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600').trim() || '#187F65';
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500').trim() || '#E8830F';
    var success = getComputedStyle(document.documentElement).getPropertyValue('--color-success-500').trim() || '#1E9E6B';
    var warning = getComputedStyle(document.documentElement).getPropertyValue('--color-warning-500').trim() || '#DC9A2C';
    var danger = getComputedStyle(document.documentElement).getPropertyValue('--color-danger-500').trim() || '#D0504C';
    var info = getComputedStyle(document.documentElement).getPropertyValue('--color-info-500').trim() || '#3E7EAD';

    if (document.getElementById('acctHealthGauge')) {
        new ApexCharts(document.getElementById('acctHealthGauge'), {
            chart: { type: 'radialBar', height: 190, fontFamily: 'inherit' },
            series: [97],
            colors: [success],
            plotOptions: { radialBar: { hollow: { size: '68%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { fontSize: '24px', fontWeight: 800, offsetY: 8, formatter: (v) => v + '%' } } } }
        }).render();
    }

    if (document.getElementById('acctHealthSpark')) {
        new ApexCharts(document.getElementById('acctHealthSpark'), {
            chart: { type: 'line', height: 44, sparkline: { enabled: true } },
            series: [{ data: [91, 93, 92, 95, 94, 96, 97] }],
            stroke: { curve: 'smooth', width: 2 },
            colors: [primary],
            tooltip: { enabled: false }
        }).render();
    }

    [['kpiGl', [140, 144, 146, 149, 151, 153, 156], primary], ['kpiJournal', [4400, 4520, 4600, 4680, 4740, 4790, 4812], info]].forEach(function (cfg) {
        var el = document.getElementById(cfg[0]);
        if (el) {
            new ApexCharts(el, {
                chart: { type: 'area', height: 32, sparkline: { enabled: true } },
                series: [{ data: cfg[1] }],
                stroke: { curve: 'smooth', width: 2 },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
                colors: [cfg[2]],
                tooltip: { enabled: false }
            }).render();
        }
    });

    if (document.getElementById('acctGlOverviewChart')) {
        new ApexCharts(document.getElementById('acctGlOverviewChart'), {
            chart: { type: 'bar', height: 280, stacked: true, toolbar: { show: false } },
            series: [
                { name: 'Debits', data: [182, 164, 198, 176, 210, 158, 96, 190, 172, 204, 188, 166, 212, 180] },
                { name: 'Credits', data: [174, 170, 190, 182, 202, 150, 88, 196, 168, 198, 192, 172, 206, 176] }
            ],
            xaxis: { categories: ['Jul 8','Jul 9','Jul 10','Jul 11','Jul 12','Jul 13','Jul 14','Jul 15','Jul 16','Jul 17','Jul 18','Jul 19','Jul 20','Jul 21'], labels: { style: { colors: '#98A29B', fontSize: '10.5px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { colors: '#98A29B', fontSize: '10.5px' }, formatter: v => '$' + v + 'K' } },
            grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
            plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
            colors: [primary, accent],
            legend: { position: 'top', horizontalAlign: 'right', fontSize: '11px' },
            dataLabels: { enabled: false },
            tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'K' } }
        }).render();
    }

    if (document.getElementById('acctGlDonutChart')) {
        new ApexCharts(document.getElementById('acctGlDonutChart'), {
            chart: { type: 'donut', height: 280 },
            series: [853320, 257950, 612800, 842960, 231480],
            labels: ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'],
            colors: [primary, danger, accent, success, info],
            legend: { position: 'bottom', fontSize: '11px' },
            dataLabels: { enabled: false },
            plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', formatter: () => '$2.80M' } } } } },
            tooltip: { theme: 'dark', y: { formatter: v => '$' + Number(v).toLocaleString() } }
        }).render();
    }


    [['bsChart', [1644, 1668, 1690, 1702, 1718, 1730], primary], ['isChart', [240, 244, 251, 253, 258, 261], success], ['cfChart', [423, 418, 409, 415, 407, 412], warning]].forEach(function (cfg) {
        var el = document.getElementById(cfg[0]);
        if (el) {
            new ApexCharts(el, {
                chart: { type: 'area', height: 56, sparkline: { enabled: true } },
                series: [{ data: cfg[1] }],
                stroke: { curve: 'smooth', width: 2 },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
                colors: [cfg[2]],
                tooltip: { enabled: false }
            }).render();
        }
    });
})();


// ---- banking-dashboard charts (migrated from inline) ----

if (document.getElementById('paymentVolumeBarChart')) {
    new ApexCharts(document.getElementById('paymentVolumeBarChart'), {
        chart: { type: 'bar', height: 230, toolbar: { show: false } },
        series: [{ name: 'Volume ($M)', data: [412, 286, 198, 164, 121, 96, 58, 34] }],
        xaxis: { categories: ['Card Pay', 'Wire', 'SWIFT', 'Mobile', 'Online', 'ACH/UPI', 'QR', 'POS'], labels: { style: { colors: '#98A29B', fontSize: '10.5px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#98A29B', fontSize: '11px' }, formatter: v => '$' + v + 'M' } },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 4, distributed: true } },
        colors: ['#1E3FA0','#2A56C4','#3E7EAD','#4C79D6','#7FA3E6','#C4901D','#DDA92C','#98A29B'],
        legend: { show: false },
        dataLabels: { enabled: false },
        grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
        tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'M' } }
    }).render();
}


// ---- crypto-analytics charts (migrated from inline) ----
if (document.getElementById('cryptoGlobalTrendChart')) {
    new ApexCharts(document.getElementById('cryptoGlobalTrendChart'), {
        chart: { type: 'area', height: 130, toolbar: { show: false }, sparkline: { enabled: false } },
        series: [{ name: 'Market Cap ($T)', data: [2.18, 2.21, 2.19, 2.26, 2.24, 2.31, 2.29, 2.35, 2.33, 2.38, 2.36, 2.41] }],
        xaxis: { categories: ['12d','11d','10d','9d','8d','7d','6d','5d','4d','3d','2d','Now'], labels: { style: { fontSize: '9px', colors: 'var(--text-tertiary)' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { fontSize: '9px', colors: 'var(--text-tertiary)' } } },
        grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['var(--color-primary-500)'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] } },
        tooltip: { y: { formatter: v => '$' + v + 'T' } }
    }).render();
}

if (document.getElementById('cryptoPortfolioTrendChart')) {
    new ApexCharts(document.getElementById('cryptoPortfolioTrendChart'), {
        chart: { type: 'area', height: 60, sparkline: { enabled: true } },
        series: [{ data: [212, 228, 219, 235, 224, 244, 236, 258, 246, 268, 259, 285] }],
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#1E9E6B'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0, stops: [0, 100] } },
        tooltip: { enabled: true, y: { formatter: v => '$' + v + 'K' } }
    }).render();
}

if (document.getElementById('cryptoDefiTvlChart')) {
    new ApexCharts(document.getElementById('cryptoDefiTvlChart'), {
        chart: { type: 'area', height: 90, sparkline: { enabled: true } },
        series: [{ data: [82,84,83,88,90,89,93,95,94,96.4] }],
        stroke: { curve: 'smooth', width: 2 },
        colors: ['var(--color-primary-500)'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
        tooltip: { y: { formatter: v => '$' + v + 'B' } }
    }).render();
}


// ---- food-delivery charts (migrated from inline) ----
if (document.getElementById('marketplaceHealthGauge')) {
    new ApexCharts(document.getElementById('marketplaceHealthGauge'), {
        chart: { type: 'radialBar', height: 210 },
        series: [94.6, 96.2, 78.2],
        plotOptions: {
            radialBar: {
                hollow: { size: '38%' },
                track: { background: 'transparent', margin: 8 },
                dataLabels: {
                    name: { fontSize: '10px', color: '#98A29B', offsetY: -4 },
                    value: { fontSize: '24px', fontWeight: 700, offsetY: 6, formatter: v => v + '' },
                    total: { show: true, label: 'Health Score', fontSize: '10px', color: '#98A29B', formatter: () => '96' }
                }
            }
        },
        colors: ['#24997C', '#1D7A63', '#165C4A'],
        stroke: { lineCap: 'round' },
        labels: ['On-Time', 'CSAT', 'Utilization']
    }).render();
}

if (document.getElementById('gmvSparkline')) {
    new ApexCharts(document.getElementById('gmvSparkline'), {
        chart: { type: 'area', height: 40, sparkline: { enabled: true } },
        series: [{ data: [312,340,298,365,410,388,442,420,468,486] }],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: .4, opacityTo: 0 } },
        colors: ['#F5760A'],
        tooltip: { enabled: false }
    }).render();
}

if (document.getElementById('hourlyOrdersChart')) {
    new ApexCharts(document.getElementById('hourlyOrdersChart'), {
        chart: { type: 'area', height: 200, toolbar: { show: false } },
        series: [{ name: 'Orders', data: [420,380,340,520,860,1240,1620,1980,2260,2940,2410,1680] }],
        xaxis: { categories: ['9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p'], labels: { style: { colors: '#98A29B', fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#98A29B', fontSize: '10px' } } },
        grid: { borderColor: 'rgba(148,163,140,.15)', strokeDashArray: 4 },
        stroke: { curve: 'smooth', width: 2.5 },
        fill: { type: 'gradient', gradient: { opacityFrom: .35, opacityTo: 0 } },
        colors: ['#F5760A'],
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' }
    }).render();
}


// ---- hospital-management charts (migrated from inline) ----
if (document.getElementById('bloodBankChart')) {
    const data = [82, 24, 58, 41, 67, 15, 90, 33];
    new ApexCharts(document.getElementById('bloodBankChart'), {
        chart: { type: 'bar', height: 130, toolbar: { show: false } },
        series: [{ name: 'Stock level', data }],
        xaxis: { categories: ['O+','O-','A+','A-','B+','B-','AB+','AB-'], labels: { style: { colors: '#98A29B', fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { show: false, max: 100 },
        grid: { show: false, padding: { left: 0, right: 0, top: -10, bottom: 0 } },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 3, distributed: true, dataLabels: { position: 'top' } } },
        colors: data.map(v => v < 30 ? '#D0504C' : '#DC9A2C'),
        legend: { show: false },
        dataLabels: { enabled: true, offsetY: -18, style: { fontSize: '9.5px', colors: ['#5A625C'] }, formatter: v => v + '%' },
        tooltip: { theme: 'dark', y: { formatter: v => v + '% in stock' } }
    }).render();
}


// ---- hotel-management charts (migrated from inline) ----
if (document.getElementById('hotelScoreGauge')) {
    new ApexCharts(document.getElementById('hotelScoreGauge'), {
        chart: { type: 'radialBar', height: 84, sparkline: { enabled: true } },
        series: [93],
        plotOptions: { radialBar: { hollow: { size: '58%' }, track: { background: 'rgba(255,255,255,0.14)' }, dataLabels: { name: { show: false }, value: { fontSize: '15px', fontWeight: 700, offsetY: 5, color: '#fff', formatter: v => v + '%' } } } },
        colors: ['#DC9A2C'],
        fill: { type: 'gradient', gradient: { shade: 'light', type: 'horizontal', gradientToColors: ['#5B5FE9'], stops: [0, 100] } },
        stroke: { lineCap: 'round' }
    }).render();
}

if (document.getElementById('revenueBreakdownChart')) {
    new ApexCharts(document.getElementById('revenueBreakdownChart'), {
        chart: { type: 'bar', height: 130, stacked: true, stackType: '100%', toolbar: { show: false } },
        series: [
            { name: 'Rooms', data: [19900] },
            { name: 'Restaurant', data: [18400] },
            { name: 'Events', data: [12900] },
            { name: 'Spa', data: [4600] },
            { name: 'Other', data: [400] }
        ],
        colors: ['#DC9A2C', '#2FAE68', '#5B5FE9', '#3B9AE1', '#B8C0BB'],
        plotOptions: { bar: { horizontal: true, barHeight: '46%', borderRadius: 6, borderRadiusApplication: 'around' } },
        xaxis: { categories: ['Today'], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { show: false } },
        grid: { show: false },
        stroke: { width: 3, colors: ['var(--surface-raised)'] },
        dataLabels: {
            enabled: true,
            formatter: (val, opts) => '$' + (opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex] / 1000).toFixed(1) + 'K',
            style: { fontSize: '10.5px', fontWeight: 700, colors: ['#fff'] },
            dropShadow: { enabled: false }
        },
        tooltip: { y: { formatter: v => '$' + v.toLocaleString() } },
        legend: { show: false }
    }).render();
}


// ---- logistics-dashboard charts (migrated from inline) ----
if (document.getElementById('routeEfficiencyChart')) {
    new ApexCharts(document.getElementById('routeEfficiencyChart'), {
        chart: { type: 'bar', height: 150, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [{ name: 'Efficiency %', data: [88, 91, 87, 93, 95, 90, 93] }],
        xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], labels: { style: { colors: '#98A29B', fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { show: false },
        grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
        plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
        colors: ['#3E7EAD'],
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: v => v + '%' } }
    }).render();
}



// ---- lms-analytics charts (migrated from inline) ----


if (document.getElementById('lmsInstructorBarChart')) {
    new ApexCharts(document.getElementById('lmsInstructorBarChart'), {
        chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [
            { name: 'Rating (x20)', data: [98, 96, 94, 90] },
            { name: 'Satisfaction %', data: [96, 93, 91, 87] }
        ],
        xaxis: { categories: ['E. Vasquez', 'M. Chen', 'S. Mendes', 'J. Okafor'], labels: { style: { fontSize: '10.5px' } } },
        yaxis: { labels: { style: { fontSize: '10.5px' } } },
        colors: ['var(--color-primary-600)', 'var(--color-info-600)'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4, borderColor: 'var(--border-subtle)' },
        legend: { position: 'top', horizontalAlign: 'right', fontSize: '10.5px' },
        tooltip: { theme: 'light' }
    }).render();
}

if (document.getElementById('lmsAssessmentDonutChart')) {
    new ApexCharts(document.getElementById('lmsAssessmentDonutChart'), {
        chart: { type: 'donut', height: 220, fontFamily: 'inherit' },
        series: [82, 12, 6],
        labels: ['Passed', 'Retaken', 'Failed'],
        colors: ['var(--color-success-600)', 'var(--color-warning-600)', 'var(--color-danger-600)'],
        dataLabels: { enabled: true, style: { fontSize: '10.5px' } },
        legend: { position: 'bottom', fontSize: '11px' },
        stroke: { width: 2 },
        tooltip: { theme: 'light' }
    }).render();
}

if (document.getElementById('lmsRevenueMixedChart')) {
    new ApexCharts(document.getElementById('lmsRevenueMixedChart'), {
        chart: { type: 'line', height: 290, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [
            { name: 'Subscription', type: 'column', data: [620, 680, 710, 760, 810, 860] },
            { name: 'Corporate', type: 'column', data: [410, 440, 460, 500, 540, 580] },
            { name: 'Certification', type: 'column', data: [180, 190, 200, 214, 230, 244] },
            { name: 'Marketplace ARR', type: 'line', data: [1100, 1220, 1300, 1420, 1540, 1680] }
        ],
        xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], labels: { style: { fontSize: '10.5px' } } },
        yaxis: { labels: { style: { fontSize: '10.5px' }, formatter: v => '$' + v + 'K' } },
        colors: ['var(--color-primary-600)', 'var(--color-info-600)', 'var(--color-accent-600)', 'var(--color-warning-600)'],
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
        stroke: { curve: 'smooth', width: [0, 0, 0, 3] },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4, borderColor: 'var(--border-subtle)' },
        legend: { position: 'top', horizontalAlign: 'right', fontSize: '10.5px' },
        tooltip: { theme: 'light', shared: true }
    }).render();
}

var aiForecastDismissBtn = document.getElementById('aiForecastDismissBtn');
if (aiForecastDismissBtn) {
    aiForecastDismissBtn.addEventListener('click', function () {
        document.getElementById('aiForecastPanel').style.display = 'none';
    });
}


// ---- menu-builder charts (migrated from inline) ----
(function () {
    const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
    const primary = cssVar('--color-primary-600', '#187F65');
    const accent  = cssVar('--color-accent-500', '#E8830F');
    const success = cssVar('--color-success-500', '#1E9E6B');
    const warning = cssVar('--color-warning-500', '#E0A324');
    const info    = cssVar('--color-info-500', '#3E7EAD');
    const danger  = cssVar('--color-danger-500', '#D8493C');

    if (document.getElementById('menuCategorySalesChart')) {
        new ApexCharts(document.getElementById('menuCategorySalesChart'), {
            chart: { type: 'bar', height: 240, toolbar: { show: false } },
            series: [{ name: 'Items Sold', data: [352, 588, 276, 352, 470] }],
            xaxis: { categories: ['Starters', 'Mains', 'Sides', 'Desserts', 'Beverages'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { fontSize: '11px' } } },
            colors: [primary],
            plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
            dataLabels: { enabled: false },
            grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
        }).render();
    }

    if (document.getElementById('menuCategoryMixChart')) {
        new ApexCharts(document.getElementById('menuCategoryMixChart'), {
            chart: { type: 'donut', height: 220 },
            series: [8, 14, 7, 9, 10],
            labels: ['Starters', 'Mains', 'Sides', 'Desserts', 'Beverages'],
            colors: [accent, primary, warning, danger, info],
            legend: { position: 'bottom', fontSize: '11px', markers: { size: 6 } },
            dataLabels: { enabled: false },
            stroke: { width: 1, colors: ['var(--surface-raised)'] },
            plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Items', fontSize: '11px', formatter: () => '48' } } } } }
        }).render();
    }
})();


// ---- restaurant-pos charts (migrated from inline) ----
if (document.getElementById('posPerformanceGauge')) {
    new ApexCharts(document.getElementById('posPerformanceGauge'), {
        chart: { type: 'radialBar', height: 168, sparkline: { enabled: true } },
        series: [94],
        plotOptions: { radialBar: { startAngle: -130, endAngle: 130, hollow: { size: '72%' }, track: { background: 'rgba(255,255,255,0.08)', strokeWidth: '100%' }, dataLabels: { name: { show: false }, value: { show: false } } } },
        colors: ['#7FE0C4'],
        fill: { type: 'gradient', gradient: { shade: 'dark', type: 'horizontal', shadeIntensity: 0.4, gradientToColors: ['#4C8CF5'], inverseColors: false, opacityFrom: 1, opacityTo: 1, stops: [0, 100] } },
        stroke: { lineCap: 'round' }
    }).render();
}
if (document.getElementById('posHeroSparkline')) {
    new ApexCharts(document.getElementById('posHeroSparkline'), {
        chart: { type: 'area', height: 64, sparkline: { enabled: true } },
        series: [{ name: 'Revenue', data: [820,940,880,1120,1340,1210,1480,1620,1590,1780,1940,2010] }],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.02 } },
        colors: ['#7FE0C4'],
        tooltip: { enabled: true, theme: 'dark', y: { formatter: v => '$' + v } }
    }).render();
}

if (document.getElementById('posWeeklyRevenueChart')) {
    new ApexCharts(document.getElementById('posWeeklyRevenueChart'), {
        chart: { type: 'line', height: 260, toolbar: { show: false } },
        series: [
            { name: 'This week', data: [6200,5800,6900,7100,7600,8412,8100] },
            { name: 'Last week', data: [5900,5600,6400,6800,7000,7360,7480] }
        ],
        xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
        stroke: { curve: 'smooth', width: [3,2], dashArray: [0,4] },
        colors: ['#24997C', '#9AA3AC'],
        dataLabels: { enabled: false },
        legend: { show: true, position: 'top', horizontalAlign: 'right' },
        tooltip: { y: { formatter: v => '$' + v.toLocaleString() } }
    }).render();
}
if (document.getElementById('posCategorySplitChart')) {
    new ApexCharts(document.getElementById('posCategorySplitChart'), {
        chart: { type: 'donut', height: 240 },
        series: [5890, 1680, 842],
        labels: ['Food', 'Beverage', 'Dessert'],
        colors: ['#24997C', '#4C8CF5', '#F5A524'],
        legend: { show: true, position: 'bottom' },
        dataLabels: { enabled: true, formatter: (v) => v.toFixed(0) + '%' },
        plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Total', formatter: () => '$8,412' } } } } }
    }).render();
}

if (document.getElementById('posTopDishesChart')) {
    new ApexCharts(document.getElementById('posTopDishesChart'), {
        chart: { type: 'bar', height: 200, toolbar: { show: false } },
        series: [{ name: 'Units sold', data: [86, 74, 68, 61, 54] }],
        plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '55%' } },
        xaxis: { categories: ['Margherita', 'Cheeseburger', 'Ribeye 12oz', 'Pad Thai', 'Caesar Salad'] },
        colors: ['#24997C'],
        dataLabels: { enabled: true, style: { fontSize: '10px' } }
    }).render();
}


// ---- school-management charts (migrated from inline) ----
if (document.getElementById('studentEnrollmentTrendChart')) {
    new ApexCharts(document.getElementById('studentEnrollmentTrendChart'), {
        chart: { type: 'bar', height: 210, toolbar: { show: false } },
        series: [{ name: 'Enrolled Students', data: [1146, 1168, 1189, 1205, 1224, 1241, 1259, 1271, 1284] }],
        plotOptions: { bar: { borderRadius: 5, columnWidth: '55%' } },
        xaxis: { categories: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'], labels: { style: { colors: '#98A29B', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#98A29B', fontSize: '11px' } } },
        grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
        colors: ['#2A5CDB'],
        fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', shadeIntensity: 0.3, opacityFrom: 1, opacityTo: 0.6, stops: [0, 100] } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' }
    }).render();
}

if (document.getElementById('studentDistributionChart')) {
    new ApexCharts(document.getElementById('studentDistributionChart'), {
        chart: { type: 'donut', height: 220 },
        series: [486, 372, 271, 155],
        labels: ['Primary (1-5)', 'Middle (6-8)', 'Secondary (9-10)', 'Senior (11-12)'],
        colors: ['#2A5CDB', '#6D5CE0', '#10B77F', '#F59E0B'],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { width: 2, colors: ['var(--surface-raised)'] },
        plotOptions: { pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', formatter: () => '1,284' } } } } },
        tooltip: { theme: 'dark' }
    }).render();
}

if (document.getElementById('academicGrowthChart')) {
    new ApexCharts(document.getElementById('academicGrowthChart'), {
        chart: { type: 'area', height: 90, sparkline: { enabled: true } },
        series: [{ name: 'GPA', data: [3.48, 3.52, 3.55, 3.61, 3.64, 3.68, 3.70, 3.72] }],
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#10B77F'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0 } },
        tooltip: { theme: 'dark', y: { formatter: v => v.toFixed(2) } }
    }).render();
}

if (document.getElementById('libraryReadingTrendChart')) {
    new ApexCharts(document.getElementById('libraryReadingTrendChart'), {
        chart: { type: 'line', height: 70, sparkline: { enabled: true } },
        series: [{ name: 'Checkouts', data: [210, 245, 232, 268, 290, 305, 288, 312] }],
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#6D5CE0'],
        tooltip: { theme: 'dark' }
    }).render();
}

if (document.getElementById('financeBreakdownChart')) {
    new ApexCharts(document.getElementById('financeBreakdownChart'), {
        chart: { type: 'donut', height: 160 },
        series: [924.6, 218.4, 48.6],
        labels: ['Collected', 'Pending', 'Overdue'],
        colors: ['#10B77F', '#F59E0B', '#E23D53'],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { width: 2, colors: ['var(--surface-raised)'] },
        plotOptions: { pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Budget Used', fontSize: '10px', formatter: () => '64%' } } } } },
        tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'K' } }
    }).render();
}

if (document.getElementById('revenueTrendChart')) {
    new ApexCharts(document.getElementById('revenueTrendChart'), {
        chart: { type: 'bar', height: 210, toolbar: { show: false } },
        series: [{ name: 'Revenue ($K)', data: [98, 112, 105, 128, 134, 121, 142] }],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], labels: { style: { colors: '#98A29B', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#98A29B', fontSize: '11px' } } },
        colors: ['#2A5CDB'],
        grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'K' } }
    }).render();
}


// ---- seo-analytics-dashboard charts (migrated from inline) ----
if (document.getElementById('spotlightSpark')) {
    new ApexCharts(document.getElementById('spotlightSpark'), {
        chart: { type: 'line', height: 60, sparkline: { enabled: true } },
        series: [{ data: [14, 12, 13, 9, 8, 6, 5, 3] }],
        stroke: { width: 2.5, curve: 'smooth', dashArray: [0, 0, 0, 0, 0, 4, 4, 4] },
        colors: ['#4ADE80'],
        tooltip: { enabled: false }
    }).render();
}

if (document.getElementById('weeklyRankRange')) {
    new ApexCharts(document.getElementById('weeklyRankRange'), {
        chart: { type: 'rangeBar', height: 280, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, barHeight: '18%', rangeBarGroupRows: true, borderRadius: 4 } },
        series: [{
            data: [
                { x: 'Mon', y: [3, 9] },
                { x: 'Tue', y: [5, 11] },
                { x: 'Wed', y: [2, 16] },
                { x: 'Thu', y: [4, 10] },
                { x: 'Fri', y: [6, 8] },
                { x: 'Sat', y: [9, 18] },
                { x: 'Sun', y: [7, 14] }
            ]
        }],
        xaxis: { reversed: true, title: { text: 'SERP Position (lower is better)', style: { fontSize: '10px', color: 'var(--text-tertiary)' } }, labels: { style: { fontSize: '10px' } } },
        yaxis: { labels: { style: { fontSize: '11px' } } },
        colors: ['#3B82F6'],
        grid: { strokeDashArray: 4, borderColor: 'var(--border-subtle)' },
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: function (v) { return 'Position ' + v; } } }
    }).render();
}

if (document.getElementById('forecastChart')) {
    new ApexCharts(document.getElementById('forecastChart'), {
        chart: { type: 'area', height: 140, toolbar: { show: false }, sparkline: { enabled: false }, animations: { enabled: true } },
        series: [
            { name: 'Actual', data: [156000, 172000, 186400, null, null, null, null] },
            { name: 'Projected', data: [null, null, 186400, 204000, 221000, 236000, 248000] }
        ],
        stroke: { width: [2.5, 2.5], curve: 'smooth', dashArray: [0, 5] },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90] }
        },
        colors: ['#187F65', '#8B5CF6'],
        xaxis: {
            categories: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            labels: { style: { fontSize: '9.5px' } },
            axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false, padding: { left: 4, right: 4, top: 0, bottom: 0 } },
        legend: { show: false },
        dataLabels: { enabled: false },
        markers: { size: 0, hover: { size: 4 } },
        tooltip: { y: { formatter: function (v) { return v ? (v / 1000).toFixed(0) + 'K sessions' : ''; } } },
        annotations: {
            xaxis: [{ x: 'Jul', borderColor: 'var(--border-default)', strokeDashArray: 3, label: { text: 'Today', style: { fontSize: '9px', background: 'var(--surface-sunken)', color: 'var(--text-tertiary)' } } }]
        }
    }).render();
}

if (document.getElementById('serpTrendChart')) {
    new ApexCharts(document.getElementById('serpTrendChart'), {
        chart: { type: 'area', height: 90, toolbar: { show: false } },
        series: [{ name: 'Placements', data: [612, 648, 671, 705, 733, 757] }],
        xaxis: { categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], labels: { style: { fontSize: '9.5px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { show: false },
        stroke: { width: 2, curve: 'smooth' },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
        colors: ['var(--color-success-500)'],
        dataLabels: { enabled: false },
        grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
        tooltip: { y: { formatter: function (v) { return v + ' placements'; } } }
    }).render();
}


// ---- shipments charts (migrated from inline) ----
(function () {
    const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
    const primary = cssVar('--color-primary-600', '#187F65');
    const info    = cssVar('--color-info-500', '#3E7EAD');
    const warning = cssVar('--color-warning-500', '#E0A324');

    const gauge = (id, pct, color) => {
        const el = document.getElementById(id);
        if (!el) return;
        // width must stay responsive ('100%'), not a fixed px value: these gauges
        // sit in a 3-column grid where the container is narrower than any fixed
        // width we'd hardcode, so ApexCharts' post-render resize pass recomputes
        // the radialBar geometry against the real (smaller) box and briefly emits
        // a <circle r="-0.0..."> while doing so, which Chrome rejects as invalid.
        new ApexCharts(el, {
            chart: { type: 'radialBar', height: 100, width: '100%', sparkline: { enabled: true } },
            series: [pct],
            colors: [color],
            plotOptions: { radialBar: { hollow: { size: '55%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { offsetY: 5, fontSize: '13px', fontWeight: 700, formatter: () => pct + '%' } } } },
            stroke: { lineCap: 'round' }
        }).render();
    };
    gauge('carrierGaugeFedex', 96, primary);
    gauge('carrierGaugeDhl', 91, info);
    gauge('carrierGaugeUps', 84, warning);

    if (document.getElementById('shippingCostsChart')) {
        new ApexCharts(document.getElementById('shippingCostsChart'), {
            chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
            series: [{ data: [8300, 11400, 9900, 14300, 16700, 18420] }],
            colors: [primary],
            plotOptions: { bar: { borderRadius: 3, columnWidth: '55%' } },
            dataLabels: { enabled: false },
            tooltip: { enabled: false }
        }).render();
    }

    if (document.getElementById('carrierCostDonut')) {
        new ApexCharts(document.getElementById('carrierCostDonut'), {
            chart: { type: 'donut', height: 100, width: 100, sparkline: { enabled: true } },
            series: [8120, 6450, 3850],
            colors: [primary, info, warning],
            stroke: { width: 1, colors: ['var(--surface-raised)'] }
        }).render();
    }
})();


// ---- travel-booking charts (migrated from inline) ----


[
    { id: 'signalGaugeInsurance', value: 61, color: '#0ea5e9' },
    { id: 'signalGaugeBundle', value: 48, color: '#38bdf8' },
    { id: 'signalGaugeTransfer', value: 34, color: '#fb923c' },
    { id: 'signalGaugeSupplier', value: 92, color: '#34d399' }
].forEach(g => {
    if (document.getElementById(g.id)) {
        new ApexCharts(document.getElementById(g.id), {
            chart: { type: 'radialBar', height: 90, sparkline: { enabled: true } },
            series: [g.value],
            plotOptions: { radialBar: { hollow: { size: '55%' }, dataLabels: { name: { show: false }, value: { offsetY: 6, fontSize: '13px', fontWeight: 700, formatter: v => v + (g.id === 'signalGaugeSupplier' ? '' : '%') } } } },
            colors: [g.color]
        }).render();
    }
});

[
    { id: 'kpiSpark1', data: [12, 18, 14, 22, 19, 26, 24], color: '#0ea5e9' },
    { id: 'kpiSpark2', data: [8, 12, 10, 16, 13, 18, 17], color: '#38bdf8' },
    { id: 'kpiSpark3', data: [10, 9, 14, 12, 18, 20, 22], color: '#fb923c' },
    { id: 'kpiSpark4', data: [4, 6, 5, 9, 12, 14, 16], color: '#f59e0b' },
    { id: 'kpiSpark5', data: [9, 8, 7, 8, 6, 7, 6], color: '#34d399' },
    { id: 'kpiSpark6', data: [3, 4, 4, 5, 6, 6, 7], color: '#38bdf8' }
].forEach(function (cfg) {
    var el = document.getElementById(cfg.id);
    if (!el) return;
    new ApexCharts(el, {
        chart: { type: 'area', height: 28, sparkline: { enabled: true } },
        series: [{ data: cfg.data }],
        stroke: { width: 1.5, curve: 'smooth' },
        fill: { opacity: 0.25 },
        colors: [cfg.color],
        tooltip: { enabled: false }
    }).render();
});

if (document.getElementById('bookingTrendChart')) {
    new ApexCharts(document.getElementById('bookingTrendChart'), {
        chart: { type: 'area', height: 220, toolbar: { show: false } },
        series: [
            { name: 'Confirmed', data: [2980, 3120, 3040, 3310, 3480, 3260, 3690, 3540, 3610, 3720, 3480, 3800, 3690, 3900] },
            { name: 'Pending', data: [180, 210, 195, 220, 240, 205, 214, 230, 218, 226, 240, 210, 214, 205] }
        ],
        xaxis: { categories: ['Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24'], labels: { style: { fontSize: '10px' } } },
        yaxis: { labels: { style: { fontSize: '10px' } } },
        stroke: { width: 2, curve: 'smooth' },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
        colors: ['#0ea5e9', '#fb923c'],
        dataLabels: { enabled: false },
        legend: { fontSize: '11px' },
        grid: { strokeDashArray: 4 }
    }).render();
}

if (document.getElementById('journeyRadarChart')) {
    new ApexCharts(document.getElementById('journeyRadarChart'), {
        chart: { type: 'bar', height: 180, toolbar: { show: false } },
        series: [{ name: 'Journey Stage Health', data: [92, 84, 76, 68, 88, 94] }],
        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%', distributed: true } },
        xaxis: { categories: ['Awareness', 'Search', 'Consideration', 'Booking', 'Loyalty', 'Advocacy'], labels: { style: { fontSize: '10px' } } },
        colors: ['#0ea5e9', '#38bdf8', '#fb923c', '#f59e0b', '#34d399', '#a78bfa'],
        dataLabels: { enabled: true, style: { fontSize: '10px' } },
        legend: { show: false }
    }).render();
}


// ---- vat-report-charts.js ----
// ---- vat-report-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');

  if (document.getElementById('vatTrendChart')) {
    new ApexCharts(document.getElementById('vatTrendChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Net VAT Due', data: [8960, 9660, 10080, 10340] }],
      xaxis: { categories: ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '£' + Math.round(v / 1000) + 'K' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => '£' + v.toLocaleString() } }
    }).render();
  }
});
})();


// ---- vat-report-germany-charts.js ----
// ---- vat-report-germany-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');

  if (document.getElementById('vatTrendChart')) {
    new ApexCharts(document.getElementById('vatTrendChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Zahllast', data: [8601, 8894, 9045, 9240] }],
      xaxis: { categories: ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '€' + Math.round(v / 1000) + 'K' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => '€' + v.toLocaleString() } }
    }).render();
  }
});
})();


// ---- withholding-tax-charts.js ----
// ---- withholding-tax-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  var primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600').trim() || '#187F65';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500').trim() || '#E8830F';
  var success = getComputedStyle(document.documentElement).getPropertyValue('--color-success-500').trim() || '#1E9E6B';
  var warning = getComputedStyle(document.documentElement).getPropertyValue('--color-warning-500').trim() || '#DC9A2C';
  var info = getComputedStyle(document.documentElement).getPropertyValue('--color-info-500').trim() || '#3E7EAD';

  if (document.getElementById('whtTrendChart')) {
    new ApexCharts(document.getElementById('whtTrendChart'), {
      chart: { type: 'bar', height: 280, stacked: false, toolbar: { show: false } },
      series: [
        { name: 'Withheld', data: [32.4, 36.8, 41.86, 39.2] },
        { name: 'Remitted', data: [32.4, 36.8, 22.1, 0] }
      ],
      xaxis: { categories: ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026 (est.)'], labels: { style: { colors: '#98A29B', fontSize: '10.5px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: '#98A29B', fontSize: '10.5px' }, formatter: v => 'S$' + v + 'K' } },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
      colors: [accent, primary],
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark', y: { formatter: v => 'S$' + v + 'K' } }
    }).render();
  }

  if (document.getElementById('whtCategoryChart')) {
    new ApexCharts(document.getElementById('whtCategoryChart'), {
      chart: { type: 'donut', height: 240 },
      series: [10880, 6494, 8910, 4395],
      labels: ['Technical Services', 'Royalties', "Director's Fees", 'Interest'],
      colors: [primary, accent, info, warning],
      legend: { position: 'bottom', fontSize: '11px', markers: { size: 6 } },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', formatter: () => 'S$30.7K' } } } } },
      tooltip: { theme: 'dark', y: { formatter: v => 'S$' + v } }
    }).render();
  }
});
})();


// ---- traffic-overview-charts.js ----
// ---- traffic-overview-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const sparkBase = {
    chart: { type: "line", height: 36, sparkline: { enabled: true } },
    stroke: { width: 2, curve: "smooth" },
    tooltip: { enabled: false }
  };

  const sparks = [
    { id: "sparkSessions", data: [92, 98, 90, 105, 112, 108, 128], color: "#4F7DF3" },
    { id: "sparkUsers", data: [70, 74, 71, 80, 84, 82, 92], color: "#3AA0E8" },
    { id: "sparkBounce", data: [39, 40, 41, 40, 42, 41, 43], color: "#E0554F" },
    { id: "sparkDuration", data: [2.9, 3.0, 3.1, 3.0, 3.2, 3.3, 3.4], color: "#E8830F" }
  ];
  sparks.forEach(function (s) {
    const el = document.getElementById(s.id);
    if (!el) return;
    new ApexCharts(el, Object.assign({}, sparkBase, {
      series: [{ data: s.data }],
      colors: [s.color]
    })).render();
  });

  const rowSparks = [
    { id: "rowSpark1", data: [14, 16, 15, 18, 20, 19, 22], color: "#1E9E6B" },
    { id: "rowSpark2", data: [10, 9, 11, 13, 12, 14, 13], color: "#1E9E6B" },
    { id: "rowSpark3", data: [8, 8, 9, 7, 8, 9, 10], color: "#E0554F" },
    { id: "rowSpark4", data: [6, 7, 6, 8, 9, 8, 10], color: "#1E9E6B" },
    { id: "rowSpark5", data: [5, 6, 5, 6, 7, 6, 7], color: "#1E9E6B" }
  ];
  rowSparks.forEach(function (s) {
    const el = document.getElementById(s.id);
    if (!el) return;
    new ApexCharts(el, {
      chart: { type: "line", height: 26, width: 90, sparkline: { enabled: true } },
      series: [{ data: s.data }],
      stroke: { width: 2, curve: "smooth" },
      colors: [s.color],
      tooltip: { enabled: false }
    }).render();
  });

  const refSparks = [
    { id: "refSpark1", data: [40, 44, 42, 46, 45, 48, 48], color: "#1E9E6B" },
    { id: "refSpark2", data: [10, 12, 11, 13, 12, 13, 12], color: "#1E9E6B" },
    { id: "refSpark3", data: [6, 7, 8, 7, 8, 8, 8], color: "#1E9E6B" },
    { id: "refSpark4", data: [5, 5, 6, 6, 5, 6, 6], color: "#1E9E6B" },
    { id: "refSpark5", data: [2, 3, 3, 3, 4, 3, 3], color: "#1E9E6B" }
  ];
  refSparks.forEach(function (s) {
    const el = document.getElementById(s.id);
    if (!el) return;
    new ApexCharts(el, {
      chart: { type: "line", height: 26, width: 90, sparkline: { enabled: true } },
      series: [{ data: s.data }],
      stroke: { width: 2, curve: "smooth" },
      colors: [s.color],
      tooltip: { enabled: false }
    }).render();
  });

  const liveEl = document.getElementById("sparkLive");
  if (liveEl) {
    new ApexCharts(liveEl, {
      chart: { type: "area", height: 54, sparkline: { enabled: true } },
      series: [{ data: [180, 210, 195, 230, 260, 240, 247] }],
      stroke: { width: 2, curve: "smooth" },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
      colors: ["#1E9E6B"],
      tooltip: { enabled: false }
    }).render();
  }

  const areaEl = document.getElementById("trafficAreaChart");
  if (areaEl) {
    new ApexCharts(areaEl, {
      chart: { type: "area", height: 268, toolbar: { show: false }, fontFamily: "inherit" },
      series: [
        { name: "Sessions", data: [3120, 3380, 3210, 3540, 3890, 4120, 3980, 4260, 4510, 4380, 4720, 5040] },
        { name: "Users", data: [2240, 2410, 2320, 2510, 2760, 2900, 2810, 3020, 3180, 3090, 3340, 3560] }
      ],
      xaxis: {
        categories: ["Jun 21", "Jun 24", "Jun 27", "Jun 30", "Jul 3", "Jul 6", "Jul 9", "Jul 12", "Jul 15", "Jul 18", "Jul 21", "Jul 24"],
        labels: { style: { fontSize: "10.5px" } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { fontSize: "10.5px" } } },
      grid: { borderColor: "var(--border-subtle)", strokeDashArray: 3 },
      stroke: { width: 2.5, curve: "smooth" },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.03 } },
      colors: ["#4F7DF3", "#E8830F"],
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: { theme: "light" }
    }).render();
  }

  const donutEl = document.getElementById("channelDonutChart");
  if (donutEl) {
    new ApexCharts(donutEl, {
      chart: { type: "donut", height: 190, fontFamily: "inherit" },
      series: [44, 24, 18, 9, 5],
      labels: ["Organic Search", "Direct", "Social", "Referral", "Email & Other"],
      colors: ["#4F7DF3", "#E8830F", "#3AA0E8", "#1E9E6B", "#CBD5E1"],
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Sessions", fontSize: "11px" } } } } },
      tooltip: { theme: "light" }
    }).render();
  }
});
})();


// ---- partner-restaurant-profile-charts.js ----
// ---- partner-restaurant-profile-charts.js --------------------------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
    const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
    const primary = cssVar('--color-primary-500', '#24997C');

    const revEl = document.getElementById('restaurantRevenueChart');
    if (revEl) {
        new ApexCharts(revEl, {
            chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' },
            series: [{ name: 'Revenue', data: [4820, 5140, 4960, 5480, 6120, 6740, 4980] }],
            xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } },
            colors: [primary],
            dataLabels: { enabled: false },
            grid: { borderColor: cssVar('--border-subtle', '#E8E9EC') },
            tooltip: { y: { formatter: v => '$' + v.toLocaleString() } }
        }).render();
    }

    const statusEl = document.getElementById('restaurantOrderStatusChart');
    if (statusEl) {
        new ApexCharts(statusEl, {
            chart: { type: 'donut', height: 130, width: 130 },
            series: [72, 11, 3],
            labels: ['Delivered', 'Preparing', 'Cancelled'],
            colors: [cssVar('--color-success-500', '#22C55E'), cssVar('--color-warning-500', '#F59E0B'), cssVar('--color-danger-500', '#EF4444')],
            dataLabels: { enabled: false },
            legend: { show: false },
            stroke: { width: 2 },
            plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '10.5px' } } } } }
        }).render();
    }
});
})();


// ---- portfolio-performance-charts.js ----
// ---- portfolio-performance-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const success = cv('--color-success-500') || '#059669';
  const gray400 = cv('--text-tertiary') || '#9096A1';
  if (document.getElementById('portfolioPerformanceChart')) {
    new ApexCharts(document.getElementById('portfolioPerformanceChart'), {
      chart: { type: 'area', height: 240, toolbar: { show: false } },
      series: [{ name: 'Portfolio Value', data: [173400, 178200, 184900, 181600, 210300, 206800, 232400, 227900, 261200, 254800, 279900, 284620] }],
      xaxis: { categories: ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'], labels: { style: { colors: gray400, fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: gray400, fontSize: '11px' }, formatter: v => '$' + (v / 1000).toFixed(0) + 'K' } },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
      stroke: { curve: 'smooth', width: 2.5 },
      colors: [success],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark', y: { formatter: v => '$' + v.toLocaleString() } },
      markers: { size: 0 }
    }).render();
  }
});
})();


// ---- budgets-charts.js ----
// ---- budgets-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
    const primary = cssVar('--color-primary-600', '#187F65');
    const success = cssVar('--color-success-500', '#1E9E6B');
    const warning = cssVar('--color-warning-500', '#E0A324');
    const danger  = cssVar('--color-danger-500', '#D8493C');

    const gauge = (id, pct, color) => {
        const el = document.getElementById(id);
        if (!el) return;
        new ApexCharts(el, {
            chart: { type: 'radialBar', height: 92, width: 92, sparkline: { enabled: true } },
            series: [Math.min(pct, 100)],
            colors: [color],
            plotOptions: { radialBar: { hollow: { size: '52%' }, track: { background: 'var(--surface-sunken)' }, dataLabels: { name: { show: false }, value: { offsetY: 5, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', formatter: () => pct + '%' } } } },
            stroke: { lineCap: 'round' }
        }).render();
    };

    gauge('budgetGauge1', 65, primary);
    gauge('budgetGauge2', 107, danger);
    gauge('budgetGauge3', 19, warning);
    gauge('budgetGauge4', 65, primary);
    gauge('budgetGauge5', 47, warning);
    gauge('budgetGauge6', 96, danger);
    gauge('budgetGauge7', 110, danger);
    gauge('budgetGauge8', 64, primary);
    gauge('budgetGauge9', 47, primary);
    gauge('budgetGauge10', 23, warning);
    gauge('budgetGauge11', 54, primary);
    gauge('budgetGauge12', 20, warning);
});
})();


// ---- corporate-tax-charts.js ----
// ---- corporate-tax-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    var primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600').trim() || '#187F65';
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500').trim() || '#E8830F';
    var success = getComputedStyle(document.documentElement).getPropertyValue('--color-success-500').trim() || '#1E9E6B';
    var warning = getComputedStyle(document.documentElement).getPropertyValue('--color-warning-500').trim() || '#DC9A2C';
    var danger = getComputedStyle(document.documentElement).getPropertyValue('--color-danger-500').trim() || '#D0504C';
    var info = getComputedStyle(document.documentElement).getPropertyValue('--color-info-500').trim() || '#3E7EAD';

    if (document.getElementById('taxProvisionChart')) {
        new ApexCharts(document.getElementById('taxProvisionChart'), {
            chart: { type: 'bar', height: 280, stacked: true, toolbar: { show: false } },
            series: [
                { name: 'Current Tax', data: [312, 340, 366, 398] },
                { name: 'Deferred Tax', data: [96, 88, 104, 138] }
            ],
            xaxis: { categories: ['Q1 2026', 'Q2 2026', 'Q3 2026 (est.)', 'Q4 2026 (est.)'], labels: { style: { colors: '#98A29B', fontSize: '10.5px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { colors: '#98A29B', fontSize: '10.5px' }, formatter: v => '$' + v + 'K' } },
            grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 4 },
            plotOptions: { bar: { columnWidth: '45%', borderRadius: 3 } },
            colors: [primary, accent],
            legend: { show: false },
            dataLabels: { enabled: false },
            tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'K' } }
        }).render();
    }

    if (document.getElementById('taxJurisdictionChart')) {
        new ApexCharts(document.getElementById('taxJurisdictionChart'), {
            chart: { type: 'donut', height: 240 },
            series: [842, 399, 226, 185, 121, 69],
            labels: ['United States', 'United Kingdom', 'Canada', 'Singapore', 'Germany', 'Australia'],
            colors: [primary, info, accent, warning, success, danger],
            legend: { position: 'bottom', fontSize: '11px', markers: { size: 6 } },
            dataLabels: { enabled: false },
            plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', formatter: () => '$1.84M' } } } } },
            tooltip: { theme: 'dark', y: { formatter: v => '$' + v + 'K' } }
        }).render();
    }
});
})();


// ---- payment-center-charts.js ----
// ---- payment-center-charts.js --------------------------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const danger  = cssVar('--color-danger-500', '#D0504C');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const accent  = cssVar('--color-accent-500', '#E8830F');
  const gray    = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('paymentVolumeChart')) {
    new ApexCharts(document.getElementById('paymentVolumeChart'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false }, stacked: true, fontFamily: 'inherit' },
      series: [
        { name: 'Succeeded', data: [38200, 41400, 36800, 44900, 39600, 30200, 48200] },
        { name: 'Failed', data: [820, 640, 910, 540, 700, 380, 1120] }
      ],
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '$' + Math.round(v / 1000) + 'K' } },
      colors: [primary, danger],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => '$' + v.toLocaleString() } }
    }).render();
  }
});
})();


// ---- rider-profile-charts.js ----
// ---- rider-profile-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  let earningsModalChartsRendered = false;
  function renderEarningsModalCharts() {
    if (earningsModalChartsRendered || typeof ApexCharts === "undefined") return;
    const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
    const success = cssVar('--color-success-500', '#1E9E6B');
    const primary = cssVar('--color-primary-500', '#24997C');
    const border  = cssVar('--color-neutral-200', '#E7EAE5');

    const trendEl = document.getElementById('riderEarningsTrendChartModal');
    if (trendEl) {
      new ApexCharts(trendEl, {
        chart: { type: 'area', height: 140, toolbar: { show: false }, fontFamily: 'inherit' },
        series: [{ name: 'Earnings', data: [98, 82, 88, 118, 108, 132, 116.6] }],
        xaxis: {
          categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          labels: { style: { colors: cssVar('--text-tertiary', '#8A9088'), fontSize: '10px' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: { show: false, padding: { left: 10, right: 10, top: -10, bottom: 0 } },
        stroke: { curve: 'smooth', width: 2.5 },
        colors: [success],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: v => '$' + v.toFixed(2) } },
        markers: { size: 0 }
      }).render();
    }

    const ringEl = document.getElementById('riderGoalRingModal');
    if (ringEl) {
      new ApexCharts(ringEl, {
        chart: { type: 'radialBar', height: 68, width: 68 },
        series: [84],
        colors: [primary],
        plotOptions: {
          radialBar: {
            hollow: { size: '58%' },
            track: { background: border },
            dataLabels: { show: true, value: { show: true, fontSize: '11px', fontWeight: 700, offsetY: 5, formatter: v => v + '%' } }
          }
        },
        stroke: { lineCap: 'round' },
        labels: ['Goal']
      }).render();
    }

    earningsModalChartsRendered = true;
  }

  // Lazily render the earnings modal's charts the first time it's opened (Preline manages the
  // actual open/close/backdrop behavior).
  document.getElementById("earningsModal")?.addEventListener("open.hs.overlay", renderEarningsModalCharts);

  const cssVar2 = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary2 = cssVar2('--color-primary-500', '#24997C');
  const neutral2 = cssVar2('--color-neutral-300', '#D5D9D3');
  const weeklyEl = document.getElementById('riderWeeklyEarningsChart');
  if (weeklyEl) {
    new ApexCharts(weeklyEl, {
      chart: { type: 'bar', height: 130, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Earnings', data: [54.20, 68.90, 40.10, 75.40, 60.00, 82.30, 94.30] }],
      xaxis: {
        categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        labels: { style: { colors: cssVar2('--text-tertiary', '#8A9088'), fontSize: '10px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { show: false },
      grid: { show: false, padding: { left: 0, right: 0, top: -10, bottom: 0 } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 3, distributed: true } },
      colors: [neutral2, neutral2, neutral2, neutral2, neutral2, neutral2, primary2],
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: v => '$' + v.toFixed(2) } }
    }).render();
  }

});
})();


// ---- table-floor-map-charts.js ----
// ---- table-floor-map-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const el = document.getElementById('floorOccupancyChart');
  if (el) {
    new ApexCharts(el, {
      chart: { type: 'donut', height: 130, width: 130 },
      series: [9, 6, 3],
      labels: ['Occupied', 'Free', 'Reserved'],
      colors: [cssVar('--color-danger-500', '#EF4444'), cssVar('--color-success-500', '#22C55E'), cssVar('--color-warning-500', '#F59E0B')],
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: { width: 2 },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Tables', fontSize: '10.5px' } } } } }
    }).render();
  }
});
})();


// ---- products-list-charts.js ----
// ---- products-list-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

    function mountSpark(id, data, color) {
        var el = document.querySelector(id);
        if (!el || typeof ApexCharts === "undefined") return;
        new ApexCharts(el, {
            chart: { type: "area", height: "100%", width: "100%", sparkline: { enabled: true } },
            series: [{ data: data }],
            stroke: { curve: "smooth", width: 2 },
            colors: [color],
            fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0 } },
            tooltip: { enabled: false }
        }).render();
    }

    if (typeof ApexCharts !== "undefined") {
        var success = cssVar("--color-success-500") || "#16a34a";
        var danger = cssVar("--color-danger-500") || "#dc2626";
        var primary = cssVar("--color-primary-600") || "#4f46e5";

        var trends = {
            rowTrend1: { d: [9, 12, 11, 15, 18, 20, 24], c: success },
            rowTrend2: { d: [8, 10, 9, 13, 12, 15, 17], c: success },
            rowTrend3: { d: [14, 13, 11, 10, 9, 8, 7], c: danger },
            rowTrend4: { d: [7, 8, 10, 9, 11, 13, 14], c: success },
            rowTrend5: { d: [10, 9, 7, 6, 4, 2, 1], c: danger },
            rowTrend7: { d: [6, 7, 6, 8, 9, 8, 10], c: success },
            rowTrend8: { d: [11, 12, 10, 9, 8, 9, 8], c: primary },
            rowTrend9: { d: [9, 8, 6, 5, 3, 2, 1], c: danger },
            rowTrend10: { d: [5, 6, 8, 9, 12, 14, 16], c: success }
        };
        Object.keys(trends).forEach(function (key) {
            mountSpark("#" + key, trends[key].d, trends[key].c);
        });
    }
});
})();


// ---- order-board-charts.js ----
// ---- order-board-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('order-board-channel-chart')) {
      new ApexCharts(document.getElementById('order-board-channel-chart'), {
          chart: { type: 'donut', height: 220 },
          series: [14, 6, 4],
          labels: ['Dine-in', 'Takeaway', 'Online'],
          colors: ['#24997C', '#E8A33D', '#3E7CE0'],
          legend: { position: 'bottom', fontSize: '11.5px' },
          dataLabels: { enabled: false },
          plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Active', fontSize: '11px' } } } } }
      }).render();
  }
});
})();


// ---- timesheet-details-charts.js ----
// ---- timesheet-details-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const dailyEl = document.getElementById("dailyHoursChart");
  if (dailyEl) {
    new ApexCharts(dailyEl, {
      chart: { type: "bar", height: 200, toolbar: { show: false }, fontFamily: "inherit" },
      series: [
        { name: "Billable", data: [7.5, 8.0, 6.5, 7.0, 7.5, 0, 0] },
        { name: "Non-billable", data: [0.5, 0, 1.0, 0.5, 0, 0, 0] }
      ],
      xaxis: {
        categories: ["Mon 15", "Tue 16", "Wed 17", "Thu 18", "Fri 19", "Sat 20", "Sun 21"],
        labels: { style: { fontSize: "10.5px" } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { fontSize: "10.5px" } } },
      grid: { borderColor: "var(--border-subtle)", strokeDashArray: 3 },
      plotOptions: { bar: { columnWidth: "45%", borderRadius: 4, stacked: true } },
      stroke: { show: false },
      colors: ["#4F7DF3", "#E8830F"],
      legend: { show: true, fontSize: "11.5px", markers: { size: 5 } },
      dataLabels: { enabled: false },
      tooltip: { theme: "light" }
    }).render();
  }
});
})();


// ---- emergency-charts.js ----
// ---- emergency-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('er-triage-chart')) {
    new ApexCharts(document.getElementById('er-triage-chart'), {
      chart: { type: 'pie', height: 240 },
      series: [25, 33, 42],
      labels: ['Critical', 'Urgent', 'Standard'],
      colors: ['#B33D3A', '#B87C1C', '#2E6690'],
      legend: { position: 'bottom', fontSize: '11.5px' },
      dataLabels: { enabled: true, style: { fontSize: '11px' } },
      stroke: { width: 1 }
    }).render();
  }
});
})();


// ---- billing-charts.js ----
// ---- billing-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('billing-dept-revenue-chart')) {
    new ApexCharts(document.getElementById('billing-dept-revenue-chart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false } },
      series: [{ name: 'Revenue', data: [96400, 74100, 51800, 38200] }],
      xaxis: { categories: ['Oncology', 'Emergency', 'Orthopedics', 'Cardiology'] },
      plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '55%' } },
      colors: ['#24997C'],
      dataLabels: { enabled: true, formatter: (v) => '$' + (v / 1000).toFixed(1) + 'K', style: { fontSize: '11px' } },
      grid: { borderColor: '#E8E9EC' },
      tooltip: { y: { formatter: (v) => '$' + v.toLocaleString() } }
    }).render();
  }
});
})();


// ---- exam-analytics-charts.js ----
// ---- exam-analytics-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('exam-score-distribution-chart')) {
    new ApexCharts(document.getElementById('exam-score-distribution-chart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false } },
      series: [{ name: 'Students', data: [2, 5, 12, 15] }],
      xaxis: { categories: ['0-59', '60-69', '70-84', '85-100'] },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '45%', distributed: true } },
      colors: ['#D0504C', '#DC9A2C', '#24997C', '#16814D'],
      legend: { show: false },
      dataLabels: { enabled: false },
      grid: { borderColor: '#E8E9EC' }
    }).render();
  }
});
})();


// ---- report-builder-charts.js ----
// ---- report-builder-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  if (document.getElementById('builderPreviewChart')) {
    new ApexCharts(document.getElementById('builderPreviewChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Revenue', data: [212400, 148600, 68200, 57000] }],
      xaxis: { categories: ['Web', 'Mobile', 'POS', 'Marketplace'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '$' + Math.round(v / 1000) + 'K' } },
      colors: [primary],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 }
    }).render();
  }
});
})();


// ---- customs-duty-charts.js ----
// ---- customs-duty-charts.js --------------------------------------------------------
(function () {
document.addEventListener("DOMContentLoaded", function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const info = cssVar('--color-info-600', '#2563EB');

  if (document.getElementById('customsTrendChart')) {
    new ApexCharts(document.getElementById('customsTrendChart'), {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Duty Assessed', data: [8286, 8453, 8625, 9120] }],
      xaxis: { categories: ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'], labels: { style: { fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { fontSize: '11px' }, formatter: (v) => '£' + Math.round(v / 1000) + 'K' } },
      colors: [info],
      plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--border-subtle)', strokeDashArray: 3 },
      tooltip: { y: { formatter: (v) => '£' + v.toLocaleString() } }
    }).render();
  }
});
})();


// ---- guest-directory-charts.js ----
// ---- guest-directory-charts.js --------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const cssVar = (name, fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  const primary = cssVar('--color-primary-600', '#187F65');
  const warning = cssVar('--color-warning-500', '#E0A324');
  const info    = cssVar('--color-info-500', '#3E7EAD');
  const neutral = cssVar('--color-neutral-400', '#98A29B');

  if (document.getElementById('guestTierChart')) {
    new ApexCharts(document.getElementById('guestTierChart'), {
      chart: { type: 'donut', height: 220 },
      series: [412, 1186, 1544, 1678],
      labels: ['Platinum', 'Gold', 'Silver', 'Standard'],
      colors: [primary, warning, info, neutral],
      legend: { position: 'bottom', fontSize: '11px', markers: { size: 6 } },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['var(--surface-raised)'] },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', fontSize: '11px', formatter: () => '4,820' } } } } }
    }).render();
  }
});
})();
