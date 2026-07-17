import { createHero } from "../../components/sections/hero.js";
import { createEcosystem } from "../../components/sections/ecosystem.js";
import { createFeatured } from "../../components/sections/featured.js";
import { createFocus } from "../../components/sections/focus.js";
import { createVision } from "../../components/sections/vision.js";
import { createFooter } from "../../components/layout/footer.js";

export async function renderHome(){

    const page=document.createElement("main");

    page.className="page";

    const home=await fetch("./data/home.json").then(r=>r.json());

    const ecosystem=await fetch("./data/ecosystem.json").then(r=>r.json());

    const featured=await fetch("./data/featured.json").then(r=>r.json());

    const focus=await fetch("./data/focus.json").then(r=>r.json());

    page.appendChild(createHero(home.hero));

    page.appendChild(createEcosystem(ecosystem));

    page.appendChild(createFeatured(featured));

    page.appendChild(createFocus(focus));

    page.appendChild(createVision());

    page.appendChild(createFooter());

    return page;

}