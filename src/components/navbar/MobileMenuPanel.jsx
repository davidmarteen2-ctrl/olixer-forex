import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MOBILE_NAV_ITEMS = [
  { label: "Product", href: "#gallery" },
  { label: "Features", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#signals" },
  { label: "Company", href: "#stats" },
];

export default function MobileMenuPanel({ isOpen, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu-panel"
          ref={panelRef}
          className="mobile-menu-panel"
          aria-hidden={!isOpen}
          initial={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0 round 16px)" }}
          animate={{ opacity: 1, height: "auto", clipPath: "inset(0 0 0% 0 round 16px)" }}
          exit={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0 round 16px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="mobile-nav-list">
            {MOBILE_NAV_ITEMS.map((item, index) => (
              <motion.li
                key={item.label}
                className="mobile-nav-item"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.04 }}
              >
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span>{item.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="mobile-actions">
            <a
              href="#"
              className="secondary-action"
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
            >
              Log in
            </a>
            <a
              href="#pricing"
              className="primary-cta"
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
            >
              <span>Start free trial</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
