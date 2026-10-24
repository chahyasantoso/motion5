import { describe, expect, it, vi } from "vitest";
import type {
  Patch,
  PluginDefinition,
  ProjectDefinition,
  ResolvedInput,
  Table,
  ValueSpec,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime, type StagedTrack } from "../../src/runtime/project-runtime";
import type { RefusalError } from "../../src/runtime/refusal";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { project, record, row, table, track } from "../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
type TranslateValues = Readonly<Record<"dx", number>>;
type TranslateInput = ResolvedInput<TranslateValues> & {
  readonly requires: { readonly data: { readonly values: Table } };
};
const TRANSLATE: PluginDefinition<TranslateInput> = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  transform(input) {
    const source = input.requires.data.values;
    return {
      values: source.map((entry) => ({
        id: entry.id,
        cells: {
          x: Number(entry.cells.x) + input.values.dx,
          y: Number(entry.cells.y),
        },
      })),
    };
  },
};
const OPTIONAL: PluginDefinition<TranslateInput> = {
  id: "optional-translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT }, optional: true } },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};

function catalog<Input extends ResolvedInput>(
  ...plugins: readonly PluginDefinition<Input>[]
): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll(plugins);
  return result;
}

const POINTS = track({ id: "points", values: table(row("a", { x: 1, y: 2 })) });
const SHIFTED = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 10 }),
  requires: { data: "points" },
});
const DEFINITION: ProjectDefinition = project([POINTS, SHIFTED]);

function engine(plugins: PluginCatalog = catalog(TRANSLATE)) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  });
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("structural edits commit through the one path and refuse without changing anything", () => {
  it("commits a replacement, publishes once, and leaves the consumer readable", () => {
    const handle = engine().load(DEFINITION);
    try {
      handle.mount("demo/points");
      handle.mount("demo/shifted");
      const before = handle.seek("demo/shifted", 0);
      expect(before.patches[0]?.status).toBe("ready");

      const published: Patch[] = [];
      handle.subscribeNode("demo/shifted", (patch) => published.push(patch));
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      handle.track("demo/points").input.replace({
        values: table(row("a", { x: 5, y: 2 })),
      });

      expect(flush).toHaveBeenCalledTimes(1);
      expect(published).toHaveLength(1);
      const after = published[0];
      expect(after?.status).toBe("ready");
      expect(after?.status === "ready" ? after.outputs.values : undefined).toEqual([
        { id: "a", cells: { x: 15, y: 2 } },
      ]);
      expect(handle.track("demo/points").definition.input?.values).toEqual([
        { id: "a", cells: { x: 5, y: 2 } },
      ]);
    } finally {
      handle.dispose();
    }
  });

  it("rolls the whole recipe back when a removal leaves a dependant, and publishes nothing", () => {
    const handle = engine().load(DEFINITION);
    try {
      handle.mount("demo/points");
      handle.mount("demo/shifted");
      expect(handle.seek("demo/shifted", 0).patches[0]?.status).toBe("ready");
      const published: Patch[] = [];
      handle.subscribeNode("demo/shifted", (patch) => published.push(patch));
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      const thrown = thrownBy(() => handle.track("demo/points").remove());

      expect((thrown as Error).message).toMatch(/^edge-unknown-source at demo\/shifted/);
      expect(flush).not.toHaveBeenCalled();
      expect(published).toEqual([]);
      expect(handle.track("demo/points").definition.id).toBe("points");
      expect(handle.track("demo/shifted").definition.input?.requires).toEqual({ data: "points" });
      expect(handle.seek("demo/shifted", 0.5).patches[0]?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("refuses the same way standalone and inside a recipe", () => {
    const standalone = engine().load(DEFINITION);
    const recipe = engine().load(DEFINITION);
    try {
      const outside = thrownBy(() => standalone.track("demo/points").remove());
      const inside = thrownBy(() =>
        recipe.edit(() => {
          recipe.track("demo/points").remove();
        }),
      );
      expect((inside as Error).message).toBe((outside as Error).message);
      expect((inside as RefusalError).editIndex).toBe(0);
      expect(recipe.track("demo/points").definition.id).toBe("points");
    } finally {
      standalone.dispose();
      recipe.dispose();
    }
  });

  it("sees an earlier recipe step when a later one removes its source", () => {
    const handle = engine().load(DEFINITION);
    try {
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      handle.edit(() => {
        handle.track("demo/shifted").remove();
        handle.track("demo/points").remove();
      });
      expect(flush).toHaveBeenCalledTimes(1);
      expect(handle.tryTrack("demo/shifted")).toBeUndefined();
      expect(handle.tryTrack("demo/points")).toBeUndefined();
    } finally {
      handle.dispose();
    }
  });
});

describe("a binding edit keeps the live write and a replacement drops it", () => {
  function journal() {
    const built: string[] = [];
    return {
      built,
      runtime: new ProjectRuntime(
        project([
          POINTS,
          track({
            id: "follower",
            plugin: "optional-translate",
            values: record({ dx: 1 }),
            requires: { data: "points" },
          }),
        ]),
        {
          clock: createManualClock(),
          compose: (node) => () => ({
            outputs: { values: { node: node.id } },
            sourceProgress: 0,
            sourceRevisions: {},
          }),
          capabilities: catalog(OPTIONAL),
          isPluginRegistered: (pluginId) => pluginId === OPTIONAL.id,
          stageTrack: (_track, nodeId): StagedTrack => {
            built.push(nodeId);
            return { commit: () => undefined, rollback: () => undefined };
          },
        },
      ),
    };
  }

  it("keeps it across unbind and bind, and clears it on replace and remove", () => {
    const { built, runtime } = journal();
    try {
      const follower = runtime.track("demo/follower");
      follower.writeValues({ dx: 2 });
      expect(built).toEqual([]);

      follower.input.requires.remove("data");
      follower.input.requires.set("data", "points");
      expect(built).toEqual([]);
      expect(follower.definition.input?.requires).toEqual({ data: "points" });

      follower.replace(follower.definition);
      expect(built).toEqual(["demo/follower"]);

      follower.input.requires.remove("data");
      follower.input.requires.set("data", "points");
      expect(built).toEqual(["demo/follower"]);

      follower.remove();
      expect(built).toEqual(["demo/follower"]);
      expect(runtime.tryTrack("demo/follower")).toBeUndefined();
    } finally {
      runtime.dispose();
    }
  });

  it("clears it on a whole-input replacement", () => {
    const { built, runtime } = journal();
    try {
      const follower = runtime.track("demo/follower");
      follower.writeValues({ dx: 2 });
      follower.input.replace({ values: record({ dx: 3 }), requires: { data: "points" } });
      expect(built).toEqual(["demo/follower"]);
      expect(follower.definition.input?.values).toEqual({ dx: 3 });
    } finally {
      runtime.dispose();
    }
  });
});
