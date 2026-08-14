import { describe, expect, it } from "vitest";
import { usePatch } from "../src/index";

describe("React public surface (C2)", () => {
  it("exports a patch hook from the package entry", () => {
    expect(usePatch).toBeTypeOf("function");
  });
});
