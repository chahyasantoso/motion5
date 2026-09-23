import { describe, expect, it } from "vitest";
import type { EdgeRequirement } from "../../../src/graph/ir";
import {
  trackConfigView,
  type PluginDefinition,
  type TrackConfigView,
} from "../../../src/domain/plugins";

describe("an absent optional field is omitted, never written as undefined (#473)", () => {
  it("builds a track view that omits what the track does not have, and freezes it", () => {
    const bare = trackConfigView("hero/arm", undefined);
    expect(bare).toEqual({ id: "hero/arm" });
    expect("duration" in bare).toBe(false);
    expect(Object.isFrozen(bare)).toBe(true);
    const anonymous = trackConfigView(undefined, 500);
    expect("id" in anonymous).toBe(false);
    expect(anonymous.duration).toBe(500);
    expect(Object.keys(trackConfigView(undefined, undefined))).toEqual([]);
  });
});

/**
 * The compile-time half, and the compiler is the assertion rather than a case.
 *
 * `tsconfig.json` sets `exactOptionalPropertyTypes`, so an optional field refuses an explicit
 * `undefined`. Each `@ts-expect-error` below fails `typecheck` when the line under it stops being an
 * error, which is exactly what removing the flag would do: without it, `memberKey?: never` accepts
 * `undefined` and the scalar arm of `EdgeRequirement` is no longer the only spelling of "this slot
 * takes one source". The function is exported so it is not an unused local, and never called.
 */
export function refusedByTheCompiler(): readonly unknown[] {
  // @ts-expect-error a scalar requirement has no member key, and `undefined` is not an absent key.
  const scalar: EdgeRequirement = { plugin: "p", slot: "s", memberKey: undefined };
  // @ts-expect-error `stage` is absent or a `PluginStage`; `undefined` is neither.
  const plugin: PluginDefinition = { name: "p", compose: () => ({}), stage: undefined };
  // @ts-expect-error a track without a duration omits the field; `trackConfigView` is how.
  const view: TrackConfigView = { id: "t", duration: undefined };
  return [scalar, plugin, view];
}
