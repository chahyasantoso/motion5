import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type ScaffoldResult =
  | { readonly kind: "written"; readonly files: readonly string[] }
  | { readonly kind: "refused"; readonly message: string };

const TEMPLATES = fileURLToPath(new URL("./templates/", import.meta.url));
const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** Each file a page needs, as its template and its path under the app root. */
function plan(
  name: string,
  three: boolean,
): readonly { readonly template: string; readonly path: string }[] {
  const kind = three ? ".three" : "";
  return [
    { template: `page${kind}.html.template`, path: `${name}.html` },
    { template: "main.tsx.template", path: `src/${name}-main.tsx` },
    { template: `component${kind}.tsx.template`, path: `src/${name}.tsx` },
    { template: `scene${kind}.ts.template`, path: `src/${name}-scene.ts` },
  ];
}

function componentName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Writes a page, entry, component and starter scene for `name` under `root` (Three.js with `three`), or nothing at all. */
export function scaffold(
  name: string,
  root: string,
  options: { readonly three?: boolean } = {},
): ScaffoldResult {
  if (!NAME.test(name))
    return { kind: "refused", message: `Name "${name}" must be lowercase words joined by "-".` };
  const files = plan(name, options.three === true).map(({ template, path }) => ({
    template,
    path: join(root, path),
  }));
  const taken = files.filter(({ path }) => existsSync(path)).map(({ path }) => path);
  if (taken.length > 0)
    return { kind: "refused", message: `Already exists, nothing written: ${taken.join(", ")}` };
  for (const { template, path } of files) {
    const source = readFileSync(join(TEMPLATES, template), "utf8")
      .replaceAll("__COMPONENT__", componentName(name))
      .replaceAll("__NAME__", name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, source);
  }
  return { kind: "written", files: files.map(({ path }) => path) };
}

function exportName(id: string): string {
  const [first = "", ...rest] = id.split("-");
  return first + rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

/** Writes `<root>/src/moves/<id>.ts`, a move for its author to fill in, or nothing at all. */
export function scaffoldMove(id: string, root: string): ScaffoldResult {
  if (!NAME.test(id))
    return { kind: "refused", message: `Id "${id}" must be lowercase words joined by "-".` };
  const path = join(root, "src", "moves", `${id}.ts`);
  if (existsSync(path))
    return { kind: "refused", message: `Already exists, nothing written: ${path}` };
  const source = readFileSync(join(TEMPLATES, "move.ts.template"), "utf8")
    .replaceAll("__EXPORT__", exportName(id))
    .replaceAll("__NAME__", id);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, source);
  return { kind: "written", files: [path] };
}
