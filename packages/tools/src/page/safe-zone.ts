import { unreachable } from "./unreachable";
import type { Box } from "./frames";

/** A platform whose interface covers part of a vertical or wide frame. */
export type SafeZoneName = "tiktok" | "reels" | "shorts" | "youtube";

/** Every platform profile, in the order the usage text lists them. */
export const SAFE_ZONE_NAMES: readonly SafeZoneName[] = ["tiktok", "reels", "shorts", "youtube"];

/** One side of the frame. */
export type SafeEdge = "top" | "right" | "bottom" | "left";

/** A platform's native frame in px and the margins its interface reserves at that size. */
export interface SafeZone {
  readonly name: SafeZoneName;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/** The reserved margins of `name` at its native frame size. */
export function safeZone(name: SafeZoneName): SafeZone {
  switch (name) {
    case "tiktok":
      return { name, width: 1080, height: 1920, top: 140, right: 132, bottom: 320, left: 36 };
    case "reels":
      return { name, width: 1080, height: 1920, top: 140, right: 120, bottom: 300, left: 36 };
    case "shorts":
      return { name, width: 1080, height: 1920, top: 140, right: 128, bottom: 340, left: 36 };
    case "youtube":
      return { name, width: 1920, height: 1080, top: 54, right: 96, bottom: 54, left: 96 };
    default:
      return unreachable(name);
  }
}

/** The usage line for a `--safe-zone` flag with a missing or unknown name. */
export const SAFE_ZONE_USAGE = `--safe-zone needs one of ${SAFE_ZONE_NAMES.join(", ")}.`;

/** The platform `text` names, or undefined when it names none. */
export function parseSafeZone(text: string | undefined): SafeZoneName | undefined {
  return SAFE_ZONE_NAMES.find((name) => name === text);
}

/** Edges whose margin band the on-stage part of `box` enters, in top, right, bottom, left order; margins scale with the stage. */
export function unsafeEdges(
  box: Box,
  zone: SafeZone,
  stage: { readonly width: number; readonly height: number },
): readonly SafeEdge[] {
  const left = Math.max(box.x, 0);
  const top = Math.max(box.y, 0);
  const right = Math.min(box.x + box.width, stage.width);
  const bottom = Math.min(box.y + box.height, stage.height);
  if (right <= left || bottom <= top) return [];
  const across = stage.width / zone.width;
  const down = stage.height / zone.height;
  const edges: SafeEdge[] = [];
  if (top < zone.top * down) edges.push("top");
  if (right > stage.width - zone.right * across) edges.push("right");
  if (bottom > stage.height - zone.bottom * down) edges.push("bottom");
  if (left < zone.left * across) edges.push("left");
  return edges;
}
