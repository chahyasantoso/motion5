import type { Viewport } from "@xyflow/react";
import { useEffect, type RefObject } from "react";

/** The part of a React Flow instance the wheel moves. */
export interface Viewer {
  getViewport(): Viewport;
  setViewport(view: Viewport): unknown;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_RATE = 0.0015;

/** Whether a wheel event is a trackpad's two-finger scroll rather than a mouse wheel notch. */
export function isTrackpadScroll(
  event: Pick<WheelEvent, "deltaX" | "deltaY" | "deltaMode">,
): boolean {
  return event.deltaMode === 0 && (event.deltaX !== 0 || Math.abs(event.deltaY) < 40);
}

/** The wheel zooms about the pointer, a trackpad two-finger scroll pans, and a pinch zooms. */
export function useWheelNavigation(
  area: RefObject<HTMLElement | null>,
  flow: Viewer,
  moved: () => void,
): void {
  useEffect(() => {
    const element = area.current;
    if (element === null) return undefined;
    const onWheel = (event: WheelEvent): void => {
      if (event.ctrlKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest(".nowheel, .timeline") !== null) return;
      event.preventDefault();
      const view = flow.getViewport();
      if (isTrackpadScroll(event)) {
        void flow.setViewport({ ...view, x: view.x - event.deltaX, y: view.y - event.deltaY });
      } else {
        const zoom = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, view.zoom * Math.exp(-event.deltaY * ZOOM_RATE)),
        );
        const box = element.getBoundingClientRect();
        const px = event.clientX - box.left;
        const py = event.clientY - box.top;
        const ratio = zoom / view.zoom;
        void flow.setViewport({
          x: px - (px - view.x) * ratio,
          y: py - (py - view.y) * ratio,
          zoom,
        });
      }
      moved();
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [area, flow, moved]);
}
