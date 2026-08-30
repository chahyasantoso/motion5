import type {
  AuthoredProperty,
  AuthoredStaticValue,
  ObservationDefinition,
  PatchBatch,
  TrackDefinition,
} from "./v5";

/**
 * The one failure a stale `TrackHandle` reports, from every member it has.
 *
 * `TypeError` is the parent rather than `Error`, and that is a Liskov argument rather than a
 * stylistic one: the `track` getter already threw a `TypeError` carrying this exact message, so
 * existing `catch (error) { if (error instanceof TypeError) }` code keeps matching and this type is
 * a narrowing that cannot be a break. The message is kept verbatim for the same reason.
 *
 * `ruleId` is what a caller branches on. Matching a message string is the thing this type exists to
 * make unnecessary, and it is carried on the instance as well as the constructor so a caught value
 * answers without the class being in scope. See ADR-056.
 */
export class StaleTrackHandleError extends TypeError {
  /** Stable identity, in the kebab shape every diagnostic rule id in this project uses. */
  static readonly ruleId = "stale-track-handle";
  readonly ruleId: string = StaleTrackHandleError.ruleId;
  /** The qualified node id the refused handle was captured against. */
  readonly nodeId: string;
  constructor(nodeId: string) {
    super(`Track "${nodeId}" is no longer live.`);
    this.name = "StaleTrackHandleError";
    this.nodeId = nodeId;
  }
}

/**
 * The values a mask may carry: one authored static value per key.
 *
 * Closed to `AuthoredStaticValue` rather than open to any renderer-neutral value, and it stays
 * closed. A mask is rebuilt from the retained definition on every write and shadows the timeline at
 * every progress, so a stop list here would be a permanently frozen animation rather than a live
 * one. That refusal is now a type rather than a check: this is the type of `Track`'s mask and of the
 * static half of a live write, and nothing that reaches it can carry stops.
 *
 * Declared beside the handle that takes it rather than in three places. `Track` and `ProjectRuntime`
 * name this type instead of respelling the record, for the same reason `TrackHandle` itself is
 * declared once here. See ADR-059 and ADR-060.
 */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

/**
 * The values a live write may carry: one authored leaf per key, static or animated.
 *
 * `LiveValues` widened per key to the animated form, and only the boundary widens. `AuthoredProperty`
 * is named rather than respelled, because what an authored leaf may be is the authored schema's
 * question and it already has exactly one answer.
 *
 * Both entry points take this, because both lift the same refusal. Which of them a key is legal on
 * is not a property of the type: an animated key is legal on both, and a key whose incoming leaf is
 * a different kind from the authored one is legal on neither. See ADR-060.
 */
export type AuthoredValues = Readonly<Record<string, AuthoredProperty>>;

/**
 * A capability handle for one graph node, valid while the token it captured is current.
 *
 * Declared once, here, and named by both `ProjectRuntime` and `engine.ts` rather than declared in
 * each. Two structurally identical interfaces drift the first time one of them gains a member,
 * which is exactly what happened to the two private `readNumber` copies that `plugins/frame.ts`
 * was created to close.
 *
 * It sits in `contract/` rather than beside the runtime that owns the tokens, and that placement is
 * a gate rather than a preference: `public-declaration-surface` refuses any `runtime/` or `graph/`
 * module reachable from the package entry's declaration closure, and a caller cannot `instanceof`
 * an error it cannot name. Ownership is unmoved. `ProjectRuntime` holds the tokens, builds every
 * handle, and is the only thing that throws. See ADR-056.
 */
export interface TrackHandle {
  readonly id: string;
  /**
   * Whether the captured token is still current. Never throws, on either side of any invalidation
   * and on a disposed project, so cleanup whose second call is expected rather than mistaken is
   * guarded instead of caught.
   */
  readonly live: boolean;
  /** Throws `StaleTrackHandleError` once stale, as every member below does. */
  readonly track: TrackDefinition;
  remove(): void;
  replace(next: TrackDefinition): void;
  addObserve(observation: ObservationDefinition): void;
  removeObserve(observation: ObservationDefinition): void;
  /**
   * Writes this node's values until the next live write or a real `replace()`, without moving the
   * retained definition.
   *
   * Cheap by construction: no Track is staged and the graph is not rebuilt. A static key is masked
   * over the interpolated state; an animated key has its tweens replaced on the still-live
   * timeline, against a base the interpolator retained, so the write is revertible wholesale. The
   * write is replaced wholesale rather than accumulated, so an empty record is the clear for both
   * kinds, and `replace()` drops it by construction because that compiles a fresh Track. Returns
   * the `PatchBatch` of the one invalidate it causes, exactly as `seek()` does.
   *
   * Refuses an unknown key, a key another plugin owns, a namespaced key, an interpolator scratch
   * key, a key whose incoming leaf is a different kind from the authored one, and a key a plugin
   * prepared, with `LiveValueKeyError` and no mutation. An animated key is no longer refused: an
   * interpolator with no per-key write escalates to a recompile that publishes the same values at
   * the same progress. See ADR-060.
   */
  overrideValues(next: AuthoredValues): PatchBatch;
  /**
   * Rewrites authored values, leaving topology, progress, and observations alone.
   *
   * `track` above answers from the retained definition, and this is the member that moves it, so
   * the definition and the live composition cannot disagree. It is the sticky half: a following
   * `overrideValues({})` reverts to what this wrote rather than to what was authored. Omitted keys
   * keep their values. Same refusal set as `overrideValues`, same single invalidate, and no
   * `replaceGraph`. See ADR-059 and ADR-060.
   */
  setValues(next: AuthoredValues): PatchBatch;
}
