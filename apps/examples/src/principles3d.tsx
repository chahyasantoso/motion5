import React, { useCallback, useEffect, useRef } from "react";
import {
  AmbientLight,
  CircleGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TetrahedronGeometry,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";
import { usePlayer } from "@gerak/react";
import { useTarget3d } from "@gerak/three/react";
import { BODY_HEIGHT, clock, scene } from "./principles3d-scene";

const WIDTH = 1280;
const HEIGHT = 720;

/** A leaping body with a lagging antenna, a ground, a pad and a row of small objects, under an orbiting camera. */
export const Principles3d: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const renderRef = useRef<() => void>(() => undefined);
  const invalidate = useCallback(() => renderRef.current(), []);
  const body = useTarget3d(player, "body", { invalidate });
  const stretch = useTarget3d(player, "stretch", { invalidate });
  const face = useTarget3d(player, "face", { invalidate });
  const antenna = useTarget3d(player, "antenna", { invalidate });
  const pad = useTarget3d(player, "pad", { invalidate });
  const bit0 = useTarget3d(player, "bit0", { invalidate });
  const bit1 = useTarget3d(player, "bit1", { invalidate });
  const bit2 = useTarget3d(player, "bit2", { invalidate });
  const bit3 = useTarget3d(player, "bit3", { invalidate });
  const bit4 = useTarget3d(player, "bit4", { invalidate });
  const camera = useTarget3d(player, "camera", { invalidate });
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parent = host.current;
    if (parent === null) return undefined;
    const renderer = new WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x1b2236);
    parent.appendChild(renderer.domElement);
    const stage = new Scene();
    const lens = new PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 100);
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    const mesh = (geometry: BufferGeometry, color: number): Mesh => {
      const material = new MeshStandardMaterial({ color, roughness: 0.6 });
      geometries.push(geometry);
      materials.push(material);
      return new Mesh(geometry, material);
    };

    const ground = mesh(new CircleGeometry(9, 64), 0xd9cfb8);
    ground.rotation.x = -Math.PI / 2;
    const padMesh = mesh(new CylinderGeometry(1.3, 1.3, 0.06, 48), 0xe6b34a);
    padMesh.position.y = 0.03;
    const padGroup = new Group();
    padGroup.add(padMesh);

    const bodyGroup = new Group();
    const stretchGroup = new Group();
    const faceGroup = new Group();
    const shell = mesh(new CapsuleGeometry(0.42, BODY_HEIGHT - 0.84, 8, 24), 0xe2604d);
    shell.position.y = BODY_HEIGHT / 2;
    const nose = mesh(new ConeGeometry(0.12, 0.3, 16), 0xf6efe0);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, BODY_HEIGHT * 0.62, 0.5);
    const mount = new Group();
    mount.position.y = BODY_HEIGHT - 0.05;
    const antennaGroup = new Group();
    const stalk = mesh(new CylinderGeometry(0.03, 0.03, 0.9, 8), 0xf6efe0);
    stalk.position.y = 0.45;
    const tip = mesh(new SphereGeometry(0.1, 16, 12), 0xe6b34a);
    tip.position.y = 0.92;
    antennaGroup.add(stalk, tip);
    mount.add(antennaGroup);
    faceGroup.add(shell, nose, mount);
    stretchGroup.add(faceGroup);
    bodyGroup.add(stretchGroup);

    const bitRefs = [bit0, bit1, bit2, bit3, bit4];
    const bits = bitRefs.map(() => mesh(new TetrahedronGeometry(0.4), 0x7ccfb4));

    const sun = new DirectionalLight(0xfff1d6, 2.2);
    sun.position.set(4, 8, 6);
    stage.add(new AmbientLight(0xb9c4e8, 0.7), sun, ground, padGroup, bodyGroup, ...bits);

    body(bodyGroup);
    stretch(stretchGroup);
    face(faceGroup);
    antenna(antennaGroup);
    pad(padGroup);
    bitRefs.forEach((ref, index) => ref(bits[index] ?? null));
    camera(lens);
    renderRef.current = () => renderer.render(stage, lens);
    renderRef.current();
    return () => {
      renderRef.current = () => undefined;
      for (const ref of [body, stretch, face, antenna, pad, camera, ...bitRefs]) ref(null);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [body, stretch, face, antenna, pad, bit0, bit1, bit2, bit3, bit4, camera]);
  return <div ref={host} className="stage" onClick={() => playing?.driver.replay()} />;
};
