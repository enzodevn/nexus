export function createActiveExperiments(experiments){

    const section = document.createElement("section");

    section.className = "active-experiments";

    section.innerHTML = `

        <div class="section-header">

            <span class="section-label">

                ACTIVE EXPERIMENTS

            </span>

            <h2>

                Current Research

            </h2>

            <p>

                Projects and experiments currently being developed inside the laboratory.

            </p>

        </div>

    `;

    const grid = document.createElement("div");

    grid.className = "experiments-grid";

    experiments.forEach(experiment=>{

        const card = document.createElement("article");

        card.className = "experiment-card";

        card.innerHTML = `

            <h3>${experiment}</h3>

            <span>In Progress</span>

        `;

        grid.appendChild(card);

    });

    section.appendChild(grid);

    return section;

}