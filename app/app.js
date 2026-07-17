import { createLayout } from "./layout/layout.js";

import { initRouter, navigate } from "./router/routes.js";



const app = document.querySelector("#app");



app.appendChild(
    createLayout()
);



initRouter();



navigate("/");