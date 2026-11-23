import { clamp, project3d, unproject3d, type Point3d } from "@gerak/core";
import type { RestReader } from "@gerak/stage";
import { CAST, JAR_METRICS, LENS, STAGE_SIZE } from "./contract.ts";

export interface CanvasSize {
  readonly width: number;
  readonly height: number;
}

export interface StickyPinBounds {
  readonly stickyH: number;
  readonly pinMax: number;
  readonly pinSpan: number;
}

export interface HeroJarSlotGeometry {
  readonly center: Point3d;
  readonly pinnedCenter: Point3d;
  readonly fitScale: number;
  readonly stageTop: number;
  readonly pinMax: number;
  readonly pinSpan: number;
}

export interface SpotlightSlotGeometry {
  readonly center: Point3d;
  readonly pinnedCenter: Point3d;
  readonly fitScale: number;
  readonly enterTravelX: number;
  readonly exitTravelX: number;
  readonly stageTop: number;
  readonly pinMax: number;
  readonly pinSpan: number;
  readonly visibleH: number;
}

export interface BuilderSlotGeometry {
  readonly center: Point3d;
  readonly fitScale: number;
  readonly heroScale: number;
  readonly outerLeftX: number;
  readonly stageTop: number;
  readonly stageEnd: number;
  readonly pinMax: number;
  readonly visibleH: number;
}

export interface ClosingSlotGeometry {
  readonly center: Point3d;
  readonly fitScale: number;
  readonly stageTop: number;
  readonly stageEnd: number;
  readonly visibleH: number;
}

const VIEW_WORLD_H = 2 * (LENS.z ?? 5.2) * Math.tan((LENS.fov * Math.PI) / 360);
const JAR_SILHOUETTE_W = JAR_METRICS.radius * 2.08;
const JAR_SILHOUETTE_H = JAR_METRICS.height + 0.26;
const FALLBACK_HERO_HEIGHT = 2050;
const FALLBACK_SPOTLIGHT_HEIGHT = 3600;
const FALLBACK_BUILDER_TOP = FALLBACK_HERO_HEIGHT + FALLBACK_SPOTLIGHT_HEIGHT + 2400;
const FALLBACK_BUILDER_HEIGHT = 1200;

export function canvasSizeOf(rest?: RestReader): CanvasSize {
  const raw = rest?.get(CAST.stageCanvas);
  if (raw && raw.width > 0 && raw.height > 0) {
    return { width: raw.width, height: raw.height };
  }
  return STAGE_SIZE;
}

export function stickyPinBounds(
  stageTop: number,
  stageHeight: number,
  viewportH: number,
): StickyPinBounds {
  const stickyH = Math.min(viewportH, stageHeight);
  const pinMax = stageTop + stageHeight - stickyH;
  const pinSpan = Math.max(1, pinMax - stageTop);
  return { stickyH, pinMax, pinSpan };
}

export function isHeroHandoffActive(
  rawScrollY: number,
  smoothScrollY: number,
  stageTop: number,
): boolean {
  if (rawScrollY < stageTop) {
    return true;
  }
  if (rawScrollY >= stageTop + 120) {
    return false;
  }
  return Math.abs(rawScrollY - smoothScrollY) > 4;
}

// Resolves a sticky slot's viewport Y across pre-pin, pinned, and post-pin scroll phases.
export function stickySlotViewportY(
  slotTop: number,
  stageTop: number,
  stageHeight: number,
  viewportH: number,
  scrollY: number,
): number {
  const { pinMax } = stickyPinBounds(stageTop, stageHeight, viewportH);
  const localTop = slotTop - stageTop;
  if (scrollY <= stageTop) {
    return slotTop - scrollY;
  }
  if (scrollY < pinMax) {
    return localTop;
  }
  return localTop - (scrollY - pinMax);
}

export function heroJarSlotWorld(rest?: RestReader, scrollY = 0): HeroJarSlotGeometry {
  const canvasSize = canvasSizeOf(rest);
  const stageBox = rest?.get(CAST.heroStage);
  const slotBox = rest?.get(CAST.slotHeroJar);

  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const hasSlot = slotBox !== undefined && slotBox.width > 0 && slotBox.height > 0;

  const stageTop = hasStage ? stageBox.y - stageBox.height / 2 : 0;
  const stageHeight = hasStage ? stageBox.height : FALLBACK_HERO_HEIGHT;
  const { pinMax, pinSpan } = stickyPinBounds(stageTop, stageHeight, canvasSize.height);

  const slotX = hasSlot ? slotBox.x : canvasSize.width * 0.72;
  const slotCenterY = hasSlot ? slotBox.y : stageTop + canvasSize.height * 0.46;
  const viewportY = stickySlotViewportY(
    slotCenterY,
    stageTop,
    stageHeight,
    canvasSize.height,
    scrollY,
  );

  const depth = project3d({ x: 0, y: 0, z: 0 }, LENS, canvasSize).depth;
  const center = unproject3d({ x: slotX, y: viewportY }, LENS, canvasSize, depth);
  const pinnedViewportY = stickySlotViewportY(
    slotCenterY,
    stageTop,
    stageHeight,
    canvasSize.height,
    Math.min(scrollY, pinMax),
  );
  const pinnedCenter = unproject3d({ x: slotX, y: pinnedViewportY }, LENS, canvasSize, depth);

  const unitsPerPx = VIEW_WORLD_H / canvasSize.height;
  const fitScale = hasSlot
    ? clamp(
        Math.min(
          (slotBox.width * unitsPerPx * 0.92) / JAR_SILHOUETTE_W,
          (slotBox.height * unitsPerPx * 0.94) / JAR_SILHOUETTE_H,
        ),
        0.45,
        1.28,
      )
    : 0.92;

  return { center, pinnedCenter, fitScale, stageTop, pinMax, pinSpan };
}

function spotlightCookieScale(rest: RestReader | undefined, canvasSize: CanvasSize): number {
  const stageBox = rest?.get(CAST.spotlightStage);
  const slotBox = rest?.get(CAST.slotFlavorCookie);
  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const hasSlot = hasStage && slotBox !== undefined && slotBox.width > 0 && slotBox.height > 0;
  const slotWidth = hasSlot ? slotBox.width : canvasSize.width * 0.34;
  const slotHeight = hasSlot ? slotBox.height : canvasSize.height * 0.48;
  const unitsPerPx = VIEW_WORLD_H / canvasSize.height;
  return clamp(
    Math.min(slotWidth * unitsPerPx * 0.86, slotHeight * unitsPerPx * 0.86) /
      (JAR_METRICS.cookieRadius * 2),
    0.95,
    2.05,
  );
}

export function spotlightSlotWorld(rest?: RestReader, scrollY = 0): SpotlightSlotGeometry {
  const canvasSize = canvasSizeOf(rest);
  const stageBox = rest?.get(CAST.spotlightStage);
  const slotBox = rest?.get(CAST.slotFlavorCookie);

  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const hasSlot = hasStage && slotBox !== undefined && slotBox.width > 0 && slotBox.height > 0;

  const stageTop = hasStage ? stageBox.y - stageBox.height / 2 : FALLBACK_HERO_HEIGHT;
  const stageHeight = hasStage ? stageBox.height : FALLBACK_SPOTLIGHT_HEIGHT;
  const { stickyH, pinMax, pinSpan } = stickyPinBounds(stageTop, stageHeight, canvasSize.height);

  const slotX = hasSlot ? slotBox.x : canvasSize.width * 0.62;
  const slotCenterY = hasSlot ? slotBox.y : stageTop + canvasSize.height * 0.5;

  const pinnedY = stickySlotViewportY(
    slotCenterY,
    stageTop,
    stageHeight,
    canvasSize.height,
    stageTop,
  );
  const viewportY = stickySlotViewportY(
    slotCenterY,
    stageTop,
    stageHeight,
    canvasSize.height,
    scrollY,
  );

  const depth = project3d({ x: 0, y: 0, z: 0 }, LENS, canvasSize).depth;
  const pinnedCenter = unproject3d({ x: slotX, y: pinnedY }, LENS, canvasSize, depth);
  const center = unproject3d({ x: slotX, y: viewportY }, LENS, canvasSize, depth);

  const unitsPerPx = VIEW_WORLD_H / canvasSize.height;
  const fitScale = spotlightCookieScale(rest, canvasSize);
  const halfViewW = (unitsPerPx * canvasSize.width) / 2;
  const scaledRadius = JAR_METRICS.cookieRadius * fitScale;
  const enterTravelX = Math.max(0, halfViewW - pinnedCenter.x) + scaledRadius + 0.9;
  const exitTravelX = Math.max(0, halfViewW + pinnedCenter.x) + scaledRadius + 1.1;

  return {
    center,
    pinnedCenter,
    fitScale,
    enterTravelX,
    exitTravelX,
    stageTop,
    pinMax,
    pinSpan,
    visibleH: stickyH,
  };
}

export function builderSlotWorld(rest?: RestReader, scrollY = 0): BuilderSlotGeometry {
  const canvasSize = canvasSizeOf(rest);
  const stageBox = rest?.get(CAST.builderStage);
  const slotBox = rest?.get(CAST.slotBuilderJar);

  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const hasSlot = slotBox !== undefined && slotBox.width > 0 && slotBox.height > 0;

  const stageTop = hasStage ? stageBox.y - stageBox.height / 2 : FALLBACK_BUILDER_TOP;
  const stageHeight = hasStage ? stageBox.height : FALLBACK_BUILDER_HEIGHT;
  const stageEnd = stageTop + stageHeight;
  const { stickyH, pinMax } = stickyPinBounds(stageTop, stageHeight, canvasSize.height);

  const slotX = hasSlot ? slotBox.x : canvasSize.width * 0.3;
  const slotCenterY = hasSlot ? slotBox.y : stageTop + canvasSize.height * 0.54;
  const viewportY =
    canvasSize.width <= 768
      ? slotCenterY - scrollY
      : stickySlotViewportY(slotCenterY, stageTop, stageHeight, canvasSize.height, scrollY);

  const depth = project3d({ x: 0, y: 0, z: 0 }, LENS, canvasSize).depth;
  const center = unproject3d({ x: slotX, y: viewportY }, LENS, canvasSize, depth);

  const unitsPerPx = VIEW_WORLD_H / canvasSize.height;
  const fitScale = hasSlot
    ? clamp(
        Math.min(
          (slotBox.width * unitsPerPx * 0.92) / JAR_SILHOUETTE_W,
          (slotBox.height * unitsPerPx * 0.94) / JAR_SILHOUETTE_H,
        ),
        0.48,
        1.08,
      )
    : 0.84;
  const heroScale = spotlightCookieScale(rest, canvasSize);
  const halfViewW = (unitsPerPx * canvasSize.width) / 2;
  const outerLeftX = -halfViewW - JAR_METRICS.cookieRadius * heroScale - 0.35;

  return {
    center,
    fitScale,
    heroScale,
    outerLeftX,
    stageTop,
    stageEnd,
    pinMax,
    visibleH: stickyH,
  };
}

export function closingSlotWorld(rest?: RestReader, scrollY = 0): ClosingSlotGeometry {
  const canvasSize = canvasSizeOf(rest);
  const stageBox = rest?.get(CAST.closingStage);
  const slotBox = rest?.get(CAST.slotClosingJar);

  const hasStage = stageBox !== undefined && stageBox.height > 0;
  const hasSlot = slotBox !== undefined && slotBox.width > 0 && slotBox.height > 0;

  const stageTop = hasStage
    ? stageBox.y - stageBox.height / 2
    : FALLBACK_BUILDER_TOP + FALLBACK_BUILDER_HEIGHT;
  const stageHeight = hasStage ? stageBox.height : 860;
  const stageEnd = stageTop + stageHeight;

  const slotX = hasSlot ? slotBox.x : canvasSize.width * 0.72;
  const slotCenterY = hasSlot ? slotBox.y : stageTop + 310;
  const viewportY = slotCenterY - scrollY;

  const depth = project3d({ x: 0, y: 0, z: 0 }, LENS, canvasSize).depth;
  const center = unproject3d({ x: slotX, y: viewportY }, LENS, canvasSize, depth);

  const unitsPerPx = VIEW_WORLD_H / canvasSize.height;
  const fitScale = hasSlot
    ? clamp(
        Math.min(
          (slotBox.width * unitsPerPx * 0.92) / JAR_SILHOUETTE_W,
          (slotBox.height * unitsPerPx * 0.94) / JAR_SILHOUETTE_H,
        ),
        0.52,
        1.12,
      )
    : 0.88;

  return {
    center,
    fitScale,
    stageTop,
    stageEnd,
    visibleH: canvasSize.height,
  };
}
