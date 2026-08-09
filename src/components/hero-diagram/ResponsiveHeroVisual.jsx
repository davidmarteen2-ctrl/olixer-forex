import DesktopHeroDiagram from "./HeroDiagram.jsx";
import MobileFocusTopology from "./MobileFocusTopology.jsx";
import TabletSignalDiagram from "./TabletSignalDiagram.jsx";
import { useResponsiveMode } from "./useResponsiveMode.js";

/**
 * Routes to the breakpoint-correct visual scene for each layout.
 *
 * mobile  (<768px)    → MobileFocusTopology   mobile-first product scene
 * tablet  (768–1023px)→ TabletSignalDiagram  tablet system scene
 * desktop (≥1024px)  → DesktopHeroDiagram   original 1360px desktop map (unchanged)
 */
export default function ResponsiveHeroVisual() {
  const mode = useResponsiveMode();

  if (mode === "mobile")  return <MobileFocusTopology />;
  if (mode === "tablet")  return <TabletSignalDiagram />;
  return <DesktopHeroDiagram />;
}
