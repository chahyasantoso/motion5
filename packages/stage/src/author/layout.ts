import { unreachable, type Ease, type Events, type Pose2d } from "@gerak/core";

/** Stage size in px. */
export interface Frame {
  readonly width: number;
  readonly height: number;
}

/** How a measured box moves with page scroll: normal flow, viewport-fixed, or sticky inside a pin range. */
export type BoxPlacement =
  | { readonly kind: "flow" }
  | { readonly kind: "fixed" }
  | {
      readonly kind: "sticky";
      readonly minY: number;
      readonly maxY: number;
      readonly pinY: number;
    };

/** Where a member rests once laid out: its centre and size in frame px. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Rest boxes by member name. */
export type Rest = Readonly<Record<string, Box>>;

/** Reads rest boxes; a name never measured answers a zero box. */
export interface RestReader {
  get(name: string): Box;
  has(name: string): boolean;
  keys(): readonly string[];
}

/** How a carried member takes the size of its target box. */
export type CarryMode = "scale" | "clip" | "keep";

/** Options of `carry`: transition length, easing, sizing, and an optional target box. */
export interface CarryOptions {
  readonly ms: number;
  readonly ease?: Ease | undefined;
  readonly mode?: CarryMode | undefined;
  readonly target?: ((events: Events, layout: RestReader) => Box) | undefined;
}

/** Moves `member` from its box in the last layout to its box in the next, over `options.ms`. */
export type Carry = (member: string, options: CarryOptions) => Pose2d;

/** Zero box answered for a name never measured. */
export const ZERO_BOX: Box = Object.freeze({ x: 0, y: 0, width: 0, height: 0 });

/** A `RestReader` over `rest`. */
export function restReader(rest: Rest = {}): RestReader {
  const keys = Object.freeze(Object.keys(rest));
  return Object.freeze({
    get: (name: string): Box => (Object.hasOwn(rest, name) ? (rest[name] ?? ZERO_BOX) : ZERO_BOX),
    has: (name: string): boolean => Object.hasOwn(rest, name),
    keys: (): readonly string[] => keys,
  });
}

/** A reader with no boxes, as headless runs have. */
export const NO_REST: RestReader = restReader();

const BOX_PLACEMENT = Symbol.for("@gerak/stage/box-placement");
const FLOW: BoxPlacement = Object.freeze({ kind: "flow" });

function isPlacement(value: unknown): value is BoxPlacement {
  if (typeof value !== "object" || value === null) return false;
  const kind: unknown = Reflect.get(value, "kind");
  if (kind === "flow" || kind === "fixed") return true;
  if (kind !== "sticky") return false;
  return (
    typeof Reflect.get(value, "minY") === "number" &&
    typeof Reflect.get(value, "maxY") === "number" &&
    typeof Reflect.get(value, "pinY") === "number"
  );
}

/** Attaches page scroll placement metadata onto `box` as a non-enumerable property. */
export function withPlacement(box: Box, placement: BoxPlacement): Box {
  const placed = { x: box.x, y: box.y, width: box.width, height: box.height };
  Object.defineProperty(placed, BOX_PLACEMENT, { value: Object.freeze({ ...placement }) });
  return Object.freeze(placed);
}

/** The box's center and size in viewport coordinates at `scrollY` px. */
export function boxInViewport(box: Box, scrollY: number): Box {
  const raw: unknown = Reflect.get(box, BOX_PLACEMENT);
  const placement = isPlacement(raw) ? raw : FLOW;
  switch (placement.kind) {
    case "flow":
      return { x: box.x, y: box.y - scrollY, width: box.width, height: box.height };
    case "fixed":
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    case "sticky": {
      let y: number;
      if (scrollY <= placement.minY) y = box.y - scrollY;
      else if (scrollY >= placement.maxY) y = placement.pinY - (scrollY - placement.maxY);
      else y = placement.pinY;
      return { x: box.x, y, width: box.width, height: box.height };
    }
    default:
      return unreachable(placement);
  }
}
