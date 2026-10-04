/** Issue #524, ADR-131: a reachable mixed-sign constrained chain is no longer trapped by the arc
 * seed. ADR-131 pays a centred legal start after the two arc sides; ADR-132 then pays a monotone
 * legal descent. Non-planar staged starts remain reach-gated. TH-181 and TH-182
 * fail on the pre-#524 solver: it paid no legal start in 2D or on a planar 3D rig, so every rig in
 * TH-182 ended `limited` in both dimensions at the residual its comment records. */
import { describe, expect, it } from "vitest";
import { FABRIK_TOLERANCE, solveFabrikAttempt } from "../../../../plugins/src/fabrik";
import {
  CENTRE_LEGAL_START,
  CENTRE_THEN_DESCENT,
  NO_LEGAL_STARTS,
  addressedReach,
  selectFabrik,
  type FabrikAttempt,
} from "../../../../plugins/src/fabrik-select";
import {
  heldFromSeed,
  legalFraction,
  seedLegal,
  type LegalSeed,
} from "../../../../plugins/src/fabrik-seed";
import type { WorldFrame, WorldPoint } from "../../../../plugins/src/frame";
import type { Euler3d, Vec3, WorldFrame3d } from "../../../../plugins/src/frame3d";
import { canonicalChain } from "../../../../plugins/src/ik-topology";
import {
  legalRotation,
  limitRotation,
  type JointRange,
} from "../../../../plugins/src/ik-constraint";
import type { SolveMember } from "../../../../plugins/src/ik-member";
import type { IterativeQuality } from "../../../../plugins/src/ik-result";
import { solveChain } from "../../../../plugins/src/ik-solve";
import { UNBOUND_POLE3D } from "../../../../plugins/src/ik3d-analytic";
import type { ChainMember3d } from "../../../../plugins/src/ik3d-chain";
import { legalStarts3d, solveTree3dAttempt } from "../../../../plugins/src/ik3d-fabrik";
import { solveChain3d } from "../../../../plugins/src/ik3d-solve";

const ROOT: WorldFrame = { x: 0, y: 0, rotation: 0 };
const ROOT3: WorldFrame3d = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
const ZERO_REST: Euler3d = { rotation: 0, rotationX: 0, rotationY: 0 };
const Z_AXIS: Vec3 = [0, 0, 1];
const RADIANS = Math.PI / 180;
const CENTRE: LegalSeed = { kind: "legal-range", fraction: 0.5 };

const range = (min: number, max: number): JointRange => ({ kind: "range", min, max });

/** A serial chain: a free root member, then one member per `[length, range?]`, the goal on the leaf. */
function serial(
  root: number,
  rest: readonly (readonly [number, JointRange | undefined])[],
  goal: WorldPoint,
): SolveMember[] {
  const members: SolveMember[] = [{ id: "m0", base: "root", length: root }];
  rest.forEach(([length, limit], index) =>
    members.push({
      id: `m${index + 1}`,
      base: `m${index}`,
      length,
      ...(limit === undefined ? {} : { limit }),
    }),
  );
  const leaf = members[members.length - 1]!;
  members[members.length - 1] = { ...leaf, goal: { ...goal, rotation: 0 } };
  return members;
}

/** The same rig in 3D: planar +z hinges, the 2D pivot offsets as xy offsets, the goals at z = 0. */
function planar3d(members: readonly SolveMember[]): ChainMember3d[] {
  return members.map(({ id, base, length, limit, goal, pivot }) => ({
    id,
    base,
    length,
    offset: { x: pivot?.x ?? 0, y: pivot?.y ?? 0, z: 0 },
    rest: ZERO_REST,
    ...(limit === undefined ? {} : { limit: { kind: "hinge", axis: Z_AXIS, range: limit } }),
    ...(goal === undefined ? {} : { goal: { x: goal.x, y: goal.y, z: 0, ...ZERO_REST } }),
  }));
}

/** 2D forward kinematics of published local rotations, pivot offsets included: every member's tip. */
function compose2d(members: readonly SolveMember[], rotations: Readonly<Record<string, number>>) {
  const { ids, byId } = canonicalChain(members);
  const tips = new Map<string, WorldPoint & { direction: number }>();
  for (const id of ids) {
    const member = byId.get(id)!;
    const base = tips.get(member.base) ?? { ...ROOT, direction: ROOT.rotation };
    const offset = member.pivot ?? { x: 0, y: 0 };
    const turn = base.direction * RADIANS;
    const pivotX = base.x + offset.x * Math.cos(turn) - offset.y * Math.sin(turn);
    const pivotY = base.y + offset.x * Math.sin(turn) + offset.y * Math.cos(turn);
    const direction = base.direction + rotations[id]!;
    tips.set(id, {
      x: pivotX + member.length * Math.cos(direction * RADIANS),
      y: pivotY + member.length * Math.sin(direction * RADIANS),
      direction,
    });
  }
  return tips;
}

// Mixed-sign serial reproductions from the #514 generator (rounded to 0.1). On the pre-#524 solver
// each ends `limited` in 2D and in its planar +z 3D equivalent, at residuals 5.867989776444812,
// 11.740113906608661 and 3.758063895797571 (3D equal to 1e-6): the arc bends every joint one
// way, and the ranges that demand the other way hold it on their bounds from either side.
const REPRODUCTIONS: readonly SolveMember[][] = [
  serial(
    66.6,
    [
      [99.6, range(0, 34.8)],
      [42.3, range(-88.1, -47.7)],
      [35.6, range(-47.9, 0)],
    ],
    { x: 13.7, y: -190.7 },
  ),
  serial(
    60.1,
    [
      [70.6, range(0, 89.6)],
      [71, range(-47.2, 75.5)],
      [26.8, range(-81.6, -25.4)],
    ],
    { x: 210.6, y: -33.5 },
  ),
  serial(
    21.8,
    [
      [99.7, undefined],
      [54.8, range(0, 88.5)],
      [50.7, range(-119.7, 0)],
    ],
    { x: -118.8, y: -114.8 },
  ),
];

/** A branched limited tree with pivot offsets, two goals and a member on no addressed path. */
const TREE: SolveMember[] = [
  { id: "a", base: "root", length: 40 },
  { id: "b", base: "a", length: 30, pivot: { x: 2, y: -1 }, limit: range(10, 70) },
  { id: "c", base: "b", length: 25, limit: range(-60, -20), goal: { x: 20, y: 70, rotation: 0 } },
  { id: "d", base: "a", length: 35, limit: range(-90, -30), goal: { x: 75, y: -30, rotation: 0 } },
  { id: "e", base: "a", length: 12, limit: range(5, 15) },
];

const quality = (kind: IterativeQuality["kind"], residual: number): IterativeQuality =>
  kind === "limited"
    ? { kind, iterations: 9, residual, atBound: ["m"] }
    : { kind, iterations: 9, residual };

function composePlanar3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  rotations: Readonly<Record<string, Euler3d>>,
): Map<string, WorldPoint> {
  const { ids, byId } = canonicalChain(members);
  const tips = new Map<string, WorldPoint>();
  const directions = new Map<string, number>();
  for (const id of ids) {
    const member = byId.get(id)!;
    const baseTip = tips.get(member.base) ?? { x: root.x, y: root.y };
    const baseDirection = directions.get(member.base) ?? root.rotation;
    const turn = baseDirection * RADIANS;
    const pivot = {
      x: baseTip.x + member.offset.x * Math.cos(turn) - member.offset.y * Math.sin(turn),
      y: baseTip.y + member.offset.x * Math.sin(turn) + member.offset.y * Math.cos(turn),
    };
    const direction = baseDirection + rotations[id]!.rotation;
    directions.set(id, direction);
    tips.set(id, {
      x: pivot.x + member.length * Math.cos(direction * RADIANS),
      y: pivot.y + member.length * Math.sin(direction * RADIANS),
    });
  }
  return tips;
}

function seedWorstMiss(
  members: readonly SolveMember[],
  tips: ReadonlyMap<string, WorldPoint>,
): number {
  const { leaves, byId } = canonicalChain(members);
  return Math.max(
    0,
    ...leaves.flatMap((id) => {
      const goal = byId.get(id)!.goal;
      const tip = tips.get(id);
      return goal === undefined || tip === undefined
        ? []
        : [Math.hypot(tip.x - goal.x, tip.y - goal.y)];
    }),
  );
}

/** Independent checks of a legal seed's member lengths and local constrained rotations. */
function expectLegalSeed(
  members: readonly SolveMember[],
  tips: ReadonlyMap<string, WorldPoint>,
): void {
  const { ids, byId } = canonicalChain(members);
  const directions = new Map<string, number>();
  for (const id of ids) {
    const member = byId.get(id)!;
    const baseTip = tips.get(member.base) ?? ROOT;
    const baseDirection = directions.get(member.base) ?? ROOT.rotation;
    const turn = baseDirection * RADIANS;
    const offset = member.pivot ?? { x: 0, y: 0 };
    const pivot = {
      x: baseTip.x + offset.x * Math.cos(turn) - offset.y * Math.sin(turn),
      y: baseTip.y + offset.x * Math.sin(turn) + offset.y * Math.cos(turn),
    };
    const tip = tips.get(id)!;
    expect(Math.hypot(tip.x - pivot.x, tip.y - pivot.y)).toBeCloseTo(member.length, 9);
    if (member.length > 0) {
      const direction = Math.atan2(tip.y - pivot.y, tip.x - pivot.x) / RADIANS;
      directions.set(id, direction);
      if (member.limit !== undefined) {
        const local = direction - baseDirection;
        const wrapped = local - 360 * Math.round(local / 360);
        expect(Math.abs(limitRotation(member.limit, wrapped) - wrapped)).toBeLessThanOrEqual(1e-9);
      }
    }
  }
}

const CORPUS_2D_46: SolveMember[] = [
  { id: "m0", base: "root", length: 23.03038427606225 },
  {
    id: "m1",
    base: "m0",
    length: 30.747562032192945,
    limit: range(-72.70604576915503, 0),
  },
  { id: "m2", base: "m1", length: 23.622833602130413 },
  {
    id: "m3",
    base: "m2",
    length: 67.61922193691134,
    limit: range(0, 47.781029529869556),
    goal: { x: 31.96367214849199, y: 18.467188438035187, rotation: 0 },
  },
];

const CORPUS_3D_123: ChainMember3d[] = [
  {
    id: "m0",
    base: "root",
    length: 57.72178091108799,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
  },
  {
    id: "m1",
    base: "m0",
    length: 63.89253210276365,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
  },
  {
    id: "m2",
    base: "m1",
    length: 80.38089765235782,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(-95.02608049660921, 0) },
  },
  {
    id: "m3",
    base: "m2",
    length: 93.19888856261969,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(0, 58.97718829102814) },
  },
  {
    id: "m4",
    base: "m3",
    length: 25.128877628594637,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(0, 50.92684479430318) },
    goal: {
      x: -90.01873915737744,
      y: 180.03969931052427,
      z: 0,
      ...ZERO_REST,
    },
  },
];
const ROOT3_123: WorldFrame3d = {
  x: 0,
  y: 0,
  z: 0,
  rotation: -81.0414628777653,
  rotationX: 0,
  rotationY: 0,
};

const CORPUS_3D_1046: ChainMember3d[] = [
  {
    id: "m0",
    base: "root",
    length: 27.720380537211895,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
  },
  {
    id: "m1",
    base: "m0",
    length: 90.65473213791847,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(-71.82884391397238, -4.308558804914355) },
  },
  {
    id: "m2",
    base: "m1",
    length: 96.39288689941168,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(-103.1019298452884, 0) },
  },
  {
    id: "m3",
    base: "m2",
    length: 98.79181670024991,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(0, 54.34226246550679) },
  },
  {
    id: "m4",
    base: "m3",
    length: 20.76538845896721,
    offset: { x: 0, y: 0, z: 0 },
    rest: ZERO_REST,
    limit: { kind: "hinge", axis: Z_AXIS, range: range(0, 41.78618702106178) },
    goal: { x: 247.9942498414085, y: 15.560265541183913, z: 0, ...ZERO_REST },
  },
];
const ROOT3_1046: WorldFrame3d = {
  x: 0,
  y: 0,
  z: 0,
  rotation: 94.48991848155856,
  rotationX: 0,
  rotationY: 0,
};

/** A scripted attempt: records `base`, `opposite` or `q<fraction>` and answers from `answers`. */
function scripted(calls: string[], answers: Readonly<Record<string, IterativeQuality>>) {
  const attempt: FabrikAttempt<null, never, { quality: IterativeQuality }> = (
    _root,
    _members,
    flip,
    _rule,
    seed,
  ) => {
    const name =
      seed?.kind === "legal-range"
        ? `q${seed.fraction}`
        : seed?.kind === "legal-descent"
          ? "descent"
          : flip
            ? "opposite"
            : "base";
    calls.push(name);
    return { quality: answers[name] ?? answers["base"]! };
  };
  return attempt;
}

describe("mixed-sign legal start (issue #524, ADR-131)", () => {
  it("TH-181 centre-then-descent orders base, opposite, centre, descent and stops on convergence", () => {
    const calls: string[] = [];
    for (const kind of ["limited", "iteration-cap"] as const) {
      calls.length = 0;
      const met = quality("converged", 0.0004);
      const selected = selectFabrik(
        null,
        [],
        false,
        scripted(calls, { base: quality(kind, 12), "q0.5": met }),
        CENTRE_THEN_DESCENT,
      );
      expect(calls).toEqual(["base", "opposite", "q0.5"]);
      expect(selected.quality).toBe(met);
    }
    // An opposite side that meets the goal ends the search: a legal start is a remedy for a miss.
    calls.length = 0;
    const hit = quality("converged", 0.0009);
    const opposite = selectFabrik(
      null,
      [],
      false,
      scripted(calls, { base: quality("limited", 3), opposite: hit }),
      CENTRE_THEN_DESCENT,
    );
    expect(calls).toEqual(["base", "opposite"]);
    expect(opposite.quality).toBe(hit);
    // Met, stalled and conflicted baselines pay no legal start; a conflict keeps its three arcs.
    for (const [kind, count] of [
      ["converged", 1],
      ["stalled", 1],
      ["conflicted", 4],
    ] as const) {
      calls.length = 0;
      selectFabrik(
        null,
        [],
        false,
        scripted(calls, { base: quality(kind, 2) }),
        CENTRE_THEN_DESCENT,
      );
      expect(calls).toHaveLength(count);
      expect(calls).not.toContain("q0.5");
    }
    // A rig with no legal start keeps the arc's two sides, and an exact tie keeps the earlier miss.
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      scripted(calls, { base: quality("limited", 2) }),
      NO_LEGAL_STARTS,
    );
    expect(calls).toEqual(["base", "opposite"]);
    calls.length = 0;
    const baseline = quality("limited", 2);
    const tie = selectFabrik(
      null,
      [],
      false,
      scripted(calls, {
        base: baseline,
        opposite: quality("limited", 2),
        "q0.5": quality("limited", 2),
      }),
      CENTRE_THEN_DESCENT,
    );
    expect(calls).toEqual(["base", "opposite", "q0.5", "descent"]);
    expect(tie.quality).toBe(baseline);
  });

  it("TH-182 reachable mixed-sign chains converge in 2D and planar 3D, legal and agreeing", () => {
    const issue521: SolveMember[][] = [
      [
        { id: "0", base: "root", length: 49.2, limit: range(-61.7, -5.6) },
        { id: "1", base: "0", length: 29.3 },
        { id: "2", base: "1", length: 58.1, limit: range(-87.2, 27.7) },
        { id: "3", base: "2", length: 77.6, limit: range(-109.8, -75.1) },
      ],
      [
        { id: "0", base: "root", length: 42.9 },
        { id: "1", base: "0", length: 74.6, limit: range(-164.2, -106.6) },
        { id: "2", base: "1", length: 21.7, limit: range(-34.9, -16.2) },
      ],
    ];
    issue521[0]![3] = { ...issue521[0]![3]!, goal: { x: 20.4, y: -58, rotation: 0 } };
    issue521[1]![2] = { ...issue521[1]![2]!, goal: { x: -58.3, y: -32.6, rotation: 0 } };
    for (const rig of [...REPRODUCTIONS, ...issue521]) {
      const flat = solveChain(ROOT, rig, false);
      const spatial = solveChain3d(ROOT3, planar3d(rig));
      expect(flat.quality.kind).toBe("converged");
      expect(spatial.quality.kind).toBe("converged");
      expect(flat.quality.residual).toBeCloseTo(spatial.quality.residual, 9);
      // Independent FK: the published local rotations reach the goal and honour every range.
      const tips = compose2d(rig, flat.rotations);
      const leaf = rig[rig.length - 1]!;
      const tip = tips.get(leaf.id)!;
      expect(Math.hypot(tip.x - leaf.goal!.x, tip.y - leaf.goal!.y)).toBeLessThanOrEqual(
        FABRIK_TOLERANCE,
      );
      for (const member of rig)
        if (member.limit !== undefined) {
          const local = flat.rotations[member.id]!;
          expect(Math.abs(limitRotation(member.limit, local) - local)).toBeLessThanOrEqual(1e-9);
        }
      // Deterministic: a second solve publishes the same bytes.
      expect(solveChain(ROOT, rig, false)).toEqual(flat);
    }
  });

  it("TH-183 the 2D legal seed is legal, full length and aimed, and reads a huge root as its frame", () => {
    const { ids, byId, leaves } = canonicalChain(TREE);
    const aims = new Map(
      leaves.flatMap((id) => {
        const goal = byId.get(id)!.goal;
        return goal === undefined ? [] : [[id, { x: goal.x, y: goal.y }] as const];
      }),
    );
    for (const fraction of [0.5, 0.25] as const) {
      const tips = seedLegal(ROOT, ids, byId, aims, { kind: "legal-range", fraction });
      expect([...tips.keys()]).toEqual([...ids]);
      // Read the seed back as local rotations: every limited member sits at `fraction` of its range.
      const directions = new Map<string, number>();
      for (const id of ids) {
        const member = byId.get(id)!;
        const baseTip = tips.get(member.base) ?? ROOT;
        const baseDirection = directions.get(member.base) ?? ROOT.rotation;
        const turn = baseDirection * RADIANS;
        const offset = member.pivot ?? { x: 0, y: 0 };
        const pivot = {
          x: baseTip.x + offset.x * Math.cos(turn) - offset.y * Math.sin(turn),
          y: baseTip.y + offset.x * Math.sin(turn) + offset.y * Math.cos(turn),
        };
        const tip = tips.get(id)!;
        expect(Math.hypot(tip.x - pivot.x, tip.y - pivot.y)).toBeCloseTo(member.length, 9);
        const direction = Math.atan2(tip.y - pivot.y, tip.x - pivot.x) / RADIANS;
        directions.set(id, direction);
        if (member.limit !== undefined) {
          const local = direction - baseDirection;
          const wrapped = local - 360 * Math.round(local / 360);
          expect(wrapped).toBeCloseTo(legalRotation(member.limit, fraction), 9);
        }
      }
      // The free root turns the mean of its two addressed tips onto the mean of their aims.
      const meanTip = {
        x: (tips.get("c")!.x + tips.get("d")!.x) / 2,
        y: (tips.get("c")!.y + tips.get("d")!.y) / 2,
      };
      const meanAim = { x: (20 + 75) / 2, y: (70 - 30) / 2 };
      expect(Math.atan2(meanTip.y, meanTip.x)).toBeCloseTo(Math.atan2(meanAim.y, meanAim.x), 12);
      expect(seedLegal(ROOT, ids, byId, aims, { kind: "legal-range", fraction })).toEqual(tips);
    }
    // A root past a whole turn seeds exactly the frame `%` names, down to Number.MAX_VALUE.
    for (const huge of [Number.MAX_VALUE, -Number.MAX_VALUE, 1e6 + 30]) {
      const reduced = { ...ROOT, rotation: huge % 360 };
      expect(seedLegal({ ...ROOT, rotation: huge }, ids, byId, aims, CENTRE)).toEqual(
        seedLegal(reduced, ids, byId, aims, CENTRE),
      );
    }
  });

  it("TH-184 a centred legal attempt agrees in 2D and planar 3D, offsets and branches included", () => {
    for (const rig of [...REPRODUCTIONS, TREE]) {
      const flat = solveFabrikAttempt(ROOT, rig, false, "centroid", CENTRE);
      const spatial = solveTree3dAttempt(
        ROOT3,
        planar3d(rig),
        UNBOUND_POLE3D,
        false,
        "centroid",
        CENTRE,
      );
      expect(spatial.quality.kind).toBe(flat.quality.kind);
      expect(spatial.quality.iterations).toBe(flat.quality.iterations);
      expect(spatial.quality.residual).toBeCloseTo(flat.quality.residual, 8);
    }
  });

  it("TH-191 a collapsed constrained parent seeds its child from the outward-pass rest angle", () => {
    const rig: SolveMember[] = [
      { id: "zero", base: "root", length: 0, limit: { kind: "range", min: 60, max: 120 } },
      {
        id: "tip",
        base: "zero",
        length: 40,
        pivot: { x: 0, y: 5 },
        limit: { kind: "range", min: 0, max: 0 },
      },
    ];
    const { ids, byId } = canonicalChain(rig);
    const aims = new Map([["tip", { x: 0, y: 40 }]]);
    const tips = seedLegal(ROOT, ids, byId, aims, CENTRE);
    expect(tips.get("zero")).toEqual({ x: 0, y: 0 });
    expect(tips.get("tip")!.x).toBeCloseTo(20 - 2.5 * Math.sqrt(3), 10);
    expect(tips.get("tip")!.y).toBeCloseTo(20 * Math.sqrt(3) + 2.5, 10);
    expect(seedLegal(ROOT, ids, byId, aims, { kind: "legal-range", fraction: 0.25 })).toEqual(tips);
    expect(seedLegal(ROOT, ids, byId, aims, CENTRE)).toEqual(tips);
  });

  it("TH-185 each dimension names the legal starts its rig can use, and a met rig pays one attempt", () => {
    const planar = planar3d(REPRODUCTIONS[0]!);
    // Goal d (75, -30) lies beyond its 75-unit path: out of reach, so the centre alone (ADR-132).
    expect(legalStarts3d(ROOT3, planar, UNBOUND_POLE3D)).toEqual(CENTRE_THEN_DESCENT);
    expect(
      legalStarts3d(
        ROOT3,
        planar.map(({ limit: _limit, ...member }) => member),
        UNBOUND_POLE3D,
      ),
    ).toBe(NO_LEGAL_STARTS);
    const tilted = planar.map((member) =>
      member.limit?.kind === "hinge"
        ? { ...member, limit: { ...member.limit, axis: [0, 0.6, 0.8] as Vec3 } }
        : member,
    );
    expect(legalStarts3d(ROOT3, tilted, UNBOUND_POLE3D).kind).toBe("staged-then-descent");
    // A limited rig whose baseline meets its goal takes exactly the one attempt it always took.
    const easy = serial(50, [[40, range(-90, 90)]], { x: 60, y: 30 });
    let attempts = 0;
    const counting: typeof solveFabrikAttempt = (...args) => {
      attempts += 1;
      return solveFabrikAttempt(...args);
    };
    const selected = selectFabrik(ROOT, easy, false, counting, CENTRE_LEGAL_START);
    expect(selected.quality.kind).toBe("converged");
    expect(attempts).toBe(1);
    expect(selected).toEqual(solveFabrikAttempt(ROOT, easy, false));
  });

  it("TH-186 a planar miss the centre leaves is met by the legal descent", () => {
    const rig = serial(
      39.61540713906288,
      [
        [94.90497339516878, range(0, 143.3545655105263)],
        [46.51128927245736, range(-141.18539445102215, -28.930124437902123)],
        [54.92882704362273, range(-97.43157058954239, -84.86721032997593)],
        [79.52963413670659, range(-98.29837644472718, 0)],
      ],
      { x: 113.28647554557269, y: -101.44358599430358 },
    );
    const arcAndCentre = selectFabrik(ROOT, rig, false, solveFabrikAttempt, CENTRE_LEGAL_START);
    expect(arcAndCentre.quality.kind).toBe("limited");
    const planar = planar3d(rig);
    const starts = legalStarts3d(ROOT3, planar, UNBOUND_POLE3D);
    expect(starts.kind).toBe("centre-then-descent");
    const flat = solveChain(ROOT, rig, false);
    const spatial = solveChain3d(ROOT3, planar, UNBOUND_POLE3D);
    expect(flat.quality.kind).toBe("converged");
    expect(spatial.quality.kind).toBe("converged");
    expect(flat.quality.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(spatial.quality.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expect(compose2d(rig, flat.rotations).get("m4")!.x).toBeCloseTo(rig[4]!.goal!.x, 3);
    expect(solveChain3d(ROOT3, planar, UNBOUND_POLE3D)).toEqual(spatial);
  });

  it("TH-187 centre-then-descent stops after the first converged legal candidate", () => {
    const calls: string[] = [];
    const hit = quality("converged", 0.0001);
    const selected = selectFabrik(
      null,
      [],
      false,
      scripted(calls, {
        base: quality("limited", 50),
        opposite: quality("limited", 1),
        "q0.5": quality("limited", 20),
        descent: hit,
      }),
      CENTRE_THEN_DESCENT,
    );
    expect(selected.quality).toBe(hit);
    expect(calls).toEqual(["base", "opposite", "q0.5", "descent"]);
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      scripted(calls, { base: quality("limited", 50) }),
      CENTRE_THEN_DESCENT,
    );
    expect(calls).toEqual(["base", "opposite", "q0.5", "descent"]);
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      scripted(calls, { base: quality("limited", 50), opposite: hit }),
      CENTRE_THEN_DESCENT,
    );
    expect(calls).toEqual(["base", "opposite"]);
  });

  it("TH-188 staged gates on the baseline residual, with an inclusive edge and seven-attempt ceiling", () => {
    const calls: string[] = [];
    const misses = scripted(calls, {
      base: quality("limited", 2),
      opposite: quality("limited", 3),
      "q0.25": quality("limited", 4),
      "q0.75": quality("limited", 5),
      "q0.1": quality("limited", 6),
      "q0.9": quality("limited", 7),
      descent: quality("limited", 8),
    });
    selectFabrik(null, [], false, misses, { kind: "staged-then-descent", reach: 100 });
    expect(calls).toEqual(["base", "opposite", "q0.25", "q0.75", "q0.1", "q0.9", "descent"]);
    calls.length = 0;
    selectFabrik(null, [], false, misses, { kind: "staged-then-descent", reach: 99 });
    expect(calls).toEqual(["base", "opposite", "descent"]);
    // The gate reads the baseline, not the better or worse opposite-side residual.
    calls.length = 0;
    selectFabrik(
      null,
      [],
      false,
      scripted(calls, {
        base: quality("limited", 2.01),
        opposite: quality("limited", 0.1),
        descent: quality("limited", 0.2),
      }),
      { kind: "staged-then-descent", reach: 100 },
    );
    expect(calls).toEqual(["base", "opposite", "descent"]);
  });

  it("TH-189 the real planar rig prices base, opposite, centre, descent in both dimensions", () => {
    const rig = serial(
      39.61540713906288,
      [
        [94.90497339516878, range(0, 143.3545655105263)],
        [46.51128927245736, range(-141.18539445102215, -28.930124437902123)],
        [54.92882704362273, range(-97.43157058954239, -84.86721032997593)],
        [79.52963413670659, range(-98.29837644472718, 0)],
      ],
      { x: 113.28647554557269, y: -101.44358599430358 },
    );
    const starts = legalStarts3d(ROOT3, planar3d(rig), UNBOUND_POLE3D);
    expect(starts).toEqual(CENTRE_THEN_DESCENT);
    const calls2d: string[] = [];
    const counting2d: typeof solveFabrikAttempt = (...args) => {
      const seed = args[4];
      calls2d.push(
        seed?.kind === "legal-range"
          ? `q${seed.fraction}`
          : seed?.kind === "legal-descent"
            ? "descent"
            : args[2]
              ? "opposite"
              : "base",
      );
      return solveFabrikAttempt(...args);
    };
    const flat = selectFabrik(ROOT, rig, false, counting2d, starts);
    const calls3d: string[] = [];
    const counting3d: FabrikAttempt<
      WorldFrame3d,
      ChainMember3d,
      ReturnType<typeof solveTree3dAttempt>
    > = (root, members, flip, rule, seed) => {
      calls3d.push(
        seed?.kind === "legal-range"
          ? `q${seed.fraction}`
          : seed?.kind === "legal-descent"
            ? "descent"
            : flip
              ? "opposite"
              : "base",
      );
      return solveTree3dAttempt(root, members, UNBOUND_POLE3D, flip, rule, seed);
    };
    const spatial = selectFabrik(ROOT3, planar3d(rig), false, counting3d, starts);
    expect(flat.quality.kind).toBe("converged");
    expect(spatial.quality.kind).toBe("converged");
    expect(calls2d).toEqual(["base", "opposite", "q0.5", "descent"]);
    expect(calls3d).toEqual(calls2d);
    expect(calls2d.length).toBeLessThanOrEqual(4);
  });

  it("TH-190 addressed reach ignores unrelated siblings for a non-planar staged start", () => {
    const planar = planar3d(TREE);
    const tilted = planar.map((member) =>
      member.limit?.kind === "hinge"
        ? { ...member, limit: { ...member.limit, axis: [0, 0.6, 0.8] as Vec3 } }
        : member,
    );
    const planarReach = addressedReach(planar, ({ offset }) =>
      Math.hypot(offset.x, offset.y, offset.z),
    );
    expect(planarReach).toBeCloseTo(40 + 30 + Math.hypot(2, -1) + 25);
    // Goal d (75, -30) lies beyond its 75-unit path: out of reach, so the centre alone (ADR-132).
    expect(legalStarts3d(ROOT3, planar, UNBOUND_POLE3D)).toEqual(CENTRE_LEGAL_START);
    const reach = addressedReach(tilted, ({ offset }) => Math.hypot(offset.x, offset.y, offset.z));
    expect(legalStarts3d(ROOT3, tilted, UNBOUND_POLE3D)).toEqual({ kind: "staged", reach });
    const unused = {
      id: "unused",
      base: "a",
      length: 1e6,
      offset: { x: 1e6, y: 0, z: 0 },
      rest: ZERO_REST,
      limit: { kind: "hinge", axis: [0, 0.6, 0.8] as Vec3, range: range(-30, 30) },
    } satisfies ChainMember3d;
    const withUnused = [...tilted, unused];
    expect(legalStarts3d(ROOT3, withUnused, UNBOUND_POLE3D)).toEqual({ kind: "staged", reach });
    expect(
      addressedReach(withUnused, ({ offset }) => Math.hypot(offset.x, offset.y, offset.z)),
    ).toBe(reach);
  });

  it("TH-194 legal descent is deterministic, legal, monotone, and agrees across planar dimensions", () => {
    const rigs = [...REPRODUCTIONS, TREE];
    for (const rig of rigs) {
      const { ids, byId, leaves } = canonicalChain(rig);
      const aims = new Map(
        leaves.flatMap((id) => {
          const goal = byId.get(id)!.goal;
          return goal === undefined ? [] : [[id, { x: goal.x, y: goal.y }] as const];
        }),
      );
      const descent: LegalSeed = { kind: "legal-descent" };
      const tips = seedLegal(ROOT, ids, byId, aims, descent);
      expectLegalSeed(rig, tips);
      expect(seedLegal(ROOT, ids, byId, aims, descent)).toEqual(tips);
      expect(seedWorstMiss(rig, tips)).toBeLessThanOrEqual(
        seedWorstMiss(rig, seedLegal(ROOT, ids, byId, aims, CENTRE)),
      );
      expect(legalFraction(descent)).toBe(0.5);

      const flat = solveFabrikAttempt(ROOT, rig, false, "centroid", descent);
      const spatial = solveTree3dAttempt(
        ROOT3,
        planar3d(rig),
        UNBOUND_POLE3D,
        false,
        "centroid",
        descent,
      );
      expect(spatial.quality.kind).toBe(flat.quality.kind);
      expect(spatial.quality.residual).toBeCloseTo(flat.quality.residual, 5);
    }
  });

  it("TH-195 classifier traps are failing-first for centre and recovered by production descent", () => {
    const old2d = selectFabrik(ROOT, CORPUS_2D_46, true, solveFabrikAttempt, CENTRE_LEGAL_START);
    expect(old2d.quality.kind).toBe("limited");
    const solved2d = solveChain(ROOT, CORPUS_2D_46, true);
    expect(solved2d.quality.kind).toBe("converged");
    const tip2d = compose2d(CORPUS_2D_46, solved2d.rotations).get("m3")!;
    expect(
      Math.hypot(tip2d.x - CORPUS_2D_46[3]!.goal!.x, tip2d.y - CORPUS_2D_46[3]!.goal!.y),
    ).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    for (const member of CORPUS_2D_46)
      if (member.limit !== undefined)
        expect(
          Math.abs(
            limitRotation(member.limit, solved2d.rotations[member.id]!) -
              solved2d.rotations[member.id]!,
          ),
        ).toBeLessThanOrEqual(1e-9);

    const threeD = [
      [ROOT3_123, CORPUS_3D_123],
      [ROOT3_1046, CORPUS_3D_1046],
    ] as const;
    for (const [root, rig] of threeD) {
      const old = selectFabrik(
        root,
        rig,
        false,
        (frame, members, flip, rule, seed) =>
          solveTree3dAttempt(frame, members, UNBOUND_POLE3D, flip, rule, seed),
        CENTRE_LEGAL_START,
      );
      expect(old.quality.kind).toBe("limited");
      const solved = solveChain3d(root, rig, UNBOUND_POLE3D);
      expect(solved.quality.kind).toBe("converged");
      const tips = composePlanar3d(root, rig, solved.rotations3d);
      const leaf = rig[rig.length - 1]!;
      expect(
        Math.hypot(tips.get(leaf.id)!.x - leaf.goal!.x, tips.get(leaf.id)!.y - leaf.goal!.y),
      ).toBeLessThanOrEqual(FABRIK_TOLERANCE);
      for (const member of rig)
        if (member.limit?.kind === "hinge") {
          const local = solved.rotations3d[member.id]!.rotation;
          expect(Math.abs(limitRotation(member.limit.range, local) - local)).toBeLessThanOrEqual(
            1e-9,
          );
        }
    }
  });

  it("TH-196 only legal descent holds its seed and never publishes a worse seeded miss", () => {
    expect(heldFromSeed({ kind: "default" })).toBe(false);
    expect(heldFromSeed({ kind: "legal-range", fraction: 0.1 })).toBe(false);
    expect(heldFromSeed({ kind: "legal-range", fraction: 0.25 })).toBe(false);
    expect(heldFromSeed({ kind: "legal-range", fraction: 0.5 })).toBe(false);
    expect(heldFromSeed({ kind: "legal-range", fraction: 0.75 })).toBe(false);
    expect(heldFromSeed({ kind: "legal-range", fraction: 0.9 })).toBe(false);
    expect(heldFromSeed({ kind: "legal-descent" })).toBe(true);
    for (const rig of [...REPRODUCTIONS, TREE]) {
      const { ids, byId, leaves } = canonicalChain(rig);
      const aims = new Map(
        leaves.flatMap((id) => {
          const goal = byId.get(id)!.goal;
          return goal === undefined ? [] : [[id, { x: goal.x, y: goal.y }] as const];
        }),
      );
      const descent: LegalSeed = { kind: "legal-descent" };
      const seededMiss = seedWorstMiss(rig, seedLegal(ROOT, ids, byId, aims, descent));
      const attempt = solveFabrikAttempt(ROOT, rig, false, "centroid", descent);
      expect(attempt.quality.residual).toBeLessThanOrEqual(seededMiss + 1e-9);
    }
  });
});
