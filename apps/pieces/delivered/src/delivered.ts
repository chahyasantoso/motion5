import { ease, mix, motion, type Ease, type Motion, type Pose2d, type Time } from "@gerak/core";
import { drop, fade } from "@gerak/moves";
import { beat, box, sceneBuilder, text } from "@gerak/stage";
import { thud } from "./moves/thud";

const fall = beat("fall", 350, { at: 500 });
const land = beat("land", 1100, { at: 850 });
const tint = beat("tint", 820, { at: 880 });
const word = beat("word", 800, { at: 1500 });
const release = beat("release", 220, { at: 500 });

const FALL = drop({ distance: 140, squash: 0.12 });

/** A motion posing from its beat's time with the progress run through `curve`. */
const eased = (curve: Ease, pose: (time: Time) => Pose2d): Motion<Pose2d> =>
  motion((time) => pose({ ...time, progress: curve(time.progress) }));

const step = box("step");
const tether = box("tether");
const parcel = box("parcel");
const label = text("word", "Delivered");

const css = `
[data-cast="step"] { position: absolute; left: 100px; top: 300px; width: 400px; height: 40px; background: #cfc6bb; border-radius: 4px; }
[data-cast="tether"] { position: absolute; left: 299px; top: 0; width: 2px; height: 80px; background: #5b5148; }
[data-cast="parcel"] { position: absolute; left: 260px; top: 220px; width: 80px; height: 80px; border-radius: 6px;
  background: oklch(from color-mix(in oklch, #f5731e, var(--gerak-tint-to, white) calc(var(--gerak-tint, 0) * 100%)) calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)));
  --gerak-tint-to: #2fa866; --gerak-shadow: rgba(40, 30, 20, 0.45); }
[data-cast="word"] { position: absolute; left: 0; top: 330px; width: 600px; height: 50px; display: flex; justify-content: center; font: 700 34px sans-serif; color: #2b6b45; }
`;

/** How the DOM renderer draws this piece. */
export const skin = { css };

export default sceneBuilder({
  frame: { width: 600, height: 400 },
  length: 3000,
})
  .element(step)
  .element(tether)
  .motion(
    eased(ease.quadOut, ({ progress }) => ({ scaleY: 1 - progress, anchor: "top" })).in(release),
  )
  .element(parcel)
  .motion(
    FALL.in(fall),
    thud({ squash: 0.2, tilt: 6, rings: 3 }).in(land),
    motion((time): Pose2d => {
      const height = -(FALL(time).y ?? 0);
      return { shadowY: height, shadowBlur: 3 + height * 0.1 };
    }).in(fall),
    eased(ease.sineInOut, ({ progress }) => ({ tint: mix(0, 1, progress) })).in(tint),
  )
  .element(label)
  .motion(
    eased(ease.sineInOut, ({ progress }) => ({ y: mix(18, 0, progress) })).in(word),
    fade().in(word),
  );
