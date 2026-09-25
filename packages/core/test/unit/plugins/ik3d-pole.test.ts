import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { declaresPole, POLE_SLOT } from "../../../src/contract/solver-shape";
import {
  PluginRegistry,
  type PluginDefinition,
  type PluginInputs,
} from "../../../src/domain/plugins";
import type { ImmutableRecord } from "../../../src/domain/values";
import { buildGraphIR } from "../../../src/graph/ir";
import { fkPlugin } from "../../../src/plugins/fk";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import {
  composeWorld3d,
  effectiveLink3d,
  pivotFromBase3d,
  readFrame3d,
  ZERO_EULER,
  type PivotOffset3d,
  type WorldFrame3d,
} from "../../../src/plugins/frame3d";
import { ikPlugin } from "../../../src/plugins/ik";
import { solveTwoBone } from "../../../src/plugins/ik-analytic";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import {
  readPole3d,
  solveTwoBone3d,
  UNBOUND_POLE3D,
  type Pole3d,
  type SolveMember3d,
} from "../../../src/plugins/ik3d-analytic";
import { transformPlugin } from "../../../src/plugins/transform";
import { transform3dPlugin } from "../../../src/plugins/transform3d";

type Vec = readonly [number, number, number];

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

function sub(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a: Vec, b: Vec): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vec, b: Vec): Vec {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function length(a: Vec): number {
  return Math.hypot(a[0], a[1], a[2]);
}

function at(frame: WorldFrame3d): Vec {
  return [frame.x, frame.y, frame.z];
}

function turnDistance(a: number, b: number): number {
  const d = a - b;
  return Math.abs(d - 360 * Math.round(d / 360));
}

function compose(
  base: WorldFrame3d,
  values: Readonly<ImmutableRecord>,
  id: string,
  solver: unknown,
): WorldFrame3d {
  // The graph delivers a solve result as an immutable record; the fixture hands the composer the
  // same bytes without restating that type for every solver shape it passes.
  const inputs = { base, solver } as unknown as PluginInputs;
  return fk3dPlugin.compose(values, 1, inputs, id) as WorldFrame3d;
}

/** The solved chain's effective elbow (the second pivot) and tip, composed through `fk3d`. */
function chainOf(
  root: WorldFrame3d,
  first: SolveMember3d,
  second: SolveMember3d,
  solver: unknown,
): { readonly elbow: Vec; readonly tip: Vec } {
  const upper = compose(root, { length: first.length, ...first.offset }, first.id, solver);
  const fore = compose(upper, { length: second.length, ...second.offset }, second.id, solver);
  return { elbow: at(composeWorld3d(upper, { ...second.offset, ...ZERO_EULER })), tip: at(fore) };
}

function point(x: number, y: number, z: number): Pole3d {
  return { kind: "point", point: [x, y, z] };
}

function pointOf(pole: Pole3d): Vec {
  if (pole.kind !== "point") throw new Error("the fixture needs a bound pole");
  return pole.point;
}

type Rig = {
  readonly root: WorldFrame3d;
  readonly first: SolveMember3d;
  readonly second: SolveMember3d;
  readonly pivot: Vec;
  readonly goal: WorldFrame3d;
};

/** A seeded rig with offsets in all three axes and a goal strictly inside its reach band. */
function rigOf(random: () => number): Rig {
  const root = readFrame3d({
    x: random() * 200 - 100,
    y: random() * 200 - 100,
    z: random() * 200 - 100,
    rotation: random() * 720 - 360,
    rotationX: random() * 720 - 360,
    rotationY: random() * 720 - 360,
  });
  const offset = (): PivotOffset3d => ({
    x: random() * 40 - 20,
    y: random() * 40 - 20,
    z: random() * 40 - 20,
  });
  const first = { id: "upper", length: 20 + random() * 80, offset: offset() };
  const second = { id: "fore", length: 20 + random() * 80, offset: offset() };
  const pivot = pivotFromBase3d(root, first.offset);
  const link = effectiveLink3d(first.length, second.offset).length;
  const near = Math.abs(link - second.length);
  const reach = near + (link + second.length - near) * (0.1 + random() * 0.8);
  const direction: Vec = [random() * 2 - 1, random() * 2 - 1, random() * 2 - 1];
  const unit = length(direction);
  const goal = readFrame3d({
    x: pivot[0] + (direction[0] / unit) * reach,
    y: pivot[1] + (direction[1] / unit) * reach,
    z: pivot[2] + (direction[2] / unit) * reach,
  });
  return { root, first, second, pivot, goal };
}

function solveOf(rig: Rig, pole: Pole3d = UNBOUND_POLE3D) {
  return solveTwoBone3d(rig.root, rig.goal, rig.first, rig.second, pole);
}

/**
 * The sign of the elbow's side against the pole's, measured perpendicular to the line from the
 * pivot to the goal in directions only, so a pole near the float ceiling is still a finite side.
 */
function sideOf(rig: Rig, pole: Pole3d, elbow: Vec): number {
  const place = pointOf(pole);
  const unitOf = (v: Vec): Vec => {
    const big = Math.max(...v.map(Math.abs));
    const w: Vec = [v[0] / big, v[1] / big, v[2] / big];
    const n = length(w);
    return [w[0] / n, w[1] / n, w[2] / n];
  };
  const line = unitOf(sub(at(rig.goal), rig.pivot));
  const off = (v: Vec): Vec => {
    const u = unitOf(v);
    const along = dot(u, line);
    return [u[0] - line[0] * along, u[1] - line[1] * along, u[2] - line[2] * along];
  };
  const toPole: Vec = [
    place[0] / 2 - rig.pivot[0] / 2,
    place[1] / 2 - rig.pivot[1] / 2,
    place[2] / 2 - rig.pivot[2] / 2,
  ];
  return dot(off(toPole), off(sub(elbow, rig.pivot)));
}

describe("3D pole target", () => {
  it("TH-40 reads an absent slot as unbound and every coordinate through readNumber", () => {
    expect(readPole3d(undefined)).toBe(UNBOUND_POLE3D);
    expect(UNBOUND_POLE3D).toEqual({ kind: "unbound" });
    expect(Object.isFrozen(UNBOUND_POLE3D)).toBe(true);
    expect(readPole3d({ x: 1, y: NaN, z: Infinity })).toEqual(point(1, 0, 0));
    expect(readPole3d({ x: 3, y: -4, z: 5, rotation: 90 })).toEqual(point(3, -4, 5));
    // A delivered 2D source publishes no `z`, which reads as zero exactly as a goal's does.
    expect(readPole3d({ x: 3, y: -4 })).toEqual(point(3, -4, 0));

    // A direct caller's pole is re-read by the same owner, so a non-finite coordinate is zero there
    // too rather than a NaN normal.
    const root = readFrame3d({ x: 1, y: 2, z: 3, rotation: 30, rotationX: -20, rotationY: 40 });
    const goal = readFrame3d({ x: 60, y: 40, z: 20 });
    const first = { id: "a", length: 50, offset: { x: 2, y: 1, z: -3 } };
    const second = { id: "b", length: 40, offset: { x: 3, y: -2, z: 4 } };
    const read = solveTwoBone3d(root, goal, first, second, point(0, 100, 0));
    expect(solveTwoBone3d(root, goal, first, second, point(NaN, 100, -Infinity))).toEqual(read);
    expect(
      Object.values(read.rotations3d).every((e) => Object.values(e).every(Number.isFinite)),
    ).toBe(true);
  });

  it("TH-41 keeps the unbound solve byte for byte, direct and through the plugin", () => {
    const random = seeded(0x50041);
    for (let sample = 0; sample < 500; sample += 1) {
      const { root, first, second, goal } = rigOf(random);
      const phase2 = solveTwoBone3d(root, goal, first, second);
      expect(solveTwoBone3d(root, goal, first, second, UNBOUND_POLE3D)).toEqual(phase2);
      expect(solveTwoBone3d(root, goal, first, second, readPole3d(undefined))).toEqual(phase2);
    }
    const members = [
      { id: "upper", base: "root", values: { length: 80, x: 4, y: -2, z: 3 }, progress: 1 },
      { id: "fore", base: "upper", values: { length: 60, x: -6, y: 5, z: 1 }, progress: 1 },
    ];
    const inputs = {
      root: readFrame3d({ rotation: 25, rotationX: -15 }),
      target: readFrame3d({ x: 70, y: 40, z: 50 }),
      members,
    };
    const absent = ik3dPlugin.compose({}, 1, inputs, "solve");
    // An absent slot and an explicitly undefined one are the same delivery.
    const undelivered = { ...inputs, [POLE_SLOT]: undefined } as unknown as PluginInputs;
    expect(ik3dPlugin.compose({}, 1, undelivered, "solve")).toEqual(absent);
    const bound = ik3dPlugin.compose(
      {},
      1,
      { ...inputs, [POLE_SLOT]: { x: 0, y: -90, z: 0 } },
      "solve",
    );
    expect(bound).not.toEqual(absent);
  });

  it("TH-42 closes 2,000 seeded pole rigs and bends every elbow toward its pole", () => {
    const random = seeded(0x50042);
    let worstMiss = 0;
    let worstPlane = 0;
    for (let sample = 0; sample < 2_000; sample += 1) {
      const { root, first, second, pivot, goal } = rigOf(random);
      const pole = point(random() * 400 - 200, random() * 400 - 200, random() * 400 - 200);
      const result = solveTwoBone3d(root, goal, first, second, pole);
      expect(result.quality.kind).toBe("reached");
      const { elbow, tip } = chainOf(root, first, second, result);
      const miss = length(sub(tip, at(goal)));
      worstMiss = Math.max(worstMiss, miss);
      expect(miss).toBeLessThanOrEqual(1e-9 * Math.max(1, ...at(goal).map(Math.abs)));

      // The plane through the pivot, the goal and the pole holds the elbow, and the elbow lies on
      // the pole's side of the line from the pivot to the goal.
      const line = sub(at(goal), pivot);
      const unit = line.map((c) => c / length(line)) as unknown as Vec;
      const toPole = sub(pointOf(pole), pivot);
      const toElbow = sub(elbow, pivot);
      const normal = cross(unit, toPole);
      const plane = Math.abs(dot(toElbow, normal)) / (length(normal) * length(toElbow));
      worstPlane = Math.max(worstPlane, plane);
      expect(plane).toBeLessThanOrEqual(1e-9);
      const poleSide = sub(toPole, unit.map((c) => c * dot(toPole, unit)) as unknown as Vec);
      const elbowSide = sub(toElbow, unit.map((c) => c * dot(toElbow, unit)) as unknown as Vec);
      expect(dot(poleSide, elbowSide)).toBeGreaterThan(0);
    }
    expect(worstMiss).toBeLessThan(1e-9);
    expect(worstPlane).toBeLessThan(1e-9);
  });

  it("TH-43 reads a pole on the line through the pivot and the goal as the default rule", () => {
    const random = seeded(0x50043);
    for (let sample = 0; sample < 500; sample += 1) {
      const { root, first, second, pivot, goal } = rigOf(random);
      const unbound = solveTwoBone3d(root, goal, first, second);
      const line = sub(at(goal), pivot);
      for (const t of [0, 1, 2.5, -1.5]) {
        const pole = point(pivot[0] + line[0] * t, pivot[1] + line[1] * t, pivot[2] + line[2] * t);
        expect(solveTwoBone3d(root, goal, first, second, pole)).toEqual(unbound);
      }
    }
    // A goal on the pivot has no line, and the solve's `e1` is the root's local +x: a pole along it
    // is on the line as well, so the coincident rest pose is the unbound one.
    const root = readFrame3d({ rotation: 90 });
    const first = { id: "a", length: 10, offset: { x: 0, y: 0, z: 0 } };
    const second = { id: "b", length: 10, offset: { x: 0, y: 0, z: 0 } };
    expect(solveTwoBone3d(root, root, first, second, point(0, 50, 0))).toEqual(
      solveTwoBone3d(root, root, first, second),
    );
  });

  it("TH-44 a pole on the default elbow's side reproduces the default pose", () => {
    const random = seeded(0x50044);
    for (let sample = 0; sample < 500; sample += 1) {
      const { root, first, second, pivot, goal } = rigOf(random);
      const unbound = solveTwoBone3d(root, goal, first, second);
      const { elbow } = chainOf(root, first, second, unbound);
      // Any point off the line on the default elbow's side names the default plane and side.
      for (const reach of [1, 7.5]) {
        const pole = point(
          pivot[0] + (elbow[0] - pivot[0]) * reach,
          pivot[1] + (elbow[1] - pivot[1]) * reach,
          pivot[2] + (elbow[2] - pivot[2]) * reach,
        );
        const authored = solveTwoBone3d(root, goal, first, second, pole);
        expect(authored.quality.kind).toBe(unbound.quality.kind);
        const solved = chainOf(root, first, second, authored);
        expect(length(sub(solved.elbow, elbow))).toBeLessThanOrEqual(1e-9 * (1 + length(elbow)));
        for (const id of ["upper", "fore"])
          for (const key of ["rotation", "rotationX", "rotationY"] as const)
            expect(
              turnDistance(authored.rotations3d[id]![key], unbound.rotations3d[id]![key]),
            ).toBeLessThanOrEqual(1e-7);
      }
    }
  });

  it("TH-45 scales a huge pole with the rig and keeps a far pole's small rig closed", () => {
    const root = readFrame3d({ x: 0, y: 0, z: 0, rotation: 20, rotationX: 10, rotationY: -15 });
    const huge = {
      target: readFrame3d({ x: 1e300, y: 2e300, z: -1e300 }),
      first: { id: "a", length: 2e300, offset: { x: 3e300, y: -1e300, z: 2e300 } },
      second: { id: "b", length: 1e300, offset: { x: -2e300, y: 4e300, z: 1e300 } },
      pole: point(-5e300, 7e300, 3e300),
    };
    const factor = 2 ** -1000;
    const scaled = (v: number) => v * factor;
    const result = solveTwoBone3d(root, huge.target, huge.first, huge.second, huge.pole);
    const image = solveTwoBone3d(
      root,
      { ...huge.target, x: scaled(1e300), y: scaled(2e300), z: scaled(-1e300) },
      {
        id: "a",
        length: scaled(2e300),
        offset: { x: scaled(3e300), y: scaled(-1e300), z: scaled(2e300) },
      },
      {
        id: "b",
        length: scaled(1e300),
        offset: { x: scaled(-2e300), y: scaled(4e300), z: scaled(1e300) },
      },
      point(scaled(-5e300), scaled(7e300), scaled(3e300)),
    );
    expect(result.rotations3d).toEqual(image.rotations3d);
    expect(result.rotations3d).not.toEqual(
      solveTwoBone3d(root, huge.target, huge.first, huge.second).rotations3d,
    );

    // A pole is a position, so it is counted in the magnitude policy only when bound. A small rig
    // whose pole sits near the float ceiling on all three axes solves as its exact image: read
    // natively, the pivot-to-pole distance would overflow to infinity and the pole would read as
    // on the line. The rig is the first seeded one whose default elbow is on the far side, so the
    // default rule cannot pass for the pole's.
    const random = seeded(0x50045);
    const far = point(1.5e308, 1.5e308, 1.5e308);
    for (;;) {
      const small = rigOf(random);
      const unbound = chainOf(small.root, small.first, small.second, solveOf(small));
      if (sideOf(small, far, unbound.elbow) >= 0) continue;
      const solved = solveOf(small, far);
      expect(solved.quality.kind).toBe("reached");
      const { elbow, tip } = chainOf(small.root, small.first, small.second, solved);
      expect(length(sub(tip, at(small.goal)))).toBeLessThanOrEqual(1e-9 * 100);
      expect(sideOf(small, far, elbow)).toBeGreaterThan(0);
      break;
    }
  });

  it("TH-46 bends a planar rig to either side exactly as the 2D closed form's two branches", () => {
    const random = seeded(0x50046);
    for (let sample = 0; sample < 500; sample += 1) {
      const root = {
        x: random() * 200 - 100,
        y: random() * 200 - 100,
        rotation: random() * 720 - 360,
      };
      const l1 = 10 + random() * 90;
      const l2 = 10 + random() * 90;
      const near = Math.abs(l1 - l2);
      const reach = near + (l1 + l2 - near) * (0.1 + random() * 0.8);
      const angle = random() * Math.PI * 2;
      const goal = { x: root.x + Math.cos(angle) * reach, y: root.y + Math.sin(angle) * reach };
      // A point on the goal line's left (counter-clockwise) side, and its mirror.
      const side = 10 + random() * 200;
      const along = random() * 200 - 100;
      const left = point(
        root.x + Math.cos(angle) * along - Math.sin(angle) * side,
        root.y + Math.sin(angle) * along + Math.cos(angle) * side,
        0,
      );
      const right = point(
        root.x + Math.cos(angle) * along + Math.sin(angle) * side,
        root.y + Math.sin(angle) * along - Math.cos(angle) * side,
        0,
      );
      const spatialRoot = readFrame3d(root);
      const first = { id: "a", length: l1, offset: { x: 0, y: 0, z: 0 } };
      const second = { id: "b", length: l2, offset: { x: 0, y: 0, z: 0 } };
      for (const [pole, flip] of [
        [left, false],
        [right, true],
      ] as const) {
        const spatial = solveTwoBone3d(spatialRoot, readFrame3d(goal), first, second, pole);
        const planar = solveTwoBone(
          root,
          { ...goal, rotation: 0 },
          { id: "a", base: "root", length: l1 },
          { id: "b", base: "a", length: l2 },
          flip,
        );
        expect(spatial.quality.kind).toBe(planar.quality.kind);
        const upperAngle = ((root.rotation + planar.rotations.a!) * Math.PI) / 180;
        const foreAngle = upperAngle + (planar.rotations.b! * Math.PI) / 180;
        const planarElbow: Vec = [
          root.x + Math.cos(upperAngle) * l1,
          root.y + Math.sin(upperAngle) * l1,
          0,
        ];
        const planarTip: Vec = [
          planarElbow[0] + Math.cos(foreAngle) * l2,
          planarElbow[1] + Math.sin(foreAngle) * l2,
          0,
        ];
        const { elbow, tip } = chainOf(spatialRoot, first, second, spatial);
        expect(length(sub(elbow, planarElbow))).toBeLessThanOrEqual(1e-9 * 200);
        expect(length(sub(tip, planarTip))).toBeLessThanOrEqual(1e-9 * 200);
        expect(Math.abs(elbow[2])).toBeLessThanOrEqual(1e-9 * 200);
      }
      // The left pole is the unbound planar solve's own side, so it is the 2D positive branch.
      const unbound = chainOf(
        spatialRoot,
        first,
        second,
        solveTwoBone3d(spatialRoot, readFrame3d(goal), first, second),
      );
      const leftSolved = chainOf(
        spatialRoot,
        first,
        second,
        solveTwoBone3d(spatialRoot, readFrame3d(goal), first, second, left),
      );
      expect(length(sub(leftSolved.elbow, unbound.elbow))).toBeLessThanOrEqual(1e-9 * 200);
    }
  });
});

/** A track's authored keyframes as the fixtures build them: always present. */
type Keyframes = NonNullable<TrackDefinition["keyframes"]>;

function track(id: string, keyframes: Keyframes): TrackDefinition {
  return { id, keyframes };
}

function rigWith(solve: TrackDefinition, upperExtra: Keyframes = {}) {
  const project: ProjectDefinition = {
    schemaVersion: 5,
    projectId: "pole",
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          track("root", { transform3d: { values: { x: 0, y: 0, z: 0 } } }),
          track("goal", { transform3d: { values: { x: 70, y: 40, z: 50 } } }),
          track("knee", { transform3d: { values: { x: 0, y: 100, z: 0 } } }),
          solve,
          track("upper", {
            fk3d: { values: { length: 80 }, requires: { base: "root", solver: "solve" } },
            ...upperExtra,
          }),
          track("fore", {
            fk3d: { values: { length: 60 }, requires: { base: "upper", solver: "solve" } },
          }),
        ],
      },
    ],
  };
  return project;
}

function ruleIds(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map((d) => d.ruleId);
}

describe("3D pole load rule", () => {
  const solver = (requires: Record<string, string>) =>
    track("solve", { ik3d: { requires: { root: "root", target: "goal", ...requires } } });

  it("TH-47 refuses a declared pole bound away from the chain's root, and only that", () => {
    // A pole on the solver, under the group that bound `root`, loads clean.
    expect(ruleIds(rigWith(solver({ pole: "knee" })))).toEqual([]);

    // The mistake the rule names: an `ik3d` group on the elbow member holding only the pole.
    const elbow = buildGraphIR(
      rigWith(solver({}), { ik3d: { requires: { pole: "knee" } } }),
    ).diagnostics;
    expect(elbow.map((d) => [d.ruleId, d.path])).toEqual([
      ["ik-pole-without-chain", "rig/upper.keyframes.ik3d.requires.pole"],
    ]);

    // A pole under a plugin that declares none is the registry's unknown requirement, never this
    // rule: one mistake, one rule.
    const onMember = rigWith(solver({}));
    const member = onMember.motions[0]!.tracks[4]!;
    const fk3dGroup = member.keyframes!.fk3d as unknown as { requires: Record<string, string> };
    fk3dGroup.requires.pole = "knee";
    expect(ruleIds(onMember)).toEqual([]);
    const plugins = [fk3dPlugin, ik3dPlugin, transform3dPlugin];
    expect(unknownRequirements(onMember, plugins)).toEqual([
      "rig/upper.keyframes.fk3d.requires.pole",
    ]);

    // The 2D solver declares no pole either, so the registry refuses it there by the same name.
    const planar: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "planar",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            track("root", { transform: { values: { x: 0, y: 0 } } }),
            track("goal", { transform: { values: { x: 70, y: 40 } } }),
            track("knee", { transform: { values: { x: 0, y: 40 } } }),
            track("solve", {
              ik: { requires: { root: "root", target: "goal", pole: "knee" } },
            }),
            track("upper", {
              fk: { values: { length: 80 }, requires: { base: "root", solver: "solve" } },
            }),
            track("fore", {
              fk: { values: { length: 60 }, requires: { base: "upper", solver: "solve" } },
            }),
          ],
        },
      ],
    };
    expect(ruleIds(planar)).toEqual([]);
    expect(unknownRequirements(planar, [fkPlugin, ikPlugin, transformPlugin])).toEqual([
      "rig/solve.keyframes.ik.requires.pole",
    ]);

    // The contract's pole set is exactly the plugin definitions that declare the slot.
    const all: readonly PluginDefinition[] = [
      fkPlugin,
      fk3dPlugin,
      ikPlugin,
      ik3dPlugin,
      transformPlugin,
      transform3dPlugin,
    ];
    for (const plugin of all)
      expect([plugin.name, Object.hasOwn(plugin.requirements ?? {}, POLE_SLOT)]).toEqual([
        plugin.name,
        declaresPole(plugin.name),
      ]);
  });
});

/** The `plugin-unknown-requirement` paths a registry of `plugins` reports for `project`. */
function unknownRequirements(
  project: ProjectDefinition,
  plugins: readonly PluginDefinition[],
): readonly string[] {
  const registry = new PluginRegistry();
  for (const plugin of plugins) registry.register(plugin);
  return project.motions.flatMap((motion) =>
    motion.tracks.flatMap((entry) =>
      registry
        .resolveForKeyframes(entry.keyframes ?? {})
        .diagnostics.filter(({ ruleId }) => ruleId === "plugin-unknown-requirement")
        .map(({ path }) => `${motion.id}/${entry.id}.${path}`),
    ),
  );
}
