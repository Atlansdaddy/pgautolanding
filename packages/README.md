# `packages/` — shared libraries (DRY)

Internal packages shared across `apps/` and `services/` via the pnpm `workspace:` protocol.

| Package     | Purpose                                                                            | Status                    |
| ----------- | ---------------------------------------------------------------------------------- | ------------------------- |
| `tokens`    | DTCG design tokens → Style Dictionary → CSS vars (marketing) + MUI theme (portals) | Phase 1 — building (T0.2) |
| `api-types` | OpenAPI-codegen TypeScript types (single source of truth across the boundary)      | Phase 1+ (T6.2)           |
| `config`    | Shared lint/tsconfig/test config presets                                           | Phase 1 (T0.3/T0.6)       |

Single source of truth per concern — no copy-paste logic across services (Command 2/5/6).
