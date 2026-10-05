import { createManualClock, createMicrotaskScheduler } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { gsap } from "gsap";
import {
  adaptPose,
  hasPose,
  parsePoseResult,
  readRawPose,
  type StageSize,
} from "../filler/adapter";
import { unreachable } from "../filler/unreachable";
import type { FillerKind } from "../filler/gap-filler";
import { IMAGE_SPACE, WORLD_SPACE, LANDMARK_SPACES } from "../filler/space";
import { COMPARED_FILLERS } from "../replay/compare";
import { buildComparisonRecord, formatComparisonRecord } from "../replay/record";
import { parseRecording } from "../replay/recording";
import { DEFAULT_STAGE } from "../replay/synthetic";
import type { RigPorts } from "../rig/rig";
import { createRigSolver } from "../rig/solver";
import { LEGACY_BEND_POLICY, PREDICTED_BEND_POLICY } from "../rig/bend-policy";
import { createGapPipeline } from "../filler/pipeline";
import { STABILIZER_KINDS, stabilizerFor, type StabilizerKind } from "../filler/stabilizer";
import { fitWeakPerspective } from "./projection";
import { HOTKEYS, createForcedJoints } from "./hotkeys";
import { createExperiment, LIVE_FILLER, LIVE_STABILIZER } from "./experiment";
import { createLiveRig } from "./live-rig";
import { drawOverlay } from "./overlay";
import { createRecorder } from "./recorder";
import { EMPTY_TALLY, createIngestGate, tally } from "./ingest";
import { defaultMirror, mirrorChecked, mirrorOf, previewPoint, previewTransform } from "./preview";
import { createSourceSession, describeEnd, type SessionSample } from "./session";
import { SOURCE_SPECS, createLandmarkSource, sourceId, sourceLabel } from "./sources";
import { createStageTimer, formatTimings } from "./timings";
import { actorFrame, actorPose, hipMidpoint } from "../synthetic/actor";
import { defaultCameraSpec } from "../synthetic/camera";
import { createSimulator } from "../synthetic/simulator";
import { interactiveTarget, required } from "../view/dom";
import { mountSimulatorPanel } from "../view/simulator-panel";
import { mountAvatarViewport } from "../view/avatar-viewport";
import { publishFrame } from "./publish-frame";

/** The synthetic takes are generated on the stage the page draws, so one size owns both. */
const STAGE: StageSize = DEFAULT_STAGE;

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
 * The live page: a landmark source (the webcam through MediaPipe, a looped synthetic take, or the
 * synthetic human), the gap pipeline, the rig and the overlay, one frame at a time, plus the
 * recorder and the replay comparison. Everything with memory is in the pipeline and the rig; this
 * file only wires ports, keys and drawing.
 */
function main(): void {
  const video = required<HTMLVideoElement>("#video");
  const svg = required<SVGSVGElement>("#overlay");
  const readout = required<HTMLElement>("#timings");
  const start = required<HTMLButtonElement>("#start");
  const sourceSelect = required<HTMLSelectElement>("#source");
  const mirror = required<HTMLInputElement>("#mirror");
  const fillerSelect = required<HTMLSelectElement>("#filler");
  const spaceSelect = required<HTMLSelectElement>("#space");
  const stabilizerSelect = required<HTMLSelectElement>("#stabilizer");
  const showRaw = required<HTMLInputElement>("#show-raw");
  const record = required<HTMLButtonElement>("#record");
  const replayInput = required<HTMLInputElement>("#replay");
  const calibrationInput = required<HTMLInputElement>("#calibrate");
  const report = required<HTMLElement>("#report");
  const avatarSection = required<HTMLElement>("#avatar-section");
  const avatarEnabled = required<HTMLInputElement>("#show-avatar");
  const bendSelect = required<HTMLSelectElement>("#bend-policy");
  const selectedBend = () => {
    switch (bendSelect.value) {
      case "legacy":
        return LEGACY_BEND_POLICY;
      case "predict":
        return PREDICTED_BEND_POLICY;
      default:
        throw new Error("Unknown bend policy.");
    }
  };
  const viewport = mountAvatarViewport(
    required<HTMLCanvasElement>("#avatar-view"),
    required<HTMLElement>("#avatar-info"),
    required<HTMLInputElement>("#avatar-yaw"),
    required<HTMLInputElement>("#avatar-pitch"),
    undefined,
    {
      file: required<HTMLInputElement>("#avatar-file"),
      reset: required<HTMLElement>("#avatar-primitives"),
      status: required<HTMLElement>("#avatar-file-status"),
    },
  );
  const showAvatar = () => {
    avatarSection.hidden = !avatarEnabled.checked || spaceSelect.value !== "world";
    viewport.clear();
  };
  avatarEnabled.addEventListener("change", showAvatar);
  showAvatar();
  svg.setAttribute("viewBox", `0 0 ${STAGE.width} ${STAGE.height}`);
  const log = new URLSearchParams(location.search).has("log");

  for (const spec of SOURCE_SPECS)
    sourceSelect.append(new Option(sourceLabel(spec), sourceId(spec)));
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
    () =>
      createRigSolver(rigPorts(), experiment.space, {
        bendPolicy: selectedBend(),
        diagnostics: true,
      }),
    () =>
      createGapPipeline({
        filler: { kind: "raw" },
        detector: experiment.calibrations?.image.detector,
        stabilizer: stabilizerFor(selectedStabilizer(), IMAGE_SPACE),
      }),
    viewport.clear,
  );
  bendSelect.addEventListener("change", () => {
    experiment.pipeline.reset();
    rig.restart();
    report.textContent = `World bend policy: ${bendSelect.value}. State reset; predictions never become observations.`;
  });
  spaceSelect.addEventListener("change", () => {
    const next = LANDMARK_SPACES.find((candidate) => candidate.kind === spaceSelect.value);
    if (next === undefined) throw new Error("Unknown landmark space.");
    experiment.switchSpace(next);
    rig.restart();
    showAvatar();
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
  addEventListener("keydown", (event) => {
    if (interactiveTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (forced.toggle(event.key, event.repeat)) event.preventDefault();
  });
  // A take is one subject from one source: ending the source ends the take, saved as if stopped.
  const finishRecording = () => {
    if (!recorder.recording) return;
    const take = recorder.stop();
    record.textContent = "Record landmarks";
    download(`pose-recording-${Date.now()}.json`, JSON.stringify(take));
  };
  record.addEventListener("click", () => {
    if (recorder.recording) return finishRecording();
    recorder.start();
    record.textContent = "Stop recording";
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
          createSolver: (nativeSpace) =>
            createRigSolver(rigPorts(), nativeSpace, { bendPolicy: selectedBend() }),
        });
        report.textContent = formatComparisonRecord(comparison);
      })
      .catch((error: unknown) => {
        report.textContent = `Replay failed: ${String(error)}`;
      });
  });

  // The synthetic human: its truth starts standing, seen by the default camera; the panel owns its
  // controls and reads nothing the pipeline or rig computes.
  const simulator = createSimulator({
    drive: { kind: "scenario", scenario: "standing" },
    camera: defaultCameraSpec(STAGE, hipMidpoint(actorFrame(actorPose()))),
    edits: [],
  });
  const panel = mountSimulatorPanel(simulator, STAGE);

  const gate = createIngestGate();
  let counts = EMPTY_TALLY;
  const showMirror = () => {
    video.style.transform = previewTransform(mirrorOf(mirror.checked));
  };
  mirror.addEventListener("change", showMirror);
  const onSample = ({ result, tMs, detectMs }: SessionSample) => {
    const timer = createStageTimer();
    const space = experiment.space;
    recorder.keep(result, tMs);
    const image = parsePoseResult(result, tMs, IMAGE_SPACE, STAGE);
    const worldPose = space.kind === "world" ? readRawPose(result, WORLD_SPACE) : undefined;
    const frame = space.kind === "image" ? image : adaptPose(worldPose, tMs, WORLD_SPACE, STAGE);
    timer.mark("adapt");
    const pipeline = experiment.pipeline;
    const step = pipeline.step(frame, forced.joints);
    timer.mark("fill");
    // Publication failures retain display history, never publish yesterday's chains as today's.
    const publication = publishFrame(rig.solver, step, pipeline.lengths);
    const solved = publication.solved;
    let solveFailure: string | undefined;
    switch (publication.kind) {
      case "published":
        break;
      case "unavailable":
        solveFailure = `solver publication unavailable: ${String(publication.error)}`;
        break;
      default:
        unreachable(publication, "frame publication");
    }
    timer.mark("write");
    if (avatarEnabled.checked && space.kind === "world")
      viewport.update(
        step,
        solved,
        pipeline.lengths,
        rig.solver,
        worldPose,
        experiment.calibration?.detector.threshold ?? 0.5,
      );
    const fit =
      space.kind === "world"
        ? fitWeakPerspective(step.trusted, rig.imageTrust.step(image, forced.joints).trusted)
        : undefined;
    const display = previewPoint(mirrorOf(mirror.checked), STAGE);
    drawOverlay(
      svg,
      showRaw.checked ? image : undefined,
      step.filled,
      solved,
      space.kind === "image" ? (position) => position : fit?.project,
      display,
    );
    if (selectedSource().kind === "simulator" && simulator.last !== undefined)
      panel.render(simulator.last, display);
    timer.mark("draw");
    const timings = timer.finish(tMs, detectMs);
    const held = [...forced.joints].join(", ") || "none";
    const ingest = `in ${counts.accepted}, restarts ${counts.restarts}, dropped ${counts.rejected}`;
    const rejected = Object.entries(step.trusted.rejections ?? {}).map(
      ([joint, rejection]) =>
        `${joint}: ${rejection.kind === "invalid" ? "invalid" : `${rejection.reason} (innovation ${rejection.innovation.toFixed(1)}, limit ${rejection.limit.toFixed(1)} native units, confirmation ${rejection.candidates})`}`,
    );
    readout.textContent = `${space.kind} · ${formatTimings(timings)} · ${ingest} · forced: ${held}${space.kind === "world" ? (fit === undefined ? " · no trusted camera fit" : ` · fit ${fit.rmsPx.toFixed(1)} px (${fit.pairCount} pairs)`) : ""}${rejected.length === 0 ? "" : ` · rejected ${rejected.join("; ")}`}${solveFailure === undefined ? "" : ` · ${solveFailure}`}`;
    if (log) console.debug(JSON.stringify(timings));
  };
  const selectedSource = () => {
    const spec = SOURCE_SPECS.find((candidate) => sourceId(candidate) === sourceSelect.value);
    if (spec === undefined) throw new Error("Unknown landmark source.");
    return spec;
  };
  // Shows the selected source's video and its default mirror; the person may flip the mirror after.
  const showVideo = () => {
    const spec = selectedSource();
    video.hidden = spec.kind !== "camera";
    panel.show(spec.kind === "simulator");
    mirror.checked = mirrorChecked(defaultMirror(spec));
    showMirror();
  };
  const session = createSourceSession({
    create: (spec) => createLandmarkSource(spec, { video, simulator }),
    begin() {
      counts = EMPTY_TALLY;
      start.textContent = "Stop";
    },
    sample(sample) {
      // The gate owns admission and subject restarts: a new session, a stall or a reacquired pose
      // resets every stateful stage, so no trust, length, filter or bend state crosses subjects.
      const admission = gate.admit(sample, hasPose(sample.result));
      counts = tally(counts, admission);
      switch (admission.kind) {
        case "reject":
          return;
        case "restart":
          experiment.pipeline.reset();
          rig.restart();
          break;
        case "continue":
          break;
        default:
          unreachable(admission, "admission");
      }
      onSample(sample);
    },
    end(spec, ending) {
      viewport.clear();
      finishRecording();
      start.textContent = "Start";
      const failure = describeEnd(sourceLabel(spec), ending);
      if (failure !== undefined) readout.textContent = failure;
    },
  });
  start.addEventListener("click", () => {
    if (session.running !== undefined) return session.stop();
    showVideo();
    session.start(selectedSource());
  });
  sourceSelect.addEventListener("change", () => {
    session.stop();
    showVideo();
  });
  showVideo();
  const keys = Object.entries(HOTKEYS).map(([key, joint]) => `${key} ${joint}`);
  required<HTMLElement>("#hotkeys").textContent = `Force a joint missing: ${keys.join(" · ")}`;
  addEventListener("pagehide", () => {
    session.stop();
    rig.dispose();
    viewport.dispose();
  });
}

main();
