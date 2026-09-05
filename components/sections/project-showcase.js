import {
  motionFrame,
  operationLabel,
  statusMark,
} from "../ui/primitives.js";

const CHART_WIDTH = 760;
const CHART_HEIGHT = 260;
const CHART_LEFT = 42;
const CHART_RIGHT = 18;
const CHART_TOP = 28;
const CHART_BOTTOM = 218;

function formatEnergy(valueMwh) {
  if (valueMwh >= 1_000_000) return `${(valueMwh / 1_000_000).toFixed(2)} TWh`;
  if (valueMwh >= 1_000) return `${(valueMwh / 1_000).toFixed(1)} GWh`;
  return `${Math.round(valueMwh).toLocaleString("en-US")} MWh`;
}

function formatPeriod(period) {
  const match = /^(\d{4})M(\d{2})$/.exec(period);
  if (!match) return period;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(match[2]) - 1]} ${match[1]}`;
}

function getCoordinates(points) {
  const values = points.map((point) => point.valueMwh);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = Math.max(maximum - minimum, 1);
  const horizontalSpace = CHART_WIDTH - CHART_LEFT - CHART_RIGHT;
  const verticalSpace = CHART_BOTTOM - CHART_TOP;

  return points.map((point, index) => ({
    ...point,
    x: CHART_LEFT + (index / Math.max(points.length - 1, 1)) * horizontalSpace,
    y: CHART_TOP + ((maximum - point.valueMwh) / span) * verticalSpace,
  }));
}

function renderTrendSeries(trend, range, initialRange) {
  const points = trend.points.slice(-range);
  const coordinates = getCoordinates(points);
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
  const first = coordinates[0];
  const last = coordinates.at(-1);
  const areaPath = `${linePath} L ${last.x.toFixed(2)} ${CHART_BOTTOM} L ${first.x.toFixed(2)} ${CHART_BOTTOM} Z`;
  const maximum = Math.max(...points.map((point) => point.valueMwh));
  const minimum = Math.min(...points.map((point) => point.valueMwh));
  const pointInterval = Math.max(1, Math.floor(points.length / 8));

  return `<g data-chart-series="${range}" ${range === initialRange ? "" : "hidden"}>
    <path class="project-showcase-chart__area" d="${areaPath}"></path>
    <path class="project-showcase-chart__line-glow" d="${linePath}"></path>
    <path class="project-showcase-chart__line" pathLength="1" d="${linePath}"></path>
    ${coordinates
      .map((point, index) => {
        if (index % pointInterval !== 0 && index !== coordinates.length - 1) return "";
        const period = formatPeriod(point.period);
        const value = formatEnergy(point.valueMwh);
        return `<circle class="project-showcase-chart__point-pulse" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="8" aria-hidden="true"></circle>
        <circle class="project-showcase-chart__point" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4" tabindex="0" role="img" data-chart-point data-period="${period}" data-value="${value}" aria-label="${period}: ${value}">
          <title>${formatPeriod(point.period)}: ${formatEnergy(point.valueMwh)}</title>
        </circle>`;
      })
      .join("")}
    <text x="${CHART_LEFT}" y="18" class="project-showcase-chart__axis">${formatEnergy(maximum)}</text>
    <text x="${CHART_LEFT}" y="246" class="project-showcase-chart__axis">${formatPeriod(first.period)}</text>
    <text x="${CHART_WIDTH - CHART_RIGHT}" y="246" text-anchor="end" class="project-showcase-chart__axis">${formatPeriod(last.period)}</text>
    <text x="${CHART_WIDTH - CHART_RIGHT}" y="18" text-anchor="end" class="project-showcase-chart__axis">Low ${formatEnergy(minimum)}</text>
  </g>`;
}

function renderTrendChart(trend) {
  const ranges = [24, 12].filter((range) => trend.points.length >= range);
  const initialRange = ranges[0] ?? trend.points.length;
  const latestPoint = trend.points.at(-1);
  const peakPoint = trend.points.reduce((peak, point) =>
    point.valueMwh > peak.valueMwh ? point : peak,
  );

  return `<article class="surface panel motion-surface project-showcase-chart" data-motion-surface data-reveal>
    ${motionFrame("strong")}
    <header class="project-showcase-card__header">
      <div>
        ${operationLabel("Generation signal", "cyan")}
        <h3 id="project-showcase-trend-title">${trend.title}</h3>
        <p>${trend.description}</p>
      </div>
      <div class="project-showcase-range" role="group" aria-label="Trend period">
        ${ranges
          .map(
            (range) => `<button type="button" data-chart-range="${range}" aria-pressed="${range === initialRange}">${range}M</button>`,
          )
          .join("")}
      </div>
    </header>
    <div class="project-showcase-chart__stage">
      <div class="project-showcase-chart__hud" aria-label="Verified chart telemetry">
        <span class="project-showcase-chart__link"><i></i> Verified data link</span>
        <span>Latest · ${formatEnergy(latestPoint.valueMwh)}</span>
        <span>Peak · ${formatPeriod(peakPoint.period)}</span>
      </div>
      <svg viewBox="0 0 ${CHART_WIDTH} ${CHART_HEIGHT}" role="img" aria-labelledby="project-showcase-trend-title project-showcase-trend-description">
        <desc id="project-showcase-trend-description">${trend.description}. Values are monthly totals from ${formatPeriod(trend.points[0].period)} through ${formatPeriod(trend.points.at(-1).period)}.</desc>
        <defs>
          <linearGradient id="ngdp-trend-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#42e8ff" stop-opacity="0.38"></stop>
            <stop offset="58%" stop-color="#397dff" stop-opacity="0.13"></stop>
            <stop offset="100%" stop-color="#668cff" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient id="ngdp-trend-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#5bc8ff"></stop>
            <stop offset="52%" stop-color="#42e8ff"></stop>
            <stop offset="100%" stop-color="#6f91ff"></stop>
          </linearGradient>
        </defs>
        <g class="project-showcase-chart__grid" aria-hidden="true">
          <line x1="${CHART_LEFT}" y1="${CHART_TOP}" x2="${CHART_WIDTH - CHART_RIGHT}" y2="${CHART_TOP}"></line>
          <line x1="${CHART_LEFT}" y1="91" x2="${CHART_WIDTH - CHART_RIGHT}" y2="91"></line>
          <line x1="${CHART_LEFT}" y1="154" x2="${CHART_WIDTH - CHART_RIGHT}" y2="154"></line>
          <line x1="${CHART_LEFT}" y1="${CHART_BOTTOM}" x2="${CHART_WIDTH - CHART_RIGHT}" y2="${CHART_BOTTOM}"></line>
          <line class="is-vertical" x1="${CHART_LEFT}" y1="${CHART_TOP}" x2="${CHART_LEFT}" y2="${CHART_BOTTOM}"></line>
          <line class="is-vertical" x1="322" y1="${CHART_TOP}" x2="322" y2="${CHART_BOTTOM}"></line>
          <line class="is-vertical" x1="462" y1="${CHART_TOP}" x2="462" y2="${CHART_BOTTOM}"></line>
          <line class="is-vertical" x1="${CHART_WIDTH - CHART_RIGHT}" y1="${CHART_TOP}" x2="${CHART_WIDTH - CHART_RIGHT}" y2="${CHART_BOTTOM}"></line>
        </g>
        <g class="project-showcase-chart__streams" aria-hidden="true">
          <line x1="112" y1="0" x2="112" y2="${CHART_BOTTOM}"></line>
          <line x1="518" y1="0" x2="518" y2="${CHART_BOTTOM}"></line>
          <line x1="684" y1="0" x2="684" y2="${CHART_BOTTOM}"></line>
        </g>
        ${ranges.map((range) => renderTrendSeries(trend, range, initialRange)).join("")}
      </svg>
      <div class="project-showcase-chart__tooltip" data-chart-tooltip hidden aria-hidden="true">
        <span data-chart-tooltip-period></span>
        <strong data-chart-tooltip-value></strong>
      </div>
    </div>
  </article>`;
}

function renderMixChart(mix) {
  const total = mix.items.reduce((sum, item) => sum + item.valueMwh, 0);
  const totalValue = formatEnergy(total);

  return `<article class="surface panel motion-surface project-showcase-mix" data-motion-surface data-reveal>
    ${motionFrame("soft")}
    <header class="project-showcase-card__header">
      <div>
        ${operationLabel("Latest mix")}
        <h3 id="project-showcase-mix-title">${mix.title}</h3>
        <p>${mix.description}</p>
      </div>
      <span class="module-code">${formatPeriod(mix.period)}</span>
    </header>
    <div class="project-showcase-mix__total" data-mix-readout data-total-value="${totalValue}">
      <span data-mix-readout-label>Total generation</span>
      <strong data-mix-readout-value>${totalValue}</strong>
      <small data-mix-readout-detail>All verified sources</small>
    </div>
    <ul class="project-showcase-mix__list" aria-labelledby="project-showcase-mix-title">
      ${mix.items
        .map((item) => {
          const share = total ? (item.valueMwh / total) * 100 : 0;
          const shareLabel = `${share.toFixed(1)}%`;
          const energyLabel = formatEnergy(item.valueMwh);
          return `<li class="project-showcase-mix__item project-showcase-mix__item--${item.tone}" style="--mix-share: ${share.toFixed(2)}%" tabindex="0" data-mix-item data-label="${item.label}" data-value="${energyLabel}" data-share="${shareLabel} of total" aria-label="${item.label}: ${energyLabel}, ${shareLabel} of total">
            <div><span>${item.label}</span><strong>${shareLabel}</strong></div>
            <span class="project-showcase-mix__track" aria-hidden="true"><i></i></span>
            <small>${energyLabel}</small>
          </li>`;
        })
        .join("")}
    </ul>
  </article>`;
}

function renderShowcaseMetrics(metrics) {
  return `<dl class="project-showcase-metrics" aria-label="NGDP current snapshot">
    ${metrics
      .map(
        (metric) => `<div class="surface panel" data-reveal>
          <dt>${metric.label}</dt>
          <dd>${metric.value}</dd>
          <p>${metric.detail}</p>
        </div>`,
      )
      .join("")}
  </dl>`;
}

export function renderProjectShowcase(project) {
  const showcase = project.caseStudy.showcase;
  if (!showcase) return "";

  return `<section id="project-experience" class="section project-showcase project-showcase--${project.slug}" aria-labelledby="project-showcase-title" data-project-showcase data-reveal tabindex="-1">
    <div class="project-showcase__ambient" aria-hidden="true">
      <span></span><span></span><span></span><span></span><i></i>
    </div>
    <header class="project-showcase__header">
      <div>
        ${operationLabel(showcase.eyebrow, "cyan")}
        <h2 id="project-showcase-title">${showcase.title}</h2>
        <p>${showcase.description}</p>
      </div>
      <div class="project-showcase__source">
        <span>${statusMark("active")} Verified snapshot</span>
        <strong>${showcase.snapshot.source}</strong>
        <small>${showcase.snapshot.period} · verified ${showcase.snapshot.verifiedOn}</small>
      </div>
    </header>
    ${renderShowcaseMetrics(showcase.metrics)}
    <div class="project-showcase__dashboard">
      ${renderTrendChart(showcase.trend)}
      ${renderMixChart(showcase.mix)}
    </div>
    <footer class="project-showcase__footer">
      <span class="module-code">DATA / VERIFIED / LOCAL SNAPSHOT</span>
      <p>Interactive presentation of the versioned NGDP dataset. The case does not query the source API during page load.</p>
    </footer>
  </section>`;
}
