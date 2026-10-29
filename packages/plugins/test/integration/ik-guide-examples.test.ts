// @ts-nocheck
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "@motion5/core";
import { PluginCatalog } from "@motion5/core";
import { Engine } from "@motion5/core";
import { createManualClock } from "@motion5/core";
import { FABRIK_TOLERANCE } from "../../src/fabrik";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

const GUIDE = fileURLToPath(
  new URL("../../../../docs/guide/inverse-kinematics.md", import.meta.url),
);
const JSON_BLOCK = /^```json\n([\s\S]*?)^```$/gm;
const CLOSE = 1e-9;

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

interface Frame {
  readonly x?: number;
  readonly y?: number;
  readonly rotation: number;
}

interface Played {
  readonly at: (progress: number) => (track: string) => Record<string, unknown>;
}

function play(project: ProjectDefinition): Played {
  const plugins = new PluginCatalog();
  plugins.registerAll([fkPlugin, ikPlugin]);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
  const ids = project.motions[0]!.tracks.map((track) => `arm/${track.id}`);
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
        const value = snapshot.get(`arm/${track}`);
        expect(value, `arm/${track} published`).toBeDefined();
        return value as Record<string, unknown>;
      };
    },
  };
}

function frame(outputs: Record<string, unknown>, boneId: string): Frame {
  const values = (outputs.values as readonly { id: string; cells: Record<string, number> }[]) ?? [];
  const row = values.find((r) => r.id === boneId);
  expect(row, `bone ${boneId} found in pose`).toBeDefined();
  return row!.cells as unknown as Frame;
}

function rotations(outputs: Record<string, unknown>): Readonly<Record<string, number>> {
  const values = (outputs.values as readonly { id: string; cells: { rotation: number } }[]) ?? [];
  const map: Record<string, number> = {};
  for (const row of values) {
    map[`arm/${row.id}`] = row.cells.rotation;
  }
  return map;
}

function authoredFrame(project: ProjectDefinition, track: string): Frame {
  const found = project.motions[0]!.tracks.find((candidate) => candidate.id === track);
  if (found?.input?.values) {
    return found.input.values as unknown as Frame;
  }
  const goalsTrack = project.motions[0]!.tracks.find((candidate) => candidate.id === "goals");
  const goalRow = (
    goalsTrack?.input?.values as
      | readonly { id: string; cells: Record<string, number> }[]
      | undefined
  )?.find((r) => r.id === track);
  if (goalRow) {
    return goalRow.cells as unknown as Frame;
  }
  return { x: 0, y: 0, rotation: 0 };
}

function restRotation(project: ProjectDefinition, track: string): number {
  const bodyTrack = project.motions[0]!.tracks.find((candidate) => candidate.id === "body");
  const boneRow = (
    bodyTrack?.input?.values as readonly { id: string; cells: { rotation?: number } }[] | undefined
  )?.find((r) => r.id === track);
  return boneRow?.cells.rotation ?? 0;
}

function expectOnGoal(tip: Frame, goal: Frame, tolerance: number): void {
  expect(
    Math.hypot((tip.x ?? 0) - (goal.x ?? 0 ?? 0), (tip.y ?? 0) - (goal.y ?? 0 ?? 0)),
  ).toBeLessThanOrEqual(tolerance);
}

const examples = guideExamples();

describe("inverse kinematics guide examples (#349 phase 7, ADR-113)", () => {
  it("GE-1 the guide prints exactly the four examples it describes, and each one loads", () => {
    expect([...examples.keys()]).toEqual([
      "rest-to-reach",
      "staggered-weight",
      "branches",
      "transformed-root",
    ]);
    for (const project of examples.values()) expect(() => play(project)).not.toThrow();
  });

  it("GE-2 rest to reach: progress 0 is the composed rest pose and progress 1 is on the goal", () => {
    const project = examples.get("rest-to-reach")!;
    const played = play(project);
    const start = played.at(0);
    const upperRest = restRotation(project, "upper");
    const foreRest = restRotation(project, "fore");
    const shoulder = authoredFrame(project, "shoulder");
    expect(frame(start("pose"), "upper").rotation).toBeCloseTo(shoulder.rotation + upperRest, 9);
    expect(frame(start("pose"), "fore").rotation).toBeCloseTo(
      shoulder.rotation + upperRest + foreRest,
      9,
    );
    const end = played.at(1);
    expectOnGoal(frame(end("pose"), "fore"), authoredFrame(project, "hand-goal"), CLOSE);
    expect(rotations(played.at(0.5)("solve"))).toEqual(rotations(end("solve")));
  });

  it("GE-3 staggered weight: at progress 0.5 the upper arm is solved and the forearm is at rest", () => {
    const project = examples.get("staggered-weight")!;
    const middle = play(project).at(0.5);
    const solved = rotations(middle("solve"));
    const upper = frame(middle("pose"), "upper").rotation;
    expect(upper).toBeCloseTo(solved["arm/upper"]!, 9);
    expect(frame(middle("pose"), "fore").rotation).toBeCloseTo(
      upper + restRotation(project, "fore"),
      9,
    );
    expect(Math.abs(solved["arm/fore"]! - restRotation(project, "fore"))).toBeGreaterThan(1);
  });

  it("GE-4 branches: reachable goals converge and both hands land within tolerance", () => {
    const project = examples.get("branches")!;
    const end = play(project).at(1);
    const inspection = end("solve").inspect as {
      readonly kind: string;
      readonly residual: number;
    };
    expect(inspection.kind).toBe("converged");
    const solvedRows =
      (end("solve").values as readonly { id: string; cells: { residual?: number } }[]) ?? [];
    const residuals: Record<string, number> = {};
    for (const row of solvedRows) {
      if (row.cells.residual !== undefined) residuals[`arm/${row.id}`] = row.cells.residual;
    }
    expect(Object.keys(residuals).sort()).toEqual(["arm/left-fore", "arm/right-fore"]);
    for (const residual of Object.values(residuals))
      expect(residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expectOnGoal(
      frame(end("pose"), "left-fore"),
      authoredFrame(project, "left-goal"),
      FABRIK_TOLERANCE,
    );
    expectOnGoal(
      frame(end("pose"), "right-fore"),
      authoredFrame(project, "right-goal"),
      FABRIK_TOLERANCE,
    );
  });

  it("GE-5 transformed root: the hand lands, and world rotation is the root's plus the local", () => {
    const project = examples.get("transformed-root")!;
    const end = play(project).at(1);
    const shoulder = authoredFrame(project, "shoulder");
    expect(shoulder.rotation).not.toBe(0);
    expectOnGoal(frame(end("pose"), "fore"), authoredFrame(project, "hand-goal"), CLOSE);
    const solved = rotations(end("solve"));
    expect(frame(end("pose"), "upper").rotation).toBeCloseTo(
      shoulder.rotation + solved["arm/upper"]!,
      9,
    );
    expect(solved["arm/fore"]!).toBeGreaterThan(0);
  });
});
