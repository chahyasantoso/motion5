import { describe, expect, it, vi } from "vitest";
import {
  defineModel,
  ok,
  refused,
  type Model,
  type PluginDefinition,
  type ProjectDefinition,
  type TrackDefinition,
  type Value,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

const FIXTURE_OUT_1 = defineModel({
  id: "FixtureOut1",
  spec: { kind: "record", fields: { rows: { kind: "number" } } },
});
const FIXTURE_OUT_2 = defineModel({
  id: "FixtureOut2",
  spec: { kind: "record", fields: { n: { kind: "number" } } },
});

function rowIds(value: Value): readonly string[] {
  return Array.isArray(value) ? value.map((row) => row.id) : [];
}

const Rows = defineModel<unknown, { readonly ids: readonly string[] }>({
  id: "Rows",
  spec: { kind: "table", schema: { row: { fields: { n: { kind: "number" } } } } },
  parse: (value) => ok({ ids: rowIds(value) }),
});

const Copied = defineModel<unknown, { readonly ids: readonly string[] }>({
  id: "Copied",
  spec: { kind: "table", schema: { row: { fields: { n: { kind: "number" } } } } },
  parse: (value) => ok({ ids: rowIds(value) }),
});

/** Publishes one row per source row, so its row set follows its source's structure. */
const COPY: PluginDefinition = {
  id: "copy",
  inputs: { requires: { source: Rows } },
  outputs: { values: Copied },
  transform: ({ requires }) => ({ values: Reflect.get(Object(requires), "source") as Value }),
};

/** Reads the first reader's output, one graph hop further from the edited source. */
const COUNT: PluginDefinition = {
  id: "count",
  inputs: { requires: { source: Copied } },
  outputs: { values: FIXTURE_OUT_1 },
  transform: ({ structures }) => ({
    values: { rows: (Reflect.get(Object(structures), "source") as { ids: string[] }).ids.length },
  }),
};

function rows(...ids: readonly string[]) {
  return ids.map((id) => ({ id, cells: { n: 1 } }));
}

function open(
  plugins: readonly PluginDefinition[],
  models: readonly Model<unknown, unknown>[],
  tracks: readonly TrackDefinition[],
): ProjectHandle {
  const catalog = new PluginCatalog({ models, plugins });
  const engine = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  });
  const definition: ProjectDefinition = {
    schemaVersion: 5,
    motions: [{ id: "m", trigger: { type: "manual" }, tracks }],
  };
  const handle = engine.load(definition);
  for (const track of tracks) handle.mount(`m/${track.id}`);
  return handle;
}

function ready(handle: ProjectHandle, nodeId: string): Value | undefined {
  const patch = handle.get(nodeId);
  expect(patch?.status).toBe("ready");
  return patch?.status === "ready" ? patch.outputs.values : undefined;
}

describe("an upstream structural change reaches computed outputs", () => {
  const chain: readonly TrackDefinition[] = [
    { id: "src", input: { values: rows("a") }, output: { model: "Rows" } },
    { id: "other", input: { values: rows("a", "b") }, output: { model: "Rows" } },
    { id: "copy", input: { requires: { source: "src" } }, output: { plugin: "copy" } },
    { id: "count", input: { requires: { source: "copy" } }, output: { plugin: "count" } },
  ];

  it("accepts a new row set after a source input.replace", () => {
    const handle = open([COPY, COUNT], [Rows, Copied], chain);
    handle.seek("m/count", 0);
    expect(ready(handle, "m/count")).toEqual({ rows: 1 });

    handle.track("m/src").input.replace({ values: rows("a", "b", "c") });

    expect(rowIds(ready(handle, "m/copy") ?? [])).toEqual(["a", "b", "c"]);
    expect(ready(handle, "m/count")).toEqual({ rows: 3 });
  });

  it("accepts a new row set after a binding edit", () => {
    const handle = open([COPY, COUNT], [Rows, Copied], chain);
    handle.seek("m/count", 0);

    handle.track("m/copy").input.requires.set("source", "other");

    expect(rowIds(ready(handle, "m/copy") ?? [])).toEqual(["a", "b"]);
    expect(ready(handle, "m/count")).toEqual({ rows: 2 });
  });

  it("still refuses a row set that moves with no structural edit", () => {
    let id = "a";
    const moving: PluginDefinition = {
      id: "moving",
      inputs: {},
      outputs: { values: Copied },
      transform: () => ({ values: rows(id) }),
    };
    const handle = open([moving], [Copied], [{ id: "moving", output: { plugin: "moving" } }]);
    handle.seek("m/moving", 0);
    id = "b";
    handle.seek("m/moving", 0.5);
    expect(handle.get("m/moving")?.diagnostics?.map((d) => d.ruleId)).toContain(
      "output-static-changed",
    );
  });
});

describe("a cheap edit that keeps static cells runs no parse and no prepare", () => {
  it("leaves parse and prepare counts alone on a source's values.set and setField", () => {
    const parse = vi.fn((value: Value) => ok({ ids: rowIds(value) }));
    const Counted = defineModel<unknown, { readonly ids: readonly string[] }>({
      id: "Counted",
      spec: Rows.spec,
      parse,
    });
    const prepare = vi.fn(() => ok(undefined));
    const reader: PluginDefinition = {
      id: "reader",
      inputs: { requires: { source: Counted } },
      outputs: { values: FIXTURE_OUT_2 },
      prepare,
      transform: () => ({ values: { n: 1 } }),
    };
    const handle = open(
      [reader],
      [Counted],
      [
        { id: "src", input: { values: rows("a") }, output: { model: "Counted" } },
        { id: "reader", input: { requires: { source: "src" } }, output: { plugin: "reader" } },
      ],
    );
    handle.seek("m/reader", 0);
    const parses = parse.mock.calls.length;
    const prepares = prepare.mock.calls.length;

    for (let n = 2; n <= 6; n += 1)
      handle.track("m/src").input.values.set([{ id: "a", cells: { n } }]);
    handle.track("m/src").input.values.setField({ row: "a", field: "n" }, 7);

    expect(parse.mock.calls.length).toBe(parses);
    expect(prepare.mock.calls.length).toBe(prepares);
    expect(handle.get("m/reader")?.status).toBe("ready");
  });

  it("keeps a computed reader's output structure across its own values.set", () => {
    const output = vi.fn((value: Value) => ok({ ids: rowIds(value) }));
    const Out = defineModel<unknown, { readonly ids: readonly string[] }>({
      id: "Out",
      spec: Rows.spec,
      parse: output,
    });
    const local: PluginDefinition = {
      id: "local",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: Out },
      transform: () => ({ values: rows("a") }),
    };
    const handle = open(
      [local],
      [Out],
      [{ id: "local", input: { values: { n: 1 } }, output: { plugin: "local" } }],
    );
    handle.seek("m/local", 0);
    const parses = output.mock.calls.length;
    handle.track("m/local").input.values.set({ n: 2 });
    expect(output.mock.calls.length).toBe(parses);
  });
});

describe("a plugin's local model parses at commit", () => {
  const Pair = defineModel<unknown, undefined>({
    id: "Pair",
    spec: Rows.spec,
    parse: (value) =>
      rowIds(value).length < 2
        ? refused([{ path: "values", message: "Needs two rows." }])
        : ok(undefined),
  });
  const pairOut = defineModel({
    id: "PairOut",
    spec: { kind: "record", fields: { n: { kind: "number" } } },
  });
  const usesPair: PluginDefinition = {
    id: "usesPair",
    inputs: { values: Pair },
    outputs: { values: pairOut },
    transform: () => ({ values: { n: 1 } }),
  };
  const track = (values: ReturnType<typeof rows>): TrackDefinition => ({
    id: "pair",
    input: { values },
    output: { plugin: "usesPair" },
  });

  it("refuses bad local values at load", () => {
    expect(() => open([usesPair], [Pair, pairOut], [track(rows("a"))])).toThrow(/Needs two rows/);
  });

  it("refuses bad local values on input.replace and keeps the track", () => {
    const handle = open([usesPair], [Pair, pairOut], [track(rows("a", "b"))]);
    handle.seek("m/pair", 0);
    expect(() => handle.track("m/pair").input.replace({ values: rows("a") })).toThrow(
      /Needs two rows/,
    );
    expect(handle.get("m/pair")?.status).toBe("ready");
  });
});

describe("a later frame cannot break the output contract", () => {
  function frames(...outputs: readonly unknown[]): ProjectHandle {
    let frame = 0;
    const plugin: PluginDefinition = {
      id: "frames",
      inputs: {},
      outputs: { values: Copied, extra: { kind: "record", fields: {}, optional: true } },
      transform: () => outputs[frame++] as Readonly<Record<string, Value>>,
    };
    const handle = open([plugin], [Copied], [{ id: "t", output: { plugin: "frames" } }]);
    handle.seek("m/t", 0);
    return handle;
  }
  const good = { values: rows("a") };

  it("refuses a required output that disappears", () => {
    const handle = frames(good, {});
    handle.seek("m/t", 0.5);
    expect(handle.get("m/t")?.diagnostics?.map((d) => d.ruleId)).toContain("output-missing");
  });

  it("refuses an undeclared output", () => {
    const handle = frames(good, { ...good, stray: { n: 1 } });
    handle.seek("m/t", 0.5);
    expect(handle.get("m/t")?.diagnostics?.map((d) => d.ruleId)).toContain("output-undeclared");
  });

  it("refuses a value whose shape flips from table to record", () => {
    const handle = frames(good, { values: { n: 1 } });
    handle.seek("m/t", 0.5);
    expect(handle.get("m/t")?.status).toBe("error");
  });

  it("accepts an optional output that comes and goes", () => {
    const handle = frames(good, { ...good, extra: {} }, good);
    handle.seek("m/t", 0.5);
    expect(handle.get("m/t")?.status).toBe("ready");
    handle.seek("m/t", 0.75);
    expect(handle.get("m/t")?.status).toBe("ready");
  });
});
