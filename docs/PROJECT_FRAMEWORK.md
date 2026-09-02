# NEXUS Project Framework

The Project Framework turns the NEXUS project registry into a reusable publishing system. A project record in `data/projects.json` drives its registry card, featured presentation and case-study route without project-specific component code.

## Contract

Each record follows contract version `1.0.0`, documented in `schemas/project.schema.json` and enforced by `scripts/validate.mjs`.

The registry accepts these lifecycle values:

- `Stable`
- `In development`
- `Planned`
- `Paused`
- `Concept`

Visual signals use `active` or `muted`. Milestones always follow the ordered sequence `Current`, `Next`, `Future`.

Categories combine a specific domain with one shared system type: `Platform`, `Pipeline`, `System`, `Application`, `Service` or `Research`.

## Add a project

1. Add one record to the `projects` array in `data/projects.json`.
2. Use the same lowercase kebab-case value for `id` and `slug`.
3. Set `code` to `SYS / <PROJECT>`; the case-study route is generated automatically from `slug`.
4. Choose one lifecycle status and one visual signal from the shared vocabulary.
5. Add a unique technology list, ordered architecture stages and the three required milestones.
6. Set `hasCaseStudy` to `false` and omit `caseStudy` while evidence is incomplete.
7. When the case study is ready, set `hasCaseStudy` to `true` and provide its problem, solution, evidence, capabilities, challenges, learnings and HTTPS links.
8. Record the exact audited commit, verification date and matching GitHub source in `caseStudy.evidence.audit`.
9. Run `npm run validate` and `npm run build` before creating a checkpoint.

The Projects page automatically maps every registry record. The shared detail route resolves the slug and renders the same case-study sections for every complete project.

Projects without complete evidence remain visible in the registry with a clear pending state and no case-study action. If their derived route is opened directly, NEXUS returns an unavailable state and excludes the page from indexing until the full case study is published.

## Quality rules

- IDs and slugs must be unique; routes are derived automatically from the project slug.
- Exactly one project must be featured, and it must have a complete case study.
- Stack entries, evidence metrics and external links cannot be duplicated.
- Every published case study must identify one full commit revision, an ISO verification date and its matching audit link.
- Architecture indexes must match their array order (`01`, `02`, `03`, ...).
- All external evidence links must use HTTPS.
- A case study is rendered only when its contract is complete.

These rules keep new projects data-only while preserving navigation, accessibility and presentation consistency across NEXUS.
