import { describe, expect, it } from "vitest";
import {
  bodyPose3d,
  bonesOf3d,
  buildChain3d,
  chainFromRest3d,
  chainThrough3d,
  fk3d,
  ik3d,
  jointOf,
  matrixFromEuler3d,
  quaternionFromEuler3d,
  solveChain3d,
  UNBOUND_POLE3D,
} from "../src/index";
import { composeWorld3d, multiplyVector3 } from "../src/frame/frame3d";

const JOINTS = [
  { id: "shoulder", x: 0, y: 2, z: 0 },
  { id: "elbow", x: 1, y: 2, z: 0 },
  { id: "wrist", x: 2, y: 2, z: 0 },
] as const;

describe("chainThrough3d and fk3d", () => {
  it("builds a chain typed by bone id and places the tip where a 90 degree elbow bend reaches", () => {
    const { chain, rest } = chainThrough3d(JOINTS);
    expect(chain.order).toEqual(["shoulder", "elbow"]);

    const atRest = fk3d(chain, rest);
    expect(atRest.shoulder.x).toBeCloseTo(1, 9);
    expect(atRest.shoulder.y).toBeCloseTo(2, 9);
    expect(atRest.shoulder.z).toBeCloseTo(0, 9);
    expect(atRest.elbow.x).toBeCloseTo(2, 9);
    expect(atRest.elbow.y).toBeCloseTo(2, 9);
    expect(atRest.elbow.z).toBeCloseTo(0, 9);

    const bent = fk3d(chain, {
      base: rest.base,
      rotations: { ...rest.rotations, elbow: { rotation: 90 } },
    });
    expect(bent.shoulder.x).toBeCloseTo(1, 9);
    expect(bent.shoulder.y).toBeCloseTo(2, 9);
    expect(bent.shoulder.z).toBeCloseTo(0, 9);
    expect(bent.elbow.x).toBeCloseTo(1, 9);
    expect(bent.elbow.y).toBeCloseTo(3, 9);
    expect(bent.elbow.z).toBeCloseTo(0, 9);
  });

  it("refuses fewer than two joints, naming the count", () => {
    expect(() => chainThrough3d([{ id: "only", x: 0, y: 0, z: 0 }])).toThrow(RangeError);
    expect(() => chainThrough3d([{ id: "only", x: 0, y: 0, z: 0 }])).toThrow(/got 1/);
  });

  it("rejects an unknown bone id at compile time", () => {
    const { chain } = chainThrough3d(JOINTS);
    // @ts-expect-error ankle is not a bone of JOINTS
    const bad = fk3d(chain, { rotations: { ankle: { rotation: 15 } } });
    expect(bad.shoulder.x).toBeCloseTo(1, 9);
  });

  it("answers { chain, rest } as in 2D, and only the chain is solved", () => {
    const built = chainThrough3d(JOINTS);
    expect(Object.keys(built).sort()).toEqual(["chain", "rest"]);
    // @ts-expect-error the pair is not a chain
    expect(() => ik3d(built, { elbow: { x: 1, y: 3, z: 0 } })).toThrow();
    // @ts-expect-error a chain's world pose needs rest and now, as chainFromRest does
    expect(() => chainFromRest3d(built.chain, built.rest)).toThrow();
  });

  it("agrees with the frames solveChain3d reaches for the same turns", () => {
    const { chain, rest } = chainThrough3d(JOINTS);
    const goal = { x: 1.1, y: 2.6, z: 0.5, rotation: 0, rotationX: 0, rotationY: 0 };
    const pole = { kind: "point" as const, point: [0.5, 3, 0] as const };
    const raw = solveChain3d(
      rest.base,
      [
        {
          id: "shoulder",
          base: "",
          length: 1,
          offset: { x: 0, y: 0, z: 0 },
          rest: { rotation: 0, rotationX: 0, rotationY: 0 },
        },
        {
          id: "elbow",
          base: "shoulder",
          length: 1,
          offset: { x: 0, y: 0, z: 0 },
          rest: { rotation: 0, rotationX: 0, rotationY: 0 },
          goal,
        },
      ],
      pole,
    );
    const solved = ik3d(chain, { elbow: { x: 1.1, y: 2.6, z: 0.5 } }, { pole: [0.5, 3, 0] });
    const frames = fk3d(chain, solved);
    const rawShoulder = composeWorld3d(rest.base, {
      x: 0,
      y: 0,
      z: 0,
      ...raw.rotations3d.shoulder!,
    });
    const rawShoulderTip = composeWorld3d(rawShoulder, {
      x: 1,
      y: 0,
      z: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    });
    const rawElbow = composeWorld3d(rawShoulderTip, {
      x: 0,
      y: 0,
      z: 0,
      ...raw.rotations3d.elbow!,
    });
    const rawElbowTip = composeWorld3d(rawElbow, {
      x: 1,
      y: 0,
      z: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    });

    expect(frames.shoulder.x).toBeCloseTo(rawShoulderTip.x, 9);
    expect(frames.shoulder.y).toBeCloseTo(rawShoulderTip.y, 9);
    expect(frames.shoulder.z).toBeCloseTo(rawShoulderTip.z, 9);
    expect(frames.elbow.x).toBeCloseTo(rawElbowTip.x, 9);
    expect(frames.elbow.y).toBeCloseTo(rawElbowTip.y, 9);
    expect(frames.elbow.z).toBeCloseTo(rawElbowTip.z, 9);
    expect(frames.elbow.x).toBeCloseTo(1.1, 6);
    expect(frames.elbow.y).toBeCloseTo(2.6, 6);
    expect(frames.elbow.z).toBeCloseTo(0.5, 6);
  });
});

describe("bonesOf3d and chainFromRest3d", () => {
  it("answers empty poses at rest both ways", () => {
    const { chain, rest } = chainThrough3d([
      { id: "shoulder", x: 0, y: 2, z: 0 },
      { id: "elbow", x: 0, y: 1, z: 0 },
      { id: "wrist", x: 0.6, y: 0.2, z: 0.4 },
    ]);
    expect(bonesOf3d(chain)).toEqual({ shoulder: {}, elbow: {} });
    expect(bonesOf3d(chain, rest)).toEqual({ shoulder: {}, elbow: {} });
    expect(chainFromRest3d(chain, rest, rest)).toEqual({ shoulder: {}, elbow: {} });
  });

  it("lands the wrist on fk3d's tip when each world pose from chainFromRest3d is applied to its drawn joint", () => {
    const joints = [
      { id: "shoulder", x: 1, y: 2, z: -0.5 },
      { id: "elbow", x: 1.8, y: 1.4, z: -0.5 },
      { id: "wrist", x: 2.5, y: 0.9, z: 0.1 },
    ] as const;
    const { chain, rest } = chainThrough3d(joints);
    const now = ik3d(chain, { elbow: { x: 1.6, y: 2.1, z: 0.4 } });
    const world = chainFromRest3d(chain, rest, now);
    const tips = fk3d(chain, now);

    const elbowMatrix = matrixFromEuler3d({
      rotation: world.elbow.rotation ?? 0,
      rotationX: world.elbow.rotationX ?? 0,
      rotationY: world.elbow.rotationY ?? 0,
    });
    const drawnForearm: readonly [number, number, number] = [
      joints[2].x - joints[1].x,
      joints[2].y - joints[1].y,
      joints[2].z - joints[1].z,
    ];
    const rotated = multiplyVector3(elbowMatrix, drawnForearm);
    const wristX = joints[1].x + (world.elbow.x ?? 0) + rotated[0];
    const wristY = joints[1].y + (world.elbow.y ?? 0) + rotated[1];
    const wristZ = joints[1].z + (world.elbow.z ?? 0) + rotated[2];

    expect(wristX).toBeCloseTo(tips.elbow.x, 9);
    expect(wristY).toBeCloseTo(tips.elbow.y, 9);
    expect(wristZ).toBeCloseTo(tips.elbow.z, 9);
  });

  it("answers local bone turns in bonesOf3d that move a non-x-aligned arm to fk3d's tip", () => {
    const joints = [
      { id: "shoulder", x: 0, y: 2, z: 0 },
      { id: "elbow", x: 0, y: 1, z: 0 },
      { id: "wrist", x: 0, y: 0, z: 0 },
    ] as const;
    const { chain } = chainThrough3d(joints);
    const now = ik3d(chain, { elbow: { x: 0, y: 1, z: 1 } });
    const local = bonesOf3d(chain, now);
    const tips = fk3d(chain, now);

    const m0 = matrixFromEuler3d({
      rotation: local.shoulder.rotation ?? 0,
      rotationX: local.shoulder.rotationX ?? 0,
      rotationY: local.shoulder.rotationY ?? 0,
    });
    const m1 = matrixFromEuler3d({
      rotation: local.elbow.rotation ?? 0,
      rotationX: local.elbow.rotationX ?? 0,
      rotationY: local.elbow.rotationY ?? 0,
    });
    const elbowOffset = multiplyVector3(m0, [0, -1, 0]);
    const wristOffset = multiplyVector3(m0, multiplyVector3(m1, [0, -1, 0]));
    expect(0 + elbowOffset[0] + wristOffset[0]).toBeCloseTo(tips.elbow.x, 9);
    expect(2 + elbowOffset[1] + wristOffset[1]).toBeCloseTo(tips.elbow.y, 9);
    expect(0 + elbowOffset[2] + wristOffset[2]).toBeCloseTo(tips.elbow.z, 9);
  });

  it("answers turns only, and leaves a moved and turned base to the bone's parent", () => {
    const { chain, rest } = chainThrough3d([
      { id: "shoulder", x: 0, y: 2, z: 0 },
      { id: "elbow", x: 1, y: 2, z: 0 },
      { id: "wrist", x: 2, y: 2, z: 0 },
    ]);
    const base = { ...rest.base, x: 0.5, y: 2.5, rotation: 30 };
    expect(bonesOf3d(chain, { base, rotations: rest.rotations })).toEqual({
      shoulder: {},
      elbow: {},
    });
    const bent = bonesOf3d(chain, {
      base,
      rotations: { ...rest.rotations, elbow: { rotation: 40 } },
    });
    expect(Object.keys(bent.elbow)).toEqual(["rotation"]);
    expect(bent.elbow.rotation).toBeCloseTo(40, 9);
  });

  it("builds a tree chain with buildChain3d", () => {
    const chain = buildChain3d([
      { id: "root", length: 2 },
      { id: "child", parentId: "root", length: 1, rotation: 90 },
    ]);
    const tips = fk3d(chain);
    expect(tips.root.x).toBeCloseTo(2, 9);
    expect(tips.child.x).toBeCloseTo(2, 9);
    expect(tips.child.y).toBeCloseTo(1, 9);
  });
});

describe("ik3d twist", () => {
  const ARM = [
    { id: "shoulder", x: 0.25, y: 1.5, z: 0 },
    { id: "elbow", x: 0.7, y: 1.3, z: 0.1 },
    { id: "hand", x: 1.15, y: 1.15, z: 0.15 },
  ] as const;
  const pole = [0.535, 1.014, 0.422] as const;
  const turnOf = (pose: { rotation?: number; rotationX?: number; rotationY?: number }) => {
    const q = quaternionFromEuler3d({
      rotation: pose.rotation ?? 0,
      rotationX: pose.rotationX ?? 0,
      rotationY: pose.rotationY ?? 0,
    });
    return (2 * Math.acos(Math.min(1, Math.abs(q.w))) * 180) / Math.PI;
  };

  it.each([{ pole }, {}])("answers the rest pose for a goal at the rest tip (%o)", (options) => {
    const { chain } = chainThrough3d(ARM);
    const solved = ik3d(chain, { elbow: { x: 1.15, y: 1.15, z: 0.15 } }, options);
    const turns = bonesOf3d(chain, solved);
    expect(turnOf(turns.shoulder)).toBeLessThan(0.01);
    expect(turnOf(turns.elbow)).toBeLessThan(0.02);
  });

  it.each([{ pole }, {}])("turns each bone a little for a goal moved a little (%o)", (options) => {
    const { chain } = chainThrough3d(ARM);
    const solved = ik3d(chain, { elbow: { x: 1.1499, y: 1.1501, z: 0.1501 } }, options);
    const turns = bonesOf3d(chain, solved);
    expect(turnOf(turns.shoulder)).toBeLessThan(0.5);
    expect(turnOf(turns.elbow)).toBeLessThan(0.5);
    const tip = fk3d(chain, solved).elbow;
    expect(Math.hypot(tip.x - 1.1499, tip.y - 1.1501, tip.z - 0.1501)).toBeLessThan(1e-6);
  });
});

describe("ik3d's rest plane", () => {
  it("has none for a chain straight at rest, so it bends as with no pole at all", () => {
    const { chain } = chainThrough3d([
      { id: "hip", x: 0, y: 2, z: 0 },
      { id: "knee", x: 0, y: 1, z: 0 },
      { id: "foot", x: 0, y: 0, z: 0 },
    ]);
    const goal = { knee: { x: 0, y: 0.5, z: 0 } };
    expect(ik3d(chain, goal).rotations).toEqual(
      ik3d(chain, goal, { pole: UNBOUND_POLE3D }).rotations,
    );
  });
});

describe("jointOf", () => {
  it("reads a joint typed by its name and refuses a missing one by name", () => {
    const table = { Jaw: { x: 0, y: 0.3, z: 0.1 } };
    const jaw = jointOf(table, "Jaw");
    const id: "Jaw" = jaw.id;
    expect({ ...jaw, id }).toEqual({ id: "Jaw", x: 0, y: 0.3, z: 0.1 });
    expect(() => jointOf(table, "Tail")).toThrow(/no joint "Tail"/);
    expect(() => jointOf(table, "toString")).toThrow(RangeError);
  });
});

describe("bodyPose3d", () => {
  it("converts a quarter turn about y to { rotationY: 90 } within 1e-9 and undefined to {}", () => {
    const quarterY = quaternionFromEuler3d({ rotation: 0, rotationX: 0, rotationY: 90 });
    const pose = bodyPose3d({ x: 0, y: 0, z: 0, rotation: quarterY });
    expect(Object.keys(pose)).toEqual(["rotationY"]);
    expect(pose.rotationY).toBeCloseTo(90, 9);
    expect(bodyPose3d(undefined)).toEqual({});
  });

  it("includes non-zero translation alongside orientation", () => {
    const quarterZ = quaternionFromEuler3d({ rotation: 45, rotationX: 0, rotationY: 0 });
    const pose = bodyPose3d({ x: 1.5, y: -0.5, z: 2, rotation: quarterZ });
    expect(pose.x).toBeCloseTo(1.5, 9);
    expect(pose.y).toBeCloseTo(-0.5, 9);
    expect(pose.z).toBeCloseTo(2, 9);
    expect(pose.rotation).toBeCloseTo(45, 9);
  });
});
