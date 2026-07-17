export function createProjectsGrid(projects){

    const section = document.createElement("section");

    section.className = "projects-grid-section";

    section.innerHTML = `

        <div class="projects-grid-header">

            <span class="section-label">

                OTHER PROJECTS

            </span>

            <h2>

                Building the ecosystem

            </h2>

        </div>

    `;

    const grid = document.createElement("div");

    grid.className = "projects-grid";

    projects.forEach(project=>{

        const card = document.createElement("article");

        card.className = "project-panel";

        card.innerHTML = `

            <span class="project-category">

                ${project.subtitle}

            </span>

            <h3>

                ${project.name}

            </h3>

            <button>

                View Project →

            </button>

        `;

        grid.appendChild(card);

    });

    section.appendChild(grid);

    return section;

}