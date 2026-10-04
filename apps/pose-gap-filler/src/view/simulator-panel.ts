import { LANDMARKS } from "../body/attachments";
import { DOFS } from "../body/skeleton";
import type { StageSize } from "../filler/adapter";
import type { Vec } from "../filler/vec";
import { actorPose, hipMidpoint, standingRoot, type ActorPose } from "../synthetic/actor";
import { createCamera, orbitCameraSpec, type Camera } from "../synthetic/camera";
import { HANDLES, dragHandle, type Handle } from "../synthetic/handles";
import { describeEdit, describeHandle, editOf, landmarkInfo } from "../synthetic/inspect";
import {
  EDIT_ORDER,
  GEOMETRIC_SCORES,
  IDEAL_SCORES,
  type ObservationEditKind,
} from "../synthetic/observation";
import { PROPS, PROP_IDS, type PropId } from "../synthetic/occlusion";
import {
  CORRUPTION_PRESETS,
  CORRUPTION_PRESET_IDS,
  type CorruptionPresetId,
} from "../synthetic/corruption";
import { SCENARIOS, SCENARIO_IDS, type ScenarioId } from "../synthetic/scenarios";
import type { Simulator, SimulatorFrame } from "../synthetic/simulator";
import type { Vec3 } from "../synthetic/rotation";
import { canvasPoint, canvasRadius, required } from "./dom";
import { GRAB_RADIUS_PX, pickHandle } from "./pose-drag";
import { TRUTH_STYLE, drawActor, drawCameraMarker, projector } from "./scene-view";

const MANUAL = "manual";
/** The point both cameras orbit: the standing actor's hips. */
const ORBIT_TARGET: Vec3 = standingRoot();

export interface SimulatorPanel {
  /** Draws `frame`: the truth layer on the stage, the debug view, the sliders and the info. */
  render(frame: SimulatorFrame, display: (point: Vec) => Vec): void;
  /** Shown only while the simulator is the selected source. */
  show(visible: boolean): void;
}

/**
 * The synthetic human's controls, one owner of the page's simulator UI. Pose mode edits the truth:
 * the drive (a scenario, or a manual pose that holds), one slider per degree of freedom, and the
 * four handles dragged in the debug view, solved by `dragHandle` so a limb never stretches.
 * Observation mode edits only what the detector reports (`editOf`). The observation camera orbits
 * the actor; the debug view has its own orbit, which nothing measured reads, so moving it changes
 * no observation. Truth and estimate are separate layers the person toggles.
 */
export function mountSimulatorPanel(simulator: Simulator, stage: StageSize): SimulatorPanel {
  const section = required<HTMLElement>("#simulator");
  const truthLayer = required<HTMLCanvasElement>("#truth");
  const showTruth = required<HTMLInputElement>("#layer-truth");
  const showEstimate = required<HTMLInputElement>("#layer-estimate");
  const estimate = required<SVGSVGElement>("#overlay");
  const driveSelect = required<HTMLSelectElement>("#sim-drive");
  const detectorSelect = required<HTMLSelectElement>("#sim-detector");
  const propSelect = required<HTMLSelectElement>("#sim-prop");
  const corruptionSelect = required<HTMLSelectElement>("#sim-corruption");
  const cameraInputs = ["#cam-yaw", "#cam-pitch", "#cam-distance"].map((id) =>
    required<HTMLInputElement>(id),
  );
  const debugInputs = ["#debug-yaw", "#debug-pitch"].map((id) => required<HTMLInputElement>(id));
  const debugView = required<HTMLCanvasElement>("#debug-view");
  const dofList = required<HTMLElement>("#sim-dofs");
  const info = required<HTMLElement>("#sim-info");
  const editLandmark = required<HTMLSelectElement>("#edit-landmark");
  const editKind = required<HTMLSelectElement>("#edit-kind");
  const editDelta = ["#edit-dx", "#edit-dy", "#edit-dz"].map((id) =>
    required<HTMLInputElement>(id),
  );
  const editVisibility = required<HTMLInputElement>("#edit-visibility");
  const editPresence = required<HTMLInputElement>("#edit-presence");
  const editList = required<HTMLElement>("#sim-edits");
  for (const canvas of [truthLayer, debugView]) {
    canvas.width = stage.width;
    canvas.height = stage.height;
  }

  for (const id of SCENARIO_IDS) driveSelect.append(new Option(SCENARIOS[id].label, id));
  driveSelect.append(new Option("Manual pose (sliders and handles)", MANUAL));
  detectorSelect.append(
    new Option("Ideal scores", "ideal"),
    new Option("Geometric scores", "geometric"),
  );
  detectorSelect.value = simulator.state.scores === GEOMETRIC_SCORES ? "geometric" : "ideal";
  for (const id of PROP_IDS) propSelect.append(new Option(id, id));
  for (const id of CORRUPTION_PRESET_IDS) corruptionSelect.append(new Option(id, id));
  propSelect.value = PROP_IDS.find((id) => PROPS[id] === simulator.state.props) ?? "none";
  corruptionSelect.value =
    CORRUPTION_PRESET_IDS.find((id) => CORRUPTION_PRESETS[id] === simulator.state.corruption) ??
    "none";
  for (const landmark of LANDMARKS)
    editLandmark.append(new Option(`${landmark.index} ${landmark.name}`, String(landmark.index)));
  editLandmark.value = String(LANDMARKS.findIndex((landmark) => landmark.name === "left-wrist"));
  for (const kind of EDIT_ORDER) editKind.append(new Option(kind, kind));
  const sliders = new Map(
    DOFS.map((dof) => {
      const input = Object.assign(document.createElement("input"), {
        type: "range",
        min: String(dof.min),
        max: String(dof.max),
        step: "1",
        value: "0",
      });
      const label = document.createElement("label");
      label.append(`${dof.label} `, input);
      dofList.append(label);
      input.addEventListener("input", () => setManual({ [dof.id]: Number(input.value) }));
      return [dof.id, input] as const;
    }),
  );

  let last: { frame: SimulatorFrame; display: (point: Vec) => Vec } | undefined;
  let handleNote = "drag a wrist or ankle in the debug view to pose a limb";
  let drag: { handle: Handle; depth: number } | undefined;

  const currentPose = (): ActorPose => simulator.poseAt(simulator.last?.tMs ?? 0);
  const setManual = (angles: Readonly<Record<string, number>>, root?: Vec3) => {
    const pose = currentPose();
    simulator.drive({
      kind: "manual",
      pose: actorPose({ ...pose.angles, ...angles }, root ?? pose.root),
    });
    driveSelect.value = MANUAL;
    redraw();
  };
  const debugCamera = (): Camera => {
    const [yaw, pitch] = debugInputs.map((input) => Number(input.value)) as [number, number];
    return createCamera(orbitCameraSpec(ORBIT_TARGET, yaw, pitch, 4, stage));
  };
  // Redraws from the simulator's own frame at the last time, so an edit shows with no source
  // running.
  const redraw = () =>
    panel.render(simulator.frame(simulator.last?.tMs ?? 0), last?.display ?? ((point) => point));

  driveSelect.addEventListener("change", () => {
    if (driveSelect.value === MANUAL) return setManual({});
    simulator.drive({ kind: "scenario", scenario: driveSelect.value as ScenarioId });
    redraw();
  });
  detectorSelect.addEventListener("change", () => {
    simulator.observeWith({
      scores: detectorSelect.value === "geometric" ? GEOMETRIC_SCORES : IDEAL_SCORES,
    });
    redraw();
  });
  propSelect.addEventListener("change", () => {
    simulator.observeWith({ props: PROPS[propSelect.value as PropId] });
    redraw();
  });
  corruptionSelect.addEventListener("change", () => {
    simulator.observeWith({
      corruption: CORRUPTION_PRESETS[corruptionSelect.value as CorruptionPresetId],
    });
    redraw();
  });
  for (const input of cameraInputs)
    input.addEventListener("input", () => {
      const [yaw, pitch, distance] = cameraInputs.map((each) => Number(each.value)) as [
        number,
        number,
        number,
      ];
      const hips = hipMidpoint(simulator.frame(simulator.last?.tMs ?? 0).truth);
      simulator.aim(orbitCameraSpec(hips, yaw, pitch, distance, stage));
      redraw();
    });
  for (const input of [...debugInputs, showTruth, showEstimate, editLandmark])
    input.addEventListener("input", redraw);
  required<HTMLButtonElement>("#edit-apply").addEventListener("click", () => {
    simulator.edit(
      editOf({
        kind: editKind.value as ObservationEditKind,
        landmark: Number(editLandmark.value),
        deltaCm: editDelta.map((input) => Number(input.value)) as unknown as Vec3,
        visibility: Number(editVisibility.value),
        presence: Number(editPresence.value),
      }),
    );
    redraw();
  });
  required<HTMLButtonElement>("#edit-clear").addEventListener("click", () => {
    simulator.clearEdits();
    redraw();
  });

  debugView.addEventListener("pointerdown", (event) => {
    const camera = debugCamera();
    const truth = simulator.frame(simulator.last?.tMs ?? 0).truth;
    const handle = pickHandle(
      truth,
      projector(camera),
      canvasPoint(debugView, event),
      canvasRadius(debugView, event.pointerType === "touch" ? 24 : GRAB_RADIUS_PX),
    );
    if (handle === undefined) return;
    const effector = truth.segments[HANDLES[handle].effector].origin;
    drag = { handle, depth: camera.toCamera(effector)[2] };
    debugView.setPointerCapture(event.pointerId);
  });
  debugView.addEventListener("pointermove", (event) => {
    if (drag === undefined) return;
    const [u, v] = canvasPoint(debugView, event);
    // The handle moves in the plane facing the debug camera at the depth it was grabbed at.
    const result = dragHandle(
      currentPose(),
      drag.handle,
      debugCamera().unproject(u, v, drag.depth),
    );
    handleNote = `${drag.handle}: ${describeHandle(result)}`;
    simulator.drive({ kind: "manual", pose: result.pose });
    driveSelect.value = MANUAL;
    redraw();
  });
  const release = () => {
    drag = undefined;
  };
  debugView.addEventListener("pointerup", release);
  debugView.addEventListener("pointercancel", release);
  debugView.addEventListener("lostpointercapture", release);

  const panel: SimulatorPanel = {
    render(frame, display) {
      last = { frame, display };
      estimate.style.visibility = showEstimate.checked ? "visible" : "hidden";
      const truthContext = truthLayer.getContext("2d")!;
      truthContext.clearRect(0, 0, stage.width, stage.height);
      if (showTruth.checked) drawActor(truthContext, frame.truth, projector(frame.camera, display));
      const debug = debugView.getContext("2d")!;
      debug.fillStyle = "#0f172a";
      debug.fillRect(0, 0, stage.width, stage.height);
      const project = projector(debugCamera());
      drawActor(
        debug,
        frame.truth,
        project,
        TRUTH_STYLE,
        frame.observed.map((landmark) => landmark.geometry),
      );
      drawCameraMarker(debug, frame.camera, project);
      for (const [id, input] of sliders)
        if (document.activeElement !== input) input.value = String(frame.truth.pose.angles[id]);
      editList.textContent = simulator.state.edits.map(describeEdit).join("\n") || "no edits";
      info.textContent = [
        `t ${(frame.tMs / 1000).toFixed(2)} s · drive ${simulator.state.drive.kind}`,
        `detector ${frame.report.kind === "pose" ? "reports a pose" : "reports no pose"}`,
        handleNote,
        ...landmarkInfo(frame, Number(editLandmark.value)),
      ].join("\n");
    },
    show(visible) {
      section.hidden = !visible;
      truthLayer.hidden = !visible;
      if (!visible) estimate.style.visibility = "visible";
      else redraw();
    },
  };
  return panel;
}
