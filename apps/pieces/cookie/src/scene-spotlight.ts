import {
  arch,
  clamp,
  ease,
  elapsedOf,
  mix,
  motion,
  rawTime,
  scroll,
  stillMoving,
  storeCell,
  value,
  type Input,
  type Motion,
  type Pose2d,
  type Pose3d,
  type Step,
  type Time,
  type Transition,
} from "@gerak/core";
import { scene, slot3d, type MotionContext, type ObjectView } from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import {
  FLAVOR_SELECT_EVENT,
  JAR_METRICS,
  LENS,
  SPOTLIGHT_ROLL_MS,
  STAGE_SIZE,
  cookieInputs,
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

const flavorSelect = value(cookieInputs, FLAVOR_SELECT_EVENT);

interface SpotlightTransitionCache {
  readonly key: string;
  readonly scrollSteps: readonly Step<number>[];
  readonly scrollCount: number;
  readonly selectSteps: readonly Step<number>[];
  readonly selectCount: number;
  readonly current: SpotlightZone | -1;
  readonly previous: SpotlightZone | -1;
  readonly changedAt: number;
}

const spotlightCacheSlot = storeCell<SpotlightTransitionCache>();

function readSpotlightTransition(
  stageTop: number,
  pinMax: number,
  pinSpan: number,
  time: Time,
  events: Input,
): Transition<SpotlightZone | -1> {
  const scrollSteps = scroll.y.steps(time, events);
  const selectSteps = flavorSelect.steps(time, events);
  const key = `${stageTop}:${pinMax}:${pinSpan}`;
  const cached = spotlightCacheSlot.get();

  let current: SpotlightZone | -1;
  let previous: SpotlightZone | -1;
  let changedAt: number;

  if (
    cached !== undefined &&
    cached.key === key &&
    cached.scrollSteps === scrollSteps &&
    cached.scrollCount === scrollSteps.length &&
    cached.selectSteps === selectSteps &&
    cached.selectCount === selectSteps.length
  ) {
    current = cached.current;
    previous = cached.previous;
    changedAt = cached.changedAt;
  } else {
    current = -1;
    previous = -1;
    changedAt = -Infinity;
    const apply = (at: number, next: SpotlightZone | -1): void => {
      if (next === current) return;
      previous = current;
      current = next;
      changedAt = at;
    };
    let si = 0;
    let fi = 0;
    while (si < scrollSteps.length || fi < selectSteps.length) {
      const sStep = scrollSteps[si];
      const fStep = selectSteps[fi];
      if (fStep === undefined || (sStep !== undefined && sStep.at <= fStep.at)) {
        if (sStep === undefined) break;
        si += 1;
        const y = sStep.value;
        if (y < stageTop) apply(sStep.at, -1);
        else if (y <= pinMax) {
          apply(sStep.at, spotlightZoneForProgress(clamp((y - stageTop) / pinSpan, 0, 1)));
        }
      } else {
        fi += 1;
        if (isSpotlightZone(fStep.value)) apply(fStep.at, fStep.value);
      }
    }
    spotlightCacheSlot.set({
      key,
      scrollSteps,
      scrollCount: scrollSteps.length,
      selectSteps,
      selectCount: selectSteps.length,
      current,
      previous,
      changedAt,
    });
  }

  if (changedAt === -Infinity) return IDLE_TRANSITION;
  const now = elapsedOf(rawTime(time).clock);
  if (now === undefined) return { current, previous, progress: 1, active: false };
  const duration = previous === -1 || current === -1 ? 0 : SPOTLIGHT_ROLL_MS;
  const elapsed = Math.max(0, now - changedAt);
  if (duration <= 0 || elapsed >= duration) {
    return { current, previous, progress: 1, active: false };
  }
  stillMoving();
  return {
    current,
    previous,
    progress: clamp(elapsed / duration, 0, 1),
    active: true,
  };
}

function readSpotlightFrame(context?: MotionContext): SpotlightFrame {
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const range = stickyRangeOf(context?.rest, "spotlightStage", "slotFlavorCookie", 2050, 3600);
  const trans = context
    ? readSpotlightTransition(
        range.stageTop,
        range.pinMax,
        range.pinSpan,
        context.time,
        context.events,
      )
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

export const spotlightScene = scene(
  spotlightStage,
  slotFlavorCookie,
  flavorShadow.moves(flavorShadowMotion),
  flavorCookies
    .moves(flavorCookiesMotion)
    .shows([spotlightStage.top, spotlightStage.end])
    .limits({ jump: 0.9, turn: 45 }),
  spotlightTints.moves(tintMotion),
  flavorTitles.moves(copyRevealMotion(28, -28)),
  flavorNums.moves(copyRevealMotion(20, -20)),
  flavorNotes.moves(copyRevealMotion(16, -14)),
  flavorDots.moves(dotMotion),
);
