import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrandLockup from "./BrandLockup.jsx";
import "./MobileMorphNavbar.css";

const MOBILE_NAV_ITEMS = [
  { label: "Product", href: "#gallery" },
  { label: "Features", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#signals" },
  { label: "Company", href: "#stats" },
];

const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

export default function MobileMorphNavbar({ onCloseExternal }) {
  const [isOpen, setIsOpen] = useState(false);
  const shellRef = useRef(null);
  const triggerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    onCloseExternal?.();
  };

  // Keyboard Escape & Outside Click Listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.045,
        delayChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const mobileLinkVariants = {
    closed: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.34,
        ease: EASE_EDITORIAL,
      },
    },
  };

  return (
    <>
      {/* Page Veil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="mobile-nav-positioner mobile-navbar-root">
        <motion.header
          ref={shellRef}
          layout={!shouldReduceMotion}
          className="mobile-nav-shell"
          animate={{
            borderRadius: isOpen ? 22 : 16,
          }}
          transition={{
            layout: {
              duration: shouldReduceMotion ? 0.15 : 0.42,
              ease: EASE_EDITORIAL,
            },
          }}
        >
          {/* Header Bar */}
          <div className="mobile-nav-header">
            <BrandLockup />
            <button
              ref={triggerRef}
              type="button"
              className="mobile-menu-trigger"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={toggleMenu}
            >
              <span className="mobile-menu-label">
                {isOpen ? "Close" : "Menu"}
              </span>
              <motion.span
                className="mobile-menu-symbol"
                animate={{
                  rotate: isOpen ? 45 : 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.15 : 0.3,
                  ease: EASE_EDITORIAL,
                }}
              >
                +
              </motion.span>
            </button>
          </div>

          {/* Integrated Unfolding Content */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="mobile-navigation-content"
                id="mobile-navigation-menu"
                className="mobile-nav-content"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
              >
                <motion.ul className="mobile-nav-list" variants={mobileMenuVariants}>
                  {MOBILE_NAV_ITEMS.map((item, index) => (
                    <motion.li key={item.label} className="mobile-nav-item" variants={mobileLinkVariants}>
                      <a
                        href={item.href}
                        className="mobile-nav-link"
                        onClick={closeMenu}
                      >
                        <span className="mobile-nav-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mobile-nav-label">{item.label}</span>
                        <span className="mobile-nav-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  className="mobile-actions-wrapper"
                  variants={mobileLinkVariants}
                >
                  <a href="#" className="mobile-login-action" onClick={closeMenu}>
                    Log in
                  </a>
                  <a
                    href="#pricing"
                    className="mobile-primary-cta"
                    onClick={closeMenu}
                  >
                    <span>Start free trial</span>
                    <span className="mobile-cta-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>
    </>
  );
}
