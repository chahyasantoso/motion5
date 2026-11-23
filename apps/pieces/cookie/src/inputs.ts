import { pointer, scroll, shared, springTo, type Signal } from "@gerak/core";

export const pointerDeltaX: Signal<number> = shared(
  springTo(pointer.x, (v) => v - 0.5, { stiffness: 90, damping: 18 }),
);

export const pointerDeltaY: Signal<number> = shared(
  springTo(pointer.y, (v) => v - 0.5, { stiffness: 90, damping: 18 }),
);

export const heroCookieScrollY: Signal<number> = shared(
  springTo(scroll.y, (y) => y, { stiffness: 90, damping: 20, rest: 0.5 }),
);
