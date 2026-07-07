import { createAboutCard } from "../components/about-card.js";


async function loadAbout() {


    const container = document.getElementById(
        "about-container"
    );


    if (!container) {

        return;

    }



    try {


        const response = await fetch(
            "../data/about.json"
        );


        const data = await response.json();



        const card = createAboutCard(
            data.profile
        );


        container.appendChild(card);



    } catch(error) {


        console.error(
            "Erro carregando about:",
            error
        );


    }


}



loadAbout();