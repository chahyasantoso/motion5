import { describe, expect, it } from "vitest";
import { createTimeDriver } from "../../../src/adapters/trigger-factory/time-driver";
import type { ClockTick } from "../../../src/ports/clock";
import { createFakeTriggerPort } from "../../../src/testing/fakes";
import type { CreatedTrigger } from "../../../src/ports/trigger-factory";

/**
 * The time driver owns time semantics, so its clock binding must be the `driver` state. Reading
 * ticks through this helper makes every tick in the suite an assertion about that, instead of an
 * optional call that quietly does nothing if the binding is ever wrong.
 */
function feed(driver: CreatedTrigger): (event: ClockTick) => void {
  const binding = driver.clockBinding;
  if (binding.kind !== "driver")
    throw new Error(`Expected a driver clock binding, got "${binding.kind}".`);
  return (event) => binding.onTick(event);
}

describe("time driver T2", () => {
  it("emits elapsed duration progress and latches at one", () => {
    const driver = createTimeDriver(1000);
    const tick = feed(driver);
    const seen: number[] = [];
    driver.port.subscribe((progress) => seen.push(progress));

    expect(seen).toEqual([]);
    tick({ tick: 1, time: 250, delta: 250 });
    tick({ tick: 2, time: 500, delta: 250 });
    tick({ tick: 3, time: 1000, delta: 500 });
    tick({ tick: 4, time: 1250, delta: 250 });

    expect(seen).toEqual([0.25, 0.5, 1]);
    expect(driver.acceptsExternalSignal).toBe(false);
    driver.dispose();
  });

  it("rejects invalid durations and detaches after disposal", () => {
    expect(() => createTimeDriver(0)).toThrow();
    expect(() => createTimeDriver(Number.NaN)).toThrow();

    const driver = createTimeDriver(1000);
    const tick = feed(driver);
    const seen: number[] = [];
    driver.port.subscribe((progress) => seen.push(progress));
    driver.dispose();
    driver.dispose();
    tick({ tick: 1, time: 100, delta: 100 });
    expect(seen).toEqual([]);
  });

  it("coexists with unrelated trigger listeners when one listener throws", () => {
    const first = createFakeTriggerPort();
    const second = createTimeDriver(1000);
    const tick = feed(second);
    first.subscribe(() => {
      throw new Error("listener boom");
    });
    const seen: number[] = [];
    second.port.subscribe((progress) => seen.push(progress));

    expect(() => first.emit(0.5)).toThrow("listener boom");
    tick({ tick: 1, time: 100, delta: 100 });
    expect(seen).toEqual([0.1]);
    second.dispose();
    first.dispose();
  });
});
