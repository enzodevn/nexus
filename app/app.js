/*
==================================================

NEXUS
Application Entry Point

Version: 2.0.0

==================================================
*/


import { createLayout } from "./layout/layout.js";
import { renderHome } from "./views/home.js";



async function startApp() {


    const app =
        document.getElementById("app");



    if (!app) {

        console.error(
            "[NEXUS] Application container not found."
        );

        return;

    }



    const layout =
        createLayout();



    app.appendChild(
        layout
    );



    const content =
        document.getElementById(
            "app-content"
        );



    await renderHome(
        content
    );



    console.log(
        "[NEXUS] Application started successfully."
    );


}



startApp();