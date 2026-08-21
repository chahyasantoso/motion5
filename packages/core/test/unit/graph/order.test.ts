import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import type { GraphNode } from "../../../src/graph/ir";
import { buildGraphIR } from "../../../src/graph/ir";
import { orderGraph } from "../../../src/graph/order";

const node = (id: string, authoredIndex: number, sources: readonly string[] = []): GraphNode => {
  const edges = sources.map((sourceId) => ({ observerId: id, sourceId, role: "output" as const }));
  const built: GraphNode = {
    id,
    owner: id.startsWith("~/") ? "free" : "motion",
    authoredIndex,
    track: { id: id.slice(id.indexOf("/") + 1) },
    edges: Object.freeze(edges),
  };
  return Object.freeze(built);
};

const ruleAndIds = (diagnostics: readonly { ruleId: string; ids?: readonly string[] }[]) =>
  diagnostics.map(({ ruleId, ids }) => [ruleId, ids]);

describe("canonical order and cycle detection", () => {
  it("emits every source before its observers and composes a diamond once", () => {
    const result = orderGraph([
      node("hero/sink", 3, ["hero/left", "hero/right"]),
      node("hero/right", 2, ["hero/root"]),
      node("hero/left", 1, ["hero/root"]),
      node("hero/root", 0),
    ]);
    expect(result.diagnostics).toEqual([]);
    expect(result.order).toEqual(["hero/root", "hero/left", "hero/right", "hero/sink"]);
    expect(Object.isFrozen(result.order)).toBe(true);
  });

  it("is a pure function of qualified ids and authored order, not of input order", () => {
    const first = orderGraph([
      node("hero/root", 0),
      node("hero/left", 1, ["hero/root"]),
      node("hero/right", 2, ["hero/root"]),
      node("~/cursor", 0),
    ]);
    const second = orderGraph([
      node("~/cursor", 0),
      node("hero/right", 2, ["hero/root"]),
      node("hero/root", 0),
      node("hero/left", 1, ["hero/root"]),
    ]);
    expect(first.order).toEqual(["hero/root", "hero/left", "hero/right", "~/cursor"]);
    expect(second.order).toEqual(first.order);
  });

  it("keeps disconnected components in canonical id order", () => {
    const result = orderGraph([node("~/cursor", 0), node("hero/arm", 0), node("caption/label", 0)]);
    expect(result.order).toEqual(["caption/label", "hero/arm", "~/cursor"]);
  });

  it("reports a self cycle as a single-node path", () => {
    const result = orderGraph([node("hero/loop", 0, ["hero/loop"])]);
    expect(result.order).toBeUndefined();
    expect(ruleAndIds(result.diagnostics)).toEqual([["graph-cycle", ["hero/loop"]]]);
  });

  it("names the minimal path of every distinct cycle", () => {
    const result = orderGraph([
      node("rig/a", 0, ["rig/c"]),
      node("rig/b", 1, ["rig/a"]),
      node("rig/c", 2, ["rig/b", "rig/a"]),
    ]);
    expect(result.order).toBeUndefined();
    expect(ruleAndIds(result.diagnostics)).toEqual([
      ["graph-cycle", ["rig/a", "rig/c"]],
      ["graph-cycle", ["rig/a", "rig/b", "rig/c"]],
    ]);
  });

  it("carries canonical order on the immutable IR", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "arm", observes: [{ source: "~/cursor", role: "input" }] }],
        },
      ],
      freeTracks: [{ id: "cursor" }],
    };
    const result = buildGraphIR(project);
    expect(result.diagnostics).toEqual([]);
    expect(result.graph?.order).toEqual(["~/cursor", "hero/arm"]);
    expect(Object.isFrozen(result.graph?.order)).toBe(true);
  });

  it("rejects a cyclic project before mount", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "a", observes: [{ source: "b" }] },
            { id: "b", observes: [{ source: "a" }] },
          ],
        },
      ],
    };
    const result = buildGraphIR(project);
    expect(result.graph).toBeUndefined();
    expect(ruleAndIds(result.diagnostics)).toEqual([["graph-cycle", ["rig/a", "rig/b"]]]);
  });

  it("produces byte-identical diagnostics for the same cyclic input", () => {
    const cyclic = [node("rig/a", 0, ["rig/b"]), node("rig/b", 1, ["rig/a"])];
    expect(JSON.stringify(orderGraph(cyclic).diagnostics)).toEqual(
      JSON.stringify(orderGraph([...cyclic].reverse()).diagnostics),
    );
  });
});
