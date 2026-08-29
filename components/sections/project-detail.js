import {
  buttonLink,
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderProjectSignals(project) {
  const signals = [
    { label: "Status", value: project.status },
    { label: "Current focus", value: project.focus },
    { label: "Documented stack", value: `${project.stack.length} technologies` },
  ];

  return `<dl class="project-detail-signals" aria-label="${project.shortName} project summary">
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

function renderArchitecture(project) {
  return `<ol class="project-detail-flow" aria-label="${project.shortName} architecture">
    ${project.architecture
      .map(
        (stage) => `<li class="surface panel" data-reveal>
          <span class="sequence-number">${stage.index}</span>
          <div>
            <h3>${stage.name}</h3>
            <p>${stage.description}</p>
          </div>
        </li>`,
      )
      .join("")}
  </ol>`;
}

function renderList(items, className = "project-detail-list") {
  return `<ul class="${className}">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>`;
}

function renderRoadmap(project) {
  return `<ol class="project-detail-roadmap">
    ${project.milestones
      .map(
        (milestone, index) => `<li class="${index === 0 ? "is-current" : ""}">
          <div class="project-detail-roadmap__state">
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

function renderExternalLinks(project) {
  const links = project.caseStudy.links;

  if (!links.length) {
    return `<p class="project-detail-links__empty">Public repository and live links will appear here when those project surfaces are ready.</p>`;
  }

  return `<div class="project-detail-links__actions">
    ${links
      .map((link) => buttonLink(link.label, link.href, "secondary", "↗"))
      .join("")}
  </div>`;
}

export function renderProjectDetailSections(project) {
  const caseStudy = project.caseStudy;
  const accessTitle = caseStudy.links.length
    ? "Review the available project evidence."
    : "Evidence will connect here as the system becomes public.";

  return `
    <section class="section page-intro project-detail-intro" data-page-title="${project.shortName}" data-reveal>
      <div class="page-index" aria-hidden="true">${project.code.split("/").at(-1).trim()}</div>
      <nav class="project-breadcrumb" aria-label="Breadcrumb">
        <a href="#/projects">Projects</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${project.shortName}</span>
      </nav>
      <div class="project-detail-intro__layout">
        <div>
          ${operationLabel(caseStudy.eyebrow, "cyan")}
          <p class="project-category">${project.category}</p>
          <h1>${project.name}</h1>
          <p class="project-detail-intro__description">${caseStudy.description}</p>
          <div class="project-detail-intro__actions">
            ${buttonLink("Back to project registry", "#/projects", "secondary", "←")}
          </div>
        </div>
        ${renderProjectSignals(project)}
      </div>
    </section>

    <section class="section project-detail-overview" aria-labelledby="project-overview-title" data-reveal>
      <article class="surface panel project-detail-mission motion-surface" data-motion-surface>
        ${motionFrame("strong")}
        ${operationLabel("Engineering objective", "cyan")}
        <h2 id="project-overview-title">${project.objective}</h2>
        <p>${project.summary}</p>
      </article>
      <aside class="surface panel project-detail-stack" aria-labelledby="project-stack-title">
        ${operationLabel("Current implementation")}
        <h2 id="project-stack-title">Technology stack</h2>
        <div class="tag-list">
          ${project.stack.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </aside>
    </section>

    <section class="section project-detail-context" aria-labelledby="project-context-title">
      <header data-reveal>
        ${sectionHeader("System context", "Problem and engineering response", "The case study separates the reason for the project from the system being built to address it.", "h2", "project-context-title")}
      </header>
      <div class="project-detail-context__grid">
        <article class="surface panel" data-reveal>
          <span class="module-code">01 / PROBLEM</span>
          <h3>${caseStudy.problem.title}</h3>
          <p>${caseStudy.problem.description}</p>
        </article>
        <article class="surface panel" data-reveal>
          <span class="module-code">02 / RESPONSE</span>
          <h3>${caseStudy.solution.title}</h3>
          <p>${caseStudy.solution.description}</p>
        </article>
      </div>
    </section>

    <section class="section project-detail-architecture" aria-labelledby="project-architecture-title">
      <header data-reveal>
        ${sectionHeader("System architecture", "A traceable flow from source to useful output", "Each stage has one clear responsibility and creates a dependable input for the next.", "h2", "project-architecture-title")}
      </header>
      ${renderArchitecture(project)}
    </section>

    <section class="section project-detail-evidence" aria-labelledby="project-evidence-title">
      <header data-reveal>
        ${sectionHeader("Technical evidence", "Capabilities, challenges and learning", "The project is documented through demonstrated foundations and explicit engineering decisions, not speculative features.", "h2", "project-evidence-title")}
      </header>
      <div class="project-detail-evidence__grid">
        <article class="surface panel" data-reveal>
          ${operationLabel("Capabilities", "cyan")}
          ${renderList(caseStudy.capabilities)}
        </article>
        <article class="surface panel" data-reveal>
          ${operationLabel("Technical challenges")}
          ${renderList(caseStudy.challenges)}
        </article>
        <article class="surface panel" data-reveal>
          ${operationLabel("What this project teaches")}
          ${renderList(caseStudy.learnings)}
        </article>
      </div>
    </section>

    <section class="section surface panel project-detail-delivery" aria-labelledby="project-delivery-title" data-reveal>
      <header>
        ${sectionHeader("Delivery path", "Roadmap grounded in working foundations", "Future capabilities remain visible without being presented as completed work.", "h2", "project-delivery-title")}
      </header>
      ${renderRoadmap(project)}
    </section>

    <section class="section surface panel project-detail-links" aria-labelledby="project-links-title" data-reveal>
      <div>
        ${operationLabel("Project access")}
        <h2 id="project-links-title">${accessTitle}</h2>
      </div>
      ${renderExternalLinks(project)}
    </section>
  `;
}

export function renderProjectUnavailable(project) {
  const projectName = project?.name || "Requested project";

  return `
    <section class="section page-intro not-found" data-page-title="PROJECT NOT FOUND">
      ${operationLabel("Project route unavailable", "amber")}
      <h1>Case study not available.</h1>
      <p>${projectName} does not have a published NEXUS case study yet.</p>
      ${buttonLink("Return to projects", "#/projects", "primary")}
    </section>`;
}
