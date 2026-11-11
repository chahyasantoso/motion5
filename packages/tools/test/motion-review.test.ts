import { describe, expect, it } from "vitest";
import { parseReviewArgs, printReview, type ReviewResult } from "../src/page/review";

describe("motion:review arguments", () => {
  it("need selectors and an end, and spread six frames over the run by default", () => {
    expect(parseReviewArgs(["timing.html", "--to", "3000"]).kind).toBe("usage");
    expect(parseReviewArgs(["timing.html", "--watch", ".a", "--to", "3000"])).toMatchObject({
      kind: "ok",
      watch: [".a"],
      to: 3000,
      at: [0, 608, 1200, 1808, 2400, 3000],
    });
    expect(
      parseReviewArgs(["timing.html", "--watch", ".a", "--to", "3000", "--at", "100,200"]),
    ).toMatchObject({
      at: [100, 200],
    });
  });

  it("asks for the read-back only with --full", () => {
    const base = ["timing.html", "--watch", ".a", "--to", "3000"];
    expect(parseReviewArgs(base)).toMatchObject({ full: false });
    expect(parseReviewArgs([...base, "--full"])).toMatchObject({ full: true });
  });
});

describe("motion:review result", () => {
  const clean = {
    kind: "reviewed",
    findings: [],
    sheet: "/tmp/sheet.png",
    pageErrors: [],
  } as const;

  it("prints findings and the sheet only, in a few lines, by default", () => {
    const result: ReviewResult = { ...clean, full: false };
    expect(result).not.toHaveProperty("motion");
    const printed = printReview(result);
    expect(printed.split("\n").length).toBeLessThanOrEqual(12);
    expect(printed).toContain("/tmp/sheet.png");
    expect(printed).not.toContain("moves:");
  });

  it("adds the moves read back with --full", () => {
    const printed = printReview({ ...clean, full: true, motion: [".a: x 0 -> 10"] });
    expect(printed).toContain("moves:");
    expect(printed).toContain(".a: x 0 -> 10");
  });
});
