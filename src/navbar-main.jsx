import { hydrateRoot, createRoot } from "react-dom/client";
import NavbarShell from "./components/navbar/NavbarShell.jsx";

const root = document.getElementById("navbar-root");

if (root) {
  const shouldAnimate =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("hero-intro-pending");

  if (root.hasChildNodes()) {
    hydrateRoot(root, <NavbarShell shouldAnimate={shouldAnimate} />);
  } else {
    createRoot(root).render(<NavbarShell shouldAnimate={shouldAnimate} />);
  }
}
