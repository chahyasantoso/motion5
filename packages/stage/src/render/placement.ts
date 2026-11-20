import { unreachable } from "@gerak/core";
import type { Box } from "../author/layout";

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
