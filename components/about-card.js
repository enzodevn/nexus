export function createAboutCard(profile) {


    const card = document.createElement("section");


    card.classList.add("about-card");



    card.innerHTML = `


        <h2>
            ${profile.name}
        </h2>



        <h3>
            ${profile.title}
        </h3>



        <p>
            ${profile.description}
        </p>



        <p>
            ${profile.mission}
        </p>



        <ul>

            ${profile.focus.map(item => `

                <li>
                    ${item}
                </li>

            `).join("")}


        </ul>


    `;


    return card;

}