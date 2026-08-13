import { describe, it, expect } from "vitest";

describe("red-green formatting signal", () => {
  it("stays red for behavioral reasons", () => {
    expect("red").toBe("green");
  });
});
