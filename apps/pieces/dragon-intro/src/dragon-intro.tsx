import React, { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Events, Pose3d, Time } from "@gerak/core";
import { usePlayer } from "@gerak/react";
import { applyValue } from "@gerak/dom";
import { applyPose3d, bindScene3d } from "@gerak/three";
import { applyBones, attach, captureSkeleton } from "@gerak/rig-three";
import { compileScene, formatStageError, frame, poseOf } from "@gerak/stage";
import eyes from "../../references/dragonling.eyes.json" with { type: "json" };
import piece, { PLUSES, WORDS, clock, lens, propSpecs, speech, stage } from "./dragon-intro-scene";

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const scene = compiled.stage;
const signal = (time: Time, events: Events) => frame(scene, { time, events }).targets;

/** Writes a label's pose onto the element `find` answers, if it is mounted. */
const writeTo = (find: () => HTMLElement | null | undefined) => (value: unknown) => {
  const element = find();
  const pose = poseOf(value);
  if (element && pose !== undefined) applyValue(element, pose);
};

const TITLE = ["LITTLE", "EMBER", "TALKS"] as const;
const MODEL = new URL("../../references/dragonling.glb", import.meta.url).href;

/** Builds the Three.js stage, binds each target, and draws once per step; click replays.
 * `onReady` runs once the model has loaded and one frame has drawn; `onError` if it could not. */
export const DragonIntro: React.FC<{
  readonly onReady?: () => void;
  readonly onError?: (error: unknown) => void;
}> = ({ onReady, onError }) => {
  const playing = usePlayer(signal, clock, scene.cues);
  const host = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const pluses = useRef<(HTMLDivElement | null)[]>([]);
  const bubble = useRef<HTMLDivElement>(null);
  const said = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const player = playing?.player;
  useEffect(() => {
    const parent = host.current;
    if (parent === null || player === undefined) return undefined;
    let alive = true;
    const unsubscribe: (() => void)[] = [];
    const renderer = new WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(stage.width, stage.height);
    parent.insertBefore(renderer.domElement, parent.firstChild);
    const world = new Scene();
    const camera = new PerspectiveCamera(lens.fov, stage.width / stage.height, 0.05, 40);
    applyPose3d(camera, lens);
    const key = new DirectionalLight(0xffd9b0, 2.6);
    key.position.set(1.5, 2.5, 2.5);
    const rim = new DirectionalLight(0x6fa8ff, 1.4);
    rim.position.set(-2, 1.5, -2);
    world.add(new AmbientLight(0x8890c0, 0.9), key, rim);

    const floor = new Mesh(
      new CircleGeometry(0.9, 64),
      new MeshStandardMaterial({ color: 0x141a33, roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    world.add(floor);

    const colours = [0xffb347, 0x4fd1c5, 0xff6b6b, 0xa78bfa];
    const meshes = propSpecs.map((spec, i) => {
      const size = spec.size * 1.7;
      const mesh = new Mesh(
        spec.box ? new BoxGeometry(size, size, size) : new SphereGeometry(spec.size, 20, 14),
        new MeshStandardMaterial({
          color: colours[i % colours.length] ?? 0xffffff,
          roughness: 0.4,
          metalness: 0.2,
        }),
      );
      mesh.position.set(spec.x, 1.15, spec.z);
      mesh.scale.setScalar(0);
      world.add(mesh);
      return mesh;
    });

    const render = () => {
      if (alive) renderer.render(world, camera);
    };

    new GLTFLoader().load(
      MODEL,
      (gltf) => {
        if (!alive) return;
        const skeleton = captureSkeleton(gltf.scene);
        const dragon = new Group();
        dragon.add(gltf.scene);
        world.add(dragon);
        const lids = (["left", "right"] as const).map((side) => {
          const iris = eyes.irises[side];
          const lid = new Mesh(
            new SphereGeometry(0.036, 18, 12),
            new MeshStandardMaterial({
              color: new Color().setRGB(
                ...(eyes.skin as [number, number, number]),
                LinearSRGBColorSpace,
              ),
            }),
          );
          attach(skeleton, eyes.bone, lid, { at: new Vector3(iris.x, iris.y, iris.z) });
          lid.visible = false;
          return lid;
        });
        const bonePoses: Record<string, Pose3d> = {};
        const bone = (name: string) => (pose: Pose3d) => {
          bonePoses[name] = pose;
        };
        const props: Record<string, Mesh> = {};
        propSpecs.forEach((spec, i) => {
          const mesh = meshes[i];
          if (mesh !== undefined) props[spec.id] = mesh;
        });
        unsubscribe.push(
          bindScene3d(
            player,
            scene,
            {
              camera: (pose) => applyPose3d(camera, pose),
              dragon,
              Jaw: bone("Jaw"),
              Head: bone("Head"),
              Neck: bone("Neck"),
              face: (pose) => {
                const shut = pose.custom?.shut ?? 0;
                for (const lid of lids) {
                  lid.visible = shut > 0.02;
                  lid.scale.set(1, Math.max(shut, 0.001), 1);
                }
              },
              ...props,
            },
            () => {
              applyBones(skeleton, bonePoses);
              render();
            },
          ),
          ...WORDS.map((name, i) =>
            player.subscribe(
              name,
              writeTo(() => words.current[i]),
            ),
          ),
          player.subscribe(
            "titleWipe",
            writeTo(() => wipe.current),
          ),
          ...PLUSES.map((name, i) =>
            player.subscribe(
              name,
              writeTo(() => pluses.current[i]),
            ),
          ),
          player.subscribe("bubble", (value) => {
            const pose = poseOf(value);
            if (pose === undefined) return;
            if (bubble.current) applyValue(bubble.current, pose);
            const count = Math.ceil((pose.custom?.["spoken"] ?? 0) * speech.length - 0.001);
            if (said.current)
              said.current.textContent = speech.slice(0, Math.max(0, count)).join(" ");
          }),
          player.subscribe(
            "card",
            writeTo(() => card.current),
          ),
        );
        onReady?.();
      },
      undefined,
      (error) => onError?.(error),
    );
    return () => {
      alive = false;
      for (const stop of unsubscribe) stop();
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
      <div ref={wipe} className="title">
        {TITLE.map((word, i) => (
          <span
            key={word}
            ref={(el) => {
              words.current[i] = el;
            }}
            className="word"
          >
            {word}
          </span>
        ))}
      </div>
      {propSpecs.map((spec, i) => (
        <div
          key={spec.id}
          ref={(el) => {
            pluses.current[i] = el;
          }}
          className="plus"
        >
          +1
        </div>
      ))}
      <div ref={bubble} className="bubble">
        <span ref={said} />
      </div>
      <div ref={card} className="card">
        <b>VISITOR 01</b>
        <span>The hoard opens at dusk. Mind the sparks.</span>
      </div>
    </div>
  );
};
