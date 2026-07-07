import { createRoadmapCard } from "../components/roadmap-card.js";


async function loadRoadmap() {


    const container = document.getElementById(
        "roadmap-container"
    );


    console.log("Container:", container);



    const response = await fetch(
        "../data/roadmap.json"
    );


    const data = await response.json();


    console.log("Dados:", data);



    data.roadmap.forEach(item => {


        const card = createRoadmapCard(item);


        container.appendChild(card);


    });


}


loadRoadmap();