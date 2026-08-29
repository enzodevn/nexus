import { loadData } from "../core/data.js";
import { renderLabsSections } from "../../components/sections/labs.js";

export async function renderLabsView() {
  const { labs } = await loadData("labs");
  return renderLabsSections(labs);
}
