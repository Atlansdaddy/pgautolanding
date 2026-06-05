# Command 4 — Messaging & Content Architecture (PROPOSAL for review)

> **STATUS: PROPOSAL — NOT APPROVED. No code/design yet.** Defines *what the site says and how it's organized*
> so Command 5 (Design) serves the message. **Scope:** messaging + IA now; **per-location research agents
> DEFERRED** (markets just confirmed — see [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md)). **U1:** grounded in
> live June 2026 B2B lead-gen / conversion-copy research (cited in notes). Every claim is tagged to the
> **Command 0 Claims Taxonomy** — only **Proven / Customer-verifiable** ship as fact.

---

## A. Core message (the one thing every page reinforces)

**Positioning (from Command 0):** *For fleet operators who need reliable, expert installs without the runaround —
a hands-on partner with precision work, multi-platform expertise, and dedicated personal service, against
high-volume competitors who treat every fleet as a ticket number.*

**Above-the-fold formula** (research: answer 4 questions in <5s — is this for me? what is it? is it worth it? can
I trust it?): benefit headline + who-it's-for + one primary CTA + a proof indicator beside the CTA.
- **Headline direction (not final copy):** outcome + audience, e.g. *"Fleet telematics, installed right — GPS,
  ELD, and AI cameras across every kind of fleet vehicle."*
- **Approved taglines only** (Command 0 — Marketing-language tier, don't invent new ones): "Connected Fleets.
  Protected Drivers. Guaranteed." · "Precision Installs. Total Visibility." · "Your Fleet. Our Expertise. One
  Call." · "Installed Right. Running Tight."

## B. Proof hierarchy (credibility WITHOUT logos / testimonials / star widgets)

Legal/policy bars us from client names, logos, and on-site review stars (Command 0 + SEO/GEO §43). 2026 research
says those surface signals are fading anyway — **structural/substantive credibility wins.** Order of proof:

1. **~30 years of installation experience** — the headline credibility anchor. *(Proven.)* **NOT** "30 years
   installing fleet *technology*" (mis-scoped → Forbidden; the live-site line gets corrected to this.)
2. **Thousands of real, anonymized install photos** — visual proof, client branding/plates stripped. *(Proven.)*
3. **Job-type breadth** (delivery/logistics · facility-services · Class I railyard & OTR chassis · pest-control ·
   construction-supply · moving · refuse) — capability proof, **no company names.** *(Customer-verifiable.)*
4. **Platform-agnostic** — hands-on with **Motive, Samsara, Netradyne** equipment; honest, unbiased
   recommendations (equipment named, **no partnership claim**). *(Customer-verifiable / Proven.)*
5. **Full vehicle-class range** — light-duty cars/vans/pickups → heavy-duty dump/refuse/cranes → rail chassis.
   *(Customer-verifiable.)*
6. **The Field Reporting tool** (proprietary, in production) — signals tech sophistication (John's AI/systems
   background). *(Proven.)*
7. **Transparent process + documentation** — what an install day looks like; documented, photographed work.

## C. CTA strategy & lead capture

- **Primary CTA (one, dominant, everywhere):** **"Request a Quote."**
- **Secondary (subordinate):** **"Build Your Protection"** — the interactive three.js risk-profile tool
  (`build-your-protection.html`) as a soft, engaging entry; and **"See an Install"** (real photos / 3D explorer).
- **Phone, tap-to-call, in the persistent header** — itself a B2B trust signal (real humans answer).
- **Form:** short for a basic quote (**≤6 fields**); if we qualify up front (fleet size · vehicle types ·
  platform), use a **multi-step** form (research: multi-step + a qualifying step lifts completion *and* lead
  quality for B2B). Inline validation. *(Decision §I.)*

## D. Per-audience messaging (one core message, distinct paths — no dilution)

| Audience | Angle | Where |
|---|---|---|
| **Fleet/ops/safety directors (5–99)** | Precision installs, documentation, uptime, unbiased multi-platform advice | Home, Services, Work |
| **Small fleet owners (5–25)** | Personal service, no 100-vehicle minimum (the gap MOBILE leaves), one call | Home, About, a small-fleet angle |
| **Manufacturer partner-channel managers** | Peer-to-peer, operational facts, install quality, zero marketing fluff | A focused About/Partners section |

## E. Customer-journey content map (non-linear; multi-stakeholder)

- **Awareness** — educational, no selling: "ELD mandate basics," "what AI dash cams actually catch," "GPS for
  fleets." (Resources/blog.)
- **Consideration** — differentiation: install quality, platform-agnostic breadth, 30 years, vehicle range.
  (Services, Work, About.)
- **Decision** — de-risk: the install process, what an install day looks like, coverage, fast quote.
  (Coverage, Contact, a "how it works" section.)

## F. Information architecture (right-sized — ~8 pages + the tool)

```
Home
├─ Services (pillar)
│   ├─ GPS Tracker Installation
│   ├─ AI Dash Cam Installation
│   └─ ELD Installation & Compliance
├─ Work  (by job type — anonymized; real photos)
├─ Coverage  (the 11 metros; corridor map; per-metro pages added incrementally + substantively)
├─ About  (founders, ~30 yrs, platform-agnostic philosophy, partner-channel angle)
├─ Technology / Field Reporting  (the proprietary field tool — differentiator)
├─ Contact / Request a Quote
└─ Build Your Protection  (interactive risk-profile tool — already built)
```
- **Service pages = #1 local-organic factor** (SEO/GEO §136): one substantive page per service line.
- **Coverage:** corridor overview + **per-metro pages built incrementally** (not all 11 day-one), each with real
  regional content (no doorway pages, §133). Geography = the confirmed 11 (NYC→Tampa).
- **Nav:** brand · Services · Work · Coverage · Build Your Protection · **phone** · **Request a Quote** (CTA).

## G. Bilingual EN/ES content plan

- **Full, professionally-reviewed Spanish** for core pages at launch (Home, Services, Contact) — **not raw
  machine translation** (reads as your brand; avoids thin-content). Expand ES coverage over time.
- `/` + `/es/` URLs, **hreflang** (SEO/GEO §11), correct `<html lang>`.
- **Persistent language toggle** in header, labeled **"Español"** (own-language name, **no flag icons**); always
  allow manual switch. Design must allow **~20% text expansion** (Command 5).
- Rationale: bilingual reaches Spanish-speaking fleet owners/operators *and* the field workforce.

## H. Homepage section order (for Command 5 to lay out)

1. Hero — value prop + audience + **Request a Quote** + a proof indicator (30 yrs).
2. Services summary (3 cards/links → service pages).
3. Proof — 30 yrs + real install photos + job-type breadth + platform-agnostic.
4. "How it works" — transparent install process (de-risk).
5. Trust — guarantee, multi-platform honesty, coverage corridor.
6. Interactive — **Build Your Protection** entry.
7. Repeat **Request a Quote** (+ sticky CTA/phone on long scroll).
- **Keep the banners/marquees** (Command 0 design law) — Command 5 fixes their rhythm, doesn't remove them.

## I. Anti-slop copy rules (governing)

Specific over vague: real numbers ("5–99-vehicle fleets," "~30 years," named platforms), confident first-person,
varied sentence rhythm. **Ban:** "world-class / cutting-edge / best-in-class / trusted by," filler openers ("In
today's landscape"), fake urgency, AI-cliché verbs ("boasting/featuring"), vague "studies show." Prove or omit.

## J. Decisions for your review

1. **NC metro:** Charlotte (recommended), Raleigh, or both?
2. **Quote form:** short single-step (≤6 fields) OR multi-step capturing fleet size / vehicle types / platform?
   *(Recommend multi-step — better B2B qualification + lead quality.)*
3. **Header phone number:** what number should be the tap-to-call CTA? (Need a real PG line.)
4. **Spanish at launch:** core pages (Home/Services/Contact) now, expand later — OK? *(Recommend yes.)*
5. **IA page set (§F):** approve the ~8-page structure, or add/remove anything (e.g., a Resources/blog now vs later)?

## K. Definition of Complete (U2)

Done when: core message + value prop ✓ · proof hierarchy (taxonomy-tagged) ✓ · CTA + lead-capture strategy ✓ ·
per-audience messaging ✓ · journey content map ✓ · IA/page set ✓ · EN/ES content plan ✓ · homepage section order
✓ · anti-slop rules ✓ · all grounded in cited 2026 research ✓ · **decisions J1–J5 resolved (pending)** · John
approves (pending). Then → Command 5 (Design System & UX, incl. UI-Forensics + control-panel config).

---

*Command 4 proposal. No design/code yet. Per-location research agents deferred (markets now confirmed). Resolve
§J, approve → Command 5.*
