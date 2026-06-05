# Command 3 — Security Design (✅ APPROVED & LOCKED 2026-06-05)

> **STATUS: ✅ APPROVED 2026-06-05 (John). No code written.** Governs Commands 6 (API), 7 (Data), 8 (Tests),
> 9 (DevOps), 10 (Adversarial). **Decisions:** Workers Paid confirmed (hybrid hosting — see
> [COST-BENEFIT-HOSTING.md](./COST-BENEFIT-HOSTING.md)); auth = passkeys **and** password, both + TOTP;
> JWT = EdDSA-preferred/RS256-fallback (impl picks per library); secrets = Wrangler now → Secrets Store at GA.
> Maps every control to a Command 2 boundary. **U1 Currency Gate:**
> verified against live June 2026 sources (OWASP ASVS 5.0, OWASP Top 10:2025, NIST 800-63-4, Cloudflare/Neon/
> PostgreSQL docs) — all cited in working notes; flags below mark what's recently-changed or a feasibility caveat.
>
> **Standards targeted:** **OWASP ASVS 5.0 Level 2** (B2B privileged data) · **OWASP Top 10:2025** (A01 Access
> Control incl. SSRF · A02 Misconfiguration · A03 Supply Chain · A05 Injection · A07 Auth · A10 Exceptional
> Conditions) · **OWASP API Security Top 10:2023** (BOLA/BFLA) · **NIST SP 800-63-4** (passkeys at AAL2).

---

## A. Decision-critical findings (need your call — §K)

1. **🚩 Workers PAID plan is required.** OWASP-strength Argon2id (19 MiB, t=2) via `hash-wasm` costs ~100 ms CPU;
   the **Free plan caps at 10 ms CPU/request** → impossible. **Paid** allows CPU up to 5 min (`cpu_ms` config,
   raised Mar 2025) → feasible in svc-auth. *(Paid is needed for the stack regardless — Hyperdrive, Containers,
   Tail Workers all want Paid. Confirming it as a requirement.)*
2. **🚩 Passkeys (WebAuthn/FIDO2) are now the recommended PRIMARY factor** (industry + NIST 800-63-4, finalized
   Jul 2025). **Recommendation: passkeys primary for portals/admin + TOTP fallback; avoid SMS/email OTP.** Field
   app uses password+TOTP or passkey for initial sign-in, then short-lived device-bound tokens.
3. **🚩 RLS tenant context MUST be `SET LOCAL` inside a transaction.** Hyperdrive transaction-pooling reuses
   connections and `RESET`s session state — a plain session `SET tenant` **leaks/mismatches tenants across
   requests**. This is the single highest-risk implementation detail in the platform. Pattern:
   `BEGIN; SET LOCAL app.tenant_id = $1; <queries>; COMMIT;`
4. **🚩 Cloudflare Secrets Store is still BETA** (as of latest changelog) and Cloudflare deploy **OIDC isn't
   shipped** (wrangler-action still needs a scoped API token). Both go in the residual-risk register.

---

## B. Threat model per surface (trust levels)

| Surface (Cmd 2) | Trust | Primary threats | Headline controls |
|---|---|---|---|
| **web-marketing** (public) | Untrusted visitors | XSS, form spam/bots, SSRF via any fetch, supply-chain (CDN), info leak | Strict CSP, Turnstile on lead forms, no secrets client-side, self-host assets |
| **portal-admin / portal-tech** (privileged) | Authenticated staff | Broken access control (A01), BOLA/BFLA, session hijack, CSRF, privilege escalation | Passkey auth, stateful sessions, per-object authz, RLS, audit logging |
| **app-field** (PWA, hostile device) | Untrusted device on untrusted network | Device loss/theft, offline-data exposure, token theft, replay of queued writes | Device-bound short tokens, encrypted+minimal offline cache, idempotent replay, clear-on-logout |
| **Backend services** (Workers) | Internal (service bindings) | Tenant isolation failure, injection, SSRF, secrets exposure, BOLA | RLS + `SET LOCAL`, Zod validation, parameterized queries, scoped secrets, `global_fetch_strictly_public` |

---

## C. Identity & Authentication (highest-risk area — svc-auth)

| Concern | Decision (current best practice) | Source standard |
|---|---|---|
| **Password hashing** | **Argon2id via `hash-wasm`** — m=19456 (19 MiB), t=2, p=1 (OWASP min). **Requires Workers Paid.** bcrypt(cost≥10)-via-WASM only as fallback. | OWASP Password Storage |
| **Primary auth** | **DECIDED: support BOTH — passkeys (WebAuthn/FIDO2) as the preferred/primary phishing-resistant factor AND a password option**, user's choice. Passkeys recommended, password not forced out. | NIST 800-63-4, OWASP Auth |
| **2FA / fallback** | **TOTP** authenticator on BOTH paths (password+TOTP, and TOTP as passkey-recovery fallback). **No SMS/email OTP** as primary. | OWASP Auth |
| **Password policy** | Min 8 w/ MFA (15 w/o); support ≥64 chars; no composition rules; allow Unicode. **HIBP k-anonymity breached-password check.** | OWASP Auth |
| **Portals/marketing sessions** | **Stateful server-side sessions** (instant revocation), session ID in **`__Host-` cookie, HttpOnly + Secure + SameSite=Strict**. Regenerate ID on login. Idle 15 min, absolute 4–8 h. | OWASP Session Mgmt |
| **Field app + inter-service** | **Short-lived JWT (15 min access), asymmetric EdDSA (Ed25519)** signed by svc-auth; verifiers hold public key only (**never HS256 shared secret**). JWKS at `/.well-known/jwks.json` w/ `kid`. | Curity/WorkOS, NIST |
| **Refresh tokens** | **Single-use rotation + reuse detection → invalidate token family**; refresh ≤7 days (B2B short end). | Auth0/CIAM |
| **Brute-force** | Account-based counter, **exponential backoff** (1s doubling), not hard lockout; Cloudflare rate-limit login (~5/min, count failures only). | OWASP Auth |
| **Bot protection** | **Cloudflare Turnstile** on login + lead/quote forms; **server-side Siteverify in the Worker** (never trust client token). | Cloudflare |

---

## D. Controls matrix (control → where applied → standard)

| Control | Where (Cmd 2 boundary) | Standard |
|---|---|---|
| TLS everywhere + HSTS preload | Edge (all surfaces) | OWASP Headers |
| Strict CSP (nonce/hash + `strict-dynamic`, no CDN allowlist) | web-marketing, portals, field | web.dev/OWASP CSP |
| Security headers (nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'`) | All response middleware (Hono) | OWASP Headers |
| Zod schema validation (body/query/params) | Every service endpoint | OWASP/A05 |
| Output encoding: framework auto-escape + **DOMPurify** for any HTML; **never raw innerHTML** | All surfaces (fixes legacy XSS) | OWASP XSS |
| Per-object + per-function authz (BOLA/BFLA — never trust client IDs) | svc-* endpoints | OWASP API:2023 |
| Tenant isolation: app-level `tenant_id` filter **+ RLS backstop** (`FORCE`, non-owner non-BYPASSRLS role) | Every DB query | A01 / PostgreSQL |
| `SET LOCAL` tenant context in transaction (pooling-safe) | svc-* → Hyperdrive | Cloudflare/Neon |
| Parameterized/prepared statements only | All DB access | OWASP/A05 |
| CSRF: SameSite + signed double-submit + custom header + Fetch Metadata (cookie auth only) | Portals/marketing | OWASP CSRF |
| Strict CORS allowlist + `credentials:true` (no wildcard) | All service APIs | MDN |
| `global_fetch_strictly_public` + fetch allowlist (SSRF) | All Workers | Cloudflare/A01 |
| Rate limiting (login/API/forms) | Cloudflare WAF + Workers binding | OWASP/Cloudflare |
| Turnstile bot challenge | Login + lead forms | Cloudflare |
| Argon2id (WASM) password hashing | svc-auth | OWASP |
| Scoped, short-expiry R2 presigned URLs; validate type/size pre-issue; private buckets | svc-media → R2 | Cloudflare R2 |
| Field-level encryption (pgcrypto) for sensitive columns | Neon (PII/tokens) | Neon/OWASP |
| Security audit logging → immutable sink | All services → Logpush | OWASP Logging |

---

## E. Data-layer security (→ Command 7 detail)

- **RLS on every tenant-scoped table** + `FORCE ROW LEVEL SECURITY`; app connects as a **non-superuser, non-owner,
  non-BYPASSRLS role**; separate **read-only / read-write / migration(owner)** roles (least privilege).
- **Tenant context = `SET LOCAL app.tenant_id` inside `BEGIN…COMMIT`** (never session `SET` — pooling leak). Keep
  transactions tight (don't hold connections to preserve context — hurts Hyperdrive scaling).
- **Defense in depth:** app-level `WHERE tenant_id = $current` AND RLS backstop. Audit checklist: every new table
  ships RLS + policies for all of SELECT/INSERT/UPDATE/DELETE.
- **TLS to Neon = `verify-full` / `channel_binding=require`** (not bare `sslmode=require` — MITM-vulnerable).
- **At rest:** Neon AES-256 (KMS) + R2 AES-256 (default). **pgcrypto** field-level encryption for high-sensitivity
  columns, keys in Secrets Store/KMS (not in a table), rotated.
- **Migrations** run on the **direct (non-Hyperdrive) connection** via the owner role only.

---

## F. Secrets & key management

- **Never in repo / wrangler config / committed `.env`.** Inject via **Wrangler secrets** (today) → migrate to
  **Cloudflare Secrets Store when GA** (🚩 currently Beta; 100-secret/1 KB caps).
- **JWT signing keys: EdDSA (Ed25519) private key in Secrets Store/KMS**, public keys in JWKS; **rotate ≥90 days
  with overlap** (sign new, keep old public until old tokens expire). *(If the chosen Workers JWT lib lacks EdDSA,
  fall back to RS256 — note AWS KMS added Ed25519 Nov 2025; Azure KV still lacks it.)*
- **DB credentials:** per-environment / per-Neon-branch, rotated, never in browser bundle.

---

## G. Field-device & offline security (app-field)

- **No secrets, no long-lived credentials on device.** Short-lived **device-bound tokens** (DBSC pattern where
  supported; server-side revocation fallback elsewhere).
- **IndexedDB is NOT encrypted at rest** → cache the *minimum* sensitive data; **encrypt sensitive cached fields
  with WebCrypto AES-GCM** + TTL; rely on OS device encryption; **clear all storage on logout / token revocation.**
- **Replay/idempotency:** every queued write carries a **random UUID `Idempotency-Key`**; server **dedupes** (TTL)
  and **authenticates every replayed request** (never trust the queue). Locking for concurrent duplicates.
- **Service worker:** HTTPS-only, narrowest scope, **never cache authenticated responses**, versioned caches,
  short-cache the SW script, strong CSP (prevents cache-poisoning).
- **iOS:** installed PWA is exempt from the 7-day eviction counter; call `navigator.storage.persist()`; still treat
  offline data as evictable — **server is the source of truth**, with reconciliation backstop (Cmd 2 §A.3).

---

## H. Supply-chain & CI/CD security (→ Command 9)

- **Real driver:** the **Shai-Hulud npm worm (Sep 2025)** + follow-ons. Current hardening:
  - **pnpm:** commit `pnpm-lock.yaml`, **`--frozen-lockfile`** in CI; postinstall scripts **disabled by default**
    (allow only vetted via `onlyBuiltDependencies`); **`minimumReleaseAge` cooldown ≥7 days**; `blockExoticSubdeps:true`;
    `trustPolicy:"no-downgrade"`; `pnpm audit`; minimize/pin deps; **SBOM (CycloneDX)**.
  - **Publishing/CI:** **npm OIDC Trusted Publishing** (no tokens; auto-provenance) — classic npm tokens were revoked
    Dec 2025. **GitHub Actions:** `GITHUB_TOKEN` read-only + per-job elevation, **pin actions to full commit SHA**,
    untrusted input via `env` (no inline `run:`), Dependabot/Renovate **+ cooldown**.
  - **Cloudflare deploy:** 🚩 OIDC not shipped for wrangler-action → use a **tightly-scoped "Edit Workers" API token**,
    rotated, deploy only from a protected branch/environment with required review.
- **Astro:** active 2025–2026 XSS CVEs (Server Islands, DOM-clobbering) → **keep Astro patched**, lint
  `no-set-html-directive`, sanitize any `set:html`.

## I. Security logging & monitoring (→ Command 9)

- **Log:** authn success + failure, authz failures, admin actions, tenant data access — structured (timestamp,
  severity, security-event tag, account, source IP, trace/span id). **Never log secrets or full PII.**
- **Retention/tamper-evidence:** Workers Logs (3–7 days) is insufficient → **Logpush to immutable storage
  (object-lock) or SIEM**. Cloudflare **Audit Logs v2** (18 mo) covers account/dashboard actions.

## J. Residual risk register (accepted / monitored)

| Risk | Status | Mitigation / watch |
|---|---|---|
| Cloudflare Secrets Store still Beta | Accepted | Use Wrangler secrets now; adopt at GA |
| Cloudflare deploy OIDC not shipped | Accepted | Scoped+rotated API token, protected branch |
| Passkey browser/device support uneven | Mitigated | TOTP fallback + recovery flow |
| iOS offline data evictable / not encrypted | Mitigated | Server source-of-truth, AES-GCM cache, minimal data |
| EdDSA library/HSM support uneven | Mitigated | RS256 fallback |
| Argon2id needs Workers Paid CPU | Resolved | Paid plan (required anyway) |

---

## K. Decisions — ✅ ALL RESOLVED 2026-06-05

1. **Workers Paid — ✅ CONFIRMED** (hybrid hosting: Workers Paid edge + edge Argon2id; existing **DO droplets via
   free Tunnel** for long jobs; R2 media; **no GPU/splats**). See [COST-BENEFIT-HOSTING.md](./COST-BENEFIT-HOSTING.md).
2. **Auth model — ✅ DECIDED: support BOTH** passkeys (preferred) AND password, each with TOTP; field app uses
   device-bound short tokens after sign-in.
3. **JWT — ✅ EdDSA (Ed25519) preferred, RS256 fallback** — implementation picks per the chosen Workers JWT library.
4. **Secrets — ✅ Wrangler secrets now → Cloudflare Secrets Store at GA.**

## L. Definition of Complete (U2)

Done when: threat model per surface ✓ · authN/Z model ✓ · controls matrix mapped to Cmd 2 boundaries ✓ · secrets/
identity strategy ✓ · data-layer + tenant-isolation design ✓ · field-device + supply-chain + logging controls ✓ ·
residual-risk register ✓ · all claims cited to live 2026 standards ✓ · **decisions K1–K4 resolved (pending)** ·
John approves (pending). Then → Command 4 (Messaging & Content Architecture).

---

*Command 3 proposal, compiled from live June 2026 research. No code written. Resolve §K, approve → Command 4.*
