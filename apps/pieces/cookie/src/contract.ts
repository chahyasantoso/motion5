import {
  clamp,
  inputs,
  project3d,
  unproject3d,
  unreachable,
  viewSize3d,
  type Lens3d,
  type Point3d,
} from "@gerak/core";
import { placementOf, type RestReader, type Slot3d } from "@gerak/stage";
import type { CastName, DomCast, ObjectCast } from "../cookie.cast.ts";
export type { CastName, DomCast, ObjectCast };

export const BUILDER_CAPACITY = 6;
export const BUILDER_EXIT_POOL = 3;
export const BUILDER_MIN_SEAL = 4;
export const BUILDER_JAR_PRICE = 28;
export const BUILDER_CRUMB_COUNT = 12;
export const BUILDER_ARC_MS = 620;
export const BUILDER_EXIT_MS = 560;
export const BUILDER_SHIFT_MS = 220;
export const BUILDER_MIX_MS = 420;
export const BUILDER_SEAL_MS = 560;
export const BUILDER_UNSEAL_MS = 480;
export const BUILDER_CRUMB_MS = 2000;
export const JAR_SLOT_PREFIX = "jar-slot-";
export const JAR_SEALED_VALUE = "jar-sealed";
export const JAR_ADD_EVENT = "jar-add";
export const JAR_REMOVE_EVENT = "jar-remove";
export const JAR_MIX_EVENT = "jar-mix";
export const JAR_RESET_EVENT = "jar-reset";

export const JAR_SLOT_NAMES = [
  "jar-slot-0",
  "jar-slot-1",
  "jar-slot-2",
  "jar-slot-3",
  "jar-slot-4",
  "jar-slot-5",
] as const;

export type JarSlotName = (typeof JAR_SLOT_NAMES)[number];

export function jarSlotName(slotIndex: number): JarSlotName {
  return JAR_SLOT_NAMES[slotIndex] ?? "jar-slot-0";
}

export const SPOTLIGHT_ROLL_MS = 720;
export const FLAVOR_SELECT_EVENT = "flavor-select";

export const cookieInputs = inputs({
  values: {
    "jar-slot-0": {},
    "jar-slot-1": {},
    "jar-slot-2": {},
    "jar-slot-3": {},
    "jar-slot-4": {},
    "jar-slot-5": {},
    "jar-sealed": {},
    "flavor-select": {},
  },
  triggers: {
    "jar-add": {},
    "jar-remove": {},
    "jar-mix": {},
    "jar-reset": {},
  },
});
export const SPOTLIGHT_ZONE_THRESHOLDS = [0.22, 0.48, 0.74] as const;
export const SPOTLIGHT_ZONE_TARGETS = [0.08, 0.35, 0.61, 0.88] as const;

export type SpotlightZone = 0 | 1 | 2 | 3;

export const SPOTLIGHT_ZONES: readonly SpotlightZone[] = [0, 1, 2, 3];

export function isSpotlightZone(value: number): value is SpotlightZone {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

export function spotlightZoneForProgress(progress: number): SpotlightZone {
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[0]) {
    return 0;
  }
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[1]) {
    return 1;
  }
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[2]) {
    return 2;
  }
  return 3;
}

export function spotlightTargetForZone(zone: SpotlightZone): number {
  switch (zone) {
    case 0:
      return SPOTLIGHT_ZONE_TARGETS[0];
    case 1:
      return SPOTLIGHT_ZONE_TARGETS[1];
    case 2:
      return SPOTLIGHT_ZONE_TARGETS[2];
    case 3:
      return SPOTLIGHT_ZONE_TARGETS[3];
    default:
      return unreachable(zone);
  }
}

export interface FlavorSpec {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly price: number;
  readonly surfaceTint: string;
  readonly doughColor: string;
  readonly chunkColor: string;
}

export const FLAVORS: readonly FlavorSpec[] = [
  {
    id: "brown-butter-choc-chip",
    name: "Brown Butter Choc Chip",
    tagline: "Toasted milk solids, puddles of 62% dark chocolate, flaky Maldon salt.",
    price: 5.0,
    surfaceTint: "#F4E6D4",
    doughColor: "#C58D56",
    chunkColor: "#3A2014",
  },
  {
    id: "matcha-white-choc",
    name: "Matcha White Choc",
    tagline: "Stone-milled Uji matcha dough folded with caramelized white chocolate chunks.",
    price: 5.5,
    surfaceTint: "#E6ECE1",
    doughColor: "#7F9965",
    chunkColor: "#F4EAD5",
  },
  {
    id: "double-dark-sea-salt",
    name: "Double Dark Sea Salt",
    tagline: "Dutch-process Valrhona cocoa dough, bittersweet chunks, crisp sea salt finish.",
    price: 5.25,
    surfaceTint: "#E5D7CE",
    doughColor: "#4E2E20",
    chunkColor: "#26140D",
  },
  {
    id: "toasted-pecan-oat",
    name: "Toasted Pecan Oat",
    tagline: "Brown-sugar rolled oats, roasted buttered pecans, warm cinnamon crumb.",
    price: 5.0,
    surfaceTint: "#F2D9C2",
    doughColor: "#B77C49",
    chunkColor: "#633821",
  },
];

export const STAGE_SIZE: { readonly width: number; readonly height: number } = {
  width: 1440,
  height: 900,
};

export const LENS: Lens3d = {
  x: 0,
  y: 0.9,
  z: 5.2,
  rotation: 0,
  rotationX: -6,
  rotationY: 0,
  fov: 36,
};

export interface JarMetrics {
  readonly radius: number;
  readonly height: number;
  readonly lidOriginY: number;
  readonly cookieRadius: number;
  readonly cookieThickness: number;
}

export const JAR_METRICS: JarMetrics = {
  radius: 0.6,
  height: 1.36,
  lidOriginY: 1.32,
  cookieRadius: 0.42,
  cookieThickness: 0.16,
};

export const JAR_MODEL_OFFSET_Y = -JAR_METRICS.height * 0.57;

export const HERO_COOKIE_JAR_LOCAL: Point3d = {
  x: 0.02,
  y: JAR_MODEL_OFFSET_Y + 0.57,
  z: 0,
};

const JAR_SILHOUETTE_W = JAR_METRICS.radius * 2.08;
const JAR_SILHOUETTE_H = JAR_METRICS.height + 0.26;
const DEFAULT_DEPTH = project3d({ x: 0, y: 0, z: 0 }, LENS, STAGE_SIZE).depth;

export interface StickyRange {
  readonly stageTop: number;
  readonly pinMax: number;
  readonly pinSpan: number;
  readonly visibleH: number;
}

export function stickyRangeOf(
  rest: RestReader | undefined,
  stageCast: DomCast,
  slotCast: DomCast,
  fallbackTop: number,
  fallbackHeight: number,
  clampVisible = true,
): StickyRange {
  const rawCanvas = rest?.get("stageCanvas");
  const canvas =
    rawCanvas !== undefined && rawCanvas.width > 0 && rawCanvas.height > 0 ? rawCanvas : STAGE_SIZE;
  const stageBox = rest?.get(stageCast);
  const rawSlot = rest?.get(slotCast);
  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const slotBox =
    rawSlot !== undefined && rawSlot.width > 0 && rawSlot.height > 0 ? rawSlot : undefined;

  const fallback = hasStage ? stageBox.y - stageBox.height / 2 : fallbackTop;
  const stageHeight = hasStage ? stageBox.height : fallbackHeight;
  const visibleH = clampVisible ? Math.min(canvas.height, stageHeight) : canvas.height;

  let stageTop = fallback;
  let pinMax = fallback + stageHeight - visibleH;
  if (slotBox !== undefined) {
    const placement = placementOf(slotBox);
    switch (placement.kind) {
      case "sticky":
        stageTop = placement.minY;
        pinMax = placement.maxY;
        break;
      case "flow":
      case "fixed":
        break;
      default:
        unreachable(placement);
    }
  }
  return { stageTop, pinMax, pinSpan: Math.max(1, pinMax - stageTop), visibleH };
}

export function isHeroHandoffActive(
  rawScrollY: number,
  smoothScrollY: number,
  stageTop: number,
): boolean {
  if (rawScrollY < stageTop) return true;
  if (rawScrollY >= stageTop + 120) return false;
  return Math.abs(rawScrollY - smoothScrollY) > 4;
}

export function fitJarSlot(
  slot: Slot3d | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  if (slot === undefined || !(slot.width > 0 && slot.height > 0)) return fallback;
  return clamp(
    Math.min((slot.width * 0.92) / JAR_SILHOUETTE_W, (slot.height * 0.94) / JAR_SILHOUETTE_H),
    min,
    max,
  );
}

export function fitCookieSlot(slot: Slot3d | undefined): number {
  if (slot === undefined || !(slot.width > 0 && slot.height > 0)) {
    const w = STAGE_SIZE.width * 0.34;
    const h = STAGE_SIZE.height * 0.48;
    const unitsPerPx = viewSize3d(LENS, STAGE_SIZE, DEFAULT_DEPTH).unitsPerPx;
    return clamp((Math.min(w, h) * unitsPerPx * 0.86) / (JAR_METRICS.cookieRadius * 2), 0.95, 2.05);
  }
  return clamp(
    (Math.min(slot.width, slot.height) * 0.86) / (JAR_METRICS.cookieRadius * 2),
    0.95,
    2.05,
  );
}

export function fallbackViewWidth(): number {
  return viewSize3d(LENS, STAGE_SIZE, DEFAULT_DEPTH).width;
}

export function unprojectFallback(xShare: number, vpY: number): Point3d {
  return unproject3d({ x: xShare * STAGE_SIZE.width, y: vpY }, LENS, STAGE_SIZE, DEFAULT_DEPTH);
}
