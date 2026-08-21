export function operationLabel(text, tone = "") {
  const modifier = tone ? ` operation-label--${tone}` : "";
  return `<span class="operation-label${modifier}">${text}</span>`;
}

export function statusMark(tone = "active") {
  return `<span class="status-mark status-mark--${tone}" aria-hidden="true"></span>`;
}

export function motionFrame(tone = "soft") {
  return `<span class="neon-frame neon-frame--${tone}" aria-hidden="true"></span>`;
}

export function buttonLink(label, href, variant = "secondary", icon = "") {
  return `<a class="button button--${variant}" href="${href}">
    <span>${label}</span>${icon ? `<span aria-hidden="true">${icon}</span>` : ""}
  </a>`;
}

export function sectionHeader(eyebrow, title, description = "", level = "h2") {
  return `<header class="section-header">
    ${operationLabel(eyebrow)}
    <${level}>${title}</${level}>
    ${description ? `<p>${description}</p>` : ""}
  </header>`;
}
