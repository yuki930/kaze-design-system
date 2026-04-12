#!/usr/bin/env node
/**
 * Generates public/llms.txt and public/llms-full.txt from the design system
 * documentation source (src/views/docs/ComponentPage.tsx and
 * src/views/docs/ComponentsOverview.tsx) so that AI coding assistants can
 * discover every kaze-design-system component and its API via a single
 * machine-readable file.
 *
 * Convention: https://llmstxt.org/
 * - /llms.txt       → short, navigable index
 * - /llms-full.txt  → full API reference (descriptions, props, usage)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const COMPONENT_PAGE = path.join(root, "src/views/docs/ComponentPage.tsx");
const OVERVIEW_PAGE = path.join(root, "src/views/docs/ComponentsOverview.tsx");
const PACKAGE_JSON = path.join(root, "package.json");
const OUT_SHORT = path.join(root, "public/llms.txt");
const OUT_FULL = path.join(root, "public/llms-full.txt");

const SITE_URL = "https://kaze-design-system.vercel.app";

function parseSourceFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return ts.createSourceFile(
    path.basename(filePath),
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function walk(node, cb) {
  cb(node);
  node.forEachChild((child) => walk(child, cb));
}

/** Extract text from a string / template literal node. */
function extractStringLike(node) {
  if (!node) return "";
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    // Template with interpolation — fallback to raw text.
    return node.getText();
  }
  return node.getText();
}

/** Parse the `componentDocs` object from ComponentPage.tsx. */
function parseComponentDocs() {
  const sf = parseSourceFile(COMPONENT_PAGE);
  let componentDocsNode = null;

  walk(sf, (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "componentDocs" &&
      node.initializer
    ) {
      componentDocsNode = node.initializer;
    }
  });

  if (!componentDocsNode || !ts.isObjectLiteralExpression(componentDocsNode)) {
    throw new Error("Could not find componentDocs object literal");
  }

  const entries = [];

  for (const prop of componentDocsNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;

    const slug = (() => {
      if (ts.isStringLiteral(prop.name)) return prop.name.text;
      if (ts.isIdentifier(prop.name)) return prop.name.text;
      return prop.name.getText().replace(/['"]/g, "");
    })();

    if (!ts.isObjectLiteralExpression(prop.initializer)) continue;

    const entry = {
      slug,
      title: "",
      description: "",
      usage: "",
      props: [],
    };

    for (const field of prop.initializer.properties) {
      if (!ts.isPropertyAssignment(field)) continue;
      const fieldName = ts.isIdentifier(field.name)
        ? field.name.text
        : field.name.getText().replace(/['"]/g, "");

      switch (fieldName) {
        case "title":
          entry.title = extractStringLike(field.initializer);
          break;
        case "description":
          entry.description = extractStringLike(field.initializer);
          break;
        case "usage":
          entry.usage = extractStringLike(field.initializer);
          break;
        case "props": {
          if (!ts.isArrayLiteralExpression(field.initializer)) break;
          for (const el of field.initializer.elements) {
            if (!ts.isObjectLiteralExpression(el)) continue;
            const propDoc = {
              name: "",
              type: "",
              default: "",
              description: "",
            };
            for (const f of el.properties) {
              if (!ts.isPropertyAssignment(f)) continue;
              const fn = ts.isIdentifier(f.name)
                ? f.name.text
                : f.name.getText().replace(/['"]/g, "");
              if (propDoc.hasOwnProperty(fn)) {
                propDoc[fn] = extractStringLike(f.initializer);
              }
            }
            entry.props.push(propDoc);
          }
          break;
        }
        // preview is JSX → skip
      }
    }

    entries.push(entry);
  }

  return entries;
}

/** Parse the `categories` array from ComponentsOverview.tsx. */
function parseCategories() {
  const sf = parseSourceFile(OVERVIEW_PAGE);
  let categoriesNode = null;

  walk(sf, (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "categories" &&
      node.initializer
    ) {
      categoriesNode = node.initializer;
    }
  });

  if (!categoriesNode || !ts.isArrayLiteralExpression(categoriesNode)) {
    throw new Error("Could not find categories array literal");
  }

  const categories = [];

  for (const el of categoriesNode.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    const cat = { title: "", components: [] };
    for (const field of el.properties) {
      if (!ts.isPropertyAssignment(field)) continue;
      const name = ts.isIdentifier(field.name)
        ? field.name.text
        : field.name.getText().replace(/['"]/g, "");
      if (name === "title") {
        cat.title = extractStringLike(field.initializer);
      } else if (name === "components") {
        if (!ts.isArrayLiteralExpression(field.initializer)) continue;
        for (const compEl of field.initializer.elements) {
          if (!ts.isObjectLiteralExpression(compEl)) continue;
          const comp = { name: "", path: "", description: "" };
          for (const f of compEl.properties) {
            if (!ts.isPropertyAssignment(f)) continue;
            const fn = ts.isIdentifier(f.name)
              ? f.name.text
              : f.name.getText().replace(/['"]/g, "");
            if (comp.hasOwnProperty(fn)) {
              comp[fn] = extractStringLike(f.initializer);
            }
          }
          cat.components.push(comp);
        }
      }
    }
    categories.push(cat);
  }

  return categories;
}

function formatPropRow(prop) {
  const parts = [];
  parts.push(`- \`${prop.name}\`: \`${prop.type}\``);
  if (prop.default) parts.push(`  - Default: \`${prop.default}\``);
  if (prop.description) parts.push(`  - ${prop.description}`);
  return parts.join("\n");
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
  const docs = parseComponentDocs();
  const categories = parseCategories();

  const docBySlug = new Map(docs.map((d) => [d.slug, d]));
  const totalComponents = categories.reduce(
    (sum, c) => sum + c.components.length,
    0,
  );

  // --- llms.txt (short index) -------------------------------------------
  const shortLines = [];
  shortLines.push(`# ${pkg.name}`);
  shortLines.push("");
  shortLines.push(`> ${pkg.description}`);
  shortLines.push("");
  shortLines.push(
    `kaze-design-system is a React 19 + TypeScript design system with ${totalComponents} components. It is Zinc-based, optimized for Japanese typography (PALT enabled globally), uses CSS custom properties for theming (light/dark via \`data-theme\` attribute), and ships as ESM with peer dependencies on react, react-dom, and lucide-react.`,
  );
  shortLines.push("");
  shortLines.push("## Installation");
  shortLines.push("");
  shortLines.push("```bash");
  shortLines.push(`npm install ${pkg.name}`);
  shortLines.push("```");
  shortLines.push("");
  shortLines.push("```tsx");
  shortLines.push(`import "${pkg.name}/css/all";`);
  shortLines.push(`import { Button, Card, Badge } from "${pkg.name}";`);
  shortLines.push("```");
  shortLines.push("");
  shortLines.push("## Full API reference");
  shortLines.push("");
  shortLines.push(
    `- [Full API reference (llms-full.txt)](${SITE_URL}/llms-full.txt): every component with props, types, and usage examples`,
  );
  shortLines.push(
    `- [Interactive docs](${SITE_URL}/docs/components): live previews of every component`,
  );
  shortLines.push("");
  shortLines.push("## Components");
  shortLines.push("");

  for (const cat of categories) {
    shortLines.push(`### ${cat.title}`);
    shortLines.push("");
    for (const comp of cat.components) {
      const slug = comp.path;
      const doc = docBySlug.get(slug);
      const desc = doc?.description || comp.description;
      shortLines.push(
        `- [${comp.name}](${SITE_URL}/docs/components/${slug}): ${desc}`,
      );
    }
    shortLines.push("");
  }

  shortLines.push("## Hooks");
  shortLines.push("");
  shortLines.push(
    "- `useTheme` — theme context (light/dark toggle), exported from `kaze-design-system`",
  );
  shortLines.push(
    "- `useFocusTrap` — focus-trap helper for modal/dialog components",
  );
  shortLines.push(
    "- `useLegendToggle` — Recharts `<Legend>` show/hide series toggle, exported from `kaze-design-system/hooks`",
  );
  shortLines.push("");

  fs.writeFileSync(OUT_SHORT, shortLines.join("\n"));

  // --- llms-full.txt (full reference) -----------------------------------
  const fullLines = [];
  fullLines.push(`# ${pkg.name} — Full API Reference`);
  fullLines.push("");
  fullLines.push(`> ${pkg.description}`);
  fullLines.push("");
  fullLines.push(`Version: ${pkg.version}`);
  fullLines.push(`Site: ${SITE_URL}`);
  fullLines.push(`Package: ${pkg.name}`);
  fullLines.push("");
  fullLines.push("## Installation");
  fullLines.push("");
  fullLines.push("```bash");
  fullLines.push(`npm install ${pkg.name}`);
  fullLines.push("```");
  fullLines.push("");
  fullLines.push(
    "Peer dependencies: `react@^19`, `react-dom@^19`, `lucide-react`.",
  );
  fullLines.push("");
  fullLines.push("Import CSS once at the app root:");
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(
    `// Option A: all layers (tokens, reset, components, utilities)`,
  );
  fullLines.push(`import "${pkg.name}/css/all";`);
  fullLines.push("");
  fullLines.push(`// Option B: pick individual layers`);
  fullLines.push(`import "${pkg.name}/css/tokens";`);
  fullLines.push(`import "${pkg.name}/css/reset";`);
  fullLines.push(`import "${pkg.name}/css/components";`);
  fullLines.push(`import "${pkg.name}/css/utilities";`);
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("## Theming");
  fullLines.push("");
  fullLines.push(
    "Dark mode is controlled via `[data-theme]` attribute on `<html>` or `<body>`, with `prefers-color-scheme` as fallback. Use the `ThemeProvider` and `useTheme` hook for imperative control:",
  );
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { ThemeProvider, useTheme } from "${pkg.name}";`);
  fullLines.push("");
  fullLines.push("function App() {");
  fullLines.push("  return (");
  fullLines.push("    <ThemeProvider defaultTheme=\"system\">");
  fullLines.push("      <YourApp />");
  fullLines.push("    </ThemeProvider>");
  fullLines.push("  );");
  fullLines.push("}");
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("## Components");
  fullLines.push("");

  for (const cat of categories) {
    fullLines.push(`### ${cat.title}`);
    fullLines.push("");

    for (const comp of cat.components) {
      const slug = comp.path;
      const doc = docBySlug.get(slug);
      const title = doc?.title || comp.name;
      const description = doc?.description || comp.description;

      fullLines.push(`#### ${title}`);
      fullLines.push("");
      fullLines.push(description);
      fullLines.push("");
      fullLines.push(`Docs: ${SITE_URL}/docs/components/${slug}`);
      fullLines.push("");

      if (doc?.props?.length) {
        fullLines.push("**Props**");
        fullLines.push("");
        for (const p of doc.props) {
          fullLines.push(formatPropRow(p));
        }
        fullLines.push("");
      }

      if (doc?.usage) {
        fullLines.push("**Usage**");
        fullLines.push("");
        fullLines.push("```tsx");
        fullLines.push(doc.usage);
        fullLines.push("```");
        fullLines.push("");
      }
    }
  }

  fullLines.push("## Hooks");
  fullLines.push("");
  fullLines.push("#### useTheme");
  fullLines.push("");
  fullLines.push(
    "Returns the current theme and a setter. Must be used inside `<ThemeProvider>`.",
  );
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { useTheme } from "${pkg.name}";`);
  fullLines.push("const { theme, setTheme } = useTheme();");
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("#### useFocusTrap");
  fullLines.push("");
  fullLines.push(
    "Traps focus within a container for modal/dialog-like overlays.",
  );
  fullLines.push("");
  fullLines.push("#### useLegendToggle");
  fullLines.push("");
  fullLines.push(
    "Toggle series visibility on a Recharts `<Legend>` by clicking. Does not import Recharts (`legendProps` is spread onto `<Legend>` and is structurally compatible).",
  );
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { useLegendToggle } from "${pkg.name}/hooks";`);
  fullLines.push("");
  fullLines.push("const { isHidden, legendProps, reset } = useLegendToggle();");
  fullLines.push("");
  fullLines.push("<BarChart data={data}>");
  fullLines.push("  <Legend {...legendProps} />");
  fullLines.push("  <Bar dataKey=\"revenue\" hide={isHidden(\"revenue\")} />");
  fullLines.push("  <Bar dataKey=\"cost\" hide={isHidden(\"cost\")} />");
  fullLines.push("</BarChart>");
  fullLines.push("```");
  fullLines.push("");

  fs.writeFileSync(OUT_FULL, fullLines.join("\n"));

  console.log(
    `[llms] wrote ${path.relative(root, OUT_SHORT)} (${shortLines.length} lines)`,
  );
  console.log(
    `[llms] wrote ${path.relative(root, OUT_FULL)} (${fullLines.length} lines, ${docs.length} component docs from ${totalComponents} catalog entries)`,
  );
}

main();
