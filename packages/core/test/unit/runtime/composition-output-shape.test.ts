import { describe, expect, it } from "vitest";
import type { PluginDefinition } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { Engine } from "../../../src/engine";
import { deriveDependants, type GraphIR } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import { record, track } from "../../support/v5-builders";

const node = (
  id: string,
  edges: GraphIR["nodes"][number]["edges"],
  compose: PublisherNode["compose"],
): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });

const snapshot = (nodes: readonly PublisherNode[]): PublisherSnapshot => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((item) => [item.id, item]))),
  dependants: deriveDependants(nodes),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

const BAD_OUTPUT: PluginDefinition = {
  id: "bad-output",
  inputs: { values: { kind: "record", fields: { opacity: { kind: "number" } } } },
  outputs: { values: { kind: "record", fields: { opacity: { kind: "number" } } } },
  transform() {
    return ["not", "a", "record"] as never;
  },
};

describe("composition and output-shape diagnostics", () => {
  it("diagnoses a plugin returning a non-record composition value", () => {
    const plugins = new PluginCatalog();
    plugins.register(BAD_OUTPUT);
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    });
    const runtime = engine.load({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            track({
              id: "arm",
              plugin: BAD_OUTPUT.id,
              values: record({
                opacity: [
                  { p: 0, v: 0 },
                  { p: 1, v: 1 },
                ],
              }),
            }),
          ],
        },
      ],
    });

    runtime.mount("hero/arm");
    const batch = runtime.seek("hero/arm", 0.5);
    const heroArmPatch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    // A transform that returned a non-record output set is published as `error`, which is the
    // status owning this diagnostic.
    if (heroArmPatch?.status !== "error")
      throw new Error(`hero/arm is ${heroArmPatch?.status ?? "absent"}, not error.`);
    expect(heroArmPatch.diagnostics[0]?.ruleId).toBe("output-invalid");
    runtime.dispose();
  });

  it("does not publish malformed composition values as ready patches", () => {
    const malformed = node("hero/bad", [], () => ({
      outputs: { values: { nested: () => undefined } as never },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const registry = new PatchRegistry();
    const batch = new GraphPublisher(registry).flush(snapshot([malformed]), ["hero/bad"], 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/bad");

    expect(patch?.status).toBe("error");
    if (patch?.status !== "error")
      throw new Error(`hero/bad is ${patch?.status ?? "absent"}, not error.`);
    expect(patch.diagnostics[0]?.ruleId).toBe("composition-output-shape");
    expect(registry.get("hero/bad")?.status).toBe("error");
  });
});
