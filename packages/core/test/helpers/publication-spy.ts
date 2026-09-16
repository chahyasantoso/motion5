/**
 * What a spy on a graph-tier `flush` is actually allowed to claim.
 *
 * #375 retargeted twenty spies from the retired `GraphRuntime.invalidate` to `flush` and kept the
 * old local name. ADR-081 priced that move and ADR-082 answered half of its worry correctly: after
 * the split, `flush` is no longer the tick path, so a spy on it sees strictly less than it did
 * before. The surviving half is the drain: `#drainScheduled` replays through `flush([])` when the
 * deferral it consumes carried no frame, so a spy on `flush` observes both the caller-stated
 * publication a case is about and a scheduled drain of that shape, and
 * `toHaveBeenCalledTimes(1)` therefore asserts "one publication of any origin" while the case around
 * it says "one live write reached the graph once".
 *
 * These answers close that gap by reading the seed list each call stated, which is the one thing
 * about a call this tier can actually check. Issue #381, and see ADR-087.
 *
 * What a seed list cannot do is name an origin, and claiming it could was issue #404. `flush` is
 * public and an empty list is a real publication its own docblock insists is not a cheap one, so a
 * direct `flush([])` states exactly what a drain's replay states; and since ADR-088 a deferral that
 * carried a frame replays through `flushAtTick`, which a spy on `flush` does not see at all. Origin
 * is `publication-origin.test.ts`'s question, because it is the one case that watches the scheduler
 * callback itself, and these answers are named for the reading they perform rather than for the
 * origin they cannot prove.
 */

/** One recorded call: the seed list it stated, and whatever else the member it watches takes. */
export type Publication = readonly [readonly string[], ...unknown[]];

/**
 * The shape these read: a spy on a member that states its seed list first.
 *
 * Tied to the call shape rather than to `unknown`, which is the second half of #404. A spy on
 * `replaceGraph` was structurally assignable, and several of the migrated cases hold one in the same
 * scope as a publication spy, so the wrong variable was one character away: `seedsOf` answered
 * `undefined` for every call, every answer below was empty, and a negative assertion passed while
 * watching the wrong member. The tuple is what refuses that, and it is still not vitest's generic
 * mock type, so nothing here has to name one.
 *
 * `seedsOf` is deleted with it. A runtime guard asking whether the first argument is a string array
 * is a second answer to a question the type now answers, and its `undefined` branch was the thing
 * that made watching the wrong member quiet.
 */
export interface PublicationSpy {
  readonly mock: { readonly calls: ReadonlyArray<Publication> };
}

/**
 * Answers only the publications whose stated seed list is exactly `seeds`, in order.
 *
 * Exactly, and not by containment: a publication naming more nodes than the write did is a
 * different event, and a case about one node must not be satisfied by it.
 */
export function publicationsFor(
  spy: PublicationSpy,
  seeds: readonly string[],
): ReadonlyArray<Publication> {
  return spy.mock.calls.filter(
    ([stated]) =>
      stated.length === seeds.length && seeds.every((seed, index) => stated[index] === seed),
  );
}

/**
 * Answers every call whose stated seed list named at least one node, which is what a write asks for.
 *
 * A claim about the list a call stated, and about nothing else. No call a drain replays states one,
 * so this is the count a case about a write means; what a drain was carrying is merged into the
 * effective seeds inside `#flushSeeds` and reaches the publisher, one layer below anything a spy on
 * this verb can see. Origin is not the only thing a seed list cannot prove, and neither is the
 * content of the publication that followed. Use it where the exact list is not the point.
 */
export function statedPublications(spy: PublicationSpy): ReadonlyArray<Publication> {
  return spy.mock.calls.filter(([seeds]) => seeds.length > 0);
}

/**
 * Answers every publication that stated no seeds, and says nothing about what made them.
 *
 * `drains`, and "a scheduled drain, and nothing else", until issue #404: a name and a docblock that
 * both claimed an origin this mechanism cannot see. A direct `flush([])` is indistinguishable here,
 * and a drain that carried a frame replays through `flushAtTick` and is not here at all. The reading
 * is a useful one and it is the only thing being answered, so it is what the name says.
 */
export function emptySeedPublications(spy: PublicationSpy): ReadonlyArray<Publication> {
  return spy.mock.calls.filter(([seeds]) => seeds.length === 0);
}
