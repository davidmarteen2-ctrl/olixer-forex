# Olixer Card Shuffle — Bento Grid Design

## Goal

Refine the existing scroll-driven Card Shuffle so its final state reads as a precise two-column, two-row Bento grid instead of a loose fan of rotated cards. Add rich image hover treatment without allowing interaction to disturb the scroll geometry.

## Scroll behavior

- The section begins with the four Olixer cards stacked at the center of the sticky stage.
- As the user scrolls, all four cards move toward fixed quadrants inside one shared deck boundary.
- The completed state is an exact 2×2 grid: equal card dimensions, equal rows and columns, a consistent gutter, aligned outer edges, and no rotation.
- The cards settle progressively, with the last card completing close to the end of the section.
- The section height is shortened so the CTA follows immediately after the grid completes, without a long inactive scroll tail.
- Scroll motion uses transforms only (`x`, `y`, `scale`, and opacity where needed) and retains the existing spring smoothing.

## Responsive behavior

- Desktop and tablet use a landscape deck that forms two equal columns and rows.
- Mobile uses a taller deck while preserving the same 2×2 geometry and consistent gutters.
- Final card positions are relative to the shared deck, not the viewport, preventing clipping and hard-looking placement.
- With reduced motion enabled, the completed 2×2 grid renders immediately and the extended scroll runway is removed.

## Hover behavior

- Cards remain non-interactive semantic articles.
- Hover affects only the card's image treatment.
- The image scales slightly with a short easing curve while the card shell remains fixed.
- Hover never changes grid tracks, card position, or card size, eliminating the previous layout glitch.

## Component boundaries

- `CardShuffle` owns scroll progress and reduced-motion behavior.
- `ShuffleCard` owns one card's scroll transform and presentation.
- Olixer card content remains in `cardShuffleItems` as the single data source.

## Accessibility

- The section retains its named region.
- Cards remain labelled articles using the Olixer capability headings.
- Reduced-motion users receive the completed Bento grid without scroll-linked movement.

## Verification

- Component tests cover four non-interactive cards, the completed reduced-motion grid targets, image-only hover CSS, and the shortened scroll runway.
- The production build must pass.
- Brave visual checks cover the stacked entry, completed desktop 2×2 grid, hover treatment, and narrow mobile grid.
