// @ts-nocheck
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

const GUIDE = fileURLToPath(
  new URL("../../../../docs/guide/inverse-kinematics-3d.md", import.meta.url),
);
const JSON_BLOCK = /^```json\n([\s\S]*?)^```$/gm;
const CLOSE = 1e-7;

function guideExamples(): ReadonlyMap<string, ProjectDefinition> {
  const text = readFileSync(GUIDE, "utf8");
  const examples = new Map<string, ProjectDefinition>();
  for (const [, body] of text.matchAll(JSON_BLOCK)) {
    const project = JSON.parse(body!) as ProjectDefinition;
    expect(typeof project.projectId, "every guide example names itself").toBe("string");
    expect(examples.has(project.projectId!), `${project.projectId} is printed once`).toBe(false);
    examples.set(project.projectId!, project);
  }
  return examples;
}

type Values = Readonly<Record<string, unknown>>;

interface Played {
  readonly at: (progress: number) => (track: string) => Values;
}

function play(project: ProjectDefinition): Played {
  const plugins = new PluginCatalog();
  plugins.registerAll([fk3dPlugin, ik3dPlugin]);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
  const ids = project.motions[0]!.tracks.map((track) => `rig/${track.id}`);
  const latest = new Map<string, unknown>();
  for (const id of ids) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => {
      if (patch.status === "ready") {
        if (patch.outputs !== undefined) {
          latest.set(id, patch.outputs);
        } else if (patch.outputs !== undefined) {
          latest.set(id, patch.outputs);
        }
      }
    });
  }
  return {
    at(progress) {
      for (const id of ids) runtime.seek(id, progress);
      const snapshot = new Map(latest);
      return (track) => {
        if (track === "solve") {
          return snapshot.get("rig/solve") as Values;
        }
        const poseOutputs = snapshot.get("rig/pose") as
          | { values?: readonly { id: string; cells: Values }[] }
          | undefined;
        const poseRow = poseOutputs?.values?.find((r) => r.id === track);
        if (poseRow) return poseRow.cells;
        const goalsOutputs = snapshot.get("rig/goals") as
          | { values?: readonly { id: string; cells: Values }[] }
          | undefined;
        const goalsRows = goalsOutputs?.values ?? snapshot.get("rig/goals");
        if (Array.isArray(goalsRows)) {
          const goalRow = goalsRows.find((r) => r.id === track);
          if (goalRow) return goalRow.cells;
        }
        const direct = snapshot.get(`rig/${track}`);
        if (direct && !Array.isArray(direct)) return direct as Values;
        throw new Error(`Track or bone ${track} not found`);
      };
    },
  };
}

function xyz(values: Values): readonly [number, number, number] {
  return [Number(values.x ?? 0), Number(values.y ?? 0), Number(values.z ?? 0)];
}

function distance(a: Values, b: Values): number {
  const left = xyz(a);
  const right = xyz(b);
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

function inspection(solveOutputs: Values): {
  readonly kind: string;
  readonly residual: number;
  readonly residuals?: Readonly<Record<string, number>> | undefined | undefined;
  readonly atBound: readonly string[];
} {
  const inspect = solveOutputs.inspect as
    | {
        readonly kind: string;
        readonly residual?: number;
        readonly atBound?: boolean;
      }
    | undefined;
  const values =
    (solveOutputs.values as readonly {
      id: string;
      cells: { residual?: number; atBound?: boolean };
    }[]) ?? [];
  const residuals: Record<string, number> = {};
  const atBound: string[] = [];
  for (const row of values) {
    if (row.cells.residual !== undefined) residuals[`rig/${row.id}`] = row.cells.residual;
    if (row.cells.atBound) atBound.push(row.id);
  }
  return {
    kind: inspect?.kind ?? "converged",
    residual: inspect?.residual ?? 0,
    residuals: Object.keys(residuals).length > 0 ? residuals : undefined,
    atBound,
  };
}

function matrix(
  values: Values,
): readonly [number, number, number, number, number, number, number, number, number] {
  const z = (Number(values.rotation ?? 0) * Math.PI) / 180;
  const x = (Number(values.rotationX ?? 0) * Math.PI) / 180;
  const y = (Number(values.rotationY ?? 0) * Math.PI) / 180;
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  return [
    cz * cy - sz * sx * sy,
    -sz * cx,
    cz * sy + sz * sx * cy,
    sz * cy + cz * sx * sy,
    cz * cx,
    sz * sy - cz * sx * cy,
    -cx * sy,
    sx,
    cx * cy,
  ];
}

function matrixDistance(left: readonly number[], right: readonly number[]): number {
  return Math.max(...left.map((value, index) => Math.abs(value - right[index]!)));
}

function poleSide(elbow: Values, poleY: number): number {
  const goal = [70, 40, 50];
  const length = Math.hypot(...goal);
  const unit = goal.map((value) => value / length);
  const perpendicular = (point: readonly number[]) => {
    const along = point[0]! * unit[0]! + point[1]! * unit[1]! + point[2]! * unit[2]!;
    return point.map((value, index) => value - unit[index]! * along);
  };
  const elbowPoint = perpendicular(xyz(elbow));
  const polePoint = perpendicular([30, poleY, 10]);
  return (
    elbowPoint[0]! * polePoint[0]! + elbowPoint[1]! * polePoint[1]! + elbowPoint[2]! * polePoint[2]!
  );
}

const examples = guideExamples();

describe("3D inverse kinematics guide examples (#500 phase 8, ADR-095)", () => {
  it("TH-115 the guide prints exactly six executable 3D projects, and each one loads", () => {
    expect([...examples.keys()]).toEqual([
      "3d-rest-to-reach",
      "3d-pole-flip",
      "3d-offsets-staggered",
      "3d-branched-influence",
      "3d-limited-chain",
      "3d-oriented-leaf",
    ]);
    for (const project of examples.values()) expect(() => play(project)).not.toThrow();
  });

  it("TH-116 rest to reach starts in rest and reaches the world-space goal", () => {
    const project = examples.get("3d-rest-to-reach")!;
    const played = play(project);
    const start = played.at(0);
    expect(start("upper").rotation).toBe(20);
    expect(start("upper").rotationX).toBeCloseTo(-30, 9);
    expect(start("upper").rotationY).toBeCloseTo(10, 9);
    expect(distance(start("fore"), start("goal"))).toBeGreaterThan(1);
    const end = played.at(1);
    expect(distance(end("fore"), end("goal"))).toBeLessThanOrEqual(CLOSE);
    expect(end("solve").values).toBeDefined();
  });

  it("TH-117 the pole selects opposite elbow sides while both poses reach the goal", () => {
    const played = play(examples.get("3d-pole-flip")!);
    const above = played.at(0);
    const below = played.at(1);
    expect(distance(above("fore"), above("goal"))).toBeLessThanOrEqual(CLOSE);
    expect(distance(below("fore"), below("goal"))).toBeLessThanOrEqual(CLOSE);
    expect(poleSide(above("upper"), 120)).toBeGreaterThan(0);
    expect(poleSide(below("upper"), -120)).toBeGreaterThan(0);
    expect(above("upper")).not.toEqual(below("upper"));
  });

  it("TH-118 offsets are solved geometry and staggered weights finish the upper member first", () => {
    const played = play(examples.get("3d-offsets-staggered")!);
    const start = played.at(0);
    const middle = played.at(0.5);
    const end = played.at(1);
    expect(distance(start("fore"), start("goal"))).toBeGreaterThan(1);
    expect(middle("upper")).toEqual(end("upper"));
    expect(middle("fore")).not.toEqual(end("fore"));
    expect(distance(end("fore"), end("goal"))).toBeLessThanOrEqual(CLOSE);
  });

  it("TH-119 a branched tree reports inspection and influence pulls the addressed left leaf closer", () => {
    const end = play(examples.get("3d-branched-influence")!).at(1);
    const result = inspection(end("solve"));
    expect(["converged", "conflicted"]).toContain(result.kind);
    expect(result.residuals).toBeDefined();
    expect(result.residuals!["rig/left"]!).toBeLessThan(result.residuals!["rig/right"]!);
    expect(distance(end("left"), end("goal-left"))).toBeCloseTo(result.residuals!["rig/left"]!, 9);
    expect(distance(end("right"), end("goal-right"))).toBeCloseTo(
      result.residuals!["rig/right"]!,
      9,
    );
    expect(play(examples.get("3d-branched-influence")!).at(1)("left")).toEqual(end("left"));
  });

  it("TH-120 joint limits use FABRIK and report a limited pose at the bound", () => {
    const played = play(examples.get("3d-limited-chain")!);
    expect(inspection(played.at(0)("solve")).kind).toBe("converged");
    const end = inspection(played.at(1)("solve"));
    expect(end.kind).toBe("limited");
    expect(end.residual).toBeGreaterThan(0.001);
    expect(end.atBound.length).toBeGreaterThan(0);
  });

  it("TH-121 orient on a zero-length leaf reaches the goal frame without moving its tip", () => {
    const end = play(examples.get("3d-oriented-leaf")!).at(1);
    expect(distance(end("hand"), end("goal"))).toBeLessThanOrEqual(0.001);
    expect(matrixDistance(matrix(end("hand")), matrix(end("goal")))).toBeLessThanOrEqual(CLOSE);
  });
});
