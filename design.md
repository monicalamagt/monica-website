# Design — Monica Lama Portfolio

Locked design system for the live homepage (`index.html`). Future Hallmark
runs read this file first; pages defer to it. Amend intentionally — the
file is the rule.

## System
- Genre · modern-minimal (Stripe/Linear/dev-tool school — signalled by the bio's API/platform/developer-tool vocabulary)
- Macrostructure · Bento Grid — a centered fixed-height hero band, then an asymmetric grid of mixed-span tiles (bio, education, work history, skills, contact)
- Theme · catalog: Cobalt — cool engineered near-white paper, one electric-cobalt signal accent, hairline-bordered surfaces
- Axes · paper-band: light (~98.5% L) / display-style: grotesk-sans (Space Grotesk) / accent-hue: cool-blue (~256°)

## Tokens (canonical · `hallmark-redesign-tokens.css` is the source of truth)
```css
:root {
  --color-paper:        oklch(98.5% 0.004 250);
  --color-paper-2:      oklch(96.5% 0.006 252);
  --color-graphite:     oklch(22%   0.016 260); /* code-card dark band */
  --color-ink:          oklch(24%   0.02  258);
  --color-ink-2:        oklch(34%   0.018 257);
  --color-muted:        oklch(54%   0.014 256);
  --color-rule:         oklch(90%   0.010 254);
  --color-accent:       oklch(58%   0.20  256);
  --color-accent-ink:   oklch(99%   0.003 250);
  --color-focus:        var(--color-accent);

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace; /* code card, kbd hints, stats only — 2-slot outlier */

  /* 4-pt canonical spacing scale: --space-3xs … --space-4xl. See hallmark-redesign-tokens.css. */

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 180ms;  --dur-base: 280ms;  --dur-slow: 450ms;

  --radius-control: 6px;  --radius-card: 10px;
}
```

## CTA voice
- Primary · solid cobalt fill, `--color-accent-ink` text, 6px radius (`.btn--accent`, `#sendButton`)
- Secondary · text link + hairline underline, hover/focus = accent colour shift (`.contact-link`, `.nav__links a`)

## Motion stance
- Three primitives, capped per the diversification rule: hero code-card type-in (one-shot), bento-tile stagger reveal (one-shot, IntersectionObserver), hover/focus border-colour shift.
- Reduced-motion fallback implemented for all three; see `hallmark-redesign.css` bottom block.
- Nav ships a real working ⌘K command palette (Cobalt's signature move) — not decorative.

## Exports
`hallmark-redesign-tokens.css` (this project) is the source of truth. For
Tailwind v4 `@theme`, DTCG `tokens.json`, or shadcn/ui CSS variables, ask
for those formats and Hallmark will append them.

## Notes
- **This file describes `index.html` only.** Six linked project-detail pages — `project-alpha.html`, `design-system.html`, `mobile-app.html`, `api-platform.html`, `data-visualization.html`, `chat.html` — still use the *original* warm-parchment system (`styles.css` / `tokens.css` at the project root) and are no longer linked from the live homepage (the Bento redesign shows project detail inline in tiles instead of separate pages). They still deploy and are reachable by direct URL. Migrating or retiring them is a separate, unstarted task.
- The original homepage design (palette, fonts, poker game, liquid-blob skill visualization) is fully preserved in `old-site-backup/` and tagged `old-design-v1` in git — not deleted, just no longer live.
- Contrast on the Cobalt palette was checked by OKLCH lightness-gap heuristic, not full APCA computation — worth verifying precisely if this system gets extended.
