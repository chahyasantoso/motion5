import { afterEach, describe, expect, it, vi } from "vitest";
import { pageFrames } from "../src/frames";

const HELD_CLOCK = Symbol.for("@gerak/dom/held-clock");
const HELD_FRAMES = Symbol.for("@gerak/dom/held-frames");
const HELD_STEP = Symbol.for("@gerak/dom/held-step");

function stepHeld(): void {
  const step: unknown = Reflect.get(globalThis, HELD_STEP);
  expect(typeof step).toBe("function");
  if (typeof step === "function") Reflect.apply(step, undefined, []);
}

describe("pageFrames when held", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, HELD_CLOCK);
    Reflect.deleteProperty(globalThis, HELD_FRAMES);
    Reflect.deleteProperty(globalThis, HELD_STEP);
  });

  it("queues requests without calling requestAnimationFrame and runs them on step", () => {
    const raf = vi.fn(() => 999);
    const caf = vi.fn();
    vi.stubGlobal("requestAnimationFrame", raf);
    vi.stubGlobal("cancelAnimationFrame", caf);
    vi.spyOn(performance, "now").mockReturnValueOnce(1017).mockReturnValueOnce(1034);
    Reflect.set(globalThis, HELD_CLOCK, true);

    const source = pageFrames();
    const calls: string[] = [];
    const cancelledHandle = source.requestFrame((time) => calls.push(`cancelled:${time}`));
    source.cancelFrame(cancelledHandle);

    source.requestFrame((time) => {
      calls.push(`first:${time}`);
      source.requestFrame((nextTime) => calls.push(`nested:${nextTime}`));
    });

    expect(raf).not.toHaveBeenCalled();
    expect(caf).not.toHaveBeenCalled();

    stepHeld();
    expect(calls).toEqual(["first:1017"]);

    stepHeld();
    expect(calls).toEqual(["first:1017", "nested:1034"]);
  });

  it("uses requestAnimationFrame when not held", () => {
    const raf = vi.fn(() => 42);
    const caf = vi.fn();
    vi.stubGlobal("requestAnimationFrame", raf);
    vi.stubGlobal("cancelAnimationFrame", caf);

    const source = pageFrames();
    const listener = vi.fn();
    const handle = source.requestFrame(listener);
    source.cancelFrame(handle);

    expect(handle).toBe(42);
    expect(raf).toHaveBeenCalledWith(listener);
    expect(caf).toHaveBeenCalledWith(42);
  });
});
