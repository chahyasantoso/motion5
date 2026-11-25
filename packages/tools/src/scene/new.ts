import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RESERVED_FOLDERS, pieceFiles } from "./briefs";

/** The files written, or `refused` with why; nothing is written then, and an existing file is never overwritten. */
export type ScaffoldResult =
  | { readonly kind: "written"; readonly files: readonly string[] }
  | { readonly kind: "refused"; readonly message: string };

const TEMPLATES = fileURLToPath(new URL("./templates/", import.meta.url));

/** A piece, brief or move name: lowercase words joined by "-". */
export const NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** The usage line of `gerak new`. */
export const NEW_USAGE = "usage: gerak new <name> [--in <brief>] [--three] [--root dir]";

/** Parsed `gerak new` arguments, or the usage text. */
export type NewArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "piece";
      readonly name: string;
      readonly brief: string | undefined;
      readonly three: boolean;
      readonly root: string | undefined;
    };

/** The piece to scaffold, its brief folder and the app root typed on the command line, or the usage text. */
export function parseNewArgs(argv: readonly string[]): NewArgs {
  const usage = (): NewArgs => ({ kind: "usage", message: NEW_USAGE });
  const positional: string[] = [];
  const flags = new Map<string, string | true>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (arg === "--three") flags.set(arg, true);
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
  return { kind: "piece", name, brief, three: flags.has("--three"), root };
}

/** Each file a piece needs, as its template and its path under the app root. */
function plan(
  name: string,
  brief: string,
  three: boolean,
): readonly { readonly template: string; readonly path: string }[] {
  if (!three)
    return [
      { template: "piece.html.template", path: `${brief}/${name}.html` },
      { template: "stage.ts.template", path: `${brief}/src/${name}.ts` },
      { template: "piece-main.ts.template", path: `${brief}/src/${name}-main.ts` },
    ];
  return [
    { template: "page.three.html.template", path: `${brief}/${name}.html` },
    { template: "main.three.ts.template", path: `${brief}/src/${name}-main.ts` },
    { template: "scene.three.ts.template", path: `${brief}/src/${name}-scene.ts` },
  ];
}

/** Why `brief` cannot name a brief folder, or none when it can. */
export function briefProblem(brief: string): string | undefined {
  if (!NAME_PATTERN.test(brief) || RESERVED_FOLDERS.includes(brief))
    return `Brief "${brief}" must be a folder name of lowercase words joined by "-", and not one of ${RESERVED_FOLDERS.join(", ")}.`;
  return undefined;
}

/** Writes a page, scene module and main script for `name` into `<root>/<brief>` (the brief is `name` unless given);
 * with `three`, a Three.js page, entry and scene. Or nothing at all. */
export function scaffold(
  name: string,
  root: string,
  options: { readonly three?: boolean; readonly brief?: string } = {},
): ScaffoldResult {
  if (!NAME_PATTERN.test(name))
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
      .replaceAll("__BRIEF__", brief)
      .replaceAll("__NAME__", name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, source);
  }
  return { kind: "written", files: files.map(({ path }) => path) };
}
