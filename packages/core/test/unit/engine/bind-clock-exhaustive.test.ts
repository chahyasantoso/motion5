import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import type { ClockBinding, TriggerFactory } from "../../../src/ports/trigger-factory";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../../src/testing/fakes";

/**
 * `engine.md` calls `bindClock` "Total and exhaustive, with no `??` fallback" and ADR-032 calls it
 * "the same exhaustive `ClockBinding` switch". Both were true of the arms and neither was enforced:
 * the switch was structurally exhaustive over today's three kinds and had no `default`, so a fourth
 * registered no consumer and the Motion that owned it advanced on nothing.
 *
 * That is reachable rather than hypothetical, which is why this case is behavioural where the
 * rollback half of the same slice is a source guard. `TriggerFactory` is an injection seam: a host
 * hands back a `ClockBinding` this build was never compiled against, and before the `default` arm
 * the project loaded clean and lost its clock silently. See ADR-092 and issue #451.
 */
function factoryOf(binding: ClockBinding): TriggerFactory {
  return {
    create() {
      const port = createFakeTriggerPort();
      return {
        port,
        acceptsExternalSignal: false,
        clockBinding: binding,
        dispose: () => port.dispose(),
      };
    },
  };
}

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "time", duration: 1000 }, tracks: [] }],
};

function load(binding: ClockBinding) {
  const clock = createManualClock();
  const handle = new Engine({
    clock,
    scheduler: createFakeScheduler(),
    interpolator: createFakeInterpolator(),
    triggerFactory: factoryOf(binding),
  }).load(project);
  return { clock, handle };
}

describe("clock registration decides about every binding kind", () => {
  it("routes a project tick to a driver binding's own advance", () => {
    const deltas: number[] = [];
    const { clock, handle } = load({ kind: "driver", onTick: (event) => deltas.push(event.delta) });
    clock.tick(250);
    clock.tick(125);
    expect(deltas).toEqual([250, 125]);
    handle.dispose();
  });

  it("registers nothing for a none binding and stays tickable", () => {
    // The scroll shape: progress arrives through the port, never through the project clock. The
    // `motion` arm's accepting direction is the default factory's manual path, covered by
    // `trigger-time.test.ts`, and is not re-proved through an injected factory here.
    const { clock, handle } = load({ kind: "none" });
    expect(() => clock.tick(250)).not.toThrow();
    handle.dispose();
  });

  it("refuses a binding kind the registration does not decide about", () => {
    // The cast is the seam, not a shortcut: this is the one arrival the compiler cannot rule out,
    // and the reason the sink throws instead of answering the most permissive kind it knows.
    const foreign = { kind: "handshake" } as unknown as ClockBinding;
    expect(() => load(foreign)).toThrow(TypeError);
    expect(() => load(foreign)).toThrow(/Unhandled variant/);
  });
});
