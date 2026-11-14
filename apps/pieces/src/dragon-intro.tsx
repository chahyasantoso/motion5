import React, { useEffect, useRef } from "react";
import {
  AmbientLight,
  CircleGeometry,
  Color,
  DirectionalLight,
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SphereGeometry,
  BoxGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Player } from "@gerak/player";
import { usePlayer, useTarget } from "@gerak/react";
import { applyPose3d } from "@gerak/three";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import eyes from "../references/dragonling.eyes.json" with { type: "json" };
import {
  PLUS_TARGETS,
  PROPS,
  PROP_TARGETS,
  TITLE,
  WORDS,
  WORD_TARGETS,
  clock,
  cues,
  lens,
  scene,
  stage,
} from "./dragon-intro-scene";

const MODEL = new URL("../references/dragonling.glb", import.meta.url).href;
const SPAWN_Y = 1.3;
const DARK = 0x0a0c13;

type DomName =
  | "title"
  | "bubble"
  | "card"
  | (typeof WORD_TARGETS)[number]
  | (typeof PLUS_TARGETS)[number];
type ThePlayer = Player<ReturnType<typeof scene>>;

interface MarkProps {
  readonly player: ThePlayer | undefined;
  readonly name: DomName;
  readonly className: string;
  readonly children?: React.ReactNode;
}

/** A DOM element that takes the scene's target of that name. */
const Mark: React.FC<MarkProps> = ({ player, name, className, children }) => {
  const ref = useTarget(player, name);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/** Builds the stage, loads the dragonling, binds each target and draws after each write; `onReady` runs once the
 * model has loaded and one frame has drawn, `onError` when it fails to load. */
export const DragonIntro: React.FC<{
  readonly onReady?: () => void;
  readonly onError?: (reason: unknown) => void;
}> = ({ onReady, onError }) => {
  const playing = usePlayer(scene, clock, cues);
  const player = playing?.player;
  const host = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = host.current;
    if (parent === null || player === undefined) return undefined;
    const renderer = new WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
    renderer.setSize(stage.width, stage.height);
    renderer.domElement.className = "canvas";
    parent.insertBefore(renderer.domElement, parent.firstChild);
    const world = new Scene();
    world.background = new Color(DARK);
    const camera = new PerspectiveCamera(lens.fov, stage.width / stage.height, 0.05, 40);
    applyPose3d(camera, lens);

    const key = new DirectionalLight(0xffc48a, 2.6);
    key.position.set(1.4, 2, 2.2);
    const rim = new DirectionalLight(0x6f9bff, 2.2);
    rim.position.set(-2, 1.2, -1.6);
    world.add(new AmbientLight(0x8a93b8, 0.9), key, rim);

    const floorGeometry = new CircleGeometry(2.6, 64);
    const floorMaterial = new MeshStandardMaterial({ color: 0x161c2b, roughness: 0.95 });
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    world.add(floor);

    const root = new Group();
    world.add(root);

    const geometries: BufferGeometry[] = [floorGeometry];
    const materials: MeshStandardMaterial[] = [floorMaterial];
    const meshes = PROPS.map((prop) => {
      const geometry =
        prop.shape.kind === "sphere"
          ? new SphereGeometry(prop.shape.radius, 14, 10)
          : new BoxGeometry(prop.shape.width, prop.shape.height, prop.shape.depth);
      const material = new MeshStandardMaterial({
        color: prop.color,
        emissive: prop.color,
        emissiveIntensity: 0.28,
        roughness: prop.shape.kind === "sphere" ? 0.25 : 0.4,
        metalness: prop.shape.kind === "sphere" ? 0.1 : 0.85,
        flatShading: prop.shape.kind === "sphere",
      });
      geometries.push(geometry);
      materials.push(material);
      const mesh = new Mesh(geometry, material);
      mesh.position.set(prop.x, SPAWN_Y, prop.z);
      mesh.scale.setScalar(0);
      world.add(mesh);
      return mesh;
    });

    let dirty = false;
    let drawn = false;
    const draw = () => renderer.render(world, camera);
    const invalidate = () => {
      if (dirty || !drawn) return;
      dirty = true;
      queueMicrotask(() => {
        dirty = false;
        draw();
      });
    };

    const lids: Group[] = [];
    let skeleton: ReturnType<typeof captureSkeleton> | undefined;
    let cancelled = false;
    // Kept so a model that loads after the first steps still takes their poses.
    let lastBones: Parameters<typeof applyBones>[1] = {};
    let lastShut = 0;
    const shutLids = (shut: number) => {
      lastShut = shut;
      for (const lid of lids) {
        lid.visible = shut > 0.001;
        lid.scale.y = Math.max(shut, 0.0001);
      }
    };

    const stops = [
      player.subscribe("lens", (pose) => {
        applyPose3d(camera, pose);
        invalidate();
      }),
      player.subscribe("dragon", (pose) => {
        applyPose3d(root, pose);
        invalidate();
      }),
      player.subscribe("bones", (poses) => {
        lastBones = poses;
        if (skeleton !== undefined) applyBones(skeleton, poses);
        invalidate();
      }),
      player.subscribe("blink", (pose) => {
        shutLids(pose.custom?.["shut"] ?? 0);
        invalidate();
      }),
      player.subscribe("caption", (pose) => {
        const share = pose.custom?.["share"] ?? 0;
        const words = bubble.current?.querySelectorAll<HTMLElement>(".w") ?? [];
        words.forEach((word, index) => {
          word.style.opacity = String(Math.min(1, Math.max(0, share * WORDS.length - index)));
        });
      }),
      ...meshes.map((mesh, index) =>
        player.subscribe(PROP_TARGETS[index] ?? "prop0", (pose) => {
          applyPose3d(mesh, pose, { x: PROPS[index]?.x ?? 0, y: SPAWN_Y, z: PROPS[index]?.z ?? 0 });
          invalidate();
        }),
      ),
    ];

    new GLTFLoader().load(
      MODEL,
      (gltf) => {
        if (cancelled) return;
        gltf.scene.updateMatrixWorld(true);
        skeleton = captureSkeleton(gltf.scene);
        const head = gltf.scene.getObjectByName("Head");
        if (head === undefined) {
          onError?.(new Error("The model has no Head bone."));
          return;
        }
        const headTurn = head.getWorldQuaternion(new Quaternion()).invert();
        const skin = new Color().setRGB(
          eyes.skin[0] ?? 0,
          eyes.skin[1] ?? 0,
          eyes.skin[2] ?? 0,
          LinearSRGBColorSpace,
        );
        const lidMaterial = new MeshStandardMaterial({ color: skin, roughness: 0.8 });
        const lidGeometry = new SphereGeometry(1, 18, 12);
        materials.push(lidMaterial);
        geometries.push(lidGeometry);
        for (const iris of [eyes.irises.left, eyes.irises.right]) {
          const side = Math.sign(iris.x);
          const half = { x: iris.width * 0.7, y: iris.height * 0.7, z: iris.depth * 0.32 };
          const at = new Vector3(iris.x, iris.y + half.y, iris.z + 0.024);
          head.worldToLocal(at);
          const lid = new Group();
          lid.position.copy(at);
          lid.quaternion.copy(headTurn);
          const cap: Object3D = new Mesh(lidGeometry, lidMaterial);
          cap.scale.set(half.x, half.y, half.z);
          cap.position.y = -half.y;
          lid.add(cap);
          lid.visible = false;
          head.add(lid);
          lids.push(lid);
        }
        root.add(gltf.scene);
        applyBones(skeleton, lastBones);
        shutLids(lastShut);
        drawn = true;
        draw();
        onReady?.();
      },
      undefined,
      (reason) => onError?.(reason),
    );

    return () => {
      cancelled = true;
      for (const stop of stops) stop();
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [player, onReady, onError]);

  return (
    <div
      ref={host}
      className="stage"
      style={{ width: stage.width, height: stage.height }}
      onClick={() => playing?.driver.replay()}
    >
      <Mark player={player} name="title" className="title">
        {TITLE.map((word, index) => (
          <Mark key={word} player={player} name={WORD_TARGETS[index] ?? "word0"} className="word">
            {word}
          </Mark>
        ))}
      </Mark>
      <div ref={bubble}>
        <Mark player={player} name="bubble" className="bubble">
          {WORDS.map((word, index) => (
            <span key={index} className="w" style={{ opacity: 0 }}>
              {word}{" "}
            </span>
          ))}
        </Mark>
      </div>
      <Mark player={player} name="card" className="card">
        <b>NEXT UP</b>
        <span>The Hoard Room</span>
        <em>Gems on the left, gold on the right.</em>
      </Mark>
      {PROPS.map((_, index) => (
        <Mark key={index} player={player} name={PLUS_TARGETS[index] ?? "plus0"} className="plus">
          +1
        </Mark>
      ))}
    </div>
  );
};
