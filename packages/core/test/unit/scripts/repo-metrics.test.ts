import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  alwaysReadPaths,
  commentBytes,
  measure,
  missingAlwaysRead,
  scan,
} from "../../../../../scripts/repo-metrics.mjs";

const REPO = fileURLToPath(new URL("../../../../../", import.meta.url));

async function fixture(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-repo-metrics-"));
  for (const [path, contents] of Object.entries(files)) {
    await mkdir(join(root, path.split("/").slice(0, -1).join("/")), { recursive: true });
    await writeFile(join(root, path), contents, "utf8");
  }
  return root;
}

const READ_FIRST = [
  "# Agent instructions",
  "",
  "## Read these first, in this order",
  "",
  "1. [Status](docs/SESSION-STATUS.md) and again [status](./docs/SESSION-STATUS.md).",
  "2. [Rules](docs/RULES.md) beside [cost](docs/LIVE-EDIT-COST.md).",
  "",
  "## The rules that get broken most",
  "",
  "See [the plan](docs/IMPLEMENTATION-PLAN.md) when you need it.",
].join("\n");

const COUNTED_COMMENTS = ["// why", "/**", " * still why", " */"];
const ONE_MANDATORY = [
  "# Agent instructions",
  "",
  "## Read these first, in this order",
  "",
  "1. [Status](docs/SESSION-STATUS.md)",
];
const TWO_MANDATORY = [...ONE_MANDATORY, "2. [Rules](docs/RULES.md)"];

describe("repo metrics (S0)", () => {
  it("reads only what the read-first section makes mandatory", () => {
    expect(alwaysReadPaths(READ_FIRST)).toEqual([
      "AGENTS.md",
      "docs/SESSION-STATUS.md",
      "docs/RULES.md",
      "docs/LIVE-EDIT-COST.md",
    ]);
  });

  it("counts comment lines with their terminators and leaves the code alone", () => {
    const source = ["// why", "const a = 1; // trailing", "/**", " * still why", " */", ""].join(
      "\n",
    );
    const expected = COUNTED_COMMENTS.reduce((sum, line) => sum + Buffer.byteLength(line) + 1, 0);
    expect(commentBytes(source)).toBe(expected);
  });

  it("falls when a mandatory read becomes an on-demand one", async () => {
    const root = await fixture({
      "AGENTS.md": `${TWO_MANDATORY.join("\n")}\n`,
      "docs/SESSION-STATUS.md": "# Status\n",
      "docs/RULES.md": `${"#".repeat(64)}\n`,
    });
    try {
      const both = measure(root).alwaysReadBytes;
      await writeFile(join(root, "AGENTS.md"), `${ONE_MANDATORY.join("\n")}\n`, "utf8");
      expect(measure(root).alwaysReadBytes).toBeLessThan(both);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("names a mandatory read the tree does not hold", async () => {
    const root = await fixture({ "AGENTS.md": READ_FIRST, "docs/SESSION-STATUS.md": "# Status\n" });
    try {
      expect(missingAlwaysRead(root)).toEqual([
        "docs/RULES.md: named by AGENTS.md and not in the tree",
        "docs/LIVE-EDIT-COST.md: named by AGENTS.md and not in the tree",
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("measures the real repository without a violation", () => {
    expect(scan(REPO)).toEqual([]);
    const metrics = measure(REPO);
    expect(metrics.markdownBytes).toBeGreaterThan(0);
    expect(metrics.srcCommentBytes).toBeGreaterThan(0);
    expect(metrics.testOutputBytes).toBeGreaterThan(0);
  });
});
