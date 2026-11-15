import { combine, type Events, type Pose2d, span, type Time } from "@gerak/moves";
import { actor, cssVariables, group, many, story } from "@gerak/stage";
import { card } from "../../showreel/style";
import { jolt } from "../../showreel/src/moves/jolt";
import { kick } from "../../showreel/src/moves/kick";
import { lob } from "../../showreel/src/moves/lob";
import { shockwave } from "../../showreel/src/moves/shockwave";
import { squish } from "../../showreel/src/moves/squish";

export const style = "showreel";

export const beats = story(6400, {
  card: [0, 1100],
  badges: [1100, 3400],
  slam: [3700, 4300],
  impact: [4300, 5400],
});

const DUST = 8;

export const cast = {
  world: group({
    card: actor(),
    badge1: actor(),
    badge2: actor(),
    badge3: actor(),
    stamp: actor(),
    ring: actor({ on: ["impact"] }),
    dust: many(DUST, { on: ["impact"] }),
  }),
};

export const design = { stamp: { y: { slam: "heavy" } } };

export const skins = {
  dom: {
    css: `${cssVariables(card.tokens)}
[data-cast="world"] { position: absolute; inset: 0; background: var(--paper); font-family: "Arial Black", Arial, sans-serif; font-weight: 900; }
[data-cast="card"] { position: absolute; left: 380px; top: 80px; width: 520px; height: 300px; background: var(--night); color: var(--paper); border-radius: 18px; }
[data-cast="card"]::before { content: "NOV 21"; position: absolute; left: 0; right: 0; top: 70px; text-align: center; font-size: 110px; line-height: 1; }
[data-cast="card"]::after { content: "LAUNCH DAY"; position: absolute; left: 0; right: 0; top: 215px; text-align: center; font-size: 28px; letter-spacing: 8px; color: var(--mute); }
[data-cast^="badge"] { position: absolute; top: 470px; width: 240px; height: 80px; border: 4px solid var(--night); border-radius: 40px; color: var(--night); display: flex; align-items: center; justify-content: center; font-size: 26px; box-sizing: border-box; }
[data-cast="badge1"] { left: 200px; }
[data-cast="badge2"] { left: 520px; }
[data-cast="badge3"] { left: 840px; }
[data-cast="badge1"]::before { content: "FASTER"; }
[data-cast="badge2"]::before { content: "LIGHTER"; }
[data-cast="badge3"]::before { content: "OPEN"; color: var(--mute); }
[data-cast="stamp"] { position: absolute; left: 740px; top: 300px; width: 240px; height: 110px; background: var(--coral); color: var(--paper); border: 6px solid var(--night); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 64px; letter-spacing: 6px; box-sizing: border-box; }
[data-cast="stamp"]::before { content: "LIVE"; }
[data-cast="ring"] { position: absolute; left: 820px; top: 335px; width: 80px; height: 80px; border: 5px solid var(--coral); border-radius: 50%; box-sizing: border-box; }
[data-cast^="dust."] { position: absolute; left: 855px; top: 405px; width: 12px; height: 12px; background: var(--night); border-radius: 50%; }`,
  },
};

const side = (i: number) => (i % 2 === 0 ? 1 : -1);

export const scene = (time: Time, _events: Events) => {
  const badge = (i: number): Pose2d => {
    const from = 1100 + i * 650;
    return combine([
      lob(
        { dx: i === 1 ? 0 : (i - 1) * -160, dy: -700, apex: 0, stretch: 0.5, facing: "upright" },
        span(from, from + 600).of(time),
      ),
      squish({ squash: 0.28, bulge: 0.7, wobbles: 2 }, span(from + 600, from + 1200).of(time)),
    ]);
  };
  const stamp: Pose2d = combine([
    { rotation: -8 },
    lob({ dx: 0, dy: -600, apex: 0, stretch: 0.5, facing: "upright" }, span(3700, 4300).of(time)),
    squish({ squash: 0.35, bulge: 0.8, wobbles: 3 }, span(4300, 5000).of(time)),
  ]);
  const dust = Array.from(
    { length: DUST },
    (_, i): Pose2d =>
      kick(
        { dx: i < 4 ? side(i) * (50 + i * 30) : 0, rise: 30 + (i % 3) * 18, fall: 12, shrink: 0.7 },
        span(4300, 4900 + (i % 3) * 100).of(time),
      ),
  );
  return {
    world: jolt({ distance: 14, count: 4, sideways: 0.35 }, span(4300, 4900).of(time)),
    card: combine([
      lob(
        { dx: -900, dy: -150, apex: 260, stretch: 0.4, facing: "heading" },
        span(0, 1000).of(time),
      ),
      squish({ squash: 0.12, bulge: 0.7, wobbles: 2 }, span(1000, 1600).of(time)),
    ]),
    badge1: badge(0),
    badge2: badge(1),
    badge3: badge(2),
    stamp,
    ring: shockwave({ grow: 14 }, span(4300, 5000).of(time)),
    dust,
  };
};
