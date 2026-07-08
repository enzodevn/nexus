/*
==========================================================
NEXUS

Core: Main Application Loader
Version: 2.1.0

Responsible for:
- Global components loading
- Application initialization

==========================================================
*/


import { createNavbar } from "../components/navbar.js";



function loadNavbar() {


    const navbarContainer = document.getElementById(
        "navbar"
    );


    if (!navbarContainer) {

        console.warn(
            "Navbar container not found"
        );

        return;

    }


    const navbar = createNavbar();


    navbarContainer.appendChild(navbar);


}



function initializeApp() {


    loadNavbar();


}



initializeApp();