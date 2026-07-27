export function createHero(hero) {

    const section = document.createElement("section");

    section.className = "hero section";

    section.innerHTML = `

        <div class="hero-panel glass-panel operation-panel hud">

            <div class="hero-header">

                <span class="operation-label">
                    ${hero.label}
                </span>

                <h1>
                    ${hero.title}
                </h1>

                <h2>
                    ${hero.subtitle}
                </h2>

                <p>
                    ${hero.description}
                </p>

            </div>

            <div class="hero-tags">

                ${hero.tags.map(tag=>`

                    <span class="badge">
                        ${tag}
                    </span>

                `).join("")}

            </div>

            <div class="hero-actions">

                <a
                    href="${hero.button.link}"
                    class="button btn-primary">

                    ${hero.button.label}

                </a>

                <a
                    href="${hero.secondaryButton.link}"
                    class="button btn-secondary">

                    ${hero.secondaryButton.label}

                </a>

            </div>

            <div class="divider"></div>

            <div class="hero-metrics">

                ${hero.metrics.map(metric=>`

                    <div class="metric-card">

                        <span>

                            ${metric.label}

                        </span>

                        <strong>

                            ${metric.value}

                        </strong>

                    </div>

                `).join("")}

            </div>

        </div>

    `;

    return section;

}