import { unreachable } from "../lang/exhaustive";

/** Brand key that closes the union and discriminates its variants. */
declare const REQUEST_BRAND: unique symbol;

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

/**
 * One publication request: a seed list, or a seed list at a required frame; seeds held, not copied.
 */
export type PublishRequest = Minted<SeedsShape> | Minted<FrameShape>;

/** Mints a request carrying seeds and no frame. */
export function seedRequest(seeds: readonly string[]): PublishRequest {
  return mint<SeedsShape>({ kind: "seeds", seeds });
}

/** Mints a request carrying seeds and a required frame. */
export function frameRequest(seeds: readonly string[], tick: number): PublishRequest {
  return mint<FrameShape>({ kind: "frame", seeds, tick });
}

/** Returns the seeds both variants carry. */
export function requestSeeds(request: PublishRequest): readonly string[] {
  switch (request.kind) {
    case "seeds":
    case "frame":
      return request.seeds;
    default:
      return unreachable(request);
  }
}

/** Returns the frame, or `undefined` when the request carries none. */
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
