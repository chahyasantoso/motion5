import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type {
  AuthoredPluginGroup,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { StaleTrackHandleError, type TrackHandle } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { code, member } from "../../helpers/source-region";

/**
 * Issue #217, split from #212.
 *
 * One invariant: a stale `TrackHandle` fails the same way on every member, and `live` is the
 * non-throwing way to ask. `ProjectRuntime` is driven directly rather than through `Engine`,
 * because what these cases pin is the token policy of the object that owns the tokens.
 *
 * The failing-first run named `live` through a local `StaleSeam` interface and the error through
 * two string constants, because a test file that does not compile is not evidence. Both are deleted
 * here, by the commit that landed the source, so the shipped cases name the class and the member
 * directly. See ADR-056.
 */
const NODE_ID = "hero/arm";
const OTHER_ID = "hero/leg";
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

/**
 * The arguments each refusing member needs, keyed by member name.
 *
 * The resolver refuses before it reads an argument, so the values matter far less than the keys
 * do: this record is the declared half of `SH-1`'s coverage check, and a member added to the
 * handle later with no entry here fails that check rather than escaping the stale contract.
 *
 * `overrideValues` and `setValues` are that mechanism working as intended: both arrived with
 * ADR-059 and both are covered here rather than through a private copy of the stale contract.
 * `definition` and `requires` are the same mechanism again: the first is `track` renamed by the
 * slice that introduced the handle base, and the second is a member that slice added.
 *
 * `setRequire` and `removeRequire` were declared here by C1's evidence commit, before the source
 * that added them, exactly as `RA-32`'s record named tier 0's two verbs first. C2's four verbs
 * arrive the same way, and so do E's two property verbs. That is this gate working rather than
 * being weakened: the surface below is derived from the handle's own keys, so a member declared
 * here and missing from the handle fails `SH-1`, and a member added to the handle with no entry
 * here fails it too.
 */
const MEMBER_ARGUMENTS: Readonly<Record<string, readonly unknown[]>> = {
  definition: [],
  requires: [],
  remove: [],
  replace: [{ id: "arm" } satisfies TrackDefinition],
  addObserve: [{ source: OTHER_ID } satisfies ObservationDefinition],
  removeObserve: [{ source: OTHER_ID } satisfies ObservationDefinition],
  overrideValues: [{ x: 1 }],
  setValues: [{ x: 1 }],
  setRequire: ["fk", "base", OTHER_ID],
  removeRequire: ["fk", "base"],
  setKeyframeGroup: ["fk", { values: { length: 1 } } satisfies AuthoredPluginGroup],
  removeKeyframeGroup: ["fk"],
  setGoal: ["ik", "wrist", OTHER_ID],
  removeGoal: ["ik", "wrist"],
  setKeyframe: ["fk", "length", 1],
  removeKeyframe: ["fk", "length"],
};
/** The two members that answer on a stale handle rather than refusing. */
const NON_REFUSING = ["id", "live"] as const;
/**
 * The members that write, which are the ones a disposed runtime outranks.
 *
 * A partition of `MEMBER_ARGUMENTS` rather than a second list of members. `SH-8` asserts that this
 * and the readers below cover that record's keys exactly, so a member added to the handle later has
 * to be classified as one or the other rather than escaping the invariant by omission. That is
 * issue #283's rule: where a gate reads a hand-maintained list of subjects, a case asserts the list
 * covers the subjects actually present.
 *
 * Which side a member falls on is ADR-056's amendment rather than this file's. A write reported as
 * staleness invites a caller to re-resolve and try again, which cannot work on a runtime that is
 * gone; a read reported as staleness is true, and it is the family that record asked callers to
 * catch.
 */
const WRITERS = [
  "remove",
  "replace",
  "addObserve",
  "removeObserve",
  "overrideValues",
  "setValues",
  "setRequire",
  "removeRequire",
  "setKeyframeGroup",
  "removeKeyframeGroup",
  "setGoal",
  "removeGoal",
  "setKeyframe",
  "removeKeyframe",
] as const;
/** The two members that refuse on a stale handle and keep refusing on a disposed one. */
const READERS = ["definition", "requires"] as const;

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}
function handleFor(project: ProjectRuntime, id: string = NODE_ID): TrackHandle {
  return project.track(id);
}
/** Removes the node the handle captured, which is the plainest way to make the token stale. */
function staleHandle(project: ProjectRuntime): TrackHandle {
  const handle = handleFor(project);
  handle.remove();
  return handle;
}
/** Returns the thrown value, because each case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}
/**
 * Reads a member through its own property descriptor, so a getter is touched as a read and a
 * method as a call. `typeof handle.definition` cannot be asked here: on a stale handle that read is
 * itself the refusal being measured.
 */
function touch(handle: TrackHandle, member: string): () => unknown {
  const descriptor = Object.getOwnPropertyDescriptor(handle, member);
  if (descriptor === undefined) throw new Error(`No handle member named "${member}".`);
  const read = descriptor.get;
  if (read !== undefined) return () => read.call(handle);
  const call = descriptor.value as (...rest: unknown[]) => unknown;
  const args = [...(MEMBER_ARGUMENTS[member] ?? [])];
  return () => call.apply(handle, args);
}

describe("a stale TrackHandle refuses uniformly, and `live` asks without throwing", () => {
  it("SH-1 refuses on every member of the enumerated public handle surface", () => {
    const project = runtime();
    const handle = staleHandle(project);

    // Derived from the handle's own keys, never from the assertions below. A sixth member added to
    // `#handle` lands here first, which is the whole point of the case.
    const surface = Object.keys(handle).sort();
    const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS)].sort();
    expect(surface).toEqual(declared);

    // Collected rather than asserted one by one, so a red run names every member that escaped.
    const escaped = Object.keys(MEMBER_ARGUMENTS).filter((member) => {
      try {
        touch(handle, member)();
        return true;
      } catch (error) {
        return !(error instanceof StaleTrackHandleError);
      }
    });
    expect(escaped).toEqual([]);

    project.dispose();
  });

  it("SH-2 keeps the current message verbatim and carries its stable rule id", () => {
    const project = runtime();
    const handle = staleHandle(project);

    const thrown = thrownBy(() => handle.definition);

    // Two claims, deliberately separate: compatibility with what the getter already said, and the
    // identity a caller branches on instead of matching that string.
    expect((thrown as Error).message).toBe(`Track "${NODE_ID}" is no longer live.`);
    expect((thrown as StaleTrackHandleError).ruleId).toBe("stale-track-handle");
    expect(StaleTrackHandleError.ruleId).toBe("stale-track-handle");
    expect((thrown as Error).name).toBe("StaleTrackHandleError");
    expect((thrown as StaleTrackHandleError).nodeId).toBe(NODE_ID);

    project.dispose();
  });

  it("SH-3 stays a TypeError, so every existing narrowing keeps matching", () => {
    const project = runtime();
    const handle = staleHandle(project);

    expect(thrownBy(() => handle.definition)).toBeInstanceOf(TypeError);
    expect(thrownBy(() => handle.remove())).toBeInstanceOf(TypeError);
    expect(thrownBy(() => handle.remove())).toBeInstanceOf(StaleTrackHandleError);

    project.dispose();
  });

  it("SH-4 answers `live` on both sides of every invalidation and never throws doing it", () => {
    const project = runtime();
    const handle = handleFor(project);
    expect(handle.live).toBe(true);

    // A handle survives its own replacement, because replacement preserves node identity and
    // therefore the token. That is the one boundary the issue's wording did not draw.
    handle.replace({ id: "arm", duration: 250 });
    expect(handle.live).toBe(true);

    handle.remove();
    expect(handle.live).toBe(false);

    // The id comes back under a fresh token. The old handle stays refused, which is the guarantee
    // ADR-026 made and this slice keeps.
    const readded = project.addTrack({ id: "arm" }, { motionId: "hero" });
    expect(handle.live).toBe(false);
    expect(readded.live).toBe(true);

    project.dispose();
    expect(readded.live).toBe(false);
  });

  it("SH-5 lets expected cleanup guard on `live` instead of on try/catch", () => {
    const project = runtime();
    const handle = handleFor(project);
    let removals = 0;
    // The shape a React effect returns: run once on unmount, twice under StrictMode.
    const cleanup = (): void => {
      if (!handle.live) return;
      handle.remove();
      removals += 1;
    };

    expect(() => {
      cleanup();
      cleanup();
    }).not.toThrow();
    expect(removals).toBe(1);
    expect(handle.live).toBe(false);

    project.dispose();
  });

  it("SH-6 leaves the live path exactly as it was", () => {
    const project = runtime();
    const handle = handleFor(project);
    expect(handle.definition).toEqual({ id: "arm" });

    handle.replace({ id: "arm", duration: 250 });
    expect(handle.definition).toEqual({ id: "arm", duration: 250 });

    const observation: ObservationDefinition = { source: OTHER_ID };
    handle.addObserve(observation);
    expect(project.dependantsOf(OTHER_ID)).toEqual([NODE_ID]);
    handle.removeObserve(observation);
    expect(project.dependantsOf(OTHER_ID)).toEqual([]);

    handle.remove();
    expect(project.dependantsOf(OTHER_ID)).toEqual([]);

    project.dispose();
  });

  it("SH-7 keeps one token comparison and no branch inside the handle factory", () => {
    const source = code(RUNTIME_SOURCE);

    // The DRY claim, as a number. Three private mutators and the `definition` getter each carried a
    // copy of this comparison; a reintroduced silent return needs one of its own. It survives the
    // motion handle arriving because both retained kinds carry a token and `#liveOf` is generic over
    // the entry, so a second handle family cost a second probe name and no second comparison.
    const comparisons = [...source.matchAll(/\btoken\b\s*(?:===|!==)\s*\btoken\b/g)];
    expect(comparisons.map((match) => match[0])).toHaveLength(1);
    expect(source).toContain("#liveEntry(");
    expect(source).toContain("StaleTrackHandleError");

    // The factory decides nothing. Every member delegates, so there is no place left for a guard
    // to grow back into.
    // The member's own closing brace, not the next member's name. `#removeTrack` is in no part of
    // what this case claims, so renaming it or declaring anything between the two would have
    // decided a claim about the factory. See issue #314.
    const factory = member(source, "#handle(id: string, token: number): TrackHandle {");
    expect(factory.match(/\bif\s*\(/g) ?? []).toEqual([]);
    expect(factory).not.toMatch(/\breturn;/);
  });

  it("SH-8 reports the disposal rather than the staleness on every writing member", () => {
    const project = runtime();
    const handle = handleFor(project);

    // Derived from the argument record rather than from the assertions below, so a member added to
    // the handle later fails here until it is classified as a writer or a reader.
    expect([...WRITERS, ...READERS].sort()).toEqual(Object.keys(MEMBER_ARGUMENTS).sort());

    project.dispose();

    // Collected rather than asserted one by one, so a red run names every member that misreports.
    // Thirteen of the fourteen do today: `dispose` empties the retained map, so the token lookup
    // misses and the resolver answers staleness before anything asks about the runtime at all.
    const misreported = WRITERS.filter((member) => {
      const thrown = thrownBy(touch(handle, member));
      return (
        thrown instanceof StaleTrackHandleError ||
        (thrown as Error).message !== "ProjectRuntime is disposed."
      );
    });
    expect(misreported).toEqual([]);

    // `remove` is the one that was already right, because `#removeTrack` asked `#assertLive` before
    // it resolved. ADR-056's Consequences named it as the member showing that the runtime's own
    // lifecycle outranks one handle's, and this slice is the other thirteen agreeing with it.
    expect((thrownBy(() => handle.remove()) as Error).message).toBe("ProjectRuntime is disposed.");

    // The read half is unchanged, stated rather than implied, so a later slice that widens the
    // invariant to reads has to move these two rather than find them already green.
    const escaped = READERS.filter(
      (member) => !(thrownBy(touch(handle, member)) instanceof StaleTrackHandleError),
    );
    expect(escaped).toEqual([]);

    // Neither non-refusing member learns about the disposal the hard way.
    expect(handle.id).toBe(NODE_ID);
    expect(handle.live).toBe(false);
  });
});
