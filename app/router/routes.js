/*
==================================================

NEXUS
Application Router

Version: 2.0.0

Responsibility:
- Control views
- Navigate without reload

==================================================
*/


import { renderHome } from "../views/home.js";



const routes = {


    home: renderHome


};



export async function navigate(route) {


    const content =
        document.getElementById(
            "app-content"
        );



    if (!content) {

        console.error(
            "[Router] Content container not found."
        );

        return;

    }



    const view =
        routes[route];



    if (!view) {

        content.innerHTML = `

            <section>

                <h1>
                    404
                </h1>

                <p>
                    Page not found.
                </p>

            </section>

        `;

        return;

    }



    await view(content);


}