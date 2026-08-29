import { loadData } from "../core/data.js";
import { renderProjectsSections } from "../../components/sections/projects.js";

export async function renderProjectsView() {
  const { projects } = await loadData("projects");
  return renderProjectsSections(projects);
}
