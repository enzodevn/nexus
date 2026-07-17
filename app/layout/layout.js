import { createNavbar } from "../../components/layout/navbar.js";

export function createLayout() {

    const app = document.createElement("div");

    app.className = "app";

    app.appendChild(
        createNavbar()
    );

    const pageContent = document.createElement("main");

    pageContent.id = "page-content";

    pageContent.className = "page-content";

    app.appendChild(pageContent);

    return app;

}