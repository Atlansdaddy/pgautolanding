# `apps/` — deployable surfaces

User-facing applications, each independently deployable.

| App | Stack | Status |
|---|---|---|
| `marketing` | Astro 6 (static + islands) on Cloudflare Workers Static Assets | Phase 1 — building (T1.1+) |
| `tech` | React + MUI v9 PWA | Phase 3 |
| `admin` | React + MUI v9 | Phase 4 |
| `field` | React + MUI v9 offline-first PWA | Phase 2 |

Locked stack: Command 2 (Architecture). The marketing site is **static + islands** and needs no Cloudflare
adapter — the one dynamic concern (quote submission) lives in `services/svc-leads`, not Astro SSR.
