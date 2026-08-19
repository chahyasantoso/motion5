import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createTimeDriver } from "../../../src/adapters/trigger-factory/time-driver";

// T5 removes a claim rather than a behavior. The inert manual fallback is already gone from the
// factory, so a behavioral test cannot see it: there is nothing left to observe. The proof is
// therefore a source guard, in the same spirit as ADR-031's C-3, because structure is where this
// particular drift happens and behavior is not.
//
// What T5 forbids is a manual fallback, not the manual port as a transport. `time-driver.ts`
// builds its own manual-style port as its emission channel, exactly as section 6.1 of
// `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` specifies, which is why the plan's "exactly two
// call sites" gate would have failed on green code. A fallback is a port handed back with
// `acceptsExternalSignal: true` and a `motion` clock binding for a declared `time` or `scroll`
// trigger. T-9 pins that distinction to the third call site instead of banning the site.
const FACTORY_DIR = new URL("../../../src/adapters/trigger-factory/", import.meta.url);
const OWNED = new Set(["default.ts", "time-driver.ts"]);

function read(url: URL): string {
  return readFileSync(fileURLToPath(url), "utf8");
}

function manualPortCalls(source: string): number {
  return [...source.matchAll(/createManualTriggerPort\(/g)].length;
}

function buildsManualPort(entry: string): boolean {
  return manualPortCalls(read(new URL(entry, FACTORY_DIR))) > 0;
}

const FACTORY_SOURCE = read(new URL("default.ts", FACTORY_DIR));
const DRIVER_SOURCE = read(new URL("time-driver.ts", FACTORY_DIR));
const ENGINE_SOURCE = read(new URL("../../../src/engine.ts", import.meta.url));

describe("T5 no manual trigger fallback", () => {
  it("T-8 reaches the manual port once in the factory, after both driver branches", () => {
    // Position is the assertion that matters. A manual port built before the time or scroll
    // branch returns is a fallback no matter how the branches below it read.
    expect(manualPortCalls(FACTORY_SOURCE)).toBe(1);
    const call = FACTORY_SOURCE.indexOf("createManualTriggerPort()");
    // Anchored on the branch conditions, not whole statements. Prettier owns where a branch body
    // wraps, and it moved the time branch's `return` to its own line once ADR-040 gave
    // `createTimeDriver` a second argument. Position is the claim here; line breaks never were.
    const time = FACTORY_SOURCE.indexOf('trigger.type === "time"');
    const scroll = FACTORY_SOURCE.indexOf('trigger.type === "scroll"');
    // Guards the guard: two missing needles would otherwise both be -1 and compare as fine.
    expect(time).toBeGreaterThan(-1);
    expect(scroll).toBeGreaterThan(-1);
    expect(call).toBeGreaterThan(time);
    expect(call).toBeGreaterThan(scroll);
  });

  it("T-9 keeps the time driver's own manual port driver-owned rather than a fallback", () => {
    // The third call site in packages/core/src, and the correct one. Tying the capability pair to
    // the file that owns the call is what makes this a transport claim rather than a count.
    expect(manualPortCalls(DRIVER_SOURCE)).toBe(1);
    const driver = createTimeDriver(1000);
    expect(driver.acceptsExternalSignal).toBe(false);
    expect(driver.clockBinding.kind).toBe("driver");
    driver.dispose();
  });

  it("T-10 leaves no other manual port call site in core", () => {
    // engine.ts owns construction and must never build a port of its own, and a driver added
    // beside these two must not quietly reintroduce the fallback the factory no longer has.
    expect(manualPortCalls(ENGINE_SOURCE)).toBe(0);
    const siblings = readdirSync(fileURLToPath(FACTORY_DIR), { encoding: "utf8" });
    // Not a vacuous scan: the walk has to actually see the factory it is policing.
    expect(siblings).toContain("default.ts");
    const others = siblings.filter((entry) => entry.endsWith(".ts") && !OWNED.has(entry));
    expect(others.filter(buildsManualPort)).toEqual([]);
  });
});
