import { useCallback, useEffect, useRef, type RefCallback } from "react";
import type { ProjectHandle } from "@motion5/core";
import { centreIn, type LayoutBox } from "./anchor";

/** Param fields that receive the measured centre's coordinates. */
export interface AnchorFields {
  readonly x: string;
  readonly y: string;
}

export interface AnchorRefs {
  /** The element whose layout centre is measured. */
  readonly from: RefCallback<LayoutBox>;
  /** The element whose top-left corner the coordinates are measured from. */
  readonly to: RefCallback<LayoutBox>;
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
    const centre = centreIn(from.current, to.current);
    const param = handle.track(node).input.param;
    param.setField({ field: fields.x }, centre.x);
    param.setField({ field: fields.y }, centre.y);
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
