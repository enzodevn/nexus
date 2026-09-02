import { loadData } from "../core/data.js";
import {
  renderProjectDetailSections,
  renderProjectUnavailable,
} from "../../components/sections/project-detail.js";
import {
  findProjectBySlug,
  hasPublishedCaseStudy,
} from "../core/projects.js";

export async function renderProjectDetailView(slug) {
  const { projects } = await loadData("projects");
  const project = findProjectBySlug(projects.projects, slug);

  if (!hasPublishedCaseStudy(project)) {
    return renderProjectUnavailable(project);
  }

  return renderProjectDetailSections(project);
}
