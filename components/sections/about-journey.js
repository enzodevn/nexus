export function createAboutJourney(data){

    const section=document.createElement("section");

    section.className="about-journey";

    section.innerHTML=`

        <div class="journey-header">

            <span class="section-label">

                CURRENT JOURNEY

            </span>

            <h2>

                ${data.journey.title}

            </h2>

            <p>

                Every step represents another layer in the long-term construction of the NEXUS ecosystem.

            </p>

        </div>

        <div class="journey-timeline">

            ${data.journey.steps.map((step,index)=>`

                <div class="journey-item">

                    <div class="journey-node"></div>

                    <div class="journey-card">

                        <span>

                            STEP ${String(index+1).padStart(2,"0")}

                        </span>

                        <h3>

                            ${step}

                        </h3>

                    </div>

                </div>

            `).join("")}

        </div>

    `;

    return section;

}