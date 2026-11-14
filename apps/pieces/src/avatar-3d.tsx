import React, { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { usePlayer } from "@gerak/react";
import { applyPose3d, morphTargets } from "@gerak/three";
import { useTarget3d } from "@gerak/three/react";
import { applyBones, captureSkeleton } from "@gerak/three/skeleton";
import { clock, cues, scene, signalMotionReady } from "./avatar-3d-scene";

const WIDTH = 1280;
const HEIGHT = 720;

/** Builds the 3D stage, loads the rigged avatar, binds physics props, and renders each frame. */
export const Avatar3d: React.FC = () => {
  const playing = usePlayer(scene, clock, cues);
  const prop1 = useTarget3d(playing?.player, "prop1");
  const prop2 = useTarget3d(playing?.player, "prop2");
  const prop3 = useTarget3d(playing?.player, "prop3");
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = host.current;
    const player = playing?.player;
    if (parent === null || player === undefined) return undefined;

    const renderer = new WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    parent.appendChild(renderer.domElement);

    const stage = new Scene();
    stage.background = new Color(0x111622);

    const camera = new PerspectiveCamera(42, WIDTH / HEIGHT, 0.1, 100);
    camera.position.set(0, 2.4, 7.4);
    camera.lookAt(0, 2.0, 0);

    const ambient = new AmbientLight(0xffffff, 1.2);
    const keyLight = new DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 7, 5);
    const fillLight = new DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-4, 3, 4);
    const rimLight = new DirectionalLight(0xf472b6, 1.5);
    rimLight.position.set(0, 5, -4);
    stage.add(ambient, keyLight, fillLight, rimLight);

    const platformGeo = new CylinderGeometry(3.6, 3.8, 0.3, 64);
    const platformMat = new MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.5,
      metalness: 0.1,
    });
    const platform = new Mesh(platformGeo, platformMat);
    platform.position.set(0, -0.15, 0);

    const rimGeo = new RingGeometry(3.55, 3.65, 64);
    const rimMat = new MeshBasicMaterial({ color: 0x38bdf8, side: DoubleSide });
    const rim = new Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.005;
    stage.add(platform, rim);

    const prop1Geo = new BoxGeometry(0.6, 0.6, 0.6);
    const prop1Mat = new MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.25 });
    const prop1Mesh = new Mesh(prop1Geo, prop1Mat);
    stage.add(prop1Mesh);
    prop1(prop1Mesh);

    const prop2Geo = new BoxGeometry(0.5, 0.5, 0.5);
    const prop2Mat = new MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25 });
    const prop2Mesh = new Mesh(prop2Geo, prop2Mat);
    stage.add(prop2Mesh);
    prop2(prop2Mesh);

    const prop3Geo = new SphereGeometry(0.3, 32, 24);
    const prop3Mat = new MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.1,
    });
    const prop3Mesh = new Mesh(prop3Geo, prop3Mat);
    stage.add(prop3Mesh);
    prop3(prop3Mesh);

    let unsubChar: (() => void) | undefined;
    let unsubBones: (() => void) | undefined;
    let isDisposed = false;

    const loader = new GLTFLoader();
    const url = new URL("../references/RobotExpressive.glb", import.meta.url).href;

    loader.load(url, (gltf) => {
      if (isDisposed) return;
      const robot = gltf.scene;
      stage.add(robot);

      const skeleton = captureSkeleton(robot);
      const writer = morphTargets(robot);

      unsubChar = player.subscribe("character", (pose) => {
        applyPose3d(robot, pose, undefined, writer);
      });
      unsubBones = player.subscribe("bones", (poses) => {
        applyBones(skeleton, poses);
      });

      renderer.render(stage, camera);
      signalMotionReady();
    });

    let frame = requestAnimationFrame(function draw() {
      renderer.render(stage, camera);
      frame = requestAnimationFrame(draw);
    });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frame);
      unsubChar?.();
      unsubBones?.();
      prop1(null);
      prop2(null);
      prop3(null);
      platformGeo.dispose();
      platformMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      prop1Geo.dispose();
      prop1Mat.dispose();
      prop2Geo.dispose();
      prop2Mat.dispose();
      prop3Geo.dispose();
      prop3Mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [playing?.player, prop1, prop2, prop3]);

  return <div ref={host} className="stage" onClick={() => playing?.driver.replay()} />;
};
