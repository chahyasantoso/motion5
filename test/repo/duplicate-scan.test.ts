import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
  compareDuplicates,
  findDuplicates,
  functionsOf,
  main,
} from "../../scripts/duplicate-scan.mjs";

async function withTree<T>(
  files: Readonly<Record<string, string>>,
  baseline: readonly string[],
  use: (tree: string, baselineUrl: URL) => Promise<T>,
): Promise<T> {
  const tree = await mkdtemp(join(tmpdir(), "gerak-duplicates-"));
  try {
    for (const [path, source] of Object.entries(files)) {
      await mkdir(join(tree, path, ".."), { recursive: true });
      await writeFile(join(tree, path), `${source}\n`);
    }
    const baselineFile = join(tree, "baseline.json");
    await writeFile(baselineFile, JSON.stringify(baseline));
    return await use(tree, pathToFileURL(baselineFile));
  } finally {
    await rm(tree, { recursive: true, force: true });
  }
}

const SHARED = "export function twice(n: number): number {\n  return n * 2; // doubled\n}";
const SPACED = "/** Doubles. */\nfunction twice(n: number): number { return n * 2; }";
const OTHER = "export function twice(n: number): number {\n  return n + n + 1;\n}";

describe("duplicate scan", () => {
  it("executes the shipped scanner against the current tree and its baseline", async () => {
    expect(await main()).toBe(0);
  });

  it("reads function declarations and const arrows, ignoring comments and spacing", () => {
    const read = functionsOf(
      "// note\nexport const half = (n: number) => n / 2;\nfunction twice(n) {\n  return n * 2;\n}\nconst nested = 1;",
    );
    expect(read.map((each) => each.name)).toEqual(["half", "twice"]);
    expect(functionsOf(SHARED)[0]?.body).toBe(functionsOf(SPACED)[0]?.body);
  });

  it("refuses a new duplicate across two packages", async () => {
    await withTree(
      { "packages/a/src/x.ts": SHARED, "packages/b/src/y.ts": SPACED },
      [],
      async (tree, baseline) => {
        expect(await findDuplicates(tree)).toEqual([
          "twice: packages/a/src/x.ts, packages/b/src/y.ts",
        ]);
        expect(await main(tree, baseline)).toBe(1);
      },
    );
  });

  it("allows the same name with a different body, and a copy inside one package", async () => {
    await withTree(
      {
        "packages/a/src/x.ts": SHARED,
        "packages/b/src/y.ts": OTHER,
        "packages/a/src/z.ts": SHARED,
      },
      [],
      async (tree, baseline) => {
        expect(await findDuplicates(tree)).toEqual([]);
        expect(await main(tree, baseline)).toBe(0);
      },
    );
  });

  it("passes a duplicate the baseline lists and refuses a baseline line the tree no longer holds", async () => {
    const line = "twice: packages/a/src/x.ts, packages/b/src/y.ts";
    await withTree(
      { "packages/a/src/x.ts": SHARED, "packages/b/src/y.ts": SPACED },
      [line],
      async (tree, baseline) => expect(await main(tree, baseline)).toBe(0),
    );
    await withTree(
      { "packages/a/src/x.ts": SHARED, "packages/b/src/y.ts": OTHER },
      [line],
      async (tree, baseline) => {
        expect(await main(tree, baseline)).toBe(1);
        expect(compareDuplicates([], [line])).toEqual({ added: [], stale: [line] });
      },
    );
  });
});
