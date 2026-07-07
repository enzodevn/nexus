import { createNavbar } from "../components/navbar.js";


const app = document.body;


const navbar = createNavbar();


app.prepend(navbar);