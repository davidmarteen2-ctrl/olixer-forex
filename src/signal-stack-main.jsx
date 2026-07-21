import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import SignalStack from "./components/SignalStack.jsx";

const signalStackRoot = document.getElementById("signal-stack-root");

if (signalStackRoot) {
  createRoot(signalStackRoot).render(
    <StrictMode>
      <SignalStack />
    </StrictMode>,
  );
}
