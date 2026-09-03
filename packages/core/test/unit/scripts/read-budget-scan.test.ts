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
const PINNED = new Date("2026-09-03T00:00:00Z");
const AFTER_EXPIRY = new Date("2027-01-01T00:00:00Z");

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
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES, PINNED)).toBeUndefined();
    expect(checkSize(ORDINARY, READ_BUDGET_BYTES + 1, PINNED)).toContain("read budget");
  });

  it("RB-2: holds a waived file to its ceiling rather than to the budget", () => {
    const { ceiling } = waiver();
    expect(ceiling).toBeGreaterThan(READ_BUDGET_BYTES);
    expect(checkSize(WAIVED, ceiling, PINNED)).toBeUndefined();
    expect(checkSize(WAIVED, ceiling + 1, PINNED)).toContain("ceiling");
  });

  it("RB-3: refuses a waiver past its expiry even at the ceiling", () => {
    const { ceiling } = waiver();
    expect(checkSize(WAIVED, ceiling, AFTER_EXPIRY)).toContain("expired");
    expect(checkSize(WAIVED, 1, AFTER_EXPIRY)).toContain("expired");
  });

  it("RB-4: reports a planted file over budget through the shipped scan", async () => {
    const sizes = { [ORDINARY]: READ_BUDGET_BYTES + 1, [WAIVED]: 10 };
    const violations = await withPlanted(sizes, (planted) => scan(planted, PINNED));
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain(`${ORDINARY}: ${READ_BUDGET_BYTES + 1} bytes`);
  });

  it("RB-5: reports a waiver naming a file the tree does not hold", async () => {
    const violations = await withPlanted({ [ORDINARY]: 10 }, (planted) => scan(planted, PINNED));
    expect(violations).toEqual([`${WAIVED}: no such file`]);
  });

  it("RB-6: reports an empty scan rather than answering clean", async () => {
    const sizes = { "docs/README.md": 10 };
    const violations = await withPlanted(sizes, (planted) => scan(planted, PINNED));
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("found no source files");
  });

  it("RB-7: leaves the shipped tree clean at a pinned date", async () => {
    expect(await scan(undefined, PINNED)).toEqual([]);
  });

  it("RB-8: leaves the shipped tree clean today, until the waiver expires", async () => {
    expect(await scan()).toEqual([]);
  });
});
