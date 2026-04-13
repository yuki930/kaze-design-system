#!/usr/bin/env node
/**
 * Print a terse size report for the shipped library files.
 *
 * Covers:
 * - JS entry points (dist/index.js, dist/hooks.js, dist/tokens.js) gzipped
 * - Per-component JS chunks (min / median / max) to confirm tree-shaking
 * - CSS bundles (tokens, reset, components, utilities, kaze) gzipped
 *
 * Intended use: run locally or in CI to watch for regressions. Emits
 * simple "name: raw / gzip" lines so diffs stay readable.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function bytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} kB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function measure(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath);
  const gz = zlib.gzipSync(raw, { level: 9 });
  return { raw: raw.length, gzip: gz.length };
}

function row(label, size) {
  if (!size) return `${label.padEnd(42)}  —`;
  return `${label.padEnd(42)}  ${bytes(size.raw).padStart(9)}  ${bytes(size.gzip).padStart(9)} gz`;
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function main() {
  if (!fs.existsSync(dist)) {
    console.error("dist/ missing — run `npm run build:lib` first.");
    process.exit(1);
  }

  console.log("kaze-design-system bundle size report");
  console.log("=".repeat(72));
  console.log();
  console.log("JS entry points");
  console.log("-".repeat(72));
  const entries = [
    ["dist/index.js", "main bundle (all components)"],
    ["dist/hooks.js", "hooks subpath"],
    ["dist/tokens.js", "tokens subpath"],
  ];
  for (const [file, label] of entries) {
    console.log(row(label, measure(path.join(root, file))));
  }

  console.log();
  console.log("Per-component JS chunks (tree-shakeable)");
  console.log("-".repeat(72));
  const compDir = path.join(dist, "components");
  const chunks = fs.existsSync(compDir)
    ? fs
        .readdirSync(compDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => {
          const jsFile = path.join(compDir, e.name, `${e.name}.js`);
          const m = measure(jsFile);
          return m ? { name: e.name, ...m } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.gzip - a.gzip)
    : [];
  if (chunks.length) {
    const totalRaw = sum(chunks.map((c) => c.raw));
    const totalGz = sum(chunks.map((c) => c.gzip));
    console.log(
      row(`TOTAL (${chunks.length} components)`, { raw: totalRaw, gzip: totalGz }),
    );
    console.log(row("largest: " + chunks[0].name, chunks[0]));
    const median = chunks[Math.floor(chunks.length / 2)];
    console.log(row("median:  " + median.name, median));
    const smallest = chunks[chunks.length - 1];
    console.log(row("smallest: " + smallest.name, smallest));
  }

  console.log();
  console.log("CSS bundles");
  console.log("-".repeat(72));
  const cssFiles = [
    ["tokens.css", "design tokens"],
    ["reset.css", "reset"],
    ["components.css", "all components"],
    ["utilities.css", "utilities"],
    ["kaze.css", "umbrella (@layer wrapper)"],
  ];
  let cssRawTotal = 0;
  let cssGzTotal = 0;
  for (const [file, label] of cssFiles) {
    const m = measure(path.join(root, file));
    console.log(row(`${file} — ${label}`, m));
    if (m) {
      cssRawTotal += m.raw;
      cssGzTotal += m.gzip;
    }
  }
  console.log(row("TOTAL CSS", { raw: cssRawTotal, gzip: cssGzTotal }));

  console.log();
  console.log(
    "Tip: peer deps (react, react-dom, lucide-react) and CSS custom-prop resolution are NOT counted here.",
  );
}

main();
