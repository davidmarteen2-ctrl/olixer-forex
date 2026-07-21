# Olixer Testimonial Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and mount an Olixer testimonial loop between Pricing and the CTA.

**Architecture:** A focused React component owns testimonial data and produces two duplicated marquee tracks. CSS owns the continuous transform animation and responsive layout; Framer Motion owns the section entrance and reduced-motion handling.

**Tech Stack:** React 19, Framer Motion 12, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Preserve all existing sections.
- Use two opposite-direction seamless rows.
- Pause on hover/focus and respect reduced motion.
- Mark testimonial content as illustrative.

---

### Task 1: Test the testimonial loop contract

**Files:**
- Create: `src/components/TestimonialsLoop.test.jsx`
- Test: `src/components/TestimonialsLoop.test.jsx`

- [ ] Write tests for the visible Olixer stories, two directional rows, duplicated cards, and reduced-motion state.
- [ ] Run `npm test -- --run src/components/TestimonialsLoop.test.jsx --reporter=dot` and confirm it fails because the component is missing.

### Task 2: Implement and style the loop

**Files:**
- Create: `src/components/TestimonialsLoop.jsx`
- Create: `src/components/TestimonialsLoop.css`

- [ ] Add the testimonial data, semantic cards, duplicated tracks, Framer Motion entrance, and reduced-motion behavior.
- [ ] Add the dark glass-card stage, opposite ticker keyframes, edge fades, hover/focus pause, and responsive rules.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Mount and verify the section

**Files:**
- Create: `src/testimonials-main.jsx`
- Modify: `index.html`

- [ ] Mount `TestimonialsLoop` in `#testimonials-root` after Pricing and before the CTA.
- [ ] Run the full Vitest suite and `npm run build`.
- [ ] Open `http://127.0.0.1:5173/#testimonials` in Brave and verify desktop/mobile layout and animation state.
