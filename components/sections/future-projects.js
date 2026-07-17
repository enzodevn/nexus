export function createFutureProjects(future){

    const section = document.createElement("section");

    section.className = "future-projects";

    section.innerHTML = `

        <div class="future-header">

            <span class="section-label">

                FUTURE SYSTEMS

            </span>

            <h2>

                Vision Beyond Today

            </h2>

            <p>

                Technologies and platforms currently under research,
                planning and long-term development.

            </p>

        </div>

    `;

    const grid = document.createElement("div");

    grid.className = "future-grid";

    future.forEach(item=>{

        const card=document.createElement("article");

        card.className="future-card";

        card.innerHTML=`

            <h3>${item.name}</h3>

            <span>${item.status}</span>

        `;

        grid.appendChild(card);

    });

    section.appendChild(grid);

    return section;

}