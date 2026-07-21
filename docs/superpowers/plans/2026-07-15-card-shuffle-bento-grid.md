# Card Shuffle Bento Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Olixer card stack resolve into a precise responsive 2×2 Bento grid, add image-only hover zoom, and remove the inactive scroll tail.

**Architecture:** `CardShuffle` owns the sticky scroll scene and passes a smoothed progress MotionValue into four `ShuffleCard` instances. Each non-interactive semantic article owns its scroll transform, while CSS applies hover zoom only to its image so card geometry remains stable.

**Tech Stack:** React 19, Framer Motion 12, CSS, Vitest 4, Testing Library

## Global Constraints

- The completed layout is an exact two-column, two-row grid with equal card dimensions, aligned edges, consistent gutters, and zero rotation.
- Scroll animation uses transforms only and retains spring smoothing.
- Hover changes only the image scale; it never changes card geometry.
- Cards remain non-interactive semantic articles with no click expansion.
- Reduced motion renders the completed grid immediately without the extended scroll runway.
- The last card settles close to the section endpoint so the CTA follows without an inactive delay.
- The project directory has no Git repository, so commit steps are replaced by explicit verification checkpoints.

---

### Task 1: Lock the 2×2 Bento target geometry

**Files:**
- Modify: `src/components/CardShuffle.test.jsx`
- Modify: `src/components/CardShuffle.jsx`

**Interfaces:**
- Consumes: `CardShuffle({ reducedMotion?: boolean })` and `cardShuffleItems`.
- Produces: four non-interactive transformed articles; reduced-motion transforms end at `x/y ±25.5%`, `scale 0.49`, and no rotation.

- [x] **Step 1: Write failing Bento-grid assertions**

```jsx
render(<CardShuffle reducedMotion />);
const cards = screen.getAllByRole("article");
expect(screen.queryAllByRole("button")).toHaveLength(0);
expect(cards[0].style.transform).toContain("translateX(-25.5%)");
expect(cards[0].style.transform).toContain("translateY(-25.5%)");
expect(cards[0].style.transform).toContain("scale(0.49)");
expect(cards[0].style.transform).not.toContain("rotate(");
```

- [x] **Step 2: Run the focused test and confirm it fails against the old viewport fan**

Run: `npm test -- --run src/components/CardShuffle.test.jsx`

- [x] **Step 3: Implement Bento targets and progressive settlement**

```jsx
const bentoPositions = [
  { x: "-25.5%", y: "-25.5%" },
  { x: "25.5%", y: "-25.5%" },
  { x: "-25.5%", y: "25.5%" },
  { x: "25.5%", y: "25.5%" },
];
const settleRanges = [[0.04, 0.7], [0.08, 0.78], [0.12, 0.86], [0.16, 0.94]];
```

- [x] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/components/CardShuffle.test.jsx`

---

### Task 2: Add stable image hover and compact scroll timing

**Files:**
- Modify: `src/components/CardShuffle.test.jsx`
- Modify: `src/components/CardShuffle.css`

**Interfaces:**
- Consumes: `.card-shuffle__card` article markup from Task 1.
- Produces: image-only hover zoom, responsive 2×2 gutters, and a shorter scroll runway.

- [x] **Step 1: Add a failing CSS contract test**

```jsx
const css = readFileSync("src/components/CardShuffle.css", "utf8");
expect(css).toContain(".card-shuffle__card:hover img");
expect(css).toContain("transform: scale(1.055)");
expect(css).toContain("height: 330vh");
```

- [x] **Step 2: Run the focused test and confirm it fails against the old CSS**

Run: `npm test -- --run src/components/CardShuffle.test.jsx`

- [x] **Step 3: Implement the hover and responsive timing CSS**

```css
.card-shuffle { height: 330vh; min-height: 0; }
.card-shuffle__card img { transition: transform .55s cubic-bezier(.22,1,.36,1); }
.card-shuffle__card:hover img { transform: scale(1.055); }
```

Use `300vh` for tablet and `280vh` for mobile. Keep reduced motion at `100svh`.

- [x] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/components/CardShuffle.test.jsx`

---

### Task 3: Verify behavior and hand off in Brave

**Files:**
- Verify: `src/components/CardShuffle.jsx`
- Verify: `src/components/CardShuffle.css`
- Verify: `src/components/CardShuffle.test.jsx`

**Interfaces:**
- Consumes: the completed component and existing Vite dev server.
- Produces: a tested production build and a live Brave tab at the gallery section.

- [ ] **Step 1: Run complete automated verification**

Run: `npm test -- --run && npm run build`

Expected: all tests pass and Vite exits with a successful production build.

- [ ] **Step 2: Inspect desktop states in Brave**

Open `http://127.0.0.1:5173/#gallery`. Confirm the entry stack, aligned 2×2 completion, image-only hover zoom, and immediate CTA handoff.

- [ ] **Step 3: Inspect a narrow viewport in Brave**

Resize Brave to approximately 480×900. Confirm the completed 2×2 grid stays inside the viewport and uses consistent gutters.

- [ ] **Step 4: Leave the normal animated page open**

Restore a desktop-sized Brave window, navigate to `http://127.0.0.1:5173/#gallery`, and confirm the Vite server remains on port 5173.
