import { DEFAULT_PROPORTIONS, type Proportions } from "../body/skeleton";
import { unreachable } from "../filler/unreachable";
import { actorFrame, type ActorFrame, type ActorPose } from "./actor";
import { createCamera, type Camera, type CameraSpec } from "./camera";
import {
  IDEAL_SCORES,
  observe,
  rawPoses,
  type DetectorScores,
  type ObservationEdit,
  type ObservedLandmark,
} from "./observation";
import { scenarioPose, type ScenarioId } from "./scenarios";
import type { RawPose } from "../filler/adapter";

/**
 * What moves the truth, a closed union: a scripted scenario over time, or a manual pose the
 * person set with sliders and handles, which holds still.
 */
export type ActorDrive =
  | { readonly kind: "scenario"; readonly scenario: ScenarioId }
  | { readonly kind: "manual"; readonly pose: ActorPose };

/**
 * One simulated instant. `truth` is the frozen actor the observation was measured from; the
 * pipeline is fed only `image` and `world`, through the same adapter as a camera, and never sees
 * `truth`, which exists for the person and for metrics.
 */
export interface SimulatorFrame {
  readonly tMs: number;
  readonly truth: ActorFrame;
  readonly camera: Camera;
  readonly observed: readonly ObservedLandmark[];
  readonly image: RawPose;
  readonly world: RawPose;
}

export interface SimulatorState {
  readonly drive: ActorDrive;
  readonly camera: CameraSpec;
  readonly edits: readonly ObservationEdit[];
}

export interface Simulator {
  readonly state: SimulatorState;
  /** The pose the drive gives at `tMs`, what a manual pose starts from. */
  poseAt(tMs: number): ActorPose;
  /** The frame at `tMs`: a pure function of the state and `tMs`, remembered as `last`. */
  frame(tMs: number): SimulatorFrame;
  readonly last: SimulatorFrame | undefined;
  drive(next: ActorDrive): void;
  aim(camera: CameraSpec): void;
  /** Adds an observation edit; an edit of the same kind on the same landmark replaces it. */
  edit(next: ObservationEdit): void;
  clearEdits(): void;
}

/**
 * The synthetic human: a truth actor driven by a scenario or a manual pose, an observation camera,
 * a detector (`scores`) and the person's observation edits. It owns no clock and reads nothing from
 * the pipeline, so the estimate can never move what it is judged against, and a frame is
 * reproducible from the state and its time alone.
 */
export function createSimulator(
  initial: SimulatorState,
  scores: DetectorScores = IDEAL_SCORES,
  body: Proportions = DEFAULT_PROPORTIONS,
): Simulator {
  let state = initial;
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
      const observed = observe(truth, camera, scores, state.edits);
      const { image, world } = rawPoses(observed);
      last = Object.freeze({ tMs, truth, camera, observed, image, world });
      return last;
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
