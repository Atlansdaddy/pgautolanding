# P.G. Auto Installs — Build System: Locked Project Context (Command 0 output)

> Pre-filled Command 0 output. Pairs with the **"Sterling the Build Architect"** persona
> (see [pg-build-agent](../.claude/agents/pg-build-agent.md)).
> Instantiate the build persona first. This document replaces running Command 0 from scratch —
> confirm the facts below, answer the **[BLOCKING]** questions, then proceed to **Command 1
> (SEO/GEO compilation)**. Nothing here overrides the Brand Kit; it summarizes and locks it.

---

## Part 0 — Universal Per-Command Requirements

Apply to **every** command (defined once here, DRY). No command's deliverable is complete without both.

### U1 — Currency Gate ("best as of today")
Open every command by verifying the current best practices for its domain **as of today's date**,
using **research tools — not training memory** — and **cite every source**. Flag anything contested,
recently changed, or deprecated. Where today's guidance conflicts with a prior assumption, the
current cited source wins. (Command 1 already does this for SEO/GEO; it now applies equally to
architecture, security, data, testing, DevOps, and design.)

### U2 — Definition of Complete ("what done looks like — every aspect, each level")
Close every command by stating what **complete** means for its deliverable, as a **levels × aspects
matrix**. Each criterion is concrete, measurable, and linked to the Command 7 test that proves it.
"Done" = every applicable cell verified, never merely asserted.

**Levels (coarse → fine)**
- **L0 — Platform:** the whole integrated system.
- **L1 — Surface:** marketing site · admin portal · tech portal · field app.
- **L2 — Service:** each microservice (Worker / API).
- **L3 — Component:** a feature, screen, endpoint, or module.

**Aspects (applied at each relevant level)**
functionality · security (Command 3 controls present + verified) · performance (latency / memory /
Core Web Vitals to today's cited thresholds) · accessibility (today's WCAG level, cited) · SEO/GEO
(per Command 1, where applicable) · data integrity (constraints, migrations, sourcing) · API
contract + docs (every endpoint documented + categorized) · test coverage (Command 7 targets) ·
logging + error handling (Command 8 standards) · DRY (no duplication; shared contracts used).

**Worked example — "performance" aspect across levels** (numbers come from U1 research, not guesses)
- **L0 Platform:** production monitoring shows every surface meeting Core Web Vitals at current thresholds.
- **L1 Marketing site:** Lighthouse Performance ≥ [today's target]; LCP / INP / CLS within current thresholds; JS payload budget met.
- **L2 Service:** p95 latency < [N] ms at defined load; memory within the Worker budget.
- **L3 3D explorer:** lazy-loaded; initial payload < [X] KB; ≥ [Y] fps on a mid-tier phone.

### Persona amendments (add to "Sterling" / the main build agent)
- **Skill 9 — Currency-checking:** every recommendation, threshold, version, and standard is
  validated against today's authoritative sources and cited; nothing that changes is taken from memory.
- **No-No #10:** Relying on training-memory for any current best practice, threshold, or version
  without verifying it today.
- **No-No #11:** Declaring any deliverable "done" without its Definition-of-Complete matrix satisfied
  and verified against the tests.

---

## Part 1 — Locked Facts Sheet

### Company identity
- **P.G. Auto Installs** — a professional fleet telematics installation company. Installs GPS tracking,
  AI dash cams, ELD compliance, fleet security, and live video. **Not a hardware maker, not a SaaS
  platform** — the crew that installs and documents the work.
- **Founders:** Phil Griffin; John Viruet (John brings an AI/systems background — a genuine
  differentiator no small installer has).
- **Region:** Mid-Atlantic specialist, expanding toward the **FL / Cocoa Beach corridor**.
- **Multi-platform:** installs Motive, Samsara, and Netradyne. **Platform-agnostic is a core
  differentiator** — honest, unbiased recommendations, not a single-vendor push.

### Positioning (Brand Kit is canon — do not abandon or override)
- For fleet operators who need reliable, expert installs without the runaround: a hands-on partner
  with precision work, multi-platform expertise, and dedicated personal service — against
  high-volume competitors who treat every fleet as a ticket number.
- **Full fleet spectrum, not a single vertical.** If it's a fleet vehicle, PG installs it —
  light-duty (Ford Focus, cars, pickups, Mercedes Sprinter and other vans) through heavy-duty (dump
  trucks, trash/refuse trucks, cranes, heavy equipment) and rail chassis. **Rail chassis is just one
  vehicle type among many — not the identity.** Do not pigeonhole PG as a rail/trash-truck shop.
- **Work shown by job type only — never by company name.** PG's experience spans large delivery /
  logistics fleets, facility-services fleets, Class I railyard & OTR chassis, pest-control fleets,
  construction-supply, moving companies, and refuse/trash fleets. The breadth is the pitch: one crew
  that wires a sedan and a garbage truck to the same standard. (See Legal & naming constraints — no
  company names appear.)
- **Sweet spot: 5–99 vehicle fleets** (the segment MOBILE's 100-vehicle minimum ignores), with the
  range to handle larger and specialized fleets too.

### Brand kit summary (canon)
- **Colors:** PG Blue `#2D8FCC` (primary), PG Dark Navy `#1A1A2E`, PG Action Orange `#FF6B35`
  (CTA/accent), PG Sky `#E8F4FD` (light bg), White `#FFFFFF`, Charcoal `#333333`. **60-30-10 ratio:**
  60% neutral, 30% blue, 10% orange.
- **Type:** Montserrat (headings), Open Sans (body), Arial fallback.
- **Voice:** confident & expert · direct & action-oriented · trustworthy & transparent · approachable
  & human. Plain language, "you/we," outcomes over jargon.
- **Approved taglines (use these — do not invent new ones):** "Connected Fleets. Protected Drivers.
  Guaranteed." / "Precision Installs. Total Visibility." / "Your Fleet. Our Expertise. One Call." /
  "Installed Right. Running Tight."
- **Logo:** truck silhouette with circuit-board lines.

### Defensible claims — the ONLY bold claims allowed ("prove, don't claim")
**Defensible (real, documented):**
- **~30 years of installation experience** — the headline credibility anchor (used in place of an
  install count, which was never tallied).
- **Job types performed (anonymized, no company names):** large delivery / logistics fleets ·
  facility-services fleets · Class I railyard & OTR chassis · pest-control · construction-supply ·
  moving · refuse/trash fleets.
- **Thousands of real install photos** — shown stripped of any client branding, plates, or company markings.
- **Hands-on experience installing Motive, Samsara, and Netradyne equipment** (the gear, not a
  partnership — see below).
- **Full vehicle-class range:** light-duty cars/vans/pickups → heavy-duty dump, refuse, cranes,
  equipment → rail chassis. Most small installers can't span this; PG can.
- **Field Emailer** — proprietary field-reporting tool, already built and in production.

**NOT allowed (hard lines — legal and factual):**
- **No company names, ever**, except PG's own direct clients. Naming Safety Net's clients (the
  railroad, the delivery fleet, the facility-services co., etc.) breaches the contract with Eric.
  **Safety Net itself is never mentioned.**
- **No partnership / affiliation / "certified" claims** with Motive, Samsara, Netradyne, or Verizon —
  no legal contracts exist yet. Name and show the equipment; do not imply a relationship. (Revisit
  if/when partner approval lands — John is pursuing it.)
- **No install count.** None was tallied. Lead with the 30 years of experience instead. (The "2,140+"
  in an earlier mockup was a fabricated placeholder — removed.)

### Claims Classification taxonomy (governs every claim that ships — amendment v1.1)
> Every factual/authority claim must be tagged ONE of these **before it ships.** AI may publish only
> **Proven** and **Customer-verifiable** claims as fact. This is the enforcement layer under
> "prove, don't claim" — it stops AI re-inventing authority signals later.

| Tier | May publish as fact? | Definition | PG examples |
|---|---|---|---|
| **Proven** | ✅ Yes | Documented, evidenced, verifiable from PG records/photos/history | "~30 years of installation **experience**"; "thousands of real install photos"; hands-on installs of Motive/Samsara/Netradyne equipment |
| **Customer-verifiable** | ✅ Yes | True and checkable by the customer or a third party | Anonymized job types performed; multi-platform/platform-agnostic; full vehicle-class range (light→heavy→rail) |
| **Internal estimate** | ⚠️ Not as a hard number | Directional, never precisely measured | Install counts (never tallied); "cuts install time ~half" (manufacturer claim — attribute to the manufacturer, don't state as PG's measured result) |
| **Marketing language** | ⚠️ Only as clearly non-factual voice | Aspirational framing that asserts no measurable fact | Approved taglines ("Precision Installs. Total Visibility.", etc.) |
| **Forbidden** | ❌ Never ships | Legally/factually prohibited | Partnership/affiliation/"certified" claims w/ Motive/Samsara/Netradyne/Verizon; any company name except PG's own direct clients; Safety Net or its clients (Ferguson, the railroad, etc.); fabricated stats (the "2,140+"); install counts as hard numbers |

**Rule:** if a claim can't be tagged **Proven** or **Customer-verifiable**, it cannot appear as a fact.
Unsourced number = doesn't ship.

**Live-site finding (to fix at build):** the current landing page reads *"30 years installing fleet
**technology** across every vehicle class."* That is **mis-scoped → Forbidden as written** (commercial
telematics — AI dashcams/ELD — is newer than 30 years, so it over-claims). **Correct to the Proven
form:** *"~30 years of installation experience"* (+ separately, the verifiable vehicle-class range).

### Legal & naming constraints (read before any copy or imagery)
- **Eric / Safety Net contract:** PG will not solicit or name in copy the fleets it installed for
  under Safety Net (those clients belong to the equipment owner, not PG). No client names appear in
  any copy. (John to review the exact contract terms; treat as binding until confirmed.)
- **In photos:** incidental third-party branding in the background (container/yard logos of companies
  PG is not contracted with) is acceptable — it does not identify a PG/Safety Net client. The hard
  exclusion is **any fleet PG actually performed contracted work for: Ferguson must not appear**, and
  no contracted-client name or markings may be shown.
- **Allowed:** the equipment installed, the housing/mounting, how it looks in the vehicle, and the
  type of vehicle/industry.
- **Photo sourcing:** use PG's own install photos. John has extensive **Motive (Vehicle Gateway)** and
  **Netradyne Driveri** photos; **Samsara still needed** (Phil may have install photos/equipment).
  **Do not scrape manufacturer marketing images.**

### Target audiences
- Fleet managers, operations directors, safety directors, procurement, dispatchers (5–99 vehicle
  fleets + specialized).
- Small fleet owners (5–25 vehicles).
- Partner channel managers at Motive / Samsara / Netradyne — peer-to-peer, operational facts, zero
  marketing fluff.

### The three surfaces
1. **Marketing website** — credibility + lead generation; SEO/GEO-first; proves the real track record;
   showcases real installs (3D explorer → Gaussian splats from PG's own capture). **Built first.**
2. **Admin + technician portals** — admin: dispatch, QA, operations. Tech: jobs, schedule, install
   history/documentation.
3. **Field reporting application** — the Field Emailer rebuild: offline-first PWA techs use on-site to
   log installs/events; feeds the portals and the marketing site's live panel.

### Locked technical decisions
- **Host:** Cloudflare — Workers (compute + static), R2 (media; no egress fees — ideal for install
  photos + splats), Hyperdrive (DB acceleration). **[Amended by Command 2, 2026-06-05: deploy to
  Workers Static Assets, NOT Pages — Cloudflare retired Pages investment and the Astro adapter dropped
  Pages support. Long-running jobs use Cloudflare Containers/Workflows (both GA), NOT Fly.io —
  single-vendor.]**
- **Marketing site:** Astro (SSG/SSR, minimal JS, SEO-ideal) with React + three.js as islands for the
  3D explorer.
- **Portals + field app:** React + MUI (MUI for data-dense portal/app UI — not the marketing site).
- **Backend:** microservice Workers — **TypeScript + Hono for everything first**; Rust (workers-rs)
  introduced **only for a measured CPU-bound hot path** (telematics parsing, geospatial) — **[Amended by
  Command 2, 2026-06-05: Rust DEFERRED; workers-rs still flags "not production-ready," and WASM
  bundle/memory-copy overhead negates the win except on small inputs.]** Shared types generated across the
  boundary (OpenAPI codegen / ts-rs) to stay DRY.
- **Database:** Neon Postgres + PostGIS (geospatial: locations, geofences, routes), via Hyperdrive.
- **Auth:** in-house, built on vetted primitives (Argon2id hashing, standard JWT/session +
  refresh-token rotation, rate limiting, MFA-ready). No hand-rolled crypto. Highest-risk area — full
  design in **Command 3**.
- **Build sequence:** marketing website → small backends starting with the Field Emailer rebuild →
  full system.
- **Domains & surface map:** marketing site at **pgautoinstalls.com**; field app at
  **app.pgautoinstalls.com**; the other surfaces on their own subdomains — **tech.** / **admin.** /
  **portal.**pgautoinstalls.com (client portal). (Exact subdomain names to confirm with John;
  surfaces are separate, not merged.)

### Field Reporting App ("Field Emailer → godzilla") — decision: CLEAN REBUILD
- Rebuild on the new stack; **keep the existing PWA running in production until the new one is proven.**
- Becomes: offline-first React+MUI PWA → Workers API (TS/Hono CRUD + Rust for heavy) → Neon Postgres;
  photos → R2; **real synced proof-of-send** (replaces `mailto:`, which can't confirm a send);
  multi-tenant (replaces the hardcoded single client/recipient); tech-authenticated.
- Its data model is the **seed of the canonical install-event schema** for the whole platform: the
  record a tech logs in the field = what admin QA reads, what clients see, what the live panel streams.
- **Keep (proven):** offline-first PWA shell, fast single-tap flows, chassis-inventory domain logic
  (pass/fail, flash count, HW/loaded), clean reproducible deploy, correct CSV escaping.
- **Fix (from audit):** real dated timestamps; per-day/per-jobsite stats (not all-time); multi-client;
  real delivery status; generalize "chassis" → **units with a `vehicle_type`** (light-duty: car / van
  / pickup; heavy-duty: dump / refuse / crane / equipment; rail chassis; extensible) +
  **`install_records` per device**. Rail-chassis fields (`flash_count`, `hardwire`, `loaded`) survive
  as **type-specific attributes** on the unit, not core columns — add other types' fields the same way
  as they come up. (XSS / path-traversal / no-tests are eliminated by React+Workers + the test-first rail.)
- **Cut the cord:** the current app emails `norfolksouthern@safetynetinstalls.com`. The rebuild reports
  to **PG's own backend**, not Safety Net's.
- **Existing assets:** repo `git@github.com:atlansdaddy/emailassist.git`; domain `emailer.dasgas.com`.

### Design direction (governs Command 4)
- **Bright and clean. No dark mode.**
- Business-color gradient backgrounds drawn from the Brand Kit palette (PG Sky → white, PG Blue
  tints). Orange reserved for CTAs/accents per 60-30-10.
- **Scrolling copy that enters from alternating sides** — left-to-right on one side, right-to-left on
  the opposing side, down the page.
- **Banners (marquee strips) are wanted but currently feel "off."** Command 4 must diagnose why
  (spacing/weight/rhythm) and fix — **not remove them**.
- **Mobile-first, mandatory.** Touch controls; tappable hotspots; no hover-only reveals.
- **Anti-slop rules are governing constraints** (per the AI Slop Diagnostic Catalog): no
  centered-everything, no generic three-card grids, no vague "trusted by" logo bars, no
  Inter-only/default fonts, no purple→blue gradients, no fabricated stats. Use editorial labels, side
  reveals, real photography. "Prove, don't claim" = the defensible-claims rule above.
- **Signature interactive moment:** a real-vehicle 3D explorer with install-point hotspots, upgrading
  toward Gaussian splats built from PG's own install captures (real jobs, not stock).
- **Brand Kit voice only** — no invented taglines or claims.

### Equipment / product facts (reference)
- Equipment PG installs and may name/show as **"systems we work with"** (no affiliation implied):
  **Motive AI Dashcam Plus** (launched Jan 8, 2026 — all-in-one Vehicle Gateway + AI Dashcam + ELD,
  cuts install time nearly in half), **Netradyne Driveri D-450**, **Samsara CM34** (dual-facing AI cam).
- Show the equipment, housing, mounting, and how it looks installed — via PG's own photos, with no
  client branding visible. John has extensive Motive photos; Netradyne + Samsara photos still needed.
- Manufacturer product images and logos are copyrighted/trademarked. "Attribution" is not a license,
  and PG is not a partner/affiliate yet. Use PG's own photos or (later) official partner brand kits —
  never scraped manufacturer imagery, and never a partnership claim.

---

## Part 2 — Open Questions

**No [BLOCKING] items remain — Phase 1 (marketing site) is cleared to build.**

- **[NON-BLOCKING]** Manufacturer partner/certification status — John is contacting Motive, Samsara,
  and Netradyne to pursue install-vendor/partner approval. If approved, "systems we work with" can
  strengthen and badges may be added later; until then, equipment is shown without any affiliation claim.
- **[NON-BLOCKING]** Confirm the exact subdomain names for the surfaces (app / tech / admin / portal
  under pgautoinstalls.com).
- **[NON-BLOCKING]** Marketing site page/IA list. Proposed default for confirmation in Command 5:
  Home, Services, Work (by job type), Technology (Field Emailer), About, Coverage, Contact/Quote.
- **[NON-BLOCKING]** John to review the exact Eric/Safety Net contract terms and confirm the
  naming/non-solicit boundaries the site must respect.

**Resolved** — marketing proof: no company names anywhere except PG's own direct clients; work shown
by job type + equipment + vehicle class only, photos stripped of client branding. **Resolved** —
claims: no install count; lead with ~30 years of experience. **Resolved earlier:** domain +
subdomains; full-spectrum vehicle types. **Removed:** Safety Net pay-dispute / go-live timing.

---

*Command 0 locked context. Next: Command 1 — SEO/GEO compilation (apply U1 currency gate + U2
definition-of-complete). Extend as decisions lock; never silently fill an open item — bring it to John.*
