import { initializeRevealAnimations } from "./animations/reveal.js";
import { initializeSurfaceMotion } from "./animations/surfaces.js";
import { loadAppData } from "./core/data.js";
import { Router } from "./router/router.js";
import { renderAboutView } from "./views/about.js";
import { renderHomeView } from "./views/home.js";
import { renderLabsView } from "./views/labs.js";
import { renderNotFoundView } from "./views/not-found.js";
import { renderProjectsView } from "./views/projects.js";
import { renderRoadmapView } from "./views/roadmap.js";
import { bindShellInteractions, renderShell } from "../components/layout/shell.js";

const app = document.querySelector("#app");

function getInPageTarget(hash) {
  if (!hash?.startsWith("#") || hash.startsWith("#/")) return null;

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function focusAndScrollTo(target) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.focus({ preventScroll: true });
  target.scrollIntoView({
    block: "start",
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

function bindInPageNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]:not([href^="#/"])');
    if (!link) return;

    const target = getInPageTarget(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    focusAndScrollTo(target);
  });
}

function renderError(error) {
  console.error(error);
  app.innerHTML = `
    <main class="fatal-error">
      <span class="operation-label operation-label--amber">Initialization error</span>
      <h1>NEXUS could not load its data.</h1>
      <p>Run the project through a local HTTP server and reload the page.</p>
    </main>`;
}

bindInPageNavigation();

try {
  const data = await loadAppData();
  const routes = {
    "/": () => renderHomeView(data),
    "/about": () => renderAboutView(),
    "/projects": () => renderProjectsView(),
    "/labs": () => renderLabsView(),
    "/roadmap": () => renderRoadmapView(),
    "*": () => renderNotFoundView(),
  };

  let activeNavigation = 0;
  const router = new Router(routes);
  router.start(async ({ path, route, isInitial }) => {
    const navigation = ++activeNavigation;
    app.setAttribute("aria-busy", "true");

    try {
      const content = await route();
      if (navigation !== activeNavigation) return;

      app.innerHTML = renderShell(content, data.home, path);
      bindShellInteractions(app);
      initializeRevealAnimations(app);
      initializeSurfaceMotion(app);
      document.title = `${path === "/" ? "NEXUS" : path.slice(1).toUpperCase()} — Building Intelligent Systems`;

      const inPageTarget = getInPageTarget(window.location.hash);
      const mainContent = app.querySelector("#main-content");

      requestAnimationFrame(() => {
        if (navigation !== activeNavigation) return;

        if (inPageTarget) {
          focusAndScrollTo(inPageTarget);
          return;
        }

        if (!isInitial) mainContent?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    } catch (error) {
      if (navigation === activeNavigation) renderError(error);
    } finally {
      if (navigation === activeNavigation) app.removeAttribute("aria-busy");
    }
  });
} catch (error) {
  renderError(error);
}
