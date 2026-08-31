/**
 * What every capability handle in this package carries, and how all of them fail.
 *
 * Declared once because two structurally identical handles drift the first time one of them gains a
 * member, and because the alternative to a shared base is a second name for one fact: a track handle
 * answering `track` beside a motion handle answering `motion` is `SolverMember`-style drift with the
 * type system unable to see it. `definition` is that one name, and the rename it cost on the shipped
 * `TrackHandle.track` is taken rather than aliased.
 *
 * The asymmetry below is load-bearing and belongs here rather than in each implementor. `live` never
 * throws, so cleanup whose second call is expected rather than mistaken guards instead of catching;
 * `definition` and every other member throw the named refusal once the captured token is no longer
 * current. That is ADR-056's contract, stated in the one place both handles read it from.
 *
 * It sits in `contract/` rather than beside the runtime that owns the tokens, and that placement is a
 * gate rather than a preference: `public-declaration-surface` refuses any `runtime/` or `graph/`
 * module reachable from the package entry's declaration closure, and a caller cannot `instanceof` an
 * error it cannot name. Ownership is unmoved. `ProjectRuntime` holds every token, builds every
 * handle, and is the only thing that throws.
 */
export interface Handle<T> {
  /** The id this handle was captured against. Answers on a stale handle, like `live` below. */
  readonly id: string;
  /**
   * Whether the captured token is still current. Never throws, on either side of any invalidation
   * and on a disposed project.
   */
  readonly live: boolean;
  /** The authored definition as retained. Throws the named refusal once stale. */
  readonly definition: T;
}

/**
 * The one failure family a stale handle reports, from every member it has.
 *
 * `TypeError` is the parent rather than `Error`, and that is a Liskov argument rather than a
 * stylistic one: the `TrackHandle` getter already threw a `TypeError` carrying this exact sentence,
 * so existing `catch (error) { if (error instanceof TypeError) }` code keeps matching. Inserting this
 * base under that class is a narrowing for the same reason, so it cannot be a break either, and a
 * caller that wants to catch staleness from any handle now has one name to reach for.
 *
 * The sentence is owned here rather than by each subclass. Two handles refusing in two spellings
 * would be one normalization with two owners, and the noun is the only part that differs, so it is
 * the only part a subclass passes. `TrackHandle`'s message is byte-identical to what it was.
 *
 * `ruleId` is what a caller branches on, in the kebab shape every diagnostic rule id in this project
 * uses. It is abstract here and carried on the instance as well as the constructor by each subclass,
 * so a caught value answers without the class being in scope. Matching a message string is the thing
 * this family exists to make unnecessary. See ADR-056.
 */
export abstract class StaleHandleError extends TypeError {
  abstract readonly ruleId: string;
  constructor(noun: string, id: string) {
    super(`${noun} "${id}" is no longer live.`);
  }
}
