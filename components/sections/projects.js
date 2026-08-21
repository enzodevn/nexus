import {
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderSignals(signals) {
  return `<dl class="projects-signals" aria-label="Project registry summary">
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

function renderFlow(flow) {
  return `<ol class="project-flow" aria-label="NGDP system flow">
    ${flow
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

function renderMilestones(milestones) {
  return `<ol class="project-milestones">
    ${milestones
      .map(
        (milestone, index) => `<li class="${index === 0 ? "is-current" : ""}">
          <div class="project-milestone__state">
            ${statusMark(index === 0 ? "active" : "muted")}
            <span>${milestone.state}</span>
          </div>
          <h3>${milestone.title}</h3>
          <p>${milestone.description}</p>
        </li>`,
      )
      .join("")}
  </ol>`;
}

function renderFeaturedProject(featured) {
  return `<section class="section projects-featured" aria-labelledby="projects-featured-title" data-reveal>
    <article class="surface panel project-primary motion-surface" data-motion-surface>
      ${motionFrame("strong")}
      <header class="project-primary__header">
        ${operationLabel(featured.eyebrow, "cyan")}
        <span class="module-code">${featured.code}</span>
      </header>

      <div class="project-primary__copy">
        <p class="project-category">${featured.category}</p>
        <h2 id="projects-featured-title">${featured.name}</h2>
        <p class="project-primary__description">${featured.description}</p>
        <p class="project-objective"><strong>Engineering objective</strong>${featured.objective}</p>
        <div class="tag-list project-stack">
          ${featured.stack.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </div>

      ${renderFlow(featured.flow)}
    </article>

    <aside class="surface panel project-trajectory" aria-labelledby="project-trajectory-title">
      <header>
        ${operationLabel("Delivery sequence")}
        <h2 id="project-trajectory-title">From foundation to intelligence.</h2>
      </header>
      ${renderMilestones(featured.milestones)}
    </aside>
  </section>`;
}

function renderRegistryItem(system, index) {
  const titleId = `project-system-${index + 1}`;

  return `<article class="surface panel project-registry-row ${index === 0 ? "is-primary motion-surface" : ""}" aria-labelledby="${titleId}" data-reveal ${index === 0 ? "data-motion-surface" : ""}>
    ${index === 0 ? motionFrame("soft") : ""}
    <div class="project-registry-row__identity">
      <div class="project-registry-row__topline">
        <span class="module-code">${system.code}</span>
        <span class="project-state">${statusMark(system.signal)} ${system.status}</span>
      </div>
      <p class="project-category">${system.category}</p>
      <h3 id="${titleId}">${system.name}</h3>
    </div>
    <div class="project-registry-row__details">
      <p>${system.summary || system.description}</p>
      <dl>
        <div><dt>Focus</dt><dd>${system.focus}</dd></div>
        <div><dt>Stack</dt><dd class="tag-list">${system.stack.map((item) => `<span>${item}</span>`).join("")}</dd></div>
      </dl>
    </div>
  </article>`;
}

function renderSystemRegistry(featured, systems, registry) {
  const entries = [
    {
      ...featured,
      summary: featured.description,
      focus: featured.focus,
      signal: "active",
    },
    ...systems,
  ];

  return `<section class="section projects-registry" aria-labelledby="project-registry-title">
    <header class="projects-registry__header" data-reveal>
      ${sectionHeader(registry.eyebrow, registry.title, registry.description)}
      <span class="module-code">SYS / REGISTRY</span>
    </header>
    <div class="project-registry-list">
      ${entries.map(renderRegistryItem).join("")}
    </div>
  </section>`;
}

export function renderProjectsSections(projects) {
  return `
    <section class="section page-intro projects-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${projects.meta.index}</div>
      <div class="projects-intro__layout">
        ${sectionHeader(projects.meta.eyebrow, projects.meta.title, projects.meta.description, "h1")}
        ${renderSignals(projects.signals)}
      </div>
    </section>
    ${renderFeaturedProject(projects.featured)}
    ${renderSystemRegistry(projects.featured, projects.systems, projects.registry)}
  `;
}
