export function createResearchAreas(areas){

    const section = document.createElement("section");

    section.className = "research-areas";

    section.innerHTML = `

        <div class="section-header">

            <span class="section-label">

                CORE RESEARCH AREAS

            </span>

            <h2>

                Fields of Study

            </h2>

            <p>

                The technologies that define the foundation of the laboratory.

            </p>

        </div>

    `;

    const grid = document.createElement("div");

    grid.className = "research-grid";

    areas.forEach(area=>{

        const card=document.createElement("article");

        card.className="research-card";

        card.innerHTML=`

            <h3>${area.title}</h3>

            <p>${area.description}</p>

        `;

        grid.appendChild(card);

    });

    section.appendChild(grid);

    return section;

}