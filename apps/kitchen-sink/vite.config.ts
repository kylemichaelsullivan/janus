import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { janus } from "@janus/vite";

export default defineConfig({
  plugins: [janus({ platform: "web" }), react()],
});
