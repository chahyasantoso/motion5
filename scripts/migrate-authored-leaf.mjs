#!/usr/bin/env node
/**
 * Migrate authored keyframe leaves off the retired `{ stops: [...] }` wrapper (issue #192, ADR-050).
 *
 * The core transform is mechanical: an object literal whose only property is `stops` becomes that
 * property's value, so `x: { stops: RAMP }` becomes `x: RAMP`. It walks the TypeScript AST rather
 * than a regex, so a nested brace, a comment or a template literal cannot desynchronise it, and a
 * type literal that declares `stops` is never touched because it is a type and not an expression.
 *
 * Two follow-on edits are opt-out rather than opt-in, because leaving either undone leaves the suite
 * red in a way that reads like a defect instead of like unfinished migration:
 *
 *   - Authored paths lost a segment. `"keyframes.x.stops[0].p"` becomes `"keyframes.x[0].p"`, and
 *     the same for `.stops` member access on an expression that names `keyframes`.
 *   - A `hold(v)` helper should return the static form. Preserving it as a bare two-stop array would
 *     keep exactly the cost ADR-050 retires the wrapper to remove.
 *
 * Everything a codemod cannot decide is reported and left alone. A plugin fixture that contributes a
 * wrapper now trips `plugin-contribution-property-stops-wrapper`, and that is an assertion change,
 * not a shape change.
 *
 * Usage:
 *   node scripts/migrate-authored-leaf.mjs             report the full plan, write nothing
 *   node scripts/migrate-authored-leaf.mjs --write      apply it, then run `npm run format`
 *   node scripts/migrate-authored-leaf.mjs --check      gate: exit 1 while any wrapper remains
 *
 * Flags: --no-hold keeps `hold()` helpers as two-stop arrays, --no-paths leaves path strings alone.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));

/** Where an authored schema may live. The same roots `LF-16` scans, for the same reasons. */
const ROOTS = ["packages", "apps"];
const EXTENSIONS = [".ts", ".tsx"];
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  "oracle",
  ".turbo",
]);

/**
 * The specs that name the retired form. They are the gate, never the subject.
 *
 * A test that refuses a shape has to be able to write that shape down, so migrating either of these
 * would make its own assertion unsatisfiable. `bare-authored-leaf` writes the wrapper as a literal.
 * `authored-leaf-reader` builds it around a named array, which keeps it out of `LF-16`'s probe but
 * not out of an AST transform's reach: unwrapping it is what turned `LF-1` and `LF-3` red.
 */
const SKIPPED_FILES = new Set([
  "packages/core/test/integration/bare-authored-leaf.test.ts",
  "packages/core/test/integration/authored-leaf-reader.test.ts",
]);

/** `stops:` followed by an array literal. The retired wrapper, and nothing else. `LF-16`'s probe. */
const WRAPPER_AUTHORING = /\bstops\s*:\s*\[/;

/** The two comment forms, either of which may name the retired shape it documents. */
const COMMENT = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/.source;
/** A quoted body, which is where a diagnostic message names the shape it refuses. */
const QUOTED = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/.source;
/** A template body. Interpolations go with it: no authored leaf has ever lived in one. */
const TEMPLATE = /`(?:[^`\\]|\\.)*`/.source;
/** Every comment and every quoted body, matched left to right in one pass. `LF-16` owns this. */
const PROSE = new RegExp(`${COMMENT}|${QUOTED}|${TEMPLATE}`, "g");

/**
 * Code with its prose removed, so the gate reads schemas rather than sentences about them.
 *
 * The three modules that own the refusal all have to name the retired form, two in a doc comment and
 * `validate-v5` in the diagnostic message itself. Reading that prose left `--check` red forever on
 * exactly the code that satisfies it. See `LF-16`, which owns the reasoning.
 */
function codeOnly(text) {
  return text.replace(PROSE, " ");
}

const argv = new Set(process.argv.slice(2));
const options = {
  write: argv.has("--write"),
  check: argv.has("--check"),
  hold: !argv.has("--no-hold"),
  paths: !argv.has("--no-paths"),
};

/** Every candidate file under one root, as a repo-relative posix path. */
function* walk(relativeRoot) {
  let entries;
  try {
    entries = readdirSync(path.join(REPO_ROOT, relativeRoot), { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || IGNORED_DIRECTORIES.has(entry.name)) continue;
    const relative = `${relativeRoot}/${entry.name}`;
    if (entry.isDirectory()) yield* walk(relative);
    else if (EXTENSIONS.some((extension) => entry.name.endsWith(extension))) yield relative;
  }
}

function candidates() {
  const files = [];
  for (const root of ROOTS) for (const file of walk(root)) files.push(file);
  return files.filter((file) => !SKIPPED_FILES.has(file)).sort();
}

function parse(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

/** The initializer of `{ stops: X }`, or `undefined` for any object literal that is not that. */
function wrapperInitializer(node) {
  if (!ts.isObjectLiteralExpression(node) || node.properties.length !== 1) return undefined;
  const [property] = node.properties;
  if (!property || !ts.isPropertyAssignment(property)) return undefined;
  const { name } = property;
  const key = ts.isIdentifier(name) || ts.isStringLiteralLike(name) ? name.text : undefined;
  return key === "stops" ? property.initializer : undefined;
}

/** One authored stop as source text, or `undefined` if it carries anything but `p` and `v`. */
function readStop(element) {
  if (!element || !ts.isObjectLiteralExpression(element)) return undefined;
  const stop = {};
  for (const property of element.properties) {
    if (ts.isShorthandPropertyAssignment(property)) {
      stop[property.name.text] = property.name.text;
      continue;
    }
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) return undefined;
    stop[property.name.text] = property.initializer.getText();
  }
  const keys = Object.keys(stop).sort().join(",");
  return keys === "p,v" ? stop : undefined;
}

/**
 * The scalar a two-stop hold is holding, or `undefined` when the stops actually animate.
 *
 * Endpoints and one repeated value only. Anything with an `ease`, a third stop or a second value is
 * a ramp that happens to be short, and rewriting it would be a behavior change wearing a migration.
 */
function staticHoldValue(initializer) {
  if (!ts.isArrayLiteralExpression(initializer) || initializer.elements.length !== 2)
    return undefined;
  const [first, second] = initializer.elements.map(readStop);
  if (!first || !second) return undefined;
  if (first.p !== "0" || second.p !== "1" || first.v !== second.v) return undefined;
  return first.v;
}

/** The name of the `hold`-ish helper this wrapper is the return value of, if it is one. */
function holdHelperName(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (ts.isSourceFile(current) || ts.isClassDeclaration(current)) return undefined;
    if (ts.isCallExpression(current) || ts.isPropertyAssignment(current)) return undefined;
    if (ts.isFunctionDeclaration(current) || ts.isFunctionExpression(current)) {
      const name = current.name?.text;
      return name && /^hold/i.test(name) ? name : undefined;
    }
    if (ts.isArrowFunction(current)) {
      const { parent } = current;
      const name =
        ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)
          ? parent.name.text
          : undefined;
      return name && /^hold/i.test(name) ? name : undefined;
    }
  }
  return undefined;
}

/** `keyframes.x.stops[0].p` addresses one segment less than it used to. */
function rewriteAuthoredPath(value) {
  if (!value.includes(".stops")) return value;
  if (!/(^|\.)keyframes\./.test(value)) return value;
  return value.replace(/\.stops(?=\[)/g, "").replace(/\.stops$/, "");
}

function collect(file, text) {
  const source = parse(file, text);
  const edits = [];
  const notes = new Set();

  const visit = (node) => {
    const initializer = wrapperInitializer(node);
    if (initializer) {
      const helper = options.hold ? holdHelperName(node) : undefined;
      const held = helper ? staticHoldValue(initializer) : undefined;
      if (held !== undefined) {
        edits.push({ start: node.getStart(source), end: node.end, text: held, kind: "hold" });
        notes.add(`\`${helper}()\` now returns the static leaf \`${held}\``);
      } else {
        edits.push({
          start: node.getStart(source),
          end: node.end,
          text: initializer.getText(source),
          kind: "wrapper",
        });
        if (ts.isArrayLiteralExpression(initializer) && initializer.elements.length === 0)
          notes.add("an empty stop list became `[]`; confirm the case still means what it meant");
      }
    }

    // `node.text` and not `getText()`. The raw text carries its quotes, and a leading quote is
    // neither the `.` nor the string start the guard inside `rewriteAuthoredPath` anchors on, so
    // every path edit silently no-opped and `Y-7` stayed red for a reason that read like a defect.
    if (options.paths && ts.isStringLiteralLike(node)) {
      const rewritten = rewriteAuthoredPath(node.text);
      if (rewritten !== node.text) {
        const start = node.getStart(source);
        const quote = source.text[start];
        edits.push({
          start,
          end: node.end,
          text: `${quote}${rewritten}${quote}`,
          kind: "path",
        });
      }
    }

    if (
      options.paths &&
      ts.isPropertyAccessExpression(node) &&
      node.name.text === "stops" &&
      /keyframes/i.test(node.expression.getText(source))
    )
      edits.push({ start: node.expression.end, end: node.end, text: "", kind: "path" });

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(source, visit);
  return { edits, notes: [...notes] };
}

/** Outermost wins: an edit inside a replaced range would rewrite text that is already gone. */
function apply(text, edits) {
  const ordered = [...edits].sort((a, b) => a.start - b.start || b.end - a.end);
  const kept = [];
  for (const edit of ordered) {
    const outer = kept.at(-1);
    if (outer && edit.start < outer.end) continue;
    kept.push(edit);
  }
  let result = text;
  for (const edit of [...kept].reverse())
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  return { text: result, applied: kept };
}

function reviewNotes(text) {
  return REVIEW_SIGNALS.filter(({ pattern }) => pattern.test(text)).map(({ note }) => note);
}

/** Fixtures whose meaning changes rather than whose shape changes, so a human reads them. */
const REVIEW_SIGNALS = [
  {
    pattern: /contribute\s*[:(]/,
    note: "contributes keyframes: a wrapper here is now a diagnostic",
  },
  { pattern: /plugin-contribution/, note: "asserts a plugin-contribution rule id" },
  { pattern: /stops-shape|property-stops-wrapper/, note: "asserts a leaf-shape rule id" },
];

function offenders(files) {
  return files.filter((file) =>
    WRAPPER_AUTHORING.test(codeOnly(readFileSync(path.join(REPO_ROOT, file), "utf8"))),
  );
}

const files = candidates();

if (options.check) {
  const remaining = offenders(files);
  if (remaining.length === 0) {
    console.log(`No authored wrapper remains across ${files.length} scanned files.`);
    process.exit(0);
  }
  console.log(`${remaining.length} file(s) still author the retired wrapper:`);
  for (const file of remaining) console.log(`  ${file}`);
  process.exit(1);
}

const changed = [];
const totals = { wrapper: 0, hold: 0, path: 0 };
const review = new Map();

for (const file of files) {
  const absolute = path.join(REPO_ROOT, file);
  const text = readFileSync(absolute, "utf8");
  if (!text.includes("stops")) continue;

  const { edits, notes } = collect(file, text);
  if (edits.length === 0) continue;

  const { text: next, applied } = apply(text, edits);
  if (next === text) continue;

  const counts = { wrapper: 0, hold: 0, path: 0 };
  for (const edit of applied) counts[edit.kind] += 1;
  for (const kind of Object.keys(totals)) totals[kind] += counts[kind];

  changed.push({ file, counts });
  const concerns = [...notes, ...reviewNotes(text)];
  if (concerns.length > 0) review.set(file, [...new Set(concerns)]);
  if (options.write) writeFileSync(absolute, next);
}

const remaining = offenders(files);

const lines = [
  `## Authored leaf migration (${options.write ? "applied" : "dry run"})`,
  "",
  `- scanned: **${files.length}** files under ${ROOTS.join(", ")}`,
  `- rewritten: **${changed.length}** files`,
  `- wrapper leaves unwrapped: **${totals.wrapper}**`,
  `- hold helpers made static: **${totals.hold}**`,
  `- authored paths corrected: **${totals.path}**`,
  `- wrapper authoring left (LF-16): **${remaining.length}**`,
  "",
];

if (changed.length > 0) {
  lines.push("### Files rewritten", "");
  for (const { file, counts } of changed)
    lines.push(`- \`${file}\`: ${counts.wrapper} leaf, ${counts.hold} hold, ${counts.path} path`);
  lines.push("");
}

if (review.size > 0) {
  lines.push(
    "### Read these before trusting a green",
    "",
    "Shape migrated mechanically, meaning did not:",
    "",
  );
  for (const [file, concerns] of review) lines.push(`- \`${file}\`: ${concerns.join("; ")}`);
  lines.push("");
}

if (remaining.length > 0) {
  lines.push("### Still authoring the retired wrapper", "");
  for (const file of remaining) lines.push(`- \`${file}\``);
  lines.push("", "Not single-property wrappers. Each needs a decision, not a rule.", "");
}

console.log(lines.join("\n"));

if (options.write && changed.length > 0)
  console.log("Run `npm run format` next: this writes source ranges, not formatted output.");
