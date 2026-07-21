# Olixer Section 4 — Signals Card Stack Design

## Goal

Add a Signals Card Deck directly after the completed Stats section. Rebuild the supplied Framer Stacked Card Carousel as a local React and Framer Motion component, replace its article content with Olixer signal examples, and leave Sections 1–3 unchanged.

## Selected approach

Keep the reference component's spring-stack and horizontal drag behavior, but do not connect carousel state to wheel or page-scroll input. Users move through the stack with drag gestures, left/right arrow buttons, visible stacked-card clicks, pagination dots, or keyboard controls.

## Reference behavior

- The active card fills the main carousel frame.
- Upcoming cards remain visible behind it with progressively smaller scale and upward vertical offsets.
- A completed card springs downward, scales to 90%, rotates slightly on the X axis, and fades out.
- Page scrolling never changes the active card or prevents the document from scrolling normally.
- The active card can be dragged horizontally. Crossing the drag threshold selects the previous or next card.
- Circular previous and next arrow buttons sit at the left and right edges of the carousel and disable at their respective boundaries.
- Clicking a visible background card brings it forward.
- Pagination dots show the active position and allow direct navigation.
- Mobile changes each card from a horizontal split to a vertical image/content composition and uses shallower stacking offsets.

## Content

The deck contains four clearly presented Olixer signal examples:

1. **EUR/USD — Buy setup**: trend continuation, entry, stop loss, target, and risk summary.
2. **XAU/USD — Buy setup**: momentum breakout, entry, stop loss, target, and risk summary.
3. **GBP/JPY — Sell setup**: resistance rejection, entry, stop loss, target, and risk summary.
4. **NAS100 — Buy setup**: session breakout, entry, stop loss, target, and risk summary.

Each card is labelled as an example signal so static showcase values cannot be mistaken for live trading instructions.

## Layout and styling

- Section 4 returns to the Olixer off-white background after the dark Stats band.
- A compact orange-dot eyebrow reads “Signal intelligence.”
- The serif heading introduces the idea of turning market movement into clear, actionable setups.
- The carousel sits in a generous rounded stage based on the reference's light-gray background and white cards.
- Desktop cards use a roughly 50/50 split: a purpose-built chart visual on the left and signal details on the right.
- Card chrome uses Olixer ink, warm white, orange accent, green/red position cues, restrained borders, and soft depth shadows.
- Mobile cards stack the chart above the content and retain the layered-card silhouette.

## Component boundaries

- `SignalStack.jsx` owns signal data, active-card state, drag/click/arrow/dot controls, keyboard navigation, and Framer Motion transforms.
- `SignalChart.jsx` renders a lightweight inline SVG chart for each signal without remote image dependencies.
- `SignalStack.css` owns the stage, cards, chart treatment, responsive layouts, and focus states.
- `signal-stack-main.jsx` mounts the component into `#signal-stack-root`.
- `index.html` owns only the Section 4 wrapper, heading, supporting copy, mount element, and module script after Section 3.

## Accessibility and motion

- The carousel is a labelled region with an announced current position.
- Cards are semantic articles with unique headings.
- Pagination controls have explicit “Go to signal” labels and visible focus styling.
- Left/Right and Up/Down arrow keys move through the stack; Home and End select its boundaries.
- Reduced-motion users keep every interaction, but state changes happen without spring travel or 3D rotation.
- Non-active completed cards are removed from pointer and accessibility interaction.

## Testing and verification

- Component tests cover four Olixer cards, the default active card, direct dot navigation, keyboard navigation, and card labelling.
- Interaction tests prove wheel input leaves the active card unchanged and that both arrow controls navigate correctly.
- The complete test suite and production build must pass.
- Brave checks cover desktop stacking, arrow/drag controls, normal page scrolling, mobile composition, and the transitions from Stats into Signals and from Signals into the existing CTA.

## Scope limits

- No live market feed, broker connection, or trade execution is added.
- Section 4 contains examples only and does not open a modal or a detailed signal route.
- The supplied Framer package is not embedded at runtime; the behavior is reproduced locally with the project's installed Framer Motion dependency.
