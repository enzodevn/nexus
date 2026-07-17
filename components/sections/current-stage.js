export function createCurrentStage(current){

    const section = document.createElement("section");

    section.className = "current-stage";

    section.innerHTML = `

        <div class="current-panel">

            <span class="section-label">

                CURRENT STAGE

            </span>

            <h2>

                ${current.title}

            </h2>

            <p>

                ${current.description}

            </p>

        </div>

    `;

    return section;

}