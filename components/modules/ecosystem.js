import { operationLabel, statusMark } from "../ui/primitives.js";

function renderNode(node, tone = "") {
  const modifier = tone ? ` ecosystem-node--${tone}` : "";
  return `<article class="ecosystem-node${modifier}">
    ${statusMark(tone === "signal" ? "active" : "muted")}
    <div>
      <h3>${node.label}</h3>
      <p>${node.capability}</p>
    </div>
  </article>`;
}

export function renderEcosystem(ecosystem) {
  return `
    <section class="surface panel ecosystem-panel" aria-labelledby="ecosystem-title" data-reveal>
      <header class="ecosystem-header">
        <div>
          ${operationLabel("Connected architecture")}
          <h2 id="ecosystem-title">Technology ecosystem</h2>
        </div>
        <span class="module-code">NX / MAP-01</span>
      </header>

      <div class="ecosystem-map" aria-label="NEXUS core connects software, cloud and data capabilities to AI and cybersecurity">
        <article class="core-node">
          <span class="core-node__orbit" aria-hidden="true"></span>
          <span class="core-node__caption">${ecosystem.core.caption}</span>
          <h3>${ecosystem.core.label}</h3>
          <p>${ecosystem.core.description}</p>
        </article>

        <div class="ecosystem-domains">
          ${ecosystem.domains.map((node) => renderNode(node, "domain")).join("")}
        </div>

        <div class="ecosystem-intelligence">
          ${ecosystem.intelligence.map((node, index) => renderNode(node, index === 0 ? "signal" : "")).join("")}
        </div>
      </div>

      <footer class="ecosystem-legend">
        <span>${statusMark()} Active research</span>
        <span>${statusMark("muted")} Connected discipline</span>
      </footer>
    </section>`;
}
