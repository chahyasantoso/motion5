import { ease, keyframes, mix, motion, type Key, type Pose2d } from "@gerak/core";
import { fade, rise } from "@gerak/moves";
import { beat, bind, box, group, sceneBuilder, text } from "@gerak/stage";

const BEAT_MS = 500; // 120 beats a minute
const TICKS = 8; // four seconds
const STOP_MS = BEAT_MS * TICKS;
const REACH = 22; // degrees either side, the same every tick

const arrive = beat("arrive", 420, { at: STOP_MS });

/** Which side a tick lands on: even beats right, odd beats left. */
const sideOf = (tick: number): number => (tick % 2 === 0 ? 1 : -1);

const swingKeys: Key<number>[] = [
  ...Array.from(
    { length: TICKS - 1 },
    (_, i): Key<number> => ({
      at: (i + 1) * BEAT_MS,
      to: -sideOf(i) * REACH,
      ease: ease.sineInOut,
    }),
  ),
  { at: STOP_MS, to: 0, ease: ease.sineIn },
];
const swing = keyframes(REACH, swingKeys, mix);

/** A mark that flashes at each tick on its side, and is dark otherwise. */
const flashKeys = (side: number): Key<number>[] =>
  Array.from({ length: TICKS }, (_, tick) => tick)
    .filter((tick) => sideOf(tick) === side)
    .flatMap((tick): Key<number>[] => [
      { at: Math.max(1, tick * BEAT_MS - 40), to: 0 },
      { at: Math.max(2, tick * BEAT_MS + 20), to: 1, ease: ease.cubicOut },
      { at: tick * BEAT_MS + 260, to: 0, ease: ease.cubicOut },
    ]);
const flashRight = keyframes(0, flashKeys(1), mix);
const flashLeft = keyframes(0, flashKeys(-1), mix);

const left = box("left");
const right = box("right");
const base = box("base");
const weight = box("weight");
const arm = group("arm", [weight]);
const pivot = box("pivot");
const title = text("title", "TEMPO");

const css = `
      [data-stage="frame"] { background: #14213d; }
      [data-cast="base"] { position: absolute; left: 190px; top: 400px; width: 220px; height: 34px; border-radius: 6px; background: #f1e9d2; }
      [data-cast="arm"] { position: absolute; left: 295px; top: 120px; width: 10px; height: 290px; border-radius: 5px; background: #f1e9d2; }
      [data-cast="weight"] { position: absolute; left: -13px; top: 56px; width: 36px; height: 30px; border-radius: 4px; background: #fca311; }
      [data-cast="pivot"] { position: absolute; left: 288px; top: 396px; width: 24px; height: 24px; border-radius: 50%; background: #fca311; }
      [data-cast="left"], [data-cast="right"] { position: absolute; top: 112px; width: 16px; height: 16px; border-radius: 50%; background: #fca311; opacity: 0; }
      [data-cast="left"] { left: 170px; }
      [data-cast="right"] { left: 414px; }
      [data-cast="title"] {
        position: absolute; left: 0; right: 0; top: 478px; text-align: center; color: #f1e9d2;
        font: 700 52px/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: 0.3em; text-indent: 0.3em; opacity: 0;
      }
    `;

/** Eight ticks at 120 beats a minute, then the title arrives. */
/** How the DOM renderer draws this piece. */
export const skin = { css };

export default sceneBuilder({
  frame: { width: 600, height: 600 },
  length: 5000,
})
  .element(left)
  .motion(bind({ opacity: flashLeft }))
  .element(right)
  .motion(bind({ opacity: flashRight }))
  .element(base)
  .element(arm)
  .motion(motion((time): Pose2d => ({ rotation: swing(time), anchor: "bottom" })))
  .element(weight)
  .element(pivot)
  .element(title)
  .motion(
    motion((time) =>
      rise({ distance: 26 })({ ...time, progress: ease.cubicOut(time.progress) }),
    ).in(arrive),
    fade().in(arrive),
  );
