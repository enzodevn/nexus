const FULL_SEQUENCE_DURATION = 4800;
const REDUCED_SEQUENCE_DURATION = 240;
const EXIT_DURATION = 780;
const FAST_EXIT_DURATION = 420;

const STAGES = [
  { threshold: 0, label: "Establishing core link" },
  { threshold: 0.24, label: "Calibrating signal field" },
  { threshold: 0.5, label: "Mapping system layers" },
  { threshold: 0.74, label: "Synchronizing interface" },
  { threshold: 0.92, label: "NEXUS ready" },
];

function createCompletedSequence() {
  return {
    finished: Promise.resolve(),
    markReady() {},
    dismiss() {},
  };
}

export function initializeBootSequence(root = document, { reducedMotion = false } = {}) {
  const screen = root.querySelector("[data-boot]");
  if (!screen) return createCompletedSequence();

  const application = root.querySelector("#app");
  const progress = screen.querySelector("[data-boot-progress]");
  const progressBar = screen.querySelector("[data-boot-progress-bar]");
  const progressValue = screen.querySelector("[data-boot-progress-value]");
  const stage = screen.querySelector("[data-boot-stage]");
  const skip = screen.querySelector("[data-boot-skip]");
  const duration = reducedMotion ? REDUCED_SEQUENCE_DURATION : FULL_SEQUENCE_DURATION;

  let dataReady = false;
  let skipRequested = false;
  let finishing = false;
  let frameId;
  let resolveFinished;
  let activeStage = "";

  const finished = new Promise((resolve) => {
    resolveFinished = resolve;
  });

  document.documentElement.classList.add("is-booting");
  screen.classList.toggle("is-reduced", reducedMotion);

  function updateProgress(value) {
    const percent = Math.round(value * 100);
    const currentStage = [...STAGES].reverse().find((item) => value >= item.threshold);

    progressBar.style.transform = `scaleX(${value})`;
    progressValue.textContent = String(percent).padStart(3, "0");
    progress.setAttribute("aria-valuenow", String(percent));

    if (currentStage && currentStage.label !== activeStage) {
      activeStage = currentStage.label;
      stage.textContent = currentStage.label;
    }
  }

  function cleanUp() {
    window.cancelAnimationFrame(frameId);
    skip?.removeEventListener("click", handleSkip);
    document.removeEventListener("keydown", handleKeydown);
    document.documentElement.classList.remove("is-booting");
    application?.removeAttribute("inert");
    application?.removeAttribute("aria-hidden");
    screen.remove();
    resolveFinished();
  }

  function finish({ fast = false } = {}) {
    if (finishing) return;

    finishing = true;
    updateProgress(1);
    screen.classList.toggle("is-fast-exit", fast);
    screen.classList.add("is-complete");
    window.setTimeout(cleanUp, reducedMotion ? 80 : fast ? FAST_EXIT_DURATION : EXIT_DURATION);
  }

  function handleSkip() {
    skipRequested = true;
    if (dataReady) finish({ fast: true });
  }

  function handleKeydown(event) {
    if (event.key === "Escape") handleSkip();
  }

  const startTime = performance.now();
  function advance(now) {
    if (finishing) return;

    const elapsed = now - startTime;
    const timelineProgress = Math.min(Math.max(elapsed / duration, 0), 1);
    const visibleProgress = dataReady ? timelineProgress : Math.min(timelineProgress, 0.92);

    updateProgress(visibleProgress);

    if (timelineProgress >= 1 && dataReady) {
      finish();
      return;
    }

    frameId = window.requestAnimationFrame(advance);
  }

  skip?.addEventListener("click", handleSkip);
  document.addEventListener("keydown", handleKeydown);
  frameId = window.requestAnimationFrame(advance);

  return {
    finished,
    markReady() {
      dataReady = true;
      screen.classList.add("is-data-ready");
      if (skipRequested) finish({ fast: true });
    },
    dismiss() {
      dataReady = true;
      finish({ fast: true });
    },
  };
}
