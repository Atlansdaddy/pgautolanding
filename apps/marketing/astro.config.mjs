import { defineConfig } from 'astro/config';

// Static output (default) — Astro prerenders every route and Cloudflare Workers
// Static Assets serves dist/. No Cloudflare adapter needed; the only dynamic concern
// (quote submission) is a separate Worker, svc-leads (Command 2 / U1 / T6.2).
// i18n (en + es), islands, and integrations are configured in T1.1.
export default defineConfig({
  site: 'https://pgautoinstalls.com',
});
