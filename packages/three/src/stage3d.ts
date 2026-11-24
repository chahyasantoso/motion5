import type { Lens3d } from "@gerak/core";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { applyPose3d } from "./pose3d";
import { threeBinder, type ObjectTarget3d, type ThreeBinder } from "./scene3d";

/** Options of `createStage3d`: clipping planes, pixel-ratio cap, object overrides, and fallback size. */
export interface Stage3dOptions {
  readonly near?: number | undefined;
  readonly far?: number | undefined;
  readonly maxPixelRatio?: number | undefined;
  readonly objects?: Readonly<Record<string, ObjectTarget3d>> | undefined;
  readonly fallbackSize?: { readonly width: number; readonly height: number } | undefined;
}

/** A bare Three.js scene, camera, renderer, and `threeBinder` wired to one `Lens3d`. */
export interface Stage3d {
  readonly world: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly binder: ThreeBinder;
  readonly resize: () => void;
  readonly draw: () => void;
  readonly dispose: () => void;
}

/** Wires a Three.js `Scene`, `PerspectiveCamera(lens)`, `WebGLRenderer`, and `threeBinder` with no preset look. */
export function createStage3d(
  canvas: HTMLCanvasElement,
  lens: Lens3d,
  options: Stage3dOptions = {},
): Stage3d {
  if (typeof HTMLCanvasElement === "undefined" || !(canvas instanceof HTMLCanvasElement))
    throw new TypeError("createStage3d: `canvas` must be an HTMLCanvasElement.");
  if (!Number.isFinite(lens.fov) || !(lens.fov > 0 && lens.fov < 180))
    throw new RangeError(
      `createStage3d: \`lens.fov\` must be above 0 and below 180, not ${lens.fov}.`,
    );
  const near = options.near ?? 0.1;
  const far = options.far ?? 100;
  const maxPixelRatio = options.maxPixelRatio ?? 2;
  if (!Number.isFinite(near) || !(near > 0))
    throw new RangeError(`createStage3d: \`near\` must be a finite positive number, not ${near}.`);
  if (!Number.isFinite(far) || !(far > near))
    throw new RangeError(
      `createStage3d: \`far\` must be finite and greater than near (${near}), not ${far}.`,
    );
  if (!Number.isFinite(maxPixelRatio) || !(maxPixelRatio > 0))
    throw new RangeError(
      `createStage3d: \`maxPixelRatio\` must be a finite positive number, not ${maxPixelRatio}.`,
    );
  if (
    options.fallbackSize !== undefined &&
    (!Number.isFinite(options.fallbackSize.width) ||
      !Number.isFinite(options.fallbackSize.height) ||
      !(options.fallbackSize.width > 0) ||
      !(options.fallbackSize.height > 0))
  ) {
    throw new RangeError(
      "createStage3d: `fallbackSize` width and height must be finite positive numbers.",
    );
  }

  const world = new Scene();
  const camera = new PerspectiveCamera(lens.fov, 1, near, far);
  applyPose3d(camera, lens);
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });

  const resize = (): void => {
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const width = canvas.clientWidth || options.fallbackSize?.width || winWidth || 1;
    const height = canvas.clientHeight || options.fallbackSize?.height || winHeight || 1;
    const dpr =
      typeof window !== "undefined" && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(Math.min(dpr, maxPixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const draw = (): void => {
    renderer.render(world, camera);
  };

  const dispose = (): void => {
    renderer.dispose();
  };

  resize();

  const binder = threeBinder(world, {
    ...(options.objects === undefined ? {} : { objects: options.objects }),
    resize,
    draw,
  });

  return Object.freeze({ world, camera, renderer, binder, resize, draw, dispose });
}
