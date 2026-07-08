/*
==================================================

NEXUS
Home View

Version: 2.0.0

Responsibility:
- Build Home screen
- Compose components

==================================================
*/


import { createHero } from "../../components/hero.js";
import { createStatsCard } from "../../components/stats-card.js";


export async function renderHome(container) {


    container.innerHTML = "";


    const page = document.createElement("section");


    page.classList.add("home-view");



    const response = await fetch(
        "./data/home.json"
    );


    const data = await response.json();



    const hero = createHero(
        data.identity
    );


    page.appendChild(hero);




    if (data.stats) {


        const statsWrapper =
            document.createElement("div");


        statsWrapper.classList.add(
            "stats-grid"
        );



        data.stats.forEach(stat => {


            const card =
                createStatsCard(stat);


            statsWrapper.appendChild(card);


        });



        page.appendChild(
            statsWrapper
        );


    }




    container.appendChild(page);


}