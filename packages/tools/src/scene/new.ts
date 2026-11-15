import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RESERVED_FOLDERS, pieceFiles } from "./briefs";

/** The files written, or `refused` with why; nothing is written then, and an existing file is never overwritten. */
export type ScaffoldResult =
  | { readonly kind: "written"; readonly files: readonly string[] }
  | { readonly kind: "refused"; readonly message: string };

const TEMPLATES = fileURLToPath(new URL("./templates/", import.meta.url));
const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** The usage line of `motion:new`. */
export const NEW_USAGE =
  "usage: motion:new <name> [--in <brief>] [--three] [--root dir] | motion:new --move <id> --in <brief> [--root dir]";

/** Parsed `motion:new` arguments, or the usage text. */
export type NewArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "piece";
      readonly name: string;
      readonly brief: string | undefined;
      readonly three: boolean;
      readonly root: string | undefined;
    }
  | {
      readonly kind: "move";
      readonly id: string;
      readonly brief: string;
      readonly root: string | undefined;
    };

/** The piece or move to scaffold, its brief folder and the app root typed on the command line, or the usage text. */
export function parseNewArgs(argv: readonly string[]): NewArgs {
  const usage = (): NewArgs => ({ kind: "usage", message: NEW_USAGE });
  const positional: string[] = [];
  const flags = new Map<string, string | true>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (arg === "--three" || arg === "--move") flags.set(arg, true);
    else if (arg === "--in" || arg === "--root") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--") || flags.has(arg)) return usage();
      flags.set(arg, value);
      i += 1;
    } else if (arg.startsWith("--")) return usage();
    else positional.push(arg);
  }
  const [name] = positional;
  const brief = flags.get("--in");
  const root = flags.get("--root");
  if (name === undefined || positional.length > 1) return usage();
  if (brief === true || root === true) return usage();
  if (flags.has("--move")) {
    if (flags.has("--three") || brief === undefined) return usage();
    return { kind: "move", id: name, brief, root };
  }
  return { kind: "piece", name, brief, three: flags.has("--three"), root };
}

/** Each file a piece needs, as its template and its path under the app root. */
function plan(
  name: string,
  brief: string,
  three: boolean,
): readonly { readonly template: string; readonly path: string }[] {
  if (!three) return [{ template: "stage.ts.template", path: `${brief}/src/${name}.ts` }];
  return [
    { template: "page.three.html.template", path: `${brief}/${name}.html` },
    { template: "main.three.tsx.template", path: `${brief}/src/${name}-main.tsx` },
    { template: "component.three.tsx.template", path: `${brief}/src/${name}.tsx` },
    { template: "scene.three.ts.template", path: `${brief}/src/${name}-scene.ts` },
  ];
}

function componentName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function briefProblem(brief: string): string | undefined {
  if (!NAME.test(brief) || RESERVED_FOLDERS.includes(brief))
    return `Brief "${brief}" must be a folder name of lowercase words joined by "-", and not one of ${RESERVED_FOLDERS.join(", ")}.`;
  return undefined;
}

/** Writes one stage module for `name` into `<root>/<brief>/src`, the brief being `name` unless given; with
 * `three`, a Three.js page, entry, component and scene instead. Or nothing at all. */
export function scaffold(
  name: string,
  root: string,
  options: { readonly three?: boolean; readonly brief?: string } = {},
): ScaffoldResult {
  if (!NAME.test(name))
    return { kind: "refused", message: `Name "${name}" must be lowercase words joined by "-".` };
  const brief = options.brief ?? name;
  const problem = briefProblem(brief);
  if (problem !== undefined) return { kind: "refused", message: problem };
  const held = pieceFiles(root, name);
  if (held.length > 0)
    return {
      kind: "refused",
      message: `"${name}" already exists, nothing written: ${held.join(", ")}`,
    };
  const files = plan(name, brief, options.three === true).map(({ template, path }) => ({
    template,
    path: join(root, path),
  }));
  const taken = files.filter(({ path }) => existsSync(path)).map(({ path }) => path);
  if (taken.length > 0)
    return { kind: "refused", message: `Already exists, nothing written: ${taken.join(", ")}` };
  for (const { template, path } of files) {
    const source = readFileSync(join(TEMPLATES, template), "utf8")
      .replaceAll("__COMPONENT__", componentName(name))
      .replaceAll("__BRIEF__", brief)
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

/** Writes `<root>/<brief>/src/moves/<id>.ts`, a move for its author to fill in, or nothing at all. */
export function scaffoldMove(id: string, root: string, brief: string): ScaffoldResult {
  if (!NAME.test(id))
    return { kind: "refused", message: `Id "${id}" must be lowercase words joined by "-".` };
  const problem = briefProblem(brief);
  if (problem !== undefined) return { kind: "refused", message: problem };
  const path = join(root, brief, "src", "moves", `${id}.ts`);
  if (existsSync(path))
    return { kind: "refused", message: `Already exists, nothing written: ${path}` };
  const source = readFileSync(join(TEMPLATES, "move.ts.template"), "utf8")
    .replaceAll("__EXPORT__", exportName(id))
    .replaceAll("__NAME__", id);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, source);
  return { kind: "written", files: [path] };
}
