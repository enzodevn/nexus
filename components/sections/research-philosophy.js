export function createResearchPhilosophy(philosophy){

    const section = document.createElement("section");

    section.className = "research-philosophy";

    section.innerHTML = `

        <div class="philosophy-panel">

            <span class="section-label">

                RESEARCH PHILOSOPHY

            </span>

            <h2>

                ${philosophy.title}

            </h2>

            <p>

                ${philosophy.description}

            </p>

        </div>

    `;

    return section;

}