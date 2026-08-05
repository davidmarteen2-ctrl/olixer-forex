import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import MobileMenuPanel from "./MobileMenuPanel.jsx";
import NavbarContainer from "./NavbarContainer.jsx";
import "./Navbar.css";

export default function NavbarShell({ shouldAnimate = true }) {
  const shellRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const shouldReduceMotion = useReducedMotion();

  // Monitor window resize to maintain accurate responsive bounding
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1120 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Scroll progress normalized over [0, 220px] for smooth morphing
  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, 220], [0, 1], {
    clamp: true,
  });

  const morphProgress = useSpring(rawProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.9,
  });

  // Responsive navigation threshold — must have ≥1120px to show full desktop nav
  const usesDesktopNavigation = windowWidth >= 1120;
  const isDesktopShell = windowWidth >= 1024;

  // Numeric geometry transforms (Desktop shell >= 1024px)
  const desktopWidthTop = Math.min(1220, Math.max(320, windowWidth - 32));
  // Compact width respects natural content width — minimum 1020px
  const desktopWidthScrolled = Math.min(
    1020,
    Math.max(960, windowWidth - 48)
  );

  const navWidth = useTransform(
    morphProgress,
    [0, 1],
    [desktopWidthTop, desktopWidthScrolled]
  );
  const navHeight = useTransform(morphProgress, [0, 1], [70, 58]);
  const navRadius = useTransform(morphProgress, [0, 1], [18, 999]);
  const horizontalPadding = useTransform(morphProgress, [0, 1], [24, 16]);

  // Multi-layer glass filter & opacity transforms
  const blurAmount = useTransform(morphProgress, [0, 1], [8, 24]);
  const saturationAmount = useTransform(morphProgress, [0, 1], [108, 138]);
  const backdropFilter = useMotionTemplate`blur(${blurAmount}px) saturate(${saturationAmount}%)`;

  const tintOpacity = useTransform(morphProgress, [0, 1], [0.42, 0.88]);
  const scrimOpacity = useTransform(
    morphProgress,
    [0, 0.25, 1],
    [0.18, 0.42, 0.72]
  );

  // Internal layout reflow Motion values — controls must not crush
  const navGap = useTransform(morphProgress, [0, 1], [30, 21]);
  // Action gap: gentle compression, never below 14px
  const actionGap = useTransform(morphProgress, [0, 1], [18, 14]);
  const brandGap = useTransform(morphProgress, [0, 1], [10, 7]);
  // CTA padding: softer reduction so text never wraps
  const ctaPaddingX = useTransform(morphProgress, [0, 1], [20, 17]);
  // CTA height: finish at 40px, not 36px — avoids crushed appearance
  const ctaHeight = useTransform(morphProgress, [0, 1], [42, 40]);
  const ctaRadius = useTransform(morphProgress, [0, 1], [11, 999]);
  const logoScale = useTransform(morphProgress, [0, 1], [1, 0.9]);

  // Pointer specular response on desktop fine-pointer devices (max opacity 0.10)
  const handlePointerMove = (e) => {
    if (windowWidth < 1024 || !shellRef.current) return;
    const rect = shellRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    shellRef.current.style.setProperty("--mouse-x", `${x}px`);
    shellRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  // Outside click listener for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (shellRef.current && !shellRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  const isDesktop = isDesktopShell;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Responsive shell style calculation
  const getShellStyle = () => {
    if (shouldReduceMotion) {
      if (isDesktop) {
        return {
          width: "1220px",
          height: "70px",
          borderRadius: "18px",
          paddingLeft: "24px",
          paddingRight: "24px",
        };
      }
      if (isTablet) {
        return {
          width: "calc(100% - 32px)",
          maxWidth: "720px",
          height: "60px",
          borderRadius: "18px",
          paddingLeft: "18px",
          paddingRight: "18px",
        };
      }
      return {
        width: "calc(100% - 24px)",
        height: "58px",
        borderRadius: "16px",
        paddingLeft: "16px",
        paddingRight: "16px",
      };
    }

    if (isDesktop) {
      return {
        width: navWidth,
        height: navHeight,
        borderRadius: navRadius,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
      };
    }

    if (isTablet) {
      return {
        width: "calc(100% - 32px)",
        maxWidth: "720px",
        height: isMobileMenuOpen ? "auto" : "60px",
        borderRadius: "18px",
        paddingLeft: "18px",
        paddingRight: "18px",
      };
    }

    return {
      width: "calc(100% - 24px)",
      height: isMobileMenuOpen ? "auto" : "58px",
      borderRadius: "16px",
      paddingLeft: "16px",
      paddingRight: "16px",
    };
  };

  return (
    <div className="navbar-positioner">
      <motion.div
        className="navbar-entrance-wrapper"
        initial={
          shouldAnimate
            ? { opacity: 0, y: -10, filter: "blur(4px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.65,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.header
          ref={shellRef}
          layout={!shouldReduceMotion}
          className="navbar-shell"
          style={getShellStyle()}
          onPointerMove={handlePointerMove}
        >
          {/* Layer 0: Transparent backdrop filter diffusion layer */}
          <motion.div
            className="navbar-backdrop-layer"
            style={
              shouldReduceMotion
                ? undefined
                : {
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                  }
            }
            aria-hidden="true"
          />

          {/* Layer 1: Warm cream gradient tint layer */}
          <motion.div
            className="navbar-tint-layer"
            style={shouldReduceMotion ? undefined : { opacity: tintOpacity }}
            aria-hidden="true"
          />

          {/* Layer 2: Content-isolating warm veil (prevents text bleed-through) */}
          <motion.div
            className="navbar-scrim-layer"
            style={shouldReduceMotion ? undefined : { opacity: scrimOpacity }}
            aria-hidden="true"
          />

          {/* Layer 3: Specular light-catching edge highlight */}
          <div className="navbar-edge-highlight" aria-hidden="true" />

          {/* Layer 5: Primary navigation content */}
          <nav className="navbar-content" aria-label="Primary navigation">
            <NavbarContainer
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
              usesDesktopNavigation={usesDesktopNavigation}
              navGap={navGap}
              actionGap={actionGap}
              brandGap={brandGap}
              ctaPaddingX={ctaPaddingX}
              ctaHeight={ctaHeight}
              ctaRadius={ctaRadius}
              logoScale={logoScale}
            />
            <MobileMenuPanel
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </motion.header>
      </motion.div>
    </div>
  );
}
