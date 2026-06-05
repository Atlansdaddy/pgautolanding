# P.G. Auto Installs — Incremental Build Plan & Execution Checklist (v1)

> Living checklist executed by the **[pg-build-agent](../.claude/agents/pg-build-agent.md)**.
> Rules of this file: **piece by piece**, **tests spec'd before code**, **no deviation from approved
> spec**, **flag — don't invent** anything marked 🔒 DECISION REQUIRED. Check a box only when the
> task meets the **Definition of Done** (persona §8). Update this file as decisions lock.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · 🔒 blocked on a human decision · 🚪 gate.

**Command sequence** (each opens with U1 Currency Gate, closes with U2 Definition-of-Complete matrix).
*Revised v1.1 — feedback amendments folded in: new Cmd 4 (Messaging), UI-Forensics added to Design,
adversarial gate expanded. Business-observability command was considered and declined.*
- **Command 0 — Locked project context** → [x] done: [COMMAND-0-LOCKED-CONTEXT.md](./COMMAND-0-LOCKED-CONTEXT.md) (+ Claims Classification taxonomy v1.1)
- **Command 1 — SEO/GEO compilation** → [x] **✅ LOCKED 2026-06-04**: [SEO_GEO_GUIDELINES.md](./SEO_GEO_GUIDELINES.md) (142 cited guidelines; decisions A–G resolved). Target geography → [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md). Parked: OEM/partner directories + review content (placeholders only).
- **Command 2 — Architecture Blueprint** → [x] **✅ LOCKED 2026-06-05**: [COMMAND-2-ARCHITECTURE.md](./COMMAND-2-ARCHITECTURE.md) (monorepo · Workers Static Assets · TS/Hono-first, Rust deferred · 7 services · Hyperdrive→Neon+PostGIS · long jobs on existing DO droplets via Tunnel). Hosting cost-benefit → [COST-BENEFIT-HOSTING.md](./COST-BENEFIT-HOSTING.md).
- **Command 3 — Security Design** → [x] **✅ LOCKED 2026-06-05**: [COMMAND-3-SECURITY.md](./COMMAND-3-SECURITY.md) (ASVS 5.0 L2 · OWASP Top 10:2025 · passkeys+password+TOTP · Argon2id-WASM · EdDSA JWT · RLS `SET LOCAL` · Workers Paid). Hosting cost-benefit → [COST-BENEFIT-HOSTING.md](./COST-BENEFIT-HOSTING.md).
- **Command 4 — Messaging & Content Architecture** → [x] **✅ LOCKED 2026-06-05**: [COMMAND-4-MESSAGING.md](./COMMAND-4-MESSAGING.md) (core message · proof hierarchy w/o logos/stars · progressive quote form · ~8-page IA · 12 metros · full bilingual + extensible i18n). Markets → [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md).
- **Command 5 — Design System & UX** → [x] **✅ LOCKED 2026-06-05**: [COMMAND-5-DESIGN.md](./COMMAND-5-DESIGN.md) (UI-Forensics keep/tune/fix · DTCG+Style Dictionary tokens · base-MUI shell · banner fix · control-panel · WCAG 2.2 AA).
- **Command 6 — API Contract & Docs** → [x] **✅ LOCKED 2026-06-05**: [COMMAND-6-API.md](./COMMAND-6-API.md) (OpenAPI 3.1 · RFC 9457 errors · camelCase · /v1/ · cursor pagination · Idempotency-Key · 8 services incl. svc-leads).
- **Command 7 — Data Architecture** → ⏭️ **NEXT**.
- **Command 2 — Architecture Blueprint** — service map, stacks-per-service, DRY/shared contracts, security touchpoints.
- **Command 3 — Security Design** — threat model per surface, authN/Z, secrets, controls matrix, residual risk.
- **Command 4 — Messaging & Content Architecture** 🆕 *(inserted before Design)* — homepage copy, proof
  hierarchy, trust signals, CTA logic, customer journey, per-audience messaging, **bilingual EN/ES** content map.
  **→ includes the per-location research-agent spin** (one agent per metro × service page, EN+ES) per
  [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md); each output is a task object that must clear the anti-doorway bar.
- **Command 5 — Design System & UX** *(was 4)* — **+ mandatory UI-Forensics pre-step** 🆕: inventory the
  existing `index.html` patterns, mark intentional vs accidental, justify, THEN propose changes (anti-slop brake).
- **Command 6 — API Contract & Docs** *(was 5)*.
- **Command 7 — Data Architecture** *(was 6)*.
- **Command 8 — Test Strategy & Build Rails** *(was 7)*.
- **Command 9 — DevOps, Logging & CI/CD** *(was 8)*.
- **Command 10 — Adversarial Hardening Gate** *(was 9)* — **+ expanded lenses** 🆕: security + functionality
  **+ SEO + sales/conversion ("skeptical fleet manager: what stops the quote?") + trust** adversarial agents.
- **Command 11 — Task Breakdown** *(was 10)* — applied per approved phase.

> **Per Command 0 Part 2: no BLOCKING items remain — Phase 1 (marketing site) is cleared to build**
> once Command 1 (SEO/GEO) is compiled and signed off. Remaining items are NON-BLOCKING confirmations.

---

## Phase 0 — Foundations (must clear before any system build)

- [x] Save Build Agent persona as the main worker agent (`.claude/agents/pg-build-agent.md`)
- [x] Landing-page preview shipped to GitHub (`Atlansdaddy/pgautolanding`) + Cloudflare-ready
- [ ] **Repo & workspace topology decided** — monorepo vs multi-repo for the 4 systems + shared
  Workers/types. Propose, get approval. *(piece-by-piece, one proposal)*
- [ ] **CI/CD skeleton** — lint + typecheck + test + build + deploy gates wired (empty-but-green)
  before feature code. Nothing deploys by hand.
- [ ] **Shared-types codegen path** proven (OpenAPI / ts-rs across Rust↔TS) with one trivial
  end-to-end type.
- [ ] **Logging + error-handling baseline** chosen (Workers Logs / Tail / Analytics Engine + external
  sink) and templated.
- [ ] **Secrets management** convention set (no secrets in repo; Wrangler/CF secrets bindings).
- 🔒 DECISION REQUIRED — **Control-panel config scope** + **auth/session detailed design**
  (persona §11). Spec before the first portal build.

---

## Phase 1 — Marketing Website (Astro on **Cloudflare Workers Static Assets**) — *build first*

> **Queued site assets / integration debt (added 2026-06-05):**
> - `build-your-protection.html` ("Build Your Protection" risk explorer) — added & linked from the landing page
>   (nav + hero CTA). ⚠️ **Integration debt for Command 5:** uses Google-Fonts CDN + cdnjs three.js r128 →
>   bring up to LOCKED standards (self-host fonts, lazy-load 3D, EN/ES, claims taxonomy on any copy, WCAG 2.2 AA).
> - `assets/SP167.pdf` + `assets/toyotatacomaincab…jpg` — real product spec + real install photo (hero/proof material).

### 1A — Pre-build gates (no markup ships until these clear)
- 🚪 [ ] **Command 1 — SEO/GEO compliance file** (⏭️ NEXT): research + compile current SEO & GEO
  guidelines into ONE reviewable file (U1 currency gate, cited) → **human sign-off** before any
  marketing build. *(Actionable now — this is the next deliverable, not a human-decision blocker.)*
- [ ] Brand Kit loaded as canon (palette, Montserrat/Open Sans, voice) — verified, not substituted.
- [ ] Anti-slop checklist applied from the AI Slop Diagnostic Catalog.
- [ ] Inventory of **real proof assets** (real install photos; interactive three.js 3D — **no gaussian splats**) — only real,
  marked-real media. No manufacturer marketing imagery without a partner kit / PG photo.

### 1B — Tests spec'd first
- [ ] Acceptance criteria written per section/component.
- [ ] e2e (critical paths), accessibility, mobile, and Lighthouse/perf targets defined as the rail.

### 1C — Build (piece by piece)
- [ ] Astro scaffold on **Cloudflare Workers Static Assets**; React + three.js as **islands** only (lazy-load 3D).
- [ ] Design-law layout: light base, tasteful brand gradients, **alternating side-in scroll reveals**,
  banners/marquees retained & tuned.
- [ ] Mobile-first: touch controls, `touch-action:none` on 3D, tappable hotspots + list, inline detail
  (no hover-only), real tap targets.
- [ ] 3D vehicle explorer with real install-point hotspots naming **verified products** (Motive AI
  Dashcam Plus, Netradyne Driveri D-450, Samsara CM34 + Vehicle Gateway).
- [ ] Copy: brand voice only, **prove-don't-claim**, every stat sourced or omitted.

### 1D — Release gate
- 🚪 [ ] Lint/typecheck/CI green; mobile verified; SEO/GEO file signed off.
- 🚪 [ ] **Adversarial gate** — independent, non-context agents try to break it; clean pass required.
- 🚪 [ ] Deploy via pipeline only (Cloudflare Workers Static Assets). No hand deploys.

---

## Phase 2 — Field Reporting System ("Field Emailer" rebuild) — *first backend*

> Core upgrade: **never `mailto:`**. Action → offline cache → sync to Workers API on signal →
> real proof-of-send + retry + server-side logging.

### 2A — Decisions that block the build (flag — don't invent)
- 🔒 DECISION REQUIRED — **Field Reporting data model**: canonical install-event schema
  (`chassis` → `units` + `vehicle_type`; per-device `install_records`; type-specific fields). Finalize.
- 🔒 DECISION REQUIRED — **Vehicle/install types** PG performs + each type's fields
  (e.g., chassis: flash count, hardwire, loaded).
- 🔒 DECISION REQUIRED — **Field events taxonomy** (start/end of day, delay, escalation, inventory)
  + **multi-tenant recipient/routing** model (legacy single hardcoded recipient is removed).
- [ ] Review **Field Emailer audit** — enumerate legacy bugs/limits the rebuild must resolve.

### 2B — Tests spec'd first
- [ ] Offline-cache + sync/retry/proof-of-send tests; security tests (authz, validation, rate limits);
  schema/migration tests; coverage targets set.

### 2C — Build (piece by piece, after model is locked)
- [ ] Clean first migration on Neon + PostGIS (keys, FKs, constraints, indexes, real timestamps,
  multi-tenant scoping, versioned). No cache/localStorage as source of truth.
- [ ] Offline-first PWA (MUI) writing to local cache.
- [ ] Sync Worker(s) (TS/Hono for CRUD; Rust where compute matters) + Queues for async; R2 for media.
- [ ] OpenAPI contracts for every endpoint; owner service + functional category recorded.
- [ ] Full logging + error handling on every path.

### 2D — Release gate
- 🚪 [ ] CI green · security reviewed · mobile verified · **adversarial gate** · pipeline deploy only.

---

## Phase 3 — Tech Portal (jobs, field logging, documentation)

- 🔒 Depends on Phase-0 auth/session design + Phase-2 data model being locked.
- [ ] Acceptance criteria + tests spec'd first (unit/e2e/security; coverage targets).
- [ ] React + MUI; reuse shared types/utilities (DRY); service bindings to Field Reporting Workers.
- [ ] OpenAPI-documented endpoints; clean migrations; logging + error handling.
- 🚪 [ ] CI green · security · mobile · **adversarial gate** · pipeline deploy.

---

## Phase 4 — Admin Portal (dispatch, QA, multi-tenant ops)

- 🔒 Depends on multi-tenant model + control-panel config scope.
- [ ] Acceptance criteria + tests spec'd first.
- [ ] React + MUI; control-panel config surface (feature flags, runtime/admin settings) as designed.
- [ ] Multi-tenant authz enforced and tested; OpenAPI docs; clean migrations; logging/error handling.
- 🚪 [ ] CI green · security · mobile · **adversarial gate** · pipeline deploy.

---

## Standing gates (apply to every task, every phase)

- 🚪 Tests spec'd **before** implementation, hitting coverage targets.
- 🚪 Lint + typecheck clean; CI green; no hand deploys.
- 🚪 APIs documented + categorized; DB changes are versioned migrations w/ constraints + indexes.
- 🚪 Logging + error handling on every new path; no empty catches.
- 🚪 Security reviewed (authz, validation, secrets, rate limits).
- 🚪 Mobile verified where user-facing.
- 🚪 Knowledge sources + citations recorded in the task object.
- 🚪 Adversarial gate passed before any full deploy.

---

## Open decisions queue (resolve top-down; nothing downstream proceeds until cleared)

**Resolved by Command 0:** vehicle/install types (light/heavy/rail spectrum, locked); domain +
subdomains (pgautoinstalls.com + app/tech/admin/portal); Field data-model *direction* (units +
`vehicle_type` + per-device `install_records`, type-specific attributes); marketing proof rules
(job-type only, no company names, ~30 yrs experience, no install count).

**Still open:**
1. ✅ **RESOLVED (Command 2): monorepo** (pnpm + Turborepo — apps/ · services/ · packages/).
2. [ ] **Command 1** SEO/GEO guideline file + sign-off — *actionable now; gates Phase 1 build.*
3. ✅ **Auth/session RESOLVED (Command 3)**: passkeys+password+TOTP, EdDSA JWT, stateful `__Host-` sessions,
   RLS `SET LOCAL`. *(Control-panel config UI still detailed in Command 5 Design.)*
4. [ ] Finalize Field Reporting **schema** (direction locked; exact columns/type-attrs TBD) +
   field-events taxonomy + multi-tenant routing — *blocks Phase 2.*
5. NON-BLOCKING confirmations (don't gate Phase 1): exact subdomain names · marketing IA list
   (Command 5 default proposed) · Eric/Safety Net contract terms · manufacturer partner status.

*v1 — generated from persona §3 (build order) and §11 (pending). Extend as decisions lock; never
silently fill a 🔒 item — bring it to the human.*
