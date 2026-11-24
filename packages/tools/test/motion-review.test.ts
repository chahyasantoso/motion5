import { describe, expect, it } from "vitest";
import { parseReviewArgs, printReview, type ReviewResult } from "../src/page/review";

describe("gerak review arguments", () => {
  it("need selectors and an end, and leave the frames to be picked unless --at is given", () => {
    expect(parseReviewArgs(["timing.html", "--to", "3000"]).kind).toBe("usage");
    expect(parseReviewArgs(["timing.html", "--watch", ".a", "--to", "3000"])).toMatchObject({
      kind: "ok",
      watch: [".a"],
      to: 3000,
    });
    expect(parseReviewArgs(["timing.html", "--watch", ".a", "--to", "3000"])).not.toHaveProperty(
      "at",
    );
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

  it("parses --sizes and refuses invalid values or mixing with --size", () => {
    expect(
      parseReviewArgs([
        "timing.html",
        "--watch",
        ".a",
        "--to",
        "3000",
        "--sizes",
        "1440x900,390x844",
      ]),
    ).toMatchObject({
      kind: "ok",
      width: 1440,
      height: 900,
      sizes: [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ],
    });
    expect(
      parseReviewArgs([
        "timing.html",
        "--watch",
        ".a",
        "--to",
        "3000",
        "--size",
        "1280x720",
        "--sizes",
        "1440x900,390x844",
      ]).kind,
    ).toBe("usage");
    expect(
      parseReviewArgs(["timing.html", "--watch", ".a", "--to", "3000", "--sizes", "390x0"]).kind,
    ).toBe("usage");
    expect(
      parseReviewArgs([
        "timing.html",
        "--watch",
        ".a",
        "--to",
        "3000",
        "--sizes",
        "1440x900,1440x900",
      ]).kind,
    ).toBe("usage");
  });
});

describe("gerak review result", () => {
  const clean = {
    kind: "reviewed",
    findings: [],
    frames: ["0 start", "2992 end"],
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

  it("prints per-viewport findings and labelled sheets when viewports are present", () => {
    const printed = printReview({
      kind: "reviewed",
      full: false,
      findings: ["[390x844] p shows only 50% of its glyphs on the last frame"],
      frames: ["[1440x900] 0 start", "[390x844] 0 start"],
      sheet: "/tmp/sheet-1440x900.png",
      sheets: {
        "1440x900": "/tmp/sheet-1440x900.png",
        "390x844": "/tmp/sheet-390x844.png",
      },
      viewports: [
        {
          size: "1440x900",
          width: 1440,
          height: 900,
          findings: [],
          frames: ["0 start"],
          sheet: "/tmp/sheet-1440x900.png",
          pageErrors: [],
        },
        {
          size: "390x844",
          width: 390,
          height: 844,
          findings: ["p shows only 50% of its glyphs on the last frame"],
          frames: ["0 start"],
          sheet: "/tmp/sheet-390x844.png",
          pageErrors: [],
        },
      ],
      pageErrors: [],
    });
    expect(printed).toContain("[390x844] p shows only 50% of its glyphs on the last frame");
    expect(printed).toContain("frames (1440x900): 0 start");
    expect(printed).toContain("sheet (1440x900): /tmp/sheet-1440x900.png");
    expect(printed).toContain("frames (390x844): 0 start");
    expect(printed).toContain("sheet (390x844): /tmp/sheet-390x844.png");
  });
});
