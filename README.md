# Nostos

**Nostos** (νόστος, "homecoming") is a bilingual Greek/English static website that helps people work out whether moving to Greece makes financial sense. It is aimed at Greeks who left during the crisis years and at foreigners considering the move.

The core is a move-to-Greece calculator: an Article 5C (50% tax break) eligibility quiz, a Greek net-salary engine and a purchasing-power comparison with the user's current country. A second page compares Greece with peer countries. Everything runs in the browser; nothing the user types is stored or sent anywhere.

- Product spec: [`SPEC.md`](SPEC.md)
- Working rules (for humans and Claude Code): [`CLAUDE.md`](CLAUDE.md)
- Open decisions and verifications: [`docs/open-items.md`](docs/open-items.md)

**Status:** M1 (scaffold). Placeholder pages only.

## Stack

Astro (static output) · TypeScript (strict) · Preact islands · Tailwind CSS v4 · Vitest · Python 3.12 data pipeline (from M5) · Cloudflare Workers with static assets.

## Run locally

Requirements: Node 24 (see `.nvmrc`).

```sh
nvm use            # or install Node 24 another way
npm ci
npm run dev        # dev server at http://localhost:4321  (Greek at /, English at /en/)
```

Other commands:

| Command | What it does |
|---|---|
| `npm run test` | Unit tests (Vitest) |
| `npm run build` | `check:params` → `astro check` (types) → `astro build` into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npx wrangler dev` | Serve `dist/` with the real Cloudflare asset handling (404 pages, trailing slashes); no login needed. Run `npm run build` first. |
| `npm run check:params` | Lists unverified tax parameters in `src/config/greece-tax-2026.json` |

### Tax parameters and `NOSTOS_ENV`

Every Greek tax parameter must carry a value, source URL and verification (who and when). `check:params` runs on every build:

- without `NOSTOS_ENV=production`, unverified parameters only produce a warning, so pre-launch builds succeed;
- with `NOSTOS_ENV=production`, any unverified parameter fails the build.

## How deploys work

The site is deployed as a **Cloudflare Worker with static assets only** (no Worker script), named `comeback`, served at `comeback.<account-subdomain>.workers.dev`. Configuration is in [`wrangler.jsonc`](wrangler.jsonc): it uploads `./dist` and serves the nearest `404.html` for unknown paths (`/404.html` in Greek, `/en/404.html` in English).

Deploys run through **Cloudflare Workers Builds** connected to this GitHub repo:

1. A push to `main` triggers a build in Cloudflare.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Build variables: none for now. At launch (M8), add `NOSTOS_ENV=production` so unverified tax parameters block the deploy.

GitHub Actions (`.github/workflows/ci.yml`) runs tests and the build on every push and pull request. It does not deploy.

Connecting the repo to Workers Builds is a one-time step in the Cloudflare dashboard (Workers & Pages → Create → Import a repository).

## Repo layout

See [`CLAUDE.md`](CLAUDE.md#repo-layout).
