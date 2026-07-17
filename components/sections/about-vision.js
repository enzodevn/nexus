export function createAboutVision(data){

    const section=document.createElement("section");

    section.className="about-vision";

    section.innerHTML=`

        <div class="vision-header">

            <span class="section-label">

                TECHNOLOGY VISION

            </span>

            <h2>

                ${data.vision.title}

            </h2>

            <p>

                The five technology pillars that define the evolution of the NEXUS ecosystem.

            </p>

        </div>

        <div class="vision-layout">

            <article class="vision-card large">

                <span class="vision-index">

                    CORE

                </span>

                <h3>

                    ${data.vision.items[0]}

                </h3>

            </article>

            <article class="vision-card">

                <span class="vision-index">

                    01

                </span>

                <h3>

                    ${data.vision.items[1]}

                </h3>

            </article>

            <article class="vision-card">

                <span class="vision-index">

                    02

                </span>

                <h3>

                    ${data.vision.items[2]}

                </h3>

            </article>

            <article class="vision-card">

                <span class="vision-index">

                    03

                </span>

                <h3>

                    ${data.vision.items[3]}

                </h3>

            </article>

            <article class="vision-card wide">

                <span class="vision-index">

                    FUTURE

                </span>

                <h3>

                    ${data.vision.items[4]}

                </h3>

            </article>

        </div>

    `;

    return section;

}