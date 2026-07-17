export function createRoadmapHero(data){

    const section=document.createElement("section");

    section.className="roadmap-hero";

    section.innerHTML=`

        <div class="hero-content">

            <span class="section-label">

                ROADMAP

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