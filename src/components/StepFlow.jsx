import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import "./StepFlow.css";

export const stepFlowItems = [
  {
    id: "account",
    number: "01",
    title: "Create your account",
    description: "Set up your Olixer profile in minutes.",
  },
  {
    id: "broker",
    number: "02",
    title: "Connect your broker",
    description: "Link a supported trading account securely.",
  },
  {
    id: "trader",
    number: "03",
    title: "Choose a proven trader",
    description: "Compare performance, drawdown, and risk.",
  },
  {
    id: "copy",
    number: "04",
    title: "Copy trades automatically",
    description: "Mirror positions and monitor everything live.",
  },
];

function AccountVisual() {
  return (
    <div className="step-ui step-ui--account">
      <div className="step-ui__bar">
        <span className="step-ui__brand"><i />Olixer</span>
      </div>
      <div className="account-card">
        <div className="account-card__avatar">OA</div>
        <div className="account-card__info">
          <span className="step-ui__kicker">Trading profile</span>
          <h3>Oliver A.</h3>
          <p className="account-card__verified">
            <span className="account-card__mini-check">✓</span>
            Verified copy-trading account
          </p>
        </div>
      </div>
      <div className="setup-progress">
        <div className="setup-progress__top"><span>Account setup</span><strong>100%</strong></div>
        <div className="setup-progress__track"><span /></div>
      </div>
      <div className="account-features">
        <div className="feature-card">
          <div className="feature-card__icon feature-card__icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>Identity</span>
          <strong>Verified</strong>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon feature-card__icon--orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 16c0-3-3-3-3-3H11s-3 0-3 3" />
              <path d="M12 3v18" />
              <path d="M3 7h18" />
              <path d="M6 7l-3 9h6Z" />
              <path d="M18 7l-3 9h6Z" />
            </svg>
          </div>
          <span>Risk profile</span>
          <strong>Balanced</strong>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon feature-card__icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span>2FA security</span>
          <strong>Enabled</strong>
        </div>
      </div>
      <div className="profile-ready-bar">
        <span className="profile-ready-bar__check">✓</span>
        <span className="profile-ready-bar__text">Profile Ready</span>
      </div>
    </div>
  );
}

const brokerLogos = [
  ["Eightcap", "/assets/logos/eightcap-official.svg"],
  ["Pepperstone", "/assets/logos/pepperstone-official.svg"],
  ["FOREX.com", "/assets/logos/forexcom-official.svg"],
  ["OANDA", "/assets/logos/oanda-official.svg"],
];

function BrokerVisual() {
  return (
    <div className="step-ui step-ui--broker">
      <div className="step-ui__bar">
        <span className="step-ui__brand"><i />Broker network</span>
        <span className="step-ui__status step-ui__status--success">Broker connected</span>
      </div>
      <div className="broker-grid">
        {brokerLogos.map(([name, src], index) => (
          <div className={`broker-option${index === 0 ? " broker-option--active" : ""}`} key={name}>
            <img src={src} alt={`${name} logo`} />
            {index === 0 ? <span>Connected</span> : null}
          </div>
        ))}
      </div>
      <div className="broker-link">
        <span className="broker-link__icon">↗</span>
        <div><span>Live account</span><strong>Eightcap ···· 2841</strong></div>
        <span className="broker-link__pulse" />
      </div>
      <p className="step-ui__note">Encrypted connection · Read-only API permissions</p>
    </div>
  );
}

function TraderVisual() {
  return (
    <div className="step-ui step-ui--trader">
      <div className="step-ui__bar">
        <span className="step-ui__brand"><i />Trader marketplace</span>
        <span className="step-ui__status">Live rankings</span>
      </div>
      <div className="trader-card trader-card--featured">
        <div className="trader-card__rank">01</div>
        <div className="trader-card__person"><span className="trader-card__avatar">MP</span><div><strong>Momentum Pro</strong><span>42 months verified</span></div></div>
        <div className="trader-card__return"><span>12M return</span><strong>+28.4%</strong></div>
        <svg className="trader-card__chart" viewBox="0 0 130 48" aria-hidden="true">
          <path d="M2 42 C18 37 22 39 34 30 S54 34 64 22 S82 28 93 15 S111 19 128 5" />
        </svg>
      </div>
      <div className="risk-row">
        <span>Risk score</span><div className="risk-dots"><i /><i /><i /><i className="off" /><i className="off" /></div><strong>3 / 10</strong>
      </div>
      <div className="trader-list">
        <div><span>02</span><strong>Atlas FX</strong><em>+21.8%</em></div>
        <div><span>03</span><strong>London Session</strong><em>+17.3%</em></div>
      </div>
    </div>
  );
}

function CopyVisual() {
  return (
    <div className="step-ui step-ui--copy">
      <div className="step-ui__bar">
        <span className="step-ui__brand"><i />Copy engine</span>
        <span className="step-ui__status step-ui__status--live"><b />Copying live</span>
      </div>
      <div className="equity-card">
        <div><span>Account equity</span><strong>$24,860.20</strong></div>
        <span className="equity-card__gain">+4.8%</span>
      </div>
      <div className="position-head"><span>Open positions</span><span>3 active</span></div>
      <div className="position-list">
        <div><span className="pair-icon">€</span><p><strong>EUR / USD</strong><span>Buy · 0.40 lots</span></p><em>+$184.20</em></div>
        <div><span className="pair-icon">£</span><p><strong>GBP / JPY</strong><span>Sell · 0.25 lots</span></p><em>+$92.40</em></div>
        <div><span className="pair-icon">$</span><p><strong>XAU / USD</strong><span>Buy · 0.10 lots</span></p><em>+$61.80</em></div>
      </div>
      <div className="copy-footer"><span>Master</span><strong>Momentum Pro</strong><span>Risk sync on</span></div>
    </div>
  );
}

function StepVisual({ stepId }) {
  if (stepId === "broker") return <BrokerVisual />;
  if (stepId === "trader") return <TraderVisual />;
  if (stepId === "copy") return <CopyVisual />;
  return <AccountVisual />;
}

export default function StepFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const activeStep = stepFlowItems[activeIndex];

  const handleKeyDown = (event, index) => {
    const lastIndex = stepFlowItems.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % stepFlowItems.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + stepFlowItems.length) % stepFlowItems.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const panelMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 14, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.99 },
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="step-flow">
      <div className="step-flow__steps" role="tablist" aria-label="How Olixer works">
        {stepFlowItems.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={step.id}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`step-flow-tab-${step.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`step-flow-panel-${step.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`step-flow__step${isActive ? " step-flow__step--active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {isActive ? (
                <motion.span
                  className="step-flow__active"
                  layoutId="step-flow-active"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="step-flow__number">{step.number}</span>
              <span className="step-flow__step-copy">
                <span className="step-flow__title">{step.title}</span>
                <span className="step-flow__description">{step.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="step-flow__visual-shell">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeStep.id}
            id={`step-flow-panel-${activeStep.id}`}
            className="step-flow__visual"
            role="tabpanel"
            aria-labelledby={`step-flow-tab-${activeStep.id}`}
            {...panelMotion}
          >
            <StepVisual stepId={activeStep.id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
