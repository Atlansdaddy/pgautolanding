import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { tokens } from '../dist/theme';

// Tests the GENERATED output of the token pipeline (Command 11 T0.2; Command 5 §B).
// turbo runs `build` before `test` (packages/tokens/turbo.json), so dist/ exists.
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, '../dist/tokens.css'), 'utf8');

// The exact Command 0 brand palette. Style Dictionary's css color transform normalizes
// hex to lowercase — the color is identical; we assert case-insensitively.
const BRAND_HEXES: Record<string, string> = {
  'PG Blue': '#2D8FCC',
  'PG Dark Navy': '#1A1A2E',
  'Action Orange': '#FF6B35',
  'PG Sky': '#E8F4FD',
  Charcoal: '#333333',
  White: '#FFFFFF',
};

describe('@pg/tokens — generated CSS custom properties', () => {
  it('contains every exact brand hex', () => {
    const lower = css.toLowerCase();
    for (const [name, hex] of Object.entries(BRAND_HEXES)) {
      expect(lower, `${name} (${hex}) missing from tokens.css`).toContain(hex.toLowerCase());
    }
  });

  it('exposes the required semantic + component CSS variables', () => {
    const required = [
      '--pg-brand-primary',
      '--pg-brand-dark',
      '--pg-action',
      '--pg-surface-default',
      '--pg-surface-subtle',
      '--pg-text-default',
      '--pg-text-on-brand',
      '--pg-font-display',
      '--pg-font-body',
      '--pg-cta-primary-background',
      '--pg-eyebrow-text',
    ];
    for (const v of required) {
      expect(css, `${v} missing from tokens.css`).toContain(v);
    }
  });

  it('matches the locked snapshot', () => {
    expect(css).toMatchSnapshot();
  });
});

describe('@pg/tokens — TS theme', () => {
  it('resolves semantic tokens to exact brand values', () => {
    expect(tokens.brand.primary).toBe('#2d8fcc');
    expect(tokens.brand.dark).toBe('#1a1a2e');
    expect(tokens.action).toBe('#ff6b35');
    expect(tokens.surface.default).toBe('#ffffff');
    expect(tokens.surface.subtle).toBe('#e8f4fd');
    expect(tokens.text.default).toBe('#333333');
  });

  it('sets the brand fonts', () => {
    expect(tokens.font.display).toContain('Montserrat');
    expect(tokens.font.body).toContain('Open Sans');
  });

  // Brand law (Command 5 §B/§D): Action Orange is a ~10% focal accent only — never a
  // surface/background, and barred from body text (fails contrast). Guard it here.
  it('keeps Action Orange out of surfaces and body text', () => {
    expect(tokens.surface.default).not.toBe(tokens.action);
    expect(tokens.surface.subtle).not.toBe(tokens.action);
    expect(tokens.text.default).not.toBe(tokens.action);
  });
});
