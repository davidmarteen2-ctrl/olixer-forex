# Surface Pattern System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Olixer's one-off decorative dots and grids with the approved Plain/Product Dots/Market Grid surface system.

**Architecture:** Existing components keep ownership of their pseudo-element masks and stacking contexts. A shared set of CSS custom properties in `index.html` supplies the 12/24/72px spacing family, light/dark pattern inks, and two opacity levels; semantic `data-surface-pattern` attributes expose each section's approved role for testing and maintenance.

**Tech Stack:** HTML5, CSS custom properties, React 19, Vitest, Testing Library, Vite 8.

## Global Constraints

- Use only `plain`, `dots`, and `grid` as surface pattern roles.
- Use exactly 12px compact dots, 24px standard dots, and a 72px macro grid.
- Do not combine dots and grids on one surface.
- Do not add patterns outside the surfaces named in the approved spec.
- Preserve layout, motion, imagery, copy, and interaction behavior.
- Pattern layers remain non-interactive and decorative.
- Keep existing uncommitted Card Shuffle image and typography work intact.

---

### Task 1: Expose the Approved Surface Roles

**Files:**
- Modify: `src/components/CardShuffle.jsx`
- Modify: `src/components/StepFlow.jsx`
- Modify: `src/components/SignalStack.jsx`
- Modify: `src/components/PricingSection.jsx`
- Modify: `src/components/hero-diagram/MobileFocusTopology.jsx`
- Modify: `index.html`
- Create: `src/surface-patterns.test.jsx`

**Interfaces:**
- Produces: `data-surface-pattern="plain|dots|grid"` on every mapped surface.
- Consumes: the section mapping in `docs/superpowers/specs/2026-08-09-surface-pattern-system-design.md`.

- [ ] **Step 1: Write the failing surface-role test**

Create `src/surface-patterns.test.jsx` with component assertions and a parsed
HTML assertion for static CTA/footer surfaces:

```jsx
import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CardShuffle from "./components/CardShuffle.jsx";
import MobileFocusTopology from "./components/hero-diagram/MobileFocusTopology.jsx";
import PricingSection from "./components/PricingSection.jsx";
import SignalStack from "./components/SignalStack.jsx";
import StepFlow from "./components/StepFlow.jsx";

afterEach(cleanup);

describe("Olixer surface pattern roles", () => {
  it("maps React surfaces to the approved role", () => {
    const cases = [
      [<CardShuffle reducedMotion />, ".card-shuffle", "grid"],
      [<StepFlow reducedMotion />, ".step-ui", "dots"],
      [<SignalStack reducedMotion />, ".signal-stack", "dots"],
      [<PricingSection reducedMotion />, ".pricing-selector", "plain"],
      [<MobileFocusTopology />, ".mobile-focus-topology", "dots"],
    ];

    cases.forEach(([component, selector, role]) => {
      const { container, unmount } = render(component);
      expect(container.querySelector(selector)?.dataset.surfacePattern).toBe(role);
      unmount();
    });
  });

  it("maps the static CTA and footer surfaces", () => {
    const page = new DOMParser().parseFromString(
      readFileSync("index.html", "utf8"),
      "text/html",
    );

    expect(page.querySelector(".stats-section")?.dataset.surfacePattern).toBe("plain");
    expect(page.querySelector(".cta")?.dataset.surfacePattern).toBe("dots");
    expect(page.querySelector(".foot")?.dataset.surfacePattern).toBe("plain");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/surface-patterns.test.jsx`

Expected: FAIL because the mapped elements do not yet expose
`data-surface-pattern`.

- [ ] **Step 3: Add the semantic pattern roles**

Add the following attributes without changing component structure:

```jsx
<section className={`card-shuffle${...}`} data-surface-pattern="grid">
<motion.div className="step-ui ..." data-surface-pattern="dots">
<div className="signal-stack" data-surface-pattern="dots">
<div className="pricing-selector" data-surface-pattern="plain">
<motion.div className="mobile-focus-topology" data-surface-pattern="dots">
```

Add the role to all four `.step-ui` preview roots. In `index.html`, add
`data-surface-pattern="plain"` to the static `.stats-section`,
`data-surface-pattern="dots"` to `.cta`, and `data-surface-pattern="plain"`
to `.foot`.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- --run src/surface-patterns.test.jsx`

Expected: 2 tests PASS.

---

### Task 2: Normalize the Active Product and Market Patterns

**Files:**
- Modify: `index.html`
- Modify: `src/components/CardShuffle.css`
- Modify: `src/components/StepFlow.css`
- Modify: `src/components/SignalStack.css`
- Modify: `src/components/hero-diagram/MobileFocusTopology.css`
- Modify: `src/surface-patterns.test.jsx`

**Interfaces:**
- Consumes: `data-surface-pattern` roles from Task 1.
- Produces: global CSS variables `--pattern-step-compact`, `--pattern-step-dot`, `--pattern-step-grid`, `--pattern-ink-light`, `--pattern-ink-dark`, `--pattern-opacity-subdued`, and `--pattern-opacity-quiet`.

- [ ] **Step 1: Extend the test with the shared token contract**

Add this test using literal expected values:

```jsx
it("defines the approved 12/24/72 pattern rhythm", () => {
  const page = readFileSync("index.html", "utf8");

  expect(page).toContain("--pattern-step-compact: 12px");
  expect(page).toContain("--pattern-step-dot: 24px");
  expect(page).toContain("--pattern-step-grid: 72px");
  expect(page).toContain("--pattern-ink-light:");
  expect(page).toContain("--pattern-ink-dark:");
});

it("consumes the shared rhythm on every patterned React surface", () => {
  const cardShuffle = readFileSync("src/components/CardShuffle.css", "utf8");
  const stepFlow = readFileSync("src/components/StepFlow.css", "utf8");
  const signalStack = readFileSync("src/components/SignalStack.css", "utf8");
  const mobileHero = readFileSync(
    "src/components/hero-diagram/MobileFocusTopology.css",
    "utf8",
  );

  expect(cardShuffle).toContain("var(--pattern-step-grid)");
  expect(stepFlow).toContain("var(--pattern-step-dot)");
  expect(signalStack).toContain("var(--pattern-step-dot)");
  expect(mobileHero).toContain("var(--pattern-step-compact)");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/surface-patterns.test.jsx`

Expected: FAIL because the global pattern tokens are absent.

- [ ] **Step 3: Add the shared tokens and consume them**

Add the exact spacing tokens to the existing `:root` block in `index.html`.
Use these exact subdued ink values:

```css
--pattern-step-compact: 12px;
--pattern-step-dot: 24px;
--pattern-step-grid: 72px;
--pattern-ink-light: rgba(21, 23, 26, 0.08);
--pattern-ink-dark: rgba(255, 255, 255, 0.045);
--pattern-opacity-subdued: 0.55;
--pattern-opacity-quiet: 0.32;
```

Update active surfaces:

- Card Shuffle uses `var(--pattern-ink-dark)` and
  `var(--pattern-step-grid)` with its existing radial mask.
- Step Flow changes 26px dots to `var(--pattern-step-dot)` and preserves its
  directional mask.
- Signal Stack uses `var(--pattern-ink-light)`,
  `var(--pattern-step-dot)`, and quiet opacity.
- Mobile Focus Topology adds compact dots to its existing background using
  `var(--pattern-step-compact)` and keeps its center guide line above the dots.
- CTA uses the standard dot step and a radial mask that fades beneath its card
  and orbiting objects.
- Add a mobile Card Shuffle media rule that applies quiet opacity to the macro
  grid without changing its 72px scale.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --run src/surface-patterns.test.jsx`

Expected: all surface pattern tests PASS.

---

### Task 3: Remove Decorative Patterns From Plain Surfaces

**Files:**
- Modify: `src/components/StatsSection.css`
- Modify: `src/components/PricingSection.css`
- Modify: `index.html`
- Modify: `src/surface-patterns.test.jsx`

**Interfaces:**
- Consumes: `data-surface-pattern="plain"` roles from Task 1.
- Produces: pattern-free Stats, Pricing selector, and footer surfaces.

- [ ] **Step 1: Add the failing plain-surface regression test**

Add:

```jsx
it("keeps plain surfaces free of decorative pattern layers", () => {
  const statsCss = readFileSync("src/components/StatsSection.css", "utf8");
  const pricingCss = readFileSync("src/components/PricingSection.css", "utf8");
  const page = readFileSync("index.html", "utf8");

  expect(statsCss).not.toContain(".stats-section::before");
  expect(pricingCss).not.toMatch(
    /\.pricing-selector\s*\{[^}]*linear-gradient/s,
  );
  expect(page).not.toContain(".foot::before");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/surface-patterns.test.jsx`

Expected: FAIL because all three decorative layers still exist.

- [ ] **Step 3: Remove only the disallowed patterns**

- Delete `.stats-section::before`; retain the stats borders and chart accents.
- Replace `.pricing-selector`'s two linear-gradient grid layers with its
  existing `rgba(255, 255, 255, 0.72)` surface color.
- Delete `.foot::before`; retain the footer's dark background and layout.
- Do not alter CTA, Signal Stack, Card Shuffle, Step Flow, or hero pattern
  layers in this task.

- [ ] **Step 4: Run the focused and component suites**

Run:

```bash
npm test -- --run src/surface-patterns.test.jsx \
  src/components/CardShuffle.test.jsx \
  src/components/StepFlow.test.jsx \
  src/components/StatsSection.test.jsx \
  src/components/SignalStack.test.jsx \
  src/components/PricingSection.test.jsx \
  src/components/hero-diagram/MobileFocusTopology.test.jsx
```

Expected: all selected tests PASS.

---

### Task 4: Full Verification and Visual Review

**Files:**
- Verify only; do not introduce unrelated changes.

**Interfaces:**
- Consumes: the complete surface pattern implementation from Tasks 1–3.
- Produces: verified desktop and mobile pattern rhythm.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test -- --run`

Expected: all test files PASS with zero failures.

- [ ] **Step 2: Build production assets**

Run: `npm run build`

Expected: Vite exits 0 and emits the production bundle.

- [ ] **Step 3: Check repository hygiene**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; status contains only the approved image,
typography, pattern, test, and plan changes.

- [ ] **Step 4: Verify visually in the local browser**

Review desktop and 393px mobile states. Confirm:

- Card Shuffle retains one quiet 72px market grid.
- How It Works and Signal Stack use the same 24px product dots.
- Mobile hero uses compact 12px dots without reducing legibility.
- Stats, Pricing, and footer are plain.
- CTA dots fade behind the central card.
- No pattern sits behind long-form copy, causes overflow, or competes with
  imagery.

- [ ] **Step 5: Commit the approved implementation without pushing**

Stage only the approved visual-system files, existing local Card Shuffle
assets/typography changes, tests, and this plan. Commit with:

```bash
git add index.html src/components src/assets src/surface-patterns.test.jsx \
  docs/superpowers/plans/2026-08-09-surface-pattern-system.md
git commit -m "feat: unify Olixer surface patterns"
```

Do not push or deploy until the user explicitly requests publishing.
