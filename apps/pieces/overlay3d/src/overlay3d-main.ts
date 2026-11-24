import {
  AmbientLight,
  BoxGeometry,
  Bone,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";
import type { Pose3d } from "@gerak/core";
import { mount } from "@gerak/dom";
import { applyPose3d, threeBinder } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/rig-three";
import { poseOf } from "@gerak/stage";
import piece, { ARM, CAPTION, CUBE, MARK, lens, stage, wordsShown } from "./overlay3d-scene";

const parent = document.getElementById("stage");
if (parent === null) throw new Error("#stage not found");

const UP = new Vector3(0, 1, 0);
const renderer = new WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
renderer.setSize(stage.width, stage.height);
renderer.setClearColor(0x1b2236);
parent.insertBefore(renderer.domElement, parent.firstChild);

const world = new Scene();
const camera = new PerspectiveCamera(lens.fov, stage.width / stage.height, 0.1, 100);
applyPose3d(camera, lens);

const geometries: BufferGeometry[] = [];
const materials: Material[] = [];
const lit = (color: number): MeshStandardMaterial => {
  const material = new MeshStandardMaterial({ color, roughness: 0.5 });
  materials.push(material);
  return material;
};
const mesh = (geometry: BufferGeometry, material: Material): Mesh => {
  geometries.push(geometry);
  return new Mesh(geometry, material);
};

const model = new Group();
model.add(mesh(new BoxGeometry(CUBE, CUBE, CUBE), lit(0xe6b34a)));

const mark = mesh(new SphereGeometry(0.07, 16, 12), lit(0x7ccfb4));
mark.position.set(MARK.x, MARK.y, MARK.z);
model.add(mark);

const bones = new Map<string, Bone>();
for (const [name, joint] of Object.entries(ARM)) {
  const bone = new Bone();
  bone.name = name;
  const above = joint.parent === null ? undefined : ARM[joint.parent];
  bone.position.set(
    joint.x - (above?.x ?? 0),
    joint.y - (above?.y ?? 0),
    joint.z - (above?.z ?? 0),
  );
  const holder = joint.parent === null ? model : bones.get(joint.parent);
  if (holder === undefined) throw new Error(`No parent bone for ${name}.`);
  holder.add(bone);
  bones.set(name, bone);
}

const armMaterial = lit(0xf6efe0);
for (const [name, joint] of Object.entries(ARM)) {
  const next = Object.values(ARM).find((other) => other.parent === name);
  const bone = bones.get(name);
  if (next === undefined || bone === undefined) continue;
  const delta = new Vector3(next.x - joint.x, next.y - joint.y, next.z - joint.z);
  const link = mesh(new CylinderGeometry(0.07, 0.09, delta.length(), 16), armMaterial);
  link.position.copy(delta).multiplyScalar(0.5);
  link.quaternion.setFromUnitVectors(UP, delta.clone().normalize());
  bone.add(link);
}

const marker = new MeshBasicMaterial({ color: 0xff00ff });
materials.push(marker);
bones.get("tip")?.add(mesh(new SphereGeometry(0.1, 20, 14), marker));
const skeleton = captureSkeleton(model);

const light = new DirectionalLight(0xfff1d6, 2.2);
light.position.set(4, 7, 6);
world.add(new AmbientLight(0xb9c4e8, 0.75), light, model);

const bonePoses: Record<string, Pose3d> = {};
const mounted = mount(piece, {
  clock: "timed",
  root: parent,
  binders: [
    threeBinder(world, {
      objects: {
        object: model,
        base: (pose) => {
          bonePoses["base"] = pose;
        },
        mid: (pose) => {
          bonePoses["mid"] = pose;
        },
      },
      draw: () => {
        applyBones(skeleton, bonePoses);
        renderer.render(world, camera);
      },
    }),
  ],
});

const words = document.getElementById("words");
const show = (value: unknown): void => {
  const count = poseOf(value)?.custom?.["words"];
  if (words !== null)
    words.textContent = CAPTION.slice(0, wordsShown(typeof count === "number" ? count : 0)).join(
      " ",
    );
};
show(mounted.player.values["caption"]);
mounted.player.subscribe("caption", show);
parent.addEventListener("click", () => {
  if ("replay" in mounted.driver && typeof mounted.driver.replay === "function")
    mounted.driver.replay();
});
