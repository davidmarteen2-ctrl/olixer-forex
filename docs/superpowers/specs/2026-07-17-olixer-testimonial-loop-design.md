# Olixer Testimonial Loop Design

## Goal

Add the planned testimonial section after Pricing and before the CTA, adapting the supplied Framer `TestimonialsLoopCarousel` behavior to Olixer.

## Design

- Use two continuously looping testimonial rows: the first moves left and the second moves right.
- Preserve the reference component's dark stage, translucent bordered review cards, card spacing, and edge-fade treatment.
- Use Olixer typography, orange/green accents, trading-oriented copy, and compact avatar initials.
- Pause both rows while the user hovers or focuses the carousel so reviews remain readable.
- Disable the loop for reduced-motion users and expose all reviews as normal semantic articles.
- Label the stories as illustrative concept content so the page does not imply verified customer claims.

## Responsive Behavior

Desktop shows two full rows of 430px cards. Mobile keeps one looping row at a time visually, uses 310px cards, maintains the opposing direction, and never creates document-level horizontal overflow.

## Verification

Component tests cover rendered content, duplicated loop tracks, opposite directions, and reduced-motion state. Final verification includes the full Vitest suite, Vite production build, and live Brave inspection at desktop and mobile widths.
