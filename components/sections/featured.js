export function createFeatured(data) {
    const section = document.createElement("section");
    section.className = "featured center-operations-layout";

    section.innerHTML = `
        <!-- HUD Section Header -->
        <div class="hud-header-wrapper">
            <div class="hud-decor-line orange-decor"></div>
            <div class="section-title">
                <span class="label text-glow-orange">PROJECT_MATRIX // CRITICAL APPS</span>
                <h2>${data.title}</h2>
                <p class="hud-subtitle">${data.subtitle}</p>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="featured-grid">
            ${data.projects.map((project, index) => `
                <article class="featured-card surface" style="--card-delay: ${index * 150}ms">
                    <!-- Detalhes de Telas HUD -->
                    <div class="card-grid-overlay"></div>
                    <div class="hud-tag font-mono">[SYS_NODE_0${index + 1}]</div>

                    <div class="featured-category font-mono">
                        <span class="category-indicator"></span>
                        ${project.category}
                    </div>

                    <h3>${project.name}</h3>

                    <p class="project-desc">
                        ${project.description}
                    </p>

                    <!-- Telemetria do Projeto (Barra Simulada de Desenvolvimento/Uso da IA) -->
                    <div class="hud-pipeline-status">
                        <div class="pipeline-labels font-mono">
                            <span>CORE_INTEGRATION</span>
                            <span>100%</span>
                        </div>
                        <div class="pipeline-bar-bg">
                            <div class="pipeline-bar-fill animate-fill"></div>
                        </div>
                    </div>

                    <!-- Tech Stack Cluster -->
                    <div class="featured-stack">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag spec-tag font-mono">${tech}</span>
                        `).join("")}
                    </div>

                    <!-- Link Estilizado como Botao de Terminal -->
                    <a href="${project.link}" class="button btn-terminal font-mono">
                        ACCESS_NODE <span>→</span>
                    </a>
                </article>
            `).join("")}
        </div>
    `;

    return section;
}