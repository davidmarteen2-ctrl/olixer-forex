import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

import "./PricingSection.css";

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 19,
    yearly: 15,
    description: "A focused setup for traders copying a small set of proven strategies.",
    connections: "1 broker connection",
    strategies: "3 copied strategies",
    features: [
      "Real-time signal feed",
      "Standard risk controls",
      "Trade history and alerts",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    yearly: 39,
    popular: true,
    description: "The complete Olixer workspace for active traders managing multiple accounts.",
    connections: "3 broker connections",
    strategies: "Unlimited strategies",
    features: [
      "Everything in Starter",
      "Advanced risk automation",
      "Multi-account execution",
      "Priority signal delivery",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    monthly: 99,
    yearly: 79,
    description: "Higher limits and team controls for professional trading operations.",
    connections: "10 broker connections",
    strategies: "Unlimited strategies",
    features: [
      "Everything in Pro",
      "Team roles and permissions",
      "Execution health monitoring",
      "Priority support",
    ],
  },
];

const billingOptions = ["monthly", "yearly"];

export default function PricingSection({ reducedMotion }) {
  const sliderId = useId();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotion ?? prefersReducedMotion;
  const [billing, setBilling] = useState("monthly");
  const [selectedIndex, setSelectedIndex] = useState(1);
  const plan = pricingPlans[selectedIndex];
  const price = plan[billing];
  const sliderPercent = `${(selectedIndex / (pricingPlans.length - 1)) * 100}%`;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      className="pricing-calculator"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pricing-calculator__toolbar">
        <div className="pricing-billing" role="group" aria-label="Billing period">
          {billingOptions.map((option) => {
            const active = billing === option;
            const label = option === "monthly" ? "Monthly" : "Yearly";

            return (
              <button
                type="button"
                aria-label={label}
                aria-pressed={active}
                onClick={() => setBilling(option)}
                key={option}
              >
                {active && (
                  <motion.span
                    className="pricing-billing__pill"
                    layoutId="pricing-billing-pill"
                    transition={transition}
                  />
                )}
                <span>{label}</span>
                {option === "yearly" && <small>Save 20%</small>}
              </button>
            );
          })}
        </div>

        <p>{billing === "yearly" ? "Pay once per year" : "Cancel any time"}</p>
      </div>

      <div className="pricing-calculator__body">
        <div className="pricing-selector">
          <div className="pricing-selector__intro">
            <span>Choose your workspace</span>
            <p>Move the slider or select a plan. Every tier includes a 14-day free trial.</p>
          </div>

          <div className="pricing-plan-rail" role="group" aria-label="Pricing plans">
            {pricingPlans.map((item, index) => {
              const active = index === selectedIndex;

              return (
                <button
                  type="button"
                  className={active ? "is-active" : undefined}
                  aria-label={`Select ${item.name} plan`}
                  aria-pressed={active}
                  onClick={() => setSelectedIndex(index)}
                  key={item.id}
                >
                  {active && (
                    <motion.span
                      className="pricing-plan-rail__active"
                      layoutId="pricing-plan-active"
                      transition={transition}
                    />
                  )}
                  <span>{item.name}</span>
                  <small>${item[billing]}</small>
                </button>
              );
            })}
          </div>

          <div className="pricing-range" style={{ "--pricing-progress": sliderPercent }}>
            <label htmlFor={sliderId}>Choose pricing plan</label>
            <div className="pricing-range__track" aria-hidden="true">
              {pricingPlans.map((item, index) => (
                <span className={index <= selectedIndex ? "is-filled" : undefined} key={item.id} />
              ))}
            </div>
            <input
              id={sliderId}
              type="range"
              min="0"
              max={pricingPlans.length - 1}
              step="1"
              value={selectedIndex}
              aria-valuetext={plan.name}
              onChange={(event) => setSelectedIndex(Number(event.target.value))}
            />
            <div className="pricing-range__labels" aria-hidden="true">
              {pricingPlans.map((item) => <span key={item.id}>{item.name}</span>)}
            </div>
          </div>

          <div className="pricing-selector__note">
            <span aria-hidden="true">✓</span>
            No credit card required to start
          </div>
        </div>

        <motion.article className="pricing-focus" layout transition={transition}>
          <div className="pricing-focus__topline">
            <span>{plan.popular ? "Recommended for active traders" : "Built to scale with you"}</span>
            {plan.popular && <strong>Most popular</strong>}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="pricing-focus__identity"
              key={`${plan.id}-${billing}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={transition}
            >
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="pricing-focus__price" data-testid="pricing-amount">
                <span>$</span>
                <strong>{price}</strong>
                <small>/month</small>
              </div>
              <span className="pricing-focus__billing-note">
                {billing === "yearly" ? "Billed yearly · save 20%" : "Billed monthly"}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="pricing-focus__limits">
            <span>{plan.connections}</span>
            <span>{plan.strategies}</span>
          </div>

          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button className="pricing-focus__cta" type="button">
            Start 14-day free trial
            <span aria-hidden="true">↗</span>
          </button>
          <small className="pricing-focus__legal">Illustrative pricing for this site concept.</small>
        </motion.article>
      </div>
    </motion.div>
  );
}
