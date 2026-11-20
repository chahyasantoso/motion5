import React, { useEffect, useRef } from "react";
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Events, Pose3d, Time } from "@gerak/core";
import { usePlayer } from "@gerak/react";
import { compileScene, formatStageError, frame } from "@gerak/stage";
import { bindScene3d } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/rig-three";
import type { Shape3d } from "@gerak/physics";
import piece, { clock, props } from "./avatar-3d-scene";

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const scene = compiled.stage;
const signal = (time: Time, events: Events) => frame(scene, { time, events }).targets;

function propMesh(meshes: Readonly<Record<string, Mesh>>, id: string): Mesh {
  const mesh = meshes[id];
  if (mesh === undefined) throw new Error(`No mesh for prop "${id}".`);
  return mesh;
}

const WIDTH = 1280;
const HEIGHT = 720;
const MODEL_URL = new URL("../../references/dragonling.glb", import.meta.url).href;
const PROP_COLOURS: Readonly<Record<string, number>> = {
  block: 0x8fd3b6,
  ball: 0xf2c94c,
  cube: 0xb7a6e8,
  marble: 0x7cc4e8,
  tile: 0xf4a7a0,
};

let markReady: () => void = () => undefined;
let markFailed: (reason: unknown) => void = () => undefined;

/** Settles once the model has loaded and the first frame has drawn, or fails with the loader's error. */
export const ready = new Promise<void>((resolve, reject) => {
  markReady = resolve;
  markFailed = reject;
});

function geometryOf(shape: Shape3d): BufferGeometry {
  switch (shape.kind) {
    case "sphere":
      return new SphereGeometry(shape.radius, 32, 20);
    case "box":
      return new BoxGeometry(shape.width, shape.height, shape.depth);
  }
}

/** Builds the stage, loads the dragonling, binds every target, and renders when a target is written; click replays. */
export const Avatar3d: React.FC = () => {
  const playing = usePlayer(signal, clock, scene.cues);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parent = host.current;
    const player = playing?.player;
    if (parent === null || player === undefined) return undefined;
    const renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    parent.appendChild(renderer.domElement);

    const stage = new Scene();
    stage.background = new Color(0x1c2536);
    const camera = new PerspectiveCamera(34, WIDTH / HEIGHT, 0.02, 20);
    const key = new DirectionalLight(0xfff1dc, 2.6);
    key.position.set(1.2, 2.2, 1.6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -0.8;
    key.shadow.camera.right = 0.8;
    key.shadow.camera.top = 0.8;
    key.shadow.camera.bottom = -0.8;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 6;
    key.shadow.bias = -0.0005;
    const rim = new DirectionalLight(0x8fb6ff, 1.4);
    rim.position.set(-1.5, 1.2, -1.8);
    stage.add(new HemisphereLight(0xdfe8ff, 0x3a2a24, 1.1), key, rim);

    const disposables: { dispose(): void }[] = [];
    const drum = new CylinderGeometry(0.5, 0.52, 0.12, 72);
    const top = new MeshStandardMaterial({ color: 0xeadcc2, roughness: 0.85 });
    disposables.push(drum, top);
    const platform = new Mesh(drum, top);
    platform.position.y = -0.06;
    platform.receiveShadow = true;
    stage.add(platform);

    const render = () => renderer.render(stage, camera);
    const meshes: Record<string, Mesh> = {};
    for (const prop of props) {
      const geometry = geometryOf(prop.spec.shape);
      const material = new MeshStandardMaterial({
        color: PROP_COLOURS[prop.id] ?? 0xffffff,
        roughness: 0.55,
      });
      disposables.push(geometry, material);
      const mesh = new Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(prop.spec.x, prop.spec.y, prop.spec.z);
      stage.add(mesh);
      meshes[prop.id] = mesh;
    }

    const dragon = new Group();
    stage.add(dragon);

    let live = true;
    let unbind: (() => void) | undefined;
    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (!live) return;
        const skeleton = captureSkeleton(gltf.scene);
        gltf.scene.traverse((object) => {
          if (object instanceof Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        dragon.add(gltf.scene);
        const poses: Record<string, Pose3d> = {};
        const bone = (name: string) => (pose: Pose3d) => {
          poses[name] = pose;
        };
        unbind = bindScene3d(
          player,
          scene,
          {
            camera,
            dragon,
            LeftFrontUpLeg: bone("LeftFrontUpLeg"),
            LeftFrontElbow: bone("LeftFrontElbow"),
            LeftFrontLeg: bone("LeftFrontLeg"),
            Neck: bone("Neck"),
            Head: bone("Head"),
            Jaw: bone("Jaw"),
            LeftWing: bone("LeftWing"),
            RightWing: bone("RightWing"),
            block: propMesh(meshes, "block"),
            ball: propMesh(meshes, "ball"),
            cube: propMesh(meshes, "cube"),
            marble: propMesh(meshes, "marble"),
            tile: propMesh(meshes, "tile"),
          },
          () => {
            applyBones(skeleton, poses);
            render();
          },
        );
        markReady();
      },
      undefined,
      (error) => markFailed(error),
    );

    render();
    return () => {
      live = false;
      unbind?.();
      for (const item of disposables) item.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [playing]);
  return <div ref={host} className="stage" onClick={() => playing?.driver.replay()} />;
};
