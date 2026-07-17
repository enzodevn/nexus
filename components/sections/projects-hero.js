export function createProjectsHero(data){

    const section=document.createElement("section");

    section.className="projects-hero";

    section.innerHTML=`

        <div class="projects-hero-content">

            <span class="hero-label">

                PROJECTS

            </span>

            <h1>

                ${data.hero.title}

            </h1>

            <p>

                ${data.hero.description}

            </p>

        </div>

    `;

    return section;

}