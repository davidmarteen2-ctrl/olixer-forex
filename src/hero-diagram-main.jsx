import { createRoot } from "react-dom/client";
import ResponsiveHeroVisual from "./components/hero-diagram/ResponsiveHeroVisual.jsx";

const heroDiagramRoot = document.getElementById("hero-diagram-root");

if (heroDiagramRoot) {
  createRoot(heroDiagramRoot).render(<ResponsiveHeroVisual />);
}
