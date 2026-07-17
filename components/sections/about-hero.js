export function createAboutHero(data) {

    const section = document.createElement("section");

    section.className = "about-hero";

    section.innerHTML = `

        <div class="about-hero-grid">

            <div class="about-left">

                <span class="hero-label">

                    ${data.hero.label}

                </span>

                <h1>

                    ${data.hero.title}

                </h1>

                <h2>

                    ${data.hero.subtitle}

                </h2>

                <p>

                    ${data.hero.description}

                </p>

                <div class="hero-stack">

                    ${data.hero.technologies.map(item => `

                        <span>${item}</span>

                    `).join("")}

                </div>

            </div>

            <div class="about-right">

                <div class="portrait">

                    <div class="portrait-glow"></div>

                    <div class="portrait-ring"></div>

                    <div class="portrait-card">

                        <div class="portrait-image">

                            YOUR PHOTO

                        </div>

                    </div>

                    <div class="portrait-reflection"></div>

                </div>

            </div>

        </div>

    `;

    return section;

}