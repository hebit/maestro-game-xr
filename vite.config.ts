import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/maestro-game-xr/",
  plugins: [react(), basicSsl()],
  resolve: {
    dedupe: ["@react-three/fiber", "three"],
  },
});
