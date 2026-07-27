export function createFeatured(data) {

    const section = document.createElement("section");

    section.className = "featured";

    section.innerHTML = `

        <div class="featured-panel glass-panel">

            <div class="featured-header">

                <span class="featured-label">${data.label}</span>

                <h2>${data.title}</h2>

                <h3>${data.subtitle}</h3>

                <p>${data.description}</p>

            </div>

            <div class="featured-divider"></div>

            <div class="featured-info">

                <div class="info-block">

                    <span>Status</span>

                    <strong>${data.status}</strong>

                </div>

                <div class="info-block">

                    <span>Stack</span>

                    <div class="stack-list">

                        ${data.stack
                            .map(tech => `<span class="stack-item">${tech}</span>`)
                            .join("")}

                    </div>

                </div>

                <div class="info-block">

                    <span>Next Milestone</span>

                    <strong>${data.milestone}</strong>

                </div>

            </div>

            <a class="featured-button" href="${data.button.link}">
                ${data.button.label}
                →
            </a>

        </div>

    `;

    return section;

}