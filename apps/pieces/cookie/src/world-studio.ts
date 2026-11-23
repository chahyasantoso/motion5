import * as THREE from "three";
import { applyPose3d } from "@gerak/three";
import { LENS, STAGE_SIZE } from "./contract.ts";

export interface CookieStudio {
  readonly world: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly resize: () => void;
  readonly draw: () => void;
  readonly dispose: () => void;
}

export function createCookieStudio(canvas: HTMLCanvasElement): CookieStudio {
  const world = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    LENS.fov,
    STAGE_SIZE.width / STAGE_SIZE.height,
    0.1,
    40,
  );
  applyPose3d(camera, LENS);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const keyLight = new THREE.DirectionalLight(0xfff6e8, 2.1);
  keyLight.position.set(3.2, 5.4, 3.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.02;
  world.add(keyLight);

  const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0xe8d5c0, 1.15);
  world.add(hemiLight);

  const fillLight = new THREE.DirectionalLight(0xfce8d8, 0.85);
  fillLight.position.set(-3.4, 2.1, 2.6);
  world.add(fillLight);

  const resize = (): void => {
    const width = canvas.clientWidth || STAGE_SIZE.width;
    const height = canvas.clientHeight || STAGE_SIZE.height;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
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

  return {
    world,
    camera,
    renderer,
    resize,
    draw,
    dispose,
  };
}
