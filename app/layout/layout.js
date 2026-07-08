/*
==================================================
NEXUS
Application Layout
==================================================
*/

export function createLayout() {

    const layout = document.createElement("div");

    layout.className = "app-layout";

    layout.innerHTML = `
        <header id="navbar"></header>

        <main id="view"></main>

        <footer id="footer"></footer>
    `;

    return layout;

}