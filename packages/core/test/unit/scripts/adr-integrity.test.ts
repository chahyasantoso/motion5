import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * A number names exactly one record, and a link to one resolves.
 *
 * ADR-093 decided both halves and neither had a mechanism. `docs/DECISIONS.md` carried a second,
 * shorter ADR-051 beside `docs/ADR-051-derived-solver-membership.md` for three weeks, and what let it
 * survive is that nothing owned the claim: two files answered one number, they did not contradict
 * each other, and one of them held a paragraph the other did not. Issue #441 is that the check is
 * cheap and absent, in a directory whose extraction slice hand-wrote thirty-eight relative links.
 *
 * Filename and link resolution rather than prose, which is what keeps this inside ADR-008's family
 * beside the boundary scan. It makes no claim about whether a record is correct, only that a number
 * resolves to one file and that a link resolves to a file at all. See ADR-093 and ADR-095.
 */

const DOCS = fileURLToPath(new URL("../../../../../docs/", import.meta.url));
const RECORD = /^ADR-(\d{3})-[a-z0-9-]+\.md$/;
const RECORD_LINK = /\]\((\.\/ADR-[^)]*)\)/g;
const MARKDOWN = /\.md$/;
const RELATIVE = "./";

/** The top-level files of `docs/`, which is where a record lives and the only place one may. */
async function docNames(): Promise<readonly string[]> {
  const entries = await readdir(DOCS, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

describe("a decision record is one file, and a link to one resolves", () => {
  it("names every record by its number and title, with no second file for a number", async () => {
    const names = (await docNames()).filter((name) => name.startsWith("ADR-"));
    const numbers: number[] = [];
    for (const name of names) {
      const match = RECORD.exec(name);
      expect(match, `${name} is named ADR-nnn-title.md`).not.toBeNull();
      numbers.push(Number(match?.[1]));
    }
    numbers.sort((left, right) => left - right);

    expect(numbers.length).toBeGreaterThan(0);
    expect(new Set(numbers).size, "one file per ADR number").toBe(numbers.length);
    // Contiguous from one, so a record cannot be written under a number the directory skipped and a
    // citation cannot land on a gap.
    expect(numbers).toEqual(numbers.map((_number, index) => index + 1));
  });

  it("resolves every record link a document in this directory writes", async () => {
    const names = await docNames();
    const files = new Set(names);
    const dangling: string[] = [];
    for (const name of names.filter((entry) => MARKDOWN.test(entry))) {
      const text = await readFile(join(DOCS, name), "utf8");
      for (const match of text.matchAll(RECORD_LINK)) {
        const target = match[1] ?? "";
        // An anchor names a position inside a file rather than a file, so the path is what resolves.
        const path = target.slice(RELATIVE.length).split("#")[0] ?? "";
        if (!files.has(path)) dangling.push(`${name} -> ${target}`);
      }
    }
    expect(dangling).toEqual([]);
  });
});
