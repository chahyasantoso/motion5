import {
  INPUT_EVENTS,
  arch,
  clamp,
  ease,
  mix,
  motion,
  scroll,
  shared,
  state,
  transition,
  type Motion,
  type Pose2d,
  type Pose3d,
  type Signal,
  type Time,
  type Transition,
} from "@gerak/core";
import { sceneBuilder, slot3d, type MotionContext, type ObjectView } from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import {
  FLAVOR_SELECT_EVENT,
  JAR_METRICS,
  LENS,
  SPOTLIGHT_ROLL_MS,
  STAGE_SIZE,
  fallbackViewWidth,
  fitCookieSlot,
  isHeroHandoffActive,
  isSpotlightZone,
  spotlightZoneForProgress,
  stickyRangeOf,
  unprojectFallback,
  type SpotlightZone,
} from "./contract.ts";
import { heroCookieScrollY, pointerDeltaX, pointerDeltaY } from "./inputs.ts";

const {
  stageCanvas,
  spotlightStage,
  slotFlavorCookie,
  flavorShadow,
  spotlightTints,
  flavorTitles,
  flavorNums,
  flavorNotes,
  flavorDots,
  flavorCookies,
} = cast;
const COOKIE_VIEW: ObjectView = { canvas: stageCanvas, lens: LENS };

const HIDDEN_COOKIE_POSE: Pose3d = { scale: 0 };

function zoneOf(context?: MotionContext): SpotlightZone {
  const index = context?.index ?? 0;
  return isSpotlightZone(index) ? index : 0;
}

interface SpotlightRollState {
  readonly active: SpotlightZone;
  readonly outgoing: SpotlightZone | -1;
  readonly direction: 1 | -1;
}

interface SpotlightFrame {
  readonly state: SpotlightRollState;
  readonly rollProgress: number;
  readonly scrollY: number;
  readonly stageTop: number;
}

const IDLE_TRANSITION: Transition<SpotlightZone | -1> = {
  current: -1,
  previous: -1,
  progress: 1,
  active: false,
};

let rollSignalCache: {
  readonly key: string;
  readonly signal: Signal<Transition<SpotlightZone | -1>>;
} | null = null;

function spotlightTransition(
  stageTop: number,
  pinMax: number,
  pinSpan: number,
): Signal<Transition<SpotlightZone | -1>> {
  const key = `${stageTop}:${pinMax}:${pinSpan}`;
  if (rollSignalCache?.key === key) {
    return rollSignalCache.signal;
  }
  const zoneState = state<SpotlightZone | -1>(-1, (cur, ev) => {
    if (ev.name === FLAVOR_SELECT_EVENT) {
      return ev.value !== undefined && isSpotlightZone(ev.value) ? ev.value : cur;
    }
    if (ev.name === INPUT_EVENTS.scroll && ev.value !== undefined) {
      const y = ev.value;
      if (y < stageTop) return -1;
      if (y <= pinMax) return spotlightZoneForProgress(clamp((y - stageTop) / pinSpan, 0, 1));
    }
    return cur;
  });
  const signal = shared(
    transition(zoneState, {
      ms: (from, to) => (from === -1 || to === -1 ? 0 : SPOTLIGHT_ROLL_MS),
    }),
  );
  rollSignalCache = { key, signal };
  return signal;
}

function readSpotlightFrame(context?: MotionContext): SpotlightFrame {
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const range = stickyRangeOf(context?.rest, "spotlightStage", "slotFlavorCookie", 2050, 3600);
  const trans = context
    ? spotlightTransition(range.stageTop, range.pinMax, range.pinSpan)(context.time, context.events)
    : IDLE_TRANSITION;
  const active: SpotlightZone = trans.current === -1 ? 0 : trans.current;
  const outgoing: SpotlightZone | -1 = trans.active && trans.previous !== -1 ? trans.previous : -1;
  const direction: 1 | -1 = outgoing !== -1 && active < outgoing ? -1 : 1;
  const rollProgress = trans.active ? trans.progress : 1;

  return {
    state: { active, outgoing, direction },
    rollProgress,
    scrollY,
    stageTop: range.stageTop,
  };
}

const tintMotion = motion((_t: Time, context?: MotionContext): Pose2d => {
  const zone = zoneOf(context);
  const { state, rollProgress } = readSpotlightFrame(context);
  if (zone === state.active) {
    const u = state.outgoing === -1 ? 1 : ease.sineInOut(rollProgress);
    return { opacity: u };
  }
  if (zone === state.outgoing && rollProgress < 1) {
    return { opacity: 1 - ease.sineInOut(rollProgress) };
  }
  return { opacity: 0 };
});

function copyRevealMotion(enterY: number, exitY: number): Motion<Pose2d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose2d => {
    const zone = zoneOf(context);
    const { state, rollProgress } = readSpotlightFrame(context);
    const dir = state.direction;
    if (zone === state.active) {
      if (state.outgoing === -1) {
        return { y: 0, opacity: 1 };
      }
      const inU = ease.cubicOut(clamp((rollProgress - 0.42) / 0.58, 0, 1));
      return { y: mix(enterY * dir, 0, inU), opacity: inU };
    }
    if (zone === state.outgoing && rollProgress < 1) {
      const outU = ease.cubicIn(clamp(rollProgress / 0.36, 0, 1));
      return { y: mix(0, exitY * dir, outU), opacity: 1 - outU };
    }
    return { y: enterY, opacity: 0 };
  });
}

const dotMotion = motion((_t: Time, context?: MotionContext): Pose2d => {
  const zone = zoneOf(context);
  const { state, rollProgress } = readSpotlightFrame(context);
  if (zone === state.active) {
    const u = state.outgoing === -1 ? 1 : ease.cubicOut(rollProgress);
    return {
      scale: mix(0.78, 1.38, u),
      opacity: mix(0.34, 1.0, u),
    };
  }
  if (zone === state.outgoing && rollProgress < 1) {
    const u = ease.cubicOut(rollProgress);
    return {
      scale: mix(1.38, 0.78, u),
      opacity: mix(1.0, 0.34, u),
    };
  }
  return { scale: 0.78, opacity: 0.34 };
});

const flavorShadowMotion = motion((_t: Time, context?: MotionContext): Pose2d => {
  const { state, rollProgress, scrollY, stageTop } = readSpotlightFrame(context);
  const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;
  if (isHeroHandoffActive(scrollY, smoothScrollY, stageTop)) {
    const approach = ease.cubicOut(clamp((smoothScrollY - (stageTop - 220)) / 220, 0, 1));
    return { scaleX: mix(0.7, 1.0, approach), opacity: approach };
  }
  const rolling = state.outgoing !== -1 && rollProgress < 1 ? arch(rollProgress) : 0;
  const centered = 1 - 0.42 * rolling;
  return {
    scaleX: mix(0.75, 1.0, centered),
    opacity: mix(0.45, 1.0, centered),
  };
});

const flavorCookiesMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const zone = zoneOf(context);
  const { state, rollProgress, scrollY, stageTop } = readSpotlightFrame(context);
  const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;

  if (isHeroHandoffActive(scrollY, smoothScrollY, stageTop)) {
    return HIDDEN_COOKIE_POSE;
  }

  const projected = context
    ? slot3d(slotFlavorCookie, COOKIE_VIEW, context, { fit: "contain" })
    : undefined;
  const center =
    projected?.center ?? unprojectFallback(0.62, stageTop + STAGE_SIZE.height * 0.5 - scrollY);
  const hasCookieBounds =
    context !== undefined &&
    (context.rest.object(`${context.element}.${zone}`) !== undefined ||
      context.rest.object(context.element) !== undefined);
  const fitScale =
    projected !== undefined && hasCookieBounds
      ? clamp(projected.scale * 0.86, 0.95, 2.05)
      : fitCookieSlot(projected);
  const halfViewW = (projected?.view.width ?? fallbackViewWidth()) / 2;
  const scaledRadius = JAR_METRICS.cookieRadius * fitScale;
  const enterTravelX = Math.max(0, halfViewW - center.x) + scaledRadius + 0.9;
  const exitTravelX = Math.max(0, halfViewW + center.x) + scaledRadius + 1.1;

  const isActive = zone === state.active;
  const isOutgoing = zone === state.outgoing && rollProgress < 1;

  if (!isActive && !isOutgoing) {
    return HIDDEN_COOKIE_POSE;
  }

  const dir = state.direction;
  let dx = 0;
  let bankY = 0;
  let settled = 1;

  if (isActive) {
    if (state.outgoing !== -1 && rollProgress < 1) {
      const u = ease.cubicOut(rollProgress);
      const startOffset = dir > 0 ? enterTravelX : -exitTravelX;
      dx = mix(startOffset, 0, u);
      bankY = -24 * dir * arch(u);
      settled = ease.cubicOut(clamp((u - 0.7) / 0.3, 0, 1));
    }
  } else {
    const u = ease.cubicIn(rollProgress);
    const endOffset = dir > 0 ? -exitTravelX : enterTravelX;
    dx = mix(0, endOffset, u);
    bankY = 24 * dir * arch(u);
    settled = 1 - ease.cubicIn(clamp(u / 0.3, 0, 1));
  }

  const entryCalm = zone === 0 ? clamp((scrollY - stageTop) / 40, 0, 1) : 1;
  const tiltWeight = settled * entryCalm;
  const pdx = context ? pointerDeltaX(context.time, context.events) : 0;
  const pdy = context ? pointerDeltaY(context.time, context.events) : 0;
  const rollRadius = JAR_METRICS.cookieRadius * fitScale;
  const rotation = -(dx / rollRadius) * (180 / Math.PI);

  return {
    x: center.x + dx,
    y: center.y,
    z: center.z,
    rotation,
    rotationX: pdy * 16 * tiltWeight,
    rotationY: bankY + pdx * 22 * tiltWeight,
    scale: fitScale,
  };
});

export const spotlightScene = sceneBuilder()
  .element(spotlightStage)
  .element(slotFlavorCookie)
  .element(flavorShadow)
  .motion(flavorShadowMotion)
  .element(flavorCookies)
  .motion(flavorCookiesMotion)
  .show([spotlightStage.top, spotlightStage.end])
  .limits({ jump: 0.9, turn: 45 })
  .element(spotlightTints)
  .motion(tintMotion)
  .element(flavorTitles)
  .motion(copyRevealMotion(28, -28))
  .element(flavorNums)
  .motion(copyRevealMotion(20, -20))
  .element(flavorNotes)
  .motion(copyRevealMotion(16, -14))
  .element(flavorDots)
  .motion(dotMotion);
