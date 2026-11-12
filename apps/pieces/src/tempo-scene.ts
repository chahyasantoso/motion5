import { clockDriver } from "@gerak/dom";
import {
  combine,
  ease,
  fade,
  keyframes,
  mix,
  rise,
  span,
  type Key,
  type Pose2d,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 5000;

const BEAT_MS = 500; // 120 beats a minute
const TICKS = 8; // four seconds
const STOP_MS = BEAT_MS * TICKS;
const REACH = 22; // degrees either side, the same every tick

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

const arrive = span(STOP_MS, STOP_MS + 420);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  arm: { rotation: swing(time), anchor: "bottom" } satisfies Pose2d,
  right: { opacity: flashRight(time) } satisfies Pose2d,
  left: { opacity: flashLeft(time) } satisfies Pose2d,
  title: combine([
    rise({ distance: 26 }, arrive.of(time, ease.cubicOut)),
    fade({}, arrive.of(time)),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
