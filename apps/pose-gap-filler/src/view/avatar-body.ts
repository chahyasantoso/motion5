import {
  createSkeletonDriver,
  type FrameSource,
  type SkeletonDriver,
} from "@motion5/three/skeleton";
import { Mesh, type Material, type Object3D } from "three";
import {
  invalidSkeleton,
  loadGltfAvatar,
  parseGltf,
  type GltfAvatar,
  type GltfAvatarLoad,
  type GltfAvatarRefusal,
  type GltfParse,
} from "./gltf-avatar";
import { unreachable } from "../filler/unreachable";
import { AVATAR_SOURCES } from "./avatar-frame-source";
import { createPresentationHistory } from "./presentation-history";

export type AvatarBody =
  | { readonly kind: "primitives" }
  | {
      readonly kind: "gltf";
      readonly avatar: GltfAvatar;
      readonly driver: SkeletonDriver;
      readonly history: ReturnType<typeof createPresentationHistory>;
      readonly materials: ReadonlyMap<Mesh, Material | Material[]>;
    };
export type AvatarBodyLoad =
  | { readonly kind: "installed" }
  | { readonly kind: "discarded" }
  | { readonly kind: "refused"; readonly refusal: GltfAvatarRefusal };

/** Both presentation bodies use the same stale material operation. */
export function setStale(object: Object3D, material: Material): void {
  object.traverse((child) => {
    if (child instanceof Mesh) child.material = material;
  });
}

/** Presentation-only ownership: generation, resource disposal, reset and freshness. */
export function createAvatarBodyController(
  parent: Object3D,
  primitives: ReadonlyMap<string, Object3D>,
  staleMaterial: Material,
) {
  let body: AvatarBody = { kind: "primitives" };
  let generation = 0;
  let disposed = false;
  const release = (): void => {
    switch (body.kind) {
      case "primitives":
        return;
      case "gltf":
        body.history.clear();
        for (const [mesh, material] of body.materials) mesh.material = material;
        body.avatar.dispose();
        return;
      default:
        return unreachable(body, "avatar body");
    }
  };
  return {
    get body(): AvatarBody {
      return body;
    },
    /** Never rejects: every failure is a refusal and leaves the current body untouched. */
    async load(
      data: ArrayBuffer | Promise<ArrayBuffer>,
      parse: GltfParse = parseGltf,
    ): Promise<AvatarBodyLoad> {
      if (disposed) return { kind: "discarded" };
      const request = ++generation;
      let result: GltfAvatarLoad;
      try {
        result = await loadGltfAvatar(await data, parse);
      } catch (cause) {
        result = { kind: "refused", refusal: { kind: "load-failed", cause } };
      }
      if (disposed || request !== generation) {
        switch (result.kind) {
          case "loaded":
            result.avatar.dispose();
            break;
          case "refused":
            break;
          default:
            return unreachable(result, "avatar load");
        }
        return { kind: "discarded" };
      }
      switch (result.kind) {
        case "refused":
          return result;
        case "loaded": {
          const avatar = result.avatar;
          // Imported metres/y-up live under the one calibrated mm/camera-space parent.
          avatar.scene.rotation.x = Math.PI;
          avatar.scene.scale.setScalar(1000);
          avatar.scene.visible = false;
          // Attach first so the driver validates the real ancestor chain; a refusal detaches.
          parent.add(avatar.scene);
          let driver: SkeletonDriver;
          try {
            driver = createSkeletonDriver(avatar.binding, {
              sourceSpace: parent,
              drives: avatar.drives,
            });
          } catch (cause) {
            avatar.dispose();
            return { kind: "refused", refusal: invalidSkeleton(cause) };
          }
          const objects = new Map<string, Object3D>();
          for (const captured of avatar.binding.bones)
            if (captured.key !== undefined)
              objects.set(captured.key, avatar.binding.boneOf(captured.key));
          const materials = new Map<Mesh, Material | Material[]>();
          avatar.scene.traverse((object) => {
            if (object instanceof Mesh) materials.set(object, object.material);
          });
          release();
          body = {
            kind: "gltf",
            avatar,
            driver,
            history: createPresentationHistory(objects),
            materials,
          };
          for (const object of primitives.values()) object.visible = false;
          return { kind: "installed" };
        }
        default:
          return unreachable(result, "avatar load");
      }
    },
    usePrimitives() {
      if (disposed) return;
      generation += 1;
      release();
      body = { kind: "primitives" };
      for (const object of primitives.values())
        object.visible = object.userData.freshness?.kind !== "unavailable";
    },
    update(tMs: number, read: FrameSource) {
      if (disposed) return;
      switch (body.kind) {
        case "primitives":
          return;
        case "gltf": {
          const current = body;
          current.history.begin(tMs);
          const outcomes = current.driver.apply(read).bones;
          const hasTorso = read(AVATAR_SOURCES.torso) !== undefined;
          for (const [key, outcome] of outcomes) {
            switch (outcome.kind) {
              case "applied":
                current.history.accept(key);
                break;
              case "rest":
                if (hasTorso) current.history.accept(key);
                break;
              case "held":
                break;
              default:
                unreachable(outcome, "bone outcome");
            }
          }
          let stale = false;
          current.history.finish(() => {
            stale = true;
          });
          for (const [mesh, material] of current.materials) mesh.material = material;
          if (stale) setStale(current.avatar.scene, staleMaterial);
          current.avatar.scene.visible = current.avatar.binding.bones.some(
            (captured) =>
              captured.key !== undefined &&
              current.avatar.binding.boneOf(captured.key).userData.freshness?.kind !==
                "unavailable",
          );
          for (const object of primitives.values()) object.visible = false;
          return;
        }
        default:
          return unreachable(body, "avatar body");
      }
    },
    clear() {
      switch (body.kind) {
        case "primitives":
          return;
        case "gltf":
          body.driver.reset();
          body.history.clear();
          body.avatar.scene.visible = false;
          return;
        default:
          return unreachable(body, "avatar body");
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      generation += 1;
      release();
      body = { kind: "primitives" };
    },
  };
}
