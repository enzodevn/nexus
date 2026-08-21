import {
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderOverview({ profile, purpose }) {
  return `
    <section class="section about-overview" aria-labelledby="about-purpose-title" data-reveal>
      <article class="surface panel about-purpose">
        ${operationLabel(purpose.eyebrow, "cyan")}
        <div class="about-purpose__copy">
          <h2 id="about-purpose-title">${purpose.title}</h2>
          <p>${purpose.description}</p>
        </div>
        <p class="about-purpose__support">${purpose.supporting}</p>
      </article>

      <aside class="surface panel about-profile motion-surface" aria-labelledby="about-profile-name" data-motion-surface>
        ${motionFrame("soft")}
        <div class="panel-heading">
          ${operationLabel(profile.eyebrow)}
          <span class="module-code">NX / PROFILE</span>
        </div>
        <div class="about-profile__identity">
          <span class="about-profile__status">${statusMark()} ${profile.status}</span>
          <h2 id="about-profile-name">${profile.name}</h2>
          <p class="about-profile__role">${profile.role}</p>
          <p>${profile.description}</p>
        </div>
        <div class="tag-list about-focus-list">
          ${profile.focus.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </aside>
    </section>`;
}

function renderPrinciples(principles) {
  return `
    <section class="section about-principles" aria-labelledby="about-principles-title" data-reveal>
      <div class="about-principles__intro">
        ${sectionHeader(principles.eyebrow, principles.title, principles.description)}
      </div>
      <ol class="surface panel about-principles__list">
        ${principles.items
          .map(
            (item, index) => `<li>
              <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
              </div>
            </li>`,
          )
          .join("")}
      </ol>
    </section>`;
}

function renderJourney(journey) {
  return `
    <section class="section about-journey" aria-labelledby="about-journey-title" data-reveal>
      <header class="about-journey__header">
        ${sectionHeader(journey.eyebrow, journey.title, journey.description)}
        <span class="module-code">NX / JOURNEY</span>
      </header>
      <ol class="surface panel about-journey__map">
        ${journey.stages
          .map(
            (stage, index) => `<li class="about-stage ${index === 0 ? "is-current" : ""}">
              <div class="about-stage__topline">
                <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
                <span class="about-stage__state">${statusMark(index === 0 ? "active" : "muted")} ${stage.state}</span>
              </div>
              <h3>${stage.title}</h3>
              <p>${stage.description}</p>
            </li>`,
          )
          .join("")}
      </ol>
    </section>`;
}

function renderVision(vision) {
  return `
    <section class="section surface panel about-vision" aria-labelledby="about-vision-title" data-reveal>
      <div>
        ${operationLabel(vision.eyebrow, "cyan")}
        <h2 id="about-vision-title">${vision.title}</h2>
        <p>${vision.description}</p>
      </div>
      <blockquote>${vision.statement}</blockquote>
    </section>`;
}

export function renderAboutSections(about) {
  return `
    <section class="section page-intro about-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${about.meta.index}</div>
      ${sectionHeader(about.meta.eyebrow, about.meta.title, about.meta.description, "h1")}
    </section>
    ${renderOverview(about)}
    ${renderPrinciples(about.principles)}
    ${renderJourney(about.journey)}
    ${renderVision(about.vision)}
  `;
}
