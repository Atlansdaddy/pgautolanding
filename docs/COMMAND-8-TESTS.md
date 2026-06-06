# Command 8 — Test Strategy & Build Rails (✅ APPROVED & LOCKED 2026-06-06)

> **STATUS: ✅ APPROVED 2026-06-06 (John). No test code yet.** Governs Command 9 (CI enforces these gates) + every
> build phase. **Decisions:** patch/differential coverage gate · open-source security set + SDD tests-as-rail ·
> **dogfood John's Preflight tool** as a security scanner + comparative. This is the **rail**: tests/specs authored
> **before** implementation, each tied to the spec it validates, so the build can't drift. **U1:** verified against live June 2026 testing tooling
> (Vitest 4, `@cloudflare/vitest-pool-workers` 0.16.x, Playwright, MSW v2, Neon branches, pgTAP, axe-core) — cited
> in notes. Governs Command 9 (DevOps/CI) which enforces these gates, and every build phase.

---

## A. Philosophy — tests as the rail (Spec-Driven)
- **Spec-Driven Development (SDD):** our **contract IS the spec** — Command 6 OpenAPI/Zod + Command 7 schema +
  Command 3 controls + Command 1 a11y. Tests are generated *from* those constraints and act as **guardrails** for
  implementation (incl. AI-assisted). Persona rule: **no implementation before its tests are spec'd.**
- **Every test cites its governing spec** (endpoint/operationId · table/constraint · control · guideline #) for
  traceability — spec → test → code.
- Empirical backing: test-driven agentic dev cut measured regression rates ~6%→~1.8%.

## B. Test pyramid (by type → tool)

| Layer | Tool (2026) | What it covers |
|---|---|---|
| **Unit / function** | **Vitest 4** | pure logic, schema/Zod validators, utilities, domain rules |
| **Worker integration** | **`@cloudflare/vitest-pool-workers`** (tests run inside workerd w/ real bindings; per-file isolated storage) | Hono handlers against real KV/R2/DO/service bindings |
| **Hono API** | `hono/testing` (`app.request`/`testClient`) + integration | happy path **and** invalid payload → 422 Problem shape |
| **Contract** | OpenAPI (generated from Zod) + **AJV** response validation + `@hono/zod-openapi` response validation | running impl provably matches the published contract |
| **Component** | **React Testing Library + Vitest** (query by role/label, not MUI internals); Vitest Browser Mode; **Astro Container API** for `.astro` | UI behavior + accessible output |
| **E2E** | **Playwright** (`context.setOffline`; SW network events flag for offline-queue) | full flows: quote form, login, field report sync/proof-of-send, 3D explorer |
| **Logic / domain** | Vitest + pgTAP | install validation, vehicle_type/JSONB attribute rules, event-taxonomy gating |
| **Security** | **Preflight** (AI-code SAST — dogfood + comparative) · pgTAP (RLS) · Trivy (SCA) · Semgrep CE (SAST) · Gitleaks (secrets) · OWASP ZAP (DAST) · Checkov (IaC) | controls from Command 3 (incl. **tenant-isolation RLS tests**) |
| **Accessibility** | **`@axe-core/playwright`** (WCAG 2.2 tags) + **Lighthouse CI** + manual | the locked WCAG 2.2 AA bar |
| **Regression** | the accumulated suite, run on every change | nothing previously fixed breaks |

## C. The critical ones for THIS platform
- **Tenant isolation (RLS) is tested like auth** — RLS failures are *silent* (wrong rows, no error). **pgTAP** with
  positive (tenant sees own rows) **and negative** (tenant CANNOT see another tenant's rows) cases, with `SET LOCAL`
  tenant context. Guards against the "RLS enabled but `USING (true)`" footgun.
- **Offline proof-of-send / idempotent replay** — Playwright offline→online toggle asserts the IndexedDB queue
  flushes, the server dedupes by `Idempotency-Key`, and pending→confirmed UI states resolve. (SW network events are
  experimental — flag enabled.)
- **Contract conformance** — every endpoint's live response validated against its OpenAPI schema (AJV).
- **CWV / perf budgets** — Lighthouse CI gates LCP/INP/CLS + the JS payload budget (SEO/GEO §54–63).
- **Preflight (dogfood + comparative)** — John's AI-code SAST (`preflight.midatlantic.ai` ·
  `github.com/midatlanticai/preflight`, MIT). 96 probes: hardcoded secrets, **RLS misconfig**, supply-chain
  (~170 compromised package versions), missing auth guards on admin/API routes, CORS/SSRF/headers, and **AI-specific
  risks** (prompt injection, `NEXT_PUBLIC_`/client-component key exposure, MCP). Especially apt here: this platform is
  **AI-built** and **RLS-critical**, both of which Preflight targets directly. Run via its **GitHub Action** as a
  security-scan gate; manage findings with **`.preflight.yml`** suppression + PR-comment export. **Comparative:** track
  Preflight findings vs Semgrep/Trivy/Gitleaks to measure overlap + unique catches (dogfooding feedback to the tool).

## D. Coverage targets
- **~80% line/branch** as the project *ceiling* (diminishing returns past it) — **but the merge GATE is
  patch/differential coverage** (coverage of *changed lines*), not absolute project %. **Assertion quality > %** —
  no coverage-padding tests.
- Security/RLS/auth paths and the field-sync replay path: treated as **must-cover** regardless of %.

## E. Test data / fixtures / environments
- **DB:** **Neon branch per PR** (copy-on-write, ~1s, real Postgres + RLS), deleted on PR close (**delete the branch
  role too** — security). Transactional rollback for per-test isolation.
- **API mocking:** **MSW v2** handlers written once, reused across Vitest + Playwright + Storybook + dev.
- **Fixtures:** seed tenants/users/units/install_records; anonymized (no real client data); per-file isolated Worker storage.

## F. The build rail — per-feature order (governs all coding)
For every feature, in order: **(1) spec** (already locked in Commands 6/7/3/1) → **(2) write tests** from the spec
(unit + integration + contract + e2e + security/a11y as applicable, each citing its spec) → **(3) implement to green**
→ **(4) regression suite stays green** → **(5) coverage gate (patch) passes**. No step skipped; no code before step 2.

## G. Per-surface test focus
- **Marketing site:** e2e (quote form → svc-leads + Turnstile), a11y (axe + Lighthouse, WCAG 2.2 AA), CWV budgets,
  the 3D explorer (lazy-load + reduced-motion + `#ixlist` fallback), i18n (EN/ES render + hreflang).
- **Field app (PWA):** offline queue + sync/replay/proof-of-send, idempotency, large-tap-target a11y, reduced data on device.
- **Portals:** authz/role + tenant-scope (BOLA/RLS), Data Grid behavior, forms (RHF+Zod), audit-trail.
- **Services:** Hono handlers, Zod validation (422 Problem), contract conformance, RLS isolation, rate-limit, idempotency.

## H. CI integration (→ Command 9 enforces)
Cache deps + Playwright browsers · **shard** Playwright across a matrix · parallel unit/Worker/component jobs ·
**Neon branch per PR** for the DB job · branch protection requires test + **patch-coverage** + **security-scan** + a11y
checks before merge.

## I. Decisions — ✅ RESOLVED 2026-06-06
1. **Coverage gate — ✅ patch/differential** coverage of changed lines (+ ~80% project ceiling guide).
2. **Security tool set — ✅ open-source set** (Trivy · Semgrep CE · Gitleaks · OWASP ZAP · Checkov) **+ Preflight**
   (John's tool — dogfood + comparative vs the others).
3. **SDD "tests-as-rail" — ✅ adopted** (contract = spec; tests before code; each test cites its spec).

## J. Definition of Complete (U2)
Done when: test pyramid by type + tools ✓ · the critical platform tests (RLS isolation, offline replay, contract, CWV)
✓ · coverage targets + patch gate ✓ · test data/fixtures/envs (Neon branch, MSW) ✓ · **the per-feature build rail** ✓ ·
per-surface focus ✓ · CI integration ✓ · all grounded in cited 2026 tooling ✓ · **§I decisions resolved (pending)** ·
John approves (pending). Then → Command 9 (DevOps, Logging & CI/CD).

---

*Command 8 proposal. The rail governs all later coding. Resolve §I, approve → Command 9.*
