import { describe, expect, it } from "vitest";
import { parseReviewArgs } from "../src/page/review";

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
});
