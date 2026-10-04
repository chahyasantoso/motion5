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
import { presentedPosition, trustedPosition } from "../filler/frame";
import { LIMBS } from "../filler/landmarks";
import { distance } from "../filler/vec";
import { LEGACY_BEND_POLICY, type BendPolicy, type BendReference } from "./bend-policy";
import { diagnosePenetration, type PenetrationReport } from "./penetration";

export interface RigDiagnostics {
  readonly tMs: number;
  readonly bends: ReadonlyMap<LimbId, BendReference>;
  readonly residuals: ReadonlyMap<LimbId, SolveResidual>;
  readonly penetration: PenetrationReport;
}
export interface SolveResidual {
  readonly middleToFilledMm: number | undefined;
  readonly middleToObservedMm: number | undefined;
  readonly tipToFilledMm: number | undefined;
}
export interface WorldSolveOptions {
  readonly bendPolicy?: BendPolicy;
  readonly diagnostics?: boolean;
}

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
  readDiagnostics?(): RigDiagnostics | undefined;
  dispose(): void;
}

/** Loads a fresh image rig and solves on it; `dispose` releases the project. */
export function createImageRigSolver(ports: RigPorts): RigSolver {
  const project = loadImageRig(ports);
  const solver = createImageSolver(project);
  return { solve: solver.solve, dispose: () => project.dispose() };
}

export function createWorldRigSolver(ports: RigPorts, options: WorldSolveOptions = {}): RigSolver {
  const project = loadWorldRig(ports);
  let writer;
  try {
    writer = createWorldWriter(project, options.bendPolicy ?? LEGACY_BEND_POLICY);
  } catch (error) {
    project.dispose();
    throw error;
  }
  const diagnosticsEnabled = options.diagnostics ?? false;
  let diagnostics: RigDiagnostics | undefined;
  return {
    readPatch: (nodeId) => project.get(nodeId),
    readDiagnostics: () => diagnostics,
    solve(step, lengths) {
      diagnostics = undefined;
      const writes = writer.write(step.filled, step.trusted, lengths);
      const solved = readWrittenLimbs(project, writes, ["x", "y", "z"]);
      if (diagnosticsEnabled) {
        const bends = new Map<LimbId, BendReference>();
        const residuals = new Map<LimbId, SolveResidual>();
        for (const limb of LIMBS) {
          const write = writes[limb.id];
          // Legacy has no age-bounded evidence contract. Do not fabricate a provenance label.
          if (write.kind === "skipped") bends.set(limb.id, { kind: "unavailable" });
          else if (write.bend !== undefined) bends.set(limb.id, write.bend);
          const pose = solved.get(limb.id);
          const filledMiddle = presentedPosition(step.filled.joints[limb.middle]);
          const observedMiddle = trustedPosition(step.trusted.trust[limb.middle]);
          const tip = presentedPosition(step.filled.joints[limb.tip]);
          residuals.set(limb.id, {
            middleToFilledMm:
              pose === undefined || filledMiddle === undefined
                ? undefined
                : distance(pose.middle, filledMiddle),
            middleToObservedMm:
              pose === undefined || observedMiddle === undefined
                ? undefined
                : distance(pose.middle, observedMiddle),
            tipToFilledMm:
              pose === undefined || tip === undefined ? undefined : distance(pose.tip, tip),
          });
        }
        diagnostics = {
          tMs: step.filled.tMs,
          bends,
          residuals,
          penetration: diagnosePenetration(step.filled, solved),
        };
      }
      return solved;
    },
    dispose() {
      diagnostics = undefined;
      project.dispose();
    },
  };
}

export function createRigSolver(
  ports: RigPorts,
  space: LandmarkSpace,
  options: WorldSolveOptions = {},
): RigSolver {
  switch (space.kind) {
    case "image":
      return createImageRigSolver(ports);
    case "world":
      return createWorldRigSolver(ports, options);
    default:
      return unreachable(space, "rig space");
  }
}
