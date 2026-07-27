export function createSystemStatus(data) {

    const section = document.createElement("section");

    section.className =
        "section system-status";

    section.innerHTML = `

        <div class="glass-panel operation-panel hud">

            <div class="section-header">

                <span class="operation-label">

                    ${data.label}

                </span>

                <h2>

                    ${data.title}

                </h2>

            </div>

            <div class="status-grid">

                ${data.cards.map(card=>`

                    <article class="status-item">

                        <span>

                            ${card.title}

                        </span>

                        <strong>

                            ${card.value}

                        </strong>

                        <div class="badge active">

                            ${card.status}

                        </div>

                    </article>

                `).join("")}

            </div>

        </div>

    `;

    return section;

}