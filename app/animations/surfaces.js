let surfaceAbortController;

export function initializeSurfaceMotion(root = document) {
  surfaceAbortController?.abort();
  surfaceAbortController = new AbortController();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsPointerMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduceMotion || !supportsPointerMotion) return;

  root.querySelectorAll("[data-motion-surface]").forEach((surface) => {
    let animationFrame;

    surface.addEventListener(
      "pointermove",
      (event) => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          const bounds = surface.getBoundingClientRect();
          surface.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
          surface.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
          surface.classList.add("is-pointer-active");
        });
      },
      { signal: surfaceAbortController.signal },
    );

    surface.addEventListener(
      "pointerleave",
      () => {
        cancelAnimationFrame(animationFrame);
        surface.classList.remove("is-pointer-active");
        surface.style.removeProperty("--pointer-x");
        surface.style.removeProperty("--pointer-y");
      },
      { signal: surfaceAbortController.signal },
    );
  });
}
