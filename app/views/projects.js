import { createProjectsHero } from "../../components/sections/projects-hero.js";
import { createFeaturedProject } from "../../components/sections/featured-project.js";
import { createProjectsGrid } from "../../components/sections/projects-grid.js";
import { createFutureProjects } from "../../components/sections/future-projects.js";
import { createFooter } from "../../components/layout/footer.js";

export async function renderProjects(){

    const page = document.createElement("main");

    page.className = "page";

    const data = await fetch("./data/projects.json")
        .then(response => response.json());

    page.appendChild(createProjectsHero(data));

    page.appendChild(createFeaturedProject(data.featured));

    page.appendChild(createProjectsGrid(data.projects));

    page.appendChild(createFutureProjects(data.future));

    page.appendChild(createFooter());

    return page;

}