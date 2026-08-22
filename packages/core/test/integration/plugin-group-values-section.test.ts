import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AuthoredPluginGroup, Diagnostic, ProjectDefinition } from "../../src/contract/v5";
import { validateKeyframes, validateV5 } from "../../src/contract/validate-v5";
import { flattenAuthoredKeyframes } from "../../src/domain/keyframe-groups";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { fkPlugin } from "../../src/plugins/fk";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

// Issue #177 and ADR-049. A plugin-named group has exactly two members and both are reserved by
// name: `values` holds the properties the plugin claims and `requires` holds its graph bindings.
//
//   keyframes: { fk: { values: { length, rotation }, requires: { base: "walk/pelvis" } } }
//
// Reserving `values` is what makes group detection exact rather than heuristic. Left authorable as
// a property name, one spelling would mean a keyframe in one group and a section in another, which
// is undecidable without the plugin registry the contract layer must not have. The old top-level
// leaf form is refused by name rather than normalized: two authoring shapes are two validation
// paths and two documentation paths.

const V5_SOURCE = fileURLToPath(new URL("../../src/contract/v5.ts", import.meta.url));

/**
 * `true` exactly when `K` is a member of `T`.
 *
 * Asserted through a typed constant rather than a bare alias, because an unused alias is erased
 * before `tsc --noEmit` reads it. A type that still says something else has to fail an assignment
 * for a red run to name it. Same shape as `V-1` and `J-1`.
 */
type Present<T, K extends string> = K extends keyof T ? true : false;

type GroupMembers = keyof AuthoredPluginGroup;
/** `false` while the group is an open record, because `string` extends neither section name. */
type OnlyTheTwoSections = GroupMembers extends "requires" | "values" ? true : false;

const GROUP_DECLARES_VALUES: Present<AuthoredPluginGroup, "values"> = true;
const GROUP_DECLARES_REQUIRES: Present<AuthoredPluginGroup, "requires"> = true;
const GROUP_DECLARES_NOTHING_ELSE: OnlyTheTwoSections = true;

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}

function hold(value: number) {
  return {
    stops: [
      { p: 0, v: value },
      { p: 1, v: value },
    ],
  };
}

/**
 * Authored keyframes arrive as `unknown` and the project is cast once, deliberately.
 *
 * Every case here authors a shape one side of this change refuses: the legacy leaf form is illegal
 * after it and a `values` section is illegal before it. A fixture the compiler rejects never
 * reaches the assertion that names the rule id, so the shapes under test are carried past the type
 * on purpose, and `Y-12` is what asserts on the type instead.
 */
function project(keyframes: Readonly<Record<string, unknown>>): ProjectDefinition {
  const tracks = [{ id: "arm", keyframes }];
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
  } as unknown as ProjectDefinition;
}

/** The same project with a bindable source beside the authored track. */
function rig(keyframes: Readonly<Record<string, unknown>>): ProjectDefinition {
  const tracks = [{ id: "root" }, { id: "arm", keyframes }];
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
  } as unknown as ProjectDefinition;
}

const PELVIS = { x: ramp(0, 200), y: hold(100), rotation: hold(0) };
const THIGH = { length: hold(50), rotation: hold(45) };
const SHIN = { length: hold(40), rotation: hold(-30) };

/** The walker rig, authored under `values`: a root and two bones bound through `fk.requires`. */
const walkerRig = {
  schemaVersion: 5,
  motions: [
    {
      id: "walk",
      trigger: { type: "manual" },
      tracks: [
        { id: "pelvis", keyframes: { transform: { values: PELVIS } } },
        { id: "thigh", keyframes: { fk: { values: THIGH, requires: { base: "walk/pelvis" } } } },
        { id: "shin", keyframes: { fk: { values: SHIN, requires: { base: "walk/thigh" } } } },
      ],
    },
  ],
} as unknown as ProjectDefinition;

/** Claims the leaves every case below authors, so ownership never decides a schema question. */
const passthrough: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation", "values"],
  requirements: { base: {} },
  stage: "compose",
  compose: (values) => values,
};

function diagnose(keyframes: unknown): readonly Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  validateKeyframes(keyframes, "keyframes", diagnostics);
  return diagnostics;
}

function ruleIds(keyframes: unknown): readonly string[] {
  return diagnose(keyframes)
    .map(({ ruleId }) => ruleId)
    .sort();
}

function load(definition: ProjectDefinition, plugins: PluginRegistry) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(definition);
}

function registry(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

describe("an explicit values section inside plugin groups", () => {
  it("Y-1 compiles the values section to leaves and the requires section to nothing", () => {
    const authored = {
      fk: { values: { length: ramp(10, 20) }, requires: { base: "hero/root" } },
    };
    const handle = load(rig(authored), registry(passthrough));
    handle.mount("hero/root");
    handle.mount("hero/arm");
    handle.seek("hero/root", 0);

    // A mid-progress value, not a clean load: a property the interpolator never read would compile
    // without a single diagnostic and then hold still at every progress.
    const batch = handle.seek("hero/arm", 0.5);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    expect(patch?.status).toBe("ready");
    expect(patch?.values).toEqual({ length: 15 });

    // And the binding compiled to no property at all. `values` is the only compiled value domain
    // because it is the only section flattening reads.
    expect(Object.keys(flattenAuthoredKeyframes(authored).keyframes)).toEqual(["length"]);
    handle.dispose();
  });

  it("Y-2 refuses the legacy leaf form by name rather than as a missing stops array", () => {
    const diagnostics = diagnose({ fk: { length: ramp(0, 1) } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "keyframes-missing-values-section",
        path: "keyframes.fk",
      }),
    );
    // Half of this case is the negative assertion. The old heuristic reported `stops-shape` for a
    // group, which named the group and not the mistake the author made.
    expect(diagnostics.map(({ ruleId }) => ruleId)).not.toContain("stops-shape");
  });

  it("Y-3 reports an unknown section once and names both legal sections", () => {
    const authored = { fk: { values: { length: ramp(0, 1) }, typo: { length: ramp(0, 1) } } };
    const unknown = diagnose(authored).filter(
      ({ ruleId }) => ruleId === "keyframes-unknown-section",
    );
    expect(unknown).toHaveLength(1);
    expect(unknown[0]?.path).toBe("keyframes.fk.typo");
    expect(unknown[0]?.message).toContain("'requires'");
    expect(unknown[0]?.message).toContain("'values'");
  });

  it("Y-4 reserves a top-level values under the rule id a top-level requires gets", () => {
    // A top-level section name addresses no plugin, so nothing written there could ever have an
    // owner. One reservation, one rule id, for both members of a group.
    expect(ruleIds({ values: { length: ramp(0, 1) } })).toEqual(["keyframes-reserved-section"]);
    expect(ruleIds({ requires: { base: "hero/root" } })).toEqual(["keyframes-reserved-section"]);
  });

  it("Y-5 refuses a malformed or an empty values section", () => {
    expect(ruleIds({ fk: { values: [] } })).toEqual(["keyframes-values-shape"]);
    expect(ruleIds({ fk: { values: "x" } })).toEqual(["keyframes-values-shape"]);
    expect(ruleIds({ fk: { values: 3 } })).toEqual(["keyframes-values-shape"]);
    // Omitting the section is already how an author writes no properties, so an empty one is a
    // field accepted and then ignored. Identical reasoning to `keyframes-requires-empty`.
    expect(ruleIds({ fk: { values: {} } })).toEqual(["keyframes-values-empty"]);
  });

  it("Y-6 leaves an empty object an accepted no-op property rather than a group", () => {
    // Green on the parent by design, and not claimed as red. `{}` names no section, so it is not a
    // group at all; it stays the accepted no-op property that `{ opacity: {} }` already was.
    expect(ruleIds({ fk: {} })).toEqual([]);
    expect(flattenAuthoredKeyframes({ fk: {} }).keyframes).toEqual({ fk: {} });
  });

  it("Y-7 cites the section in a diagnostic about a leaf inside it", () => {
    const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 }] } } } };
    expect(diagnose(authored)).toContainEqual(
      expect.objectContaining({
        ruleId: "stop-position-range",
        path: "keyframes.fk.values.length.stops[0].p",
      }),
    );
    const paths = flattenAuthoredKeyframes(authored).authoredPaths;
    expect(paths.get("length")).toBe("fk.values.length");
  });

  it("Y-8 keeps a leaf named values legal inside the section, and resolvable", () => {
    // The reservation is on section position, not on the string everywhere: `fk.values.values` is
    // a property called `values` that `fk` claims, and nothing about it is ambiguous.
    const authored = { fk: { values: { values: ramp(0, 1) } } };
    expect(ruleIds(authored)).toEqual([]);

    const resolved = registry(passthrough).resolveForKeyframes(authored);
    expect(resolved.diagnostics).toEqual([]);
    expect(Object.keys(resolved.authoredKeyframes)).toEqual(["values"]);
  });

  it("Y-9 keeps the perspective warning for 3D content inside the values section", () => {
    const result = validateV5(project({ fk: { values: { rotationY: ramp(0, 1) } } }));
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("Y-10 refuses one compiled key authored under two groups' values sections", () => {
    const authored = {
      fk: { values: { length: ramp(0, 1) } },
      ik: { values: { length: ramp(0, 2) } },
    };
    expect(diagnose(authored)).toContainEqual(
      expect.objectContaining({
        ruleId: "keyframes-duplicate-key",
        path: "keyframes.ik.values.length",
      }),
    );
  });

  it("Y-11 joins a bindings-only group to the composer chain and scopes its input", () => {
    // Green on the parent by design, and not claimed as red. A group may author nothing but
    // bindings; left out of the chain, such a track would derive an edge and compose nothing.
    const authored = { fk: { requires: { base: "hero/root" } } };
    const resolved = registry(passthrough).resolveForKeyframes(authored);
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["fk"]);
    expect(resolved.requirements).toEqual([{ plugin: "fk", slot: "base", source: "hero/root" }]);
  });

  it("Y-12 declares the group as two named sections and deletes the member union", () => {
    // Red in `typecheck` rather than in the runner for the first three: every constant is `true`
    // at run time on the parent, and it is the assignment that fails while the type is still an
    // open record of a union.
    expect(GROUP_DECLARES_VALUES).toBe(true);
    expect(GROUP_DECLARES_REQUIRES).toBe(true);
    expect(GROUP_DECLARES_NOTHING_ELSE).toBe(true);
    // `AuthoredPluginMember` was the escape hatch the open record needed. It is deleted rather
    // than left declared and unused, and the declaring source is the artifact under test.
    expect(readFileSync(V5_SOURCE, "utf8")).not.toContain("AuthoredPluginMember");
  });

  it("Y-13 composes the walker rig's world frame through the values section", () => {
    const handle = load(walkerRig, registry(transformPlugin, fkPlugin));
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.mount("walk/shin");

    // The world frame the top-level leaf form produced, at the same progress: a pelvis at
    // (100, 100) with rotation 0, a thigh of 50 at 45 degrees, a shin of 40 at -30 relative.
    const batch = handle.seek("walk/pelvis", 0.5);
    const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/thigh");
    const shin = batch.patches.find(({ nodeId }) => nodeId === "walk/shin");
    expect(thigh?.values.x).toBeCloseTo(135.355, 2);
    expect(thigh?.values.y).toBeCloseTo(135.355, 2);
    expect(thigh?.values.rotation).toBeCloseTo(45, 12);
    expect(shin?.values.x).toBeCloseTo(173.992, 2);
    expect(shin?.values.y).toBeCloseTo(145.708, 2);
    expect(shin?.values.rotation).toBeCloseTo(15, 12);
    handle.dispose();
  });
});
