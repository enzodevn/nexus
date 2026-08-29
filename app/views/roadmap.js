import { loadData } from "../core/data.js";
import { renderRoadmapSections } from "../../components/sections/roadmap.js";

export async function renderRoadmapView() {
  const { roadmap } = await loadData("roadmap");
  return renderRoadmapSections(roadmap);
}
