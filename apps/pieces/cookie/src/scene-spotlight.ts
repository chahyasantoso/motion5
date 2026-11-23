import {
  INPUT_EVENTS,
  arch,
  clamp,
  ease,
  elapsedOf,
  mix,
  motion,
  rawTime,
  scroll,
  stillMoving,
  type Events,
  type Motion,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { box, object, sceneBuilder, type MotionContext, type SceneBuilder } from "@gerak/stage";
import {
  CAST,
  FLAVOR_SELECT_EVENT,
  JAR_METRICS,
  SPOTLIGHT_ROLL_MS,
  isSpotlightZone,
  spotlightZoneForProgress,
  type SpotlightZone,
} from "./contract.ts";
import { heroCookieScrollY, pointerDeltaX, pointerDeltaY } from "./inputs.ts";
import { isHeroHandoffActive, spotlightSlotWorld, type SpotlightSlotGeometry } from "./space3d.ts";

const spotlightStage = box(CAST.spotlightStage);
const slotFlavorCookie = box(CAST.slotFlavorCookie);
const flavorShadow = box(CAST.flavorShadow);

const PARKED_Z = 15;

interface FlavorSpotlightItem {
  readonly zone: SpotlightZone;
  readonly tint: string;
  readonly title: string;
  readonly num: string;
  readonly note: string;
  readonly dot: string;
  readonly cookie: string;
}

const FLAVOR_ITEMS: readonly FlavorSpotlightItem[] = [
  {
    zone: 0,
    tint: CAST.spotlightTint0,
    title: CAST.flavorTitle0,
    num: CAST.flavorNum0,
    note: CAST.flavorNote0,
    dot: CAST.flavorDot0,
    cookie: CAST.flavorCookie0,
  },
  {
    zone: 1,
    tint: CAST.spotlightTint1,
    title: CAST.flavorTitle1,
    num: CAST.flavorNum1,
    note: CAST.flavorNote1,
    dot: CAST.flavorDot1,
    cookie: CAST.flavorCookie1,
  },
  {
    zone: 2,
    tint: CAST.spotlightTint2,
    title: CAST.flavorTitle2,
    num: CAST.flavorNum2,
    note: CAST.flavorNote2,
    dot: CAST.flavorDot2,
    cookie: CAST.flavorCookie2,
  },
  {
    zone: 3,
    tint: CAST.spotlightTint3,
    title: CAST.flavorTitle3,
    num: CAST.flavorNum3,
    note: CAST.flavorNote3,
    dot: CAST.flavorDot3,
    cookie: CAST.flavorCookie3,
  },
];

interface SpotlightRollState {
  readonly active: SpotlightZone;
  readonly outgoing: SpotlightZone | -1;
  readonly rollStartMs: number | undefined;
  readonly direction: 1 | -1;
}

interface SpotlightFrame {
  readonly state: SpotlightRollState;
  readonly rollProgress: number;
  readonly scrollY: number;
  readonly slot: SpotlightSlotGeometry;
}

const INITIAL_ROLL_STATE: SpotlightRollState = {
  active: 0,
  outgoing: -1,
  rollStartMs: undefined,
  direction: 1,
};

function foldSpotlightState(
  events: Events,
  nowMs: number | undefined,
  stageTop: number,
  pinMax: number,
  pinSpan: number,
): SpotlightRollState {
  let cur: SpotlightRollState = INITIAL_ROLL_STATE;

  for (let i = 0; i < events.length; i += 1) {
    const ev = events[i];
    if (!ev) {
      break;
    }
    if (nowMs !== undefined && ev.at > nowMs) {
      break;
    }

    if (ev.name === FLAVOR_SELECT_EVENT) {
      if (ev.value !== undefined && isSpotlightZone(ev.value) && ev.value !== cur.active) {
        cur = {
          active: ev.value,
          outgoing: cur.active,
          rollStartMs: ev.at,
          direction: ev.value > cur.active ? 1 : -1,
        };
      }
      continue;
    }

    if (ev.name === INPUT_EVENTS.scroll && ev.value !== undefined) {
      const y = ev.value;
      if (y < stageTop) {
        if (cur.active !== 0 || cur.outgoing !== -1 || cur.rollStartMs !== undefined) {
          cur = INITIAL_ROLL_STATE;
        }
      } else if (y <= pinMax) {
        const progress = clamp((y - stageTop) / pinSpan, 0, 1);
        const zone = spotlightZoneForProgress(progress);
        if (zone !== cur.active) {
          cur = {
            active: zone,
            outgoing: cur.active,
            rollStartMs: ev.at,
            direction: zone > cur.active ? 1 : -1,
          };
        }
      }
    }
  }

  return cur;
}

function readSpotlightFrame(context?: MotionContext): SpotlightFrame {
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const slot = spotlightSlotWorld(context?.rest, scrollY);
  const nowMs = context ? elapsedOf(rawTime(context.time).clock) : undefined;
  const rollState = context
    ? foldSpotlightState(context.events, nowMs, slot.stageTop, slot.pinMax, slot.pinSpan)
    : INITIAL_ROLL_STATE;

  let rollProgress = 1;
  if (rollState.rollStartMs !== undefined && nowMs !== undefined) {
    const elapsed = nowMs - rollState.rollStartMs;
    if (elapsed < SPOTLIGHT_ROLL_MS) {
      stillMoving();
      rollProgress = clamp(elapsed / SPOTLIGHT_ROLL_MS, 0, 1);
    }
  }

  return { state: rollState, rollProgress, scrollY, slot };
}

function tintMotion(zone: SpotlightZone): Motion<Pose2d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose2d => {
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
}

function copyRevealMotion(
  zone: SpotlightZone,
  enterY: number,
  exitY: number,
): Motion<Pose2d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose2d => {
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

function dotMotion(zone: SpotlightZone): Motion<Pose2d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose2d => {
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
}

const flavorShadowMotion = motion((_t: Time, context?: MotionContext): Pose2d => {
  const { state, rollProgress, scrollY, slot } = readSpotlightFrame(context);
  const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;
  if (isHeroHandoffActive(scrollY, smoothScrollY, slot.stageTop)) {
    const approach = ease.cubicOut(clamp((smoothScrollY - (slot.stageTop - 220)) / 220, 0, 1));
    return { scaleX: mix(0.7, 1.0, approach), opacity: approach };
  }
  const rolling = state.outgoing !== -1 && rollProgress < 1 ? arch(rollProgress) : 0;
  const centered = 1 - 0.42 * rolling;
  return {
    scaleX: mix(0.75, 1.0, centered),
    opacity: mix(0.45, 1.0, centered),
  };
});

function flavorCookieMotion(zone: SpotlightZone): Motion<Pose3d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose3d => {
    const { state, rollProgress, scrollY, slot } = readSpotlightFrame(context);
    const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;
    const { center, fitScale, enterTravelX, exitTravelX, stageTop } = slot;

    if (isHeroHandoffActive(scrollY, smoothScrollY, stageTop)) {
      return {
        x: center.x,
        y: center.y,
        z: PARKED_Z,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: fitScale,
      };
    }

    const isActive = zone === state.active;
    const isOutgoing = zone === state.outgoing && rollProgress < 1;

    if (!isActive && !isOutgoing) {
      return {
        x: center.x,
        y: center.y,
        z: PARKED_Z,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: fitScale,
      };
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
}

let builder: SceneBuilder = sceneBuilder()
  .element(spotlightStage)
  .element(slotFlavorCookie)
  .element(flavorShadow)
  .motion(flavorShadowMotion);

for (const item of FLAVOR_ITEMS) {
  builder = builder
    .element(box(item.tint))
    .motion(tintMotion(item.zone))
    .element(box(item.title))
    .motion(copyRevealMotion(item.zone, 28, -28))
    .element(box(item.num))
    .motion(copyRevealMotion(item.zone, 20, -20))
    .element(box(item.note))
    .motion(copyRevealMotion(item.zone, 16, -14))
    .element(box(item.dot))
    .motion(dotMotion(item.zone))
    .element(object(item.cookie))
    .motion(flavorCookieMotion(item.zone))
    .limits({ jump: 0.9, turn: 45 });
}

export const spotlightScene: SceneBuilder = builder;
