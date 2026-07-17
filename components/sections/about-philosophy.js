export function createAboutPhilosophy(data){

    const section=document.createElement("section");

    section.className="about-philosophy";

    section.innerHTML=`

        <div class="philosophy-header">

            <span class="section-label">

                PERSONAL PHILOSOPHY

            </span>

            <h2>

                ${data.philosophy.title}

            </h2>

            <p>

                Principles that guide every project, every decision and every long-term objective inside the NEXUS ecosystem.

            </p>

        </div>

        <div class="philosophy-grid">

            ${data.philosophy.items.map(item=>`

                <article class="philosophy-card">

                    <div class="card-glow"></div>

                    <h3>

                        ${item}

                    </h3>

                </article>

            `).join("")}

        </div>

    `;

    return section;

}