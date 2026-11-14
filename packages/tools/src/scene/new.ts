import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** The files written, or `refused` with why; nothing is written then, and an existing file is never overwritten. */
export type ScaffoldResult =
  | { readonly kind: "written"; readonly files: readonly string[] }
  | { readonly kind: "refused"; readonly message: string };

const TEMPLATES = fileURLToPath(new URL("./templates/", import.meta.url));
const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** Each file a piece needs, as its template and its path under the app root. */
function plan(
  name: string,
  three: boolean,
): readonly { readonly template: string; readonly path: string }[] {
  if (!three) return [{ template: "stage.ts.template", path: `src/${name}.ts` }];
  return [
    { template: "page.three.html.template", path: `${name}.html` },
    { template: "main.three.tsx.template", path: `src/${name}-main.tsx` },
    { template: "component.three.tsx.template", path: `src/${name}.tsx` },
    { template: "scene.three.ts.template", path: `src/${name}-scene.ts` },
  ];
}

function componentName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Writes one stage module for `name` under `root`; with `three`, a Three.js page, entry, component and
 * starter scene instead. Or nothing at all. */
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

const RESERVED = new Set(
  "break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static await async of".split(
    " ",
  ),
);

/** The id in camelCase, with `Move` after a word JavaScript keeps for itself. */
function exportName(id: string): string {
  const [first = "", ...rest] = id.split("-");
  const name = first + rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  return RESERVED.has(name) ? `${name}Move` : name;
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
