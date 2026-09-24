import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { FABRIK_TOLERANCE } from "../../../src/plugins/fabrik";
import { fkPlugin } from "../../../src/plugins/fk";
import { ikPlugin } from "../../../src/plugins/ik";
import { transformPlugin } from "../../../src/plugins/transform";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

// Issue #349 phase 7 and ADR-113: the examples in `docs/guide/inverse-kinematics.md` are executed.
//
// The guide says every JSON project it prints is run by this file exactly as printed. So the cases
// read the guide itself rather than a copy, which is ADR-095's rule that a gate reads the text a
// reader sees: an example edited in the guide is the example tested, and one that stops doing what
// its paragraph says fails here. Each case checks the one behaviour its paragraph claims, in the
// terms the paragraph uses (rest pose at progress 0, tip on the goal, local versus world), rather
// than a table of doubles that would only restate today's output.

const GUIDE = fileURLToPath(
  new URL("../../../../../docs/guide/inverse-kinematics.md", import.meta.url),
);
const JSON_BLOCK = /^```json\n([\s\S]*?)^```$/gm;
const CLOSE = 1e-9;

/** Every `json` block in the guide, parsed, keyed by its `projectId`. */
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
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

interface Played {
  /** The newest ready values of `arm/<track>` after seeking every track to `progress`. */
  readonly at: (progress: number) => (track: string) => Readonly<Record<string, unknown>>;
}

/** Loads one example, mounts every track, and seeks all of them together, as the guide says. */
function play(project: ProjectDefinition): Played {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
  const ids = project.motions[0]!.tracks.map((track) => `arm/${track.id}`);
  const latest = new Map<string, Readonly<Record<string, unknown>>>();
  for (const id of ids) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => {
      if (patch.status === "ready" && patch.values !== undefined) latest.set(id, patch.values);
    });
  }
  return {
    at(progress) {
      for (const id of ids) runtime.seek(id, progress);
      const snapshot = new Map(latest);
      return (track) => {
        const values = snapshot.get(`arm/${track}`);
        expect(values, `arm/${track} published`).toBeDefined();
        return values!;
      };
    },
  };
}

function frame(values: Readonly<Record<string, unknown>>): Frame {
  return values as unknown as Frame;
}

function rotations(values: Readonly<Record<string, unknown>>): Readonly<Record<string, number>> {
  return values.rotations as Readonly<Record<string, number>>;
}

/** The authored static `transform` values of one track of the example. */
function authoredFrame(project: ProjectDefinition, track: string): Frame {
  const found = project.motions[0]!.tracks.find((candidate) => candidate.id === track);
  const keyframes = found?.keyframes as { transform?: { values?: Frame } } | undefined;
  return keyframes!.transform!.values!;
}

/** The authored static `fk.values.rotation` of one bone. */
function restRotation(project: ProjectDefinition, track: string): number {
  const found = project.motions[0]!.tracks.find((candidate) => candidate.id === track);
  const keyframes = found?.keyframes as { fk?: { values?: { rotation?: number } } } | undefined;
  return keyframes!.fk!.values!.rotation!;
}

function expectOnGoal(tip: Frame, goal: Frame, tolerance: number): void {
  expect(Math.hypot(tip.x - goal.x, tip.y - goal.y)).toBeLessThanOrEqual(tolerance);
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
    expect(frame(start("upper")).rotation).toBeCloseTo(shoulder.rotation + upperRest, 9);
    expect(frame(start("fore")).rotation).toBeCloseTo(shoulder.rotation + upperRest + foreRest, 9);
    const end = played.at(1);
    expectOnGoal(frame(end("fore")), authoredFrame(project, "hand-goal"), CLOSE);
    // The solve is the same at every progress: weight is the bone's question, not the solver's.
    expect(rotations(played.at(0.5)("solve"))).toEqual(rotations(end("solve")));
  });

  it("GE-3 staggered weight: at progress 0.5 the upper arm is solved and the forearm is at rest", () => {
    const project = examples.get("staggered-weight")!;
    const middle = play(project).at(0.5);
    const solved = rotations(middle("solve"));
    const upper = frame(middle("upper")).rotation;
    expect(upper).toBeCloseTo(solved["arm/upper"]!, 9);
    expect(frame(middle("fore")).rotation).toBeCloseTo(upper + restRotation(project, "fore"), 9);
    // Not vacuous: the forearm's rest is not where the solve would put it.
    expect(Math.abs(solved["arm/fore"]! - restRotation(project, "fore"))).toBeGreaterThan(1);
  });

  it("GE-4 branches: reachable goals converge and both hands land within tolerance", () => {
    const project = examples.get("branches")!;
    const end = play(project).at(1);
    const inspection = end("solve").inspection as {
      readonly kind: string;
      readonly residuals: Readonly<Record<string, number>>;
    };
    expect(inspection.kind).toBe("converged");
    expect(Object.keys(inspection.residuals).sort()).toEqual(["arm/left-fore", "arm/right-fore"]);
    for (const residual of Object.values(inspection.residuals))
      expect(residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    expectOnGoal(frame(end("left-fore")), authoredFrame(project, "left-goal"), FABRIK_TOLERANCE);
    expectOnGoal(frame(end("right-fore")), authoredFrame(project, "right-goal"), FABRIK_TOLERANCE);
  });

  it("GE-5 transformed root: the hand lands, and world rotation is the root's plus the local", () => {
    const project = examples.get("transformed-root")!;
    const end = play(project).at(1);
    const shoulder = authoredFrame(project, "shoulder");
    expect(shoulder.rotation).not.toBe(0);
    expectOnGoal(frame(end("fore")), authoredFrame(project, "hand-goal"), CLOSE);
    const solved = rotations(end("solve"));
    expect(frame(end("upper")).rotation).toBeCloseTo(shoulder.rotation + solved["arm/upper"]!, 9);
    // `bend: "positive"` turns the elbow toward increasing local rotation.
    expect(solved["arm/fore"]!).toBeGreaterThan(0);
  });
});
