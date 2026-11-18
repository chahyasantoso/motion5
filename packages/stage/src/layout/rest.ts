import type { Events } from "@gerak/core";

/** Stage viewport dimensions in px. */
export interface Frame {
  readonly width: number;
  readonly height: number;
}

/** Default stage dimensions (1280 by 720 px) when none are given. */
export const DEFAULT_FRAME: Frame = Object.freeze({ width: 1280, height: 720 });

/** Where a member rests once laid out: its centre and size in frame px. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Zero-sized fallback box returned when a member was not measured. */
export const ZERO_BOX: Box = Object.freeze({ x: 0, y: 0, width: 0, height: 0 });

/** Measured member rest boxes keyed by cast member name. */
export type Rest = Readonly<Record<string, Box>>;

/** Empty `Rest` record for headless or unmeasured stages. */
export const NO_REST: Rest = Object.freeze({});

/** Measured `Rest` records keyed by declared layout name. */
export type Layouts<L extends string = string> = Readonly<Record<L, Rest>>;

/** Empty `Layouts` record when a stage uses a single layout. */
export const NO_LAYOUTS: Layouts<never> = Object.freeze({});

/** Uniform box lookup shared by single-layout, multi-layout, and headless runs. */
export interface RestReader {
  get(name: string): Box;
  has(name: string): boolean;
  keys(): readonly string[];
}

/** Builds a `RestReader` over a `Rest` record, returning `ZERO_BOX` for missing names. */
export function restReader(rest: Rest = NO_REST): RestReader {
  const keys = Object.freeze(Object.keys(rest));
  return Object.freeze({
    get(name: string): Box {
      return Object.hasOwn(rest, name) ? (rest[name] ?? ZERO_BOX) : ZERO_BOX;
    },
    has(name: string): boolean {
      return Object.hasOwn(rest, name);
    },
    keys(): readonly string[] {
      return keys;
    },
  });
}

/** Headless `RestReader` returning `ZERO_BOX` for every name. */
export const NO_REST_READER: RestReader = restReader(NO_REST);

/** Empty `RestReader` map for single-layout stages. */
export const NO_LAYOUT_READERS: Readonly<Record<never, RestReader>> = Object.freeze({});

/** Closed union for stage layout configuration: `"single"` or `"multi"`. */
export type LayoutSpec<L extends string = string> =
  | { readonly kind: "single"; readonly rest?: Rest | undefined }
  | {
      readonly kind: "multi";
      readonly names: readonly [L, ...L[]];
      readonly pick: (events: Events) => L;
      readonly rests?: Readonly<Record<L, Rest>> | undefined;
    };

/** Authoring input for multi-layout stages in `defineStage`. */
export interface LayoutsInput<L extends string = string> {
  readonly names: readonly [L, ...L[]];
  readonly pick?: ((events: Events) => L) | undefined;
  readonly rests?: Readonly<Record<L, Rest>> | undefined;
}
