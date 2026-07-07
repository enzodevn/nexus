export function createRoadmapCard(item) {

    const card = document.createElement("article");

    card.classList.add("roadmap-card");


    card.innerHTML = `

        <div class="roadmap-year">
            ${item.year}
        </div>


        <h3>
            ${item.phase}
        </h3>


        <p>
            ${item.description}
        </p>


        <ul>

            ${item.focus.map(skill => `

                <li>
                    ${skill}
                </li>

            `).join("")}

        </ul>

    `;


    return card;

}