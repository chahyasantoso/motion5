import { describe, expect, it } from "vitest";
import type { PluginInputs } from "../../../src/domain/plugins";
import {
  add3,
  dot3,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  normalize3,
  readFrame3d,
  rotationAboutAxis3d,
  scale3,
  subtract3,
  swingFrame3d,
  ZERO_EULER,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import { solveChain } from "../../../src/plugins/ik-solve";
import { solveTwoBone3d, UNBOUND_POLE3D, type Pole3d } from "../../../src/plugins/ik3d-analytic";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import {
  legalRetryReach3d,
  legalStarts3d,
  place3d,
  solveTree3dAttempt,
} from "../../../src/plugins/ik3d-fabrik";
import { solveSerialRecovery3d } from "../../../src/plugins/ik3d-serial-recovery";
import { chainShape3d, solveChain3d } from "../../../src/plugins/ik3d-solve";
import { limitLocal3d } from "../../../src/plugins/ik3d-constraint";
import type { ChainMember3d } from "../../../src/plugins/ik3d-chain";
import type { SolveResult3d } from "../../../src/plugins/ik3d-result";
import { composeChain3d, frameDistance3d } from "../../support/fk3d-compose";

const ROOT = readFrame3d({ x: 0, y: 0, z: 0 });
const ZERO_OFFSET = { x: 0, y: 0, z: 0 } as const;
const ZERO_REST: Euler3d = { ...ZERO_EULER };

type Vec2 = { readonly x: number; readonly y: number };

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function member(
  id: string,
  base: string,
  length: number,
  extra: Partial<ChainMember3d> = {},
): ChainMember3d {
  return { id, base, length, offset: ZERO_OFFSET, rest: ZERO_REST, ...extra };
}

function allFinite(result: SolveResult3d): boolean {
  return Object.values(result.rotations3d).every((euler) =>
    Object.values(euler).every(Number.isFinite),
  );
}

function turnDistance(a: number, b: number): number {
  const delta = a - b;
  return Math.abs(delta - 360 * Math.round(delta / 360));
}

function composedInputs(
  root: WorldFrame3d,
  target: WorldFrame3d,
  members: readonly ChainMember3d[],
  inspect = false,
) {
  return {
    root,
    target,
    members: members.map((item) => ({
      id: item.id,
      base: item.base,
      values: { length: item.length, ...item.offset, ...item.rest },
      progress: 1,
    })),
    ...(inspect ? { inspect: true } : {}),
  };
}

function columns(matrix: Matrix3): readonly [Vec3, Vec3, Vec3] {
  return [
    [matrix[0], matrix[3], matrix[6]],
    [matrix[1], matrix[4], matrix[7]],
    [matrix[2], matrix[5], matrix[8]],
  ];
}

function perpendicularSide(point: Vec3, goal: Vec3, side: Vec3): number {
  const along = normalize3(goal, [1, 0, 0]);
  const project = (value: Vec3): Vec3 => subtract3(value, scale3(along, dot3(value, along)));
  return dot3(project(point), project(side));
}

describe("3D FABRIK evidence", () => {
  it("TH-180 recovers an interior-extremum hinge tail and a narrow free-hinge-free interval", () => {
    const root = readFrame3d({
      x: -8.388811768963933,
      y: 60.30385987833142,
      z: -70.42242581956089,
      rotation: -74.02267802506685,
      rotationX: 3.422397910617292,
      rotationY: 138.74881071969867,
    });
    const tail = [
      member("m0", "root", 32.90214329166338),
      member("m1", "m0", 60.66020148922689, {
        limit: {
          kind: "hinge",
          axis: [-0.7958430574347964, -0.5932190218261085, 0.12134669371890663],
          range: { kind: "range", min: -46.52479981537908, max: 25.322788406629115 },
        },
      }),
      member("m2", "m1", 6.585309301735833, {
        limit: {
          kind: "hinge",
          axis: [0.01633708814613173, -0.18847931926044104, 0.9819412639063632],
          range: { kind: "range", min: -95.05852318834513, max: -9.820594030898064 },
        },
        goal: readFrame3d({ x: -47.673799523067636, y: 68.38348720116291, z: 21.22687074815933 }),
      }),
    ];
    const solved = solveChain3d(root, tail);
    expect(solved.quality.kind).toBe("reached");
    expect(frameDistance3d(composeChain3d(root, tail, solved).m2!, tail[2]!.goal!)).toBeLessThan(
      1e-3,
    );
    expect(solveSerialRecovery3d(root, tail)).toEqual(
      solveSerialRecovery3d(root, [...tail].reverse()),
    );
  });

  it("TH-179 closes a final-free block under a rolled, translated root", () => {
    const root = readFrame3d({
      x: 17,
      y: -9,
      z: 23,
      rotation: 35,
      rotationX: -20,
      rotationY: 14,
    });
    const localGoal: Vec3 = [-32.00051765859141, 134.85444580777076, -9.895349553866598];
    const translated = add3(
      [root.x, root.y, root.z],
      multiplyVector3(matrixFromEuler3d(root), localGoal),
    );
    const goal = readFrame3d({ x: translated[0], y: translated[1], z: translated[2] });
    const members = [
      member("m0", "root", 71.38998994603753),
      member("m1", "m0", 65.5161595158279, {
        limit: {
          kind: "hinge",
          axis: [0.10959486834464084, 0.7671394959960741, -0.6320490159120654],
          range: { kind: "range", min: -155.3130643069744, max: -61.4955870504491 },
        },
      }),
      member("m2", "m1", 42.40117896348238, { goal }),
    ];
    const result = solveSerialRecovery3d(root, members);
    expect(result?.quality.kind).toBe("reached");
    expect(frameDistance3d(composeChain3d(root, members, result!).m2!, goal)).toBeLessThan(1e-4);
    expect(Object.keys(result!.rotations3d).sort()).toEqual(["m0", "m1", "m2"]);
  });

  it("TH-176 closes a legal FHFH chain with independently rendered FK", () => {
    const goal = readFrame3d({
      x: -35.6729090628118,
      y: 22.23198194420729,
      z: 88.61350249102914,
    });
    const members = [
      member("m0", "root", 98.38177559897304),
      member("m1", "m0", 39.75347654893994, {
        limit: {
          kind: "hinge",
          axis: [0.1810763233443554, 0.48032885465079667, -0.8581931930014036],
          range: { kind: "range", min: -149.65340234339237, max: -47.55786440568045 },
        },
      }),
      member("m2", "m1", 48.81612412631512),
      member("m3", "m2", 72.54957620054483, {
        limit: {
          kind: "hinge",
          axis: [0.5721498043727001, 0.32567895511922285, 0.752713637148107],
          range: { kind: "range", min: -88.74242354184389, max: 19.905908913351595 },
        },
        goal,
      }),
    ];
    const result = solveSerialRecovery3d(ROOT, members);
    expect(result?.quality.kind).toBe("reached");
    expect(result).toEqual(solveSerialRecovery3d(ROOT, [...members].reverse()));
    expect(frameDistance3d(composeChain3d(ROOT, members, result!).m3!, goal)).toBeLessThan(1e-4);
    for (const item of members) {
      if (item.limit?.kind !== "hinge") continue;
      const local = matrixFromEuler3d(result!.rotations3d[item.id]!);
      const projected = limitLocal3d(item.limit, () => local);
      expect(projected.kind).toBe("moved");
      if (projected.kind === "moved")
        expect(
          Math.max(...local.map((value, index) => Math.abs(value - projected.local[index]!))),
        ).toBeLessThan(1e-9);
    }
    expect(
      solveSerialRecovery3d(ROOT, [
        { ...members[0]!, offset: { x: 1, y: 0, z: 0 } },
        ...members.slice(1),
      ]),
    ).toBeUndefined();
    expect(
      solveSerialRecovery3d(
        ROOT,
        members.map((item, index) =>
          index === 1 ? { ...item, limit: { kind: "cone", maxSwing: 90 } } : item,
        ),
      ),
    ).toBeUndefined();
  });

  it("TH-177 recovers an interior zero-hinge radius the endpoint grid misses", () => {
    const goal = readFrame3d({
      x: -172.76647802466633,
      y: -72.94091720655308,
      z: -110.13062000881749,
    });
    const members = [
      member("m0", "root", 81.28483027219772),
      member("m1", "m0", 92.40048948675394, {
        limit: {
          kind: "hinge",
          axis: [-0.6812253408426044, 0.7280458768647049, -0.07668921810906969],
          range: { kind: "range", min: -36.33798886090517, max: 83.22030252311379 },
        },
      }),
      member("m2", "m1", 43.905195612460375, {
        limit: {
          kind: "hinge",
          axis: [0.06048865529687174, -0.813236022164585, -0.5787817333281164],
          range: { kind: "range", min: 0, max: 37.6502456702292 },
        },
        goal,
      }),
    ];
    const result = solveChain3d(ROOT, members);
    expect(result.quality.kind).toBe("reached");
    expect(frameDistance3d(composeChain3d(ROOT, members, result).m2!, goal)).toBeLessThan(1e-4);
  });

  it("TH-178 recovers a second interior radius and refuses an unreachable serial goal", () => {
    const goal = readFrame3d({
      x: 77.71711715606504,
      y: -146.78821675564032,
      z: -14.288129175911576,
    });
    const members = [
      member("m0", "root", 42.932046838104725),
      member("m1", "m0", 44.05199311673641, {
        limit: {
          kind: "hinge",
          axis: [0.14158684673962427, 0.6187915235333219, -0.7726902453335621],
          range: { kind: "range", min: -65.22472005337477, max: 85.98530996590853 },
        },
      }),
      member("m2", "m1", 58.049342688173056, {
        limit: {
          kind: "hinge",
          axis: [-0.6517347077577137, -0.6201130432919506, -0.4366940396240407],
          range: { kind: "range", min: -76.5459405630827, max: 0 },
        },
      }),
      member("m3", "m2", 22.17661639675498, {
        limit: {
          kind: "hinge",
          axis: [-0.019901321586284455, -0.48824440730699364, -0.87247999182363],
          range: { kind: "range", min: -59.94401156902313, max: 45.60031414264813 },
        },
        goal,
      }),
    ];
    const recovered = solveChain3d(ROOT, members);
    expect(recovered.quality.kind).toBe("reached");
    expect(frameDistance3d(composeChain3d(ROOT, members, recovered).m3!, goal)).toBeLessThan(1e-4);
    const unreachable = members.map((item, index) =>
      index === 3 ? { ...item, goal: { ...goal, x: 1000 } } : item,
    );
    expect(solveSerialRecovery3d(ROOT, unreachable)).toBeUndefined();
  });

  it("TH-169 closes corpus rig 9 with a legal hinge and respects either pole side", () => {
    const hinge = {
      kind: "hinge",
      axis: [0.287404631488057, -0.5022223196772365, -0.8155803574248401],
      range: { kind: "range", min: -59.25306648015976, max: 60.70442201802507 },
    } as const;
    const members = [
      member("m0", "root", 20.887074042111635),
      member("m1", "m0", 95.18393998965621, {
        limit: hinge,
        goal: readFrame3d({
          x: 19.932951234140223,
          y: -39.216434433678984,
          z: -103.3431424047954,
        }),
      }),
    ];
    expect(
      solveTree3dAttempt(ROOT, members, UNBOUND_POLE3D, false, "centroid").quality.kind,
    ).not.toBe("converged");
    const recovered = solveChain3d(ROOT, members);
    expect(recovered.quality.kind).toBe("reached");
    expect(recovered.quality.residual).toBeLessThan(1e-8);
    expect(solveChain3d(ROOT, [...members].reverse())).toEqual(recovered);
    for (const poleZ of [-1000, 1000]) {
      const pole: Pole3d = { kind: "point", point: [0, 0, poleZ] };
      const solved = solveChain3d(ROOT, members, pole);
      expect(solved.quality.kind).toBe("reached");
      const composed = composeChain3d(ROOT, members, solved);
      expect(frameDistance3d(composed.m1!, members[1]!.goal!)).toBeLessThan(1e-8);
      const elbow: Vec3 = [composed.m0!.x, composed.m0!.y, composed.m0!.z];
      const goal: Vec3 = [members[1]!.goal!.x, members[1]!.goal!.y, members[1]!.goal!.z];
      const along = normalize3(goal, [1, 0, 0]);
      const poleVector: Vec3 = [0, 0, poleZ];
      const poleSide = subtract3(poleVector, scale3(along, dot3(poleVector, along)));
      expect(dot3(elbow, poleSide)).toBeGreaterThan(0);
    }
  });

  it("TH-170 verifies rolled-root FK and refuses unsupported pair shapes", () => {
    const root = readFrame3d({
      x: 17,
      y: -9,
      z: 23,
      rotation: 35,
      rotationX: -20,
      rotationY: 14,
    });
    const axis: Vec3 = normalize3([0.4, -0.7, 0.6], [0, 0, 1]);
    const hinge = {
      kind: "hinge",
      axis,
      range: { kind: "range", min: 0, max: 95 },
    } as const;
    const parent = multiplyMatrix3(
      matrixFromEuler3d(root),
      matrixFromEuler3d({ rotation: -40, rotationX: 12, rotationY: 31 }),
    );
    const child = multiplyMatrix3(parent, rotationAboutAxis3d(axis, 37));
    const target = add3(
      add3([root.x, root.y, root.z], scale3([parent[0], parent[3], parent[6]], 70)),
      scale3([child[0], child[3], child[6]], 45),
    );
    const members = [
      member("a", "root", 70, { rest: { rotation: 20, rotationX: 10, rotationY: -15 } }),
      member("b", "a", 45, {
        limit: hinge,
        goal: readFrame3d({ x: target[0], y: target[1], z: target[2] }),
      }),
    ];
    const recovered = solveSerialRecovery3d(root, members, UNBOUND_POLE3D);
    expect(recovered?.quality.kind).toBe("reached");
    const composed = composeChain3d(root, members, recovered!);
    expect(frameDistance3d(composed.b!, members[1]!.goal!)).toBeLessThan(1e-8);
    const local = matrixFromEuler3d(recovered!.rotations3d.b!);
    const limited = limitLocal3d(hinge, () => local);
    expect(limited.kind).toBe("moved");
    if (limited.kind !== "moved") throw new Error("hinge must project to a legal local");
    for (let index = 0; index < 9; index++)
      expect(Math.abs(local[index]! - limited.local[index]!)).toBeLessThan(1e-9);
    expect(
      solveSerialRecovery3d(
        root,
        [{ ...members[0]!, offset: { x: 1, y: 0, z: 0 } }, members[1]!],
        UNBOUND_POLE3D,
      ),
    ).toBeUndefined();
    expect(
      solveSerialRecovery3d(
        root,
        [members[0]!, { ...members[1]!, limit: { ...hinge, axis: [0, 0, 1] } }],
        UNBOUND_POLE3D,
      ),
    ).toBeUndefined();
  });

  it("TH-171 closes generated legal hinge pairs and never claims an unreachable shell", () => {
    const random = seeded(171);
    for (let index = 0; index < 120; index++) {
      const root = readFrame3d({
        x: random() * 100 - 50,
        y: random() * 100 - 50,
        z: random() * 100 - 50,
        rotation: random() * 180 - 90,
        rotationX: random() * 120 - 60,
        rotationY: random() * 120 - 60,
      });
      const axis = normalize3([random() - 0.5, random() - 0.5, random() - 0.5], [0, 0, 1]);
      const hinge = {
        kind: "hinge",
        axis,
        range: { kind: "range", min: -140, max: 140 },
      } as const;
      const firstLength = 20 + random() * 80;
      const secondLength = 20 + random() * 80;
      const parent = multiplyMatrix3(
        matrixFromEuler3d(root),
        matrixFromEuler3d({
          rotation: random() * 260 - 130,
          rotationX: random() * 120 - 60,
          rotationY: random() * 120 - 60,
        }),
      );
      const child = multiplyMatrix3(parent, rotationAboutAxis3d(axis, random() * 260 - 130));
      const target = add3(
        add3([root.x, root.y, root.z], scale3([parent[0], parent[3], parent[6]], firstLength)),
        scale3([child[0], child[3], child[6]], secondLength),
      );
      const members = [
        member("first", "root", firstLength),
        member("second", "first", secondLength, {
          goal: readFrame3d({ x: target[0], y: target[1], z: target[2] }),
          limit: hinge,
        }),
      ];
      const solved = solveSerialRecovery3d(root, members, UNBOUND_POLE3D);
      expect(solved?.quality.kind, String(index)).toBe("reached");
      const composed = composeChain3d(root, members, solved!);
      const miss = frameDistance3d(composed.second!, members[1]!.goal!);
      expect(miss).toBeLessThan(1e-8);
      expect(Math.abs(miss - solved!.quality.residual)).toBeLessThan(1e-8);
      const local = matrixFromEuler3d(solved!.rotations3d.second!);
      const limited = limitLocal3d(hinge, () => local);
      if (limited.kind !== "moved") throw new Error("hinge projection missing");
      for (let component = 0; component < 9; component++)
        expect(Math.abs(local[component]! - limited.local[component]!)).toBeLessThan(1e-9);
      const far = [
        members[0]!,
        {
          ...members[1]!,
          goal: readFrame3d({ x: root.x + firstLength + secondLength + 100, y: root.y, z: root.z }),
        },
      ];
      expect(solveSerialRecovery3d(root, far, UNBOUND_POLE3D)).toBeUndefined();
    }
  });

  it("TH-172 closes a straight legal endpoint and defaults the pole for direct calls", () => {
    const hinge = {
      kind: "hinge",
      axis: [0.6, 0.8, 0],
      range: { kind: "range", min: -60, max: 60 },
    } as const;
    const members = [
      member("a", "root", 30),
      member("b", "a", 20, {
        limit: hinge,
        goal: readFrame3d({ x: 50 }),
      }),
    ];
    const result = solveSerialRecovery3d(ROOT, members);
    expect(result?.quality.kind).toBe("reached");
    expect(
      frameDistance3d(composeChain3d(ROOT, members, result!).b!, members[1]!.goal!),
    ).toBeLessThan(1e-9);
  });

  it("TH-173 keeps a recovered hinge tip fixed under an orientation goal", () => {
    const goal = readFrame3d({
      x: 19.932951234140223,
      y: -39.216434433678984,
      z: -103.3431424047954,
      rotation: 125,
      rotationX: -40,
      rotationY: 25,
    });
    const members = [
      member("a", "root", 20.887074042111635),
      member("b", "a", 95.18393998965621, {
        limit: {
          kind: "hinge",
          axis: [0.287404631488057, -0.5022223196772365, -0.8155803574248401],
          range: { kind: "range", min: -59.25306648015976, max: 60.70442201802507 },
        },
        goal,
        orient: 1,
      }),
    ];
    const solved = solveChain3d(ROOT, members);
    const tip = composeChain3d(ROOT, members, solved).b!;
    expect(solved.quality.kind).toBe("reached");
    expect(frameDistance3d(tip, goal)).toBeLessThan(1e-8);
    expect(Math.abs(frameDistance3d(tip, goal) - solved.quality.residual)).toBeLessThan(1e-8);
  });
  it("TH-165 prices legal retries by addressed non-planar paths, never an unrelated branch", () => {
    const nearAxis = {
      kind: "hinge",
      axis: [1e-10, 0, 1],
      range: { kind: "range", min: -90, max: 90 },
    } as const;
    const offAxis = { ...nearAxis, axis: [0.6, 0, 0.8] } as const;
    const addressed = [
      member("joint", "root", 10, { limit: offAxis }),
      member("target", "joint", 5, { goal: readFrame3d({ x: 10, y: 1, z: 0 }) }),
    ];
    expect(legalRetryReach3d(addressed)).toBe(15);
    expect(legalRetryReach3d([...addressed, member("unused", "root", 1e12)])).toBe(15);
    expect(legalRetryReach3d([...addressed].reverse())).toBe(15);
    expect(
      legalRetryReach3d([member("joint", "root", 10, { limit: nearAxis }), addressed[1]!]),
    ).toBe(0);
    expect(
      legalRetryReach3d([
        member("joint", "root", 10, { limit: { ...offAxis, axis: [0, 0, 1] } }),
        addressed[1]!,
      ]),
    ).toBe(0);
    expect(
      legalRetryReach3d([
        member("joint", "root", 10),
        member("target", "joint", 5, { goal: addressed[1]!.goal! }),
        member("unused", "root", 1e12, { limit: offAxis }),
      ]),
    ).toBe(0);
  });

  it("TH-162 recovers reachable corpus rig 17 from a legal quartile, not a longer cap", () => {
    // #514/#527: N=2000, seed=7, random-axis rig 17. Goal is the generator's exact FK image
    // of legal hinge angles 12.604992073353275 and 76.92486313481233 degrees.
    const fixture = [
      member("m0", "root", 40.85358144715428),
      member("m1", "m0", 94.8467200063169, {
        limit: {
          kind: "hinge",
          axis: [-0.655586166349419, 0.7289889460639496, 0.19693119358761804],
          range: { kind: "range", min: 0, max: 106.17011815309525 },
        },
      }),
      member("m2", "m1", 21.519364770501852),
      member("m3", "m2", 73.64285262301564, {
        limit: {
          kind: "hinge",
          axis: [0.5313246021533237, -0.17907773024417506, -0.8280249595738084],
          range: { kind: "range", min: -36.05680175125599, max: 123.78932288615033 },
        },
        goal: {
          x: 15.952997154532275,
          y: -135.69848629590638,
          z: 153.8330012396826,
          ...ZERO_REST,
        },
      }),
    ];
    const authored = solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid");
    const opposite = solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, true, "centroid");
    expect(authored.quality.kind).toBe("iteration-cap");
    expect(authored.quality.residual).toBeGreaterThan(1);
    expect(opposite.quality.kind).toBe("limited");
    const quarter = solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid", {
      kind: "legal-range",
      fraction: 0.25,
    });
    expect(quarter.quality.kind).toBe("converged");
    const selected = solveChain3d(ROOT, fixture, UNBOUND_POLE3D);
    expect(selected.quality.kind).toBe("converged");
    expect(selected.quality.residual).toBeLessThan(0.001);
    expect(solveChain3d(ROOT, fixture, UNBOUND_POLE3D)).toEqual(selected);
  });
  it("TH-193 pays the centre when a non-planar hinge accepts the pole-side default arc", () => {
    // Legal FK target for a six-member Y-hinge rig. The pole places the default arc in XZ,
    // so an axis-based assumption that this default is already centred misses the goal.
    const pole: Pole3d = { kind: "point", point: [0, 0, 100] };
    const lengths = [
      82.6316828164272, 13.086131042800844, 43.52013563038781, 85.0062888301909, 74.1611910588108,
      67.79328460339457,
    ];
    const ranges = [
      [72.8147910458002, 175],
      [5.061190094619199, 86.983174124475],
      [-76.26409559461314, 7.418871692124817],
      [57.1623340531869, 61.88988136819761],
      [-137.5860264740287, -42.10471231757576],
    ];
    const rig = lengths.map((length, index) =>
      member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, length, {
        ...(index === 0
          ? {}
          : {
              limit: {
                kind: "hinge",
                axis: [0, 1, 0] as Vec3,
                range: { kind: "range", min: ranges[index - 1]![0]!, max: ranges[index - 1]![1]! },
              },
            }),
        ...(index === 5
          ? { goal: { x: 34.43033191221809, y: 0, z: -98.60828140447876, ...ZERO_REST } }
          : {}),
      }),
    );
    expect(legalStarts3d(ROOT, rig, pole)).toEqual({
      kind: "centre-then-staged",
      reach: lengths.reduce((sum, length) => sum + length, 0),
    });
    const baseline = solveTree3dAttempt(ROOT, rig, pole, false, "centroid");
    const centre = solveTree3dAttempt(ROOT, rig, pole, false, "centroid", {
      kind: "legal-range",
      fraction: 0.5,
    });
    expect(baseline.quality.kind).not.toBe("converged");
    expect(centre.quality.kind).toBe("converged");
    const selected = solveChain3d(ROOT, rig, pole);
    expect(selected.quality.kind).toBe("converged");
    expect(selected.quality.residual).toBeLessThan(0.001);
    expect(solveChain3d(ROOT, rig, pole)).toEqual(selected);
  });
  it("TH-167 recovers reachable corpus rig 18 from an endpoint-biased legal start", () => {
    // Exact FK target for legal angles 9.30983765437759 and 24.389092029078217.
    const fixture = [
      member("m0", "root", 58.65312499925494),
      member("m1", "m0", 65.5732256360352, {
        limit: {
          kind: "hinge",
          axis: [0.5123180399942272, 0.466523432275835, 0.7210312843656979],
          range: { kind: "range", min: 0, max: 79.40118396654725 },
        },
      }),
      member("m2", "m1", 95.63809351995587),
      member("m3", "m2", 28.141679298132658, {
        limit: {
          kind: "hinge",
          axis: [0.4773589709190512, 0.7653958172811255, -0.4316221215040564],
          range: { kind: "range", min: 0, max: 135.12245435267687 },
        },
        goal: readFrame3d({
          x: 121.27809376546492,
          y: 133.21334821678468,
          z: 166.4276692150407,
        }),
      }),
    ];
    const baseline = solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid");
    expect(baseline.quality.kind).toBe("limited");
    expect(baseline.quality.residual).toBeLessThan(0.02 * legalRetryReach3d(fixture));
    expect(
      solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, true, "centroid").quality.kind,
    ).not.toBe("converged");
    for (const fraction of [0.25, 0.75] as const)
      expect(
        solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid", {
          kind: "legal-range",
          fraction,
        }).quality.kind,
      ).not.toBe("converged");
    const endpoint = solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid", {
      kind: "legal-range",
      fraction: 0.1,
    });
    expect(endpoint.quality.kind).toBe("converged");
    expect(solveChain3d(ROOT, fixture, UNBOUND_POLE3D).quality.kind).toBe("converged");
  });

  it("TH-175 recovers corpus rig 12 only from the symmetric legal endpoint", () => {
    // Seed-7 rig 12: exact FK goal from a legal -18.384259487491136 degree final hinge.
    const fixture = [
      member("m0", "root", 59.20602461323142),
      member("m1", "m0", 45.08465627208352),
      member("m2", "m1", 35.35688554868102, {
        limit: {
          kind: "hinge",
          axis: [-0.5419019284015077, -0.16543067601400707, -0.8239993880023672],
          range: { kind: "range", min: -138.86158861219883, max: 0 },
        },
        goal: readFrame3d({
          x: -18.393961986636363,
          y: 68.82287752408351,
          z: -42.83943076534621,
        }),
      }),
    ];
    const attempt = (fraction: 0.1 | 0.25 | 0.75 | 0.9) =>
      solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid", {
        kind: "legal-range",
        fraction,
      });
    expect(solveTree3dAttempt(ROOT, fixture, UNBOUND_POLE3D, false, "centroid").quality.kind).toBe(
      "iteration-cap",
    );
    for (const fraction of [0.25, 0.75, 0.1] as const)
      expect(attempt(fraction).quality.kind).not.toBe("converged");
    expect(attempt(0.9).quality.kind).toBe("converged");
    const solved = solveChain3d(ROOT, fixture, UNBOUND_POLE3D);
    expect(solved.quality.kind).toBe("converged");
    expect(solved.quality.residual).toBeLessThan(0.001);
    expect(solveChain3d(ROOT, fixture, UNBOUND_POLE3D)).toEqual(solved);
  });
  it("TH-58 closes seeded serial chains and independently composes their tips", () => {
    const random = seeded(7);
    for (let sample = 0; sample < 300; sample += 1) {
      const count = 3 + Math.floor(random() * 6);
      const root = readFrame3d({
        x: random() * 100 - 50,
        y: random() * 100 - 50,
        z: random() * 100 - 50,
        rotation: random() * 360 - 180,
        rotationX: random() * 360 - 180,
        rotationY: random() * 360 - 180,
      });
      const members: ChainMember3d[] = [];
      for (let index = 0; index < count; index += 1) {
        members.push(
          member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 10 + random() * 10, {
            offset:
              sample % 2 === 1
                ? { x: random() * 3, y: random() * 3, z: random() * 3 }
                : ZERO_OFFSET,
            rest:
              sample % 3 === 0
                ? { rotation: random() * 90, rotationX: random() * 90, rotationY: random() * 90 }
                : ZERO_REST,
          }),
        );
      }
      const reach = members.reduce((sum, item) => sum + item.length, 0);
      const direction: Vec3 = [random() - 0.5, random() - 0.5, random() - 0.5];
      const size = Math.hypot(direction[0], direction[1], direction[2]);
      const distance = reach * (0.1 + 0.8 * random());
      const goal = readFrame3d({
        x: root.x + (direction[0] / size) * distance,
        y: root.y + (direction[1] / size) * distance,
        z: root.z + (direction[2] / size) * distance,
      });
      members[count - 1] = { ...members[count - 1]!, goal };

      const result = solveChain3d(root, members, UNBOUND_POLE3D);
      expect(result.quality.kind).toBe("converged");
      expect(result.quality.residual).toBeLessThanOrEqual(1e-3);
      const composed = composeChain3d(root, members, result);
      const tip = composed[`m${count - 1}`];
      if (tip === undefined) throw new Error("missing composed tip");
      expect(Math.abs(frameDistance3d(tip, goal) - result.quality.residual)).toBeLessThanOrEqual(
        1e-9,
      );
    }
  });

  it("TH-59 reduces planar FABRIK to 2D angles and zero X/Y rotations", () => {
    const random = seeded(11);
    for (let sample = 0; sample < 200; sample += 1) {
      const count = 3 + Math.floor(random() * 5);
      const root2 = { x: random() * 100, y: random() * 100, rotation: random() * 360 - 180 };
      const members2 = Array.from({ length: count }, (_, index) => ({
        id: `m${index}`,
        base: index === 0 ? "root" : `m${index - 1}`,
        length: 10 + random() * 10,
      }));
      const reach = members2.reduce((sum, item) => sum + item.length, 0);
      const angle = random() * Math.PI * 2;
      const goal: Vec2 = {
        x: root2.x + Math.cos(angle) * reach * (0.1 + 0.8 * random()),
        y: root2.y + Math.sin(angle) * reach * (0.1 + 0.8 * random()),
      };
      const flat = solveChain(
        root2,
        members2.map((item, index) => ({
          ...item,
          ...(index === count - 1 ? { goal: { ...goal, rotation: 0 } } : {}),
        })),
      );
      const spatialMembers = members2.map((item, index) =>
        member(item.id, item.base, item.length, {
          ...(index === count - 1 ? { goal: readFrame3d({ ...goal, z: 0 }) } : {}),
        }),
      );
      const spatial = solveChain3d(
        readFrame3d({ ...root2, z: 0, rotationX: 0, rotationY: 0 }),
        spatialMembers,
      );
      expect(spatial.quality.kind).toBe(flat.quality.kind);
      expect(Math.abs(spatial.quality.residual - flat.quality.residual)).toBeLessThanOrEqual(1e-9);
      for (const item of members2) {
        const euler = spatial.rotations3d[item.id]!;
        expect(euler.rotationX).toBeCloseTo(0, 9);
        expect(euler.rotationY).toBeCloseTo(0, 9);
        expect(turnDistance(euler.rotation, flat.rotations[item.id]!)).toBeLessThanOrEqual(1e-9);
      }
    }
  });

  it("TH-60 is pure and member-order independent at every published byte", () => {
    const members = [
      member("m2", "m1", 20),
      member("m0", "root", 20),
      member("m3", "m2", 20, { goal: readFrame3d({ x: 35, y: 25, z: 15 }) }),
      member("m1", "m0", 20),
    ] as const;
    const first = solveChain3d(ROOT, members);
    const second = solveChain3d(ROOT, members);
    const permuted = solveChain3d(ROOT, [...members].reverse());
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(first.rotations3d)).toBe(JSON.stringify(permuted.rotations3d));
    expect(Object.is(first.quality.residual, second.quality.residual)).toBe(true);
  });

  it("TH-61 bends a 3D chain toward an authored pole and preserves the unbound default", () => {
    const members = [
      member("m0", "root", 20),
      member("m1", "m0", 20),
      member("m2", "m1", 20, { goal: readFrame3d({ x: 30, y: 0, z: 0 }) }),
    ];
    const defaultResult = solveChain3d(ROOT, members);
    const explicitDefault = solveChain3d(ROOT, members, UNBOUND_POLE3D);
    expect(JSON.stringify(defaultResult.rotations3d)).toBe(
      JSON.stringify(explicitDefault.rotations3d),
    );
    const pole: Pole3d = { kind: "point", point: [15, 0, -50] };
    const bound = solveChain3d(ROOT, members, pole);
    const composed = composeChain3d(ROOT, members, bound);
    const first = composed.m0;
    if (first === undefined) throw new Error("missing first member");
    const side = perpendicularSide([first.x, first.y, first.z], [30, 0, 0], [15, 0, -50]);
    expect(side).toBeGreaterThan(0);
  });

  it("TH-62 restores magnitude images and handles all degenerate tree shapes", () => {
    const huge = 2 ** 600;
    const image = 2 ** 499;
    const makeScaled = (scale: number): readonly ChainMember3d[] =>
      [0, 1, 2, 3].map((index) =>
        member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 20 * scale, {
          offset: { x: scale, y: 2 * scale, z: 0 },
          ...(index === 3
            ? { goal: readFrame3d({ x: 40 * scale, y: 30 * scale, z: 20 * scale }) }
            : {}),
        }),
      );
    const large = solveChain3d(readFrame3d({ x: 3 * huge, z: -huge }), makeScaled(huge));
    const small = solveChain3d(readFrame3d({ x: 3 * image, z: -image }), makeScaled(image));
    expect(JSON.stringify(large.rotations3d)).toBe(JSON.stringify(small.rotations3d));
    expect(large.quality.kind).toBe(small.quality.kind);
    expect(large.quality.residual).toBe(small.quality.residual * 2 ** 101);

    const cases: readonly [string, readonly ChainMember3d[], string][] = [
      [
        "zero",
        [
          member("a", "root", 0),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 10, y: 10 }) }),
        ],
        "converged",
      ],
      [
        "root",
        [member("a", "root", 20), member("b", "a", 20), member("c", "b", 20, { goal: ROOT })],
        "converged",
      ],
      [
        "far",
        [
          member("a", "root", 20),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 100 }) }),
        ],
        "stalled",
      ],
      [
        "inside",
        [
          member("a", "root", 20),
          member("b", "a", 20),
          member("c", "b", 20, { goal: readFrame3d({ x: 15, y: 4 }) }),
        ],
        "converged",
      ],
      ["single", [member("only", "root", 20, { goal: readFrame3d({ y: 10, z: 10 }) })], "stalled"],
      [
        "orphan",
        [
          member("a", "root", 20),
          member("b", "a", 20, { goal: readFrame3d({ x: 20, y: 10, z: 3 }) }),
          member("orphan", "nowhere", 4),
        ],
        "converged",
      ],
    ];
    for (const [name, members, kind] of cases) {
      const result = solveChain3d(ROOT, members);
      expect(result.quality.kind, name).toBe(kind);
      expect(allFinite(result), name).toBe(true);
      expect(Object.values(result.rotations3d)).toHaveLength(members.length);
    }
  });

  it("TH-63 implements swingFrame3d's aligned, antiparallel, and orthonormal cases", () => {
    const identity = matrixFromEuler3d(ZERO_EULER);
    expect(swingFrame3d(identity, [1, 0, 0])).toEqual(identity);
    expect(swingFrame3d(identity, [-1, 0, 0])).toEqual([-1, 0, 0, 0, -1, 0, 0, 0, 1]);
    const turned = matrixFromEuler3d({ rotation: 30, rotationX: 20, rotationY: -15 });
    const swung = swingFrame3d(turned, [0, 2, 3]);
    const axis = multiplyVector3(swung, [1, 0, 0]);
    expect(axis[0]).toBeCloseTo(0, 12);
    expect(axis[1]).toBeCloseTo(0.5547001962252291, 12);
    expect(axis[2]).toBeCloseTo(0.8320502943378437, 12);
    for (const column of columns(swung)) expect(Math.hypot(...column)).toBeCloseTo(1, 12);
    const [first, second, third] = columns(swung);
    expect(dot3(first, second)).toBeCloseTo(0, 12);
    expect(dot3(first, third)).toBeCloseTo(0, 12);
    expect(dot3(second, third)).toBeCloseTo(0, 12);
  });

  it("TH-64 selects a deterministic conflicted tree result", () => {
    const members = [
      member("a", "root", 20),
      member("b1", "a", 20, { goal: readFrame3d({ x: 40 }) }),
      member("b2", "a", 20, { goal: readFrame3d({ x: -40 }) }),
    ];
    const result = solveChain3d(ROOT, members);
    const permutation = solveChain3d(ROOT, [...members].reverse());
    expect(result.quality.kind).toBe("conflicted");
    expect(allFinite(result)).toBe(true);
    expect(JSON.stringify(result.rotations3d)).toBe(JSON.stringify(permutation.rotations3d));
  });

  it("TH-65 publishes iterative quality kinds through ik3d inspection", () => {
    const inspect = (inputs: unknown) =>
      ik3dPlugin.compose({ inspect: true }, 1, inputs as PluginInputs, "solve").inspection as {
        readonly kind: string;
        readonly residual: number;
        readonly residuals: Readonly<Record<string, number>>;
      };
    const serial = [member("a", "root", 20), member("b", "a", 20), member("c", "b", 20)];
    const stalled = inspect(composedInputs(ROOT, readFrame3d({ x: 100 }), serial));
    expect(stalled.kind).toBe("stalled");
    expect(stalled.residuals).toEqual({ c: stalled.residual });

    const converged = inspect(composedInputs(ROOT, readFrame3d({ x: 15, y: 4 }), serial));
    expect(converged.kind).toBe("converged");

    const branch = [
      member("a", "root", 20),
      member("b1", "a", 20, { goal: readFrame3d({ x: 40 }) }),
      member("b2", "a", 20, { goal: readFrame3d({ x: -40 }) }),
    ];
    const conflicted = inspect({
      root: ROOT,
      members: branch.map((item) => ({
        id: item.id,
        base: item.base,
        values: { length: item.length, ...item.offset, ...item.rest },
        progress: 1,
        ...(item.goal === undefined ? {} : { goal: item.goal }),
      })),
    });
    expect(conflicted.kind).toBe("conflicted");
  });

  it("TH-66 dispatches two-bone, single, long, and branched chain shapes", () => {
    const first = member("a", "root", 30);
    const second = member("b", "a", 20, { goal: readFrame3d({ x: 30, y: 10 }) });
    const direct = solveTwoBone3d(ROOT, second.goal!, first, second);
    expect(chainShape3d([first, second])).toEqual({
      kind: "two-bone",
      first,
      second,
      goal: second.goal,
    });
    expect(solveChain3d(ROOT, [first, second])).toEqual(direct);
    expect(chainShape3d([member("only", "root", 20, { goal: readFrame3d({ x: 1 }) })]).kind).toBe(
      "tree",
    );
    expect(
      chainShape3d([first, second, member("c", "b", 10, { goal: readFrame3d({ x: 1 }) })]).kind,
    ).toBe("tree");
    expect(
      chainShape3d([
        member("a", "root", 20),
        member("l", "a", 20, { goal: readFrame3d({ x: 10 }) }),
        member("r", "a", 20, { goal: readFrame3d({ x: -10 }) }),
      ]).kind,
    ).toBe("tree");
    expect(() => chainShape3d([member("none", "root", 1)])).toThrow(/requires at least one goal/);
  });
  it("TH-67 matches every branch residual to an independently composed FK tip", () => {
    const members = [
      member("trunk", "root", 25),
      member("left", "trunk", 20),
      member("left-tip", "left", 20, { goal: readFrame3d({ x: 25, y: 20, z: 10 }) }),
      member("right", "trunk", 20),
      member("right-tip", "right", 20, { goal: readFrame3d({ x: 25, y: -20, z: -10 }) }),
    ];
    const result = solveChain3d(ROOT, members);
    const composed = composeChain3d(ROOT, members, result);
    const goals: Readonly<Record<string, WorldFrame3d>> = {
      "left-tip": members[2]!.goal!,
      "right-tip": members[4]!.goal!,
    };
    const actual: Record<string, number> = {};
    for (const id of ["left-tip", "right-tip"] as const) {
      const tip = composed[id];
      if (tip === undefined) throw new Error(`missing composed tip ${id}`);
      actual[id] = frameDistance3d(tip, goals[id]!);
      expect(Math.abs(result.residuals[id]! - actual[id]!)).toBeLessThanOrEqual(1e-9);
    }
    expect(result.quality.residual).toBeCloseTo(
      Math.max(actual["left-tip"]!, actual["right-tip"]!),
      12,
    );
  });

  it("TH-68 reconstructs rest roll as swing and zero-rest frames as pure swings", () => {
    const random = seeded(0x68_500);
    for (let sample = 0; sample < 40; sample += 1) {
      const members: ChainMember3d[] = [];
      for (let index = 0; index < 5; index += 1) {
        members.push(
          member(`m${index}`, index === 0 ? "root" : `m${index - 1}`, 18 + random() * 8, {
            offset: { x: random() * 3 - 1.5, y: random() * 3 - 1.5, z: random() * 3 - 1.5 },
            rest: {
              rotation: random() * 180 - 90,
              rotationX: random() * 60 - 30,
              rotationY: random() * 60 - 30,
            },
          }),
        );
      }
      const direction: Vec3 = [random() - 0.5, random() - 0.5, random() - 0.5];
      const directionSize = Math.hypot(direction[0], direction[1], direction[2]);
      const reach = members.reduce((sum, item) => sum + item.length, 0);
      const distance = reach * (0.25 + random() * 0.45);
      const goal = readFrame3d({
        x: (direction[0] / directionSize) * distance,
        y: (direction[1] / directionSize) * distance,
        z: (direction[2] / directionSize) * distance,
      });
      members[4] = { ...members[4]!, goal };
      const result = solveChain3d(ROOT, members);
      expect(result.quality.kind).toBe("converged");
      const composed = composeChain3d(ROOT, members, result);
      for (const item of members) {
        const world = composed[item.id];
        if (world === undefined) throw new Error(`missing composed member ${item.id}`);
        const parent = item.base === "root" ? ROOT : composed[item.base];
        if (parent === undefined) throw new Error(`missing composed parent ${item.base}`);
        const restUnderParent = multiplyMatrix3(
          matrixFromEuler3d(parent),
          matrixFromEuler3d(item.rest),
        );
        const worldMatrix = matrixFromEuler3d(world);
        const direction = [worldMatrix[0], worldMatrix[3], worldMatrix[6]] as const;
        const expected = swingFrame3d(restUnderParent, direction);
        for (let entry = 0; entry < 9; entry += 1)
          expect(Math.abs(worldMatrix[entry]! - expected[entry]!)).toBeLessThanOrEqual(1e-12);
      }
    }

    const zeroRestMembers = [
      member("a", "root", 24),
      member("b", "a", 21),
      member("c", "b", 19, { goal: readFrame3d({ x: 20, y: 15, z: 12 }) }),
    ];
    const zeroResult = solveChain3d(ROOT, zeroRestMembers);
    const zeroComposed = composeChain3d(ROOT, zeroRestMembers, zeroResult);
    for (const item of zeroRestMembers) {
      const world = zeroComposed[item.id];
      if (world === undefined) throw new Error(`missing zero-rest member ${item.id}`);
      const parent = item.base === "root" ? ROOT : zeroComposed[item.base];
      if (parent === undefined) throw new Error(`missing zero-rest parent ${item.base}`);
      const worldMatrix = matrixFromEuler3d(world);
      const direction = [worldMatrix[0], worldMatrix[3], worldMatrix[6]] as const;
      const expected = swingFrame3d(matrixFromEuler3d(parent), direction);
      for (let entry = 0; entry < 9; entry += 1)
        expect(Math.abs(worldMatrix[entry]! - expected[entry]!)).toBeLessThanOrEqual(1e-12);
    }
  });

  it("TH-69 places lateral offsets through the parent's rolled frame", () => {
    const goal = readFrame3d({ x: 50, y: 20, z: 30 });
    const members = [
      member("parent", "root", 30, {
        rest: { rotation: 0, rotationX: 70, rotationY: 0 },
      }),
      member("offset-child", "parent", 30, { offset: { x: 0, y: 8, z: 0 } }),
      member("tip", "offset-child", 25, { goal }),
    ];
    const result = solveChain3d(ROOT, members);
    expect(result.quality.kind).toBe("converged");
    const composed = composeChain3d(ROOT, members, result);
    const tip = composed.tip;
    if (tip === undefined) throw new Error("missing rolled-offset tip");
    expect(frameDistance3d(tip, goal)).toBeLessThanOrEqual(1e-3);

    const parent = composed.parent;
    const child = composed["offset-child"];
    if (parent === undefined || child === undefined)
      throw new Error("missing rolled-offset parent");
    const parentMatrix = matrixFromEuler3d(parent);
    const childMatrix = matrixFromEuler3d(child);
    const parentDirection: Vec3 = [parentMatrix[0], parentMatrix[3], parentMatrix[6]];
    const noRollParent = swingFrame3d(matrixFromEuler3d(ZERO_EULER), parentDirection);
    const wrongPivot = multiplyVector3(noRollParent, [0, 8, 0]);
    const wrongTip: Vec3 = [
      parent.x + wrongPivot[0] + childMatrix[0] * 25,
      parent.y + wrongPivot[1] + childMatrix[3] * 25,
      parent.z + wrongPivot[2] + childMatrix[6] * 25,
    ];
    expect(
      Math.hypot(wrongTip[0] - goal.x, wrongTip[1] - goal.y, wrongTip[2] - goal.z),
    ).toBeGreaterThan(1e-3);
  });

  it("TH-75 preserves direction residuals, restores unreachable scale, and uses +x for zero distance", () => {
    const directionMembers = [
      member("only", "root", 10, { goal: { x: Infinity, y: 0, z: 0, ...ZERO_EULER } }),
    ];
    const direction = solveChain3d(ROOT, directionMembers);
    expect(direction.residuals.only).toBe(Number.POSITIVE_INFINITY);
    expect(direction.quality.residual).toBe(Number.POSITIVE_INFINITY);

    const scale = 2 ** 600;
    const nativeMembers = [
      member("a", "root", 10),
      member("b", "a", 10),
      member("c", "b", 10, { goal: readFrame3d({ x: 100, y: 0, z: 0 }) }),
    ];
    const native = solveChain3d(ROOT, nativeMembers);
    expect(native.quality.kind).toBe("stalled");
    const scaledMembers = [
      member("a", "root", 10 * scale),
      member("b", "a", 10 * scale),
      member("c", "b", 10 * scale, { goal: readFrame3d({ x: 100 * scale, y: 0, z: 0 }) }),
    ];
    const scaled = solveChain3d(ROOT, scaledMembers);
    expect(scaled.quality.residual).toBe(native.quality.residual * scale);
    expect(scaled.residuals.c).toBe(native.residuals.c! * scale);

    expect(place3d([1, 2, 3], [1, 2, 3], 4)).toEqual([5, 2, 3]);
    expect(place3d([1, 2, 3], [1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
});
