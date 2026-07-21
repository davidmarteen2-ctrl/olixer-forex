# Olixer Section 2 — Step Flow Design

## Goal

Add a new “How it works” section directly after the completed Bento section. Adapt the supplied Framer Step Flow component into local React and Framer Motion code using four Olixer onboarding steps, while leaving Section 1 unchanged.

## Reference behavior

The supplied Step Flow uses four selectable text rows beside one visual panel. Hovering a desktop row moves a rounded active background to that row and swaps the visual. On compact screens the visual appears first and the rows stack below it. Selection changes use spring layout motion and a soft image transition.

## Content

1. **Create your account** — Set up your Olixer profile in minutes.
2. **Connect your broker** — Link a supported trading account securely.
3. **Choose a proven trader** — Compare performance, drawdown, and risk.
4. **Copy trades automatically** — Mirror positions and monitor everything live.

## Layout

- The section uses the existing Olixer off-white background, centered page width, serif display heading, dark ink, and orange accent.
- A small eyebrow reads “How it works.”
- The heading communicates a fast path from account setup to live copied trades.
- Desktop uses a two-column component: the four steps occupy the left column and a large rounded visual panel occupies the right.
- Each step has a two-digit number, title, and short supporting sentence.
- A rounded active background slides vertically behind the selected step.
- Mobile places the visual panel above the step list and keeps all four steps tappable.

## Interaction and motion

- Desktop pointer hover and keyboard focus select a step.
- Click/tap selects a step on every breakpoint.
- The active background uses a spring layout animation.
- The right visual crossfades and moves slightly as the active step changes.
- Motion affects transform and opacity only.
- Reduced-motion users receive immediate state changes without spring or crossfade movement.
- The first step is active by default.

## Visual panels

- Step 1 shows an Olixer account/profile setup interface.
- Step 2 shows a broker connection interface using existing broker logo assets.
- Step 3 shows a trader comparison/leaderboard interface with return and risk information.
- Step 4 shows a live copy-trading execution interface with active positions and status.
- Visuals are built locally from semantic HTML, CSS, and existing project assets; the implementation does not depend on the remote Framer runtime.

## Component boundaries

- `StepFlow.jsx` owns the four-step data, active-step state, keyboard/pointer selection, and visual panel rendering.
- `StepFlow.css` owns the component layout, Olixer styling, responsive behavior, and non-layout hover treatment.
- `step-flow-main.jsx` mounts the component into `#step-flow-root`.
- `index.html` owns only the Section 2 wrapper, heading, root element, and module script placement after Section 1.

## Accessibility

- The section is labelled by its heading.
- The four steps use a tablist/tab pattern with clear selected state.
- The visual uses a labelled tabpanel associated with the active step.
- Arrow keys move between steps, while Home and End select the first and final steps.
- Focus remains visibly outlined.

## Verification

- Component tests cover all four Olixer steps, the default active state, hover/click selection, keyboard navigation, and the matching active panel.
- The full test suite and production build must pass.
- Brave checks cover desktop selection, the four visual panels, narrow mobile stacking, and the unchanged Bento section above.
