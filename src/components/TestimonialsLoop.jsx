import { useReducedMotion } from "framer-motion";

import "./TestimonialsLoop.css";

export const testimonials = [
  {
    id: "maya-okafor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Maya Okafor",
    initials: "MO",
    role: "Swing trader · Lagos",
    pair: "EUR/USD",
    accent: "#F0821E",
    quote: "The setup is clear before I commit: entry, stop, target, and the reason behind the signal all live in one place.",
  },
  {
    id: "daniel-brooks",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Daniel Brooks",
    initials: "DB",
    role: "Multi-account trader · London",
    pair: "GBP/JPY",
    accent: "#58C98A",
    quote: "I can follow a strategy across my accounts without turning every trade into a manual checklist. The risk controls stay visible.",
  },
  {
    id: "sofia-mendes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Sofia Mendes",
    initials: "SM",
    role: "Position trader · Lisbon",
    pair: "XAU/USD",
    accent: "#7C91FF",
    quote: "Olixer makes the handoff from market idea to execution feel calm. I spend less time searching for context and more time reviewing it.",
  },
  {
    id: "ethan-cole",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Ethan Cole",
    initials: "EC",
    role: "Copy trader · Toronto",
    pair: "USD/CAD",
    accent: "#F5B75C",
    quote: "The signal feed gives me enough detail to understand what I am copying, while the workspace keeps open positions easy to monitor.",
  },
  {
    id: "amara-lewis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Amara Lewis",
    initials: "AL",
    role: "Risk-first trader · Accra",
    pair: "GBP/USD",
    accent: "#54B7C9",
    quote: "What stands out is the consistency. Position size, risk per trade, and account exposure are presented the same way every time.",
  },
  {
    id: "noah-williams",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Noah Williams",
    initials: "NW",
    role: "Portfolio manager · Dubai",
    pair: "NAS100",
    accent: "#D78BFF",
    quote: "Moving between strategies feels immediate, but I never lose the wider portfolio view. That balance makes the workflow practical.",
  },
];

function TestimonialCard({ testimonial, duplicate = false }) {
  const Tag = duplicate ? "div" : "article";
  return (
    <Tag
      className="testimonial-card"
      aria-hidden={duplicate ? "true" : undefined}
      style={{ "--testimonial-accent": testimonial.accent }}
    >
      <div className="testimonial-card__author">
        <span className="testimonial-card__avatar" aria-hidden="true">
          <img src={testimonial.avatar} alt="" loading="lazy" />
        </span>
        <div className="testimonial-card__meta">
          <h3>{testimonial.name}</h3>
          <p>{testimonial.role}</p>
        </div>
        <span className="testimonial-card__pair">{testimonial.pair}</span>
      </div>
      <p className="testimonial-card__text">&ldquo;{testimonial.quote}&rdquo;</p>
    </Tag>
  );
}

export default function TestimonialsLoop({ reducedMotion }) {
  const prefersReducedMotion = useReducedMotion();
  const isReduced = reducedMotion ?? prefersReducedMotion ?? false;

  // one visual set must stay wider than any viewport for a seamless loop,
  // so each set repeats the six stories twice (~4000px per set)
  const loopItems = [...testimonials, ...testimonials];

  return (
    <div className="testimonials-block">
      <header className="testimonials-block__head">
        <span className="testimonials-block__eyebrow">Trader workflows</span>
        <h2 id="testimonials-heading">A calmer way to stay in the market.</h2>
        <p>
          See how different trading styles fit into one focused workflow—from
          reviewing a setup to monitoring every copied position.
        </p>
      </header>

      <p className="testimonials-block__disclosure">
        Illustrative trader stories for this concept
      </p>

      <div
        className="testimonials-marquee"
        data-reduced-motion={isReduced ? "true" : "false"}
        data-testid="testimonial-marquee"
      >
        <div className="testimonials-marquee__track">
          {loopItems.map((testimonial, index) => (
            <TestimonialCard testimonial={testimonial} key={`${testimonial.id}-a${index}`} />
          ))}
          {loopItems.map((testimonial, index) => (
            <TestimonialCard testimonial={testimonial} duplicate key={`${testimonial.id}-b${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
