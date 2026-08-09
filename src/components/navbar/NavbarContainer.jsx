import BrandLockup from "./BrandLockup.jsx";
import DesktopActions from "./DesktopActions.jsx";
import DesktopNav from "./DesktopNav.jsx";

export default function NavbarContainer({
  navGap,
  actionGap,
  brandGap,
  ctaPaddingX,
  ctaHeight,
  ctaRadius,
  logoScale,
}) {
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
    </div>
  );
}
