import { captureSkeleton, type BoneDrive, type SkeletonBinding } from "@motion5/three/skeleton";
import { LoadingManager, SkinnedMesh, Texture, type Object3D, type Material } from "three";
import { unreachable } from "../filler/unreachable";
import { limbTracks, poseNodeId } from "../rig/tracks";
import { AVATAR_SOURCES } from "./avatar-frame-source";
import { resolveHumanoid, torsoAimChildren, type HumanoidKey } from "./humanoid-map";

export type GltfParse = (data: ArrayBuffer) => Promise<{ readonly scene: Object3D }>;
export interface GltfAvatar {
  readonly scene: Object3D;
  readonly binding: SkeletonBinding;
  readonly drives: Readonly<Record<string, BoneDrive>>;
  dispose(): void;
}
export type GltfAvatarRefusal =
  | { readonly kind: "load-failed"; readonly cause: unknown }
  | { readonly kind: "no-skinned-mesh" }
  | { readonly kind: "multiple-skeletons"; readonly count: number }
  | { readonly kind: "missing-bones"; readonly keys: readonly HumanoidKey[] }
  | { readonly kind: "ambiguous-bones"; readonly keys: readonly HumanoidKey[] }
  | { readonly kind: "invalid-skeleton"; readonly message: string };
export type GltfAvatarLoad =
  | { readonly kind: "loaded"; readonly avatar: GltfAvatar }
  | { readonly kind: "refused"; readonly refusal: GltfAvatarRefusal };

export function describeGltfAvatarRefusal(refusal: GltfAvatarRefusal): string {
  switch (refusal.kind) {
    case "load-failed":
      return `Avatar load failed: ${String(refusal.cause)}`;
    case "no-skinned-mesh":
      return "Avatar contains no skinned mesh.";
    case "multiple-skeletons":
      return `Avatar has ${refusal.count} distinct skeletons; exactly one is required.`;
    case "missing-bones":
      return `Avatar is missing required bones: ${refusal.keys.join(", ")}.`;
    case "ambiguous-bones":
      return `Avatar maps several bones to required keys: ${refusal.keys.join(", ")}.`;
    case "invalid-skeleton":
      return `Invalid avatar skeleton: ${refusal.message}`;
    default:
      return unreachable(refusal, "avatar refusal");
  }
}

/** The one spelling of a skeleton the capture or driver refused. */
export function invalidSkeleton(cause: unknown): GltfAvatarRefusal {
  return {
    kind: "invalid-skeleton",
    message: cause instanceof Error ? cause.message : String(cause),
  };
}

/** Dispose each owned GPU resource once, even when several meshes share a skeleton or material. */
export function disposeAvatarScene(scene: Object3D): void {
  const resources = new Set<{ dispose(): void }>();
  scene.traverse((object) => {
    const mesh = object as Object3D & {
      geometry?: { dispose(): void };
      material?: Material | Material[];
    };
    if (mesh.geometry !== undefined) resources.add(mesh.geometry);
    for (const material of mesh.material === undefined
      ? []
      : Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
      resources.add(material);
      for (const value of Object.values(material))
        if (value instanceof Texture) resources.add(value);
    }
    if (object instanceof SkinnedMesh) resources.add(object.skeleton);
  });
  scene.removeFromParent();
  for (const resource of resources) resource.dispose();
}

function humanoidDrives(
  boneKeys: Readonly<Record<string, HumanoidKey>>,
): Readonly<Record<string, BoneDrive>> {
  const drives: Record<string, BoneDrive> = {};
  for (const key of Object.values(boneKeys)) drives[key] = { kind: "rest" };
  // The torso basis is identity for an upright subject facing the camera, which is the avatar's
  // rest pose as placed by the app, so the hips follow it relative to their rest orientation.
  drives.hips = { kind: "basis", source: AVATAR_SOURCES.torso };
  for (const [limb, upper, lower] of [
    ["left-arm", "left-upper-arm", "left-lower-arm"],
    ["right-arm", "right-upper-arm", "right-lower-arm"],
    ["left-leg", "left-upper-leg", "left-lower-leg"],
    ["right-leg", "right-upper-leg", "right-lower-leg"],
  ] as const) {
    const ids = limbTracks(limb);
    drives[upper] = { kind: "aim", from: poseNodeId(ids.root), to: poseNodeId(ids.upper) };
    drives[lower] = { kind: "aim", from: poseNodeId(ids.upper), to: poseNodeId(ids.lower) };
  }
  for (const key of ["spine", "chest"])
    if (key in drives)
      drives[key] = { kind: "aim", from: AVATAR_SOURCES.hipsMid, to: AVATAR_SOURCES.shoulderMid };
  return Object.freeze(drives);
}

/** Import is evaluated only when a file is picked; tests inject texture-free parsers. */
export const parseGltf: GltfParse = async (data) => {
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  const manager = new LoadingManager();
  manager.setURLModifier((url) => {
    if (/^(data:|blob:)/i.test(url)) return url;
    throw new Error("External avatar resources are not supported; use GLB or embedded data URIs.");
  });
  return new GLTFLoader(manager).parseAsync(data, "");
};

/** Refusals never replace the current body; ownership of a loaded avatar passes to the caller. */
export async function loadGltfAvatar(data: ArrayBuffer, parse: GltfParse): Promise<GltfAvatarLoad> {
  let scene: Object3D;
  try {
    scene = (await parse(data)).scene;
  } catch (cause) {
    return { kind: "refused", refusal: { kind: "load-failed", cause } };
  }
  const refuse = (refusal: GltfAvatarRefusal): GltfAvatarLoad => {
    disposeAvatarScene(scene);
    return { kind: "refused", refusal };
  };
  const meshes: SkinnedMesh[] = [];
  scene.traverse((object) => {
    if (object instanceof SkinnedMesh) meshes.push(object);
  });
  if (meshes.length === 0) return refuse({ kind: "no-skinned-mesh" });
  const skeletons = new Set(meshes.map((mesh) => mesh.skeleton));
  if (skeletons.size !== 1) return refuse({ kind: "multiple-skeletons", count: skeletons.size });
  const skeleton = meshes[0]!.skeleton;
  const { boneKeys, missing, ambiguous } = resolveHumanoid(skeleton);
  if (missing.length > 0) return refuse({ kind: "missing-bones", keys: missing });
  if (ambiguous.length > 0) return refuse({ kind: "ambiguous-bones", keys: ambiguous });
  let binding: SkeletonBinding;
  try {
    binding = captureSkeleton(skeleton, {
      boneKeys,
      aimChildren: torsoAimChildren(skeleton, boneKeys),
    });
  } catch (cause) {
    return refuse(invalidSkeleton(cause));
  }
  for (const mesh of meshes) mesh.frustumCulled = false;
  let disposed = false;
  return {
    kind: "loaded",
    avatar: {
      scene,
      binding,
      drives: humanoidDrives(boneKeys),
      dispose() {
        if (disposed) return;
        disposed = true;
        disposeAvatarScene(scene);
      },
    },
  };
}
