import { DEFAULT_PROPORTIONS, type Proportions } from "../body/skeleton";
import { unreachable } from "../filler/unreachable";
import { actorFrame, type ActorFrame, type ActorPose } from "./actor";
import { createCamera, type Camera, type CameraSpec } from "./camera";
import {
  NO_CORRUPTION,
  frameTiming,
  validateCorruption,
  type CorruptionSpec,
  type FrameTiming,
} from "./corruption";
import { PROPS, type Occluder } from "./occlusion";
import {
  IDEAL_SCORES,
  observe,
  rawPoses,
  type DetectorScores,
  type ObservationEdit,
  type ObservedLandmark,
} from "./observation";
import { NO_LOSS, scenarioLoss, scenarioPose, type LossAt, type ScenarioId } from "./scenarios";
import { writePoseResult, type PoseResult, type RawPose } from "../filler/adapter";

/** Truth source: a scripted scenario over time, or a manual pose that holds still. */
export type ActorDrive =
  | { readonly kind: "scenario"; readonly scenario: ScenarioId }
  | { readonly kind: "manual"; readonly pose: ActorPose };

/** Detector output at one instant: a `pose` in both MediaPipe spaces, or `none` for a whole-pose loss. */
export type SimulatorReport =
  | { readonly kind: "pose"; readonly image: RawPose; readonly world: RawPose }
  | { readonly kind: "none" };

/** One instant: `truth` stays outside the pipeline, which reads only `report`; `observed` holds the pre-loss landmarks. */
export interface SimulatorFrame {
  readonly tMs: number;
  readonly truth: ActorFrame;
  readonly camera: Camera;
  readonly observed: readonly ObservedLandmark[];
  readonly report: SimulatorReport;
}

const NO_POSE: SimulatorReport = Object.freeze({ kind: "none" });

/** Encodes a report as the MediaPipe result that `readRawPose` reads. */
export function reportResult(report: SimulatorReport): PoseResult {
  switch (report.kind) {
    case "pose":
      return writePoseResult(report.image, report.world);
    case "none":
      return writePoseResult(null, null);
    default:
      return unreachable(report, "simulator report");
  }
}

/** How the truth is observed beyond the camera: scores, props, corruption. */
export interface ObservationSetup {
  readonly scores: DetectorScores;
  readonly props: readonly Occluder[];
  readonly corruption: CorruptionSpec;
}

/** Ideal detector, empty scene and no corruption: the default setup. */
export const IDEAL_OBSERVATION: ObservationSetup = Object.freeze({
  scores: IDEAL_SCORES,
  props: PROPS.none,
  corruption: NO_CORRUPTION,
});

export interface SimulatorState extends ObservationSetup {
  readonly drive: ActorDrive;
  readonly camera: CameraSpec;
  readonly edits: readonly ObservationEdit[];
}

/** Start state: the drive and camera, with `edits` and setup parts optional. */
export type SimulatorInit = Pick<SimulatorState, "drive" | "camera"> &
  Partial<Pick<SimulatorState, "edits">> &
  Partial<ObservationSetup>;

/** Sampling rate: the camera rate of the committed takes. */
export const SIMULATOR_FPS = 30;
export const SIMULATOR_FRAME_MS = 1000 / SIMULATOR_FPS;

/** The camera frame a time falls in; frame `k` spans `[k, k + 1)` periods, lateness included. */
export function frameIndexAt(tMs: number): number {
  if (!(Number.isFinite(tMs) && tMs >= 0))
    throw new Error("Simulator frame time must be finite and nonnegative.");
  const k = Math.floor(tMs / SIMULATOR_FRAME_MS + 1e-9);
  if (!Number.isSafeInteger(k)) throw new Error("Simulator frame index must be safe.");
  return k;
}

export interface Simulator {
  readonly state: SimulatorState;
  /** The pose the drive gives at `tMs`. */
  poseAt(tMs: number): ActorPose;
  /** The frame at `tMs`: a pure function of the state and time, remembered as `last`. */
  frame(tMs: number): SimulatorFrame;
  /** When camera frame `k` reaches the detector under the current corruption. */
  timing(k: number): FrameTiming;
  readonly last: SimulatorFrame | undefined;
  drive(next: ActorDrive): void;
  aim(camera: CameraSpec): void;
  /** Changes how the truth is observed: scores, props, corruption. */
  observeWith(setup: Partial<ObservationSetup>): void;
  /** Adds an edit; the same kind on the same landmark replaces an earlier one. */
  edit(next: ObservationEdit): void;
  clearEdits(): void;
}

/** Synthetic human: a truth actor, camera, detector settings and observation edits. It owns no clock, reads nothing from the pipeline, and reproduces a frame from state and time. */
export function createSimulator(
  initial: SimulatorInit,
  body: Proportions = DEFAULT_PROPORTIONS,
): Simulator {
  let state: SimulatorState = { ...IDEAL_OBSERVATION, edits: [], ...initial };
  validateCorruption(state.corruption, SIMULATOR_FRAME_MS);
  let camera = createCamera(state.camera);
  let last: SimulatorFrame | undefined;
  const poseAt = (tMs: number): ActorPose => {
    if (!Number.isFinite(tMs)) throw new Error("Simulator frame time must be finite.");
    const { drive } = state;
    switch (drive.kind) {
      case "scenario":
        return scenarioPose(drive.scenario, tMs);
      case "manual":
        return drive.pose;
      default:
        return unreachable(drive, "actor drive");
    }
  };
  const lossAt = (tMs: number): LossAt => {
    const { drive } = state;
    switch (drive.kind) {
      case "scenario":
        return scenarioLoss(drive.scenario, tMs);
      case "manual":
        return NO_LOSS;
      default:
        return unreachable(drive, "actor drive");
    }
  };
  return {
    get state() {
      return state;
    },
    get last() {
      return last;
    },
    poseAt,
    frame(tMs) {
      const truth = actorFrame(poseAt(tMs), body);
      const loss = lossAt(tMs);
      const scripted: ObservationEdit[] =
        loss.kind === "landmarks"
          ? loss.landmarks.map((landmark) => ({ kind: "drop", landmark }))
          : [];
      const observed = observe(truth, camera, {
        scores: state.scores,
        props: state.props,
        corruption: state.corruption,
        frameIndex: frameIndexAt(tMs),
        edits: [...state.edits, ...scripted],
      });
      const report: SimulatorReport =
        loss.kind === "pose" ? NO_POSE : { kind: "pose", ...rawPoses(observed) };
      last = Object.freeze({ tMs, truth, camera, observed, report });
      return last;
    },
    timing: (k) => frameTiming(state.corruption, k, SIMULATOR_FRAME_MS),
    observeWith(setup) {
      const next = { ...state, ...setup };
      validateCorruption(next.corruption, SIMULATOR_FRAME_MS);
      state = next;
    },
    drive(next) {
      state = { ...state, drive: next };
    },
    aim(spec) {
      camera = createCamera(spec);
      state = { ...state, camera: spec };
    },
    edit(next) {
      const kept = state.edits.filter(
        (edit) => !(edit.kind === next.kind && edit.landmark === next.landmark),
      );
      state = { ...state, edits: [...kept, next] };
    },
    clearEdits() {
      state = { ...state, edits: [] };
    },
  };
}
