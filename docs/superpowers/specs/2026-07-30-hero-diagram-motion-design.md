# Hero Diagram Motion Design

## Objective

Turn the existing Olixer Forex hero diagram into a visibly active signal-flow
system using the codebase's installed `framer-motion` package. Preserve the
current layout, content, colours, typography, and compact right-side feature
rail.

## Motion Language

The diagram uses purposeful orchestration rather than unrelated entrance
effects:

- **Line drawing:** input paths draw toward the Signal Engine, then output paths
  draw away from it.
- **Stagger:** source cards and outcome rows enter in their visual order.
- **Pulse:** the Signal Engine performs one restrained activation pulse when
  input flow reaches it.
- **Idle animation:** small signal packets periodically travel through the
  connector network after the entrance completes.
- **Number ticker / progress reveal:** compact previews resolve only after their
  corresponding outcome becomes active.

No bounce-heavy motion, rotation, floating cards, glow, or layout-property
animation is introduced.

## Choreography

1. The four input cards fade and translate 8px into place with an 80ms stagger.
2. The four neutral input paths animate from `pathLength: 0` to `1`, top to
   bottom, converging on the Signal Engine.
3. The Signal Engine fades and scales from `0.96` to `1`, then performs one
   subtle activation pulse.
4. The price and smart-signal cards resolve around the engine.
5. The five orange output paths animate from `pathLength: 0` to `1`, top to
   bottom.
6. The five feature rows enter with an 80ms stagger. Within each row, icon,
   copy, and preview resolve in that order.
7. Junction nodes appear as their associated path reaches them.
8. After a quiet pause, small packets travel along selected paths in a
   restrained repeating cycle. The full diagram does not repeatedly disappear
   or replay its entrance.

## Architecture

`HeroDiagram` becomes the single React owner for the complete diagram surface:

- `HeroDiagram`
  - `ConnectorNetwork`
  - `SourceCard[]`
  - `SignalEngine`
  - `MarketPreview`
  - `SignalPreview`
  - `FeatureRail`
  - `SignalPacket[]`

The static diagram markup currently embedded in `index.html` moves into the
React component without changing its authored geometry. Existing SVG path data
and CSS positioning remain the layout source of truth.

Framer Motion owns all diagram animation:

- `motion.path` controls connector `pathLength`.
- Variants control source, engine, and outcome entrance states.
- `useAnimate` coordinates the multi-stage timeline.
- `useReducedMotion` selects a static final state and disables packets.
- CSS continues to own layout and visual styling only.

The existing custom wire-transition module and diagram-specific `.pop`
animations are removed once the Motion implementation covers their behavior.
No element is animated by both CSS and Framer Motion.

## Timing

- Element entrance: 450–600ms.
- Row/source stagger: 80ms.
- Path drawing: 900–1200ms.
- Engine activation: 450ms.
- Idle packet traversal: 1800ms.
- Idle pause: 4000ms.
- Primary easing: `[0.22, 1, 0.36, 1]`.
- Continuous packet travel uses linear easing.

## Responsive Behaviour

The existing diagram scale and breakpoints remain unchanged. Motion uses
transforms and opacity, so it does not alter grid dimensions or introduce
horizontal scrolling. Signal packets remain clipped to the SVG viewBox.

## Accessibility

When `prefers-reduced-motion` is enabled:

- All paths render fully drawn.
- All cards and rows render in their final visible positions.
- Engine pulse, signal packets, and preview micro-animations are disabled.
- No content is delayed or hidden.

## Testing

Automated tests verify:

- The timeline stages are ordered input → engine → output → outcomes.
- Input and output paths use Motion path drawing.
- Every feature row participates in the Motion stagger.
- Reduced motion renders the complete diagram without looping animation.
- The existing five feature rows and previews remain present.

Browser verification covers a fresh page load, settled idle state, reduced
motion, console errors, and horizontal overflow at the existing required
breakpoints.
