import { describe, expect, it } from "vitest";
import { unreachable } from "../../src/lang/exhaustive";
import {
  validateTrackDefinition,
  type TrackValidationResult,
} from "../../src/contract/validate-v5";
import type { TrackDefinition } from "../../src/contract/v5";

const VALID_TRACK: TrackDefinition = {
  id: "arm",
  keyframes: {
    style: {
      values: {
        opacity: [
          { p: 0, v: 0 },
          { p: 1, v: 1 },
        ],
      },
    },
  },
};

function read(result: TrackValidationResult): TrackDefinition {
  switch (result.kind) {
    case "accepted":
      return result.value;
    case "refused":
      throw new TypeError(result.diagnostics[0].message);
    default:
      return unreachable(result);
  }
}

describe("track validation uses one Outcome discriminant", () => {
  it("makes accepted values and refused diagnostics mutually exclusive", () => {
    const accepted = validateTrackDefinition(VALID_TRACK, "track");
    expect(accepted.kind).toBe("accepted");
    expect(read(accepted)).not.toBe(VALID_TRACK);
    expect("valid" in accepted).toBe(false);

    const refused = validateTrackDefinition({ id: "" }, "track");
    expect(refused.kind).toBe("refused");
    expect(refused.diagnostics.length).toBeGreaterThan(0);
    expect("value" in refused).toBe(false);
    expect("valid" in refused).toBe(false);
  });

  it("refuses a foreign validation kind at the runtime boundary", () => {
    const foreign = { kind: "deferred" } as unknown as TrackValidationResult;
    expect(() => read(foreign)).toThrow(TypeError);
    expect(() => read(foreign)).toThrow(/Unhandled variant/);
  });

  it("requires readers to decide every validation outcome", () => {
    type Widened = TrackValidationResult | { readonly kind: "deferred" };
    const readWidened = (result: Widened): TrackDefinition => {
      switch (result.kind) {
        case "accepted":
          return result.value;
        case "refused":
          throw new TypeError(result.diagnostics[0].message);
        default:
          // @ts-expect-error a widened kind is not decided by this reader.
          return unreachable(result);
      }
    };

    expect(typeof readWidened).toBe("function");
  });
});
