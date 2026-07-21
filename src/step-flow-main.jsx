import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import StepFlow from "./components/StepFlow.jsx";

const stepFlowRoot = document.getElementById("step-flow-root");

if (stepFlowRoot) {
  createRoot(stepFlowRoot).render(
    <StrictMode>
      <StepFlow />
    </StrictMode>,
  );
}
