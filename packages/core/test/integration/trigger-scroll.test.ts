import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";

function track() { return { id: "arm", keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } } }; }
function source() {
  let listener: ((progress: number) => void) | undefined;
  const value: ScrollSource & { emit(progress: number): void; subscriptions: number; unsubscribes: number } = {
    subscriptions: 0, unsubscribes: 0,
    subscribe(fn) { listener = fn; this.subscriptions += 1; return () => { this.unsubscribes += 1; listener = undefined; }; },
    emit(progress) { listener?.(progress); },
  };
  return value;
}

describe("T3 scroll driver", () => {
  it("drives progress from an injected application-owned source", () => {
    const scroll = source();
    const handle = new Engine({ clock: createManualClock(), interpolator: createFakeInterpolator(), scheduler: createFakeScheduler(), triggerFactory: createTriggerFactory({ scroll: () => scroll }) }).load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "scroll", source: "hero" }, tracks: [track()] }] });
    handle.mount("scene/arm");
    scroll.emit(0.4);
    expect(handle.get("scene/arm")?.values).toEqual({ x: 40 });
    scroll.emit(2);
    expect(handle.get("scene/arm")?.values).toEqual({ x: 100 });
    handle.dispose();
    expect(scroll.subscriptions).toBe(1);
    expect(scroll.unsubscribes).toBe(1);
  });
  it("rejects a missing source and leaves no live driver", () => {
    expect(() => new Engine({ clock: createManualClock(), interpolator: createFakeInterpolator(), scheduler: createFakeScheduler(), triggerFactory: createTriggerFactory({ scroll: () => undefined }) }).load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "scroll", source: "missing" }, tracks: [] }] })).toThrow(/trigger-driver-unavailable/);
  });
  it("rejects external signals for scroll Motions", () => {
    const scroll = source();
    const handle = new Engine({ clock: createManualClock(), interpolator: createFakeInterpolator(), scheduler: createFakeScheduler(), triggerFactory: createTriggerFactory({ scroll: () => scroll }) }).load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "scroll", source: "hero" }, tracks: [track()] }] });
    expect(() => handle.signal("scene", { type: "scroll", progress: 0.5 })).toThrow(/does not accept external signals/);
    handle.dispose();
  });
});
