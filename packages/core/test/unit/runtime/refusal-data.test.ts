import { describe, expect, it } from "vitest";
import type { Diagnostic } from "../../../src/contract/v5";
import { StaleMotionHandleError } from "../../../src/contract/motion-handle";
import { StaleTrackHandleError } from "../../../src/contract/track-handle";
import {
  DisposedProjectError,
  RefusalError,
  describeDiagnostics,
  describeRefusal,
  refuse,
} from "../../../src/runtime/refusal";
import {
  expectLive,
  expectValid,
  isLive,
  liveWrite,
  resolveToken,
  stale,
  validated,
} from "../../../src/runtime/results";
import {
  commitInFlight,
  immediateInTransaction,
  nestedTransaction,
  propertyEntry,
  reservedGoalSlot,
  unboundGroup,
  valueBatchImmediate,
  valueBatchStructural,
} from "../../../src/runtime/schema-refusals";

const message = (body: () => never): string => {
  try {
    body();
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error("Expected a refusal.");
};

const thrown = (body: () => never): unknown => {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("Expected a refusal.");
};

const diagnostic: Diagnostic = {
  ruleId: "keyframes-shape",
  path: "addTrack(a).keyframes",
  message: "Not a record.",
  severity: "error",
};

describe("the named refusals still say exactly what they said", () => {
  it("renders every message byte-identically", () => {
    expect(message(() => nestedTransaction())).toBe(
      "schema-transaction-nested: A recipe is already open. Finish it before opening another.",
    );
    expect(message(() => immediateInTransaction("setTrigger"))).toBe(
      'schema-transaction-immediate: "setTrigger" applies immediately and cannot travel with a recipe. Call it outside edit().',
    );
    expect(message(() => commitInFlight())).toBe(
      "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
    );
    expect(message(() => valueBatchImmediate("mount"))).toBe(
      'value-batch-immediate: "mount" publishes or mounts and cannot travel with a value batch. Call it outside values().',
    );
    expect(message(() => valueBatchStructural())).toBe(
      "value-batch-structural: A value batch is open. Ask for it once values() has returned.",
    );
    expect(message(() => unboundGroup("free:a", "opacity"))).toBe(
      'keyframe-group-unbound: "free:a" authors no "opacity" group. Use setKeyframeGroup to originate one.',
    );
    expect(message(() => reservedGoalSlot("ik", "goals"))).toBe(
      'keyframe-goal-slot-reserved: Slot "goals" of "ik" holds a solver\'s goals. Use setGoal to bind one entry of it, or removeGoal to drop one.',
    );
    expect(message(() => propertyEntry("free:a", "opacity"))).toBe(
      'keyframe-entry-shape: "free:a" authors "opacity" as a property, not a group. Use replace() to change an entry\'s shape.',
    );
  });

  it("keeps the TypeError family every one of them threw", () => {
    expect(thrown(() => nestedTransaction())).toBeInstanceOf(TypeError);
    expect(thrown(() => commitInFlight())).toBeInstanceOf(RefusalError);
    expect((thrown(() => valueBatchStructural()) as RefusalError).refusal.kind).toBe(
      "structural-in-batch",
    );
  });
});

describe("the refusals the runtime spells inline", () => {
  it("renders the two unknown-id refusals and the invalid definition one", () => {
    expect(
      describeRefusal(
        (thrown(() => refuse({ kind: "unknown-motion", motionId: "m" })) as RefusalError).refusal,
      ),
    ).toBe('Unknown motion "m".');
    expect(message(() => refuse({ kind: "unknown-node", nodeId: "free:a" }))).toBe(
      'Unknown graph node "free:a".',
    );
    expect(message(() => refuse({ kind: "invalid-definition", diagnostics: [diagnostic] }))).toBe(
      describeDiagnostics([diagnostic]),
    );
  });

  it("leaves a disposed project a plain Error and a stale handle its own class", () => {
    const disposed = thrown(() => refuse({ kind: "disposed" }));
    expect(disposed).toBeInstanceOf(DisposedProjectError);
    expect(disposed).not.toBeInstanceOf(TypeError);
    expect((disposed as Error).message).toBe("ProjectRuntime is disposed.");
    const track = thrown(() =>
      refuse({ kind: "stale-handle", target: { kind: "track", id: "free:a" } }),
    );
    expect(track).toBeInstanceOf(StaleTrackHandleError);
    expect((track as Error).message).toBe('Track "free:a" is no longer live.');
    const motion = thrown(() =>
      refuse({ kind: "stale-handle", target: { kind: "motion", id: "m" } }),
    );
    expect(motion).toBeInstanceOf(StaleMotionHandleError);
    expect((motion as Error).message).toBe('Motion "m" is no longer live.');
  });
});

describe("the three decoded results", () => {
  it("states validity as one discriminant", () => {
    const accepted = validated({ valid: true, value: 7, diagnostics: [] });
    expect(accepted.kind).toBe("accepted");
    expect(expectValid(accepted)).toBe(7);
    expect(validated({ valid: true, value: null, diagnostics: [] }).kind).toBe("rejected");
    const rejected = validated<number>({ valid: false, value: null, diagnostics: [diagnostic] });
    expect(() => expectValid(rejected)).toThrow(describeDiagnostics([diagnostic]));
  });

  it("states the three live-write outcomes, and keeps the progress a patch answered", () => {
    expect(liveWrite(undefined).kind).toBe("no-hook");
    const patched = liveWrite({ patched: true, progress: 0.25 });
    expect(patched.kind).toBe("patched");
    expect(patched.kind === "patched" ? patched.progress : undefined).toBe(0.25);
    const rebuild = liveWrite({ patched: false, progress: 0.5 });
    expect(rebuild.kind).toBe("needs-rebuild");
    expect(rebuild.kind === "needs-rebuild" ? rebuild.progress : undefined).toBe(0.5);
  });

  it("resolves a token once, and refuses a stale one with the handle's own error", () => {
    const entries = new Map([["free:a", { token: 2 }]]);
    const live = resolveToken(entries, "free:a", 2);
    expect(isLive(live)).toBe(true);
    expect(expectLive(live, { kind: "track", id: "free:a" }).token).toBe(2);
    expect(isLive(resolveToken(entries, "free:a", 1))).toBe(false);
    expect(isLive(resolveToken(entries, "free:b", 2))).toBe(false);
    expect(isLive(stale())).toBe(false);
    expect(() => expectLive(stale(), { kind: "motion", id: "m" })).toThrow(StaleMotionHandleError);
  });
});
