# Reference Diagram Parity Design

## Source of Truth

The supplied Olixer Forex diagram screenshot is the sole visual source of
truth for the hero ecosystem diagram. Existing implementation choices that
conflict with the reference are removed, even when they were introduced by
earlier prompts.

## Scope

Change only the diagram mounted inside `.diagram-outer`.

Do not change:

- Navbar
- Trust badge
- Hero heading or body copy
- CTA buttons
- Trader avatars and social proof
- Partner marquee
- Sections below the hero
- Global typography or colour tokens

## Required Structure

The final diagram is a single left-to-right system:

1. Four input source rows on the left
2. Four neutral connector paths converging on the Signal Engine
3. One central Signal Engine tile
4. One Smart Signal card below the engine
5. Five orange connector paths leaving the engine
6. Five outcome rows on the right

The EUR/USD market card above the engine is not present in the reference and
must be removed. Its dashed connector is removed with it.

## Input Sources

The four sources remain:

- Economic Calendar — Global events & impact
- Live Market Data — Real-time FX prices
- TradingView — Advanced charting
- Top Brokers — Deep liquidity access

Each source uses a restrained white row shell with:

- A circular icon protruding from the left edge
- Left-aligned title and description
- Consistent row width and height
- Thin neutral border
- Very restrained shadow
- Connector anchored to the row's right edge

The shell must not appear as a large floating card.

## Signal Engine

The Signal Engine remains centred between the input and output bundles. It
uses the reference's compact square tile, candlestick icon, `SIGNAL ENGINE`
label, and `AI-Powered Core` caption.

The Smart Signal card sits directly below the engine and contains:

- Smart Signal
- High Confidence
- GBP/JPY
- BUY
- Entry 195.842
- SL 196.850
- TP 194.820

There is no card above the engine.

## Outcome Rail

The five outcomes remain:

- Copy Trading — Follow top traders
- Smart Execution — Low latency fills
- Risk Management — Protect your capital
- Portfolio Insights — Track & optimize
- Performance Analytics — Measure & improve

Each outcome is one unified horizontal row:

```text
ICON | FEATURE COPY | INLINE PREVIEW
```

The row shell runs behind the copy and preview while the circular icon
protrudes from the left edge. Titles and preview starts align vertically
across all five rows.

Reference preview values are preserved:

- Copy Trading: Momentum Pro / @AlexFX / green sparkline
- Smart Execution: Market Order / Filled
- Risk Management: Risk per trade / 1.00% / slider
- Portfolio Insights: Open Positions / 8 / bar chart
- Performance Analytics: Win Rate / 78% / progress line

## Connectors and Labels

- Four neutral paths flow from sources into the engine.
- Five orange paths flow from the engine to outcome icons.
- Two junction markers remain on every path.
- `Market data in` sits above the left bundle.
- `Execution routed` sits above the right bundle.
- `Signal validated` sits below the left bundle.
- `Risk monitored` sits below the right bundle.
- The unused upper dashed engine connector is removed.
- The lower dashed connector between engine and Smart Signal remains.

## Composition

The diagram moves upward so its outer source and outcome rows begin alongside
the social-proof area, matching the compact vertical composition in the
reference. The centre engine remains lower than the first row and visually
anchors the network.

The 1192px authored coordinate system remains the desktop source of truth.
Existing responsive scaling keeps the composition inside the viewport.

## Motion

The existing Framer Motion data-flow choreography remains:

- Inputs reveal first.
- Neutral paths draw into the engine.
- Engine activates.
- Orange paths draw outward.
- Outcome rows reveal.
- Signal packets run as restrained idle motion.

Motion must never change the final reference geometry.

## Verification

Reference-parity checks cover:

- No EUR/USD card above the engine
- Exactly four input rows
- Exactly one Smart Signal card
- Exactly five unified outcome rows
- Correct reference copy and values
- Correct connector count and direction
- No overlap or horizontal overflow
- Final-state screenshots at 1440px, 1280px, 1024px, 768px, 430px, and 375px
