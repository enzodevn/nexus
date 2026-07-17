export function createVision() {
    const section = document.createElement("section");
    section.className = "vision center-operations-layout";

    section.innerHTML = `
        <div class="vision-panoramic-panel surface fade-up">
            <!-- HUD Grid de Fundo local para efeito de profundidade -->
            <div class="hud-matrix-overlay"></div>
            <div class="card-scanline"></div>
            
            <!-- Indicadores Geométricos Laterais (Estilo HUD Terminal) -->
            <div class="hud-bracket left-bracket"></div>
            <div class="hud-bracket right-bracket"></div>

            <div class="vision-container">
                <div class="vision-badge font-mono">
                    <span class="pulse-ring"></span>
                    <span class="label text-glow-blue">SYSTEM_MANIFESTO // LONG_TERM_VISION</span>
                </div>
                
                <h2>Building the Future Through Technology</h2>
                
                <p class="vision-text">
                    <strong>NEXUS</strong> is more than a portfolio. It is a long-term technology ecosystem focused on Software Engineering, 
                    Artificial Intelligence, Cloud Infrastructure, Cybersecurity and Data Engineering.
                </p>
                
                <p class="vision-text secondary-vision">
                    Every project, experiment and research contributes to a larger vision: 
                    creating intelligent digital systems inspired by real-world technology, 
                    advanced infrastructure and the future of computing.
                </p>
                
                <!-- Telemetria Estilizada de Rodapé do Bloco -->
                <div class="vision-footer-telemetry font-mono">
                    <span>STATUS: CONSOLIDATED</span>
                    <span>COGNITIVE_INDEX: OPTIMAL</span>
                    <span>SYS_EXEC: TRUE</span>
                </div>
            </div>
        </div>
    `;

    return section;
}