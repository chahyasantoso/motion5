import { composeChain, type Link2d } from "@gerak/rig";
import { defineMove } from "./declare";
import type { Anchor2d, Point2d } from "./shapes";

const OVERSHOOT_SCALE = 2.5;
const ORIGIN = { x: 0, y: 0 } as const;
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

// A chain through the points that never stretches: straight along `angle` from its pinned end,
// then each link turns to its heading in the shape, rippling along from the end `release` names.
export const rope = defineMove({
  id: "rope",
  description: "Bends a chain of points from straight into their shape, link by link.",
  options: {
    angle: {
      kind: "number",
      default: 0,
      description: "Heading of the straight rope away from its pinned end, in degrees; default 0.",
    },
    pin: {
      kind: "string",
      enum: ["start", "end"],
      default: "start",
      description: "Which end stays on its point in the shape while the rest moves; default start.",
    },
    release: {
      kind: "string",
      enum: ["pin", "free"],
      default: "pin",
      description: "Which end bends first: the pinned end or the free end; default pin.",
    },
    overshoot: {
      kind: "number",
      default: 0.5,
      min: 0,
      max: 1,
      description: "How far each joint bends past its shape before settling; default 0.5.",
    },
    ripple: {
      kind: "number",
      default: 0.6,
      min: 0,
      max: RIPPLE_LIMIT,
      description:
        "Share of the move spent passing the bend from one end to the other; default 0.6.",
    },
  },
  moments: () => ({}),
  run(
    { angle, pin, release, overshoot, ripple },
    { progress },
    input: { readonly points: readonly Point2d[] },
  ): readonly Anchor2d[] {
    if (input === undefined) throw new TypeError(`rope: input "points" is required.`);
    const { points } = input;
    if (points.length < 2) throw new RangeError(`rope: input "points" needs at least 2 rows.`);
    const pinEnd = pin === "end";
    const shape = pinEnd ? [...points].reverse() : points;
    const pinned = shape[0] ?? { x: 0, y: 0 };
    const segments = shape.length - 1;
    const links: Link2d[] = [];
    let heading = angle;
    let previous: number | undefined;
    let turned = 0;
    for (let k = 0; k < segments; k += 1) {
      const a = shape[k]!;
      const b = shape[k + 1]!;
      const raw = degrees(b.x - a.x, b.y - a.y);
      // Unwrapped along the chain, so a loop keeps turning one way instead of snapping back.
      heading += previous === undefined ? turn(angle, raw) : turn(previous, raw);
      previous = raw;
      const order = release === "free" ? segments - 1 - k : k;
      const delay = segments > 1 ? (ripple * order) / (segments - 1) : 0;
      const u = Math.max(0, Math.min(1, (progress - delay) / (1 - ripple)));
      const now = angle + (heading - angle) * backOut(u, overshoot);
      links.push({
        length: Math.hypot(b.x - a.x, b.y - a.y),
        rotation: now - turned,
        pivot: ORIGIN,
      });
      turned = now;
    }
    const ids = links.map((_, k) => String(k));
    const tips = composeChain(
      { ids, parentById: new Map(ids.map((id, k) => [id, k === 0 ? undefined : ids[k - 1]])) },
      { x: pinned.x, y: pinned.y, rotation: 0 },
      (_, k) => links[k]!,
    );
    const placed = [{ x: pinned.x, y: pinned.y }, ...tips.values()];
    if (pinEnd) placed.reverse();

    return placed.map((point, index): Anchor2d => {
      const before = placed[index - 1] ?? point;
      const after = placed[index + 1] ?? point;
      const hx = (after.x - before.x) / 6;
      const hy = (after.y - before.y) / 6;
      return {
        id: points[index]?.id ?? `p${index}`,
        x: point.x,
        y: point.y,
        inX: -hx,
        inY: -hy,
        outX: hx,
        outY: hy,
      };
    });
  },
});
