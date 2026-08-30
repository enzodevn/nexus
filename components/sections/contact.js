import {
  buttonLink,
  motionFrame,
  operationLabel,
  sectionHeader,
  statusMark,
} from "../ui/primitives.js";

function renderOverview({ position, profile }) {
  return `
    <section class="section contact-overview" aria-labelledby="contact-position-title" data-reveal>
      <article class="surface panel contact-position">
        ${operationLabel(position.eyebrow, "cyan")}
        <div class="contact-position__copy">
          <h2 id="contact-position-title">${position.title}</h2>
          <p>${position.description}</p>
        </div>
        <p class="contact-position__support">${position.supporting}</p>
      </article>

      <aside class="surface panel contact-profile motion-surface" aria-labelledby="contact-profile-name" data-motion-surface>
        ${motionFrame("soft")}
        <div class="panel-heading">
          ${operationLabel(profile.eyebrow)}
          <span class="module-code">NX / CONTACT</span>
        </div>
        <div class="contact-profile__identity">
          <span class="contact-profile__status">${statusMark()} ${profile.status}</span>
          <h2 id="contact-profile-name">${profile.name}</h2>
          <p class="contact-profile__role">${profile.role}</p>
          <p>${profile.description}</p>
        </div>
        <div class="tag-list contact-focus-list">
          ${profile.focus.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </aside>
    </section>`;
}

function renderChannels(channels) {
  return `
    <section class="section contact-channels" aria-labelledby="contact-channels-title">
      <header data-reveal>
        ${sectionHeader(channels.eyebrow, channels.title, channels.description, "h2", "contact-channels-title")}
      </header>
      <div class="contact-channel-grid">
        ${channels.items
          .map(
            (channel, index) => `<article class="surface panel contact-channel" aria-labelledby="contact-channel-${index + 1}" data-reveal>
              <div class="contact-channel__topline">
                <span class="module-code">${channel.code} / ${channel.type}</span>
                <span class="contact-channel__state">${statusMark(channel.signal)} Verified</span>
              </div>
              <div class="contact-channel__identity">
                <h3 id="contact-channel-${index + 1}">${channel.name}</h3>
                <p class="contact-channel__value">${channel.value}</p>
                <p>${channel.description}</p>
              </div>
              ${buttonLink(channel.action, channel.href, "secondary", "↗")}
            </article>`,
          )
          .join("")}
      </div>
    </section>`;
}

function renderContext(context) {
  return `
    <section class="section contact-context" aria-labelledby="contact-context-title">
      <header class="contact-context__header" data-reveal>
        ${sectionHeader(context.eyebrow, context.title, context.description, "h2", "contact-context-title")}
        <span class="module-code">NX / CONTEXT</span>
      </header>
      <ol class="surface panel contact-context__list">
        ${context.items
          .map(
            (item, index) => `<li data-reveal>
              <span class="sequence-number">${String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
              </div>
            </li>`,
          )
          .join("")}
      </ol>
    </section>`;
}

function renderClosing(closing) {
  return `
    <section class="section surface panel contact-closing" aria-labelledby="contact-closing-title" data-reveal>
      <div>
        ${operationLabel(closing.eyebrow, "cyan")}
        <h2 id="contact-closing-title">${closing.title}</h2>
        <p>${closing.description}</p>
      </div>
      <div class="contact-closing__actions">
        ${buttonLink(closing.primaryCta.label, closing.primaryCta.href, "primary", "→")}
        ${buttonLink(closing.secondaryCta.label, closing.secondaryCta.href, "secondary")}
      </div>
    </section>`;
}

export function renderContactSections(contact) {
  return `
    <section class="section page-intro contact-intro" data-reveal>
      <div class="page-index" aria-hidden="true">${contact.meta.index}</div>
      ${sectionHeader(contact.meta.eyebrow, contact.meta.title, contact.meta.description, "h1")}
    </section>
    ${renderOverview(contact)}
    ${renderChannels(contact.channels)}
    ${renderContext(contact.context)}
    ${renderClosing(contact.closing)}
  `;
}
