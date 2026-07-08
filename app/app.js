/*
==================================================

NEXUS
Application Entry Point

Version: 2.0.0

Responsibility:
- Initialize application
- Load global layout
- Start router

==================================================
*/


import { createLayout } from "./layout/layout.js";

import { navigate } from "./router/routes.js";



async function startApp() {


    const app =
        document.getElementById(
            "app"
        );



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



    await navigate(
        "home"
    );



    console.log(
        "[NEXUS] Application started successfully."
    );


}



startApp();