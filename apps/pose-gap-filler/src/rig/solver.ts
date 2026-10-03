import type { Patch, ProjectHandle } from "@motion5/core";
import type { BoneLengths } from "../filler/bone-length";
import type { LimbId } from "../filler/landmarks";
import type { PipelineStep } from "../filler/pipeline";
import {
  loadImageRig,
  loadWorldRig,
  readWrittenLimbs,
  type RigPorts,
  type SolvedLimb,
} from "./rig";
import { createImageWriter, createWorldWriter } from "./writer";
import type { LandmarkSpace } from "../filler/space";
import { unreachable } from "../filler/unreachable";

/** One frame's solve: the chains written this frame, keyed by limb. */
export interface PoseSolver {
  solve(step: PipelineStep, lengths: BoneLengths): ReadonlyMap<LimbId, SolvedLimb>;
}

/** The write-then-read the live page and the replay share: one batch, then this frame's chains. */
export function createImageSolver(project: ProjectHandle): PoseSolver {
  const writer = createImageWriter(project);
  return {
    solve(step, lengths) {
      return readWrittenLimbs(project, writer.write(step.filled, step.trusted, lengths));
    },
  };
}

/** A solver that owns its project, for a caller that owns nothing else of the rig. */
export interface RigSolver extends PoseSolver {
  /** Read-only publications from this solver's sole project. Image/test solvers may omit it. */
  readPatch?(nodeId: string): Patch | undefined;
  dispose(): void;
}

/** Loads a fresh image rig and solves on it; `dispose` releases the project. */
export function createImageRigSolver(ports: RigPorts): RigSolver {
  const project = loadImageRig(ports);
  const solver = createImageSolver(project);
  return { solve: solver.solve, dispose: () => project.dispose() };
}

export function createWorldRigSolver(ports: RigPorts): RigSolver {
  const project = loadWorldRig(ports);
  const writer = createWorldWriter(project);
  return {
    readPatch: (nodeId) => project.get(nodeId),
    solve(step, lengths) {
      return readWrittenLimbs(project, writer.write(step.filled, step.trusted, lengths), [
        "x",
        "y",
        "z",
      ]);
    },
    dispose: () => project.dispose(),
  };
}

export function createRigSolver(ports: RigPorts, space: LandmarkSpace): RigSolver {
  switch (space.kind) {
    case "image":
      return createImageRigSolver(ports);
    case "world":
      return createWorldRigSolver(ports);
    default:
      return unreachable(space, "rig space");
  }
}
