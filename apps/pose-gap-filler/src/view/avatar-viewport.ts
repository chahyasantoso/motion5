import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { BODY_ROOTS } from "../body/state";
import type { RawPose } from "../filler/adapter";
import type { BoneLengths } from "../filler/bone-length";
import type { PipelineStep } from "../filler/pipeline";
import type { LimbId } from "../filler/landmarks";
import type { RigSolver } from "../rig/solver";
import type { SolvedLimb } from "../rig/rig";
import { createAvatarScene } from "./avatar";

/** Presentation lifecycle only. Source cadence remains the only pose clock and solve owner. */
export function mountAvatarViewport(
  canvas: HTMLCanvasElement,
  readout: HTMLElement,
  yaw: HTMLInputElement,
  pitch: HTMLInputElement,
) {
  const avatar = createAvatarScene();
  const scene = new Scene();
  scene.add(avatar.parent);
  const camera = new PerspectiveCamera(38, 4 / 3, 0.01, 100);
  let renderer: WebGLRenderer | undefined;
  let available = true;
  let disposed = false;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
  } catch (error) {
    available = false;
    readout.textContent = `Three viewport unavailable; overlay/sources still work: ${String(error)}`;
  }
  const draw = () => {
    if (disposed || !available || renderer === undefined) return;
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
  };
  const lost = (event: Event) => {
    event.preventDefault();
    available = false;
    readout.textContent = "Three context lost; overlay/sources still work.";
  };
  const restored = () => {
    available = true;
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
