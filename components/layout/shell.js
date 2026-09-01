let shellAbortController;

function renderNavigation(items, currentPath) {
  return items
    .map((item) => {
      const isActive =
        item.path === currentPath ||
        (item.path !== "/" && currentPath.startsWith(`${item.path}/`));
      return `<li><a href="#${item.path}" ${isActive ? 'aria-current="page"' : ""}>${item.label}</a></li>`;
    })
    .join("");
}

export function renderShell(content, home, currentPath) {
  return `
    <div class="site-frame">
      <div class="ambient-signals" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>
      <header class="floating-nav" data-nav>
        <a class="brand-mark" href="#/" aria-label="NEXUS home">
          <span class="brand-symbol" aria-hidden="true">N</span>
          <span>NEXUS</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
          <span class="sr-only">Toggle navigation</span>
          <span></span><span></span>
        </button>
        <nav id="primary-navigation" aria-label="Primary navigation">
          <ul>${renderNavigation(home.navigation, currentPath)}</ul>
        </nav>
        <span class="nav-system-state"><i aria-hidden="true"></i> ${home.hero.version} / stable</span>
      </header>
      <main id="main-content" tabindex="-1">${content}</main>
      <footer class="site-footer section">
        <div>
          <span class="brand-mark brand-mark--footer"><span class="brand-symbol" aria-hidden="true">N</span>NEXUS</span>
          <p>Building Intelligent Systems.</p>
        </div>
        <div class="footer-meta">
          <span>Technology Laboratory</span>
          <span>Engineering mission control</span>
        </div>
        <a href="#main-content" class="back-to-top">Back to top <span aria-hidden="true">↑</span></a>
      </footer>
      <button class="motion-toggle" type="button" data-motion-toggle aria-pressed="true">
        <span class="motion-toggle__signal" aria-hidden="true"></span>
        <span data-motion-label>Motion on</span>
      </button>
    </div>`;
}

export function bindShellInteractions(root) {
  shellAbortController?.abort();
  shellAbortController = new AbortController();

  const header = root.querySelector("[data-nav]");
  const toggle = root.querySelector(".nav-toggle");
  const nav = root.querySelector("#primary-navigation");

  if (!header || !toggle || !nav) return;

  const close = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const willOpen = !header.classList.contains("is-open");
    header.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  }, { signal: shellAbortController.signal });
}
