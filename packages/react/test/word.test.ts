import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { Word } from "@motion5/react/engine";
import type { LivePatch, PatchListener, PatchSource } from "@motion5/react/engine";

function createSource(): PatchSource & { publish(nodeId: string, y: number): void } {
  const listeners = new Map<string, PatchListener>();
  const revisions = new Map<string, number>();
  return {
    get: () => undefined,
    subscribeNode(nodeId, listener) {
      listeners.set(nodeId, listener);
      return () => void listeners.delete(nodeId);
    },
    publish(nodeId, y) {
      const revision = (revisions.get(nodeId) ?? 0) + 1;
      revisions.set(nodeId, revision);
      const patch: LivePatch = {
        nodeId,
        revision,
        outputs: { values: { y } },
        sourceProgress: 0,
        sourceRevisions: {},
        status: "ready",
        diagnostics: [],
      };
      listeners.get(nodeId)?.(patch);
    },
  };
}

function render(source: PatchSource, text: string, nodes: readonly string[]) {
  const targets = new Map<string, { style: Record<string, unknown> }>();
  let renderer: ReactTestRenderer | undefined;
  act(() => {
    renderer = create(createElement(Word, { source, nodes, text, glyphClassName: "g" }), {
      createNodeMock(element) {
        const target = { style: {} };
        targets.set(String(Reflect.get(Object(element.props), "children")), target);
        return target;
      },
    });
  });
  if (renderer === undefined) throw new Error("Nothing rendered.");
  return { json: renderer.toJSON(), targets };
}

describe("Word", () => {
  it("binds each glyph to its node, in order", () => {
    const source = createSource();
    const { targets } = render(source, "AB", ["m/a", "m/b"]);
    act(() => {
      source.publish("m/a", 5);
      source.publish("m/b", 9);
    });
    expect(targets.get("A")?.style.transform).toBe("translate3d(0px, 5px, 0px)");
    expect(targets.get("B")?.style.transform).toBe("translate3d(0px, 9px, 0px)");
  });

  it("renders each glyph as a transformable box a screen reader skips, and names the word", () => {
    const { json } = render(createSource(), "AB", ["m/a", "m/b"]);
    expect(json).toMatchObject({
      type: "span",
      props: { "aria-label": "AB" },
      children: [
        {
          type: "span",
          props: {
            "aria-hidden": true,
            className: "g",
            style: { display: "inline-block" },
          },
          children: ["A"],
        },
        { type: "span", children: ["B"] },
      ],
    });
  });

  it("keeps a space as plain text and spends no node on it", () => {
    const source = createSource();
    const { json, targets } = render(source, "A B", ["m/a", "m/b"]);
    act(() => source.publish("m/b", 3));
    expect(targets.get("B")?.style.transform).toBe("translate3d(0px, 3px, 0px)");
    expect(json).toMatchObject({ children: [{ children: ["A"] }, " ", { children: ["B"] }] });
  });

  it("keeps a surrogate pair as one glyph", () => {
    const source = createSource();
    const { targets } = render(source, "😀", ["m/a"]);
    expect([...targets.keys()]).toEqual(["😀"]);
  });

  it("binds each glyph to a row of one table node, the first glyph to row 0", () => {
    const listeners = new Set<PatchListener>();
    const source: PatchSource = {
      get: () => undefined,
      subscribeNode(nodeId, listener) {
        if (nodeId === "m/word") listeners.add(listener);
        return () => void listeners.delete(listener);
      },
    };
    const targets = new Map<string, { style: Record<string, unknown> }>();
    act(() => {
      create(createElement(Word, { source, rows: "m/word", text: "A B", glyphClassName: "g" }), {
        createNodeMock(element) {
          const target = { style: {} };
          targets.set(String(Reflect.get(Object(element.props), "children")), target);
          return target;
        },
      });
    });
    const table: LivePatch = {
      nodeId: "m/word",
      revision: 1,
      outputs: {
        values: [
          { id: "0", cells: { y: 4 } },
          { id: "1", cells: { y: 8 } },
        ],
      },
      sourceProgress: 0,
      sourceRevisions: {},
      status: "ready",
      diagnostics: [],
    };
    act(() => {
      for (const listener of listeners) listener(table);
    });
    expect(targets.get("A")?.style.transform).toBe("translate3d(0px, 4px, 0px)");
    expect(targets.get("B")?.style.transform).toBe("translate3d(0px, 8px, 0px)");
  });

  it.each([
    ["too few nodes", "ABC", ["m/a", "m/b"]],
    ["too many nodes", "A", ["m/a", "m/b"]],
  ])("refuses %s, naming both counts", (_name, text, nodes) => {
    const source = createSource();
    expect(() => render(source, text, nodes)).toThrow(
      `Word "${text}" has ${[...text].length} glyphs but ${nodes.length} nodes.`,
    );
  });
});
