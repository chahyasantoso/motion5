import { describe, expect, it } from "vitest";
import {
  MAX_COMMENT_LINES,
  RULES,
  blockViolations,
  checkBaseline,
  commentBlocks,
  scan,
  trackedSources,
  violationsOf,
} from "../../../../../scripts/comment-scan.mjs";

const THREE = "// one\n// two\n// three";
const FOUR = "// one\n// two\n// three\n// four";
const WIDE = ["// " + "x".repeat(80), "// " + "y".repeat(80), "// " + "z".repeat(80)].join("\n");

// One line per rule, in the shape the rule is about rather than the word it names, so a change to
// a rule has to change its own case.
const SAMPLES: Record<string, string> = {
  "issue-number": "// the guard landed beside pull request 403 (#403).",
  "decision-record": "// the record that owns this is ADR-095.",
  "issue-word": "// that issue is why the order matters here.",
  "phase-label": "// Phase 7 recorded the same shape.",
  "slice-label": "// this slice moved the reader.",
  "history-word": "// it previously read the grouped form.",
};

describe("comment scan (S5)", () => {
  it("holds a three-line comment and refuses a fourth line", () => {
    expect(violationsOf(THREE)).toEqual([]);
    expect(violationsOf(FOUR)).toEqual([
      `line 1: comment ${MAX_COMMENT_LINES + 1} lines, over the ${MAX_COMMENT_LINES} allowed`,
    ]);
  });

  it("refuses a comment over the character bound", () => {
    expect(violationsOf(WIDE)).toEqual(["line 1: comment 251 characters, over 200"]);
  });

  it("joins consecutive line comments into one block and keeps a closed block whole", () => {
    expect(commentBlocks(FOUR)).toHaveLength(1);
    expect(commentBlocks("/*\n * a\n * b\n */\nconst x = 1;")).toEqual([
      { start: 1, lines: ["/*", " * a", " * b", " */"] },
    ]);
  });

  it("reads no comment in a string that carries two slashes", () => {
    expect(violationsOf('const url = "https://example.com/a";')).toEqual([]);
  });

  for (const rule of RULES)
    it(`names the reference the ${rule.id} rule refuses`, () => {
      expect(blockViolations({ start: 1, lines: [SAMPLES[rule.id] ?? ""] })).toEqual([rule.reason]);
    });

  it("refuses a count over the baseline and a baseline left too high", () => {
    const counts = new Map([["a/src/x.ts", 4]]);
    expect(checkBaseline(counts, new Map([["a/src/x.ts", 3]]))).toEqual([
      "a/src/x.ts: 4 violations is over its baseline of 3",
    ]);
    expect(checkBaseline(counts, new Map())).toEqual([
      "a/src/x.ts: 4 violations and no baseline entry",
    ]);
    expect(checkBaseline(new Map(), new Map([["a/src/gone.ts", 9]]))).toEqual([
      "a/src/gone.ts: baseline entry of 9 names no source",
    ]);
    expect(checkBaseline(counts, new Map([["a/src/x.ts", 4]]))).toEqual([]);
  });

  it("scans source under a src directory and nothing else", () => {
    const files = trackedSources();
    expect(files.length).toBeGreaterThan(200);
    expect(files.every((path) => /(^|\/)src\/.*\.tsx?$/.test(path))).toBe(true);
    expect(files.some((path) => path.startsWith("packages/core/src/"))).toBe(true);
    expect(files.some((path) => path.startsWith("apps/"))).toBe(true);
  });

  it("holds the tree inside its own baseline", () => {
    expect(scan().violations).toEqual([]);
  });
});
