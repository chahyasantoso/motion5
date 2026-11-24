import {
  AmbientLight,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { mount } from "@gerak/dom";
import { compileScene, formatStageError } from "@gerak/stage";
import { applyPose3d, threeBinder } from "@gerak/three";
import piece, { lens } from "./yuzu-3d";

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const stage = compiled.stage;

const canvas = document.getElementById("gl");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("#gl canvas not found");

const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
const world = new Scene();
const camera = new PerspectiveCamera(lens.fov, 1, 0.1, 100);
applyPose3d(camera, lens);

// A can: a dark body with a citrus band and lid; the materials fade with the pose's opacity.
const body = new MeshStandardMaterial({ color: 0x162218, roughness: 0.45, transparent: true });
const band = new MeshStandardMaterial({ color: 0xf2be35, roughness: 0.4, transparent: true });
const can = new Group();
const shell = new Mesh(new CylinderGeometry(0.62, 0.62, 2.4, 48), body);
const label = new Mesh(new CylinderGeometry(0.635, 0.635, 1.1, 48), band);
const lid = new Mesh(new CylinderGeometry(0.5, 0.58, 0.18, 48), band);
lid.position.y = 1.29;
can.add(shell, label, lid);
const light = new DirectionalLight(0xffffff, 2.2);
light.position.set(3, 5, 6);
world.add(new AmbientLight(0xffffff, 0.7), light, can);

const fit = (): void => {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

const draw = (): void => renderer.render(world, camera);
const drink = threeBinder(world, {
  objects: {
    drink: (pose, visible) => {
      can.visible = visible;
      applyPose3d(can, pose);
      body.opacity = pose.opacity ?? 1;
      band.opacity = pose.opacity ?? 1;
    },
  },
  resize: fit,
  draw,
});
mount(stage, { clock: "live", binders: [drink] });
