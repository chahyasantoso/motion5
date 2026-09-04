import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const scannedRoot = "packages/core/src";
const scannedExtensions = [".ts", ".tsx", ".md"];
/**
 * The largest a scanned file may be, in bytes, and a measurement rather than a taste.
 *
 * A contents read through the GitHub API is whole-file or prefix. There is no offset, no line
 * window, and no second call that returns the part the first one dropped, so a file past the
 * response cap loses its tail to every reader working without a local checkout. Three reads bound
 * that cap: `docs/IMPLEMENTATION-PLAN.md` at 46,466 bytes and
 * `packages/core/src/runtime/project-runtime.ts` at 87,615 both arrived whole, and that same source
 * file at 103,657 truncated inside a docblock, taking `#assertLive` with it. So the cap sits above
 * 87,615 and at or below 103,657 on dense source, which is the side of it this budget is about.
 *
 * The prose floor is higher than this docblock used to record. It named `docs/SESSION-STATUS.md` at
 * 83,883; that file reached 99,180 bytes before issue #284 replaced it, and that revision arrived
 * whole too, which `packages/core/test/unit/scripts/session-status-shape.test.ts` also records. It
 * does not raise this number. Dense TypeScript spends more tokens per byte than prose, so a
 * markdown read surviving at 99,180 is no evidence that a source file would, and moving the budget
 * on evidence from the other side of it is the raise-it-to-make-a-file-fit refused below.
 *
 * The number is bounded from both sides rather than chosen. It is below the largest size measured
 * to survive a read, because the cap is a response limit rather than a byte limit and a source
 * file's effective ceiling is therefore lower than a markdown file's. It is above the largest file
 * in this tree, `packages/core/src/runtime/project-runtime.ts` at 47,200 bytes, because a budget
 * that fails a file nobody has trouble reading buys churn rather than readability.
 *
 * Every size named above is measured, and none of them is gated. The two `project-runtime.ts`
 * figures are historical: they bound the cap at the ref they were taken on, and #269, #270 and #271
 * have since split that file to 47,200. The lower bound was `graph/ir.ts` at 45,240 until #275 took
 * it to 40,538 and `project-runtime.ts` became the largest source here. Nothing checks a
 * measurement written in prose against the tree it measures, which is how all three drifted without
 * a red run, so a reader who needs a current size reads the tree rather than this paragraph.
 *
 * A sister doc is held to it too, and markdown under the scanned root is in scope for that reason:
 * a rule that moves a file's reasoning into a sibling and budgets one half of the pair relocates
 * the truncation rather than removing it.
 *
 * Raising it to make a file fit is not a fix, and this is not a style rule. See ADR-008 and
 * docs/AI-EDIT-WORKFLOW.md.
 */
export const READ_BUDGET_BYTES = 60_000;
/**
 * The size at which a source owes its private reasoning to a sibling document.
 *
 * Half the budget, which is a choice about headroom rather than a measured cap: a file at the
 * trigger can double its prose before it reaches the budget and one over it cannot. What the rule
 * buys is the pair. Two files that each arrive whole replace one that does not, and the document is
 * the better first read, because it hands over the member list, so a source read that truncates
 * after it is no longer silently dangerous.
 *
 * `x.ts` implies `x.md` beside it, by swapping one extension, so a reader holding a source path
 * already holds the document path, with no index, no registry and no naming decision per file.
 * docs/AI-EDIT-WORKFLOW.md owns the partition and the mirror rules that follow from this.
 */
export const SISTER_DOC_TRIGGER_BYTES = 30_000;
/**
 * Every file over budget today, with the size it may not exceed and the issue that removes it.
 *
 * Empty, and kept rather than deleted with its last entry. `runtime/project-runtime.ts` is the one
 * file this list ever held, and the slice that moved its private reasoning into a sister doc
 * brought it under budget, so its entry is gone rather than lowered.
 *
 * A ceiling rather than a bare path, because ADR-008 names a non-shrinking file allowlist as a gate
 * that can be green while the thing it exists to catch is still broken, and it is right about that.
 * `ceiling` is the file's exact size when it was recorded, so a waived file may shrink and may not
 * grow, and the slice that shrinks it lowers the number in the same commit.
 *
 * There is no removal date, and that is a decision rather than an omission. A date does not shrink
 * a file. It fails the build on a morning nobody picked, for a tree that may have been improving
 * the whole time, and it is satisfied by editing the date, so it reports the calendar rather than
 * the tree.
 */
export const READ_BUDGET_EXCEPTIONS = [];
/**
 * Every source over the sister doc trigger that predates the rule, and the issue that clears it.
 *
 * An entry says this file owes a sister doc and does not have one yet. A file may only leave the
 * list, and it leaves by gaining its document, which makes this a ratchet on a count rather than an
 * allowlist on a size.
 *
 * The teeth are the other direction. An entry the tree no longer needs is itself a violation, so a
 * file that gained its document, shrank under the trigger, or stopped existing fails the scan by
 * carrying a stale entry. That is what ADR-008's objection to an allowlist actually asks for, and
 * it is stronger than a date, because a date cannot tell whether the work happened.
 *
 * Empty, and kept rather than deleted with its last entry, exactly as `READ_BUDGET_EXCEPTIONS` is.
 * Every source that predated the rule now keeps its private reasoning in a sibling document, which
 * is issue #267's stated exit condition, and the next file to cross the trigger gets an entry here
 * rather than a new mechanism.
 */
export const SISTER_DOC_PENDING = [];
const MEMBER_DECLARATION = /^[ \t]*(?:readonly[ \t]+)?(#[A-Za-z][\w$]*)\b/;
const TYPE_DECLARATION = /^[ \t]*(?:export[ \t]+)?(?:type|interface)[ \t]+([A-Za-z][\w$]*)\b/;
const LOCAL_TYPE_DECLARATION = /^[ \t]*(?:type|interface)[ \t]+([A-Za-z][\w$]*)\b/;
const VALUE_DECLARATION =
  /^[ \t]*(?:export[ \t]+)?(?:default[ \t]+)?(?:async[ \t]+)?(?:function|class|const|let|var|enum)[ \t]+([A-Za-z][\w$]*)\b/;
const LOCAL_VALUE_DECLARATION =
  /^[ \t]*(?:async[ \t]+)?(?:function|class|const|let|var|enum)[ \t]+([A-Za-z][\w$]*)\b/;
const MEMBER_HEADING = /^## (.+?)[ \t]*$/;
export async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (scannedExtensions.includes(extname(entry.name))) files.push(path);
  }
  return files;
}
function relative(path, base) {
  return path.slice(base.length + 1).replaceAll("\\", "/");
}
/** The sibling document one source keeps its reasoning in, by swapping one extension. */
export function sisterDocOf(file) {
  return `${file.slice(0, file.length - extname(file).length)}.md`;
}
export function findException(file, exceptions = READ_BUDGET_EXCEPTIONS) {
  return exceptions.find((candidate) => candidate.path === file);
}
/**
 * What one file of a known size costs, answered against the budget or against its own waiver.
 *
 * Pure, and separate from the walk, so a case can plant a size rather than a file: every question
 * this answers is a question about a byte count, and a size is the one thing a walk of a real tree
 * makes awkward to state exactly. It takes no clock, because nothing it decides depends on one.
 *
 * The waiver list is a parameter with the shipped list as its default, because the shipped list is
 * empty now and a case about the waiver mechanism would otherwise have nothing to ask.
 *
 * A waived file is held to its ceiling and never to the budget, and the refusal names the ceiling
 * it crossed rather than the budget it has not reached yet. That is the message which tells a
 * reader the file grew, and growing is the only thing a waiver forbids.
 */
export function checkSize(file, size, exceptions = READ_BUDGET_EXCEPTIONS) {
  const exception = findException(file, exceptions);
  if (exception === undefined) {
    if (size <= READ_BUDGET_BYTES) return undefined;
    return `${file}: ${size} bytes is over the ${READ_BUDGET_BYTES} byte read budget`;
  }
  if (size <= exception.ceiling) return undefined;
  const detail = `over its recorded ceiling of ${exception.ceiling} bytes`;
  return `${file}: ${size} bytes is ${detail}, see issue #${exception.issue}`;
}
/**
 * Every name this source declares, mapped to the line it is declared on.
 *
 * Anchored to the start of a line rather than matched anywhere, because a private member is used
 * far more often than it is declared and every use is prefixed by the object it is read through.
 * That is what makes the answer a declaration order rather than a first-mention order, and
 * `#mountNode` is the member that proves the difference: `mount` calls it one line above its own
 * declaration.
 *
 * A `#` member and a type are not the whole of what a file declares, and the four sources that were
 * still owed a document kept most of their reasoning on plain `function` and `const` declarations
 * rather than on `#` members: at the top level, and inside the one function that owns them, so those
 * are declarations here too. Exported or not, because a heading may name an exported member that
 * left its summary line in the source and moved only the argument.
 */
export function declarations(source) {
  const found = new Map();
  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match =
      MEMBER_DECLARATION.exec(line) ?? TYPE_DECLARATION.exec(line) ?? VALUE_DECLARATION.exec(line);
    if (match !== null && !found.has(match[1])) found.set(match[1], index);
  }
  return found;
}
/** Every member a sister doc claims, in order. Level two only, because a preamble is prose. */
export function headings(doc) {
  const named = [];
  for (const line of doc.split("\n")) {
    const match = MEMBER_HEADING.exec(line);
    if (match !== null) named.push(match[1]);
  }
  return named;
}
/**
 * Every declaration this source keeps to itself that still carries a docblock.
 *
 * A private member, a file-local type, and a `function` or `const` the module does not export,
 * including one a single function owns as a closure, which is where a module's densest reasoning
 * actually sits. Without that third question the check was class-shaped, and a mirrored module that
 * kept every docblock in place passed the one check bought to prove the source is empty, which is
 * the proxy ADR-008 refuses: green while the thing it exists to catch is untouched.
 *
 * The exported surface is deliberately not here. TypeScript carries an exported docblock into the
 * declaration file and into editor hover, so moving one would delete an API doc rather than
 * relocate it. That is why this asks `LOCAL_VALUE_DECLARATION` rather than the export-tolerant
 * `VALUE_DECLARATION` that `declarations` asks, which is the same split `LOCAL_TYPE_DECLARATION`
 * already draws for a type: a heading may name an exported member, and an exported member may still
 * keep its docblock.
 *
 * A comment explaining the statement on the next line is not a docblock either, and no heading in
 * the mirror owns one. A `//` block above a declaration is invisible here for the same reason, and
 * that is a named gap rather than a claim: widening this to leading `//` runs would flag every
 * `eslint-disable`-shaped line in the tree, and a check total on the shape it claims is worth more
 * than one noisy on two.
 */
export function docblocked(source) {
  const members = [];
  const lines = source.split("\n");
  for (let index = 1; index < lines.length; index += 1) {
    if (!lines[index - 1].trimEnd().endsWith("*/")) continue;
    const line = lines[index];
    const match =
      MEMBER_DECLARATION.exec(line) ??
      LOCAL_TYPE_DECLARATION.exec(line) ??
      LOCAL_VALUE_DECLARATION.exec(line);
    if (match !== null) members.push(match[1]);
  }
  return members;
}
/**
 * Whether one source and its sister doc still describe the same file.
 *
 * Three questions, and none of them is whether the prose is true. The two name each other, every
 * heading resolves to something the source declares, and the headings are in declaration order, so
 * a reader can hold the two side by side. Then the one-directional half that makes the move total:
 * a mirrored source carries no private docblock at all, so there is no second place for the
 * reasoning to be and therefore nothing for the document to drift against.
 *
 * What this cannot see is a heading whose prose quietly stopped being true. That is the residual
 * risk of the rule and it is not claimed away here.
 */
export function checkMirror(file, source, doc) {
  const sister = sisterDocOf(file);
  const pointer = `// Docs: ./${basename(sister)}`;
  if (doc === undefined) {
    const trigger = `over the ${SISTER_DOC_TRIGGER_BYTES} byte sister doc trigger`;
    return [`${file}: ${trigger} with no ${sister}`];
  }
  const violations = [];
  if (!source.includes(pointer))
    violations.push(`${file}: does not name its sister doc as ${pointer}`);
  const declared = declarations(source);
  let previous = -1;
  for (const heading of headings(doc)) {
    const line = declared.get(heading);
    if (line === undefined) {
      violations.push(`${sister}: ${heading} names nothing the source declares`);
      continue;
    }
    if (line < previous) violations.push(`${sister}: ${heading} breaks the declaration order`);
    previous = line;
  }
  for (const member of docblocked(source))
    violations.push(`${file}: ${member} carries a docblock its sister doc owns`);
  return violations;
}
/**
 * Whether one pending entry is still needed, which is the ratchet rather than the waiver.
 *
 * Every answer other than undefined names an entry to delete rather than a file to fix, which is
 * the property a removal date does not have.
 */
export function checkPending(entry, mirrored, size) {
  if (size === undefined) return `${entry.path}: no such file`;
  const stale = `no longer needs its pending entry, see issue #${entry.issue}`;
  if (mirrored) return `${entry.path}: has a sister doc and ${stale}`;
  if (size <= SISTER_DOC_TRIGGER_BYTES) return `${entry.path}: is under the trigger and ${stale}`;
  return undefined;
}
export async function scan(
  scanRoot = root,
  exceptions = READ_BUDGET_EXCEPTIONS,
  pending = SISTER_DOC_PENDING,
) {
  const base = join(scanRoot, "packages", "core", "src");
  const files = await walk(base);
  if (files.length === 0) return [`${scannedRoot}: the read budget scan found no source files`];
  const violations = [];
  const held = new Map();
  for (const path of files) {
    const file = `${scannedRoot}/${relative(path, base)}`;
    const size = (await stat(path)).size;
    held.set(file, { path, size });
    const violation = checkSize(file, size, exceptions);
    if (violation !== undefined) violations.push(violation);
  }
  const owed = new Set(pending.map((entry) => entry.path));
  for (const [file, { path, size }] of held) {
    if (extname(file) === ".md") continue;
    const mirrored = held.get(sisterDocOf(file));
    if (mirrored === undefined && (size <= SISTER_DOC_TRIGGER_BYTES || owed.has(file))) continue;
    const source = await readFile(path, "utf8");
    const doc = mirrored === undefined ? undefined : await readFile(mirrored.path, "utf8");
    violations.push(...checkMirror(file, source, doc));
  }
  for (const entry of pending) {
    const mirrored = held.has(sisterDocOf(entry.path));
    const violation = checkPending(entry, mirrored, held.get(entry.path)?.size);
    if (violation !== undefined) violations.push(violation);
  }
  for (const exception of exceptions)
    if (!held.has(exception.path)) violations.push(`${exception.path}: no such file`);
  return violations;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await scan();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else console.log("read budget scan passed");
}
