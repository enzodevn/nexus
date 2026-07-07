export function createNavbar() {

    const nav = document.createElement("nav");

    nav.classList.add("navbar");


    nav.innerHTML = `

        <div class="logo">
            NEXUS
        </div>


        <ul>

            <li>
                <a href="/index.html">
                    Home
                </a>
            </li>


            <li>
                <a href="/pages/projects.html">
                    Projects
                </a>
            </li>


            <li>
                <a href="/pages/labs.html">
                    Labs
                </a>
            </li>


            <li>
                <a href="/pages/roadmap.html">
                    Roadmap
                </a>
            </li>


            <li>
                <a href="/pages/about.html">
                    About
                </a>
            </li>

        </ul>

    `;


    return nav;

}