# Olixer Signals Card Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-card Olixer signal carousel after the Stats band using the supplied Framer component's spring-stack and drag interaction with explicit arrow navigation.

**Architecture:** A dedicated `SignalStack` React component owns signal data, selection, drag, arrow, dot, and keyboard controls. A focused `SignalChart` child renders dependency-free SVG previews, while a colocated stylesheet owns presentation and responsive layout. A separate entry module mounts the component into a static Section 4 wrapper in `index.html`.

**Tech Stack:** React 19, Framer Motion 12, CSS, Vitest 4, Testing Library, Vite 8.

## Global Constraints

- Preserve Sections 1–3 unchanged.
- Reproduce the supplied component locally; do not embed the remote Framer runtime.
- Use four clearly labelled example signals, not live financial instructions.
- Page scrolling must never change the active card; preserve horizontal drag, background-card clicks, pagination dots, and keyboard controls.
- Add previous and next arrow buttons at the carousel edges, disabled at their respective boundaries.
- Respect `prefers-reduced-motion` while keeping every control usable.
- Do not add dependencies.
- This directory has no Git repository, so commit steps are intentionally omitted.

---

### Task 1: Lock the component contract with failing tests

**Files:**
- Create: `src/components/SignalStack.test.jsx`
- Create after RED: `src/components/SignalStack.jsx`

**Interfaces:**
- Consumes: React Testing Library `render`, `screen`, `fireEvent`, and Vitest fake timers.
- Produces: default `SignalStack` component and named `signalCards` array.

- [ ] **Step 1: Write rendering and navigation tests first**

```jsx
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SignalStack, { signalCards } from "./SignalStack.jsx";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Olixer signal stack", () => {
  it("renders four example signals with the first active", () => {
    render(<SignalStack reducedMotion />);
    expect(signalCards).toHaveLength(4);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("EUR/USD")).toBeTruthy();
    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });

  it("supports direct dot navigation", () => {
    render(<SignalStack reducedMotion />);
    fireEvent.click(screen.getByRole("button", { name: /go to xau\/usd signal/i }));
    expect(screen.getByText("Example signal 2 of 4")).toBeTruthy();
  });

  it("supports keyboard navigation", () => {
    render(<SignalStack reducedMotion />);
    const carousel = screen.getByRole("region", { name: /example signals/i });
    fireEvent.keyDown(carousel, { key: "End" });
    expect(screen.getByText("Example signal 4 of 4")).toBeTruthy();
    fireEvent.keyDown(carousel, { key: "Home" });
    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: FAIL because `SignalStack.jsx` does not exist.

- [ ] **Step 3: Add only the public data and static semantic shell**

Create `signalCards` with IDs `eurusd`, `xauusd`, `gbpjpy`, and `nas100`. Each item contains `pair`, `side`, `setup`, `entry`, `stop`, `target`, `risk`, `category`, `accent`, and `chart` points. Render a labelled region, four semantic articles, an `aria-live` position string, and four labelled dot buttons.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: 3 tests pass.

---

### Task 2: Implement stack transforms and explicit navigation

**Files:**
- Modify: `src/components/SignalStack.test.jsx`
- Modify: `src/components/SignalStack.jsx`

**Interfaces:**
- Consumes: `signalCards`, Framer Motion `motion`, `animate`, `useMotionValue`, and `useReducedMotion`.
- Produces: `getCardPose(index, activeIndex, isMobile, reducedMotion)` and complete drag/arrow controls.

- [ ] **Step 1: Add failing scroll-isolation and arrow-navigation tests**

```jsx
it("does not change the active card when the page is scrolled", () => {
  vi.useFakeTimers();
  render(<SignalStack reducedMotion />);
  const carousel = screen.getByRole("region", { name: /example signals/i });
  fireEvent.wheel(carousel, { deltaY: -120 });
  vi.advanceTimersByTime(700);
  expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
});

it("moves between cards with the previous and next arrows", () => {
  render(<SignalStack reducedMotion />);
  const previous = screen.getByRole("button", { name: /previous signal/i });
  const next = screen.getByRole("button", { name: /next signal/i });
  expect(previous.disabled).toBe(true);
  fireEvent.click(next);
  expect(screen.getByText("Example signal 2 of 4")).toBeTruthy();
  fireEvent.click(previous);
  expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
});
```

- [ ] **Step 2: Run the test and confirm the new assertion fails**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: wheel isolation fails because the active card changes, and the arrow controls cannot be found.

- [ ] **Step 3: Implement interaction state, reference poses, and arrows**

Use `activeIndex`, `isDragging`, and `isMobile` state. Do not register a wheel handler. For viewed cards animate to `{ y: isMobile ? 600 : 800, scale: 0.9, opacity: 0, rotateX: reducedMotion ? 0 : 15 }`. For upcoming desktop cards use `{ y: offset * -40, scale: max(0.6, 1 - offset * 0.08) }`; mobile uses `{ y: offset * -8, scale: max(0.7, 1 - offset * 0.05) }`. Active horizontal drag uses a 50px threshold, then resets with `animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 })`. Previous and next arrow buttons call the same clamped `selectCard` function and disable at index 0 and index 3.

- [ ] **Step 4: Add keyboard boundaries and background-card selection**

ArrowRight/ArrowDown select the next card, ArrowLeft/ArrowUp select the previous card, Home selects index 0, and End selects index 3. Clamp all state to the valid range. Upcoming cards remain clickable; viewed cards have no pointer events.

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: 5 tests pass with no timer warnings.

---

### Task 3: Build local chart visuals and responsive styling

**Files:**
- Create: `src/components/SignalChart.jsx`
- Create: `src/components/SignalStack.css`
- Modify: `src/components/SignalStack.jsx`

**Interfaces:**
- Consumes: `SignalChart({ signal })` where `signal.chart` is an array of numeric Y coordinates and `signal.accent` is a CSS color.
- Produces: semantic inline SVG charts and complete `.signal-stack*` presentation.

- [ ] **Step 1: Add a failing visual-contract assertion**

```jsx
it("renders one labelled local chart for every signal", () => {
  render(<SignalStack reducedMotion />);
  expect(screen.getAllByRole("img", { name: /example price chart/i })).toHaveLength(4);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: FAIL because no labelled chart images exist.

- [ ] **Step 3: Implement `SignalChart`**

Render a `viewBox="0 0 560 420"` SVG with `role="img"`, a unique title, grid lines, an accent area gradient, a polyline generated from the chart points, entry/target/stop guides, and a final-point marker. IDs for gradients must include `signal.id` to prevent collisions.

- [ ] **Step 4: Implement the section and card CSS**

Create a warm off-white `.signals-section`, a rounded light-gray `.signal-stack__stage`, and absolute white `.signal-card` layers. Desktop card content is a two-column 50/50 split with a dark chart pane and a structured detail pane. Under 768px, use one column with the chart above the details; reduce radius, padding, and title size. Style dots, tags, metric rows, focus outlines, and the active count using Olixer ink `#15171a`, orange `#f0821e`, green `#1fa357`, and restrained gray borders.

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run: `npm test -- --run src/components/SignalStack.test.jsx`

Expected: 5 tests pass.

---

### Task 4: Mount Section 4 and verify the complete page

**Files:**
- Create: `src/signal-stack-main.jsx`
- Modify: `index.html` immediately after `/src/stats-section-main.jsx` and before the existing CTA.

**Interfaces:**
- Consumes: default `SignalStack` export and DOM node `#signal-stack-root`.
- Produces: page anchor `#signals` and a React mount isolated from the other section roots.

- [ ] **Step 1: Create the React entry module**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SignalStack from "./components/SignalStack.jsx";

const root = document.getElementById("signal-stack-root");
if (root) createRoot(root).render(<StrictMode><SignalStack /></StrictMode>);
```

- [ ] **Step 2: Add the static Section 4 wrapper**

Insert a section labelled by `signals-heading`, with eyebrow “Signal intelligence,” heading “Every setup, clear before you act.”, supporting text explaining the example stack, `#signal-stack-root`, and `/src/signal-stack-main.jsx`.

- [ ] **Step 3: Run the full automated verification**

Run: `npm test -- --run`

Expected: all existing CardShuffle, StepFlow, StatsSection, and new SignalStack tests pass.

Run: `npm run build`

Expected: Vite exits 0 and emits `dist/index.html` plus bundled CSS/JS assets.

- [ ] **Step 4: Check desktop and mobile in Brave**

Open `http://127.0.0.1:5173/#signals`. At desktop width, verify the horizontal split, stacked depth, normal page scrolling, drag, arrows, card click, dots, and CTA transition. At approximately 450px browser width, verify the vertical card composition, readable values, accessible arrows, usable dots, and no horizontal overflow. Restore Brave to desktop size on completion.
