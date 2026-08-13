import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine } from "../../../src/engine";
import type { GraphIR } from "../../../src/graph/ir";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/ports/fakes";
import { GraphPublisher, type PublisherNode } from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

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

const snapshot = (
  nodes: readonly PublisherNode[],
): GraphIR & { nodes: readonly PublisherNode[] } => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((item) => [item.id, item]))),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});

describe("composition and output-shape diagnostics", () => {
  it("diagnoses a plugin returning a non-record composition value", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "bad-opacity",
      keys: ["opacity"],
      compose: () => ["not", "a", "record"] as never,
    });
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
            {
              id: "arm",
              keyframes: { opacity: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1 }] } },
            },
          ],
        },
      ],
    });

    runtime.mount("hero/arm");
    const batch = runtime.seek("hero/arm", 0.5);
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.diagnostics[0]?.ruleId).toBe(
      "composition-output-shape",
    );
    runtime.dispose();
  });

  it("diagnoses an output observation whose source publishes a non-record value", () => {
    const source = node("hero/source", [], () => ({
      values: ["bad", "output"] as never,
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const observer = node(
      "hero/observer",
      [{ observerId: "hero/observer", sourceId: "hero/source", role: "output" }],
      () => ({ values: { local: true }, sourceProgress: 0, sourceRevisions: {} }),
    );
    const batch = new GraphPublisher(new PatchRegistry()).flush(
      snapshot([source, observer]),
      ["hero/source"],
      1,
    );

    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/observer")?.diagnostics[0]?.ruleId).toBe(
      "observation-output-shape",
    );
  });

  it("does not publish malformed composition values as ready patches", () => {
    const malformed = node("hero/bad", [], () => ({
      values: { nested: () => undefined } as never,
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const registry = new PatchRegistry();
    const batch = new GraphPublisher(registry).flush(snapshot([malformed]), ["hero/bad"], 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/bad");

    expect(patch?.status).toBe("error");
    expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-shape");
    expect(registry.get("hero/bad")?.status).toBe("error");
  });
});
