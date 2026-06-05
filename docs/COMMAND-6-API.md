# Command 6 — API Contract & Documentation (✅ APPROVED & LOCKED 2026-06-05)

> **STATUS: ✅ APPROVED 2026-06-05 (John). No code.** Governs Command 7 (Data). **Decisions:** camelCase JSON ·
> `/v1/` path versioning (additive) · **lead capture = dedicated public `svc-leads` handler (8th service)**.
> Contract-first; every endpoint categorized + mapped to its Command 2 service and Command 3 controls. **U1:** grounded in live June 2026 API standards (OpenAPI 3.1/3.2,
> RFC 9457, Google AIP / Zalando / Stripe conventions) — cited in notes. **Right-sized:** this defines the
> conventions + functional categories + representative endpoints; full per-endpoint specs are authored per phase
> in Command 11 *against* this contract.

---

## A. Global conventions (apply to ALL services — DRY)

| Concern | Decision (June 2026 best practice) |
|---|---|
| **Spec** | **OpenAPI 3.1** target (JSON-Schema-aligned), emitted by **`@hono/zod-openapi`** per service; adopt 3.2 features (hierarchical tags) as tooling lands. Merged into one catalog → **`@pg/api-types`** codegen consumed by all surfaces. |
| **Error format** | **RFC 9457 Problem Details** (`application/problem+json`): `type` (per-service URI namespace) · `title` · `status` · `detail` · `instance` + extensions. **One shared `Problem` schema** referenced by every error response. (9457 obsoletes 7807.) |
| **Versioning** | **URI path `/v1/`** (Google AIP-185 style); evolve **additively** within a version (new optional fields only — no removals/renames/semantic changes); new path segment only for true breaking changes. |
| **Resource naming** | Plural nouns (`/installs`, `/jobs`), **shallow nesting**, lowercase DNS-safe IDs. |
| **JSON casing** | **camelCase** (aligns with TS/Hono); enforced repo-wide via shared Spectral lint. |
| **Pagination** | **Cursor-based, opaque tokens** (`pageSize` + `pageToken` → `nextPageToken`). No offset for high-volume collections (installs, jobs, events). |
| **Idempotency** | **`Idempotency-Key` header (UUID v4)** on unsafe POST; server stores first response keyed by it, replays on duplicate (TTL ≥24h). **Powers the field-app offline replay** (Command 2/3). |
| **Filtering/sorting/fields** | `filter` · `orderBy` · `fields` query params, consistent across services. |
| **Auth (OpenAPI securitySchemes)** | **Bearer JWT** (`http`/`bearer`/`JWT`, **EdDSA**) for services/field app; **cookie session** (`apiKey`/cookie, `__Host-`) for portals/marketing. Global `security` + per-op override; **public endpoints = `security: []`**. |
| **Categorization** | OpenAPI **tags** = functional categories (§B); **unique `operationId`** on every operation. |
| **Async events** | OpenAPI 3.1 **`webhooks`** field for server-initiated events (notifications). |
| **Rate-limit signaling** | Emit **`RateLimit` + `RateLimit-Policy`** headers (IETF two-field draft, forward-compatible). |
| **Validation** | **Zod at every endpoint** (`@hono/zod-validator`) — body/query/params; invalid → 422 Problem. |
| **Tenant scope** | Every tenant-scoped op enforces **RLS via `SET LOCAL` in a transaction** (Command 3); never trust client-supplied tenant/object IDs (BOLA/BFLA). |

## B. Functional categories (tags) → owning service

| Category (tag) | Owning service | Purpose |
|---|---|---|
| **Auth & Identity** | svc-auth | register/login (password + passkey), MFA, sessions, token refresh, JWKS |
| **Install Records** | svc-installs | canonical units + install_records CRUD; QA history |
| **Field Reporting** | svc-field-sync | offline-synced reports + field events (idempotent) |
| **Media** | svc-media | R2 presigned upload/download for install photos |
| **Notifications & Routing** | svc-notify | multi-tenant event routing/recipients; outbound webhooks |
| **Control-Panel Config** | svc-config | feature flags + runtime settings (admin, audited) |
| **Telematics** *(deferred)* | svc-telematics | ingestion/parse (mostly async/internal) |
| **Public / Lead Capture** | **svc-leads** (dedicated public handler — 8th service) | marketing "Request a Quote" + Turnstile verify |

## C. Per-service endpoint catalog (representative — not exhaustive)

### Auth & Identity (svc-auth)
| Method · Path | Purpose | Auth | Controls / notes |
|---|---|---|---|
| POST `/v1/auth/register` | Create account (Argon2id hash) | public | Turnstile, HIBP check, rate-limit |
| POST `/v1/auth/login` | Password login | public | rate-limit (≈5/min, count failures), Turnstile |
| POST `/v1/auth/passkey/options` · `/verify` | WebAuthn register/login | public/session | passkeys (primary) |
| POST `/v1/auth/mfa/totp/enroll` · `/verify` | TOTP 2FA | session | MFA |
| POST `/v1/auth/token/refresh` | Rotate refresh token | refresh cookie | single-use rotation + reuse detection → family invalidation |
| POST `/v1/auth/logout` | Server-side session invalidation | session | — |
| GET `/v1/auth/me` | Current identity + tenant roles | bearer/session | — |
| GET `/.well-known/jwks.json` | Public keys (EdDSA, `kid`) | public | key rotation |

### Install Records (svc-installs)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| GET `/v1/installs` | List install events (cursor) | bearer | RLS tenant scope; filter/orderBy |
| POST `/v1/installs` | Create install event | bearer | Zod; `Idempotency-Key`; RLS |
| GET/PATCH `/v1/installs/{id}` | Read/update one | bearer | BOLA check; RLS |
| GET `/v1/units` · `/v1/units/{id}` | Vehicle units (vehicle_type + type-specific attrs) | bearer | RLS |
| GET `/v1/installs/{id}/history` | QA audit trail (before/after) | bearer (QA role) | audit log |

### Field Reporting (svc-field-sync)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| POST `/v1/field/reports` | **Offline-synced install report** | device-bound JWT | **`Idempotency-Key` (replay-safe)**; Zod; RLS; proof-of-send response |
| POST `/v1/field/events` | start/end day · delay · escalation · inventory | device-bound JWT | taxonomy; `Idempotency-Key` |
| GET `/v1/field/reports?status` | Tech's own sync status | device-bound JWT | RLS |

### Media (svc-media)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| POST `/v1/media/upload-url` | Issue scoped R2 **presigned PUT** | bearer | validate contentType/size **before** issuing; short expiry |
| GET `/v1/media/{id}/url` | Scoped **presigned GET** | bearer | RLS; expiry |

### Notifications & Routing (svc-notify)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| POST `/v1/notify` | Enqueue notification (internal) | service binding | multi-tenant routing (replaces hardcoded recipient) |
| GET/PATCH `/v1/notify/routes` | Manage recipient routing | bearer (admin) | RLS; audit |
| `webhooks: reportSynced / escalationRaised` | Outbound events | signed | OpenAPI 3.1 webhooks |

### Public / Lead Capture (svc-leads — dedicated public handler)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| **POST `/v1/leads`** | **Public "Request a Quote"** (progressive form) | **public** | **Turnstile siteverify (server-side)**, strict rate-limit, Zod; optional fleet-size/vehicle/platform fields; enqueues to svc-notify. Isolated as the only public-write surface. |

### Control-Panel Config (svc-config)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| GET `/v1/config/flags` · PATCH `/v1/config/flags/{key}` | Feature flags (owner+expiry, kill-switch) | bearer (admin) | role-gated; **audit log**; tenant scope |
| GET/PATCH `/v1/config/settings` | Runtime settings | bearer (admin) | role-gated; audit |

### Telematics (svc-telematics — deferred stub)
| Method · Path | Purpose | Auth | Controls |
|---|---|---|---|
| POST `/v1/telematics/ingest` (or Queue consumer) | Ingest/parse telematics | service/internal | mostly async; runs on DO droplet if heavy |

## D. Error model (RFC 9457) — example
```
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json
{ "type":"https://api.pgautoinstalls.com/problems/validation",
  "title":"Validation failed","status":422,
  "detail":"vehicleType is required","instance":"/v1/installs",
  "errors":[{"field":"vehicleType","issue":"required"}] }
```
One shared `Problem` schema; per-service `type` URI namespace; multiple-problem support for batch validation.

## E. How the contract is produced & kept DRY
Each TS/Hono service defines Zod schemas → **`@hono/zod-openapi`** emits its **OpenAPI 3.1** doc → docs merged into a
**catalog** → **`openapi-typescript` / `@hey-api/openapi-ts`** generates **`@pg/api-types`** consumed by every surface
+ service (single source of truth). Spectral lint enforces conventions (casing, tags, operationId, Problem schema).
A future Rust service emits the same OpenAPI via **utoipa**.

## F. Decisions — ✅ RESOLVED 2026-06-05
1. **JSON casing — ✅ camelCase** (TS-aligned).
2. **Versioning — ✅ URI path `/v1/`** with additive evolution.
3. **Lead-capture — ✅ dedicated public `svc-leads` handler** (8th service) — isolates the only public-write endpoint.
4. **Scope — ✅ telematics stays a stub** until a real ingestion need exists (right-sized).

## G. Definition of Complete (U2)
Done when: global conventions (spec/errors/versioning/naming/pagination/idempotency/auth/rate-limit) ✓ · functional
categories mapped to services ✓ · representative endpoints per service ✓ · each mapped to Command 3 controls ✓ ·
error model ✓ · DRY codegen pipeline ✓ · all grounded in cited 2026 standards ✓ · **§F decisions resolved (pending)**
· John approves (pending). Then → Command 7 (Data Architecture).

---

*Command 6 proposal. No code. Resolve §F, approve → Command 7.*
