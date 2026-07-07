import { createLabCard } from "../components/lab-card.js";


async function loadLabs() {


    const container = document.getElementById(
        "labs-container"
    );


    if (!container) {

        console.error(
            "Container de labs não encontrado"
        );

        return;

    }



    try {


        const response = await fetch(
            "../data/labs.json"
        );


        const data = await response.json();



        data.labs.forEach(lab => {


            const card = createLabCard(
                lab
            );


            container.appendChild(card);


        });



    } catch(error) {


        console.error(
            "Erro carregando labs:",
            error
        );


    }


}



loadLabs();