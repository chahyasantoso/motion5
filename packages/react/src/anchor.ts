import { useCallback, useEffect, useRef, type RefCallback } from "react";
import type { ProjectHandle } from "@motion5/core";

/** Param fields that receive the measured centre's coordinates. */
export interface AnchorFields {
  readonly x: string;
  readonly y: string;
}

/** The layout an element exposes; an `HTMLElement` has it. */
export interface LayoutBox {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  readonly offsetParent: unknown;
}

export interface AnchorRefs {
  /** The element whose layout centre is measured. */
  readonly from: RefCallback<LayoutBox>;
  /** The element whose top-left corner the coordinates are measured from. */
  readonly to: RefCallback<LayoutBox>;
}

function isLayoutBox(value: unknown): value is LayoutBox {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof Reflect.get(value, "offsetLeft") === "number" &&
    typeof Reflect.get(value, "offsetTop") === "number"
  );
}

interface Offset {
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

/** Combines ref callbacks so one element can be bound by several hooks. */
export function mergeRefs<T>(...refs: readonly RefCallback<T>[]): RefCallback<T> {
  return (element) => {
    for (const ref of refs) ref(element);
  };
}

// Writes `from`'s layout centre, measured from `to`'s corner, into `node`'s param on attach and
// resize; layout ignores transforms, so this is the rest pose.
export function useAnchor(
  handle: ProjectHandle | undefined,
  node: string,
  fields: AnchorFields,
): AnchorRefs {
  const from = useRef<LayoutBox | null>(null);
  const to = useRef<LayoutBox | null>(null);

  const measure = useCallback(() => {
    if (handle === undefined || from.current === null || to.current === null) return;
    const origin = pageOffset(to.current);
    const target = pageOffset(from.current);
    const param = handle.track(node).input.param;
    param.setField({ field: fields.x }, target.x - origin.x + from.current.offsetWidth / 2);
    param.setField({ field: fields.y }, target.y - origin.y + from.current.offsetHeight / 2);
  }, [handle, node, fields.x, fields.y]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const fromRef = useCallback<RefCallback<LayoutBox>>(
    (element) => {
      from.current = element;
      measure();
    },
    [measure],
  );
  const toRef = useCallback<RefCallback<LayoutBox>>(
    (element) => {
      to.current = element;
      measure();
    },
    [measure],
  );
  return { from: fromRef, to: toRef };
}
