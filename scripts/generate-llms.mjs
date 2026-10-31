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
const writingRules = JSON.parse(fs.readFileSync(path.join(root, "src/writing/rules.json"), "utf8"));
const writingGuide = JSON.parse(fs.readFileSync(path.join(root, "src/writing/guide.json"), "utf8"));

/** The Japanese writing guide as markdown lines, shared by the docs page data. */
function writingSection(pkgName) {
  const lines = [];
  lines.push("## Writing Japanese UI copy");
  lines.push("");
  lines.push(
    `Follow these rules when you write labels, messages and page copy for a Kaze UI. After writing, run \`npx kaze-copy <paths>\` (or \`checkCopy(text)\` from \`${pkgName}/writing\`) and fix what it reports. \`npx kaze-copy <paths> --fix\` rewrites the mechanical ones. Words quoted in 「」 are treated as examples and skipped.`,
  );
  lines.push("");
  lines.push("### Principles");
  lines.push("");
  for (const p of writingGuide.principles) lines.push(`- ${p.title}: ${p.body}`);
  lines.push("");
  lines.push("### Tone");
  lines.push("");
  for (const t of writingGuide.tone) lines.push(`- ${t}`);
  lines.push("");
  lines.push("### Patterns by scene");
  lines.push("");
  for (const p of writingGuide.patterns) {
    lines.push(
      `- ${p.scene}: ${p.rule}。よい例「${p.good.join("」「")}」 避ける例「${p.bad.join("」「")}」`,
    );
  }
  lines.push("");
  lines.push("### Rules (id, level, avoid → write)");
  lines.push("");
  for (const r of writingRules) {
    const off = r.default ? "" : " (off by default)";
    lines.push(`- \`${r.id}\` ${r.level}${off}: ${r.message}。「${r.bad}」→「${r.good}」`);
  }
  lines.push("");
  return lines;
}
// Props table rendered on /docs/components/[name]; generated so it cannot drift from the types
const OUT_PROPS = path.join(root, "src/views/docs/generated/props.json");
const GUIDES_DIR = path.join(root, "src/views/docs/guidelines");
/** Japanese descriptions for props whose JSDoc is English or missing (docs table only) */
const PROP_DESCRIPTIONS = JSON.parse(
  fs.readFileSync(path.join(root, "src/views/docs/propDescriptions.json"), "utf8"),
);

/** Shared aliases from src/lib/types.ts, inlined so the tables show the actual values */
const SHARED_ALIASES = {
  Tone: '"default" | "positive" | "negative" | "warning" | "info"',
  Size: '"xs" | "sm" | "md" | "lg" | "xl"',
};

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
              if (Object.hasOwn(propDoc, fn)) {
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
            if (Object.hasOwn(comp, fn)) {
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

/** Merge every src/views/docs/guidelines/*.json into one slug-keyed map. */
function readGuides() {
  const merged = {};
  for (const file of fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()) {
    Object.assign(merged, JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), "utf8")));
  }
  return merged;
}

function formatGuide(guide) {
  const lines = [];
  const list = (title, items) => {
    if (!items?.length) return;
    lines.push(`**${title}**`, "");
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  };
  list("使う場面", guide.use);
  list("使わない場面", guide.avoid);
  if (guide.keyboard?.length) {
    lines.push("**キーボード操作**", "", "| キー | 動作 |", "|---|---|");
    for (const row of guide.keyboard) lines.push(`| ${row.keys} | ${row.action} |`);
    lines.push("");
  }
  list("アクセシビリティ", guide.a11y);
  list("文言", guide.writing);
  if (guide.related?.length) {
    lines.push(`Related: ${guide.related.join(", ")}`, "");
  }
  return lines;
}

function formatPropRow(prop) {
  const parts = [];
  const optional = prop.optional ? "?" : "";
  parts.push(`- \`${prop.name}${optional}\`: \`${prop.type}\``);
  if (prop.default) parts.push(`  - Default: \`${prop.default}\``);
  if (prop.deprecated) parts.push(`  - Deprecated: ${prop.deprecated}`);
  if (prop.description) parts.push(`  - ${prop.description}`);
  return parts.join("\n");
}

/**
 * Convert a JSDoc comment field into a flat string.
 * TypeScript exposes `.comment` as either a string or a NodeArray of
 * SyntaxKind.JSDocText / SyntaxKind.JSDocLink entries.
 */
function jsDocCommentToString(comment) {
  if (!comment) return "";
  if (typeof comment === "string") return comment.trim();
  if (Array.isArray(comment)) {
    return comment
      .map((c) => (typeof c === "string" ? c : c.text || ""))
      .join("")
      .trim();
  }
  return "";
}

/**
 * Read a single `.tsx` file and extract the fields of the exported
 * interface that matches `interfaceName`. Returns a list of
 * `{ name, type, optional, description, default }` or `null` if the
 * interface cannot be found.
 *
 * Only direct members are extracted — inherited HTML attributes from
 * e.g. `extends HTMLAttributes<HTMLDivElement>` are intentionally
 * skipped since they are implicit.
 */
function extractPropsFromFile(filePath, interfaceName) {
  if (!fs.existsSync(filePath)) return null;
  const sf = parseSourceFile(filePath);
  let target = null;
  const typeAliases = new Map(); // name → inlined type text

  walk(sf, (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      target = node;
    }
    if (ts.isTypeAliasDeclaration(node)) {
      typeAliases.set(node.name.text, node.type.getText());
    }
  });

  if (!target) return null;

  const normalizeType = (text) =>
    text
      .replace(/\s+/g, " ")
      .replace(/^\|\s*/, "")
      .trim();

  const resolveType = (typeText) => {
    // Inline simple named type aliases defined in the same file or shared from src/lib/types.ts.
    // e.g. `ButtonVariant` → `"primary" | "secondary" | ...`
    let text = typeText;
    if (typeAliases.has(text)) text = typeAliases.get(text);
    else if (SHARED_ALIASES[text]) text = SHARED_ALIASES[text];
    // `Extract<Size, "sm" | "md">` → `"sm" | "md"`
    const extract = normalizeType(text).match(/^Extract<\w+,\s*(.+)>$/);
    if (extract) text = extract[1];
    return normalizeType(text);
  };

  const props = [];
  for (const member of target.members) {
    if (!ts.isPropertySignature(member)) continue;

    const name = member.name.getText().replace(/^['"]|['"]$/g, "");
    const rawType = member.type ? member.type.getText() : "any";
    const type = resolveType(rawType);
    const optional = !!member.questionToken;

    let description = "";
    let defaultValue = "";
    let deprecated = "";

    const jsDocs = ts.getJSDocCommentsAndTags(member);
    for (const doc of jsDocs) {
      if (ts.isJSDoc(doc)) {
        if (!description && doc.comment) {
          description = jsDocCommentToString(doc.comment);
        }
        if (doc.tags) {
          for (const tag of doc.tags) {
            const tagName = tag.tagName?.text;
            if ((tagName === "default" || tagName === "defaultValue") && tag.comment) {
              defaultValue = jsDocCommentToString(tag.comment);
            }
            if (tagName === "deprecated") {
              deprecated = jsDocCommentToString(tag.comment) || "非推奨";
            }
          }
        }
      }
    }

    props.push({
      name,
      type,
      optional,
      description,
      default: defaultValue,
      ...(deprecated ? { deprecated } : {}),
    });
  }

  return props;
}

/**
 * Resolve a componentDocs entry to a concrete .tsx file + interface name.
 * Uses the doc's `title` (e.g. "StatusBadge") as the folder / interface
 * base; handles a few known aliases for compound/odd-named components.
 */
const TITLE_OVERRIDES = {
  AppLayout: { folder: "Layout", interface: "AppLayoutProps" },
  Toast: { folder: "Toast", interface: "ToastProviderProps" },
  Tabs: { folder: "Tabs", interface: "TabsProps" },
  Pricing: { folder: "Pricing", interface: "PricingCardProps" },
  Testimonial: { folder: "Testimonial", interface: "TestimonialCardProps" },
  FAQ: { folder: "FAQ", interface: "FAQProps" },
  FeatureGrid: { folder: "FeatureGrid", interface: "FeatureGridProps" },
  Stats: { folder: "Stats", interface: "StatsProps" },
  Navbar: { folder: "Navbar", interface: "NavbarProps" },
  List: { folder: "List", interface: "ListProps" },
  DescriptionList: {
    folder: "DescriptionList",
    interface: "DescriptionListProps",
  },
  Timeline: { folder: "Timeline", interface: "TimelineProps" },
  Radio: { folder: "Radio", interface: "RadioGroupProps" },
  Sidebar: { folder: "Sidebar", interface: "SidebarProps" },
  Dropdown: { folder: "Dropdown", interface: "DropdownProps" },
  Dialog: { folder: "Dialog", interface: "DialogProps" },
};

function resolveExtractionTarget(title) {
  const override = TITLE_OVERRIDES[title];
  if (override) {
    return {
      file: path.join(root, "src/components", override.folder, `${override.folder}.tsx`),
      interface: override.interface,
    };
  }
  // Default: folder = title, interface = `${title}Props`
  return {
    file: path.join(root, "src/components", title, `${title}.tsx`),
    interface: `${title}Props`,
  };
}

/**
 * Merge extracted (source-of-truth) props with hand-written docs (curated
 * descriptions + inherited HTML props). Extracted entries win on type /
 * optionality; hand-written wins on description / default when extracted
 * has neither. Hand-written entries not present in extracted (typically
 * inherited HTML attrs) are appended at the end.
 */
function mergeProps(extracted, handWritten, { preferHandWritten = false, japanese = {} } = {}) {
  if (!extracted) return handWritten || [];

  const merged = [];
  const handByName = new Map((handWritten || []).map((p) => [p.name, p]));

  for (const ex of extracted) {
    const hw = handByName.get(ex.name);
    merged.push({
      name: ex.name,
      type: ex.type,
      optional: ex.optional,
      description: preferHandWritten
        ? japanese[ex.name] || hw?.description || ex.description || ""
        : ex.description || hw?.description || "",
      default: ex.default || hw?.default || "",
      ...(ex.deprecated ? { deprecated: ex.deprecated } : {}),
    });
    handByName.delete(ex.name);
  }

  // Append hand-written-only props (inherited HTML attrs, etc.)
  for (const hw of handByName.values()) {
    merged.push({
      name: hw.name,
      type: hw.type,
      optional: true, // hand-written inherited props are almost always optional
      description: hw.description || "",
      default: hw.default || "",
    });
  }

  return merged;
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
  const docs = parseComponentDocs();
  const categories = parseCategories();

  // Augment each doc entry with props extracted from the real .tsx file.
  // This makes llms-full.txt authoritative when hand-written docs drift.
  let extractedCount = 0;
  let missingCount = 0;
  for (const doc of docs) {
    if (!doc.title) continue;
    const target = resolveExtractionTarget(doc.title);
    const extracted = extractPropsFromFile(target.file, target.interface);
    if (extracted) {
      // The docs site is Japanese, so its table keeps the hand-written (Japanese) descriptions
      doc.pageProps = mergeProps(extracted, doc.props, {
        preferHandWritten: true,
        japanese: PROP_DESCRIPTIONS[doc.slug] ?? {},
      });
      // Deprecated props go last so the table reads as the current API first
      doc.pageProps.sort((a, b) => Number(Boolean(a.deprecated)) - Number(Boolean(b.deprecated)));
      doc.props = mergeProps(extracted, doc.props);
      extractedCount++;
    } else {
      missingCount++;
      console.log(
        `[llms] no props extracted for "${doc.title}" (looked for ${target.interface} in ${path.relative(root, target.file)})`,
      );
    }
  }

  const docBySlug = new Map(docs.map((d) => [d.slug, d]));
  const guides = readGuides();
  const totalComponents = categories.reduce((sum, c) => sum + c.components.length, 0);

  // --- llms.txt (short index) -------------------------------------------
  const shortLines = [];
  shortLines.push(`# ${pkg.name}`);
  shortLines.push("");
  shortLines.push(`> ${pkg.description}`);
  shortLines.push("");
  shortLines.push(
    `kaze-design-system is a React 18/19 + TypeScript design system with ${totalComponents} components in two layers: Application UI (dashboards, business apps) and Marketing (landing pages, importable from \`${pkg.name}/marketing\`). It is built around a warm neutral gray palette, optimized for Japanese typography (PALT enabled globally), uses CSS custom properties for theming (light/dark via \`data-theme\`, four palettes via \`data-palette\` (default warm 砂, "cool" 霞, "ink" 墨, "indigo" 藍), three font sets via \`data-font\` (default "standard", "neutral", "crisp"), compact density via \`data-density="compact"\`), and ships as ESM with peer dependencies on react and react-dom (lucide-react optional).`,
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
  shortLines.push(`import { Hero, PricingGrid } from "${pkg.name}/marketing";`);
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
  shortLines.push(
    `- [Start with AI](${SITE_URL}/docs/ai): \`npx kaze-init\` writes the Kaze section into AGENTS.md (and makes CLAUDE.md and Gemini CLI read it). Next.js starter: \`npx create-next-app@latest my-app --example "https://github.com/yuki930/kaze-design-system/tree/main/examples/nextjs"\``,
  );
  shortLines.push(
    `- [Writing guide](${SITE_URL}/docs/writing): how to write Japanese UI copy for Kaze. Check copy with \`npx kaze-copy <paths>\`; the full rules are in llms-full.txt`,
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
      shortLines.push(`- [${comp.name}](${SITE_URL}/docs/components/${slug}): ${desc}`);
    }
    shortLines.push("");
  }

  shortLines.push("## Hooks");
  shortLines.push("");
  shortLines.push(
    "- `useTheme`: theme context (light/dark toggle), exported from `kaze-design-system`",
  );
  shortLines.push(
    "- `useFocusTrap`: focus-trap helper for modal/dialog components, exported from `kaze-design-system/hooks`",
  );
  shortLines.push(
    "- `useLegendToggle`: Recharts `<Legend>` show/hide series toggle, exported from `kaze-design-system/hooks`",
  );
  shortLines.push("");

  fs.writeFileSync(OUT_SHORT, shortLines.join("\n"));

  // --- llms-full.txt (full reference) -----------------------------------
  const fullLines = [];
  fullLines.push(`# ${pkg.name}: Full API Reference`);
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
    "Peer dependencies: `react@^18 || ^19`, `react-dom@^18 || ^19`. `lucide-react` is optional (only needed to pass lucide icons to `Icon` or in examples).",
  );
  fullLines.push("");
  fullLines.push("Import CSS once at the app root:");
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`// Option A: all layers (tokens, reset, components, utilities)`);
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
  fullLines.push('    <ThemeProvider defaultTheme="system">');
  fullLines.push("      <YourApp />");
  fullLines.push("    </ThemeProvider>");
  fullLines.push("  );");
  fullLines.push("}");
  fullLines.push("```");
  fullLines.push("");
  fullLines.push(
    'Palettes: the default is warm 砂 (no attribute). Add `data-palette="cool"` (霞, purple-tinted gray), `data-palette="ink"` (墨, neutral gray) or `data-palette="indigo"` (藍, indigo primary and accent). Each works with light and dark, and `useTheme().setPalette()` switches and stores it. Status colors (positive, negative, warning, info) and chart colors are the same in every palette.',
  );
  fullLines.push("");
  fullLines.push(
    'Font sets: the default "standard" uses DM Sans for Latin, Montserrat for displayed numbers (`--font-numeric`: Metric, Stats, numeric table cells, chart values) and Noto Sans JP for kana and kanji. `data-font="neutral"` uses Inter + Noto Sans JP; `data-font="crisp"` uses IBM Plex Sans JP for both scripts. Kaze only switches the font stacks: load the fonts yourself and expose them as CSS variables `--font-dm-sans`, `--font-montserrat`, `--font-noto-sans-jp`, `--font-inter`, `--font-ibm-plex-sans-jp` (next/font `variable`). `useTheme().setFontSet()` switches and stores it. Japanese typesetting tokens: headings `--font-weight-heading` (600) and `--letter-spacing-heading` (0.01em, never negative), body `--letter-spacing-body` (0.02em), numbers `--letter-spacing-numeric` (0), long text `--line-height-body` (1.85).',
  );
  fullLines.push("");
  fullLines.push("## Density");
  fullLines.push("");
  fullLines.push(
    'Add `data-density="compact"` to an ancestor (`<html>` or a panel) to tighten controls, table/list rows, tabs, dropdowns and sidebar items. Independent of theme and palette. Tokens: `--density-control-height`, `--density-row-py`, `--density-row-px`, `--density-font-size-ui`, `--density-line-height-ui`, `--density-nav-py`, `--density-nav-gap`, `--density-dropdown-py`, `--density-tab-py`.',
  );
  fullLines.push("");
  fullLines.push("```html");
  fullLines.push('<html data-theme="dark" data-density="compact">');
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("## Layers and entry points");
  fullLines.push("");
  fullLines.push(`- Application UI: dashboards and business apps. Import from \`${pkg.name}\`.`);
  fullLines.push(
    `- Marketing: the 12 landing-page components (AnnouncementBar, Navbar, Hero, Section, SplitSection, FeatureGrid, Stats, Pricing, Testimonial, FAQ, CTABanner, LPFooter). Import from \`${pkg.name}/marketing\` (also re-exported from the root).`,
  );
  fullLines.push(
    `- Hooks: \`${pkg.name}/hooks\` (useFocusTrap, useLegendToggle; useTheme is also exported from the root).`,
  );
  fullLines.push(`- JS tokens: \`${pkg.name}/tokens\`.`);
  fullLines.push(
    `- Writing guide and copy checker: \`${pkg.name}/writing\` (checkCopy, fixCopy, copyRules, writingGuide) and the \`kaze-copy\` CLI.`,
  );
  fullLines.push(
    "- `npx kaze-init` writes Kaze rules for AI assistants into AGENTS.md and makes CLAUDE.md and Gemini CLI (.gemini/settings.json) read it. This file is also shipped at `node_modules/kaze-design-system/dist/llms-full.txt`, matching the installed version.",
  );
  fullLines.push("");
  fullLines.push(...writingSection(pkg.name));
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

      const guide = guides[slug];
      if (guide) fullLines.push(...formatGuide(guide));

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
  fullLines.push("Returns the current theme and a setter. Must be used inside `<ThemeProvider>`.");
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { useTheme } from "${pkg.name}";`);
  fullLines.push("const { theme, setTheme } = useTheme();");
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("#### useFocusTrap");
  fullLines.push("");
  fullLines.push("Traps focus within a container for modal/dialog-like overlays.");
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { useFocusTrap } from "${pkg.name}/hooks";`);
  fullLines.push("```");
  fullLines.push("");
  fullLines.push("#### useLegendToggle");
  fullLines.push("");
  fullLines.push(
    "Toggle series visibility on a Recharts `<Legend>` by clicking. Does not import Recharts (`legendProps` is spread onto `<Legend>` and is structurally compatible).",
  );
  fullLines.push("");
  fullLines.push("```tsx");
  fullLines.push(`import { BarChart, Bar, Legend } from "recharts";`);
  fullLines.push(`import { useLegendToggle } from "${pkg.name}/hooks";`);
  fullLines.push("");
  fullLines.push("const { isHidden, legendProps, reset } = useLegendToggle();");
  fullLines.push("");
  fullLines.push("<BarChart data={data}>");
  fullLines.push("  <Legend {...legendProps} />");
  fullLines.push('  <Bar dataKey="revenue" hide={isHidden("revenue")} />');
  fullLines.push('  <Bar dataKey="cost" hide={isHidden("cost")} />');
  fullLines.push("</BarChart>");
  fullLines.push("```");
  fullLines.push("");

  fs.writeFileSync(OUT_FULL, fullLines.join("\n"));

  const pageProps = {};
  for (const doc of docs) {
    if (doc.slug) pageProps[doc.slug] = doc.pageProps ?? doc.props;
  }
  fs.mkdirSync(path.dirname(OUT_PROPS), { recursive: true });
  fs.writeFileSync(OUT_PROPS, `${JSON.stringify(pageProps, null, 2)}\n`);

  console.log(`[llms] wrote ${path.relative(root, OUT_SHORT)} (${shortLines.length} lines)`);
  console.log(
    `[llms] wrote ${path.relative(root, OUT_FULL)} (${fullLines.length} lines, ${docs.length} component docs from ${totalComponents} catalog entries)`,
  );
  console.log(
    `[llms] props extracted from source: ${extractedCount} / ${docs.length} components (${missingCount} fell back to hand-written)`,
  );
}

main();
