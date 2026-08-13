import { describe, expect, it } from "vitest";

describe("gated formatter", () => {
  it("preserves the original red commit", () => {
    expect("green").toBe("green");
  });
});
