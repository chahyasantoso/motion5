import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";
import { composeWorld, fkPlugin } from "../../../src/plugins/fk";
import { transformPlugin } from "../../../src/plugins/transform";

// Slice A of issue #195. A bone's pivot is not always exactly at its parent's tip, so `fk` claims
// an authored `x` and `y` beside `length` and `rotation`. Both default to zero, so a bone authored
// before this slice composes the frame it always did, which `FO-1` pins as a guard.
//
// The offset is local to the parent's rotated space rather than to the world, because a pivot that
// stopped following its parent when the parent turned would not be a pivot. `FO-2` is that case,
// and it is the one a world-space reading gets wrong.
//
// `composeWorld` is the oracle rather than a second copy of the trigonometry. It was already
// exported from `fk.ts` and already unused by `fk`'s own `compose`, which is the duplication this
// slice deletes: a bone is its parent's frame moved to its own pivot, then extended along its own
// direction by `length`, and each of those is one rotate-then-translate.

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

const ORIGIN: Frame = { x: 0, y: 0, rotation: 0 };
const TILTED: Frame = { x: 12, y: -4, rotation: 30 };
const FLIPPED: Frame = { x: -5, y: 9, rotation: -110 };

/** `NaN` rather than `0` for a missing key, so a dropped output cannot read as an origin. */
function readNumber(value: unknown): number {
  return typeof value === "number" ? value : Number.NaN;
}

function toFrame(values: Readonly<Record<string, unknown>>): Frame {
  return {
    x: readNumber(values.x),
    y: readNumber(values.y),
    rotation: readNumber(values.rotation),
  };
}

function bone(values: Readonly<Record<string, number>>, base: Frame = ORIGIN): Frame {
  return toFrame(fkPlugin.compose(values, 1, { base }));
}

/** The pivot, then the extension: the whole of `fk` stated as two calls to its own primitive. */
function pivotThenExtend(base: Frame, values: Readonly<Record<string, number>>): Frame {
  const pivot = composeWorld(base, {
    x: values.x ?? 0,
    y: values.y ?? 0,
    rotation: values.rotation ?? 0,
  });
  return composeWorld(pivot, { x: values.length ?? 0, y: 0, rotation: 0 });
}

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  return plugins;
}

describe("fk pivot offsets", () => {
  it("FO-1 composes the parent-tip frame it always did when no offset is authored", () => {
    // The walker rig's own numbers: a pelvis at (0, 100) with rotation 0 and a bone of length 50 at
    // 45 degrees. Green on the parent by design, and not claimed as red.
    const frame = bone({ length: 50, rotation: 45 }, { x: 0, y: 100, rotation: 0 });
    expect(frame.x).toBeCloseTo(35.35533905932738, 12);
    expect(frame.y).toBeCloseTo(135.35533905932738, 12);
    expect(frame.rotation).toBeCloseTo(45, 12);
  });

  it("FO-2 offsets the pivot in the parent's rotated space, not in world space", () => {
    // The parent points along +y, so its local +x is world +y: an authored offset of 10 puts the
    // pivot at (0, 10) and the bone extends to (0, 15). Read in world space the same offset would
    // put the tip at (10, 5), which is the number this case exists to refuse.
    const frame = bone({ x: 10, y: 0, length: 5, rotation: 0 }, { x: 0, y: 0, rotation: 90 });
    expect(frame.x).toBeCloseTo(0, 12);
    expect(frame.y).toBeCloseTo(15, 12);
    expect(frame.rotation).toBeCloseTo(90, 12);
  });

  it("FO-3 displaces the pivot without turning the bone", () => {
    const offset = bone({ x: 0, y: 8, length: 10, rotation: 0 });
    const plain = bone({ length: 10, rotation: 0 });
    // An offset translates the pivot and does nothing else: same world rotation, and a tip moved by
    // exactly the authored offset rather than by a rotation that happens to pass through it.
    expect(offset.rotation).toBeCloseTo(plain.rotation, 12);
    expect(offset.x - plain.x).toBeCloseTo(0, 12);
    expect(offset.y - plain.y).toBeCloseTo(8, 12);
  });

  it("FO-4 is the pivot then the extension for every frame, not one fused formula", () => {
    const cases = [
      { base: ORIGIN, values: { x: 0, y: 0, length: 50, rotation: 45 } },
      { base: TILTED, values: { x: 3, y: -7, length: 18, rotation: -20 } },
      { base: FLIPPED, values: { x: 5, y: 5, length: 0, rotation: 120 } },
    ];
    for (const { base, values } of cases) {
      const expected = pivotThenExtend(base, values);
      const frame = bone(values, base);
      expect(frame.x).toBeCloseTo(expected.x, 12);
      expect(frame.y).toBeCloseTo(expected.y, 12);
      expect(frame.rotation).toBeCloseTo(expected.rotation, 12);
    }
  });

  it("FO-5 claims the offset keys, so a grouped offset resolves under fk", () => {
    const resolved = registry().resolveForKeyframes({
      fk: { values: { x: 4, y: -2, length: 10, rotation: 0 }, requires: { base: "walk/pelvis" } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["fk"]);
  });

  it("FO-6 refuses the flat spelling of an offset key both plugins now claim", () => {
    // The cost of the claim, stated rather than discovered. `x` had one claimant and now has two,
    // so its flat spelling is ambiguous exactly as flat `rotation` was, and an author names the
    // owner by authoring inside a group. See ADR-043.
    const resolved = registry().resolveForKeyframes({ x: 4 });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["plugin-ambiguous-key"]);
    expect(resolved.diagnostics[0]?.message).toContain('"fk" and "transform"');
  });
});
