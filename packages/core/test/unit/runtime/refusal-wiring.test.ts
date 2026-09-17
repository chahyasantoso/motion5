import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { StaleMotionHandleError } from "../../../src/contract/motion-handle";
import { StaleTrackHandleError } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import {
  DisposedProjectError,
  RefusalError,
  describeDiagnostics,
  type Refusal,
} from "../../../src/runtime/refusal";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #443, phase A step 3b: the refusals `ProjectRuntime` spells are the union, not prose.
 *
 * `refusal-data.test.ts` pins what each refusal says and what class it is thrown as, in isolation.
 * What this file pins is the wiring: every site in the runtime that refused inline now refuses
 * through `refuse`, `expectValid` or `expectLive`, so a caller can branch on `error.refusal.kind`
 * rather than parse a message, while the sentence and the class each site threw stay exactly what
 * they were.
 *
 * It fails without that wiring, because today those sites throw a bare `TypeError` or a bare
 * `Error` carrying no payload at all.
 */

const NODE_ID = "hero/arm";

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

function loaded(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}

/** Returns the thrown value, because each case asserts on the class and on the payload. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to refuse.");
}

/** The payload one refusal carries, from either of the two classes that carry one. */
function refusalIn(thrown: unknown): Refusal {
  if (thrown instanceof RefusalError || thrown instanceof DisposedProjectError)
    return thrown.refusal;
  throw new Error(`Expected a refusal carrying its payload, received ${String(thrown)}.`);
}

describe("the project runtime refuses through the union rather than inline", () => {
  it("names the node an unknown id asked for", () => {
    const project = loaded();

    const thrown = thrownBy(() => project.track("free:nope"));
    const refusal = refusalIn(thrown);

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toBe('Unknown graph node "free:nope".');
    expect(refusal.kind).toBe("unknown-node");
    expect(refusal.kind === "unknown-node" ? refusal.nodeId : undefined).toBe("free:nope");

    project.dispose();
  });

  it("names the motion at all three verbs that refuse an unknown one", () => {
    const project = loaded();

    const read = refusalIn(thrownBy(() => project.motion("nope")));
    const destroyed = refusalIn(thrownBy(() => project.destroyMotion("nope")));
    const added = refusalIn(thrownBy(() => project.addTrack({ id: "a" }, { motionId: "nope" })));

    for (const refusal of [read, destroyed, added]) {
      expect(refusal.kind).toBe("unknown-motion");
      expect(refusal.kind === "unknown-motion" ? refusal.motionId : undefined).toBe("nope");
    }

    project.dispose();
  });

  it("carries the diagnostics an invalid definition was refused for", () => {
    const project = loaded();
    const invalid = { id: "a", keyframes: 5 } as unknown as TrackDefinition;

    const thrown = thrownBy(() => project.addTrack(invalid));
    const refusal = refusalIn(thrown);
    const diagnostics = refusal.kind === "invalid-definition" ? refusal.diagnostics : [];

    expect(thrown).toBeInstanceOf(TypeError);
    expect(refusal.kind).toBe("invalid-definition");
    expect(diagnostics.length).toBeGreaterThan(0);
    // The message is still the rendering of those diagnostics, and now it has one owner.
    expect((thrown as Error).message).toBe(describeDiagnostics(diagnostics));

    project.dispose();
  });

  it("carries the disposal refusal, still an Error and still not a TypeError", () => {
    const project = loaded();
    project.dispose();

    const thrown = thrownBy(() => project.mount(NODE_ID));

    expect(thrown).toBeInstanceOf(DisposedProjectError);
    expect(thrown).not.toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toBe("ProjectRuntime is disposed.");
    expect(refusalIn(thrown).kind).toBe("disposed");
  });

  it("keeps both stale-handle classes and both sentences the contract layer owns", () => {
    const project = loaded();
    const track = project.track(NODE_ID);
    const motion = project.motion("hero");

    project.track(NODE_ID).remove();
    project.destroyMotion("hero");

    const staleTrack = thrownBy(() => track.definition);
    const staleMotion = thrownBy(() => motion.definition);

    expect(staleTrack).toBeInstanceOf(StaleTrackHandleError);
    expect((staleTrack as Error).message).toBe('Track "hero/arm" is no longer live.');
    expect(staleMotion).toBeInstanceOf(StaleMotionHandleError);
    expect((staleMotion as Error).message).toBe('Motion "hero" is no longer live.');
    expect(track.live).toBe(false);
    expect(motion.live).toBe(false);

    project.dispose();
  });
});
