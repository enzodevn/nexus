/*
==================================================

NEXUS
Navigation Component

Version: 2.0.0

==================================================
*/


import { navigate } from "../app/router/routes.js";



export function createNavbar() {


    const nav =
        document.createElement("nav");



    nav.classList.add(
        "navbar"
    );



    nav.innerHTML = `

        <div class="logo">
            NEXUS
        </div>


        <ul>

            <li>
                <a href="#" data-route="home">
                    Home
                </a>
            </li>


            <li>
                <a href="#" data-route="projects">
                    Projects
                </a>
            </li>


            <li>
                <a href="#" data-route="labs">
                    Labs
                </a>
            </li>


            <li>
                <a href="#" data-route="roadmap">
                    Roadmap
                </a>
            </li>


            <li>
                <a href="#" data-route="about">
                    About
                </a>
            </li>


        </ul>

    `;



    const links =
        nav.querySelectorAll(
            "[data-route]"
        );



    links.forEach(link => {


        link.addEventListener(
            "click",
            event => {


                event.preventDefault();


                const route =
                    link.dataset.route;


                navigate(route);


            }
        );


    });



    return nav;


}