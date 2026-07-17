export function createNavbar(){


    const nav = document.createElement("nav");


    nav.className = "navbar fade-down";



    nav.innerHTML = `


        <div class="nav-brand">


            <a href="/" class="brand">

                NEXUS

            </a>


        </div>



        <div class="nav-links">


            <a href="/">Home</a>

            <a href="/about">About</a>

            <a href="/projects">Projects</a>

            <a href="/labs">Labs</a>

            <a href="/roadmap">Roadmap</a>


        </div>


    `;



    return nav;


}