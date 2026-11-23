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
  type MotionContext,
  type SceneBuilder,
} from "@gerak/stage";
import {
  BUILDER_ARC_MS,
  BUILDER_CAPACITY,
  BUILDER_COOKIE_CASTS,
  BUILDER_CRUMB_CASTS,
  BUILDER_CRUMB_COUNT,
  BUILDER_CRUMB_MS,
  BUILDER_EXIT_COOKIE_CASTS,
  BUILDER_EXIT_MS,
  BUILDER_MIN_SEAL,
  BUILDER_MIX_MS,
  BUILDER_SEAL_MS,
  BUILDER_SHIFT_MS,
  BUILDER_UNSEAL_MS,
  CAST,
  JAR_ADD_EVENT,
  JAR_MIX_EVENT,
  JAR_MODEL_OFFSET_Y,
  JAR_REMOVE_EVENT,
  JAR_RESET_EVENT,
  JAR_SEAL_EVENT,
  JAR_UNSEAL_EVENT,
  isSpotlightZone,
} from "./contract.ts";
import { pointerDeltaX, pointerDeltaY } from "./inputs.ts";
import { builderSlotWorld, type BuilderSlotGeometry } from "./space3d.ts";

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

const builderStage = box(CAST.builderStage);
const builderHeading = box(CAST.builderHeading);
const slotBuilderJar = box(CAST.slotBuilderJar);
const builderSealBtn = box(CAST.builderSealBtn, { watch: true });

const builderJarRoot = object(CAST.builderJarRoot);
const builderJarLid = object(CAST.builderJarLid);
const builderJarRibbon = object(CAST.builderJarRibbon);

const builderEnter = beat("builderEnter", {
  scroll: [builderStage.top.minus(420), builderStage.top.minus(40)],
});

const sealBtnHovered = state(
  false,
  (hovered, event) => (event.name === "enter" ? true : event.name === "leave" ? false : hovered),
  { target: CAST.builderSealBtn },
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
  readonly sealTransitionAtMs: number | undefined;
}

const INITIAL_BUILDER_STATE: BuilderState = {
  slots: [],
  exiting: [],
  nextExitPool: 0,
  sealed: false,
  sealId: 0,
  sealTransitionKind: "none",
  sealTransitionAtMs: undefined,
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
      const poolSlot = current.nextExitPool % BUILDER_EXIT_COOKIE_CASTS.length;
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
        sealTransitionAtMs: event.at,
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
        sealTransitionAtMs: event.at,
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
        sealTransitionAtMs: undefined,
      };
    }
    default:
      return current;
  }
});

const PARKED_Z = 15;
const PARKED_POSE: Pose3d = {
  x: 0,
  y: 0,
  z: PARKED_Z,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
  scale: 1,
};

const HIDDEN_RIBBON_POSE: Pose3d = {
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
  scale: 0,
};

function isBuilderVisible(scrollY: number, slot: BuilderSlotGeometry): boolean {
  return scrollY >= slot.stageTop - slot.visibleH && scrollY <= slot.stageEnd + 180;
}

function slotLocalY(index: number): number {
  return 0.14 + index * 0.145 + JAR_MODEL_OFFSET_Y;
}

interface SealTransition {
  readonly kind: SealTransitionKind;
  readonly u: number;
}

function readSealTransition(bState: BuilderState, nowMs: number): SealTransition {
  switch (bState.sealTransitionKind) {
    case "none":
      return { kind: "none", u: 0 };
    case "sealing": {
      if (bState.sealTransitionAtMs === undefined) {
        return { kind: "sealing", u: 1 };
      }
      const ageMs = Math.max(0, nowMs - bState.sealTransitionAtMs);
      if (ageMs < BUILDER_SEAL_MS) {
        stillMoving();
      }
      return { kind: "sealing", u: clamp(ageMs / BUILDER_SEAL_MS, 0, 1) };
    }
    case "unsealing": {
      if (bState.sealTransitionAtMs === undefined) {
        return { kind: "unsealing", u: 1 };
      }
      const ageMs = Math.max(0, nowMs - bState.sealTransitionAtMs);
      if (ageMs < BUILDER_UNSEAL_MS) {
        stillMoving();
      }
      return { kind: "unsealing", u: clamp(ageMs / BUILDER_UNSEAL_MS, 0, 1) };
    }
    default:
      return unreachable(bState.sealTransitionKind);
  }
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

interface BuilderJarTransform {
  readonly center: Point3d;
  readonly rotX: number;
  readonly rotY: number;
  readonly scale: number;
}

function builderJarTransform(
  slot: BuilderSlotGeometry,
  dx: number,
  dy: number,
  sealTrans: SealTransition,
  mixBounce: number,
): BuilderJarTransform {
  const sealCompression = sealTrans.kind === "sealing" ? 0.035 * arch(sealTrans.u) : 0;
  const mixScale = 1 + 0.022 * mixBounce;
  return {
    center: {
      x: slot.center.x + dx * 0.12,
      y: slot.center.y - dy * 0.06 + 0.03 * mixBounce * slot.fitScale,
      z: slot.center.z,
    },
    rotX: dy * 8,
    rotY: dx * 16,
    scale: slot.fitScale * (1 - sealCompression) * mixScale,
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
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const slot = builderSlotWorld(context?.rest, scrollY);
  if (!isBuilderVisible(scrollY, slot)) {
    return PARKED_POSE;
  }
  const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const sealTrans = readSealTransition(bState, nowMs);
  const mixBounce = readMixBounce(bState, nowMs);
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  const jar = builderJarTransform(slot, dx, dy, sealTrans, mixBounce);

  return {
    x: jar.center.x,
    y: jar.center.y,
    z: jar.center.z,
    rotation: 0,
    rotationX: jar.rotX,
    rotationY: jar.rotY,
    scale: jar.scale,
  };
});

const builderJarLidMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const peek = context ? sealPeek(context.time, context.events) : 0;
  const openX = 0.64 - 0.1 * peek;
  const openY = 0.08 - 0.04 * peek;
  const openRotZ = -28 + 6 * peek;

  const sealTrans = readSealTransition(bState, nowMs);
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
  const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const sealTrans = readSealTransition(bState, nowMs);

  switch (sealTrans.kind) {
    case "none":
      return HIDDEN_RIBBON_POSE;
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

function builderCookieMotion(slotIndex: number): Motion<Pose3d, MotionContext> {
  const localX = slotIndex % 2 === 0 ? -0.025 : 0.025;
  const localZ = ((slotIndex % 3) - 1) * 0.014;
  const restTiltZ = slotIndex % 2 === 0 ? -1.8 : 1.8;
  const restTiltX = ((slotIndex % 3) - 1) * 2;
  const restYaw = slotIndex * 42;

  return motion((_t: Time, context?: MotionContext): Pose3d => {
    const scrollY = context ? scroll.y(context.time, context.events) : 0;
    const slot = builderSlotWorld(context?.rest, scrollY);
    if (!isBuilderVisible(scrollY, slot)) {
      return PARKED_POSE;
    }
    const bState = context ? builderState(context.time, context.events) : INITIAL_BUILDER_STATE;
    const entry = bState.slots[slotIndex];
    if (!entry) {
      return PARKED_POSE;
    }

    const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
    const sealTrans = readSealTransition(bState, nowMs);
    const mixBounce = readMixBounce(bState, nowMs);
    const dx = context ? pointerDeltaX(context.time, context.events) : 0;
    const dy = context ? pointerDeltaY(context.time, context.events) : 0;
    const jar = builderJarTransform(slot, dx, dy, sealTrans, mixBounce);

    const shiftAgeMs = Math.max(0, nowMs - entry.shiftedAtMs);
    const shiftU =
      entry.prevSlotIndex !== slotIndex ? clamp(shiftAgeMs / BUILDER_SHIFT_MS, 0, 1) : 1;
    if (shiftU < 1) {
      stillMoving();
    }
    const localY = mix(
      slotLocalY(entry.prevSlotIndex),
      slotLocalY(slotIndex),
      ease.cubicOut(shiftU),
    );

    const rad = (jar.rotY * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const targetX = jar.center.x + (localX * cos + localZ * sin) * jar.scale;
    const targetY = jar.center.y + localY * jar.scale;
    const targetZ = jar.center.z + (-localX * sin + localZ * cos) * jar.scale;

    const ageMs = nowMs - entry.animStartMs;
    switch (entry.animKind) {
      case "enter": {
        if (ageMs < 0) {
          stillMoving();
          return PARKED_POSE;
        }
        const u = clamp(ageMs / BUILDER_ARC_MS, 0, 1);
        if (u < 1) {
          stillMoving();
        }
        const rimY = jar.center.y + 0.76 * jar.scale;
        if (u <= 0.58) {
          const p1 = ease.cubicOut(u / 0.58);
          return {
            x: mix(slot.outerLeftX, jar.center.x, p1),
            y: mix(jar.center.y + 0.84 * jar.scale, rimY, p1) + 0.18 * jar.scale * arch(p1),
            z: jar.center.z + mix(0.28, 0.04 * jar.scale, p1),
            rotation: mix(-24, 0, p1),
            rotationX: mix(90, 12, p1),
            rotationY: mix(jar.rotY - 18, jar.rotY + restYaw, p1),
            scale: mix(slot.heroScale, jar.scale, p1),
          };
        }
        const p2 = ease.cubicInOut((u - 0.58) / 0.42);
        return {
          x: mix(jar.center.x, targetX, p2),
          y: mix(rimY, targetY, p2),
          z: mix(jar.center.z + 0.04 * jar.scale, targetZ, p2),
          rotation: mix(0, restTiltZ, p2),
          rotationX: mix(12, restTiltX, p2),
          rotationY: jar.rotY + restYaw,
          scale: jar.scale,
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
            rotationY: jar.rotY + restYaw,
            scale: jar.scale,
          };
        }
        const u = clamp(ageMs / BUILDER_MIX_MS, 0, 1);
        if (u < 1) {
          stillMoving();
        }
        const lift = arch(u);
        const lateral =
          Math.sin(u * Math.PI * 2) * 0.06 * jar.scale * lift * (slotIndex % 2 === 0 ? 1 : -1);
        return {
          x: targetX + lateral,
          y: targetY + 0.62 * lift * jar.scale,
          z: targetZ + 0.08 * lift * jar.scale,
          rotation: mix(restTiltZ, restTiltZ * 2.5, lift),
          rotationX: mix(restTiltX, 24, lift),
          rotationY: jar.rotY + restYaw + 360 * ease.cubicOut(u),
          scale: jar.scale * (1 + 0.06 * lift),
        };
      }
      default:
        return unreachable(entry.animKind);
    }
  });
}

function builderExitCookieMotion(poolSlot: number): Motion<Pose3d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose3d => {
    const scrollY = context ? scroll.y(context.time, context.events) : 0;
    const slot = builderSlotWorld(context?.rest, scrollY);
    if (!context || !isBuilderVisible(scrollY, slot)) {
      return PARKED_POSE;
    }

    const bState = builderState(context.time, context.events);
    const exitEntry = bState.exiting.find((entry) => entry.poolSlot === poolSlot);
    if (!exitEntry) {
      return PARKED_POSE;
    }

    const nowMs = elapsedOf(rawTime(context.time).clock) ?? 0;
    const ageMs = nowMs - exitEntry.startedAtMs;
    if (ageMs < 0 || ageMs >= BUILDER_EXIT_MS) {
      return PARKED_POSE;
    }
    stillMoving();

    const sealTrans = readSealTransition(bState, nowMs);
    const mixBounce = readMixBounce(bState, nowMs);
    const dx = pointerDeltaX(context.time, context.events);
    const dy = pointerDeltaY(context.time, context.events);
    const jar = builderJarTransform(slot, dx, dy, sealTrans, mixBounce);

    const u = clamp(ageMs / BUILDER_EXIT_MS, 0, 1);
    const fromY = jar.center.y + slotLocalY(exitEntry.fromSlotIndex) * jar.scale;
    const rimY = jar.center.y + 0.76 * jar.scale;
    const restYaw = exitEntry.fromSlotIndex * 42;

    if (u <= 0.4) {
      const p1 = ease.cubicInOut(u / 0.4);
      return {
        x: jar.center.x,
        y: mix(fromY, rimY, p1),
        z: jar.center.z + mix(0, 0.04 * jar.scale, p1),
        rotation: 0,
        rotationX: mix(0, 14, p1),
        rotationY: jar.rotY + restYaw,
        scale: jar.scale,
      };
    }

    const p2 = ease.cubicIn((u - 0.4) / 0.6);
    return {
      x: mix(jar.center.x, slot.outerLeftX, p2),
      y: mix(rimY, jar.center.y + 0.84 * jar.scale, p2) + 0.18 * jar.scale * arch(p2),
      z: jar.center.z + mix(0.04 * jar.scale, 0.28, p2),
      rotation: mix(0, -24, p2),
      rotationX: mix(14, 90, p2),
      rotationY: mix(jar.rotY + restYaw, jar.rotY - 18, p2),
      scale: mix(jar.scale, slot.heroScale, p2),
    };
  });
}

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

function builderCrumbMotion(crumbIndex: number): Motion<Pose3d, MotionContext> {
  return motion((_t: Time, context?: MotionContext): Pose3d => {
    const scrollY = context ? scroll.y(context.time, context.events) : 0;
    const slot = builderSlotWorld(context?.rest, scrollY);
    if (!context || !isBuilderVisible(scrollY, slot)) {
      return PARKED_POSE;
    }

    const bState = builderState(context.time, context.events);
    if (
      !bState.sealed ||
      bState.sealTransitionKind !== "sealing" ||
      bState.sealTransitionAtMs === undefined
    ) {
      return PARKED_POSE;
    }

    const nowMs = elapsedOf(rawTime(context.time).clock) ?? 0;
    const ageSinceSealMs = Math.max(0, nowMs - bState.sealTransitionAtMs);
    const crumbAgeMs = ageSinceSealMs - 140;
    if (crumbAgeMs < 0) {
      stillMoving();
      return PARKED_POSE;
    }
    if (crumbAgeMs >= BUILDER_CRUMB_MS) {
      return PARKED_POSE;
    }
    stillMoving();

    const body = crumbSim.at(liveAt(crumbAgeMs), crumbEventsForSeal(bState.sealId))[
      `crumb-${bState.sealId}-${crumbIndex}`
    ];
    if (!body) {
      return PARKED_POSE;
    }

    const sealTrans = readSealTransition(bState, nowMs);
    const mixBounce = readMixBounce(bState, nowMs);
    const dx = pointerDeltaX(context.time, context.events);
    const dy = pointerDeltaY(context.time, context.events);
    const jar = builderJarTransform(slot, dx, dy, sealTrans, mixBounce);
    const euler = eulerFromMatrix3d(matrixFromQuaternion(body.rotation));

    const fadeStart = BUILDER_CRUMB_MS * 0.65;
    const fadeOutScale =
      crumbAgeMs > fadeStart
        ? 1 - ease.cubicIn(clamp((crumbAgeMs - fadeStart) / (BUILDER_CRUMB_MS - fadeStart), 0, 1))
        : 1;

    return {
      x: jar.center.x + body.x * slot.fitScale,
      y: jar.center.y + body.y * slot.fitScale,
      z: jar.center.z + body.z * slot.fitScale,
      rotation: euler.rotation,
      rotationX: euler.rotationX,
      rotationY: euler.rotationY,
      scale: slot.fitScale * fadeOutScale,
    };
  });
}

let builder: SceneBuilder = sceneBuilder()
  .element(builderStage)
  .element(slotBuilderJar)
  .element(builderSealBtn)
  .element(builderHeading)
  .motion(builderHeadingMotion.in(builderEnter))
  .element(builderJarRoot)
  .motion(builderJarRootMotion)
  .limits({ jump: 1.8, turn: 180 })
  .element(builderJarLid)
  .motion(builderJarLidMotion)
  .limits({ jump: 1.8, turn: 180 })
  .element(builderJarRibbon)
  .motion(builderJarRibbonMotion)
  .limits({ jump: 1.8, turn: 360 });

for (let i = 0; i < BUILDER_COOKIE_CASTS.length; i += 1) {
  const castName = BUILDER_COOKIE_CASTS[i];
  if (!castName) {
    continue;
  }
  builder = builder
    .element(object(castName))
    .motion(builderCookieMotion(i))
    .limits({ jump: 2.5, turn: 360 });
}

for (let i = 0; i < BUILDER_EXIT_COOKIE_CASTS.length; i += 1) {
  const castName = BUILDER_EXIT_COOKIE_CASTS[i];
  if (!castName) {
    continue;
  }
  builder = builder
    .element(object(castName))
    .motion(builderExitCookieMotion(i))
    .limits({ jump: 2.5, turn: 360 });
}

for (let i = 0; i < BUILDER_CRUMB_CASTS.length; i += 1) {
  const castName = BUILDER_CRUMB_CASTS[i];
  if (!castName) {
    continue;
  }
  builder = builder
    .element(object(castName))
    .motion(builderCrumbMotion(i))
    .limits({ jump: 2.5, turn: 180 });
}

export const builderScene: SceneBuilder = builder;
