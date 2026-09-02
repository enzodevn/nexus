import { initializeRevealAnimations } from "./animations/reveal.js";
import { initializeBootSequence } from "./animations/boot.js";
import {
  resetRouteTransition,
  transitionRouteIn,
  transitionRouteOut,
} from "./animations/navigation.js";
import { initializeSurfaceMotion } from "./animations/surfaces.js";
import { loadAppData } from "./core/data.js";
import { applyPageMetadata } from "./core/metadata.js";
import {
  bindMotionPreferenceControl,
  initializeMotionPreference,
  prefersReducedMotion,
} from "./core/motion.js";
import { Router } from "./router/router.js";
import { renderAboutView } from "./views/about.js";
import { renderContactView } from "./views/contact.js";
import { renderHomeView } from "./views/home.js";
import { renderLabsView } from "./views/labs.js";
import { renderNotFoundView } from "./views/not-found.js";
import { renderProjectDetailView } from "./views/project-detail.js";
import { renderProjectsView } from "./views/projects.js";
import { renderRoadmapView } from "./views/roadmap.js";
import { bindShellInteractions, renderShell } from "../components/layout/shell.js";

const app = document.querySelector("#app");
initializeMotionPreference();
const bootSequence = initializeBootSequence(document, {
  reducedMotion: prefersReducedMotion(),
});

function getInPageTarget(hash) {
  if (!hash?.startsWith("#") || hash.startsWith("#/")) return null;

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function focusAndScrollTo(target) {
  const reduceMotion =
    prefersReducedMotion() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  bootSequence.dismiss();
  resetRouteTransition(app);
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
    "/contact": () => renderContactView(),
    "/projects": () => renderProjectsView(),
    "/projects/:slug": ({ slug }) => renderProjectDetailView(slug),
    "/labs": () => renderLabsView(),
    "/roadmap": () => renderRoadmapView(),
    "*": () => renderNotFoundView(),
  };

  let activeNavigation = 0;
  const router = new Router(routes);
  router.start(async ({ path, route, params, pattern, isInitial }) => {
    const navigation = ++activeNavigation;
    app.setAttribute("aria-busy", "true");

    try {
      if (!isInitial) await transitionRouteOut(app);

      const content = await route(params);
      if (navigation !== activeNavigation) return;

      app.innerHTML = renderShell(content, data.home, path);
      bindShellInteractions(app);
      bindMotionPreferenceControl(app);
      initializeRevealAnimations(app);
      initializeSurfaceMotion(app);
      applyPageMetadata({
        site: data.site,
        projects: data.projects.projects,
        path,
        pattern,
        params,
      });

      if (isInitial) bootSequence.markReady();

      const inPageTarget = getInPageTarget(window.location.hash);
      const mainContent = app.querySelector("#main-content");
      if (!inPageTarget) window.scrollTo({ top: 0, behavior: "auto" });

      const transitionFinished = transitionRouteIn(app, { isInitial });

      requestAnimationFrame(async () => {
        if (navigation !== activeNavigation) return;

        await (isInitial ? bootSequence.finished : transitionFinished);
        if (navigation !== activeNavigation) return;

        if (inPageTarget) {
          focusAndScrollTo(inPageTarget);
          return;
        }

        if (!isInitial) mainContent?.focus({ preventScroll: true });
      });

      if (!isInitial) await transitionFinished;
    } catch (error) {
      if (navigation === activeNavigation) renderError(error);
    } finally {
      if (navigation === activeNavigation) app.removeAttribute("aria-busy");
    }
  });
} catch (error) {
  renderError(error);
}
