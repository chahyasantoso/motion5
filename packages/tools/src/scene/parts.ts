import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import * as moves from "@gerak/moves";
import { unreachable } from "../page/unreachable";
import { valueField } from "@gerak/core";
import { partContract, type PartContract } from "@gerak/moves";
import { briefFolders } from "./briefs";

/** The groups the parts list sorts its building blocks into, in print order. */
export const PART_GROUPS = [
  "time",
  "ease",
  "envelope",
  "oscillation",
  "dynamics",
  "path",
  "geometry",
  "blend",
  "coupling",
  "signal",
  "utility",
  "fields",
  "compose",
] as const;

/** One group of `@gerak/moves` building blocks that are not moves, named by the folder that declares them;
 * groups print in this order. */
export type PartGroup = (typeof PART_GROUPS)[number];

/** One building block of `@gerak/moves`: its export name, its call shape and what it is for. */
export interface MovePart {
  readonly name: string;
  readonly group: PartGroup;
  readonly call: string;
  readonly use: string;
}

const SIBLING_ENTRY = fileURLToPath(new URL("../../../moves/src/index.ts", import.meta.url));
const cache = new Map<string, readonly MovePart[]>();

function entryPath(): string {
  if (existsSync(SIBLING_ENTRY)) return SIBLING_ENTRY;
  const found = ts.resolveModuleName(
    "@gerak/moves",
    fileURLToPath(import.meta.url),
    { moduleResolution: ts.ModuleResolutionKind.Bundler },
    ts.sys,
  ).resolvedModule;
  if (found === undefined) throw new Error("moveParts: cannot find @gerak/moves");
  return found.resolvedFileName;
}

function isGroup(name: string): name is PartGroup {
  return PART_GROUPS.some((group) => group === name);
}

/** The group the declaring file belongs to, from its folder under the entry's folder; undefined for a
 * file that holds no building blocks. */
function groupOf(file: string, entryDir: string): PartGroup | undefined {
  const [top, second] = relative(entryDir, file).split(sep);
  if (top === undefined || second === undefined) return undefined;
  if (top === "moves" || top === "style") return undefined;
  if (top === "fields" || top === "compose") return top;
  if (top !== "parts") throw new Error(`moveParts: folder "${top}" is not a parts group`);
  if (relative(entryDir, file).split(sep).length < 3) return undefined;
  if (!isGroup(second)) throw new Error(`moveParts: folder "parts/${second}" is not a parts group`);
  return second;
}

function signatureOf(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  at: ts.Node,
): ts.Signature | undefined {
  return checker.getTypeOfSymbolAtLocation(symbol, at).getCallSignatures()[0];
}

function parametersOf(signature: ts.Signature): string {
  return signature
    .getParameters()
    .map((parameter) => {
      const declaration = parameter.valueDeclaration;
      const optional =
        declaration !== undefined &&
        ts.isParameter(declaration) &&
        (declaration.questionToken !== undefined || declaration.initializer !== undefined);
      const rest =
        declaration !== undefined &&
        ts.isParameter(declaration) &&
        declaration.dotDotDotToken !== undefined;
      const name = /^__\d+$/.test(parameter.name) ? "options" : parameter.name;
      return `${rest ? "..." : ""}${name}${optional ? "?" : ""}`;
    })
    .join(", ");
}

function firstSentence(doc: string): string {
  const flat = doc.replace(/\s+/g, " ").trim();
  const end = flat.search(/[.!?](?:\s|$)/);
  return end === -1 ? flat : flat.slice(0, end + 1);
}

/** Export names in the order the entry file lists them. */
function orderedNames(
  source: ts.SourceFile,
  checker: ts.TypeChecker,
  exported: readonly ts.Symbol[],
): readonly string[] {
  const names: string[] = [];
  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement)) continue;
    const clause = statement.exportClause;
    if (clause !== undefined && ts.isNamedExports(clause))
      for (const element of clause.elements) names.push(element.name.text);
    else if (statement.moduleSpecifier !== undefined) {
      const target = checker.getSymbolAtLocation(statement.moduleSpecifier);
      if (target !== undefined)
        for (const symbol of checker.getExportsOfModule(target)) names.push(symbol.name);
    }
  }
  for (const symbol of exported) names.push(symbol.name);
  return [...new Set(names)].filter((name) => exported.some((symbol) => symbol.name === name));
}

function partOf(
  name: string,
  exportedSymbol: ts.Symbol,
  checker: ts.TypeChecker,
  entryDir: string,
): MovePart | undefined {
  const symbol =
    (exportedSymbol.flags & ts.SymbolFlags.Alias) !== 0
      ? checker.getAliasedSymbol(exportedSymbol)
      : exportedSymbol;
  const declaration = symbol.valueDeclaration;
  if (declaration === undefined || (symbol.flags & ts.SymbolFlags.Class) !== 0) return undefined;
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const own = signatureOf(symbol, checker, declaration);
  const members = type.getProperties();
  const functionMembers = members.flatMap((member) => {
    const found = member.valueDeclaration ?? declaration;
    const signature = signatureOf(member, checker, found);
    return signature === undefined ? [] : [signature];
  });
  const isObjectOfFunctions =
    own === undefined && members.length > 0 && functionMembers.length === members.length;
  if (own === undefined && !isObjectOfFunctions) return undefined;
  const group = groupOf(declaration.getSourceFile().fileName, entryDir);
  if (group === undefined) return undefined;
  const doc = firstSentence(ts.displayPartsToString(symbol.getDocumentationComment(checker)));
  if (doc === "") throw new Error(`moveParts: ${name} is a building block with no doc comment`);
  const shape = own ?? functionMembers[0];
  if (shape === undefined) return undefined;
  const call =
    own === undefined
      ? `${name}.<name>(${parametersOf(shape)})`
      : `${name}(${parametersOf(shape)})`;
  return { name, group, call, use: doc };
}

function listParts(entry: string): readonly MovePart[] {
  const program = ts.createProgram([entry], {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  const module = source === undefined ? undefined : checker.getSymbolAtLocation(source);
  if (source === undefined || module === undefined)
    throw new Error(`moveParts: cannot read ${entry}`);
  const exported = checker.getExportsOfModule(module);
  const entryDir = dirname(entry);
  const parts = orderedNames(source, checker, exported).flatMap((name) => {
    const symbol = exported.find((candidate) => candidate.name === name);
    const part = symbol === undefined ? undefined : partOf(name, symbol, checker, entryDir);
    return part === undefined ? [] : [part];
  });
  return PART_GROUPS.flatMap((group) => parts.filter((part) => part.group === group));
}

/** The building blocks `@gerak/moves` exports from its fields, parts and compose folders, each with its
 * group, call and doc sentence; `entry` names another entry file. */
export function moveParts(entry: string = entryPath()): readonly MovePart[] {
  const cached = cache.get(entry);
  if (cached !== undefined) return cached;
  const parts = listParts(entry);
  cache.set(entry, parts);
  return parts;
}

/** The building blocks a source file imports by name, in the order it imports them; a type-only import
 * and a name that is not a building block are left out. */
export function partsImportedBy(
  text: string,
  parts: readonly MovePart[] = moveParts(),
): readonly string[] {
  const known = new Set(parts.map(({ name }) => name));
  const source = ts.createSourceFile("move.ts", text, ts.ScriptTarget.ES2022);
  const found: string[] = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (statement.importClause?.isTypeOnly === true) continue;
    if (bindings === undefined || !ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      const name = (element.propertyName ?? element.name).text;
      if (!element.isTypeOnly && known.has(name) && !found.includes(name)) found.push(name);
    }
  }
  return found;
}

const SAMPLE_STEPS = 100;
const NEAR = 1e-9;
const NEAR_PATH = 1e-6;
const SECONDS = [0, 0.5, 1, 3] as const;
const FOLDER_KINDS: readonly PartGroup[] = PART_GROUPS.filter(
  (group) => group !== "fields" && group !== "compose",
);

function show(value: unknown): string {
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function isNear(actual: unknown, expected: number, tolerance: number): boolean {
  return typeof actual === "number" && Math.abs(actual - expected) <= tolerance;
}

function isNearTurn(actual: unknown, expected: number): boolean {
  if (typeof actual !== "number") return false;
  const turn = (((actual - expected) % 360) + 360) % 360;
  return turn <= NEAR || 360 - turn <= NEAR;
}

/** Whether `actual` carries `expected` on every field `expected` names; numbers meet to 1e-9, and
 * modulo 360 for an angle. */
function matches(actual: unknown, expected: unknown, angle: boolean): boolean {
  if (typeof expected === "number")
    return angle ? isNearTurn(actual, expected) : isNear(actual, expected, NEAR);
  if (typeof expected === "object" && expected !== null) {
    if (typeof actual !== "object" || actual === null) return false;
    return Object.entries(expected).every(([key, value]) =>
      matches(Reflect.get(actual, key), value, angle),
    );
  }
  return actual === expected;
}

function poseOf(answer: unknown): Readonly<Record<string, unknown>> {
  if (typeof answer !== "object" || answer === null) return {};
  const inner: unknown = Reflect.get(answer, "pose");
  const pose = typeof inner === "object" && inner !== null ? inner : answer;
  return Object.fromEntries(Object.entries(pose));
}

function sampleFindings(contract: PartContract, name: string): readonly string[] {
  const out: string[] = [];
  const refuse = (index: number, what: string): void => {
    out.push(`${name}: sample ${index} ${what}`);
  };
  switch (contract.kind) {
    case "time":
    case "geometry":
    case "signal":
    case "utility":
      return out;
    case "ease":
    case "envelope":
    case "oscillation":
    case "dynamics":
    case "path":
    case "blend":
    case "coupling":
      if (contract.samples.length === 0)
        return [`${name}: has no samples, so its rule checks nothing`];
      break;
    default:
      return unreachable(contract);
  }
  switch (contract.kind) {
    case "ease":
      contract.samples.forEach(({ run }, index) => {
        for (let step = 0; step <= SAMPLE_STEPS; step += 1) {
          const value = run(step / SAMPLE_STEPS);
          if (!Number.isFinite(value))
            refuse(index, `is ${show(value)} at progress ${step / SAMPLE_STEPS}, not a number`);
        }
        const start = run(0);
        const end = run(1);
        if (!isNear(start, 0, NEAR)) refuse(index, `is ${show(start)} at progress 0, not 0`);
        if (!isNear(end, 1, NEAR)) refuse(index, `is ${show(end)} at progress 1, not 1`);
      });
      break;
    case "envelope":
      contract.samples.forEach(({ run, at0, at1 }, index) => {
        for (let step = 0; step <= SAMPLE_STEPS; step += 1) {
          const value = run(step / SAMPLE_STEPS);
          if (!(value >= 0))
            refuse(index, `is ${show(value)} at progress ${step / SAMPLE_STEPS}, below 0`);
        }
        const start = run(0);
        const end = run(1);
        if (!isNear(start, at0, NEAR)) refuse(index, `is ${show(start)} at progress 0, not ${at0}`);
        if (!isNear(end, at1, NEAR)) refuse(index, `is ${show(end)} at progress 1, not ${at1}`);
      });
      break;
    case "oscillation":
      contract.samples.forEach(({ run, bound }, index) => {
        for (let step = 0; step <= SAMPLE_STEPS; step += 1) {
          const value = run(step / SAMPLE_STEPS);
          if (!(Math.abs(value) <= bound + NEAR))
            refuse(index, `is ${show(value)} at progress ${step / SAMPLE_STEPS}, past ${bound}`);
        }
      });
      break;
    case "dynamics":
      contract.samples.forEach(({ run }, index) => {
        for (const seconds of SECONDS) {
          const state = run(seconds);
          if (!isNear(state.offset, 0, NEAR) || !isNear(state.speed, 0, NEAR))
            refuse(index, `is ${show(state)} at ${seconds} s from rest, not 0`);
        }
      });
      break;
    case "path":
      contract.samples.forEach(({ run, from, to }, index) => {
        if (Object.keys(from).length === 0 || Object.keys(to).length === 0)
          refuse(index, "names no key in from or to, so its ends are not checked");
        const start = run(0);
        const end = run(1);
        for (const [key, value] of Object.entries(from))
          if (!isNear(start[key], value, NEAR_PATH))
            refuse(index, `has ${key} ${show(start[key])} at progress 0, not ${value}`);
        for (const [key, value] of Object.entries(to))
          if (!isNear(end[key], value, NEAR_PATH))
            refuse(index, `has ${key} ${show(end[key])} at progress 1, not ${value}`);
      });
      break;
    case "blend":
      contract.samples.forEach(({ run, a, b, angle }, index) => {
        const start = run(0);
        const end = run(1);
        if (!matches(start, a, angle === true))
          refuse(index, `is ${show(start)} at share 0, not ${show(a)}`);
        if (!matches(end, b, angle === true))
          refuse(index, `is ${show(end)} at share 1, not ${show(b)}`);
      });
      break;
    case "coupling":
      contract.samples.forEach(({ run }, index) => {
        for (const [field, value] of Object.entries(poseOf(run()))) {
          if (typeof value !== "number") continue;
          const rest = valueField(field)?.rest;
          if (rest === undefined) continue;
          if (!isNear(value, rest, NEAR))
            refuse(index, `has ${field} ${show(value)} at rest ${rest}`);
        }
      });
      break;
    default:
      return unreachable(contract);
  }
  return out;
}

function findingsOf(part: MovePart, value: unknown): readonly string[] {
  if ((typeof value !== "function" && typeof value !== "object") || value === null)
    return [`${part.name}: is not exported as a function or an object of functions`];
  const contract = partContract(value);
  if (contract === undefined)
    return [
      `${part.name}: has no contract; declare it with definePart({ kind: "${part.group}" }, ${part.name})`,
    ];
  if (contract.kind !== part.group)
    return [`${part.name}: is declared ${contract.kind} but lives in the ${part.group} folder`];
  try {
    return sampleFindings(contract, part.name);
  } catch (error) {
    return [`${part.name}: a sample threw ${error instanceof Error ? error.message : show(error)}`];
  }
}

/** Findings of the part gate: a part of a kind folder with no `definePart` contract, one of another
 * kind, or one whose samples break the kind's rule; `values` is the export table. */
export function checkParts(
  parts: readonly MovePart[] = moveParts(),
  values: Readonly<Record<string, unknown>> = moves,
): readonly string[] {
  return parts
    .filter((part) => FOLDER_KINDS.includes(part.group))
    .flatMap((part) => findingsOf(part, values[part.name]));
}

/** One labelled sample of a part: the call it makes, and what the call answers at the points it is read. */
export interface PartSample {
  readonly label: string;
  readonly values: readonly unknown[];
}

const READ_AT = [0, 0.5, 1] as const;

function firstLabelled<S extends { readonly label?: string }>(
  samples: readonly S[],
): (S & { readonly label: string }) | undefined {
  for (const sample of samples)
    if (sample.label !== undefined) return { ...sample, label: sample.label };
  return undefined;
}

/** The first labelled sample of a sampled part, read at 0, 0.5 and 1 (seconds for a spring, once for a
 * coupling); nothing for another kind or no label. */
export function partSample(value: unknown): PartSample | undefined {
  if ((typeof value !== "function" && typeof value !== "object") || value === null)
    return undefined;
  const contract = partContract(value);
  if (contract === undefined) return undefined;
  switch (contract.kind) {
    case "time":
    case "geometry":
    case "signal":
    case "utility":
      return undefined;
    case "ease":
    case "envelope":
    case "oscillation":
    case "dynamics":
    case "path":
    case "blend": {
      const sample = firstLabelled<{
        readonly label?: string;
        readonly run: (at: number) => unknown;
      }>(contract.samples);
      return sample === undefined
        ? undefined
        : { label: sample.label, values: READ_AT.map((at) => sample.run(at)) };
    }
    case "coupling": {
      const sample = firstLabelled(contract.samples);
      return sample === undefined ? undefined : { label: sample.label, values: [sample.run()] };
    }
    default:
      return unreachable(contract);
  }
}

/** The parts as printed lines: a heading per group, then one line per part. */
export function formatParts(parts: readonly MovePart[] = moveParts()): readonly string[] {
  return PART_GROUPS.flatMap((group) => {
    const inGroup = parts.filter((part) => part.group === group);
    return inGroup.length === 0
      ? []
      : [`${group}:`, ...inGroup.map(({ call, use }) => `  ${call}  ${use}`)];
  });
}

/** A building block a brief declares in its own `src/parts/<kind>/`, with where it came from. */
export interface LocalPart extends MovePart {
  readonly source: string;
  readonly file: string;
  readonly value: unknown;
}

interface LocalScan {
  readonly parts: readonly LocalPart[];
  readonly problems: readonly string[];
}

function byText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function localHomes(root: string): readonly { readonly source: string; readonly dir: string }[] {
  return briefFolders(root).map((name) => ({ source: name, dir: join(root, name) }));
}

function docBefore(text: string, name: string): string {
  const found = new RegExp(
    `/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*export\\s+(?:async\\s+)?(?:const|function)\\s+${name}\\b`,
  ).exec(text);
  return firstSentence((found?.[1] ?? "").replace(/^\s*\*+ ?/gm, ""));
}

async function scanLocal(root: string): Promise<LocalScan> {
  const parts: LocalPart[] = [];
  const problems: string[] = [];
  for (const { source, dir } of localHomes(root)) {
    const base = join(dir, "src", "parts");
    if (!existsSync(base)) continue;
    const folders = readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    for (const folder of folders) {
      const group = FOLDER_KINDS.find((name) => name === folder);
      if (group === undefined) {
        problems.push(
          `${source}/parts/${folder}: is not a parts folder; use one of ${FOLDER_KINDS.join(", ")}`,
        );
        continue;
      }
      const files = readdirSync(join(base, folder))
        .filter((name) => /\.ts$/.test(name) && !name.endsWith(".d.ts"))
        .sort();
      for (const name of files) {
        const file = join(base, folder, name);
        try {
          const module: Readonly<Record<string, unknown>> = await import(pathToFileURL(file).href);
          const text = readFileSync(file, "utf8");
          for (const [exported, value] of Object.entries(module))
            if (typeof value === "function")
              parts.push({
                name: exported,
                group,
                call: `${exported}(...)`,
                use: docBefore(text, exported),
                source,
                file,
                value,
              });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          problems.push(`${source}/${folder}/${name}: could not be imported: ${message}`);
        }
      }
    }
  }
  const order = (part: LocalPart): number => PART_GROUPS.indexOf(part.group);
  const sorted = [...parts].sort(
    (a, b) => byText(a.source, b.source) || order(a) - order(b) || byText(a.name, b.name),
  );
  return { parts: sorted, problems };
}

/** The building blocks the briefs of the app at `root` declare under `src/parts/<kind>/`: every
 * exported function, by source, then group, then name. */
export async function localParts(root: string): Promise<readonly LocalPart[]> {
  return (await scanLocal(root)).parts;
}

const SAME = 1e-6;

type Grid = readonly (readonly unknown[])[];

function stepsOf(samples: readonly { readonly run: (at: number) => unknown }[]): Grid {
  return samples.map(({ run }) =>
    Array.from({ length: SAMPLE_STEPS + 1 }, (_, step) => run(step / SAMPLE_STEPS)),
  );
}

/** What each sample of a sampled part answers at the 101 steps of progress (seconds for a spring), or
 * once for a coupling; nothing for a kind that is not sampled. */
function gridOf(contract: PartContract): Grid {
  switch (contract.kind) {
    case "time":
    case "geometry":
    case "signal":
    case "utility":
      return [];
    case "ease":
    case "envelope":
    case "oscillation":
    case "dynamics":
    case "path":
    case "blend":
      return stepsOf(contract.samples);
    case "coupling":
      return contract.samples.map(({ run }) => [run()]);
    default:
      return unreachable(contract);
  }
}

function sameValue(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= SAME;
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => key in b && sameValue(Reflect.get(a, key), Reflect.get(b, key)))
    );
  }
  return a === b;
}

function sameSeries(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => sameValue(value, b[index]));
}

interface Known {
  readonly name: string;
  readonly kind: PartGroup;
  readonly grid: Grid;
}

function gridFor(value: unknown): Grid | undefined {
  if ((typeof value !== "function" && typeof value !== "object") || value === null)
    return undefined;
  const contract = partContract(value);
  if (contract === undefined) return undefined;
  try {
    return gridOf(contract);
  } catch {
    return undefined;
  }
}

/** Part-gate findings for the briefs at root, each led by its source, plus a part whose
 * samples repeat a library part or an earlier local part of the same kind. */
export async function checkLocalParts(root: string): Promise<readonly string[]> {
  const { parts, problems } = await scanLocal(root);
  const known: Known[] = moveParts().flatMap((part) => {
    const grid = gridFor(Reflect.get(moves, part.name));
    return grid === undefined ? [] : [{ name: part.name, kind: part.group, grid }];
  });
  const out: string[] = [...problems];
  for (const part of parts) {
    const own = findingsOf(part, part.value).map((finding) => `${part.source}/${finding}`);
    out.push(...own);
    const grid = own.length === 0 ? gridFor(part.value) : undefined;
    const first = grid?.[0];
    if (grid === undefined || first === undefined) continue;
    const twin = known.find(
      (other) =>
        other.kind === part.group && other.grid.some((series) => sameSeries(first, series)),
    );
    if (twin !== undefined) {
      const index = twin.grid.findIndex((series) => sameSeries(first, series));
      out.push(
        `${part.source}/${part.name}: samples as ${twin.name} (sample ${index}); use ${twin.name} instead`,
      );
    }
    known.push({ name: `${part.source}/${part.name}`, kind: part.group, grid });
  }
  return out;
}
