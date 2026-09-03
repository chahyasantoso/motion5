import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const scannedRoot = "packages/core/src";
const scannedExtensions = [".ts", ".tsx"];
/**
 * The largest a scanned source file may be, in bytes, and a measurement rather than a taste.
 *
 * A contents read through the GitHub API is whole-file or prefix. There is no offset, no line
 * window, and no second call that returns the part the first one dropped, so a file past the
 * response cap loses its tail to every reader working without a local checkout. Three reads against
 * `8b17cce` bound that cap: `docs/IMPLEMENTATION-PLAN.md` at 46,466 bytes and
 * `docs/SESSION-STATUS.md` at 77,978 both arrived whole, and
 * `packages/core/src/runtime/project-runtime.ts` at 103,657 truncated inside a docblock, taking
 * `#assertLive` with it. The cap therefore sits above 77,978 and at or below 103,657.
 *
 * The number is bounded from both sides rather than chosen. It is below the largest size measured
 * to survive a read, because the cap is a response limit rather than a byte limit and dense
 * TypeScript spends more tokens per byte than prose, so a source file's effective ceiling is lower
 * than a markdown file's. It is above the largest file in this tree that is not the outlier,
 * `packages/core/src/graph/ir.ts` at 45,240 bytes, because a budget that fails a file nobody has
 * trouble reading buys churn rather than readability.
 *
 * Raising it to make a file fit is not a fix, and this is not a style rule. See ADR-008 and
 * docs/AI-EDIT-WORKFLOW.md.
 */
export const READ_BUDGET_BYTES = 60_000;
/**
 * Every file over budget today, with the size it may not exceed and the issue that removes it.
 *
 * A ceiling rather than a bare path, because ADR-008 names a non-shrinking file allowlist as a gate
 * that can be green while the thing it exists to catch is still broken, and it is right about that.
 * `ceiling` is the file's exact size when it was recorded, so a waived file may shrink and may not
 * grow, and the slice that splits it lowers the number in the same commit.
 *
 * There is no removal date, and that is a decision rather than an omission. A date does not shrink
 * a file. It fails the build on a morning nobody picked, for a tree that may have been improving the
 * whole time, and it is satisfied by editing the date, so it reports the calendar rather than the
 * tree. What a date guards against is a waiver that stalls, and the honest statement is that this
 * list does not prevent that: it prevents the file getting worse while it stalls, which is the part
 * a check can see. The waiver is deleted by the commit that brings the file under
 * `READ_BUDGET_BYTES`, and issue #267 is where that work is tracked.
 */
export const READ_BUDGET_EXCEPTIONS = [
  {
    path: "packages/core/src/runtime/project-runtime.ts",
    ceiling: 103_657,
    issue: 267,
  },
];
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
export function findException(file) {
  return READ_BUDGET_EXCEPTIONS.find((candidate) => candidate.path === file);
}
/**
 * What one file of a known size costs, answered against the budget or against its own waiver.
 *
 * Pure, and separate from the walk, so a case can plant a size rather than a file: every question
 * this answers is a question about a byte count, and a size is the one thing a walk of a real tree
 * makes awkward to state exactly. It takes no clock, because nothing it decides depends on one.
 *
 * A waived file is held to its ceiling and never to the budget, and the refusal names the ceiling
 * it crossed rather than the budget it has not reached yet. That is the message which tells a
 * reader the file grew, and growing is the only thing a waiver forbids.
 */
export function checkSize(file, size) {
  const exception = findException(file);
  if (exception === undefined) {
    if (size <= READ_BUDGET_BYTES) return undefined;
    return `${file}: ${size} bytes is over the ${READ_BUDGET_BYTES} byte read budget`;
  }
  if (size <= exception.ceiling) return undefined;
  const detail = `over its recorded ceiling of ${exception.ceiling} bytes`;
  return `${file}: ${size} bytes is ${detail}, see issue #${exception.issue}`;
}
export async function scan(scanRoot = root) {
  const base = join(scanRoot, "packages", "core", "src");
  const files = await walk(base);
  if (files.length === 0) return [`${scannedRoot}: the read budget scan found no source files`];
  const violations = [];
  const seen = new Set();
  for (const path of files) {
    const file = `${scannedRoot}/${relative(path, base)}`;
    seen.add(file);
    const violation = checkSize(file, (await stat(path)).size);
    if (violation !== undefined) violations.push(violation);
  }
  for (const exception of READ_BUDGET_EXCEPTIONS)
    if (!seen.has(exception.path)) violations.push(`${exception.path}: no such file`);
  return violations;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await scan();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else console.log("read budget scan passed");
}
