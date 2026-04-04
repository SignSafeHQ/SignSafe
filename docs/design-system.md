Here's the full SignSafe design system at a glance:

---

## Fonts

| Role | Font | Weights |
|---|---|---|
| Display / Headings | `DM Serif Display` | 400 (italic for emphasis) |
| Body / UI | `Geist` | 300, 400, 500 |
| Code / Mono / Labels | `JetBrains Mono` | 400, 500, 600 |

**Usage pattern:** DM Serif for all `h1`, `h2`, `h3` and big numbers — the editorial serif gives it weight and authority. Geist everywhere else for body copy. JetBrains Mono for anything that feels "technical" — buttons, labels, eyebrows, badges, nav logo, code snippets.

---

## Color Palette

```css
--bg:        #060608   /* page background — near black */
--surface:   #0d0d10   /* cards, panels */
--surface-2: #141418   /* nested surfaces, demo bar */
--border:    #1c1c22   /* primary borders */
--border-2:  #252530   /* secondary borders */

--text:      #f0f0f4   /* primary text */
--muted:     #5a5a6e   /* secondary text */
--muted-2:   #3a3a4a   /* tertiary / disabled */

/* Semantic colors */
--red:       #ef3a3a   /* danger + primary accent */
--red-dim:   #ef3a3a22
--green:     #22c55e   /* safe */
--green-dim: #22c55e18
--amber:     #f59e0b   /* review */
--amber-dim: #f59e0b18
```

The only "brand" color is red — used for the logo, CTAs, and the danger state. Green and amber exist purely for the verdict system, never decoratively.

---

## Typography Scale

```css
h1: clamp(52px, 7vw, 88px) — DM Serif, weight 400, tracking -0.02em, line-height 1.05
h2: clamp(36px, 4vw, 52px) — DM Serif, weight 400, tracking -0.02em, line-height 1.1
h3: 20–22px — DM Serif, weight 400

body: 16px / 1.6
lead: 17px / 1.7, Geist 300, muted color
small/labels: 13–14px
mono labels: 10–11px, letter-spacing 0.1–0.2em, uppercase
```

---

## Key UI Patterns

**Eyebrow labels** — JetBrains Mono, 11px, 0.15em tracking, uppercase, red color, flanked by thin 24px horizontal rules.

**Buttons** — all use JetBrains Mono. Primary = solid red. Ghost = transparent with `--border-2`. Chrome CTA = red border + `--red-dim` background, inverts on hover.

**Panels/Cards** — `--surface` background, `--border` 1px border, 14–16px border-radius. Nested content uses `--surface-2`.

**Badges** — dim background + matching colored border + mono text at 11px weight 600.

**Nav** — 64px height, `rgba(6,6,8,0.88)` with `backdrop-filter: blur(20px)`.

**Glows** — `radial-gradient` ellipses at 6–8% opacity, never distracting.

**Animations** — `scan` bar (gradient sweep), `pulse` dot, `fade` transitions. Everything subtle, functional, never decorative for its own sake.