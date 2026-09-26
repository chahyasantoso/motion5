import { ENVELOPE_RIGS, ENVELOPE_SEGMENT, envelopeRandom } from "./ik-envelope";
import { axisX3, matrixFromEuler3d } from "../../src/plugins/frame3d";
import type { Euler3d, Vec3, WorldFrame3d } from "../../src/plugins/frame3d";
import type { ChainShape3d } from "../../src/plugins/ik3d-solve";
import type { ChainMember3d } from "../../src/plugins/ik3d-chain";

/** The closed set of 3D performance scenarios for issue #500 phase 5. */
export type Envelope3dScenarioId =
  | "two-bone"
  | "chain-8"
  | "chain-32"
  | "chain-64"
  | "tree-14"
  | "tree-14-conflicting";

/** One deterministic 3D solve input, shared by the envelope test and benchmark. */
export interface Envelope3dRig {
  readonly root: WorldFrame3d;
  readonly members: readonly ChainMember3d[];
}

/** A named scenario owns its expected shape, arity and seeded rigs. */
export interface Envelope3dScenario {
  readonly id: Envelope3dScenarioId;
  readonly shape: ChainShape3d["kind"];
  readonly members: number;
  readonly rigs: readonly Envelope3dRig[];
}

const SEEDS: Readonly<Record<Envelope3dScenarioId, number>> = {
  "two-bone": 0x8d01,
  "chain-8": 0x8d08,
  "chain-32": 0x8d20,
  "chain-64": 0x8d40,
  "tree-14": 0x8d0f,
  "tree-14-conflicting": 0x8dcf,
};

function rootFrom(random: () => number): WorldFrame3d {
  return {
    x: -300 + 600 * random(),
    y: -300 + 600 * random(),
    z: -300 + 600 * random(),
    rotation: -360 + 720 * random(),
    rotationX: -360 + 720 * random(),
    rotationY: -360 + 720 * random(),
  };
}

function goalFrom(random: () => number, root: WorldFrame3d, reach: number): WorldFrame3d {
  const azimuth = 2 * Math.PI * random();
  const elevation = Math.asin(2 * random() - 1);
  const distance = reach * (0.1 + 0.8 * random());
  const horizontal = Math.cos(elevation) * distance;
  return {
    x: root.x + horizontal * Math.cos(azimuth),
    y: root.y + horizontal * Math.sin(azimuth),
    z: root.z + distance * Math.sin(elevation),
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
  };
}

function restFrom(random: () => number): Euler3d {
  return {
    rotation: -12 + 24 * random(),
    rotationX: -12 + 24 * random(),
    rotationY: -12 + 24 * random(),
  };
}

function chainRig(random: () => number, arity: number): Envelope3dRig {
  const root = rootFrom(random);
  const goal = goalFrom(random, root, arity * ENVELOPE_SEGMENT);
  const id = (index: number): string => `m${String(index).padStart(2, "0")}`;
  const members = Array.from({ length: arity }, (_, index): ChainMember3d => {
    const member: ChainMember3d = {
      id: id(index),
      base: index === 0 ? "root" : id(index - 1),
      length: ENVELOPE_SEGMENT,
      offset: { x: 0, y: 0, z: 0 },
      rest: restFrom(random),
    };
    return index === arity - 1 ? { ...member, goal } : member;
  });
  return { root, members };
}

function directionInHemisphere(random: () => number, around: Vec3): Vec3 {
  const azimuth = 2 * Math.PI * random();
  const elevation = Math.asin(random());
  const local: Vec3 = [
    Math.cos(elevation) * Math.cos(azimuth),
    Math.cos(elevation) * Math.sin(azimuth),
    Math.sin(elevation),
  ];
  const tangent: Vec3 = Math.abs(around[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const side: Vec3 = [
    around[1] * tangent[2] - around[2] * tangent[1],
    around[2] * tangent[0] - around[0] * tangent[2],
    around[0] * tangent[1] - around[1] * tangent[0],
  ];
  const sideLength = Math.hypot(side[0], side[1], side[2]);
  const unitSide: Vec3 = [side[0] / sideLength, side[1] / sideLength, side[2] / sideLength];
  const unitTangent: Vec3 = [
    around[1] * unitSide[2] - around[2] * unitSide[1],
    around[2] * unitSide[0] - around[0] * unitSide[2],
    around[0] * unitSide[1] - around[1] * unitSide[0],
  ];
  return [
    around[0] * local[0] + unitSide[0] * local[1] + unitTangent[0] * local[2],
    around[1] * local[0] + unitSide[1] * local[1] + unitTangent[1] * local[2],
    around[2] * local[0] + unitSide[2] * local[1] + unitTangent[2] * local[2],
  ];
}

function treeRig(
  random: () => number,
  count: number,
  goals: "feasible" | "conflicting",
): Envelope3dRig {
  const root = rootFrom(random);
  const id = (index: number): string => `n${String(index).padStart(2, "0")}`;
  const parentOf = (index: number): number | undefined =>
    index < 2 ? undefined : (index - 2) >> 1;
  const depthOf = (index: number): number => Math.floor(Math.log2(index + 2));
  const direction: Vec3[] = [];
  const tip: Vec3[] = [];
  const rootDirection = axisX3(matrixFromEuler3d(root));
  for (let index = 0; index < count; index += 1) {
    const parent = parentOf(index);
    const baseDirection = parent === undefined ? rootDirection : direction[parent]!;
    const base = parent === undefined ? [root.x, root.y, root.z] : tip[parent]!;
    direction[index] = directionInHemisphere(random, baseDirection);
    tip[index] = [
      base[0] + ENVELOPE_SEGMENT * direction[index]![0],
      base[1] + ENVELOPE_SEGMENT * direction[index]![1],
      base[2] + ENVELOPE_SEGMENT * direction[index]![2],
    ];
  }
  const members = Array.from({ length: count }, (_, index): ChainMember3d => {
    const parent = parentOf(index);
    const member: ChainMember3d = {
      id: id(index),
      base: parent === undefined ? "root" : id(parent),
      length: ENVELOPE_SEGMENT,
      offset: { x: 0, y: 0, z: 0 },
      rest: restFrom(random),
    };
    if (2 * index + 2 < count) return member;
    const goal =
      goals === "feasible"
        ? {
            x: tip[index]![0],
            y: tip[index]![1],
            z: tip[index]![2],
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
          }
        : goalFrom(random, root, depthOf(index) * ENVELOPE_SEGMENT);
    return { ...member, goal };
  });
  return { root, members };
}

/**
 * Builds the same seeded rigs for the behavioral envelope and its wall-clock reader.
 *
 * The 2D generator owns the segment size, stream and default rig count. Reusing those exports keeps
 * the two dimensions' envelope conventions aligned without making the 2D fixture a 3D owner.
 */
export function envelope3dScenarios(rigs = ENVELOPE_RIGS): readonly Envelope3dScenario[] {
  const build = (
    id: Envelope3dScenarioId,
    shape: ChainShape3d["kind"],
    members: number,
    make: (random: () => number) => Envelope3dRig,
  ): Envelope3dScenario => {
    const random = envelopeRandom(SEEDS[id]);
    return { id, shape, members, rigs: Array.from({ length: rigs }, () => make(random)) };
  };
  return [
    build("two-bone", "two-bone", 2, (random) => chainRig(random, 2)),
    build("chain-8", "tree", 8, (random) => chainRig(random, 8)),
    build("chain-32", "tree", 32, (random) => chainRig(random, 32)),
    build("chain-64", "tree", 64, (random) => chainRig(random, 64)),
    build("tree-14", "tree", 14, (random) => treeRig(random, 14, "feasible")),
    build("tree-14-conflicting", "tree", 14, (random) => treeRig(random, 14, "conflicting")),
  ];
}
