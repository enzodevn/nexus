import { prefersReducedMotion } from "../core/motion.js";

const EXIT_DURATION = 280;
const ENTRY_DURATION = 620;

let activeEntry;

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function settleActiveEntry() {
  if (!activeEntry) return;

  window.clearTimeout(activeEntry.timer);
  window.cancelAnimationFrame(activeEntry.frameId);
  activeEntry.root.classList.remove("is-route-entering", "is-route-active");
  activeEntry.root.removeAttribute("inert");
  activeEntry.resolve();
  activeEntry = null;
}

export async function transitionRouteOut(root) {
  settleActiveEntry();

  if (prefersReducedMotion() || !root.querySelector("#main-content")) return;

  root.setAttribute("inert", "");
  root.classList.add("is-route-leaving");
  await wait(EXIT_DURATION);
}

export function transitionRouteIn(root, { isInitial = false } = {}) {
  root.classList.remove("is-route-leaving");

  if (isInitial) return Promise.resolve();

  if (prefersReducedMotion()) {
    root.removeAttribute("inert");
    return Promise.resolve();
  }

  root.classList.add("is-route-entering");
  void root.offsetWidth;

  const finished = new Promise((resolve) => {
    const entry = {
      root,
      resolve,
      frameId: null,
      timer: null,
    };

    activeEntry = entry;
    entry.frameId = window.requestAnimationFrame(() => {
      if (activeEntry === entry) root.classList.add("is-route-active");
    });
    entry.timer = window.setTimeout(settleActiveEntry, ENTRY_DURATION);
  });

  return finished;
}

export function resetRouteTransition(root) {
  settleActiveEntry();
  root.classList.remove("is-route-leaving", "is-route-entering", "is-route-active");
  root.removeAttribute("inert");
}
