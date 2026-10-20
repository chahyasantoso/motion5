import { describe, expect, it } from "vitest";
import { derived, none, refused } from "../../src/contract/derivation";
import { diagnostic } from "../../src/contract/diagnostics";

declare module "../../src/contract/capability" {
  interface CapabilityMap {
    box: { readonly width: number; readonly height: number; readonly count?: number };
  }
}

describe("derive result constructors", () => {
  it("creates a frozen derived result", () => {
    const payload = Object.freeze({ width: 10, height: 20 });
    const result = derived("box", payload);

    expect(result).toEqual({
      status: "derived",
      capability: "box",
      payload,
    });
    expect(Object.isFrozen(result)).toBe(true);
  });

  it("creates a frozen refused result and rejects empty tuple at compile time", () => {
    const d = diagnostic("derivation-failure", "track.entry", "Refused", []);
    const result = refused([d]);

    expect(result).toEqual({
      status: "refused",
      diagnostics: [d],
    });
    expect(Object.isFrozen(result)).toBe(true);

    // @ts-expect-error empty tuple rejected at compile time
    refused([]);
  });

  it("provides a frozen none result", () => {
    expect(none).toEqual({ status: "none" });
    expect(Object.isFrozen(none)).toBe(true);
  });
});
