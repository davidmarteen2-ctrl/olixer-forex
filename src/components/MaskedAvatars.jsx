import { motion, useReducedMotion } from "framer-motion";

const TRADERS = [
  { name: "@AlexFX", image: "https://i.pravatar.cc/150?u=a" },
  { name: "@NovaTrades", image: "https://i.pravatar.cc/150?u=b" },
  { name: "@PipQueen", image: "https://i.pravatar.cc/150?u=c" },
  { name: "@FXShark", image: "https://i.pravatar.cc/150?u=d" },
  { name: "@DeltaKing", image: "https://i.pravatar.cc/150?u=e" },
];

const avatarListVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.54,
      staggerChildren: 0.08,
    },
  },
};

const avatarVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const captionVariants = {
  hidden: {
    opacity: 0,
    x: 8,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.94,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function MaskedAvatars({ reducedMotionOverride }) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotionOverride ?? prefersReducedMotion;

  return (
    <motion.div
      className="social-proof"
      role="group"
      aria-label="Trader avatars"
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      data-motion="social-proof"
    >
      <motion.ul className="av-stack" variants={avatarListVariants}>
        {TRADERS.map((trader) => (
          <motion.li
            key={trader.name}
            data-name={trader.name}
            data-motion="trader-avatar"
            variants={avatarVariants}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -6,
                    scale: 1.08,
                    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          >
            <img src={trader.image} alt={trader.name} />
          </motion.li>
        ))}
      </motion.ul>
      <motion.span
        className="cap"
        data-motion="trader-caption"
        variants={captionVariants}
      >
        <b>12,000+</b> traders copy signals here
      </motion.span>
    </motion.div>
  );
}
