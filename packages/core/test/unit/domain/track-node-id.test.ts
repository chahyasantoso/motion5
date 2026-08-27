import { describe, expect, it } from "vitest";
import type { PluginComposer, PluginInputs } from "../../../src/domain/plugins";
import { Track, type TrackOptions } from "../../../src/domain/track";
import type { ImmutableRecord } from "../../../src/domain/values";
import { createPlugin, resolvePlugins } from "../../helpers/resolved-plugins";

// Slice C1 of issue #195. A Track must know its own qualified node id and hand it to every plugin
// it composes, so a plugin can tell "this node's own derived value" from "some other node's"
// without reaching outside the plugin contract. The value is the qualified id (`walker/forearm`,
// `~/free`), not the authored track id.
//
// The fourth `PluginComposer` parameter is appended rather than inserted, so a three-argument
// composer stays assignable. C1 lands the contract and the wiring on its own, before any solver
// reads it.
//
// The parent does not have this seam yet, so this file declares it locally and casts. The local
// `ComposerSeam` and the `nodeId`-bearing options seam are deleted by the commit that lands the
// contract, exactly as the composition split's red file declared `composeFrom` before it existed.

function createTimeline() {
  return { duration: 1, state: {}, progress: () => 0, kill: () => {} };
}

/** The fourth-argument seam C1 will make real. Exists only until `PluginComposer` gains `nodeId`. */
type ComposerSeam = (
  values: Readonly<ImmutableRecord>,
  progress: number,
  inputs: PluginInputs,
  nodeId: string,
) => ImmutableRecord;

/** A probe that records the fourth argument it receives, and returns a valid record. */
function createProbe(seen: string[]): ComposerSeam {
  return (values, _progress, _inputs, nodeId) => {
    seen.push(nodeId);
    return { ...values, marker: 1 };
  };
}

/** A `TrackOptions` seam that lets this red file name `nodeId` before `TrackOptions` has it. */
type TrackOptionsSeam = TrackOptions & { readonly nodeId: string };

describe("Track node id in the composer contract", () => {
  it("T-C1.1 passes the qualified node id to every composed plugin", () => {
    const motionSeen: string[] = [];
    const motionOptions = {
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(
        createPlugin("probe", createProbe(motionSeen) as unknown as PluginComposer),
      ),
      nodeId: "walker/forearm",
    } satisfies TrackOptionsSeam;
    new Track(motionOptions).compose();
    expect(motionSeen).toEqual(["walker/forearm"]);

    const freeSeen: string[] = [];
    const freeOptions = {
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(
        createPlugin("probe", createProbe(freeSeen) as unknown as PluginComposer),
      ),
      nodeId: "~/free",
    } satisfies TrackOptionsSeam;
    new Track(freeOptions).compose();
    expect(freeSeen).toEqual(["~/free"]);
  });

  it("T-C1.2 a three-argument composer stays assignable and composes identically", () => {
    // No nodeId on the parent: this guard only needs the three-argument composer to remain
    // assignable to `PluginComposer`, which is true before and after the appended-parameter change.
    const threeArg: PluginComposer = (values) => ({ ...values, fixed: 1 });
    const track = new Track({
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(createPlugin("three", threeArg)),
    });
    expect(track.compose().values).toEqual({ fixed: 1 });
  });

  it("T-C1.3 refuses an empty node id at construction", () => {
    const options = {
      interpolator: { create: createTimeline },
      nodeId: "",
    } satisfies TrackOptionsSeam;
    expect(() => new Track(options)).toThrow(TypeError);
  });
});
