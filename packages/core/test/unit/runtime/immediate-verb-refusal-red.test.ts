import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TriggerSignal } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type ProjectRuntimeOptions } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, failing-first evidence for the immediate-verb refusal.
 *
 * ADR-064 already decided that a verb which applies immediately and would survive an abort is
 * refused by name inside a recipe. The shipped guard covered tier 0 and tier 2, but the recipe
 * closure still held the ProjectHandle, so `mount`, `unmount`, `seek`, `invalidate` and `signal`
 * could reach the runtime directly. These cases are intentionally against main before the fix:
 * they must fail on assertions, not on typecheck.
 */

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const HAND_ID = "hero/hand";
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION_ID, trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};
const compose = (node: { id: string }) => () => ({
  values: { [node.id]: 1 },
  sourceProgress: 0,
  sourceRevisions: {},
});
const SIGNAL = { type: "play" } as unknown as TriggerSignal;

type SignalRuntime = ProjectRuntime & {
  signal(motionId: string, signal: TriggerSignal): void;
};

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

function rig(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
  });
}

function expectImmediate(error: unknown, verb: string): void {
  expect(error).toBeInstanceOf(TypeError);
  expect((error as Error).message).toMatch(/^schema-transaction-immediate: /);
  expect((error as Error).message).toContain(verb);
}

describe("immediate verbs refuse inside a recipe", () => {
  it("RA-79 refuses seek", () => {
    const runtime = rig();
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.seek(ARM_ID, 0.5));
    });
    expectImmediate(error, "seek");
    runtime.dispose();
  });

  it("RA-80 refuses mount", () => {
    const runtime = rig();
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.mount(ARM_ID));
    });
    expectImmediate(error, "mount");
    runtime.dispose();
  });

  it("RA-81 refuses unmount", () => {
    const runtime = rig();
    runtime.mount(ARM_ID);
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.unmount(ARM_ID));
    });
    expectImmediate(error, "unmount");
    runtime.dispose();
  });

  it("RA-82 refuses invalidate", () => {
    const runtime = rig();
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.invalidate([ARM_ID]));
    });
    expectImmediate(error, "invalidate");
    runtime.dispose();
  });

  it("RA-83 refuses signal", () => {
    const runtime = rig() as SignalRuntime;
    expect(typeof runtime.signal).toBe("function");
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.signal(MOTION_ID, SIGNAL));
    });
    expectImmediate(error, "signal");
    runtime.dispose();
  });

  it("RA-84 refuses before an immediate effect can survive an aborted recipe", () => {
    const runtime = rig();
    const before = runtime.graph.sequence;
    let error: unknown;
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      error = thrownBy(() => runtime.seek(ARM_ID, 0.5));
    });
    expectImmediate(error, "seek");
    expect(runtime.graph.sequence).toBe(before + 1);
    runtime.dispose();
  });

  it("RA-85 keeps structural edits reachable as the accepting control", () => {
    const runtime = rig();
    runtime.edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
    });
    expect(runtime.track(HAND_ID).live).toBe(true);
    runtime.dispose();
  });
});

// Keeps the red file honest about the future hook shape without changing the main-branch runtime.
const _signalOption: ProjectRuntimeOptions & {
  signalMotion?: (motionId: string, signal: TriggerSignal) => void;
} = { clock: createManualClock(), compose };
void _signalOption;
