const MOTION_STORAGE_KEY = "nexus-motion";
const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function readStoredPreference() {
  try {
    const preference = window.localStorage.getItem(MOTION_STORAGE_KEY);
    return preference === "full" || preference === "reduced" ? preference : null;
  } catch {
    return null;
  }
}

function storePreference(preference) {
  try {
    window.localStorage.setItem(MOTION_STORAGE_KEY, preference);
  } catch {
    // The preference still applies to the current session when storage is unavailable.
  }
}

function resolvePreference() {
  return readStoredPreference() ?? (motionMediaQuery.matches ? "reduced" : "full");
}

function applyPreference(preference) {
  document.documentElement.dataset.motion = preference;
}

function updateControl(control) {
  const motionEnabled = !prefersReducedMotion();
  const label = control.querySelector("[data-motion-label]");

  control.setAttribute("aria-pressed", String(motionEnabled));
  control.setAttribute("aria-label", motionEnabled ? "Disable interface motion" : "Enable interface motion");
  control.title = motionEnabled ? "Disable interface motion" : "Enable interface motion";
  if (label) label.textContent = motionEnabled ? "Motion on" : "Motion off";
}

export function initializeMotionPreference() {
  applyPreference(resolvePreference());

  motionMediaQuery.addEventListener("change", () => {
    if (!readStoredPreference()) applyPreference(resolvePreference());
  });
}

export function prefersReducedMotion() {
  return document.documentElement.dataset.motion === "reduced";
}

export function bindMotionPreferenceControl(root = document) {
  const control = root.querySelector("[data-motion-toggle]");
  if (!control) return;

  updateControl(control);
  control.addEventListener("click", () => {
    const preference = prefersReducedMotion() ? "full" : "reduced";
    storePreference(preference);
    applyPreference(preference);
    updateControl(control);
  });
}
