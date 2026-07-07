export function createHero(identity) {


    const section = document.createElement("section");


    section.classList.add("hero-card");



    section.innerHTML = `


        <h1>

            ${identity.name}

        </h1>



        <h2>

            ${identity.role}

        </h2>



        <p>

            ${identity.description}

        </p>



        <div class="focus-list">


            ${identity.focus.map(item => `

                <span>
                    ${item}
                </span>

            `).join("")}


        </div>


    `;



    return section;

}