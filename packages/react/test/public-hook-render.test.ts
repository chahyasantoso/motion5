import { createElement, type RefCallback } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import type { LivePatch, PatchSource, PatchDerivation } from "@motion5/react";
import { rowPatchSource, useDerivedDomPatch, usePatch } from "@motion5/react";
import type { Patch, PluginDefinition, ResolvedInput, ValueSpec } from "../../core/src/contract/v5";
import { PluginCatalog } from "../../core/src/domain/plugin-catalog";
import { Engine, type ProjectHandle } from "../../core/src/engine";
import { createManualClock } from "../../core/src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../core/src/testing/fakes";
import { project, record, track } from "../../core/test/support/v5-builders";

const NODE = "demo/rig";
const ALIAS = "marker/upper";

const POSE_TABLE: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        rotation: { kind: "number", optional: true },
      },
    },
  },
};
const INSPECT: ValueSpec = { kind: "record", fields: { residual: { kind: "number" } } };

type PoseInput = ResolvedInput<{ readonly phase: number }>;

const POSE: PluginDefinition<PoseInput> = {
  id: "pose",
  inputs: { values: { kind: "record", fields: { phase: { kind: "number" } } } },
  outputs: { values: POSE_TABLE, inspect: INSPECT },
  transform(input) {
    const phase = input.values.phase;
    if (phase < 0)
      return { values: [{ id: "lower", cells: { x: 0, y: 0 } }], inspect: { residual: phase } };
    const upper =
      phase === 3
        ? { id: "upper", cells: { x: 3, y: 4, rotation: 45 } }
        : { id: "upper", cells: { x: phase, y: phase + 1 } };
    return {
      values: [upper, { id: "lower", cells: { x: 0, y: 0 } }],
      inspect: { residual: phase },
    };
  },
};

function setup(): { handle: ProjectHandle; dispose(): void } {
  const plugins = new PluginCatalog();
  plugins.register(POSE);
  const engine = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  });
  const handle = engine.load(
    project([track({ id: "rig", plugin: "pose", values: record({ phase: 1 }) })]),
  );
  handle.mount(NODE);
  handle.seek(NODE, 0.5);
  return { handle, dispose: () => handle.dispose() };
}

function setPhase(handle: ProjectHandle, phase: number): void {
  handle.track(NODE).input.values.setField({ field: "phase" }, phase);
}

interface FakeStyle extends Record<string, unknown> {
  removeProperty(property: string): void;
}

interface FakeSvgTarget {
  style: FakeStyle;
  ownerSVGElement: null;
  attributes: Map<string, string>;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

function createSvgTarget(): FakeSvgTarget {
  const style: FakeStyle = {
    visibility: undefined,
    removeProperty(property) {
      this[property] = undefined;
    },
  };
  const attributes = new Map<string, string>();
  return {
    style,
    ownerSVGElement: null,
    attributes,
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
  };
}

const marker: PatchDerivation = ([cells = {}]) => {
  const derived: Record<string, number> = {
    x: Number(cells.x ?? 0),
    y: Number(cells.y ?? 0),
  };
  if (cells.rotation !== undefined) derived.rotation = Number(cells.rotation);
  return derived;
};

function mountRow(
  source: PatchSource,
  target: FakeSvgTarget,
): {
  renders(): number;
  update(next: PatchSource): void;
  unmount(): void;
} {
  let renders = 0;
  function Consumer(props: { source: PatchSource }): ReturnType<typeof createElement> {
    renders += 1;
    const bind: RefCallback<SVGGElement> = useDerivedDomPatch<SVGGElement>(
      props.source,
      [ALIAS],
      marker,
    );
    return createElement("g", { ref: bind });
  }
  let renderer:
    | {
        update(element: ReturnType<typeof createElement>): void;
        unmount(): void;
      }
    | undefined;
  act(() => {
    renderer = create(createElement(Consumer, { source }), { createNodeMock: () => target });
  });
  return {
    renders: () => renders,
    update: (next) => {
      act(() => {
        renderer?.update(createElement(Consumer, { source: next }));
      });
    },
    unmount: () => {
      act(() => {
        act(() => {
          act(() => {
            renderer?.unmount();
          });
        });
      });
    },
  };
}

function valuesOf(patch: LivePatch | undefined): unknown {
  return patch?.status === "ready" ? patch.outputs.values : undefined;
}

function rowSource(handle: ProjectHandle) {
  return rowPatchSource(handle, { nodeId: NODE, output: "values", rowId: "upper", as: ALIAS });
}

describe("React row rendering through the real engine", () => {
  it("H-4 renders the selected row, updates on a cheap edit and reads a named non-values output", () => {
    const { handle, dispose } = setup();
    const snapshots: Array<LivePatch | undefined> = [];
    const source = rowSource(handle);
    function Consumer(): null {
      snapshots.push(usePatch(source, ALIAS));
      return null;
    }
    let renderer: { unmount(): void } | undefined;
    act(() => {
      renderer = create(createElement(Consumer));
    });
    expect(snapshots.at(-1)?.status).toBe("ready");
    expect(valuesOf(snapshots.at(-1))).toEqual({ x: 1, y: 2 });

    act(() => setPhase(handle, 2));
    expect(valuesOf(snapshots.at(-1))).toEqual({ x: 2, y: 3 });

    const raw = handle.get(NODE);
    expect(raw?.status).toBe("ready");
    if (raw?.status === "ready") expect(raw.outputs.inspect).toEqual({ residual: 2 });

    act(() => {
      renderer?.unmount();
    });
    dispose();
  });

  it("answers missing output, missing row and wrong kind without inventing a pose", () => {
    const { handle, dispose } = setup();
    const cases = [
      rowPatchSource(handle, { nodeId: NODE, output: "absent", rowId: "upper", as: ALIAS }),
      rowPatchSource(handle, { nodeId: NODE, output: "inspect", rowId: "upper", as: ALIAS }),
      rowPatchSource(handle, { nodeId: NODE, output: "values", rowId: "ghost", as: ALIAS }),
    ];
    for (const source of cases) {
      const seen: Array<LivePatch | undefined> = [];
      function Consumer(): null {
        seen.push(usePatch(source, ALIAS));
        return null;
      }
      let renderer: { unmount(): void } | undefined;
      act(() => {
        renderer = create(createElement(Consumer));
      });
      const patch = seen.at(-1);
      expect(patch?.status).toBe("blocked");
      if (patch?.status === "blocked") {
        expect(patch.nodeId).toBe(ALIAS);
        expect(Object.keys(patch).sort()).toEqual(["diagnostics", "nodeId", "revision", "status"]);
      }
      act(() => {
        renderer?.unmount();
      });
    }
    dispose();
  });

  it("hides a row-derived target on missing row, restores it and clears an omitted key", () => {
    const { handle, dispose } = setup();
    const target = createSvgTarget();
    const mounted = mountRow(rowSource(handle), target);
    expect(target.style.transform).toBe("translate3d(1px, 2px, 0px)");
    expect(target.style.visibility).toBeUndefined();

    act(() => setPhase(handle, -1));
    expect(target.style.visibility).toBe("hidden");
    expect(target.style.transform).toBeUndefined();

    act(() => setPhase(handle, 3));
    expect(target.style.visibility).toBeUndefined();
    expect(target.style.transform).toBe("translate3d(3px, 4px, 0px) rotate(45deg)");

    act(() => setPhase(handle, 4));
    expect(target.style.visibility).toBeUndefined();
    expect(target.style.transform).toBe("translate3d(4px, 5px, 0px)");
    expect(target.style.rotation).toBeUndefined();

    mounted.unmount();
    dispose();
  });

  it("keeps one subscription across rerenders, replaces it with the mapping and remounts", () => {
    const { handle, dispose } = setup();
    const counters = { subscribes: 0, releases: 0 };
    const counted = (source: PatchSource): PatchSource => ({
      get: (nodeId) => source.get(nodeId),
      subscribeNode(nodeId, listener) {
        counters.subscribes += 1;
        const release = source.subscribeNode(nodeId, listener);
        return () => {
          counters.releases += 1;
          release();
        };
      },
    });
    const upper = counted(rowSource(handle));
    const lower = counted(
      rowPatchSource(handle, { nodeId: NODE, output: "values", rowId: "lower", as: ALIAS }),
    );
    const target = createSvgTarget();
    const mounted = mountRow(upper, target);
    expect(counters).toEqual({ subscribes: 1, releases: 0 });
    expect(mounted.renders()).toBe(1);
    expect(target.style.transform).toBe("translate3d(1px, 2px, 0px)");

    mounted.update(upper);
    expect(counters).toEqual({ subscribes: 1, releases: 0 });
    expect(mounted.renders()).toBe(2);

    mounted.update(lower);
    expect(counters).toEqual({ subscribes: 2, releases: 1 });
    expect(target.style.transform).toBe("translate3d(0px, 0px, 0px)");

    mounted.unmount();
    expect(counters).toEqual({ subscribes: 2, releases: 2 });

    const remounted = mountRow(lower, target);
    expect(counters).toEqual({ subscribes: 3, releases: 2 });
    remounted.unmount();
    expect(counters).toEqual({ subscribes: 3, releases: 3 });
    dispose();
  });

  it("delivers alias destruction on removal, and unmounts safely after disposal", () => {
    const { handle, dispose } = setup();
    const source = rowSource(handle);
    const events: Patch[] = [];
    source.subscribeNode(ALIAS, (patch) => events.push(patch));
    act(() => handle.track(NODE).remove());
    expect(source.get(ALIAS)).toBeUndefined();
    const destroyed = events.at(-1);
    expect(destroyed?.status).toBe("destroyed");
    expect(destroyed?.nodeId).toBe(ALIAS);
    expect(typeof destroyed?.revision).toBe("number");
    dispose();

    const second = setup();
    const target = createSvgTarget();
    const mounted = mountRow(rowSource(second.handle), target);
    second.dispose();
    mounted.unmount();
  });
});
