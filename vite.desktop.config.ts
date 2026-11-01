import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  publicDir: false,
  resolve: { alias: { "@": resolve(root, "src") } },
  build: {
    outDir: "/tmp/wire-www",
    emptyOutDir: true,
    rollupOptions: { input: resolve(root, "desktop/index.html") },
  },
});
