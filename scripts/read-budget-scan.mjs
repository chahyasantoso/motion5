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
 * file's effective ceiling is therefore lower than a markdown file's. It is above every file in
 * this tree, because a budget that fails a file nobody has trouble reading buys churn rather than
 * readability, and that half of it is gated rather than recorded: `checkSize` is what refuses a
 * file over it.
 *
 * The two `project-runtime.ts` figures are measured and historical, and none of them is gated: they
 * bound the cap at the ref they were taken on. No current size of anything in the tree is named
 * here any more. This paragraph used to record the largest source in this tree and its byte count,
 * and that sentence was wrong by up to 10,367 bytes across three slices, because nothing checks a
 * measurement written in prose against the tree it measures. A reader who needs a current size
 * reads the tree.
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
/**
 * Every mirrored pair whose source cites a decision in a comment, and the issue that moves it.
 *
 * An entry says this source still owes that move and has not made it yet. A file may only leave the
 * list, and it leaves by having those citations moved into the sister document that already owns
 * its private reasoning, which makes this the same ratchet on a count `SISTER_DOC_PENDING` already
 * is.
 *
 * The teeth are the other direction, for the same reason. An entry the tree no longer needs is
 * itself a violation, so a source that stopped citing anything in a comment, lost its sister
 * document, or stopped existing fails the scan by carrying a stale entry, and no date has to be
 * picked for it.
 *
 * `runtime/project-runtime.ts` is deliberately absent rather than listed with the rest. Issue
 * #362's first slice moved its thirty-four cited comment blocks into `project-runtime.md`, and this
 * list exists so the file cannot grow them back while the four below are still owed.
 */
export const CITATION_PENDING = [
  { path: "packages/core/src/contract/validate-v5.ts", issue: 362 },
  { path: "packages/core/src/domain/plugins.ts", issue: 362 },
  { path: "packages/core/src/engine.ts", issue: 362 },
  { path: "packages/core/src/graph/ir.ts", issue: 362 },
];
const MEMBER_DECLARATION = /^[ \t]*(?:readonly[ \t]+)?(#[A-Za-z][\w$]*)\b/;
const TYPE_DECLARATION = /^[ \t]*(?:export[ \t]+)?(?:type|interface)[ \t]+([A-Za-z][\w$]*)\b/;
const LOCAL_TYPE_DECLARATION = /^[ \t]*(?:type|interface)[ \t]+([A-Za-z][\w$]*)\b/;
const VALUE_DECLARATION =
  /^[ \t]*(?:export[ \t]+)?(?:default[ \t]+)?(?:async[ \t]+)?(?:function|class|const|let|var|enum)[ \t]+([A-Za-z][\w$]*)\b/;
const LOCAL_VALUE_DECLARATION =
  /^[ \t]*(?:async[ \t]+)?(?:function|class|const|let|var|enum)[ \t]+([A-Za-z][\w$]*)\b/;
const MEMBER_HEADING = /^## (.+?)[ \t]*$/;
/**
 * The three shapes a citation is written in, and nothing else.
 *
 * A decision record, an evidence case id or a plan slice id, and an issue or pull request number.
 * Each of them is provenance rather than an explanation, which is what makes a comment carrying one
 * member-level rationale by definition and the sister document its owner.
 *
 * The last two shapes are bounded rather than open. An evidence prefix is one or two letters and an
 * optional digit, which is the shape `evidence-case-ids.test.ts` already reads, so `UTF-8` and an
 * ISO date cannot match one: neither has a word boundary in front of its letters. An issue number
 * is at most five digits, so a six-digit hex colour is not read as issue #123456.
 */
const CITATION = /ADR-\d+|\b[A-Z]{1,2}\d*-\d+\b|#\d{1,5}(?!\d)/;
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
 * Every comment in this source that cites a decision, with the line the citation sits on.
 *
 * Standalone comment lines only: a line whose first characters are two slashes, and the lines of a
 * block comment that is not a docblock. A docblock is skipped whole, because the only docblocks a
 * mirrored source may still carry are the exported and public ones. TypeScript hands those to the
 * declaration file and to editor hover, so a citation in one is documentation a consumer reads, and
 * `docblocked` already refuses the private ones outright rather than reading them for provenance.
 * The two checks therefore partition the file instead of both answering for one comment.
 *
 * Measured rather than reasoned, and this is the mechanism the obvious one lost to. Widening
 * `docblocked` to leading comment runs sees none of the duplication that grew
 * `runtime/project-runtime.ts` back by 10,367 bytes, because none of those blocks led a
 * declaration: they sat inside member bodies, above a `return` and above a `const`. Every one of
 * them carried a citation.
 *
 * A comment trailing a statement on the same line is out of scope, and that is a named bound rather
 * than a claim. It explains the statement it sits on, which is the exemption the mirror preamble
 * already grants, and reading one would mean lexing strings and regular expressions to find out
 * whether two slashes start a comment at all. What this measures is the shape the duplication was
 * actually written in, which is a block of comment lines above a statement.
 */
export function citations(source) {
  const cited = [];
  const lines = source.split("\n");
  let block;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const opens = block === undefined && line.startsWith("/*");
    const kind = block ?? (opens ? (line.startsWith("/**") ? "doc" : "plain") : undefined);
    const reads = kind === undefined ? line.startsWith("//") : kind === "plain";
    const found = reads ? CITATION.exec(line) : null;
    if (found !== null) cited.push(`${found[0]} on line ${index + 1}`);
    if (line.includes("*/")) block = undefined;
    else if (opens) block = kind;
  }
  return cited;
}
/**
 * Whether a mirrored source still keeps provenance a comment cannot own.
 *
 * Its own function rather than a fourth question inside `checkMirror`, because it answers about the
 * source alone: the document it names is where the citation goes, not something to compare against.
 * Exported so a case can ask it in both directions, since a scan that matched nothing would refuse
 * every comment it was pointed at and be green against the refusal alone.
 */
export function checkCitations(file, source) {
  const sister = basename(sisterDocOf(file));
  return citations(source).map((cited) => `${file}: cites ${cited}, which ${sister} owns`);
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
/**
 * Whether one citation pending entry is still needed, which is the same ratchet one rule across.
 *
 * `cited` is how many citations the source still carries, and `undefined` is a file the tree does
 * not hold. Every answer other than undefined names an entry to delete rather than a file to fix.
 * An entry on a source with no sister document is stale for a different reason than one on a source
 * that cites nothing, and the refusal says which, because the two are fixed differently.
 */
export function checkCitationPending(entry, mirrored, cited) {
  if (cited === undefined) return `${entry.path}: no such file`;
  const stale = `no longer needs its pending entry, see issue #${entry.issue}`;
  if (!mirrored) return `${entry.path}: has no sister doc and ${stale}`;
  if (cited === 0) return `${entry.path}: cites nothing in a comment and ${stale}`;
  return undefined;
}
export async function scan(
  scanRoot = root,
  exceptions = READ_BUDGET_EXCEPTIONS,
  pending = SISTER_DOC_PENDING,
  citationPending = CITATION_PENDING,
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
  const owedCitations = new Set(citationPending.map((entry) => entry.path));
  const cited = new Map();
  for (const [file, { path, size }] of held) {
    if (extname(file) === ".md") continue;
    const mirrored = held.get(sisterDocOf(file));
    if (mirrored === undefined && (size <= SISTER_DOC_TRIGGER_BYTES || owed.has(file))) continue;
    const source = await readFile(path, "utf8");
    const doc = mirrored === undefined ? undefined : await readFile(mirrored.path, "utf8");
    violations.push(...checkMirror(file, source, doc));
    if (doc === undefined) continue;
    const found = checkCitations(file, source);
    cited.set(file, found.length);
    if (!owedCitations.has(file)) violations.push(...found);
  }
  for (const entry of pending) {
    const mirrored = held.has(sisterDocOf(entry.path));
    const violation = checkPending(entry, mirrored, held.get(entry.path)?.size);
    if (violation !== undefined) violations.push(violation);
  }
  for (const entry of citationPending) {
    const mirrored = held.has(sisterDocOf(entry.path));
    const counted = held.has(entry.path) ? (cited.get(entry.path) ?? 0) : undefined;
    const violation = checkCitationPending(entry, mirrored, counted);
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
