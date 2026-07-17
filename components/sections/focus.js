export function createFocus(data) {
    const section = document.createElement("section");
    section.className = "focus center-operations-layout";

    // Garante que o componente não quebre caso os dados demorem a carregar
    const title = data && data.title ? data.title : "Current Focus";
    const items = data && data.items ? data.items : [];

    section.innerHTML = `
        <div class="section-title">
            <h2>${title}</h2>
        </div>

        <!-- Grid de cards simétricos e arredondados -->
        <div class="compact-grid">
            ${items.map((item) => `
                <article class="compact-card surface">
                    <div class="focus-card-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </article>
            `).join("")}
        </div>
    `;

    return section;
}