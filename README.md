# P.G. Auto Installs — Landing Page

Static single-page site (`index.html`). No build step.

## Preview locally
```bash
npx serve .
# or
python -m http.server 5177
```

## Deploy to Cloudflare Pages

### Option A — Dashboard (easiest, auto-deploys on every push)
1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the `Atlansdaddy/pgautolanding` repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/`
4. **Save and Deploy.** You get a live URL like `https://pgautolanding.pages.dev`.

Every `git push` to `main` redeploys automatically.

### Option B — Command line (Wrangler)
```bash
npm install
npx wrangler login        # opens browser once to authenticate
npm run deploy            # publishes to pgautolanding.pages.dev
```
