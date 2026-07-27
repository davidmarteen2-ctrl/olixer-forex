import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import eightcapLogo from "../../assets/logos/eightcap-official.svg";
import pepperstoneLogo from "../../assets/logos/pepperstone-official.svg";
import forexcomLogo from "../../assets/logos/forexcom-official.svg";
import oandaLogo from "../../assets/logos/oanda-official.svg";

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

const SCENE_EASE = [0.22, 1, 0.36, 1];
const POP_SPRING = { type: "spring", stiffness: 420, damping: 30 };

const fadeUp = (delay = 0, duration = 0.45) => ({
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { delay, duration, ease: SCENE_EASE } },
});

const staggerGroup = (delayChildren = 0, staggerChildren = 0.12) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

const iconPop = {
  hidden: { scale: 0.4, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { ...POP_SPRING, delay: 0.1 } },
};

const scaleIconPop = {
  hidden: { scale: 0.4, opacity: 0, rotate: -14 },
  show: { scale: 1, opacity: 1, rotate: 0, transition: { ...POP_SPRING, delay: 0.1 } },
};

const checkDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { delay: 0.38, duration: 0.3, ease: "easeOut" } },
};

function useSceneStarted(ref, reduceMotion) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return undefined;

    if (reduceMotion || !("IntersectionObserver" in window) || !ref.current) {
      setStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, reduceMotion, started]);

  return started;
}

function useCountUp(target, { play, reduceMotion, delay = 0, duration = 0.8, formatter }) {
  const formatterRef = useRef(formatter);
  formatterRef.current = formatter;

  const [text, setText] = useState(() => formatterRef.current(reduceMotion ? target : 0));

  useEffect(() => {
    if (reduceMotion) {
      setText(formatterRef.current(target));
      return undefined;
    }
    if (!play) return undefined;

    const controls = animate(0, target, {
      delay,
      duration,
      ease: SCENE_EASE,
      onUpdate: (value) => setText(formatterRef.current(value)),
    });

    return () => controls.stop();
  }, [target, play, reduceMotion, delay, duration]);

  return text;
}

function AccountVisual({ play, reduceMotion }) {
  const setupPercent = useCountUp(100, {
    play,
    reduceMotion,
    delay: 0.35,
    duration: 0.7,
    formatter: (value) => `${Math.round(value)}%`,
  });

  return (
    <motion.div
      className="step-ui step-ui--account"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || play ? "show" : "hidden"}
    >
      <motion.div className="step-ui__bar" variants={fadeUp(0, 0.35)}>
        <span className="step-ui__brand"><i />Olixer</span>
      </motion.div>
      <motion.div className="account-card" variants={fadeUp(0.05)}>
        <div className="account-card__avatar">OA</div>
        <div className="account-card__info">
          <span className="step-ui__kicker">Trading profile</span>
          <h3>Oliver A.</h3>
          <p className="account-card__verified">
            <span className="account-card__mini-check">✓</span>
            Verified copy-trading account
          </p>
        </div>
      </motion.div>
      <motion.div className="setup-progress" variants={fadeUp(0.2, 0.4)}>
        <div className="setup-progress__top">
          <span>Account setup</span>
          <strong aria-label="100%"><span aria-hidden="true">{setupPercent}</span></strong>
        </div>
        <div className="setup-progress__track">
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { delay: 0.35, duration: 0.7, ease: SCENE_EASE } },
            }}
          />
        </div>
      </motion.div>
      <motion.div className="account-features" variants={staggerGroup(0.65, 0.12)}>
        <motion.div className="feature-card" variants={fadeUp()}>
          <motion.div className="feature-card__icon feature-card__icon--green" variants={iconPop}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <motion.path d="m9 12 2 2 4-4" variants={checkDraw} />
            </svg>
          </motion.div>
          <span>Identity</span>
          <strong>Verified</strong>
        </motion.div>
        <motion.div className="feature-card" variants={fadeUp()}>
          <motion.div className="feature-card__icon feature-card__icon--orange" variants={scaleIconPop}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
              <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
              <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
              <path d="M7 21h10" />
            </svg>
          </motion.div>
          <span>Risk profile</span>
          <strong>Balanced</strong>
        </motion.div>
        <motion.div className="feature-card" variants={fadeUp()}>
          <motion.div className="feature-card__icon feature-card__icon--green" variants={iconPop}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <motion.path d="m9 12 2 2 4-4" variants={checkDraw} />
            </svg>
          </motion.div>
          <span>2FA security</span>
          <strong>Enabled</strong>
        </motion.div>
      </motion.div>
      <motion.div
        className="profile-ready-bar"
        variants={{
          hidden: { opacity: 0, y: 12, scale: 0.97 },
          show: { opacity: 1, y: 0, scale: 1, transition: { ...POP_SPRING, delay: 1.15 } },
        }}
      >
        <span className="profile-ready-bar__check">✓</span>
        <span className="profile-ready-bar__text">Profile Ready</span>
      </motion.div>
    </motion.div>
  );
}

const brokerLogos = [
  ["Eightcap", eightcapLogo],
  ["Pepperstone", pepperstoneLogo],
  ["FOREX.com", forexcomLogo],
  ["OANDA", oandaLogo],
];

function BrokerVisual({ play, reduceMotion }) {
  return (
    <motion.div
      className="step-ui step-ui--broker"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || play ? "show" : "hidden"}
    >
      <motion.div className="step-ui__bar" variants={fadeUp(0, 0.35)}>
        <span className="step-ui__brand"><i />Broker network</span>
        <span className="step-ui__status step-ui__status--success">Broker connected</span>
      </motion.div>
      <motion.div className="broker-grid" variants={staggerGroup(0.1, 0.1)}>
        {brokerLogos.map(([name, src], index) => {
          const isConnected = index === 0;
          return (
            <motion.div
              className="broker-option"
              key={name}
              variants={{
                hidden: { opacity: 0, y: 14, scale: 0.97 },
                show: {
                  opacity: isConnected ? 1 : 0.6,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.4, ease: SCENE_EASE },
                },
              }}
            >
              <img src={src} alt={`${name} logo`} />
              {isConnected ? (
                <>
                  <motion.span
                    className="broker-option__connected-ring"
                    aria-hidden="true"
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { delay: 0.7, duration: 0.35 } },
                    }}
                  />
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, scale: 0.7 },
                      show: { opacity: 1, scale: 1, transition: { ...POP_SPRING, delay: 0.8 } },
                    }}
                  >
                    Connected
                  </motion.span>
                </>
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div
        className="broker-link"
        variants={{
          hidden: { opacity: 0, y: 18 },
          show: { opacity: 1, y: 0, transition: { delay: 0.95, duration: 0.45, ease: SCENE_EASE } },
        }}
      >
        <span className="broker-link__icon">↗</span>
        <div><span>Live account</span><strong>Eightcap ···· 2841</strong></div>
        <motion.span
          className="broker-link__pulse"
          variants={{
            hidden: { scale: 1 },
            show: {
              scale: [1, 1.45, 1],
              boxShadow: [
                "0 0 0 0 rgba(55, 191, 113, 0)",
                "0 0 0 8px rgba(55, 191, 113, 0.25)",
                "0 0 0 0 rgba(55, 191, 113, 0)",
              ],
              transition: { delay: 1.25, duration: 0.55, times: [0, 0.5, 1] },
            },
          }}
        />
      </motion.div>
      <motion.p className="step-ui__note" variants={fadeUp(1.1, 0.4)}>
        Encrypted connection · Read-only API permissions
      </motion.p>
    </motion.div>
  );
}

function TraderVisual({ play, reduceMotion }) {
  const returnPercent = useCountUp(28.4, {
    play,
    reduceMotion,
    delay: 0.35,
    duration: 0.8,
    formatter: (value) => `+${value.toFixed(1)}%`,
  });

  return (
    <motion.div
      className="step-ui step-ui--trader"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || play ? "show" : "hidden"}
    >
      <motion.div className="step-ui__bar" variants={fadeUp(0, 0.35)}>
        <span className="step-ui__brand"><i />Trader marketplace</span>
        <span className="step-ui__status">Live rankings</span>
      </motion.div>
      <motion.div className="trader-card trader-card--featured" variants={fadeUp(0.04, 0.4)}>
        <motion.span
          className="trader-card__spotlight"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, scale: 0.85 },
            show: { opacity: 1, scale: 1, transition: { delay: 0.08, duration: 0.55, ease: SCENE_EASE } },
          }}
        />
        <motion.div
          className="trader-card__rank"
          variants={{
            hidden: { opacity: 0, scale: 0.6, y: -4 },
            show: { opacity: 1, scale: 1, y: 0, transition: { ...POP_SPRING, delay: 0.2 } },
          }}
        >
          01
        </motion.div>
        <div className="trader-card__person">
          <motion.span
            className="trader-card__avatar"
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              show: { opacity: 1, scale: 1, transition: { ...POP_SPRING, delay: 0.3 } },
            }}
          >
            MP
            <motion.span
              className="trader-card__avatar-ring"
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                show: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.4, ease: SCENE_EASE } },
              }}
            />
          </motion.span>
          <motion.div variants={fadeUp(0.38, 0.35)}>
            <strong>Momentum Pro</strong>
            <span>42 months verified</span>
          </motion.div>
        </div>
        <motion.div className="trader-card__return" variants={fadeUp(0.5, 0.3)}>
          <span>12M return</span>
          <strong aria-label="+28.4%"><span aria-hidden="true">{returnPercent}</span></strong>
        </motion.div>
        <svg className="trader-card__chart" viewBox="0 0 130 48" aria-hidden="true">
          <motion.path
            d="M2 42 C18 37 22 39 34 30 S54 34 64 22 S82 28 93 15 S111 19 128 5"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              show: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { delay: 0.55, duration: 0.75, ease: "easeOut" },
                  opacity: { delay: 0.55, duration: 0.01 },
                },
              },
            }}
          />
        </svg>
      </motion.div>
      <motion.div className="risk-row" variants={fadeUp(1.35, 0.35)}>
        <span>Risk score</span>
        <motion.div className="risk-dots" variants={staggerGroup(1.45, 0.12)}>
          <motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.25, ease: SCENE_EASE } } }} />
          <motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.25, ease: SCENE_EASE } } }} />
          <motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.25, ease: SCENE_EASE } } }} />
          <i className="off" />
          <i className="off" />
        </motion.div>
        <strong>3 / 10</strong>
      </motion.div>
      <motion.div className="trader-list" variants={staggerGroup(1.7, 0.12)}>
        <motion.div variants={fadeUp()}><span>02</span><strong>Atlas FX</strong><em>+21.8%</em></motion.div>
        <motion.div variants={fadeUp()}><span>03</span><strong>London Session</strong><em>+17.3%</em></motion.div>
      </motion.div>
    </motion.div>
  );
}

const copyPositions = [
  { pair: "EUR / USD", icon: "euro", side: "Buy · 0.40 lots", pnl: 184.2, label: "+$184.20" },
  { pair: "GBP / JPY", icon: "pound", side: "Sell · 0.25 lots", pnl: 92.4, label: "+$92.40" },
  { pair: "XAU / USD", icon: "gold", side: "Buy · 0.10 lots", pnl: 61.8, label: "+$61.80" },
];

function PairIcon({ type }) {
  if (type === "pound") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 7c0-5.333-8-5.333-8 0" />
        <path d="M10 7v14" />
        <path d="M6 21h12" />
        <path d="M6 13h10" />
      </svg>
    );
  }
  if (type === "gold") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
        <path d="M15 6h1v4" />
        <path d="m6.134 14.768.866-.5 2 3.464" />
        <circle cx="16" cy="8" r="6" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
    </svg>
  );
}

const pairIconPop = {
  hidden: { opacity: 0, scale: 0.5, rotate: -14 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: POP_SPRING },
};

function PositionRow({ position, index, play, reduceMotion }) {
  const pnlText = useCountUp(position.pnl, {
    play,
    reduceMotion,
    delay: 0.65 + index * 0.12,
    duration: 0.5,
    formatter: (value) => `+$${value.toFixed(2)}`,
  });

  return (
    <motion.div variants={fadeUp()}>
      <motion.span className="pair-icon" variants={pairIconPop}>
        <PairIcon type={position.icon} />
      </motion.span>
      <p><strong>{position.pair}</strong><span>{position.side}</span></p>
      <em aria-label={position.label}><span aria-hidden="true">{pnlText}</span></em>
    </motion.div>
  );
}

function CopyVisual({ play, reduceMotion }) {
  const equityText = useCountUp(24860.2, {
    play,
    reduceMotion,
    delay: 0.15,
    duration: 0.9,
    formatter: (value) =>
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });

  return (
    <motion.div
      className="step-ui step-ui--copy"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || play ? "show" : "hidden"}
    >
      <motion.div className="step-ui__bar" variants={fadeUp(0, 0.35)}>
        <span className="step-ui__brand"><i />Copy engine</span>
        <span className="step-ui__status step-ui__status--live"><b />Copying live</span>
      </motion.div>
      <motion.div className="equity-card" variants={fadeUp(0.05, 0.4)}>
        <div>
          <span>Account equity</span>
          <strong aria-label="$24,860.20"><span aria-hidden="true">{equityText}</span></strong>
        </div>
        <motion.span
          className="equity-card__gain"
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            show: { opacity: 1, scale: 1, transition: { ...POP_SPRING, delay: 0.75 } },
          }}
        >
          +4.8%
        </motion.span>
      </motion.div>
      <motion.div className="position-head" variants={fadeUp(0.45, 0.35)}>
        <span>Open positions</span><span>3 active</span>
      </motion.div>
      <motion.div className="position-list" variants={staggerGroup(0.55, 0.12)}>
        {copyPositions.map((position, index) => (
          <PositionRow
            key={position.pair}
            position={position}
            index={index}
            play={play}
            reduceMotion={reduceMotion}
          />
        ))}
      </motion.div>
      <motion.div className="copy-footer" variants={fadeUp(1.25, 0.4)}>
        <span>Master</span><strong>Momentum Pro</strong>
        <span className="copy-footer__sync"><i />Risk sync on</span>
      </motion.div>
    </motion.div>
  );
}

function StepVisual({ stepId, play, reduceMotion }) {
  if (stepId === "broker") return <BrokerVisual play={play} reduceMotion={reduceMotion} />;
  if (stepId === "trader") return <TraderVisual play={play} reduceMotion={reduceMotion} />;
  if (stepId === "copy") return <CopyVisual play={play} reduceMotion={reduceMotion} />;
  return <AccountVisual play={play} reduceMotion={reduceMotion} />;
}

export default function StepFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const shellRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const sceneStarted = useSceneStarted(shellRef, reduceMotion);
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

      <div className="step-flow__visual-shell" ref={shellRef}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeStep.id}
            id={`step-flow-panel-${activeStep.id}`}
            className="step-flow__visual"
            role="tabpanel"
            aria-labelledby={`step-flow-tab-${activeStep.id}`}
            {...panelMotion}
          >
            <StepVisual stepId={activeStep.id} play={sceneStarted} reduceMotion={reduceMotion} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
