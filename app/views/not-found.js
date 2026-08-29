import { buttonLink, operationLabel } from "../../components/ui/primitives.js";

export function renderNotFoundView() {
  return `
    <section class="section page-intro not-found">
      ${operationLabel("Route unavailable", "amber")}
      <h1>Signal not found.</h1>
      <p>The requested NEXUS module does not exist.</p>
      ${buttonLink("Return home", "#/", "primary")}
    </section>`;
}
