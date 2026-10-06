// ---- choices-init.js -----------------------------------------------------------
(function () {
// Progressively enhances every native <select> project-wide with Choices.js.
// Opt out of a specific select by adding data-no-choices to it.
//
// Selects that live inside a modal/drawer/dropdown are often `.hidden` (display:none) at
// page load. Choices.js measures the element's layout when it initializes, so building it
// while hidden produces a zero-width, non-functional widget — the dropdown never works even
// after the modal opens. To avoid that, skip anything hidden at init time and re-scan
// whenever a `hidden` class is removed anywhere (modal/drawer opening), so those selects get
// enhanced lazily, the first time they're actually visible.
function isHidden(el) {
  return Boolean(el.closest(".hidden"));
}

function initChoices() {
  if (typeof Choices === "undefined") return;

  document.querySelectorAll("select:not([data-no-choices])").forEach((el) => {
    if (el.dataset.choicesInit) return;
    if (isHidden(el)) return;
    el.dataset.choicesInit = "true";

    new Choices(el, {
      searchEnabled: el.options.length > 8 || el.multiple,
      itemSelectText: "",
      shouldSort: false,
      allowHTML: false,
      duplicateItemsAllowed: false,
      renderChoiceLimit: -1,
      placeholder: true,
    });
  });
}

function watchForRevealedSelects() {
  const observer = new MutationObserver((mutations) => {
    const revealed = mutations.some(
      (m) => m.attributeName === "class" && m.target instanceof Element && !m.target.classList.contains("hidden")
    );
    if (revealed) initChoices();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: true });
}

function start() {
  initChoices();
  watchForRevealedSelects();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
})();
