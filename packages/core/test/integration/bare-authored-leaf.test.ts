import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
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
import { compilePercentKeyframes } from "../../src/domain/keyframe-compiler";
import { flattenAuthoredKeyframes } from "../../src/domain/keyframe-groups";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

// Issue #192 and ADR-050. An authored leaf is a bare array of stops or a bare static value:
//
//   x: [ { p: 0, v: 0 }, { p: 1, v: 100 } ]
//   length: 62
//
// The `{ stops: [...] }` wrapper is retired, not kept as an accepted alias, for the reason ADR-049
// already established: two accepted shapes are two validation paths and two documentation paths.
//
// The static form is not sugar. A value that never changes should not enter the interpolator at all,
// so it contributes no percent-map entry, no compiled property, and no tween. `LF-7` and `LF-8` are
// that decision stated as assertions rather than left as an implementation detail, because a
// normalized two-stop hold would satisfy every other case in this file at the same runtime cost the
// wrapper already had.
//
// `ease` is unrepresentable on a static value by shape rather than by rule: a scalar has no slot to
// write one into, so nothing has to reject it.
//
// This file lives in the integration tier on purpose. The red run fails `typecheck` in the `quality`
// job, which runs before `npm test`, so a unit-tier case would produce no assertion output at all.
// The `integration` job runs vitest directly and reports every case, the same way the ADR-049 red
// run did.

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

/** The two comment forms, either of which may name the retired shape it documents. */
const COMMENT = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/.source;
/** A quoted body, which is where a diagnostic message names the shape it refuses. */
const QUOTED = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/.source;
/** A template body. Interpolations go with it: no authored leaf has ever lived in one. */
const TEMPLATE = /`(?:[^`\\]|\\.)*`/.source;
/**
 * Every comment and every quoted body, matched left to right in one pass.
 *
 * Order inside the alternation is what makes the interleaving come out right. A `//` inside a string
 * is consumed as part of that string, because the opening quote matched first; an apostrophe inside a
 * comment is consumed as part of that comment, for the same reason.
 */
const PROSE = new RegExp(`${COMMENT}|${QUOTED}|${TEMPLATE}`, "g");

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
  return patch?.values;
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

/**
 * One file's source with its prose removed and its code left intact.
 *
 * The probe is a regex, and a regex cannot tell a schema from a sentence about one. Three modules own
 * the refusal of the retired form and every one of them has to be able to name it: `authored-leaf`
 * and `v5` in a doc comment, and `validate-v5` in the diagnostic message an author actually reads.
 * Scanning that prose left the gate unsatisfiable by exactly the code that satisfies it, and the
 * alternative was to reword a diagnostic to dodge a grep, which makes product text a function of an
 * assertion's imprecision.
 *
 * Same reasoning that puts `docs/` out of scope, applied one level down. An authored leaf is object
 * syntax, so it never lives inside a comment or a quoted body: what survives this is code, and code
 * is the only thing the gate was ever about.
 */
function codeOnly(source: string): string {
  return source.replace(PROSE, " ");
}

describe("the bare authored leaf", () => {
  it("LF-5 interpolates a bare array of stops", () => {
    expect(ruleIds({ length: RAMP })).toEqual([]);
    // A mid-progress value, not a clean load: a property the interpolator never read would compile
    // without a single diagnostic and then hold still at every progress.
    expect(valuesAt({ length: RAMP }, 0.5)).toEqual({ length: 15 });
  });

  it("LF-6 publishes a bare static value and holds it at every progress", () => {
    expect(ruleIds({ length: 62 })).toEqual([]);
    expect(valuesAt({ length: 62 }, 0)).toEqual({ length: 62 });
    expect(valuesAt({ length: 62 }, 0.5)).toEqual({ length: 62 });
    expect(valuesAt({ length: 62 }, 1)).toEqual({ length: 62 });
    // The static domain is every finite scalar, not only numbers.
    expect(valuesAt({ label: "idle", visible: true }, 0.5)).toEqual({
      label: "idle",
      visible: true,
    });
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

  it("LF-9 refuses the retired object wrapper by name", () => {
    const diagnostics = diagnose({ x: { stops: RAMP } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "property-stops-wrapper", path: "keyframes.x" }),
    );
    // Half of this case is the negative assertion. Folded into the generic shape error, the retired
    // form would be reported as a leaf of an unknown shape, which names neither the mistake nor the
    // migration. Same pattern as `Y-2`.
    expect(diagnostics.map(({ ruleId }) => ruleId)).not.toContain("stops-shape");
    // Refused, never normalized: it does not reach the compiler as a two-stop hold either.
    expect(compilePercentKeyframes({ x: { stops: RAMP } }).initial).toEqual({});
  });

  it("LF-10 closes the static domain instead of leaving it open", () => {
    // Restricting static to a finite scalar is forced rather than chosen. If an object were a legal
    // static value then the retired wrapper would be one too, and `LF-9` would have nothing to fire
    // on. `null` and `undefined` are refused because omitting the key already spells absence.
    expect(ruleIds({ x: null })).toEqual(["stops-shape"]);
    expect(ruleIds({ x: undefined })).toEqual(["stops-shape"]);
    expect(ruleIds({ x: Number.NaN })).toEqual(["stops-shape"]);
    expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-shape"]);
    expect(ruleIds({ x: () => 1 })).toEqual(["stops-shape"]);
    // An object is refused too, and under the rule id ADR-049 already owns rather than this one.
    // `{ hold: 1 }` is a key holding a record of one scalar, which is exactly the pre-ADR-049 group
    // form that `LF-12` pins; the two shapes are indistinguishable, so no predicate on the value can
    // report one as a bad leaf and the other as a group missing its section. What this case owns is
    // that no object is ever a static value, and the more specific rule id says that as firmly.
    expect(ruleIds({ x: { hold: 1 } })).toEqual(["keyframes-missing-values-section"]);
    // The shape error cites the property the author wrote, not a `.stops` path that no longer
    // exists anywhere in the document.
    expect(diagnose({ x: null })[0]?.path).toBe("keyframes.x");
  });

  it("LF-11 never reads either leaf form as a plugin group", () => {
    // Green on the parent by design, and not claimed as red. Both new forms fail `isObject` before
    // the section test runs: arrays are excluded from its definition, and a scalar is never
    // `typeof === "object"`. Proven rather than asserted, because it is the property most likely to
    // regress silently.
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

    // Flattening is key routing and never inspects a leaf's contents, so a leaf under a section
    // reaches the compiler through the same path a flat one does and inherits both forms for free.
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
    const resolved = registry(contributor).resolveForKeyframes({ length: 62 });
    expect(resolved.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "plugin-contribution-static-unsupported",
        path: "keyframes.length",
      }),
    );
    // The hook still runs for an animated leaf, so the refusal is about the leaf and not the plugin.
    expect(registry(contributor).resolveForKeyframes({ length: RAMP }).diagnostics).toEqual([]);
  });

  it("LF-15 declares the leaf as a union and deletes the wrapper interface", () => {
    // Red in `typecheck` rather than in the runner for the two constants: both are `true` at run
    // time on the parent, and it is the assignment that fails while the leaf is still an object with
    // a required `stops` member. The declaring source is the artifact under test for the rest.
    expect(STATIC_IS_A_LEAF).toBe(true);
    expect(LEAF_IS_NOT_A_WRAPPER).toBe(true);

    const v5 = readFileSync(V5_SOURCE, "utf8");
    expect(v5).toContain("export type AuthoredStaticValue");
    expect(v5).toContain("export type AuthoredProperty");
    expect(v5).not.toContain("export interface AuthoredProperty");
  });

  it("LF-16 leaves no authored schema in the repository on the retired form", () => {
    const offenders: string[] = [];
    for (const root of SCHEMA_ROOTS)
      for (const file of scannedFiles(root)) {
        if (file === SELF) continue;
        if (WRAPPER_AUTHORING.test(codeOnly(readFileSync(`${REPO_ROOT}${file}`, "utf8"))))
          offenders.push(file);
      }
    // Migration completeness as a gate rather than as a promise in a review. The suite would already
    // be red for a fixture that authors the retired form, but a fixture nothing exercises would not,
    // and that is the one that reads as an accepted second shape later.
    expect(offenders.sort()).toEqual([]);
  });
});
