import {
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderSignals(signals) {
  return `<dl class="labs-signals" aria-label="Research operations summary">
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

function renderProtocol(protocol) {
  return `<ol class="labs-protocol" aria-label="NEXUS research method">
    ${protocol
      .map(
        (stage) => `<li>
          <span class="sequence-number">${stage.index}</span>
          <h3>${stage.name}</h3>
          <p>${stage.description}</p>
        </li>`,
      )
      .join("")}
  </ol>`;
}

function renderFeaturedInquiry(featured) {
  return `<section class="section labs-featured" aria-labelledby="labs-featured-title" data-reveal>
    <article class="surface panel labs-inquiry motion-surface" data-motion-surface>
      ${motionFrame("strong")}
      <header class="labs-inquiry__header">
        ${operationLabel(featured.eyebrow, "cyan")}
        <span class="module-code">${featured.code}</span>
      </header>

      <div class="labs-inquiry__copy">
        <p class="labs-field">${featured.field}</p>
        <h2 id="labs-featured-title">${featured.title}</h2>
        <p class="labs-inquiry__description">${featured.description}</p>
        <div class="tag-list labs-methods">
          ${featured.methods.map((method) => `<span>${method}</span>`).join("")}
        </div>
      </div>

      ${renderProtocol(featured.protocol)}
    </article>

    <aside class="surface panel labs-hypothesis" aria-labelledby="labs-hypothesis-title">
      <header>
        ${operationLabel("Research frame")}
        <h2 id="labs-hypothesis-title">Question before technology.</h2>
      </header>
      <div class="labs-hypothesis__content">
        <div>
          <span>Current question</span>
          <p>${featured.question}</p>
        </div>
        <div>
          <span>Working hypothesis</span>
          <p>${featured.hypothesis}</p>
        </div>
      </div>
    </aside>
  </section>`;
}

function renderTrack(track, index) {
  const titleId = `labs-track-${index + 1}`;

  return `<article class="surface panel labs-track ${index === 0 ? "is-primary motion-surface" : ""}" aria-labelledby="${titleId}" data-reveal ${index === 0 ? "data-motion-surface" : ""}>
    ${index === 0 ? motionFrame("soft") : ""}
    <header class="labs-track__topline">
      <span class="module-code">${track.code}</span>
      <span class="labs-track__state">${statusMark(track.signal)} ${track.state}</span>
    </header>
    <div class="labs-track__identity">
      <span class="registry-index">${String(index + 1).padStart(2, "0")}</span>
      <h3 id="${titleId}">${track.name}</h3>
      <p>${track.description}</p>
    </div>
    <div class="labs-track__details">
      <div>
        <span>Research question</span>
        <p>${track.question}</p>
      </div>
      <div>
        <span>Methods</span>
        <div class="tag-list">${track.methods.map((method) => `<span>${method}</span>`).join("")}</div>
      </div>
      <div>
        <span>System transfer</span>
        <p>${track.transfer}</p>
      </div>
    </div>
  </article>`;
}

function renderRegistry(registry, tracks) {
  return `<section class="section labs-registry" aria-labelledby="labs-registry-title">
    <header class="labs-registry__header" data-reveal>
      ${sectionHeader(registry.eyebrow, registry.title, registry.description)}
      <span class="module-code">LAB / REGISTRY</span>
    </header>
    <div class="labs-track-list">
      ${tracks.map(renderTrack).join("")}
    </div>
  </section>`;
}

function renderPrinciple(principle) {
  return `<section class="section surface panel labs-principle" aria-labelledby="labs-principle-title" data-reveal>
    <div>
      ${operationLabel(principle.eyebrow, "cyan")}
      <h2 id="labs-principle-title">${principle.title}</h2>
      <p>${principle.description}</p>
    </div>
    <ol class="labs-outcomes">
      ${principle.outcomes
        .map(
          (outcome, index) => `<li>
            <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
            <p>${outcome}</p>
          </li>`,
        )
        .join("")}
    </ol>
  </section>`;
}

export function renderLabsSections(labs) {
  return `
    <section class="section page-intro labs-intro-page" data-reveal>
      <div class="page-index" aria-hidden="true">${labs.meta.index}</div>
      <div class="labs-intro-page__layout">
        ${sectionHeader(labs.meta.eyebrow, labs.meta.title, labs.meta.description, "h1")}
        ${renderSignals(labs.signals)}
      </div>
    </section>
    ${renderFeaturedInquiry(labs.featured)}
    ${renderRegistry(labs.registry, labs.tracks)}
    ${renderPrinciple(labs.principle)}
  `;
}
