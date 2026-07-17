export function createEcosystem(data) {
    const section = document.createElement("section");
    section.className = "ecosystem center-operations-layout";

    section.innerHTML = `
        <!-- Marcador HUD de Alinhamento Óptico Superior -->
        <div class="stark-hud-header font-mono">
            <span class="hud-bracket">[</span>
            <span class="hud-target-text">NEXUS_ECOSYSTEM_CORE</span>
            <span class="hud-bracket">]</span>
        </div>

        <div class="hud-header-wrapper">
            <div class="section-title">
                <h2>${data.title}</h2>
            </div>
        </div>

        <!-- Matriz de Painéis de Vidro Cristalino Estilo VisionOS -->
        <div class="ecosystem-asymmetric-matrix">
            ${data.items.map((item, index) => {
                const isMainMonitor = index < 2;
                const layoutClass = isMainMonitor ? "hud-main-monitor" : "hud-side-widget";
                
                return `
                    <article class="eco-modular-panel ${layoutClass} surface">
                        <!-- Miras Angulares Discretas nos Cantos -->
                        <div class="hud-crosshair top-left"></div>
                        <div class="hud-crosshair bottom-right"></div>
                        
                        <div class="stark-panel-body">
                            <div class="stark-card-header">
                                <!-- Ícone de Vetor Geométrico Fixo para Identidade Visual -->
                                <div class="stark-arc-indicator">
                                    <svg viewBox="0 0 36 36" class="circular-chart">
                                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path class="circle" stroke-dasharray="${75 - (index * 12)}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                </div>
                                <h3>${item.title}</h3>
                            </div>

                            <p class="panel-data-stream">
                                ${item.description}
                            </p>

                            <div class="eco-stack">
                                ${item.stack.map(tech => `
                                    <span class="tech-tag spec-tag font-mono">${tech}</span>
                                `).join("")}
                            </div>
                        </div>
                    </article>
                `;
            }).join("")}
        </div>
    `;

    return section;
}