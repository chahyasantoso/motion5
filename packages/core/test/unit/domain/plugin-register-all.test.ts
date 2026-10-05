import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";

const plugin = (name: string, extra: Partial<PluginDefinition> = {}): PluginDefinition => ({
  name,
  keys: [name],
  compose: (values) => values,
  ...extra,
});

function thrown(action: () => void): unknown {
  try {
    action();
  } catch (error) {
    return error;
  }
  throw new Error("Expected registration to throw.");
}

function resolvedNames(registry: PluginRegistry, names: readonly string[]): readonly string[] {
  const resolved = registry.resolveForKeyframes(
    Object.fromEntries(names.map((name) => [name, { values: { [name]: {} } }])),
  );
  expect(resolved.diagnostics).toEqual([]);
  return resolved.plugins.map(({ name }) => name);
}

describe("atomic plugin batch admission", () => {
  it("TH-205 refuses a malformed member anywhere with the single-registration failure", () => {
    const malformed = plugin("bad", {
      compose: undefined as unknown as PluginDefinition["compose"],
    });
    const single = thrown(() => new PluginRegistry().register(malformed));
    expect(single).toEqual(new TypeError("Plugin compose must be a function."));
    for (let index = 0; index < 3; index++) {
      const registry = new PluginRegistry();
      const batch = [plugin("first"), plugin("second")];
      batch.splice(index, 0, malformed);
      expect(thrown(() => registry.registerAll(batch))).toEqual(single);
      expect(registry.size).toBe(0);
      expect(registry.has("first")).toBe(false);
      registry.register(plugin("first"));
      expect(resolvedNames(registry, ["first"])).toEqual(["first"]);
    }
  });

  it("TH-206 refuses duplicate names inside a batch without storing anything", () => {
    const registry = new PluginRegistry();
    expect(thrown(() => registry.registerAll([plugin("same"), plugin("same")]))).toEqual(
      new Error('Plugin "same" is already registered.'),
    );
    expect(registry.size).toBe(0);
    registry.register(plugin("same"));
    expect(registry.size).toBe(1);
  });

  it("TH-207 refuses shared inputs inside a batch without leaking their ownership", () => {
    const registry = new PluginRegistry();
    expect(
      thrown(() =>
        registry.registerAll([
          plugin("first", { inputs: ["source"] }),
          plugin("second", { inputs: ["source"] }),
        ]),
      ),
    ).toEqual(new TypeError('plugin-input-collision: Plugin "first" already owns input "source".'));
    expect(registry.size).toBe(0);
    registry.register(plugin("second", { inputs: ["source"] }));
    expect(resolvedNames(registry, ["second"])).toEqual(["second"]);
  });

  it("TH-208 preserves earlier plugins on existing-name and existing-input collisions", () => {
    for (const bad of [plugin("seed"), plugin("bad", { inputs: ["owned"] })]) {
      const registry = new PluginRegistry();
      registry.register(plugin("seed", { inputs: ["owned"] }));
      const before = registry.resolveForKeyframes({ seed: { values: { seed: {} } } }).plugins[0];
      expect(thrown(() => registry.registerAll([plugin("candidate"), bad]))).toEqual(
        bad.name === "seed"
          ? new Error('Plugin "seed" is already registered.')
          : new TypeError('plugin-input-collision: Plugin "seed" already owns input "owned".'),
      );
      expect(registry.size).toBe(1);
      expect(registry.has("candidate")).toBe(false);
      expect(registry.resolveForKeyframes({ seed: { values: { seed: {} } } }).plugins[0]).toBe(
        before,
      );
      registry.register(plugin("candidate"));
      expect(resolvedNames(registry, ["candidate", "seed"])).toEqual(["seed", "candidate"]);
    }
  });

  it("TH-209 preserves batch order rather than authored group order", () => {
    for (const order of [
      ["p", "q"],
      ["q", "p"],
    ]) {
      const registry = new PluginRegistry();
      registry.registerAll(order.map((name) => plugin(name)));
      expect(resolvedNames(registry, ["q", "p"])).toEqual(order);
    }
  });

  it("TH-210 treats an empty batch as a no-op and refuses non-arrays", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("seed"));
    registry.registerAll([]);
    expect(registry.size).toBe(1);
    for (const value of [null, undefined, {}, new Set(), "plugins"]) {
      expect(thrown(() => registry.registerAll(value as readonly PluginDefinition[]))).toEqual(
        new TypeError("Plugin definitions must be an array."),
      );
    }
    expect(resolvedNames(registry, ["seed"])).toEqual(["seed"]);
  });

  it("TH-211 reads getter-backed keys once and registers the first array", () => {
    for (const batch of [false, true]) {
      let reads = 0;
      const definition: PluginDefinition = {
        name: "getter",
        get keys() {
          reads++;
          return reads === 1 ? ["getter"] : ["wrong"];
        },
        compose: (values) => values,
      };
      const registry = new PluginRegistry();
      if (batch) registry.registerAll([definition]);
      else registry.register(definition);
      expect(reads).toBe(1);
      expect(resolvedNames(registry, ["getter"])).toEqual(["getter"]);
      expect(
        registry.resolveForKeyframes({ getter: { values: { getter: {} } } }).plugins[0]?.keys,
      ).toEqual(["getter"]);
    }
  });

  it("TH-212 refuses prototype-only compose before admitting any batch member", () => {
    class PrototypeComposer {
      readonly name = "prototype";
      compose(...[values]: Parameters<PluginDefinition["compose"]>) {
        return values;
      }
    }
    const registry = new PluginRegistry();
    expect(thrown(() => registry.registerAll([plugin("first"), new PrototypeComposer()]))).toEqual(
      new TypeError("Plugin compose must be a function."),
    );
    expect(registry.size).toBe(0);
  });

  it("TH-213 refuses non-string metadata entries by name without storing the batch", () => {
    for (const field of ["keys", "inputs", "outputs"] as const) {
      const registry = new PluginRegistry();
      const bad = plugin("bad", { [field]: ["ok", 7] } as unknown as Partial<PluginDefinition>);
      expect(thrown(() => registry.registerAll([plugin("first"), bad]))).toEqual(
        new TypeError(`Plugin "bad" ${field} must contain only strings.`),
      );
      expect(registry.size).toBe(0);
    }
  });

  it("TH-214 stores a frozen requirements copy and leaves the caller's objects unfrozen", () => {
    const base = { description: "parent bone", extra: { tags: ["a"] } };
    const registry = new PluginRegistry();
    registry.register(plugin("req", { requirements: { base } }));
    expect(Object.isFrozen(base)).toBe(false);
    expect(Object.isFrozen(base.extra.tags)).toBe(false);
    const stored = registry.resolveForKeyframes({ req: { values: { req: {} } } }).plugins[0]
      ?.requirements as Record<string, typeof base> | undefined;
    expect(stored?.base).toEqual(base);
    expect(stored?.base).not.toBe(base);
    expect(Object.isFrozen(stored?.base?.extra.tags)).toBe(true);
  });

  it("admits own compose fields and copies and freezes array metadata", () => {
    class OwnComposer {
      readonly name = "own";
      readonly keys = ["x"];
      readonly inputs = ["source", "source"];
      readonly outputs = ["out"];
      readonly compose: PluginDefinition["compose"] = (values) => values;
    }
    const definition = new OwnComposer();
    const registry = new PluginRegistry();
    registry.registerAll([definition]);
    definition.keys[0] = "changed";
    definition.inputs[0] = "changed";
    definition.outputs[0] = "changed";
    const admitted = registry.resolveForKeyframes({ own: { values: { x: 1 } } }).plugins[0];
    expect(admitted?.keys).toEqual(["x"]);
    expect(admitted?.inputs).toEqual(["source", "source"]);
    expect(admitted?.outputs).toEqual(["out"]);
    expect(Object.isFrozen(admitted)).toBe(true);
    expect(Object.isFrozen(admitted?.keys)).toBe(true);
    expect(Object.isFrozen(admitted?.inputs)).toBe(true);
    expect(Object.isFrozen(admitted?.outputs)).toBe(true);
  });

  it("keeps output collisions at resolution and allows shared keys and requirement slots", () => {
    const registry = new PluginRegistry();
    registry.registerAll([
      plugin("p", { keys: ["p", "x"], outputs: ["shared"], requirements: { base: {} } }),
      plugin("q", { keys: ["q", "x"], outputs: ["shared"], requirements: { base: {} } }),
    ]);
    expect(registry.size).toBe(2);
    expect(
      registry
        .resolveForKeyframes({ p: { values: { p: {} } }, q: { values: { q: {} } } })
        .diagnostics.map(({ ruleId }) => ruleId),
    ).toEqual(["plugin-duplicate-output"]);
  });

  it("propagates a throwing own getter without publishing earlier candidates", () => {
    const failure = new Error("snapshot failed");
    const bad = {
      ...plugin("bad"),
      get priority(): number {
        throw failure;
      },
    };
    const registry = new PluginRegistry();
    expect(thrown(() => registry.registerAll([plugin("first"), bad]))).toBe(failure);
    expect(registry.size).toBe(0);
    registry.register(plugin("first"));
    expect(registry.size).toBe(1);
  });

  it("refuses reentrant registration from own getters and resets admission after failure", () => {
    const registry = new PluginRegistry();
    const definition = {
      ...plugin("outer"),
      get priority(): number {
        registry.register(plugin("nested"));
        return 0;
      },
    };
    expect(thrown(() => registry.registerAll([plugin("first"), definition]))).toEqual(
      new TypeError("Plugin registration is already in progress."),
    );
    expect(registry.size).toBe(0);
    registry.registerAll([plugin("nested"), plugin("outer")]);
    expect(resolvedNames(registry, ["outer", "nested"])).toEqual(["nested", "outer"]);
  });

  it("reads metadata getters once, asks the joint predicate once and never composes on admission", () => {
    const reads = new Map<string, number>();
    const claims: string[] = [];
    const source = plugin("snapshot", {
      inputs: ["source"],
      outputs: ["output"],
      requirements: { base: {} },
      stage: "prepare",
      priority: 1,
      claimsKey: (key) => {
        claims.push(key);
        return false;
      },
      contribute: () => {
        throw new Error("contribute must not run on admission");
      },
      compose: () => {
        throw new Error("compose must not run on admission");
      },
    });
    const definition = Object.defineProperties(
      {},
      Object.fromEntries(
        Object.entries(source).map(([key, value]) => [
          key,
          {
            enumerable: true,
            get: () => {
              reads.set(key, (reads.get(key) ?? 0) + 1);
              return value;
            },
          },
        ]),
      ),
    ) as PluginDefinition;
    const registry = new PluginRegistry();
    registry.registerAll([definition]);
    expect(registry.size).toBe(1);
    expect([...reads.keys()].sort()).toEqual(Object.keys(source).sort());
    expect([...reads.values()]).toEqual(Object.keys(source).map(() => 1));
    expect(claims).toEqual(["joint"]);
  });

  it("preserves validation order and exact refusal messages without reserving candidate names", () => {
    const cases: readonly [Partial<PluginDefinition>, string][] = [
      [{ name: "" }, "Plugin name must be a non-empty string."],
      [
        { compose: 1 as unknown as PluginDefinition["compose"] },
        "Plugin compose must be a function.",
      ],
      [{ keys: "x" as unknown as string[] }, "Plugin keys must be an array when provided."],
      [
        { claimsKey: 1 as unknown as NonNullable<PluginDefinition["claimsKey"]> },
        "Plugin claimsKey must be a function when provided.",
      ],
      [{ inputs: "x" as unknown as string[] }, "Plugin inputs must be an array when provided."],
      [{ outputs: "x" as unknown as string[] }, "Plugin outputs must be an array when provided."],
      [
        { requirements: [] as unknown as NonNullable<PluginDefinition["requirements"]> },
        "Plugin requirements must be an object when provided.",
      ],
      [
        { stage: "unknown" as NonNullable<PluginDefinition["stage"]> },
        'Unknown plugin stage "unknown".',
      ],
      [{ contribute: () => undefined }, 'Plugin "bad" contribute requires stage "prepare".'],
      [{ priority: 1.5 }, "Plugin priority must be a finite integer when provided."],
      [{ requirements: { " ": {} } }, 'Plugin "bad" requirement slot must be non-empty.'],
      [{ keys: ["bad:key"] }, 'Plugin "bad" metadata name "bad:key" must not contain \':\'.'],
    ];
    for (const [extra, message] of cases) {
      const registry = new PluginRegistry();
      expect(thrown(() => registry.registerAll([plugin("first"), plugin("bad", extra)]))).toEqual(
        new TypeError(message),
      );
      expect(registry.size).toBe(0);
      registry.register(plugin("first"));
      expect(registry.size).toBe(1);
    }
    const registry = new PluginRegistry();
    registry.register(plugin("same"));
    expect(thrown(() => registry.register(plugin("same", { priority: 1.5 })))).toEqual(
      new TypeError("Plugin priority must be a finite integer when provided."),
    );
    for (const value of [null, undefined, 7, "name"]) {
      expect(thrown(() => registry.register(value as unknown as PluginDefinition))).toEqual(
        new TypeError("Plugin name must be a non-empty string."),
      );
    }
    expect(registry.size).toBe(1);
  });

  it("matches successful single-registration stage, priority and tie ordering", () => {
    const definitions = [
      plugin("late", { priority: 20 }),
      plugin("prepare", { stage: "prepare", priority: 99 }),
      plugin("same-first", { priority: 10 }),
      plugin("same-second", { priority: 10 }),
    ];
    const batch = new PluginRegistry();
    const singles = new PluginRegistry();
    batch.registerAll(definitions);
    for (const definition of definitions) singles.register(definition);
    const names = [...definitions].reverse().map(({ name }) => name);
    expect(resolvedNames(batch, names)).toEqual(resolvedNames(singles, names));
    expect(resolvedNames(batch, names)).toEqual(["prepare", "same-first", "same-second", "late"]);
  });

  it("does not leak a failed predicate into contributed-key fallback", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "prepare",
      keys: ["prepare"],
      stage: "prepare",
      contribute: () => ({ keyframes: { generated: [] } }),
      compose: (values) => values,
    });
    expect(
      thrown(() =>
        registry.registerAll([
          plugin("predicate", { keys: [], claimsKey: () => true }),
          plugin("bad", { priority: Number.NaN }),
        ]),
      ),
    ).toEqual(new TypeError("Plugin priority must be a finite integer when provided."));
    const resolved = registry.resolveForKeyframes({ prepare: { values: { prepare: [] } } });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["plugin-unknown-key"]);
    expect(registry.has("predicate")).toBe(false);
    registry.register(plugin("predicate", { keys: [], claimsKey: () => true }));
    expect(
      registry.resolveForKeyframes({ prepare: { values: { prepare: [] } } }).diagnostics,
    ).toEqual([]);
  });
});
