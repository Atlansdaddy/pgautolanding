# Command 5 — Design System & UX (PROPOSAL for review)

> **STATUS: PROPOSAL — NOT APPROVED. No build yet.** Derives everything from the Command 0 brand kit; honors the
> LOCKED SEO/GEO constraints + Command 4 messaging/IA. **U1:** grounded in live June 2026 design-system/motion/
> control-panel research (cited in notes). Opens with the mandatory **UI Forensics** of the existing site.

---

## A. UI FORENSICS — inventory the existing site BEFORE proposing changes

Subject: the current `index.html` landing page (+ `build-your-protection.html`). Classified **Keep / Tune / Fix**,
with intentional-vs-accidental and the reason each exists. **The anti-slop brake: we preserve what's already
working and tune deliberately — no wholesale replacement with template sludge.**

### Intentional & working → KEEP
| Pattern | Why it exists | Verdict |
|---|---|---|
| Sticky nav + scroll **progress bar** (`#prog`) | Orientation on a long scroll page | Keep |
| **Editorial eyebrow labels** (`.lbl`, orange accent) | Distinctive, anti-slop type hierarchy | Keep |
| **Alternating side scroll-reveals** (`.sr` / `.sr.r`) | Command 0 design law (copy enters L→R then R→L) | Keep (tune timing) |
| **3D explorer** (`#explore`: stage, zoom, `#ixlist` hotspot list, `touch-action`) | Signature interactive moment + **mobile list fallback** already present | Keep (lazy-load, §F) |
| **Dual/triple CTA** (Request a Quote · Build Your Protection · See an Install) | Matches Command 4 CTA strategy | Keep |
| **`prefers-reduced-motion` support** (already in CSS) | WCAG 2.2 — a real existing strength | Keep |
| Section-based editorial layout (Services · Work · Equipment · gallery · explore · contact) | Maps to Command 4 IA | Keep |
| Brand-faithful palette + Montserrat/Open Sans | Command 0 brand kit | Keep |

### Intentional but flagged → TUNE
| Pattern | Issue | Fix (per research) |
|---|---|---|
| **Banners / marquee strips** | Command 0: "feel off" | §E diagnosis: slow speed · generous even gaps · lighter weight · lower density · pause on hover/focus · WCAG 2.2.2 control · halt on reduced-motion |
| Scroll-reveal timing | Can feel heavy if every block animates | Tune: subtler distance/duration, don't animate the LCP hero, stagger sparingly |

### Planned swap (intentional, confirmed by John) → v1
| Item | Now | v1 |
|---|---|---|
| **Images** | base64 inline (preview convenience → 2.1MB file) | move to **`assets/` → R2**, responsive `srcset`, **AVIF/WebP**, lazy below-fold, eager + `fetchpriority` on LCP poster (SEO/GEO §26/§64-67) |
| Fonts | Google Fonts CDN | **self-host** WOFF2 (SEO/GEO §70) |
| three.js | cdnjs r128 | bundled + lazy island (SEO/GEO §76) |

### Accidental / incidental → clean up in the Astro rebuild
- Single 2.1MB monolithic HTML (preview), inline `id="abtest"` hook, inline scripts (CSP later) → resolved naturally when rebuilt as Astro components + islands.

**Forensics conclusion:** the existing design is a *strong, on-brand starting point* — we **keep its character** (editorial labels, side reveals, 3D explorer, progress bar, reduced-motion), **tune** the banners + reveal timing, and **swap** images/fonts/3D to the locked performance standards. We do **not** restyle it into a generic SaaS template.

---

## B. Design tokens (one source → all surfaces)

- **Format:** W3C **DTCG tokens** (stable "2025.10"), three-tier: **primitive → semantic → component**. Single JSON
  source → **Style Dictionary** → (1) **CSS custom properties** for the Astro/CSS marketing site, (2) a TS object for
  **MUI `createTheme`** in the portals/field app. Brand parity from the shared token source — **MUI never on the
  marketing site.**
- **Primitives:** the 6 brand hexes + tints. **Semantics:** `brand.primary`=PG Blue `#2D8FCC` · `brand.dark`=Navy
  `#1A1A2E` · `action`=Orange `#FF6B35` · `surface.subtle`=Sky `#E8F4FD` · `surface.default`=White ·
  `text.default`=Charcoal `#333`. **Fonts:** `font.display`=Montserrat, `font.body`=Open Sans.
- **60-30-10:** ~60% neutral (White/Sky) · ~30% Navy/Blue structure · **~10% Orange, CTAs/focal only** — orange
  never in backgrounds/large fills (also why it's barred from body text — fails contrast, SEO/GEO §84).

## C. Typography
- Montserrat (display, 600/700/800) for h1–h3 + eyebrow labels; Open Sans (400/600) body; system fallback.
- Fluid type scale (`clamp()`), real hierarchy (already present), generous line-height for body.

## D. Color & gradients
- **Tasteful light gradients only** (Command 0): soft Sky→White / barely-shifted Blue tints, **CSS gradients**
  (GPU-friendly, no image payload). **No dark mode, no purple→blue AI-slop gradient.**
- **Contrast over gradients:** test text against the **worst luminance point** of the gradient (≥4.5:1 body, ≥3:1
  large); use a scrim/positioning where needed.

## E. Motion spec
- **Alternating side reveals:** **IntersectionObserver + CSS class toggle** (robust cross-browser; Firefox still
  lacks unflagged scroll-driven CSS) animating **only `transform` + `opacity`** (compositor, no jank). CSS
  `animation-timeline: view()` as progressive enhancement where supported.
- **Mandatory `prefers-reduced-motion`:** instant visibility toggle instead of movement (already supported — keep).
- **CWV guard:** never hide the LCP hero behind a reveal; reserve layout space (no CLS).
- **Banner/marquee FIX (the "feels off" diagnosis):** slow calm speed · **generous, even gaps (rhythm)** · lighter/
  restrained weight · **lower density** (fewer items) · pause on hover **and** focus (`animation-play-state`) · a real
  pause `<button>` (WCAG **2.2.2**) · **full halt on reduced-motion** · duplicate content `aria-hidden` for seamless
  loop. Treat banners as quiet supporting strips, not focal elements. **Keep them — don't remove** (Command 0).

## F. Component inventory
- **Marketing (Astro + CSS, React/three.js islands):** nav + progress bar · hero · eyebrow label · section block ·
  service card · work/job-type gallery · equipment row · **install-photo gallery** · **3D explorer island**
  (lazy `client:visible`, static poster = LCP) · **banner strip** · CTA · **progressive quote form** · **language
  switcher** · footer.
- **Portals/field (React + MUI v9):** app shell (Drawer/AppBar — build from base MUI; Toolpad is "not actively
  maintained") · **MUI X Data Grid** (lazy-loaded chunk, virtualization, density selector) · RHF+MUI forms
  (`Controller` + Zod) · offline-state chips · audit-timeline drawer.

## G. Per-surface layout
- **Marketing homepage** — the Command 4 §H section order (hero → services → proof → how-it-works → trust →
  Build Your Protection → repeat CTA + sticky CTA/phone). Editorial, asymmetric-with-hierarchy, real whitespace.
- **Tech portal** — job list, schedule, install logging; **≥44px tap targets** (gloves); offline pending/synced chips;
  single-tap flows.
- **Admin portal** — dispatch board (drag-and-drop calendar/timeline), **QA review via audit-timeline + context
  drawer** (field-level before/after), tenant-scoped views.
- **Field app (PWA)** — large targets, offline-first, optimistic UI (pending→synced), non-blocking on network.

## H. Control-panel / config design (right-sized)
- **Settings:** progressive disclosure, grouped, salient critical info; **toggles take effect immediately** (no
  Save), explicit-save only for batched/risky changes (don't mix); frontloaded labels describing the on-state.
- **Dangerous actions:** prefer **Undo**; type-to-confirm + specific microcopy for irreversible; separate destructive
  from benign (Fitts).
- **Audit/change history:** newest-first **timeline**, who/what/when (store UTC, show local), field-level before/after
  in a drawer, filter + export.
- **Feature flags (lean, not LaunchDarkly-scale):** each flag has an **owner + expiry** (archive when done); projects
  + environments; percentage rollout via consistent hashing; **kill-switch** pattern; change audit. Self-host lean
  (e.g. Flipt/Unleash-OSS-style) — right-sized for a small B2B shop.
- **Role-gated + tenant-scoped:** settings scoped per tenant; roles per tenant; tenant context explicit (ties to
  Command 3 RLS).

## I. i18n design (extensible — Command 4 decision)
- Components tolerate **~20–30% text expansion** (no fixed-width text containers; buttons/tabs grow to label;
  generous padding; no text baked into images). Locale-keyed content; **language switcher** in header labeled in each
  language's own name ("Español"), **no flag icons**; built so **more languages drop in** without rework.

## J. Accessibility (WCAG 2.2 AA — the locked bar)
Contrast incl. **over gradients** · visible focus not obscured · **≥24px targets (44px field)** · keyboard nav
(roving tabindex in grids, `aria-rowcount`/`aria-sort` on virtualized Data Grid) · form labels + `helperText` errors ·
**reduced-motion** on all reveals/banners/3D · 3D canvas has the **`#ixlist` text/DOM alternative** (already present).

## K. Anti-slop / distinctive craft
Editorial/asymmetric layout **with clear hierarchy**, intentional whitespace, real type scale, real photography —
**not** centered-everything, generic card grids, logo bars, or default fonts. Keep PG's existing editorial character.

## L. Decisions for your review
1. **Token tooling:** adopt **DTCG + Style Dictionary** as the single token source feeding both CSS and MUI? *(Recommend yes.)*
2. **App shell:** build portals shell from **base MUI** (Toolpad unmaintained) vs use Toolpad Core anyway? *(Recommend base MUI.)*
3. **Banner content:** what should the marquee strips actually say? (Right now they need real, defensible content — e.g.
   service lines / coverage / "platform-agnostic" — not filler. Tied to claims taxonomy.)
4. **Reveal intensity:** keep the alternating side reveals as-is, or dial them back (subtler)? *(Recommend tune subtler.)*
5. Anything in the **UI Forensics Keep/Tune/Fix** you'd reclassify?

## M. Definition of Complete (U2)
Done when: UI forensics (keep/tune/fix) ✓ · tokens (primitive→semantic→component, one source→CSS+MUI) ✓ · type +
color + gradient specs ✓ · motion spec + **banner fix** ✓ · component inventory ✓ · per-surface layouts + **control-
panel config** ✓ · i18n design ✓ · WCAG 2.2 AA mapped ✓ · all grounded in cited 2026 research ✓ · **§L decisions
resolved (pending)** · John approves (pending). Then → Command 6 (API Contract & Docs).

---

*Command 5 proposal. No build yet. Resolve §L, approve → Command 6.*
