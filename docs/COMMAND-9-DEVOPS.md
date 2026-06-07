# Command 9 — DevOps, Logging & CI/CD Pipeline (✅ APPROVED & LOCKED 2026-06-06)

> **STATUS: ✅ APPROVED 2026-06-06 (John).** Governs Command 10 + all build phases. **Decisions:** ESLint flat +
> Prettier + Spectral · gradual deploy `@10→@50→@100` + rollback · **OTel tracing DEFERRED** (logs + Analytics Engine
> first; add selectively — tracing billable since 2026-03-01). Automates enforcement of the Command 8 test rail +
> Command 3 security; nothing ships by hand. **U1:** verified against live June 2026 tooling (Turborepo `--affected`, Wrangler gradual deployments/
> rollback, Workers Logs GA, OTel-on-Workers, Hono `onError`, RFC 9457) — cited in notes. Reserves the mandatory
> pre-deploy **adversarial gate** (Command 10).

---

## A. Linting & static analysis
- **ESLint flat config + `typescript-eslint` (type-aware) + Prettier** — needed for React-hooks/type-aware/custom rules.
  **Biome** optional for ultra-fast format on packages that don't need those plugins. **Spectral** (`.spectral.yaml`,
  extends `spectral:oas`) lints the OpenAPI docs in CI (fail on error). Enforces Command 6 conventions (camelCase, tags,
  operationId, Problem schema).

## B. CI pipeline (GitHub Actions, monorepo, affected-scoped) — required merge gate
**Order:** `lint → typecheck → test → security-scan → build`, each via **`turbo run … --affected`** (only changed
packages) with **Turborepo remote caching** (`TURBO_TOKEN`/`TURBO_TEAM`). Full git history fetched (shallow checkout
makes everything look changed). Parallel matrix across packages; shard Playwright; **Neon branch per PR** for the DB job.
- **security-scan stage:** **Preflight** (GitHub Action — AI-code SAST, dogfood) · Trivy (SCA) · Semgrep CE (SAST) ·
  Gitleaks (secrets) · Checkov (IaC) · **OWASP ZAP (DAST)** against the PR preview deploy · **pgTAP RLS isolation**.
- **Gate:** CI + **patch-coverage** + security-scan + a11y are **required status checks** on the protected branch — no
  merge without green (Command 8).

## C. CD pipeline (Wrangler, per-Worker, affected-only)
- **Decouple upload from activation:** `wrangler versions upload` → returns a **per-PR preview URL** (no prod impact);
  on merge, `wrangler versions deploy` promotes.
- **Gradual deployments:** roll services out `@10 → @50 → @100`; `Cloudflare-Workers-Version-Key` header for session
  stickiness (incl. across service bindings). **Rollback:** `wrangler rollback` (escape hatch, last 100 versions).
- **Per-env** (`[env.dev|preview|production]`) per Worker; **only affected Workers redeploy.** Marketing/static (Workers
  Static Assets) deploys simply; the 8 services use gradual rollout.

## D. CI auth & supply-chain hardening (from Command 3)
- **Cloudflare deploy:** **scoped API token** (Workers Scripts:Edit + needed resources, per-env) as a GitHub
  *environment* secret — **OIDC for wrangler-action has NOT shipped (as of v4.0.0, May 2026)**; minimize scope + rotate.
- **GitHub Actions:** `GITHUB_TOKEN` read-only + per-job elevation; **pin every action to a full commit SHA**; untrusted
  input via `env` (no inline `run:`).
- **pnpm:** `--frozen-lockfile`; postinstall off by default; `minimumReleaseAge` cooldown; `pnpm audit`.
- **npm publish (if any internal pkgs):** OIDC Trusted Publishing (no long-lived tokens).

## E. Structured logging standard
- **JSON via `console.log({...})` → Workers Logs** (the Workers-native pattern, **not pino**). Enable
  `observability.enabled` + tuned `head_sampling_rate`. **Always include:** `level`, `requestId`/`traceId`, service
  name, tenant (id only), timestamp. **Never log** secrets or full PII (Command 3).
- **Correlation across services:** propagate a **trace/request id** (W3C `traceparent`) through service-binding calls so
  one request is traceable end-to-end.
- **Retention/tamper-evidence:** Workers Logs = 3–7 days → **Logpush to R2 (object-lock)** for the security-audit trail
  (Command 3). `head_sampling_rate` down on high-traffic Workers for cost.

## F. Observability / tracing (cost-conscious — right-sized)
- **Start with Workers Logs + Analytics Engine** (cheap per-route metrics) + Tail Workers for live debugging.
- **OpenTelemetry tracing** (native auto-tracing beta, or `@microlabs/otel-cf-workers`) is available and propagates
  trace context across bindings — **but Workers tracing is BILLABLE since 2026-03-01** (~10M events/mo included on Paid,
  then $0.05/M). **Recommendation: defer full OTel tracing; adopt it selectively when debugging a distributed issue** —
  not on day one (small scale, cost-conscious). *(Decision §J.)*

## G. Error-handling conventions (no swallowed errors — ever)
- **Hono `app.onError`** centralizes errors; throw **`HTTPException`** for expected errors; map ALL errors to **RFC 9457
  Problem** responses (`hono-problem-details` middleware) — consistent with Command 6.
- **No empty catches, no swallowed rejections, no unhandled paths.** Log every error structured with its `traceId`;
  return a Problem, never a bare 500 with a stack to the client.

## H. Monitoring & alerting
- Workers metrics: request volume, **error rate/exceptions**, CPU time, **p50/p95/p99 latency**.
- **Cloudflare Notifications** alerts on: error-rate/exception spike · p95 latency regression · **failed deploy** ·
  traffic anomaly. Plus a simple **external uptime check** (multi-region HTTP). (Metrics lag ~30–90s — not sub-second.)

## I. Deployment gates (the rails enforced automatically)
1. Protected branch requires green CI (lint/type/test/**patch-coverage**/security-scan/a11y).
2. `wrangler versions upload` → preview URL on the PR.
3. **Mandatory pre-deploy adversarial gate (Command 10)** = a **GitHub Actions environment protection rule** (required
   reviewers / manual approval) before `wrangler versions deploy`.
4. Gradual rollout `@10→@50→@100`; `wrangler rollback` if metrics regress. **Nothing reaches prod by hand.**

## J. Decisions — ✅ RESOLVED 2026-06-06
1. **Lint/format — ✅ ESLint flat + Prettier + Spectral** (Biome optional later for format speed).
2. **OTel tracing — ✅ DEFERRED** (Workers Logs + Analytics Engine now; add OTel selectively when debugging a
   distributed issue — avoids the per-event tracing bill at current scale).
3. **Gradual deployments — ✅ `@10→@50→@100` + rollback** as the default for the 8 services.

## K. Definition of Complete (U2)
Done when: lint/static-analysis config ✓ · CI pipeline (affected, ordered, required gate) ✓ · CD (versions/gradual/
rollback/preview/per-env) ✓ · CI auth + supply-chain hardening ✓ · structured logging standard (levels, trace ids,
retention) ✓ · observability/tracing plan ✓ · error-handling conventions (onError → RFC 9457, no swallowed errors) ✓ ·
monitoring/alerting ✓ · deployment gates incl. reserved adversarial gate ✓ · cited 2026 tooling ✓ · **§J resolved
(pending)** · John approves (pending). Then → Command 10 (Adversarial Hardening Gate).

---

*Command 9 proposal. Resolve §J, approve → Command 10.*
