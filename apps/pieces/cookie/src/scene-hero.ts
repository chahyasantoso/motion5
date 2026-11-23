import {
  clamp,
  ease,
  mix,
  motion,
  pointer,
  shared,
  springTo,
  state,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import {
  beat,
  box,
  object,
  sceneBuilder,
  stagger,
  text,
  travel,
  type MotionContext,
} from "@gerak/stage";
import { CAST, JAR_METRICS, LENS } from "./contract.ts";

const stageCanvas = box(CAST.stageCanvas);
const heroStage = box(CAST.heroStage);
const heroCopy = box(CAST.heroCopy);
const scrollCue = box(CAST.scrollCue);
const slotHeroJar = box(CAST.slotHeroJar);
const heroHeadline = text(CAST.heroHeadline, { split: "words" });
const heroSub = box(CAST.heroSub);
const heroCta = box(CAST.heroCta, { watch: true });
const offerBanner = box(CAST.offerBanner);
const offerSeal = box(CAST.offerSeal);

const jarRoot = object(CAST.jarRoot, {
  view: { canvas: stageCanvas, lens: LENS },
});
const jarLid = object(CAST.jarLid);
const cookieHero = object(CAST.cookieHero);

const heroEnter = beat("heroEnter", 750);
const jarSettle = beat("jarSettle", 800, { at: 100 });

const heroExitDom = beat("heroExitDom", {
  scroll: [heroStage.top.plus(40), heroStage.top.plus(520)],
});
const offerScroll = beat("offerScroll", {
  scroll: [heroStage.top, offerBanner.top],
});

const jarUnseal = beat("jarUnseal", {
  scroll: [heroStage.top.plus(40), heroStage.top.plus(500)],
  smooth: { stiffness: 120, damping: 22 },
});
const cookieLift = beat("cookieLift", {
  scroll: [heroStage.top.plus(320), heroStage.top.plus(980)],
  smooth: { stiffness: 115, damping: 22 },
});

const pointerDeltaX = shared(springTo(pointer.x, (x) => x - 0.5, { stiffness: 90, damping: 18 }));
const pointerDeltaY = shared(springTo(pointer.y, (y) => y - 0.5, { stiffness: 90, damping: 18 }));

const ctaHovered = state(
  false,
  (hovered, event) => (event.name === "enter" ? true : event.name === "leave" ? false : hovered),
  { target: CAST.heroCta },
);
const ctaPeek = shared(
  springTo(ctaHovered, (hovered) => (hovered ? 1 : 0), { stiffness: 220, damping: 20 }),
);

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

const heroCopyExit = motion((t: Time): Pose2d => {
  const p = ease.cubicInOut(t.progress);
  const fade = ease.cubicOut(clamp(t.progress / 0.72, 0, 1));
  return {
    y: mix(0, -56, p),
    opacity: mix(1, 0, fade),
  };
});

const scrollCueExit = motion((t: Time): Pose2d => {
  const p = ease.cubicOut(t.progress);
  return {
    y: mix(0, -18, p),
    opacity: mix(1, 0, p),
  };
});

const offerSealSpin = motion(
  (t: Time): Pose2d => ({
    rotation: mix(0, 90, t.progress),
  }),
);

const JAR_SILHOUETTE_W = JAR_METRICS.radius * 2.08;
const JAR_SILHOUETTE_H = JAR_METRICS.height + 0.26;
const VIEW_WORLD_H = 2 * (LENS.z ?? 5.2) * Math.tan((LENS.fov * Math.PI) / 360);

function responsiveJarScale(context?: MotionContext): number {
  if (!context) {
    return 0.92;
  }
  const canvasBox = context.rest.get(CAST.stageCanvas);
  const slotBox = context.rest.get(CAST.slotHeroJar);
  if (canvasBox.height <= 0 || slotBox.width <= 0 || slotBox.height <= 0) {
    return 0.92;
  }
  const unitsPerPx = VIEW_WORLD_H / canvasBox.height;
  const fitW = (slotBox.width * unitsPerPx * 0.84) / JAR_SILHOUETTE_W;
  const fitH = (slotBox.height * unitsPerPx * 0.86) / JAR_SILHOUETTE_H;
  return clamp(Math.min(fitW, fitH), 0.45, 1.0);
}

const jarEntrance = motion((t: Time, context?: MotionContext): Pose3d => {
  const scale = responsiveJarScale(context);
  return {
    y: mix(-0.14, 0, t.progress) * scale,
    rotationY: mix(-18, -8, t.progress),
    scale: mix(scale * 0.94, scale, t.progress),
  };
});

const jarUnsealMotion = motion((t: Time, context?: MotionContext): Pose3d => {
  const u = ease.cubicInOut(t.progress);
  const calm = 1 - t.progress;
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  return {
    x: dx * 0.14 * calm,
    y: -dy * 0.08 * calm,
    rotationX: mix(0, 6, u) + dy * 9 * calm,
    rotationY: mix(0, 18, u) + dx * 18 * calm,
  };
});

const jarLiftDrop = motion((t: Time): Pose3d => {
  const u = ease.cubicInOut(clamp((t.progress - 0.35) / 0.65, 0, 1));
  return {
    y: mix(0, -0.34, u),
  };
});

const lidSettle = motion(
  (t: Time): Pose3d => ({
    y: mix(0.08, 0, t.progress),
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

const cookieSettle = motion(
  (t: Time): Pose3d => ({
    y: mix(0.06, 0, t.progress),
    rotationY: mix(24, 0, t.progress),
  }),
);

const cookieHoverPeek = motion((t: Time, context?: MotionContext): Pose3d => {
  const calm = 1 - t.progress;
  const peek = context ? ctaPeek(context.time, context.events) : 0;
  return {
    y: 0.03 * peek * calm,
  };
});

// Two-stage lift clears the jar neck flat before blooming face-on toward the camera.
const cookieLiftMotion = motion((t: Time): Pose3d => {
  if (t.progress <= 0.45) {
    const u = ease.cubicInOut(t.progress / 0.45);
    return {
      y: mix(0, 0.86, u),
      z: mix(0, 0.06, u),
      rotationX: mix(0, 14, u),
      scale: 1,
    };
  }
  const u = ease.cubicOut((t.progress - 0.45) / 0.55);
  return {
    x: mix(0, -0.1, u),
    y: mix(0.86, 1.16, u),
    z: mix(0.06, 0.68, u),
    rotationX: mix(14, 86, u),
    rotationY: mix(0, -10, u),
    rotation: mix(0, -24, u),
    scale: mix(1, 1.38, u),
  };
});

export const heroScene = sceneBuilder()
  .element(stageCanvas)
  .element(heroStage)
  .element(heroCopy)
  .motion(heroCopyExit.in(heroExitDom))
  .element(heroHeadline)
  .motion(stagger(wordRise, { spread: 0.28 }).in(heroEnter, ease.cubicOut))
  .element(heroSub)
  .motion(fadeRise.in(heroEnter, ease.cubicOut))
  .element(heroCta)
  .motion(fadeRise.in(jarSettle, ease.cubicOut))
  .element(scrollCue)
  .motion(fadeRise.in(jarSettle, ease.cubicOut), scrollCueExit.in(heroExitDom))
  .element(offerBanner)
  .motion(fadeRise.in(jarSettle, ease.cubicOut))
  .element(offerSeal)
  .motion(offerSealSpin.in(offerScroll))
  .element(jarRoot)
  .motion(
    travel({ to: slotHeroJar }).in(jarSettle, ease.cubicOut),
    jarEntrance.in(jarSettle, ease.cubicOut),
    jarUnsealMotion.in(jarUnseal),
    jarLiftDrop.in(cookieLift),
  )
  .limits({ jump: 0.45, turn: 35 })
  .element(jarLid)
  .motion(
    lidSettle.in(jarSettle, ease.cubicOut),
    lidUnseal.in(jarUnseal),
    lidStepAside.in(cookieLift),
  )
  .limits({ jump: 0.45, turn: 35 })
  .element(cookieHero)
  .motion(
    cookieSettle.in(jarSettle, ease.cubicOut),
    cookieHoverPeek.in(jarUnseal),
    cookieLiftMotion.in(cookieLift),
  )
  .limits({ jump: 0.45, turn: 35 });
