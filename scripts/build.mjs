import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { INSTALLABLE_PACKAGES } from "./installable-packages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");

function isRelative(specifier) {
  return specifier === "." || specifier === ".." || /^\.{1,2}\//.test(specifier);
}

/** Every module specifier a file names: imports, exports, `import()` calls and `import("…")` types. */
function moduleSpecifiers(source) {
  const found = [];
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      found.push(node.moduleSpecifier);
    else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] !== undefined &&
      ts.isStringLiteral(node.arguments[0])
    )
      found.push(node.arguments[0]);
    else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    )
      found.push(node.argument.literal);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** The emitted file a relative specifier names, a module beside it or a folder's index, or why none. */
function emittedTarget(specifier, directory, exists) {
  if (/\.(js|json|css)$/.test(specifier)) return specifier;
  const bare = specifier.replace(/\/$/, "");
  if (bare !== "." && bare !== ".." && exists(join(directory, `${bare}.js`))) return `${bare}.js`;
  if (exists(join(directory, bare, "index.js"))) return `${bare}/index.js`;
  throw new Error(`build: "${specifier}" in ${directory} names no emitted module.`);
}

/** Source imports omit extensions; Node needs them, so each relative module specifier names its emitted
 * file. Only real specifiers change: text in strings, templates and comments is left alone. */
export function withExtensions(text, directory, exists = existsSync, file = "module.js") {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false);
  const edits = moduleSpecifiers(source)
    .filter((literal) => isRelative(literal.text))
    .map((literal) => ({
      start: literal.getStart(source) + 1,
      end: literal.getEnd() - 1,
      text: emittedTarget(literal.text, directory, exists),
    }))
    .sort((left, right) => right.start - left.start);
  let next = text;
  for (const edit of edits) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  return next;
}

function emitted(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return emitted(path);
    return /\.(js|d\.ts)$/.test(entry.name) ? [path] : [];
  });
}

/** Copies each `.template` file under src/ to the same place under dist/, for the files read at runtime. */
function copyTemplates(source, target) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.isDirectory()) copyTemplates(join(source, entry.name), join(target, entry.name));
    else if (entry.name.endsWith(".template")) {
      mkdirSync(target, { recursive: true });
      copyFileSync(join(source, entry.name), join(target, entry.name));
    }
  }
}

/** Writes the guide the tools ship into packages/tools/guide, from the built `guideFiles`; the folder is rebuilt each time. */
function writeGuide(packageRoot) {
  const guide = `${packageRoot}/guide`;
  rmSync(guide, { recursive: true, force: true });
  const module = pathToFileURL(`${packageRoot}/dist/scene/guide.js`).href;
  const code = `const { guideFiles } = await import(${JSON.stringify(module)});
console.log(JSON.stringify(guideFiles(process.argv[1])));`;
  const run = spawnSync(process.execPath, ["--input-type=module", "-e", code, root], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (run.status !== 0) throw new Error(`build: the guide failed: ${run.stderr ?? ""}`);
  for (const [name, text] of Object.entries(JSON.parse(run.stdout))) {
    mkdirSync(dirname(`${guide}/${name}`), { recursive: true });
    writeFileSync(`${guide}/${name}`, text);
  }
}

/** Builds each installable package into its dist/ with its tsconfig.build.json, dependencies first. */
export function build(directories = INSTALLABLE_PACKAGES, log = console.log) {
  for (const directory of directories) {
    const packageRoot = `${root}packages/${directory}`;
    rmSync(`${packageRoot}/dist`, { recursive: true, force: true });
    const run = spawnSync(
      process.execPath,
      [tsc, "-p", `${packageRoot}/tsconfig.build.json`, "--allowImportingTsExtensions", "false"],
      {
        cwd: root,
        encoding: "utf8",
      },
    );
    if (run.status !== 0) {
      log(`FAIL build ${directory}`);
      log(`${run.stdout ?? ""}${run.stderr ?? ""}`);
      return 1;
    }
    try {
      for (const file of emitted(`${packageRoot}/dist`)) {
        const text = readFileSync(file, "utf8");
        const next = withExtensions(text, dirname(file), existsSync, file);
        if (next !== text) writeFileSync(file, next);
      }
    } catch (error) {
      log(`FAIL build ${directory}`);
      log(error instanceof Error ? error.message : String(error));
      return 1;
    }
    copyTemplates(`${packageRoot}/src`, `${packageRoot}/dist`);
    if (directory === "tools") {
      try {
        writeGuide(packageRoot);
      } catch (error) {
        log(`FAIL build ${directory}`);
        log(error instanceof Error ? error.message : String(error));
        return 1;
      }
    }
    log(`PASS build ${directory}`);
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = build();
