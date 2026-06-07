# P.G. Auto Installs — Platform Monorepo

> The legacy single-file landing preview (`index.html`, `build-your-protection.html`) is being migrated into the
> Astro app at `apps/marketing` per [docs/COMMAND-11-PHASE-1-TASKS.md](./docs/COMMAND-11-PHASE-1-TASKS.md). Until
> then it still deploys via `pnpm deploy:legacy`.

## Local development

Toolchain is pinned with **[Volta](https://volta.sh)** so everyone runs the same Node/pnpm:

```bash
winget install Volta.Volta          # once
volta install node@22.22.3          # matches package.json "volta.node"
volta install pnpm@10.34.1          # matches "packageManager"
pnpm install                        # then build/test the workspace
pnpm build && pnpm typecheck && pnpm test
```

Node **≥22.12** is required (Vite 7 / Vitest 4). Monorepo: `apps/` · `services/` · `packages/` (pnpm + Turborepo).

---

## Legacy landing preview

Static single-page site (`index.html`). No build step.

## Preview locally
```bash
npx serve .
# or
python -m http.server 5177
```

## Deploy to Cloudflare Workers (Static Assets)

> Per the locked architecture (Command 2), the platform deploys to **Cloudflare Workers Static Assets**,
> not Pages (Cloudflare retired new Pages investment). For this static landing page that means `wrangler deploy`
> with an `assets` directory — no Worker script needed.

### Option A — Dashboard (auto-deploys on every push)
1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Workers → Connect to Git** (import the repo).
2. Pick the `Atlansdaddy/pgautolanding` repo; framework preset **None**, build command **blank**, deploy.
3. You get a live URL like `https://pgautolanding.<account>.workers.dev`. Every push to `main` redeploys.

### Option B — Command line (Wrangler)
```bash
npm install
npx wrangler login        # opens browser once to authenticate
npm run deploy            # wrangler deploy (Workers Static Assets, see wrangler.toml)
```
