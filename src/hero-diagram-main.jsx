import { createRoot } from "react-dom/client";

import HeroDiagram from "./components/hero-diagram/HeroDiagram.jsx";

const heroDiagramRoot = document.getElementById("hero-diagram-root");

if (heroDiagramRoot) {
  createRoot(heroDiagramRoot).render(<HeroDiagram />);
}
