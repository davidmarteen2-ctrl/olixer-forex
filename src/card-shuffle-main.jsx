import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CardShuffle from "./components/CardShuffle.jsx";

const cardShuffleRoot = document.getElementById("card-shuffle-root");

if (cardShuffleRoot) {
  createRoot(cardShuffleRoot).render(
    <StrictMode>
      <CardShuffle />
    </StrictMode>,
  );
}
