// ---- import-export.js ----------------------------------------------------------
(function () {
// Generic Import/Export modal behavior, shared by every page that includes
// partials/import-export-modals.html. Mirrors the exact interactions built
// for products-list.html so every page gets the same premium experience.

window.openModal = window.openModal || function (id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
};
window.closeModal = window.closeModal || function (id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
};

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".ui-modal.is-open").forEach((m) => window.closeModal(m));
});

// ---- Import modal ----------------------------------------------------------
(function () {
  const dropzone = document.getElementById("importDropzone");
  const fileInput = document.getElementById("importFileInput");
  const fileNameEl = document.getElementById("importFileName");
  const startBtn = document.getElementById("importStartBtn");
  if (!dropzone) return;

  function handleFile(file) {
    if (!file) return;
    fileNameEl.querySelector("span").textContent = file.name;
    fileNameEl.classList.remove("hidden");
    startBtn.disabled = false;
  }

  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "var(--color-primary-500)"; });
  dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = "var(--border-default)"; });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--border-default)";
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  window.openImportModal = function () {
    document.getElementById("importDropStep").classList.remove("hidden");
    document.getElementById("importProgressStep").classList.add("hidden");
    document.getElementById("importDoneStep").classList.add("hidden");
    fileNameEl.classList.add("hidden");
    fileInput.value = "";
    startBtn.disabled = true;
    window.openModal("importModal");
  };

  window.startImport = function () {
    document.getElementById("importDropStep").classList.add("hidden");
    const progressStep = document.getElementById("importProgressStep");
    progressStep.classList.remove("hidden");
    const bar = document.getElementById("importProgressBar");
    const pct = document.getElementById("importProgressPct");
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 22 + 8);
      bar.style.width = `${progress}%`;
      pct.textContent = `${Math.round(progress)}%`;
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          progressStep.classList.add("hidden");
          document.getElementById("importDoneStep").classList.remove("hidden");
        }, 300);
      }
    }, 220);
  };
})();

// ---- Export modal -----------------------------------------------------------
(function () {
  const formatGroup = document.getElementById("exportFormatGroup");
  if (!formatGroup) return;

  formatGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".export-format-btn");
    if (!btn) return;
    formatGroup.querySelectorAll(".export-format-btn").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.style.background = active ? "var(--color-primary-600)" : "var(--surface-sunken)";
      b.style.color = active ? "#fff" : "var(--text-secondary)";
    });
  });

  const selectedCountEl = document.getElementById("exportSelectedCount");

  window.openExportModal = function () {
    document.getElementById("exportFormStep").classList.remove("hidden");
    document.getElementById("exportProgressStep").classList.add("hidden");
    const selected = document.querySelectorAll(".row-select:checked").length;
    if (selectedCountEl) selectedCountEl.textContent = `(${selected})`;
    window.openModal("exportModal");
  };

  window.startExport = function () {
    const activeFormat = formatGroup.querySelector(".export-format-btn.is-active");
    const format = activeFormat ? activeFormat.dataset.value : "CSV";
    document.getElementById("exportFormStep").classList.add("hidden");
    document.getElementById("exportProgressStep").classList.remove("hidden");
    document.getElementById("exportDoneFormat").textContent = format;
  };

  // Shared trigger for every page's "Export Report" button (was inline onclick="openExportModal()").
  document.querySelectorAll(".js-export-report-btn").forEach((btn) => {
    btn.addEventListener("click", () => window.openExportModal());
  });
  document.querySelectorAll(".js-open-import-btn").forEach((btn) => {
    btn.addEventListener("click", () => window.openImportModal());
  });
  document.querySelectorAll(".js-start-export-btn").forEach((btn) => {
    btn.addEventListener("click", () => window.startExport());
  });
  document.querySelectorAll(".js-import-btn").forEach((btn) => {
    btn.addEventListener("click", () => window.startImport());
  });
})();
})();
