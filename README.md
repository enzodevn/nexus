# NEXUS

NEXUS is a personal Technology Laboratory and engineering portfolio built as a dependency-free JavaScript SPA. It connects projects, research and technical progression through one modular, data-driven interface.

## Current state

The stable `v2.0.0` architecture is integrated into `master`. Current development expands the project registry into a reusable case-study platform.

- Home: data-driven mission-control overview
- About: professional profile, principles and technical journey
- Contact: verified LinkedIn, professional email and GitHub channels
- Projects: system registry with dedicated NGDP, HEVY and NEXUS case studies
- Evidence: revision-linked repository audits with verified metrics and explicit technical gaps
- Labs: investigation registry and research method
- Roadmap: evidence-gated capability sequence
- Not found: recovery state for unknown application and project routes

## Run in VS Code

The application loads JSON through `fetch`, so it must be served over HTTP instead of opening `index.html` directly from the filesystem.

1. Open this project folder in VS Code.
2. Install the **Live Server** extension if it is not already available.
3. Open `index.html` and select **Go Live**.
4. Visit `http://127.0.0.1:5502/#/`.

The repository setting in `.vscode/settings.json` keeps Live Server on port `5502`.

As an alternative, run:

```bash
python -m http.server 4173
```

Then visit `http://localhost:4173/#/`.

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
- `scripts/`: dependency-free repository validation
- `styles/foundation/`: tokens, reset, typography and motion
- `styles/ui/`: reusable visual primitives
- `styles/components/`: page-specific compositions

Project data is centralized in `data/projects.json`. A project record can define its registry presentation, route, architecture, milestones and technical case-study content without duplicating page markup.

No runtime dependencies, frameworks or external assets are required.

## Quality gates

Node.js 20 or newer can validate the complete repository without installing packages:

```bash
npm run validate
```

The command checks JavaScript syntax and relative imports, JSON parsing and project evidence contracts, CSS structure and responsive breakpoints, local document references, application routes and the core accessibility contract. GitHub Actions runs the same command for every push and pull request.

## Development workflow

Development uses focused branches created from the stable `master` branch.

```bash
git status
git switch master
git pull --ff-only origin master
git switch -c feature-branch-name
```

Each checkpoint is validated before it is committed and pushed through the VS Code terminal. Tags, releases and merges are created only with explicit approval.
