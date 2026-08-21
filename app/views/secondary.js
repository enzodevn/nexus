import {
  buttonLink,
  operationLabel,
  sectionHeader,
} from "../../components/ui/primitives.js";

const pageMeta = {
  "/labs": {
    index: "03",
    eyebrow: "Research operations",
    title: "Experiments with a path to production.",
    description:
      "Labs holds the questions, prototypes and technical investigations that inform the next generation of NEXUS systems.",
  },
  "/roadmap": {
    index: "04",
    eyebrow: "Mission sequence",
    title: "Direction without artificial deadlines.",
    description:
      "The roadmap is organized as capability levels. Every level strengthens the foundation required by the systems that follow.",
  },
};

function renderLabs(data) {
  return `<div class="labs-directory">
    ${data.home.labs
      .map(
        (lab, index) => `
          <article class="surface panel lab-directory-item ${index === 0 ? "is-primary" : ""}">
            <span class="registry-index">${String(index + 1).padStart(2, "0")}</span>
            ${operationLabel(lab.state, lab.signal)}
            <h2>${lab.name}</h2>
            <p>${lab.description}</p>
          </article>`,
      )
      .join("")}
  </div>`;
}

function renderRoadmap(data) {
  return `<ol class="surface panel roadmap-detail">
    ${data.home.vision
      .map(
        (step, index) => `<li>
          <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>${step.title}</h2>
            <p>${step.description}</p>
          </div>
        </li>`,
      )
      .join("")}
  </ol>`;
}

const pageRenderers = {
  "/labs": renderLabs,
  "/roadmap": renderRoadmap,
};

export function renderSecondaryView(path, data) {
  const meta = pageMeta[path];
  const renderContent = pageRenderers[path];

  if (!meta || !renderContent) {
    return `
      <section class="section page-intro not-found">
        ${operationLabel("Route unavailable", "amber")}
        <h1>Signal not found.</h1>
        <p>The requested NEXUS module does not exist.</p>
        ${buttonLink("Return home", "#/", "primary")}
      </section>`;
  }

  return `
    <section class="section page-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${meta.index}</div>
      ${sectionHeader(meta.eyebrow, meta.title, meta.description, "h1")}
    </section>
    <section class="section detail-section" data-reveal>
      ${renderContent(data)}
    </section>`;
}
