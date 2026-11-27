// @ts-nocheck
import { describe, expect, it } from "vitest";
import { inputLog, inputs, liveAt, triggers, value, valueAt } from "@gerak/core";

const jar = inputs({
  values: { "jar-slot": { targets: ["slot-1"] } },
  triggers: { "jar-remove": {} },
});

describe("valueAt", () => {
  it("reads the old value when trigger arrives before set in the same ms", () => {
    const log = inputLog();
    log.set(50, jar, "jar-slot", 7, "slot-1");
    log.trigger(100, jar, "jar-remove");
    log.set(100, jar, "jar-slot", 3, "slot-1");

    const t100 = liveAt(100);
    const [removeTrigger] = triggers(jar, "jar-remove")(t100, log.input);
    expect(removeTrigger).toBeDefined();

    if (removeTrigger !== undefined) {
      expect(valueAt(jar, "jar-slot", removeTrigger, "slot-1")(t100, log.input)).toBe(7);
    }
    expect(value(jar, "jar-slot", "slot-1")(t100, log.input)).toBe(3);
  });

  it("reads the new value when set arrives before trigger in the same ms", () => {
    const log = inputLog();
    log.set(50, jar, "jar-slot", 7, "slot-1");
    log.set(100, jar, "jar-slot", 3, "slot-1");
    log.trigger(100, jar, "jar-remove");

    const t100 = liveAt(100);
    const [removeTrigger] = triggers(jar, "jar-remove")(t100, log.input);
    expect(removeTrigger).toBeDefined();

    if (removeTrigger !== undefined) {
      expect(valueAt(jar, "jar-slot", removeTrigger, "slot-1")(t100, log.input)).toBe(3);
    }
    expect(value(jar, "jar-slot", "slot-1")(t100, log.input)).toBe(3);
  });
});
