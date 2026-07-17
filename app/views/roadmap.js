import { createRoadmapHero } from "../../components/sections/roadmap-hero.js";
import { createCurrentStage } from "../../components/sections/current-stage.js";
import { createRoadmapTimeline } from "../../components/sections/roadmap-timeline.js";
import { createLongTermVision } from "../../components/sections/long-term-vision.js";
import { createFooter } from "../../components/layout/footer.js";

export async function renderRoadmap(){

    const page = document.createElement("main");

    page.className = "page";

    const response = await fetch("./data/roadmap.json");

    const data = await response.json();

    page.appendChild(
        createRoadmapHero(data)
    );

    page.appendChild(
        createCurrentStage(data.current)
    );

    page.appendChild(
        createRoadmapTimeline(data.timeline)
    );

    page.appendChild(
        createLongTermVision(data.vision)
    );

    page.appendChild(
        createFooter()
    );

    return page;

}