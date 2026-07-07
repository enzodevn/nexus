export function createLabCard(lab) {


    const card = document.createElement("article");


    card.classList.add("lab-card");



    card.innerHTML = `


        <h2>
            ${lab.name}
        </h2>



        <h3>
            ${lab.category}
        </h3>



        <p>
            ${lab.description}
        </p>



        <p>
            Status:
            ${lab.status}
        </p>



        <ul>

            ${lab.technologies.map(tech => `

                <li>
                    ${tech}
                </li>

            `).join("")}


        </ul>


    `;



    return card;

}