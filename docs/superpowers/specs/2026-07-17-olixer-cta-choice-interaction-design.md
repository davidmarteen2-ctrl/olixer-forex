# Olixer CTA Choice Interaction Design

## Goal

Keep the existing Olixer CTA layout and visual language while adding the choice interaction demonstrated by the Assemble reference.

## Interaction

- Hovering Yes reveals a warm orange border glow and changes the button from orange to black with white text.
- Hovering Yes runs the inward widget gather. The widgets remain behind the white card after the pointer leaves Yes.
- Hovering No restores every widget to its authored position with the same smooth position tween used by Yes.
- The border glow is active only while Yes itself is hovered; hovering the card or No does not activate it.
- Click remains as a touch-device fallback and does not replay a hover state that is already active.
- Yes collapses the two concentric rings toward the card while expanding the outer glow field; No expands the rings to their wide state.
- Widgets remain flat and stationary at rest. There is no idle float, cursor parallax, rotation, or scale animation.
- Both buttons keep a fixed 157px width and use a short ease rather than an elastic transition.
- The outer candle tile is 148px and the candle mark inside the CTA card is 52px.
- The controls use semantic buttons and expose their selected state with `aria-pressed`.
- Reduced-motion users receive the same choice state without animated movement.

## Scope

Only the CTA choice controls, card border treatment, and surrounding-widget state animation change. CTA copy, layout, widget artwork, trial messaging, and the rest of the page remain untouched.

## Verification

Automated tests cover choice-state transitions and accessibility attributes. The production build must pass, followed by browser verification of hover, Yes, No, and responsive layout.
