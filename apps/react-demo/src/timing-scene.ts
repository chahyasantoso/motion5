import { clockDriver } from "@motion5/dom";
import { drop, hop, lane, lanes, window, wipe, type Time } from "@motion5/moves";

/** The whole beat, in ms: letters fall, the dot hops in, then the cover wipes out from the dot. */
export const BEAT_MS = 3000;
export const WORD = "TIMING";

const LETTERS = lanes(
  [...WORD].map(() => 1),
  0.25,
);

/** `time` seen through the part of the beat from `fromMs` to `toMs`. */
function part(time: Time, fromMs: number, toMs: number): Time {
  return window(time, fromMs / BEAT_MS, toMs / BEAT_MS);
}

/** The beat as one scene; the wipe grows from `centre`, which the page measures after layout. */
export function timingScene(centre: { readonly x: number; readonly y: number }) {
  return (time: Time) => {
    const word = part(time, 0, 1000);
    return {
      letters: [...WORD].map((_, index) =>
        drop({ distance: 700, squash: 0.18 }, lane(word, index, LETTERS)),
      ),
      dot: hop(
        { height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: 1300 },
        part(time, 880, 1870),
      ),
      cover: wipe({ radius: 1500, x: centre.x, y: centre.y }, part(time, 2400, 3000)),
    };
  };
}

/** The beat's clock on the page's frames. */
export const beatClock = () => clockDriver({ duration: BEAT_MS });

/** The beat for the motion tools: `motion:sample` and `motion:timeline` read these two exports. */
export const scene = timingScene({ x: 0, y: 0 });
export const durationMs = BEAT_MS;
