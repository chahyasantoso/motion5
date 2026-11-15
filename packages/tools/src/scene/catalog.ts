import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as builtIns from "@gerak/moves";
import {
  DESCRIPTOR_KEYS,
  MOVE_ROLES,
  QUALITIES,
  outsideRanges,
  qualityOf,
  valueField,
  type DescriptorRanges,
  type Descriptors,
  type MoveRole,
  type OptionField,
  type StyleCard,
} from "@gerak/moves";
import { unreachable } from "../page/unreachable";
import { briefFolders, sourceFiles } from "./briefs";
import { qualityNames, rangesOf, styleCards } from "./cards";
import {
  checkMove,
  describeFinding,
  descriptorsOf,
  isMove,
  type CheckedMove,
  type MoveDescriptors,
} from "./moves";
import { intentsOf, readDesign } from "./design";
import {
  PART_GROUPS,
  formatParts,
  localParts,
  moveParts,
  partSample,
  partsImportedBy,
} from "./parts";

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
  /** How many findings the move gate has on it; 0 passes. */
  readonly findings: number;
}

/** The usage line of `gerak moves`. */
export const CATALOG_USAGE =
  "usage: gerak moves [<id>] [--role <role>] [--find <words>] [--fields a,b] [--like <quality>] [--renderer <dom|three>] [--move <field>[:<quality>]]... [--uses <kind|part>,...] [--design <file> --target <name>] [--style <brief>] [--near <id>] [--far <id>] [--in <brief>] [--all] [--check] [--json] [--parts] [--anatomy] [--candidates] [--root dir]";

/** The line a plain listing ends with, pointing at the building blocks. */
export const PARTS_HINT =
  "npx gerak moves --parts lists the building blocks moves are made from: fields, time, laws, blends, paths, follow-through, events, randomness, camera, compose.";

/** Parsed `gerak moves` arguments; or the usage text. */
export type CatalogArgs =
  | { readonly kind: "usage"; readonly message: string }
  | {
      readonly kind: "ok";
      readonly id: string | undefined;
      readonly role: MoveRole | undefined;
      readonly find: readonly string[] | undefined;
      readonly fields: readonly string[] | undefined;
      readonly like: string | undefined;
      readonly renderer: RendererName | undefined;
      readonly move: readonly string[];
      readonly uses: readonly string[] | undefined;
      readonly design: string | undefined;
      readonly style: string | undefined;
      readonly target: string | undefined;
      readonly near: string | undefined;
      readonly far: string | undefined;
      readonly in: string | undefined;
      readonly all: boolean;
      readonly check: boolean;
      readonly json: boolean;
      readonly parts: boolean;
      readonly anatomy: boolean;
      readonly candidates: boolean;
      readonly root: string | undefined;
    };

/** The renderers `--renderer` names: the DOM, and Three.js at 2D. */
export const RENDERER_NAMES = ["dom", "three"] as const;

/** A renderer `--renderer` knows. */
export type RendererName = (typeof RENDERER_NAMES)[number];

const VALUE_FLAGS = [
  "--role",
  "--root",
  "--find",
  "--fields",
  "--like",
  "--renderer",
  "--move",
  "--uses",
  "--design",
  "--style",
  "--target",
  "--near",
  "--far",
  "--in",
];

/** The id, query flags, mode flags and app root typed on the command line, or the usage text. */
export function parseCatalogArgs(argv: readonly string[]): CatalogArgs {
  const usage = (message: string): CatalogArgs => ({ kind: "usage", message });
  const ids: string[] = [];
  const values = new Map<string, string>();
  const moves: string[] = [];
  const on = new Set<string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) break;
    if (["--check", "--json", "--parts", "--anatomy", "--candidates", "--all"].includes(arg))
      on.add(arg);
    else if (VALUE_FLAGS.includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--"))
        return usage(`${arg} needs a value. ${CATALOG_USAGE}`);
      if (arg === "--move") moves.push(value);
      else values.set(arg, value);
      i += 1;
    } else if (arg.startsWith("--")) return usage(`Unknown flag ${arg}. ${CATALOG_USAGE}`);
    else ids.push(arg);
  }
  if (ids.length > 1) return usage(`Expected at most one move id. ${CATALOG_USAGE}`);
  const role = values.get("--role");
  const known = MOVE_ROLES.find((candidate) => candidate === role);
  if (role !== undefined && known === undefined)
    return usage(`Unknown role "${role}". Roles: ${MOVE_ROLES.join(", ")}.`);
  const renderer = values.get("--renderer");
  const knownRenderer = RENDERER_NAMES.find((candidate) => candidate === renderer);
  if (renderer !== undefined && knownRenderer === undefined)
    return usage(`Unknown renderer "${renderer}". Renderers: ${RENDERER_NAMES.join(", ")}.`);
  if (values.has("--design") !== values.has("--target"))
    return usage(`--design and --target go together: --design <file> --target <name>.`);
  if (values.has("--style") && !on.has("--anatomy") && !values.has("--design"))
    return usage(`--style goes with --anatomy or --design. ${CATALOG_USAGE}`);
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
    renderer: knownRenderer,
    move: moves,
    uses: list("--uses"),
    design: values.get("--design"),
    style: values.get("--style"),
    target: values.get("--target"),
    near: values.get("--near"),
    far: values.get("--far"),
    in: values.get("--in"),
    all: on.has("--all"),
    check: on.has("--check"),
    json: on.has("--json"),
    parts: on.has("--parts"),
    anatomy: on.has("--anatomy"),
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

/** The text of every `.ts` file under a folder, in path order; nothing when there is no such folder. */
function folderText(folder: string): string {
  if (!existsSync(folder)) return "";
  return readdirSync(folder, { withFileTypes: true })
    .map((entry) => join(folder, entry.name))
    .sort()
    .map((path) =>
      path.endsWith(".ts") ? `${path}\n${readFileSync(path, "utf8")}` : folderText(path),
    )
    .join("\n");
}

let engine: string | undefined;

/** The code a record's measures come from: `@gerak/moves`'s source (its parts, fields and moves) and the
 * catalog's own sampling; a change to either makes every cached record stale. */
export function engineHash(): string {
  engine ??= digest(
    [
      folderText(fileURLToPath(new URL("../../../moves/src/", import.meta.url))),
      readText(BUILT_IN_MANIFEST) ?? "",
      ...["catalog.ts", "moves.ts", "parts.ts", "limits.ts"].map(
        (file) => readText(fileURLToPath(new URL(`./${file}`, import.meta.url))) ?? "",
      ),
    ].join("\n"),
  );
  return engine;
}

/** What a move's cached record is keyed by: its folder's files (a helper beside it included), or its package's
 * version. */
function hashOf(name: string, loaded: LoadedModule): string {
  if (loaded.file !== undefined)
    return digest(`${readFileSync(loaded.file, "utf8")}\n${folderText(dirname(loaded.file))}`);
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
    findings: checkMove(move).length,
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
    typeof Reflect.get(value, "findings") === "number" &&
    typeof Reflect.get(value, "options") === "object" &&
    typeof Reflect.get(value, "example") === "object"
  );
}

const INDEX_VERSION = 3;

/** Where a root keeps its index of records. */
export function indexPath(root: string): string {
  return join(root, "node_modules", ".cache", "gerak", "moves.json");
}

interface IndexEntry {
  readonly hash: string;
  readonly record: MoveRecord;
}

function readIndex(text: string | undefined, engine: string): ReadonlyMap<string, IndexEntry> {
  const entries = new Map<string, IndexEntry>();
  if (text === undefined) return entries;
  try {
    const parsed = recordOf(JSON.parse(text));
    const moves = recordOf(parsed?.moves);
    if (parsed?.version !== INDEX_VERSION || parsed.engine !== engine || moves === undefined)
      return entries;
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
  /** What the cached records were measured by; `engineHash()` when left out. */
  readonly engine?: string;
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
  const measuredBy = options.engine ?? engineHash();
  const previous = readIndex(before, measuredBy);
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
    { version: INDEX_VERSION, engine: measuredBy, moves: Object.fromEntries(next) },
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

/** A descriptor as distances weigh it: rings count in quarters. */
const weighed = (key: (typeof DESCRIPTOR_KEYS)[number], value: number): number =>
  key === "rings" ? value / 4 : value;

function shapeDistance(left: Descriptors, right: Descriptors): number {
  return DESCRIPTOR_KEYS.reduce(
    (total, key) => total + (weighed(key, left[key]) - weighed(key, right[key])) ** 2,
    0,
  );
}

/** How far two moves are apart: the mean over the fields either moves of the squared shape difference,
 * or 1 where only one moves the field. Undefined when neither moves a field. */
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

const roundTo = (value: number): number => Math.round(value * 100) / 100;

/** The mean squared distance of a shape's named descriptors outside a quality's ranges, rings weighed by a
 * quarter: 0 when every one is inside. */
function meanDistanceOutside(shape: Descriptors, ranges: DescriptorRanges): number {
  const named = DESCRIPTOR_KEYS.filter((key) => ranges[key] !== undefined);
  const total = named.reduce((sum, key) => {
    const range = ranges[key];
    if (range === undefined) return sum;
    const value = weighed(key, shape[key]);
    const [low, high] = [weighed(key, range[0]), weighed(key, range[1])];
    const off = value < low ? low - value : value > high ? value - high : 0;
    return sum + off ** 2;
  }, 0);
  return named.length === 0 ? 0 : total / named.length;
}

const labelOf = (request: FieldRequest): string =>
  request.quality === undefined ? request.field : `${request.field}:${request.quality}`;

/** The fit of each requested field to the shapes of one option set, with a note per field. */
function fieldsFit(
  shapes: Readonly<Record<string, Descriptors>>,
  requests: readonly FieldRequest[],
  cards: readonly StyleCard[],
): {
  readonly fit: number;
  readonly centred: number;
  readonly hasAll: boolean;
  readonly movesAny: boolean;
  readonly notes: readonly string[];
} {
  const notes: string[] = [];
  let total = 0;
  let centred = 0;
  let hasAll = true;
  let movesAny = false;
  for (const request of requests) {
    const shape = new Map(Object.entries(shapes)).get(request.field);
    if (shape === undefined) {
      total += 1;
      hasAll = false;
      notes.push(`✗ ${labelOf(request)} (${request.field} not moved)`);
      continue;
    }
    movesAny = true;
    const ranges = request.quality === undefined ? undefined : rangesOf(request.quality, cards);
    if (ranges === undefined) {
      notes.push(`✓ ${labelOf(request)} (moved)`);
      continue;
    }
    total += meanDistanceOutside(shape, ranges);
    const named = DESCRIPTOR_KEYS.filter((key) => ranges[key] !== undefined).length;
    centred += named === 0 ? 0 : distanceToMiddle(shape, ranges) / named;
    const outside = outsideRanges(shape, ranges);
    notes.push(
      outside.length === 0
        ? `✓ ${labelOf(request)} (${DESCRIPTOR_KEYS.filter((key) => ranges[key] !== undefined)
            .map((key) => `${key} ${roundTo(shape[key])}`)
            .join(", ")})`
        : `✗ ${labelOf(request)} (${outside
            .map(
              ({ key, value, range }) =>
                `${key} ${roundTo(value)} outside ${range[0]}..${range[1]}`,
            )
            .join(", ")})`,
    );
  }
  const count = Math.max(1, requests.length);
  return { fit: total / count, centred: centred / count, hasAll, movesAny, notes };
}

/** The label of the move that answers one requested field, moved and inside its quality, or none. */
function bestFor(
  records: readonly MoveRecord[],
  field: FieldRequest,
  shared: ReadonlySet<string>,
): string | undefined {
  let best: { readonly record: MoveRecord; readonly fit: DesignFit } | undefined;
  for (const record of records) {
    const { fit } = designFit(record, { fields: [field], uses: [] });
    if (!fits(fit)) continue;
    if (
      best === undefined ||
      fit.fieldFit < best.fit.fieldFit ||
      (fit.fieldFit === best.fit.fieldFit && fit.centred < best.fit.centred) ||
      (fit.fieldFit === best.fit.fieldFit &&
        fit.centred === best.fit.centred &&
        byId(record, best.record) < 0)
    )
      best = { record, fit };
  }
  if (best === undefined) return undefined;
  return shared.has(best.record.id) ? `${best.record.source}/${best.record.id}` : best.record.id;
}

/** The options an option set changes from the example's, as `name=value` text. */
function changedOptions(record: MoveRecord, options: Readonly<Record<string, unknown>>): string {
  const example = new Map(Object.entries(record.example.options));
  return Object.entries(options)
    .filter(([name, value]) => example.get(name) !== value)
    .map(([name, value]) => `${name}=${String(value)}`)
    .join(", ");
}

/** The parts of a kind or by name that a move's file imports; none when the move imports no such part. */
function importedFor(record: MoveRecord, use: string): readonly string[] {
  return moveParts()
    .filter((part) => (part.group === use || part.name === use) && record.parts.includes(part.name))
    .map(({ name }) => name);
}

/** How a move answers a design at its best option set: the example, or the set that fits most closely. */
function designFit(
  record: MoveRecord,
  design: DesignRequest,
): { readonly fit: DesignFit; readonly notes: readonly string[] } {
  const sets =
    record.shapesAt.length > 0
      ? record.shapesAt
      : [
          {
            options: Object.fromEntries(Object.entries(record.example.options)),
            shapes: record.shapes,
          },
        ];
  // The example answers when it fits; another option set only when it fits more closely.
  let best: { readonly at: string; readonly found: ReturnType<typeof fieldsFit> } = {
    at: "",
    found: fieldsFit(record.shapes, design.fields, design.cards ?? []),
  };
  for (const set of sets) {
    const found = fieldsFit(set.shapes, design.fields, design.cards ?? []);
    if (found.fit < best.found.fit) best = { at: changedOptions(record, set.options), found };
  }
  const { found } = best;
  const used = design.uses.map((use) => ({ use, imports: importedFor(record, use) }));
  const usesFit =
    design.uses.length === 0
      ? 0
      : used.filter(({ imports }) => imports.length > 0).length / design.uses.length;
  return {
    fit: {
      fieldFit: found.fit,
      centred: found.centred,
      usesFit,
      hasAll: found.hasAll,
      movesAny: found.movesAny,
    },
    notes: [
      ...found.notes,
      ...used.map(({ use, imports }) =>
        imports.length > 0
          ? `✓ uses ${use} (${imports.join(", ")})`
          : `✗ uses ${use} (imports none)`,
      ),
      ...(best.at === "" ? [] : [`at ${best.at}`]),
    ],
  };
}

/** The first thing wrong with a design request: an unknown quality, field or use, named; none when sound. */
function refusalOf(design: DesignRequest): string | undefined {
  for (const request of design.fields) {
    const known =
      valueField(request.field) !== undefined ||
      (request.field.startsWith("custom.") && request.field.length > "custom.".length);
    if (!known)
      return `design: unknown field "${request.field}". Fields: ${Object.values(FIELD_GROUPS).flat().join(", ")}, or custom.<name>.`;
    if (
      request.quality !== undefined &&
      rangesOf(request.quality, design.cards ?? []) === undefined
    )
      return `design: unknown quality "${request.quality}" for ${request.field}. Qualities: ${qualityNames(design.cards ?? []).join(", ")}.`;
  }
  const parts = moveParts();
  for (const use of design.uses)
    if (!parts.some((part) => part.group === use || part.name === use))
      return `--uses: "${use}" is neither a kind nor a part. Kinds: ${PART_GROUPS.join(", ")}.`;
  return undefined;
}

/** What one search asks of the records; every field given must hold. */
export interface CatalogQuery {
  readonly role?: MoveRole;
  readonly find?: readonly string[];
  readonly fields?: readonly string[];
  readonly like?: string;
  /** Keeps a move whose every field this says a renderer writes. */
  readonly writes?: (field: string) => boolean;
  readonly near?: string;
  readonly far?: string;
  readonly in?: string;
  readonly all?: boolean;
  /** Keeps the moves the gate has findings on, which a search leaves out unless `all` is set. */
  readonly withFindings?: boolean;
  /** Ranks the moves by how well they answer a design. */
  readonly design?: DesignRequest;
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
  /** What a design asked of the move, each with a tick or a cross and the value that decided it. */
  readonly notes: readonly string[];
  /** How the move fits a design, when the search made one. */
  readonly design?: DesignFit;
}

/** One field a design asks for, and the quality its motion should have. */
export interface FieldRequest {
  readonly field: string;
  readonly quality?: string;
}

/** What a design asks of a move: fields with their qualities, and the kinds or parts it should use. */
export interface DesignRequest {
  readonly fields: readonly FieldRequest[];
  readonly uses: readonly string[];
  /** The style cards a quality may name as `<brief>/<name>`. */
  readonly cards?: readonly StyleCard[];
  /** The brief whose moves come first among equal fits. */
  readonly style?: string;
}

/** How well a move answers a design, as its best option set shows. */
export interface DesignFit {
  /** The mean over the requested fields of 0 to 1 (1 for a field not moved); least first. */
  readonly fieldFit: number;
  /** How near the middle of each quality its fields sit, for moves that fit equally; least first. */
  readonly centred: number;
  /** The share of the requested uses the move's file imports. */
  readonly usesFit: number;
  /** Whether the move moves every requested field in that option set. */
  readonly hasAll: boolean;
  /** Whether it moves at least one requested field in that option set. */
  readonly movesAny: boolean;
}

/** Whether a move answers a design: it moves every requested field, each inside its quality. */
export function fits(fit: DesignFit): boolean {
  return fit.hasAll && fit.fieldFit === 0;
}

/** What a search returned, or why it could not be made. */
export type QueryResult =
  | {
      readonly kind: "rows";
      readonly rows: readonly QueryRow[];
      /** How many moves that fit were left out for their findings. */
      readonly held: number;
      /** Whether a design was asked and no move that has every field comes close to it. */
      readonly noFit: boolean;
      /** With no fit, the move that comes closest for each requested field alone, if any comes close. */
      readonly combine: readonly { readonly field: string; readonly move: string | undefined }[];
    }
  | { readonly kind: "refused"; readonly message: string };

/** Whether a request asks anything: a filter, a ranking or `--all`. */
export function isQuery(request: CatalogQuery): boolean {
  return (
    request.role !== undefined ||
    request.find !== undefined ||
    request.fields !== undefined ||
    request.like !== undefined ||
    request.writes !== undefined ||
    request.design !== undefined ||
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
  const ranges = request.like === undefined ? undefined : qualityOf(request.like);
  if (request.like !== undefined && ranges === undefined)
    return refused(
      `--like: unknown quality "${request.like}". Qualities: ${Object.keys(QUALITIES).join(", ")}.`,
    );
  const { design } = request;
  const problem = design === undefined ? undefined : refusalOf(design);
  if (problem !== undefined) return refused(problem);
  const ranked =
    near !== undefined || far !== undefined || ranges !== undefined || design !== undefined;
  const shared = new Set(
    records.filter((record) => lookup(records, record.id).length > 1).map(({ id }) => id),
  );
  const rows: { row: QueryRow; hits: number }[] = [];
  let held = 0;
  for (const record of records) {
    if (request.role !== undefined && record.role !== request.role) continue;
    if (request.fields?.some((field) => !record.fields.includes(field)) === true) continue;
    const hits = request.find === undefined ? 0 : matchesWords(record, request.find);
    if (hits === undefined) continue;
    const { writes } = request;
    if (writes !== undefined && !record.fields.every((field) => writes(field))) continue;
    const matched = ranges === undefined ? undefined : fieldWith(record, ranges);
    if (ranges !== undefined && matched === undefined) continue;
    const answer = design === undefined ? undefined : designFit(record, design);
    if (design !== undefined && answer !== undefined) {
      const moves = design.fields.length > 0 && answer.fit.movesAny;
      const uses = design.uses.length > 0 && answer.fit.usesFit > 0;
      if (!moves && !uses) continue;
    }
    let fit: number | undefined;
    if (ranked) {
      const parts = [
        near === undefined || near === record ? 0 : distance(record, near),
        far === undefined || far === record ? 0 : distance(record, far),
        matched?.fit ?? 0,
      ];
      if (record === near || record === far || parts.some((part) => part === undefined)) continue;
      fit =
        (parts[0] ?? 0) -
        (far === undefined ? 0 : (parts[1] ?? 0)) +
        (parts[2] ?? 0) +
        (answer?.fit.fieldFit ?? 0);
    }
    if (record.findings > 0 && request.all !== true && request.withFindings !== true) {
      held += 1;
      continue;
    }
    rows.push({
      hits,
      row: {
        record,
        own: request.in !== undefined && record.file !== undefined && record.source === request.in,
        label: shared.has(record.id) ? `${record.source}/${record.id}` : record.id,
        fit,
        ...(matched === undefined ? {} : { field: matched.field }),
        notes: answer?.notes ?? [],
        ...(answer === undefined ? {} : { design: answer.fit }),
      },
    });
  }
  rows.sort(
    (left, right) =>
      (left.row.fit ?? 0) - (right.row.fit ?? 0) ||
      Number(right.row.record.source === design?.style) -
        Number(left.row.record.source === design?.style) ||
      (right.row.design?.usesFit ?? 0) - (left.row.design?.usesFit ?? 0) ||
      (left.row.design?.centred ?? 0) - (right.row.design?.centred ?? 0) ||
      right.hits - left.hits ||
      byId(left.row.record, right.row.record),
  );
  const noFit =
    design !== undefined && !rows.some(({ row }) => row.design !== undefined && fits(row.design));
  const combine =
    design === undefined || !noFit
      ? []
      : design.fields.map((field) => ({
          field: labelOf(field),
          move: bestFor(
            records.filter((record) => record.findings === 0 || request.all === true),
            field,
            shared,
          ),
        }));
  return { kind: "rows", rows: rows.map(({ row }) => row), held, noFit, combine };
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

/** One line of a search: label, source, role, fields moved, whether the gate passes it, the first sentence, the import. */
export function formatRow(row: QueryRow, root: string, from: string | undefined): string {
  const { record } = row;
  return [
    row.label,
    row.own ? "own" : record.source,
    record.role,
    record.fields.length === 0 ? "none" : record.fields.join(","),
    record.findings === 0 ? "passes" : `${record.findings} findings`,
    ...(row.field === undefined ? [] : [`on ${row.field}`]),
    ...(row.notes.length === 0 ? [] : [row.notes.join("; ")]),
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
  context: {
    readonly importedBy: readonly string[];
    readonly importText: string;
    /** One line per renderer: the fields of the move it leaves unwritten, and why. */
    readonly unwritten: readonly string[];
  },
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
    ...context.unwritten,
    `gate: ${record.findings === 0 ? "passes" : `${record.findings} findings; gerak moves ${record.id} --check names them`}`,
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

/** What `gerak moves` prints: the `lines`, and the exit `code`, 1 on a finding. */
export interface CatalogRun {
  readonly lines: readonly string[];
  readonly code: 0 | 1;
}

const MOST_ROWS = 10;

const withFindings = (count: number): string =>
  `${count} move${count === 1 ? "" : "s"} with findings`;

/** The few lines a bare `gerak moves` prints: how many moves, from where, and what to ask. */
export function summarize(records: readonly MoveRecord[]): readonly string[] {
  const count = (names: readonly string[]) =>
    names.map((name) => `${name} ${records.filter((record) => record.source === name).length}`);
  const sources = [...new Set(records.map(({ source }) => source))].sort();
  const roles = MOVE_ROLES.map(
    (role) => `${role} ${records.filter((record) => record.role === role).length}`,
  );
  const sample = records[0]?.id ?? "drop";
  const held = records.filter((record) => record.findings > 0).length;
  return [
    `${records.length} moves from ${sources.length} sources. Ask for the few you need; nothing here lists them all.`,
    `roles: ${roles.join(", ")}`,
    `sources: ${count(sources).join(", ")}`,
    `qualities for --like: ${Object.keys(QUALITIES).join(", ")}`,
    "npx gerak moves --role enter --like heavy      (the entrances that feel heavy)",
    "npx gerak moves --find squash --fields scale    (words in an id, a description or an option)",
    `npx gerak moves --near ${sample}      (moves that move like one; --far for the opposite)`,
    "npx gerak moves <id>                  (one move in full: options, descriptors, importers)",
    "npx gerak moves --move y:heavy --uses ease     (moves that answer a design; --design <file> --target <name> reads a piece's)",
    "npx gerak moves --anatomy             (the fields, parts and shape words a design is written in)",
    "add --in <brief> for imports that resolve from that brief, --all to lift the 10-row cap.",
    ...(held === 0 ? [] : [`${withFindings(held)}; every search leaves them out unless --all.`]),
    PARTS_HINT,
  ];
}

/** The fields grouped by what they change on the target; every field of the value table is in one group. */
export const FIELD_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  place: ["x", "y", "z"],
  turn: ["rotation", "rotationX", "rotationY", "skewX", "skewY"],
  size: ["scale", "scaleX", "scaleY", "scaleZ"],
  look: ["opacity", "blur", "shadowX", "shadowY", "shadowBlur"],
  colour: ["hue", "lightness", "tint"],
  reveal: [
    "drawn",
    "drawnFrom",
    "clipX",
    "clipY",
    "clipRadius",
    "clipWidth",
    "clipHeight",
    "shape",
  ],
  order: ["layer"],
});

const SHAPE_WORDS: Readonly<Record<(typeof DESCRIPTOR_KEYS)[number], string>> = Object.freeze({
  peak: "where in the run (0 to 1) the field moves fastest",
  overshoot: "how far it goes past where it is heading, as a share of the distance it had to go",
  rings: "how many times it crosses rest after the first crossing; a count",
  windup: "how far it first pulls away from where it is heading, as a share of the distance",
  settle: "the share of the run from its first arrival until it stays near its end",
});

/** What one renderer writes of a pose, and the fields it leaves alone with the reason for each. */
interface RendererTable {
  readonly name: string;
  readonly written: readonly string[];
  readonly unwritten: ReadonlyMap<string, string>;
}

function reasons(table: Readonly<Record<string, string | undefined>>): ReadonlyMap<string, string> {
  return new Map(
    Object.entries(table).flatMap(([field, why]) => (why === undefined ? [] : [[field, why]])),
  );
}

/** The renderers' own lists of written and unwritten fields: `dom`, `three 2d` and `three 3d`. */
async function rendererTables(): Promise<readonly RendererTable[]> {
  const [dom, three] = await Promise.all([import("@gerak/dom"), import("@gerak/three")]);
  return [
    { name: "dom", written: dom.WRITTEN, unwritten: reasons(dom.UNWRITTEN) },
    { name: "three 2d", written: three.WRITTEN_2D, unwritten: reasons(three.UNWRITTEN_2D) },
    { name: "three 3d", written: three.WRITTEN_3D, unwritten: reasons(three.UNWRITTEN_3D) },
  ];
}

/** Whether a renderer writes a field; a number a piece names is written by the DOM, as a style property. */
function writes(table: RendererTable, field: string): boolean {
  return field.startsWith("custom.") ? table.name === "dom" : table.written.includes(field);
}

/** The table `--renderer` names: the DOM's, or Three.js at 2D. */
function tableOf(
  tables: readonly RendererTable[],
  renderer: RendererName,
): RendererTable | undefined {
  return tables.find(({ name }) => name === (renderer === "dom" ? "dom" : "three 2d"));
}

/** One line per renderer: the fields of a move it leaves unwritten, each with the reason. */
function unwrittenLines(
  tables: readonly RendererTable[],
  fields: readonly string[],
): readonly string[] {
  return tables.map((table) => {
    const left = fields
      .filter((field) => !writes(table, field))
      .map((field) => `${field} (${table.unwritten.get(field) ?? "not written by this renderer"})`);
    return `unwritten by ${table.name}: ${left.length === 0 ? "none" : left.join("; ")}`;
  });
}

/** Numbers to 3 places, in any record or list. */
function plain(value: unknown): unknown {
  if (typeof value === "number") return Math.round(value * 1000) / 1000 || 0;
  if (Array.isArray(value)) return value.map(plain);
  if (typeof value === "object" && value !== null)
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, plain(inner)]));
  return value;
}

const plainList = (values: readonly unknown[]): readonly unknown[] => values.map(plain);

function showValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(showValue).join(", ")}]`;
  if (typeof value === "object" && value !== null)
    return `{${Object.entries(value)
      .map(([key, inner]) => `${key}: ${showValue(inner)}`)
      .join(", ")}}`;
  return String(value);
}

interface AnatomyField {
  readonly name: string;
  readonly group: string;
  readonly meaning: string;
  readonly unit: string;
  readonly dimension: string;
  readonly renderers: readonly string[];
}

/** The card an agent reads before it asks for moves: the fields, the parts, and the words the search uses. */
async function anatomyLines(
  json: boolean,
  root: string,
  style: StyleCard | undefined,
  moves: readonly string[],
): Promise<readonly string[]> {
  const tables = await rendererTables();
  const fields: AnatomyField[] = Object.entries(FIELD_GROUPS).flatMap(([group, names]) =>
    names.flatMap((name) => {
      const row = valueField(name);
      if (row === undefined) return [];
      return [
        {
          name,
          group,
          meaning: row.meaning,
          unit: row.unit,
          dimension: row.dimension,
          renderers: tables
            .filter((table) => writes(table, name))
            .map(({ name: renderer }) => renderer),
        },
      ];
    }),
  );
  const withSample = (
    part: {
      readonly name: string;
      readonly group: string;
      readonly call: string;
      readonly use: string;
    },
    source: string,
    value: unknown,
  ) => {
    const sample = partSample(value);
    return {
      name: part.name,
      group: part.group,
      call: part.call,
      use: part.use,
      source,
      ...(sample === undefined
        ? {}
        : { sample: { label: sample.label, values: plainList(sample.values) } }),
    };
  };
  const library = moveParts().map((part) =>
    withSample(part, "@gerak/moves", Reflect.get(builtIns, part.name)),
  );
  const local = (await localParts(root)).map((part) => withSample(part, part.source, part.value));
  const parts = [...library, ...local];
  const shapes = DESCRIPTOR_KEYS.map((name) => ({ name, meaning: SHAPE_WORDS[name] }));
  const qualities = Object.entries(QUALITIES).map(([name, ranges]) => ({ name, ranges }));
  if (json)
    return [
      JSON.stringify({
        ...(style === undefined ? {} : { style }),
        fields,
        parts,
        shapes,
        qualities,
      }),
    ];
  const merged: AnatomyField[][] = [];
  for (const field of fields) {
    const last = merged.at(-1);
    const head = last?.[0];
    if (
      last !== undefined &&
      head !== undefined &&
      head.group === field.group &&
      head.unit === field.unit &&
      head.dimension === field.dimension &&
      head.renderers.join() === field.renderers.join()
    )
      last.push(field);
    else merged.push([field]);
  }
  const fieldLines = merged.map((run) => {
    const [head] = run;
    return [
      head?.group ?? "",
      run.map(({ name }) => name).join(", "),
      `${head?.unit ?? ""}, ${head?.dimension ?? ""}`,
      (head?.renderers ?? []).join(", ") || "no renderer",
      run.map(({ meaning }) => meaning).join(" / "),
    ].join(" | ");
  });
  const partLine = (part: (typeof parts)[number]): string =>
    [
      part.group,
      part.call,
      part.use,
      ...("sample" in part
        ? [`${part.sample.label}: ${part.sample.values.map(showValue).join(", ")}`]
        : []),
    ].join(" | ");
  const localLines = [...new Set(local.map(({ source }) => source))].flatMap((source) => [
    `parts of ${source}:`,
    ...local.filter((part) => part.source === source).map(partLine),
  ]);
  const rangeText = (ranges: DescriptorRanges): string =>
    DESCRIPTOR_KEYS.flatMap((key) => {
      const range = ranges[key];
      return range === undefined ? [] : [`${key} ${range[0]}..${range[1]}`];
    }).join(", ");
  const styleLines =
    style === undefined
      ? []
      : [
          `style ${style.name}: ${style.description}`,
          `qualities: ${Object.entries(style.qualities)
            .map(([name, ranges]) => `${name} (${rangeText(ranges)})`)
            .join("; ")}`,
          `lively: ${Object.entries(style.lively)
            .map(([field, [low, high]]) => `${field} ${low} to ${high}`)
            .join(", ")}`,
          `tokens: ${Object.entries(style.tokens)
            .map(([name, value]) => `${name} ${value}`)
            .join(", ")}`,
          `habits: ${style.habits.join(" | ")}`,
          `parts of ${style.name}: ${local
            .filter((part) => part.source === style.name)
            .map(({ name }) => name)
            .join(", ")}`,
          `moves of ${style.name}: ${moves.join(", ")}`,
        ];
  return [
    ...styleLines,
    ...fieldLines,
    ...library.map(partLine),
    ...localLines,
    ...shapes.map(({ name, meaning }) => `shape | ${name} | ${meaning}`),
    ...qualities.map(({ name, ranges }) => `quality | ${name} | ${rangeText(ranges)}`),
  ];
}

/** The design a search asks, from `--move` and from the target of a `--design` file; or why it cannot. */
async function designOf(
  args: Extract<CatalogArgs, { kind: "ok" }>,
  root: string,
  cards: readonly StyleCard[],
): Promise<
  | { readonly kind: "ok"; readonly design: DesignRequest | undefined }
  | { readonly kind: "refused"; readonly message: string }
> {
  const fields: FieldRequest[] = args.move.map((spec) => {
    const at = spec.indexOf(":");
    return at < 0 ? { field: spec } : { field: spec.slice(0, at), quality: spec.slice(at + 1) };
  });
  let style = args.style;
  if (args.design !== undefined && args.target !== undefined) {
    const file = resolve(root, args.design);
    let module: unknown;
    try {
      module = await import(pathToFileURL(file).href);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { kind: "refused", message: `--design: ${file} could not be imported: ${message}` };
    }
    const read = readDesign(
      typeof module === "object" && module !== null ? Reflect.get(module, "design") : undefined,
    );
    if (read.kind === "refused") return { kind: "refused", message: `--design: ${read.reason}` };
    const own: unknown =
      typeof module === "object" && module !== null ? Reflect.get(module, "style") : undefined;
    if (style === undefined && typeof own === "string") style = own;
    if (!Object.hasOwn(read.design, args.target))
      return {
        kind: "refused",
        message: `--target: no target "${args.target}" in ${args.design}. Targets: ${Object.keys(read.design).join(", ")}.`,
      };
    for (const intent of intentsOf(read.design))
      if (
        intent.target === args.target &&
        !fields.some(({ field, quality }) => field === intent.field && quality === intent.quality)
      )
        fields.push({ field: intent.field, quality: intent.quality });
  }
  const uses = args.uses ?? [];
  return {
    kind: "ok",
    design:
      fields.length === 0 && uses.length === 0
        ? undefined
        : { fields, uses, cards, ...(style === undefined ? {} : { style }) },
  };
}

/** The answer when no move comes close: what was asked, the move for each field alone to combine in the
 * scene, and the command that makes one move for it all. */
function noFitLines(
  design: DesignRequest,
  brief: string | undefined,
  combine: readonly { readonly field: string; readonly move: string | undefined }[],
): readonly string[] {
  const asked = [
    design.fields.length === 0 ? "" : `fields ${design.fields.map(labelOf).join(", ")}`,
    design.uses.length === 0 ? "" : `uses ${design.uses.join(", ")}`,
  ].filter((part) => part !== "");
  return [
    "No move does this closely.",
    `asked: ${asked.join("; ")}`,
    ...(combine.length === 0
      ? []
      : [
          `combine in the scene: ${combine
            .map(({ field, move }) => `${field} by ${move ?? "no move; write it"}`)
            .join("; ")}`,
        ]),
    `or write one: npx gerak new --move <id> --in ${brief ?? "<brief>"}`,
  ];
}

/** Runs the command for parsed arguments and an app root: the lines to print and the exit code. */
export async function runCatalog(
  args: Extract<CatalogArgs, { kind: "ok" }>,
  root: string,
  options: CatalogOptions = {},
): Promise<CatalogRun> {
  if (args.parts) return { lines: formatParts(), code: 0 };
  const { cards } = await styleCards(root);
  const style =
    args.style === undefined ? undefined : cards.find((card) => card.name === args.style);
  if (args.style !== undefined && style === undefined)
    return {
      lines: [
        `--style: "${args.style}" has no style card. The cards are ${cards.map((card) => card.name).join(", ") || "none"}.`,
      ],
      code: 1,
    };
  if (args.anatomy) {
    const made = style === undefined ? [] : (await loadCatalog(root, options)).entries;
    const moves = made
      .filter(({ record }) => record.source === style?.name)
      .map(({ record }) => record.id);
    return { lines: await anatomyLines(args.json, root, style, moves), code: 0 };
  }
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
  const asked = await designOf(args, root, cards);
  if (asked.kind === "refused") return { lines: [asked.message], code: 1 };
  const tables = await rendererTables();
  const renderer = args.renderer === undefined ? undefined : tableOf(tables, args.renderer);
  const request: CatalogQuery = {
    ...(args.role === undefined ? {} : { role: args.role }),
    ...(args.find === undefined ? {} : { find: args.find }),
    ...(args.fields === undefined ? {} : { fields: args.fields }),
    ...(args.like === undefined ? {} : { like: args.like }),
    ...(renderer === undefined ? {} : { writes: (field: string) => writes(renderer, field) }),
    ...(asked.design === undefined ? {} : { design: asked.design }),
    ...(args.near === undefined ? {} : { near: args.near }),
    ...(args.far === undefined ? {} : { far: args.far }),
    ...(args.in === undefined ? {} : { in: args.in }),
    ...(args.all ? { all: true } : {}),
    ...(args.check ? { withFindings: true } : {}),
  };
  let noFit = false;
  let combine: readonly { readonly field: string; readonly move: string | undefined }[] = [];
  let held = 0;
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
    held = found.held;
    noFit = found.noFit;
    combine = found.combine;
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
            unwritten: unwrittenLines(tables, record.fields),
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
  if (noFit && asked.design !== undefined && !args.check && !args.json)
    return {
      lines: [
        ...noFitLines(asked.design, args.in, combine),
        ...(rows.length === 0 ? [] : ["nearest, each missing something:"]),
        ...rows.slice(0, 3).map((row) => formatRow(row, root, args.in)),
      ],
      code: problemCode,
    };
  const left = held === 0 ? [] : [`${withFindings(held)} left out; --all lists them.`];
  return {
    lines: [
      ...shownRows.map((row) => formatRow(row, root, args.in)),
      ...more,
      ...left,
      ...problems,
    ],
    code: problemCode,
  };
}
