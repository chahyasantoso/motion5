import { DEFAULT_STAGE, SYNTHETIC_TAKES, createSyntheticRecording } from "../replay/synthetic";
import type { SyntheticMotion } from "../replay/synthetic";
import { unreachable } from "../filler/unreachable";
import { reportResult, type Simulator } from "../synthetic/simulator";
import {
  BROWSER_FRAMES,
  createPacedSource,
  createPlaybackSource,
  type FramePorts,
} from "./playback";
import { createMediaPipeWebcamSource, type LandmarkSource, type WebcamSourcePorts } from "./source";

/**
 * Where the live page's landmarks come from, a closed union read exhaustively. `camera` is the
 * webcam through MediaPipe; `synthetic` loops the motion's committed take (`SYNTHETIC_TAKES`);
 * `simulator` measures the page's synthetic human live, as its person edits it. Neither of the last
 * two loads MediaPipe or asks for a camera, so the page runs with no download and no permission.
 */
export type SourceSpec =
  | { readonly kind: "camera" }
  | { readonly kind: "synthetic"; readonly motion: SyntheticMotion }
  | { readonly kind: "simulator" };

export type SourceKind = SourceSpec["kind"];

/** Every selectable source, in the order the page lists them. */
export const SOURCE_SPECS: readonly SourceSpec[] = Object.freeze([
  Object.freeze({ kind: "simulator" }),
  Object.freeze({ kind: "synthetic", motion: SYNTHETIC_TAKES.exercise.motion }),
  Object.freeze({ kind: "synthetic", motion: SYNTHETIC_TAKES.still.motion }),
  Object.freeze({ kind: "camera" }),
]);

/** A stable id for one source, the value of its option in the page's select. */
export function sourceId(spec: SourceSpec): string {
  switch (spec.kind) {
    case "camera":
      return "camera";
    case "synthetic":
      return `synthetic-${spec.motion.kind}`;
    case "simulator":
      return "simulator";
    default:
      return unreachable(spec, "source spec");
  }
}

/** What the page calls one source. */
export function sourceLabel(spec: SourceSpec): string {
  switch (spec.kind) {
    case "camera":
      return "Camera (MediaPipe)";
    case "synthetic": {
      const take = SYNTHETIC_TAKES[spec.motion.kind];
      return `Synthetic ${spec.motion.kind} (seed ${take.seed}, looped)`;
    }
    case "simulator":
      return "Synthetic human (simulator)";
    default:
      return unreachable(spec, "source spec");
  }
}

/** The ports a source may need; each arm reads only its own. */
export interface SourcePorts {
  readonly video: HTMLVideoElement;
  readonly webcam?: WebcamSourcePorts;
  readonly frames?: FramePorts;
  /** The page's synthetic human, which the `simulator` arm measures. */
  readonly simulator?: Simulator;
}

/** The simulator is sampled at the camera rate the committed takes were made at. */
export const SIMULATOR_FPS = 30;

/**
 * The simulator as a paced source: frame `k` is the simulator measured at `k / SIMULATOR_FPS`
 * seconds, built only when it is emitted, so an edit made between frames is in the next one.
 */
export function createSimulatorSource(
  simulator: Simulator,
  ports: FramePorts = BROWSER_FRAMES,
): LandmarkSource {
  const timeOf = (index: number) => (index * 1000) / SIMULATOR_FPS;
  return createPacedSource(
    {
      timeOf,
      resultOf: (index) => reportResult(simulator.frame(timeOf(index)).report),
    },
    ports,
  );
}

/**
 * The one factory for live sources. Creating a source acquires nothing: the webcam source loads
 * MediaPipe and asks for the camera only in `start`, and only the `camera` arm creates one, so a
 * synthetic or simulated session never reaches either.
 */
export function createLandmarkSource(spec: SourceSpec, ports: SourcePorts): LandmarkSource {
  switch (spec.kind) {
    case "camera":
      return createMediaPipeWebcamSource(ports.video, ports.webcam);
    case "synthetic":
      return createPlaybackSource(
        createSyntheticRecording({ ...SYNTHETIC_TAKES[spec.motion.kind], stage: DEFAULT_STAGE }),
        { loop: true },
        ports.frames ?? BROWSER_FRAMES,
      );
    case "simulator":
      if (ports.simulator === undefined) throw new Error("The simulator source needs a simulator.");
      return createSimulatorSource(ports.simulator, ports.frames ?? BROWSER_FRAMES);
    default:
      return unreachable(spec, "source spec");
  }
}
