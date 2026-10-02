import { createManualClock, createMicrotaskScheduler } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { gsap } from "gsap";
import { parsePoseResult, type StageSize } from "../filler/adapter";
import type { FillerKind } from "../filler/gap-filler";
import { IMAGE_SPACE, WORLD_SPACE, LANDMARK_SPACES } from "../filler/space";
import { COMPARED_FILLERS } from "../replay/compare";
import { buildComparisonRecord, formatComparisonRecord } from "../replay/record";
import { parseRecording } from "../replay/recording";
import type { RigPorts } from "../rig/rig";
import { createRigSolver } from "../rig/solver";
import { createGapPipeline } from "../filler/pipeline";
import { STABILIZER_KINDS, stabilizerFor, type StabilizerKind } from "../filler/stabilizer";
import { fitWeakPerspective } from "./projection";
import { HOTKEYS, createForcedJoints } from "./hotkeys";
import { createExperiment, LIVE_FILLER, LIVE_STABILIZER } from "./experiment";
import { createLiveRig } from "./live-rig";
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
  const experiment = createExperiment(IMAGE_SPACE);
  // The camera fit's image half is stabilized as the world half is, on the image detector the
  // still take calibrated (the default until one), so the fit trusts what the image replay trusts.
  const rig = createLiveRig(
    () => createRigSolver(rigPorts(), experiment.space),
    () =>
      createGapPipeline({
        filler: { kind: "raw" },
        detector: experiment.calibrations?.image.detector,
        stabilizer: stabilizerFor(selectedStabilizer(), IMAGE_SPACE),
      }),
  );
  spaceSelect.addEventListener("change", () => {
    const next = LANDMARK_SPACES.find((candidate) => candidate.kind === spaceSelect.value);
    if (next === undefined) throw new Error("Unknown landmark space.");
    experiment.switchSpace(next);
    rig.restart();
    report.textContent =
      experiment.calibration === undefined
        ? `Switched to ${next.kind}. Calibrate a still recording to judge either space.`
        : `Switched to ${next.kind}. The still calibration covers both spaces and still applies.`;
  });
  fillerSelect.addEventListener("change", () => {
    experiment.select(fillerSelect.value as FillerKind);
    rig.restart();
  });
  stabilizerSelect.addEventListener("change", () => {
    experiment.stabilize(selectedStabilizer());
    rig.restart();
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
        const calibrations = experiment.calibrate(parseRecording(JSON.parse(text)));
        rig.restart();
        const applied = LANDMARK_SPACES.map(({ kind }) => {
          const { threshold, gate } = calibrations[kind].detector;
          const visibility = `threshold ${threshold.toFixed(3)}`;
          return `${kind} ${visibility}, gate ${gate.toFixed(1)} bone lengths/s`;
        });
        const summary = `Still calibration applied to live and replay: ${applied.join("; ")}.`;
        report.textContent = `${summary} Replay your movement recording to compare.`;
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
        const comparison = buildComparisonRecord({
          label: `recording ${file.name}`,
          recording,
          stabilizer: experiment.stabilizer.kind,
          // One still take calibrates both spaces, so the record judges both.
          calibrationFor: (nativeSpace) => experiment.calibrations?.[nativeSpace.kind],
          createSolver: (nativeSpace) => createRigSolver(rigPorts(), nativeSpace),
        });
        report.textContent = formatComparisonRecord(comparison);
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
        const space = experiment.space;
        recorder.keep(result, tMs);
        const image = parsePoseResult(result, tMs, IMAGE_SPACE, STAGE);
        const frame =
          space.kind === "image" ? image : parsePoseResult(result, tMs, WORLD_SPACE, STAGE);
        timer.mark("adapt");
        const pipeline = experiment.pipeline;
        const step = pipeline.step(frame, forced.joints);
        timer.mark("fill");
        const solved = rig.solver.solve(step, pipeline.lengths);
        timer.mark("write");
        const fit =
          space.kind === "world"
            ? fitWeakPerspective(step.trusted, rig.imageTrust.step(image, forced.joints).trusted)
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
    rig.dispose();
  });
}

main();
