const PROJECT_ROUTE_PREFIX = "#/projects/";

export function normalizeProjectSlug(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getProjectRoute(project) {
  const slug = normalizeProjectSlug(project?.slug ?? project);
  return `${PROJECT_ROUTE_PREFIX}${encodeURIComponent(slug)}`;
}

export function findProjectBySlug(projects, slug) {
  const normalizedSlug = normalizeProjectSlug(slug);
  return projects.find((project) => project.slug === normalizedSlug);
}

export function hasPublishedCaseStudy(project) {
  return Boolean(project?.hasCaseStudy && project?.caseStudy);
}

export function getFeaturedProject(projects) {
  return projects.find((project) => project.featured);
}
