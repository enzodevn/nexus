import { createAboutHero } from "../../components/sections/about-hero.js";
import { createFounderSection } from "../../components/sections/about-founder.js";
import { createAboutVision } from "../../components/sections/about-vision.js";
import { createAboutJourney } from "../../components/sections/about-journey.js";
import { createAboutPhilosophy } from "../../components/sections/about-philosophy.js";
import { createFooter } from "../../components/layout/footer.js";

export async function renderAbout(){

    const page=document.createElement("main");

    page.className="page";

    const data=await fetch("./data/about.json")
        .then(response=>response.json());

    page.appendChild(
        createAboutHero(data)
    );

    page.appendChild(
        createFounderSection(data)
    );

    page.appendChild(
        createAboutVision(data)
    );

    page.appendChild(
        createAboutJourney(data)
    );

    page.appendChild(
        createAboutPhilosophy(data)
    );

    page.appendChild(
        createFooter()
    );

    return page;

}