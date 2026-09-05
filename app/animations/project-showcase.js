let showcaseAbortController;

function hideChartTooltip(showcase) {
  const tooltip = showcase.querySelector("[data-chart-tooltip]");
  if (!tooltip) return;

  tooltip.hidden = true;
  tooltip.setAttribute("aria-hidden", "true");
}

function showChartTooltip(point) {
  const stage = point.closest(".project-showcase-chart__stage");
  const tooltip = stage?.querySelector("[data-chart-tooltip]");
  if (!stage || !tooltip) return;

  const pointBounds = point.getBoundingClientRect();
  const stageBounds = stage.getBoundingClientRect();
  const tooltipPeriod = tooltip.querySelector("[data-chart-tooltip-period]");
  const tooltipValue = tooltip.querySelector("[data-chart-tooltip-value]");

  if (tooltipPeriod) tooltipPeriod.textContent = point.dataset.period;
  if (tooltipValue) tooltipValue.textContent = point.dataset.value;

  tooltip.style.setProperty("--tooltip-x", `${pointBounds.left + pointBounds.width / 2 - stageBounds.left}px`);
  tooltip.style.setProperty("--tooltip-y", `${pointBounds.top - stageBounds.top}px`);
  tooltip.hidden = false;
  tooltip.setAttribute("aria-hidden", "false");
}

function resetMixReadout(showcase) {
  const readout = showcase.querySelector("[data-mix-readout]");
  if (!readout) return;

  const label = readout.querySelector("[data-mix-readout-label]");
  const value = readout.querySelector("[data-mix-readout-value]");
  const detail = readout.querySelector("[data-mix-readout-detail]");

  if (label) label.textContent = "Total generation";
  if (value) value.textContent = readout.dataset.totalValue;
  if (detail) detail.textContent = "All verified sources";

  showcase.querySelectorAll("[data-mix-item]").forEach((item) => {
    item.classList.remove("is-active");
  });
}

function showMixItem(showcase, item) {
  const readout = showcase.querySelector("[data-mix-readout]");
  if (!readout) return;

  const label = readout.querySelector("[data-mix-readout-label]");
  const value = readout.querySelector("[data-mix-readout-value]");
  const detail = readout.querySelector("[data-mix-readout-detail]");

  showcase.querySelectorAll("[data-mix-item]").forEach((mixItem) => {
    mixItem.classList.toggle("is-active", mixItem === item);
  });

  if (label) label.textContent = item.dataset.label;
  if (value) value.textContent = item.dataset.value;
  if (detail) detail.textContent = item.dataset.share;
}

function selectRange(showcase, range) {
  hideChartTooltip(showcase);

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

    showcase.querySelectorAll("[data-chart-point]").forEach((point) => {
      point.addEventListener("pointerenter", () => showChartTooltip(point), {
        signal: showcaseAbortController.signal,
      });
      point.addEventListener("pointerleave", () => hideChartTooltip(showcase), {
        signal: showcaseAbortController.signal,
      });
      point.addEventListener("focus", () => showChartTooltip(point), {
        signal: showcaseAbortController.signal,
      });
      point.addEventListener("blur", () => hideChartTooltip(showcase), {
        signal: showcaseAbortController.signal,
      });
      point.addEventListener("click", () => showChartTooltip(point), {
        signal: showcaseAbortController.signal,
      });
    });

    showcase.querySelectorAll("[data-mix-item]").forEach((item) => {
      item.addEventListener("pointerenter", () => showMixItem(showcase, item), {
        signal: showcaseAbortController.signal,
      });
      item.addEventListener(
        "pointerleave",
        () => {
          if (document.activeElement !== item) resetMixReadout(showcase);
        },
        { signal: showcaseAbortController.signal },
      );
      item.addEventListener("focus", () => showMixItem(showcase, item), {
        signal: showcaseAbortController.signal,
      });
      item.addEventListener("blur", () => resetMixReadout(showcase), {
        signal: showcaseAbortController.signal,
      });
      item.addEventListener("click", () => showMixItem(showcase, item), {
        signal: showcaseAbortController.signal,
      });
    });
  });
}
