import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";
import { lerpAngle } from "../../../src/plugins/frame";
import {
  blendOrientation3d,
  composeWorld3d,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  matrixFromQuaternion,
  quaternionFromEuler3d,
  readFrame3d,
  slerpQuaternion,
  ZERO_EULER,
  type Euler3d,
  type Quaternion,
} from "../../../src/plugins/frame3d";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import { transform3dPlugin } from "../../../src/plugins/transform3d";

// Issue #500 phase 1 (ADR-116): an `fk3d` bone has an authored local rest orientation and a
// per-member solved weight, and the one blend between them is a short-arc quaternion slerp owned by
// `frame3d.ts`. Every rig authored before either key existed composes byte-identically.

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomEuler(random: () => number): Euler3d {
  return {
    rotation: random() * 720 - 360,
    rotationX: random() * 720 - 360,
    rotationY: random() * 720 - 360,
  };
}

function negate(q: Quaternion): Quaternion {
  return { w: -q.w, x: -q.x, y: -q.y, z: -q.z };
}

/**
 * The rotation angle, in degrees, between two orientations: the angle of `conj(p) * q`, read by
 * `atan2` so it keeps its digits near zero, and sign-blind, so `q` and `-q` agree.
 */
function angleBetween(a: Euler3d, b: Euler3d): number {
  const p = quaternionFromEuler3d(a);
  const q = quaternionFromEuler3d(b);
  const w = p.w * q.w + p.x * q.x + p.y * q.y + p.z * q.z;
  const x = p.w * q.x - p.x * q.w - p.y * q.z + p.z * q.y;
  const y = p.w * q.y + p.x * q.z - p.y * q.w - p.z * q.x;
  const z = p.w * q.z - p.x * q.y + p.y * q.x - p.z * q.w;
  return (2 * Math.atan2(Math.hypot(x, y, z), Math.abs(w)) * 180) / Math.PI;
}

function maxEntryGap(a: readonly number[], b: readonly number[]): number {
  return Math.max(...a.map((value, index) => Math.abs(value - (b[index] ?? NaN))));
}

/** Degrees apart modulo a whole turn, in `[0, 180]`. */
function turnDistance(a: number, b: number): number {
  const delta = (((a - b) % 360) + 360) % 360;
  return Math.min(delta, 360 - delta);
}

function sameBytes(actual: Record<string, unknown>, expected: Record<string, unknown>): boolean {
  const keys = Object.keys(expected);
  return (
    Object.keys(actual).join() === keys.join() &&
    keys.every((key) => Object.is(actual[key], expected[key]))
  );
}

const root = readFrame3d({ x: 3, y: -4, z: 5, rotation: 30, rotationX: -20, rotationY: 45 });
const solved: Euler3d = { rotation: 70, rotationX: -35, rotationY: 120 };
const solver = { rotations3d: { upper: solved } };

describe("fk3d rest orientation and solved weight", () => {
  it("TH-24 a quaternion of an Euler triple is the CSS matrix of that triple", () => {
    const random = seeded(0x500a);
    for (let sample = 0; sample < 2_000; sample++) {
      const euler = randomEuler(random);
      const gap = maxEntryGap(
        matrixFromQuaternion(quaternionFromEuler3d(euler)),
        matrixFromEuler3d(euler),
      );
      expect(gap).toBeLessThan(1e-12);
    }
    // A non-finite angle is zero in the quaternion exactly as it is in the matrix.
    expect(quaternionFromEuler3d({ rotation: NaN, rotationX: Infinity, rotationY: 0 })).toEqual({
      w: 1,
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("TH-25 the blend takes the short arc on rotations, whatever sign either quaternion has", () => {
    const random = seeded(0x500b);
    for (let sample = 0; sample < 1_000; sample++) {
      const from = quaternionFromEuler3d(randomEuler(random));
      const to = quaternionFromEuler3d(randomEuler(random));
      const weight = random();
      const plain = matrixFromQuaternion(slerpQuaternion(from, to, weight));
      // `q` and `-q` are one rotation, so flipping either input's sign moves no matrix entry.
      expect(
        maxEntryGap(matrixFromQuaternion(slerpQuaternion(from, negate(to), weight)), plain),
      ).toBeLessThan(1e-12);
      expect(
        maxEntryGap(matrixFromQuaternion(slerpQuaternion(negate(from), to, weight)), plain),
      ).toBeLessThan(1e-12);
    }
    for (let sample = 0; sample < 1_000; sample++) {
      const rest = randomEuler(random);
      const target = randomEuler(random);
      const weight = random();
      const blended = blendOrientation3d(rest, target, weight);
      const whole = angleBetween(rest, target);
      // Short arc: the whole separation is at most half a turn, and the blend splits it by weight.
      expect(whole).toBeLessThanOrEqual(180 + 1e-9);
      expect(Math.abs(angleBetween(rest, blended) - weight * whole)).toBeLessThan(1e-6);
      expect(Math.abs(angleBetween(blended, target) - (1 - weight) * whole)).toBeLessThan(1e-6);
    }
    // One whole turn apart is one orientation, so the blend goes nowhere rather than all the way.
    const turned = blendOrientation3d(
      { rotation: 10, rotationX: 20, rotationY: 30 },
      { rotation: 370, rotationX: 20, rotationY: 30 },
      0.5,
    );
    expect(angleBetween(turned, { rotation: 10, rotationX: 20, rotationY: 30 })).toBeLessThan(1e-6);
    // Near-antipodal and exactly antipodal inputs stay finite, land on a real midpoint, and are
    // deterministic: the same inputs give the same bytes.
    for (const apart of [179.999999, 180]) {
      const rest = { rotation: 0, rotationX: 15, rotationY: 0 };
      const far = { rotation: 0, rotationX: 15 + apart, rotationY: 0 };
      const once = blendOrientation3d(rest, far, 0.5);
      expect(Object.values(once).every(Number.isFinite)).toBe(true);
      expect(Math.abs(angleBetween(rest, once) - apart / 2)).toBeLessThan(1e-5);
      expect(blendOrientation3d(rest, far, 0.5)).toEqual(once);
    }
  });

  it("TH-26 a blend of two pure-Z orientations is 2D lerpAngle modulo a turn", () => {
    const random = seeded(0x500c);
    for (let sample = 0; sample < 5_000; sample++) {
      const from = random() * 1440 - 720;
      const to = random() * 1440 - 720;
      // Both arcs are equally short at exactly half a turn, and which one each dimension takes is
      // its own deterministic tie rule (WT-4 in 2D, the input signs here); the gate is everywhere
      // else.
      if (Math.abs(turnDistance(from, to) - 180) < 1e-6) continue;
      const weight = random();
      const blended = blendOrientation3d(
        { rotation: from, rotationX: 0, rotationY: 0 },
        { rotation: to, rotationX: 0, rotationY: 0 },
        weight,
      );
      expect(blended.rotationX).toBe(0);
      expect(blended.rotationY).toBe(0);
      expect(turnDistance(blended.rotation, lerpAngle(from, to, weight))).toBeLessThan(1e-9);
    }
  });

  it("TH-27 weight 0 and 1 return rest and solved themselves, not an approximation", () => {
    const rest: Euler3d = { rotation: -0, rotationX: 400, rotationY: -190 };
    expect(blendOrientation3d(rest, solved, 0)).toBe(rest);
    expect(blendOrientation3d(rest, solved, -1)).toBe(rest);
    expect(blendOrientation3d(rest, solved, 1)).toBe(solved);
    expect(blendOrientation3d(rest, solved, 7)).toBe(solved);
    // Through the plugin: a fully solved member publishes exactly what the prototype published, and
    // a weight of 0 publishes exactly the unsolved rest pose.
    const prototype = composeWorld3d(composeWorld3d(root, { x: 0, y: 0, z: 0, ...solved }), {
      ...ZERO_EULER,
      x: 80,
      y: 0,
      z: 0,
    });
    const full = fk3dPlugin.compose({ length: 80, weight: 1 }, 1, { base: root, solver }, "upper");
    expect(sameBytes(full, prototype)).toBe(true);
    const restOnly = fk3dPlugin.compose({ length: 80, ...rest }, 1, { base: root }, "upper");
    const zero = fk3dPlugin.compose(
      { length: 80, ...rest, weight: 0 },
      1,
      { base: root, solver },
      "upper",
    );
    expect(sameBytes(zero, restOnly)).toBe(true);
  });

  it("TH-28 with no solve the rest orientation composes and weight is never read", () => {
    const rest = { rotation: 25, rotationX: -60, rotationY: 10 };
    const expected = composeWorld3d(composeWorld3d(root, { x: 0, y: 0, z: 0, ...rest }), {
      ...ZERO_EULER,
      x: 50,
      y: 0,
      z: 0,
    });
    // Unbound, a source with no `rotations3d`, a record that does not name this node, and an entry
    // that is not a triple are all "no solve", and each ignores any weight authored beside it.
    const noSolves: readonly Readonly<Record<string, unknown>>[] = [
      { base: root },
      { base: root, solver: {} },
      { base: root, solver: { rotations3d: { other: solved } } },
      { base: root, solver: { rotations3d: { upper: 45 } } },
      { base: root, solver: { rotations3d: { upper: null } } },
      { base: root, solver: { rotations3d: [] } },
    ];
    for (const inputs of noSolves)
      for (const weight of [undefined, 0, 0.25, NaN, 3]) {
        const values =
          weight === undefined ? { length: 50, ...rest } : { length: 50, ...rest, weight };
        expect(sameBytes(fk3dPlugin.compose(values, 1, inputs, "upper"), expected)).toBe(true);
      }
  });

  it("TH-29 a rig authored before rest and weight existed composes byte-identically", () => {
    // The prototype's composition, restated as the oracle: identity when unsolved, the solver's
    // triple outright when solved.
    const prototype = (local: Euler3d, length: number) =>
      composeWorld3d(composeWorld3d(root, { x: 0, y: 0, z: 0, ...local }), {
        ...ZERO_EULER,
        x: length,
        y: 0,
        z: 0,
      });
    const random = seeded(0x500d);
    for (let sample = 0; sample < 500; sample++) {
      const triple = randomEuler(random);
      const length = random() * 200;
      const bound = { base: root, solver: { rotations3d: { upper: triple } } };
      expect(
        sameBytes(fk3dPlugin.compose({ length }, 1, bound, "upper"), prototype(triple, length)),
      ).toBe(true);
      expect(
        sameBytes(
          fk3dPlugin.compose({ length }, 1, { base: root }, "upper"),
          prototype(ZERO_EULER, length),
        ),
      ).toBe(true);
    }
  });

  it("TH-30 weight is clamped into [0, 1], non-finite reads as 1, and stages the reach", () => {
    const rest = { rotation: -40, rotationX: 30, rotationY: 5 };
    const at = (weight: unknown) =>
      fk3dPlugin.compose({ length: 80, ...rest, weight }, 1, { base: root, solver }, "upper");
    expect(sameBytes(at(2), at(1))).toBe(true);
    expect(sameBytes(at(-2), at(0))).toBe(true);
    expect(sameBytes(at(NaN), at(1))).toBe(true);
    expect(sameBytes(at(Infinity), at(1))).toBe(true);
    // Partway, the member's local orientation sits the weighted fraction of the way along the one
    // short arc from rest to solved, so a chain staggers its reach by giving its bones different
    // weights.
    for (const weight of [0.1, 0.5, 0.9]) {
      const local = blendOrientation3d(rest, solved, weight);
      expect(
        Math.abs(angleBetween(rest, local) - weight * angleBetween(rest, solved)),
      ).toBeLessThan(1e-6);
      const expected = composeWorld3d(composeWorld3d(root, { x: 0, y: 0, z: 0, ...local }), {
        ...ZERO_EULER,
        x: 80,
        y: 0,
        z: 0,
      });
      expect(sameBytes(at(weight), expected)).toBe(true);
    }
  });

  it("TH-31 a 3D rest orientation under a solve with no weight is dead and refused at load", () => {
    const registry = new PluginRegistry();
    for (const plugin of [transform3dPlugin, fk3dPlugin, ik3dPlugin] as PluginDefinition[])
      registry.register(plugin);
    expect(
      registry.resolveForKeyframes({
        fk3d: { values: { length: 1, rotation: 1, rotationX: 2, rotationY: 3, weight: 0.5 } },
      }).diagnostics,
    ).toEqual([]);
    const project = (upper: Readonly<Record<string, unknown>>): ProjectDefinition => ({
      schemaVersion: 5,
      projectId: "rest",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform3d: { values: {} } } },
            { id: "goal", keyframes: { transform3d: { values: { x: 10, y: 10, z: 10 } } } },
            { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
            {
              id: "upper",
              keyframes: {
                fk3d: {
                  values: { length: 10, ...upper },
                  requires: { base: "root", solver: "solve" },
                },
              },
            } as TrackDefinition,
            {
              id: "fore",
              keyframes: {
                fk3d: { values: { length: 10 }, requires: { base: "upper", solver: "solve" } },
              },
            },
          ],
        },
      ],
    });
    const rules = (upper: Readonly<Record<string, unknown>>) =>
      buildGraphIR(project(upper)).diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
    expect(rules({})).toEqual([]);
    // Each orientation key alone is dead without a weight, for the reason a 2D `rotation` is.
    for (const key of ["rotation", "rotationX", "rotationY"])
      expect(rules({ [key]: 30 })).toEqual(["ik-solved-rotation-dead at rig/upper"]);
    expect(rules({ rotation: 1, rotationX: 2, rotationY: 3 })).toEqual([
      "ik-solved-rotation-dead at rig/upper",
    ]);
    // Any weight beside it makes the rest orientation reachable, and a weight alone is legal.
    expect(rules({ rotationX: 30, weight: 0.5 })).toEqual([]);
    expect(rules({ weight: 0.5 })).toEqual([]);
  });
});
