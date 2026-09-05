import {
  buttonLink,
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";
import {
  getFeaturedProject,
  getProjectRoute,
  hasPublishedCaseStudy,
} from "../../app/core/projects.js";

function renderSignals(projects, platformVersion) {
  const signals = [
    { value: String(projects.length).padStart(2, "0"), label: "Systems catalogued" },
    {
      value: String(projects.filter((project) => project.hasCaseStudy).length).padStart(2, "0"),
      label: "Case studies ready",
    },
    { value: platformVersion, label: "Stable platform" },
  ];

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

function renderArchitecture(architecture, label) {
  return `<ol class="project-flow" aria-label="${label} system flow">
    ${architecture
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

function renderFeaturedProject(project) {
  const actionLabel = project.caseStudy?.showcase
    ? `Open ${project.shortName} visual case`
    : `Open ${project.shortName} case study`;

  return `<section class="section projects-featured" aria-labelledby="projects-featured-title" data-reveal>
    <article class="surface panel project-primary motion-surface" data-motion-surface>
      ${motionFrame("strong")}
      <header class="project-primary__header">
        ${operationLabel("Primary system", "cyan")}
        <span class="module-code">${project.code}</span>
      </header>

      <div class="project-primary__copy">
        <p class="project-category">${project.category}</p>
        <h2 id="projects-featured-title">${project.name}</h2>
        <p class="project-primary__description">${project.summary}</p>
        <p class="project-objective"><strong>Engineering objective</strong>${project.objective}</p>
        <div class="tag-list project-stack">
          ${project.stack.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <div class="project-primary__actions">
          ${buttonLink(actionLabel, getProjectRoute(project), "primary", "↗")}
        </div>
      </div>

      ${renderArchitecture(project.architecture, project.shortName)}
    </article>

    <aside class="surface panel project-trajectory" aria-labelledby="project-trajectory-title">
      <header>
        ${operationLabel("Delivery sequence")}
        <h2 id="project-trajectory-title">From foundation to intelligence.</h2>
      </header>
      ${renderMilestones(project.milestones)}
    </aside>
  </section>`;
}

function renderRegistryAction(project) {
  if (hasPublishedCaseStudy(project)) {
    const actionLabel = project.caseStudy?.showcase
      ? `Open ${project.shortName} visual case`
      : `Open ${project.shortName} case study`;
    return buttonLink(actionLabel, getProjectRoute(project), "text", "→");
  }

  return `<span class="project-case-state">Case study pending verified evidence</span>`;
}

function renderRegistryItem(project, index) {
  const titleId = `project-system-${project.slug}`;

  return `<article class="surface panel project-registry-row ${index === 0 ? "is-primary motion-surface" : ""}" aria-labelledby="${titleId}" data-reveal ${index === 0 ? "data-motion-surface" : ""}>
    ${index === 0 ? motionFrame("soft") : ""}
    <div class="project-registry-row__identity">
      <div class="project-registry-row__topline">
        <span class="module-code">${project.code}</span>
        <span class="project-state">${statusMark(project.signal)} ${project.status}</span>
      </div>
      <p class="project-category">${project.category}</p>
      <h3 id="${titleId}">${project.name}</h3>
    </div>
    <div class="project-registry-row__details">
      <p>${project.summary}</p>
      <dl>
        <div><dt>Focus</dt><dd>${project.focus}</dd></div>
        <div><dt>Stack</dt><dd class="tag-list">${project.stack.map((item) => `<span>${item}</span>`).join("")}</dd></div>
      </dl>
      <div class="project-registry-row__action">${renderRegistryAction(project)}</div>
    </div>
  </article>`;
}

function renderSystemRegistry(projects, registry) {
  return `<section class="section projects-registry" aria-labelledby="project-registry-title">
    <header class="projects-registry__header" data-reveal>
      ${sectionHeader(registry.eyebrow, registry.title, registry.description, "h2", "project-registry-title")}
      <span class="module-code">SYS / REGISTRY</span>
    </header>
    <div class="project-registry-list">
      ${projects.map(renderRegistryItem).join("")}
    </div>
  </section>`;
}

export function renderProjectsSections(projectsData) {
  const featuredProject = getFeaturedProject(projectsData.projects);

  if (!featuredProject) {
    throw new Error("The project registry requires one featured project.");
  }

  return `
    <section class="section page-intro projects-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${projectsData.meta.index}</div>
      <div class="projects-intro__layout">
        ${sectionHeader(projectsData.meta.eyebrow, projectsData.meta.title, projectsData.meta.description, "h1")}
        ${renderSignals(projectsData.projects, projectsData.meta.platformVersion)}
      </div>
    </section>
    ${renderFeaturedProject(featuredProject)}
    ${renderSystemRegistry(projectsData.projects, projectsData.registry)}
  `;
}
