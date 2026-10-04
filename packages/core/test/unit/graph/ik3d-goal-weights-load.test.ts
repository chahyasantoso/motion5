import { describe, expect, it } from "vitest";
import type {
  AuthoredPluginRequires,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { buildGraphIR } from "../../../src/graph/ir";
import { fk3dPlugin } from "../../../../plugins/src/fk3d";
import { fkPlugin } from "../../../../plugins/src/fk";
import { ik3dPlugin } from "../../../../plugins/src/ik3d";
import { transform3dPlugin } from "../../../../plugins/src/transform3d";

// 3D goal weights at load (issue #500 phase 7, ADR-124): fk3d owns influence and orient, both are
// placed only on addressed leaves, and orient is one static finite number in [0, 1]. Runtime
// orientation and branch compromise are covered by the Engine tests in ik3d-orient.test.ts.

type Values = Readonly<Record<string, unknown>>;
type Keyframes = NonNullable<TrackDefinition["keyframes"]>;

type Options = {
  readonly a?: Values;
  readonly b?: Values;
  readonly aGroups?: Readonly<Record<string, unknown>>;
  readonly requires?: AuthoredPluginRequires;
};

function rig(options: Options = {}): ProjectDefinition {
  const member = (
    id: string,
    base: string,
    values: Values = {},
    groups: Readonly<Record<string, unknown>> = {},
  ): TrackDefinition =>
    ({
      id,
      keyframes: {
        fk3d: {
          values: { length: 30, ...values },
          requires: { base, solver: "solve" },
        },
        ...groups,
      },
    }) as TrackDefinition;
  return {
    schemaVersion: 5,
    projectId: "3d-goal-weights-load",
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
          { id: "goal", keyframes: { transform3d: { values: { x: 40, y: 20, z: 10 } } } },
          {
            id: "solve",
            keyframes: {
              ik3d: {
                requires: options.requires ?? { root: "root", targets: { b: "goal" } },
              },
            },
          },
          member("a", "root", options.a, options.aGroups),
          member("b", "a", options.b),
        ],
      },
    ],
  };
}

function diagnostics(project: ProjectDefinition) {
  return buildGraphIR(project).diagnostics;
}

function rules(project: ProjectDefinition): readonly string[] {
  return diagnostics(project).map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function messages(project: ProjectDefinition): readonly string[] {
  return diagnostics(project).map(({ message }) => message);
}

const AT_A = "rig/a.keyframes.fk3d.values";
const AT_B = "rig/b.keyframes.fk3d.values";

function registry(...plugins: readonly PluginDefinition[]) {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

describe("3D goal-weight load rules", () => {
  it("TH-102 fk3d claims influence and orient, while 2D fk does not claim orient", () => {
    const accepted = registry(transform3dPlugin, fk3dPlugin, ik3dPlugin).resolveForKeyframes({
      fk3d: { values: { influence: 2, orient: 0.5 } },
    });
    expect(accepted.diagnostics).toEqual([]);
    expect(
      registry(fkPlugin).resolveForKeyframes({ fk: { values: { orient: 0.5 } } }).diagnostics,
    ).toEqual([
      expect.objectContaining({
        ruleId: "plugin-unknown-key",
        path: "keyframes.fk.values.orient",
      }),
    ]);

    for (const orient of [0, 0.25, 1]) {
      expect(rules(rig({ b: { orient, influence: 2 } }))).toEqual([]);
      expect(messages(rig({ b: { orient, influence: 2 } }))).toEqual([]);
    }
  });

  it("TH-103 ik-orient-malformed and ik-orient-without-goal name every refused spelling exactly", () => {
    const malformed = [
      [
        { p: 0, v: 0 },
        { p: 1, v: 1 },
      ],
      -0.1,
      1.5,
      "half",
      true,
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ];
    for (const orient of malformed) {
      expect(rules(rig({ b: { orient } }))).toEqual([`ik-orient-malformed at ${AT_B}.orient`]);
      expect(messages(rig({ b: { orient } }))).toEqual([
        'Member "rig/b" has a malformed orient; use one static finite number from 0 to 1.',
      ]);
    }

    expect(rules(rig({ a: { orient: 0.5 } }))).toEqual([
      `ik-orient-without-goal at ${AT_A}.orient`,
    ]);
    expect(messages(rig({ a: { orient: 0.5 } }))).toEqual([
      'Member "rig/a" authors orient but no goal addresses it; orient weighs a goal\'s orientation and belongs on an addressed chain leaf.',
    ]);

    expect(rules(rig({ aGroups: { spring: { values: { orient: 0.5 } } } }))).toEqual([
      "ik-orient-without-goal at rig/a.keyframes.spring.values.orient",
    ]);
    expect(messages(rig({ aGroups: { spring: { values: { orient: 0.5 } } } }))).toEqual([
      'Member "rig/a" authors orient under spring, which did not bind its solver; orient weighs a goal\'s orientation and belongs on an addressed chain leaf.',
    ]);
  });

  it("TH-104 applies the same placement and ordering rules to influence and orient", () => {
    expect(rules(rig({ a: { influence: 2 } }))).toEqual([
      `ik-influence-without-goal at ${AT_A}.influence`,
    ]);
    expect(messages(rig({ a: { influence: 2 } }))).toEqual([
      'Member "rig/a" authors influence but no goal addresses it; influence weighs a goal and belongs on an addressed chain leaf.',
    ]);

    expect(rules(rig({ b: { influence: 0 } }))).toEqual([
      `ik-influence-malformed at ${AT_B}.influence`,
    ]);
    expect(messages(rig({ b: { influence: 0 } }))).toEqual([
      'Member "rig/b" has a malformed influence; use one static finite number greater than 0.',
    ]);

    expect(rules(rig({ b: { influence: 0, orient: -0.1 } }))).toEqual([
      `ik-influence-malformed at ${AT_B}.influence`,
      `ik-orient-malformed at ${AT_B}.orient`,
    ]);
    expect(messages(rig({ b: { influence: 0, orient: -0.1 } }))).toEqual([
      'Member "rig/b" has a malformed influence; use one static finite number greater than 0.',
      'Member "rig/b" has a malformed orient; use one static finite number from 0 to 1.',
    ]);

    const undecided = rig({
      b: { orient: 0.5 },
      requires: { root: "root" },
    });
    expect(rules(undecided)).toEqual(["ik-solver-no-goal at rig/solve"]);
    expect(messages(undecided)).toEqual([
      'Solver "rig/solve" has no goal; bind "target", or address a goal per chain leaf under "targets".',
    ]);
  });

  it("TH-107 refuses an fk3d goal weight on a bone no solver reads, and keeps 2D's narrowing", () => {
    const loose = (keyframes: Keyframes): ProjectDefinition => ({
      schemaVersion: 5,
      projectId: "3d-goal-weights-unsolved",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
            { id: "bone", keyframes },
          ],
        },
      ],
    });
    const fk3d = (values: Values): Keyframes => ({
      fk3d: { values: { length: 30, ...values }, requires: { base: "root" } },
    });
    const AT = "rig/bone.keyframes.fk3d.values";
    const unread = (key: string, purpose: string): string =>
      `Member "rig/bone" authors ${key} under fk3d, which did not bind its solver; ${key} ${purpose} and belongs on an addressed chain leaf.`;

    expect(rules(loose(fk3d({ orient: 0.5 })))).toEqual([`ik-orient-without-goal at ${AT}.orient`]);
    expect(messages(loose(fk3d({ orient: 0.5 })))).toEqual([
      unread("orient", "weighs a goal's orientation"),
    ]);
    // Placement before classification, so a malformed weight nothing reads is refused for where it is.
    expect(rules(loose(fk3d({ orient: 2, influence: 3 })))).toEqual([
      `ik-influence-without-goal at ${AT}.influence`,
      `ik-orient-without-goal at ${AT}.orient`,
    ]);
    expect(messages(loose(fk3d({ orient: 2, influence: 3 })))).toEqual([
      unread("influence", "weighs a goal"),
      unread("orient", "weighs a goal's orientation"),
    ]);

    // Under any other group on a node that bound no solver, this pass holds no registry and stays
    // silent, as it did before orient existed: the key may be that plugin's own live input.
    expect(
      rules(loose({ transform3d: { values: { x: 0, y: 0, z: 0, influence: 2, orient: 0.5 } } })),
    ).not.toContainEqual(expect.stringMatching(/^ik-(orient|influence)-/));
  });
});
