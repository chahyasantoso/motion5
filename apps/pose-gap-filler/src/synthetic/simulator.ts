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

/**
 * What moves the truth, a closed union: a scripted scenario over time, or a manual pose the
 * person set with sliders and handles, which holds still.
 */
export type ActorDrive =
  | { readonly kind: "scenario"; readonly scenario: ScenarioId }
  | { readonly kind: "manual"; readonly pose: ActorPose };

/**
 * What the simulated detector reports at one instant, a closed union: a `pose` in both of
 * MediaPipe's spaces, or `none`, MediaPipe's empty result, when a scripted loss takes the whole
 * detection.
 */
export type SimulatorReport =
  | { readonly kind: "pose"; readonly image: RawPose; readonly world: RawPose }
  | { readonly kind: "none" };

/**
 * One simulated instant. `truth` is the frozen actor the observation was measured from; the
 * pipeline is fed only the `report`, through the same adapter as a camera, and never sees `truth`,
 * which exists for the person and for metrics. `observed` is what the detector measured before a
 * whole-pose loss, kept for the info panel.
 */
export interface SimulatorFrame {
  readonly tMs: number;
  readonly truth: ActorFrame;
  readonly camera: Camera;
  readonly observed: readonly ObservedLandmark[];
  readonly report: SimulatorReport;
}

const NO_POSE: SimulatorReport = Object.freeze({ kind: "none" });

/** The report in MediaPipe's result shape, the one producer-side writer `readRawPose` reads. */
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

/** How the truth is observed beyond the camera: the detector's scores, the props, its errors. */
export interface ObservationSetup {
  readonly scores: DetectorScores;
  readonly props: readonly Occluder[];
  readonly corruption: CorruptionSpec;
}

/** An ideal detector, an empty scene and no corruption, what a simulator starts with by default. */
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

/** A simulator's starting state: the drive and camera, with any part of the setup overridden. */
export type SimulatorInit = Pick<SimulatorState, "drive" | "camera"> &
  Partial<Pick<SimulatorState, "edits">> &
  Partial<ObservationSetup>;

/** The camera rate the simulator is sampled at, the rate the committed takes were made at. */
export const SIMULATOR_FPS = 30;
export const SIMULATOR_FRAME_MS = 1000 / SIMULATOR_FPS;

/** The camera frame a time falls in: frame `k` spans `[k, k + 1)` periods, lateness included. */
export function frameIndexAt(tMs: number): number {
  return Math.floor(tMs / SIMULATOR_FRAME_MS + 1e-9);
}

export interface Simulator {
  readonly state: SimulatorState;
  /** The pose the drive gives at `tMs`, what a manual pose starts from. */
  poseAt(tMs: number): ActorPose;
  /** The frame at `tMs`: a pure function of the state and `tMs`, remembered as `last`. */
  frame(tMs: number): SimulatorFrame;
  /** When camera frame `k` reaches the detector under the current corruption. */
  timing(k: number): FrameTiming;
  readonly last: SimulatorFrame | undefined;
  drive(next: ActorDrive): void;
  aim(camera: CameraSpec): void;
  /** Changes how the truth is observed: the detector's scores, the props, the corruption. */
  observeWith(setup: Partial<ObservationSetup>): void;
  /** Adds an observation edit; an edit of the same kind on the same landmark replaces it. */
  edit(next: ObservationEdit): void;
  clearEdits(): void;
}

/**
 * The synthetic human: a truth actor driven by a scenario or a manual pose, an observation camera,
 * a detector (its scores, the scene's props and its corruption) and the person's observation edits. It owns no clock and reads nothing from
 * the pipeline, so the estimate can never move what it is judged against, and a frame is
 * reproducible from the state and its time alone.
 */
export function createSimulator(
  initial: SimulatorInit,
  body: Proportions = DEFAULT_PROPORTIONS,
): Simulator {
  let state: SimulatorState = { ...IDEAL_OBSERVATION, edits: [], ...initial };
  validateCorruption(state.corruption, SIMULATOR_FRAME_MS);
  let camera = createCamera(state.camera);
  let last: SimulatorFrame | undefined;
  const poseAt = (tMs: number): ActorPose => {
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
  // Only a scenario scripts losses; a manual pose is observed as the person edited it.
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
