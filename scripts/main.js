import { createNavbar } from "../components/navbar.js";


const navbarContainer = document.getElementById(
    "navbar-container"
);


if (navbarContainer) {

    const navbar = createNavbar();

    navbarContainer.appendChild(navbar);

}