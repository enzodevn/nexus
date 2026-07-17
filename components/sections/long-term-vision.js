export function createLongTermVision(vision){

    const section = document.createElement("section");

    section.className = "long-term-vision";

    section.innerHTML = `

        <div class="vision-panel">

            <span class="section-label">

                LONG-TERM VISION

            </span>

            <h2>

                ${vision.title}

            </h2>

            <p>

                ${vision.description}

            </p>

        </div>

    `;

    return section;

}