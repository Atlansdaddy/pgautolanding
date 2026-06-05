# Command 7 — Data Architecture (PROPOSAL for review)

> **STATUS: PROPOSAL — NOT APPROVED. No migrations yet.** Finalizes the **canonical install-event schema** (Command 0
> §11 flagged this as draft). **U1:** data practices already verified current (June 2026) in Commands 2–3 — Neon +
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

## B. Canonical domain model (the install-event schema — DRAFT)

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
| **units** | id, tenant_id, **vehicle_type**, **identifiers** (VIN / chassis# / asset#), make, model, year, **`attributes` JSONB** (type-specific), created_at/updated_at | generalizes legacy `chassis` → any fleet vehicle; type-specific fields live in validated JSONB |
| **install_records** | id, tenant_id, unit_id→units, **device_type**, **product**, status (pass/fail), **install fields** (e.g. flash_count, hardwire, loaded for rail), installer_id, notes, **`attributes` JSONB**, installed_at (timestamptz) | one row **per device installed on a unit**; status + type-specific install detail |
| **install_events** | id, tenant_id, **event_type** (start_of_day/end_of_day/delay/escalation/inventory), jobsite_id, tech_id, payload JSONB, occurred_at (timestamptz) | the Field Reporting events (replaces mailto) |
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

## H. Decisions for your review — **NEEDS YOUR DOMAIN KNOWLEDGE** (Command 0 §11 finalization)
1. **Vehicle types PG actually installs on** — confirm/expand the list: light-duty (car/van/pickup) · heavy-duty
   (dump/refuse/crane/equipment) · rail chassis · **others?** (e.g., Sprinter vans, box trucks, buses, trailers?).
2. **Type-specific fields per vehicle type** — rail chassis = `flash_count / hardwire / loaded` (from legacy). What
   fields do the OTHER types need? (Or start with rail's + add per type as they come up.)
3. **Device/product list for install_records** — confirm `device_type`s: GPS tracker · AI dash cam · ELD · Vehicle
   Gateway · (Motive AI Dashcam Plus combines camera+gateway+ELD). Any others?
4. **Type-specific storage:** core columns + **validated JSONB `attributes`** (recommended, extensible) vs a typed
   column per field? *(Recommend JSONB.)*
5. **Field events taxonomy** — confirm: start_of_day · end_of_day · delay · escalation · inventory. Add/remove any?
6. **Unit identifiers** — which does PG track? VIN · chassis# · asset/unit# · plate (plate may be PII — exclude?).
7. **Lead retention** — purge unconverted leads after how long? (e.g., 12–24 months.)

## I. Definition of Complete (U2)
Done when: canonical schema (tables/keys/constraints) ✓ · multi-tenant RLS design ✓ · type-specific-field strategy ✓ ·
geospatial ✓ · indexing/perf + time-series ✓ · retention + source register ✓ · access best-practices checklist ✓ ·
migration approach ✓ · **§H domain decisions resolved by John (pending)** · John approves (pending). Then → Command 8
(Test Strategy & Build Rails).

---

*Command 7 proposal. No migrations. Several fields are DRAFT pending §H — bring them to John, don't invent. Resolve §H,
approve → Command 8.*
