import { unreachable } from "@gerak/core";
import type { Box, BoxPlacement } from "../author/layout";

export type { BoxPlacement };

const FLOW: BoxPlacement = Object.freeze({ kind: "flow" });

/** How `box` is placed on the page: flow unless `placement` was attached. */
export function placementOf(box: Box): BoxPlacement {
  return box.placement ?? FLOW;
}

/** Returns a frozen `box` with direct enumerable `placement` metadata. */
export function withPlacement(box: Box, placement: BoxPlacement): Box {
  return Object.freeze({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    placement: Object.freeze({ ...placement }),
  });
}

/** The box's center and size in viewport coordinates at `scrollY` px. */
export function boxInViewport(box: Box, scrollY: number): Box {
  const placement = placementOf(box);
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
