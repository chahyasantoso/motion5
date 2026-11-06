import { describe, expect, it } from "vitest";
import {
  defineModel,
  ok,
  prepareRefused,
  refused,
  type PluginDefinition,
  type SourceStructures,
} from "../../src/contract/v5";
import { diagnostic } from "../../src/contract/diagnostics";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { project, record, track } from "../support/v5-builders";
import { testModels } from "../support/test-models";

const Tagged = defineModel({
  id: "Tagged",
  spec: { kind: "record", fields: { tag: { kind: "string" } } },
  parse(value) {
    const tag =
      value !== null && typeof value === "object" && !Array.isArray(value)
        ? Reflect.get(value, "tag")
        : undefined;
    if (typeof tag !== "string") return refused([{ path: "tag", message: "Expected a tag." }]);
    return ok({ tag });
  },
});

function tagOf(structure: unknown): string | undefined {
  if (structure === null || typeof structure !== "object") return undefined;
  const tag = Reflect.get(structure, "tag");
  return typeof tag === "string" ? tag : undefined;
}

const WATCHER: PluginDefinition = {
  id: "watcher",
  inputs: { requires: { source: Tagged } },
  outputs: { values: { kind: "record", fields: { ok: { kind: "boolean" } } } },
  prepare({ structures }: { structures: SourceStructures }) {
    if (tagOf(structures.source) === "ok") return ok(undefined);
    return prepareRefused([
      diagnostic(
        "plugin-input-invalid",
        "watcher.input.requires.source",
        "The source tag must read 'ok'.",
      ),
    ]);
  },
  transform() {
    return { values: { ok: true } };
  },
};

function allTagsOk(structure: unknown): boolean {
  if (structure === null || typeof structure !== "object") return false;
  const values = Object.values(structure);
  return values.length > 0 && values.every((value) => tagOf(value) === "ok");
}

const MAPPER: PluginDefinition = {
  id: "mapper",
  inputs: { requires: { sources: { kind: "model", model: Tagged, binding: "map" } } },
  outputs: { values: { kind: "record", fields: { ok: { kind: "boolean" } } } },
  prepare({ structures }: { structures: SourceStructures }) {
    if (allTagsOk(structures.sources)) return ok(undefined);
    return prepareRefused([
      diagnostic(
        "plugin-input-invalid",
        "mapper.input.requires.sources",
        "Every source tag must read 'ok'.",
      ),
    ]);
  },
  transform() {
    return { values: { ok: true } };
  },
};

const LENIENT: PluginDefinition = {
  id: "lenient",
  inputs: { requires: { source: Tagged } },
  outputs: { values: { kind: "record", fields: { ok: { kind: "boolean" } } } },
  prepare: () => ok(undefined),
  transform: () => ({ values: { ok: true } }),
};

function engine(...plugins: readonly PluginDefinition[]): Engine {
  const catalog = new PluginCatalog({ models: [...testModels, Tagged] });
  catalog.register({ plugins: [WATCHER, ...plugins] });
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  });
}

const SOURCE = track({ id: "source", values: record({ tag: "ok" }), model: "Tagged" });
const WATCHED = track({
  id: "watched",
  plugin: "watcher",
  requires: { source: "source" },
});

describe("a structural edit re-runs every affected reader's prepare", () => {
  it("refuses a source replacement the reader's prepare rejects", () => {
    const handle = engine().load(project([SOURCE, WATCHED]));
    try {
      handle.mount("demo/source");
      handle.seek("demo/source", 0);
      handle.mount("demo/watched");
      handle.seek("demo/watched", 0);
      const source = handle.track("demo/source");
      const before = source.definition;

      expect(() =>
        source.replace({
          id: "source",
          output: { model: "Tagged" },
          input: { values: record({ tag: "broken" }) },
        }),
      ).toThrow(/plugin-input-invalid.*source tag must read 'ok'/);

      expect(source.definition).toBe(before);
      expect(handle.get("demo/source")?.status).toBe("ready");
      expect(handle.get("demo/watched")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("accepts a source replacement the reader's prepare accepts", () => {
    const handle = engine().load(project([SOURCE, WATCHED]));
    try {
      handle.mount("demo/watched");
      handle.seek("demo/watched", 0);
      handle.track("demo/source").replace({
        id: "source",
        output: { model: "Tagged" },
        input: { values: record({ tag: "ok" }) },
        duration: 100,
      });
      expect(handle.get("demo/source")?.status).toBe("ready");
      expect(handle.get("demo/watched")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("re-runs prepare for a map binding to the changed source", () => {
    const first = track({ id: "map-a", values: record({ tag: "ok" }), model: "Tagged" });
    const second = track({ id: "map-b", values: record({ tag: "ok" }), model: "Tagged" });
    const mapped = track({
      id: "mapped",
      plugin: "mapper",
      requires: { sources: { one: "map-a", two: "map-b" } },
    });
    const handle = engine(MAPPER).load(project([first, second, mapped]));
    try {
      for (const id of ["demo/map-a", "demo/map-b", "demo/mapped"]) handle.mount(id);
      handle.seek("demo/mapped", 0);
      expect(() =>
        handle.track("demo/map-b").replace({
          id: "map-b",
          output: { model: "Tagged" },
          input: { values: record({ tag: "broken" }) },
        }),
      ).toThrow(/Every source tag must read 'ok'/);
      expect(handle.get("demo/mapped")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("qualifies a free-track reader against a free-track source", () => {
    const handle = engine().load({
      schemaVersion: 5,
      motions: [],
      freeTracks: [
        track({ id: "source", values: record({ tag: "ok" }), model: "Tagged" }),
        track({ id: "watched", plugin: "watcher", requires: { source: "~/source" } }),
      ],
    });
    try {
      handle.mount("~/source");
      handle.seek("~/source", 0);
      handle.mount("~/watched");
      handle.seek("~/watched", 0);
      expect(() =>
        handle.track("~/source").input.replace({ values: record({ tag: "broken" }) }),
      ).toThrow(/The source tag must read 'ok'/);
      expect(handle.get("~/watched")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("re-runs prepare after a binding-only edit", () => {
    const good = track({ id: "good", values: record({ tag: "ok" }), model: "Tagged" });
    const bad = track({ id: "bad", values: record({ tag: "broken" }), model: "Tagged" });
    const watched = track({
      id: "watched",
      plugin: "watcher",
      requires: { source: "good" },
    });
    const handle = engine().load(project([good, bad, watched]));
    try {
      for (const id of ["demo/good", "demo/bad", "demo/watched"]) handle.mount(id);
      handle.seek("demo/watched", 0);
      expect(() => handle.track("demo/watched").input.requires.set("source", "bad")).toThrow(
        /The source tag must read 'ok'/,
      );
      expect(handle.track("demo/watched").definition.input?.requires?.source).toBe("good");
    } finally {
      handle.dispose();
    }
  });

  it("re-runs prepare for a newly added reader", () => {
    const broken = track({ id: "source", values: record({ tag: "broken" }), model: "Tagged" });
    const handle = engine().load(project([broken]));
    try {
      handle.mount("demo/source");
      handle.seek("demo/source", 0);
      expect(() =>
        handle.addTrack(
          track({ id: "watched", plugin: "watcher", requires: { source: "source" } }),
          { motionId: "demo" },
        ),
      ).toThrow(/The source tag must read 'ok'/);
      expect(handle.tryTrack("demo/watched")).toBeUndefined();
    } finally {
      handle.dispose();
    }
  });

  it("rolls back when an earlier reader prepared and a later reader refuses", () => {
    const lenient = track({
      id: "lenient",
      plugin: "lenient",
      requires: { source: "source" },
    });
    const handle = engine(LENIENT).load(project([SOURCE, lenient, WATCHED]));
    try {
      for (const id of ["demo/source", "demo/lenient", "demo/watched"]) {
        handle.mount(id);
        handle.seek(id, 0);
      }
      const before = handle.track("demo/source").definition;
      expect(() =>
        handle.track("demo/source").replace({
          id: "source",
          output: { model: "Tagged" },
          input: { values: record({ tag: "broken" }) },
        }),
      ).toThrow(/The source tag must read 'ok'/);
      expect(handle.track("demo/source").definition).toBe(before);
      expect(handle.get("demo/lenient")?.status).toBe("ready");
      expect(handle.get("demo/watched")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });
});
