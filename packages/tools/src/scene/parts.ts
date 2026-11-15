import { existsSync } from "node:fs";
import { dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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
  if (top === "moves") return undefined;
  if (top === "fields" || top === "compose") return top;
  if (top !== "parts") throw new Error(`moveParts: folder "${top}" is not a parts group`);
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

/** The parts as printed lines: a heading per group, then one line per part. */
export function formatParts(parts: readonly MovePart[] = moveParts()): readonly string[] {
  return PART_GROUPS.flatMap((group) => {
    const inGroup = parts.filter((part) => part.group === group);
    return inGroup.length === 0
      ? []
      : [`${group}:`, ...inGroup.map(({ call, use }) => `  ${call}  ${use}`)];
  });
}
