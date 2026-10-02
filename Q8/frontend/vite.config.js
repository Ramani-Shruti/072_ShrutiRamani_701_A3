import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api calls are forwarded to the express backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:5000" },
  },
});
