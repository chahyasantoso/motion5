import { type RefCallback } from "react";

/** The layout an element exposes; an `HTMLElement` has it. */
export interface LayoutBox {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  readonly offsetParent: unknown;
}

function isLayoutBox(value: unknown): value is LayoutBox {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof Reflect.get(value, "offsetLeft") === "number" &&
    typeof Reflect.get(value, "offsetTop") === "number"
  );
}

/** A point in px: `x` right and `y` down from a corner. */
export interface Offset {
  readonly x: number;
  readonly y: number;
}

/** Position in the page from layout offsets alone, so a transform a move applies is not counted. */
function pageOffset(element: LayoutBox): Offset {
  let x = 0;
  let y = 0;
  for (let node: unknown = element; isLayoutBox(node); node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

/** `from`'s layout centre as an `Offset` from `to`'s top-left corner; layout ignores transforms, so
 * this is the rest pose. */
export function centreIn(from: LayoutBox, to: LayoutBox): Offset {
  const origin = pageOffset(to);
  const target = pageOffset(from);
  return {
    x: target.x - origin.x + from.offsetWidth / 2,
    y: target.y - origin.y + from.offsetHeight / 2,
  };
}

/** Combines ref callbacks so one element can be bound by several hooks. */
export function mergeRefs<T>(...refs: readonly RefCallback<T>[]): RefCallback<T> {
  return (element) => {
    for (const ref of refs) ref(element);
  };
}
