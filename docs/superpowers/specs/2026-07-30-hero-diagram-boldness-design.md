# Hero Diagram Boldness Design

## Goal

Increase the visual authority and readability of the hero system map without
changing its 1360px geometry, rail positions, information structure, or
Framer Motion choreography.

## Visual Weight

- Increase connector strokes from 2px to 2.35px.
- Darken the neutral input wires and strengthen the orange output wires.
- Increase outlined junction radii from 4.4px to 4.8px and solid junction
  radii from 3.8px to 4.1px.
- Increase feature title, description, preview, and engine-label sizes by a
  restrained 5–9%.
- Strengthen feature-card borders and shadows without introducing glow.
- Increase engine candlestick stroke widths while preserving its footprint.

## Architecture

`HERO_DIAGRAM_VISUAL_TOKENS` becomes the visual-weight contract shared by
the SVG network and diagram CSS. `HeroDiagram` exposes the CSS tokens on its
root and uses the same values for SVG attributes, preventing the map from
mixing unrelated line weights.

## Constraints

- Keep the canvas at 1360 by 400.
- Preserve four sources, one engine, and five outcomes.
- Do not move cards, notes, junctions, or connector endpoints.
- Do not change animation timing, path drawing, or packet flow.
- Do not add glow, bounce, new cards, or decorative nodes.

## Verification

- Component tests assert the stronger wire and junction SVG attributes.
- Geometry tests continue to protect every position.
- Browser checks compare wide and 1280px settled states and confirm active
  packets still follow the same curves.
