/*
==================================================

NEXUS
Application Layout

Version: 2.0.0

Responsibility:
- Create application structure
- Mount global components

==================================================
*/


import { createNavbar } from "../../components/navbar.js";



export function createLayout() {


    const layout = document.createElement("div");


    layout.classList.add(
        "app-layout"
    );



    const navbarContainer =
        document.createElement("header");


    navbarContainer.id =
        "navbar";



    navbarContainer.appendChild(
        createNavbar()
    );



    const main =
        document.createElement("main");


    main.id =
        "app-content";



    const footer =
        document.createElement("footer");


    footer.id =
        "footer";



    footer.innerHTML = `
        <p>
            © NEXUS Technology Builder
        </p>
    `;



    layout.appendChild(
        navbarContainer
    );


    layout.appendChild(
        main
    );


    layout.appendChild(
        footer
    );



    return layout;


}