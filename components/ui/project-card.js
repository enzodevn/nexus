export function createProjectCard(project) {


    const card = document.createElement("article");


    card.className =
        "surface surface-md project-card fade-up";



    card.innerHTML = `


        <div class="project-header">


            <h3>
                ${project.name}
            </h3>


            <span class="project-category">
                ${project.category}
            </span>


        </div>




        <p class="project-description">

            ${project.description}

        </p>





        <div class="project-technologies">


            ${project.technologies.map(tech => `

                <span class="tech-tag">

                    ${tech}

                </span>

            `).join("")}


        </div>


    `;



    return card;


}