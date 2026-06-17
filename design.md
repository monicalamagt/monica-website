# Design — Monica Lama Portfolio

Locked design system, extracted from the existing hand-built site (not a
prior Hallmark build). Future Hallmark runs read this file first; pages
defer to it. Amend intentionally — the file is the rule.

## System
- Genre · blended — editorial/professional tone (academic + quant-finance credentials) with a playful centerpiece (hand-built poker-deal interaction, liquid-blob skill visualization). Doesn't map cleanly to one catalog genre; treat as its own thing rather than forcing a label.
- Macrostructure · Custom — Scroll-Snap Narrative: 5 full-viewport, snap-locked sections (Hero → About/Chat → Projects/Poker → Skills/Blobs → Contact). No catalog macrostructure matches this shape.
- Theme · custom (vibe: "warm parchment, espresso brown, quiet violet accent")
- Axes · paper-band: light (~92% L) / display-style: system-sans, no display pairing / accent-hue: cool-violet (~300°)

## Tokens (canonical · `tokens.css` is the source of truth)
```css
:root {
  --color-paper:        oklch(91.7% 0.016 86.4);  /* #E8E3D8 */
  --color-paper-2:      oklch(96.2% 0.007 80.7);  /* #F5F2ED */
  --color-night:        oklch(24.1% 0.038 51.1);  /* #2E1A0E — poker page */
  --color-ink:          oklch(39.9% 0.045 45.9);  /* #5C4033 */
  --color-ink-2:        oklch(27.9% 0.052 48.4);  /* #3D2010 */
  --color-accent:       oklch(48.2% 0.114 302.5); /* #6B4C93 */
  --color-accent-vivid: oklch(60.6% 0.219 292.7); /* #8B5CF6 — chips/blobs */
  --color-focus:        var(--color-ink);

  --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono:    "Georgia", "Times New Roman", serif; /* poker monogram only */

  /* 4-pt-ish spacing scale, named: --space-3xs … --space-2xl. See tokens.css. */

  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 200ms;  --dur-base: 300ms;  --dur-slow: 400ms;

  --radius-card: 16px;  --radius-pill: 50%;  --radius-input: 8px;
}
```

## CTA voice
- Primary · solid ink-brown fill, white text, 8px radius (`#sendButton`)
- Secondary · text link + arrow glyph, hover = padding-shift (`.contact-link`)

## Motion stance
- Hand-rolled CSS keyframes + vanilla Three.js — no animation library ("motion-cut" in Hallmark's terms, despite being motion-rich).
- `prefers-reduced-motion` is handled for the poker-deal sequence; not yet applied to the liquid-blob shimmer or modal scale transition.

## Exports
`tokens.css` (this project) is the source of truth. For Tailwind v4 `@theme`,
DTCG `tokens.json`, or shadcn/ui CSS variables, ask for those formats and
Hallmark will append them.

## Notes
- No real display/body font pairing exists today — every heading and body line uses the system-ui stack. This file locks that as-is rather than introducing a new face; say so if you want one.
- Spacing has no formal scale today; the tokens above are the closest match to values already in use (0.3rem–4rem), not a retrofit.
- Most transitions use the browser default `ease`, not `--ease-out` — only the modal and bubble-label transitions use the named curve. Locked as observed, not cleaned up.
- `tokens.css` is additive only. `styles.css` still has its original literal hex/rem values — wiring it to consume these tokens is a separate, larger edit, not done here.
