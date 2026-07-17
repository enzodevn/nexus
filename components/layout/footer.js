export function createFooter(){

    const footer=document.createElement("footer");

    footer.className="footer";

    footer.innerHTML=`

        <div class="footer-container">

            <div class="footer-brand">

                <span class="footer-dot"></span>

                <h2>NEXUS</h2>

            </div>

            <p>

                Building Digital Systems

            </p>

            <nav class="footer-links">

                <a href="/">Home</a>

                <a href="/about">About</a>

                <a href="/projects">Projects</a>

                <a href="/labs">Labs</a>

                <a href="/roadmap">Roadmap</a>

            </nav>

        </div>

    `;

    return footer;

}