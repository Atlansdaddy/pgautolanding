# SEO + GEO Guidelines — Compiled Reference (Command 1 deliverable)

> **STATUS: ✅ APPROVED & LOCKED — 2026-06-04 (John).** All 7 sections reviewed section-by-section;
> decisions A–G resolved. This is now the **single source of truth** governing all marketing-site markup
> and content. Changes require a new review pass. *(Carried constraints: self-hosted fonts; lazy-loaded
> 3D w/ static-poster LCP; orange = large/UI only; reduced-motion honored; no fake review stars;
> multilingual EN+ES; WCAG 2.2 AA; allow AI-search bots / block training bots.)*
>
> **U1 Currency Gate:** every item below was researched against **live authoritative sources as of
> June 2026** (not training memory) and carries a citation. Items that are contested, recently changed,
> or emerging are **flagged** — see the "Decisions for your review" section at the end for the ones that
> need your call.
>
> **Surface key:** **M** = Marketing site · **P** = Admin/Tech portals · **F** = Field app (PWA) ·
> **Off** = Off-site (Google Business Profile, citations, third-party). Most SEO/GEO applies to **M**;
> Performance and Accessibility apply across **M/P/F**.
>
> **Priority key:** Critical · High · Medium · Low.

---

## 0. How to read this / scope

- The marketing site (**M**) is the SEO/GEO target. Portals (**P**) and the field app (**F**) should be
  **noindexed / auth-gated** — they must NOT be in the index — but they still inherit **Performance** and
  **Accessibility** obligations (and the legal a11y bar).
- Categories: 1) Technical SEO · 2) On-Page SEO · 3) Structured Data/Schema · 4) Performance/Core Web
  Vitals · 5) Accessibility · 6) GEO/AI-Answer Optimization · 7) Local & B2B Fleet-Industry.

---

## 1. Technical SEO

1. **robots.txt = crawl management, not de-indexing** — Manage crawler access/load; never use it to keep a
   page out of the index (a disallowed-but-linked URL can still be indexed). Don't block CSS/JS/images
   Googlebot needs to render. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/robots/intro. *Surface:* M (apply noindex on P/F instead). *Priority:* Critical.
2. **Use noindex via meta robots or X-Robots-Tag, never in robots.txt** — Page must stay crawlable for
   Google to see the directive. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/block-indexing. *Surface:* M (thin/utility pages) + P/F (gate or noindex login screens). *Priority:* Critical.
3. **Current robots meta directives** — Supported: noindex, nofollow, none, nosnippet, indexifembedded,
   max-snippet:[n], max-image-preview:[…], max-video-preview:[n], notranslate, noimageindex,
   unavailable_after:[date], all. *Source:* Google Search Central (updated 2026-03-24), https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag. *Surface:* M. *Priority:* High. *Flag:* recently-changed — `noarchive`/`nocache`/`nositelinkssearchbox` no longer used.
4. **XML sitemap, canonical indexable URLs only** — 200-status, no redirects/noindex/dupes; ≤50,000 URLs
   or 50MB per file; submit in Search Console + reference in robots.txt. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap. *Surface:* M. *Priority:* High.
5. **Accurate `<lastmod>`; omit priority/changefreq** — Google uses lastmod only if verifiably accurate;
   ignores priority/changefreq. Don't stamp lastmod to "now" every build. *Source:* Google Search Central, same as #4. *Surface:* M. *Priority:* Medium.
6. **Self-referencing canonical, absolute URLs** — rel=canonical in `<head>`/HTTP header, fully-qualified;
   it's a strong hint, not a directive; don't send conflicting signals. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls. *Surface:* M. *Priority:* High.
7. **Sitewide HTTPS (mandatory)** — Valid cert, HTTP→HTTPS redirect, prefer HSTS. Confirmed (light)
   ranking signal + page-experience expectation. *Source:* Google Search Central Blog, https://developers.google.com/search/blog/2014/08/https-as-ranking-signal. *Surface:* M/P/F (all HTTPS-only). *Priority:* Critical.
8. **Mobile-first indexing is universal** — Google indexes via mobile Googlebot; ensure full mobile/desktop
   content parity (content, headings, structured data, meta, links). *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing. *Surface:* M. *Priority:* Critical. *Flag:* recently-changed — rollout complete; desktop-only content no longer indexed.
9. **Simple, descriptive, hyphenated URLs** — Readable words, hyphens, lowercase, shallow structure.
   *Source:* Google Search Central (updated 2025-06-18), https://developers.google.com/search/docs/crawling-indexing/url-structure. *Surface:* M. *Priority:* High.
10. **Don't deliver content via URL fragments; use the History API** — For React-island/client routing,
    each view needs a real crawlable URL. *Source:* Google Search Central, same as #9. *Surface:* M. *Priority:* High.
11. **hreflang REQUIRED (site is multilingual: English + Spanish)** — Bidirectional annotations (every
    variant references all variants incl. itself) + `x-default`, using ISO 639-1 lang + optional ISO 3166-1
    region codes, fully-qualified URLs; one broken return-tag invalidates the cluster. Don't auto-redirect
    by locale. Pair with a clean URL strategy (e.g. `/` + `/es/`) and correct `<html lang="…">` per page
    (also an a11y requirement — WCAG SC 3.1.1). *Source:* Google Search Central, https://developers.google.com/search/docs/specialty/international/localized-versions. *Surface:* M. *Priority:* High. *Flag:* RESOLVED — multilingual confirmed (Decision E).
12. **rel=next/prev is dead; use crawlable `<a href>` for pagination** — Plain anchors for blog/resource
    listings. *Source:* Google Search Central, https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading. *Surface:* M. *Priority:* Medium. *Flag:* deprecated.
13. **Server-side 301/308 for permanent moves** — Avoid chains; keep redirects ≥1 year. *Source:* Google
    Search Central, https://developers.google.com/search/docs/crawling-indexing/301-redirects. *Surface:* M (+ any P/F migrations). *Priority:* High.
14. **Avoid soft 404s; return real 404/410** — Don't 200 on not-found or redirect dead pages to home.
    *Source:* Google Crawling docs, https://developers.google.com/crawling/docs/troubleshooting/http-status-codes. *Surface:* M (Astro 404). *Priority:* High.
15. **Prefer SSR/SSG over client-side rendering** — Ship primary content in server-rendered/static HTML;
    JS rendering is deferred + budget-limited. Astro is SSG/SSR by default — keep React islands for
    interactivity only. *Source:* Google Search Central (updated 2026-03-04), https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics. *Surface:* M. *Priority:* Critical.
16. **Dynamic rendering is no longer recommended** — Use SSR/SSG/hydration, not bot-only prerender.
    *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering. *Surface:* M. *Priority:* Medium. *Flag:* deprecated.
17. **All links must be crawlable `<a href>`** — Buttons/onclick/JS-only nav aren't reliably crawled;
    critical for React islands. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/links-crawlable. *Surface:* M. *Priority:* Critical.
18. **Monitor crawl/index in Search Console** — Crawl Stats + Page Indexing reports for 4xx/5xx, robots,
    excluded pages. *Source:* GSC Help, https://support.google.com/webmasters/answer/9679690 + https://support.google.com/webmasters/answer/7440203. *Surface:* M. *Priority:* High. *Flag:* recently-changed — Page Indexing report had reporting-lag from ~Nov 17 2025 (UI only).

---

## 2. On-Page SEO

19. **Unique, descriptive `<title>` per page** — Front-load primary term; ~525–535px desktop. *Source:*
    Google Search Central, https://developers.google.com/search/docs/appearance/title-link. *Surface:* M. *Priority:* High. *Flag:* contested — Google rewrites titles in a large share of cases; write for intent, not character count.
20. **Unique meta descriptions (~150–160 chars)** — Not a ranking factor; influences CTR; often rewritten.
    *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/snippet. *Surface:* M. *Priority:* Medium.
21. **Clear heading hierarchy, descriptive H1** — One topical H1, logically nested H2/H3; aids a11y + AI
    extraction; keep H1 unique to avoid cannibalization. *Source:* Google Search Central, https://developers.google.com/search/docs/fundamentals/seo-starter-guide. *Surface:* M. *Priority:* High.
22. **Semantic HTML structure** — `<header>/<nav>/<main>/<article>/<section>`, real headings/lists, so
    crawlers + AI parse structure. *Source:* Google Search Central, same as #21. *Surface:* M. *Priority:* Medium.
23. **Descriptive internal linking** — Meaningful anchor text (no "click here"); topic clusters (pillar +
    service pages); no orphans. *Source:* Google Search Central, https://developers.google.com/search/docs/crawling-indexing/links-crawlable. *Surface:* M. *Priority:* High.
24. **Image alt text describing the image** — Users/a11y first, not keyword stuffing; strongest direct
    a11y/SEO overlap; feeds Google Images. *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/google-images. *Surface:* M. *Priority:* High (see also #43).
25. **Descriptive, hyphenated image filenames** — e.g. `fleet-gps-install.jpg`. *Source:* Google Search
    Central, same as #24. *Surface:* M. *Priority:* Low.
26. **Next-gen formats + responsive images + explicit dimensions** — WebP/AVIF via `<picture>`/srcset;
    width/height to prevent layout shift. *Source:* Google Search Central, same as #24. *Surface:* M (+ CWV). *Priority:* Medium.
27. **Lazy-load below-the-fold only; eager-load LCP image** — Never lazy-load the hero/LCP image. *Source:*
    Google Search Central, https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading. *Surface:* M. *Priority:* Medium (see #36).
28. **Demonstrate E-E-A-T on service pages** — Named practitioners/credentials, case studies/first-hand
    results, clear company/contact info, credible citations. *Source:* Google, https://developers.google.com/search/docs/fundamentals/creating-helpful-content. *Surface:* M. *Priority:* High.
29. **People-first "helpful content"; avoid scaled/thin content** — Original, first-hand value; helpful-
    content is now part of core ranking; "scaled content abuse" is targeted (applies to AI- and human-
    written alike). *Source:* Google Spam policies, https://developers.google.com/search/docs/essentials/spam-policies. *Surface:* M. *Priority:* Critical. *Flag:* recently-changed — folded into core algorithm (Mar 2024); core updates continued through Mar 2026.
30. **Match B2B service pages to commercial/transactional intent** — Bottom-of-funnel queries
    ("[service] for [industry]", "[service] company near me", "X vs Y") on dedicated pages with
    substantive unique content (scope, pricing signals, proof, CTA). *Source:* Search Engine Land, https://searchengineland.com/library/seo + Google SEO starter guide. *Surface:* M. *Priority:* High. *Flag:* recently-changed — 2025–26 shift to optimizing for AI answer engines alongside classic SERPs.

---

## 3. Structured Data / Schema (JSON-LD)

31. **Use most specific LocalBusiness subtype (AutomotiveBusiness)** — Array with `Service`/
    `ProfessionalService` if offering services. *Source:* Schema.org, https://schema.org/AutomotiveBusiness. *Surface:* M. *Priority:* High.
32. **LocalBusiness required: name + address (PostalAddress)** — Without these, ineligible for business
    rich treatment. *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/structured-data/local-business. *Surface:* M. *Priority:* Critical. *Note:* address is hidden publicly for an SAB (see #71) but still provided in markup/verification.
33. **LocalBusiness recommended: telephone, url, openingHoursSpecification, geo, priceRange, image** —
    Enriches the Knowledge Panel. *Source:* same as #32. *Surface:* M. *Priority:* High.
34. **LocalBusiness earns a Knowledge Panel, not a guaranteed snippet** — Display never guaranteed. *Source:*
    same as #32. *Surface:* M. *Priority:* Medium.
35. **GeoCoordinates ≥5 decimal places** — Accurate map placement. *Source:* same as #32. *Surface:* M. *Priority:* Medium.
36. **Service coverage via Service + areaServed** — provider, serviceType, areaServed (Text/AdministrativeArea/
    Place/GeoShape) — machine-readable coverage independent of HQ. *Source:* Schema.org, https://schema.org/areaServed. *Surface:* M (+ P). *Priority:* High.
37. **GeoShape geoRadius for a service radius; array of areas for multiple regions** — *Source:* Schema.org,
    https://schema.org/Service. *Surface:* M. *Priority:* Medium.
38. **Organization: populate richly** — name, url, logo (≥112×112, crawlable), sameAs, address, contactPoint,
    telephone, email, description. *Source:* Google Search Central (updated 2026-04-15), https://developers.google.com/search/docs/appearance/structured-data/organization. *Surface:* M. *Priority:* High.
39. **Person for founders, linked to Organization** — founder/employee + sameAs; entity understanding, not a
    rich result. *Source:* Schema.org, https://schema.org/Person. *Surface:* M. *Priority:* Low.
40. **BreadcrumbList: ≥2 ListItems (position/name/item)** — Earns breadcrumb trail. *Source:* Google Search
    Central, https://developers.google.com/search/docs/appearance/structured-data/breadcrumb. *Surface:* M. *Priority:* High.
41. **FAQPage rich results are deprecated — do NOT expect FAQ snippets** — Restricted since Aug 2023; as of
    May 7 2026 they no longer appear; reports/Rich Results Test support dropping June 2026, API Aug 2026.
    Markup is harmless and may aid comprehension, but don't invest for snippets. *Source:* Google Search
    Central Blog, https://developers.google.com/search/blog/2023/08/howto-faq-changes; SEJ, https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/. *Surface:* M. *Priority:* High. *Flag:* deprecated/recently-changed.
42. **HowTo structured data is deprecated** — No rich result; don't implement for that purpose. *Source:*
    Google Search Central Blog, same as #41. *Surface:* M/F. *Priority:* Medium. *Flag:* deprecated.
43. **Self-serving reviews → ineligible for star rich results** — Review/AggregateRating the entity controls
    about itself (incl. embedded Google/FB widgets) won't show stars. *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/structured-data/review-snippet; BrightLocal, https://www.brightlocal.com/learn/review-schema/. *Surface:* M. *Priority:* High. *Flag:* recently-changed (2023 policy). **Implication:** get star visibility via GBP/third-party (see #72–#73), show on-site testimonials for trust only.
44. **Sitelinks Searchbox (SearchAction) is deprecated** — Retired Nov 21 2024. *Source:* Google Search
    Central Blog, https://developers.google.com/search/blog/2024/10/sitelinks-search-box. *Surface:* M. *Priority:* Low. *Flag:* deprecated.
45. **WebSite markup still supported for site name** — Keep WebSite with name/url. *Source:* same as #44.
    *Surface:* M. *Priority:* Medium.
46. **VideoObject: name, thumbnailUrl, uploadDate + contentUrl/embedUrl** — thumbnail ≥1280×720, ≥30s for
    carousel. *Source:* Google Search Central (updated 2026-02-13), https://developers.google.com/search/docs/appearance/structured-data/video. *Surface:* M. *Priority:* Medium.
47. **ImageObject with crawlable, indexable URLs** — Not blocked by robots/noindex. *Source:* Google Search
    Central, https://developers.google.com/search/docs/appearance/structured-data/sd-policies. *Surface:* M. *Priority:* Low.
48. **Prefer JSON-LD** — Microdata/RDFa still supported; standardize on JSON-LD. *Source:* same as #47.
    *Surface:* M. *Priority:* High.
49. **Never mark up content not visible on the page** — Fabricated/hidden/misleading markup → manual action.
    *Source:* same as #47. *Surface:* M. *Priority:* Critical.
50. **Multiple entities via nesting or @id linking** — *Source:* same as #47. *Surface:* M. *Priority:* Medium.
51. **Schema does NOT directly boost rankings or give LLMs a special edge** — Value = SERP-feature
    eligibility + entity clarity, not a ranking/AI shortcut (Mueller, 2025). *Source:* Search Engine
    Roundtable, https://www.seroundtable.com/mueller-schema-helps-llms-google-40693.html. *Surface:* M. *Priority:* Medium. *Flag:* contested.
52. **But keep evergreen schema for AI/GEO entity clarity** — Organization/LocalBusiness, BreadcrumbList,
    Article, Product/Offer (prune experimental types). *Source:* Stan Ventures, https://www.stanventures.com/news/google-john-mueller-schema-update-2026-5719/. *Surface:* M. *Priority:* Medium. *Flag:* recently-changed.
53. **Validate: Schema Markup Validator + Rich Results Test** — schema syntax then Google eligibility.
    *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/structured-data + https://search.google.com/test/rich-results. *Surface:* M. *Priority:* High.

---

## 4. Performance / Core Web Vitals

54. **CWV metric set (2026) = LCP, INP, CLS** — INP replaced FID (stable Mar 12 2024; FID removed Sep 9
    2024). *Source:* web.dev, https://web.dev/articles/vitals. *Surface:* M/P/F. *Priority:* Critical.
55. **LCP ≤ 2.5s "good"** — (2.5–4.0 needs-improvement; >4.0 poor) at 75th percentile. *Source:* web.dev,
    https://web.dev/articles/lcp. *Surface:* M/P/F. *Priority:* Critical.
56. **INP ≤ 200ms "good"** — (200–500 needs-improvement; >500 poor). *Source:* web.dev, https://web.dev/articles/inp. *Surface:* M/P/F (esp. interaction-heavy P/F). *Priority:* Critical.
57. **CLS ≤ 0.1 "good"** — (0.1–0.25 needs-improvement; >0.25 poor). *Source:* web.dev, https://web.dev/articles/cls. *Surface:* M/P/F. *Priority:* Critical.
58. **75th-percentile rule, mobile & desktop separately** — *Source:* web.dev, https://web.dev/articles/vitals. *Surface:* M/P/F. *Priority:* High.
59. **CWV = real but secondary ranking input in 2026** — Page-Experience & Helpful-Content folded into core;
    CWV act as quality/tiebreaker — helpful content matters more. *Source:* Google Search Central, https://developers.google.com/search/docs/appearance/core-web-vitals + .../page-experience. *Surface:* M (ranking); P/F (UX). *Priority:* High.
60. **Field data (CrUX) is what counts; lab (Lighthouse) approximates** — Validate against CrUX. *Source:*
    web.dev, https://web.dev/articles/vitals-field-measurement-best-practices. *Surface:* M/P/F. *Priority:* High.
61. **Lighthouse Performance target ≥ 90 (green)** — Weights: TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10%.
    *Source:* Chrome for Developers, https://developer.chrome.com/docs/lighthouse/performance/performance-scoring. *Surface:* M/P/F (CI gate). *Priority:* High.
62. **Performance budget: ~170KB critical-path (slow 3G); Lighthouse budget ≥ 85** — slow-4G ~345KB total
    (JS ≤200KB); desktop ~750KB. *Source:* web.dev, https://web.dev/articles/your-first-performance-budget. *Surface:* M/P/F (stricter on F/mobile). *Priority:* High.
63. **JS payload budget: ≤100KB (3G)/≤200KB (4G)/≤300KB (desktop), compressed** — Critical for React-island/
    three.js bundles; uncompressed JS drives main-thread time → INP/TBT. *Source:* web.dev, same as #62.
    *Surface:* M/P/F. *Priority:* High.
64. **Modern image formats (AVIF/WebP)** — AVIF best compression, WebP fallback; + image CDN. *Source:*
    web.dev, https://web.dev/articles/optimize-lcp. *Surface:* M (image-heavy)/all. *Priority:* High.
65. **Responsive images + explicit dimensions (protect CLS)** — srcset/sizes + width/height/aspect-ratio.
    *Source:* web.dev, same as #64. *Surface:* M/P/F. *Priority:* High.
66. **Native lazy-load below-the-fold; never the LCP/hero image** — *Source:* web.dev, https://web.dev/articles/browser-level-image-lazy-loading. *Surface:* M/P/F. *Priority:* High.
67. **fetchpriority="high" on the LCP image** — Make it discoverable in initial HTML (not JS-injected/lazy).
    *Source:* web.dev, same as #64/#66. *Surface:* M (hero/3D poster)/all. *Priority:* High.
68. **Eliminate render-blocking; inline critical CSS, defer rest** — No sync scripts in `<head>`. *Source:*
    web.dev, same as #64. *Surface:* M/P/F. *Priority:* High.
69. **JS minify + code-split; break long main-thread tasks** — *Source:* web.dev, same as #62/#64. *Surface:*
    M/P/F (critical for React islands). *Priority:* High.
70. **DECIDED: self-host fonts (WOFF2 + font-display + preload)** — Montserrat/Open Sans **self-hosted on
    Cloudflare** (not Google Fonts CDN): faster same-origin reuse, one fewer third-party, own cache headers.
    Subset + WOFF2; `font-display: swap`; preload the critical weights. *Source:* web.dev, https://web.dev/articles/font-best-practices. *Surface:* M/P/F. *Priority:* Medium. *Flag:* RESOLVED — replaces the current Google-Fonts-CDN load.
71. **Limit/defer third-party scripts** — Remove unused, defer/async, consider self-hosting analytics.
    *Source:* SALT.agency, https://salt.agency/blog/page-speed-third-party-scripts/ + Lighthouse audit, https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl. *Surface:* M/P/F. *Priority:* Medium. *Flag:* secondary (non-Google) sources — cross-check Lighthouse third-party audit.
72. **CDN/edge + reduce TTFB** — Minimize redirects; avoid cache-busting params. (Cloudflare edge fits.)
    *Source:* web.dev, same as #64. *Surface:* M/P/F. *Priority:* Medium.
73. **Long-cache immutable assets: Cache-Control max-age=31536000, immutable** — Content-hashed filenames for
    busting. *Source:* Chrome for Developers, https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl. *Surface:* M/P/F. *Priority:* Medium.
74. **Astro: zero JS by default, hydrate selectively** — Ship JS only for interactive islands. *Source:*
    Astro Docs, https://docs.astro.build/en/concepts/islands/. *Surface:* M. *Priority:* High.
75. **Astro hydration directives: client:idle / client:visible / client:load** — Lightest viable; client:visible
    for below-the-fold/heavy widgets. *Source:* Astro Docs, https://docs.astro.build/en/reference/directives-reference/#client-directives. *Surface:* M. *Priority:* High.
76. **DECIDED: lazy-load the 3D explorer (client:visible/interaction + static poster)** — Heavy three.js/WebGL
    stays OUT of the critical path as an out-of-band on-demand chunk; the **static vehicle poster is the LCP
    element** (fetchpriority high, reserved box); 3D swaps in only on scroll-into-view or tap. *Source:* Astro
    Docs, same as #74 + web.dev LCP, https://web.dev/articles/optimize-lcp. *Surface:* M. *Priority:* High. *Flag:* RESOLVED (lazy-load confirmed) — still verify real fps on a mid-tier phone before committing the explorer.

---

## 5. Accessibility (WCAG) — legal + a11y/SEO overlap

77. **Target WCAG 2.2 Level AA** — 2.2 is the current W3C Recommendation (Oct 2023; ISO/IEC 40500:2025); 3.0
    is still a Working Draft — do not target it. AA is the practical/legal bar. *Source:* W3C WAI, https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ + https://www.w3.org/TR/WCAG22/. *Surface:* M/P/F. *Priority:* Critical. *Flag:* legal/recently-changed.
78. **WCAG 2.2 added 9 SC (Parsing removed)** — Focus Not Obscured (2.4.11 AA), Dragging Movements (2.5.7 AA),
    Target Size Min (2.5.8 AA), Consistent Help (3.2.6 A), Redundant Entry (3.3.7 A), Accessible
    Authentication (3.3.8 AA) — auth/help/forms criteria especially hit P/F. *Source:* W3C WAI, same as #77.
    *Surface:* M/P/F. *Priority:* High. *Flag:* recently-changed.
79. **Accessibility is NOT a direct Google ranking factor** — The connection is the *shared signals*, not a11y
    itself. *Source:* Deque, https://www.deque.com/blog/accessibility-importance-for-seo/. *Surface:* M. *Priority:* Medium. *Flag:* contested.
80. **Shared a11y/SEO signals** — Semantic HTML, heading hierarchy, alt text, link text, captions/transcripts,
    structure — implement once, benefit both. *Source:* Deque + TestParty, https://testparty.ai/blog/accessibility-seo-benefits. *Surface:* M (primary)/P/F. *Priority:* High.
81. **Legal exposure (US private B2B)** — No DOJ technical standard for Title III, but courts treat WCAG 2.1/2.2
    AA as de facto; federal web-a11y suits ~3,117 in 2025 (+27%). WCAG 2.2 AA = risk mitigation. *Source:*
    ABA, https://www.americanbar.org/groups/business_law/resources/business-law-today/2025-august/digital-accessibility-under-title-iii-ada/; Seyfarth, https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/. *Surface:* M/P. *Priority:* High. *Flag:* legal.
82. **ADA Title II (public-sector clients)** — DOJ 2024 rule = WCAG 2.1 AA for gov web/apps; 2026 extended
    dates (large entities Apr 26 2027). If PG serves public-sector fleets as a vendor, deliverables must
    meet 2.1 AA. *Source:* ADA.gov, https://www.ada.gov/resources/2024-03-08-web-rule/. *Surface:* P/F/M (vendor
    deliverables). *Priority:* High. *Flag:* legal/recently-changed.
83. **EAA (effective Jun 28 2025) — only if selling into the EU** — Reaches non-EU businesses serving EU
    consumers; conformance via EN 301 549 (WCAG 2.1 AA). Likely N/A for a Mid-Atlantic B2B, but flagged.
    *Source:* European Commission AccessibleEU, https://accessible-eu-centre.ec.europa.eu/content-corner/news/eaa-comes-effect-june-2025-are-you-ready-2025-01-31_en. *Surface:* M/P. *Priority:* Low (Critical if EU-facing). *Flag:* legal/recently-changed.
84. **Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large ≥24px / 18.7px bold)** — SC 1.4.3 AA. *Source:* W3C WAI,
    https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html. *Surface:* M/P/F. *Priority:* Critical.
    *Note:* check brand palette pairings (orange #FF6B35 on white ≈ fails for normal text — reserve for large/UI).
85. **Non-text/UI contrast ≥ 3:1** — Input borders, button boundaries, focus indicators, meaningful icons.
    SC 1.4.11 AA. *Source:* W3C WAI, same as #84. *Surface:* M/P/F. *Priority:* High.
86. **Full keyboard operability, no traps** — SC 2.1.1/2.1.2; critical for data-entry portals + custom widgets.
    *Source:* W3C, https://www.w3.org/TR/WCAG22/. *Surface:* P (primary)/all. *Priority:* Critical.
87. **Visible focus, not obscured** — SC 2.4.7 AA + 2.4.11 (sticky headers/banners must not cover focus).
    *Source:* W3C WAI, same as #77. *Surface:* M/P/F. *Priority:* High. *Flag:* recently-changed.
88. **Touch/pointer target ≥ 24×24 CSS px (or spacing)** — SC 2.5.8 AA; aim 44×44 for the Field PWA (gloves/
    touch). *Source:* W3C WAI, same as #77. *Surface:* F (primary)/P/M. *Priority:* High. *Flag:* recently-changed.
89. **Dragging-movement alternative** — Single-pointer (tap) alternative for sliders/drag/map-pan. SC 2.5.7 AA.
    *Source:* W3C WAI, same as #77. *Surface:* F (primary)/P. *Priority:* Medium. *Flag:* recently-changed.
90. **Prefer native HTML; "no ARIA is better than bad ARIA"** — ARIA-heavy pages averaged ~41% more errors.
    *Source:* W3C ARIA APG, https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/; MDN, https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA. *Surface:* M/P/F. *Priority:* High.
91. **Form labels + accessible names** — Programmatic `<label>` (placeholders ≠ labels); expose name/role/value.
    SC 1.3.1/3.3.2/4.1.2. *Source:* W3C WAI, https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14. *Surface:* P
    (primary)/F/M (lead forms). *Priority:* Critical.
92. **Honor prefers-reduced-motion for scroll animations + 3D** — Disable/simplify non-essential motion
    (parallax, scroll reveals, auto-rotating 3D); also Pause/Stop/Hide for >5s motion; no flashing >3×/sec.
    Directly relevant to the design's side-scroll reveals + 3D. *Source:* W3C WAI, https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html; web.dev, https://web.dev/learn/accessibility/motion. *Surface:* M (primary)/F. *Priority:* High.
93. **Accessible alternative for 3D/canvas/WebGL** — Provide equivalent text/DOM fallback (SC 1.1.1). *Source:*
    web.dev, same as #92; MDN ARIA. *Surface:* M (3D)/F. *Priority:* Medium.
94. **Captions + transcripts for media** — SC 1.2.2/1.2.x; also feeds search indexing. *Source:* W3C, https://www.w3.org/TR/WCAG22/. *Surface:* M. *Priority:* Medium.
95. **Automated a11y testing (axe / Lighthouse / WAVE) in CI** — Catches only ~30–50% of issues. *Source:*
    TestParty, https://testparty.ai/blog/automated-vs-manual-accessibility-testing. *Surface:* M/P/F (pipeline). *Priority:* High.
96. **Manual + assistive-tech testing** — Keyboard walkthroughs + screen readers (NVDA/JAWS, VoiceOver,
    TalkBack — TalkBack/VoiceOver for the Field PWA) for the remaining ~50–70%. *Source:* TestParty, https://testparty.ai/blog/manual-vs-automated-accessibility-testing. *Surface:* M/P/F. *Priority:* High.

---

## 6. GEO / AI-Answer Optimization (newest + fastest-moving — flags are essential)

97. **GEO is ~a superset of strong SEO, not a separate discipline** — Don't buy "GEO-only" services that ignore
    SEO fundamentals. *Source:* SEJ, https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/; Digiday, https://digiday.com/media/geo-hype-busted-experts-call-it-more-seo-than-new-discipline/. *Surface:* M. *Priority:* Critical. *Flag:* Google-confirmed direction; the "80%" split is a practitioner estimate.
98. **Google: no special files/markup/AI-only writing needed for AI Overviews/AI Mode** — Eligibility = indexed
    + snippet-eligible. *Source:* Google Search Central "AI Features and Your Website," https://developers.google.com/search/docs/appearance/ai-features + "Guide to Optimizing for Generative AI Features" (pub. May 15 2026), https://developers.google.com/search/docs/fundamentals/ai-optimization-guide. *Surface:* M. *Priority:* Critical. *Flag:* primary-source-confirmed (Google-specific).
99. **Google debunks mechanical "chunking" / "ideal page length"** — Write naturally; clear structure helps,
    micro-chunking unnecessary. *Source:* Google AI optimization guide, same as #98. *Surface:* M. *Priority:* High. *Flag:* contested — vendors + the GEO paper still argue extractable passages help ChatGPT/Perplexity. Reconcile: structure yes, mechanical chunking no.
100. **Google debunks inauthentic mention-building + per-query doorway pages** — Spam systems target these.
     *Source:* Google AI optimization guide, same as #98. *Surface:* M. *Priority:* High. *Flag:* primary-source-confirmed; genuine third-party mentions still help (see #103).
101. **GEO paper: adding statistics, quotations, source citations measurably boosts AI visibility** — Top levers
     in the Princeton/Georgia Tech study (headline "up to 40%"). *Source:* Aggarwal et al., arXiv 2311.09735 (KDD'24), https://arxiv.org/html/2311.09735v3. *Surface:* M. *Priority:* High. *Flag:* peer-reviewed but tested on a 2024 synthetic benchmark, not live 2026 engines — directional.
102. **GEO paper: keyword stuffing HURTS in generative engines (~-9%)** — "Unique words" ~negligible. *Source:*
     Aggarwal et al., same as #101. *Surface:* M. *Priority:* Medium. *Flag:* one study; aligns with Google "synonyms understood, exact-match unnecessary."
103. **Off-site brand mentions correlate with AI citation more than backlinks** — Pursue genuine mentions
     (industry press, directories, forums, YouTube). *Source:* Ahrefs study (reported), https://aiboost.co.uk/chatgpt-ranking-factors-in-2026-what-actually-influences-citations/. *Surface:* Off (supports M). *Priority:* High. *Flag:* contested — single-vendor correlation, figures secondhand.
104. **Answer-first, question-based headings; self-contained passages** — Lead with a direct factual answer;
     headings = customer questions. *Source:* Google AI optimization guide (clear structure) + GEO paper, same
     as #98/#101. *Surface:* M. *Priority:* High. *Flag:* Google endorses structure; "answer-first extractable" emphasis is best-practice, not Google-proven.
105. **Comparison tables, lists, definitional sentences for extractability** — Easy for LLMs to lift. *Source:*
     Search Engine Land, https://searchengineland.com/geo-myths-lies-467617 + GEO paper. *Surface:* M. *Priority:* Medium. *Flag:* emerging/best-practice.
106. **E-E-A-T + demonstrable first-hand experience = biggest AI-visibility lever** — Real project specifics,
     original data, named authors/credentials. *Source:* Google AI optimization guide, same as #98. *Surface:* M. *Priority:* Critical. *Flag:* Google-confirmed direction.
107. **DECIDED: allow AI *search* crawlers, BLOCK *training* crawlers** — In robots.txt ALLOW
     OAI-SearchBot, ChatGPT-User, PerplexityBot, Bingbot, Googlebot, Claude-SearchBot (so engines can cite
     PG); **DISALLOW** the training-only bots GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended.
     Blocking these does NOT remove PG from AI Overviews/AI-search citations (those use core Googlebot/search
     bots). *Source:* OpenAI, https://developers.openai.com/api/docs/bots; Momentic, https://momenticmarketing.com/blog/ai-search-crawlers-bots. *Surface:* M (robots.txt). *Priority:* Critical. *Flag:* RESOLVED — Decision A (allow search / block training).
108. **Each engine sources differently — rank in BOTH Google and Bing** — Google AIO/AI Mode = Google index;
     ChatGPT/Copilot grounded in Bing; Perplexity own index; Gemini = Google. Cross-engine citation overlap is
     low. *Source:* Google blog, https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/; Seer, https://www.seerinteractive.com/insights/87-percent-of-searchgpt-citations-match-bings-top-results. *Surface:* M. *Priority:* High. *Flag:* platform statements primary; overlap %s study-reported.
109. **llms.txt is emerging + largely ignored by major engines — low priority** — Cheap to add but don't expect
     citation lift; Google confirmed it doesn't use it. Avoid paid "GEO file" services. *Source:* Google AI
     optimization guide, same as #98; aeo.press, https://www.aeo.press/ai/the-state-of-llms-txt-in-2026. *Surface:* M. *Priority:* Low. *Flag:* emerging/unproven.
110. **Schema not required for AI search but still worthwhile** — Accurate Organization/LocalBusiness/Service
     reinforces entity understanding. *Source:* Google AI features doc, same as #98. *Surface:* M. *Priority:* Medium. *Flag:* the "FAQ schema = more citations" claim is contested/correlational.
111. **Track AI visibility: GSC Generative-AI report (~launched Jun 3 2026) + Bing Webmaster AI Performance** —
     Plus optional third-party trackers (Profound/Peec/Otterly) for ChatGPT/Perplexity. *Source:* Search Engine
     Land, https://searchengineland.com/google-ai-mode-traffic-data-search-console-457076; Bing Webmaster Blog, https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview. *Surface:* M (measurement). *Priority:* Medium/High. *Flag:* new + limited; third-party tools directional.
112. **MYTHS to avoid** — Paid "llms.txt/GEO file" generation, keyword-density "GEO," "guaranteed AI ranking."
     *Source:* Search Engine Land GEO myths, https://searchengineland.com/geo-myths-lies-467617. *Surface:* M. *Priority:* Medium.
113. **Freshness + multimodal (images/video, esp. YouTube) aid AI surfacing** — Keep cornerstone pages updated;
     add real images/video. *Source:* Google AI optimization guide, same as #98. *Surface:* M + YouTube. *Priority:* Medium. *Flag:* multimodal Google-confirmed; YouTube-correlation vendor-reported.

---

## 7. Local SEO & B2B Fleet-Industry

114. **GBP: configure as a service-area business (SAB), areas by city/county/ZIP** — ≤20 areas, none >~2h drive;
     radius not allowed. *Source:* Google Business Profile Help, https://support.google.com/business/answer/9157481?hl=en. *Surface:* Off. *Priority:* Critical.
115. **GBP: hide the business address (SAB)** — Show service areas only; never use PO box/virtual office
     (suspension risk). *Source:* GBP Help, https://support.google.com/business/answer/2853879?hl=en. *Surface:* Off. *Priority:* Critical.
116. **GBP: most specific primary category** — Single most influential local-pack field (GPS/vehicle-electronics
     or auto-electrical/security-installer fit). *Source:* BrightLocal, https://www.brightlocal.com/learn/google-local-algorithm-and-ranking-factors/. *Surface:* Off. *Priority:* Critical.
117. **GBP: only 2–3 relevant secondary categories** — Over-categorizing trips quality filters. *Source:*
     LocalDominator, https://localdominator.co/google-business-profile-categories/. *Surface:* Off. *Priority:* High.
118. **NAP consistency between site + GBP** — Standardize exact name/phone format everywhere. *Source:*
     BrightLocal, same as #116. *Surface:* M + Off. *Priority:* High.
119. **GBP: post regularly (~2/week)** — Posting frequency is now a top-tier engagement/ranking signal. *Source:*
     SEJ, https://www.searchenginejournal.com/why-dynamic-profiles-are-the-new-local-ranking-factor/568200/. *Surface:* Off. *Priority:* High. *Flag:* recently-changed.
120. **GBP: upload real job/install photos** — Photos → ~42% more direction requests, ~35% more clicks. *Source:*
     TrueFuture Media, https://www.truefuturemedia.com/articles/google-business-profile-optimization-checklist-2026. *Surface:* Off. *Priority:* Medium. *Note:* obey PG's no-client-branding photo rules (Command 0).
121. **GBP: seed + answer Q&A** — Compatibility, downtime/vehicle, multi-site scheduling, warranty. *Source:*
     TrueFuture Media, same as #120. *Surface:* Off. *Priority:* Medium.
122. **GBP: set relevant attributes** — Feed Maps filters + AI summaries (veteran-owned, by-appointment, etc.,
     where truthful). *Source:* digitalapplied, https://www.digitalapplied.com/blog/google-business-profile-guide-every-feature-2026. *Surface:* Off. *Priority:* Low.
123. **GBP: keep hours accurate (open-when-searched is ~#5 factor)** — *Source:* LocalDominator, https://localdominator.co/local-search-ranking-factors/. *Surface:* Off. *Priority:* Medium. *Flag:* recently-changed.
124. **Local model: proximity, relevance, prominence** — For an SAB, optimize relevance + prominence (proximity
     shifts per searcher). *Source:* BrightLocal, same as #116. *Surface:* M + Off. *Priority:* High.
125. **Local pack vs organic are different games** — Pack ≈ GBP (~32%) + reviews (~20%); organic ≈ on-page
     (~33%) + links (~24%). *Source:* BrightLocal, same as #116. *Surface:* M + Off. *Priority:* High.
126. **Reviews live on GBP + third-party (not on-site stars)** — Reviews = #2 local-pack factor (~20%). *Source:*
     BrightLocal, same as #116. *Surface:* Off. *Priority:* Critical. (See #43.)
127. **Review generation: comply with April 2026 policy — no gating/incentives/quotas** — Gemini enforcement
     removing violators at scale. *Source:* Launchcodex, https://launchcodex.com/blog/seo-geo-ai/google-business-profile-review-policy-update/. *Surface:* Off (process). *Priority:* Critical. *Flag:* recently-changed.
128. **Review generation: neutral, equal-opportunity asks** — Post-install follow-up to every account asking for
     "honest feedback on Google." *Source:* Mainstreethost, https://www.mainstreethost.com/blog/google-review-policy-update-april-2026/. *Surface:* Off. *Priority:* High.
129. **Citations: quality over quantity, in authority order** — ~30–50 accurate listings; fix Google → Apple
     Maps → Bing Places → Yelp → Facebook first. *Source:* OnToplist, https://www.ontoplist.com/blog/local-citation-building/. *Surface:* Off. *Priority:* Medium.
130. **Citations: exact-NAP discipline** — One canonical format replicated identically. *Source:* BrightLocal,
     https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/. *Surface:* Off + M. *Priority:* High.
131. **Citations: prioritize B2B/trade/industry portals** — Weight effort to fleet/automotive + B2B listings.
     *Source:* Jasmine Directory, https://www.jasminedirectory.com/blog/local-search-ranking-factors-2026-the-business-directory-edition/. *Surface:* Off. *Priority:* Medium.
132. **Citations feed AI/LLM local visibility (~top-3, ~13%)** — Maintain for AI Overviews/assistants too.
     *Source:* BrightLocal, same as #116. *Surface:* Off. *Priority:* Medium. *Flag:* recently-changed.
133. **Service-area pages: substantive + unique, never doorways** — Real service detail, regional proof/photos,
     local FAQs; thin city-swap boilerplate is penalized. *Source:* Search Engine Land, https://searchengineland.com/local-seo-sprints-a-90-day-plan-for-service-businesses-in-2026-469059. *Surface:* M. *Priority:* High.
134. **Service-area pages: logical state→metro/county hierarchy + internal links** — Pair with distinct service
     pages (GPS / dash cam / ELD install). *Source:* Oneupweb, https://www.oneupweb.com/blog/location-pages-seo/. *Surface:* M. *Priority:* High.
135. **Tell one consistent geographic story across GBP + site + copy** — Name the same specific areas; avoid
     vague "all of the Mid-Atlantic." *Source:* Emarketed, https://emarketed.com/seo/local-seo-2026-service-business-rankings/. *Surface:* M + Off. *Priority:* High.
136. **Dedicated service pages = #1 local-organic factor** — One page per service line. *Source:* BrightLocal,
     same as #116. *Surface:* M. *Priority:* High.
137. **B2B: optimize for low-volume, high-intent long-tail** — "fleet GPS tracker installation for [metro]";
     measure on lead quality, not traffic. *Source:* The Growth Syndicate, https://www.thegrowthsyndicate.com/resources/b2b-seo-strategy-2026. *Surface:* M. *Priority:* High.
138. **B2B: content for a long, multi-stakeholder cycle** — Awareness→consideration→decision; lead-gen path
     (forms/quotes), not e-commerce. *Source:* Mettevo, https://mettevo.com/blog/article/b2b-seo-strategy-in-2026-a-step-by-step-framework-to-drive-leads-and-revenue. *Surface:* M. *Priority:* High.
139. **B2B: track leads by source + pipeline, not sessions** — *Source:* Big Splash, https://www.bigsplashwebdesign.com/seo-b2b-companies/. *Surface:* M + analytics. *Priority:* Medium.
140. **B2B: leverage LinkedIn for reach + SEO** — Active company page + thought-leadership; LinkedIn articles can
     rank on Google. *Source:* Balistro, https://www.balistro.com/linkedin-marketing-strategies-b2b-lead-generation-2026/. *Surface:* Off. *Priority:* Medium.
141. **Industry: list on telematics OEM partner/installer marketplaces** — e.g., Geotab Installer Finder/
     Marketplace — captures vendor-referred demand + authoritative citation. *Source:* Geotab, https://support.geotab.com/installer-finder. *Surface:* Off. *Priority:* High. *Flag:* contested — eligibility may require holding partner/installer certifications (PG has none yet — ties to Command 0 NON-BLOCKING partner status).
142. **Industry: appear in fleet comparison/marketplace listings** — GPS Insight, Expert Market, OEM ecosystems.
     *Source:* Expert Market, https://www.expertmarket.com/fleet-management/telematics-companies. *Surface:* Off. *Priority:* Medium.

---

## Decisions for your review (the flagged items that need YOUR call before approval)

Status of the 7 review decisions:

- **A. AI crawlers (item #107): ✅ RESOLVED** — allow AI *search* bots; **block training-only** bots
  (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended).
- **B. FAQPage / HowTo schema (items #41–#42): ✅ RESOLVED** — write genuinely helpful FAQ *content* (for users
  + AI-answer extraction); do NOT invest in FAQPage/HowTo markup for snippets (rich results removed May 2026).
  Also confirmed: **no self-hosted/fake review stars** — earn real reviews via GBP/third-party later; schema is
  pre-built so real ratings plug in when they exist.
- **C. "Chunking" tension (item #99 vs #104): ✅ RESOLVED** — write clear, answer-first content + genuine FAQ
  content **for people**; question-based headings + self-contained sections are fine, but **no mechanical
  micro-chunking or AI-only formatting**. Structure for humans; AI extraction follows.
- **D. EAA / EU accessibility (item #83): ✅ RESOLVED** — PG is not EU-facing → EAA N/A; target WCAG 2.2 AA anyway.
- **E. hreflang / multilingual (item #11): ✅ RESOLVED** — site is **multilingual (English + Spanish)** →
  hreflang REQUIRED, bilingual content + per-page `lang` attributes planned.
- **F. Geotab/OEM installer directories (item #141): ✅ RESOLVED — PARKED** — defer OEM/installer-marketplace
  listings (Geotab Installer Finder, etc.) and any partner/"certified" badges until manufacturer partner status
  resolves (John pursuing). Revisit when certs land.
- **G. Conformance bar: ✅ RESOLVED** — **WCAG 2.2 AA** across all three surfaces (build + test target).

### Parked & placeholder items (build structure now, populate later)
- **Reviews:** build GBP/third-party **review-display modules as schema-ready placeholders** — no fabricated
  content, no fake stars. Real reviews plug in once earned (post-install follow-up program, Section 7).
- **Partner-dependent (PARKED until partner status):** OEM installer directories/marketplaces; partner/
  "certified"/affiliation badges; any "official partner" language. (Forbidden tier until contracts exist.)
- **Local SEO geography:** target city/suburb list drafted separately → see
  [LOCAL-SEO-TARGETS.md](./LOCAL-SEO-TARGETS.md) (DRAFT for John to confirm/prune to GBP's ≤20 service areas).

## Definition of Complete for Command 1 (U2)

This deliverable is "done" when: (1) every guideline carries a live 2026 citation ✓; (2) each is tagged with
surface applicability + priority ✓; (3) contested/fast-moving items are flagged ✓; (4) the open decisions are
resolved by John ✓ (A–G all resolved); (5) John signs off ✓ (2026-06-04). **All five criteria met — Command 1
COMPLETE & LOCKED.** Guidelines now govern Command 4 (Messaging), Command 5 (Design), and all marketing markup.

---

*Command 1 draft compiled from live research, June 2026. Sources are primary (Google Search Central, web.dev,
W3C WAI, schema.org, OpenAI/Bing/Google blogs, the GEO arXiv paper) wherever possible; secondary/vendor
sources are marked. Review, resolve the decisions, and approve — then we proceed to Command 2.*
