import { clamp, ease, mix, motion, type Pose2d, type Pose3d, type Time } from "@gerak/core";
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
const slotHeroJar = box(CAST.slotHeroJar);
const heroHeadline = text(CAST.heroHeadline, { split: "words" });
const heroSub = box(CAST.heroSub);
const heroCta = box(CAST.heroCta);
const offerBanner = box(CAST.offerBanner);
const offerSeal = box(CAST.offerSeal);

const jarRoot = object(CAST.jarRoot, {
  view: { canvas: stageCanvas, lens: LENS },
});
const jarLid = object(CAST.jarLid);
const cookieHero = object(CAST.cookieHero);

const heroEnter = beat("heroEnter", 750);
const jarSettle = beat("jarSettle", 800, { at: 100 });

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

const sealSettle = motion(
  (t: Time): Pose2d => ({
    rotation: mix(0, 18, t.progress),
    opacity: t.progress,
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

const lidSettle = motion(
  (t: Time): Pose3d => ({
    y: mix(0.08, 0, t.progress),
  }),
);

const cookieSettle = motion(
  (t: Time): Pose3d => ({
    y: mix(0.06, 0, t.progress),
    rotationY: mix(24, 0, t.progress),
  }),
);

export const heroScene = sceneBuilder()
  .element(stageCanvas)
  .element(heroHeadline)
  .motion(stagger(wordRise, { spread: 0.28 }).in(heroEnter, ease.cubicOut))
  .element(heroSub)
  .motion(fadeRise.in(heroEnter, ease.cubicOut))
  .element(heroCta)
  .motion(fadeRise.in(jarSettle, ease.cubicOut))
  .element(offerBanner)
  .motion(fadeRise.in(jarSettle, ease.cubicOut))
  .element(offerSeal)
  .motion(sealSettle.in(jarSettle, ease.cubicOut))
  .element(jarRoot)
  .motion(
    travel({ to: slotHeroJar }).in(jarSettle, ease.cubicOut),
    jarEntrance.in(jarSettle, ease.cubicOut),
  )
  .limits({ jump: 0.4, turn: 30 })
  .element(jarLid)
  .motion(lidSettle.in(jarSettle, ease.cubicOut))
  .limits({ jump: 0.3, turn: 30 })
  .element(cookieHero)
  .motion(cookieSettle.in(jarSettle, ease.cubicOut))
  .limits({ jump: 0.3, turn: 30 });
