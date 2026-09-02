# NEXUS

NEXUS is a personal Technology Laboratory and engineering portfolio built as a dependency-free JavaScript SPA. It connects projects, research and technical progression through one modular, data-driven interface.

Public deployment is intentionally deferred while the portfolio remains private.

## Current state

NEXUS V3.1 defines the current platform baseline. Version `v3.1.0` formalizes the data-driven Project Framework, derived project routes, published and pending case-study states, structured evidence audits and provider-neutral production delivery.

- Home: data-driven mission-control overview
- About: professional profile, principles and technical journey
- Contact: verified LinkedIn, professional email and GitHub channels
- Metadata: route-aware titles, descriptions, indexing rules and structured identity
- Sharing: dedicated 1200×630 NEXUS social preview for Open Graph and X cards
- Projects: system registry with dedicated NGDP, HEVY and NEXUS case studies
- Evidence: revision-linked repository audits with verified metrics and explicit technical gaps
- Labs: investigation registry and research method
- Roadmap: evidence-gated capability sequence
- Not found: recovery state for unknown application and project routes

## Project Framework

Projects are registered once in `data/projects.json` and rendered through shared registry and case-study components. The versioned contract and onboarding workflow are documented in [`docs/PROJECT_FRAMEWORK.md`](docs/PROJECT_FRAMEWORK.md).

## Run in VS Code

The application loads JSON through `fetch`, so it must be served over HTTP instead of opening `index.html` directly from the filesystem.

1. Open this project folder in VS Code.
2. Install the **Live Server** extension if it is not already available.
3. Open `index.html` and select **Go Live**.
4. Visit `http://127.0.0.1:5502/#/`.

The repository setting in `.vscode/settings.json` keeps Live Server on port `5502`.

As an alternative, run:

```bash
npm install
npm run dev
```

Then open the local address printed by Vite.

## Routes

- `#/` — Home
- `#/about` — About
- `#/contact` — Professional contact
- `#/projects` — Project registry
- `#/projects/ngdp` — Nordic Green Data Platform case study
- `#/projects/hevy` — HEVY Pipeline case study
- `#/projects/nexus` — NEXUS platform case study
- `#/labs` — Labs
- `#/roadmap` — Roadmap

## Architecture

- `app/`: bootstrap, data loader, router, views and animation behavior
- `components/`: layout, reusable UI primitives, sections and modules
- `data/`: structured content consumed by the views
- `assets/`: local brand and social-preview media
- `scripts/`: dependency-free repository validation
- `styles/foundation/`: tokens, reset, typography and motion
- `styles/ui/`: reusable visual primitives
- `styles/components/`: page-specific compositions

Project data is centralized in `data/projects.json`. A project record can define its registry presentation, route, architecture, milestones and technical case-study content without duplicating page markup.

Site identity, route metadata and sharing rules are centralized in `data/site.json`. No hosting provider or public origin is committed while the portfolio remains private; canonical and absolute sharing URLs are activated only after an independent production address is selected.

No runtime dependencies, frameworks or external assets are required.

The production toolchain is development-only. Vite builds the browser-native application and a focused build step emits a portable edge-worker entrypoint without binding the repository to a hosting provider.

## Production build

Install the locked build tools and create the exact production artifact:

```bash
npm ci --ignore-scripts
npm audit --audit-level=high
npm run build
npm run validate
```

Generated output remains in `dist/` and is excluded from version control. A public origin, canonical URL and sitemap will be configured only when the independent production target is selected.

## Quality gates

Node.js 22.13 or newer can validate the complete repository without installing packages:

```bash
npm run validate
```

The command checks JavaScript syntax and relative imports, JSON parsing and project evidence contracts, CSS structure and responsive breakpoints, local document references, route metadata, social-preview dimensions, delivery contracts, application routes and the core accessibility contract. GitHub Actions installs, audits and builds the locked production toolchain before running the same validation for every push and pull request.

## Development workflow

Development uses focused branches created from the stable `master` branch.

```bash
git status
git switch master
git pull --ff-only origin master
git switch -c feature-branch-name
```

Each checkpoint is validated before it is committed and pushed through the VS Code terminal. Tags, releases and merges are created only with explicit approval.
