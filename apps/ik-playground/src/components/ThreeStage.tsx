import React, { useLayoutEffect, useRef } from "react";
import type { ProjectHandle } from "@motion5/core";
import { createObject3dPatchAdapter } from "@motion5/three";
import * as THREE from "three";
import { IK3D, IK3D_NODE_ID, IK3D_NODE_IDS, IK3D_VIEW } from "../ik3d-playground-project";
import { threeCamera, unprojectPoint } from "../projection";
import { useGoalDrag } from "./goal-drag";
import type { GoalControl } from "../goal-control";

/** One colour per frame marker, keyed by the closed marker-kind union. */
type MarkerKind = "goal" | "pole" | "root";
const MARKER_COLOR: Readonly<Record<MarkerKind, string>> = {
  goal: "#fbbf24",
  pole: "#34d399",
  root: "#c084fc",
};

/** One colour per authored member, keyed by the closed member-id tuple. */
const BONE_COLOR: Readonly<Record<(typeof IK3D.memberTracks)[number], string>> = {
  upper: "#c084fc",
  fore: "#818cf8",
  wrist: "#38bdf8",
  hand: "#22d3ee",
};

interface ThreeScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly raycaster: THREE.Raycaster;
  readonly goal: THREE.Object3D;
  readonly adapter: ReturnType<typeof createObject3dPatchAdapter>;
  readonly nodeMap: Map<string, THREE.Object3D>;
  readonly render: () => void;
  readonly dispose: () => void;
}

interface GoalSession {
  readonly zAtGrab: number;
  readonly startScreenY: number;
}

function numberValue(
  values: Readonly<Record<string, unknown>>,
  key: string,
  fallback: number,
): number {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function screenPoint(
  event: React.PointerEvent<Element>,
  canvas: HTMLCanvasElement,
): { readonly x: number; readonly y: number } | undefined {
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return undefined;
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * IK3D_VIEW.width,
    y: ((event.clientY - bounds.top) / bounds.height) * IK3D_VIEW.height,
  };
}

function marker(kind: MarkerKind): THREE.Group {
  const group = new THREE.Group();
  const color = MARKER_COLOR[kind];
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
  if (kind === "goal") {
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(20, 16, 10),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    group.add(hit);
  }
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
    if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.LineSegments)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) material.dispose();
  });
}

function makeScene(canvas: HTMLCanvasElement): ThreeScene {
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
  directional.position.set(100, -80, 260);
  directional.castShadow = true;
  directional.shadow.mapSize.set(1024, 1024);
  directional.shadow.camera.left = -220;
  directional.shadow.camera.right = 220;
  directional.shadow.camera.top = 220;
  directional.shadow.camera.bottom = -220;
  scene.add(directional);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#111827",
    roughness: 0.9,
    metalness: 0,
    transparent: true,
    opacity: 0.72,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(440, 520), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(IK3D_VIEW.width / 2, -IK3D_VIEW.height, 0);
  floor.receiveShadow = true;
  scene.add(floor);
  const grid = new THREE.GridHelper(440, 22, "#334155", "#1e293b");
  grid.position.set(IK3D_VIEW.width / 2, -IK3D_VIEW.height + 0.2, 0);
  scene.add(grid);

  const view = threeCamera(IK3D_VIEW);
  const camera = new THREE.PerspectiveCamera(view.fov, view.aspect, 1, 3000);
  camera.position.set(view.position.x, view.position.y, view.position.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(view.target.x, view.target.y, view.target.z);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    renderer,
    camera,
    raycaster: new THREE.Raycaster(),
    goal,
    adapter,
    nodeMap,
    render,
    dispose() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

export const ThreeStage: React.FC<{
  readonly handle: ProjectHandle;
  readonly goals: GoalControl;
}> = ({ handle, goals }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<ThreeScene | undefined>(undefined);
  const drag = useGoalDrag<GoalSession>({
    begin(event) {
      const scene = sceneRef.current;
      const canvas = canvasRef.current;
      if (scene === undefined || canvas === null) return undefined;
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return undefined;
      scene.raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
        ),
        scene.camera,
      );
      if (scene.raycaster.intersectObject(scene.goal, true).length === 0) return undefined;
      const patch = handle.get(IK3D_NODE_ID(IK3D.goalTrack));
      const values = patch?.status === "ready" ? patch.values : {};
      const zAtGrab = numberValue(values, "z", IK3D.goal.z);
      const point = screenPoint(event, canvas);
      return point === undefined ? undefined : { zAtGrab, startScreenY: point.y };
    },
    move(session, event) {
      const canvas = canvasRef.current;
      if (canvas === null) return;
      const screen = screenPoint(event, canvas);
      if (screen === undefined) return;
      event.preventDefault();
      const z = event.shiftKey
        ? session.zAtGrab + session.startScreenY - screen.y
        : session.zAtGrab;
      const point = unprojectPoint(IK3D_VIEW, screen, z);
      if (point !== undefined) goals.move({ rig: "spatial", ...point });
    },
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas === null || container === null) return undefined;
    const scene = makeScene(canvas);
    sceneRef.current = scene;

    const subscriptions = IK3D_NODE_IDS.map((nodeId) => {
      const initial = handle.get(nodeId);
      if (initial !== undefined) scene.adapter.apply(initial);
      return handle.subscribeNode(nodeId, (patch) => {
        scene.adapter.apply(patch);
        scene.render();
      });
    });

    const resize = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      scene.renderer.setSize(width, height, false);
      scene.render();
    };
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) resize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(container);
    resize(container.clientWidth, container.clientHeight);
    scene.render();

    return () => {
      observer.disconnect();
      for (const unsubscribe of subscriptions) unsubscribe();
      scene.dispose();
      sceneRef.current = undefined;
    };
  }, [handle]);

  return (
    <div
      ref={containerRef}
      className="three-stage-canvas"
      style={{ width: "100%", aspectRatio: `${IK3D_VIEW.width} / ${IK3D_VIEW.height}` }}
    >
      <canvas
        ref={canvasRef}
        aria-label="FABRIK 3D chain rendered with three.js"
        style={{ display: "block", width: "100%", height: "100%", touchAction: "pan-y" }}
        {...drag}
      />
    </div>
  );
};
