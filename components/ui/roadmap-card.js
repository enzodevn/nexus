export function createRoadmapCard(item) {


    const card = document.createElement("article");


    card.className =
        "surface surface-md roadmap-card fade-up";



    card.innerHTML = `


        <div class="roadmap-header">


            <span class="label">

                ${item.phase}

            </span>



            <h3>

                ${item.title}

            </h3>


        </div>





        <p>

            ${item.description}

        </p>





        <div class="roadmap-technologies">


            ${item.areas.map(area => `


                <span class="tech-tag">

                    ${area}

                </span>


            `).join("")}


        </div>


    `;



    return card;


}