import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import PricingSection from "./components/PricingSection.jsx";

const pricingSectionRoot = document.getElementById("pricing-section-root");

if (pricingSectionRoot) {
  createRoot(pricingSectionRoot).render(
    <StrictMode>
      <PricingSection />
    </StrictMode>,
  );
}
