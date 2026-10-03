import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { BODY_ROOTS } from "../body/state";
import type { RawPose } from "../filler/adapter";
import type { BoneLengths } from "../filler/bone-length";
import type { PipelineStep } from "../filler/pipeline";
import type { LimbId } from "../filler/landmarks";
import type { RigSolver } from "../rig/solver";
import type { SolvedLimb } from "../rig/rig";
import { createAvatarScene } from "./avatar";

/** The WebGL ownership port is injectable for lifecycle tests, never a second pose engine. */
export interface AvatarRenderer {
  setPixelRatio(ratio: number): void;
  readonly shadowMap: { enabled: boolean };
  setSize(width: number, height: number, updateStyle: boolean): void;
  render(scene: Scene, camera: PerspectiveCamera): void;
  dispose(): void;
}

/** Presentation lifecycle only. Source cadence remains the only pose clock and solve owner. */
export function mountAvatarViewport(
  canvas: HTMLCanvasElement,
  readout: HTMLElement,
  yaw: HTMLInputElement,
  pitch: HTMLInputElement,
  createRenderer: (canvas: HTMLCanvasElement) => AvatarRenderer = (target) =>
    new WebGLRenderer({ canvas: target, antialias: false, alpha: true }),
) {
  const avatar = createAvatarScene();
  const scene = new Scene();
  scene.add(avatar.parent);
  const camera = new PerspectiveCamera(38, 4 / 3, 0.01, 100);
  let renderer: AvatarRenderer | undefined;
  let available = true;
  let disposed = false;
  try {
    renderer = createRenderer(canvas);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
  } catch (error) {
    available = false;
    readout.textContent = `Three viewport unavailable; overlay/sources still work: ${String(error)}`;
  }
  const draw = () => {
    if (disposed || !available || renderer === undefined) return;
    try {
      const width = Math.max(1, canvas.clientWidth || 640),
        height = Math.max(1, canvas.clientHeight || 480);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const a = (Number(yaw.value) * Math.PI) / 180,
        p = (Number(pitch.value) * Math.PI) / 180;
      camera.position.set(
        3 * Math.sin(a) * Math.cos(p),
        0.35 + 3 * Math.sin(p),
        3 * Math.cos(a) * Math.cos(p),
      );
      camera.lookAt(0, 0.35, 0);
      renderer.render(scene, camera);
    } catch (error) {
      available = false;
      avatar.clear();
      readout.textContent = `Three rendering failed; overlay/sources still work: ${String(error)}`;
    }
  };
  const lost = (event: Event) => {
    event.preventDefault();
    available = false;
    avatar.clear();
    readout.textContent = "Three context lost; overlay/sources still work.";
  };
  const restored = () => {
    available = true;
    readout.textContent = "Three context restored; waiting for the next accepted world pose.";
    draw();
  };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  yaw.addEventListener("input", draw);
  pitch.addEventListener("input", draw);
  const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(draw);
  resize?.observe(canvas);
  const clear = () => {
    avatar.clear();
    if (available)
      readout.textContent = "No current avatar pose; waiting for an accepted world frame.";
    draw();
  };
  return {
    clear,
    update(
      step: PipelineStep,
      solved: ReadonlyMap<LimbId, SolvedLimb>,
      lengths: BoneLengths,
      solver: RigSolver,
      extraPose: RawPose | undefined,
      threshold: number,
    ) {
      if (disposed || !available) return;
      const residuals = avatar.update(
        step,
        solved,
        lengths,
        solver.readPatch,
        extraPose,
        threshold,
      );
      const limbs = [...residuals].map(
        ([id, residual]) =>
          `${id}: ${residual.provenance}, middle ${residual.middleMm?.toFixed(1) ?? "unobserved"} / tip ${residual.tipMm?.toFixed(1) ?? "unobserved"} mm, orientation ${residual.orientation}`,
      );
      const body = step.filled.body;
      const diagnostics = solver.readDiagnostics?.();
      const bends =
        diagnostics === undefined
          ? []
          : [...diagnostics.bends].map(
              ([id, bend]) =>
                `${id} bend: ${bend.kind}${bend.kind === "predicted" ? ` (${bend.basis}, last observation ${bend.lastObservedTMs} ms)` : ""}`,
            );
      const contacts =
        diagnostics === undefined
          ? []
          : [
              "Coarse capsule penetration diagnostics only, not collision correction:",
              ...diagnostics.penetration.contacts.map(
                (contact) =>
                  `${contact.a} / ${contact.b}: ${contact.depthMm.toFixed(1)} mm unresolved`,
              ),
              ...(diagnostics.penetration.contacts.length === 0
                ? [`No coarse contact reported; coverage ${diagnostics.penetration.kind}.`]
                : []),
            ];
      const roots =
        body === undefined
          ? []
          : BODY_ROOTS.map((id) => {
              const anchor = body.anchors[id];
              const age =
                anchor.joint.kind === "inferred" ? `, expires ${anchor.expiresMs} ms` : "";
              return `${id}: ${anchor.joint.kind}${age}, model residual ${anchor.residualMm?.toFixed(1) ?? "unavailable"} mm`;
            });
      readout.textContent = [
        "Solved vs trusted residuals (not synthetic truth error). Grey head is neutral anatomy.",
        `Body orientation: ${body?.orientation.kind ?? "unavailable"}. Skipped limbs hidden.`,
        ...limbs,
        ...roots,
        ...bends,
        ...contacts,
      ].join("\n");
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      resize?.disconnect();
      yaw.removeEventListener("input", draw);
      pitch.removeEventListener("input", draw);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      avatar.dispose();
      renderer?.dispose();
    },
  };
}
