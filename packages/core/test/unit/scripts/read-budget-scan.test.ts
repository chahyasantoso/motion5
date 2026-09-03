import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  READ_BUDGET_BYTES,
  checkSize,
  findException,
  scan,
  type ReadBudgetException,
} from "../../../../../scripts/read-budget-scan.mjs";

const WAIVED = "packages/core/src/runtime/project-runtime.ts";
const ORDINARY = "packages/core/src/runtime/graph-runtime.ts";

function waiver(): ReadBudgetException {
  const recorded = findException(WAIVED);
  if (recorded === undefined) throw new Error(`No recorded read-budget waiver for ${WAIVED}.`);
  return recorded;
}

/**
 * Plants a tree holding files of exactly the sizes one case is about, and nothing else.
 *
 * Sizes rather than sources, because every question this scan answers is a question about a byte
 * count and none of them is about what a file says. The tree is thrown away per case, so a case
 * that plants a file over budget cannot leak it into the next one.
 */
async function plantSizes(sizes: Record<string, number>): Promise<string> {
  const planted = await mkdtemp(join(tmpdir(), "motion5-read-budget-"));
  for (const [file, size] of Object.entries(sizes)) {
    const path = join(planted, ...file.split("/"));
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, "a".repeat(size));
  }
  return planted;
}

async function withPlanted<T>(
  sizes: Record<string, number>,
  use: (planted: string) => Promise<T>,
): Promise<T> {
  const planted = await plantSizes(sizes);
  try {
    return await use(planted);
  } finally {
    await rm(planted, { recursive: true, force: true });
  }
}

describe("read budget scan", () => {
  it("RB-1: passes a file at the budget and refuses the byte after it", () => {
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES)).toBeUndefined();
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES + 1)).toContain("read budget");
  });

  it("RB-2: holds a waived file to its ceiling rather than to the budget", () => {
    const { ceiling } = waiver();
    expect(ceiling).toBeGreaterThan(READ_BUDGET_BYTES);
    expect(checkSize(WAIVED, ceiling)).toBeUndefined();
    expect(checkSize(WAIVED, ceiling + 1)).toContain("ceiling");
  });

  // The refusal a waiver produces is about growth, and it says so. A waived file is over the budget
  // on every run, so a message naming the budget would report the number already recorded in the
  // waiver rather than the one that just moved, and a reader would have to diff two sizes to learn
  // which. It cites the issue that deletes the waiver, which is what the record carries now that no
  // date fails on its own.
  it("RB-3: names the ceiling a waived file crossed rather than the budget it is over", () => {
    const { ceiling, issue } = waiver();
    const refusal = checkSize(WAIVED, ceiling + 1);
    expect(refusal).toContain(`ceiling of ${ceiling} bytes`);
    expect(refusal).toContain(`issue #${issue}`);
    expect(refusal).not.toContain("read budget");
  });

  it("RB-4: reports a planted file over budget through the shipped scan", async () => {
    const sizes = { [ORDINARY]: READ_BUDGET_BYTES + 1, [WAIVED]: 10 };
    const violations = await withPlanted(sizes, (planted) => scan(planted));
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain(`${ORDINARY}: ${READ_BUDGET_BYTES + 1} bytes`);
  });

  it("RB-5: reports a waiver naming a file the tree does not hold", async () => {
    const violations = await withPlanted({ [ORDINARY]: 10 }, (planted) => scan(planted));
    expect(violations).toEqual([`${WAIVED}: no such file`]);
  });

  it("RB-6: reports an empty scan rather than answering clean", async () => {
    const sizes = { "docs/README.md": 10 };
    const violations = await withPlanted(sizes, (planted) => scan(planted));
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("found no source files");
  });

  // No pinned date beside it, and nothing left to pin. This case had a twin asserting the same
  // tree at the current date, which was the one case written to go red on a chosen morning. With
  // the expiry gone the two collapse into this one, and it stays green until a file grows.
  it("RB-7: leaves the shipped tree clean", async () => {
    expect(await scan()).toEqual([]);
  });
});
