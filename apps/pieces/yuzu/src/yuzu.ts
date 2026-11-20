import {
  clamp,
  ease,
  mix,
  motion,
  pointer,
  scroll,
  springTo,
  type Pose2d,
  type Time,
} from "@gerak/core";
import {
  beat,
  bind,
  box,
  el,
  many,
  sceneBuilder,
  section,
  stagger,
  text,
  travel,
} from "@gerak/stage";

/** Cold-Pressed Sparkling Yuzu landing page choreography. */

const hero = section("hero", el("#hero"));
const features = section("features", el("#features"));
const story = section("story", el("#story"));
const gallery = section("gallery", el("#gallery"));

const slotHero = box("slotHero", { node: el("#hero .slot") });
const slotFeatures = box("slotFeatures", { node: el("#features .slot") });
const slotStory = box("slotStory", { node: el("#story .slot") });

const drink = box("drink", { node: el("#drink") });
const heroAura = box("heroAura", { node: el("#hero-aura") });
const headline = text("headline", "Bright citrus pressed fresh every cold morning", {
  split: "words",
  node: el("#hero-headline"),
});
const heroSub = box("heroSub", { node: el("#hero-sub") });
const heroCta = box("heroCta", { node: el("#hero-cta") });
const featureCards = many("featureCards", 3, { node: el("#features .feature-card") });
const storyProgress = box("storyProgress", { node: el("#story-progress") });
const storyStep1 = box("storyStep1", { node: el("#story-step-1") });
const storyStep2 = box("storyStep2", { node: el("#story-step-2") });
const galleryCards = many("galleryCards", 4, { node: el("#gallery .gallery-card") });

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

const midTilt = (degrees: number) =>
  motion((t: Time): Pose2d => {
    const p = t.progress;
    return { rotation: p <= 0 || p >= 1 ? 0 : degrees * Math.sin(Math.PI * p) };
  });

export default sceneBuilder({ name: "yuzu" })
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
    riseFade(24).in(intro, ease.cubicOut),
    travel({ to: slotFeatures, arc: 64 }).in(toFeatures, ease.sineInOut),
    midTilt(8).in(toFeatures),
    travel({ to: slotStory, arc: -64 }).in(toStory, ease.sineInOut),
    midTilt(-8).in(toStory),
  )
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
