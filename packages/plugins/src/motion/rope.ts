import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Anchors2d, type Anchor2dCells } from "../models/path";
import { FROM, TO, moveProgress, numberParam, stringParam } from "./param";

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

// A chain through the points that never stretches: straight along `angle` from its pinned end,
// then each link turns to its heading in the shape, rippling along from the end `release` names.
export const ropePlugin = definePlugin({
  id: "rope",
  inputs: {
    values: Spec.table({ x: Spec.number(), y: Spec.number() }, { minRows: 2 }),
    param: Spec.record({
      angle: Spec.number({
        optional: true,
        description:
          "Heading of the straight rope away from its pinned end, in degrees; default 0.",
      }),
      pin: Spec.string({
        optional: true,
        enum: ["start", "end"],
        description:
          "Which end stays on its point in the shape while the rest moves; default start.",
      }),
      release: Spec.string({
        optional: true,
        enum: ["pin", "free"],
        description: "Which end bends first: the pinned end or the free end; default pin.",
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
          "Share of the move spent passing the bend from one end to the other; default 0.6.",
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
    const authored = rows.map((row) => ({ x: cellOf(row, "x"), y: cellOf(row, "y") }));
    const pinEnd = stringParam(param, "pin", "start") === "end";
    const fromFree = stringParam(param, "release", "pin") === "free";
    const shape = pinEnd ? [...authored].reverse() : authored;
    const pinned = shape[0] ?? { x: 0, y: 0 };
    const angle = numberParam(param, "angle", 0);
    const overshoot = numberParam(param, "overshoot", 0.5);
    const ripple = Math.min(RIPPLE_LIMIT, numberParam(param, "ripple", 0.6));
    const local = moveProgress(param, progress);

    const segments = shape.length - 1;
    const points = [pinned];
    let heading = angle;
    let previous: number | undefined;
    for (let k = 0; k < segments; k += 1) {
      const a = shape[k]!;
      const b = shape[k + 1]!;
      const raw = degrees(b.x - a.x, b.y - a.y);
      // Unwrapped along the chain, so a loop keeps turning one way instead of snapping back.
      heading += previous === undefined ? turn(angle, raw) : turn(previous, raw);
      previous = raw;
      const order = fromFree ? segments - 1 - k : k;
      const delay = segments > 1 ? (ripple * order) / (segments - 1) : 0;
      const u = Math.max(0, Math.min(1, (local - delay) / (1 - ripple)));
      const now = ((angle + (heading - angle) * backOut(u, overshoot)) * Math.PI) / 180;
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      const last = points[points.length - 1]!;
      points.push({ x: last.x + length * Math.cos(now), y: last.y + length * Math.sin(now) });
    }
    if (pinEnd) points.reverse();

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
