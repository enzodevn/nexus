import { renderEcosystem } from "../modules/ecosystem.js";
import {
  buttonLink,
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";
import { getProjectRoute } from "../../app/core/projects.js";

function renderHero(home, status, focus) {
  return `
    <section class="section hero" aria-labelledby="hero-title">
      <aside class="surface panel hero-side hero-context" data-reveal>
        <div class="panel-heading">
          ${operationLabel("Current focus")}
          <span class="module-code">NX / HOME</span>
        </div>
        <ol class="context-list">
          ${focus.areas
            .map(
              (area, index) => `<li>
                <span class="context-index">${String(index + 1).padStart(2, "0")}</span>
                <div><strong>${area.title}</strong><span>${area.signal}</span></div>
                ${statusMark(index === 0 ? "active" : "muted")}
              </li>`,
            )
            .join("")}
        </ol>
        <p class="panel-note">Priority disciplines currently shaping the laboratory.</p>
      </aside>

      <div class="surface panel hero-core motion-surface home-neon-card" data-reveal data-motion-surface>
        ${motionFrame("strong")}
        <div class="core-ambient" aria-hidden="true"></div>
        <div class="hero-core__topline">
          ${operationLabel(home.hero.category, "cyan")}
          <span class="system-id">NEXUS / ${home.hero.version}</span>
        </div>
        <div class="hero-copy">
          <p class="hero-pretitle">Engineering operations center</p>
          <h1 id="hero-title">${home.hero.name}</h1>
          <p class="hero-slogan">${home.hero.slogan}</p>
          <p class="hero-description">${home.hero.description}</p>
          <div class="hero-actions">
            ${buttonLink(home.hero.primaryCta.label, home.hero.primaryCta.href, "primary", "↗")}
            ${buttonLink(home.hero.secondaryCta.label, home.hero.secondaryCta.href, "secondary", "→")}
          </div>
        </div>
        <div class="hero-core__footer">
          <span>${statusMark()} ${home.hero.platformState}</span>
          <span>Software · Cloud · Data · Intelligence</span>
        </div>
      </div>

      <aside class="surface panel hero-side hero-status" data-reveal>
        <div class="panel-heading">
          ${operationLabel("System status")}
          <span class="module-code">OPS / STATUS</span>
        </div>
        <dl class="status-list">
          ${status.items
            .map(
              (item) => `<div>
                <dt>${item.label}</dt>
                <dd>${statusMark(item.tone)}<span>${item.value}</span></dd>
              </div>`,
            )
            .join("")}
        </dl>
        <div class="status-summary">
          <span class="status-summary__line" aria-hidden="true"></span>
          <p>${status.summary}</p>
        </div>
      </aside>
    </section>`;
}

function renderFeatured(featured) {
  return `
    <section class="section" aria-labelledby="featured-title" data-reveal>
      <article class="surface panel featured-system motion-surface home-neon-card" data-motion-surface>
        ${motionFrame("soft")}
        <div class="featured-main">
          <div class="featured-heading">
            ${operationLabel("Featured system", "cyan")}
            <span class="module-code">${featured.code}</span>
          </div>
          <p class="featured-category">${featured.category}</p>
          <h2 id="featured-title">${featured.name}</h2>
          <p class="featured-description">${featured.summary}</p>
          ${buttonLink("Open visual case study", getProjectRoute(featured), "text", "→")}
        </div>
        <div class="featured-specs">
          <dl>
            <div><dt>Status</dt><dd>${statusMark("active")} ${featured.status}</dd></div>
            <div><dt>Stack</dt><dd class="tag-list">${featured.stack.map((item) => `<span>${item}</span>`).join("")}</dd></div>
            <div><dt>Next milestone</dt><dd><span class="amber-signal" aria-hidden="true"></span>${featured.milestones[1].title}</dd></div>
            <div><dt>System</dt><dd>${featured.code}</dd></div>
          </dl>
        </div>
      </article>
    </section>`;
}

function renderFocus(focus) {
  return `
    <section class="surface panel focus-panel" aria-labelledby="focus-title" data-reveal>
      <header class="focus-header">
        <div>
          ${operationLabel("Operational priorities")}
          <h2 id="focus-title">Current focus</h2>
        </div>
        <span class="module-code">NX / FOCUS</span>
      </header>
      <div class="focus-console">
        ${focus.areas
          .map(
            (area, index) => `<article class="focus-row">
              <span class="focus-index">0${index + 1}</span>
              <div class="focus-row__content">
                <div><h3>${area.title}</h3><span>${area.signal}</span></div>
                <ul>${area.capabilities.map((item) => `<li>${item}</li>`).join("")}</ul>
              </div>
            </article>`,
          )
          .join("")}
      </div>
    </section>`;
}

function renderLabs(home) {
  const [primary, ...secondary] = home.labs;
  return `
    <section class="section labs-section" aria-labelledby="labs-title">
      <div class="labs-intro" data-reveal>
        ${sectionHeader("Research operations", "Research & experimentation", home.labsDescription, "h2", "labs-title")}
        ${buttonLink("Explore labs", "#/labs", "secondary", "→")}
      </div>
      <div class="labs-grid">
        <article class="surface panel lab-primary motion-surface home-neon-card" data-reveal data-motion-surface>
          ${motionFrame("soft")}
          <div class="lab-visual" aria-hidden="true">
            <span></span><span></span><span></span><span></span><i></i>
          </div>
          <div class="lab-content">
            ${operationLabel(primary.state, primary.signal)}
            <span class="lab-number">01</span>
            <h3>${primary.name}</h3>
            <p>${primary.description}</p>
            <div class="lab-tags">${primary.topics.map((topic) => `<span>${topic}</span>`).join("")}</div>
          </div>
        </article>
        <div class="lab-stack">
          ${secondary
            .map(
              (lab, index) => `<article class="surface panel lab-module" data-reveal>
                <span class="lab-number">0${index + 2}</span>
                <div>${operationLabel(lab.state, lab.signal)}<h3>${lab.name}</h3></div>
                <span class="lab-arrow" aria-hidden="true">↗</span>
              </article>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function renderVision(home) {
  return `
    <section class="section vision-section" aria-labelledby="vision-title" data-reveal>
      ${sectionHeader("Long-term vision", "A sequence for advanced systems", home.visionDescription, "h2", "vision-title")}
      <ol class="surface panel mission-sequence">
        ${home.vision
          .map(
            (step, index) => `<li class="mission-step ${index === 0 ? "is-current" : ""}">
              <span class="mission-node" aria-hidden="true"></span>
              <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </li>`,
          )
          .join("")}
      </ol>
      <p class="vision-statement">${home.futureDirection}</p>
    </section>`;
}

export function renderHomeSections({ home, status, projects, focus, ecosystem }) {
  const featured = projects.projects.find((project) => project.featured);

  if (!featured) {
    throw new Error("The project registry requires one featured project.");
  }

  return `
    ${renderHero(home, status, focus)}
    ${renderFeatured(featured)}
    <div class="section operations-cluster">
      ${renderFocus(focus)}
      ${renderEcosystem(ecosystem)}
    </div>
    ${renderLabs(home)}
    ${renderVision(home)}
  `;
}
