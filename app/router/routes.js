/*
==================================================
NEXUS
Router
==================================================
*/

export function loadRoute(route) {

    const view = document.getElementById("view");

    if (!view) {
        console.warn("[Router] View container not found.");
        return;
    }

    switch (route) {

        case "home":

            view.innerHTML = `
                <section class="loading-screen">

                    <h1>NEXUS</h1>

                    <p>Core initialized successfully.</p>

                </section>
            `;

            break;

        default:

            view.innerHTML = `
                <h2>404</h2>
                <p>Page not found.</p>
            `;

    }

}