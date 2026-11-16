/**
 * Reads the component catalog: the `categories` array in
 * src/views/docs/ComponentsOverview.tsx. That array is the only source of the
 * component list and counts. generate-llms.mjs and check-catalog.mjs read it
 * through here so both see the same entries.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OVERVIEW_PAGE = path.join(root, "src/views/docs/ComponentsOverview.tsx");

function propertyName(node) {
  return ts.isIdentifier(node.name) ? node.name.text : node.name.getText().replace(/['"]/g, "");
}

function stringValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return node.getText();
}

/**
 * Parse the `categories` array.
 * @returns {{ title: string, layer: string, components: { name: string, path: string, description: string }[] }[]}
 */
export function parseCategories(filePath = OVERVIEW_PAGE) {
  const source = fs.readFileSync(filePath, "utf8");
  const sf = ts.createSourceFile(
    path.basename(filePath),
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let categoriesNode = null;
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "categories" &&
      node.initializer
    ) {
      categoriesNode = node.initializer;
    }
    node.forEachChild(visit);
  };
  visit(sf);

  if (!categoriesNode || !ts.isArrayLiteralExpression(categoriesNode)) {
    throw new Error("Could not find categories array literal");
  }

  const categories = [];
  for (const el of categoriesNode.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    const cat = { title: "", layer: "", components: [] };
    for (const field of el.properties) {
      if (!ts.isPropertyAssignment(field)) continue;
      const name = propertyName(field);
      if (name === "title") {
        cat.title = stringValue(field.initializer);
      } else if (name === "layer") {
        cat.layer = stringValue(field.initializer);
      } else if (name === "components") {
        if (!ts.isArrayLiteralExpression(field.initializer)) continue;
        for (const compEl of field.initializer.elements) {
          if (!ts.isObjectLiteralExpression(compEl)) continue;
          const comp = { name: "", path: "", description: "" };
          for (const f of compEl.properties) {
            if (!ts.isPropertyAssignment(f)) continue;
            const fn = propertyName(f);
            if (Object.hasOwn(comp, fn)) comp[fn] = stringValue(f.initializer);
          }
          cat.components.push(comp);
        }
      }
    }
    categories.push(cat);
  }
  return categories;
}
