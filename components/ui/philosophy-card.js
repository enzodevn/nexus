/*
==================================================

NEXUS
Philosophy Card Component

Version: 1.0.0

==================================================
*/


export function createPhilosophyCard(philosophy) {


    const card =
        document.createElement("section");


    card.classList.add(
        "philosophy-card",
        "fade-up"
    );



    card.innerHTML = `



        <span class="hero-label">

            PHILOSOPHY

        </span>





        <h2>

            ${philosophy.title}

        </h2>





        <h3>

            Mission

        </h3>



        <p>

            ${philosophy.mission}

        </p>





        <h3>

            Vision

        </h3>



        <p>

            ${philosophy.vision}

        </p>





        <h3>

            Values

        </h3>




        <ul>


            ${philosophy.values.map(value => `


                <li>

                    ${value}

                </li>


            `).join("")}



        </ul>



    `;



    return card;


}