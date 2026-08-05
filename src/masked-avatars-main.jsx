import { createRoot } from "react-dom/client";

import MaskedAvatars from "./components/MaskedAvatars.jsx";

const root = document.getElementById("masked-avatars-root");

if (root) {
  createRoot(root).render(<MaskedAvatars />);
}
