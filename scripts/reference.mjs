import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const REFERENCE_PATH = "docs/guide/agent-reference.md";
const START = "<!-- generated:reference:start -->";
const END = "<!-- generated:reference:end -->";
const NO_DOC = "(no doc comment)";
const MAX_SIGNATURE = 140;

export const PACKAGES = [
  "moves/src/index.ts",
  "player/src/index.ts",
  "dom/src/index.ts",
  "react/src/index.ts",
  "rig/src/index.ts",
  "stage/src/index.ts",
  "physics/src/index.ts",
  "rapier/src/index.ts",
  "three/src/index.ts",
  "three/src/react.ts",
];

/** The root tsconfig's `paths`, so `@gerak/*` resolves to source whether or not a package was built. */
function workspacePaths() {
  const read = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
  const paths = read.config?.compilerOptions?.paths;
  return paths === undefined ? {} : { baseUrl: root, paths };
}

function createChecker(files) {
  const program = ts.createProgram(files, {
    ...workspacePaths(),
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    noEmit: true,
  });
  return { program, checker: program.getTypeChecker() };
}

/** Export names in the order the entry file lists them, then any it declares itself. */
function orderedNames(source, checker, exported) {
  const names = [];
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

function clip(text) {
  return text.length > MAX_SIGNATURE ? `${text.slice(0, MAX_SIGNATURE - 1)}…` : text;
}

function signatureOf(symbol, checker) {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  const flags = symbol.flags;
  if (
    declaration !== undefined &&
    (flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) !== 0
  ) {
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const calls = type.getCallSignatures();
    const [first] = calls;
    if (first !== undefined) {
      const more = calls.length > 1 ? ` (+${calls.length - 1} overloads)` : "";
      return `${clip(checker.signatureToString(first))}${more}`;
    }
    if ((flags & ts.SymbolFlags.Variable) !== 0)
      return clip(`const ${symbol.name}: ${checker.typeToString(type)}`);
  }
  if ((flags & ts.SymbolFlags.Class) !== 0) return `class ${symbol.name}`;
  return `type ${symbol.name}`;
}

function entryOf(name, exportedSymbol, checker) {
  const symbol =
    (exportedSymbol.flags & ts.SymbolFlags.Alias) !== 0
      ? checker.getAliasedSymbol(exportedSymbol)
      : exportedSymbol;
  const doc = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  const signature = signatureOf(symbol, checker);
  // One line per export, so an agent that searches for a name gets its signature and meaning in one hit.
  const meaning = (doc === "" ? NO_DOC : doc).replace(/\s*\n\s*/g, " ");
  return { name, doc, text: `- **\`${name}\`** \`${signature}\`: ${meaning}` };
}

/** One generated body per package, and the names with no doc comment. */
export function generate(scanRoot = root, packages = PACKAGES) {
  const files = packages.map((name) => join(scanRoot, "packages", name));
  const { program, checker } = createChecker(files);
  const bodies = [];
  const undocumented = [];
  packages.forEach((name, index) => {
    const source = program.getSourceFile(files[index] ?? "");
    const module = source === undefined ? undefined : checker.getSymbolAtLocation(source);
    const exported = module === undefined ? [] : checker.getExportsOfModule(module);
    const entries = (source === undefined ? [] : orderedNames(source, checker, exported)).flatMap(
      (exportedName) => {
        const symbol = exported.find(({ name: candidate }) => candidate === exportedName);
        return symbol === undefined ? [] : [entryOf(exportedName, symbol, checker)];
      },
    );
    for (const entry of entries)
      if (entry.doc === "") undocumented.push(`${name.split("/")[0]}: ${entry.name}`);
    bodies.push(entries.map(({ text }) => text).join("\n"));
  });
  return { bodies, undocumented };
}

/** The reference with each marker pair's inside replaced; undefined when the pairs do not match. */
export function fill(text, bodies) {
  const lines = text.split("\n");
  const out = [];
  let pair = 0;
  let inside = false;
  for (const line of lines) {
    if (inside) {
      if (line.trim() === END) inside = false;
      continue;
    }
    out.push(line);
    if (line.trim() === START) {
      const body = bodies[pair];
      if (body === undefined) return undefined;
      pair += 1;
      inside = true;
      out.push(body, END);
    }
  }
  return inside || pair !== bodies.length ? undefined : out.join("\n");
}

/** The question this asks of the committed reference: is it what the code says now. */
export function checkReference(scanRoot = root) {
  const target = join(scanRoot, REFERENCE_PATH);
  const committed = readFileSync(target, "utf8");
  const expected = fill(committed, generate(scanRoot).bodies);
  if (expected === undefined)
    return [`${REFERENCE_PATH}: marker pairs do not match the ${PACKAGES.length} packages`];
  const undocumented = generate(scanRoot).undocumented.map((name) => `${name} has no doc comment`);
  return expected === committed
    ? undocumented
    : [`${REFERENCE_PATH} is out of date: run npm run reference -- --write`, ...undocumented];
}

export function main(argv = process.argv.slice(2), scanRoot = root) {
  const { bodies, undocumented } = generate(scanRoot);
  if (undocumented.length > 0)
    console.error(
      `${undocumented.length} exports with no doc comment:\n${undocumented.join("\n")}`,
    );
  const target = join(scanRoot, REFERENCE_PATH);
  const committed = readFileSync(target, "utf8");
  const expected = fill(committed, bodies);
  if (expected === undefined) {
    console.error(`${REFERENCE_PATH}: marker pairs do not match the ${PACKAGES.length} packages`);
    return 1;
  }
  if (argv.includes("--write")) {
    writeFileSync(target, expected, "utf8");
    console.log(`${REFERENCE_PATH} written`);
    return 0;
  }
  if (expected !== committed) {
    console.error(`${REFERENCE_PATH} is out of date: run npm run reference -- --write`);
    return 1;
  }
  console.log(`${REFERENCE_PATH} current: ${bodies.length} packages`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main();
