import React, { useCallback, useEffect, useRef } from "react";
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
import { usePlayer, useTarget } from "@gerak/react";
import { applyPose3d } from "@gerak/three";
import { useTarget3d } from "@gerak/three/react";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import {
  ARM,
  CAPTION,
  CUBE,
  MARK,
  cues,
  clock,
  lens,
  scene,
  stage,
  wordsShown,
} from "./overlay3d-scene";

const UP = new Vector3(0, 1, 0);

/** A cube turning with a short arm, and three DOM callouts pinned over it from the scene's own numbers. */
export const Overlay3d: React.FC<{ readonly onReady?: () => void }> = ({ onReady }) => {
  const playing = usePlayer(scene, clock, cues);
  const player = playing?.player;
  const draw = useRef<() => void>(() => undefined);
  const invalidate = useCallback(() => draw.current(), []);
  const object = useTarget3d(player, "object", { invalidate });
  const pin = useTarget(player, "pin");
  const tip = useTarget(player, "tip");
  const caption = useTarget(player, "caption");
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
    draw.current = () => renderer.render(world, camera);
    object(model);
    applyBones(skeleton, player.values.bones);
    show(player.values.caption.custom.words);
    const stopBones = player.subscribe("bones", (poses) => {
      applyBones(skeleton, poses);
      draw.current();
    });
    const stopCaption = player.subscribe("caption", (value) => show(value.custom.words));
    draw.current();
    onReady?.();
    return () => {
      draw.current = () => undefined;
      stopBones();
      stopCaption();
      object(null);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [player, object, onReady]);

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
