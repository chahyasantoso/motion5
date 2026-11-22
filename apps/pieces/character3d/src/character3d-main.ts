import {
  AmbientLight,
  Bone,
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
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
import { applyPose3d, morphTargets, threeBinder } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/rig-three";
import piece, {
  BALL_RADIUS,
  BALL_SPAWN,
  PEDESTAL,
  REACH_TARGET,
  SKELETON_JOINTS,
} from "./character3d-scene";

const WIDTH = 1280;
const HEIGHT = 720;
const UP = new Vector3(0, 1, 0);

function linkMesh(
  from: { readonly x: number; readonly y: number; readonly z: number },
  to: { readonly x: number; readonly y: number; readonly z: number },
  radius: number,
  material: Material,
  geometries: BufferGeometry[],
): Mesh {
  const delta = new Vector3(to.x - from.x, to.y - from.y, to.z - from.z);
  const length = delta.length();
  const geometry = new CylinderGeometry(radius * 0.85, radius, length, 16);
  geometries.push(geometry);
  const mesh = new Mesh(geometry, material);
  mesh.position.copy(delta).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, delta.clone().normalize());
  return mesh;
}

function addMorphBox(
  width: number,
  height: number,
  depth: number,
  name: string,
  deform: (x: number, y: number, z: number) => readonly [number, number, number],
  material: Material,
  geometries: BufferGeometry[],
): Mesh {
  const geometry = new BoxGeometry(width, height, depth, 4, 1, 1);
  const base = geometry.attributes.position;
  if (base === undefined) throw new Error("BoxGeometry has no position attribute.");
  const morphed = new Float32Array(base.count * 3);
  for (let i = 0; i < base.count; i += 1) {
    const [dx, dy, dz] = deform(base.getX(i), base.getY(i), base.getZ(i));
    morphed[i * 3] = dx;
    morphed[i * 3 + 1] = dy;
    morphed[i * 3 + 2] = dz;
  }
  const attr = new Float32BufferAttribute(morphed, 3);
  attr.name = name;
  geometry.morphAttributes.position = [attr];
  geometries.push(geometry);
  const mesh = new Mesh(geometry, material);
  mesh.updateMorphTargets();
  mesh.morphTargetDictionary = { [name]: 0 };
  mesh.morphTargetInfluences = [0];
  return mesh;
}

const parent = document.getElementById("stage");
if (parent === null) throw new Error("#stage not found");

const renderer = new WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x1b2236);
parent.appendChild(renderer.domElement);

const stage = new Scene();
const lens = new PerspectiveCamera(42, WIDTH / HEIGHT, 0.1, 100);
const geometries: BufferGeometry[] = [];
const materials: Material[] = [];
const makeMat = (color: number, roughness = 0.55): MeshStandardMaterial => {
  const mat = new MeshStandardMaterial({ color, roughness });
  materials.push(mat);
  return mat;
};
const makeMesh = (geometry: BufferGeometry, material: Material): Mesh => {
  geometries.push(geometry);
  return new Mesh(geometry, material);
};

const floor = makeMesh(new CircleGeometry(6.5, 64), makeMat(0x28324b, 0.85));
floor.rotation.x = -Math.PI / 2;

const pedestalMesh = makeMesh(
  new BoxGeometry(PEDESTAL.width, PEDESTAL.height, PEDESTAL.depth),
  makeMat(0x4f5d7a, 0.7),
);
pedestalMesh.position.set(PEDESTAL.x, PEDESTAL.y, PEDESTAL.z);

const targetMarker = makeMesh(new SphereGeometry(0.045, 16, 12), makeMat(0x7ccfb4, 0.3));
targetMarker.position.set(REACH_TARGET.x, REACH_TARGET.y, REACH_TARGET.z);

const ballMesh = makeMesh(new SphereGeometry(BALL_RADIUS, 28, 20), makeMat(0xe2604d, 0.35));

const characterRoot = new Group();
const hips = new Bone();
hips.name = "hips";
hips.position.set(SKELETON_JOINTS.hips.x, SKELETON_JOINTS.hips.y, SKELETON_JOINTS.hips.z);

const spine = new Bone();
spine.name = "spine";
spine.position.set(
  SKELETON_JOINTS.spine.x - SKELETON_JOINTS.hips.x,
  SKELETON_JOINTS.spine.y - SKELETON_JOINTS.hips.y,
  SKELETON_JOINTS.spine.z - SKELETON_JOINTS.hips.z,
);

const shoulder = new Bone();
shoulder.name = "shoulder";
shoulder.position.set(
  SKELETON_JOINTS.shoulder.x - SKELETON_JOINTS.spine.x,
  SKELETON_JOINTS.shoulder.y - SKELETON_JOINTS.spine.y,
  SKELETON_JOINTS.shoulder.z - SKELETON_JOINTS.spine.z,
);

const elbow = new Bone();
elbow.name = "elbow";
elbow.position.set(
  SKELETON_JOINTS.elbow.x - SKELETON_JOINTS.shoulder.x,
  SKELETON_JOINTS.elbow.y - SKELETON_JOINTS.shoulder.y,
  SKELETON_JOINTS.elbow.z - SKELETON_JOINTS.shoulder.z,
);

const hand = new Bone();
hand.name = "hand";
hand.position.set(
  SKELETON_JOINTS.hand.x - SKELETON_JOINTS.elbow.x,
  SKELETON_JOINTS.hand.y - SKELETON_JOINTS.elbow.y,
  SKELETON_JOINTS.hand.z - SKELETON_JOINTS.elbow.z,
);

characterRoot.add(hips);
hips.add(spine);
spine.add(shoulder);
shoulder.add(elbow);
elbow.add(hand);

const bodyMat = makeMat(0xe6b34a, 0.45);
const jointMat = makeMat(0xf6efe0, 0.4);
const faceMat = makeMat(0x1b2236, 0.3);

const legGeo = new CylinderGeometry(0.065, 0.055, SKELETON_JOINTS.hips.y, 16);
geometries.push(legGeo);
for (const side of [-0.12, 0.12]) {
  const leg = new Mesh(legGeo, bodyMat);
  leg.position.set(side, -SKELETON_JOINTS.hips.y / 2, 0);
  hips.add(leg);
}

const torsoBox = makeMesh(new BoxGeometry(0.42, 0.56, 0.24), bodyMat);
torsoBox.position.set(0, -0.08, 0);
const headMesh = makeMesh(new SphereGeometry(0.18, 24, 18), jointMat);
headMesh.position.set(0, 0.34, 0.02);

const leftEye = addMorphBox(
  0.045,
  0.045,
  0.02,
  "blink",
  (x, y, z) => [x, y * 0.15, z],
  faceMat,
  geometries,
);
leftEye.position.set(-0.06, 0.38, 0.185);
const rightEye = addMorphBox(
  0.045,
  0.045,
  0.02,
  "blink",
  (x, y, z) => [x, y * 0.15, z],
  faceMat,
  geometries,
);
rightEye.position.set(0.06, 0.38, 0.185);

const mouth = addMorphBox(
  0.11,
  0.02,
  0.02,
  "smile",
  (x, y, z) => [x * 1.15, y + Math.abs(x) * 0.45, z],
  faceMat,
  geometries,
);
mouth.position.set(0, 0.28, 0.188);

const leftArm = makeMesh(new CylinderGeometry(0.05, 0.045, 0.72, 16), bodyMat);
leftArm.position.set(-0.28, -0.14, 0);
leftArm.quaternion.setFromAxisAngle(new Vector3(0, 0, 1), -0.18);

spine.add(torsoBox, headMesh, leftEye, rightEye, mouth, leftArm);

const shoulderKnob = makeMesh(new SphereGeometry(0.075, 16, 12), jointMat);
const elbowKnob = makeMesh(new SphereGeometry(0.065, 16, 12), jointMat);
const handKnob = makeMesh(new SphereGeometry(0.065, 16, 12), makeMat(0x7ccfb4, 0.35));
const upperArm = linkMesh(
  SKELETON_JOINTS.shoulder,
  SKELETON_JOINTS.elbow,
  0.055,
  bodyMat,
  geometries,
);
const forearm = linkMesh(SKELETON_JOINTS.elbow, SKELETON_JOINTS.hand, 0.048, bodyMat, geometries);
shoulder.add(shoulderKnob, upperArm);
elbow.add(elbowKnob, forearm);
hand.add(handKnob);

const sun = new DirectionalLight(0xfff1d6, 2.2);
sun.position.set(4, 7, 6);
stage.add(
  new AmbientLight(0xb9c4e8, 0.75),
  sun,
  floor,
  pedestalMesh,
  targetMarker,
  ballMesh,
  characterRoot,
);

const skeleton = captureSkeleton(characterRoot);
const morphs = morphTargets(characterRoot);
const bonePoses: Record<string, Pose3d> = {};
const boneWriter = (name: string) => (pose: Pose3d) => {
  bonePoses[name] = pose;
};

ballMesh.position.set(BALL_SPAWN.x, BALL_SPAWN.y, BALL_SPAWN.z);
const mounted = mount(piece, {
  clock: "timed",
  root: parent,
  binders: [
    threeBinder(stage, {
      objects: {
        character: (pose) => applyPose3d(characterRoot, pose, undefined, morphs),
        spine: boneWriter("spine"),
        shoulder: boneWriter("shoulder"),
        elbow: boneWriter("elbow"),
        ball: ballMesh,
        camera: lens,
      },
      draw: () => {
        applyBones(skeleton, bonePoses);
        renderer.render(stage, lens);
      },
    }),
  ],
});

parent.addEventListener("click", () => {
  if ("replay" in mounted.driver && typeof mounted.driver.replay === "function")
    mounted.driver.replay();
});
