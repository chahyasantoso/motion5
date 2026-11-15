import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** The pieces folder a command works in, or the message saying how to name one. */
export type PiecesRoot =
  | { readonly kind: "found"; readonly root: string }
  | { readonly kind: "missing"; readonly message: string };

const MISSING =
  'No pieces folder: pass --root <dir>, or add "gerak": { "pieces": "<dir>" } to your package.json.';

/** The `gerak.pieces` folder of one package.json, resolved from it, or undefined when it names none. */
function namedIn(file: string): string | undefined {
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  if (typeof parsed !== "object" || parsed === null) return undefined;
  const gerak: unknown = Reflect.get(parsed, "gerak");
  if (typeof gerak !== "object" || gerak === null) return undefined;
  const pieces: unknown = Reflect.get(gerak, "pieces");
  return typeof pieces === "string" && pieces !== "" ? resolve(dirname(file), pieces) : undefined;
}

/** The `--root` flag from `cwd`; else the nearest `gerak.pieces` at or above `cwd`; else missing. */
export function piecesRoot(cwd: string, flag?: string): PiecesRoot {
  if (flag !== undefined) return { kind: "found", root: resolve(cwd, flag) };
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    const file = join(dir, "package.json");
    const named = existsSync(file) ? namedIn(file) : undefined;
    if (named !== undefined) return { kind: "found", root: named };
    if (dirname(dir) === dir) return { kind: "missing", message: MISSING };
  }
}

/** The folder a command was run from: `INIT_CWD` under `npm run`, else the process's own. */
export function callerDir(): string {
  const init = process.env.INIT_CWD;
  return init === undefined || init === "" ? process.cwd() : init;
}

/** The pieces folder for a command run here, or throws the missing message. */
export function callerPiecesRoot(flag?: string): string {
  const found = piecesRoot(callerDir(), flag);
  switch (found.kind) {
    case "found":
      return found.root;
    case "missing":
      throw new Error(found.message);
  }
}
