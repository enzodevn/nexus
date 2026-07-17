export function createLabCard(item) {


    const card = document.createElement("article");


    card.className =
        "surface surface-md research-card fade-up";



    card.innerHTML = `


        <div class="research-header">


            <span class="label">

                ${item.type}

            </span>



            <h3>

                ${item.title}

            </h3>


        </div>





        <p>

            ${item.description}

        </p>





        <div class="research-fields">


            ${item.fields.map(field => `


                <span class="tech-tag">

                    ${field}

                </span>


            `).join("")}


        </div>


    `;



    return card;


}