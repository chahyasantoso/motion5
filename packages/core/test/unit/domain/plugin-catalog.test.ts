import { describe, expect, it, vi } from "vitest";
import type { DependencySpec, PluginDefinition, ValueSpec } from "../../../src/contract/v5";
import { PluginAdmissionError, PluginCatalog } from "../../../src/domain/plugin-catalog";
import { validateV5 } from "../../../src/validate-v5";

type ScaleValues = Readonly<Record<"factor", number>>;
type ScaleInput = { readonly values: ScaleValues; readonly requires: {} };

const SCALE: PluginDefinition<ScaleInput> = {
  id: "scale",
  inputs: { values: { kind: "record", fields: { factor: { kind: "number" } } } },
  outputs: { values: { kind: "record", fields: { value: { kind: "number" } } } },
  transform(input) {
    return { values: { value: input.values.factor } };
  },
};

function malformed(overrides: Readonly<Record<string, unknown>>): PluginDefinition {
  return { ...SCALE, ...overrides } as unknown as PluginDefinition;
}

function reason(operation: () => unknown): string {
  try {
    operation();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  throw new Error("Expected the operation to refuse.");
}

function project(track: unknown): unknown {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [track],
      },
    ],
  };
}

describe("plugin admission is keyed by id and atomic", () => {
  it("admits a typed definition and answers it by id", () => {
    const catalog = new PluginCatalog();
    catalog.register(SCALE);

    expect(catalog.size).toBe(1);
    expect(catalog.has("scale")).toBe(true);
    expect(catalog.get("scale")?.id).toBe("scale");
    expect(catalog.isPluginAdmitted("scale")).toBe(true);
    // A catalog owns no grouped solver capability.
    expect(catalog.capabilityOf("scale")).toBeUndefined();
    expect(catalog.dedicatedMembers()).toEqual([]);
  });

  it("refuses a duplicate id without changing the admitted definition", () => {
    const catalog = new PluginCatalog();
    catalog.register(SCALE);
    const before = catalog.get("scale");

    expect(reason(() => catalog.register(SCALE))).toMatch(/^plugin-duplicate-id at /);
    expect(catalog.size).toBe(1);
    expect(catalog.get("scale")).toBe(before);
  });

  it("leaves the registry unchanged when one member of a batch is invalid", () => {
    const catalog = new PluginCatalog();
    const invalid = malformed({
      id: "broken",
      inputs: { values: { kind: "record", fields: {} }, extra: 1 },
    });

    expect(reason(() => catalog.registerAll([SCALE, invalid]))).toMatch(/^plugin-shape at /);
    expect(catalog.size).toBe(0);
    expect(catalog.has("scale")).toBe(false);
  });

  it("refuses a duplicate inside one batch, not only against the committed registry", () => {
    const catalog = new PluginCatalog();

    expect(reason(() => catalog.registerAll([SCALE, SCALE]))).toMatch(/^plugin-duplicate-id at /);
    expect(catalog.size).toBe(0);
  });

  it("carries the rule id as data on the admission refusal", () => {
    const catalog = new PluginCatalog();
    catalog.register(SCALE);
    try {
      catalog.register(SCALE);
      throw new Error("Expected the duplicate to refuse.");
    } catch (error) {
      expect(error).toBeInstanceOf(PluginAdmissionError);
      expect((error as PluginAdmissionError).ruleId).toBe("plugin-duplicate-id");
    }
  });
});

describe("admission refuses a malformed definition by rule", () => {
  const table: ValueSpec = {
    kind: "table",
    schema: { row: { fields: { x: { kind: "number" } } } },
  };
  const dependency: DependencySpec = { outputs: { values: table } };

  it("refuses the retired type alias in a ValueSpec", () => {
    const plugin = malformed({
      outputs: { values: { type: "record", fields: {} } },
    });
    expect(reason(() => new PluginCatalog().register(plugin))).toMatch(/^spec-field-unknown at /);
  });

  it("refuses optional on inputs.values", () => {
    const plugin = malformed({
      inputs: {
        values: { kind: "record", fields: { factor: { kind: "number" } }, optional: true },
      },
    });
    expect(reason(() => new PluginCatalog().register(plugin))).toMatch(/^plugin-input-invalid at /);
  });

  it("refuses static on a plugin output", () => {
    const plugin = malformed({
      outputs: {
        values: {
          kind: "record",
          fields: { value: { kind: "number", static: true } },
        },
      },
    });
    expect(reason(() => new PluginCatalog().register(plugin))).toMatch(/^spec-field-unknown at /);
  });

  it("refuses a reserved output name", () => {
    const plugin = malformed({
      outputs: Object.fromEntries([["__proto__", table]]),
    });
    expect(reason(() => new PluginCatalog().register(plugin))).toMatch(/^name-reserved at /);
  });

  it("refuses a non-callable transform and validate", () => {
    expect(reason(() => new PluginCatalog().register(malformed({ transform: 1 })))).toMatch(
      /^plugin-shape at /,
    );
    expect(reason(() => new PluginCatalog().register(malformed({ validate: 1 })))).toMatch(
      /^plugin-shape at /,
    );
  });

  it("refuses an invalid dependency binding mode", () => {
    const plugin = malformed({
      inputs: {
        values: { kind: "record", fields: { factor: { kind: "number" } } },
        requires: { data: { ...dependency, binding: "many" } },
      },
    });
    expect(reason(() => new PluginCatalog().register(plugin))).toMatch(/^slot-binding-mode at /);
  });

  it("refuses an unknown plugin definition member", () => {
    expect(reason(() => new PluginCatalog().register(malformed({ stage: "prepare" })))).toMatch(
      /^plugin-shape at /,
    );
  });
});

describe("a track selects a plugin only by its authored id", () => {
  it("accepts a registered id and refuses an unknown one", () => {
    const catalog = new PluginCatalog();
    catalog.register(SCALE);

    expect(
      validateV5(
        project({ id: "scaled", plugin: "scale", input: { values: { factor: 2 } } }),
        catalog,
      ).kind,
    ).toBe("accepted");

    const refused = validateV5(
      project({ id: "scaled", plugin: "missing", input: { values: { factor: 2 } } }),
      catalog,
    );
    expect(refused.kind).toBe("refused");
    if (refused.kind === "refused")
      expect(refused.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-unknown");
  });

  it("creates no plugin demand for a track that names no plugin", () => {
    const catalog = new PluginCatalog();
    const demand = vi.spyOn(catalog, "pluginDefinition");

    const result = validateV5(
      project({ id: "points", input: { values: [{ id: "a", cells: { x: 1 } }] } }),
      catalog,
    );

    expect(result.kind).toBe("accepted");
    expect(demand).not.toHaveBeenCalled();
  });
});
