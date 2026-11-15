import {
  combine,
  elapsedOf,
  fade,
  lane,
  lanes,
  mix,
  reversed,
  rise,
  span,
  type Events,
  type Pose2d,
  type Time,
  smudge,
} from "@gerak/moves";
import { actor, group, letters, story, type Rest } from "@gerak/stage";

const TITLE = "Night Shift";

/** The piece's beats by name, in ms; its length is the story's. */
export const beats = story(4000, {
  arrive: [300, 1700],
  drift: [1900, 2900],
  hold: [2900, 4000],
});

/** Who is on stage; the skin decides what each one looks like. */
export const cast = {
  card: actor({ still: true }),
  heading: actor({ text: "Now playing", still: true }),
  line: group({ title: letters(TITLE) }),
  artist: actor({ text: "Mira Vale" }),
  play: actor({ text: "▶", watch: true }),
};

/** How the cast looks on the page, by `[data-cast="<name>"]`; a member left out is drawn plain. */
export const skins = {
  dom: {
    css: `
[data-cast] { position: absolute; }
[data-cast="title"] { position: relative; gap: 0; }
[data-cast^="title."] { position: relative; }
[data-cast="card"] { left: 340px; top: 210px; width: 600px; height: 300px; border-radius: 28px; background: #141a2e; box-shadow: 0 20px 60px #0008; }
[data-cast="heading"] { left: 400px; top: 250px; font: 600 15px/1 system-ui, sans-serif; letter-spacing: 0.22em; text-transform: uppercase; color: #7f8cb8; }
[data-cast="line"] { gap: 0; left: 400px; top: 330px; display: flex; font: 700 56px/1 Georgia, serif; color: #f3efe6; }
[data-cast^="title."] { white-space: pre; }
[data-cast="artist"] { left: 400px; top: 405px; font: 400 22px/1 system-ui, sans-serif; color: #9aa6d0; }
[data-cast="play"] { left: 790px; top: 400px; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f0b45a; color: #141a2e; font-size: 24px; padding-left: 4px; box-sizing: border-box; cursor: pointer; }
`,
  },
};

const arrive = span(300, 1700);
const drift = span(1900, 2900);
const LETTERS = lanes(
  Array.from(TITLE, () => 1),
  0.35,
);

const BREATH_MS = 1800;
const BREATH = 0.12;
const SETTLE_MS = 260;

const breath = (ms: number): number =>
  BREATH * 0.5 * (1 - Math.cos((2 * Math.PI * ms) / BREATH_MS));

/** Scale of the play button: breathing from the last hover enter until its leave, then easing back to 1. */
const playScale = (time: Time, events: Events): number => {
  const now = elapsedOf(time.clock) ?? 0;
  const entered = events
    .filter((e) => e.target === "play" && e.name === "enter" && e.at <= now)
    .at(-1);
  if (entered === undefined) return 1;
  const left = events.find(
    (e) => e.target === "play" && e.name === "leave" && e.at >= entered.at && e.at <= now,
  );
  if (left === undefined) return 1 + breath(now - entered.at);
  const from = breath(left.at - entered.at);
  return 1 + from * (1 - Math.min(1, (now - left.at) / SETTLE_MS));
};

/** Every member's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time, events: Events, _rest: Rest) => ({
  card: {} satisfies Pose2d,
  heading: {} satisfies Pose2d,
  line: { y: mix(0, -16, drift.of(time).progress) } satisfies Pose2d,
  title: Array.from(TITLE, (_c, i): Pose2d => {
    const t = lane(arrive.of(time), i, LETTERS);
    return combine([
      fade({}, t),
      rise({ distance: 14 }, t),
      smudge({ amount: 6, build: 0.7 }, reversed(t)),
    ]);
  }),
  artist: combine([fade({}, drift.of(time)), rise({ distance: 8 }, drift.of(time))]),
  play: { scale: playScale(time, events) } satisfies Pose2d,
});
