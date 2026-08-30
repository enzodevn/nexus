const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!url) {
    canonical?.remove();
    return;
  }

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }

  canonical.setAttribute("href", url);
}

function getPublicDocumentUrl() {
  if (!["http:", "https:"].includes(window.location.protocol)) return null;
  if (LOCAL_HOSTNAMES.has(window.location.hostname)) return null;

  const url = new URL(window.location.href);
  url.hash = "";
  return url.href;
}

function getProjectMetadata(site, projects, slug) {
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return { ...site.routes["*"], project: null };

  return {
    ...site.routes["/projects/:slug"],
    title: `${project.name} — NEXUS Case Study`,
    description: project.summary,
    project,
  };
}

function resolveMetadata(site, projects, path, pattern, params) {
  if (pattern === "/projects/:slug") {
    return getProjectMetadata(site, projects, params.slug);
  }

  const routeKey = pattern === "*" ? "*" : path;
  return { ...(site.routes[routeKey] ?? site.routes["*"]), project: null };
}

function updateStructuredData(site, metadata, publicUrl) {
  const website = {
    "@type": "WebSite",
    "@id": "#nexus-website",
    name: site.identity.name,
    headline: site.identity.headline,
    description: site.identity.description,
    inLanguage: site.identity.language,
    creator: { "@id": "#enzo-felix-martins" },
  };

  const creator = {
    "@type": "Person",
    "@id": "#enzo-felix-martins",
    name: site.author.name,
    jobTitle: site.author.role,
    sameAs: site.author.sameAs,
  };

  if (publicUrl) website.url = publicUrl;

  const graph = [website, creator];

  if (metadata.project) {
    const repository = metadata.project.caseStudy?.links?.find((link) =>
      link.href.startsWith("https://github.com/"),
    );
    const project = {
      "@type": "SoftwareSourceCode",
      name: metadata.project.name,
      description: metadata.project.summary,
      creator: { "@id": "#enzo-felix-martins" },
      isPartOf: { "@id": "#nexus-website" },
    };

    if (repository) project.codeRepository = repository.href;
    graph.push(project);
  }

  const structuredData = document.querySelector("#site-structured-data");
  if (!structuredData) return;

  structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
}

function updateShareImage(site, shouldShare) {
  const image = shouldShare ? site.sharing.image : null;

  setMeta("property", "og:image", image);
  setMeta("property", "og:image:secure_url", image);
  setMeta("property", "og:image:type", image ? "image/png" : null);
  setMeta("property", "og:image:width", image ? String(site.sharing.width) : null);
  setMeta("property", "og:image:height", image ? String(site.sharing.height) : null);
  setMeta("property", "og:image:alt", image ? site.sharing.imageAlt : null);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", image ? site.sharing.imageAlt : null);
}

export function applyPageMetadata({ site, projects, path, pattern, params }) {
  const metadata = resolveMetadata(site, projects, path, pattern, params);
  const publicUrl = getPublicDocumentUrl();
  const shareImage = metadata.shareImage !== false;

  document.documentElement.lang = site.identity.language;
  document.title = metadata.title;

  setMeta("name", "description", metadata.description);
  setMeta("name", "author", site.author.name);
  setMeta("name", "application-name", site.identity.name);
  setMeta("name", "robots", metadata.robots);
  setMeta("name", "theme-color", site.identity.themeColor);
  setMeta("property", "og:title", metadata.title);
  setMeta("property", "og:description", metadata.description);
  setMeta("property", "og:type", metadata.type);
  setMeta("property", "og:site_name", site.identity.name);
  setMeta("property", "og:locale", site.identity.locale);
  setMeta("property", "og:url", publicUrl);
  setMeta("name", "twitter:card", shareImage ? "summary_large_image" : "summary");
  setMeta("name", "twitter:title", metadata.title);
  setMeta("name", "twitter:description", metadata.description);

  updateShareImage(site, shareImage);
  setCanonical(publicUrl);
  updateStructuredData(site, metadata, publicUrl);
}
