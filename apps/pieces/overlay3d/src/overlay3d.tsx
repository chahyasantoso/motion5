import React, { useEffect, useRef } from "react";
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
import type { Events, Pose3d, Time } from "@gerak/core";
import { applyValue } from "@gerak/dom";
import { usePlayer, useTarget } from "@gerak/react";
import { applyPose3d, threeBinder } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/rig-three";
import { compileScene, formatStageError, frame, poseOf } from "@gerak/stage";
import piece, { ARM, CAPTION, CUBE, MARK, clock, lens, stage, wordsShown } from "./overlay3d-scene";

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const scene = compiled.stage;
const signal = (time: Time, events: Events) => frame(scene, { time, events }).targets;

/** Writes a callout's pose onto its element. */
const write = (element: Parameters<typeof applyValue>[0], value: unknown): void => {
  const pose = poseOf(value);
  if (pose !== undefined) applyValue(element, pose);
};

const UP = new Vector3(0, 1, 0);

/** A cube turning with a short arm, and three DOM callouts pinned over it from the scene's own numbers. */
export const Overlay3d: React.FC<{ readonly onReady?: () => void }> = ({ onReady }) => {
  const playing = usePlayer(signal, clock, scene.cues);
  const player = playing?.player;
  const pin = useTarget(player, "pin", write);
  const tip = useTarget(player, "tip", write);
  const caption = useTarget(player, "caption", write);
  const words = useRef<HTMLSpanElement>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = host.current;
    if (player === undefined || parent === null) return undefined;
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
    const cube = mesh(new BoxGeometry(CUBE, CUBE, CUBE), lit(0xe6b34a));
    model.add(cube);

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

    const show = (count: unknown) => {
      if (words.current !== null)
        words.current.textContent = CAPTION.slice(
          0,
          wordsShown(typeof count === "number" ? count : 0),
        ).join(" ");
    };
    const bonePoses: Record<string, Pose3d> = {};
    const stopCaption = player.subscribe("caption", (value) =>
      show(poseOf(value)?.custom?.["words"]),
    );
    const unbind = threeBinder(world, {
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
    }).start(player, scene);
    onReady?.();
    return () => {
      unbind();
      stopCaption();
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [player, onReady]);

  return (
    <div
      ref={host}
      className="stage"
      style={{ width: stage.width, height: stage.height }}
      onClick={() => playing?.driver.replay()}
    >
      <div ref={pin} className="callout callout-pin">
        corner of the cube
      </div>
      <div ref={tip} className="callout callout-tip">
        arm tip
      </div>
      <div ref={caption} className="callout callout-caption">
        <span ref={words} />
      </div>
    </div>
  );
};
