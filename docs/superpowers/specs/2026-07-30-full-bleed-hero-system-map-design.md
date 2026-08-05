# Full-Bleed Hero System Map Design

## Goal

Use more of the available desktop width by moving the existing source and
outcome rails outward while keeping the signal engine perfectly centered.

## Architecture

`HeroDiagram` remains the public component and acts as the full-bleed system
map. A shared geometry module owns the 1360 by 400 canvas, source rail,
center engine, outcome rail, SVG curves, junction points, notes, and signal
card coordinates. `SourceRail`, `ConnectorNetwork`, `SignalEngine`, and
`OutcomeRail` consume that geometry so no visual layer can drift away from
the others.

## Layout

- Expand the desktop canvas from 1192px to 1360px.
- Keep the four source cards and five outcome cards at their current sizes.
- Move the source rail 84px farther left and the outcome rail 84px farther
  right relative to the viewport center.
- Center the 108px signal engine at x=680.
- Preserve the current 400px diagram height and vertical row positions.
- Keep the existing responsive scale breakpoints so the widened map fits
  smaller viewports without introducing horizontal scrolling.

## Motion

Framer Motion continues to own card entrances, SVG path drawing, junction
reveals, and moving packets. The widened paths must remain the exact paths
used by the packet controller. Reduced motion continues to render the final
settled system map without packets.

## Constraints

- Do not add filler cards or decorative nodes.
- Preserve the four-input, one-engine, five-outcome information model.
- Do not change hero copy, navigation, partner bar, card typography, or
  feature preview content.
- Preserve the current left-to-right animation choreography.

## Verification

- Geometry tests assert a 1360px canvas, centered engine, outer rail
  positions, and junctions lying on their associated curves.
- Component tests assert four sources and five outcomes.
- Browser verification covers wide desktop, scaled desktop, no horizontal
  overflow, settled alignment, and animated packet paths.
