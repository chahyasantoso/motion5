import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const START = "<!-- generated:reference:start -->";
const END = "<!-- generated:reference:end -->";
const NO_DOC = "(no doc comment)";
const MAX_SIGNATURE = 140;
const MAX_COMPACT_SIGNATURE = 80;

/** Packages with a scene-facing entry, each with the entry files a caller imports. */
export const PACKAGES = [
  { dir: "core", entries: ["src/index.ts"] },
  { dir: "stage", entries: ["src/index.ts"] },
  { dir: "player", entries: ["src/index.ts"] },
  { dir: "dom", entries: ["src/index.ts"] },
  { dir: "react", entries: ["src/index.ts"] },
  { dir: "three", entries: ["src/index.ts", "src/react.ts"] },
  { dir: "rig", entries: ["src/index.ts"] },
  { dir: "rig-three", entries: ["src/index.ts"] },
  { dir: "physics", entries: ["src/index.ts"] },
  { dir: "rapier", entries: ["src/index.ts"] },
  { dir: "moves", entries: ["src/index.ts"] },
];

/** Core's groups in the order a reader needs them; every other package lists its groups by name. */
const CORE_GROUPS = [
  "fields",
  "time",
  "blend",
  "ease",
  "envelope",
  "geometry",
  "path",
  "measure",
  "events",
  "utility",
];

/** The read-whole pages: the package whose entries they carry, and the page. */
export const READ_WHOLE = [
  { dir: "core", path: "packages/core/docs/core.md", namesOnly: "geometry" },
  { dir: "stage", path: "packages/stage/docs/stage.md", namesOnly: undefined },
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

/** A literal field of an option's declared type, as written: `0`, `"in"`, or nothing when absent. */
function literalOf(type, key, checker) {
  const field = type.getProperty(key);
  if (field === undefined) return undefined;
  const text = checker.typeToString(checker.getTypeOfSymbol(field));
  return text.startsWith('"') ? JSON.parse(text) : text;
}

function rangeOf(min, max) {
  if (min !== undefined && max !== undefined) return ` ${min}..${max}`;
  if (min !== undefined) return ` >=${min}`;
  return max === undefined ? "" : ` <=${max}`;
}

/** A move's options in full from its declared type, so the clipped signature never hides them;
 * nothing for an export that is not a move. */
function optionsOf(symbol, checker) {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (declaration === undefined) return undefined;
  const [call] = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures();
  const [parameter] = call?.getParameters() ?? [];
  if (parameter === undefined) return undefined;
  const given = checker.getTypeOfSymbol(parameter);
  if (given.aliasSymbol?.name !== "OptionsIn") return undefined;
  const [fields] = given.aliasTypeArguments ?? [];
  if (fields === undefined) return undefined;
  const lines = checker.getPropertiesOfType(fields).map((option) => {
    const type = checker.getTypeOfSymbol(option);
    const kind = literalOf(type, "kind", checker) ?? "";
    const range = rangeOf(literalOf(type, "min", checker), literalOf(type, "max", checker));
    const fallback = literalOf(type, "default", checker);
    const said = literalOf(type, "description", checker) ?? "";
    const needed = fallback === undefined ? "required" : `default ${fallback}`;
    return `\`${option.name}\` ${kind}${range}, ${needed}: ${said}`;
  });
  if (lines.length === 0) return undefined;
  const names = call?.getParameters().map(({ name }) => name) ?? [];
  return { call: `(${names.join(", ")})`, text: `Options: ${lines.join("; ")}` };
}

function firstSentence(text) {
  const flat = text.replace(/\s*\n\s*/g, " ");
  const end = /[.!?](?=\s|$)/.exec(flat);
  return end === null ? flat : flat.slice(0, end.index + 1);
}

function entryOf(name, exportedSymbol, checker) {
  const symbol =
    (exportedSymbol.flags & ts.SymbolFlags.Alias) !== 0
      ? checker.getAliasedSymbol(exportedSymbol)
      : exportedSymbol;
  const doc = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  const options = optionsOf(symbol, checker);
  const signature = options === undefined ? signatureOf(symbol, checker) : options.call;
  // One line per export, so an agent that searches for a name gets its signature and meaning in one hit.
  const meaning = (doc === "" ? NO_DOC : doc).replace(/\s*\n\s*/g, " ");
  const tail = options === undefined ? "" : ` ${options.text}`;
  const short =
    signature.length > MAX_COMPACT_SIGNATURE
      ? `${signature.slice(0, MAX_COMPACT_SIGNATURE - 1)}…`
      : signature;
  const declaration = symbol.declarations?.[0];
  return {
    name,
    doc,
    file: declaration === undefined ? "" : declaration.getSourceFile().fileName,
    text: `- **\`${name}\`** \`${signature}\`: ${meaning}${tail}`,
    compact: `- **\`${name}\`** \`${short}\`: ${firstSentence(doc === "" ? NO_DOC : doc)}`,
  };
}

/** The group a declaring file belongs to: its folder under `src`, or "index" for a file at the root of `src`. */
function groupOf(file, srcFolder) {
  if (!file.startsWith(srcFolder)) return undefined;
  const parts = file.slice(srcFolder.length).split("/");
  return parts.length > 1 ? parts[0] : "index";
}

function orderGroups(dir, names) {
  const known = dir === "core" ? CORE_GROUPS.filter((name) => names.includes(name)) : [];
  const rest = names.filter((name) => !known.includes(name)).sort();
  return [...known, ...rest];
}

function introOf(scanRoot, dir, group) {
  const file = join(scanRoot, "packages", dir, "docs", `${group}.intro.md`);
  return existsSync(file) ? readFileSync(file, "utf8").trim() : "";
}

/** Every package's exports as groups, and the names with no doc comment. */
export function generate(scanRoot = root, packages = PACKAGES) {
  const files = packages.flatMap(({ dir, entries }) =>
    entries.map((entry) => join(scanRoot, "packages", dir, entry)),
  );
  const { program, checker } = createChecker(files);
  const undocumented = [];
  const result = packages.map(({ dir, entries }) => {
    const srcFolder = `${join(scanRoot, "packages", dir, "src").split("\\").join("/")}/`;
    const seen = new Set();
    const byGroup = new Map();
    for (const entry of entries) {
      const path = join(scanRoot, "packages", dir, entry);
      const source = program.getSourceFile(path);
      const module = source === undefined ? undefined : checker.getSymbolAtLocation(source);
      const exported = module === undefined ? [] : checker.getExportsOfModule(module);
      for (const name of source === undefined ? [] : orderedNames(source, checker, exported)) {
        const symbol = exported.find(({ name: candidate }) => candidate === name);
        if (symbol === undefined || seen.has(name)) continue;
        seen.add(name);
        const item = entryOf(name, symbol, checker);
        const group = groupOf(item.file, srcFolder);
        if (group === undefined) continue;
        if (item.doc === "") undocumented.push(`${dir}: ${name}`);
        byGroup.set(group, [...(byGroup.get(group) ?? []), item]);
      }
    }
    const groups = orderGroups(dir, [...byGroup.keys()]).map((name) => ({
      name,
      intro: introOf(scanRoot, dir, name),
      entries: byGroup.get(name) ?? [],
    }));
    return { dir, groups };
  });
  return { packages: result, undocumented };
}

function groupText(dir, group) {
  const intro = group.intro === "" ? [] : [group.intro, ""];
  return [
    `# @gerak/${dir}: ${group.name}`,
    "",
    ...intro,
    ...group.entries.map(({ text }) => text),
    "",
  ];
}

/** The generated reference files of every package, by path from the repository root. */
export function referenceFiles(generated) {
  const files = new Map();
  for (const { dir, groups } of generated.packages) {
    const base = `packages/${dir}/docs/reference`;
    for (const group of groups)
      files.set(`${base}/${group.name}.md`, groupText(dir, group).join("\n"));
    const lines = groups.map(
      (group) =>
        `- [${group.name}](./${group.name}.md), ${group.entries.length} exports${
          group.intro === "" ? "" : `: ${firstSentence(group.intro)}`
        }`,
    );
    files.set(
      `${base}/README.md`,
      [
        `# @gerak/${dir} reference`,
        "",
        "Generated from doc comments by `npm run reference -- --write`; one page per source folder.",
        "",
        ...lines,
        "",
      ].join("\n"),
    );
  }
  return files;
}

const DIMENSIONS = ["2D paths and shapes", "3D rotation and vectors"];

function isThreeD(entry) {
  return /(rotation3d|stage3d|cubics3d)\.ts$/.test(entry.file) || /3d$/i.test(entry.name);
}

/** A group's exports as names only, split by dimension, with a link to the page that has the signatures. */
function namesOf(group) {
  const names = (flag) =>
    group.entries
      .filter((entry) => isThreeD(entry) === flag)
      .map(({ name }) => `\`${name}\``)
      .join(", ");
  return [
    ...DIMENSIONS.map((label, index) => `- ${label}: ${names(index === 1)}`),
    `Signatures: [reference/${group.name}.md](./reference/${group.name}.md).`,
  ];
}

/** The body between a read-whole page's markers: a table of contents, then every group in compact form;
 * `namesOnly` names one group by its exports alone. */
export function readWholeBody(generated, dir, namesOnly = undefined) {
  const found = generated.packages.find((candidate) => candidate.dir === dir);
  const groups = found === undefined ? [] : found.groups;
  const toc = groups
    .map((group) => `[${group.name}](#${group.name}) ${group.entries.length}`)
    .join(", ");
  const sections = groups.flatMap((group) => [
    "",
    `## ${group.name}`,
    "",
    ...(group.intro === "" ? [] : [group.intro, ""]),
    ...(group.name === namesOnly ? namesOf(group) : group.entries.map(({ compact }) => compact)),
  ]);
  return [`Groups: ${toc}.`, ...sections].join("\n");
}

/** The page with each marker pair's inside replaced; undefined when the pairs do not match. */
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

function readIf(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : undefined;
}

function existingReferenceFiles(scanRoot, dirs) {
  return dirs.flatMap((dir) => {
    const folder = join(scanRoot, "packages", dir, "docs", "reference");
    return existsSync(folder)
      ? readdirSync(folder).map((name) => `packages/${dir}/docs/reference/${name}`)
      : [];
  });
}

/** What the committed docs must become: every file's text, and the problems that no write can fix. */
function expectedDocs(scanRoot) {
  const generated = generate(scanRoot);
  const files = referenceFiles(generated);
  const problems = generated.undocumented.map((name) => `${name} has no doc comment`);
  for (const { dir, path, namesOnly } of READ_WHOLE) {
    const committed = readIf(join(scanRoot, path));
    const filled =
      committed === undefined
        ? undefined
        : fill(committed, [readWholeBody(generated, dir, namesOnly)]);
    if (filled === undefined) problems.push(`${path}: missing or its marker pair does not match`);
    else files.set(path, filled);
  }
  return { files, problems, dirs: PACKAGES.map(({ dir }) => dir) };
}

/** The question this asks of the committed docs: is each generated file what the code says now. */
export function checkReference(scanRoot = root) {
  const { files, problems, dirs } = expectedDocs(scanRoot);
  const stale = [...files]
    .filter(([path, text]) => readIf(join(scanRoot, path)) !== text)
    .map(([path]) => `${path} is out of date: run npm run reference -- --write`);
  const extra = existingReferenceFiles(scanRoot, dirs)
    .filter((path) => !files.has(path))
    .map((path) => `${path} is no longer generated: run npm run reference -- --write`);
  return [...problems, ...stale, ...extra];
}

export function main(argv = process.argv.slice(2), scanRoot = root) {
  if (!argv.includes("--write")) {
    const problems = checkReference(scanRoot);
    for (const problem of problems) console.error(problem);
    if (problems.length === 0) console.log(`reference current: ${PACKAGES.length} packages`);
    return problems.length === 0 ? 0 : 1;
  }
  const { files, problems, dirs } = expectedDocs(scanRoot);
  for (const path of existingReferenceFiles(scanRoot, dirs))
    if (!files.has(path)) rmSync(join(scanRoot, path));
  for (const [path, text] of files) {
    mkdirSync(join(scanRoot, path, ".."), { recursive: true });
    writeFileSync(join(scanRoot, path), text, "utf8");
  }
  for (const problem of problems) console.error(problem);
  console.log(`reference written: ${files.size} files`);
  return problems.some((problem) => !problem.includes("no doc comment")) ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main();
