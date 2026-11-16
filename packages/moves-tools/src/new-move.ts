import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NAME_PATTERN, briefProblem, type ScaffoldResult } from "@gerak/tools/scene";

const TEMPLATES = fileURLToPath(new URL("./templates/", import.meta.url));

/** The usage line of `gerak new-move`. */
export const NEW_MOVE_USAGE = "usage: gerak new-move <id> --in <brief> [--root dir]";

/** Parsed `gerak new-move` arguments, or the usage text. */
export type NewMoveArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "move";
      readonly id: string;
      readonly brief: string;
      readonly root: string | undefined;
    };

/** The move to scaffold, its brief folder and the app root typed on the command line, or the usage text. */
export function parseNewMoveArgs(argv: readonly string[]): NewMoveArgs {
  const usage = (): NewMoveArgs => ({ kind: "usage", message: NEW_MOVE_USAGE });
  const positional: string[] = [];
  const flags = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (arg === "--in" || arg === "--root") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--") || flags.has(arg)) return usage();
      flags.set(arg, value);
      i += 1;
    } else if (arg.startsWith("--")) return usage();
    else positional.push(arg);
  }
  const [id] = positional;
  const brief = flags.get("--in");
  if (id === undefined || positional.length > 1 || brief === undefined) return usage();
  return { kind: "move", id, brief, root: flags.get("--root") };
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
  if (!NAME_PATTERN.test(id))
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
