import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { staticHtml } from "./plugins/static-html.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), staticHtml()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
