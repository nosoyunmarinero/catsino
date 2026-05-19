// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // 🌟 Agregado para que GitHub Pages mapee bien los assets del Catsino
  server: {
    port: 3000,
    open: true,
  },
});
