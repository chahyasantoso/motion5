import { describe, expect, it } from "vitest";
import {
  AUTHORED,
  LIVE_BOTH,
  LIVE_PARAM,
  LIVE_VALUES,
  buildOwed,
  liveOn,
  withLiveChannel,
  withoutLiveChannel,
} from "../../../src/runtime/value-state";

describe("the value state one live write leaves is a union rather than a field", () => {
  it("answers the build question from every overlay state and freezes all of them", () => {
    expect(AUTHORED.kind).toBe("authored");
    for (const state of [LIVE_VALUES, LIVE_PARAM, LIVE_BOTH]) {
      expect(state.kind).toBe("written");
      expect(buildOwed(state)).toBe(true);
      expect(Object.isFrozen(state)).toBe(true);
    }
    expect(buildOwed(AUTHORED)).toBe(false);
    expect(Object.isFrozen(AUTHORED)).toBe(true);
  });

  it("composes and drops one channel without moving the other", () => {
    expect(liveOn(AUTHORED, "values")).toBe(false);
    expect(withLiveChannel(AUTHORED, "values")).toBe(LIVE_VALUES);
    expect(withLiveChannel(LIVE_VALUES, "param")).toBe(LIVE_BOTH);
    expect(withLiveChannel(LIVE_PARAM, "values")).toBe(LIVE_BOTH);
    expect(withoutLiveChannel(LIVE_BOTH, "values")).toBe(LIVE_PARAM);
    expect(withoutLiveChannel(LIVE_BOTH, "param")).toBe(LIVE_VALUES);
    expect(withoutLiveChannel(LIVE_VALUES, "values")).toBe(AUTHORED);
    expect(withoutLiveChannel(AUTHORED, "param")).toBe(AUTHORED);
    expect(liveOn(LIVE_PARAM, "values")).toBe(false);
    expect(liveOn(LIVE_PARAM, "param")).toBe(true);
  });
});
