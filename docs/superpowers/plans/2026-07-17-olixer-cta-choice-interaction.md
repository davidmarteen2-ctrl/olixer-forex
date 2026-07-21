# Olixer CTA Choice Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Assemble-style Yes/No hover widget interaction to the existing Olixer CTA without changing its layout or content.

**Architecture:** A small DOM controller owns the last hovered CTA choice and accessibility attributes. The existing inline GSAP choreography consumes that state to gather or release widgets, while CSS limits the border glow and button treatment to an active Yes hover.

**Tech Stack:** Vanilla JavaScript, GSAP 3, CSS, Vitest with jsdom, Vite.

## Global Constraints

- Preserve the current CTA markup structure, copy, artwork, dimensions, and responsive breakpoints.
- Animate only transforms for widget movement.
- Respect `prefers-reduced-motion`.

---

### Task 1: Choice state controller

**Files:**
- Create: `src/cta-choice.js`
- Create: `src/cta-choice.test.js`

**Interfaces:**
- Produces: `initCtaChoice(root, onChoice)` returning a cleanup function.
- Emits: `onChoice('yes')` and `onChoice('no')` after updating `data-choice` and `aria-pressed`.

- [ ] **Step 1: Write the failing test**

```js
import { initCtaChoice } from './cta-choice.js'

it('persists yes and no choices', () => {
  document.body.innerHTML = '<section class="cta"><button class="btn-yes">Yes</button><button class="btn-no">No</button></section>'
  initCtaChoice(document)
  document.querySelector('.btn-yes').click()
  expect(document.querySelector('.cta').dataset.choice).toBe('yes')
  document.querySelector('.btn-no').click()
  expect(document.querySelector('.cta').dataset.choice).toBe('no')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/cta-choice.test.js --run`

Expected: FAIL because `src/cta-choice.js` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `initCtaChoice` to bind semantic Yes/No buttons, update `data-choice`, synchronize `aria-pressed`, call the optional callback, and return listener cleanup.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/cta-choice.test.js --run`

Expected: PASS.

### Task 2: CTA styling and GSAP choreography

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `initCtaChoice(root, onChoice)` from `src/cta-choice.js`.
- Produces: persistent `yes` and `no` visual states plus hover preview.

- [ ] **Step 1: Add card glow and button state CSS**

Add a masked orange border layer to `.cta-card`, black/white selected styling for `.btn-yes`, press feedback, focus-visible rings, and reduced-motion transition overrides.

- [ ] **Step 2: Use semantic controls**

Replace the two CTA anchors with `<button type="button" aria-pressed="false">` controls while preserving their classes and labels.

- [ ] **Step 3: Connect persistent choice state to GSAP**

Import `initCtaChoice`, call `gather()` for Yes and `release()` for No, and change the existing Yes mouseleave behavior so it does not release a persisted Yes state.

- [ ] **Step 4: Verify regression coverage and build**

Run: `npm test -- --run && npm run build`

Expected: all tests PASS and Vite exits successfully.

- [ ] **Step 5: Verify in Brave**

Open the local Vite URL in Brave, inspect the CTA at desktop and mobile widths, and click Yes then No to confirm the requested persistent states.
