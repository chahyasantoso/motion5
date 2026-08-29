/**
 * The world frame `fk` and `ik` both read, the reader they read its numbers with, and the pivot
 * convention they compose it by.
 *
 * The two plugins are halves of one composition: the solver reads a member's authored `length` and
 * pivot offset, and the bone reads the solved rotation back. A value one of them refuses and the
 * other accepts is therefore not a style difference, it is one authored number meaning two things
 * inside one tick. Both carried a private `readNumber` and the copies had already drifted, one
 * guarding `Number.isFinite` and the other not, so an authored `length: NaN` was zeroed by the
 * solver and passed straight through by the bone. One reader is the fix, and the frame type travels
 * with it because a frame is what both of them read.
 *
 * `composeWorld` and the two pivot functions below travel with it for the same reason, and it is a
 * stronger one. `fk` owns applying an authored offset and `ik` owns predicting the frame that
 * application composes, so the trigonometry between them is the one thing the two halves may not
 * hold a copy of each: a solve that rotated an offset by the member's own direction instead of its
 * base's would miss every goal by roughly twice the offset, with a `ready` patch and no diagnostic.
 * There is one rotate-then-translate in this package and every kinematic caller reaches it through
 * here. See ADR-054.
 *
 * `clamp` and `lerpAngle` are here under the same rule. The bound the closed form needs for
 * reachability and for the `acos` domain is the bound the bone needs for its blend weight, and the
 * angle the bone blends toward is an angle the solve published unwrapped. Neither is an `fk`
 * private detail, and a second copy of either is the drift this module exists to refuse.
 * See ADR-055.
 */

/** A pivot and a direction in world space: the three keys every kinematic plugin publishes. */
export interface WorldFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

/** A position in world space, with no direction of its own. */
export interface WorldPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * A member's authored pivot offset: `fk`'s `x` and `y`, read in its base's rotated frame.
 *
 * A distinct type from `WorldPoint` even though both are two numbers, because they are two
 * different things and the direction they are read in is the whole of the difference. A world point
 * is where something is; an offset is how far from its base's tip it hangs, in that base's own
 * space. The pair below takes one and returns the other, and the type names which side is which.
 */
export interface PivotOffset {
  readonly x: number;
  readonly y: number;
}

/**
 * A member's extension and its child's offset, reduced to one rigid link.
 *
 * `length` is the distance from a member's own pivot to its child's pivot, and `twist` is the angle
 * that link makes with the member's own direction, in degrees. Both are fixed once the two authored
 * values are known, because the offset is read in the member's rotated frame and travels with it,
 * which is exactly what makes the reduction legal: a rotation applied to the member turns the link
 * with it and changes neither number.
 *
 * It is what lets the analytic two-bone solve survive a pivot offset as a closed form rather than
 * becoming an iteration, and it is the same quantity the iterative path walks. See ADR-054.
 */
export interface EffectiveLink {
  readonly length: number;
  readonly twist: number;
}

const ORIGIN: WorldFrame = Object.freeze({ x: 0, y: 0, rotation: 0 });

/** The offset a member that authored no pivot carries, shared rather than allocated per read. */
export const ZERO_PIVOT_OFFSET: PivotOffset = Object.freeze({ x: 0, y: 0 });

/**
 * A finite number, or `fallback`.
 *
 * Non-finite is replaced rather than propagated. A `NaN` that reaches a composed frame fails the
 * publisher's renderer-neutrality check, so the node errors and every child of it blocks: one
 * authored typo takes out a limb. Defaulting keeps the damage inside the value that was wrong.
 */
export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/**
 * `value` held inside `[min, max]`.
 *
 * Promoted out of `plugins/ik.ts`, where it was module-private, rather than copied into `fk.ts`.
 * The closed form reaches for it five times, to hold a target inside the chain's reachable band and
 * to hold the law of cosines inside the `acos` domain, and the bone reaches for it once, to hold a
 * blend weight inside `[0, 1]`. That is one bound with two callers, which is what this module owns.
 *
 * It does not launder a `NaN`, and it is not asked to: `Math.min` and `Math.max` propagate one, so
 * every caller reads its number through `readNumber` above first. See ADR-055.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * `from` blended toward `to` by `weight`, along the shorter of the two arcs between them.
 *
 * Exported and pure rather than inlined into `fk.compose`, for two reasons. `solveTwoBone` returns
 * unwrapped degrees by construction (`beta - 180`, `targetAngle - root.rotation`, `180 - beta`), so
 * an authored and a solved angle can sit more than a turn apart and a naive linear blend swings the
 * long way round; that is shared-domain between the two halves of this composition rather than an
 * `fk` private detail. And a pure function makes the wrap a unit assertion, where the same claim
 * through a whole composition is a slow test that also fails for eleven unrelated reasons.
 *
 * **Both endpoints are returned untouched rather than computed, and that is a byte guarantee.** The
 * wrap sends a separation past half a turn to its short-arc complement, so the arithmetic at
 * `weight` of `1` would land a whole turn away from `to`: the same pose, and a different published
 * number, for every rig whose solved rotation is more than 180 degrees from its authored one. At
 * `weight` of `0` it would also lose a negative zero. `weight` defaults to `1` on every
 * solver-bound member that authors none, so every existing rig's published rotation rides on these
 * two identities holding exactly, and they hold by short-circuit rather than by arithmetic that
 * happens to round that way. `pivotFromBaseTip` short-circuits a zero offset under the same rule.
 *
 * The tie at exactly half a turn resolves in the positive direction. Both arcs are equally short
 * there, so the choice is arbitrary and is therefore pinned rather than left to the arithmetic:
 * `WT-4` owns it, because a rewrite reaching for `floor` instead of `ceil` would silently flip a
 * pose with every other case still green. See ADR-055.
 */
export function lerpAngle(from: number, to: number, weight: number): number {
  if (weight <= 0) return from;
  if (weight >= 1) return to;
  const delta = to - from;
  // Wrapped into `(-180, 180]`. `ceil` is what puts the tie at exactly half a turn on the positive
  // side from either direction of approach, where `floor` would put it on the negative side.
  return from + (delta - 360 * Math.ceil((delta - 180) / 360)) * weight;
}

/**
 * Reads a requirement slot as a world frame, defaulting every component to zero.
 *
 * The unbound case belongs to the plugin rather than to the schema: `fk.requires.base` is optional,
 * so a root bone authored with no binding composes against the origin instead of failing to load.
 */
export function readFrame(input: unknown): WorldFrame {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return ORIGIN;
  const record = input as Readonly<Record<string, unknown>>;
  return {
    x: readNumber(record.x),
    y: readNumber(record.y),
    rotation: readNumber(record.rotation),
  };
}

/**
 * Reads a composed value namespace as a pivot offset, defaulting both keys to zero.
 *
 * One reader, called by the bone that applies the offset and by the solve that accounts for it, so
 * the two cannot disagree about what an authored `x: NaN` or a missing `y` means. Zero is the
 * default because a bone that authors no pivot composes at its base's tip, which is what every rig
 * written before the keys existed does. See ADR-054.
 */
export function readPivotOffset(values: { readonly [key: string]: unknown }): PivotOffset {
  return { x: readNumber(values.x), y: readNumber(values.y) };
}

/**
 * `local` placed in `parent`'s frame: rotate by the parent's rotation, then translate.
 *
 * The one rotate-then-translate in the package. `fk` composes a bone out of two of them, the pivot
 * and then the extension, and both pivot functions below are the first of the two with the rotation
 * dropped. It stays an anonymous object type on both sides rather than a `WorldFrame`, because an
 * interface has no implicit index signature and `fk.compose` returns this value straight through to
 * a composer whose output must be assignable to `ImmutableRecord`.
 */
export function composeWorld(
  parent: { x: number; y: number; rotation: number },
  local: { x: number; y: number; rotation: number },
): { x: number; y: number; rotation: number } {
  const rad = (parent.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: parent.x + (local.x * cos - local.y * sin),
    y: parent.y + (local.x * sin + local.y * cos),
    rotation: parent.rotation + local.rotation,
  };
}

/**
 * Where a member's pivot sits: its base's tip, moved by the member's offset in the base's own
 * rotated frame. `fk.compose`'s first `composeWorld`, as a position.
 *
 * A zero offset returns the tip's own coordinates rather than computing them. That is a byte
 * guarantee and not an optimisation: `tip.x + (0 * cos - 0 * sin)` is `tip.x` for every finite
 * double but not for a negative zero, and every rig that authors no pivot must keep composing and
 * solving the doubles it always did.
 */
export function pivotFromBaseTip(
  tip: WorldPoint,
  direction: number,
  offset: PivotOffset,
): { x: number; y: number } {
  if (offset.x === 0 && offset.y === 0) return { x: tip.x, y: tip.y };
  const composed = composeWorld(
    { x: tip.x, y: tip.y, rotation: direction },
    { x: offset.x, y: offset.y, rotation: 0 },
  );
  return { x: composed.x, y: composed.y };
}

/**
 * The inverse: where a base's tip must sit for a member's pivot to land on `pivot`.
 *
 * The negated offset through the same function rather than a second formula, so the forward and the
 * backward reading of one authored pair cannot drift. It is what the iterative solve's inward pass
 * needs: a member proposes where its own pivot has to be, and only its base's tip is a quantity the
 * base's other children also have an opinion about. See ADR-054.
 */
export function baseTipFromPivot(
  pivot: WorldPoint,
  direction: number,
  offset: PivotOffset,
): { x: number; y: number } {
  return pivotFromBaseTip(pivot, direction, { x: -offset.x, y: -offset.y });
}

/**
 * A member's extension composed with its child's offset, as one rigid link.
 *
 * `length` is clamped at zero exactly as both solves clamp it, so a negative authored length is a
 * segment with no extent here as well. The offset's `x` runs along the member's own direction and
 * adds to that extent, its `y` runs across and twists the link off it, and a total reach that goes
 * negative is a link that points backwards rather than an error: `hypot` and `atan2` are total, and
 * the twist past a right angle is a real pose a rig can author.
 *
 * Zero returns the length untouched and no twist, for the reason `pivotFromBaseTip` short-circuits:
 * `Math.hypot(l, 0)` is not guaranteed to be the identity on `l`, and every existing rig's numbers
 * ride on it being one.
 */
export function effectiveLink(length: number, offset: PivotOffset): EffectiveLink {
  const extent = Math.max(0, length);
  if (offset.x === 0 && offset.y === 0) return { length: extent, twist: 0 };
  const reach = extent + offset.x;
  return {
    length: Math.hypot(reach, offset.y),
    twist: (Math.atan2(offset.y, reach) * 180) / Math.PI,
  };
}
