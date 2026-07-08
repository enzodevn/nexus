/*
==================================================
NEXUS
Render Engine
==================================================
*/

export function render(containerId, element) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.warn(`[Render] Container "${containerId}" not found.`);
        return;
    }

    container.innerHTML = "";

    container.appendChild(element);

}