# Olixer Step Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent four-step Olixer “How it works” component after the Bento section, matching the supplied Framer Step Flow interaction.

**Architecture:** A new `StepFlow` React component owns active-tab state and four local visual panels. Framer Motion animates the active row background and panel swap; a separate mount file attaches it to a new root in `index.html`, leaving `CardShuffle` unchanged.

**Tech Stack:** React 19, Framer Motion 12, CSS, Vitest 4, Testing Library

## Global Constraints

- Use four steps in this order: Create your account, Connect your broker, Choose a proven trader, Copy trades automatically.
- Desktop uses hover, focus, and click selection; mobile uses tap/click selection.
- Use the tablist/tab/tabpanel accessibility pattern with Arrow, Home, and End keyboard navigation.
- Use transform and opacity for motion and respect reduced-motion preferences.
- Reuse local broker logo assets and do not depend on the remote Framer runtime.
- Place Section 2 after the Bento section without modifying `CardShuffle.jsx` or `CardShuffle.css`.
- The directory has no Git repository, so verification checkpoints replace commit steps.

---

### Task 1: Build and test Step Flow state behavior

**Files:**
- Create: `src/components/StepFlow.test.jsx`
- Create: `src/components/StepFlow.jsx`

**Interfaces:**
- Produces: `stepFlowItems`, an array of `{ id, number, title, description }`; default export `StepFlow()`.
- Produces: four tabs and one active tabpanel associated by `aria-controls` and `aria-labelledby`.

- [ ] **Step 1: Write the failing component tests**

```jsx
render(<StepFlow />);
const tabs = screen.getAllByRole("tab");
expect(tabs).toHaveLength(4);
expect(tabs[0].getAttribute("aria-selected")).toBe("true");
expect(screen.getByRole("tabpanel", { name: /create your account/i })).toBeTruthy();

fireEvent.mouseEnter(screen.getByRole("tab", { name: /connect your broker/i }));
expect(screen.getByRole("tabpanel", { name: /connect your broker/i })).toBeTruthy();

fireEvent.keyDown(screen.getByRole("tab", { name: /connect your broker/i }), { key: "End" });
expect(screen.getByRole("tab", { name: /copy trades automatically/i }).getAttribute("aria-selected")).toBe("true");
```

- [ ] **Step 2: Run the test and verify the missing-component failure**

Run: `npm test -- --run src/components/StepFlow.test.jsx`

Expected: FAIL because `StepFlow.jsx` does not exist.

- [ ] **Step 3: Implement the four-step tabs and keyboard state**

```jsx
export const stepFlowItems = [
  { id: "account", number: "01", title: "Create your account", description: "Set up your Olixer profile in minutes." },
  { id: "broker", number: "02", title: "Connect your broker", description: "Link a supported trading account securely." },
  { id: "trader", number: "03", title: "Choose a proven trader", description: "Compare performance, drawdown, and risk." },
  { id: "copy", number: "04", title: "Copy trades automatically", description: "Mirror positions and monitor everything live." },
];
```

Use `useState(0)`. Each tab selects on `onMouseEnter`, `onFocus`, and `onClick`. ArrowLeft/ArrowUp select the previous index, ArrowRight/ArrowDown select the next, Home selects `0`, and End selects `3`.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- --run src/components/StepFlow.test.jsx`

Expected: PASS with four tabs, selection changes, and keyboard navigation.

---

### Task 2: Add Framer-style motion and Olixer visual panels

**Files:**
- Modify: `src/components/StepFlow.test.jsx`
- Modify: `src/components/StepFlow.jsx`
- Create: `src/components/StepFlow.css`

**Interfaces:**
- Consumes: `activeIndex` and `stepFlowItems` from Task 1.
- Produces: `StepVisual({ stepId })`, active-row `layoutId="step-flow-active"`, and animated panel content for account, broker, trader, and copy.

- [ ] **Step 1: Add failing visual-content assertions**

```jsx
expect(screen.getByText("Profile ready")).toBeTruthy();
fireEvent.click(screen.getByRole("tab", { name: /connect your broker/i }));
expect(screen.getByText("Broker connected")).toBeTruthy();
fireEvent.click(screen.getByRole("tab", { name: /choose a proven trader/i }));
expect(screen.getByText("Momentum Pro")).toBeTruthy();
fireEvent.click(screen.getByRole("tab", { name: /copy trades automatically/i }));
expect(screen.getByText("Copying live")).toBeTruthy();
```

- [ ] **Step 2: Run the focused test and verify it fails for missing visual content**

Run: `npm test -- --run src/components/StepFlow.test.jsx`

- [ ] **Step 3: Implement motion and four local visual panels**

Use `motion.div layoutId="step-flow-active"` behind the selected row with spring `{ type: "spring", stiffness: 420, damping: 38 }`. Use `AnimatePresence mode="wait"` for the panel with `{ opacity: 0, y: 14, scale: 0.985 }` entrance and the inverse exit. When reduced motion is enabled, use zero-duration transitions and no offset.

Build visual panels from semantic divs, status chips, metrics, bars, and the existing broker logo files in `assets/logos/`.

- [ ] **Step 4: Add responsive CSS matching the supplied component**

```css
.step-flow { display: grid; grid-template-columns: minmax(0, .9fr) minmax(420px, 1.1fr); gap: 80px; }
.step-flow__steps { display: flex; flex-direction: column; justify-content: space-around; }
.step-flow__visual { min-height: 560px; border-radius: 28px; overflow: hidden; }
@media (max-width: 820px) { .step-flow { grid-template-columns: 1fr; gap: 28px; } .step-flow__visual { order: -1; min-height: 460px; } }
```

- [ ] **Step 5: Run the focused test and verify it passes**

Run: `npm test -- --run src/components/StepFlow.test.jsx`

Expected: PASS for all four visual states.

---

### Task 3: Mount Section 2 and verify the site

**Files:**
- Create: `src/step-flow-main.jsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: default export `StepFlow`.
- Produces: React mount at `#step-flow-root` directly after the Bento section.

- [ ] **Step 1: Create the isolated mount**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StepFlow from "./components/StepFlow.jsx";

const root = document.getElementById("step-flow-root");
if (root) createRoot(root).render(<StrictMode><StepFlow /></StrictMode>);
```

- [ ] **Step 2: Insert the Section 2 wrapper after Section 1**

Add `section.step-flow-section#how-it-works`, an eyebrow, heading, supporting sentence, `#step-flow-root`, and `/src/step-flow-main.jsx` immediately after `/src/card-shuffle-main.jsx` and before the existing CTA.

- [ ] **Step 3: Run full automated verification**

Run: `npm test -- --run && npm run build`

Expected: all tests pass and Vite completes a production build.

- [ ] **Step 4: Verify in Brave**

Open `http://127.0.0.1:5173/#how-it-works`. Confirm all four desktop states, responsive mobile stacking, reduced-motion fallback, and the unchanged Bento section above.

- [ ] **Step 5: Leave the site open**

Restore Brave to desktop size at `http://127.0.0.1:5173/#how-it-works` and confirm the Vite server remains on port 5173.
