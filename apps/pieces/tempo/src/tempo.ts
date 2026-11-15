import {
  combine,
  ease,
  fade,
  keyframes,
  mix,
  rise,
  type Key,
  type Pose2d,
  type Time,
} from "@gerak/moves";
import { actor, group, story } from "@gerak/stage";

const BEAT_MS = 500; // 120 beats a minute
const TICKS = 8; // four seconds
const STOP_MS = BEAT_MS * TICKS;
const REACH = 22; // degrees either side, the same every tick

/** Eight ticks at 120 beats a minute, then the title arrives. */
export const beats = story(5000, { ticks: [0, STOP_MS], arrive: [STOP_MS, STOP_MS + 420] });

/** The stage is 600 by 600. */
export const frame = { width: 600, height: 600 };

/** A metronome: an arm that swings on its pivot, a mark that flashes on each side, and the title. */
export const cast = {
  left: actor(),
  right: actor(),
  base: actor({ still: true }),
  arm: group({ weight: actor({ still: true }) }),
  pivot: actor({ still: true }),
  title: actor({ text: "TEMPO" }),
};

export const skins = {
  dom: {
    css: `
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
    `,
  },
};

/** Which side a tick lands on: even beats right, odd beats left. */
const sideOf = (beat: number): number => (beat % 2 === 0 ? 1 : -1);

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
  Array.from({ length: TICKS }, (_, beat) => beat)
    .filter((beat) => sideOf(beat) === side)
    .flatMap((beat): Key<number>[] => [
      { at: Math.max(1, beat * BEAT_MS - 40), to: 0 },
      { at: Math.max(2, beat * BEAT_MS + 20), to: 1, ease: ease.cubicOut },
      { at: beat * BEAT_MS + 260, to: 0, ease: ease.cubicOut },
    ]);
const flashRight = keyframes(0, flashKeys(1), mix);
const flashLeft = keyframes(0, flashKeys(-1), mix);

export const scene = (time: Time) => ({
  arm: { rotation: swing(time), anchor: "bottom" } satisfies Pose2d,
  right: { opacity: flashRight(time) } satisfies Pose2d,
  left: { opacity: flashLeft(time) } satisfies Pose2d,
  title: combine([
    rise({ distance: 26 }, beats.arrive.of(time, ease.cubicOut)),
    fade({}, beats.arrive.of(time)),
  ]),
});
