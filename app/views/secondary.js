import {
  buttonLink,
  operationLabel,
  sectionHeader,
} from "../../components/ui/primitives.js";

const pageMeta = {
  "/roadmap": {
    index: "04",
    eyebrow: "Mission sequence",
    title: "Direction without artificial deadlines.",
    description:
      "The roadmap is organized as capability levels. Every level strengthens the foundation required by the systems that follow.",
  },
};

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
