/** Where frames come from: `requestAnimationFrame` on a page, a fake one in a test. */
export interface FrameSource {
  requestFrame(listener: (time: number) => void): number;
  cancelFrame(handle: number): void;
}

export function pageFrames(): FrameSource {
  return {
    requestFrame: (listener) => globalThis.requestAnimationFrame(listener),
    cancelFrame: (handle) => globalThis.cancelAnimationFrame(handle),
  };
}
