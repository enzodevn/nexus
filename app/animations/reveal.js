import { prefersReducedMotion } from "../core/motion.js";

let activeObserver;

export function initializeRevealAnimations(root = document) {
  activeObserver?.disconnect();

  const elements = [...root.querySelectorAll("[data-reveal]")];
  const reduceMotion = prefersReducedMotion();

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  activeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--reveal-delay", `${Math.min(index * 70, 210)}ms`);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  elements.forEach((element) => activeObserver.observe(element));
}
