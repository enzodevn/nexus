let showcaseAbortController;

function selectRange(showcase, range) {
  showcase.querySelectorAll("[data-chart-range]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.chartRange === range));
  });

  showcase.querySelectorAll("[data-chart-series]").forEach((series) => {
    series.toggleAttribute("hidden", series.dataset.chartSeries !== range);
  });
}

export function initializeProjectShowcases(root = document) {
  showcaseAbortController?.abort();
  showcaseAbortController = new AbortController();

  root.querySelectorAll("[data-project-showcase]").forEach((showcase) => {
    showcase.querySelectorAll("[data-chart-range]").forEach((button) => {
      button.addEventListener(
        "click",
        () => selectRange(showcase, button.dataset.chartRange),
        { signal: showcaseAbortController.signal },
      );
    });
  });
}
