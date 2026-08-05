import { useEffect, useState } from "react";

export function useResponsiveMode() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setMode("mobile");
      } else if (w < 1024) {
        setMode("tablet");
      } else {
        setMode("desktop");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return mode;
}
