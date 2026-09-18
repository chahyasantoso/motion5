import { unreachable } from "../domain/exhaustive";

/**
 * What one caller asked a `GraphRuntime` to publish: a seed list, or a seed list at a frame.
 *
 * `flush(seeds, tick?)` carried both operations behind one name until issue #374, so which of the two
 * a caller meant was stated by whether a second argument was present, and the one that consumes a
 * frame number the clock will reuse was the one reachable by accident. Splitting them into two verbs
 * fixed that and left the publication mechanics duplicated around one difference: both assert
 * liveness, both ask the reentrancy question, both publish, and one of them also advances the frame.
 *
 * A variant states that difference better than a second method does, and it keeps what the split
 * bought: a frame cannot be selected by omission, because it is a variant rather than a missing
 * argument, and `flushAtTick` still states its own frame as a required parameter. What it retires is
 * the optional `tick` parameter the reentrancy answer carried for the same reason, where optional meant
 * "one of my two callers has no frame" rather than "a caller may leave this out".
 *
 * The seeds are held rather than copied, because every reader of them either copies or dedupes
 * downstream, and a copy here would be a second one per publication on the hot path.
 *
 * Issue #443, phase B step 12. See ADR-082 and ADR-084.
 */
declare const REQUEST_BRAND: unique symbol;

/** The mint mark that keeps the union below closed as well as discriminated. Issue #387. */
interface RequestBrand {
  readonly [REQUEST_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & RequestBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

interface SeedsShape {
  readonly kind: "seeds";
  readonly seeds: readonly string[];
}

interface FrameShape {
  readonly kind: "frame";
  readonly seeds: readonly string[];
  readonly tick: number;
}

/** One publication request, and the whole set of them. */
export type PublishRequest = Minted<SeedsShape> | Minted<FrameShape>;

/** The request the seed-list verb mints, which cannot reach the clock's frame number. */
export function seedRequest(seeds: readonly string[]): PublishRequest {
  return mint<SeedsShape>({ kind: "seeds", seeds });
}

/** The request the clock's verb mints, whose frame is required rather than selected by omission. */
export function frameRequest(seeds: readonly string[], tick: number): PublishRequest {
  return mint<FrameShape>({ kind: "frame", seeds, tick });
}

/** The seeds a request names, which both variants carry. */
export function requestSeeds(request: PublishRequest): readonly string[] {
  switch (request.kind) {
    case "seeds":
    case "frame":
      return request.seeds;
    default:
      return unreachable(request);
  }
}

/** The frame a request names, or `undefined` for the verb that has none to name. */
export function requestTick(request: PublishRequest): number | undefined {
  switch (request.kind) {
    case "seeds":
      return undefined;
    case "frame":
      return request.tick;
    default:
      return unreachable(request);
  }
}
