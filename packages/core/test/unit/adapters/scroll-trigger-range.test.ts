import { describe, expect, it } from "vitest";
import type { ScrollSource } from "../../../src/adapters/scroll-trigger";
import { createScrollTriggerPort } from "../../../src/adapters/scroll-trigger";

interface PushSource extends ScrollSource {
  push(progress: number): void;
}

function pushSource(): PushSource {
  let listener: ((progress: number) => void) | undefined;
  return {
    subscribe(fn) {
      listener = fn;
      return () => {
        listener = undefined;
      };
    },
    push(progress) {
      listener?.(progress);
    },
  };
}

describe("scroll adapter normalizes what it can and rejects what it cannot", () => {
  it("R-4 clamps a measured overshoot and rejects a non-finite push", () => {
    const source = pushSource();
    const port = createScrollTriggerPort(source);
    const seen: number[] = [];
    port.subscribe((progress) => seen.push(progress));

    // Scroll position is a measured quantity, so an overshoot is noise and clamping it is
    // normalization rather than a fallback. This half stays green: integration case 3.1 depends
    // on it end to end.
    source.push(1.5);
    source.push(-1);
    expect(seen).toEqual([1, 0]);

    // Red before ADR-034. Math.max(0, Math.min(1, NaN)) is NaN, so the clamp was partial and a
    // non-finite push reached Motion, where it poisoned position and threw at the flush instead.
    expect(() => source.push(Number.NaN)).toThrow(TypeError);
    expect(() => source.push(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(seen).toEqual([1, 0]);

    port.dispose();
  });
});
