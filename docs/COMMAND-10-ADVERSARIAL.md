# Command 10 — Adversarial Hardening Gate (✅ APPROVED & LOCKED 2026-06-06)

> **STATUS: ✅ APPROVED 2026-06-06 (John).** **Decisions:** discovery agents (Browser Use/Stagehand on Playwright
> MCP) → harden to Playwright tests · zero-tolerance critical/high blocks deploy (context-based severity) · agents
> **containerized + staging-only + scoped-creds + domain-allowlisted** (hard boundary) · AI-feature red-teaming
> **out of scope** until PG ships an LLM feature. **All design commands (0–10) are now complete.** The signature
> pre-deploy defense: independent, **context-free, randomized-goal**
> agents try to break the site **on staging only** before any full deploy; a clean pass is a release requirement.
> **U1:** verified against live June 2026 practice (Browser Use/Stagehand on Playwright MCP, OWASP ZAP automation,
> Lighthouse CI, Baymard/NN/g, OWASP Agentic Top 10 2026) — cited in notes. Wires into the Command 9 deploy gate.

---

## A. The 5 lenses (expanded per feedback — not just security)

| Lens | Probes for | Tooling |
|---|---|---|
| **Security** | XSS/SQLi/CSRF, auth/authz bypass, **tenant-isolation (RLS) breakouts**, SSRF, error-path leaks, rate-limit evasion | **OWASP ZAP** (automation framework, active scan) + replay of pgTAP RLS cases |
| **Functionality** | broken flows, malformed input, edge cases, dead-ends/broken links, state corruption, offline-replay integrity | **monkey/fuzz** + autonomous agents + crawl (Unlighthouse) |
| **SEO** | stray `noindex`, broken canonical/hreflang, missing meta, structured-data errors, **CWV (INP/LCP/CLS) regressions** | **Lighthouse CI** + Schema/Rich-Results validators + crawler |
| **Sales / conversion** | "**skeptical fleet manager: what stops the quote?**" — form friction, field bloat, unanswered objections, dead CTAs | Baymard friction-audit heuristics + persona agents |
| **Trust / credibility** | "does this read legit vs sketchy" — design quality, upfront disclosure, real vs filler content, contactability | **NN/g 4 trust factors** + B2B trust heuristics |

## B. Harness design
- **Autonomous discovery agents:** LLM-driven browser agents (**Browser Use / Stagehand**) grounded on **Playwright
  MCP** (structured a11y-snapshot actions, observable + promotable to CI tests). They get **randomized goals + no
  product context** so they probe states no script enumerated (they infer their own oracles).
- **Deterministic scanners** for the security + SEO lenses: **OWASP ZAP** (active scan, staging) + **Lighthouse CI** +
  schema/hreflang validators + a site crawler (broken-link/dead-end).
- **Heuristic auditors** for conversion + trust: agents run the Baymard friction audit + NN/g trust checklist against
  the live staging build and report objections/blockers.

## C. Randomized-task / persona generation
Seed agents with **randomized adversarial personas + goals**, then **LLM-guided mutation** expands the goal set each
iteration (probing outside designed assumptions). Persona examples:
- *Skeptical fleet manager* — "find every reason NOT to request a quote."
- *Impatient mobile user* — "complete a quote on a slow phone; where do you rage-quit?"
- *Malicious form-stuffer* — "abuse the lead form / inputs."
- *Lost visitor* — "find ELD info from a deep link; hit any dead-end."
- *Attacker* — "escape your tenant; read another tenant's installs."

## D. ⚠️ Scope & safety — agents are an UNTRUSTED attack surface (non-negotiable)
The agents themselves are prompt-injectable (OpenAI: AI browsers "may always be vulnerable"; fuzzing study saw
**58–74% agent failure by the 10th iteration**). **Contain by infrastructure, never by prompt instructions:**
- **Staging only** — agents never touch production; **staging-scoped credentials**, **no prod tokens/secrets**.
- **Containerized/isolated execution** (isolated filesystem), **network allowlist = the staging domain** (a hijacked
  agent can't pivot off-scope).
- Separate trusted instructions from untrusted page content; treat the testing fleet under the **OWASP Agentic Top 10
  2026** threat model (goal hijack, tool misuse, privilege abuse).

## E. Gate design (pass/fail, triage, integration)
- **Pass/fail per lens:** **zero-tolerance for critical/high** confirmed findings → blocks the deploy; medium/low →
  tracked, not blocking. Severity is **context/exploitability-based, not CVSS-number-only** (a public-auth Medium can
  outrank an internal Critical); overrides documented in version control.
- **Don't gate on a single agent pass** (agents are non-deterministic) — require deterministic-scanner cleanliness +
  triaged agent findings; promote agent/DAST findings into the failing set **gradually** (report → triage → block on
  high-confidence) to avoid flaky blocks.
- **Integration:** this gate **is** the Command 9 **GitHub Actions environment-protection manual-approval step** before
  `wrangler versions deploy`. No full deploy proceeds on failure.

## F. Feedback loop (one-off findings → permanent coverage)
Every confirmed finding becomes a durable artifact: agent-discovered flows → **deterministic Playwright/Playwright-MCP
regression tests** (Command 8) · ZAP false-positives → version-controlled `.zap/rules.tsv` · SEO/schema breakages → CI
assertions · conversion/trust issues → fixes + (where measurable) a Command 8 check. The gate *grows* the test rail.

## G. Maturity caveats (honest)
Autonomous agents are the **most expensive + least deterministic** mode (~$0.50–$2.00/flow) — use for **discovery**,
then harden into deterministic tests. Benchmark "success rates" are vendor-reported navigation scores, not breakage
guarantees. Randomized-goal UX/conversion probing is **emerging** — assembled from agent frameworks + an LLM
goal-generator, not bought off-the-shelf. AI-feature red-teaming (OWASP LLM Top 10) is **out of scope until/unless** PG
ships an LLM feature (e.g., a quote assistant) — flagged for re-scope if that changes.

## H. Decisions — ✅ RESOLVED 2026-06-06
1. **Autonomous-agent tooling — ✅ Browser Use / Stagehand on Playwright MCP** (discover → harden to Playwright tests).
2. **Gate strictness — ✅ zero-tolerance critical/high** blocks deploy; medium/low tracked; **context-based severity**.
3. **Containment — ✅ containerized, staging-only, staging-scoped creds, domain-allowlisted** (hard infra boundary).
4. **AI-feature red-teaming — ✅ out of scope** until PG ships an LLM feature (re-scope then).

## I. Definition of Complete (U2)
Done when: the 5 lenses defined ✓ · harness (autonomous agents + deterministic scanners + heuristic auditors) ✓ ·
randomized persona/goal generation ✓ · **staging-only containment/safety boundary** ✓ · pass/fail + triage + Command 9
gate integration ✓ · feedback loop into Commands 8/9 ✓ · maturity caveats ✓ · cited 2026 practice ✓ · **§H resolved
(pending)** · John approves (pending). Then → Command 11 (Task Breakdown, applied per approved phase) — the last command
before building begins.

---

*Command 10 proposal. Resolve §H, approve → Command 11. After Command 10, all design commands are complete; Command 11
is the per-phase task-breakdown template applied when each build phase starts.*
