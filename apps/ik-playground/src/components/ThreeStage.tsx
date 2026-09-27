import React, { useLayoutEffect, useRef } from "react";
import type { ProjectHandle } from "@motion5/core";
import { createObject3dPatchAdapter } from "@motion5/three";
import * as THREE from "three";
import {
  IK3D,
  IK3D_FRAME,
  IK3D_GOAL_BOUNDS,
  IK3D_NODE_ID,
  IK3D_NODE_IDS,
  IK3D_VIEW,
} from "../ik3d-playground-project";
import { threeCamera } from "../projection";
import type { GoalControl } from "../goal-control";
import { GoalHandle, Ik3dFrame, Ik3dWorld } from "./Ik3dFrame";
import { BONE_COLOR, FRAME_COLOR, type FrameKind } from "./ik3d-palette";

interface ThreeScene {
  /** The renderer's own canvas; the stage mounts it and removes it again on disposal. */
  readonly canvas: HTMLCanvasElement;
  readonly adapter: ReturnType<typeof createObject3dPatchAdapter>;
  readonly resize: (width: number, height: number) => void;
  readonly render: () => void;
  readonly dispose: () => void;
}

function marker(kind: FrameKind): THREE.Group {
  const group = new THREE.Group();
  const color = FRAME_COLOR[kind];
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
    roughness: 0.45,
    metalness: 0.1,
  });
  const visible = new THREE.Mesh(
    new THREE.SphereGeometry(kind === "goal" ? 8 : 6, 20, 12),
    material,
  );
  visible.castShadow = true;
  group.add(visible);
  return group;
}

function member(id: (typeof IK3D.memberTracks)[number], length: number): THREE.Group {
  const group = new THREE.Group();
  const color = BONE_COLOR[id];
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.25,
    roughness: 0.42,
    metalness: 0.12,
  });
  const geometry = new THREE.BoxGeometry(length, 8, 8);
  // fk3d publishes the member frame at its tip. The link therefore points along local -x.
  geometry.translate(-length / 2, 0, 0);
  const bone = new THREE.Mesh(geometry, material);
  bone.castShadow = true;
  bone.receiveShadow = true;
  group.add(bone);

  const joint = new THREE.Mesh(
    new THREE.SphereGeometry(6, 16, 10),
    new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.15 }),
  );
  joint.castShadow = true;
  group.add(joint);
  return group;
}

function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Line)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) material.dispose();
  });
}

/**
 * Builds the scene with a renderer that owns its canvas. A React-owned canvas cannot be reused
 * after `forceContextLoss()`, which is exactly what StrictMode's remount did: the second
 * `WebGLRenderer` got a lost context and threw, and the page went blank.
 */
function makeScene(): ThreeScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#080c14");
  const rig = new THREE.Group();
  // Authored frames use CSS y-down coordinates; the mirrored rig is three.js y-up space.
  rig.scale.y = -1;
  scene.add(rig);

  const nodeMap = new Map<string, THREE.Object3D>();
  const root = marker("root");
  const pole = marker("pole");
  const goal = marker("goal");
  rig.add(root, pole, goal);
  nodeMap.set(IK3D_NODE_ID(IK3D.rootTrack), root);
  nodeMap.set(IK3D_NODE_ID(IK3D.poleTrack), pole);
  nodeMap.set(IK3D_NODE_ID(IK3D.goalTrack), goal);

  IK3D.memberTracks.forEach((id, index) => {
    const bone = member(id, IK3D.lengths[index]!);
    rig.add(bone);
    nodeMap.set(IK3D_NODE_ID(id), bone);
  });
  // The solver publishes inspection metadata rather than a frame; this hidden binding keeps the
  // adapter contract one node-to-object map without making the panel's readout a renderer concern.
  const solver = new THREE.Object3D();
  rig.add(solver);
  nodeMap.set(IK3D_NODE_ID(IK3D.solverTrack), solver);

  const ambient = new THREE.HemisphereLight("#dbeafe", "#111827", 1.5);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight("#ffffff", 2.2);
  // Scene space is y-up with the box at (0..width, 0..-height): light from above-right, in front.
  directional.position.set(IK3D_VIEW.width, 120, 420);
  directional.target.position.set(IK3D_VIEW.width / 2, -IK3D_VIEW.height / 2, 0);
  directional.castShadow = true;
  directional.shadow.mapSize.set(1024, 1024);
  directional.shadow.camera.left = -320;
  directional.shadow.camera.right = 320;
  directional.shadow.camera.top = 320;
  directional.shadow.camera.bottom = -320;
  directional.shadow.camera.far = 1400;
  // A soft contact cue, not a silhouette: the backdrop is far behind the chain.
  directional.shadow.intensity = 0.35;
  scene.add(directional.target);
  scene.add(directional);

  // A backdrop at the far depth bound catches the shadows, in the mirrored rig's CSS pixels.
  const { min, max } = IK3D_GOAL_BOUNDS;
  const centre = { x: (min.x + max.x) / 2, y: (min.y + max.y) / 2 };
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(IK3D_FRAME.width * 1.4, IK3D_FRAME.height * 1.4),
    new THREE.MeshStandardMaterial({ color: "#0b1322", roughness: 0.95, metalness: 0 }),
  );
  backdrop.position.set(centre.x, centre.y, min.z);
  backdrop.receiveShadow = true;
  rig.add(backdrop);
  const grid = new THREE.GridHelper(IK3D_FRAME.width * 1.4, 24, "#27496f", "#16253a");
  grid.rotation.x = Math.PI / 2;
  grid.position.set(centre.x, centre.y, min.z + 0.5);
  rig.add(grid);

  const view = threeCamera(IK3D_VIEW, IK3D_FRAME);
  const camera = new THREE.PerspectiveCamera(view.fov, view.aspect, 1, 3000);
  camera.position.set(view.position.x, view.position.y, view.position.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(view.target.x, view.target.y, view.target.z);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const adapter = createObject3dPatchAdapter((nodeId) => nodeMap.get(nodeId));
  let frame: number | undefined;
  const render = () => {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      renderer.render(scene, camera);
    });
  };

  return {
    canvas: renderer.domElement,
    adapter,
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      renderer.setSize(width, height, false);
      render();
    },
    render,
    dispose() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

/** Mounts the WebGL scene in `host` and keeps it posed from the runtime until the returned stop. */
function mountScene(host: HTMLElement, handle: ProjectHandle): () => void {
  const scene = makeScene();
  scene.canvas.className = "three-stage-canvas";
  scene.canvas.setAttribute("aria-hidden", "true");
  host.append(scene.canvas);

  const subscriptions = IK3D_NODE_IDS.map((nodeId) => {
    const initial = handle.get(nodeId);
    if (initial !== undefined) scene.adapter.apply(initial);
    return handle.subscribeNode(nodeId, (patch) => {
      scene.adapter.apply(patch);
      scene.render();
    });
  });
  const observer = new ResizeObserver(([entry]) => {
    if (entry !== undefined) scene.resize(entry.contentRect.width, entry.contentRect.height);
  });
  observer.observe(host);
  scene.resize(host.clientWidth, host.clientHeight);

  return () => {
    observer.disconnect();
    for (const unsubscribe of subscriptions) unsubscribe();
    scene.dispose();
  };
}

/** The WebGL canvas host; mounted inside the fitted frame, so it exists once it has a size. */
const ThreeCanvas: React.FC<{ readonly handle: ProjectHandle }> = ({ handle }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const host = hostRef.current;
    return host === null ? undefined : mountScene(host, handle);
  }, [handle]);
  return <div ref={hostRef} className="three-stage-host" />;
};

/**
 * The FABRIK 3D rig through `@motion5/three`. The canvas draws `IK3D_FRAME` exactly like the CSS
 * stage, so the goal handle layered over it is the same component, posed by the same frames.
 */
export const ThreeStage: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => (
  <section className="stage-card three-stage" aria-label="FABRIK 3D chain rendered with three.js">
    <div className="stage-card-heading">
      <strong>{IK3D.label}</strong>
      <span>four members · one goal · pole · three.js</span>
    </div>
    <Ik3dFrame className="ik3d-three">
      {(scale, toBox) => (
        <>
          <ThreeCanvas handle={handle} />
          <Ik3dWorld scale={scale}>
            <GoalHandle handle={handle} goals={goals} scale={scale} toBox={toBox} />
          </Ik3dWorld>
        </>
      )}
    </Ik3dFrame>
  </section>
);
