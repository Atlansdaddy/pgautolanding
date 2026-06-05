# Command 2 — Architecture Blueprint (✅ APPROVED & LOCKED 2026-06-05)

> **STATUS: ✅ APPROVED 2026-06-05 (John). No code written.** Governs Commands 3 (Security), 6 (API), 7 (Data).
> **Decisions:** all 4 stack modernizations adopted (Pages→Workers · defer Rust · monorepo · drop Fly.io→CF
> Containers); **full 7-service split up front**. Repo topology = **monorepo** (resolves open-decision #1). **U1 Currency Gate:** every stack choice below was verified against
> live June 2026 sources (Cloudflare/Neon/Astro/Hono/MUI docs + blogs) and is cited in the working notes; the
> **decision-critical flags** that changed or confirmed Command 0 assumptions are called out first.

---

## A. Decision-critical findings (these need your call — 3 touch the "locked" stack)

1. **🚩 Cloudflare Pages → Workers Static Assets (amends Command 0).** Cloudflare now *explicitly* says "start with
   Workers" for new projects; Pages gets no new feature investment, and **the `@astrojs/cloudflare` adapter v13
   has fully dropped Pages support**. Command 0 says "Astro on Cloudflare Pages." **Recommendation: deploy Astro
   (and all four surfaces) to Workers Static Assets**, SSR via the adapter only where needed. Same Cloudflare
   primitives, just the current-recommended target. *Needs your OK to amend Command 0.*
   *(Sources: Cloudflare "full-stack on Workers" blog; Astro Cloudflare integration guide.)*
2. **🚩 Narrow + DEFER the Rust footprint (refines Command 0).** workers-rs is at v0.8.3 and got a big reliability
   win (panic/abort recovery, Apr 2026), **but its README still says "not production-ready,"** WASM bundle-size +
   host-memory-copy overhead is real, and JS keeps full feature parity. **Recommendation: build everything in
   TypeScript/Hono first; introduce Rust only for a *measured* CPU-bound hot path on small inputs (telematics
   parsing / geospatial math) — not preemptively.** Command 0's "Rust where perf matters" stays true; we just
   don't reach for it on day one. *Needs your OK to defer Rust.*
3. **🚩 iOS kills true background sync (shapes the field app).** No Background Sync / Periodic Sync on iOS/Safari
   (still, in 2026), a ~50 MB storage cap, and **7-day data eviction** if the PWA isn't opened. **Recommendation:
   offline queue in IndexedDB (not localStorage — the legacy bug), idempotent server writes (client request-id),
   replay-on-app-open, a server-side reconciliation backstop, and explicit pending→confirmed UI states.** This is
   how "real proof-of-send" actually works on field iPads. *(No Command 0 conflict — strengthens the rebuild.)*
4. **✅ Resolves open-decision #1 (repo topology): MONOREPO.** pnpm workspaces + Turborepo is the clear 2026
   best practice for multiple frontends + shared packages + codegen'd types. **Recommendation: one monorepo**
   (`apps/` surfaces · `services/` Workers · `packages/` shared). *Needs your OK to lock monorepo.*
5. **✅ Confirmed GA + free-tier-friendly:** Hyperdrive (GA, free on Workers Paid), R2 ($0 egress), Neon+PostGIS
   (3.5.x), Cloudflare Containers (GA Apr 2026) + Workflows (GA). **[Refined by cost-benefit 2026-06-05:
   long-running jobs → the existing DO droplets via free Cloudflare Tunnel (PRIMARY, sunk cost); CF Containers
   demoted to secondary for bursty edge jobs; Fly.io dropped. NO GPU / gaussian-splat work — out of scope.]**

---

## B. System overview — 4 surfaces, one backend, shared contracts

```
                         ┌─────────────────── Cloudflare edge (TLS/WAF) ───────────────────┐
   PUBLIC                │                                                                  │
   ┌──────────────┐  ┌───┴──────────┐   ┌──────────────┐   ┌──────────────┐                 │
   │ web-marketing│  │  app-field   │   │ portal-tech  │   │ portal-admin │   (surfaces;    │
   │ Astro+islands│  │ React+MUI PWA│   │  React+MUI   │   │  React+MUI   │   Workers Static│
   └──────┬───────┘  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   Assets)       │
          │ (3D/live panel)  │ offline queue    │                 │                          │
          └───────────┬──────┴──────────────────┴─────────────────┘  Service Bindings/RPC   │
                      ▼                                                                       │
   BACKEND  ┌─────────────────────────────────────────────────────────────────────┐         │
   (Workers │ svc-auth · svc-installs · svc-field-sync · svc-media · svc-notify ·   │         │
    micro-  │ svc-config · [svc-telematics: deferred Rust/Container]                │         │
    services)└───┬───────────────┬──────────────┬────────────────┬─────────────────┘         │
                 │ Hyperdrive     │ R2 (media,   │ Queues (async) │ Durable Objects (live)    │
                 ▼                ▼  no egress)   ▼                ▼ Analytics Engine + Logs    │
            ┌──────────────┐                                                                   │
            │ Neon Postgres│  + PostGIS (geo) · multi-tenant: tenant_id + RLS                  │
            └──────────────┘                                                                   │
                         └──────────────────────────────────────────────────────────────────┘
```

### Backend microservices (each a Worker; sync calls via Service Bindings + WorkerEntrypoint RPC; async via Queues)

| Service | Stack | Responsibility | Key bindings |
|---|---|---|---|
| **svc-auth** | TS/Hono | In-house auth: sessions + JWT w/ refresh rotation, **Argon2id (WASM)**, rate limiting, MFA-ready, issues tenant context for RLS. *Highest-risk → Command 3.* | KV (sessions), Hyperdrive |
| **svc-installs** | TS/Hono | Canonical install-event CRUD: `units` + `vehicle_type` + per-device `install_records`; admin QA reads; the schema the field app seeds. | Hyperdrive |
| **svc-field-sync** | TS/Hono | Ingests offline-queued field reports; **idempotent (client request-id)**; returns proof-of-send; writes installs + enqueues media/notify. | Hyperdrive, Queues, svc-media (RPC) |
| **svc-media** | TS/Hono | R2 presigned upload/download for install photos. (**No gaussian splats — out of scope.**) | R2 |
| **svc-notify** | TS/Hono | Field-events taxonomy routing + **multi-tenant recipients** (replaces legacy hardcoded recipient). Queue consumer. | Queues |
| **svc-config** | TS/Hono | Control-panel config: feature flags + runtime settings (KV-backed; DO for live push). | KV, Durable Objects |
| **svc-telematics** | **DEFERRED** — TS stub → heavy ingestion on a **DO droplet (via Tunnel)**; Rust/CF-Container only if a measured hot path justifies it | Heavy telematics ingestion/parse. | Queues, Hyperdrive |

---

## C. Stack-decision table (speed / memory / trade-offs)

| Choice | Why chosen | Speed | Memory | Trade-offs / flag |
|---|---|---|---|---|
| **Workers Static Assets** (all surfaces) | Cloudflare-recommended target; Pages de-emphasized; adapter dropped Pages | Edge-served static; ~0 cold start (JS) | n/a (static) | 🚩 amends Command 0 "Pages" |
| **Astro + React/three.js islands** (marketing) | Zero-JS default; lazy 3D via `client:visible` | Best CWV of the four | Tiny baseline | three.js must `dispose()` on unmount (browser WebGL-memory leak) |
| **React + MUI v9 PWA** (field/portals) | Dense forms/tables; MUI X Data Grid | Good; budget Data Grid weight | Watch bundle on field tablets | iOS PWA caveats (§A.3) |
| **TS / Hono v4.12** (default services) | De-facto Workers API framework; Zod+OpenAPI; full feature parity | ~840K req/s class | 128 MB/isolate ceiling | none material |
| **Rust / workers-rs** (deferred, narrow) | Edge compute kernel for small CPU-bound inputs | Fast on small inputs only | WASM copy overhead on big payloads | 🚩 "not production-ready" README; defer until measured |
| **Neon Postgres + PostGIS via Hyperdrive** | GA pooling; geospatial; ~9× faster global SELECTs | Transaction-mode pool | origin cap ~100 (Paid) | Don't stack on Neon's PgBouncer; migrate via direct conn |
| **R2** (media) | $0 egress (install photos) | Edge | — | — |
| **Queues / Durable Objects / Analytics Engine** | async / live state / metrics | — | DO single-threaded; scale across many | DO 10 GB each; SQLite-backed default |
| **DO droplets via Tunnel** (long jobs, PRIMARY) | Sunk cost already owned; steady/always-on; free Tunnel | always-on | droplet-sized | maintain the server; CF Containers are the secondary/bursty option |

---

## D. Key data flows

**1. Field report → proof-of-send (the core upgrade over `mailto:`):**
tech taps (offline) → **IndexedDB queue** (client `request_id` + real timestamp) → SW replays POST to **svc-field-sync**
when online (Workbox BackgroundSync where supported; **iOS = replay on app-open**) → svc-field-sync validates
(shared Zod), **dedupes by `request_id`**, writes to Neon (`SET LOCAL` tenant for RLS), enqueues photo (svc-media→R2)
+ notification (svc-notify) → **server 2xx = proof-of-send** → dequeue locally → UI flips pending→confirmed.
Server-side reconciliation backstop covers iOS 7-day eviction.

**2. Install record / QA:** portals read via svc-installs (Hyperdrive→Neon); admin QA over the same canonical records.
**3. Media:** presigned R2 PUT from client via svc-media; no media bytes through the Worker CPU path.
**4. Live panel (marketing "live" feed):** Durable Object per-tenant coordinates real-time stream to web-marketing.

---

## E. DRY / shared-code strategy (monorepo)

```
pg-platform/                  (pnpm workspaces + Turborepo)
├─ apps/        web-marketing · app-field · portal-tech · portal-admin
├─ services/    svc-auth · svc-installs · svc-field-sync · svc-media · svc-notify · svc-config · svc-telematics
└─ packages/    @pg/api-types (OpenAPI-codegen) · @pg/schemas (shared Zod) · @pg/ui (MUI theme + brand tokens)
                @pg/auth-client · @pg/config-client
```
- **One source of truth for types:** each TS service emits **OpenAPI via `@hono/zod-openapi`** → `openapi-typescript`/
  `@hey-api/openapi-ts` generates **`@pg/api-types`** consumed by every surface + service. A future Rust service emits
  the *same* OpenAPI via **utoipa** (or `ts-rs` for plain DTOs). Turbo task graph regenerates types on schema change.
- **Shared Zod schemas** (`@pg/schemas`) = validation once, reused client + server. **Brand tokens** (`@pg/ui`) =
  the Command 0 palette/type as MUI theme — no duplication across the three data apps.

---

## F. Scaling, memory & limits (the guardrails)

- **Workers:** 128 MB/isolate, CPU 30 s default → 5 min (Paid), bundle 10 MB (Paid), 1,000 internal subrequests.
  Keep services small + single-responsibility; heavy/long work → Queues/Workflows/Containers.
- **Hyperdrive→Neon:** origin pool ~100 (Paid), transaction-mode → **`SET LOCAL` for RLS tenant context** (never
  session-level, pooled conns are reused). Run **migrations on Neon's direct (non-Hyperdrive) connection**.
- **Durable Objects:** single-threaded, 10 GB each → scale horizontally (one per tenant/stream).
- **Queues:** 128 KB/msg, 5,000 msg/s, retries → DLQ for the field-sync + notify pipelines.
- **Telematics time-series:** Neon range-partition by time + **BRIN index**; Timescale OSS ok but **no compression
  on Neon** → use partition drops for retention.

---

## G. Security touchpoint inventory (every boundary → full design in Command 3)

| Boundary | Touchpoint | Control (designed in Cmd 3) |
|---|---|---|
| Edge | Public ingress | TLS, WAF, rate limiting (per-IP + per-tenant) |
| Surface → service | Every API call | Session/JWT validated via **svc-auth** binding; short-lived tokens |
| Tenant isolation | Every DB query | `tenant_id` + **RLS** (defense-in-depth) via `SET LOCAL` |
| Input | Every endpoint | **Zod** validation (`@pg/schemas`) + output encoding |
| Auth secrets | Password hashing | **Argon2id via WASM** in svc-auth (no native Argon2 in Workers — 🚩 Cmd 3 detail) |
| Media | R2 access | Scoped, expiring presigned URLs; no public buckets |
| Field device | Untrusted client | No secrets in client; idempotent writes; device-bound short tokens |
| Secrets | Config | Wrangler Secrets / Secrets Store; never in repo |
| Supply chain | Deps | pnpm lockfile, minimal deps, Dependabot/audit in CI |

---

## H. Deployment & environments

- **Wrangler** per service/surface (`compatibility_date`, `assets`, service bindings) — single source for env config.
- **Environments:** dev (local `workerd` via Astro 6 / `wrangler dev`) · preview (per-PR) · production. Gated CD
  (Command 9) → adversarial gate (Command 10) before prod.
- **CI test DBs:** **Neon branching GitHub Action** → ephemeral per-PR DB branch (auto-expire) — feeds Command 8 rails.
- **Observability:** Workers Logs + **Tail Worker → Analytics Engine** (structured, queryable) — Command 9 standards.

---

## I. Decisions — ✅ ALL RESOLVED 2026-06-05

1. **Pages → Workers Static Assets — ✅ ADOPTED** (amends Command 0).
2. **Defer Rust (TS/Hono first) — ✅ ADOPTED** (Rust only for a measured hot path later).
3. **Repo topology = monorepo (pnpm + Turborepo) — ✅ ADOPTED** (resolves open-decision #1).
4. **Drop Fly.io — ✅ ADOPTED.** *[Refined by cost-benefit: long jobs → existing DO droplets via free Tunnel
   (primary); CF Containers secondary. No GPU/splats.]*
5. **Service split — ✅ FULL 7 UP FRONT** (auth · installs · field-sync · media · notify · config · telematics).
   *Note:* svc-telematics still starts as a TS stub; Rust/Container is introduced inside it only when measured.

## J. Definition of Complete (U2) — for this command

Done when: service boundaries + comms defined ✓ · stack-per-service justified on speed/memory ✓ · DRY/shared-contract
strategy ✓ · scaling/memory guardrails ✓ · security-touchpoint inventory mapped to boundaries ✓ · all stack claims
cited to live 2026 sources ✓ · **open decisions I–1..5 resolved by John (pending)** · John approves (pending). Then →
Command 3 (Security Design).

---

*Command 2 proposal, compiled from live June 2026 research. No code written. Review, resolve §I, approve → Command 3.*
