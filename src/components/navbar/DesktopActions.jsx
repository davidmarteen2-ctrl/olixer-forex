import { motion } from "framer-motion";

export default function DesktopActions({
  actionGap,
  ctaPaddingX,
  ctaHeight,
  ctaRadius,
}) {
  return (
    <motion.div
      layout="position"
      className="desktop-actions"
      style={actionGap ? { gap: actionGap } : undefined}
    >
      <a href="#" className="secondary-action">
        Log in
      </a>
      <motion.a
        href="#pricing"
        className="primary-cta"
        style={{
          paddingLeft: ctaPaddingX,
          paddingRight: ctaPaddingX,
          height: ctaHeight,
          borderRadius: ctaRadius,
        }}
        whileHover={{ y: -1, scale: 1.012 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="primary-cta-label">Start free trial</span>
      </motion.a>
    </motion.div>
  );
}
