import { motion } from "framer-motion";

export default function BrandLockup({ brandGap, logoScale }) {
  return (
    <motion.a
      href="#"
      className="brand-lockup"
      aria-label="Olixer Forex Homepage"
      style={brandGap ? { gap: brandGap } : undefined}
    >
      <motion.svg
        className="brand-logo-mark"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
        style={logoScale ? { scale: logoScale } : undefined}
      >
        <rect
          x="4"
          y="4"
          width="26"
          height="26"
          rx="8.5"
          stroke="currentColor"
          strokeWidth="3.2"
        />
      </motion.svg>
      <span className="brand-name">
        Olixer
        <br />
        Forex
      </span>
    </motion.a>
  );
}
