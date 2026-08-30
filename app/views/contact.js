import { loadData } from "../core/data.js";
import { renderContactSections } from "../../components/sections/contact.js";

export async function renderContactView() {
  const { contact } = await loadData("contact");
  return renderContactSections(contact);
}
