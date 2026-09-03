import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  READ_BUDGET_BYTES,
  READ_BUDGET_EXCEPTIONS,
  SISTER_DOC_TRIGGER_BYTES,
  checkMirror,
  checkSize,
  scan,
  sisterDocOf,
  type ReadBudgetException,
  type SisterDocPending,
} from "../../../../../scripts/read-budget-scan.mjs";

const WAIVED = "packages/core/src/runtime/project-runtime.ts";
const ORDINARY = "packages/core/src/runtime/graph-runtime.ts";
const ORDINARY_DOC = sisterDocOf(ORDINARY);
const POINTER = "// Docs: ./graph-runtime.md\n";

/**
 * A waiver to ask questions of, planted rather than read off the shipped list.
 *
 * The shipped list is empty now, so the cases about the waiver mechanism have nothing to read. They
 * plant one instead, which is the same rig every other case here already uses: the mechanism is
 * what is under test, and the tree it happens to be empty for today is not.
 */
const PLANTED: ReadBudgetException = {
  path: WAIVED,
  ceiling: READ_BUDGET_BYTES + 6_019,
  issue: 267,
};
const PLANTED_WAIVER: readonly ReadBudgetException[] = [PLANTED];

/**
 * Plants a tree holding files of exactly the sizes or contents one case is about, and nothing else.
 *
 * A number is that many filler bytes, because every question the byte budget answers is a question
 * about a count and a size is the one thing a walk of a real tree makes awkward to state exactly. A
 * string is content, because the mirror questions are about what a file says. The tree is thrown
 * away per case, so a case that plants a file over budget cannot leak it into the next one.
 */
async function plant(files: Record<string, string | number>): Promise<string> {
  const planted = await mkdtemp(join(tmpdir(), "motion5-read-budget-"));
  for (const [file, content] of Object.entries(files)) {
    const path = join(planted, ...file.split("/"));
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, typeof content === "number" ? "a".repeat(content) : content);
  }
  return planted;
}

async function withPlanted<T>(
  files: Record<string, string | number>,
  use: (planted: string) => Promise<T>,
): Promise<T> {
  const planted = await plant(files);
  try {
    return await use(planted);
  } finally {
    await rm(planted, { recursive: true, force: true });
  }
}

async function violationsFor(files: Record<string, string | number>): Promise<string[]> {
  return withPlanted(files, (planted) => scan(planted, [], []));
}

function padded(prefix: string, size: number): string {
  return prefix + "a".repeat(size - prefix.length);
}

function doc(...named: readonly string[]): string {
  const sections = named.map((heading) => `## ${heading}\n\nWhy.\n`);
  return [`# ${ORDINARY}`, "", ...sections].join("\n");
}

const SOURCE = [
  "// Docs: ./graph-runtime.md",
  "type Local = { a: number };",
  "class C {",
  "  #first(): void {}",
  "  #second(): void {}",
  "}",
  "",
].join("\n");

describe("read budget scan", () => {
  it("RB-1: passes a file at the budget and refuses the byte after it", () => {
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES)).toBeUndefined();
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES + 1)).toContain("read budget");
  });

  it("RB-2: holds a waived file to its ceiling rather than to the budget", () => {
    expect(PLANTED.ceiling).toBeGreaterThan(READ_BUDGET_BYTES);
    expect(checkSize(WAIVED, PLANTED.ceiling, PLANTED_WAIVER)).toBeUndefined();
    expect(checkSize(WAIVED, PLANTED.ceiling + 1, PLANTED_WAIVER)).toContain("ceiling");
  });

  // The refusal a waiver produces is about growth, and it says so. A waived file is over the budget
  // on every run, so a message naming the budget would report the number already recorded in the
  // waiver rather than the one that just moved, and a reader would have to diff two sizes to learn
  // which. It cites the issue that deletes the waiver, which is what the record carries now that no
  // date fails on its own.
  it("RB-3: names the ceiling a waived file crossed rather than the budget it is over", () => {
    const refusal = checkSize(WAIVED, PLANTED.ceiling + 1, PLANTED_WAIVER);
    expect(refusal).toContain(`ceiling of ${PLANTED.ceiling} bytes`);
    expect(refusal).toContain(`issue #${PLANTED.issue}`);
    expect(refusal).not.toContain("read budget");
  });

  it("RB-4: reports a planted file over budget through the shipped scan", async () => {
    const files = {
      [ORDINARY]: padded(POINTER, READ_BUDGET_BYTES + 1),
      [ORDINARY_DOC]: doc(),
    };
    const violations = await violationsFor(files);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain(`${ORDINARY}: ${READ_BUDGET_BYTES + 1} bytes`);
  });

  it("RB-5: reports a waiver naming a file the tree does not hold", async () => {
    const violations = await withPlanted({ [ORDINARY]: 10 }, (planted) =>
      scan(planted, PLANTED_WAIVER, []),
    );
    expect(violations).toEqual([`${WAIVED}: no such file`]);
  });

  it("RB-6: reports an empty scan rather than answering clean", async () => {
    const violations = await violationsFor({ "docs/README.md": 10 });
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("found no source files");
  });

  // No pinned date beside it, and nothing left to pin. This case had a twin asserting the same tree
  // at the current date, which was the one case written to go red on a chosen morning. With the
  // expiry gone the two collapse into this one, and it stays green until a file grows, a mirror
  // drifts, or a pending entry stops being needed.
  it("RB-7: leaves the shipped tree clean, with nothing left waived", async () => {
    expect(READ_BUDGET_EXCEPTIONS).toEqual([]);
    expect(await scan()).toEqual([]);
  });

  it("RB-8: refuses a source over the sister doc trigger that has no document", async () => {
    const over = padded(POINTER, SISTER_DOC_TRIGGER_BYTES + 1);
    const alone = await violationsFor({ [ORDINARY]: over });
    expect(alone).toHaveLength(1);
    expect(alone[0]).toContain(`no ${ORDINARY_DOC}`);
    expect(await violationsFor({ [ORDINARY]: over, [ORDINARY_DOC]: doc() })).toEqual([]);
  });

  // The trigger is what makes the lookup unconditional for a reader: derive the path, look, and
  // absence means the source carries its own docs. A file under it owes nothing, the pointer line
  // included, which is why this one is planted as filler bytes rather than as content.
  it("RB-9: leaves a source under the trigger alone", async () => {
    expect(await violationsFor({ [ORDINARY]: SISTER_DOC_TRIGGER_BYTES })).toEqual([]);
  });

  it("RB-10: refuses a mirrored source that does not name its sister doc", () => {
    const unnamed = checkMirror(ORDINARY, SOURCE.replace(POINTER, ""), doc("#first"));
    expect(unnamed).toEqual([expect.stringContaining("does not name its sister doc")]);
    expect(checkMirror(ORDINARY, SOURCE, doc("#first"))).toEqual([]);
  });

  it("RB-11: refuses a heading naming nothing the source declares", () => {
    const absent = checkMirror(ORDINARY, SOURCE, doc("#third"));
    expect(absent).toEqual([expect.stringContaining("names nothing the source declares")]);
    expect(checkMirror(ORDINARY, SOURCE, doc("#second"))).toEqual([]);
  });

  // Order is the whole of what lets a reader hold the two files side by side, so reordering the
  // source without reordering the document is a failure rather than a style nit.
  it("RB-12: refuses headings that break the declaration order", () => {
    const reversed = checkMirror(ORDINARY, SOURCE, doc("#second", "#first"));
    expect(reversed).toEqual([expect.stringContaining("breaks the declaration order")]);
    expect(checkMirror(ORDINARY, SOURCE, doc("Local", "#first", "#second"))).toEqual([]);
  });

  // The one-directional half. This does not claim the document is complete, because completeness is
  // not decidable and a gate that pretends otherwise is the proxy ADR-008 refuses. It claims the
  // source is empty, which leaves no second place for the reasoning to be. The exported member in
  // this rig is what proves the partition: it keeps its docblock because a consumer reads it.
  it("RB-13: refuses a private member or local type still carrying a docblock", () => {
    const source = [
      "// Docs: ./graph-runtime.md",
      "/** Why. */",
      "type Local = { a: number };",
      "export interface Public {",
      "  /** Kept, because a consumer reads it. */",
      "  readonly a: number;",
      "}",
      "class C {",
      "  /** Why. */",
      "  #first(): void {}",
      "}",
      "",
    ].join("\n");
    const violations = checkMirror(ORDINARY, source, doc("Local", "#first"));
    expect(violations).toHaveLength(2);
    expect(violations[0]).toContain("Local");
    expect(violations[1]).toContain("#first");
    expect(checkMirror(ORDINARY, SOURCE, doc("Local", "#first"))).toEqual([]);
  });

  // Both halves of the pair, or the rule relocates the truncation instead of removing it.
  it("RB-14: budgets the sister doc as well as the source", async () => {
    const files = {
      [ORDINARY]: padded(POINTER, SISTER_DOC_TRIGGER_BYTES + 1),
      [ORDINARY_DOC]: READ_BUDGET_BYTES + 1,
    };
    const violations = await violationsFor(files);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain(`${ORDINARY_DOC}: ${READ_BUDGET_BYTES + 1} bytes`);
  });

  it("RB-15: reads only level two headings as member claims", () => {
    const lines = [`# ${ORDINARY}`, "", "### How to read this", "", "Prose.", ""];
    expect(checkMirror(ORDINARY, SOURCE, lines.join("\n"))).toEqual([]);
  });

  // The teeth of the pending list, and why it is a ratchet rather than an allowlist: an entry the
  // tree stopped needing fails the scan by itself, which is what a removal date cannot do.
  it("RB-16: refuses a pending entry the tree no longer needs", async () => {
    const pending: readonly SisterDocPending[] = [{ path: ORDINARY, issue: 267 }];
    const over = padded(POINTER, SISTER_DOC_TRIGGER_BYTES + 1);
    const needed = await withPlanted({ [ORDINARY]: over }, (p) => scan(p, [], pending));
    expect(needed).toEqual([]);
    const files = { [ORDINARY]: over, [ORDINARY_DOC]: doc() };
    const stale = await withPlanted(files, (p) => scan(p, [], pending));
    expect(stale).toEqual([expect.stringContaining("no longer needs its pending entry")]);
  });

  // Every source still owed a document is a module rather than a class, so a mirror that reads only
  // `#` members and types answers that each heading in a module's document names nothing declared.
  // The heading set is what a file declares, and a module declares functions and consts, including
  // the ones a single function owns, which is where a module's densest reasoning actually sits.
  it("RB-17: names what a module declares, not only what a class does", () => {
    const source = [
      "// Docs: ./graph-runtime.md",
      "const LIMIT = 1;",
      "export function run(): void {",
      "  const step = (): void => {};",
      "  step();",
      "}",
      "",
    ].join("\n");
    expect(checkMirror(ORDINARY, source, doc("LIMIT", "run", "step"))).toEqual([]);
    const reversed = checkMirror(ORDINARY, source, doc("run", "LIMIT"));
    expect(reversed).toEqual([expect.stringContaining("breaks the declaration order")]);
    expect(checkMirror(ORDINARY, source, doc("absent"))).toEqual([
      expect.stringContaining("names nothing the source declares"),
    ]);
  });
});
