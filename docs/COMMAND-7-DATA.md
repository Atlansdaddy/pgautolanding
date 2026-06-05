# Command 7 — Data Architecture (✅ APPROVED & LOCKED 2026-06-05)

> **STATUS: ✅ APPROVED 2026-06-05 (John). No migrations yet.** Governs Command 8 (Tests). **Decisions:** schema
> centered on **AI dash cam installs** (primary; VIN/asset#/make/model · jobsite · technician · install details ·
> image inputs · geolocation · time-clock); rail-chassis GPS = secondary JSONB attributes; **type-specific fields in
> validated JSONB** (extensible, no migration per field); **field-events config-toggleable per tenant**; structure
> locked, specifics fillable later. Finalizes the canonical install-event schema (Command 0 §11). **U1:** data practices already verified current (June 2026) in Commands 2–3 — Neon +
> PostGIS, Hyperdrive transaction pooling, RLS `SET LOCAL`, drizzle-kit migrations, BRIN/partitioning. **Several
> fields below are DRAFT pending John's domain knowledge — flagged in §H; I will not finalize them by inventing.**

---

## A. Principles (best practice from the first migration — no provisional shortcuts)
- **Clean from char one:** real PKs/FKs, constraints, indexes, **real timestamps (date+time, `timestamptz`, always)** —
  fixes the legacy "time-only timestamp" bug. Versioned migrations. No localStorage/cache as source of truth.
- **Multi-tenant:** shared schema + **`tenant_id` on every tenant-scoped table** + **RLS (`FORCE`)**; app role is
  non-owner/non-`BYPASSRLS`; tenant context via **`SET LOCAL` in a transaction** (Command 3).
- **Migrations:** **drizzle-kit** (TS-first, versioned, CI-friendly); run on Neon's **direct** connection (not
  Hyperdrive); **every new tenant table ships RLS + policies for SELECT/INSERT/UPDATE/DELETE** as a migration-checklist
  item; split enum-add migrations (can't run in a txn). Per-PR **Neon branch** for test DBs (Command 8).
- **Least privilege:** separate **read-only / read-write / migration(owner)** DB roles.

## B. Canonical domain model (the install-event schema)

> **PRIMARY install type = AI DASH CAM installs** (most common — the schema centers here). Its shape: **unit
> identifiers (VIN · asset number · make · model) · jobsite · technician · install details · image inputs (photos) ·
> geolocation · time-clock (clock in/out + timestamps).** The NS **rail-chassis GPS** install (flash_count /
> hardwire / loaded) is a **secondary "nice-to-have" vehicle_type**, carried in JSONB attributes — not the core case.

```
tenants ─┐
         ├─< users (svc-auth; tenant roles)
         ├─< units ─────< install_records >──── (device/product)
         │       │              │
         │       └─ jobsites    └─< media (R2 refs)
         ├─< install_events  (field reporting: start/end day, delay, escalation, inventory)
         ├─< jobs (dispatch; PostGIS location)
         ├─< audit_log (who/what/when, before/after)
         └─ leads (public quote requests; no tenant)   feature_flags · settings (svc-config)
```

### Core tables (representative columns; **bold = needs John's confirmation**)
| Table | Key columns | Notes |
|---|---|---|
| **tenants** | id, name, status, created_at | PG's clients (multi-tenant root; replaces legacy single hardcoded client) |
| **units** | id, tenant_id, vehicle_type, **VIN, asset_number, make, model**, year, **`attributes` JSONB** (type-specific), created_at/updated_at | confirmed identifiers VIN/asset#/make/model; rail `chassis#` goes in attributes. Generalizes legacy `chassis` → any vehicle |
| **install_records** | id, tenant_id, unit_id→units, **device_type** (AI dash cam = primary; also GPS/ELD/gateway), **product** (Motive AI Dashcam Plus / Netradyne D-450 / Samsara CM34), status (pass/fail), jobsite_id, **technician_id**, **install_geog (PostGIS point — captured at install)**, **clock_in / clock_out (timestamptz)**, install detail in **`attributes` JSONB** (dashcam: mounting/camera-position/wiring; rail: flash_count/hardwire/loaded), notes, installed_at (timestamptz) | one row **per device installed**; dashcam-centric; photos via `media`; geolocation + time-clock built in |
| **install_events** | id, tenant_id, **event_type**, jobsite_id, tech_id, payload JSONB, occurred_at (timestamptz) | Field Reporting events (replaces mailto). **event_type set is config-driven** — see §B-events |

**Field-events taxonomy (config-toggleable):** seed set = `start_of_day · end_of_day · delay · escalation · inventory`
+ common-sense additions (e.g. `arrival · completion · break · parts_request`). **Which event types are active is
controlled per-tenant in svc-config** (activate/deactivate without a code change) — the registry of allowed types lives
in config; `install_events.event_type` validates against the active set.
| **jobsites** | id, tenant_id, name, **geog (PostGIS GEOGRAPHY point)**, address | install locations |
| **jobs** | id, tenant_id, jobsite_id, scheduled_at, assigned_tech_id, status | dispatch/QA |
| **media** | id, tenant_id, install_record_id, r2_key, content_type, size, created_at | R2 object refs (photos; client branding stripped) |
| **leads** | id, name, company, email, phone, message, **fleet_size?, vehicle_types?, platform?**, source, created_at | **public** quote form (svc-leads); **no tenant_id**; PII-minimized |
| **audit_log** | id, tenant_id, actor_id, action, entity, entity_id, before JSONB, after JSONB, at (timestamptz) | security + QA history |
| **feature_flags / settings** | key, value, tenant_id?, owner, expires_at, updated_by, updated_at | svc-config; lean |

### Type-specific fields — recommended approach
**Core typed columns for common fields + a validated `attributes` JSONB for type-specific ones** (Zod-validated per
vehicle_type/device at the API). Rationale: rail chassis needs `flash_count / hardwire / loaded`; other types need
different fields — JSONB lets us "add other types' fields as they come up" (Command 0) **without a migration per type**,
while keeping core columns indexed/constrained. *(Decision §H.4.)*

## C. Geospatial (PostGIS)
- `GEOGRAPHY(Point)` for jobsites/unit locations; **GiST index**; geofences as `GEOGRAPHY(Polygon)` if/when needed.
- Enable per-DB: `CREATE EXTENSION postgis;` (Neon ships 3.5.x).

## D. Indexing & performance
- PK (uuid) + FK indexes; **`tenant_id` index on every tenant table** (composite with hot filter cols).
- `install_records(unit_id)`, `install_records(tenant_id, installed_at)`; `install_events(tenant_id, occurred_at)`.
- **BRIN index on time columns** for append-heavy event/telematics data; **range-partition by time** if telematics
  volume grows (Timescale OSS available on Neon but **no compression** → use partition drops for retention).
- Unique constraints (e.g., one active install_record per unit+device_type as appropriate — confirm).

## E. Retention & data sources
- **Retention:** install records/units/jobs = business records (keep); install_events long-lived; **leads** retention
  policy (e.g., purge unconverted after N months — confirm); telematics time-series partition-drop.
- **Source register:** field app (tech-entered, authoritative for installs) · public form (leads) · telematics
  (ingested, svc-telematics) · manufacturer product reference (static lookup: Motive AI Dashcam Plus, Netradyne
  Driveri D-450, Samsara CM34 + Vehicle Gateway) · all timestamped + sourced.

## F. Access best-practices checklist (enforced from migration #1)
RLS+FORCE on every tenant table · non-owner app role · `SET LOCAL` tenant context · parameterized/prepared statements
only (no string interpolation) · `verify-full` TLS to Neon · pgcrypto field-level encryption for any sensitive column ·
migrations via owner role on direct connection · per-PR Neon branch for tests.

## G. How services own data (no cross-service table reach)
Each service owns its tables; cross-service reads go through the owning service's API (service binding), not direct DB
access — except all share the one Neon DB with RLS. svc-installs owns units/install_records; svc-field-sync writes
install_events + install_records (via svc-installs or shared schema — confirm boundary); svc-leads owns leads;
svc-config owns flags/settings; svc-auth owns users.

## H. Decisions — ✅ RESOLVED 2026-06-05
1. **Primary install type = AI DASH CAM installs** (most common). Core shape: VIN · asset_number · make · model ·
   jobsite · technician · install details · image inputs · geolocation · time-clock. **Schema centered here.**
2. **Rail-chassis GPS (NS)** (`flash_count / hardwire / loaded`) = **secondary "nice-to-have" vehicle_type**, carried
   in JSONB attributes — not the core case.
3. **Type-specific storage — ✅ validated JSONB `attributes`** (extensible; no migration per field).
4. **Field-events — ✅ config-toggleable:** seed `start/end_of_day · delay · escalation · inventory` + common-sense
   additions; **active set controlled per-tenant in svc-config** (activate/deactivate without code change).
5. **Identifiers — ✅ VIN · asset_number · make · model** (rail `chassis#` in attributes).
6. **Still fillable later (JSONB makes this safe):** exhaustive vehicle-type list, per-type fields beyond dashcam/rail,
   full device list, plate-as-PII policy, lead retention window. Not blocking — added as encountered.

## I. Definition of Complete (U2)
Done when: canonical schema (tables/keys/constraints) ✓ · multi-tenant RLS design ✓ · type-specific-field strategy ✓ ·
geospatial ✓ · indexing/perf + time-series ✓ · retention + source register ✓ · access best-practices checklist ✓ ·
migration approach ✓ · **§H domain decisions resolved by John (pending)** · John approves (pending). Then → Command 8
(Test Strategy & Build Rails).

---

*Command 7 proposal. No migrations. Several fields are DRAFT pending §H — bring them to John, don't invent. Resolve §H,
approve → Command 8.*
