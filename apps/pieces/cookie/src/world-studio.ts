import * as THREE from "three";
import {
  createStage3d,
  type ObjectListWriter3d,
  type ObjectTarget3d,
  type Stage3d,
} from "@gerak/three";
import { LENS, STAGE_SIZE } from "./contract.ts";

export function createCookieStudio(
  canvas: HTMLCanvasElement,
  objects?: Readonly<Record<string, ObjectTarget3d>>,
  writers?: Readonly<Record<string, ObjectListWriter3d>>,
): Stage3d {
  const stage = createStage3d(canvas, LENS, {
    near: 0.1,
    far: 40,
    fallbackSize: STAGE_SIZE,
    ...(objects === undefined ? {} : { objects }),
    ...(writers === undefined ? {} : { writers }),
  });
  stage.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  stage.renderer.toneMappingExposure = 1.05;
  stage.renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.renderer.shadowMap.enabled = true;
  stage.renderer.shadowMap.type = THREE.PCFShadowMap;

  const keyLight = new THREE.DirectionalLight(0xfff6e8, 2.1);
  keyLight.position.set(3.2, 5.4, 3.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.02;
  stage.world.add(keyLight);

  const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0xe8d5c0, 1.15);
  stage.world.add(hemiLight);

  const fillLight = new THREE.DirectionalLight(0xfce8d8, 0.85);
  fillLight.position.set(-3.4, 2.1, 2.6);
  stage.world.add(fillLight);

  return stage;
}
