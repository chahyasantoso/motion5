import { createManualClock, createMicrotaskScheduler } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { gsap } from "gsap";
import { parsePoseResult, type StageSize } from "../filler/adapter";
import type { FillerKind } from "../filler/gap-filler";
import { IMAGE_SPACE, WORLD_SPACE, LANDMARK_SPACES, type LandmarkSpace } from "../filler/space";
import {
  COMPARED_FILLERS,
  comparedFillers,
  DEFAULT_MASKS,
  compareFillers,
  formatComparison,
} from "../replay/compare";
import { parseRecording } from "../replay/recording";
import type { RigPorts } from "../rig/rig";
import { createRigSolver } from "../rig/solver";
import { createGapPipeline } from "../filler/pipeline";
import { STABILIZER_KINDS, stabilizerFor, type StabilizerKind } from "../filler/stabilizer";
import { fitWeakPerspective } from "./projection";
import { HOTKEYS, createForcedJoints } from "./hotkeys";
import { createExperiment, LIVE_FILLER, LIVE_STABILIZER } from "./experiment";
import { drawOverlay } from "./overlay";
import { createRecorder } from "./recorder";
import { createMediaPipeWebcamSource } from "./source";
import { createStageTimer, formatTimings } from "./timings";

const STAGE: StageSize = { width: 640, height: 480 };

function required<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (node === null) throw new Error(`${selector} not found`);
  return node;
}

function rigPorts(): RigPorts {
  return {
    clock: createManualClock(),
    interpolator: createGsapInterpolator(gsap),
    scheduler: createMicrotaskScheduler(),
  };
}

function download(name: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: name });
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * The live page: webcam, MediaPipe, the gap pipeline, the rig and the overlay, one frame at a time,
 * plus the recorder and the replay comparison. Everything with memory is in the pipeline and the
 * rig; this file only wires ports, keys and drawing.
 */
function main(): void {
  const video = required<HTMLVideoElement>("#video");
  const svg = required<SVGSVGElement>("#overlay");
  const readout = required<HTMLElement>("#timings");
  const start = required<HTMLButtonElement>("#start");
  const fillerSelect = required<HTMLSelectElement>("#filler");
  const spaceSelect = required<HTMLSelectElement>("#space");
  const stabilizerSelect = required<HTMLSelectElement>("#stabilizer");
  const showRaw = required<HTMLInputElement>("#show-raw");
  const record = required<HTMLButtonElement>("#record");
  const replayInput = required<HTMLInputElement>("#replay");
  const calibrationInput = required<HTMLInputElement>("#calibrate");
  const report = required<HTMLElement>("#report");
  svg.setAttribute("viewBox", `0 0 ${STAGE.width} ${STAGE.height}`);
  const log = new URLSearchParams(location.search).has("log");

  for (const { kind } of COMPARED_FILLERS) fillerSelect.append(new Option(kind, kind));
  fillerSelect.value = LIVE_FILLER;
  for (const kind of STABILIZER_KINDS) stabilizerSelect.append(new Option(kind, kind));
  stabilizerSelect.value = LIVE_STABILIZER;
  const selectedStabilizer = (): StabilizerKind => {
    const kind = STABILIZER_KINDS.find((candidate) => candidate === stabilizerSelect.value);
    if (kind === undefined) throw new Error("Unknown stabilizer.");
    return kind;
  };
  let space: LandmarkSpace = IMAGE_SPACE;
  let experiment = createExperiment(space);
  let solver = createRigSolver(rigPorts(), space);
  // The camera fit's image half: stabilized as the world half is, on the default image detector,
  // because a still calibration belongs to the selected space and is never copied across.
  const createImageTrust = () =>
    createGapPipeline({
      filler: { kind: "raw" },
      stabilizer: stabilizerFor(selectedStabilizer(), IMAGE_SPACE),
    });
  let imageTrust = createImageTrust();
  /**
   * Every setting change restarts the rig and the fit's image half with the pipeline, so no held
   * bend side, pole direction or stabilizer state crosses from one setting into the next.
   */
  const restartRig = () => {
    const fresh = createRigSolver(rigPorts(), space);
    solver.dispose();
    solver = fresh;
    imageTrust = createImageTrust();
  };
  spaceSelect.addEventListener("change", () => {
    const next = LANDMARK_SPACES.find((candidate) => candidate.kind === spaceSelect.value);
    if (next === undefined) throw new Error("Unknown landmark space.");
    const freshExperiment = createExperiment(next);
    freshExperiment.select(fillerSelect.value as FillerKind);
    freshExperiment.stabilize(selectedStabilizer());
    experiment = freshExperiment;
    space = next;
    restartRig();
    report.textContent = `Switched to ${next.kind}. Recalibrate the still recording in this space.`;
  });
  fillerSelect.addEventListener("change", () => {
    experiment.select(fillerSelect.value as FillerKind);
    restartRig();
  });
  stabilizerSelect.addEventListener("change", () => {
    experiment.stabilize(selectedStabilizer());
    restartRig();
  });

  const forced = createForcedJoints();
  const recorder = createRecorder(STAGE);
  const source = createMediaPipeWebcamSource(video);
  addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)
      return;
    if (forced.toggle(event.key, event.repeat)) event.preventDefault();
  });
  record.addEventListener("click", () => {
    if (!recorder.recording) {
      recorder.start();
      record.textContent = "Stop recording";
      return;
    }
    const take = recorder.stop();
    record.textContent = "Record landmarks";
    download(`pose-recording-${Date.now()}.json`, JSON.stringify(take));
  });
  calibrationInput.addEventListener("change", () => {
    const file = calibrationInput.files?.[0];
    if (file === undefined) return;
    file
      .text()
      .then((text) => {
        const calibration = experiment.calibrate(parseRecording(JSON.parse(text)));
        restartRig();
        report.textContent = `${space.kind} still calibration applied to live and replay: visibility threshold ${calibration.detector.threshold.toFixed(3)}, speed gate ${calibration.detector.gate.toFixed(1)} bone lengths/s. Replay your movement recording to compare.`;
      })
      .catch((error: unknown) => {
        report.textContent = `Calibration failed (previous settings retained): ${String(error)}`;
      });
  });
  replayInput.addEventListener("change", () => {
    const file = replayInput.files?.[0];
    if (file === undefined) return;
    file
      .text()
      .then((text) => {
        const recording = parseRecording(JSON.parse(text));
        const reports = LANDMARK_SPACES.map((nativeSpace) => {
          const rows = compareFillers({
            recording,
            space: nativeSpace,
            fillers: comparedFillers(nativeSpace),
            masks: DEFAULT_MASKS,
            detector: nativeSpace.kind === space.kind ? experiment.detector : undefined,
            stabilizer: stabilizerFor(experiment.stabilizer.kind, nativeSpace),
            createSolver: () => createRigSolver(rigPorts(), nativeSpace),
          });
          return `${nativeSpace.kind} (native ${nativeSpace.kind === "image" ? "px" : "mm"})\n${formatComparison(rows, nativeSpace)}`;
        });
        report.textContent = `${recording.frames.length} frames · stabilizer ${experiment.stabilizer.kind}\n${reports.join("\n\n")}`;
      })
      .catch((error: unknown) => {
        report.textContent = `Replay failed: ${String(error)}`;
      });
  });

  start.addEventListener("click", () => {
    start.disabled = true;
    source
      .start(({ result, tMs, detectMs }) => {
        const timer = createStageTimer();
        recorder.keep(result, tMs);
        const image = parsePoseResult(result, tMs, IMAGE_SPACE, STAGE);
        const frame =
          space.kind === "image" ? image : parsePoseResult(result, tMs, WORLD_SPACE, STAGE);
        timer.mark("adapt");
        const pipeline = experiment.pipeline;
        const step = pipeline.step(frame, forced.joints);
        timer.mark("fill");
        const solved = solver.solve(step, pipeline.lengths);
        timer.mark("write");
        const fit =
          space.kind === "world"
            ? fitWeakPerspective(step.trusted, imageTrust.step(image, forced.joints).trusted)
            : undefined;
        drawOverlay(
          svg,
          showRaw.checked ? image : undefined,
          step.filled,
          solved,
          space.kind === "image" ? (position) => position : fit?.project,
        );
        timer.mark("draw");
        const timings = timer.finish(tMs, detectMs);
        const held = [...forced.joints].join(", ") || "none";
        readout.textContent = `${space.kind} · ${formatTimings(timings)} · forced: ${held}${space.kind === "world" ? (fit === undefined ? " · no trusted camera fit" : ` · fit ${fit.rmsPx.toFixed(1)} px (${fit.pairCount} pairs)`) : ""}`;
        if (log) console.debug(JSON.stringify(timings));
      })
      .catch((error: unknown) => {
        readout.textContent = `Camera or MediaPipe failed: ${String(error)}`;
        start.disabled = false;
      });
  });
  const keys = Object.entries(HOTKEYS).map(([key, joint]) => `${key} ${joint}`);
  required<HTMLElement>("#hotkeys").textContent = `Force a joint missing: ${keys.join(" · ")}`;
  addEventListener("pagehide", () => {
    source.stop();
    solver.dispose();
  });
}

main();
