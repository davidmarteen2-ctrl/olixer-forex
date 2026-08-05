import DesktopHeroDiagram from "./HeroDiagram.jsx";
import MobileSignalPipeline from "./MobileSignalPipeline.jsx";
import TabletSignalDiagram from "./TabletSignalDiagram.jsx";
import { useResponsiveMode } from "./useResponsiveMode.js";

export default function ResponsiveHeroVisual() {
  const viewportMode = useResponsiveMode();

  if (viewportMode === "mobile") {
    return <MobileSignalPipeline />;
  }

  if (viewportMode === "tablet") {
    return <TabletSignalDiagram />;
  }

  return <DesktopHeroDiagram />;
}
