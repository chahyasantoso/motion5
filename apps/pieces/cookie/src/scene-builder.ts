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
  pageInputs,
  rawTime,
  scroll,
  seeded,
  shared,
  springTo,
  state,
  stillMoving,
  transition,
  unreachable,
  value,
  type Input,
  type Point3d,
  type Pose2d,
  type Pose3d,
  type State,
  type Time,
} from "@gerak/core";
import { simulate } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import {
  beat,
  box,
  object,
  scene,
  slot3d,
  travel,
  type MotionContext,
  type ObjectView,
  type Scene,
} from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import {
  BUILDER_ARC_MS,
  BUILDER_CAPACITY,
  BUILDER_CRUMB_COUNT,
  BUILDER_CRUMB_MS,
  BUILDER_EXIT_MS,
  BUILDER_EXIT_POOL,
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
  JAR_SEALED_VALUE,
  LENS,
  STAGE_SIZE,
  fallbackViewWidth,
  fitCookieSlot,
  fitJarSlot,
  isSpotlightZone,
  jarSlotName,
  stickyRangeOf,
  type SpotlightZone,
  unprojectFallback,
} from "./contract.ts";
import { pointerDeltaX, pointerDeltaY } from "./inputs.ts";

const createRapierWorld3d = await rapierEngine3d();

function crumbSimulation() {
  return simulate(
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
        if (
          event.name !== JAR_SEALED_VALUE ||
          typeof event.value !== "number" ||
          event.value <= 0
        ) {
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
}

const crumbSim = crumbSimulation();
// Runs one burst on a spare world at load, so the physics engine's first-contact code is ready before a seal.
crumbSimulation().at(liveAt(BUILDER_CRUMB_MS), [
  { kind: "value", name: JAR_SEALED_VALUE, at: 0, value: 1 },
]);

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
const builderSealBtn = box(cast.builderSealBtn.name);

const builderEnter = beat("builderEnter", {
  scroll: [builderStage.top.minus(420), builderStage.top.minus(40)],
});

const sealBtnHovered = value(pageInputs, "hovered", builderSealBtn.name);
const sealPeek = shared(
  springTo(sealBtnHovered, (hovered) => hovered, { stiffness: 220, damping: 20 }),
);

type BuilderSlotAnimKind = "enter" | "shuffle";
type SealTransitionKind = "none" | "sealing" | "unsealing";

interface TrackedValue {
  readonly current: number;
  readonly prev: number;
  readonly changedAt: number;
}

function trackedValue(name: string): State<TrackedValue> {
  return state<TrackedValue>({ current: 0, prev: 0, changedAt: -Infinity }, (current, event) =>
    event.name === name && typeof event.value === "number" && event.value !== current.current
      ? { current: event.value, prev: current.current, changedAt: event.at }
      : current,
  );
}

function valueJustBefore(
  tracked: State<TrackedValue>,
  time: Time,
  events: Input,
  atMs: number,
): number {
  const latest = tracked(time, events);
  for (const step of tracked.steps(time, events)) {
    if (step.value.changedAt >= atMs) return step.value.prev;
  }
  return latest.current;
}

const slotValues = Array.from({ length: BUILDER_CAPACITY }, (_, i) => trackedValue(jarSlotName(i)));

const jarSealed = state<number>(0, (current, event) => {
  switch (event.name) {
    case JAR_SEALED_VALUE:
      return typeof event.value === "number" ? event.value : current;
    case JAR_RESET_EVENT:
      return 0;
    default:
      return current;
  }
});

const sealKind = state<SealTransitionKind>("none", (current, event) => {
  switch (event.name) {
    case JAR_SEALED_VALUE:
      if (typeof event.value !== "number") return current;
      return event.value > 0 ? "sealing" : current === "none" ? "none" : "unsealing";
    case JAR_RESET_EVENT:
      return "none";
    default:
      return current;
  }
});

interface SlotAnim {
  readonly animKind: BuilderSlotAnimKind;
  readonly animStartMs: number;
  readonly prevSlotIndex: number;
  readonly shiftedAtMs: number;
}

interface ExitAnim {
  readonly flavor: SpotlightZone;
  readonly fromSlotIndex: number;
  readonly startedAtMs: number;
}

interface MixBounce {
  readonly startedAtMs: number;
  readonly count: number;
}

interface BuilderFrame {
  readonly anims: readonly (SlotAnim | undefined)[];
  readonly exiting: ReadonlyMap<number, ExitAnim>;
  readonly mixBounce: MixBounce | null;
}

const EMPTY_FRAME: BuilderFrame = {
  anims: [],
  exiting: new Map(),
  mixBounce: null,
};

const builderFrame = shared((time: Time, events: Input): BuilderFrame => {
  const nowMs = elapsedOf(rawTime(time).clock) ?? 0;
  for (const slot of slotValues) slot(time, events);

  const anims: (SlotAnim | undefined)[] = new Array(BUILDER_CAPACITY).fill(undefined);
  const exiting = new Map<number, ExitAnim>();
  let removeTimes: number[] = [];
  let mixBounce: MixBounce | null = null;

  for (const event of events) {
    if (event.at > nowMs) continue;
    switch (event.name) {
      case JAR_RESET_EVENT:
        anims.fill(undefined);
        exiting.clear();
        removeTimes = [];
        mixBounce = null;
        break;
      case JAR_ADD_EVENT: {
        if (typeof event.value !== "number") break;
        const k = Math.trunc(event.value);
        if (k < 0 || k >= BUILDER_CAPACITY) break;
        anims[k] = {
          animKind: "enter",
          animStartMs: event.at,
          prevSlotIndex: k,
          shiftedAtMs: event.at,
        };
        break;
      }
      case JAR_REMOVE_EVENT: {
        if (typeof event.value !== "number") break;
        const r = Math.trunc(event.value);
        if (r < 0 || r >= BUILDER_CAPACITY) break;
        removeTimes = removeTimes.filter((t) => event.at - t < BUILDER_EXIT_MS + 100);
        const poolSlot = removeTimes.length % BUILDER_EXIT_POOL;
        removeTimes.push(event.at);
        const tracked = slotValues[r];
        const rawFlavor = tracked ? valueJustBefore(tracked, time, events, event.at) - 1 : -1;
        if (isSpotlightZone(rawFlavor)) {
          exiting.set(poolSlot, { flavor: rawFlavor, fromSlotIndex: r, startedAtMs: event.at });
        }
        for (let i = r; i < BUILDER_CAPACITY - 1; i += 1) {
          const src = anims[i + 1] ?? {
            animKind: "enter" as const,
            animStartMs: -BUILDER_ARC_MS,
            prevSlotIndex: i + 1,
            shiftedAtMs: event.at,
          };
          anims[i] = { ...src, prevSlotIndex: i + 1, shiftedAtMs: event.at };
        }
        anims[BUILDER_CAPACITY - 1] = undefined;
        break;
      }
      case JAR_MIX_EVENT: {
        const rawCount =
          typeof event.value === "number" ? Math.round(event.value) : BUILDER_CAPACITY;
        const count = clamp(rawCount, 0, BUILDER_CAPACITY);
        const firstSlot = slotValues[0];
        const wasEmpty = firstSlot
          ? valueJustBefore(firstSlot, time, events, event.at) === 0
          : true;
        const animKind: BuilderSlotAnimKind = wasEmpty ? "enter" : "shuffle";
        const stagger = wasEmpty ? 65 : 40;
        for (let k = 0; k < count; k += 1) {
          anims[k] = {
            animKind,
            animStartMs: event.at + k * stagger,
            prevSlotIndex: k,
            shiftedAtMs: event.at,
          };
        }
        mixBounce = wasEmpty ? null : { startedAtMs: event.at, count };
        break;
      }
      default:
        break;
    }
  }

  return { anims, exiting, mixBounce };
});

const HIDDEN_POSE: Pose3d = { scale: 0 };

function slotLocalY(index: number): number {
  return 0.14 + index * 0.145 + JAR_MODEL_OFFSET_Y;
}

const BUILDER_CRUMB_DELAY_MS = 140;
const BUILDER_CRUMB_TOTAL_MS = BUILDER_CRUMB_DELAY_MS + BUILDER_CRUMB_MS;

const sealTransition = shared(
  transition(sealKind, {
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
  transition(jarSealed, {
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

function readMixBounce(frame: BuilderFrame, nowMs: number): number {
  const { mixBounce } = frame;
  if (!mixBounce) {
    return 0;
  }
  const totalMs = BUILDER_MIX_MS + Math.max(0, mixBounce.count - 1) * 40;
  const ageMs = nowMs - mixBounce.startedAtMs;
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
  const frame = context ? builderFrame(context.time, context.events) : EMPTY_FRAME;
  const nowMs = context ? (elapsedOf(rawTime(context.time).clock) ?? 0) : 0;
  const sealTrans = readSealTransition(context);
  const sealCompression = sealTrans.kind === "sealing" ? 0.035 * arch(sealTrans.u) : 0;
  const mixBounce = readMixBounce(frame, nowMs);
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
  if (!context) {
    return HIDDEN_POSE;
  }
  const slotIndex = context.index ?? 0;
  const slotState = slotValues[slotIndex];
  const rawFlavor = slotState ? slotState(context.time, context.events).current - 1 : -1;
  if (!isSpotlightZone(rawFlavor)) {
    return HIDDEN_POSE;
  }
  const flavor = rawFlavor;

  const localX = slotIndex % 2 === 0 ? -0.025 : 0.025;
  const localZ = ((slotIndex % 3) - 1) * 0.014;
  const restTiltZ = slotIndex % 2 === 0 ? -1.8 : 1.8;
  const restTiltX = ((slotIndex % 3) - 1) * 2;
  const restYaw = slotIndex * 42;

  const frame = builderFrame(context.time, context.events);
  const entry = frame.anims[slotIndex] ?? {
    animKind: "enter" as const,
    animStartMs: -BUILDER_ARC_MS,
    prevSlotIndex: slotIndex,
    shiftedAtMs: -BUILDER_SHIFT_MS,
  };

  const nowMs = elapsedOf(rawTime(context.time).clock) ?? 0;
  const jar = context.read(builderJarRoot);
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
          custom: { flavor },
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
        custom: { flavor },
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
          custom: { flavor },
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
        custom: { flavor },
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

  const frame = builderFrame(context.time, context.events);
  const exitEntry = frame.exiting.get(poolSlot);
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
  const { flavor } = exitEntry;

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
      custom: { flavor },
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
    custom: { flavor },
  };
});

let cachedCrumbSeal: { readonly sealId: number; readonly events: Input } | null = null;

function crumbEventsForSeal(sealId: number): Input {
  if (cachedCrumbSeal === null || cachedCrumbSeal.sealId !== sealId) {
    cachedCrumbSeal = {
      sealId,
      events: [{ kind: "value", name: JAR_SEALED_VALUE, at: 0, value: sealId }],
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

export const builderScene: Scene = scene(
  builderStage,
  slotBuilderJar,
  builderSealBtn,
  builderHeading.moves(builderHeadingMotion.in(builderEnter)),
  builderJarRoot
    .moves(travel({ to: slotBuilderJar }), builderJarRootMotion)
    .shows(builderWindow)
    .limits({ jump: 1.8, turn: 180 }),
  builderJarLid.moves(builderJarLidMotion).shows(builderWindow).limits({ jump: 1.8, turn: 180 }),
  builderJarRibbon
    .moves(builderJarRibbonMotion)
    .shows(builderWindow)
    .limits({ jump: 1.8, turn: 360 }),
  builderCookies
    .moves(builderCookiesMotion)
    .shows(builderWindow)
    .limits({ jump: 2.5, turn: 360, ratio: 2.1, steps: ["flavor"] }),
  builderExitCookies
    .moves(builderExitCookiesMotion)
    .shows(builderWindow)
    .limits({ jump: 2.5, turn: 360, ratio: 2.1, steps: ["flavor"] }),
  builderCrumbs.moves(builderCrumbsMotion).shows(builderWindow).limits({ jump: 2.5, turn: 180 }),
);
