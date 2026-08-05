# Hero Diagram Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing hero diagram as one React surface whose entrance, SVG signal flow, outcome reveals, idle packets, and reduced-motion state are owned by Framer Motion.

**Architecture:** `HeroDiagram.jsx` owns the source cards, SVG connector network, engine, market cards, and the existing `FeatureRail`. A focused `hero-motion-timeline.js` module defines the stage order and starts Motion-driven packets, while `HeroDiagram` uses `useAnimate` for the scoped entrance sequence. `index.html` retains only the React mount point and layout shell.

**Tech Stack:** React 19, Framer Motion 12, Lucide React, SVG, Vitest, Testing Library, Vite.

## Global Constraints

- Preserve the current hero diagram geometry, content, colours, typography, and compact feature rail.
- Use `[0.22, 1, 0.36, 1]` for entrance easing.
- Use 80ms source and outcome stagger.
- Use only transforms and opacity for card entrances.
- Use Motion `pathLength` for connector line drawing.
- Disable path drawing, pulse, packets, and delayed visibility under reduced motion.
- Do not let CSS and Framer Motion animate the same diagram element.
- Do not change the navbar, hero copy, partner bar, or adjacent sections.

---

### Task 1: Motion Timeline Contract

**Files:**
- Create: `src/components/hero-diagram/hero-motion-timeline.js`
- Create: `src/components/hero-diagram/hero-motion-timeline.test.js`

**Interfaces:**
- Produces: `HERO_EASE`, `HERO_MOTION_TIMING`, `buildHeroMotionSequence()`, and `startSignalPacketFlow(root, animateValue)`.
- Consumes: Framer Motion sequence syntax and an `animateValue` function compatible with `animate(0, 1, options)`.

- [ ] **Step 1: Write the failing timeline-order test**

```js
import {
  buildHeroMotionSequence,
  HERO_MOTION_TIMING,
} from "./hero-motion-timeline.js";

it("orders inputs before engine, outputs, and outcome details", () => {
  const sequence = buildHeroMotionSequence();
  expect(sequence.map(([selector]) => selector)).toEqual([
    "[data-motion='source']",
    "[data-motion='input-wire']",
    "[data-motion='engine']",
    "[data-motion='market-card']",
    "[data-motion='signal-card']",
    "[data-motion='output-wire']",
    "[data-motion='outcome-icon']",
    "[data-motion='outcome-copy']",
    "[data-motion='outcome-preview']",
    "[data-motion='junction']",
  ]);
  expect(HERO_MOTION_TIMING.stagger).toBe(0.08);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails because the module does not exist**

Run: `npm test -- --run src/components/hero-diagram/hero-motion-timeline.test.js`

- [ ] **Step 3: Implement the sequence constants and packet controller**

`buildHeroMotionSequence()` returns a Motion sequence with exact absolute `at`
times. `startSignalPacketFlow()` maps each packet to its referenced SVG path,
uses `getTotalLength()` / `getPointAtLength()`, and returns a cleanup function
that stops every Motion animation control.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/components/hero-diagram/hero-motion-timeline.test.js`

### Task 2: React Hero Diagram

**Files:**
- Create: `src/components/hero-diagram/HeroDiagram.jsx`
- Create: `src/components/hero-diagram/HeroDiagram.test.jsx`
- Create: `src/components/hero-diagram/HeroDiagram.css`
- Modify: `src/components/FeatureRail.jsx`
- Modify: `src/components/FeatureRail.css`

**Interfaces:**
- Consumes: `buildHeroMotionSequence()`, `startSignalPacketFlow()`, and `FeatureRail`.
- Produces: `HeroDiagram({ reducedMotionOverride })`.
- `FeatureRail` adds `motionManaged` and `reducedMotion` props; default standalone rendering remains visible.

- [ ] **Step 1: Write the failing structure and ownership tests**

```jsx
render(<HeroDiagram reducedMotionOverride />);
expect(screen.getAllByTestId("source-card")).toHaveLength(4);
expect(screen.getAllByTestId("input-wire")).toHaveLength(4);
expect(screen.getAllByTestId("output-wire")).toHaveLength(5);
expect(screen.getAllByRole("listitem")).toHaveLength(5);
expect(document.querySelectorAll(".diagram .pop")).toHaveLength(0);
```

- [ ] **Step 2: Run the component test and confirm it fails because `HeroDiagram` does not exist**

Run: `npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx`

- [ ] **Step 3: Implement the diagram as a scoped Motion component**

Use:

```jsx
const [scope, animateSequence] = useAnimate();
const prefersReducedMotion = useReducedMotion();
const reduceMotion = reducedMotionOverride ?? prefersReducedMotion;

useEffect(() => {
  if (reduceMotion) return undefined;
  const entrance = animateSequence(buildHeroMotionSequence());
  const stopPackets = startSignalPacketFlow(scope.current, animate);
  return () => {
    entrance.stop();
    stopPackets();
  };
}, [animateSequence, reduceMotion, scope]);
```

Render connector geometry with `motion.path`, junction dots with
`motion.circle`, and cards with `motion.div`. Use `initial={false}` in reduced
motion and explicit hidden Motion initial states otherwise.

- [ ] **Step 4: Update `FeatureRail` for parent-controlled Motion**

When `motionManaged` is true, render icon, copy, and preview as Motion elements
with `data-motion` attributes and hidden initial states. Remove the diagram
row's `.pop` class and CSS animation delay so Motion is the only owner.

- [ ] **Step 5: Run the focused component and feature tests**

Run: `npm test -- --run src/components/hero-diagram/HeroDiagram.test.jsx src/components/FeatureRail.test.jsx`

### Task 3: Mount, Remove Legacy Motion, and Verify

**Files:**
- Create: `src/hero-diagram-main.jsx`
- Modify: `index.html`
- Delete: `src/hero-diagram-motion.js`
- Delete: `src/hero-diagram-motion.test.js`
- Delete: `src/feature-rail-main.jsx`

**Interfaces:**
- Consumes: `HeroDiagram`.
- Produces: one React root mounted at `#hero-diagram-root`.

- [ ] **Step 1: Add the React entry point**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HeroDiagram from "./components/hero-diagram/HeroDiagram.jsx";

const root = document.getElementById("hero-diagram-root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HeroDiagram />
    </StrictMode>,
  );
}
```

- [ ] **Step 2: Replace only the static `.diagram` contents**

Keep `.diagram-outer` and `.diagram-scale`, replace the old inner markup with
`<div id="hero-diagram-root"></div>`, and load `/src/hero-diagram-main.jsx`.

- [ ] **Step 3: Remove legacy animation ownership**

Delete the custom SVG `strokeDashoffset` initializer, remove diagram `.pop`
classes and timing hooks now rendered by React, and remove the old feature rail
mount.

- [ ] **Step 4: Run the complete automated verification**

Run:

```bash
npm test -- --run
npm run build
git diff --check
```

- [ ] **Step 5: Verify in the browser**

On a fresh load at 1440px, confirm inputs → engine → outputs → outcomes,
observe at least one idle packet traversal, check the settled state, confirm no
console errors or horizontal overflow, and verify reduced motion renders the
complete final diagram without packet animation.
