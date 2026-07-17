export function createHero(hero) {
    const section = document.createElement("section");
    section.className = "hero";

    section.innerHTML = `
        <div class="hero-background">
            <div class="hero-glow hero-glow-left"></div>
            <div class="hero-glow hero-glow-right"></div>
            <div class="hero-grid"></div>
            <div class="hero-noise"></div>
        </div>
        
        <div class="hero-content fade-up">
            <!-- Badge Minimalista VisionOS -->
            <div class="hero-badge" style="margin-bottom: 32px;">
                <span class="hero-dot"></span>
                <span class="label">${hero.label}</span>
            </div>

            <h1 class="glitch-title">
                ${hero.title}
            </h1>
            
            <h2 class="sub-matrix">
                ${hero.subtitle}
            </h2>
            
            <p class="operation-desc">
                ${hero.description}
            </p>
            
            <div class="hero-tags">
                ${hero.tags
                    .map(tag => `<span class="tech-tag">${tag}</span>`)
                    .join("")}
            </div>
            
            <div class="hero-actions">
                <a href="${hero.button.link}" class="button btn-primary">
                    <span class="btn-text">${hero.button.label}</span>
                    <span class="btn-arrow">→</span>
                </a>
            </div>
        </div>
    `;

    return section;
}