import { createManualClock, createMicrotaskScheduler } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { gsap } from "gsap";
import { parsePoseResult, type StageSize } from "../filler/adapter";
import type { FillerKind } from "../filler/gap-filler";
import { IMAGE_SPACE } from "../filler/space";
import {
  COMPARED_FILLERS,
  DEFAULT_MASKS,
  compareFillers,
  formatComparison,
} from "../replay/compare";
import { parseRecording } from "../replay/recording";
import type { RigPorts } from "../rig/rig";
import { createImageRigSolver } from "../rig/solver";
import { HOTKEYS, createForcedJoints } from "./hotkeys";
import { createExperiment } from "./experiment";
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
  const record = required<HTMLButtonElement>("#record");
  const replayInput = required<HTMLInputElement>("#replay");
  const calibrationInput = required<HTMLInputElement>("#calibrate");
  const report = required<HTMLElement>("#report");
  svg.setAttribute("viewBox", `0 0 ${STAGE.width} ${STAGE.height}`);
  const log = new URLSearchParams(location.search).has("log");

  for (const { kind } of COMPARED_FILLERS) fillerSelect.append(new Option(kind, kind));
  const experiment = createExperiment();
  fillerSelect.addEventListener("change", () => {
    experiment.select(fillerSelect.value as FillerKind);
  });

  const solver = createImageRigSolver(rigPorts());
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
        report.textContent = `Still calibration applied to live and replay: visibility threshold ${calibration.detector.threshold.toFixed(3)}, speed gate ${calibration.detector.gate.toFixed(1)} bone lengths/s. Replay your movement recording to compare.`;
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
        const rows = compareFillers({
          recording,
          space: IMAGE_SPACE,
          fillers: COMPARED_FILLERS,
          masks: DEFAULT_MASKS,
          detector: experiment.detector,
          createSolver: () => createImageRigSolver(rigPorts()),
        });
        report.textContent = `${recording.frames.length} frames\n${formatComparison(rows, IMAGE_SPACE)}`;
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
        const frame = parsePoseResult(result, tMs, IMAGE_SPACE, STAGE);
        timer.mark("adapt");
        const pipeline = experiment.pipeline;
        const step = pipeline.step(frame, forced.joints);
        timer.mark("fill");
        const solved = solver.solve(step, pipeline.lengths);
        timer.mark("write");
        drawOverlay(svg, frame, step.filled, solved);
        timer.mark("draw");
        const timings = timer.finish(tMs, detectMs);
        const held = [...forced.joints].join(", ") || "none";
        readout.textContent = `${formatTimings(timings)} · forced: ${held}`;
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
