import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const START = "<!-- generated:reference:start -->";
const END = "<!-- generated:reference:end -->";
const NO_DOC = "(no doc comment)";
const MAX_SIGNATURE = 140;

/** Packages with a scene-facing entry, each with the entry files a caller imports. */
export const PACKAGES = [
  { dir: "core", entries: ["src/index.ts"] },
  { dir: "stage", entries: ["src/index.ts", "src/render/index.ts", "src/dom/index.ts"] },
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

/** Core's groups in learning order and their 1-line reference summaries. */
const CORE_INTROS = {
  fields:
    "Pose fields, rest values, combining rules, and lifting 2D poses to 3D. Reach for this group when defining fields or combining poses.",
  time: "Time is a number over a span; this group reads it, shapes it (loop, chain, reversed, repeated) and arranges phases or lanes into one timeline. Reach for it whenever a move starts late, repeats or follows another.",
  blend:
    "Blending turns two values or poses into the value between them, and keyframes turns a list of keys into a curve. Reach for it to interpolate a number, an angle, a point or a whole pose.",
  ease: "Easing reshapes progress so motion accelerates or settles; spring and back are the eases with overshoot. Reach for it to give a move weight instead of a straight line.",
  envelope:
    "An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave. Reach for it to fade a quantity in or out or to pulse it.",
  geometry:
    "Geometry holds the vector, matrix and quaternion maths, the 3D camera lens, and the path tools: shape outlines, arcs, resampling, reversal, transforms, bounds and area. Reach for it when a scene needs a point, a rotation or an outline.",
  path: "Motion along a curve or through the air: a point and tangent along a path, its length, and a ballistic arc. Reach for it to send something along a line or to throw it.",
  measure:
    "Measures read a signal back: how fast it moves, and the area under a stream of samples. Reach for it to check a move's feel or to drive one value from another's speed.",
  events:
    "An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.",
  utility:
    "Small shared helpers: a seeded random, a clamp and an exhaustive-switch guard. Reach for them instead of writing your own.",
};

/** Stage's groups in learning order and their 1-line reference summaries. */
const STAGE_INTROS = {
  author:
    "What a piece is written with: `defineStage`, the cast builders, list poses by index and the scene's context. Reach for it whenever you write a piece.",
  run: "What renderers and tools run a piece with: `compileStage`, `frame` and `check`, and the closed `StageError`. Reach for it when you run, test or review a piece.",
  render:
    "Outlines for renderers, from `@gerak/stage/render`: drawing strokes in order, blending morphs, matching outlines.",
  dom: "Browser CSS custom property helpers exported from `@gerak/stage/dom` (`cssVariables`, `isTokenName`).",
};

const GROUP_INTROS = {
  core: CORE_INTROS,
  stage: STAGE_INTROS,
};
const GROUP_ORDER = {
  core: Object.keys(CORE_INTROS),
  stage: Object.keys(STAGE_INTROS),
};

/** The read-whole pages: the package whose export index they carry, and the page. */
export const READ_WHOLE = [
  { dir: "core", path: "packages/core/docs/core.md" },
  { dir: "stage", path: "packages/stage/docs/stage.md" },
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
    target: ts.ScriptTarget.ES2023,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    exactOptionalPropertyTypes: true,
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

const NAMED =
  ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const ALIAS_BODY = NAMED | ts.TypeFormatFlags.InTypeAlias;

/** A table type this long is shown by its keys; its row type is documented on its own entry. */
function keysOrType(type, checker, declaration) {
  const text = checker.typeToString(type, declaration, NAMED);
  const keys = checker.getPropertiesOfType(type).map(({ name }) => name);
  return text.length > MAX_SIGNATURE && keys.length > 0 ? `{ ${keys.join(", ")} }` : text;
}

/** Object members in full, or intersection arms formatted apart so nested aliases stay named. */
function shapeOf(type, checker, declaration) {
  if (
    declaration !== undefined &&
    ts.isTypeAliasDeclaration(declaration) &&
    ts.isIntersectionTypeNode(declaration.type)
  ) {
    return declaration.type.types
      .map((part) => {
        const inner = ts.isParenthesizedTypeNode(part) ? part.type : part;
        const text = checker.typeToString(checker.getTypeFromTypeNode(inner), declaration, NAMED);
        return ts.isUnionTypeNode(inner) || ts.isFunctionTypeNode(inner) ? `(${text})` : text;
      })
      .join(" & ");
  }
  const members = checker.getPropertiesOfType(type);
  const isPlainObject =
    (type.flags & ts.TypeFlags.Object) !== 0 &&
    !checker.isArrayType(type) &&
    !checker.isTupleType(type);
  if (
    isPlainObject &&
    members.length === 0 &&
    declaration !== undefined &&
    ts.isInterfaceDeclaration(declaration)
  )
    return "{}";
  if (!isPlainObject || members.length === 0)
    return checker.typeToString(type, declaration, ALIAS_BODY);
  const calls = type
    .getCallSignatures()
    .map((call) => checker.signatureToString(call, declaration, NAMED));
  const fields = members.map((member) => {
    const optional = (member.flags & ts.SymbolFlags.Optional) !== 0 ? "?" : "";
    const memberType =
      declaration === undefined
        ? checker.getTypeOfSymbol(member)
        : checker.getTypeOfSymbolAtLocation(member, declaration);
    const written = checker.typeToString(memberType, declaration, NAMED);
    return `${member.name}${optional}: ${written}`;
  });
  return `{ ${[...calls, ...fields].join("; ")} }`;
}

/** Own type parameter names declared on the exported type or interface, never a target utility's type arguments. */
function typeParameterNames(symbol) {
  const names = (symbol.declarations ?? []).flatMap((item) =>
    ts.isTypeAliasDeclaration(item) || ts.isInterfaceDeclaration(item)
      ? (item.typeParameters ?? []).map((param) => param.name.text)
      : [],
  );
  return [...new Set(names)];
}

/** The signature of an export in full. */
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
      return `${checker.signatureToString(first, declaration, NAMED)}${more}`;
    }
    if ((flags & ts.SymbolFlags.Variable) !== 0)
      return `const ${symbol.name}: ${keysOrType(type, checker, declaration)}`;
  }
  if ((flags & ts.SymbolFlags.Class) !== 0) return `class ${symbol.name}`;
  const declared = checker.getDeclaredTypeOfSymbol(symbol);
  const parameters = typeParameterNames(symbol);
  const head = `type ${symbol.name}${parameters.length === 0 ? "" : `<${parameters.join(", ")}>`}`;
  return `${head} = ${shapeOf(declared, checker, declaration)}`;
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
  const params = (call?.getParameters() ?? []).flatMap((param) => {
    const decl = param.valueDeclaration;
    const rest = decl !== undefined && ts.isParameter(decl) && decl.dotDotDotToken !== undefined;
    if (!rest) return [param.name];
    const type = checker.getTypeOfSymbolAtLocation(param, declaration);
    const tuple = checker.typeToString(type, declaration, NAMED);
    return tuple === "[]" ? [] : [tuple.replace(/^\[|\]$/g, "")];
  });
  return {
    call: `(${params.join(", ")})`,
    text: lines.length === 0 ? "" : `Options: ${lines.join("; ")}`,
  };
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
  const tail = options === undefined || options.text === "" ? "" : ` ${options.text}`;
  const declaration = symbol.declarations?.[0];
  return {
    name,
    doc,
    file: declaration === undefined ? "" : declaration.getSourceFile().fileName,
    text: `- **\`${name}\`** \`${signature}\`: ${meaning}${tail}`,
  };
}

/** The group a declaring file belongs to: its folder under `src`, or "index" for a file at the root of `src`. */
function groupOf(file, srcFolder) {
  if (!file.startsWith(srcFolder)) return undefined;
  const parts = file.slice(srcFolder.length).split("/");
  return parts.length > 1 ? parts[0] : "index";
}

function orderGroups(dir, names) {
  const order = GROUP_ORDER[dir] ?? [];
  const known = order.filter((name) => names.includes(name));
  const rest = names.filter((name) => !known.includes(name)).sort();
  return [...known, ...rest];
}

function introOf(dir, group) {
  return GROUP_INTROS[dir]?.[group] ?? "";
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
      intro: introOf(dir, name),
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

function isThreeD(entry) {
  return /(rotation3d|stage3d|cubics3d)\.ts$/.test(entry.file) || /3d$/i.test(entry.name);
}

/** One compact index line per group linking its reference page, splitting 2D and 3D for geometry. */
function indexLineOf(group) {
  const names = (entries) => entries.map(({ name }) => `\`${name}\``).join(", ");
  if (group.name === "geometry") {
    const twoD = group.entries.filter((entry) => !isThreeD(entry));
    const threeD = group.entries.filter((entry) => isThreeD(entry));
    return `- [${group.name}](./reference/${group.name}.md) (${group.entries.length}): 2D ${names(twoD)}; 3D ${names(threeD)}`;
  }
  return `- [${group.name}](./reference/${group.name}.md) (${group.entries.length}): ${names(group.entries)}`;
}

/** The body between a read-whole page's markers: one names-only link line per reference group. */
export function readWholeBody(generated, dir) {
  const found = generated.packages.find((candidate) => candidate.dir === dir);
  const groups = found === undefined ? [] : found.groups;
  return groups.map(indexLineOf).join("\n");
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
  for (const { dir, path } of READ_WHOLE) {
    const committed = readIf(join(scanRoot, path));
    const filled =
      committed === undefined ? undefined : fill(committed, [readWholeBody(generated, dir)]);
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
