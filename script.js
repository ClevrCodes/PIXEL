const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const pressureCards = Array.from(document.querySelectorAll(".pressure-card"));
const searchInput = document.querySelector("#pressure-search");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");

let activeFilter = "all";

function updatePressures() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  pressureCards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "pressure" : "pressures"}`;
  emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updatePressures();
  });
});

searchInput.addEventListener("input", updatePressures);

const revealTargets = document.querySelectorAll(
  ".intro-strip, .section-heading, .explore-tools, .pressure-card, .closing-note"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("reveal-ready");
  revealTargets.forEach((target, index) => {
    target.dataset.reveal = "";
    if (target.classList.contains("pressure-card")) {
      target.style.transitionDelay = `${(index % 4) * 65}ms`;
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}