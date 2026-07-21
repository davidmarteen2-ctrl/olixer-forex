# Olixer Pricing Slider Design

## Goal

Add the planned pricing section between Signals and the final CTA using the interaction patterns from the supplied PricingSlider and DynamicToggle Framer modules.

## Structure

- A section heading introduces simple pricing for copy-trading workflows.
- A two-state sliding pill selects Monthly or Yearly billing. Yearly displays the equivalent monthly rate and a 20% savings label.
- A discrete three-stop range selects Starter, Pro, or Elite. The filled track, dots, handle, and labels follow the PricingSlider reference.
- One focused pricing panel updates its plan name, price, description, account limits, feature list, and CTA together. A compact plan rail keeps all three options visible and clickable.

## Olixer plans

- Starter: $19 monthly or $15 yearly equivalent; one broker connection and three copied strategies.
- Pro: $49 monthly or $39 yearly equivalent; three broker connections and unlimited copied strategies. Marked Most popular.
- Elite: $99 monthly or $79 yearly equivalent; ten broker connections, team controls, and priority support.

## Motion and accessibility

- Framer Motion owns the sliding toggle indicator, plan highlight, price crossfade, and section entrance.
- Motion uses short transform/opacity transitions and respects reduced-motion preferences.
- The range has an accessible label and exposes the selected plan through `aria-valuetext`.
- Toggle and plan rail controls are semantic buttons with clear selected state.
- Pricing CTAs remain local placeholders and do not navigate away from the site.

## Responsive behavior

The pricing panel uses a two-column layout on desktop and one column below 760px. Toggle, slider, plan rail, prices, and CTAs remain fully visible without horizontal overflow.
