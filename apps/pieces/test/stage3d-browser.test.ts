import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;
const PREFIX = "stage3d-scratch-";
let copies = 0;

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT)) {
    if (folder.startsWith(PREFIX)) {
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
    }
  }
}

function writeStage3dScratchPage(): { readonly html: string } {
  copies += 1;
  const name = `${PREFIX}${copies}`;
  const dir = join(PIECES_ROOT, name);
  const srcDir = join(dir, "src");
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(
    join(dir, `${name}.html`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>createStage3d browser test</title>
    <style>
      html, body { margin: 0; width: 100%; height: 100%; }
      #gl { display: block; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <canvas data-cast="gl" id="gl"></canvas>
    <script type="module" src="/${name}/src/main.ts"></script>
  </body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    join(srcDir, "main.ts"),
    `import { aim, motion, orbit, type Lens3d, type Pose3d, type Time } from "@gerak/core";
import { mount } from "@gerak/dom";
import { beat, compileScene, formatStageError, object, sceneBuilder } from "@gerak/stage";
import { applyPose3d, createStage3d } from "@gerak/three";
import { NoToneMapping, Object3D, PerspectiveCamera } from "three";

const canvas = document.getElementById("gl");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing #gl canvas");

const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 6, azimuth: 30, elevation: 18 });
const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 42 };

function validationError(fn: () => unknown): string {
  try {
    fn();
    return "none";
  } catch (err) {
    return err instanceof RangeError ? err.message : String(err);
  }
}

const validationErrors = {
  fovZero: validationError(() => createStage3d(canvas, { ...lens, fov: 0 })),
  fov180: validationError(() => createStage3d(canvas, { ...lens, fov: 180 })),
  nearZero: validationError(() => createStage3d(canvas, lens, { near: 0 })),
  farLeqNear: validationError(() => createStage3d(canvas, lens, { near: 2, far: 2 })),
  dprZero: validationError(() => createStage3d(canvas, lens, { maxPixelRatio: 0 })),
};

const stage3d = createStage3d(canvas, lens, { near: 0.2, far: 60, maxPixelRatio: 1.5 });
const initialWorldChildren = stage3d.world.children.length;
const initialShadowEnabled = stage3d.renderer.shadowMap.enabled;
const initialToneMappingMatchesNone = stage3d.renderer.toneMapping === NoToneMapping;

const refCam = new PerspectiveCamera(lens.fov, 1, 0.2, 60);
applyPose3d(refCam, lens);

const cube = new Object3D();
cube.name = "cube";
stage3d.world.add(cube);

const move = beat("move", 1000);
const compiled = compileScene(
  sceneBuilder({ length: 1000 })
    .element(object("cube"))
    .motion(motion((t: Time): Pose3d => ({ x: 2 * t.progress, rotationY: 90 * t.progress })).in(move)),
);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\\n"));

mount(compiled.stage, { clock: "timed", binders: [stage3d.binder] });

Reflect.set(window, "__stage3dProbe", {
  initialWorldChildren,
  initialShadowEnabled,
  initialToneMappingMatchesNone,
  validationErrors,
  readState: () => ({
    fov: stage3d.camera.fov,
    near: stage3d.camera.near,
    far: stage3d.camera.far,
    aspect: stage3d.camera.aspect,
    pixelRatio: stage3d.renderer.getPixelRatio(),
    pos: stage3d.camera.position.toArray(),
    rot: [stage3d.camera.rotation.x, stage3d.camera.rotation.y, stage3d.camera.rotation.z],
    refPos: refCam.position.toArray(),
    refRot: [refCam.rotation.x, refCam.rotation.y, refCam.rotation.z],
    cubePos: cube.position.toArray(),
    cubeRotYDeg: (cube.rotation.y * 180) / Math.PI,
  }),
  triggerResize: () => stage3d.resize(),
  disposeStage: () => stage3d.dispose(),
});
`,
    "utf8",
  );
  return { html: `${name}/${name}.html` };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("createStage3d in the browser", () => {
  it("configures camera, renderer resize/DPR, zero-preset scene, and ThreeBinder driving", async () => {
    const scratch = writeStage3dScratchPage();
    const { pageErrors } = await withPage(
      { page: scratch.html, width: 960, height: 600, source: PIECES_SOURCE },
      async ({ page, advanceTo }) => {
        const init = await page.evaluate(() => {
          const probe = Reflect.get(window, "__stage3dProbe");
          if (typeof probe !== "object" || probe === null) throw new Error("missing probe");
          const readState = Reflect.get(probe, "readState");
          if (typeof readState !== "function") throw new Error("missing readState");
          return {
            initialWorldChildren: Reflect.get(probe, "initialWorldChildren"),
            initialShadowEnabled: Reflect.get(probe, "initialShadowEnabled"),
            initialToneMappingMatchesNone: Reflect.get(probe, "initialToneMappingMatchesNone"),
            validationErrors: Reflect.get(probe, "validationErrors"),
            state: readState(),
          };
        });

        expect(init.initialWorldChildren).toBe(0);
        expect(init.initialShadowEnabled).toBe(false);
        expect(init.initialToneMappingMatchesNone).toBe(true);
        expect(init.validationErrors).toEqual({
          fovZero: expect.stringMatching(/fov/),
          fov180: expect.stringMatching(/fov/),
          nearZero: expect.stringMatching(/near/),
          farLeqNear: expect.stringMatching(/far/),
          dprZero: expect.stringMatching(/maxPixelRatio/),
        });

        expect(init.state.fov).toBe(42);
        expect(init.state.near).toBe(0.2);
        expect(init.state.far).toBe(60);
        expect(init.state.aspect).toBeCloseTo(960 / 600, 6);
        expect(init.state.pixelRatio).toBeLessThanOrEqual(1.5);
        for (let i = 0; i < 3; i += 1) {
          expect(init.state.pos[i]).toBeCloseTo(init.state.refPos[i], 6);
          expect(init.state.rot[i]).toBeCloseTo(init.state.refRot[i], 6);
        }

        await advanceTo(500);
        const at500 = await page.evaluate(() => {
          const probe = Reflect.get(window, "__stage3dProbe");
          const readState =
            typeof probe === "object" && probe !== null
              ? Reflect.get(probe, "readState")
              : undefined;
          return typeof readState === "function" ? readState() : undefined;
        });
        expect(at500.cubePos[0]).toBeGreaterThan(0.9);
        expect(at500.cubePos[0]).toBeLessThan(1.05);
        expect(at500.cubeRotYDeg).toBeCloseTo(at500.cubePos[0] * 45, 5);

        await advanceTo(1020);
        const atEnd = await page.evaluate(() => {
          const probe = Reflect.get(window, "__stage3dProbe");
          const readState =
            typeof probe === "object" && probe !== null
              ? Reflect.get(probe, "readState")
              : undefined;
          return typeof readState === "function" ? readState() : undefined;
        });
        expect(atEnd.cubePos[0]).toBeCloseTo(2, 6);
        expect(atEnd.cubeRotYDeg).toBeCloseTo(90, 6);

        await page.setViewportSize({ width: 500, height: 1000 });
        const resized = await page.evaluate(() => {
          const probe = Reflect.get(window, "__stage3dProbe");
          if (typeof probe !== "object" || probe === null) throw new Error("missing probe");
          const triggerResize = Reflect.get(probe, "triggerResize");
          const readState = Reflect.get(probe, "readState");
          const disposeStage = Reflect.get(probe, "disposeStage");
          if (typeof triggerResize === "function") triggerResize();
          const state = typeof readState === "function" ? readState() : undefined;
          if (typeof disposeStage === "function") disposeStage();
          return state;
        });
        expect(resized.aspect).toBeCloseTo(0.5, 6);
        expect(resized.pixelRatio).toBeLessThanOrEqual(1.5);
      },
    );
    expect(pageErrors).toEqual([]);
  });
});
