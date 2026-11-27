// @ts-nocheck
import { describe, expect, it } from "vitest";
import { inputs, triggers, value, valueAt, type Trigger } from "@gerak/core";
// @ts-expect-error MotionEvent is removed from @gerak/core
import type { MotionEvent } from "@gerak/core";
// @ts-expect-error Events is removed from @gerak/core
import type { Events } from "@gerak/core";
// @ts-expect-error eventLog is removed from @gerak/core
import { eventLog } from "@gerak/core";
// @ts-expect-error eventDriver is removed from @gerak/dom
import { eventDriver } from "@gerak/dom";
import type { Mounted } from "@gerak/dom";
import { manualDriver, type Driver } from "@gerak/player";

const jar = inputs({
  values: {
    "jar-slot": { targets: ["slot-0", "slot-1"] },
    "jar-sealed": {},
  },
  triggers: {
    "jar-add": {},
    "jar-remove": { targets: ["slot-0", "slot-1"] },
  },
});

export function typeChecks(mounted: Mounted, driver: Driver, sampleTrigger: Trigger): void {
  const md = manualDriver();

  // Positive cases
  md.set(jar, "jar-slot", 3, "slot-1");
  md.set(jar, "jar-sealed", 1);
  md.set(jar, "jar-sealed", 1, "free-target");
  md.trigger(jar, "jar-add");
  md.trigger(jar, "jar-add", 2);
  md.trigger(jar, "jar-remove", 1, "slot-0");

  void value(jar, "jar-slot", "slot-0");
  void value(jar, "jar-sealed");
  void valueAt(jar, "jar-slot", sampleTrigger, "slot-1");
  void valueAt(jar, "jar-sealed", sampleTrigger);
  void triggers(jar, "jar-add");
  void triggers(jar, "jar-remove", "slot-1");

  // Negative cases: driver.set
  // @ts-expect-error typo in value name
  md.set(jar, "jar-slott", 1, "slot-0");
  // @ts-expect-error trigger name passed to set
  md.set(jar, "jar-add", 1);
  // @ts-expect-error undeclared target on value with declared targets
  md.set(jar, "jar-slot", 1, "slot-9");

  // Negative cases: driver.trigger
  // @ts-expect-error typo in trigger name
  md.trigger(jar, "jar-addd");
  // @ts-expect-error value name passed to trigger
  md.trigger(jar, "jar-sealed");
  // @ts-expect-error undeclared target on trigger with declared targets
  md.trigger(jar, "jar-remove", 1, "slot-9");

  // Negative cases: value reader
  // @ts-expect-error typo in value name
  void value(jar, "jar-slott", "slot-0");
  // @ts-expect-error trigger name passed to value
  void value(jar, "jar-add");
  // @ts-expect-error undeclared target on value with declared targets
  void value(jar, "jar-slot", "slot-9");

  // Negative cases: valueAt reader
  // @ts-expect-error typo in value name
  void valueAt(jar, "jar-slott", sampleTrigger, "slot-0");
  // @ts-expect-error trigger name passed to valueAt
  void valueAt(jar, "jar-add", sampleTrigger);
  // @ts-expect-error undeclared target on value with declared targets
  void valueAt(jar, "jar-slot", sampleTrigger, "slot-9");

  // Negative cases: triggers reader
  // @ts-expect-error typo in trigger name
  void triggers(jar, "jar-addd");
  // @ts-expect-error value name passed to triggers
  void triggers(jar, "jar-sealed");
  // @ts-expect-error undeclared target on trigger with declared targets
  void triggers(jar, "jar-remove", "slot-9");

  // The same contract checks on a mount's port
  mounted.set(jar, "jar-slot", 3, "slot-1");
  mounted.trigger(jar, "jar-add");
  // @ts-expect-error trigger name passed to set
  mounted.set(jar, "jar-add", 1);
  // @ts-expect-error value name passed to trigger
  mounted.trigger(jar, "jar-sealed");
  // @ts-expect-error undeclared target on value with declared targets
  mounted.set(jar, "jar-slot", 1, "slot-9");

  // Old API removed from Mounted and Driver
  // @ts-expect-error send is removed from Mounted
  void mounted.send;
  // @ts-expect-error send is removed from Driver
  void driver.send;
}

const PUBLIC_ENTRIES = [
  "@gerak/core",
  "@gerak/dom",
  "@gerak/moves",
  "@gerak/physics",
  "@gerak/player",
  "@gerak/rapier",
  "@gerak/react",
  "@gerak/rig",
  "@gerak/rig-three",
  "@gerak/stage",
  "@gerak/stage/render",
  "@gerak/stage/dom",
  "@gerak/stage/provenance",
  "@gerak/three",
  "@gerak/three/react",
  "@gerak/tools/page",
  "@gerak/tools/pages",
  "@gerak/tools/scene",
  "@gerak/tools/vite",
] as const;

const REMOVED_EXPORTS = ["eventLog", "eventDriver", "send", "emit"] as const;

describe("public exports", () => {
  it("excludes eventLog, eventDriver, send, and emit from every package entry", async () => {
    for (const entry of PUBLIC_ENTRIES) {
      const mod: Record<string, unknown> = await import(entry);
      for (const name of REMOVED_EXPORTS) {
        expect(Object.hasOwn(mod, name), `${entry} still exports ${name}`).toBe(false);
      }
    }
  });
});
