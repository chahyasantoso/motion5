import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as builtIns from "@gerak/moves";
import { MOVE_ROLES, type MoveRole, type OptionField } from "@gerak/moves";
import { unreachable } from "../page/unreachable";
import { briefFolders } from "./briefs";
import {
  checkMove,
  describeFinding,
  descriptorsOf,
  isMove,
  type CheckedMove,
  type Descriptors,
  type MoveDescriptors,
} from "./moves";
import { formatParts, partsImportedBy } from "./parts";

/** The source name of the moves package this repository ships. */
export const BUILT_IN_SOURCE = "@gerak/moves";

/** One move as the catalog lists it. */
export interface MoveRecord {
  readonly id: string;
  readonly role: MoveRole;
  readonly description: string;
  readonly exportName: string;
  readonly options: Readonly<Record<string, OptionField>>;
  readonly moments: readonly string[];
  readonly parts: readonly string[];
  readonly example: { readonly options: object; readonly input?: unknown };
  /** The call the example makes, as a scene would write it. */
  readonly call: string;
  /** The package a move comes from, or the brief folder that declares it. */
  readonly source: string;
  /** The move's file, for a move declared in a folder. */
  readonly file?: string;
  /** The fields the move moves, in its pose's order. */
  readonly fields: readonly string[];
  /** The field that moves most against its review limit; the descriptors are its. */
  readonly primary?: string;
  readonly descriptors?: Descriptors;
  /** The shape of every moved field at the example. */
  readonly shapes: Readonly<Record<string, Descriptors>>;
  /** The shapes of every field at each option set the gate samples, the example's first. */
  readonly shapesAt: MoveDescriptors["shapesAt"];
}

/** The usage line of `motion:moves`. */
export const CATALOG_USAGE =
  "usage: motion:moves [<id>] [--role <role>] [--find <words>] [--fields a,b] [--like <quality>] [--near <id>] [--far <id>] [--in <brief>] [--all] [--check] [--json] [--parts] [--candidates] [--root dir]";

/** The line a plain listing ends with, pointing at the building blocks. */
export const PARTS_HINT =
  "npm run motion:moves -- --parts lists the building blocks moves are made from: fields, time, laws, blends, paths, follow-through, events, randomness, camera, compose.";

/** Parsed `motion:moves` arguments; or the usage text. */
export type CatalogArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "ok";
      readonly id: string | undefined;
      readonly role: MoveRole | undefined;
      readonly find: readonly string[] | undefined;
      readonly fields: readonly string[] | undefined;
      readonly like: string | undefined;
      readonly near: string | undefined;
      readonly far: string | undefined;
      readonly in: string | undefined;
      readonly all: boolean;
      readonly check: boolean;
      readonly json: boolean;
      readonly parts: boolean;
      readonly candidates: boolean;
      readonly root: string | undefined;
    };

const VALUE_FLAGS = ["--role", "--root", "--find", "--fields", "--like", "--near", "--far", "--in"];

/** The id, query flags, mode flags and app root typed on the command line, or the usage text. */
export function parseCatalogArgs(argv: readonly string[]): CatalogArgs {
  const usage = (message: string): CatalogArgs => ({ kind: "usage", message });
  const ids: string[] = [];
  const values = new Map<string, string>();
  const on = new Set<string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (["--check", "--json", "--parts", "--candidates", "--all"].includes(arg)) on.add(arg);
    else if (VALUE_FLAGS.includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--"))
        return usage(`${arg} needs a value. ${CATALOG_USAGE}`);
      values.set(arg, value);
      i += 1;
    } else if (arg.startsWith("--")) return usage(`Unknown flag ${arg}. ${CATALOG_USAGE}`);
    else ids.push(arg);
  }
  if (ids.length > 1) return usage(`Expected at most one move id. ${CATALOG_USAGE}`);
  const role = values.get("--role");
  const known = MOVE_ROLES.find((candidate) => candidate === role);
  if (role !== undefined && known === undefined)
    return usage(`Unknown role "${role}". Roles: ${MOVE_ROLES.join(", ")}.`);
  const list = (flag: string): readonly string[] | undefined =>
    values
      .get(flag)
      ?.split(/[\s,]+/)
      .filter((word) => word.length > 0);
  return {
    kind: "ok",
    id: ids[0],
    role: known,
    find: list("--find"),
    fields: list("--fields"),
    like: values.get("--like"),
    near: values.get("--near"),
    far: values.get("--far"),
    in: values.get("--in"),
    all: on.has("--all"),
    check: on.has("--check"),
    json: on.has("--json"),
    parts: on.has("--parts"),
    candidates: on.has("--candidates"),
    root: values.get("--root"),
  };
}

/** Where a root says its moves come from, and where promotion writes. */
export interface GerakConfig {
  readonly moves: readonly string[];
  readonly promoteTo?: string;
}

/** The sources a root with no `gerak.moves` setting reads. */
export const DEFAULT_SOURCES: readonly string[] = [BUILT_IN_SOURCE, "./*/src/moves"];

function recordOf(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function readJson(file: string): Readonly<Record<string, unknown>> | undefined {
  try {
    return recordOf(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return undefined;
  }
}

/** The `gerak` setting of `<root>/package.json`: its moves list (or the default) and its `promoteTo`. */
export function readConfig(root: string): GerakConfig {
  const setting = recordOf(readJson(join(root, "package.json"))?.gerak);
  const list = setting?.moves;
  const moves = Array.isArray(list)
    ? list.filter((entry): entry is string => typeof entry === "string")
    : DEFAULT_SOURCES;
  const promoteTo = setting?.promoteTo;
  return { moves, ...(typeof promoteTo === "string" ? { promoteTo } : {}) };
}

function momentNames(move: CheckedMove): readonly string[] {
  try {
    return Object.keys(Object(Reflect.apply(move.moments, move, [move.example.options])));
  } catch {
    return [];
  }
}

function byId(left: MoveRecord, right: MoveRecord): number {
  if (left.id !== right.id) return left.id < right.id ? -1 : 1;
  return left.source < right.source ? -1 : left.source > right.source ? 1 : 0;
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

const BUILT_IN_MOVES = fileURLToPath(new URL("../../../moves/src/moves/", import.meta.url));
const BUILT_IN_MANIFEST = fileURLToPath(new URL("../../../moves/package.json", import.meta.url));

let builtInTexts: readonly string[] | undefined;

/** The text of the file in the built-in moves folder that exports `name`; undefined where that folder is not on disk. */
function builtInText(name: string): string | undefined {
  if (!existsSync(BUILT_IN_MOVES)) return undefined;
  builtInTexts ??= readdirSync(BUILT_IN_MOVES)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => readFileSync(join(BUILT_IN_MOVES, file), "utf8"));
  const exported = new RegExp(`export (?:const|function) ${name}\\b`);
  return builtInTexts.find((text) => exported.test(text));
}

/** A module the catalog reads moves from: its source, and its file (for a folder) or version (for a package). */
export interface LoadedModule {
  readonly module: Readonly<Record<string, unknown>>;
  readonly source?: string;
  readonly file?: string;
  readonly version?: string;
}

/** The brief folder a move file sits in: the folder above its `src`. */
function briefOf(file: string): string {
  const names = resolve(file).split(sep);
  const at = names.lastIndexOf("src");
  return names[at > 0 ? at - 1 : names.length - 2] ?? "";
}

function inputText(given: unknown): string {
  return typeof given === "function" ? String(given).replace(/\s+/g, " ") : JSON.stringify(given);
}

function callOf(name: string, example: MoveRecord["example"]): string {
  const input = example.input === undefined ? "" : `, ${inputText(example.input)}`;
  return `${name}(${JSON.stringify(example.options)}, time${input})`;
}

const digest = (text: string): string => createHash("sha1").update(text).digest("hex");

/** What a move's cached record is keyed by: its file's text, or its package's version. */
function hashOf(name: string, loaded: LoadedModule): string {
  if (loaded.file !== undefined) return digest(readFileSync(loaded.file, "utf8"));
  const text = loaded.source === BUILT_IN_SOURCE ? builtInText(name) : undefined;
  return text === undefined ? `version ${loaded.version ?? ""}` : digest(text);
}

function partsOf(name: string, loaded: LoadedModule): readonly string[] {
  const text =
    loaded.file !== undefined
      ? readFileSync(loaded.file, "utf8")
      : loaded.source === BUILT_IN_SOURCE
        ? builtInText(name)
        : undefined;
  return text === undefined ? [] : partsImportedBy(text);
}

/** What the catalog may ask of the build of records: the sampler, and the index to read and fill. */
export interface CollectHooks {
  readonly sampler?: (move: CheckedMove) => MoveDescriptors;
  readonly cached?: (key: string, hash: string) => MoveRecord | undefined;
  readonly keep?: (key: string, hash: string, record: MoveRecord) => void;
}

function freshRecord(
  name: string,
  move: CheckedMove,
  loaded: LoadedModule,
  source: string,
  sampler: (move: CheckedMove) => MoveDescriptors,
): MoveRecord {
  const { fields, primary, descriptors, shapes, shapesAt } = sampler(move);
  return {
    id: move.id,
    role: move.role,
    description: move.description,
    exportName: name,
    options: move.options,
    moments: momentNames(move),
    parts: partsOf(name, loaded),
    example: move.example,
    call: callOf(name, move.example),
    source,
    ...(loaded.file === undefined ? {} : { file: loaded.file }),
    fields,
    ...(primary === undefined ? {} : { primary }),
    ...(descriptors === undefined ? {} : { descriptors }),
    shapes,
    shapesAt,
  };
}

let builtInVersion: string | undefined;

function versionOfBuiltIns(): string {
  builtInVersion ??= String(readJson(BUILT_IN_MANIFEST)?.version ?? "");
  return builtInVersion;
}

/** The moves of the built-in package and of each loaded module, by id; the checked moves ride along. */
export function collectRecords(
  modules: readonly LoadedModule[],
  builtin: Readonly<Record<string, unknown>> = builtIns,
  hooks: CollectHooks = {},
): readonly { readonly record: MoveRecord; readonly move: CheckedMove }[] {
  const sampler = hooks.sampler ?? descriptorsOf;
  const loadedModules: readonly LoadedModule[] = [
    { module: builtin, source: BUILT_IN_SOURCE, version: versionOfBuiltIns() },
    ...modules,
  ];
  const found = loadedModules.flatMap((loaded) => {
    const source = loaded.source ?? (loaded.file === undefined ? "" : briefOf(loaded.file));
    return movesOf(loaded.module).map(([name, move]) => {
      const key = [source, loaded.file ?? "", name].join("\u0000");
      const hash = hashOf(name, loaded);
      const record = hooks.cached?.(key, hash) ?? freshRecord(name, move, loaded, source, sampler);
      hooks.keep?.(key, hash, record);
      return { record, move };
    });
  });
  return found.sort((left, right) => byId(left.record, right.record));
}

function isDescriptors(value: unknown): value is Descriptors {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "travelling") === "boolean" &&
    ["peak", "overshoot", "rings", "windup", "settle"].every(
      (key) => typeof Reflect.get(value, key) === "number",
    )
  );
}

function isRecord(value: unknown): value is MoveRecord {
  if (typeof value !== "object" || value === null) return false;
  const text = (key: string) => typeof Reflect.get(value, key) === "string";
  const optional = (key: string) => Reflect.get(value, key) === undefined || text(key);
  const descriptors: unknown = Reflect.get(value, "descriptors");
  return (
    ["id", "description", "exportName", "call", "source"].every(text) &&
    MOVE_ROLES.some((role) => role === Reflect.get(value, "role")) &&
    optional("file") &&
    optional("primary") &&
    (descriptors === undefined || isDescriptors(descriptors)) &&
    ["moments", "parts", "fields", "shapesAt"].every((key) =>
      Array.isArray(Reflect.get(value, key)),
    ) &&
    typeof Reflect.get(value, "shapes") === "object" &&
    typeof Reflect.get(value, "options") === "object" &&
    typeof Reflect.get(value, "example") === "object"
  );
}

const INDEX_VERSION = 2;

/** Where a root keeps its index of records. */
export function indexPath(root: string): string {
  return join(root, "node_modules", ".cache", "gerak", "moves.json");
}

interface IndexEntry {
  readonly hash: string;
  readonly record: MoveRecord;
}

function readIndex(text: string | undefined): ReadonlyMap<string, IndexEntry> {
  const entries = new Map<string, IndexEntry>();
  if (text === undefined) return entries;
  try {
    const parsed = recordOf(JSON.parse(text));
    const moves = recordOf(parsed?.moves);
    if (parsed?.version !== INDEX_VERSION || moves === undefined) return entries;
    for (const [key, entry] of Object.entries(moves)) {
      const hash = recordOf(entry)?.hash;
      const record = recordOf(entry)?.record;
      if (typeof hash === "string" && isRecord(record)) entries.set(key, { hash, record });
    }
  } catch {
    entries.clear();
  }
  return entries;
}

function readText(file: string): string | undefined {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

/** Folders matching a pattern such as `./*\/src/moves`, relative to the root; `*` is any folder. */
function expandFolders(root: string, pattern: string): readonly string[] {
  let folders = [resolve(root)];
  for (const segment of pattern.split("/").filter((part) => part !== "" && part !== ".")) {
    folders = folders
      .flatMap((folder) =>
        segment === "*"
          ? existsSync(folder)
            ? readdirSync(folder, { withFileTypes: true })
                .filter(
                  (entry) =>
                    entry.isDirectory() &&
                    entry.name !== "node_modules" &&
                    !entry.name.startsWith("."),
                )
                .map((entry) => join(folder, entry.name))
                .sort()
            : []
          : [join(folder, segment)],
      )
      .filter((folder) => existsSync(folder));
  }
  return folders;
}

const isFolderSource = (entry: string): boolean => entry.startsWith(".");

/** Imports each `.ts` file of every folder source, folder by folder; a file that will not import is reported. */
export async function loadAppModules(
  root: string,
  config: GerakConfig = readConfig(root),
): Promise<{
  readonly modules: readonly (LoadedModule & { readonly file: string })[];
  readonly problems: readonly string[];
}> {
  const modules: (LoadedModule & { readonly file: string })[] = [];
  const problems: string[] = [];
  const folders = [
    ...new Set(config.moves.filter(isFolderSource).flatMap((entry) => expandFolders(root, entry))),
  ];
  for (const folder of folders) {
    const source = relative(root, folder).split(sep)[0] ?? "";
    const files = readdirSync(folder)
      .filter((name) => /\.ts$/.test(name) && !name.endsWith(".d.ts"))
      .sort()
      .map((name) => join(folder, name));
    for (const file of files) {
      try {
        const module: Readonly<Record<string, unknown>> = await import(pathToFileURL(file).href);
        if (!Object.values(module).some(isMove))
          problems.push(`${file}: exports no move made by defineMove with a role and an example.`);
        modules.push({ file, module, source });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        problems.push(`${file}: could not be imported: ${message}`);
      }
    }
  }
  return { modules, problems };
}

/** The folder of package `name` as `root` would resolve it, looking in each `node_modules` up the tree. */
function packageFolder(root: string, name: string): string | undefined {
  for (let folder = resolve(root); ; folder = dirname(folder)) {
    const candidate = join(folder, "node_modules", ...name.split("/"));
    if (existsSync(join(candidate, "package.json"))) return candidate;
    if (dirname(folder) === folder) return undefined;
  }
}

function entryFrom(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  const fields = recordOf(value);
  if (fields === undefined) return undefined;
  for (const key of [".", "import", "default", "node", "module"]) {
    const found = entryFrom(fields[key]);
    if (found !== undefined) return found;
  }
  return undefined;
}

async function loadPackage(
  root: string,
  name: string,
): Promise<LoadedModule | { readonly problem: string }> {
  if (name === BUILT_IN_SOURCE)
    return { module: builtIns, source: name, version: versionOfBuiltIns() };
  const folder = packageFolder(root, name);
  if (folder === undefined) return { problem: `${name}: not found from ${root}.` };
  const manifest = readJson(join(folder, "package.json"));
  const entry =
    entryFrom(manifest?.exports) ??
    (typeof manifest?.module === "string" ? manifest.module : undefined) ??
    (typeof manifest?.main === "string" ? manifest.main : "index.js");
  try {
    const module: Readonly<Record<string, unknown>> = await import(
      pathToFileURL(join(folder, entry)).href
    );
    return { module, source: name, version: String(manifest?.version ?? "") };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { problem: `${name}: could not be imported: ${message}` };
  }
}

/** The records of every source a root declares, and a live move beside each. */
export interface Catalog {
  readonly entries: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[];
  readonly problems: readonly string[];
  readonly config: GerakConfig;
}

/** What a run may replace: the sampler that measures a move. */
export interface CatalogOptions {
  readonly sampler?: (move: CheckedMove) => MoveDescriptors;
  /** The near-duplicate pairs not to report; the repository's baseline when left out. */
  readonly baseline?: ReadonlySet<string>;
}

/** Reads every source the root declares, reusing the index for any move whose file or package has not changed. */
export async function loadCatalog(root: string, options: CatalogOptions = {}): Promise<Catalog> {
  const config = readConfig(root);
  const packages: LoadedModule[] = [];
  const problems: string[] = [];
  for (const name of config.moves.filter((entry) => !isFolderSource(entry))) {
    const loaded = await loadPackage(root, name);
    if ("problem" in loaded) problems.push(loaded.problem);
    else packages.push(loaded);
  }
  const folders = await loadAppModules(root, config);
  const before = readText(indexPath(root));
  const previous = readIndex(before);
  const next = new Map<string, IndexEntry>();
  const entries = collectRecords(
    [...packages, ...folders.modules],
    {},
    {
      ...(options.sampler === undefined ? {} : { sampler: options.sampler }),
      cached: (key, hash) => {
        const found = previous.get(key);
        return found?.hash === hash ? found.record : undefined;
      },
      keep: (key, hash, record) => next.set(key, { hash, record }),
    },
  );
  const text = JSON.stringify(
    { version: INDEX_VERSION, moves: Object.fromEntries(next) },
    (_key, value: unknown) => (typeof value === "function" ? inputText(value) : value),
  );
  if (text !== before)
    try {
      mkdirSync(dirname(indexPath(root)), { recursive: true });
      writeFileSync(indexPath(root), text);
    } catch {
      // A root that cannot hold an index is read afresh each time.
    }
  return { entries, problems: [...problems, ...folders.problems], config };
}

/** The qualities `--like` knows, as a range per descriptor: `rings` counts, the others are shares or ratios. */
export interface DescriptorRanges {
  readonly peak?: readonly [number, number];
  readonly overshoot?: readonly [number, number];
  readonly rings?: readonly [number, number];
  readonly windup?: readonly [number, number];
  readonly settle?: readonly [number, number];
}

/** The words `--like` understands, each as the ranges of descriptors a move with that quality sits in;
 * `drop` measures heavy, `fade` calm, `pop` playful and `jolt` loose. */
export const QUALITIES: Readonly<Record<string, DescriptorRanges>> = Object.freeze({
  heavy: { peak: [0.6, 1], overshoot: [0, 0.1], rings: [0, 1] },
  light: { peak: [0, 0.35], settle: [0, 0.3] },
  quick: { peak: [0, 0.35], overshoot: [0, 0.1], rings: [0, 0] },
  calm: { peak: [0.35, 0.65], overshoot: [0, 0.05], rings: [0, 0] },
  playful: { overshoot: [0.1, 1] },
  stiff: { overshoot: [0, 0.02], rings: [0, 0], settle: [0, 0.05] },
  loose: { rings: [2, 30] },
});

/** The descriptors a quality names that lie outside its range, each with its value and range; none means
 * the shape has the quality. */
export function outsideRanges(
  descriptors: Descriptors,
  ranges: DescriptorRanges,
): readonly {
  readonly key: (typeof DESCRIPTOR_KEYS)[number];
  readonly value: number;
  readonly range: readonly [number, number];
}[] {
  return DESCRIPTOR_KEYS.flatMap((key) => {
    const range = ranges[key];
    const value = descriptors[key];
    return range === undefined || (value >= range[0] && value <= range[1])
      ? []
      : [{ key, value, range }];
  });
}

const DESCRIPTOR_KEYS = ["peak", "overshoot", "rings", "windup", "settle"] as const;

/** A descriptor as distances weigh it: rings count in quarters. */
const weighed = (key: (typeof DESCRIPTOR_KEYS)[number], value: number): number =>
  key === "rings" ? value / 4 : value;

function shapeDistance(left: Descriptors, right: Descriptors): number {
  return DESCRIPTOR_KEYS.reduce(
    (total, key) => total + (weighed(key, left[key]) - weighed(key, right[key])) ** 2,
    0,
  );
}

/** How far two moves are apart: over every field either moves, the squared differences of the field's
 * shape where both move it, and 1 where only one does; the mean. Undefined when neither moves a field. */
export function distance(left: MoveRecord, right: MoveRecord): number | undefined {
  const lefts = new Map(Object.entries(left.shapes));
  const rights = new Map(Object.entries(right.shapes));
  const names = new Set([...lefts.keys(), ...rights.keys()]);
  if (names.size === 0) return undefined;
  let total = 0;
  for (const name of names) {
    const a = lefts.get(name);
    const b = rights.get(name);
    total += a !== undefined && b !== undefined ? shapeDistance(a, b) : 1;
  }
  return total / names.size;
}

/** How far a shape is from the middle of a quality's ranges, rings weighed by a quarter. */
function distanceToMiddle(shape: Descriptors, ranges: DescriptorRanges): number {
  return DESCRIPTOR_KEYS.reduce((total, key) => {
    const range = ranges[key];
    return range === undefined
      ? total
      : total + (weighed(key, shape[key]) - weighed(key, (range[0] + range[1]) / 2)) ** 2;
  }, 0);
}

/** The moved field whose shape at the example has the quality and is nearest its middle, with that distance. */
function fieldWith(
  record: MoveRecord,
  ranges: DescriptorRanges,
): { readonly field: string; readonly fit: number } | undefined {
  let best: { readonly field: string; readonly fit: number } | undefined;
  for (const [field, shape] of Object.entries(record.shapes)) {
    if (outsideRanges(shape, ranges).length > 0) continue;
    const fit = distanceToMiddle(shape, ranges);
    if (best === undefined || fit < best.fit) best = { field, fit };
  }
  return best;
}

/** What one search asks of the records; every field given must hold. */
export interface CatalogQuery {
  readonly role?: MoveRole;
  readonly find?: readonly string[];
  readonly fields?: readonly string[];
  readonly like?: string;
  readonly near?: string;
  readonly far?: string;
  readonly in?: string;
  readonly all?: boolean;
}

/** One move a search found. */
export interface QueryRow {
  readonly record: MoveRecord;
  /** Whether the move is declared in the brief the search was made from. */
  readonly own: boolean;
  /** The id, or `source/id` where two sources share the id. */
  readonly label: string;
  /** How well it fits, least first; undefined when the search ranks by nothing. */
  readonly fit: number | undefined;
  /** The moved field that has the quality `--like` asked for. */
  readonly field?: string;
}

/** What a search returned, or why it could not be made. */
export type QueryResult =
  | { readonly kind: "rows"; readonly rows: readonly QueryRow[] }
  | { readonly kind: "refused"; readonly message: string };

/** Whether a request asks anything: a filter, a ranking or `--all`. */
export function isQuery(request: CatalogQuery): boolean {
  return (
    request.role !== undefined ||
    request.find !== undefined ||
    request.fields !== undefined ||
    request.like !== undefined ||
    request.near !== undefined ||
    request.far !== undefined ||
    request.all === true
  );
}

/** The records an id names, or `source/id` for one source's. */
export function lookup(records: readonly MoveRecord[], text: string): readonly MoveRecord[] {
  return records.filter((record) => record.id === text || `${record.source}/${record.id}` === text);
}

function matchesWords(record: MoveRecord, words: readonly string[]): number | undefined {
  const places = [record.id, record.description, Object.keys(record.options).join(" ")].map(
    (place) => place.toLowerCase(),
  );
  let hits = 0;
  for (const word of words.map((candidate) => candidate.toLowerCase())) {
    const found = places.filter((place) => place.includes(word)).length;
    if (found === 0) return undefined;
    hits += found;
  }
  return hits;
}

/** Every record that fits the request, best first; equal fits come out by id, never by source. */
export function query(records: readonly MoveRecord[], request: CatalogQuery): QueryResult {
  const refused = (message: string): QueryResult => ({ kind: "refused", message });
  const pick = (flag: string, text: string): MoveRecord | string => {
    const found = lookup(records, text);
    const [only] = found;
    if (only === undefined) return `${flag}: no move "${text}".`;
    if (found.length > 1)
      return `${flag}: "${text}" is declared in ${found.map(({ source }) => `${source}/${text}`).join(" and ")}; ask with source/id.`;
    return only;
  };
  const near = request.near === undefined ? undefined : pick("--near", request.near);
  const far = request.far === undefined ? undefined : pick("--far", request.far);
  if (typeof near === "string") return refused(near);
  if (typeof far === "string") return refused(far);
  const ranges = request.like === undefined ? undefined : QUALITIES[request.like];
  if (request.like !== undefined && ranges === undefined)
    return refused(
      `--like: unknown quality "${request.like}". Qualities: ${Object.keys(QUALITIES).join(", ")}.`,
    );
  const ranked = near !== undefined || far !== undefined || ranges !== undefined;
  const shared = new Set(
    records.filter((record) => lookup(records, record.id).length > 1).map(({ id }) => id),
  );
  const rows: { row: QueryRow; hits: number }[] = [];
  for (const record of records) {
    if (request.role !== undefined && record.role !== request.role) continue;
    if (request.fields?.some((field) => !record.fields.includes(field)) === true) continue;
    const hits = request.find === undefined ? 0 : matchesWords(record, request.find);
    if (hits === undefined) continue;
    const matched = ranges === undefined ? undefined : fieldWith(record, ranges);
    if (ranges !== undefined && matched === undefined) continue;
    let fit: number | undefined;
    if (ranked) {
      const parts = [
        near === undefined || near === record ? 0 : distance(record, near),
        far === undefined || far === record ? 0 : distance(record, far),
        matched?.fit ?? 0,
      ];
      if (record === near || record === far || parts.some((part) => part === undefined)) continue;
      fit = (parts[0] ?? 0) - (far === undefined ? 0 : (parts[1] ?? 0)) + (parts[2] ?? 0);
    }
    rows.push({
      hits,
      row: {
        record,
        own: request.in !== undefined && record.file !== undefined && record.source === request.in,
        label: shared.has(record.id) ? `${record.source}/${record.id}` : record.id,
        fit,
        ...(matched === undefined ? {} : { field: matched.field }),
      },
    });
  }
  rows.sort(
    (left, right) =>
      (left.row.fit ?? 0) - (right.row.fit ?? 0) ||
      right.hits - left.hits ||
      byId(left.row.record, right.row.record),
  );
  return { kind: "rows", rows: rows.map(({ row }) => row) };
}

/** The import a scene writes for a move: the package's name, or the file as `from` (a brief) or the root sees it. */
export function importLine(record: MoveRecord, root: string, from: string | undefined): string {
  const names = `{ ${record.exportName} }`;
  if (record.file === undefined) return `import ${names} from "${record.source}"`;
  const target = record.file.replace(/\.ts$/, "");
  const path =
    from === undefined ? relative(root, target) : relative(join(root, from, "src"), target);
  const posix = path.split(sep).join("/");
  return `import ${names} from "${posix.startsWith(".") ? posix : `./${posix}`}"`;
}

const firstSentence = (text: string): string => /^.*?[.!?](?=\s|$)/s.exec(text)?.[0] ?? text;

/** One line of a search: label, source, role, fields moved, the description's first sentence, the import. */
export function formatRow(row: QueryRow, root: string, from: string | undefined): string {
  const { record } = row;
  return [
    row.label,
    row.own ? "own" : record.source,
    record.role,
    record.fields.length === 0 ? "none" : record.fields.join(","),
    ...(row.field === undefined ? [] : [`on ${row.field}`]),
    firstSentence(record.description),
    importLine(record, root, from),
  ].join(" | ");
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

/** A call the reader could paste into a scene. */
export function exampleCall(record: MoveRecord): string {
  return record.call;
}

const shown = (value: number): number => Math.round(value * 100) / 100;

/** Everything the catalog knows of one move, a line to a fact. */
export function formatFull(
  record: MoveRecord,
  context: { readonly importedBy: readonly string[]; readonly importText: string },
): readonly string[] {
  const options = Object.entries(record.options).map(
    ([name, field]) => `  ${optionLabel(name, field)}: ${field.description}`,
  );
  const { descriptors } = record;
  return [
    `${record.id} [${record.role}]`,
    record.description,
    "options:",
    ...(options.length === 0 ? ["  none"] : options),
    `moments: ${record.moments.length === 0 ? "none" : record.moments.join(", ")}`,
    `fields: ${record.fields.length === 0 ? "none" : `${record.fields.join(", ")} (primary ${record.primary ?? "none"})`}`,
    descriptors === undefined
      ? "descriptors: none"
      : `descriptors: peak ${shown(descriptors.peak)}, overshoot ${shown(descriptors.overshoot)}, rings ${descriptors.rings}, windup ${shown(descriptors.windup)}, settle ${shown(descriptors.settle)} (${descriptors.travelling ? "travelling" : "oscillating"})`,
    `parts: ${record.parts.length === 0 ? "none" : record.parts.join(" + ")}`,
    `imported by: ${context.importedBy.length === 0 ? "none" : context.importedBy.join(", ")}`,
    `example: ${exampleCall(record)}`,
    `import: ${context.importText}`,
    record.file === undefined ? `from: ${record.source}` : `file: ${record.file}`,
  ];
}

/** Two moves of one role and one primary field this close are the same motion under two ids. */
const NEAR_DUPLICATE = 0.02;

const BASELINE_FILE = fileURLToPath(
  new URL("../../../../scripts/duplicate-baseline.json", import.meta.url),
);

const pairOf = (left: MoveRecord, right: MoveRecord): string =>
  [`${left.source}/${left.id}`, `${right.source}/${right.id}`].sort().join(" ");

/** The moves a record is a near-duplicate of: one role, one primary field, within the distance. */
export function nearDuplicatesOf(
  records: readonly MoveRecord[],
  record: MoveRecord,
): readonly MoveRecord[] {
  if (record.primary === undefined) return [];
  return records.filter((other) => {
    if (other === record || other.role !== record.role) return false;
    const apart = distance(record, other);
    return apart !== undefined && apart <= NEAR_DUPLICATE;
  });
}

/** Every near-duplicate pair among the records, each as sorted `source/id source/id`, sorted. */
export function duplicatePairs(records: readonly MoveRecord[]): readonly string[] {
  return [
    ...new Set(
      records.flatMap((record) =>
        nearDuplicatesOf(records, record).map((other) => pairOf(record, other)),
      ),
    ),
  ].sort();
}

/** The pairs `scripts/duplicate-baseline.json` lists as already found; none where the file is not on disk. */
export function loadDuplicateBaseline(): ReadonlySet<string> {
  const text = readText(BASELINE_FILE);
  try {
    const listed: unknown = text === undefined ? [] : JSON.parse(text);
    return new Set(Array.isArray(listed) ? listed.filter((pair) => typeof pair === "string") : []);
  } catch {
    return new Set();
  }
}

/** What the gate may be told: the pairs already found, and the root to write imports from. */
export interface CheckOptions {
  readonly baseline?: ReadonlySet<string>;
  readonly root?: string;
}

/** One line for a move that is a near-duplicate of another, unless the baseline lists the pair. */
export function duplicateLines(
  records: readonly MoveRecord[],
  record: MoveRecord,
  options: CheckOptions = {},
): readonly string[] {
  const baseline = options.baseline ?? loadDuplicateBaseline();
  return nearDuplicatesOf(records, record)
    .filter((other) => !baseline.has(pairOf(record, other)))
    .map((other) => {
      const how =
        options.root === undefined ? "" : ` (${importLine(other, options.root, undefined)})`;
      return `${record.id}: close to \`${other.id}\` (${other.source}): import it instead${how}, or change what makes yours differ.`;
    });
}

/** Every finding on the given moves, and on any id declared twice within one source. */
export function checkCatalog(
  all: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
  selected: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
  options: CheckOptions = {},
): readonly string[] {
  const lines: string[] = [];
  const records = all.map(({ record }) => record);
  const baseline = options.baseline ?? loadDuplicateBaseline();
  for (const { record, move } of selected) {
    for (const finding of checkMove(move)) lines.push(describeFinding(record.id, finding));
    lines.push(...duplicateLines(records, record, { ...options, baseline }));
  }
  const where = (record: MoveRecord) => record.file ?? record.source;
  for (const { record: chosen } of selected) {
    const same = all.filter(
      ({ record }) => record.id === chosen.id && record.source === chosen.source,
    );
    if (same.length > 1)
      lines.push(
        `${chosen.id}: declared ${same.length} times, in ${same.map(({ record }) => where(record)).join(" and ")}.`,
      );
  }
  return [...new Set(lines)];
}

/** A local move that passes the gate and is used by two or more briefs of the app. */
export interface Candidate {
  readonly id: string;
  readonly file: string;
  readonly importers: readonly string[];
  /** The distinct brief folders among the importers. */
  readonly briefs: readonly string[];
}

/** One line of `--candidates`: the id, its file and how many briefs use it. */
export function formatCandidate(candidate: Candidate): string {
  return `${candidate.id} | ${basename(candidate.file)} | briefs: ${candidate.briefs.length}`;
}

/** Every `.ts` and `.tsx` file under `folder`, leaving out `node_modules`, `dist` and hidden folders. */
export function sourceFiles(folder: string): readonly string[] {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory())
      return entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")
        ? []
        : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path] : [];
  });
}

/** The files of every brief's `src` whose text imports the move `file`, leaving out the move's own folder. */
export function importersOf(root: string, file: string): readonly string[] {
  const target = resolve(file).replace(/\.ts$/, "");
  const imports = /\bfrom\s*["'](\.[^"']*)["']/g;
  return briefFolders(root)
    .flatMap((brief) => sourceFiles(join(root, brief, "src")))
    .filter((path) => {
      if (dirname(resolve(path)) === dirname(target)) return false;
      return [...readFileSync(path, "utf8").matchAll(imports)].some(
        ([, spec = ""]) => resolve(dirname(path), spec).replace(/\.(js|ts)$/, "") === target,
      );
    });
}

/** The briefs of the root whose files import a move: by path for a folder move, by name for a package's. */
function briefsImporting(root: string, record: MoveRecord): readonly string[] {
  if (record.file !== undefined) {
    const found = importersOf(root, record.file).map((path) => relative(root, path).split(sep)[0]);
    return [...new Set(found.filter((brief): brief is string => brief !== undefined))].sort();
  }
  const named = new RegExp(
    `import\\s*(?:type\\s*)?\\{[^}]*\\b${record.exportName}\\b[^}]*\\}\\s*from\\s*["']${record.source}["']`,
  );
  return briefFolders(root).filter((brief) =>
    sourceFiles(join(root, brief, "src")).some((path) => named.test(readFileSync(path, "utf8"))),
  );
}

/** The app's moves that pass the gate and are used by two or more briefs, by id. */
export function candidatesOf(
  root: string,
  all: readonly { readonly record: MoveRecord; readonly move: CheckedMove }[],
): readonly Candidate[] {
  const found: Candidate[] = [];
  for (const entry of all) {
    const { record, move } = entry;
    const { file } = record;
    if (file === undefined) continue;
    if (checkCatalog(all, [entry]).length > 0 || checkMove(move).length > 0) continue;
    const importers = importersOf(root, file);
    const briefs = [...new Set(importers.map((path) => relative(root, path).split(sep)[0] ?? ""))];
    if (briefs.length >= 2) found.push({ id: record.id, file, importers, briefs });
  }
  return found.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
}

/** What `motion:moves` prints: the `lines`, and the exit `code`, 1 on a finding. */
export interface CatalogRun {
  readonly lines: readonly string[];
  readonly code: 0 | 1;
}

const MOST_ROWS = 10;

/** The few lines a bare `motion:moves` prints: how many moves, from where, and what to ask. */
export function summarize(records: readonly MoveRecord[]): readonly string[] {
  const count = (names: readonly string[]) =>
    names.map((name) => `${name} ${records.filter((record) => record.source === name).length}`);
  const sources = [...new Set(records.map(({ source }) => source))].sort();
  const roles = MOVE_ROLES.map(
    (role) => `${role} ${records.filter((record) => record.role === role).length}`,
  );
  const sample = records[0]?.id ?? "drop";
  return [
    `${records.length} moves from ${sources.length} sources. Ask for the few you need; nothing here lists them all.`,
    `roles: ${roles.join(", ")}`,
    `sources: ${count(sources).join(", ")}`,
    `qualities for --like: ${Object.keys(QUALITIES).join(", ")}`,
    "npm run motion:moves -- --role enter --like heavy      (the entrances that feel heavy)",
    "npm run motion:moves -- --find squash --fields scale    (words in an id, a description or an option)",
    `npm run motion:moves -- --near ${sample}      (moves that move like one; --far for the opposite)`,
    "npm run motion:moves -- <id>                  (one move in full: options, descriptors, importers)",
    "add --in <brief> for imports that resolve from that brief, --all to lift the 10-row cap.",
    PARTS_HINT,
  ];
}

/** Runs the command for parsed arguments and an app root: the lines to print and the exit code. */
export async function runCatalog(
  args: Extract<CatalogArgs, { kind: "ok" }>,
  root: string,
  options: CatalogOptions = {},
): Promise<CatalogRun> {
  if (args.parts) return { lines: formatParts(), code: 0 };
  const { entries, problems } = await loadCatalog(root, options);
  const all = entries;
  const records = all.map(({ record }) => record);
  const problemCode = problems.length === 0 ? 0 : 1;
  if (args.candidates) {
    const found = candidatesOf(root, all);
    return {
      lines: found.length === 0 ? ["No candidates."] : found.map(formatCandidate),
      code: problemCode,
    };
  }
  const request: CatalogQuery = {
    ...(args.role === undefined ? {} : { role: args.role }),
    ...(args.find === undefined ? {} : { find: args.find }),
    ...(args.fields === undefined ? {} : { fields: args.fields }),
    ...(args.like === undefined ? {} : { like: args.like }),
    ...(args.near === undefined ? {} : { near: args.near }),
    ...(args.far === undefined ? {} : { far: args.far }),
    ...(args.in === undefined ? {} : { in: args.in }),
    ...(args.all ? { all: true } : {}),
  };
  let selected = all;
  let rows: readonly QueryRow[] = [];
  if (args.id !== undefined) {
    const named = lookup(records, args.id).filter(
      (record) => args.role === undefined || record.role === args.role,
    );
    const sources = new Set(named.map(({ source }) => source));
    if (named.length === 0)
      return {
        lines: [`No move "${args.id}". Known: ${records.map(({ id }) => id).join(", ")}.`],
        code: 1,
      };
    if (sources.size > 1 && !args.check)
      return {
        lines: [
          `${args.id} is declared in ${[...sources].map((source) => `${source}/${args.id}`).join(" and ")}. Ask with source/id.`,
        ],
        code: 1,
      };
    selected = all.filter(({ record }) => named.includes(record));
  } else if (isQuery(request)) {
    const found = query(records, request);
    if (found.kind === "refused") return { lines: [found.message], code: 1 };
    rows = found.rows;
    selected = rows.flatMap(({ record }) => all.filter((entry) => entry.record === record));
  }
  if (args.check) {
    const findings = [
      ...problems,
      ...checkCatalog(all, selected, {
        root,
        ...(options.baseline === undefined ? {} : { baseline: options.baseline }),
      }),
    ];
    const lines = args.json
      ? [JSON.stringify({ ok: findings.length === 0, findings })]
      : findings.length === 0
        ? [`ok: ${selected.length} moves pass.`]
        : findings;
    return { lines, code: findings.length === 0 ? 0 : 1 };
  }
  if (args.json)
    return {
      lines: [
        JSON.stringify(
          selected.map(({ record }) => record),
          (_key, value: unknown) => (typeof value === "function" ? inputText(value) : value),
        ),
      ],
      code: problemCode,
    };
  if (args.id !== undefined)
    return {
      lines: [
        ...selected.flatMap(({ record }) =>
          formatFull(record, {
            importedBy: briefsImporting(root, record),
            importText: importLine(record, root, args.in),
          }),
        ),
        ...problems,
      ],
      code: problemCode,
    };
  if (!isQuery(request)) return { lines: [...summarize(records), ...problems], code: problemCode };
  const shownRows = args.all || rows.length <= MOST_ROWS ? rows : rows.slice(0, MOST_ROWS - 1);
  const more =
    shownRows.length < rows.length
      ? [`${rows.length - shownRows.length} more; --all lists them.`]
      : [];
  return {
    lines: [...shownRows.map((row) => formatRow(row, root, args.in)), ...more, ...problems],
    code: problemCode,
  };
}
