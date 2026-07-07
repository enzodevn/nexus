export function createStatsCard(stat) {


    const card = document.createElement("div");


    card.classList.add("stats-card");



    card.innerHTML = `


        <h3>

            ${stat.value}

        </h3>



        <p>

            ${stat.title}

        </p>


    `;



    return card;

}