import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import TestimonialsLoop from "./components/TestimonialsLoop.jsx";

const testimonialsRoot = document.getElementById("testimonials-root");

if (testimonialsRoot) {
  createRoot(testimonialsRoot).render(
    <StrictMode>
      <TestimonialsLoop />
    </StrictMode>,
  );
}
