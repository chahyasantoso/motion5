import { describe, expect, it } from "vitest";
import { usePatch } from "../src/engine";

describe("React public surface (C2)", () => {
  it("exports a patch hook from the engine entry", () => {
    expect(usePatch).toBeTypeOf("function");
  });
});
