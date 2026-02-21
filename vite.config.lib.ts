import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { preserveDirectives } from "rollup-plugin-preserve-directives";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/components/index.ts"),
        hooks: resolve(__dirname, "src/hooks/index.ts"),
        tokens: resolve(__dirname, "src/tokens/tokens.ts"),
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
      plugins: [preserveDirectives()],
    },
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    minify: false,
  },
});
