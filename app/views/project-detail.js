import { loadData } from "../core/data.js";
import {
  renderProjectDetailSections,
  renderProjectUnavailable,
} from "../../components/sections/project-detail.js";

export async function renderProjectDetailView(slug) {
  const { projects } = await loadData("projects");
  const normalizedSlug = slug.trim().toLowerCase();
  const project = projects.projects.find((entry) => entry.slug === normalizedSlug);

  if (!project?.hasCaseStudy || !project.caseStudy) {
    return renderProjectUnavailable(project);
  }

  return renderProjectDetailSections(project);
}
