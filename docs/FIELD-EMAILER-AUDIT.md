# Field Emailer — Comprehensive Audit (legacy app, knowledge source for the Phase 2 rebuild)

> Knowledge source cited by [COMMAND-0-LOCKED-CONTEXT.md](./COMMAND-0-LOCKED-CONTEXT.md) §10 and
> [BUILD-PLAN.md](./BUILD-PLAN.md) Phase 2. Captures the legacy app's behavior + the bugs/limits the
> clean rebuild must resolve. **Existing assets:** repo `git@github.com:atlansdaddy/emailassist.git`;
> domain `emailer.dasgas.com`; runs on the SSH server we deploy from.

A field PWA used by Safety Net installers at Norfolk Southern job sites. Tap a button → `mailto:`
opens with a pre-built subject + body → user hits Send in their mail app → app logs that the email
was queued.

---

## 1. Architecture at a glance

| Layer | Tech | What it does |
|---|---|---|
| Client app | Plain HTML + CSS + vanilla JS in an IIFE | Single-page PWA, 3 screens, 4 modals, all logic in app.js |
| Persistence | localStorage (browser) | Config, day log, chassis entries — no backend |
| Email transport | `mailto:` URLs | Hands off to user's mail client. App never actually sends |
| PWA shell | Service worker + manifest | Cache-first; works offline once installed |
| Static origin | Node server.js on :3000 | 38-line http.createServer, mime-typed file serving |
| Process supervisor | emailer.service (systemd) | Restart=always, burst limit 5/60s, enabled at boot |
| Edge / TLS | Caddy reverse_proxy localhost:3000 | HTTPS for emailer.dasgas.com via Let's Encrypt |
| Repo | git@github.com:atlansdaddy/emailassist.git | In sync after the audit session |

Zero npm dependencies. Zero build step. Source on disk = what the browser sees.

---

## 2. File inventory

| File | Lines | Purpose |
|---|---|---|
| index.html | 343 | All markup: 3 screens, 4 modals, toast slot. Inline SVG icons |
| app.js | 654 | All client logic. Single IIFE. No modules. |
| style.css | 568 | Dark-mode design system (CSS vars), per-screen layouts, per-feature tokens |
| sw.js | 31 | Service worker: precache 6 assets, cache-first fetch, offline 503 fallback |
| manifest.json | 22 | PWA manifest. Lists 3 icons (see issue #1) |
| server.js | 35 | Bare-bones Node static file server |
| emailer.service | 21 | Systemd unit |
| setup.sh | 65 | Idempotent deploy: Caddy block + unit install + restart |
| package.json | 8 | npm start → node server.js. No dependencies. |
| icons/icon.svg | — | Only icon that actually exists (see issue #1) |

---

## 3. Data model (everything is in localStorage)

- **fieldEmailerConfig** — `{name, email, client, jobsite}` — written by saveConfig() on Setup submit;
  read everywhere; required for any email.
- **fieldEmailerLog** — `{ "YYYY-MM-DD": [{type, time}, …] }` — written by saveLogEntry() after each
  mailto fires; loadLog() shows today only.
- **fieldEmailerChassis** — `[{chassisId, hardwire, loaded, status, flashCount, notes, timestamp}, …]`
  — written by Chassis form submit + edit modal; read by loadChassisEntries() on chassis screen open.

No server-side store, no sync, no backup. Clear-data / new device / new browser = total wipe.

---

## 4. app.js — every function (≈35 functions + inline handlers, grouped)

**Config:** loadConfig() L21 (parse JSON, null on error) · saveConfig(cfg) L27 (stringify+write, no
validation) · populateForm(cfg) L31.
**Date/time:** formatDate() L40 (en-US) · formatTime() L46 (12:34:56 PM) · todayKey() L52 (ISO YYYY-MM-DD).
**Day log:** loadLog() L57 · saveLogEntry(type,time) L64 (now console.warns on parse failure instead
of swallowing) · renderLog() L73 (type-colored borders; empty state line).
**Email:** buildEmail(type,cfg,extras) L93 (subject `<type> - <client> - <jobsite> - <date>`; body
includes name/email/client/jobsite/date/time; conditionally appends reason/escalationIssue/inventory;
tail-stamps `--- Sent via Field Emailer`) · sendMailto(type,cfg,extras) L132 (sets
window.location.href to the mailto, logs, toasts; **cannot confirm the user actually sent** — only
that the mailto launched).
**UI primitives:** showToast(msg) L147 · showMain(cfg) L155 · showConfig() L162.
**Chassis Inventory (heavy feature):** loadChassisEntries() L273 (reset to [] on parse fail) ·
saveChassisEntries() L281 · getToggleValue() L285 · setToggleValue() L291 · updateChassisStats() L298
(total/pass/fail/hardwire pills) · renderChassisEntries() L310 (PASS/FAIL/HW/LOADED tags, edit/delete,
notes, timestamp; .reverse() newest-on-top) · resetChassisForm() L365 · showChassisScreen()/
hideChassisScreen() L378/L387 · setupToggleButtons() L398 · openEditModal(idx) L495.
**Inline handlers:** Config submit L169 · Settings L181 · Start of Day L183 · End of Day L189 ·
Delay/Inventory/Escalation modals L196/L221/L240 · Modal backdrop click L206 (was a bug — only closed
Delay; now generic) · Send buttons (sendMailto) · Status toggle L411/L523 (FAIL shows Flash Count) ·
Flash grid L423/L534 · Flash manual input L432/L542 · Chassis ID live-uppercase L439/L546 · Chassis
form submit L444 (**timestamp = formatTime() only — no date!**) · Chassis list click L476 (delegated
edit/delete; delete uses native confirm()) · Edit save L555 (preserves original timestamp) · Export
L587 (CSV with proper RFC quote escaping at L597, wrapped in mailto body w/ summary stats) · Init L643
· SW register L651.

---

## 5. UI / UX design language

**Palette (dark mode):** `--bg #0f0f1a`, `--surface #1a1a2e`, `--surface-2 #232340`, `--text #e8e8f0`,
`--text-muted #8888a8`; per-feature: green (Start/Pass/Export), orange (Delay/Hardwire/Confirm), blue
(End/focus), red (Escalation/Fail), purple #b388ff (Inventory), forest #4caf50 (Chassis).
**Layout:** `#app{max-width:480px;margin:0 auto}` phone-shaped, respects iOS notch via
env(safe-area-inset-*); `.screen` flex-stacked 20px gaps; `.hidden{display:none!important}` is the only
screen-state mechanism; modals are bottom-sheet (flex-end, radius 20px 20px 0 0); toast = centered
bottom pill with slide-up.
**Buttons (.btn-action):** icon-left + label + description; 52×52 tinted icon tile; `:active{scale .97}`;
tap-highlight transparent.
**Forms:** uppercase letter-spaced muted labels; dark inputs, 2px borders blue on focus; errors rely on
native browser validation (unstyled).
**Toggles (Chassis):** two-state HW/Loaded; full-width PASS/FAIL (green/red tint); Flash = 5×2 grid +
manual input fallback; active = feature-colored border + tint.
**Chassis cards:** status-colored left border; header (ID + edit/delete); tag row (status/HW/loaded/
flash chips); meta row (notes italic truncated, timestamp right).
**A11y present:** aria-label on icon buttons; `<label for>` on inputs; native semantics; PWA chrome
(status-bar style, theme-color). **A11y missing:** no focus-visible beyond default; no skip-link (OK for
single-screen); color sometimes near-sole signal (mitigated by PASS/FAIL text).

---

## 6. Email flows — exactly what fires

All emails go to **`norfolksouthern@safetynetinstalls.com`** (hardcoded app.js L4). Body always carries
Name/Email/Client/Jobsite/Date/Time, signed "Sent via Field Emailer."

| Button | Subject | Body addition | Modal? |
|---|---|---|---|
| Start of Day | Start of Day - … | "Arriving on site. Start of day check-in." | No |
| End of Day | End of Day - … | "End of day. Leaving site." | No |
| Delay | Delay Report - … | Free-text reason | Yes |
| Inventory | Inventory Update - … | Textarea + "Verified by: / Date:" footer | Yes |
| Escalation | Escalation - … | Issue description | Yes |
| Chassis Export | Chassis Inventory - … | Summary (total/pass/fail/HW) + `--- CSV DATA ---` block | No |

---

## 7. Screen state machine

Setup ⇄ Main ⇄ Chassis; Main opens 3 mailto modals (Delay/Inventory/Escalation); Chassis opens Edit
modal. Init: complete config → Main, else → Setup. One screen visible at a time via `.hidden`. No
router, no history management; chassis "Back" returns to Main; browser back button unhandled.

---

## 8. Issues / pitfalls (what the rebuild must resolve)

**Real bugs:**
1. **Missing PNG icons** — manifest + apple-touch-icon point at icon-192/512.png; only icon.svg exists.
   Install prompts fall back/broken. Generate PNGs.
2. **Path-traversal in server.js** — `path.join(__dirname, req.url)` allows `/../../etc/passwd`. Caddy
   normalizes so not exploitable through the edge today, but a live RFR if :3000 is hit directly. Resolve
   + re-check path prefix.
3. **XSS via localStorage data** — chassis ID/notes/timestamps interpolated into innerHTML without
   escaping; `<img onerror=…>` executes on render. Self-attack only until sync/share exists — then it
   matters. Escape on render / use textContent.
4. **Chassis timestamp has no date** — `formatTime()` only (HH:MM:SS). After day 2 you can't tell when;
   CSV inherits this. Use ISO or add a date field.
5. **Chassis stats are all-time, not per-day** — totals grow unboundedly; useless after a week.

**Architecture limits:** 6. No backend (localStorage only; lose device = lose data; no multi-user/sync/
analytics/admin). 7. One 654-line IIFE, no modules/bundler. 8. Hardcoded single recipient = one client
per fork. 9. No build/minify/cache-busting (relies on SW CACHE_NAME bump). 10. No tests/linter/
typechecker.

**UX gaps:** 11. No confirm/undo on Settings overwrite. 12. Native confirm() for delete breaks design.
13. No search/filter/date scoping on chassis list. 14. `mailto:` only transport — no mail client = nothing
happens; no retry/queue/proof-of-send. 15. Six-button home is becoming a wall.

**Operational:** 16. No server-side request logging (no usage data). 17. No Cache-Control headers. 18.
SW clients.claim() aggressive — stale code during dev until hard-refresh + CACHE_NAME bump.

---

## 9. What's in good shape (don't break)

- Clean reproducible deploy: `git clone && sudo ./setup.sh` → working server w/ TLS, systemd, restart-on-crash.
- Zero npm deps = zero supply-chain risk. Don't add deps casually.
- Modal backdrop click bug fixed (generic now).
- **CSV export escaping is correct** (quotes, commas, newlines).
- iOS PWA chrome well thought out (status bar, theme color, safe-area).
- Restart-resilience real: systemd recovers in ~3s after SIGKILL/SIGTERM.

---

## 10. Foundation moves if expanding (by leverage)

1. Generate missing PNG icons from icon.svg. 2. Fix path traversal (two lines). 3. Escape user input on
render. 4. Add a real backend before sync/multi-user/analytics need it. 5. Split app.js into ES modules
(config/email/log/chassis/ui). 6. Add ESLint + one GitHub Action (catches silent-catch/unhandled-rejection).
7. Move RECIPIENT into config (5th setup field) — unlocks multi-client without forking.

---

> **Rebuild mapping (per Command 0):** these findings drive the Phase 2 clean rebuild — offline-first
> React+MUI PWA → Workers API (TS/Hono + Rust) → Neon Postgres; photos → R2; real synced proof-of-send
> replacing `mailto:`; multi-tenant replacing the hardcoded recipient; `chassis` → `units` +
> `vehicle_type` with per-device `install_records` (flash_count/hardwire/loaded become type-specific
> attributes). XSS/path-traversal/no-tests eliminated by the new stack + test-first rail.
