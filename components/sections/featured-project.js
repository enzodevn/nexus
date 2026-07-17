export function createFeaturedProject(project){

    const section = document.createElement("section");

    section.className = "featured-project";

    section.innerHTML = `

        <div class="featured-panel">

            <div class="featured-info">

                <span class="section-label">
                    Featured Project
                </span>

                <h2>${project.name}</h2>

                <h3>${project.subtitle}</h3>

                <p>${project.description}</p>

                <div class="featured-stack">

                    ${project.stack.map(tech=>`

                        <span>${tech}</span>

                    `).join("")}

                </div>

            </div>

            <aside class="featured-side">

                <div class="status-pill">

                    <span class="status-dot"></span>

                    ${project.status}

                </div>

                <button>

                    ${project.button}

                </button>

            </aside>

        </div>

    `;

    return section;

}