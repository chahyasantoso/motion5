import { composeChain, type Link2d } from "@gerak/rig";
import type { Anchor2d, Point2d, Time } from "@gerak/core";
import { choiceOption, numberOption } from "./options";

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

/** Options of `rope`. */
export interface RopeOptions {
  /** The points the rope bends into, each with an optional `id` its anchor keeps; at least 2, required. */
  readonly points: readonly (Point2d & { readonly id?: string })[];
  /** Heading of the straight rope away from its pinned end, in degrees; default 0. */
  readonly angle?: number;
  /** Which end stays on its point in the shape while the rest moves: start or end; default start. */
  readonly pin?: "start" | "end";
  /** Which end bends first: the pinned end (pin) or the free end (free); default pin. */
  readonly release?: "pin" | "free";
  /** How far each joint bends past its shape before settling, from 0 to 1; default 0.5. */
  readonly overshoot?: number;
  /** Share of the move spent passing the bend from one end to the other, from 0 to 0.9; default 0.6. */
  readonly ripple?: number;
}

// A chain through the points that never stretches: straight along `angle` from its pinned end,
// then each link turns to its heading in the shape, rippling along from the end `release` names.
/** Bends a chain of points from straight into their shape, link by link, answering anchors for
 * `toCubics`. */
export function rope(options: RopeOptions): (time: Time) => readonly Anchor2d[] {
  const { points } = options;
  if (points === undefined) throw new RangeError(`rope: option "points" is required.`);
  if (points.length < 2) throw new RangeError(`rope: option "points" needs at least 2 rows.`);
  const angle = numberOption("rope", "angle", options.angle, { default: 0 });
  const pin = choiceOption("rope", "pin", options.pin, ["start", "end"], "start");
  const release = choiceOption("rope", "release", options.release, ["pin", "free"], "pin");
  const overshoot = numberOption("rope", "overshoot", options.overshoot, {
    default: 0.5,
    min: 0,
    max: 1,
  });
  const ripple = numberOption("rope", "ripple", options.ripple, {
    default: 0.6,
    min: 0,
    max: RIPPLE_LIMIT,
  });
  return ({ progress }) => {
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
  };
}
