# Surface Pattern System Design

## Goal

Make Olixer's dots and grids read as a deliberate surface language rather
than interchangeable decoration. Patterns must communicate the role of a
section, preserve text and image clarity, and share one spacing family across
desktop and mobile.

## Design Decision

Use three named surface styles:

1. **Plain** — quiet editorial and decision surfaces. No pattern.
2. **Product dots** — bounded diagrams and interactive product canvases.
3. **Market grid** — full-bleed market/data stages where a larger coordinate
   system reinforces the content.

The styles use a 12/24/72px spacing family: 12px compact dots, 24px standard
dots, and a 72px macro grid. Pattern color and opacity come from shared CSS
custom properties instead of component-specific values.

## Section Mapping

| Surface | Style | Treatment |
| --- | --- | --- |
| Hero mobile diagram | Product dots, compact | 12px dots contained inside the diagram stage |
| Card Shuffle | Market grid | 72px grid with a radial center mask |
| How It Works preview | Product dots | 24px dots with a directional mask inside the dark preview only |
| Stats | Plain | Remove the repeated section grid; rules and figures provide structure |
| Signal Stack | Product dots | 24px dots, softly masked inside the interactive stack |
| Pricing | Plain | Remove the decorative selector grid so plan selection stays quiet |
| CTA | Product dots | 24px dots, faded beneath the card and orbiting objects |
| Footer | Plain | Remove the repeated dots and retain a clean dark closing surface |

Tablet hero surfaces remain plain because their chips, connectors, and data
panels already supply enough structure.

## CSS Architecture

Add shared pattern tokens beside the existing global color and spacing tokens:

- `--pattern-step-compact: 12px`
- `--pattern-step-dot: 24px`
- `--pattern-step-grid: 72px`
- light- and dark-surface pattern ink values
- standard subdued and quiet opacity values

Existing component pseudo-elements continue to own their local masks and
layering. They consume the shared tokens for size, ink, and opacity. This
avoids a global utility pseudo-element colliding with components that already
use `::before` for clipping or visual effects.

Every patterned surface keeps its content above the pattern layer through the
existing isolation and z-index structure. Patterns never sit directly behind
long-form copy without a fade mask.

## Responsive Behavior

- Compact mobile diagrams use 12px dots so the pattern retains its scale
  relationship without becoming coarse.
- Standard bounded product canvases keep 24px dots at every breakpoint.
- The 72px market grid reduces in opacity on mobile rather than changing
  scale, preserving visual identity without adding noise.
- Plain surfaces remain plain at every breakpoint.

## Constraints

- Do not add patterns outside the surfaces explicitly named in the section
  mapping.
- Do not combine dots and grids on the same surface.
- Do not use patterns as generic decoration outside a real data or product
  canvas.
- Preserve all section layout, animation, imagery, copy, and interaction
  behavior.
- Keep pattern layers non-interactive and excluded from accessibility output.

## Verification

- Component and stylesheet tests protect the approved surface mapping and
  shared 12/24/72 spacing family.
- Production build confirms all CSS remains valid across the multi-entry Vite
  page.
- Browser review covers the complete desktop rhythm plus mobile Card Shuffle,
  hero diagram, Signal Stack, Pricing, CTA, and footer surfaces.
- Confirm patterns never reduce text contrast or create horizontal overflow.
