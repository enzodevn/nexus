export function createProjectCard(project) {

    const card = document.createElement("div");

    card.classList.add("project-card");


    card.innerHTML = `

        <h3>
            ${project.name}
        </h3>


        <p>
            ${project.description}
        </p>


        <p>
            <strong>
                Categoria:
            </strong>
            ${project.category}
        </p>


        <p>
            <strong>
                Tecnologias:
            </strong>

            ${project.technologies.join(", ")}
        </p>


    `;


    return card;

}