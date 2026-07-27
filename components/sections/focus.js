export function createFocus(data) {

    const section = document.createElement("section");

    section.className = "focus";

    section.innerHTML = `

        <div class="focus-panel glass-panel">

            <div class="focus-header">

                <span class="focus-label">
                    CURRENT FOCUS
                </span>

                <h2>${data.title}</h2>

                <p>${data.subtitle}</p>

            </div>

            <div class="focus-divider"></div>

            <div class="focus-list">

                ${data.items.map(item => `

                    <article class="focus-item">

                        <div class="focus-item-content">

                            <h3>${item.title}</h3>

                            <p>${item.description}</p>

                        </div>

                        <div class="focus-stage">

                            <span>Stage</span>

                            <strong>${item.stage}</strong>

                        </div>

                    </article>

                `).join("")}

            </div>

        </div>

    `;

    return section;

}