import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { composeWorld } from "../frame/frame";
import { Anchors2d, type Anchor2dCells } from "../models/path";
import { FROM, TO, moveProgress, numberParam } from "./param";

const OVERSHOOT_SCALE = 2.5;
const RIPPLE_LIMIT = 0.9;

function degrees(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** The smallest turn from one heading to the next, in degrees. */
function turn(from: number, to: number): number {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

/** Eases 0 to 1, passing 1 by an amount set by `overshoot` before settling. */
function backOut(u: number, overshoot: number): number {
  const c = overshoot * OVERSHOOT_SCALE;
  return 1 + (c + 1) * (u - 1) ** 3 + c * (u - 1) ** 2;
}

function cellOf(row: unknown, key: "x" | "y"): number {
  const cells: unknown = Reflect.get(Object(row), "cells");
  const value: unknown = Reflect.get(Object(cells), key);
  return typeof value === "number" ? value : 0;
}

// A chain through the points that never stretches: straight along `angle` from the first point,
// then bent joint by joint into the shape, from the free end when it ripples.
export const ropePlugin = definePlugin({
  id: "rope",
  inputs: {
    values: Spec.table({ x: Spec.number(), y: Spec.number() }, { minRows: 2 }),
    param: Spec.record({
      angle: Spec.number({
        optional: true,
        description: "Heading of the straight rope from the first point, in degrees; default 0.",
      }),
      overshoot: Spec.number({
        optional: true,
        min: 0,
        max: 1,
        description: "How far each joint bends past its shape before settling; default 0.5.",
      }),
      ripple: Spec.number({
        optional: true,
        min: 0,
        max: RIPPLE_LIMIT,
        description:
          "Share of the move spent letting go from the free end to the start; default 0.6.",
      }),
      from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
      to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
    }),
  },
  outputs: { values: Anchors2d },
  transform({ values, param }, { progress }) {
    const rows = Array.isArray(values) ? values : [];
    const ids = rows.map((row, index) => {
      const id: unknown = Reflect.get(Object(row), "id");
      return typeof id === "string" ? id : `p${index}`;
    });
    const shape = rows.map((row) => ({ x: cellOf(row, "x"), y: cellOf(row, "y") }));
    const first = shape[0] ?? { x: 0, y: 0 };
    const angle = numberParam(param, "angle", 0);
    const overshoot = numberParam(param, "overshoot", 0.5);
    const ripple = Math.min(RIPPLE_LIMIT, numberParam(param, "ripple", 0.6));
    const local = moveProgress(param, progress);

    const segments = shape.length - 1;
    const points = [first];
    let frame = { x: first.x, y: first.y, rotation: 0 };
    let heading = 0;
    for (let k = 0; k < segments; k += 1) {
      const a = shape[k]!;
      const b = shape[k + 1]!;
      const target = degrees(b.x - a.x, b.y - a.y);
      const bend = k === 0 ? turn(angle, target) : turn(heading, target);
      heading = target;
      const delay = segments > 1 ? (ripple * (segments - 1 - k)) / (segments - 1) : 0;
      const u = Math.max(0, Math.min(1, (local - delay) / (1 - ripple)));
      const straight = k === 0 ? angle : 0;
      // The first joint swings the whole chain, so only later joints overshoot.
      const rotation = straight + bend * backOut(u, k === 0 ? 0 : overshoot);
      const pivot = composeWorld(frame, { x: 0, y: 0, rotation });
      frame = composeWorld(pivot, { x: Math.hypot(b.x - a.x, b.y - a.y), y: 0, rotation: 0 });
      points.push({ x: frame.x, y: frame.y });
    }

    const anchors: { readonly id: string; readonly cells: Anchor2dCells }[] = points.map(
      (point, index) => {
        const before = points[index - 1] ?? point;
        const after = points[index + 1] ?? point;
        const hx = (after.x - before.x) / 6;
        const hy = (after.y - before.y) / 6;
        return {
          id: ids[index] ?? `p${index}`,
          cells: { x: point.x, y: point.y, inX: -hx, inY: -hy, outX: hx, outY: hy },
        };
      },
    );
    return { values: anchors };
  },
});
