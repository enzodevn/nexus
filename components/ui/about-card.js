export function createAboutCard(profile) {


    const container = document.createElement("div");


    container.className =
        "about-container";



    container.innerHTML = `


        <article class="surface surface-lg about-profile-card">


            <span class="label">

                PROFILE

            </span>



            <h2>

                ${profile.name}

            </h2>



            <h3>

                ${profile.title}

            </h3>



            <p>

                ${profile.description}

            </p>



            <div class="about-focus">


                ${profile.focus.map(item => `

                    <span class="tech-tag">

                        ${item}

                    </span>


                `).join("")}


            </div>



        </article>





        <article class="surface surface-lg about-nexus-card">


            <span class="label">

                NEXUS VISION

            </span>



            <h3>

                Building Digital Systems

            </h3>



            <p>

                ${profile.mission}

            </p>



            <p>

                NEXUS explores software engineering,
                data platforms, cloud infrastructure,
                artificial intelligence and emerging
                computing technologies through
                continuous development and research.

            </p>



        </article>


    `;



    return container;


}