import { createHero } from "../components/hero.js";
import { createStatsCard } from "../components/stats-card.js";
import { createSectionTitle } from "../components/section-title.js";



async function loadHome() {


    const heroContainer = document.getElementById(
        "hero-container"
    );


    const statsContainer = document.getElementById(
        "stats-container"
    );



    if (!heroContainer || !statsContainer) {

        console.error(
            "Containers da Home não encontrados"
        );

        return;

    }



    try {


        const response = await fetch(
            "data/home.json"
        );


        const data = await response.json();



        const hero = createHero(
            data.identity
        );


        heroContainer.appendChild(hero);



        const title = createSectionTitle(
            "Overview"
        );


        statsContainer.appendChild(title);



        data.stats.forEach(stat => {


            const card = createStatsCard(
                stat
            );


            statsContainer.appendChild(card);


        });



    } catch(error) {


        console.error(
            "Erro carregando Home:",
            error
        );


    }


}



loadHome();