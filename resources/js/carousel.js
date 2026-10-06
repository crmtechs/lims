// Minimal vanilla scroll-snap carousel with prev/next arrows. Replaces Slick.

export function initCarousel(container, opts) {
  if (!container || container.dataset.carouselInit) return;
  container.dataset.carouselInit = "1";
  opts = opts || {};

  var track = document.createElement("div");
  track.className = "vc-track";
  while (container.firstChild) track.appendChild(container.firstChild);
  container.appendChild(track);
  container.classList.add("vc-viewport");
  if (!container.style.position) container.style.position = "relative";

  var prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = opts.prevClass || "vc-arrow vc-arrow--prev";
  prevBtn.setAttribute("aria-label", opts.prevLabel || "Previous");
  prevBtn.innerHTML = '<i class="icon-chevron-left"></i>';

  var nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = opts.nextClass || "vc-arrow vc-arrow--next";
  nextBtn.setAttribute("aria-label", opts.nextLabel || "Next");
  nextBtn.innerHTML = '<i class="icon-chevron-right"></i>';

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  function step(dir) {
    track.scrollBy({ left: track.clientWidth * 0.8 * dir, behavior: "smooth" });
  }
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  function updateArrows() {
    var max = track.scrollWidth - track.clientWidth - 1;
    prevBtn.classList.toggle("vc-disabled", track.scrollLeft <= 0);
    nextBtn.classList.toggle("vc-disabled", track.scrollLeft >= max);
  }
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  return { track: track, prevBtn: prevBtn, nextBtn: nextBtn, update: updateArrows };
}
