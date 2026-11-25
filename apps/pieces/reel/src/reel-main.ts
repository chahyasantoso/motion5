import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  type BufferGeometry,
  type Material,
} from "three";
import { mount } from "@gerak/dom";
import { applyPose3d, createStage3d } from "@gerak/three";
import piece, { lens, size } from "./reel";

const root = document.getElementById("frame");
if (root === null) throw new Error("#frame not found");
const canvas = document.getElementById("stage-canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("#stage-canvas not found");

const geometries: BufferGeometry[] = [];
const materials: Material[] = [];
const makeMaterial = (
  color: number,
  metalness: number,
  roughness: number,
): MeshStandardMaterial => {
  const mat = new MeshStandardMaterial({ color, metalness, roughness });
  materials.push(mat);
  return mat;
};
const makeMesh = (geometry: BufferGeometry, material: Material): Mesh => {
  geometries.push(geometry);
  return new Mesh(geometry, material);
};

const dial = new Group();
dial.name = "dial";
dial.position.set(-0.08, -0.05, 0);

const obsidianMat = makeMaterial(0x1f1e24, 0.25, 0.65);
const brassMat = makeMaterial(0xd5a44d, 0.85, 0.28);
const capMat = makeMaterial(0x141317, 0.35, 0.5);
const finMat = makeMaterial(0xe24d2b, 0.2, 0.35);

const plinth = makeMesh(new CylinderGeometry(1.56, 1.76, 0.42, 64), obsidianMat);
plinth.position.y = -0.18;
dial.add(plinth);

const foot = makeMesh(new CylinderGeometry(1.64, 1.64, 0.1, 64), capMat);
foot.position.y = -0.44;
dial.add(foot);

const trim = makeMesh(new TorusGeometry(1.55, 0.045, 20, 64), brassMat);
trim.rotation.x = Math.PI / 2;
trim.position.y = 0.04;
dial.add(trim);

const knob = new Group();
knob.name = "knob";

const drum = makeMesh(new CylinderGeometry(1.16, 1.22, 0.54, 64), brassMat);
drum.position.y = 0.3;
knob.add(drum);

const ribGeo = new BoxGeometry(0.045, 0.46, 0.065);
geometries.push(ribGeo);
for (let i = 0; i < 24; i += 1) {
  const angle = (i / 24) * Math.PI * 2;
  const rib = new Mesh(ribGeo, brassMat);
  rib.position.set(Math.sin(angle) * 1.2, 0.3, Math.cos(angle) * 1.2);
  rib.rotation.y = angle;
  knob.add(rib);
}

const cap = makeMesh(new CylinderGeometry(0.96, 0.96, 0.08, 48), capMat);
cap.position.y = 0.58;
knob.add(cap);

const boss = makeMesh(new CylinderGeometry(0.24, 0.28, 0.11, 32), brassMat);
boss.position.y = 0.62;
knob.add(boss);

const fin = makeMesh(new BoxGeometry(0.11, 0.12, 0.66), finMat);
fin.position.set(0, 0.63, 0.38);
knob.add(fin);

dial.add(knob);

const pips = new Group();
pips.name = "pips";
const pipGeo = new SphereGeometry(0.062, 16, 12);
geometries.push(pipGeo);
for (let i = 0; i < 12; i += 1) {
  const angle = (i / 12) * Math.PI * 2;
  const pip = new Mesh(pipGeo, brassMat);
  pip.position.set(Math.sin(angle) * 1.4, 0.11, Math.cos(angle) * 1.4);
  pips.add(pip);
}
dial.add(pips);

const stage3d = createStage3d(canvas, lens, {
  fallbackSize: size,
  objects: {
    camera: (pose) => applyPose3d(stage3d.camera, pose),
    dial,
    knob,
    pips,
  },
});

stage3d.renderer.setClearColor(0x17161a);
const keyLight = new DirectionalLight(0xfff1dc, 2.8);
keyLight.position.set(4.5, 7, 5.5);
const rimLight = new DirectionalLight(0x9bb8ff, 1.4);
rimLight.position.set(-5, 3, -4);
stage3d.world.add(new AmbientLight(0xeae2d6, 0.9), keyLight, rimLight, dial);

const mounted = mount(piece, {
  clock: "timed",
  frame: "fit",
  root,
  binders: [stage3d.binder],
});

root.addEventListener("click", () => {
  if ("replay" in mounted.driver && typeof mounted.driver.replay === "function") {
    mounted.driver.replay();
  }
});
