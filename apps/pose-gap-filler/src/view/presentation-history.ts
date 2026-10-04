import type { Object3D } from "three";
import { unreachable } from "../filler/unreachable";

/** Evidence and presentation freshness are independent. Stale is never an inferred observation. */
export type PresentationFreshness =
  | { readonly kind: "current"; readonly tMs: number }
  | { readonly kind: "stale"; readonly lastCurrentMs: number }
  | { readonly kind: "unavailable" };

/**
 * The persistent display primitives themselves retain their last accepted transforms. This owner
 * retains only freshness metadata, not observations, patches or solver inputs. Skipped primitives
 * are not mutated by the avatar, so restoring visibility cannot train or re-enter any pipeline.
 */
export function createPresentationHistory(objects: ReadonlyMap<string, Object3D>) {
  const last = new Map<string, number>();
  const current = new Set<string>();
  let tMs = 0;
  return {
    begin(time: number) {
      tMs = time;
      current.clear();
      for (const object of objects.values()) object.visible = false;
    },
    accept(id: string) {
      current.add(id);
      last.set(id, tMs);
      objects.get(id)!.userData.freshness = {
        kind: "current",
        tMs,
      } satisfies PresentationFreshness;
    },
    finish(stale: (id: string) => void) {
      for (const [id, object] of objects) {
        const saved = last.get(id);
        const status: PresentationFreshness = current.has(id)
          ? { kind: "current", tMs }
          : saved === undefined
            ? { kind: "unavailable" }
            : { kind: "stale", lastCurrentMs: saved };
        object.userData.freshness = status;
        switch (status.kind) {
          case "current":
            break;
          case "stale":
            object.visible = true;
            stale(id);
            break;
          case "unavailable":
            object.visible = false;
            break;
          default:
            unreachable(status, "presentation freshness");
        }
      }
    },
    clear() {
      last.clear();
      current.clear();
      for (const object of objects.values()) {
        object.visible = false;
        object.userData.freshness = { kind: "unavailable" } satisfies PresentationFreshness;
      }
    },
  };
}
