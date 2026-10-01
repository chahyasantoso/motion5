import { describe, expect, it } from "vitest";
import { rotate } from "../src/filler/direction";
import { JOINTS, jointRecord } from "../src/filler/landmarks";
import { WORLD_SPACE, IMAGE_SPACE } from "../src/filler/space";
import { distance, dot, norm, type Vec } from "../src/filler/vec";
import { fitWeakPerspective } from "../src/live/projection";
import { frameOf, trustedOf } from "./frames";

const points = (planar = false) =>
  jointRecord((joint): Vec => {
    const index = JOINTS.indexOf(joint);
    return [
      (index % 4) * 100 - 150,
      Math.floor(index / 4) * 170 - 170,
      planar ? 0 : 90 * Math.sin(index * 1.7),
    ];
  });
const imageOf = (world: ReturnType<typeof points>, rotation: Vec = [0.4, -0.6, 0.2]) => {
  const rows = [rotate([1, 0, 0], rotation), rotate([0, 1, 0], rotation)];
  return jointRecord(
    (joint): Vec => [
      320 + 0.6 * dot(rows[0]!, world[joint]),
      240 + 0.6 * dot(rows[1]!, world[joint]),
    ],
  );
};

describe("trusted-only scaled orthographic overlay fit", () => {
  it("GF-56 recovers 100 random planar cameras, including reversed and near edge-on views", () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      let state = seed;
      const random = () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
      };
      const w = jointRecord((): Vec => [(random() - 0.5) * 500, (random() - 0.5) * 700, 0]);
      const rotation: Vec = [(random() - 0.5) * 6, (random() - 0.5) * 6, (random() - 0.5) * 6];
      const i = imageOf(w, rotation);
      const fit = fitWeakPerspective(trustedOf(frameOf(w, 0, WORLD_SPACE)), trustedOf(frameOf(i)))!;
      expect(fit).toBeDefined();
      expect(fit.rmsPx).toBeLessThan(1e-5);
      expect(fit.scale).toBeCloseTo(0.6, 6);
      expect(dot(fit.rows[0], fit.rows[1])).toBeCloseTo(0, 8);
    }
  });
  it("GF-52 recovers a rotated scaled camera for full-rank world geometry", () => {
    const w = points();
    const i = imageOf(w);
    const fit = fitWeakPerspective(
      trustedOf(frameOf(w, 0, WORLD_SPACE)),
      trustedOf(frameOf(i, 0, IMAGE_SPACE)),
    )!;
    expect(fit.pairCount).toBe(12);
    expect(fit.rmsPx).toBeLessThan(1e-5);
    expect(fit.scale).toBeCloseTo(0.6, 6);
    expect(norm(fit.rows[0])).toBeCloseTo(1, 10);
    expect(norm(fit.rows[1])).toBeCloseTo(1, 10);
    expect(dot(fit.rows[0], fit.rows[1])).toBeCloseTo(0, 10);
    for (const joint of JOINTS)
      expect(distance(fit.project(w[joint]), i[joint])).toBeLessThan(1e-5);
  });

  it("GF-53 handles a planar person under foreshortening without dividing by unseen depth variance", () => {
    const w = points(true);
    const i = imageOf(w, [0.8, 0.4, -0.2]);
    const fit = fitWeakPerspective(trustedOf(frameOf(w, 0, WORLD_SPACE)), trustedOf(frameOf(i)))!;
    expect(fit.rmsPx).toBeLessThan(1e-4);
    expect(fit.scale).toBeCloseTo(0.6, 4);
    for (const joint of JOINTS)
      expect(distance(fit.project(w[joint]), i[joint])).toBeLessThan(1e-4);
  });

  it("GF-54 excludes forced/low-visibility/gated data in either space, with no stale-fit fallback", () => {
    const w = points();
    const i = imageOf(w);
    const mask = ["left-wrist", "right-knee"] as const;
    const base = fitWeakPerspective(
      trustedOf(frameOf(w, 0, WORLD_SPACE), [mask[0]]),
      trustedOf(frameOf(i), [mask[1]]),
    )!;
    const corruptW = { ...w, [mask[0]]: [1e8, -1e8, 1e8] };
    const corruptI = { ...i, [mask[1]]: [1e8, -1e8] };
    const poisoned = fitWeakPerspective(
      trustedOf(frameOf(corruptW, 0, WORLD_SPACE), [mask[0]]),
      trustedOf(frameOf(corruptI), [mask[1]]),
    )!;
    expect(poisoned.pairCount).toBe(10);
    expect(poisoned.rows).toEqual(base.rows);
    expect(poisoned.project(w["left-elbow"])).toEqual(base.project(w["left-elbow"]));
    expect(
      fitWeakPerspective(
        trustedOf(frameOf(w, 0, WORLD_SPACE), JOINTS.slice(2)),
        trustedOf(frameOf(i)),
      ),
    ).toBeUndefined();
  });

  it("GF-55 rejects collapsed/collinear geometry, wrong spaces and mismatched frame clocks", () => {
    const w = jointRecord((): Vec => [1, 2, 3]);
    const i = imageOf(w);
    expect(
      fitWeakPerspective(trustedOf(frameOf(w, 0, WORLD_SPACE)), trustedOf(frameOf(i))),
    ).toBeUndefined();
    const line = jointRecord((joint): Vec => [JOINTS.indexOf(joint) * 100, 0, 0]);
    expect(
      fitWeakPerspective(
        trustedOf(frameOf(line, 0, WORLD_SPACE)),
        trustedOf(frameOf(imageOf(line))),
      ),
    ).toBeUndefined();
    expect(() => fitWeakPerspective(trustedOf(frameOf(points())), trustedOf(frameOf(i)))).toThrow(
      /synchronized/,
    );
    expect(() =>
      fitWeakPerspective(trustedOf(frameOf(points(), 1, WORLD_SPACE)), trustedOf(frameOf(i))),
    ).toThrow(/synchronized/);
  });
});
