# P.G. Auto Installs — Build Command Set (v1.1, ready to process)

> The structured commands the **[pg-build-agent / "Sterling"](../.claude/agents/pg-build-agent.md)** executes
> against. Run **in order, one phase per turn, review before advancing.** Governing docs:
> [COMMAND-0-LOCKED-CONTEXT.md](./COMMAND-0-LOCKED-CONTEXT.md) · [BUILD-PLAN.md](./BUILD-PLAN.md) ·
> [SEO_GEO_GUIDELINES.md](./SEO_GEO_GUIDELINES.md) (LOCKED) · [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md) ·
> [FIELD-EMAILER-AUDIT.md](./FIELD-EMAILER-AUDIT.md).
>
> **v1.1 changes vs the original 0–10 set:** new **Command 4 (Messaging & Content Architecture)** inserted
> before Design; everything downstream renumbered +1; **UI-Forensics** pre-step added to Design (now 5);
> **adversarial gate** (now 10) expanded with SEO/sales/trust lenses; **Claims taxonomy** added to Command 0;
> business-observability command considered and **declined**.

## Universal per-command requirements (apply to EVERY command — DRY)
- **U1 — Currency Gate:** open each command by verifying current best practices for its domain **as of today**
  via research tools (not memory); cite every source; flag contested/changed/deprecated guidance.
- **U2 — Definition of Complete:** close each command by stating "done" as a **levels × aspects matrix**
  (L0 Platform · L1 Surface · L2 Service · L3 Component) × (functionality · security · performance ·
  accessibility · SEO/GEO · data integrity · API contract+docs · test coverage · logging+errors · DRY),
  each cell concrete, measurable, and linked to its Command 8 test. Verified, never asserted.

## Operating rules (recap)
- Run in order; one phase per turn; review before advancing. No code until the plan, the SEO/GEO file, and the
  test rails for that phase are approved. The brand kit is law; claims must be defensible (Command 0 taxonomy).
  Every API/data op/recommendation documented + cited. No deploy without the adversarial gate. Additions stay
  minimal and confirmed.

---

## Command 0 — Locked Project Context  ✅ DONE
Establish and lock company identity, brand kit, defensible-claims **taxonomy** (Proven / Customer-verifiable /
Internal-estimate / Marketing / Forbidden), legal/naming constraints, surfaces, locked stack, and pending
decisions. *Output:* [COMMAND-0-LOCKED-CONTEXT.md]. *Status:* complete (+ taxonomy amendment v1.1).

## Command 1 — SEO + GEO Guideline Compilation  ✅ LOCKED 2026-06-04
Compile every current SEO + GEO guideline (U1), one reviewable file, each item cited + surface-tagged +
prioritized + flagged. **Approved before any design/code.** *Output:* [SEO_GEO_GUIDELINES.md] (142 guidelines;
decisions A–G resolved) + [LOCAL-SEO-TARGETS.md].

## Command 2 — Architecture Blueprint  ⏳ IN PROGRESS
- **Context:** multi-service microservice architecture spanning marketing site, admin/tech portals, field app;
  shared concerns (auth, telematics ingestion, reporting) likely warrant their own services.
- **Requirements:** service boundaries, inter-service communication, stack-per-service with explicit
  speed/functionality/memory justification; enforce DRY via shared libraries/contracts; mark security
  touchpoints at every boundary (full design in Command 3).
- **Resources:** Command 0 locked facts; hosting/budget/team-size constraints. **(U1: verify current Cloudflare
  Workers / Hyperdrive / workers-rs / Hono / Astro-on-CF guidance.)**
- **Goals:** end-to-end plan — service map, data-flow description, stack-decision table (option/why/speed/memory/
  trade-offs), shared-code strategy, scaling+memory considerations, security-touchpoint inventory.
- **Focus:** clean boundaries, best-fit stacks, minimal duplication, minimal future debt.
- **Instructions:** propose + justify every stack choice; reviewable in one pass; **wait for approval** before any
  data/API/test design; **write no code.**

## Command 3 — Security Design
- **Context:** security designed from onset, not retrofitted. Three trust levels: public site, privileged
  portals, field app on untrusted networks/devices.
- **Requirements:** threat model per surface; authN/Z model; secrets/key management; transport + at-rest
  encryption; input validation + output encoding; rate limiting; session/token strategy (Argon2id, JWT/session +
  refresh rotation, MFA-ready — no hand-rolled crypto); audit-logging hooks; dependency/supply-chain controls;
  control-panel config security.
- **Resources:** Command 2 blueprint; current security baselines/standards (U1, cite).
- **Goals:** security design tied to architecture — controls mapped to services/boundaries + threat model +
  residual-risk register.
- **Instructions:** map every control to a Command 2 boundary; cite standards; identify residual risk; design only;
  confirm before proceeding.

## Command 4 — Messaging & Content Architecture  🆕
- **Context:** for a lead-gen site, copy / proof hierarchy / trust signals / CTA logic / customer journey often
  matter more than the visual layer. Defined **before** Design so Design serves the message.
- **Requirements:** homepage copy + proof hierarchy (driven by the Command 0 **claims taxonomy** — only Proven /
  Customer-verifiable ship as fact); trust signals; CTA logic + conversion path (quote/contact); per-audience
  messaging (fleet managers, small owners, partner channel); service-line + service-area content map;
  **bilingual EN/ES** content plan; **per-location research-agent spin** (one agent per metro × service page,
  EN+ES) per [LOCAL-SEO-TARGETS.md] — each output a task object clearing the anti-doorway + U2 bar.
- **Resources:** Command 0; LOCKED [SEO_GEO_GUIDELINES.md] (§2 on-page, §6 GEO answer-first, §7 local/B2B);
  [LOCAL-SEO-TARGETS.md]. **(U1: verify current B2B/lead-gen messaging + conversion-copy best practices.)**
- **Goals:** a content architecture — page/IA list, message + proof per page, CTA + journey map, EN/ES plan, and
  the per-location research task set.
- **Focus:** defensible claims only, prove-don't-claim, conversion clarity, anti-slop editorial voice.
- **Instructions:** no invented copy/claims; tag every claim to the taxonomy; present for review; build nothing yet.

## Command 5 — Design System & UX  *(+ UI-Forensics pre-step 🆕)*
- **UI Forensics (mandatory, FIRST):** inventory the existing `index.html`/landing-page patterns (gradients,
  opposing-scroll, banners/marquees, hero, CTA structure, reduced-motion); for each, explain why it exists and
  whether it's **intentional or accidental**; THEN propose modifications. Anti-slop brake — do not replace
  wholesale with template sludge.
- **Context:** brand-faithful design across all surfaces, governed strictly by the Command 0 brand kit.
- **Requirements:** design tokens from the brand kit; component inventory; motion spec (opposing side-scroll +
  gradient treatment + **reduced-motion**); **banner diagnosis & fix** (why they feel "off" → specific fixes,
  not removal); per-surface layouts (marketing / admin / tech / field) + **full control-panel config design**;
  honor LOCKED SEO/GEO constraints (self-hosted fonts; lazy 3D + static-poster LCP; **orange = large/UI only,
  fails body contrast**; WCAG 2.2 AA; CWV budgets).
- **Resources:** brand kit; LOCKED SEO/GEO file (a11y + perf constraints); Command 2 architecture; Command 4 messaging.
- **Instructions:** derive everything from the brand kit (never override); diagnose before proposing; tie motion/
  visuals to a11y + perf constraints; present for review; build nothing.

## Command 6 — API Contract & Documentation
- **Context:** all API calls documented + divided into correct functional categories before implementation.
- **Requirements:** contract-first per service; functional categories; request/response schemas; versioning; error
  formats; auth requirements; rate-limit posture per endpoint.
- **Resources:** Command 2 (architecture), Command 3 (security).
- **Goals:** categorized OpenAPI spec + human docs; every endpoint mapped to service + Command 3 controls.
- **Instructions:** contracts before code; categorize functionally; no orphan endpoints; confirm before data design.

## Command 7 — Data Architecture
- **Context:** DB best practice from the first migration; every data source cleanly sourced + justified.
- **Requirements:** schema per service; normalization + justified denormalizations; indexing; migration approach;
  connection/pooling (Hyperdrive); retention; telematics time-series + PostGIS geospatial; external-source register.
  Seeds the canonical install-event schema (`units` + `vehicle_type` + per-device `install_records`, type-specific
  attributes) — see [FIELD-EMAILER-AUDIT.md].
- **Resources:** Command 2, Command 6 (API contracts), Command 3 (security).
- **Goals:** schemas + migration plan + indexing/perf + retention + data-source register + access best-practices checklist.
- **Instructions:** best practice immediately (no provisional designs); justify denormalizations; register every
  source; confirm before test design.

## Command 8 — Test Strategy & Build Rails
- **Context:** all tests sorted BEFORE any code, with coverage intent + as a **rail** that prevents deviation.
- **Requirements:** regression, functional, e2e, logic, security test plans across all surfaces; explicit coverage
  targets; test data/fixtures/environments; the write-tests-then-build order per feature.
- **Resources:** Commands 2, 3, 6, 7.
- **Goals:** a test strategy doubling as the build rail; each test tied to the spec it validates; measurable targets.
- **Instructions:** author tests before implementation; trace spec→test; this rail governs all later coding; confirm
  before pipeline design.

## Command 9 — DevOps, Logging & CI/CD Pipeline
- **Context:** full CI/CD with linting, structured logging, error handling — defined before code so rails enforce
  automatically.
- **Requirements:** lint/static-analysis; structured logging standard (levels, correlation IDs, what/where);
  error-handling conventions; CI (lint→test→security-scan→build); CD (gated deploy → Command 10 adversarial gate);
  environments; rollback; observability/monitoring.
- **Resources:** Command 8 (tests), Command 3 (security), Command 2 (architecture).
- **Goals:** CI/CD stage map + linting/logging/error standards + monitoring + deploy gates (incl. adversarial).
- **Instructions:** pipeline enforces Command 8 coverage + Command 3 security automatically; logging/errors as
  standards; reserve the mandatory adversarial gate; confirm before hardening design.

## Command 10 — Adversarial Hardening Gate  *(+ SEO/sales/trust lenses 🆕)*
- **Context:** before any full deploy, non-context adversarial agents with randomized instructions attempt to break
  the site + functionality — **on our own staging only.**
- **Requirements:** adversarial harness — context-free, randomized-goal agents probing UI flows, functionality,
  inputs, auth, error paths; **plus expanded lenses:** **security**, **functionality**, **SEO** (crawl/index/markup
  regressions), **sales/conversion** ("skeptical fleet manager: what stops them requesting a quote?"), **trust**
  (does it feel credible/legit?). Pass/fail criteria; reporting format; feedback loop into Commands 8–9.
- **Resources:** Command 9 (pipeline), Command 8 (tests), Command 3 (security).
- **Goals:** adversarial plan wired into the deploy gate — agent design, randomized-task generation, staging-only
  scope, result triage, failure→fix loop. No full deploy proceeds on failure.
- **Instructions:** deliberately context-free + randomized; staging only; gate blocks deploy on failure; confirm
  before task breakdown.

## Command 11 — Task Breakdown  *(apply to any approved phase)*
- **Context:** every approved phase → proper tasks/objectives before work starts (minimal coding + debt via staging).
- **Requirements:** take ONE approved phase; break into objectives → tasks → steps; each task carries steps, data,
  knowledge sources + citations, best practices, dependencies, definition of done, and the **Command 8 tests** it
  must satisfy.
- **Resources:** the specific approved phase doc + all upstream specs.
- **Goals:** a staged, dependency-ordered task list an implementer follows without deviation/debt.
- **Instructions:** one phase at a time; order by dependency; cite sources for every non-trivial decision; link each
  task to its governing tests; **no implementation until the breakdown is approved.**

---
*v1.1 — ready to process. Numbering is canonical; cross-references updated for the Command 4 insertion.*
