import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import * as builtIns from "@gerak/moves";
import { MOVE_ROLES, type MoveRole, type OptionField } from "@gerak/moves";
import { unreachable } from "../page/unreachable";
import { checkMove, describeFinding, isMove, type CheckedMove } from "./moves";
import { formatParts } from "./parts";

/** Where a catalog entry was declared: the built-in package, or a file of the app. */
export type MoveSource =
  | { readonly kind: "built-in" }
  | { readonly kind: "app"; readonly file: string };

/** One move as the catalog lists it. */
export interface MoveRecord {
  readonly id: string;
  readonly role: MoveRole;
  readonly description: string;
  readonly exportName: string;
  readonly options: Readonly<Record<string, OptionField>>;
  readonly moments: readonly string[];
  readonly recipe: readonly string[];
  readonly example: { readonly options: object; readonly input?: unknown };
  readonly source: MoveSource;
}

/** The usage line of `motion:moves`. */
export const CATALOG_USAGE =
  "usage: motion:moves [<id>] [--role <role>] [--check] [--json] [--parts] [--candidates] [--root dir]";

/** The line a plain listing ends with, pointing at the building blocks. */
export const PARTS_HINT =
  "npm run motion:moves -- --parts lists the building blocks moves are made from: time, eases, blends, paths, follow-through, events, randomness.";

/** Parsed `motion:moves` arguments: `id`, `--role`, `--check`, `--json`, `--parts` and `--root`; or the usage text. */
export type CatalogArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "ok";
      readonly id: string | undefined;
      readonly role: MoveRole | undefined;
      readonly check: boolean;
      readonly json: boolean;
      readonly parts: boolean;
      readonly candidates: boolean;
      readonly root: string | undefined;
    };

/** The id, role filter, mode flags and app root typed on the command line, or the usage text. */
export function parseCatalogArgs(argv: readonly string[]): CatalogArgs {
  const usage = (message: string): CatalogArgs => ({ kind: "usage", message });
  const ids: string[] = [];
  let check = false;
  let json = false;
  let parts = false;
  let candidates = false;
  let role: string | undefined;
  let root: string | undefined;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (arg === "--check") check = true;
    else if (arg === "--json") json = true;
    else if (arg === "--parts") parts = true;
    else if (arg === "--candidates") candidates = true;
    else if (arg === "--role" || arg === "--root") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--"))
        return usage(`${arg} needs a value. ${CATALOG_USAGE}`);
      if (arg === "--role") role = value;
      else root = value;
      i += 1;
    } else if (arg.startsWith("--")) return usage(`Unknown flag ${arg}. ${CATALOG_USAGE}`);
    else ids.push(arg);
  }
  if (ids.length > 1) return usage(`Expected at most one move id. ${CATALOG_USAGE}`);
  const known = MOVE_ROLES.find((candidate) => candidate === role);
  if (role !== undefined && known === undefined)
    return usage(`Unknown role "${role}". Roles: ${MOVE_ROLES.join(", ")}.`);
  return { kind: "ok", id: ids[0], role: known, check, json, parts, candidates, root };
}

function momentNames(move: CheckedMove): readonly string[] {
  try {
    return Object.keys(Object(Reflect.apply(move.moments, move, [move.example.options])));
  } catch {
    return [];
  }
}

function byId(left: MoveRecord, right: MoveRecord): number {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

/** The moves among a module's exports, with the name each was exported under. */
function movesOf(module: Readonly<Record<string, unknown>>): readonly [string, CheckedMove][] {
  const seen = new Set<unknown>();
  const found: [string, CheckedMove][] = [];
  for (const [name, value] of Object.entries(module)) {
    if (!isMove(value) || seen.has(value)) continue;
    seen.add(value);
    found.push([name, value]);
  }
  return found;
}

function recordOf(name: string, move: CheckedMove, source: MoveSource): MoveRecord {
  return {
    id: move.id,
    role: move.role,
    description: move.description,
    exportName: name,
    options: move.options,
    moments: momentNames(move),
    recipe: move.recipe ?? [],
    example: move.example,
    source,
  };
}

/** The built-in moves, then each app file's, each group sorted by id; the checked moves ride along. */
export function collectRecords(
  appModules: readonly {
    readonly file: string;
    readonly module: Readonly<Record<string, unknown>>;
  }[],
  builtin: Readonly<Record<string, unknown>> = builtIns,
): readonly { readonly record: MoveRecord; readonly move: CheckedMove }[] {
  const entries = (module: Readonly<Record<string, unknown>>, source: MoveSource) =>
    movesOf(module)
      .map(([name, move]) => ({ record: recordOf(name, move, source), move }))
      .sort((left, right) => byId(left.record, right.record));
  return [
    ...entries(builtin, { kind: "built-in" }),
    ...appModules.flatMap(({ file, module }) => entries(module, { kind: "app", file })),
  ].sort((left, right) => {
    const rank = (record: MoveRecord) => (record.source.kind === "built-in" ? 0 : 1);
    return rank(left.record) - rank(right.record) || byId(left.record, right.record);
  });
}

function rangeOf(field: OptionField): string {
  switch (field.kind) {
    case "number": {
      const { min, max } = field;
      if (min !== undefined && max !== undefined) return `number ${min}..${max}`;
      if (min !== undefined) return `number >=${min}`;
      if (max !== undefined) return `number <=${max}`;
      return "number";
    }
    case "string":
      return field.enum === undefined ? "string" : field.enum.join("|");
    case "boolean":
      return "boolean";
    default:
      return unreachable(field);
  }
}

function optionLabel(name: string, field: OptionField): string {
  const fallback = field.default === undefined ? "required" : `default ${String(field.default)}`;
  return `${name} ${rangeOf(field)}, ${fallback}`;
}

/** The one line a listing prints for a move. */
export function formatLine(record: MoveRecord): string {
  const options = Object.entries(record.options).map(([name, field]) => optionLabel(name, field));
  return [
    `${record.id} [${record.role}] ${record.description}`,
    `options: ${options.length === 0 ? "none" : options.join("; ")}`,
    `moments: ${record.moments.length === 0 ? "none" : record.moments.join(", ")}`,
    ...(record.recipe.length === 0 ? [] : [`recipe: ${record.recipe.join(" + ")}`]),
    ...(record.source.kind === "app"
      ? [`import from ./moves/${basename(record.source.file, ".ts")}`]
      : []),
  ].join(" | ");
}

/** A call the reader could paste into a scene. */
export function exampleCall(record: MoveRecord): string {
  const given = record.example.input;
  const shown =
    typeof given === "function" ? String(given).replace(/\s+/g, " ") : JSON.stringify(given);
  const input = given === undefined ? "" : `, ${shown}`;
  return `${record.exportName}(${JSON.stringify(record.example.options)}, time${input})`;
}

/** Everything the catalog knows of one move, a line to a fact. */
export function formatFull(record: MoveRecord): readonly string[] {
  const options = Object.entries(record.options).map(
    ([name, field]) => `  ${optionLabel(name, field)}: ${field.description}`,
  );
  return [
    `${record.id} [${record.role}]`,
    record.description,
    "options:",
    ...(options.length === 0 ? ["  none"] : options),
    `moments: ${record.moments.length === 0 ? "none" : record.moments.join(", ")}`,
    ...(record.recipe.length === 0 ? [] : [`recipe: ${record.recipe.join(" + ")}`]),
    `example: ${exampleCall(record)}`,
    record.source.kind === "app" ? `file: ${record.source.file}` : "from: @gerak/moves",
  ];
}

/** Every finding on the given moves, and on any id declared twice among all of them. */
export function checkCatalog(
  all: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
  selected: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
): readonly string[] {
  const lines: string[] = [];
  for (const { record, move } of selected)
    for (const finding of checkMove(move)) lines.push(describeFinding(record.id, finding));
  const where = (record: MoveRecord) =>
    record.source.kind === "app" ? record.source.file : "@gerak/moves";
  for (const { id } of new Set(selected.map(({ record }) => record))) {
    const same = all.filter(({ record }) => record.id === id);
    if (same.length > 1)
      lines.push(
        `${id}: declared ${same.length} times, in ${same.map(({ record }) => where(record)).join(" and ")}.`,
      );
  }
  return [...new Set(lines)];
}

/** Imports each `.ts` file in `<root>/src/moves`, in name order; a file that will not import is reported. */
export async function loadAppModules(root: string): Promise<{
  readonly modules: readonly {
    readonly file: string;
    readonly module: Readonly<Record<string, unknown>>;
  }[];
  readonly problems: readonly string[];
}> {
  const folder = join(root, "src", "moves");
  const modules: { file: string; module: Readonly<Record<string, unknown>> }[] = [];
  const problems: string[] = [];
  if (!existsSync(folder)) return { modules, problems };
  const files = readdirSync(folder)
    .filter((name) => /\.ts$/.test(name) && !name.endsWith(".d.ts"))
    .sort();
  for (const name of files) {
    const file = join(folder, name);
    try {
      const module: Readonly<Record<string, unknown>> = await import(pathToFileURL(file).href);
      if (!Object.values(module).some(isMove))
        problems.push(`${file}: exports no move made by defineMove with a role and an example.`);
      modules.push({ file, module });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      problems.push(`${file}: could not be imported: ${message}`);
    }
  }
  return { modules, problems };
}

/** A local move that passes the gate and is imported by two or more files of the app. */
export interface Candidate {
  readonly id: string;
  readonly file: string;
  readonly importers: readonly string[];
}

/** One line of `--candidates`: the id, its file and how many files import it. */
export function formatCandidate(candidate: Candidate): string {
  return `${candidate.id} | ${basename(candidate.file)} | importers: ${candidate.importers.length}`;
}

function sourceFiles(folder: string): readonly string[] {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path] : [];
  });
}

/** The files of `<root>/src`, outside `src/moves`, whose text imports `src/moves/<name>`. */
export function importersOf(root: string, file: string): readonly string[] {
  const target = resolve(file).replace(/\.ts$/, "");
  const imports = /\bfrom\s*["'](\.[^"']*)["']/g;
  return sourceFiles(join(root, "src")).filter((path) => {
    if (dirname(resolve(path)) === dirname(target)) return false;
    return [...readFileSync(path, "utf8").matchAll(imports)].some(
      ([, spec = ""]) => resolve(dirname(path), spec).replace(/\.(js|ts)$/, "") === target,
    );
  });
}

/** The app's moves that pass the gate and are imported by two or more files, by id. */
export function candidatesOf(
  root: string,
  all: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
): readonly Candidate[] {
  const found: Candidate[] = [];
  for (const entry of all) {
    const { record, move } = entry;
    if (record.source.kind !== "app") continue;
    if (checkCatalog(all, [entry]).length > 0 || checkMove(move).length > 0) continue;
    const importers = importersOf(root, record.source.file);
    if (importers.length >= 2) found.push({ id: record.id, file: record.source.file, importers });
  }
  return found.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
}

/** What `motion:moves` prints: the `lines`, and the exit `code`, 1 on a finding. */
export interface CatalogRun {
  readonly lines: readonly string[];
  readonly code: 0 | 1;
}

/** Runs the command for parsed arguments and an app root: the lines to print and the exit code. */
export async function runCatalog(
  args: Extract<CatalogArgs, { kind: "ok" }>,
  root: string,
): Promise<CatalogRun> {
  if (args.parts) return { lines: formatParts(), code: 0 };
  const { modules, problems } = await loadAppModules(root);
  const all = collectRecords(modules);
  if (args.candidates) {
    const found = candidatesOf(root, all);
    return {
      lines: found.length === 0 ? ["No candidates."] : found.map(formatCandidate),
      code: problems.length === 0 ? 0 : 1,
    };
  }
  const byRole = all.filter(({ record }) => args.role === undefined || record.role === args.role);
  const selected =
    args.id === undefined ? byRole : byRole.filter(({ record }) => record.id === args.id);
  if (args.id !== undefined && selected.length === 0)
    return {
      lines: [`No move "${args.id}". Known: ${all.map(({ record }) => record.id).join(", ")}.`],
      code: 1,
    };
  if (args.check) {
    const findings = [...problems, ...checkCatalog(all, selected)];
    const lines = args.json
      ? [JSON.stringify({ ok: findings.length === 0, findings })]
      : findings.length === 0
        ? [`ok: ${selected.length} moves pass.`]
        : findings;
    return { lines, code: findings.length === 0 ? 0 : 1 };
  }
  const records = selected.map(({ record }) => record);
  // A modifier's example input is a function, which JSON drops; its source is what a reader can use.
  const printable = (_key: string, value: unknown): unknown =>
    typeof value === "function" ? String(value).replace(/s+/g, " ") : value;
  if (args.json)
    return { lines: [JSON.stringify(records, printable)], code: problems.length === 0 ? 0 : 1 };
  const body = args.id === undefined ? records.map(formatLine) : records.flatMap(formatFull);
  const hint = args.id === undefined ? [PARTS_HINT] : [];
  return { lines: [...body, ...problems, ...hint], code: problems.length === 0 ? 0 : 1 };
}
