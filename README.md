# NEXUS V2

Engineering Operations Center implemented as a dependency-free JavaScript SPA. This branch is the selective architectural recomposition of the project preserved in the GitHub history.

## Current state

- Home: operational, data-driven mission-control experience
- About: operational, with a dedicated view and structured journey data
- Projects: operational, with a dedicated system registry and NGDP showcase
- Labs: operational, with a dedicated investigation registry and research method
- Roadmap: navigable compact view awaiting recomposition

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
- `#/projects` — Projects
- `#/labs` — Labs
- `#/roadmap` — Roadmap

## Architecture

- `app/`: bootstrap, data loader, router, views and animation behavior
- `components/`: layout, reusable UI primitives, sections and modules
- `data/`: structured content consumed by the views
- `styles/foundation/`: tokens, reset, typography and motion
- `styles/ui/`: reusable visual primitives
- `styles/components/`: page-specific compositions

No runtime dependencies, frameworks or external assets are required.

## Git workflow

Development continues on `v2-recomposition`, preserving `master` as the previous baseline. Review and commit each page recomposition as a discrete checkpoint.
