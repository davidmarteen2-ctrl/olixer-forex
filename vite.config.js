import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// make `server.open` launch Brave (macOS app name) instead of the default browser
process.env.BROWSER = "Brave Browser";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    environment: "jsdom",
    testTimeout: 15000,
  },
});
