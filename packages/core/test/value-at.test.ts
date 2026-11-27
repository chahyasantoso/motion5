import { describe, expect, it } from "vitest";
import { inputLog, inputs, liveAt, triggers, value, valueAt, type InputEntry } from "@gerak/core";

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

  it("binary-searches to trigger.at and walks back without scanning from index 0", () => {
    const entries: InputEntry[] = Array.from({ length: 1000 }, (_, i) => ({
      kind: "value",
      name: "other",
      at: i,
      value: i,
    }));
    entries[998] = { kind: "value", name: "jar-slot", at: 998, value: 42, target: "slot-1" };
    entries[999] = { kind: "trigger", name: "jar-remove", at: 999, value: 1 };

    let readIndex0 = 0;
    const first = entries[0];
    Object.defineProperty(entries, 0, {
      configurable: true,
      enumerable: true,
      get() {
        readIndex0 += 1;
        return first;
      },
    });

    const [removeTrigger] = triggers(jar, "jar-remove")(liveAt(999), entries);
    expect(removeTrigger).toBeDefined();
    readIndex0 = 0;

    if (removeTrigger !== undefined) {
      expect(valueAt(jar, "jar-slot", removeTrigger, "slot-1")(liveAt(999), entries)).toBe(42);
      expect(readIndex0).toBe(0);
    }
  });

  it("respects the same-ms rule when walking back past multiple same-ms updates and caps at now", () => {
    const log = inputLog();
    log.set(50, jar, "jar-slot", 5, "slot-1");
    log.set(100, jar, "jar-slot", 7, "slot-1");
    log.trigger(100, jar, "jar-remove");
    log.set(100, jar, "jar-slot", 3, "slot-1");
    log.set(100, jar, "jar-slot", 9, "slot-1");

    const [removeTrigger] = triggers(jar, "jar-remove")(liveAt(100), log.input);
    expect(removeTrigger).toBeDefined();
    if (removeTrigger !== undefined) {
      expect(valueAt(jar, "jar-slot", removeTrigger, "slot-1")(liveAt(100), log.input)).toBe(7);
      expect(valueAt(jar, "jar-slot", removeTrigger, "slot-1")(liveAt(60), log.input)).toBe(5);
    }
  });
});
