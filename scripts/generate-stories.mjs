#!/usr/bin/env node
/**
 * Generate minimal Storybook `*.stories.tsx` files for every component
 * in `src/components/<Name>/` that does not already ship a story.
 *
 * Strategy:
 * 1. Parse each component's Props interface via the TypeScript compiler
 *    API to figure out which members are required and infer a sensible
 *    runtime default for them.
 * 2. Emit one default story that renders the component with those
 *    inferred args — this is enough to enable Storybook discovery,
 *    Vitest browser tests, and visual-regression coverage.
 *
 * Existing stories files are never overwritten; this script only
 * fills gaps. Hand-written stories remain the source of truth for
 * components that already have rich examples.
 *
 * For compound components (Card / Table / Tabs / Dropdown etc.) the
 * folder is skipped automatically when:
 *   - the Props interface cannot be resolved, or
 *   - a required prop has a complex object / function / array type
 *     that we cannot synthesize without ambiguity.
 *
 * A list of skipped components is printed at the end so a human can
 * write stories for them manually.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const componentsDir = path.join(root, "src/components");

/** Component folders whose single primary export is not `<folder>Props`. */
const PROPS_INTERFACE_OVERRIDES = {
  Layout: { componentName: "AppLayout", interface: "AppLayoutProps" },
  Toast: { componentName: "ToastProvider", interface: "ToastProviderProps" },
};

/** Skip these folders entirely: they ship compound components whose
 *  auto-generated stub would be trivially broken or unhelpful. */
const SKIP_FOLDERS = new Set([
  // Compound components — already have hand-written stories or need
  // sub-component composition that the generator cannot synthesize.
  "Table",
  "Card",
  "Dropdown",
  "Tabs",
  "Dialog",
  "CommandPalette",
  "Toast",
  "FormField",
  "Radio",
  "Sidebar",
  "Navbar",
  "List",
  "DescriptionList",
  "Timeline",
  "Stepper",
  "Pricing",
  "Testimonial",
  "FAQ",
  "FeatureGrid",
  "Stats",
  "LPFooter",
  "Layout",
  "TopBar",
  "Hero",
  "Section",
  "SplitSection",
  "CTABanner",
  "Pagination",
  "Breadcrumb",
  "Tracker",
  "BarList",
  "BarChart",
  "DonutChart",
  "Sparkline",
]);

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

/**
 * Extract { name, type, optional, literal } from an interface declaration
 * and return the list of required members only.
 */
function extractRequiredProps(filePath, interfaceName) {
  const sf = parseSourceFile(filePath);
  let target = null;
  const typeAliases = new Map();

  walk(sf, (node) => {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === interfaceName
    ) {
      target = node;
    }
    if (ts.isTypeAliasDeclaration(node)) {
      typeAliases.set(node.name.text, node.type);
    }
  });

  if (!target) return null;

  const required = [];
  for (const member of target.members) {
    if (!ts.isPropertySignature(member)) continue;
    if (member.questionToken) continue; // optional — no arg needed

    const name = member.name.getText().replace(/^['"]|['"]$/g, "");
    const typeNode = member.type;
    if (!typeNode) continue;

    required.push({
      name,
      typeText: typeNode.getText().replace(/\s+/g, " ").trim(),
      typeNode,
      typeAliases,
    });
  }

  return required;
}

/**
 * Turn a prop TypeScript type description into a literal JS snippet
 * suitable for inlining into `args: { ... }`. Returns `null` when the
 * type is too complex to synthesize — callers should then skip
 * generating a story.
 */
function inferArgValue(prop) {
  const { typeText, typeAliases } = prop;

  // Resolve named type alias to its underlying type text if possible.
  let resolved = typeText;
  if (typeAliases.has(typeText)) {
    resolved = typeAliases
      .get(typeText)
      .getText()
      .replace(/\s+/g, " ")
      .replace(/^\|\s*/, "") // leading `|` from multi-line unions
      .trim();
  }

  // String literal union → pick the first member.
  const literalUnionMatch = resolved.match(/^"([^"]+)"/);
  if (literalUnionMatch && resolved.includes("|")) {
    return { value: JSON.stringify(literalUnionMatch[1]), needsFragment: false };
  }

  // Single string literal.
  const singleLiteralMatch = resolved.match(/^"([^"]+)"$/);
  if (singleLiteralMatch) {
    return { value: JSON.stringify(singleLiteralMatch[1]), needsFragment: false };
  }

  // Primitives.
  if (resolved === "string") {
    const placeholder = placeholderForName(prop.name);
    return { value: JSON.stringify(placeholder), needsFragment: false };
  }
  if (resolved === "number") {
    return { value: "0", needsFragment: false };
  }
  if (resolved === "boolean") {
    return { value: "false", needsFragment: false };
  }

  // ReactNode / JSX-like → fall back to a placeholder string.
  if (
    resolved === "ReactNode" ||
    resolved === "React.ReactNode" ||
    resolved === "ReactElement" ||
    resolved === "React.ReactElement" ||
    resolved === "JSX.Element" ||
    resolved.startsWith("ReactNode")
  ) {
    const placeholder = placeholderForName(prop.name);
    return { value: JSON.stringify(placeholder), needsFragment: false };
  }

  // Function types — can't synthesize. Skip.
  if (/^\([^)]*\)\s*=>/.test(resolved)) {
    return null;
  }

  // Array types — empty array is usually safe.
  if (resolved.endsWith("[]") || resolved.startsWith("Array<")) {
    return { value: "[]", needsFragment: false };
  }

  // Object / complex types → skip.
  if (resolved.startsWith("{") || resolved.includes("=>")) {
    return null;
  }

  // Unknown named type → skip.
  return null;
}

function placeholderForName(propName) {
  const mapping = {
    title: "サンプルタイトル",
    label: "ラベル",
    name: "名前",
    description: "説明文が入ります",
    message: "メッセージ",
    text: "テキスト",
    children: "コンテンツ",
    content: "コンテンツ",
    value: "値",
    placeholder: "入力してください",
  };
  return mapping[propName] ?? "サンプル";
}

function generateStoryFile(componentName, folderName, args) {
  const argsLines = Object.entries(args)
    .map(([k, v]) => `    ${k}: ${v},`)
    .join("\n");

  return `import type { Meta, StoryObj } from "@storybook/nextjs";
import { ${componentName} } from "./${folderName}";

/**
 * Auto-generated minimal story — replace or extend to document variants.
 * See scripts/generate-stories.mjs.
 */
const meta = {
  title: "Components/${componentName}",
  component: ${componentName},
  args: {
${argsLines}
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
}

function main() {
  const folders = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const generated = [];
  const skipped = [];
  const alreadyHad = [];

  for (const folder of folders) {
    const folderPath = path.join(componentsDir, folder);
    const override = PROPS_INTERFACE_OVERRIDES[folder];
    const componentFileName = override?.componentName || folder;
    const componentFile = path.join(folderPath, `${folder}.tsx`);
    const storyFile = path.join(folderPath, `${folder}.stories.tsx`);

    if (!fs.existsSync(componentFile)) {
      skipped.push({ folder, reason: "no matching .tsx file" });
      continue;
    }

    if (fs.existsSync(storyFile)) {
      alreadyHad.push(folder);
      continue;
    }

    if (SKIP_FOLDERS.has(folder)) {
      skipped.push({ folder, reason: "compound/complex — manual stories needed" });
      continue;
    }

    const interfaceName = override?.interface || `${componentFileName}Props`;
    const required = extractRequiredProps(componentFile, interfaceName);

    if (required == null) {
      skipped.push({ folder, reason: `no ${interfaceName} interface found` });
      continue;
    }

    const args = {};
    let skip = false;
    for (const prop of required) {
      const inferred = inferArgValue(prop);
      if (!inferred) {
        skipped.push({
          folder,
          reason: `required prop "${prop.name}: ${prop.typeText}" could not be synthesized`,
        });
        skip = true;
        break;
      }
      args[prop.name] = inferred.value;
    }
    if (skip) continue;

    const source = generateStoryFile(componentFileName, folder, args);
    fs.writeFileSync(storyFile, source);
    generated.push(folder);
  }

  console.log(`[stories] existing: ${alreadyHad.length}`);
  console.log(`[stories] generated: ${generated.length}`);
  for (const f of generated) console.log(`  + ${f}`);
  console.log(`[stories] skipped: ${skipped.length}`);
  for (const s of skipped) console.log(`  - ${s.folder}: ${s.reason}`);
}

main();
