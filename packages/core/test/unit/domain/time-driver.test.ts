import { describe, expect, it } from "vitest";
import { createTimeDriver } from "../../../src/adapters/trigger-factory/time-driver";
import { createFakeTriggerPort } from "../../../src/ports/fakes";

describe("time driver T2", () => {
  it("emits elapsed duration progress and latches at one", () => {
    const driver = createTimeDriver(1000);
    const seen: number[] = [];
    driver.port.subscribe((progress) => seen.push(progress));

    expect(seen).toEqual([]);
    driver.onTick?.({ tick: 1, time: 250, delta: 250 });
    driver.onTick?.({ tick: 2, time: 500, delta: 250 });
    driver.onTick?.({ tick: 3, time: 1000, delta: 500 });
    driver.onTick?.({ tick: 4, time: 1250, delta: 250 });

    expect(seen).toEqual([0.25, 0.5, 1]);
    expect(driver.acceptsExternalSignal).toBe(false);
    driver.dispose();
  });

  it("rejects invalid durations and detaches after disposal", () => {
    expect(() => createTimeDriver(0)).toThrow();
    expect(() => createTimeDriver(Number.NaN)).toThrow();

    const driver = createTimeDriver(1000);
    const seen: number[] = [];
    driver.port.subscribe((progress) => seen.push(progress));
    driver.dispose();
    driver.dispose();
    driver.onTick?.({ tick: 1, time: 100, delta: 100 });
    expect(seen).toEqual([]);
  });

  it("coexists with unrelated trigger listeners when one listener throws", () => {
    const first = createFakeTriggerPort();
    const second = createTimeDriver(1000);
    first.subscribe(() => {
      throw new Error("listener boom");
    });
    const seen: number[] = [];
    second.port.subscribe((progress) => seen.push(progress));

    expect(() => first.emit(0.5)).toThrow("listener boom");
    second.onTick?.({ tick: 1, time: 100, delta: 100 });
    expect(seen).toEqual([0.1]);
    second.dispose();
    first.dispose();
  });
});
