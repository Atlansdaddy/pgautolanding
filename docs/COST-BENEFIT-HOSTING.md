# Hosting Cost-Benefit — Cloudflare Workers Paid vs. existing DO droplets (June 2026)

> Requested during Command 3. **U1:** all figures verified against live June 2026 pricing pages (cited).
> **Context:** John already owns DigitalOcean droplets (sunk cost) that can be linked to Cloudflare via a
> **free Cloudflare Tunnel**. Question: what runs where, and is Workers Paid worth confirming?

> **SCOPE NOTE (2026-06-05): NO gaussian splats / GPU work.** The signature 3D is the interactive three.js
> **"Build Your Protection" risk-profile marketing tool** (`build-your-protection.html`), built to run **without**
> splats. So the GPU-droplet analysis below is **moot/out of scope** and kept only for reference.

## Bottom line (recommendation)
**Hybrid.** Confirm **Workers Paid ($5/mo)** for the edge (surfaces + 7 services + media-access + edge auth),
and **repurpose the existing DO droplets (via free Tunnel) for any long-running compute** (telematics ingestion)
instead of paying per-use for Cloudflare Containers. Net *new* spend is ≈ **$5/mo + small R2/Neon** — the droplets
you already pay for absorb the heavy jobs. **No GPU needed (no splats).** This **refines Command 2 decision #4**:
long jobs → **DO droplets first** (owned), Cloudflare Containers only as a secondary option for bursty edge jobs.

---

## The numbers (cited)

**Cloudflare**
- **Workers Paid:** **$5/mo**, includes **10M requests + 30M CPU-ms**; overage $0.30/M req, $0.02/M CPU-ms.
  (Free plan: 100k req/day, **10 ms CPU cap** → can't do Argon2id.) *Source:* https://developers.cloudflare.com/workers/platform/pricing/
- **Hyperdrive:** **$0** (included on Paid). *Source:* https://developers.cloudflare.com/hyperdrive/platform/pricing/
- **R2:** $0.015/GB-mo, **$0 egress**, 10 GB free; Class A $4.50/M, Class B $0.36/M. *Source:* https://developers.cloudflare.com/r2/pricing/
- **Containers:** per-10ms; **375 vCPU-min + 25 GiB-hr/mo included**, then $0.000020/vCPU-s + $0.0000025/GiB-s; needs Paid. *Source:* https://developers.cloudflare.com/containers/pricing/
- **KV / Queues / Durable Objects:** ample free/low tiers (1M-10M ops included) — pennies at our scale. *Source:* Workers pricing (above).
- **Tunnel (cloudflared):** **FREE** — standard way to put a DO droplet behind Cloudflare. **Zero Trust/Access: free ≤50 users**, then $7/user/mo. *Source:* https://www.cloudflare.com/plans/zero-trust-services/ *(verify $7 in dashboard — page is JS-rendered.)*

**DigitalOcean (already owned — sunk cost)**
- **Basic droplets:** $4 (512MB/1vCPU), $6 (1GB), $12 (2GB), $18 (2GB/2vCPU), $24 (4GB/2vCPU), $48 (8GB/4vCPU). *Source:* https://www.digitalocean.com/pricing/droplets
- **CPU-Optimized:** $42 (4GB/2vCPU) → $168 (16GB/8vCPU) — for steady telematics/compute.
- **GPU droplets** — *OUT OF SCOPE (no gaussian splats).* Kept for reference: RTX 4000 Ada $0.76/GPU-hr, etc. *Source:* https://www.digitalocean.com/pricing/gpu-droplets
- **Spaces:** $5/mo (250 GiB + 1 TiB transfer), **$0.01/GiB egress over** — *loses to R2's $0 egress for served media.*

---

## Workload-by-workload (where each runs and why)

| Workload | Run on | Why | ~Cost |
|---|---|---|---|
| Marketing site + 3 app surfaces (static/SSR) | **Workers Static Assets** | Edge, ~0 cold start, autoscale, no servers | in $5 base |
| 7 API microservices (CRUD/auth/sync) | **Workers (TS/Hono)** | Edge latency, autoscale, service bindings | in $5 base |
| **Password hashing (Argon2id)** | **Workers Paid** | 30M CPU-ms = ~300k hashes/mo free; B2B login volume is tiny → effectively $0. Simpler than offloading. | ~$0 |
| Relational access (Neon) | **Hyperdrive→Neon** | Pooling free on Paid | $0 (Neon sep.) |
| Media (install photos) | **R2** | $0 egress beats DO Spaces; served cheaply | ~$0–few |
| **Long-running telematics ingestion** | **DO droplet (owned) via Tunnel** | Steady/always-on; uses sunk cost; no per-use Container fee | $0 marginal* |
| Bursty/short edge jobs | CF Containers (option) | Per-10ms; good when no droplet fits | usage |
| ~~Gaussian splat processing~~ | **OUT OF SCOPE** | No splats — interactive three.js tool only | $0 |
| Async (notifications, photo post-processing) | **Queues** | Decoupled; 1M ops free | ~$0 |
| Live panel / real-time | **Durable Objects** | Stateful coordination; free tier ample | ~$0 |
| Origin/admin protection | **Tunnel + Zero Trust** | Free ≤50 users; no public origin exposure | $0 |

*\*marginal = the droplet is already paid for; this avoids new Cloudflare Container spend.*

---

## Should we offload password hashing to a DO droplet instead of Workers Paid?
**No (at this scale).** Argon2id on Workers Paid is ~100 ms CPU/hash and the included 30M CPU-ms covers
~300k logins/mo before any overage (then ~$0.000002/hash). Offloading to a droplet adds a network hop,
a server to secure/patch, and a single point of failure for auth — not worth it for B2B login volumes.
*Revisit only if hashing volume ever becomes very high.*

## Net monthly cost (rough)
| Item | Cost |
|---|---|
| Workers Paid (base, low usage) | **$5** |
| Hyperdrive | $0 |
| R2 (photos, modest) | ~$1–5 |
| KV/Queues/DO/Tunnel/Zero Trust | ~$0 (free tiers) |
| Neon Postgres | free tier → ~$19 launch (separate) |
| DO droplets (already owned) | sunk — repurposed for heavy/long jobs |
| DO GPU (splats) | $0 — out of scope (no splats) |
| **New marginal platform spend** | **≈ $5–10/mo + Neon** |

---

## Decision this asks for
1. **Confirm Workers Paid ($5/mo)** as the edge tier (unlocks edge Argon2id + Hyperdrive + the stack). *(Recommend yes.)*
2. **Long-running jobs → existing DO droplets (Tunnel)**, Cloudflare Containers demoted to secondary. **No GPU/
   splats (out of scope).** *(Recommend yes — refines Command 2 #4, uses sunk cost.)*

*Verified June 2026 pricing; re-check exact figures at provisioning. R2 vs Spaces ($0 egress) is the decisive
delta. GPU/splat analysis retained for reference only — not in scope.*
