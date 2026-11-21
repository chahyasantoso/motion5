import {
  aim,
  clamp,
  ease,
  mix,
  motion,
  pointer,
  scroll,
  springTo,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { beat, bind, box, object, sceneBuilder, stagger, text, travel } from "@gerak/stage";

/** Cold-Pressed Sparkling Yuzu, with the drink as a Three.js can travelling between the page's slots. */

const eye = { x: 0, y: 0, z: 10 };

/** The fixed camera the page draws the can through; travel lands the can on a slot through it. */
export const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };

const hero = box("hero");
const features = box("features");
const story = box("story");
const gallery = box("gallery");

const slotHero = box("slotHero");
const slotFeatures = box("slotFeatures");
const slotStory = box("slotStory");
const canvas = box("canvas");

const drink = object("drink", { view: { canvas, lens } });
const heroAura = box("heroAura");
const headline = text("headline", { split: "words" });
const heroSub = box("heroSub");
const heroCta = box("heroCta");
const featureCards = box("featureCards", { parts: true });
const storyProgress = box("storyProgress");
const storyStep1 = box("storyStep1");
const storyStep2 = box("storyStep2");
const galleryCards = box("galleryCards", { parts: true });

const intro = beat("intro", 700);
const subIntro = beat("subIntro", 500, { at: 160 });
const toFeatures = beat("toFeatures", { scroll: [hero.top, features.top], smooth: true });
const featuresReveal = beat("featuresReveal", 550, {
  when: features.top.minus(240).reached,
  back: "reverse",
});
const toStory = beat("toStory", { scroll: [features.top, story.top], smooth: true });
const storyPin = beat("storyPin", { scroll: [story.top, story.top.plus(720)] });
const galleryReveal = beat("galleryReveal", 600, {
  when: gallery.top.minus(260).reached,
  back: "stay",
});

const auraX = springTo(pointer.x, (x) => x, { stiffness: 60, damping: 14 });
const auraY = springTo(pointer.y, (y) => y, { stiffness: 60, damping: 14 });

const riseFade = (distance: number) =>
  motion((t: Time): Pose2d => ({ y: distance * (1 - t.progress), opacity: t.progress }));

/** The can rises a little in world units as it fades in. */
const riseFade3d = motion(
  (t: Time): Pose3d => ({ y: -0.25 * (1 - t.progress), opacity: t.progress }),
);

/** The can leans about its depth axis on the way, and turns a quarter to show its side. */
const leanTurn = (degrees: number) =>
  motion((t: Time): Pose3d => {
    const p = t.progress;
    const lean = p <= 0 || p >= 1 ? 0 : degrees * Math.sin(Math.PI * p);
    return { rotation: lean, rotationY: 90 * p };
  });

export default sceneBuilder({ name: "yuzu-3d" })
  .element(heroAura)
  .motion(
    bind({
      x: (t, e) => (auraX(t, e) - 0.5) * 44,
      y: (t, e) => (auraY(t, e) - 0.5) * 32 - clamp(scroll.y(t, e) * 0.08, 0, 80),
    }),
  )
  .element(headline)
  .motion(stagger(riseFade(22), { spread: 0.32, by: "line" }).in(intro, ease.cubicOut))
  .element(heroSub)
  .motion(riseFade(18).in(subIntro, ease.cubicOut))
  .element(heroCta)
  .motion(riseFade(16).in(subIntro, ease.cubicOut))
  .element(drink)
  .motion(
    travel({ to: slotHero }),
    riseFade3d.in(intro, ease.cubicOut),
    travel({ to: slotFeatures }).in(toFeatures, ease.sineInOut),
    leanTurn(-8).in(toFeatures),
    travel({ to: slotStory }).in(toStory, ease.sineInOut),
    leanTurn(8).in(toStory),
  )
  .limits({ jump: 0.6, turn: 30 })
  .element(featureCards)
  .motion(stagger(riseFade(28), { spread: 0.28 }).in(featuresReveal, ease.cubicOut))
  .element(storyProgress)
  .motion(
    motion((t: Time): Pose2d => ({ scaleX: mix(0.08, 1, t.progress), anchor: "left" })).in(
      storyPin,
    ),
  )
  .element(storyStep1)
  .motion(
    motion((t: Time): Pose2d => {
      const fade = clamp((t.progress - 0.25) / 0.15, 0, 1);
      return { y: -18 * fade, opacity: 1 - fade };
    }).in(storyPin),
  )
  .element(storyStep2)
  .motion(
    motion((t: Time): Pose2d => {
      const appear = ease.cubicOut(clamp((t.progress - 0.36) / 0.14, 0, 1));
      return { y: 18 * (1 - appear), opacity: appear };
    }).in(storyPin),
  )
  .element(galleryCards)
  .motion(stagger(riseFade(24), { spread: 0.25 }).in(galleryReveal, ease.cubicOut));
