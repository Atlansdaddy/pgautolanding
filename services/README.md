# `services/` — Cloudflare Workers (microservices)

Single-responsibility Workers (TypeScript/Hono first; Rust deferred per Command 2). Contracts are
OpenAPI 3.1 → codegen into `packages/api-types`. Errors are RFC 9457 Problem Details (Command 6/9).

| Service          | Responsibility                                                          | Status                                                                         |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `svc-leads`      | Public lead capture (the only public-write surface) — quote form intake | Phase 1 — building (T6.2); interim store = R2 + email, swappable to Neon later |
| `svc-auth`       | AuthN/Z, sessions, passkeys/password/TOTP                               | Phase 2+                                                                       |
| `svc-installs`   | Install records / units / events                                        | Phase 2+                                                                       |
| `svc-field-sync` | Offline proof-of-send sync                                              | Phase 2                                                                        |
| `svc-media`      | R2 media handling                                                       | Phase 2+                                                                       |
| `svc-notify`     | Notifications                                                           | Phase 2+                                                                       |
| `svc-config`     | Tenant config / feature flags                                           | Phase 4                                                                        |
| `svc-telematics` | Telematics ingestion (stub until real need)                             | Deferred                                                                       |
