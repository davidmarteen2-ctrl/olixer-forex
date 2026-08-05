import { useEffect, useState } from "react";
import DesktopMorphNavbar from "./DesktopMorphNavbar.jsx";
import MobileMorphNavbar from "./MobileMorphNavbar.jsx";

export default function NavbarShell({ shouldAnimate = true }) {
  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth : 1200;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowWidth < 1024) {
    return <MobileMorphNavbar />;
  }

  return <DesktopMorphNavbar shouldAnimate={shouldAnimate} />;
}

export { DesktopMorphNavbar, MobileMorphNavbar };
