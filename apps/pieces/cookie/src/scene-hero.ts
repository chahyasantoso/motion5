import {
  arch,
  clamp,
  ease,
  mix,
  motion,
  scroll,
  shared,
  springTo,
  state,
  type Point3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { beat, box, object, sceneBuilder, stagger, text, type MotionContext } from "@gerak/stage";
import { HERO_COOKIE_JAR_LOCAL, type CastName } from "./contract.ts";
import { heroCookieScrollY, pointerDeltaX, pointerDeltaY } from "./inputs.ts";
import { heroJarSlotWorld, isHeroHandoffActive, spotlightSlotWorld } from "./space3d.ts";

const stageCanvas = box<CastName>("stageCanvas");
const heroStage = box<CastName>("heroStage");
const heroWarmWash = box<CastName>("heroWarmWash");
const heroHorizon = box<CastName>("heroHorizon");
const heroCopy = box<CastName>("heroCopy");
const slotHeroJar = box<CastName>("slotHeroJar");
const heroHeadline = text<CastName>("heroHeadline", { split: "words" });
const heroSub = box<CastName>("heroSub");
const heroCta = box<CastName>("heroCta", { watch: true });
const offerBanner = box<CastName>("offerBanner");
const offerSeal = box<CastName>("offerSeal");

const jarRoot = object<CastName>("jarRoot");
const jarLid = object<CastName>("jarLid");
const cookieHero = object<CastName>("cookieHero");

const heroEnter = beat("heroEnter", 520);
const jarSettle = beat("jarSettle", 520);

const offerExitDom = beat("offerExitDom", {
  scroll: [heroStage.top.plus(20), heroStage.top.plus(420)],
});
const heroAtmosphere = beat("heroAtmosphere", {
  scroll: [heroStage.top.plus(260), heroStage.top.plus(880)],
});

const jarUnseal = beat("jarUnseal", {
  scroll: [heroStage.top.plus(20), heroStage.top.plus(360)],
  smooth: { stiffness: 120, damping: 22 },
});
const cookieLift = beat("cookieLift", {
  scroll: [heroStage.top.plus(320), heroStage.top.plus(980)],
  smooth: { stiffness: 115, damping: 22 },
});

const ctaHovered = state(
  false,
  (hovered, event) => (event.name === "enter" ? true : event.name === "leave" ? false : hovered),
  { target: "heroCta" satisfies CastName },
);
const ctaPeek = shared(
  springTo(ctaHovered, (hovered) => (hovered ? 1 : 0), { stiffness: 220, damping: 20 }),
);

const HERO_HIDDEN_POSE: Pose3d = { scale: 0 };

function handoffProgress(scrollY: number, heroTop: number, spotlightTop: number): number {
  const span = Math.max(1, spotlightTop - heroTop);
  return clamp((scrollY - heroTop) / span, 0, 1);
}

function cookieJarRestWorld(jarCenter: Point3d, jarScale: number, jarRotYDeg: number): Point3d {
  const rad = (jarRotYDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: jarCenter.x + (HERO_COOKIE_JAR_LOCAL.x * cos + HERO_COOKIE_JAR_LOCAL.z * sin) * jarScale,
    y: jarCenter.y + HERO_COOKIE_JAR_LOCAL.y * jarScale,
    z: jarCenter.z + (-HERO_COOKIE_JAR_LOCAL.x * sin + HERO_COOKIE_JAR_LOCAL.z * cos) * jarScale,
  };
}

const wordRise = motion(
  (t: Time): Pose2d => ({
    y: mix(18, 0, t.progress),
    opacity: t.progress,
  }),
);

const fadeRise = motion(
  (t: Time): Pose2d => ({
    y: mix(16, 0, t.progress),
    opacity: t.progress,
  }),
);

const offerSealExit = motion(
  (t: Time): Pose2d => ({
    rotation: mix(0, 54, ease.cubicOut(t.progress)),
  }),
);

const heroHorizonExit = motion((t: Time): Pose2d => {
  const p = ease.cubicInOut(t.progress);
  return {
    y: mix(0, 80, p),
    opacity: mix(1, 0, ease.cubicOut(t.progress)),
  };
});

const heroWarmWashIn = motion(
  (t: Time): Pose2d => ({
    opacity: ease.sineInOut(t.progress),
  }),
);

const jarRootMotion = motion((t: Time, context?: MotionContext): Pose3d => {
  const settle = ease.cubicOut(jarSettle.of(t).progress);
  const rawScrollY = context ? scroll.y(context.time, context.events) : 0;
  const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;
  const heroSlot = heroJarSlotWorld(context?.rest, rawScrollY);
  const spotlight = spotlightSlotWorld(context?.rest, rawScrollY);
  const p = handoffProgress(smoothScrollY, heroSlot.stageTop, spotlight.stageTop);

  if (p >= 0.92 || !isHeroHandoffActive(rawScrollY, smoothScrollY, spotlight.stageTop)) {
    return HERO_HIDDEN_POSE;
  }

  const unseal = ease.cubicInOut(clamp(p / 0.34, 0, 1));
  const sink = ease.sineInOut(clamp((p - 0.26) / 0.64, 0, 1));
  const calm = 1 - clamp(p / 0.32, 0, 1);
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  const scale = mix(heroSlot.fitScale * 0.94, heroSlot.fitScale, settle);

  return {
    x: heroSlot.pinnedCenter.x + dx * 0.14 * calm,
    y: heroSlot.pinnedCenter.y - dy * 0.08 * calm - 3.7 * sink,
    z: heroSlot.pinnedCenter.z,
    rotation: 0,
    rotationX: mix(0, 6, unseal) + dy * 9 * calm,
    rotationY: mix(-12, 0, settle) + mix(0, 16, unseal) + dx * 18 * calm,
    scale,
  };
});

const lidSettle = motion(
  (t: Time): Pose3d => ({
    y: mix(0.06, 0, t.progress),
  }),
);

const lidUnseal = motion((t: Time, context?: MotionContext): Pose3d => {
  const u = ease.cubicInOut(t.progress);
  const calm = 1 - t.progress;
  const peek = context ? ctaPeek(context.time, context.events) : 0;
  return {
    x: mix(0, 0.52, u),
    y: mix(0, 0.54, u) + 0.09 * peek * calm,
    z: mix(0, -0.18, u),
    rotation: mix(0, -24, u) - 5 * peek * calm,
    rotationX: mix(0, -12, u),
  };
});

const lidStepAside = motion((t: Time): Pose3d => {
  const u = ease.cubicInOut(clamp((t.progress - 0.25) / 0.75, 0, 1));
  return {
    x: mix(0, 0.28, u),
    y: mix(0, -0.68, u),
    rotation: mix(0, -12, u),
  };
});

// Lifts flat out of the jar neck, then glides face-on to align with flavorCookie0 at handoff.
const cookieHeroMotion = motion((t: Time, context?: MotionContext): Pose3d => {
  const settle = ease.cubicOut(jarSettle.of(t).progress);
  const rawScrollY = context ? scroll.y(context.time, context.events) : 0;
  const smoothScrollY = context ? heroCookieScrollY(context.time, context.events) : 0;
  const heroSlot = heroJarSlotWorld(context?.rest, rawScrollY);
  const spotlight = spotlightSlotWorld(context?.rest, rawScrollY);

  if (!isHeroHandoffActive(rawScrollY, smoothScrollY, spotlight.stageTop)) {
    return HERO_HIDDEN_POSE;
  }

  const p = handoffProgress(smoothScrollY, heroSlot.stageTop, spotlight.stageTop);
  const calm = 1 - clamp(p / 0.35, 0, 1);
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  const peek = context ? ctaPeek(context.time, context.events) : 0;

  const jarScale = mix(heroSlot.fitScale * 0.94, heroSlot.fitScale, settle);
  const jarRotY = mix(-12, 0, settle) + dx * 18 * calm;
  const jarCenter: Point3d = {
    x: heroSlot.pinnedCenter.x + dx * 0.14 * calm,
    y: heroSlot.pinnedCenter.y - dy * 0.08 * calm,
    z: heroSlot.pinnedCenter.z,
  };
  const restPos = cookieJarRestWorld(jarCenter, jarScale, jarRotY);
  const liftY = 0.92 * heroSlot.fitScale;
  const liftZ = 0.08 * heroSlot.fitScale;

  if (p <= 0.24) {
    const u = ease.cubicInOut(clamp(p / 0.24, 0, 1));
    return {
      x: restPos.x,
      y: restPos.y + liftY * u + 0.03 * peek * (1 - u) * heroSlot.fitScale,
      z: restPos.z + liftZ * u,
      rotation: 0,
      rotationX: mix(0, 14, u),
      rotationY: mix(jarRotY, 0, u),
      scale: jarScale,
    };
  }

  const u = ease.cubicInOut(clamp((p - 0.24) / 0.64, 0, 1));
  const liftTopX = restPos.x;
  const liftTopY = restPos.y + liftY;
  const liftTopZ = restPos.z + liftZ;

  return {
    x: mix(liftTopX, spotlight.pinnedCenter.x, u),
    y: mix(liftTopY, spotlight.pinnedCenter.y, u) + 0.14 * arch(u),
    z: mix(liftTopZ, spotlight.pinnedCenter.z, u) + 0.28 * arch(u),
    rotation: 0,
    rotationX: mix(14, 90, u),
    rotationY: 0,
    scale: mix(heroSlot.fitScale, spotlight.fitScale, u),
  };
});

const heroVisibleWindow = { until: heroStage.end.plus(120) };

export const heroScene = sceneBuilder()
  .element(stageCanvas)
  .element(heroStage)
  .element(slotHeroJar)
  .element(heroWarmWash)
  .motion(heroWarmWashIn.in(heroAtmosphere))
  .element(heroHorizon)
  .motion(heroHorizonExit.in(heroAtmosphere))
  .element(heroCopy)
  .element(heroHeadline)
  .motion(stagger(wordRise, { spread: 0.28 }).in(heroEnter, ease.cubicOut))
  .element(heroSub)
  .motion(fadeRise.in(heroEnter, ease.cubicOut))
  .element(heroCta)
  .motion(fadeRise.in(jarSettle, ease.cubicOut))
  .element(offerBanner)
  .element(offerSeal)
  .motion(offerSealExit.in(offerExitDom))
  .element(jarRoot)
  .motion(jarRootMotion)
  .show(heroVisibleWindow)
  .limits({ jump: 0.45, turn: 35 })
  .element(jarLid)
  .motion(
    lidSettle.in(jarSettle, ease.cubicOut),
    lidUnseal.in(jarUnseal),
    lidStepAside.in(cookieLift),
  )
  .show(heroVisibleWindow)
  .limits({ jump: 0.45, turn: 35 })
  .element(cookieHero)
  .motion(cookieHeroMotion)
  .show(heroVisibleWindow)
  .limits({ jump: 0.45, turn: 35 });
