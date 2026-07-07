import { createProjectCard } from "../components/project-card.js";


async function loadProjectsPage() {


    try {


        const response = await fetch(
            "../data/projects.json"
        );


        const data = await response.json();



        const container = document.getElementById(
            "projects-container"
        );



        data.projects.forEach(project => {


            const card = createProjectCard(
                project
            );


            container.appendChild(card);


        });



    } catch(error) {


        console.error(
            "Erro carregando projetos:",
            error
        );


    }


}



loadProjectsPage();