import { describe, expect, it } from "vitest";
import {
  PluginRegistry,
  type PluginDefinition,
  type ProjectDefinition,
  type TrackDefinition,
} from "@motion5/core";
import {
  createPluginLoader,
  describeLoadFailure,
  ensuredOrThrow,
  type PluginCatalog,
  type PluginLoadFailure,
} from "../../src/loader";

function definition(name: string): PluginDefinition {
  return { name, keys: [name], compose: (values) => values };
}
type PluginGroup = NonNullable<TrackDefinition["keyframes"]>[string];
function track(name: string, group: PluginGroup = { values: { value: 1 } }): TrackDefinition {
  return { id: `track-${name}`, keyframes: { [name]: group } };
}
function project(
  tracks: readonly TrackDefinition[],
  freeTracks?: readonly TrackDefinition[],
): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "m", trigger: { type: "manual" }, tracks }],
    ...(freeTracks === undefined ? {} : { freeTracks }),
  };
}
function catalogOf(
  names: readonly string[],
  loads: Map<string, () => Promise<PluginDefinition>>,
): PluginCatalog {
  return new Map(
    names.map((name) => [name, { load: loads.get(name) ?? (async () => definition(name)) }]),
  );
}
function readNames(registry: PluginRegistry, names: readonly string[]): readonly string[] {
  return registry
    .resolveForKeyframes(Object.fromEntries(names.map((name) => [name, { values: { [name]: 1 } }])))
    .plugins.map(({ name }) => name);
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

describe("approved lazy plugin loader", () => {
  it("L1 loads motion groups and requires-only free groups in catalog order", async () => {
    const registry = new PluginRegistry();
    const loader = createPluginLoader(
      new Map([
        ["transform", { load: async () => definition("transform") }],
        ["fk", { load: async () => definition("fk") }],
      ]),
    );
    const demand = project(
      [{ id: "transform", keyframes: { transform: { values: { x: 1 } } } }],
      [{ id: "fk", keyframes: { fk: { requires: { base: "m/transform" } } } }],
    );
    const result = await loader.ensure(registry, { kind: "project", project: demand });
    expect(result).toEqual({ kind: "ensured", added: ["transform", "fk"] });
    expect(readNames(registry, ["transform", "fk"])).toEqual(["transform", "fk"]);
  });

  it("L2 treats values and requirement source ids as data, not plugin demands", async () => {
    const calls = { fk: 0, transform: 0 };
    const loader = createPluginLoader(
      new Map([
        [
          "transform",
          {
            load: async () => {
              calls.transform++;
              return definition("transform");
            },
          },
        ],
        [
          "fk",
          {
            load: async () => {
              calls.fk++;
              return definition("fk");
            },
          },
        ],
      ]),
    );
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "tracks",
      tracks: [track("fk", { values: { length: 1 }, requires: { base: "m/transform" } })],
    });
    expect(result).toEqual({ kind: "ensured", added: ["fk"] });
    expect(calls).toEqual({ fk: 1, transform: 0 });
  });

  it("L3 refuses an unknown authored group with its first path before importing", async () => {
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "transform",
          {
            load: async () => {
              calls++;
              return definition("transform");
            },
          },
        ],
      ]),
    );
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "project",
      project: project([
        { id: "one", keyframes: { transform: { values: { x: 1 } } } },
        { id: "two", keyframes: { foo: { values: { x: 1 } } } },
      ]),
    });
    expect(result).toMatchObject({
      kind: "refused",
      failure: { kind: "unknown-plugin", name: "foo", path: "motions[0].tracks[1].keyframes.foo" },
    });
    expect(calls).toBe(0);
  });

  it("reports an unknown dependency at its catalog declaration before importing", async () => {
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            dependencies: ["missing"],
            load: async () => {
              calls++;
              return definition("a");
            },
          },
        ],
      ]),
    );
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "tracks",
      tracks: [track("a")],
    });
    expect(result).toEqual({
      kind: "refused",
      failure: { kind: "unknown-plugin", name: "missing", path: "catalog.a.dependencies" },
    });
    expect(calls).toBe(0);
  });

  it("L4 detects dependency cycles before any loader runs", async () => {
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            dependencies: ["b"],
            load: async () => {
              calls++;
              return definition("a");
            },
          },
        ],
        [
          "b",
          {
            dependencies: ["a"],
            load: async () => {
              calls++;
              return definition("b");
            },
          },
        ],
      ]),
    );
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "tracks",
      tracks: [track("a")],
    });
    expect(result).toEqual({
      kind: "refused",
      failure: { kind: "dependency-cycle", cycle: ["a", "b", "a"] },
    });
    expect(calls).toBe(0);
  });

  it("L5 keeps catalog registration order when demand roots are reversed", async () => {
    const loader = createPluginLoader(
      new Map([
        ["a", { load: async () => definition("a") }],
        ["b", { load: async () => definition("b") }],
      ]),
    );
    const registry = new PluginRegistry();
    const result = await loader.ensure(registry, {
      kind: "tracks",
      tracks: [track("b"), track("a")],
    });
    expect(result).toEqual({ kind: "ensured", added: ["a", "b"] });
    expect(readNames(registry, ["b", "a"])).toEqual(["a", "b"]);
  });

  it("L6 shares one in-flight import across registries", async () => {
    const gate = deferred<PluginDefinition>();
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            load: () => {
              calls++;
              return gate.promise;
            },
          },
        ],
      ]),
    );
    const first = new PluginRegistry();
    const second = new PluginRegistry();
    const one = loader.ensure(first, { kind: "tracks", tracks: [track("a")] });
    const two = loader.ensure(second, { kind: "tracks", tracks: [track("a")] });
    await Promise.resolve();
    expect(calls).toBe(1);
    gate.resolve(definition("a"));
    expect(await one).toEqual({ kind: "ensured", added: ["a"] });
    expect(await two).toEqual({ kind: "ensured", added: ["a"] });
    expect(first.has("a")).toBe(true);
    expect(second.has("a")).toBe(true);
  });

  it("L7 rechecks one registry after concurrent awaits and commits only once", async () => {
    const gate = deferred<PluginDefinition>();
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            load: () => {
              calls++;
              return gate.promise;
            },
          },
        ],
      ]),
    );
    const registry = new PluginRegistry();
    const one = loader.ensure(registry, { kind: "tracks", tracks: [track("a")] });
    const two = loader.ensure(registry, { kind: "tracks", tracks: [track("a")] });
    await Promise.resolve();
    gate.resolve(definition("a"));
    const results = await Promise.all([one, two]);
    expect(results).toEqual([
      { kind: "ensured", added: ["a"] },
      { kind: "ensured", added: [] },
    ]);
    expect(calls).toBe(1);
    expect(registry.has("a")).toBe(true);
  });

  it("L8 skips a plugin already registered in the target registry", async () => {
    let calls = 0;
    const registry = new PluginRegistry();
    registry.register(definition("a"));
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            load: async () => {
              calls++;
              return definition("a");
            },
          },
        ],
      ]),
    );
    expect(await loader.ensure(registry, { kind: "tracks", tracks: [track("a")] })).toEqual({
      kind: "ensured",
      added: [],
    });
    expect(calls).toBe(0);
  });

  it("L9 evicts a rejected import for retry without changing the registry", async () => {
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            load: async () => {
              calls++;
              if (calls === 1) throw new Error("transient");
              return definition("a");
            },
          },
        ],
      ]),
    );
    const registry = new PluginRegistry();
    const demand = { kind: "tracks" as const, tracks: [track("a")] };
    expect((await loader.ensure(registry, demand)).kind).toBe("refused");
    expect(registry.has("a")).toBe(false);
    expect(await loader.ensure(registry, demand)).toEqual({ kind: "ensured", added: ["a"] });
    expect(calls).toBe(2);
  });

  it("L10 refuses a loaded definition whose name differs from its catalog key", async () => {
    const loader = createPluginLoader(new Map([["a", { load: async () => definition("b") }]]));
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "tracks",
      tracks: [track("a")],
    });
    expect(result).toMatchObject({
      kind: "refused",
      failure: { kind: "identity-mismatch", name: "a" },
    });
  });

  it("L11 atomically refuses a valid and malformed loaded batch", async () => {
    const malformed = { ...definition("bad"), priority: 1.5 } as PluginDefinition;
    const loader = createPluginLoader(
      new Map([
        ["good", { load: async () => definition("good") }],
        ["bad", { load: async () => malformed }],
      ]),
    );
    const registry = new PluginRegistry();
    const result = await loader.ensure(registry, {
      kind: "tracks",
      tracks: [track("good"), track("bad")],
    });
    expect(result).toMatchObject({ kind: "refused", failure: { kind: "registration-refused" } });
    expect(registry.has("good")).toBe(false);
    expect(registry.has("bad")).toBe(false);
  });

  it("L12 returns project validation diagnostics without importing", async () => {
    let calls = 0;
    const loader = createPluginLoader(
      new Map([
        [
          "a",
          {
            load: async () => {
              calls++;
              return definition("a");
            },
          },
        ],
      ]),
    );
    const result = await loader.ensure(new PluginRegistry(), {
      kind: "project",
      project: {
        schemaVersion: 5,
        motions: [{ id: "", trigger: { type: "manual" }, tracks: [track("a")] }],
      } as ProjectDefinition,
    });
    expect(result).toMatchObject({ kind: "refused", failure: { kind: "invalid-demand" } });
    expect(calls).toBe(0);
  });

  it("L13 snapshots catalog membership and dependencies at construction", async () => {
    const dependencies = ["b"];
    const original: Map<
      string,
      { load: () => Promise<PluginDefinition>; dependencies?: string[] }
    > = new Map([
      ["a", { load: async () => definition("a"), dependencies }],
      ["b", { load: async () => definition("b") }],
    ]);
    const loader = createPluginLoader(original);
    dependencies[0] = "missing";
    original.clear();
    original.set("a", { load: async () => definition("wrong") });
    original.set("new", { load: async () => definition("new") });
    expect(
      await loader.ensure(new PluginRegistry(), { kind: "tracks", tracks: [track("a")] }),
    ).toEqual({ kind: "ensured", added: ["a", "b"] });
  });

  it("L14 describes every refusal and unwraps the ensured discriminant", () => {
    const failures: readonly PluginLoadFailure[] = [
      {
        kind: "invalid-demand",
        diagnostics: [
          { ruleId: "track-id", path: "tracks[0].id", message: "bad", severity: "error", ids: [] },
        ],
      },
      { kind: "unknown-plugin", name: "x", path: "tracks[0]" },
      { kind: "dependency-cycle", cycle: ["a", "a"] },
      { kind: "import-failed", name: "x", cause: new Error("fail") },
      { kind: "identity-mismatch", name: "x", received: {} },
      { kind: "registration-refused", cause: new Error("bad") },
    ];
    expect(failures.map((failure) => describeLoadFailure(failure))).toHaveLength(6);
    expect(ensuredOrThrow({ kind: "ensured", added: ["x"] })).toEqual(["x"]);
    expect(() => ensuredOrThrow({ kind: "refused", failure: failures[0]! })).toThrow(/invalid/);
  });

  it("rejects malformed catalog declarations immediately", () => {
    expect(() => createPluginLoader([] as unknown as PluginCatalog)).toThrow(/Map/);
    expect(() =>
      createPluginLoader(new Map([["", { load: async () => definition("x") }]])),
    ).toThrow(/non-empty/);
    expect(() => createPluginLoader(new Map([["x", { load: 1 }]] as never))).toThrow(
      /load function/,
    );
    expect(() =>
      createPluginLoader(
        new Map([["x", { load: async () => definition("x"), dependencies: [""] }]]),
      ),
    ).toThrow(/dependencies/);
  });
});
