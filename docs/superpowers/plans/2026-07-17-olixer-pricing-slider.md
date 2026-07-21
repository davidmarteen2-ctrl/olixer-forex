# Olixer Pricing Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and mount the Olixer pricing calculator between Signals and the CTA.

**Architecture:** `PricingSection.jsx` owns billing and selected-plan state, maps that state into plan data, and renders the DynamicToggle-inspired billing control plus PricingSlider-inspired range. Component CSS owns the responsive layout and visual language; a small Vite entry mounts the section into the existing static page.

**Tech Stack:** React 19, Framer Motion 12, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Preserve every existing section and insert pricing only between Signals and the CTA.
- Use Olixer copy and the three exact plan price pairs from the design.
- Respect reduced motion and maintain keyboard-accessible native controls.

---

### Task 1: Pricing component behavior

**Files:**
- Create: `src/components/PricingSection.test.jsx`
- Create: `src/components/PricingSection.jsx`

**Interfaces:**
- Produces: default export `PricingSection` and named export `pricingPlans`.
- State: billing is `monthly | yearly`; plan index is `0 | 1 | 2`.

- [ ] **Step 1: Write failing tests**

Test that Pro is selected by default at $49, moving the range to Elite shows $99, clicking Yearly changes Elite to $79, and the native range exposes `aria-valuetext="Elite"`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/components/PricingSection.test.jsx --run`

Expected: FAIL because `PricingSection.jsx` does not exist.

- [ ] **Step 3: Implement component**

Create the plan data, semantic billing toggle, discrete range, animated plan rail, focused pricing details, feature list, and local CTA using `motion`, `AnimatePresence`, and `useReducedMotion`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/components/PricingSection.test.jsx --run`

Expected: all pricing tests PASS.

### Task 2: Styling and page integration

**Files:**
- Create: `src/components/PricingSection.css`
- Create: `src/pricing-section-main.jsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: default `PricingSection`.
- Produces: `#pricing` section mounted into `#pricing-section-root` between Signals and CTA.

- [ ] **Step 1: Add production styling**

Implement the Olixer cream, ink, navy, orange, green, border, serif-heading, responsive panel, slider, toggle, and focus-visible states.

- [ ] **Step 2: Mount the component**

Create a StrictMode entry and add the pricing section markup plus module script after the signal stack.

- [ ] **Step 3: Verify**

Run: `npm test -- --run --maxWorkers=1 && npm run build`.

Expected: all tests PASS and Vite builds successfully.

- [ ] **Step 4: Browser QA**

Open `http://127.0.0.1:5173/#pricing` in Brave. Verify all toggle, slider, plan rail, responsive, focus, and reduced-motion states.
