import { describe, expect, it } from "vitest";
import {
  derivedStrategy,
  poleBends,
  readsMemberRest,
  solverChainShape,
  type DerivedChainMember,
} from "../../../src/contract/solver-shape";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";
import { readFrame3d, ZERO_EULER, type Euler3d } from "../../../src/plugins/frame3d";
import { UNBOUND_POLE3D, readPole3d } from "../../../src/plugins/ik3d-analytic";
import type { ChainMember3d } from "../../../src/plugins/ik3d-chain";
import { chainShape3d, solveChain3d } from "../../../src/plugins/ik3d-solve";

// Two load rules phase 5's tree shape made wrong or missing, both read from the derived chain
// through `contract/solver-shape.ts`: a rest orientation the tree solve reads is live input, and a
// pole over a chain with no interior joint bends nothing. See ADR-122.

type Topology = Readonly<Record<string, string>>;

const SERIAL3: Topology = { a: "root", b: "a", c: "b" };
const FORK: Topology = { a: "root", b: "a", c: "a" };
const TWO_BONE: Topology = { a: "root", b: "a" };
const SINGLE: Topology = { a: "root" };
const FAN: Topology = { a: "root", b: "root" };
const MIXED: Topology = { a: "root", b: "root", c: "b" };

function leavesOf(topology: Topology): readonly string[] {
  const bases = new Set(Object.values(topology));
  return Object.keys(topology).filter((id) => !bases.has(id));
}

function rig(
  topology: Topology,
  options: {
    readonly rest?: Readonly<Record<string, number>>;
    readonly pole?: boolean;
    readonly restOn?: string;
  } = {},
): ProjectDefinition {
  const leaves = leavesOf(topology);
  const targets = Object.fromEntries(leaves.map((leaf) => [leaf, `goal-${leaf}`]));
  const tracks: TrackDefinition[] = [
    { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
    { id: "knee", keyframes: { transform3d: { values: { x: 0, y: 100, z: 0 } } } },
    ...leaves.map(
      (leaf, index): TrackDefinition => ({
        id: `goal-${leaf}`,
        keyframes: { transform3d: { values: { x: 40 + 10 * index, y: 20, z: 30 - 15 * index } } },
      }),
    ),
    {
      id: "solve",
      keyframes: {
        ik3d: {
          requires: { root: "root", targets, ...(options.pole === true ? { pole: "knee" } : {}) },
        },
      },
    } as TrackDefinition,
    ...Object.entries(topology).map(
      ([id, base]): TrackDefinition =>
        ({
          id,
          keyframes: {
            fk3d: {
              values: { length: 30, ...(id === (options.restOn ?? "a") ? options.rest : {}) },
              requires: { base, solver: "solve" },
            },
          },
        }) as TrackDefinition,
    ),
  ];
  return {
    schemaVersion: 5,
    projectId: "tree-load",
    motions: [{ id: "rig", trigger: { type: "manual" }, tracks }],
  };
}

function rules(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

function depthsOf(topology: Topology): readonly DerivedChainMember[] {
  return Object.keys(topology).map((id) => {
    let depth = 0;
    for (let cursor = id; cursor !== "root"; cursor = topology[cursor]!) depth += 1;
    return { depth, plugins: ["fk3d"] };
  });
}

function members3d(topology: Topology, rest: Euler3d = ZERO_EULER): readonly ChainMember3d[] {
  const leaves = new Set(leavesOf(topology));
  return Object.entries(topology).map(([id, base], index) => ({
    id,
    base,
    length: 30,
    offset: { x: 0, y: 0, z: 0 },
    rest: id === "a" ? rest : ZERO_EULER,
    ...(leaves.has(id) ? { goal: readFrame3d({ x: 40 + 10 * index, y: 20, z: 30 - index }) } : {}),
  }));
}

/** Every rooted forest over `count` labelled members: member i hangs from root or an earlier one. */
function forests(count: number): readonly Topology[] {
  const ids = Array.from({ length: count }, (_, index) => `m${index}`);
  let out: Record<string, string>[] = [{}];
  for (const [index, id] of ids.entries()) {
    const next: Record<string, string>[] = [];
    for (const partial of out)
      for (const base of ["root", ...ids.slice(0, index)]) next.push({ ...partial, [id]: base });
    out = next;
  }
  return out;
}

describe("3D tree load rules", () => {
  it("TH-76 the load-time strategy agrees with the runtime dispatcher on every forest up to five members", () => {
    const tree = solverChainShape("ik3d");
    let compared = 0;
    for (let count = 1; count <= 5; count += 1) {
      for (const topology of forests(count)) {
        const atLoad = derivedStrategy(tree, depthsOf(topology));
        const atRun = chainShape3d(members3d(topology)).kind;
        expect(atLoad).toBe(atRun === "two-bone" ? "closed-form" : "iterative");
        compared += 1;
      }
    }
    expect(compared).toBe(1 + 2 + 6 + 24 + 120);
    // The 2D solve reads no rest on any path, so `any` is never the closed-form answer to this.
    expect(derivedStrategy(solverChainShape("ik"), depthsOf(TWO_BONE))).toBe("iterative");
    expect(readsMemberRest(solverChainShape("ik"), depthsOf(SERIAL3))).toBe(false);
  });

  it("TH-77 a rest orientation with no weight is live under the tree solve and dead under the closed form", () => {
    for (const key of ["rotation", "rotationX", "rotationY"]) {
      for (const topology of [SINGLE, SERIAL3, FORK, FAN])
        expect(rules(rig(topology, { rest: { [key]: 30 } }))).toEqual([]);
      expect(rules(rig(TWO_BONE, { rest: { [key]: 30 } }))).toEqual([
        "ik-solved-rotation-dead at rig/a",
      ]);
    }
    // A leaf's rest is read exactly as a root member's is.
    expect(rules(rig(SERIAL3, { rest: { rotationY: 15 }, restOn: "c" }))).toEqual([]);
    // Live is measured, not asserted: the tree solve's triples move with the authored rest.
    for (const topology of [SINGLE, SERIAL3, FORK]) {
      const plain = solveChain3d(readFrame3d({}), members3d(topology));
      const turned = solveChain3d(
        readFrame3d({}),
        members3d(topology, { rotation: 90, rotationX: 0, rotationY: 0 }),
      );
      expect(turned.rotations3d).not.toEqual(plain.rotations3d);
    }
    // And dead is measured too: the closed form publishes the same triples whatever the rest.
    const closedPlain = solveChain3d(readFrame3d({}), members3d(TWO_BONE));
    const closedTurned = solveChain3d(
      readFrame3d({}),
      members3d(TWO_BONE, { rotation: 90, rotationX: 10, rotationY: -20 }),
    );
    expect(closedTurned).toEqual(closedPlain);
  });

  it("TH-78 a pole over a chain with no interior joint is ik-pole-without-bend, and only there", () => {
    const refusal = "ik-pole-without-bend at rig/solve.keyframes.ik3d.requires.pole";
    expect(rules(rig(SINGLE, { pole: true }))).toEqual([refusal]);
    expect(rules(rig(FAN, { pole: true }))).toEqual([refusal]);
    for (const topology of [TWO_BONE, SERIAL3, FORK, MIXED])
      expect(rules(rig(topology, { pole: true }))).toEqual([]);
    for (const topology of [SINGLE, FAN]) expect(rules(rig(topology))).toEqual([]);
    expect(poleBends(depthsOf(FAN))).toBe(false);
    expect(poleBends(depthsOf(MIXED))).toBe(true);
    // The refusal is measured: over a fan, two opposite poles publish byte-identical solves.
    const up = readPole3d({ x: 0, y: 100, z: 0 });
    const down = readPole3d({ x: 0, y: -100, z: 50 });
    for (const topology of [SINGLE, FAN]) {
      const unbound = solveChain3d(readFrame3d({}), members3d(topology), UNBOUND_POLE3D);
      expect(solveChain3d(readFrame3d({}), members3d(topology), up)).toEqual(unbound);
      expect(solveChain3d(readFrame3d({}), members3d(topology), down)).toEqual(unbound);
    }
  });
});
