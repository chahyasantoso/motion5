/**
 * What a spy on a graph-tier `flush` is actually allowed to claim.
 *
 * #375 retargeted twenty spies from the retired `GraphRuntime.invalidate` to `flush` and kept the
 * old local name. ADR-081 priced that move and ADR-082 answered half of its worry correctly: after
 * the split, `flush` is no longer the tick path, so a spy on it sees strictly less than it did
 * before. The surviving half is the drain. `#scheduleDrain` replays through `flush([])`, so a spy on
 * `flush` observes both the caller-stated publication a case is about and any scheduled drain, and
 * `toHaveBeenCalledTimes(1)` therefore asserts "one publication of any origin" while the case around
 * it says "one live write reached the graph once".
 *
 * These three answers close that gap by reading the seed list each call stated, which is the one
 * thing that tells the two origins apart. Issue #381, and see ADR-087.
 */

/** The shape these read, so nothing here has to name vitest's generic mock type. */
export interface PublicationSpy {
  readonly mock: { readonly calls: ReadonlyArray<readonly unknown[]> };
}

/** The stated seed list of one recorded call, or `undefined` when the first argument is not one. */
function seedsOf(call: readonly unknown[]): readonly string[] | undefined {
  const first = call[0];
  if (!Array.isArray(first)) return undefined;
  return first.every((id) => typeof id === "string") ? (first as readonly string[]) : undefined;
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
): ReadonlyArray<readonly unknown[]> {
  return spy.mock.calls.filter((call) => {
    const stated = seedsOf(call);
    if (stated === undefined || stated.length !== seeds.length) return false;
    return seeds.every((seed, index) => stated[index] === seed);
  });
}

/**
 * Answers every publication that stated at least one seed, which is every caller-stated one.
 *
 * The drain is the only publication in this tier that states nothing, so this is the count a case
 * about a write actually means. Use it where the origin is the point and the exact list is not.
 */
export function statedPublications(spy: PublicationSpy): ReadonlyArray<readonly unknown[]> {
  return spy.mock.calls.filter((call) => (seedsOf(call)?.length ?? 0) > 0);
}

/** Answers every publication that stated no seeds: a scheduled drain, and nothing else. */
export function drains(spy: PublicationSpy): ReadonlyArray<readonly unknown[]> {
  return spy.mock.calls.filter((call) => seedsOf(call)?.length === 0);
}
