import { HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { createAvatarScene } from "../../src/view/avatar";
import { avatarFrameSource } from "../../src/view/avatar-frame-source";
import { createAvatarFraming } from "../../src/view/avatar-framing";
import { createGapPipeline } from "../../src/filler/pipeline";
import { WORLD_SPACE } from "../../src/filler/space";
import { jointRecord } from "../../src/filler/landmarks";
import { scale } from "../../src/filler/vec";
import { syntheticWorldPose } from "../../src/replay/synthetic";
import { createWorldRigSolver } from "../../src/rig/solver";
import { syntheticGlb } from "./synthetic-glb";
import { frameOf } from "../frames";

declare global {
  interface Window {
    phase10Smoke?: {
      ok: boolean;
      bytes?: number;
      msPerApply?: number;
      msPerFraming?: number;
      drawCalls?: number;
      error?: string;
    };
  }
}

async function run() {
  const canvas = document.querySelector("canvas")!;
  const renderer = new WebGLRenderer({ canvas, antialias: false });
  renderer.setSize(640, 480);
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 4 / 3, 0.01, 100);
  const avatar = createAvatarScene();
  scene.add(avatar.parent, new HemisphereLight(0xffffff, 0x64748b, 3));
  const solver = createWorldRigSolver({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  });
  try {
    const bytes = syntheticGlb();
    const loaded = await avatar.loadAvatar(bytes);
    if (loaded.kind !== "installed") throw new Error(`Browser avatar load: ${loaded.kind}`);
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    const points = jointRecord((joint) =>
      scale(syntheticWorldPose({ kind: "exercise" }, 400)[joint], 1000),
    );
    const step = pipeline.step(frameOf(points, 0, WORLD_SPACE));
    const solved = solver.solve(step, pipeline.lengths);
    const residuals = avatar.update(step, solved, pipeline.lengths, solver.readPatch);
    const body = avatar.body;
    if (body.kind !== "gltf" || !body.avatar.scene.visible)
      throw new Error("Imported body not visible");
    const read = avatarFrameSource(step, residuals, solver.readPatch);
    const frame = createAvatarFraming();
    // One presented frame drives the skeleton and frames it; time both, as the viewport pays both.
    const present = () => {
      body.driver.apply(read);
      frame(camera, avatar.parent, 20, -5);
    };
    for (let i = 0; i < 100; i += 1) present();
    const iterations = 3000;
    const start = performance.now();
    for (let i = 0; i < iterations; i += 1) present();
    const msPerApply = (performance.now() - start) / iterations;
    const framingStart = performance.now();
    for (let i = 0; i < iterations; i += 1) frame(camera, avatar.parent, 20, -5);
    const msPerFraming = (performance.now() - framingStart) / iterations;
    renderer.render(scene, camera);
    if (renderer.info.render.calls < 1) throw new Error("No WebGL draw calls");
    window.phase10Smoke = {
      ok: true,
      bytes: bytes.byteLength,
      msPerApply,
      msPerFraming,
      drawCalls: renderer.info.render.calls,
    };
  } finally {
    avatar.dispose();
    solver.dispose();
    // Keep the rendered canvas available to the screenshot, then free the renderer.
    renderer.dispose();
  }
}
void run().catch((cause) => {
  window.phase10Smoke = { ok: false, error: String(cause) };
});
