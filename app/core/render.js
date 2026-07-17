export function render(view) {

    const container = document.querySelector("#page-content");

    if (!container) {

        console.error("Page content container not found");

        return;

    }

    container.replaceChildren(view);

}