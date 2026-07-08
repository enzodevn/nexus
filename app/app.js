import { renderHome } from "./views/home.js";


function startApp() {

    const app = document.getElementById("app");


    if (!app) {

        console.error(
            "[NEXUS] Application container not found."
        );

        return;

    }


    renderHome(app);


    console.log(
        "[NEXUS] Application started successfully."
    );

}


startApp();