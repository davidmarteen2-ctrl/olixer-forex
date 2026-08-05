# Reference Diagram Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Motion-powered hero diagram match the supplied reference's exact content structure and compact visual composition.

**Architecture:** Keep `HeroDiagram` as the single React and Framer Motion owner. Correct its rendered content first, then refine only diagram-scoped CSS and existing diagram layout rules. Preserve the current mount, responsive scaling, and Motion timeline.

**Tech Stack:** React 19, Framer Motion 12, Lucide React, SVG, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- The supplied diagram screenshot is the sole visual source of truth.
- Change only the diagram inside `.diagram-outer`.
- Remove the EUR/USD card and its upper dashed connector.
- Preserve four source rows, one Signal Engine, one Smart Signal card, and five outcome rows.
- Preserve the existing Framer Motion choreography.
- Use `High Confidence`, `Entry 195.842`, `SL 196.850`, `TP 194.820`, and `Open Positions 8`.
- Do not change navbar, hero copy, CTAs, avatars, partner marquee, or later sections.

---

### Task 1: Reference Content and Structure

**Files:**
- Modify: `src/components/hero-diagram/HeroDiagram.test.jsx`
- Modify: `src/components/hero-diagram/HeroDiagram.jsx`
- Modify: `src/components/FeatureRail.test.jsx`
- Modify: `src/components/FeatureRail.jsx`
- Modify: `src/components/hero-diagram/hero-motion-timeline.test.js`
- Modify: `src/components/hero-diagram/hero-motion-timeline.js`

**Interfaces:**
- `HeroDiagram({ reducedMotionOverride })` continues to render the complete network.
- `buildHeroMotionSequence()` no longer includes a market-card stage.
- `FeatureRail` continues to expose five Motion-managed outcome rows.

- [ ] **Step 1: Write failing parity assertions**

```jsx
expect(screen.queryByText("EUR/USD")).toBeNull();
expect(container.querySelectorAll(".wire.f")).toHaveLength(1);
expect(screen.getByText("High Confidence")).toBeTruthy();
expect(screen.getByText("SL")).toBeTruthy();
expect(screen.getByText("TP")).toBeTruthy();
expect(screen.getByText("8")).toBeTruthy();
```

- [ ] **Step 2: Run focused tests and confirm failures**

Run:

```bash
npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx src/components/FeatureRail.test.jsx src/components/hero-diagram/hero-motion-timeline.test.js
```

- [ ] **Step 3: Remove non-reference content**

Delete `MarketCard`, remove the upper dashed SVG path, remove the
`market-card` timeline stage, update Smart Signal status/level labels, and
change Portfolio Insights from `5` to `8`.

- [ ] **Step 4: Run focused tests and confirm they pass**

Run the focused command from Step 2.

### Task 2: Reference Shells and Composition

**Files:**
- Modify: `src/components/FeatureRail.css`
- Modify: `src/components/hero-diagram/HeroDiagram.css`
- Modify: `index.html`

**Interfaces:**
- Existing class names remain stable.
- `.feat.left` and `.diagram-feature-root .feature-row` gain reference-style
  inset row shells using pseudo-elements.
- `.diagram-outer` moves upward without changing adjacent content.

- [ ] **Step 1: Add reference-parity CSS**

Input and outcome shells use an inset `::before` layer so their circular icons
protrude from the left edge. Reduce border and shadow weight, align copy and
previews, and move the diagram upward to the social-proof baseline.

- [ ] **Step 2: Build and inspect at 1440px**

Run `npm run build`, then compare the settled browser state with the supplied
reference.

- [ ] **Step 3: Refine only measured parity differences**

Adjust diagram-scoped width, height, row offsets, and gaps. Do not change
global tokens or hero content.

### Task 3: Verification

**Files:**
- Test: `src/components/hero-diagram/HeroDiagram.test.jsx`
- Test: `src/components/FeatureRail.test.jsx`
- Test: `src/components/hero-diagram/hero-motion-timeline.test.js`

**Interfaces:**
- No new production interface.

- [ ] **Step 1: Run complete automated verification**

```bash
npm test -- --run
npm run build
git diff --check
```

- [ ] **Step 2: Run browser verification**

Confirm the final structure, Motion entrance, no console errors, and no
horizontal overflow at 1440px, 1280px, 1024px, 768px, 430px, and 375px.
