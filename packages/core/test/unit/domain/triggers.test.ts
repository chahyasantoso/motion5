import { describe, expect, it, vi } from "vitest";
import { createTrigger } from "../../../src/domain/triggers";

describe("trigger delegates", () => {
  it.each(["manual", "scroll", "time"] as const)(
    "normalizes %s into a progress command",
    (type) => {
      const trigger = createTrigger(type);
      const emit = vi.fn();
      trigger.attach(emit);
      trigger.signal({ type, progress: 0.42 });
      expect(emit).toHaveBeenCalledWith({ setProgress: 0.42 });
    },
  );

  it("rejects a second attachment and mismatched signals", () => {
    const trigger = createTrigger("manual");
    trigger.attach(() => undefined);
    expect(() => trigger.attach(() => undefined)).toThrow(/already attached/);
    expect(() => trigger.signal({ type: "scroll", progress: 0.2 })).toThrow(/Expected manual/);
  });

  it("validates progress and detaches cleanly", () => {
    const trigger = createTrigger("scroll");
    const emit = vi.fn();
    trigger.attach(emit);
    expect(() => trigger.signal({ type: "scroll", progress: Number.NaN })).toThrow(/finite/);
    expect(() => trigger.signal({ type: "scroll", progress: 2 })).toThrow(/between/);
    trigger.detach();
    trigger.signal({ type: "scroll", progress: 0.5 });
    expect(emit).toHaveBeenCalledTimes(0);
  });

  it("does not depend on browser or DOM globals", () => {
    const trigger = createTrigger("time");
    expect(trigger.type).toBe("time");
  });
});
