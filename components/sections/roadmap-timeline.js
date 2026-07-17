export function createRoadmapTimeline(timeline){

    const section = document.createElement("section");

    section.className = "roadmap-timeline";

    section.innerHTML = `

        <div class="section-header">

            <span class="section-label">

                CAREER JOURNEY

            </span>

            <h2>

                Building the Future Step by Step

            </h2>

            <p>

                Every milestone represents another step toward becoming a technology engineer capable of building intelligent systems.

            </p>

        </div>

    `;

    const container = document.createElement("div");

    container.className = "timeline";

    timeline.forEach(item=>{

        const card = document.createElement("article");

        card.className = "timeline-card";

        card.innerHTML = `

            <div class="timeline-year">

                ${item.year}

            </div>

            <div class="timeline-content">

                <h3>${item.title}</h3>

                <p>${item.description}</p>

            </div>

        `;

        container.appendChild(card);

    });

    section.appendChild(container);

    return section;

}