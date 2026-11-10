import { clockDriver } from "@gerak/dom";
import { drop, hop, lane, lanes, span, wipe, type Time } from "@gerak/moves";

/** The whole beat, in ms: letters fall, the dot hops in, then the cover wipes out from the dot. */
export const BEAT_MS = 3000;
export const WORD = "TIMING";

const LETTERS = lanes(
  [...WORD].map(() => 1),
  0.25,
);

const word = span(0, 1000, BEAT_MS);
const flight = span(880, 1870, BEAT_MS);
const cover = span(2400, 3000, BEAT_MS);

/** The beat as one scene; the wipe grows from `centre`, which the page measures after layout. */
export function timingScene(centre: { readonly x: number; readonly y: number }) {
  return (time: Time) => ({
    letters: [...WORD].map((_, index) =>
      drop({ distance: 700, squash: 0.18 }, lane(word.of(time), index, LETTERS)),
    ),
    dot: hop({ height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: 1300 }, flight.of(time)),
    cover: wipe({ radius: 1500, x: centre.x, y: centre.y }, cover.of(time)),
  });
}

/** The beat's clock on the page's frames. */
export const beatClock = () => clockDriver({ duration: BEAT_MS });

/** The beat for the motion tools: `motion:sample` and `motion:timeline` read these two exports. */
export const scene = timingScene({ x: 0, y: 0 });
export const durationMs = BEAT_MS;
