import {
  arch,
  clamp,
  ease,
  elapsedOf,
  eulerFromMatrix3d,
  liveAt,
  matrixFromQuaternion,
  mix,
  motion,
  rawTime,
  scroll,
  seeded,
  shared,
  springTo,
  state,
  stillMoving,
  transition,
  unreachable,
  type Events,
  type Motion,
  type Point3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { simulate } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import {
  beat,
  box,
  object,
  sceneBuilder,
  slot3d,
  travel,
  type MotionContext,
  type ObjectView,
  type SceneBuilder,
} from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import {
  BUILDER_ARC_MS,
  BUILDER_CAPACITY,
  BUILDER_CRUMB_COUNT,
  BUILDER_CRUMB_MS,
  BUILDER_EXIT_MS,
  BUILDER_EXIT_POOL,
  BUILDER_MIN_SEAL,
  BUILDER_MIX_MS,
  BUILDER_SEAL_MS,
  BUILDER_SHIFT_MS,
  BUILDER_UNSEAL_MS,
  JAR_ADD_EVENT,
  JAR_METRICS,
  JAR_MIX_EVENT,
  JAR_MODEL_OFFSET_Y,
  JAR_REMOVE_EVENT,
  JAR_RESET_EVENT,
  JAR_SEAL_EVENT,
  JAR_UNSEAL_EVENT,
  LENS,
  STAGE_SIZE,
  fallbackViewWidth,
  fitCookieSlot,
  fitJarSlot,
  isSpotlightZone,
  stickyRangeOf,
  unprojectFallback,
} from "./contract.ts";
import { pointerDeltaX, pointerDeltaY } from "./inputs.ts";

const createRapierWorld3d = await rapierEngine3d();

const crumbSim = simulate(
  createRapierWorld3d(),
  (w) => {
    w.setGravity(0, -9.8, 0);
    w.addCollider(
      "table",
      { kind: "floor", y: JAR_MODEL_OFFSET_Y },
      { restitution: 0.42, friction: 0.6 },
    );
  },
  {
    dt: 1 / 60,
    checkpointMs: 500,
    spawn: (event, spawner) => {
      if (event.name !== JAR_SEAL_EVENT || typeof event.value !== "number" || event.value <= 0) {
        return;
      }
      const sealId = Math.trunc(event.value);
      for (let i = 0; i < BUILDER_CRUMB_COUNT; i += 1) {
        const rand = seeded(sealId * 100 + i);
        const angle = (i / BUILDER_CRUMB_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.45;
        const radialSpeed = 0.75 + rand() * 1.15;
        const vy = 2.2 + rand() * 1.9;
        const radius = 0.024 + (i % 3) * 0.008;
        spawner.addBody({
          id: `crumb-${sealId}-${i}`,
          shape: { kind: "sphere", radius },
          x: Math.cos(angle) * 0.14,
          y: 0.56 + JAR_MODEL_OFFSET_Y,
          z: Math.sin(angle) * 0.14,
          vx: Math.cos(angle) * radialSpeed,
          vy,
          vz: Math.sin(angle) * radialSpeed,
          wx: (rand() - 0.5) * 720,
          wy: (rand() - 0.5) * 720,
          wz: (rand() - 0.5) * 720,
          restitution: 0.42,
          friction: 0.6,
          drag: 0.2,
        });
      }
    },
  },
);

const {
  stageCanvas,
  builderStage,
  builderHeading,
  slotBuilderJar,
  slotFlavorCookie,
  builderJarLid,
  builderJarRibbon,
  builderCookies,
  builderExitCookies,
  builderCrumbs,
} = cast;
const COOKIE_VIEW: ObjectView = { canvas: stageCanvas, lens: LENS };
const builderJarRoot = object(cast.builderJarRoot.name, { view: COOKIE_VIEW });
const builderSealBtn = box(cast.builderSealBtn.name, { watch: true });

const builderEnter = beat("builderEnter", {
  scroll: [builderStage.top.minus(420), builderStage.top.minus(40)],
});

const sealBtnHovered = state(
  false,
  (hovered, event) => (event.name === "enter" ? true : event.name === "leave" ? false : hovered),
  { target: builderSealBtn.name },
);
const sealPeek = shared(
  springTo(sealBtnHovered, (hovered) => (hovered ? 1 : 0), { stiffness: 220, damping: 20 }),
);

type BuilderSlotAnimKind = "enter" | "shuffle";
type SealTransitionKind = "none" | "sealing" | "unsealing";

interface BuilderSlotEntry {
  readonly animKind: BuilderSlotAnimKind;
  readonly animStartMs: number;
  readonly prevSlotIndex: number;
  readonly shiftedAtMs: number;
}

interface BuilderExitEntry {
  readonly poolSlot: number;
  readonly fromSlotIndex: number;
  readonly startedAtMs: number;
}

interface BuilderState {
  readonly slots: readonly BuilderSlotEntry[];
  readonly exiting: readonly BuilderExitEntry[];
  readonly nextExitPool: number;
  readonly sealed: boolean;
  readonly sealId: number;
  readonly sealTransitionKind: SealTransitionKind;
}

const INITIAL_BUILDER_STATE: BuilderState = {
  slots: [],
  exiting: [],
  nextExitPool: 0,
  sealed: false,
  sealId: 0,
  sealTransitionKind: "none",
};

function pruneExiting(
  exiting: readonly BuilderExitEntry[],
  atMs: number,
  replacePool?: number,
): BuilderExitEntry[] {
  const kept: BuilderExitEntry[] = [];
  for (const entry of exiting) {
    if (entry.poolSlot === replacePool) {
      continue;
    }
    if (Math.abs(atMs - entry.startedAtMs) < BUILDER_EXIT_MS + 100) {
      kept.push(entry);
    }
  }
  return kept;
}

const builderState = state<BuilderState>(INITIAL_BUILDER_STATE, (current, event) => {
  switch (event.name) {
    case JAR_ADD_EVENT: {
      if (
        current.sealed ||
        current.slots.length >= BUILDER_CAPACITY ||
        typeof event.value !== "number" ||
        !isSpotlightZone(event.value)
      ) {
        return current;
      }
      const nextIndex = current.slots.length;
      return {
        ...current,
        slots: [
          ...current.slots,
          {
            animKind: "enter",
            animStartMs: event.at,
            prevSlotIndex: nextIndex,
            shiftedAtMs: event.at,
          },
        ],
        exiting: pruneExiting(current.exiting, event.at),
      };
    }
    case JAR_REMOVE_EVENT: {
      const removeIndex = typeof event.value === "number" ? Math.trunc(event.value) : -1;
      if (current.sealed || removeIndex < 0 || removeIndex >= current.slots.length) {
        return current;
      }
      const poolSlot = current.nextExitPool % BUILDER_EXIT_POOL;
      const nextSlots: BuilderSlotEntry[] = [];
      for (let i = 0; i < current.slots.length; i += 1) {
        const slotEntry = current.slots[i];
        if (!slotEntry || i === removeIndex) {
          continue;
        }
        if (i > removeIndex) {
          nextSlots.push({
            ...slotEntry,
            prevSlotIndex: i,
            shiftedAtMs: event.at,
          });
        } else {
          nextSlots.push(slotEntry);
        }
      }
      return {
        ...current,
        slots: nextSlots,
        exiting: [
          ...pruneExiting(current.exiting, event.at, poolSlot),
          {
            poolSlot,
            fromSlotIndex: removeIndex,
            startedAtMs: event.at,
          },
        ],
        nextExitPool: current.nextExitPool + 1,
      };
    }
    case JAR_MIX_EVENT: {
      if (current.sealed) {
        return current;
      }
      const rawCount = typeof event.value === "number" ? Math.round(event.value) : BUILDER_CAPACITY;
      const targetCount = clamp(rawCount, 1, BUILDER_CAPACITY);
      if (current.slots.length === 0) {
        const nextSlots: BuilderSlotEntry[] = [];
        for (let i = 0; i < targetCount; i += 1) {
          nextSlots.push({
            animKind: "enter",
            animStartMs: event.at + i * 65,
            prevSlotIndex: i,
            shiftedAtMs: event.at,
          });
        }
        return {
          ...current,
          slots: nextSlots,
          exiting: pruneExiting(current.exiting, event.at),
        };
      }
      const nextSlots: BuilderSlotEntry[] = [];
      for (let i = 0; i < current.slots.length; i += 1) {
        const existing = current.slots[i];
        if (!existing) {
          continue;
        }
        nextSlots.push({
          animKind: "shuffle",
          animStartMs: event.at + i * 40,
          prevSlotIndex: i,
          shiftedAtMs: event.at,
        });
      }
      return {
        ...current,
        slots: nextSlots,
        exiting: pruneExiting(current.exiting, event.at),
      };
    }
    case JAR_SEAL_EVENT: {
      if (
        current.sealed ||
        current.slots.length < BUILDER_MIN_SEAL ||
        typeof event.value !== "number"
      ) {
        return current;
      }
      return {
        ...current,
        sealed: true,
        sealId: Math.trunc(event.value),
        sealTransitionKind: "sealing",
      };
    }
    case JAR_UNSEAL_EVENT: {
      if (!current.sealed) {
        return current;
      }
      return {
        ...current,
        sealed: false,
        sealTransitionKind: "unsealing",
      };
    }
    case JAR_RESET_EVENT: {
      if (!current.sealed && current.slots.length === 0 && current.exiting.length === 0) {
        return current;
      }
      return {
        slots: [],
        exiting: [],
        nextExitPool: current.nextExitPool,
        sealed: false,
        sealId: current.sealId,
        sealTransitionKind: "none",
      };
    }
    default:
      return current;
  }
});

const HIDDEN_POSE: Pose3d = { scale: 0 };

function slotLocalY(index: number): number {
  return 0.14 + index * 0.145 + JAR_MODEL_OFFSET_Y;
}

const BUILDER_CRUMB_DELAY_MS = 140;
const BUILDER_CRUMB_TOTAL_MS = BUILDER_CRUMB_DELAY_MS + BUILDER_CRUMB_MS;

const sealTransition = shared(
  transition(builderState, (b) => b.sealTransitionKind, {
    ms: (_from, to) => {
      switch (to) {
        case "none":
          return 0;
        case "sealing":
          return BUILDER_SEAL_MS;
        case "unsealing":
          return BUILDER_UNSEAL_MS;
        default:
          return unreachable(to);
      }
    },
  }),
);

const crumbBurst = shared(
  transition(builderState, (b) => (b.sealed ? b.sealId : 0), {
    ms: (_from, to) => (to > 0 ? BUILDER_CRUMB_TOTAL_MS : 0),
  }),
);

interface SealTransition {
  readonly kind: SealTransitionKind;
  readonly u: number;
}

function readSealTransition(context?: MotionContext): SealTransition {
  if (!context) {
    return { kind: "none", u: 0 };
  }
  const trans = sealTransition(context.time, context.events);
  if (trans.current === "none") {
    return { kind: "none", u: 0 };
  }
  return { kind: trans.current, u: trans.progress };
}

function readMixBounce(bState: BuilderState, nowMs: number): number {
  const first = bState.slots[0];
  if (!first || first.animKind !== "shuffle") {
    return 0;
  }
  const totalMs = BUILDER_MIX_MS + Math.max(0, bState.slots.length - 1) * 40;
  const ageMs = nowMs - first.animStartMs;
  if (ageMs < 0 || ageMs >= totalMs) {
    return 0;
  }
  stillMoving();
  return arch(clamp(ageMs / totalMs, 0, 1));
}

function builderOuterGeometry(context?: MotionContext): {
  readonly heroScale: number;
  readonly outerLeftX: number;
} {
  const builderSlot = context ? slot3d(slotBuilderJar, COOKIE_VIEW, context) : undefined;
  const spotlightSlot = context ? slot3d(slotFlavorCookie, COOKIE_VIEW, context) : undefined;
  const viewWidth = builderSlot?.view.width ?? spotlightSlot?.view.width ?? fallbackViewWidth();
  const heroScale = fitCookieSlot(spotlightSlot);
  return {
    heroScale,
    outerLeftX: -(viewWidth / 2) - JAR_METRICS.cookieRadius * heroScale - 0.35,
  };
}

const builderHeadingMotion = motion((t: Time): Pose2d => {
  const p = ease.cubicOut(t.progress);
  return {
    y: mix(26, 0, p),
    opacity: p,
  };
});

const builderJarRootMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const slot = context ? slot3d(slotBuilderJar, COOKIE_VIEW, context) : undefined;
  const fitScale = fitJarSlot(slot, 0.48, 1.08, 0.84);
  const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const sealTrans = readSealTransition(context);
  const sealCompression = sealTrans.kind === "sealing" ? 0.035 * arch(sealTrans.u) : 0;
  const mixBounce = readMixBounce(bState, nowMs);
  const mixScale = 1 + 0.022 * mixBounce;
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const range = stickyRangeOf(context?.rest, "builderStage", "slotBuilderJar", 8050, 1200);
  const fallback = slot
    ? { x: 0, y: 0, z: 0 }
    : unprojectFallback(0.3, range.stageTop + STAGE_SIZE.height * 0.54 - scrollY);

  return {
    x: fallback.x + dx * 0.12,
    y: fallback.y - dy * 0.06 + 0.03 * mixBounce * fitScale,
    z: fallback.z,
    rotation: 0,
    rotationX: dy * 8,
    rotationY: dx * 16,
    scale: fitScale * (1 - sealCompression) * mixScale,
  };
});

const builderJarLidMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const peek = context ? sealPeek(context.time, context.events) : 0;
  const openX = 0.64 - 0.1 * peek;
  const openY = 0.08 - 0.04 * peek;
  const openRotZ = -28 + 6 * peek;

  const sealTrans = readSealTransition(context);
  switch (sealTrans.kind) {
    case "none":
      return {
        x: openX,
        y: openY,
        z: -0.14,
        rotation: openRotZ,
        rotationX: -10,
        rotationY: 0,
      };
    case "sealing": {
      const lidU = ease.cubicInOut(clamp(sealTrans.u / 0.55, 0, 1));
      return {
        x: mix(openX, 0, lidU),
        y: mix(openY, 0, lidU),
        z: mix(-0.14, 0, lidU),
        rotation: mix(openRotZ, 0, lidU),
        rotationX: mix(-10, 0, lidU),
        rotationY: 0,
      };
    }
    case "unsealing": {
      const lidOut = ease.cubicOut(clamp((sealTrans.u - 0.24) / 0.76, 0, 1));
      return {
        x: mix(0, openX, lidOut),
        y: mix(0, openY, lidOut),
        z: mix(0, -0.14, lidOut),
        rotation: mix(0, openRotZ, lidOut),
        rotationX: mix(0, -10, lidOut),
        rotationY: 0,
      };
    }
    default:
      return unreachable(sealTrans.kind);
  }
});

const builderJarRibbonMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const sealTrans = readSealTransition(context);

  switch (sealTrans.kind) {
    case "none":
      return HIDDEN_POSE;
    case "sealing": {
      const ribU = clamp((sealTrans.u - 0.34) / 0.66, 0, 1);
      if (ribU <= 0) {
        return {
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: -140,
          scale: 0,
        };
      }
      return {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: mix(-140, 0, ease.cubicOut(ribU)),
        scale: Math.max(0, ease.backOut(ribU)),
      };
    }
    case "unsealing": {
      const ribOut = clamp(sealTrans.u / 0.45, 0, 1);
      const easedOut = ease.cubicIn(ribOut);
      return {
        x: 0,
        y: mix(0, -0.05, easedOut),
        z: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: mix(0, 110, easedOut),
        scale: mix(1, 0, easedOut),
      };
    }
    default:
      return unreachable(sealTrans.kind);
  }
});

const builderCookiesMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const slotIndex = context?.index ?? 0;
  const localX = slotIndex % 2 === 0 ? -0.025 : 0.025;
  const localZ = ((slotIndex % 3) - 1) * 0.014;
  const restTiltZ = slotIndex % 2 === 0 ? -1.8 : 1.8;
  const restTiltX = ((slotIndex % 3) - 1) * 2;
  const restYaw = slotIndex * 42;

  const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
  const entry = bState.slots[slotIndex];
  if (!entry) {
    return HIDDEN_POSE;
  }

  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const jar = context ? context.read(builderJarRoot) : { scale: 0.84 };
  const jarX = jar.x ?? 0;
  const jarY = jar.y ?? 0;
  const jarZ = jar.z ?? 0;
  const jarRotY = jar.rotationY ?? 0;
  const jarScale = jar.scale ?? 0.84;
  const { heroScale, outerLeftX } = builderOuterGeometry(context);

  const shiftAgeMs = Math.max(0, nowMs - entry.shiftedAtMs);
  const shiftU = entry.prevSlotIndex !== slotIndex ? clamp(shiftAgeMs / BUILDER_SHIFT_MS, 0, 1) : 1;
  if (shiftU < 1) {
    stillMoving();
  }
  const localY = mix(slotLocalY(entry.prevSlotIndex), slotLocalY(slotIndex), ease.cubicOut(shiftU));

  const rad = (jarRotY * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const targetX = jarX + (localX * cos + localZ * sin) * jarScale;
  const targetY = jarY + localY * jarScale;
  const targetZ = jarZ + (-localX * sin + localZ * cos) * jarScale;

  const ageMs = nowMs - entry.animStartMs;
  switch (entry.animKind) {
    case "enter": {
      if (ageMs < 0) {
        stillMoving();
        return HIDDEN_POSE;
      }
      const u = clamp(ageMs / BUILDER_ARC_MS, 0, 1);
      if (u < 1) {
        stillMoving();
      }
      const rimY = jarY + 0.76 * jarScale;
      if (u <= 0.58) {
        const p1 = ease.cubicOut(u / 0.58);
        return {
          x: mix(outerLeftX, jarX, p1),
          y: mix(jarY + 0.84 * jarScale, rimY, p1) + 0.18 * jarScale * arch(p1),
          z: jarZ + mix(0.28, 0.04 * jarScale, p1),
          rotation: mix(-24, 0, p1),
          rotationX: mix(90, 12, p1),
          rotationY: mix(jarRotY - 18, jarRotY + restYaw, p1),
          scale: mix(heroScale, jarScale, p1),
        };
      }
      const p2 = ease.cubicInOut((u - 0.58) / 0.42);
      return {
        x: mix(jarX, targetX, p2),
        y: mix(rimY, targetY, p2),
        z: mix(jarZ + 0.04 * jarScale, targetZ, p2),
        rotation: mix(0, restTiltZ, p2),
        rotationX: mix(12, restTiltX, p2),
        rotationY: jarRotY + restYaw,
        scale: jarScale,
      };
    }
    case "shuffle": {
      if (ageMs < 0) {
        stillMoving();
        return {
          x: targetX,
          y: targetY,
          z: targetZ,
          rotation: restTiltZ,
          rotationX: restTiltX,
          rotationY: jarRotY + restYaw,
          scale: jarScale,
        };
      }
      const u = clamp(ageMs / BUILDER_MIX_MS, 0, 1);
      if (u < 1) {
        stillMoving();
      }
      const lift = arch(u);
      const lateral =
        Math.sin(u * Math.PI * 2) * 0.06 * jarScale * lift * (slotIndex % 2 === 0 ? 1 : -1);
      return {
        x: targetX + lateral,
        y: targetY + 0.62 * lift * jarScale,
        z: targetZ + 0.08 * lift * jarScale,
        rotation: mix(restTiltZ, restTiltZ * 2.5, lift),
        rotationX: mix(restTiltX, 24, lift),
        rotationY: jarRotY + restYaw + 360 * ease.cubicOut(u),
        scale: jarScale * (1 + 0.06 * lift),
      };
    }
    default:
      return unreachable(entry.animKind);
  }
});

const builderExitCookiesMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  if (!context) {
    return HIDDEN_POSE;
  }
  const poolSlot = context.index ?? 0;

  const bState = builderState(context.time, context.events);
  const exitEntry = bState.exiting.find((entry) => entry.poolSlot === poolSlot);
  if (!exitEntry) {
    return HIDDEN_POSE;
  }

  const nowMs = elapsedOf(rawTime(context.time).clock) ?? 0;
  const ageMs = nowMs - exitEntry.startedAtMs;
  if (ageMs < 0 || ageMs >= BUILDER_EXIT_MS) {
    return HIDDEN_POSE;
  }
  stillMoving();

  const jar = context.read(builderJarRoot);
  const jarX = jar.x ?? 0;
  const jarY = jar.y ?? 0;
  const jarZ = jar.z ?? 0;
  const jarRotY = jar.rotationY ?? 0;
  const jarScale = jar.scale ?? 0.84;
  const { heroScale, outerLeftX } = builderOuterGeometry(context);

  const u = clamp(ageMs / BUILDER_EXIT_MS, 0, 1);
  const fromY = jarY + slotLocalY(exitEntry.fromSlotIndex) * jarScale;
  const rimY = jarY + 0.76 * jarScale;
  const restYaw = exitEntry.fromSlotIndex * 42;

  if (u <= 0.4) {
    const p1 = ease.cubicInOut(u / 0.4);
    return {
      x: jarX,
      y: mix(fromY, rimY, p1),
      z: jarZ + mix(0, 0.04 * jarScale, p1),
      rotation: 0,
      rotationX: mix(0, 14, p1),
      rotationY: jarRotY + restYaw,
      scale: jarScale,
    };
  }

  const p2 = ease.cubicIn((u - 0.4) / 0.6);
  return {
    x: mix(jarX, outerLeftX, p2),
    y: mix(rimY, jarY + 0.84 * jarScale, p2) + 0.18 * jarScale * arch(p2),
    z: jarZ + mix(0.04 * jarScale, 0.28, p2),
    rotation: mix(0, -24, p2),
    rotationX: mix(14, 90, p2),
    rotationY: mix(jarRotY + restYaw, jarRotY - 18, p2),
    scale: mix(jarScale, heroScale, p2),
  };
});

let cachedCrumbSeal: { readonly sealId: number; readonly events: Events } | null = null;

function crumbEventsForSeal(sealId: number): Events {
  if (cachedCrumbSeal === null || cachedCrumbSeal.sealId !== sealId) {
    cachedCrumbSeal = {
      sealId,
      events: [{ name: JAR_SEAL_EVENT, at: 0, value: sealId }],
    };
  }
  return cachedCrumbSeal.events;
}

const builderCrumbsMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  if (!context) {
    return HIDDEN_POSE;
  }
  const crumbIndex = context.index ?? 0;

  const burst = crumbBurst(context.time, context.events);
  if (!burst.active || burst.current <= 0) {
    return HIDDEN_POSE;
  }

  const crumbAgeMs = burst.progress * BUILDER_CRUMB_TOTAL_MS - BUILDER_CRUMB_DELAY_MS;
  if (crumbAgeMs < 0 || crumbAgeMs >= BUILDER_CRUMB_MS) {
    return HIDDEN_POSE;
  }

  const sealId = burst.current;
  const body = crumbSim.at(liveAt(crumbAgeMs), crumbEventsForSeal(sealId))[
    `crumb-${sealId}-${crumbIndex}`
  ];
  if (!body) {
    return HIDDEN_POSE;
  }

  const jar = context.read(builderJarRoot);
  const jarScale = jar.scale ?? 0.84;
  const euler = eulerFromMatrix3d(matrixFromQuaternion(body.rotation));

  const fadeStart = BUILDER_CRUMB_MS * 0.65;
  const fadeOutScale =
    crumbAgeMs > fadeStart
      ? 1 - ease.cubicIn(clamp((crumbAgeMs - fadeStart) / (BUILDER_CRUMB_MS - fadeStart), 0, 1))
      : 1;

  return {
    x: (jar.x ?? 0) + body.x * jarScale,
    y: (jar.y ?? 0) + body.y * jarScale,
    z: (jar.z ?? 0) + body.z * jarScale,
    rotation: euler.rotation,
    rotationX: euler.rotationX,
    rotationY: euler.rotationY,
    scale: jarScale * fadeOutScale,
  };
});

const builderWindow = [builderStage.top.minus(1000), builderStage.end.plus(180)] as const;

export const builderScene: SceneBuilder = sceneBuilder()
  .element(builderStage)
  .element(slotBuilderJar)
  .element(builderSealBtn)
  .element(builderHeading)
  .motion(builderHeadingMotion.in(builderEnter))
  .element(builderJarRoot)
  .motion(travel({ to: slotBuilderJar }), builderJarRootMotion)
  .show(builderWindow)
  .limits({ jump: 1.8, turn: 180 })
  .element(builderJarLid)
  .motion(builderJarLidMotion)
  .show(builderWindow)
  .limits({ jump: 1.8, turn: 180 })
  .element(builderJarRibbon)
  .motion(builderJarRibbonMotion)
  .show(builderWindow)
  .limits({ jump: 1.8, turn: 360 })
  .element(builderCookies)
  .motion(builderCookiesMotion)
  .show(builderWindow)
  .limits({ jump: 2.5, turn: 360, ratio: 2.1 })
  .element(builderExitCookies)
  .motion(builderExitCookiesMotion)
  .show(builderWindow)
  .limits({ jump: 2.5, turn: 360, ratio: 2.1 })
  .element(builderCrumbs)
  .motion(builderCrumbsMotion)
  .show(builderWindow)
  .limits({ jump: 2.5, turn: 180 });
