import {
  composeFrame2D,
  exactFrameEquals,
  lerpAngleDegrees,
  ORIGIN_FRAME,
  segmentExtent,
  type Frame2D,
  type LocalTransform2D,
} from "../../src/contract/numerics";

/** Authored entry definition under skeldata singleton-map schema. */
export interface AuthoredSkelEntry {
  readonly [entryId: string]: {
    readonly plugin: string;
    readonly values?: Readonly<Record<string, unknown>>;
    readonly requires?: Readonly<Record<string, unknown>>;
  };
}

export interface AuthoredSkelTrack {
  readonly id: string;
  readonly keyframes: readonly AuthoredSkelEntry[];
}

export interface ExpectedPointTopology {
  readonly pointId: string;
  readonly parentPointId: string | null;
  readonly length: number;
  readonly restRotation: number;
}

/** 1. Single-point FK: Minimal valid skeleton */
export const onePointFkFixture = {
  track: {
    id: "singlePoint",
    keyframes: [
      { root: { plugin: "root", values: { x: 10, y: 20, rotation: 0 } } },
      { p1: { plugin: "point", values: { length: 15, rotation: 45 } } },
    ],
  },
  expected: {
    topologyRootPointId: "p1",
    anchoredRootFrame: { x: 10, y: 20, rotation: 0 },
    tipFrame: composeFrame2D(
      { x: 10, y: 20, rotation: 0 },
      { pivotX: 0, pivotY: 0, rotation: 45, extent: 15 },
    ),
  },
} as const;

/** 2. FK-only rootless chain: Root defaults to origin */
export const fkOnlyChainFixture = {
  track: {
    id: "armChain",
    keyframes: [
      { shoulder: { plugin: "point", values: { length: 20, rotation: 30 } } },
      { elbow: { plugin: "point", values: { length: 15, rotation: 45 } } },
      { wrist: { plugin: "point", values: { length: 10, rotation: -15 } } },
    ],
  },
  expectedTopology: [
    { pointId: "shoulder", parentPointId: null, length: 20, restRotation: 30 },
    { pointId: "elbow", parentPointId: "shoulder", length: 15, restRotation: 45 },
    { pointId: "wrist", parentPointId: "elbow", length: 10, restRotation: -15 },
  ] as readonly ExpectedPointTopology[],
} as const;

/** 3. Rooted chain with root entry placed at non-zero index */
export const rootedChainFixture = {
  // Variant A: Root at beginning
  rootFirst: {
    id: "rootedA",
    keyframes: [
      { world: { plugin: "root", values: { x: 50, y: 100, rotation: 90 } } },
      { bone1: { plugin: "point", values: { length: 30, rotation: 0 } } },
      { bone2: { plugin: "point", values: { length: 20, rotation: 0 } } },
    ],
  },
  // Variant B: Root at end (position-independent)
  rootLast: {
    id: "rootedB",
    keyframes: [
      { bone1: { plugin: "point", values: { length: 30, rotation: 0 } } },
      { bone2: { plugin: "point", values: { length: 20, rotation: 0 } } },
      { world: { plugin: "root", values: { x: 50, y: 100, rotation: 90 } } },
    ],
  },
  expectedRoot: { x: 50, y: 100, rotation: 90 },
} as const;

/** 4. Torso with two arms joined tree */
export const torsoTwoArmsJoinedFixture = {
  torsoPts: {
    id: "torsoPts",
    keyframes: [
      { pelvis: { plugin: "point", values: { length: 40, rotation: 0 } } },
      { chest: { plugin: "point", values: { length: 30, rotation: 0 } } },
    ],
  },
  leftArmPts: {
    id: "leftArmPts",
    keyframes: [
      { lUpper: { plugin: "point", values: { length: 25, rotation: 45 } } },
      { lFore: { plugin: "point", values: { length: 20, rotation: -20 } } },
    ],
  },
  rightArmPts: {
    id: "rightArmPts",
    keyframes: [
      { rUpper: { plugin: "point", values: { length: 25, rotation: -45 } } },
      { rFore: { plugin: "point", values: { length: 20, rotation: 20 } } },
    ],
  },
  rig: {
    id: "rig",
    keyframes: [
      { world: { plugin: "root", values: { x: 100, y: 200, rotation: 0 } } },
      { trunk: { plugin: "join", requires: { chain: "~/torsoPts" } } },
      { left: { plugin: "join", requires: { chain: "~/leftArmPts", parent: "~/torsoPts" } } },
      { right: { plugin: "join", requires: { chain: "~/rightArmPts", parent: "~/torsoPts" } } },
    ],
  },
  expectedTopology: {
    topologyRootJoin: "trunk",
    points: ["pelvis", "chest", "lUpper", "lFore", "rUpper", "rFore"],
    leaves: ["lFore", "rFore"],
    attachments: [
      { childPoint: "lUpper", parentPoint: "chest" },
      { childPoint: "rUpper", parentPoint: "chest" },
    ],
  },
} as const;

/** 5. Constrained multi-goal solve fixture */
export const constrainedMultiGoalSolveFixture = {
  skeletonRef: "~/rig",
  ikSolve: {
    id: "spineSolve",
    keyframes: [
      {
        solve: {
          plugin: "ik",
          values: { flip: false, inspect: true },
          requires: {
            skeleton: "~/rig",
            targets: { lFore: "~/goalL", rFore: "~/goalR" },
          },
        },
      },
    ],
  },
  fkPose: {
    id: "pose",
    keyframes: [
      {
        pose: {
          plugin: "fk",
          requires: {
            skeleton: "~/rig",
            solver: "~/spineSolve",
          },
        },
      },
    ],
  },
} as const;

/** Minimal invalid variants for negative invariant testing */
export const invalidVariants = {
  duplicateEntryIds: {
    id: "bad1",
    keyframes: [
      { bone1: { plugin: "point", values: { length: 10 } } },
      { bone1: { plugin: "point", values: { length: 20 } } },
    ],
    rule: "duplicate-entry-id",
  },
  multipleTopologyRoots: {
    id: "bad2",
    keyframes: [
      { j1: { plugin: "join", requires: { chain: "~/c1" } } },
      { j2: { plugin: "join", requires: { chain: "~/c2" } } }, // lacks parent
    ],
    rule: "multiple-topology-roots",
  },
  rootNotFirstAmongJoins: {
    id: "bad3",
    keyframes: [
      { j1: { plugin: "join", requires: { chain: "~/c1", parent: "~/c0" } } }, // first join has parent
      { j2: { plugin: "join", requires: { chain: "~/c2" } } },
    ],
    rule: "root-not-first-join",
  },
  missingParentJoin: {
    id: "bad4",
    keyframes: [
      { j1: { plugin: "join", requires: { chain: "~/c1" } } },
      { j2: { plugin: "join", requires: { chain: "~/c2", parent: "~/nonexistent" } } },
    ],
    rule: "missing-parent-chain",
  },
  forwardParentJoin: {
    id: "bad5",
    keyframes: [
      { j1: { plugin: "join", requires: { chain: "~/c1", parent: "~/c2" } } }, // c2 appears later
      { j2: { plugin: "join", requires: { chain: "~/c2" } } },
    ],
    rule: "forward-parent-chain",
  },
  repeatedChain: {
    id: "bad6",
    keyframes: [
      { j1: { plugin: "join", requires: { chain: "~/c1" } } },
      { j2: { plugin: "join", requires: { chain: "~/c1", parent: "~/c1" } } }, // c1 repeated
    ],
    rule: "repeated-chain-import",
  },
  emptyChain: {
    id: "bad7",
    keyframes: [],
    rule: "empty-chain",
  },
  rootedImportedChain: {
    id: "bad8Chain",
    keyframes: [
      { world: { plugin: "root", values: { x: 0, y: 0, rotation: 0 } } },
      { pt: { plugin: "point", values: { length: 10 } } },
    ],
    rule: "rooted-imported-chain-forbidden",
  },
  duplicateFrameRoot: {
    id: "bad9",
    keyframes: [
      { r1: { plugin: "root", values: { x: 0, y: 0, rotation: 0 } } },
      { r2: { plugin: "root", values: { x: 10, y: 10, rotation: 0 } } },
      { pt: { plugin: "point", values: { length: 10 } } },
    ],
    rule: "duplicate-frame-root",
  },
  missingGoalForLeaf: {
    id: "bad10Solve",
    keyframes: [
      {
        solve: {
          plugin: "ik",
          requires: {
            skeleton: "~/rig",
            targets: { lFore: "~/goalL" }, // rFore goal missing
          },
        },
      },
    ],
    rule: "ik-missing-leaf-goal",
  },
} as const;

/** Simple, uncached, pure mathematical reference FK oracle. */
export function simpleUncachedFkOracle(
  root: Frame2D,
  points: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly pivotX?: number;
    readonly pivotY?: number;
    readonly length: number;
    readonly rotation: number;
    readonly solvedRotation?: number;
    readonly weight?: number;
  }[],
): ReadonlyMap<string, Frame2D> {
  const poses = new Map<string, Frame2D>();

  for (const pt of points) {
    const parentFrame = pt.parentId === null ? root : (poses.get(pt.parentId) ?? root);
    const weight = pt.weight !== undefined ? Math.max(0, Math.min(1, pt.weight)) : 1;
    const effectiveAngle =
      pt.solvedRotation === undefined
        ? pt.rotation
        : lerpAngleDegrees(pt.rotation, pt.solvedRotation, weight);

    const local: LocalTransform2D = {
      pivotX: pt.pivotX ?? 0,
      pivotY: pt.pivotY ?? 0,
      rotation: effectiveAngle,
      extent: segmentExtent(pt.length),
    };

    const tip = composeFrame2D(parentFrame, local);
    poses.set(pt.id, tip);
  }

  return poses;
}

export interface GeneratedNode {
  readonly id: string;
  readonly parentId: string | null;
  readonly length: number;
  readonly rotation: number;
}

/** Deterministic pseudo-random number generator for seeded test fixture generation. */
function createSeededRng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Generates a reproducible, bounded, valid skeleton chain for testing. */
export function generateValidChain(seed: number, pointCount: number): readonly GeneratedNode[] {
  const rng = createSeededRng(seed);
  const nodes: GeneratedNode[] = [];

  for (let i = 0; i < pointCount; i++) {
    const id = `pt_${i}`;
    const parentId = i === 0 ? null : `pt_${i - 1}`;
    // Lengths in [5, 50], rotations in [-90, 90]
    const length = 5 + Math.floor(rng() * 45);
    const rotation = -90 + Math.floor(rng() * 180);
    nodes.push({ id, parentId, length, rotation });
  }

  return Object.freeze(nodes);
}
