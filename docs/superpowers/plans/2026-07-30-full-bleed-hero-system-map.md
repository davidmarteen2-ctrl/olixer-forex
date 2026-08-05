# Full-Bleed Hero System Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Widen the hero network canvas so both rails use more desktop space while every connector and Motion packet remains attached.

**Architecture:** A focused geometry module becomes the single source of truth for the 1360px canvas, rail coordinates, center components, curves, junctions, and notes. `HeroDiagram` composes named rail and connector components from that geometry while retaining its existing Framer Motion timeline.

**Tech Stack:** React 19, Framer Motion 12, SVG, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Preserve four source cards, one engine, and five outcome rows.
- Keep the engine centered at x=680 on a 1360px canvas.
- Move both rails outward without changing their card sizes or copy.
- Keep Framer Motion as the sole animation owner for diagram elements.
- Preserve reduced-motion behavior.
- Work in the user's current dirty workspace because this change depends on uncommitted hero work; do not commit or modify unrelated files.

---

### Task 1: Shared System-Map Geometry

**Files:**
- Create: `src/components/hero-diagram/hero-diagram-geometry.js`
- Create: `src/components/hero-diagram/hero-diagram-geometry.test.js`

**Interfaces:**
- Produces: `HERO_DIAGRAM_GEOMETRY`, `inputCurves`, `outputCurves`, `inputJunctions`, `outputJunctions`, and `curveToPath(curve)`.
- Consumes: literal 1360x400 layout measurements derived from the approved design.

- [ ] **Step 1: Write the failing geometry tests**

Assert the 1360px stage width, x=680 engine center, x=0 source rail,
x=1044 outcome rail, and two junctions per curve.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/hero-diagram/hero-diagram-geometry.test.js`

- [ ] **Step 3: Implement the geometry module**

Represent each cubic curve as `{ start, control1, control2, end }`. Generate
SVG `d` strings with `curveToPath()` and calculate junctions from cubic
points so the circles cannot drift off their paths.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/components/hero-diagram/hero-diagram-geometry.test.js`

### Task 2: Widen and Compose the Diagram

**Files:**
- Modify: `src/components/hero-diagram/HeroDiagram.jsx`
- Modify: `src/components/hero-diagram/HeroDiagram.test.jsx`
- Modify: `src/components/FeatureRail.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: every export from `hero-diagram-geometry.js`.
- Produces: the existing default `HeroDiagram({ reducedMotionOverride })` component with a 1360px full-bleed stage.

- [ ] **Step 1: Write failing component assertions**

Assert the SVG viewBox is `0 0 1360 400`, the engine center is 680px, the
source rail begins at 0, and the outcome rail begins at 1044px.

- [ ] **Step 2: Run the focused component test and confirm it fails**

Run: `npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx`

- [ ] **Step 3: Update the React composition**

Add `SourceRail` and `OutcomeRail` composition functions, consume shared
geometry for all positioned elements, and render paths and junctions from
the geometry module. Keep all existing Motion selectors and packet path IDs.

- [ ] **Step 4: Update the breakout and responsive CSS**

Set the stage and diagram widths to 1360px, move `.diagram-feature-root` to
the geometry-defined outcome x coordinate, and adjust scale factors so the
map stays within smaller viewports.

- [ ] **Step 5: Run focused and full verification**

Run:

```bash
npm test -- --run src/components/hero-diagram/hero-diagram-geometry.test.js src/components/hero-diagram/HeroDiagram.test.jsx
npm test -- --run
npm run build
```

- [ ] **Step 6: Verify in the browser**

On a fresh load at wide desktop and 1280px, confirm both rails are farther
from the engine, all circles sit on their curves, packets travel on the new
paths, the partner bar remains below the map, and the document has no
horizontal overflow.
