export function createLabsHero(data){

    const section = document.createElement("section");

    section.className = "labs-hero";

    section.innerHTML = `

        <div class="hero-content">

            <span class="section-label">

                LABS

            </span>

            <h1>

                ${data.hero.title}

            </h1>

            <p>

                ${data.hero.description}

            </p>

        </div>

    `;

    return section;

}