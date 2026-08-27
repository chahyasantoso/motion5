import { describe, expect, it } from "vitest";
import type { PluginComposer } from "../../../src/domain/plugins";
import { Track } from "../../../src/domain/track";
import { createPlugin, resolvePlugins } from "../../helpers/resolved-plugins";

// Slice C1 of issue #195. A Track must know its own qualified node id and hand it to every plugin
// it composes, so a plugin can tell "this node's own derived value" from "some other node's"
// without reaching outside the plugin contract. The value is the qualified id (`walker/forearm`,
// `~/free`), not the authored track id.
//
// The fourth `PluginComposer` parameter is appended rather than inserted, so a three-argument
// composer stays assignable. C1 lands the contract and the wiring on its own, before any solver
// reads it.

function createTimeline() {
  return { duration: 1, state: {}, progress: () => 0, kill: () => {} };
}

/** A probe that records the fourth argument it receives, and returns a valid record. */
function createProbe(seen: string[]): PluginComposer {
  return (values, _progress, _inputs, nodeId) => {
    seen.push(nodeId);
    return { ...values, marker: 1 };
  };
}

describe("Track node id in the composer contract", () => {
  it("CN-1 passes the qualified node id to every composed plugin", () => {
    const motionSeen: string[] = [];
    const motionOptions = {
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(createPlugin("probe", createProbe(motionSeen))),
      nodeId: "walker/forearm",
    };
    new Track(motionOptions).compose();
    expect(motionSeen).toEqual(["walker/forearm"]);

    const freeSeen: string[] = [];
    const freeOptions = {
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(createPlugin("probe", createProbe(freeSeen))),
      nodeId: "~/free",
    };
    new Track(freeOptions).compose();
    expect(freeSeen).toEqual(["~/free"]);
  });

  it("CN-2 a three-argument composer stays assignable and composes identically", () => {
    const threeArg: PluginComposer = (values) => ({ ...values, fixed: 1 });
    const track = new Track({
      interpolator: { create: createTimeline },
      plugins: resolvePlugins(createPlugin("three", threeArg)),
      nodeId: "~/three-arg",
    });
    expect(track.compose().values).toEqual({ fixed: 1 });
  });

  it("CN-3 refuses an empty node id at construction", () => {
    const options = {
      interpolator: { create: createTimeline },
      nodeId: "",
    };
    expect(() => new Track(options)).toThrow(TypeError);
  });
});
