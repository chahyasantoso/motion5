import { describe, expect, it } from "vitest";
import {
  assertAuthoredMotionId,
  assertAuthoredTrackId,
  parseQualifiedId,
  qualifyFreeTrack,
  qualifyMotionTrack,
} from "../../../src/graph/ids";

describe("qualified node ids", () => {
  it("qualifies motion and free tracks exactly once", () => {
    expect(qualifyMotionTrack("hero", "arm")).toEqual({
      kind: "motion",
      motionId: "hero",
      trackId: "arm",
      value: "hero/arm",
    });
    expect(qualifyFreeTrack("cursor")).toEqual({
      kind: "free",
      trackId: "cursor",
      value: "~/cursor",
    });
  });

  it("round-trips qualified ids without losing identity", () => {
    const motion = qualifyMotionTrack("hero", "arm");
    const free = qualifyFreeTrack("cursor");
    expect(parseQualifiedId(motion.value)).toEqual(motion);
    expect(parseQualifiedId(free.value)).toEqual(free);
  });

  it("rejects reserved or malformed authored ids", () => {
    expect(() => assertAuthoredMotionId("hero/child")).toThrow(/cannot contain/);
    expect(() => assertAuthoredMotionId("~")).toThrow(/reserved/);
    expect(() => assertAuthoredTrackId("arm/child")).toThrow(/cannot contain/);
    expect(() => assertAuthoredTrackId("")).toThrow(/non-empty/);
    expect(() => parseQualifiedId("hero/arm/extra")).toThrow(/Qualified id/);
    expect(() => parseQualifiedId("~/")).toThrow(/non-empty/);
  });

  it("keeps same local names distinct across owners", () => {
    expect(qualifyMotionTrack("hero", "cursor").value).not.toBe(qualifyFreeTrack("cursor").value);
  });

  it("returns frozen identity records", () => {
    expect(Object.isFrozen(qualifyMotionTrack("hero", "arm"))).toBe(true);
    expect(Object.isFrozen(qualifyFreeTrack("cursor"))).toBe(true);
  });
});
