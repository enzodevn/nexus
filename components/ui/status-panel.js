export function createStatusPanel(data) {

    const section = document.createElement("section");

    section.className = "status-panel surface";



    section.innerHTML = `

        <div class="status-header">

            <span class="label">

                ${data.title}

            </span>

            <h2>

                ${data.subtitle}

            </h2>

        </div>

    `;



    const grid = document.createElement("div");

    grid.className = "status-grid";



    data.items.forEach(item => {

        const block = document.createElement("div");

        block.className = "status-item";

        block.innerHTML = `

            <span>

                ${item.label}

            </span>

            <strong>

                ${item.value}

            </strong>

        `;

        grid.appendChild(block);

    });



    section.appendChild(grid);



    return section;

}