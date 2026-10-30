import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(root, "src/components/index.ts"),
        marketing: resolve(root, "src/components/marketing.ts"),
        hooks: resolve(root, "src/hooks/index.ts"),
        tokens: resolve(root, "src/tokens/tokens.ts"),
        writing: resolve(root, "src/writing/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "styles/[name][extname]",
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    minify: false,
  },
});
