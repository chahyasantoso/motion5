import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, dirname, join, relative, resolve } from "node:path";
import {
  candidatesOf,
  collectRecords,
  formatCandidate,
  loadAppModules,
  sourceFiles,
} from "./catalog";

/** The usage line of `motion:promote`. */
export const PROMOTE_USAGE = "usage: motion:promote <id> [--root dir]";

/** Parsed `motion:promote` arguments: the move `id` and `--root`; or the usage text. */
export type PromoteArgs =
  | { readonly kind: "usage"; readonly message: string }
  | { readonly kind: "ok"; readonly id: string; readonly root: string | undefined };

/** The move id and app root typed on the command line, or the usage text. */
export function parsePromoteArgs(argv: readonly string[]): PromoteArgs {
  const ids: string[] = [];
  let root: string | undefined;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (arg === "--root") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--"))
        return { kind: "usage", message: `--root needs a value. ${PROMOTE_USAGE}` };
      root = value;
      i += 1;
    } else if (arg.startsWith("--"))
      return { kind: "usage", message: `Unknown flag ${arg}. ${PROMOTE_USAGE}` };
    else ids.push(arg);
  }
  const [id] = ids;
  if (id === undefined || ids.length > 1)
    return { kind: "usage", message: `Expected one move id. ${PROMOTE_USAGE}` };
  return { kind: "ok", id, root };
}

/** What `motion:promote` prints, and the exit `code`, 1 when it refused. */
export interface PromoteRun {
  readonly lines: readonly string[];
  readonly code: 0 | 1;
}

/** Where promotion writes: the moves package, a folder holding `src/index.ts`. */
export interface PromoteOptions {
  readonly movesPackage: string;
}

/** The moves package of this repository. */
export const DEFAULT_MOVES_PACKAGE = fileURLToPath(new URL("../../../moves/", import.meta.url));

const refuse = (...lines: string[]): PromoteRun => ({ lines, code: 1 });

const NAMED_IMPORT = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*["']([^"']+)["'];?/g;
const NAMED_EXPORT = /export\s+(type\s+)?\{([^}]*)\}\s*from\s*["']\.\/([^"']+)["']/g;
const OWN_EXPORT = /^export\s+(?:declare\s+)?(const|let|function|class|type|interface)\s+(\w+)/gm;

interface Specifier {
  readonly name: string;
  readonly type: boolean;
}

function specifiersOf(list: string, whole: boolean): readonly Specifier[] {
  return list
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      const typed = /^type\s+/.test(item);
      const bare = item.replace(/^type\s+/, "");
      return { name: bare.split(/\s+as\s+/).at(-1) ?? bare, type: whole || typed };
    });
}

/** Which module of the moves package each name of its index comes from. */
function moduleOfNames(index: string): ReadonlyMap<string, string> {
  const owner = new Map<string, string>();
  for (const [, , list = "", module = ""] of index.matchAll(NAMED_EXPORT))
    for (const { name } of specifiersOf(list, false)) owner.set(name, module);
  return owner;
}

/** A module of the package as a promoted move in `src/moves/` imports it. */
const fromMoves = (module: string): string =>
  module.startsWith("moves/") ? `./${module.slice("moves/".length)}` : `../${module}`;

const clause = (specifier: Specifier) =>
  specifier.type ? `type ${specifier.name}` : specifier.name;

/** The text with its `@gerak/moves` imports made relative to the package's own modules, or the names
 * the index does not export. */
function relativeImports(
  text: string,
  owner: ReadonlyMap<string, string>,
): { readonly text: string } | { readonly missing: readonly string[] } {
  const missing: string[] = [];
  const out = text.replace(NAMED_IMPORT, (statement, type = "", list = "", from = "") => {
    if (from !== "@gerak/moves") return statement;
    const byModule = new Map<string, Specifier[]>();
    for (const specifier of specifiersOf(list, type !== "")) {
      const module = owner.get(specifier.name);
      if (module === undefined) missing.push(specifier.name);
      else byModule.set(module, [...(byModule.get(module) ?? []), specifier]);
    }
    return [...byModule]
      .map(([module, found]) =>
        found.every((specifier) => specifier.type)
          ? `import type { ${found.map(({ name }) => name).join(", ")} } from "${fromMoves(module)}";`
          : `import { ${found.map(clause).join(", ")} } from "${fromMoves(module)}";`,
      )
      .join("\n");
  });
  if (missing.length > 0) return { missing };
  return { text: out };
}

/** The importer's text with every import of the local move file pointing at `@gerak/moves`, and those
 * lines folded into one value import. */
function repointImports(text: string, importer: string, target: string): string {
  const replaced = text.replace(NAMED_IMPORT, (statement, _type = "", _list = "", from = "") => {
    const here = resolve(dirname(importer), from).replace(/\.(js|ts)$/, "");
    return from.startsWith(".") && here === target
      ? statement.replace(/["'][^"']+["']/, '"@gerak/moves"')
      : statement;
  });
  const values = [
    ...replaced.matchAll(/^import\s*\{([^}]*)\}\s*from\s*["']@gerak\/moves["'];?[ \t]*\r?\n?/gm),
  ];
  const [first, ...others] = values;
  if (first === undefined || others.length === 0) return replaced;
  const merged = [
    ...new Set(values.flatMap(([, list = ""]) => specifiersOf(list, false).map(clause))),
  ];
  let out = replaced;
  for (const [statement = ""] of others) out = out.replace(statement, "");
  return out.replace(first[0], `import { ${merged.join(", ")} } from "@gerak/moves";\n`);
}

const SPECIFIER = /["'](\.{1,2}\/[^"']*)["']/g;

/** Whether `text`, a file at `path`, names the module `target` (no extension) in any import, export or call. */
function names(text: string, path: string, target: string): boolean {
  return [...text.matchAll(SPECIFIER)].some(
    ([, spec = ""]) => resolve(dirname(path), spec).replace(/\.(js|ts|tsx)$/, "") === target,
  );
}

const MAX_DOC_CHARS = 200;

/** `/** description *\/` on one line, cut to the description's first sentence when it would pass the comment limit. */
function docLine(description: string): string {
  const whole = `/** ${description} */`;
  if (whole.length <= MAX_DOC_CHARS) return whole;
  const sentence = /^.*?[.!?](?=\s|$)/.exec(description)?.[0] ?? description;
  return `/** ${sentence} */`;
}

/** The text with a doc comment of each move's description above its `export const`, where it has none. */
function documented(
  text: string,
  moves: readonly { readonly exportName: string; readonly description: string }[],
): string {
  return moves.reduce((out, { exportName, description }) => {
    const declaration = new RegExp(`^export\\s+const\\s+${exportName}\\b`, "m").exec(out);
    if (declaration === null) return out;
    const above = out.slice(0, declaration.index).trimEnd();
    if (above.endsWith("*/")) return out;
    return `${out.slice(0, declaration.index)}${docLine(description)}\n${out.slice(declaration.index)}`;
  }, text);
}

/** Moves the candidate `id` of the app at `root` into the moves package: the file, its export from the
 * index, and every importer's import; or refuses and changes nothing. */
export async function promoteMove(
  id: string,
  root: string,
  options: PromoteOptions = { movesPackage: DEFAULT_MOVES_PACKAGE },
): Promise<PromoteRun> {
  const { modules } = await loadAppModules(root);
  const all = collectRecords(modules);
  const candidates = candidatesOf(root, all);
  const candidate = candidates.find((found) => found.id === id);
  if (candidate === undefined)
    return refuse(
      `${id} is not a candidate: it must be a local move that passes the gate and is used by two or more briefs.`,
      candidates.length === 0
        ? "No candidates."
        : `Candidates: ${candidates.map(formatCandidate).join("; ")}.`,
    );
  const base = basename(candidate.file, ".ts");
  const destination = join(options.movesPackage, "src", "moves", `${base}.ts`);
  if (existsSync(destination)) return refuse(`${destination} already exists.`);
  const source = readFileSync(candidate.file, "utf8");
  if (/from\s*["']\.{1,2}\//.test(source))
    return refuse(
      `${candidate.file} imports other local files; promote those first or inline them.`,
    );
  const indexPath = join(options.movesPackage, "src", "index.ts");
  const index = readFileSync(indexPath, "utf8");
  const relativeText = relativeImports(source, moduleOfNames(index));
  if ("missing" in relativeText)
    return refuse(
      `${candidate.file} imports ${relativeText.missing.join(", ")} from @gerak/moves, which the index does not export.`,
    );
  if (relativeText.text.includes("@gerak/moves"))
    return refuse(
      `${candidate.file} imports @gerak/moves in a form promotion does not rewrite; use named imports.`,
    );
  if (/^export\s+(default|\{|\*|enum|async|let|var|abstract|class)\b/m.test(source))
    return refuse(
      `${candidate.file} exports in a form promotion does not carry; export each move as a const.`,
    );
  const moves = new Set(
    all.flatMap(({ record }) =>
      record.source.kind === "app" && record.source.file === candidate.file
        ? [record.exportName]
        : [],
    ),
  );
  const own = [...source.matchAll(OWN_EXPORT)].map(([, kind = "", name = ""]) => ({
    name,
    type: kind === "type" || kind === "interface",
  }));
  const extra = own.filter(({ name, type }) => !type && !moves.has(name)).map(({ name }) => name);
  if (extra.length > 0)
    return refuse(
      `${candidate.file} exports ${extra.join(", ")} beside its moves; the library would publish it. Keep helpers unexported.`,
    );
  const known = moduleOfNames(index);
  const clash = own.filter(({ name }) => known.has(name)).map(({ name }) => name);
  if (clash.length > 0) return refuse(`@gerak/moves already exports ${clash.join(", ")}.`);
  const exported = own.map(clause);
  const target = resolve(candidate.file.replace(/\.ts$/, ""));
  const referring = sourceFiles(root).filter(
    (path) =>
      resolve(path) !== resolve(candidate.file) && names(readFileSync(path, "utf8"), path, target),
  );
  const rewrites = referring.map((importer) => ({
    importer,
    text: repointImports(readFileSync(importer, "utf8"), importer, target),
  }));
  const stuck = rewrites.filter(({ importer, text }) => names(text, importer, target));
  if (stuck.length > 0)
    return refuse(
      `${stuck.map(({ importer }) => importer).join(", ")} refer to ${candidate.file} in a form promotion does not rewrite (a re-export, import *, or a dynamic import); make them named imports first.`,
    );
  const here = all.flatMap(({ record }) =>
    record.source.kind === "app" && record.source.file === candidate.file ? [record] : [],
  );
  writeFileSync(destination, documented(relativeText.text, here));
  unlinkSync(candidate.file);
  const separator = index.endsWith("\n") ? "" : "\n";
  writeFileSync(
    indexPath,
    `${index}${separator}export { ${exported.join(", ")} } from "./moves/${base}";\n`,
  );
  for (const { importer, text } of rewrites) writeFileSync(importer, text);
  const shown = (path: string) => relative(process.cwd(), path).replaceAll("\\", "/");
  return {
    lines: [
      `moved ${shown(candidate.file)} to ${shown(destination)}`,
      `exported ${exported.join(", ")} from ${shown(indexPath)}`,
      ...rewrites.map(({ importer }) => `now imports ${id} from @gerak/moves: ${shown(importer)}`),
      "next: npm run format, npm run reference -- --write, npm run check.",
    ],
    code: 0,
  };
}
