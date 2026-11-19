import {
  combine,
  elapsedOf,
  lanes,
  mix,
  motion,
  reversed,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { fade, rise, smudge } from "@gerak/moves";
import { beat, box, group, sceneBuilder, text, type MotionContext } from "@gerak/stage";

const TITLE = "Night Shift";

const arrive = beat("arrive", 1400, { at: 300 });
const drift = beat("drift", 1000, { at: 1900 });
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

/** A motion posing each letter from its own lane of the beat. */
const perLetter = (pose: (lane: Time) => Pose2d) =>
  motion((time, context?: MotionContext) => pose(LETTERS.of(time, context?.index ?? 0)));

const letterFade = perLetter((lane) => fade()(lane));
const letterRise = perLetter((lane) =>
  combine([rise({ distance: 14 })(lane), smudge({ amount: 6, build: 0.7 })(reversed(lane))]),
);

const card = box("card");
const heading = text("heading", "Now playing");
const title = text("title", TITLE, { split: "letters" });
const line = group("line", [title]);
const artist = text("artist", "Mira Vale");
const play = text("play", "▶", { watch: true });

/** The play button's breathing scale, from its hover events. */
const breathing = motion((time, context?: MotionContext) => ({
  scale: playScale(time, context?.events ?? []),
}));

/** The whole line rises a little. */
const lift = motion((time): Pose2d => ({ y: mix(0, -16, time.progress) }));

const css = `
[data-cast] { position: absolute; }
[data-cast="title"] { position: relative; gap: 0; }
[data-cast^="title."] { position: relative; }
[data-cast="card"] { left: 340px; top: 210px; width: 600px; height: 300px; border-radius: 28px; background: #141a2e; box-shadow: 0 20px 60px #0008; }
[data-cast="heading"] { left: 400px; top: 250px; font: 600 15px/1 system-ui, sans-serif; letter-spacing: 0.22em; text-transform: uppercase; color: #7f8cb8; }
[data-cast="line"] { gap: 0; left: 400px; top: 330px; display: flex; font: 700 56px/1 Georgia, serif; color: #f3efe6; }
[data-cast^="title."] { white-space: pre; }
[data-cast="artist"] { left: 400px; top: 405px; font: 400 22px/1 system-ui, sans-serif; color: #9aa6d0; }
[data-cast="play"] { left: 790px; top: 400px; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f0b45a; color: #141a2e; font-size: 24px; padding-left: 4px; box-sizing: border-box; cursor: pointer; }
`;

export default sceneBuilder({ length: 4000, skins: { dom: { css } } })
  .element(card)
  .element(heading)
  .element(line)
  .motion(lift.in(drift))
  .element(title)
  .motion(letterFade.in(arrive), letterRise.in(arrive))
  .element(artist)
  .motion(fade().in(drift), rise({ distance: 8 }).in(drift))
  .element(play)
  .motion(breathing);
