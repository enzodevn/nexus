import { loadData } from "../core/data.js";
import { renderAboutSections } from "../../components/sections/about.js";

export async function renderAboutView() {
  const { about } = await loadData("about");
  return renderAboutSections(about);
}
