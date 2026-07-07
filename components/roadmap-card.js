export function createRoadmapCard(item) {

    const card = document.createElement("div");

    card.classList.add("roadmap-card");

    const focusItems = item.focus
        .map(skill => `<li>${skill}</li>`)
        .join("");


    card.innerHTML = `
        <div class="roadmap-year">
            ${item.year}
        </div>

        <h3>
            ${item.phase}
        </h3>

        <p>
            ${item.description}
        </p>

        <ul>
            ${focusItems}
        </ul>
    `;


    return card;

}
