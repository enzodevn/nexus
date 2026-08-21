import {
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderSignals(signals) {
  return `<dl class="roadmap-signals" aria-label="Roadmap summary">
    ${signals
      .map(
        (signal) => `<div>
          <dt>${signal.label}</dt>
          <dd>${signal.value}</dd>
        </div>`,
      )
      .join("")}
  </dl>`;
}

function renderTelemetry(telemetry) {
  return `<dl class="roadmap-telemetry">
    ${telemetry
      .map(
        (item) => `<div>
          <dt>${item.label}</dt>
          <dd>${item.value}</dd>
        </div>`,
      )
      .join("")}
  </dl>`;
}

function renderCurrentPosition(position, gates) {
  return `<section class="section roadmap-position" aria-labelledby="roadmap-position-title" data-reveal>
    <article class="surface panel roadmap-vector motion-surface" data-motion-surface>
      ${motionFrame("strong")}
      <header class="roadmap-vector__header">
        ${operationLabel(position.eyebrow, "cyan")}
        <span class="module-code">${position.code}</span>
      </header>

      <div class="roadmap-vector__copy">
        <p class="roadmap-phase">${position.phase}</p>
        <h2 id="roadmap-position-title">${position.title}</h2>
        <p>${position.description}</p>
      </div>

      <ul class="roadmap-focus" aria-label="Current engineering priorities">
        ${position.focus
          .map(
            (item, index) => `<li>
              <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
              <p>${item}</p>
            </li>`,
          )
          .join("")}
      </ul>

      ${renderTelemetry(position.telemetry)}
    </article>

    <aside class="surface panel roadmap-gates" aria-labelledby="roadmap-gates-title">
      <header>
        ${operationLabel(gates.eyebrow)}
        <h2 id="roadmap-gates-title">${gates.title}</h2>
      </header>
      <ol>
        ${gates.items
          .map(
            (gate, index) => `<li>
              <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>${gate.title}</h3>
                <p>${gate.description}</p>
              </div>
            </li>`,
          )
          .join("")}
      </ol>
    </aside>
  </section>`;
}

function renderLevel(level, index) {
  const titleId = `roadmap-level-${index + 1}`;
  const modifiers = [level.signal === "active" ? "is-active" : "", level.featured ? "is-featured" : ""]
    .filter(Boolean)
    .join(" ");

  return `<article class="surface panel roadmap-level ${modifiers} ${level.featured ? "motion-surface" : ""}" aria-labelledby="${titleId}" data-reveal ${level.featured ? "data-motion-surface" : ""}>
    ${level.featured ? motionFrame("soft") : ""}
    <header class="roadmap-level__topline">
      <span class="module-code">${level.code}</span>
      <span class="roadmap-level__state">${statusMark(level.signal)} ${level.state}</span>
    </header>
    <div class="roadmap-level__body">
      <span class="roadmap-level__index">${String(index + 1).padStart(2, "0")}</span>
      <div class="roadmap-level__identity">
        <p>Depends on · ${level.dependsOn}</p>
        <h3 id="${titleId}">${level.title}</h3>
        <p>${level.description}</p>
      </div>
      <div class="roadmap-level__details">
        <div>
          <span>Capability set</span>
          <div class="tag-list">${level.capabilities.map((capability) => `<span>${capability}</span>`).join("")}</div>
        </div>
        <div>
          <span>Exit evidence</span>
          <p>${level.evidence}</p>
        </div>
        <div>
          <span>Unlocks</span>
          <p>${level.unlocks}</p>
        </div>
      </div>
    </div>
  </article>`;
}

function renderCapabilityMap(map, levels) {
  return `<section class="section roadmap-map" aria-labelledby="roadmap-map-title">
    <header class="roadmap-map__header" data-reveal>
      ${sectionHeader(map.eyebrow, map.title, map.description)}
      <span class="module-code">OPS / SEQUENCE</span>
    </header>
    <div class="roadmap-level-list">
      ${levels.map(renderLevel).join("")}
    </div>
  </section>`;
}

function renderPrinciple(principle) {
  return `<section class="section surface panel roadmap-principle" aria-labelledby="roadmap-principle-title" data-reveal>
    <div>
      ${operationLabel(principle.eyebrow, "cyan")}
      <h2 id="roadmap-principle-title">${principle.title}</h2>
      <p>${principle.description}</p>
    </div>
    <ol class="roadmap-rules">
      ${principle.rules
        .map(
          (rule, index) => `<li>
            <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
            <p>${rule}</p>
          </li>`,
        )
        .join("")}
    </ol>
  </section>`;
}

export function renderRoadmapSections(roadmap) {
  return `
    <section class="section page-intro roadmap-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${roadmap.meta.index}</div>
      <div class="roadmap-intro__layout">
        ${sectionHeader(roadmap.meta.eyebrow, roadmap.meta.title, roadmap.meta.description, "h1")}
        ${renderSignals(roadmap.signals)}
      </div>
    </section>
    ${renderCurrentPosition(roadmap.position, roadmap.gates)}
    ${renderCapabilityMap(roadmap.map, roadmap.levels)}
    ${renderPrinciple(roadmap.principle)}
  `;
}
