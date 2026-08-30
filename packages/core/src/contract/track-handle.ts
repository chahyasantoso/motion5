import type {
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
 * The values a live write carries: one authored static value per key.
 *
 * Closed to `AuthoredStaticValue` rather than open to any renderer-neutral value, which is this
 * capability's refusal set stated as a type instead of as a check. An animated key is refused by
 * name, so every key a live write may name is a static authored leaf, and a static leaf is a finite
 * number, a string, or a boolean by ADR-050. Nothing here can therefore carry a stop list, a nested
 * record, or a shape the interpolator would have to be asked about.
 *
 * Declared beside the handle that takes it rather than in three places. `Track` and `ProjectRuntime`
 * name this type instead of respelling the record, for the same reason `TrackHandle` itself is
 * declared once here. See ADR-059.
 */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

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
   * Masks this node's interpolated values until the next live write or a real `replace()`.
   *
   * Cheap by construction: no definition is validated, no Track is staged, and the graph is not
   * rebuilt. The mask is replaced wholesale rather than accumulated, so an empty record is the
   * clear, and it is dropped by `replace()` because that compiles a fresh Track. Returns the
   * `PatchBatch` of the one invalidate it causes, exactly as `seek()` does.
   *
   * Refuses an unknown key, a key another plugin owns, a namespaced key, an interpolator scratch
   * key, and an animated key, with `LiveValueKeyError` and no mutation. An animated key is refused
   * rather than frozen: the `Interpolator` port has no per-key write, and a partial implementation
   * that masked an authored animation forever is the failure this refusal exists to prevent.
   * See ADR-059.
   */
  overrideValues(next: LiveValues): PatchBatch;
  /**
   * Rewrites authored static values, leaving topology, progress, and observations alone.
   *
   * `track` above answers from the retained definition, and this is the member that moves it, so
   * the definition and the live composition cannot disagree. Omitted keys keep their authored
   * values. Same refusal set as `overrideValues`, same single invalidate, and no `replaceGraph`.
   * See ADR-059.
   */
  setValues(next: LiveValues): PatchBatch;
}
