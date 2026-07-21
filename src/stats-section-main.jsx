import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import StatsSection from "./components/StatsSection.jsx";

const statsSectionRoot = document.getElementById("stats-section-root");

if (statsSectionRoot) {
  createRoot(statsSectionRoot).render(
    <StrictMode>
      <StatsSection />
    </StrictMode>,
  );
}
