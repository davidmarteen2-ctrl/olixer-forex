# Hero Diagram Boldness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing full-bleed hero diagram visually bolder without changing layout or motion.

**Architecture:** Add a shared visual-token object beside the existing geometry contract. `HeroDiagram` uses those tokens for SVG attributes and publishes typography and surface tokens as CSS custom properties consumed by the existing diagram styles.

**Tech Stack:** React 19, Framer Motion 12, SVG, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Keep the canvas at 1360 by 400.
- Preserve all rail and engine coordinates.
- Preserve four inputs, five outputs, and all Motion timing.
- Increase visual weight without glow or layout growth.
- Work in the current dirty workspace and do not commit unrelated changes.

---

### Task 1: Tested Boldness Contract

**Files:**
- Modify: `src/components/hero-diagram/hero-diagram-geometry.js`
- Modify: `src/components/hero-diagram/HeroDiagram.jsx`
- Modify: `src/components/hero-diagram/HeroDiagram.test.jsx`

**Interfaces:**
- Produces: `HERO_DIAGRAM_VISUAL_TOKENS`.
- Consumes: the existing `HERO_DIAGRAM_GEOMETRY`, curves, and Motion selectors.

- [ ] **Step 1: Add failing component assertions**

Assert 2.35px wire strokes, 4.8px outlined junctions, 4.1px solid
junctions, and root typography custom properties.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx`

- [ ] **Step 3: Implement the visual-token contract**

Add the approved numeric and colour values, apply them to SVG attributes,
and expose typography and surface values on the diagram root.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx`

### Task 2: Apply Bolder Surfaces and Typography

**Files:**
- Modify: `index.html`
- Modify: `src/components/FeatureRail.css`

**Interfaces:**
- Consumes: CSS custom properties published by `HeroDiagram`.
- Produces: bolder source cards, engine, outcome rows, previews, and labels.

- [ ] **Step 1: Replace diagram literals with visual tokens**

Use the published custom properties for feature titles, descriptions,
preview copy, borders, shadows, and engine labels while preserving every
layout measurement.

- [ ] **Step 2: Run focused and full verification**

Run:

```bash
npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx src/components/hero-diagram/hero-diagram-geometry.test.js
npm test -- --run
npm run build
```

- [ ] **Step 3: Verify both desktop states in the browser**

At 1920px and 1280px, confirm stronger hierarchy, unchanged geometry, no
horizontal overflow, and active packet movement on the existing paths.
