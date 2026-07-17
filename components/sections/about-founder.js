export function createFounderSection(data){

    const section=document.createElement("section");

    section.className="about-founder";

    section.innerHTML=`

        <div class="founder-panel">

            <div class="founder-left">

                <div class="identity-card">

                    <div class="identity-glow"></div>

                    <div class="identity-photo">

                        YOUR PHOTO

                    </div>

                </div>

            </div>

            <div class="founder-right">

                <span class="section-label">

                    ABOUT ME

                </span>

                <h2>

                    ${data.about.title}

                </h2>

                <p>

                    ${data.about.description}

                </p>

                <div class="identity-tags">

                    <span>Software Engineering</span>

                    <span>Cloud Infrastructure</span>

                    <span>Cybersecurity</span>

                    <span>Artificial Intelligence</span>

                    <span>Data Engineering</span>

                </div>

            </div>

        </div>

        <div class="purpose-panel">

            <span class="section-label">

                WHY NEXUS

            </span>

            <h2>

                ${data.purpose.title}

            </h2>

            <p>

                ${data.purpose.description}

            </p>

        </div>

    `;

    return section;

}