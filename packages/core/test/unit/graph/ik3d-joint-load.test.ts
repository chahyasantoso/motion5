import { describe, expect, it } from "vitest";
import { authorsConstrainingJoint, classifyJoint } from "../../../src/contract/solver-constraints";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";

// The load rules of 3D joint limits (issue #500 phase 6, ADR-123): which authored joints load, what
// each refusal names, where a joint key may sit, and that the joint a member authored is what the
// load-time strategy reads. The runtime half is `unit/plugins/ik3d-constraint.test.ts`.

type Values = Readonly<Record<string, unknown>>;

type MemberOptions = {
  /** `fk3d.values` on member `a`, the parent of the two-bone rig. */
  readonly a?: Values;
  /** `fk3d.values` on member `b`, the addressed leaf. */
  readonly b?: Values;
  /** Extra groups on member `a`, beside its `fk3d` group. */
  readonly aGroups?: Readonly<Record<string, unknown>>;
  /** Member `a` binds no solver when false, so nothing it authors reaches a solve. */
  readonly aBindsSolver?: boolean;
  /** Extra tracks, for a node that is no member at all. */
  readonly extra?: readonly TrackDefinition[];
};

function rig(options: MemberOptions = {}): ProjectDefinition {
  const member = (
    id: string,
    base: string,
    values: Values | undefined,
    solver: boolean,
    groups: Readonly<Record<string, unknown>> = {},
  ): TrackDefinition =>
    ({
      id,
      keyframes: {
        fk3d: {
          values: { length: 30, ...values },
          requires: solver ? { base, solver: "solve" } : { base },
        },
        ...groups,
      },
    }) as TrackDefinition;
  const tracks: TrackDefinition[] = [
    { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
    { id: "goal", keyframes: { transform3d: { values: { x: 40, y: 20, z: 10 } } } },
    {
      id: "solve",
      keyframes: { ik3d: { requires: { root: "root", targets: { b: "goal" } } } },
    } as TrackDefinition,
    member("a", "root", options.a, options.aBindsSolver ?? true, options.aGroups),
    member("b", options.aBindsSolver === false ? "root" : "a", options.b, true),
    ...(options.extra ?? []),
  ];
  return {
    schemaVersion: 5,
    projectId: "joint-load",
    motions: [{ id: "rig", trigger: { type: "manual" }, tracks }],
  };
}

function rules(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function messages(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map(({ message }) => message);
}

const AT_A = "rig/a.keyframes.fk3d.values";

describe("3D joint load rules", () => {
  it("TH-89 every well-formed joint of every kind loads, on either member, and nothing else is read", () => {
    const valid: readonly Values[] = [
      {},
      { joint: "free" },
      { joint: "hinge" },
      { joint: "hinge", minRotation: -30 },
      { joint: "hinge", axisX: 0, axisY: 1, axisZ: 0, minRotation: -30, maxRotation: 60 },
      { joint: "hinge", axisX: 2, minRotation: 45, maxRotation: 45 },
      { joint: "cone", maxSwing: 0 },
      { joint: "cone", maxSwing: 180 },
      { joint: "swing-twist", maxSwing: 30 },
      { joint: "swing-twist", maxSwing: 30, minTwist: -15, maxTwist: 15 },
      { joint: "swing-twist", maxSwing: 30, maxTwist: -180 },
    ];
    for (const values of valid) {
      expect(rules(rig({ a: values }))).toEqual([]);
      expect(rules(rig({ b: values }))).toEqual([]);
    }
  });

  it("TH-90 ik-joint-malformed names a joint that is not one static kind, a bad axis and a missing maxSwing", () => {
    for (const joint of ["Hinge", "ball", "", 1, true, null, { kind: "hinge" }])
      expect(rules(rig({ a: { joint } }))).toEqual([`ik-joint-malformed at ${AT_A}.joint`]);
    // A keyframed joint would be an animated constraint kind; it is refused like a bad name.
    const keyframed = [
      { p: 0, v: "hinge" },
      { p: 1, v: "cone" },
    ];
    expect(rules(rig({ a: { joint: keyframed } }))).toEqual([
      `ik-joint-malformed at ${AT_A}.joint`,
    ]);
    expect(messages(rig({ a: { joint: "ball" } }))).toEqual([
      'Member "rig/a" has a malformed joint; use one static "free", "hinge", "cone", "swing-twist".',
    ]);
    for (const axisY of [Number.NaN, Number.POSITIVE_INFINITY, "1", [{ p: 0, v: 1 }]])
      expect(rules(rig({ a: { joint: "hinge", axisY } }))).toEqual([
        `ik-joint-malformed at ${AT_A}.axisY`,
      ]);
    // An authored axis with no direction names no hinge; the first authored component is cited.
    expect(rules(rig({ a: { joint: "hinge", axisY: 0, axisZ: 0 } }))).toEqual([
      `ik-joint-malformed at ${AT_A}.axisY`,
    ]);
    expect(messages(rig({ a: { joint: "hinge", axisX: 0 } }))).toEqual([
      'Member "rig/a" has a hinge axis with no direction; author a nonzero axisX, axisY or axisZ.',
    ]);
    for (const joint of ["cone", "swing-twist"]) {
      expect(rules(rig({ a: { joint } }))).toEqual([`ik-joint-malformed at ${AT_A}.joint`]);
      expect(messages(rig({ a: { joint } }))).toEqual([
        `Member "rig/a" declares joint "${joint}" without maxSwing; a ${joint} joint needs one static number in [0, 180].`,
      ]);
    }
  });

  it("TH-91 every angle bound reuses ik-limit-malformed and ik-limit-empty, twist and swing among them", () => {
    for (const maxSwing of [-1, 181, Number.NaN, "30", [{ p: 0, v: 10 }]])
      expect(rules(rig({ a: { joint: "cone", maxSwing } }))).toEqual([
        `ik-limit-malformed at ${AT_A}.maxSwing`,
      ]);
    expect(messages(rig({ a: { joint: "cone", maxSwing: 200 } }))).toEqual([
      'Member "rig/a" has a malformed maxSwing; use one static number in [0, 180].',
    ]);
    for (const key of ["minRotation", "maxRotation"])
      expect(rules(rig({ a: { joint: "hinge", [key]: 181 } }))).toEqual([
        `ik-limit-malformed at ${AT_A}.${key}`,
      ]);
    for (const key of ["minTwist", "maxTwist"]) {
      expect(rules(rig({ a: { joint: "swing-twist", maxSwing: 10, [key]: -190 } }))).toEqual([
        `ik-limit-malformed at ${AT_A}.${key}`,
      ]);
      expect(
        messages(rig({ a: { joint: "swing-twist", maxSwing: 10, [key]: [{ p: 0, v: 0 }] } })),
      ).toEqual([`Member "rig/a" has a malformed ${key}; use one static number in [-180, 180].`]);
    }
    expect(rules(rig({ a: { joint: "hinge", minRotation: 40, maxRotation: -40 } }))).toEqual([
      `ik-limit-empty at ${AT_A}.minRotation`,
    ]);
    expect(
      rules(rig({ a: { joint: "swing-twist", maxSwing: 10, minTwist: 5, maxTwist: -5 } })),
    ).toEqual([`ik-limit-empty at ${AT_A}.minTwist`]);
    expect(messages(rig({ a: { joint: "hinge", minRotation: 40, maxRotation: -40 } }))).toEqual([
      'Member "rig/a" has an empty angle limit range [40, -40].',
    ]);
    // Each range is judged once, by the joint owner: the 2D rule stays silent under `fk3d`.
    expect(rules(rig({ a: { joint: "hinge", minRotation: "x" } }))).toHaveLength(1);
  });

  it("TH-92 ik-joint-key-unused names a bound the declared kind does not read, before judging any bound", () => {
    const unused = (values: Values, key: string) =>
      expect(rules(rig({ a: values }))).toEqual([`ik-joint-key-unused at ${AT_A}.${key}`]);
    // The 2D habit: a range with no joint is not guessed to be a hinge.
    unused({ minRotation: -30, maxRotation: 30 }, "minRotation");
    unused({ maxRotation: 30 }, "maxRotation");
    unused({ joint: "free", maxSwing: 30 }, "maxSwing");
    unused({ axisZ: 1 }, "axisZ");
    unused({ joint: "hinge", maxSwing: 30 }, "maxSwing");
    unused({ joint: "hinge", minTwist: 0 }, "minTwist");
    unused({ joint: "cone", maxSwing: 30, axisX: 1 }, "axisX");
    unused({ joint: "cone", maxSwing: 30, maxTwist: 10 }, "maxTwist");
    unused({ joint: "cone", maxSwing: 30, minRotation: 0 }, "minRotation");
    unused({ joint: "swing-twist", maxSwing: 30, maxRotation: 0 }, "maxRotation");
    // Unused is reported before a read bound is judged, and before a missing one is asked for.
    unused({ joint: "cone", axisX: "bad", maxSwing: 999 }, "axisX");
    unused({ joint: "cone", minTwist: 0 }, "minTwist");
    expect(messages(rig({ a: { joint: "cone", maxSwing: 30, axisY: 1 } }))).toEqual([
      'Member "rig/a" authors axisY, which a cone joint does not read; declare the joint that reads it or remove it.',
    ]);
  });

  it("TH-93 a joint key reaches the solve only from the joint group that bound it, and is refused elsewhere on a member", () => {
    // Under an `fk3d` group that bound no solver every joint key is `ik-limit-without-solver`, each
    // exactly once: the 2D range keys by the 2D placement rule, the joint-only keys by the joint's.
    const unbound = {
      joint: "hinge",
      axisX: 1,
      minRotation: 0,
      maxRotation: 10,
      maxSwing: 5,
      minTwist: 0,
      maxTwist: 1,
    };
    expect([...rules(rig({ a: unbound, aBindsSolver: false }))].sort()).toEqual(
      Object.keys(unbound)
        .map((key) => `ik-limit-without-solver at ${AT_A}.${key}`)
        .sort(),
    );
    // On a 3D member, a joint key under another group reaches the solve through the flattened
    // values all the same, so it is refused there rather than steering an unvalidated joint.
    expect(rules(rig({ aGroups: { spring: { values: { joint: "hinge" } } } }))).toEqual([
      "ik-limit-without-solver at rig/a.keyframes.spring.values.joint",
    ]);
    expect(rules(rig({ aGroups: { spring: { values: { maxSwing: 10, axisX: 1 } } } }))).toEqual([
      "ik-limit-without-solver at rig/a.keyframes.spring.values.axisX",
      "ik-limit-without-solver at rig/a.keyframes.spring.values.maxSwing",
    ]);
    // On a node that is no 3D member the same words are another plugin's own keys, the registry's
    // question and not this rule's.
    const door: TrackDefinition = {
      id: "door",
      keyframes: { spring: { values: { joint: "hinge", axisY: 1, maxSwing: 90 } } },
    } as TrackDefinition;
    expect(rules(rig({ extra: [door] }))).toEqual([]);
    // A 2D member's range keeps its 2D meaning and its 2D rules.
    const planar: TrackDefinition = {
      id: "planar",
      keyframes: { fk: { values: { length: 5, minRotation: 40, maxRotation: -40 } } },
    } as TrackDefinition;
    expect(rules(rig({ extra: [planar] }))).toEqual([
      "ik-limit-without-solver at rig/planar.keyframes.fk.values.maxRotation",
      "ik-limit-without-solver at rig/planar.keyframes.fk.values.minRotation",
    ]);
  });

  it("TH-94 the joint a member authored is what the load-time strategy reads, and only a constraining one", () => {
    // A rest orientation with no weight is dead under the closed form (ADR-122) and live under 3D
    // FABRIK, and a constraining joint sends a two-bone rig to FABRIK: so the same rest refusal is
    // withdrawn exactly when some member constrains, on either member, and kept for a free joint.
    const rest = { rotationY: 30 };
    expect(rules(rig({ a: rest }))).toEqual(["ik-solved-rotation-dead at rig/a"]);
    expect(rules(rig({ a: { ...rest, joint: "free" } }))).toEqual([
      "ik-solved-rotation-dead at rig/a",
    ]);
    for (const joint of [
      { joint: "hinge" },
      { joint: "cone", maxSwing: 45 },
      { joint: "swing-twist", maxSwing: 45 },
    ]) {
      expect(rules(rig({ a: { ...rest, ...joint } }))).toEqual([]);
      expect(rules(rig({ a: rest, b: joint }))).toEqual([]);
    }
    // The reader behind it: a static constraining kind under a group that bound the solver.
    const keyframes = (group: string, joint: unknown) => ({ [group]: { values: { joint } } });
    expect(authorsConstrainingJoint(keyframes("fk3d", "cone"), ["fk3d"])).toBe(true);
    expect(authorsConstrainingJoint(keyframes("fk3d", "free"), ["fk3d"])).toBe(false);
    expect(authorsConstrainingJoint(keyframes("fk3d", "ball"), ["fk3d"])).toBe(false);
    expect(authorsConstrainingJoint(keyframes("fk3d", [{ p: 0, v: "hinge" }]), ["fk3d"])).toBe(
      false,
    );
    expect(authorsConstrainingJoint(keyframes("spring", "hinge"), ["fk3d"])).toBe(false);
    expect(authorsConstrainingJoint({}, ["fk3d"])).toBe(false);
    // And the classifier's closed answer for the one spelling each arm names.
    expect(classifyJoint({})).toEqual({ kind: "valid", joint: "free" });
    expect(classifyJoint({ joint: "cone" })).toEqual({
      kind: "missing",
      joint: "cone",
      key: "maxSwing",
    });
    expect(classifyJoint({ joint: "hinge", axisZ: 0 })).toEqual({ kind: "zero-axis" });
    expect(classifyJoint({ joint: "swing-twist", maxSwing: 1, minTwist: 2, maxTwist: 1 })).toEqual({
      kind: "empty",
      key: "minTwist",
      min: 2,
      max: 1,
    });
  });
});
