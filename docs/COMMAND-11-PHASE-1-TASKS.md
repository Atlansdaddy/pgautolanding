# Command 11 — Task Breakdown · Phase 1: Marketing Website (✅ APPROVED & LOCKED 2026-06-07)

> **STATUS: ✅ APPROVED 2026-06-07 (John). Build in progress.** Decisions D1–D3 resolved (see end). Per Command 11,
> this turns the **approved Phase 1** into a dependency-ordered objective → task → step list an implementer follows
> without deviation or debt. Build strictly in objective/task order, **tests-first per task** (Command 8 SDD rail),
> each task closed against its DoD + U2 cell. Governing specs:
> [BUILD-PLAN.md](./BUILD-PLAN.md) Phase 1 · [COMMAND-0](./COMMAND-0-LOCKED-CONTEXT.md) ·
> [COMMAND-2 Architecture](./COMMAND-2-ARCHITECTURE.md) · [COMMAND-3 Security](./COMMAND-3-SECURITY.md) ·
> [COMMAND-4 Messaging](./COMMAND-4-MESSAGING.md) · [COMMAND-5 Design](./COMMAND-5-DESIGN.md) ·
> [COMMAND-6 API](./COMMAND-6-API.md) · [COMMAND-7 Data](./COMMAND-7-DATA.md) ·
> [COMMAND-8 Tests](./COMMAND-8-TESTS.md) · [COMMAND-9 DevOps](./COMMAND-9-DEVOPS.md) ·
> [COMMAND-10 Adversarial](./COMMAND-10-ADVERSARIAL.md) · [SEO/GEO](./SEO_GEO_GUIDELINES.md) ·
> [LOCAL-SEO-TARGETS](./LOCAL-SEO-TARGETS.md).

---

## U1 — Currency Gate (verified 2026-06-07, not from memory)

Command 11's domain is the *build target itself*. Verified today; nothing contradicts the locked specs — it sharpens them:

1. **Astro 6 is current.** `astro dev`/`astro preview` now run on the real Workers runtime (**workerd**) via the
   Cloudflare Vite plugin, so dev mirrors production. — [Cloudflare: Astro on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) ·
   [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
2. **Static-first needs no adapter.** A site that prerenders every route does **not** need `@astrojs/cloudflare`;
   Astro emits static assets and Workers Static Assets serves them. The adapter is only for on-demand SSR routes.
   → **Decision (refinement, not a change):** the marketing app is **static + islands**; the one dynamic concern
   (quote submission) is a **separate Worker (svc-leads)**, not Astro SSR. — [Astro deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) ·
   [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
3. **i18n:** Astro built-in i18n routing (locales in config + `/[locale]/` + `astro:i18n` helpers) is the 2026
   standard; the **canonical-slug + locale-prefix** pattern reduces hreflang to string-replacement. Message-catalog
   layer candidate: **Paraglide** (leanest bundle) or **Intlayer** (colocated content). Satisfies the locked
   "locale-keyed, extensible" requirement (Command 4 §G, Command 5 §I). — [Astro i18n docs](https://docs.astro.build/en/guides/internationalization/) ·
   [Astro i18n 2026 guide](https://www.maviklabs.com/blog/internationalization-astro-2026/)

> ✅ **RESOLVED (D1, 2026-06-07 — John deferred to recommendation):** **hybrid** — Astro **built-in i18n routing**
> (URLs + hreflang) + **content collections keyed by locale** for page prose (the bulk: service/metro/about copy) +
> **Paraglide** for the small repeated UI-string set (nav, CTA, form labels/errors). Paraglide over Intlayer:
> leanest client bundle (CWV), type-safe keys, and **missing translations fail the build** (= the T1.5 EN↔ES parity
> test). Adding a language later = add a locale; no component rewrites.

---

## Framing — this is "dial in the existing site," not greenfield

A working preview already exists: **`index.html`** (single-file, ~2.2 MB, base64 images, CDN three.js r128, Google
Fonts) + **`build-your-protection.html`** (the three.js risk tool) + real assets (`assets/SP167.pdf`, a real Tacoma
install photo). Command 5 UI-Forensics already classified every pattern **Keep / Tune / Fix**. Phase 1 = migrate that
material into the locked architecture and standards. We **keep its character** (editorial labels, alternating side
reveals, 3D explorer + `#ixlist`, progress bar, reduced-motion), **tune** banners + reveal timing, and **swap**
images/fonts/3D to locked performance standards (Command 5 §A). We do **not** restyle it into a generic template.

### ⚠️ Build-environment note (surfaced at T0.2, 2026-06-07)
Local Node is **22.11.0**; Vite 7 / **Vitest 4** (Command 8 lock) require **Node ≥22.12**. To keep the rail moving
without risking the system Node, the toolchain runs an **interim pin: Vitest 3.2 + Vite 6** (works on 22.11) via a
root `pnpm.overrides` (`vite: ^6.3.0`). **Action for John (non-blocking):** bump Node to current 22 LTS (e.g.
`nvm install 22.20.0 && nvm use 22.20.0`, or winget Node LTS), then drop the override and move `vitest` to `^4` —
a one-line change. Until then we are *behind* the locked Vitest 4 by intent, flagged here.

### Confirmed scope decisions (John, 2026-06-07)
- **Foundations fold into Phase 1** as Objective 0 (one breakdown: empty repo → deployed site).
- **svc-leads included (minimal)** — the "Request a Quote" CTA works on launch (Objective 6).
- **All 12 metro pages day-one** — reactivates Command 4's deferred per-metro research-agent spin; every page must
  clear the anti-doorway bar (SEO/GEO §133). See Objective 4 + the ⚠️ content-dependency note.

---

## Phase 1 objective map (dependency-ordered)

```
O0 Foundations ─┬─> O1 Astro app + design-system foundation ─┬─> O2 Shared components ─┬─> O3 Home page
                │                                            │                         ├─> O4 Interior pages (incl. 12 metros)
                │                                            │                         └─> O5 Interactive islands
                └────────────────────────────────────────────> O6 Lead capture (form + svc-leads) ┐
                                                                                                    └─> O7 Release gate ─> deploy
```
Build strictly in this order; within an objective, tasks are dependency-numbered. **Tests are spec'd before each
task's code** (Command 8 SDD rail). Every task below carries: **Steps · Inputs · Sources · Best practices ·
Dependencies · Definition of Done (DoD) · Command 8 tests**.

---

## OBJECTIVE 0 — Foundations (repo, tokens, pipeline, test harness)

> *Goal:* an empty-but-green monorepo that deploys a trivial Astro page to Cloudflare via pipeline, with the token
> pipeline and full test harness wired. Marketing code cannot ship without this. (BUILD-PLAN Phase 0; Commands 2/8/9.)

### T0.1 — Monorepo scaffold
- **Steps:** init pnpm workspace + Turborepo; create `apps/` · `services/` · `packages/`; root `turbo.json` pipeline
  (`lint`→`typecheck`→`test`→`build`); root tsconfig base; `.editorconfig`; Node/pnpm version pin (`.nvmrc`/`packageManager`).
- **Inputs:** existing repo root (preserve `index.html`/`build-your-protection.html`/`assets/` until migrated).
- **Sources:** Command 2 (monorepo: pnpm+Turborepo, apps/services/packages); pg-build-agent §4.
- **Best practices:** workspace protocol deps; Turborepo `--affected` ready (Command 9); no app code yet.
- **Dependencies:** none (first task).
- **DoD:** `pnpm install` clean; `pnpm turbo run build` green on an empty graph; topology matches Command 2.
- **Command 8 tests:** N/A (infra) — but `turbo run test` must execute and pass with zero tests (harness proven in T0.6).

### T0.2 — Design-token pipeline (`packages/tokens`)
- **Steps:** author DTCG token JSON (primitive→semantic→component) for the 6 brand hexes + tints, semantics, fonts
  (Command 5 §B); wire **Style Dictionary** → two outputs: (1) CSS custom properties (marketing), (2) TS theme object
  (portals, future). Build script in Turbo graph.
- **Inputs:** Command 0 palette/fonts; Command 5 §B/§C/§D (60-30-10, semantic names).
- **Sources:** Command 5 §B (DTCG + Style Dictionary, single source → CSS + MUI); Command 0 brand kit.
- **Best practices:** orange (`#FF6B35`) semantic = `action`, **never** a background/body-text token (contrast, SEO/GEO §84);
  three-tier naming; no hardcoded hex downstream.
- **Dependencies:** T0.1.
- **DoD:** `packages/tokens` builds CSS vars + TS theme from one JSON source; brand hexes exact; consumed by T1.3.
- **Command 8 tests:** unit (Vitest) asserting generated CSS vars contain exact brand hexes + required semantic names; snapshot of token output.

### T0.3 — CI skeleton (green, empty)
- **Steps:** GitHub Actions: install→`turbo run lint typecheck test build --affected`; ESLint flat + Prettier +
  Spectral (lint configs); patch-coverage reporter wired (no threshold failures yet); required-check on `main`.
- **Inputs:** Command 9 CI design.
- **Sources:** Command 9 (ESLint flat+Prettier+Spectral; Turborepo `--affected`; lint→typecheck→test→security-scan→build).
- **Best practices:** fail-fast; cache pnpm + Turbo; security-scan stage stubbed (Preflight/Trivy/Semgrep/Gitleaks wired in T0.6).
- **Dependencies:** T0.1.
- **DoD:** PR opens → all required checks run and pass on the empty graph; branch protection enforces them.
- **Command 8 tests:** the CI *is* the rail; verified by a throwaway PR going green.

### T0.4 — CD pipeline skeleton → Cloudflare Workers Static Assets
- **Steps:** `wrangler.toml` for `apps/marketing` (Static Assets, `assets.directory = dist`); scoped Cloudflare API
  token in GH secrets; CD: `wrangler versions upload` → per-PR **preview URL** → gradual `@10→@50→@100` → rollback
  path; **staging** environment reserved for the Command 10 gate.
- **Inputs:** existing root `wrangler.toml` + `_headers`; Command 9 CD design; Command 2 (Workers Static Assets, NOT Pages).
- **Sources:** Command 9 (Wrangler versions, gradual deploy+rollback, scoped token, OIDC deferred); U1 source #2 (static→no adapter).
- **Best practices:** no hand deploys ever; preview-per-PR; production deploy gated behind T7.3 adversarial approval (GitHub env protection).
- **Dependencies:** T0.1.
- **DoD:** a trivial Astro "hello" page deploys to a preview URL via pipeline only; rollback verified once.
- **Command 8 tests:** smoke e2e (Playwright) hits the preview URL and asserts 200 + expected marker.

### T0.5 — Secrets & env convention
- **Steps:** document + enforce no-secrets-in-repo; Wrangler secrets bindings; `.dev.vars` gitignored; env var naming
  convention; secret list for svc-leads reserved (notify creds, rate-limit store).
- **Inputs:** Command 3 (secrets: Wrangler→Secrets-Store-at-GA).
- **Sources:** Command 3 §secrets; Command 9.
- **Best practices:** least privilege; Gitleaks in CI (T0.3 security stage) blocks committed secrets.
- **Dependencies:** T0.3, T0.4.
- **DoD:** Gitleaks green; documented convention in repo; no secret material tracked.
- **Command 8 tests:** Gitleaks scan (CI) on a seeded-then-reverted fake secret proves the gate fires.

### T0.6 — Test harness wiring (the rail)
- **Steps:** Vitest 4 + `@cloudflare/vitest-pool-workers` (real bindings) config; Playwright (multi-viewport, mobile);
  axe-core integration; Lighthouse CI with **CWV budgets** (Command 8); OpenAPI+AJV contract-test scaffold (for
  svc-leads, Objective 6); patch/differential coverage gate; **security stack** (Preflight [[preflight-tool]] +
  Trivy/Semgrep CE/Gitleaks/OWASP ZAP/Checkov) wired into CI security-scan stage.
- **Inputs:** Command 8 full test strategy.
- **Sources:** Command 8 (Vitest4+workers-pool, Playwright, axe+Lighthouse, AJV contract, patch-coverage, Preflight+OSS set).
- **Best practices:** SDD — harness exists before feature code; one trivial passing test per runner proves wiring.
- **Dependencies:** T0.1, T0.3.
- **DoD:** every runner executes green with ≥1 trivial test; Lighthouse CI posts a report; patch-coverage gate active; security stack runs in CI.
- **Command 8 tests:** this task *is* the test infrastructure; self-verifying (each runner green).

**O0 exit gate:** trivial Astro page live on a preview URL via pipeline; tokens build; all CI/CD/test/security stages green.

---

## OBJECTIVE 1 — Astro app + design-system foundation

### T1.1 — Astro 6 app scaffold (`apps/marketing`, static + islands)
- **Steps:** create Astro 6 app; static output (no adapter, U1 #2); React + three.js island integration (`client:visible`);
  configure i18n routing (`en` default + `es`, canonical-slug + locale-prefix); base project structure (layouts/components/content).
- **Sources:** Command 2 (Astro+islands); U1 #1/#2/#3; Command 5 §A/§F.
- **Best practices:** ship minimal JS; islands only where interactive; prerender everything.
- **Dependencies:** O0.
- **DoD:** `astro build` emits static `dist/`; deploys via T0.4 pipeline; islands hydrate lazily; `/` and `/es/` route.
- **Command 8 tests:** Playwright smoke (both locales load 200); build-output assertion (no SSR Worker emitted).

### T1.2 — Self-host fonts
- **Steps:** self-host Montserrat (600/700/800) + Open Sans (400/600) WOFF2; `font-display: swap`; preload primary
  weights; remove Google Fonts CDN.
- **Sources:** Command 5 §A/§C; SEO/GEO §70.
- **Best practices:** subset to used glyphs (+ ES accents); no layout shift.
- **Dependencies:** T1.1.
- **DoD:** no third-party font requests; fonts render; CLS = 0 from font swap.
- **Command 8 tests:** Lighthouse CI (no render-blocking external fonts; CLS budget); Playwright network assertion (no fonts.googleapis.com).

### T1.3 — Global styles from tokens (CSS custom properties)
- **Steps:** import `packages/tokens` CSS vars; global stylesheet; fluid `clamp()` type scale (Command 5 §C);
  60-30-10 application; light gradient utilities (CSS only, Command 5 §D).
- **Sources:** Command 5 §B/§C/§D; T0.2.
- **Best practices:** no hardcoded hex; gradient contrast tested at worst luminance point; no dark mode.
- **Dependencies:** T0.2, T1.1.
- **DoD:** all color/type/space references resolve to tokens; gradients pass contrast.
- **Command 8 tests:** axe-core (contrast incl. over gradients); visual snapshot of type scale.

### T1.4 — Base layout + SEO/GEO head
- **Steps:** base `Layout.astro`: `<html lang>`, meta, canonical, **hreflang per locale**, Open Graph, JSON-LD
  scaffolding (LocalBusiness/Organization + breadcrumb), robots policy (allow AI-search bots / block training bots),
  reduced-motion baseline CSS.
- **Sources:** Command 4 §G; SEO/GEO §1/§11/§43; Command 1 decisions (AI-bot policy); U1 #3 (hreflang).
- **Best practices:** answer-first content structure (GEO); no thin meta; structured data validates.
- **Dependencies:** T1.1.
- **DoD:** every page inherits correct lang/canonical/hreflang/JSON-LD; robots policy applied.
- **Command 8 tests:** schema validator (JSON-LD valid); hreflang validator (reciprocal en↔es); Playwright head assertions.

### T1.5 — i18n framework (EN + ES, extensible)
- **Steps:** stand up the **hybrid i18n stack (D1):** Astro built-in i18n routing + content collections keyed by
  locale (page prose) + **Paraglide** (UI strings); locale-keyed content model (no hardcoded EN/ES); EN source strings;
  professional ES translations slot in per page as content is built; `astro:i18n` URL helpers; **language switcher**
  (labeled in each language's own name, no flag icons); ~20–30% text-expansion tolerance in components.
- **Sources:** Command 4 §G; Command 5 §I; U1 #3.
- **Best practices:** content keyed by locale so more languages drop in without rework; ES is professionally reviewed, not raw MT.
- **Dependencies:** D1 resolved; T1.1, T1.4.
- **DoD:** any string renders correctly in en + es; switcher preserves page; adding a locale needs no component rewrite.
- **Command 8 tests:** unit (missing-key detection EN↔ES parity); Playwright (switcher round-trip; expanded text doesn't overflow/clip).

**O1 exit gate:** static Astro app on monorepo, self-hosted fonts, tokenized styles, correct i18n + SEO head — empty of content but standards-complete.

---

## OBJECTIVE 2 — Shared components (Command 5 §F inventory)

> Each migrates a **Keep** pattern from the existing `index.html` into a reusable Astro component, applying Command 5
> Tune/Fix. Build before pages consume them.

### T2.1 — Nav + scroll progress bar
- **Steps:** sticky nav (brand · Services · Work · Coverage · Build Your Protection · **phone tap-to-call** · **Request a Quote** CTA · language switcher); `#prog` scroll progress bar; mobile menu (real tap targets ≥24px / 44px touch).
- **Sources:** Command 4 §C/§F (nav order, CTAs, phone); Command 5 §A (Keep prog bar) §F; SEO/GEO a11y.
- **Best practices:** keyboard nav; visible focus; phone is a real `tel:` link. ⏳ **phone number pending from John** (placeholder until provided — non-blocking).
- **Dependencies:** O1.
- **DoD:** nav renders both locales; CTA + phone present; progress bar tracks scroll; a11y passes.
- **Command 8 tests:** axe-core; Playwright (sticky behavior, mobile menu, switcher, focus order).

### T2.2 — Section block + eyebrow label + alternating side reveal
- **Steps:** `SectionBlock` + `EyebrowLabel` (orange accent); **alternating side-reveal** via IntersectionObserver +
  CSS class toggle, animating **only transform/opacity**; tuned subtler distance/duration; **never animate LCP hero**;
  full reduced-motion instant-visibility.
- **Sources:** Command 5 §A (Keep, tune timing) §E (motion spec); Command 0 design law.
- **Best practices:** compositor-only props (no jank); reserve layout space (no CLS); `animation-timeline: view()` as progressive enhancement.
- **Dependencies:** O1.
- **DoD:** copy enters L→R then R→L down the page; reduced-motion shows content instantly; no CLS.
- **Command 8 tests:** Playwright (reveal triggers on scroll; reduced-motion path shows content); Lighthouse CLS budget.

### T2.3 — Banner/marquee strip (the FIX)
- **Steps:** marquee component with the Command 5 §E fix: slow calm speed · generous even gaps · lighter weight ·
  lower density · pause on hover **and** focus · real pause `<button>` (**WCAG 2.2.2**) · full halt on reduced-motion ·
  duplicated content `aria-hidden` for seamless loop. Content = §E defensible set (strip 1 service lines; strip 2
  platforms+coverage, no superlatives/partnership claims).
- **Sources:** Command 5 §E (banner fix + content); Command 0 (keep banners); SEO/GEO a11y (2.2.2).
- **Best practices:** quiet supporting strip, not focal; all content Proven/Customer-verifiable.
- **Dependencies:** O1.
- **DoD:** banners feel calm; pause control works; halts on reduced-motion; content defensible.
- **Command 8 tests:** axe-core; Playwright (pause button stops animation; reduced-motion = no motion); copy-lint (no banned superlatives, T_content).

### T2.4 — CTA components + sticky CTA/phone
- **Steps:** primary "Request a Quote" CTA (dominant), secondary "Build Your Protection" + "See an Install"; sticky
  CTA/phone bar on long scroll.
- **Sources:** Command 4 §C/§H; Command 5 §F/§G.
- **Best practices:** one dominant CTA per view; sticky bar non-intrusive, dismissible-respecting.
- **Dependencies:** O1.
- **DoD:** CTAs route correctly (quote → form; tool → BYP; install → explorer/gallery); sticky appears on scroll.
- **Command 8 tests:** Playwright (CTA routing, sticky appearance); axe-core.

### T2.5 — Footer
- **Steps:** footer (nav repeat, coverage corridor, contact, phone, language switcher, legal); NAP consistency for local SEO.
- **Sources:** Command 4 §F; SEO/GEO §7 (NAP consistency).
- **Best practices:** consistent NAP across site ↔ GBP; no fabricated content.
- **Dependencies:** O1.
- **DoD:** footer on every page, both locales; NAP consistent.
- **Command 8 tests:** Playwright (presence/links); schema (NAP matches LocalBusiness JSON-LD).

### T2.6 — Responsive image pipeline / `<Picture>` component
- **Steps:** image component: AVIF/WebP `srcset`, lazy below-fold, **eager + `fetchpriority="high"`** on LCP poster;
  migrate images off base64 → `apps/marketing/assets` → **R2** for heavy install photos (no-egress); strip client
  branding/plates (anonymized proof per Command 4 §B).
- **Sources:** Command 5 §A (image swap) §F; SEO/GEO §26/§64-67; Command 2 (R2, no egress).
- **Best practices:** responsive sizes; dimensions set (no CLS); only real, marked-real media; no manufacturer marketing imagery.
- **Dependencies:** O1.
- **DoD:** no base64; LCP image optimized + prioritized; gallery images lazy + responsive; served from R2 where heavy.
- **Command 8 tests:** Lighthouse (LCP budget, modern formats, no oversized images); Playwright (lazy-load below fold).

**O2 exit gate:** the full Command 5 §F marketing component inventory exists, standards-complete, a11y-clean, ready to compose into pages.

---

## OBJECTIVE 3 — Home page

### T3.1 — Home page assembly (migrate from existing `index.html`)
- **Steps:** compose Command 4 §H section order: **(1)** hero (value-prop headline + audience + Request a Quote +
  ~30-yrs proof indicator) → **(2)** services summary (3 cards → service pages) → **(3)** proof (30 yrs · real photos ·
  job-type breadth · platform-agnostic) → **(4)** how-it-works (install process, de-risk) → **(5)** trust (guarantee,
  multi-platform honesty, coverage corridor) → **(6)** Build Your Protection entry → **(7)** repeat Request a Quote +
  sticky CTA/phone. Use approved taglines only (Command 4 §A). Full EN + ES.
- **Inputs:** existing `index.html` content (migrate, don't reinvent); Command 4 §A/§B/§H copy direction.
- **Sources:** Command 4 §A/§B/§H/§I; Command 5 §G; Command 0 claims taxonomy.
- **Best practices:** every claim taxonomy-tagged (only Proven/Customer-verifiable as fact); anti-slop copy rules (Command 4 §I); LCP hero not animated.
- **Dependencies:** O2.
- **DoD:** home renders both locales in the approved order; all claims tagged + defensible; CWV budgets met; ≥30-yr line corrected ("~30 years of installation experience," not "installing fleet technology").
- **Command 8 tests:** Playwright e2e (critical path: land → CTA → form; both locales); axe-core; Lighthouse CWV; copy-lint (banned-phrase + untagged-claim check).

**O3 exit gate:** home page complete, on-brand, defensible, performant, accessible, bilingual.

---

## OBJECTIVE 4 — Interior pages (the IA)

> Command 4 §F IA. Each page substantive (no thin/doorway content). Build the templates once, then fill.

### T4.1 — Services pillar + 3 service pages
- **Steps:** Services pillar page + **GPS Tracker Installation** · **AI Dash Cam Installation** · **ELD Installation
  & Compliance** (each a substantive standalone page — #1 local-organic factor). Name verified products where relevant
  (Motive AI Dashcam Plus, Netradyne Driveri D-450, Samsara CM34, no partnership claim). EN + ES.
- **Sources:** Command 4 §F; SEO/GEO §136 (service page = top local factor); Command 0 (verified product names).
- **Best practices:** answer-first GEO structure; service schema; defensible claims; real install detail.
- **Dependencies:** O2.
- **DoD:** 4 substantive pages (1 pillar + 3) both locales; product names exact; schema valid.
- **Command 8 tests:** schema validator; Playwright (nav + content present); copy-lint; axe-core.

### T4.2 — Work (job-type gallery)
- **Steps:** Work page organized by **job type** (delivery/logistics · facility-services · railyard/OTR chassis ·
  pest-control · construction-supply · moving · refuse) — anonymized real photos, **no company names**. EN + ES.
- **Sources:** Command 4 §B/§E/§F; Command 0 (job-type only, no client names).
- **Best practices:** real anonymized media only (T2.6 pipeline); breadth as capability proof.
- **Dependencies:** T2.6.
- **DoD:** Work page both locales; all media real + anonymized; no company names.
- **Command 8 tests:** Playwright; axe-core; manual media-provenance check recorded in task object.

### T4.3 — Coverage hub + **12 metro pages** ⚠️
- **Steps:** Coverage corridor hub (NYC→Tampa map/overview) + **12 substantive per-metro pages** (NYC, Harrisburg,
  Pittsburgh, DC-DMV, Baltimore, Richmond, Charlotte, Raleigh, Charleston, Jacksonville, Orlando, Tampa) × EN/ES.
- **⚠️ Content dependency — reactivates Command 4 / LOCAL-SEO-TARGETS per-metro research-agent spin:** before each
  metro page is written, run one research agent per (metro [× service where relevant], EN+ES) returning local fleet/
  industry density + buyer profile, local competitors+gaps, local search terms/intent, which real PG proof assets map
  to that market, local citations/directories, and GBP fit (LOCAL-SEO-TARGETS §📌). Each output is a task object that
  must clear the **anti-doorway bar** (SEO/GEO §133) + U2.
- ✅ **RESOLVED (D2, 2026-06-07):** **John supplies real PG regional photos later** — not a Phase-1 blocker. Metro
  pages ship day-one on **substantive unique text** (regional fleet profile + local context from the research agents);
  build the content + leave **marked image slots** to fill when John provides real, anonymized regional photos. Agents
  gather public signals only; **never invent local PG facts** (which real jobs map to a metro waits for John).
- **Sources:** Command 4 §E/§F; LOCAL-SEO-TARGETS (12 metros, anti-doorway, research-agent spin); SEO/GEO §7/§133.
- **Best practices:** consistent geo story (GBP service areas ↔ site pages ↔ copy); each page genuinely unique regional content; no swap-the-city-name templates.
- **Dependencies:** T2.6, T4.1. (D2 resolved — images deferred; not a blocker.)
- **DoD:** hub + 12 metros × EN/ES, each clearing anti-doorway bar (unique substantive regional **text**), schema valid, sources cited per page; **image slots marked** for John's later regional photos (no placeholder/stock filler).
- **Command 8 tests:** doorway/duplicate-content check (page-similarity threshold); schema validator; hreflang validator; axe-core; copy-lint per page.

### T4.4 — About
- **Steps:** founders (Phil Griffin + John Viruet), **~30 yrs**, platform-agnostic philosophy, partner-channel angle (peer-to-peer, operational facts). EN + ES.
- **Sources:** Command 4 §D/§E/§F; Command 0; memory.
- **Best practices:** defensible bio claims; no fabricated credentials; partner-channel angle factual.
- **Dependencies:** O2.
- **DoD:** About page both locales; claims tagged + defensible.
- **Command 8 tests:** Playwright; copy-lint; axe-core.

### T4.5 — Technology / Field Reporting
- **Steps:** page on the proprietary Field Reporting tool (differentiator; signals tech sophistication) — described
  honestly as in-production proprietary tooling. EN + ES.
- **Sources:** Command 4 §B(6)/§F; Command 0.
- **Best practices:** Proven-tier framing; no overclaiming features not yet built.
- **Dependencies:** O2.
- **DoD:** page both locales; claims defensible.
- **Command 8 tests:** Playwright; copy-lint; axe-core.

### T4.6 — Contact / Request a Quote page
- **Steps:** dedicated quote page hosting the progressive quote form (Objective 6) + phone + coverage; EN + ES.
- **Sources:** Command 4 §C/§F.
- **Best practices:** form is the focal action; phone alternative present.
- **Dependencies:** O2; consumes O6 form component.
- **DoD:** page both locales; form embedded + functional (post-O6); phone present.
- **Command 8 tests:** Playwright e2e (submit happy path + validation); axe-core.

**O4 exit gate:** full IA live both locales; every page substantive + defensible; metros clear anti-doorway bar.

---

## OBJECTIVE 5 — Interactive islands

### T5.1 — 3D vehicle explorer island
- **Steps:** migrate the explorer to a bundled, **lazy `client:visible`** three.js island; **static poster = LCP**
  (never block on 3D); `touch-action:none`; tappable hotspots + **`#ixlist` DOM/text alternative** (already present —
  keep); hotspots name **verified products** (Motive AI Dashcam Plus, Netradyne D-450, Samsara CM34 + Vehicle Gateway);
  reduced-motion safe.
- **Sources:** Command 5 §A/§E/§F/§J; SEO/GEO §76; Command 0 (no gaussian splats / no GPU); BUILD-PLAN 1C.
- **Best practices:** bundle (not CDN r128); lazy-load; keyboard/AT path via `#ixlist`; mobile inline detail (no hover-only).
- **Dependencies:** O2.
- **DoD:** explorer loads lazily, poster is LCP, hotspots correct, `#ixlist` works, mobile + reduced-motion verified.
- **Command 8 tests:** Playwright (lazy hydration, hotspot tap → inline detail, `#ixlist` parity, mobile viewport); Lighthouse (3D not in LCP path); axe-core.

### T5.2 — "Build Your Protection" tool — bring to locked standards
- **Steps:** integrate `build-your-protection.html` as an Astro page/island; **Fix integration debt** (Command 5 §A,
  BUILD-PLAN Phase 1 note): self-host fonts, lazy-load three.js (bundled, not cdnjs r128), EN/ES, claims-taxonomy on
  all copy, WCAG 2.2 AA; link from nav + hero.
- **Sources:** Command 5 §A; BUILD-PLAN Phase 1 "queued site assets / integration debt"; SEO/GEO §70/§76.
- **Best practices:** same island/perf standards as T5.1; no CDN deps; reduced-motion.
- **Dependencies:** O2, T5.1 (shared 3D approach).
- **DoD:** tool runs to locked standards, bilingual, accessible, no third-party CDN, linked from nav+hero.
- **Command 8 tests:** Playwright (tool flow both locales); Lighthouse; axe-core; network assertion (no cdnjs/Google Fonts).

**O5 exit gate:** both signature interactive moments meet locked perf + a11y + i18n standards.

---

## OBJECTIVE 6 — Lead capture (progressive quote form + minimal svc-leads)

### T6.1 — Progressive quote form component
- **Steps:** form with **minimal required** fields (name · company · contact · brief message) + **optional** qualifiers
  (fleet size · vehicle types · platform Motive/Samsara/Netradyne) that **don't gate submission**; inline validation;
  EN/ES; reveal/step for optional fields; client + server (Zod) schema shared.
- **Sources:** Command 4 §C (progressive form decision); Command 5 §F; Command 6 (svc-leads contract).
- **Best practices:** low-friction; accessible labels + `helperText` errors (Command 5 §J); honeypot/anti-spam (server-side, T6.2).
- **Dependencies:** O2; shares schema with T6.2.
- **DoD:** form validates inline, submits required-only, accepts optional; both locales; a11y clean.
- **Command 8 tests:** Playwright (required-only submit; optional submit; validation errors); axe-core; unit (Zod schema).

### T6.2 — Minimal svc-leads Worker (the only public-write surface)
- **Steps:** Hono Worker `services/svc-leads`: `POST /v1/leads` per Command 6 contract — Zod validation, **rate
  limiting**, **Idempotency-Key**, **RFC 9457** Problem Details errors, structured logging (traceId, no PII leakage),
  spam mitigation. **Persist behind a `LeadStore` interface (D3): interim impl = R2** (one durable JSON object per
  lead, server-side, no-egress) — **NOT browser localStorage** (client-side, can't hold a submitted lead; hard-rule
  violation). **Plus email-notify PG on every submit** (real proof-of-send — **never mailto** from the client; the
  Worker sends server-side) so no lead is lost pre-DB and PG actions it immediately. OpenAPI documented. **Swap path:**
  the `LeadStore` interface lets us replace R2→Neon later as a one-adapter change, with a backfill (R2 objects → leads
  table) when the DB phase lands.
- **Sources:** Command 6 (svc-leads = public lead-capture, only public-write; camelCase; /v1/; RFC 9457; Idempotency-Key);
  Command 3 (validation, rate limits, secrets, RLS direction); Command 7 (clean migration, constraints, real timestamps);
  Command 9 (structured logs, onError→RFC 9457).
- **Best practices:** least privilege; input validation + output encoding; no secrets in code; idempotent (powers retry);
  no empty catches; clean first migration (keys/constraints/indexes/timestamptz).
- **Dependencies:** O0 (T0.4/T0.5/T0.6); shares Zod schema with T6.1.
- ✅ **RESOLVED (D3, 2026-06-07):** **no Neon/Hyperdrive in Phase 1.** Interim store = **R2** behind a `LeadStore`
  interface + **server-side email notification** to PG on every lead; DB swap deferred to its own phase with a backfill
  path. ⏳ *Still needs from John (non-blocking until T6.2 build):* the **recipient + email-sending provider** (e.g.
  which address leads go to, and the transactional-email service/API key for the Worker to send through).
- **DoD:** endpoint validates, rate-limits, is idempotent, returns RFC 9457 on error, logs structurally, **writes the
  lead to R2 + emails PG with proof-of-send**; `LeadStore` interface in place (R2 impl); OpenAPI doc published.
- **Command 8 tests:** OpenAPI+AJV contract test; `@cloudflare/vitest-pool-workers` integration (real bindings:
  happy path → R2 object written + notify called, validation 422, rate-limit 429, idempotent replay = no duplicate R2
  object); security tests (injection, oversized payload); logging assertion (no PII); `LeadStore` interface unit test
  (proves R2 impl is swappable).

**O6 exit gate:** Request-a-Quote works end-to-end (form → svc-leads → stored + delivered with proof), tested + documented.

---

## OBJECTIVE 7 — Phase 1 release gate (BUILD-PLAN 1D)

### T7.1 — Full test suite green
- **Steps:** all Objective tests green; **patch-coverage gate** met; e2e critical paths (both locales); axe across all
  pages; Lighthouse CWV budgets across key templates; svc-leads contract + integration green.
- **Sources:** Command 8 (full rail, patch-coverage); BUILD-PLAN 1D.
- **DoD:** CI fully green incl. coverage + security stack.
- **Command 8 tests:** the entire suite (self).

### T7.2 — SEO/GEO + a11y validation pass
- **Steps:** crawl/index check; schema validation site-wide; hreflang reciprocity; doorway/duplicate-content check on
  the 12 metros; robots policy verified; CWV field-ready.
- **Sources:** SEO/GEO (full); Command 4 §G; Command 10 SEO lens.
- **DoD:** no crawl/index/markup regressions; metros pass anti-doorway; hreflang reciprocal.
- **Command 8 tests:** schema + hreflang + doorway validators (CI); Lighthouse SEO.

### T7.3 — Adversarial hardening gate (Command 10) on staging
- **Steps:** deploy to **staging**; run the 5-lens gate (security · functionality · SEO · sales/conversion · trust)
  with context-free randomized-goal agents (containerized, staging-only, scoped creds, domain-allowlisted) + ZAP active
  scan + Lighthouse CI + schema/hreflang validators; **zero-tolerance critical/high blocks deploy**; every confirmed
  finding → permanent Playwright test (grows the rail).
- **Sources:** Command 10 (full); Command 9 (GitHub env-protection manual approval before `wrangler versions deploy`).
- **DoD:** clean pass (no critical/high); findings triaged; new regression tests added; gate approves the deploy.
- **Command 8 tests:** the gate itself; confirmed findings become Playwright tests.

### T7.4 — Production deploy via pipeline
- **Steps:** on gate approval, `wrangler versions deploy` gradual `@10→@50→@100` to Workers Static Assets; verify
  rollback; smoke e2e on production; **no hand deploys**.
- **Sources:** Command 9 (gradual deploy + rollback); Command 2 (Workers Static Assets); BUILD-PLAN 1D.
- **DoD:** marketing site live in production via pipeline; rollback verified; production smoke green.
- **Command 8 tests:** production smoke e2e (Playwright); post-deploy CWV check.

**O7 exit gate = Phase 1 complete:** site live, all U2 cells (below) verified, adversarial gate passed, deployed only via pipeline.

---

## U2 — Definition of Complete (Phase 1 matrix)

Phase 1 is **done** only when every applicable cell is **verified (not asserted)** and linked to its test above.
Levels: **L1 Surface = marketing site · L2 Service = svc-leads · L3 Component = the §F inventory.**

| Aspect | L1 Marketing surface | L2 svc-leads | L3 Components |
|---|---|---|---|
| **Functionality** | All IA pages + islands + form work, both locales (T3–T6) | `POST /v1/leads` happy/error/idempotent (T6.2) | each component behaves per spec (O2 tests) |
| **Security** | no client secrets; CSP/headers; no XSS in copy (T7.3) | validation, rate-limit, idempotency, RFC 9457, ZAP clean (T6.2/T7.3) | form anti-spam (T6.1/6.2) |
| **Performance** | Lighthouse CWV budgets met; LCP poster; lazy 3D (T1.2/T2.6/T5/T7.1) | p95 latency budget (T6.2) | no CLS from reveals/fonts/images |
| **Accessibility** | WCAG 2.2 AA site-wide, axe clean (all O tests) | n/a (API) | targets, focus, reduced-motion, `#ixlist` (O2/O5) |
| **SEO/GEO** | schema + hreflang + robots + anti-doorway metros (T1.4/T4.3/T7.2) | n/a | n/a |
| **Data integrity** | n/a | clean migration, constraints, timestamptz, tenant scoping (T6.2) | n/a |
| **API contract+docs** | n/a | OpenAPI published, AJV-conformant (T6.2) | shared Zod schema (T6.1/6.2) |
| **Test coverage** | patch-coverage gate; e2e critical paths (T7.1) | contract + integration (T6.2) | per-component tests (O2) |
| **Logging+errors** | no swallowed errors in islands | structured logs, onError→RFC 9457, no PII (T6.2) | n/a |
| **DRY** | tokens single-source; i18n locale-keyed; shared schema | shared Zod + OpenAPI types | one component per pattern, no copy-paste |

---

## Decisions — ✅ RESOLVED 2026-06-07 (John)

- ✅ **D1 — i18n:** hybrid — Astro built-in i18n routing + content collections (prose) + **Paraglide** (UI strings).
- ✅ **D2 — per-metro proof:** metro pages ship on substantive unique **text** day-one; **John supplies real regional
  photos later** (marked image slots; agents never invent local PG facts). Not a blocker.
- ✅ **D3 — lead storage:** **no Neon in Phase 1** — interim **R2 + server-side email notification** behind a swappable
  `LeadStore` interface; DB + backfill deferred to its own phase.

### Still pending from John (non-blocking until their task)
- ⏳ **Header phone number** — real PG tap-to-call (placeholder until provided, T2.1).
- ⏳ **Lead recipient + email provider** — address leads go to + transactional-email service/API key (needed at T6.2).
- ⏳ **Regional photos** — real, anonymized per-metro install photos (needed to fill T4.3 image slots, post-launch ok).

---

*Command 11 proposal for Phase 1. No implementation until approved. On approval: build strictly in objective/task
order, tests-first per task (Command 8 SDD rail), each task closed against its DoD + U2 cell. Resolve D1–D3 as their
tasks come up.*
