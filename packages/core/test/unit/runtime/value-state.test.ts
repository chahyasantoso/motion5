import { describe, expect, it } from "vitest";
import { AUTHORED, LIVE, buildOwed } from "../../../src/runtime/value-state";

/**
 * Issue #443, phase A step 4: the state one live write leaves, as a closed union.
 *
 * The legacy mask/animated pair retired with `overrideValues`. What survives is the question every
 * commit derivation asks: does a replacement owe a build even when its compiled inputs compare
 * equal? An authored Track does not; a whole-value live overlay does, because nothing else clears
 * it.
 */
describe("the value state one live write leaves is a union rather than a field", () => {
  it("answers the build question from the two reachable states and freezes both", () => {
    expect(AUTHORED.kind).toBe("authored");
    expect(LIVE.kind).toBe("written");
    expect(buildOwed(AUTHORED)).toBe(false);
    expect(buildOwed(LIVE)).toBe(true);
    expect(Object.isFrozen(AUTHORED)).toBe(true);
    expect(Object.isFrozen(LIVE)).toBe(true);
  });
});
