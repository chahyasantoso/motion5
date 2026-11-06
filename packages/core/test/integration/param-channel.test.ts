import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PluginDefinition, ProjectDefinition } from "../../src/contract/v5";
import {
  PluginAdmissionError,
  PluginCatalog,
  type PluginCatalogOptions,
} from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { testModels } from "../support/test-models";

const untyped = (batch: unknown) => batch as PluginCatalogOptions;

const prepare = vi.fn(() => ({ ok: true as const, value: undefined }));

const FLAGS: PluginDefinition = {
  id: "flags",
  inputs: {
    param: {
      kind: "record",
      fields: {
        flip: { kind: "boolean", optional: true },
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
  },
  outputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
  prepare,
  transform({ param }) {
    const flip =
      param !== null && typeof param === "object" && !Array.isArray(param) && "flip" in param
        ? param.flip
        : undefined;
    return { values: { n: flip === true ? 1 : 0 } };
  },
};

const NO_PARAM: PluginDefinition = {
  id: "no-param",
  inputs: { values: { kind: "record", fields: {} } },
  outputs: { values: { kind: "record", fields: {} } },
  transform() {
    return { values: {} };
  },
};

const MIXED: PluginDefinition = {
  id: "mixed",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    param: { kind: "record", fields: { flip: { kind: "boolean", optional: true } } },
  },
  outputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
  transform({ values, param }) {
    const dx = values !== null && typeof values === "object" ? Reflect.get(values, "dx") : 0;
    const flip =
      param !== null && typeof param === "object" && !Array.isArray(param)
        ? Reflect.get(param, "flip")
        : undefined;
    return { values: { n: Number(dx) + (flip === true ? 1 : 0) } };
  },
};

function project(track: ProjectDefinition["motions"][number]["tracks"][number]): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "demo", trigger: { type: "manual" }, tracks: [track] }],
  };
}

function engine(...plugins: readonly PluginDefinition[]): Engine {
  const catalog = new PluginCatalog({ models: testModels });
  catalog.register({ plugins: plugins });
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  });
}

function loaded() {
  const handle = engine(FLAGS).load(
    project({
      id: "flags",
      output: { plugin: "flags" },
      input: { param: { flip: false, inspect: false } },
    }),
  );
  handle.mount("demo/flags");
  handle.seek("demo/flags", 0);
  return handle;
}

function publishedN(handle: ReturnType<typeof loaded>, nodeId = "demo/flags"): unknown {
  const patch = handle.get(nodeId);
  if (patch?.status !== "ready") throw new Error("Expected a ready flags patch.");
  const values = patch.outputs.values;
  if (values === undefined || Array.isArray(values)) return undefined;
  return Reflect.get(values, "n");
}

describe("input.param", () => {
  beforeEach(() => prepare.mockClear());

  it("validates the declared param spec at load", () => {
    expect(() =>
      engine(FLAGS).load(
        project({
          id: "flags",
          output: { plugin: "flags" },
          input: { param: { flip: "far" } },
        }),
      ),
    ).toThrow(/cell-kind-conflict/);
  });

  it("refuses a param on a plugin that declares none", () => {
    expect(() =>
      engine(NO_PARAM).load(
        project({
          id: "flags",
          output: { plugin: "no-param" },
          input: { param: { flip: true } },
        }),
      ),
    ).toThrow(/param-not-allowed/);
  });

  it("writes and reads params through the handle verbs", () => {
    const handle = loaded();
    try {
      const track = handle.track("demo/flags");
      expect(publishedN(handle)).toBe(0);
      expect(prepare).toHaveBeenCalledTimes(1);

      track.input.param.set({ flip: true, inspect: false });
      expect(track.definition.input?.param).toEqual({ flip: true, inspect: false });
      expect(handle.get("demo/flags")?.status).toBe("ready");
      expect(publishedN(handle)).toBe(1);

      track.input.param.setField({ field: "flip" }, false);
      expect(track.definition.input?.param).toEqual({ flip: false, inspect: false });
      expect(publishedN(handle)).toBe(0);

      expect(() => track.input.param.set({ flip: "far" })).toThrow(/cell-kind-conflict/);

      const batch = track.input.param.setField({ field: "flip" }, true);
      expect(batch.patches.some((patch) => patch.nodeId === "demo/flags")).toBe(true);
      expect(publishedN(handle)).toBe(1);
      expect(prepare).toHaveBeenCalledTimes(1);
    } finally {
      handle.dispose();
    }
  });

  it("refuses a static param change with the replace hint", () => {
    const handle = loaded();
    try {
      expect(() =>
        handle.track("demo/flags").input.param.set({ flip: false, inspect: true }),
      ).toThrow(/live-values-invalid.*track\.input\.replace/);
      expect(() =>
        handle.track("demo/flags").input.param.setField({ field: "inspect" }, true),
      ).toThrow(/live-values-invalid.*track\.input\.replace/);
    } finally {
      handle.dispose();
    }
  });

  it("refuses param verbs on a model output and a param-less plugin", () => {
    const source = engine().load(
      project({
        id: "source",
        output: { model: "TestRecord" },
        input: { values: { n: 0 } },
      }),
    );
    try {
      expect(() => source.track("demo/source").input.param.set({ flip: true })).toThrow(
        /param-not-allowed/,
      );
      expect(() => source.track("demo/source").writeParam({ flip: true })).toThrow(
        /param-not-allowed/,
      );
    } finally {
      source.dispose();
    }

    const computed = engine(NO_PARAM).load(
      project({ id: "flags", output: { plugin: "no-param" }, input: { values: {} } }),
    );
    try {
      expect(() => computed.track("demo/flags").input.param.set({ flip: true })).toThrow(
        /param-not-allowed/,
      );
      expect(() => computed.track("demo/flags").writeParam({ flip: true })).toThrow(
        /param-not-allowed/,
      );
    } finally {
      computed.dispose();
    }
  });

  it("refuses values on a plugin that declares none", () => {
    const handle = loaded();
    try {
      expect(() => handle.track("demo/flags").input.values.set({ flip: true })).toThrow(
        /values-not-allowed/,
      );
      expect(() => handle.track("demo/flags").writeValues({ flip: true })).toThrow(
        /values-not-allowed/,
      );
    } finally {
      handle.dispose();
    }
  });

  it("writes and releases a live param overlay without moving authored param", () => {
    const handle = engine(FLAGS).load(
      project({
        id: "flags",
        output: { plugin: "flags" },
        input: { param: { flip: false } },
      }),
    );
    try {
      handle.mount("demo/flags");
      handle.seek("demo/flags", 0);
      const track = handle.track("demo/flags");
      expect(publishedN(handle)).toBe(0);

      track.writeParam({ flip: true });
      expect(publishedN(handle)).toBe(1);
      expect(track.definition.input?.param).toEqual({ flip: false });

      const released = track.releaseParam();
      expect(publishedN(handle)).toBe(0);
      expect(released.patches.some((patch) => patch.nodeId === "demo/flags")).toBe(true);
      expect(track.releaseParam().patches).toEqual([]);
    } finally {
      handle.dispose();
    }
  });

  it("refuses a live param write that changes a static param", () => {
    const handle = loaded();
    try {
      expect(() => handle.track("demo/flags").writeParam({ flip: false, inspect: true })).toThrow(
        /live-values-invalid.*track\.input\.replace/,
      );
    } finally {
      handle.dispose();
    }
  });

  it("keeps the previous live param overlay when a write is refused", () => {
    const handle = loaded();
    try {
      const track = handle.track("demo/flags");
      track.writeParam({ flip: true, inspect: false });
      expect(publishedN(handle)).toBe(1);
      expect(() => track.writeParam({ flip: "far", inspect: false })).toThrow(
        /live-values-invalid/,
      );
      expect(publishedN(handle)).toBe(1);
    } finally {
      handle.dispose();
    }
  });

  it("clears a live param overlay on a structural replacement", () => {
    const handle = loaded();
    try {
      const track = handle.track("demo/flags");
      track.writeParam({ flip: true, inspect: false });
      expect(publishedN(handle)).toBe(1);
      track.replace({
        id: "flags",
        output: { plugin: "flags" },
        input: { param: { flip: false } },
      });
      expect(publishedN(handle)).toBe(0);
    } finally {
      handle.dispose();
    }
  });

  it("projects live param writes and releases through a value batch", () => {
    const handle = loaded();
    try {
      const written = handle.values((transaction) => {
        transaction.writeParam("demo/flags", { flip: true, inspect: false });
      });
      expect(written.patches.some((patch) => patch.nodeId === "demo/flags")).toBe(true);
      expect(publishedN(handle)).toBe(1);

      const released = handle.values((transaction) => {
        transaction.releaseParam("demo/flags");
      });
      expect(released.patches.some((patch) => patch.nodeId === "demo/flags")).toBe(true);
      expect(publishedN(handle)).toBe(0);
    } finally {
      handle.dispose();
    }
  });

  it("releases each live channel without moving the other", () => {
    const handle = engine(MIXED).load(
      project({
        id: "mixed",
        output: { plugin: "mixed" },
        input: { values: { dx: 0 } },
      }),
    );
    try {
      handle.mount("demo/mixed");
      handle.seek("demo/mixed", 0);
      const track = handle.track("demo/mixed");
      expect(publishedN(handle, "demo/mixed")).toBe(0);

      track.writeValues({ dx: 5 });
      expect(publishedN(handle, "demo/mixed")).toBe(5);
      track.writeParam({ flip: true });
      expect(publishedN(handle, "demo/mixed")).toBe(6);

      track.releaseValues();
      expect(publishedN(handle, "demo/mixed")).toBe(1);
      track.releaseParam();
      expect(publishedN(handle, "demo/mixed")).toBe(0);
      expect(track.definition.input).toEqual({ values: { dx: 0 } });
    } finally {
      handle.dispose();
    }
  });

  it("refuses a plugin with no transform at admission", () => {
    const catalog = new PluginCatalog();
    let thrown: unknown;
    try {
      catalog.register(
        untyped({
          plugins: [
            {
              id: "no-transform",
              inputs: { values: { kind: "record", fields: {} } },
              outputs: { values: { kind: "record", fields: {} } },
            },
          ],
        }),
      );
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(PluginAdmissionError);
    if (thrown instanceof PluginAdmissionError)
      expect(thrown.ruleId).toBe("plugin-transform-missing");
  });
});
