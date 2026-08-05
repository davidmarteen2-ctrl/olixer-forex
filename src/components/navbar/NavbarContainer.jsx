import BrandLockup from "./BrandLockup.jsx";
import DesktopActions from "./DesktopActions.jsx";
import DesktopNav from "./DesktopNav.jsx";
import MobileMenuTrigger from "./MobileMenuTrigger.jsx";

export default function NavbarContainer({
  isMobileMenuOpen,
  onToggleMobileMenu,
  usesDesktopNavigation,
  navGap,
  actionGap,
  brandGap,
  ctaPaddingX,
  ctaHeight,
  ctaRadius,
  logoScale,
}) {
  // usesDesktopNavigation drives the resize-menu-close guard in NavbarShell.
  // Visibility of desktop vs mobile elements is handled by CSS media queries
  // so the full DOM is always present for SSR hydration and accessibility.
  void usesDesktopNavigation;

  return (
    <div className="navbar-container">
      <BrandLockup brandGap={brandGap} logoScale={logoScale} />
      <DesktopNav navGap={navGap} />
      <DesktopActions
        actionGap={actionGap}
        ctaPaddingX={ctaPaddingX}
        ctaHeight={ctaHeight}
        ctaRadius={ctaRadius}
      />
      <MobileMenuTrigger
        isOpen={isMobileMenuOpen}
        onClick={onToggleMobileMenu}
      />
    </div>
  );
}
