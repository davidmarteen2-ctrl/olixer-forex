import { hydrateRoot } from "react-dom/client";
import HeroHeader from "./components/HeroHeader.jsx";

const root = document.getElementById("hero-header-root");

if (root) {
  const shouldAnimate =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("hero-intro-pending");

  hydrateRoot(
    root,
    <HeroHeader shouldAnimate={shouldAnimate} />,
    {
      onRecoverableError(error, errorInfo) {
        if (import.meta.env.DEV) {
          console.error(
            "[HeroHeader hydration error]",
            error,
            errorInfo,
          );
        }
      },
    },
  );
}
