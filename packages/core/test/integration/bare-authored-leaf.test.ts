import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { code, codeOnly, declaration } from "../helpers/source-region";
import { fileURLToPath } from "node:url";
import { createGsapInterpolator, type GsapLike } from "../../src/adapters/interpolator/gsap";
import { isKeyframeGroup } from "../../src/contract/keyframe-shape";
import type {
  AuthoredProperty,
  AuthoredStaticValue,
  Diagnostic,
  ProjectDefinition,
} from "../../src/contract/v5";
import { validateKeyframes } from "../../src/contract/validate-v5";
import { compilePercentKeyframes } from "../../src/contract/keyframe-compiler";
import { flattenAuthoredKeyframes } from "../../src/domain/keyframe-groups";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

// Issue #192 and ADR-050. Authored leaves are legal inside a plugin group's `values` section:
//
//   keyframes: { fk: { values: { length: [ { p: 0, v: 10 }, { p: 1, v: 20 } ] } } }
//
// The leaf reader still owns arrays, static scalars and the accepted `{}` no-op. The authored
// validator now owns the outer boundary: a top-level leaf, including the retired `{ stops: [...] }`
// wrapper, is refused as `keyframes-ungrouped-key` rather than entering the runtime.
//
// The static form is not sugar. A value that never changes should not enter the interpolator at all,
// so it contributes no percent-map entry, no compiled property, and no tween. `LF-7` and `LF-8` are
// that decision stated for the compiled leaf record; `LF-6` proves the same leaf remains valid when
// authored under `values`.
//
// `ease` is unrepresentable on a static value by shape rather than by rule: a scalar has no slot to
// write one into, so nothing has to reject it.

const REPO_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const V5_SOURCE = fileURLToPath(new URL("../../src/contract/v5.ts", import.meta.url));
const SELF = "packages/core/test/integration/bare-authored-leaf.test.ts";

/**
 * Where an authored schema may live, and what it may not say.
 *
 * Code only, and deliberately not `docs/`. A document that refuses the retired form has to be able
 * to name it, so scanning prose for the thing it documents would make the gate unsatisfiable. The
 * `oracle/` tree is excluded for a different reason: it is the reference implementation, it is
 * outside the root `tsconfig` include, and nothing in it is ours to migrate.
 */
const SCHEMA_ROOTS = ["packages", "apps"];
const SCANNED_EXTENSIONS = [".ts", ".tsx"];
/** `stops:` followed by an array literal. The retired wrapper, and nothing else. */
const WRAPPER_AUTHORING = /\bstops\s*:\s*\[/;

/** These assertions are shared with the adversarial fixture, not reimplemented by it. */
function assertLeafDeclarations(source: string): void {
  expect(codeOnly(declaration(source, "export type AuthoredStaticValue", ";"))).toMatch(
    /=\s*number\s*\|\s*string\s*\|\s*boolean\s*$/,
  );
  expect(codeOnly(declaration(source, "export type AuthoredProperty", ";"))).toMatch(
    /=\s*readonly\s+AuthoredStop\[\]\s*\|\s*AuthoredStaticValue\s*$/,
  );
  expect(codeOnly(source)).not.toMatch(/\binterface\s+AuthoredProperty\b/);
}

/**
 * `true` exactly when a bare static value is a legal authored leaf.
 *
 * Asserted through a typed constant rather than a bare alias, because an unused alias is erased
 * before `tsc --noEmit` reads it. A type that still says something else has to fail an assignment
 * for a red run to name it. Same shape as `Y-12` and `J-1`.
 */
type StaticIsALeaf = AuthoredStaticValue extends AuthoredProperty ? true : false;
/** `false` while the leaf is still the object wrapper, because the union has no `stops` member. */
type LeafIsNotAWrapper = AuthoredProperty extends { readonly stops: unknown } ? false : true;

const STATIC_IS_A_LEAF: StaticIsALeaf = true;
const LEAF_IS_NOT_A_WRAPPER: LeafIsNotAWrapper = true;

const RAMP = [
  { p: 0, v: 10 },
  { p: 1, v: 20 },
];

/** Claims every leaf these cases author, so ownership never decides a schema question. */
const passthrough: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation", "x", "label", "visible"],
  requirements: { base: {} },
  stage: "compose",
  compose: (values) => values,
};

/**
 * A prepare-stage claimant, so `LF-14` can ask what a `contribute` hook receives for a static leaf.
 *
 * The hook body is never reached on either side of this change: before it, the leaf is refused as a
 * shape error; after it, as `plugin-contribution-static-unsupported`.
 */
const contributor: PluginDefinition = {
  name: "fk",
  keys: ["length"],
  stage: "prepare",
  contribute: () => ({ keyframes: {} }),
  compose: (values) => values,
};

/**
 * Authored keyframes arrive as `unknown` and the project is cast once, deliberately.
 *
 * Every case here authors a shape one side of this change refuses, so a fixture the compiler rejects
 * would never reach the assertion that names the rule id. `LF-15` is what asserts on the type
 * instead. Identical reasoning to the `project` helper in `plugin-group-values-section.test.ts`.
 */
function project(keyframes: Readonly<Record<string, unknown>>): ProjectDefinition {
  const tracks = [{ id: "arm", keyframes }];
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
  } as unknown as ProjectDefinition;
}

function registry(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

function load(definition: ProjectDefinition, plugins: PluginRegistry) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(definition);
}

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

/** The published values of one node at one progress, through the whole load path. */
function valuesAt(
  keyframes: Readonly<Record<string, unknown>>,
  progress: number,
): Readonly<Record<string, unknown>> | undefined {
  const handle = load(project(keyframes), registry(passthrough));
  handle.mount("hero/arm");
  const batch = handle.seek("hero/arm", progress);
  const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
  handle.dispose();
  // A pose belongs to a ready patch, and this helper's return type already admits absence, so a
  // node that did not compose answers nothing rather than an earlier publication's values.
  return patch?.status === "ready" ? patch.values : undefined;
}

interface RecordedTween {
  readonly keys: readonly string[];
  readonly position: number | undefined;
}

/**
 * A recording stand-in for GSAP, so the cost claim is observed through the injected port.
 *
 * Cast rather than structurally implemented: `GsapTimelineLike` declares overloaded `duration` and
 * `progress` accessors that a double has no reason to model, and the port is the seam under test
 * rather than the timeline's own getter arity.
 */
function recordingGsap(): { tweens: RecordedTween[]; gsap: GsapLike } {
  const tweens: RecordedTween[] = [];
  const timeline = {
    duration: () => 1,
    progress: () => 0,
    to(_target: unknown, vars: Record<string, unknown>, position?: number) {
      tweens.push({ keys: Object.keys(vars), position });
      return timeline;
    },
    kill() {},
  };
  return { tweens, gsap: { timeline: () => timeline } as unknown as GsapLike };
}

function scannedFiles(root: string): readonly string[] {
  return readdirSync(`${REPO_ROOT}${root}`, { recursive: true, encoding: "utf8" })
    .map((entry) => `${root}/${entry.split("\\").join("/")}`)
    .filter((entry) => SCANNED_EXTENSIONS.some((extension) => entry.endsWith(extension)));
}

describe("the bare authored leaf", () => {
  it("LF-5 interpolates an animated leaf inside a values section", () => {
    const authored = { fk: { values: { length: RAMP } } };
    expect(ruleIds(authored)).toEqual([]);
    // A mid-progress value, not a clean load: a property the interpolator never read would compile
    // without a single diagnostic and then hold still at every progress.
    expect(valuesAt(authored, 0.5)).toEqual({ length: 15 });
  });

  it("LF-6 publishes a static leaf inside a values section and holds it at every progress", () => {
    const authored = { fk: { values: { length: 62 } } };
    expect(ruleIds(authored)).toEqual([]);
    expect(valuesAt(authored, 0)).toEqual({ length: 62 });
    expect(valuesAt(authored, 0.5)).toEqual({ length: 62 });
    expect(valuesAt(authored, 1)).toEqual({ length: 62 });
    // The static domain is every finite scalar, not only numbers.
    const scalarLeaves = { fk: { values: { label: "idle", visible: true } } };
    expect(valuesAt(scalarLeaves, 0.5)).toEqual({ label: "idle", visible: true });
  });

  it("LF-7 keeps a static leaf out of the percent map and out of the compiled properties", () => {
    const compiled = compilePercentKeyframes({ length: 62, x: RAMP });

    // The central decision of the issue. A static leaf reaches `initial` and nothing else, so it is
    // published at every progress without a percent-map entry, a tween var, or an interpolator seat.
    expect(compiled.properties.map(({ key }) => key)).toEqual(["x"]);
    expect(compiled.initial).toEqual({ length: 62, x: 10 });
    expect(Object.keys(compiled.map)).toEqual(["0%", "100%"]);
    for (const [percent, frame] of Object.entries(compiled.map))
      expect(Object.keys(frame), `percent ${percent}`).toEqual(["x"]);
    expect(compiled.diagnostics).toEqual([]);
  });

  it("LF-8 contributes no tween for a static leaf", () => {
    const { tweens, gsap } = recordingGsap();
    const timeline = createGsapInterpolator(gsap).create({
      keyframes: { length: 62, x: RAMP },
      duration: 1,
    });
    const tweened = new Set(tweens.flatMap(({ keys }) => keys));

    // Observed through the port rather than through a spy on the compiler, so an interpolator stays
    // substitutable without knowing that static leaves exist at all.
    expect(tweened.has("length")).toBe(false);
    expect(tweened.has("x")).toBe(true);
    // And it is still published, because the proxy is seeded from `initial`.
    expect(timeline.state.length).toBe(62);
    timeline.kill();
  });

  it("LF-9 refuses the retired object wrapper by name inside a group, and as ungrouped at the top", () => {
    const diagnostics = diagnose({ fk: { values: { x: { stops: RAMP } } } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "property-stops-wrapper", path: "keyframes.fk.values.x" }),
    );
    // Half of this case is the negative assertion. Folded into the generic shape error, the retired
    // form would be reported as a leaf of an unknown shape, which names neither the mistake nor the
    // migration. Same pattern as `Y-2`.
    expect(diagnostics.map(({ ruleId }) => ruleId)).not.toContain("stops-shape");
    // Refused, never normalized: it does not reach the compiler as a two-stop hold either. The
    // compiler reads flattened leaves, so its input stays flat.
    expect(compilePercentKeyframes({ x: { stops: RAMP } }).initial).toEqual({});
    // At the top level the wrapper names no plugin, so the entry is refused as ungrouped before its
    // value is read as a leaf (ADR-121), and the wrapper rule does not fire a second time.
    const topLevel = diagnose({ x: { stops: RAMP } });
    expect(topLevel.map(({ ruleId }) => ruleId)).toEqual(["keyframes-ungrouped-key"]);
    expect(topLevel[0]?.path).toBe("keyframes.x");
  });

  it("LF-10 closes the static domain inside a values section, and refuses every bare top-level leaf", () => {
    // Restricting static to a finite scalar is forced rather than chosen. If an object were a legal
    // static value then the retired wrapper would be one too, and `LF-9` would have nothing to fire
    // on. `null` and `undefined` are refused because omitting the key already spells absence.
    const leaf = (value: unknown) => ({ fk: { values: { x: value } } });
    expect(ruleIds(leaf(null))).toEqual(["stops-shape"]);
    expect(ruleIds(leaf(undefined))).toEqual(["stops-shape"]);
    expect(ruleIds(leaf(Number.NaN))).toEqual(["stops-shape"]);
    expect(ruleIds(leaf(Number.POSITIVE_INFINITY))).toEqual(["stops-shape"]);
    expect(ruleIds(leaf(() => 1))).toEqual(["stops-shape"]);
    // An object is refused too. Inside `values` the position already names the plugin, so a record
    // of one scalar is no longer indistinguishable from a pre-ADR-049 group (`LF-12` owns that one
    // at the top level) and it is reported as the bad leaf it is.
    expect(ruleIds(leaf({ hold: 1 }))).toEqual(["stops-shape"]);
    // The shape error cites the property the author wrote, not a `.stops` path that no longer
    // exists anywhere in the document.
    expect(diagnose(leaf(null))[0]?.path).toBe("keyframes.fk.values.x");
    // `{}` inside `values` keeps its accepted no-op meaning (`Y-6`); only the top level refuses it.
    expect(ruleIds({ fk: { values: { empty: {} } } })).toEqual([]);
    // Every bare leaf at the top level names no plugin, so it is refused as ungrouped at the entry,
    // by the validator and through the whole load path alike.
    const cases = [
      { key: "static", value: 62 },
      { key: "stops", value: RAMP },
      { key: "wrapper", value: { stops: RAMP } },
      { key: "empty", value: {} },
    ] as const;
    for (const { key, value } of cases) {
      expect(ruleIds({ [key]: value }), key).toEqual(["keyframes-ungrouped-key"]);
      expect(diagnose({ [key]: value })[0]?.path, key).toBe(`keyframes.${key}`);
      expect(() => load(project({ [key]: value }), registry(passthrough)), key).toThrow(
        `keyframes.${key}`,
      );
    }
  });

  it("LF-11 never reads a leaf as a plugin group", () => {
    // Both leaf forms fail `isObject` before the section test runs: arrays are excluded from its
    // definition, and a scalar is never `typeof === "object"`. Proven rather than asserted, because
    // it is the property most likely to regress silently.
    expect(isKeyframeGroup(RAMP)).toBe(false);
    expect(isKeyframeGroup(62)).toBe(false);
    expect(isKeyframeGroup("idle")).toBe(false);
    expect(isKeyframeGroup(true)).toBe(false);
    // And a group holding both forms under its section is still exactly a group.
    expect(isKeyframeGroup({ values: { length: 62, rotation: RAMP } })).toBe(true);
  });

  it("LF-12 still refuses a migrated legacy group by name", () => {
    // The regression a dead-clause deletion would have caused. `looksLikeLegacyGroup` decides
    // membership with `isObject`, and a migrated legacy group's leaves are arrays and scalars, which
    // `isObject` excludes by definition. Left alone, both of these would be reported as a property
    // of an unknown shape, which is the misdiagnosis ADR-049 introduced the predicate to prevent.
    expect(ruleIds({ fk: { length: RAMP } })).toEqual(["keyframes-missing-values-section"]);
    expect(ruleIds({ fk: { length: 62 } })).toEqual(["keyframes-missing-values-section"]);
  });

  it("LF-13 accepts both leaf forms inside a values section", () => {
    const authored = { fk: { values: { length: 62, rotation: RAMP } } };
    expect(ruleIds(authored)).toEqual([]);

    // Flattening is key routing and never inspects a leaf's contents, so a leaf under a values
    // section reaches the compiler and inherits both forms for free.
    const flattened = flattenAuthoredKeyframes(authored);
    expect(Object.keys(flattened.keyframes).sort()).toEqual(["length", "rotation"]);
    expect(flattened.authoredPaths.get("length")).toBe("fk.values.length");
    expect(diagnose({ fk: { values: { length: { stops: RAMP } } } })).toContainEqual(
      expect.objectContaining({
        ruleId: "property-stops-wrapper",
        path: "keyframes.fk.values.length",
      }),
    );
  });

  it("LF-14 refuses a static leaf on a prepare-stage contributor's key", () => {
    // An empty stop list would be a field accepted and then ignored, which rule 6 of ADR-033
    // forbids, and it would read as a hook that ran and declined. A static leaf never enters
    // compilation, so there is no percent grid for a contribution to land on.
    const resolved = registry(contributor).resolveForKeyframes({ fk: { values: { length: 62 } } });
    expect(resolved.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "plugin-contribution-static-unsupported",
        path: "keyframes.fk.values.length",
      }),
    );
    // The hook still runs for an animated leaf, so the refusal is about the leaf and not the plugin.
    expect(
      registry(contributor).resolveForKeyframes({ fk: { values: { length: RAMP } } }).diagnostics,
    ).toEqual([]);
  });

  it("LF-15 declares the leaf as a union and deletes the wrapper interface", () => {
    // Red in `typecheck` rather than in the runner for the two constants: both are `true` at run
    // time on the parent, and it is the assignment that fails while the leaf is still an object with
    // a required `stops` member. The declaring source is the artifact under test for the rest.
    expect(STATIC_IS_A_LEAF).toBe(true);
    expect(LEAF_IS_NOT_A_WRAPPER).toBe(true);

    assertLeafDeclarations(code(V5_SOURCE));
  });

  it("LF-17 requires real union declarations despite prose and literal decoys", () => {
    const real =
      "export type AuthoredStaticValue = number | string | boolean;\n" +
      "export type AuthoredProperty = readonly AuthoredStop[] | AuthoredStaticValue;";
    const decoy =
      `/* ${real} export interface AuthoredProperty {} */\n` +
      `const quoted = ${JSON.stringify(real)};\n`;
    expect(() => assertLeafDeclarations(decoy + real)).not.toThrow();
    expect(() => assertLeafDeclarations(decoy)).toThrow();
    expect(() => assertLeafDeclarations(decoy + "export interface AuthoredProperty {}")).toThrow();
    expect(() =>
      assertLeafDeclarations(
        real.replace(
          "readonly AuthoredStop[] | AuthoredStaticValue",
          '"readonly AuthoredStop[] | AuthoredStaticValue"',
        ),
      ),
    ).toThrow();
    expect(() => assertLeafDeclarations(real + "\ninterface AuthoredProperty {}")).toThrow();
    expect(WRAPPER_AUTHORING.test(codeOnly('const text = "stops: [";'))).toBe(false);
    expect(WRAPPER_AUTHORING.test(codeOnly("const leaf = { stops: [] };"))).toBe(true);
    expect(
      WRAPPER_AUTHORING.test(codeOnly("const text = `${JSON.stringify({ stops: [] })}`;")),
    ).toBe(true);
  });

  it("LF-16 leaves no authored schema in the repository on the retired form", () => {
    const offenders: string[] = [];
    for (const root of SCHEMA_ROOTS)
      for (const file of scannedFiles(root)) {
        if (file === SELF) continue;
        if (WRAPPER_AUTHORING.test(codeOnly(code(`${REPO_ROOT}${file}`), file)))
          offenders.push(file);
      }
    // Migration completeness as a gate rather than as a promise in a review. The suite would already
    // be red for a fixture that authors the retired form, but a fixture nothing exercises would not,
    // and that is the one that reads as an accepted second shape later.
    expect(offenders.sort()).toEqual([]);
    // The budget is the tree's, not a unit's: this parses every `.ts` file under `packages/` and
    // `apps/`, so its cost grows with the repository, and the 5,000 ms default timed it out on
    // `CI` run 36143222650 with no offender found. It is a timeout, never a skip.
  }, 60000);
});
