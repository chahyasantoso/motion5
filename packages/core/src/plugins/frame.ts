/**
 * The world frame `fk` and `ik` both read, and the one reader of it.
 *
 * The two plugins are halves of one composition: the solver reads a member's authored `length` and
 * the bone reads the solved rotation back. A value one of them refuses and the other accepts is
 * therefore not a style difference, it is one authored number meaning two things inside one tick.
 * Both carried a private `readNumber` and the copies had already drifted, one guarding
 * `Number.isFinite` and the other not, so an authored `length: NaN` was zeroed by the solver and
 * passed straight through by the bone. One reader is the fix, and the frame type travels with it
 * because a frame is what both of them read.
 */

/** A pivot and a direction in world space: the three keys every kinematic plugin publishes. */
export interface WorldFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

const ORIGIN: WorldFrame = Object.freeze({ x: 0, y: 0, rotation: 0 });

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
