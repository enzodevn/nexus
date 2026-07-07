export function createSectionTitle(title) {


    const element = document.createElement("h2");


    element.classList.add(
        "section-title"
    );


    element.textContent = title;


    return element;

}