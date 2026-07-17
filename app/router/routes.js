import { render } from "../core/render.js";

import { renderHome } from "../views/home.js";
import { renderAbout } from "../views/about.js";
import { renderProjects } from "../views/projects.js";
import { renderLabs } from "../views/labs.js";
import { renderRoadmap } from "../views/roadmap.js";



const routes = {

    "/": renderHome,

    "/about": renderAbout,

    "/projects": renderProjects,

    "/labs": renderLabs,

    "/roadmap": renderRoadmap

};





export async function navigate(path) {


    const route = routes[path];


    if (!route) {

        console.error(
            "Route not found:",
            path
        );

        return;

    }



    const page = await route();



    render(page);


}





export function initRouter(){


    document.addEventListener(
        "click",
        event => {


            const link =
            event.target.closest("a");



            if(!link) return;



            const href =
            link.getAttribute("href");



            if(!href) return;



            if(!href.startsWith("/")) return;



            event.preventDefault();



            navigate(href);



        }
    );


}