import {
  clamp,
  project3d,
  unproject3d,
  unreachable,
  viewSize3d,
  type Point3d,
  type ViewSize3d,
} from "@gerak/core";
import { boxInViewport, placementOf, type Box, type RestReader } from "@gerak/stage";
import { CAST, JAR_METRICS, LENS, STAGE_SIZE } from "./contract.ts";

export interface SlotWorld {
  readonly center: Point3d;
  readonly pinnedCenter: Point3d;
  readonly fitScale: number;
  readonly stageTop: number;
  readonly stageEnd: number;
  readonly pinMax: number;
  readonly pinSpan: number;
  readonly visibleH: number;
  readonly view: ViewSize3d;
}

export interface SpotlightSlotGeometry extends SlotWorld {
  readonly enterTravelX: number;
  readonly exitTravelX: number;
}

export interface BuilderSlotGeometry extends SlotWorld {
  readonly heroScale: number;
  readonly outerLeftX: number;
}

interface SlotSpec {
  readonly stageCast: string;
  readonly slotCast: string;
  readonly fallbackTop: number;
  readonly fallbackHeight: number;
  readonly xShare: number;
  readonly yOffset: (viewH: number) => number;
  readonly pinnedAt: "start" | "clamp";
  readonly clampVisible?: boolean;
}

const JAR_SILHOUETTE_W = JAR_METRICS.radius * 2.08;
const JAR_SILHOUETTE_H = JAR_METRICS.height + 0.26;
const HERO_HEIGHT = 2050;
const SPOTLIGHT_HEIGHT = 3600;
const BUILDER_TOP = HERO_HEIGHT + SPOTLIGHT_HEIGHT + 2400;
const BUILDER_HEIGHT = 1200;

export function isHeroHandoffActive(
  rawScrollY: number,
  smoothScrollY: number,
  stageTop: number,
): boolean {
  if (rawScrollY < stageTop) return true;
  if (rawScrollY >= stageTop + 120) return false;
  return Math.abs(rawScrollY - smoothScrollY) > 4;
}

function fitJar(
  slot: Box | undefined,
  unitsPerPx: number,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!slot || !(slot.width > 0 && slot.height > 0)) return fallback;
  return clamp(
    Math.min(
      (slot.width * unitsPerPx * 0.92) / JAR_SILHOUETTE_W,
      (slot.height * unitsPerPx * 0.94) / JAR_SILHOUETTE_H,
    ),
    min,
    max,
  );
}

function fitCookie(
  slot: Box | undefined,
  canvas: { readonly width: number; readonly height: number },
  unitsPerPx: number,
): number {
  const valid = slot !== undefined && slot.width > 0 && slot.height > 0;
  const w = valid ? slot.width : canvas.width * 0.34;
  const h = valid ? slot.height : canvas.height * 0.48;
  return clamp((Math.min(w, h) * unitsPerPx * 0.86) / (JAR_METRICS.cookieRadius * 2), 0.95, 2.05);
}

function resolveSlot(
  rest: RestReader | undefined,
  scrollY: number,
  spec: SlotSpec,
): {
  readonly slot: SlotWorld;
  readonly canvas: { readonly width: number; readonly height: number };
  readonly slotBox: Box | undefined;
} {
  const rawCanvas = rest?.get(CAST.stageCanvas);
  const canvas = rawCanvas && rawCanvas.width > 0 && rawCanvas.height > 0 ? rawCanvas : STAGE_SIZE;
  const stageBox = rest?.get(spec.stageCast);
  const rawSlot = rest?.get(spec.slotCast);
  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const slotBox =
    rawSlot !== undefined && rawSlot.width > 0 && rawSlot.height > 0 ? rawSlot : undefined;

  const fallbackTop = hasStage ? stageBox.y - stageBox.height / 2 : spec.fallbackTop;
  const stageHeight = hasStage ? stageBox.height : spec.fallbackHeight;
  const stageEnd = fallbackTop + stageHeight;
  const visibleH =
    spec.clampVisible === false ? canvas.height : Math.min(canvas.height, stageHeight);

  let stageTop = fallbackTop;
  let pinMax = fallbackTop + stageHeight - visibleH;
  if (slotBox) {
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
  const pinSpan = Math.max(1, pinMax - stageTop);

  let pinnedScroll: number;
  switch (spec.pinnedAt) {
    case "start":
      pinnedScroll = stageTop;
      break;
    case "clamp":
      pinnedScroll = Math.min(scrollY, pinMax);
      break;
    default:
      return unreachable(spec.pinnedAt);
  }
  const fallbackPoint = (s: number) => ({
    x: spec.xShare * canvas.width,
    y: stageTop + spec.yOffset(canvas.height) - s,
  });
  const vp = slotBox ? boxInViewport(slotBox, scrollY) : fallbackPoint(scrollY);
  const pinnedVp = slotBox ? boxInViewport(slotBox, pinnedScroll) : fallbackPoint(pinnedScroll);

  const depth = project3d({ x: 0, y: 0, z: 0 }, LENS, canvas).depth;
  const view = viewSize3d(LENS, canvas, depth);

  return {
    slot: {
      center: unproject3d(vp, LENS, canvas, depth),
      pinnedCenter: unproject3d(pinnedVp, LENS, canvas, depth),
      fitScale: 1,
      stageTop,
      stageEnd,
      pinMax,
      pinSpan,
      visibleH,
      view,
    },
    canvas,
    slotBox,
  };
}

export function heroJarSlotWorld(rest?: RestReader, scrollY = 0): SlotWorld {
  const { slot, slotBox } = resolveSlot(rest, scrollY, {
    stageCast: CAST.heroStage,
    slotCast: CAST.slotHeroJar,
    fallbackTop: 0,
    fallbackHeight: HERO_HEIGHT,
    xShare: 0.72,
    yOffset: (h) => h * 0.46,
    pinnedAt: "clamp",
  });
  return { ...slot, fitScale: fitJar(slotBox, slot.view.unitsPerPx, 0.45, 1.28, 0.92) };
}

export function spotlightSlotWorld(rest?: RestReader, scrollY = 0): SpotlightSlotGeometry {
  const { slot, canvas, slotBox } = resolveSlot(rest, scrollY, {
    stageCast: CAST.spotlightStage,
    slotCast: CAST.slotFlavorCookie,
    fallbackTop: HERO_HEIGHT,
    fallbackHeight: SPOTLIGHT_HEIGHT,
    xShare: 0.62,
    yOffset: (h) => h * 0.5,
    pinnedAt: "start",
  });
  const fitScale = fitCookie(slotBox, canvas, slot.view.unitsPerPx);
  const halfViewW = slot.view.width / 2;
  const scaledRadius = JAR_METRICS.cookieRadius * fitScale;
  return {
    ...slot,
    fitScale,
    enterTravelX: Math.max(0, halfViewW - slot.pinnedCenter.x) + scaledRadius + 0.9,
    exitTravelX: Math.max(0, halfViewW + slot.pinnedCenter.x) + scaledRadius + 1.1,
  };
}

export function builderSlotWorld(rest?: RestReader, scrollY = 0): BuilderSlotGeometry {
  const { slot, canvas, slotBox } = resolveSlot(rest, scrollY, {
    stageCast: CAST.builderStage,
    slotCast: CAST.slotBuilderJar,
    fallbackTop: BUILDER_TOP,
    fallbackHeight: BUILDER_HEIGHT,
    xShare: 0.3,
    yOffset: (h) => h * 0.54,
    pinnedAt: "clamp",
  });
  const fitScale = fitJar(slotBox, slot.view.unitsPerPx, 0.48, 1.08, 0.84);
  const heroScale = fitCookie(rest?.get(CAST.slotFlavorCookie), canvas, slot.view.unitsPerPx);
  const outerLeftX = -(slot.view.width / 2) - JAR_METRICS.cookieRadius * heroScale - 0.35;
  return { ...slot, fitScale, heroScale, outerLeftX };
}

export function closingSlotWorld(rest?: RestReader, scrollY = 0): SlotWorld {
  const { slot, slotBox } = resolveSlot(rest, scrollY, {
    stageCast: CAST.closingStage,
    slotCast: CAST.slotClosingJar,
    fallbackTop: BUILDER_TOP + BUILDER_HEIGHT,
    fallbackHeight: 860,
    xShare: 0.72,
    yOffset: () => 310,
    pinnedAt: "clamp",
    clampVisible: false,
  });
  return { ...slot, fitScale: fitJar(slotBox, slot.view.unitsPerPx, 0.52, 1.12, 0.88) };
}
