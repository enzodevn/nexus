import { createLabsHero } from "../../components/sections/labs-hero.js";
import { createResearchAreas } from "../../components/sections/research-areas.js";
import { createActiveExperiments } from "../../components/sections/active-experiments.js";
import { createResearchPhilosophy } from "../../components/sections/research-philosophy.js";
import { createFooter } from "../../components/layout/footer.js";

export async function renderLabs() {

    const page = document.createElement("main");

    page.className = "page";

    const response = await fetch("./data/labs.json");

    const data = await response.json();

    page.appendChild(
        createLabsHero(data)
    );

    page.appendChild(
        createResearchAreas(data.areas)
    );

    page.appendChild(
        createActiveExperiments(data.experiments)
    );

    page.appendChild(
        createResearchPhilosophy(data.philosophy)
    );

    page.appendChild(
        createFooter()
    );

    return page;

}