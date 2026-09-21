import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { code, member } from "../../helpers/source-region";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import type { TriggerBinding, TriggerFactory } from "../../../src/ports/trigger-factory";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../../src/testing/fakes";

/**
 * `engine.md` calls `bindClock` "Total and exhaustive, with no `??` fallback" and ADR-032 calls it
 * "the same exhaustive `TriggerBinding` switch". Both were true of the arms and neither was
 * enforced: the switch was structurally exhaustive over today's three kinds and had no `default`, so
 * a fourth registered no consumer and the Motion that owned it advanced on nothing.
 *
 * That is reachable rather than hypothetical, which is why this case is behavioural where the
 * rollback half of the same slice is a source guard. `TriggerFactory` is an injection seam: a host
 * hands back a `TriggerBinding` this build was never compiled against, and before the `default` arm
 * the project loaded clean and lost its clock silently.
 *
 * The refusal is asserted at the load rather than at one of the two readers, because the union is
 * now read twice on that path: `acceptsExternalSignal` projects the capability while the Motion is
 * constructed, and `bindClock` registers the consumer after it. Both end at the same sink, so which
 * one an arriving kind meets first is an ordering detail rather than the guarantee. What the
 * guarantee says is that a kind this build does not decide about cannot load; the last case pins
 * that the registration itself still owes the decision, so moving the projection would not quietly
 * leave `bindClock` fallback-free by accident rather than by construction.
 *
 * See ADR-092, ADR-099 and issue #451.
 */
const ENGINE = code(fileURLToPath(new URL("../../../src/engine.ts", import.meta.url)));
const BIND_CLOCK = member(
  ENGINE,
  "const bindClock = (motionId: string, motion: Motion, created: CreatedTrigger): void => {",
  "    ",
);
const BINDING_KINDS = ["driver", "motion", "none"] as const;

function factoryOf(binding: TriggerBinding): TriggerFactory {
  return {
    create() {
      const port = createFakeTriggerPort();
      return {
        port,
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

function load(binding: TriggerBinding) {
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

  it("refuses a binding kind the build does not decide about", () => {
    // The cast is the seam, not a shortcut: this is the one arrival the compiler cannot rule out,
    // and the reason the sink throws instead of answering the most permissive kind it knows.
    const foreign = { kind: "handshake" } as unknown as TriggerBinding;
    expect(() => load(foreign)).toThrow(TypeError);
    expect(() => load(foreign)).toThrow(/Unhandled variant/);
  });

  it("registers through a switch that names every kind and ends at the shared sink", () => {
    for (const kind of BINDING_KINDS) expect(BIND_CLOCK).toContain(`case "${kind}"`);
    expect(BIND_CLOCK).toContain("default:");
    expect(BIND_CLOCK).toContain("unreachable(binding)");
    // No fallback of its own, which is the claim `engine.md` makes about this registration.
    expect(BIND_CLOCK).not.toContain("??");
  });
});
