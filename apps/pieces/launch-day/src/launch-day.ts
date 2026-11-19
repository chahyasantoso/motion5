import { combine, lanes, span, type Pose2d } from "@gerak/core";
import { defineStage, each } from "@gerak/stage";
import { cssVariables } from "@gerak/stage/dom";
import { card } from "../../showreel/style";
import { kick } from "../../showreel/src/moves/kick";
import { jolt } from "../../showreel/src/moves/jolt";
import { lob } from "../../showreel/src/moves/lob";
import { shockwave } from "../../showreel/src/moves/shockwave";
import { squish } from "../../showreel/src/moves/squish";

const css = `${cssVariables(card.tokens)}
[data-cast="world"] { position: absolute; inset: 0; background: var(--paper); }
[data-cast="date"], [data-cast="day"], [data-cast="one"], [data-cast="two"], [data-cast="three"], [data-cast="stamp"], [data-cast="ring"], [data-cast^="dust."] { position: absolute; display: grid; place-items: center; font-family: system-ui, sans-serif; font-weight: 800; }
[data-cast="date"] { left: 300px; top: 110px; width: 680px; height: 120px; background: var(--night); color: var(--paper); font-size: 64px; letter-spacing: 8px; border-radius: 18px 18px 0 0; }
[data-cast="day"] { left: 300px; top: 230px; width: 680px; height: 150px; background: #fff; color: var(--night); font-size: 84px; border-radius: 0 0 18px 18px; box-shadow: 0 10px 0 var(--mute); }
[data-cast="one"], [data-cast="two"], [data-cast="three"] { top: 440px; width: 200px; height: 70px; border-radius: 35px; background: var(--night); color: var(--paper); font-size: 30px; }
[data-cast="one"] { left: 320px; }
[data-cast="two"] { left: 540px; background: var(--mute); }
[data-cast="three"] { left: 760px; }
[data-cast="stamp"] { left: 880px; top: 540px; width: 200px; height: 90px; border: 8px solid var(--coral); color: var(--coral); border-radius: 12px; font-size: 54px; letter-spacing: 6px; }
[data-cast="ring"] { left: 965px; top: 570px; width: 30px; height: 30px; border: 4px solid var(--coral); border-radius: 50%; opacity: 0; }
[data-cast^="dust."] { left: 973px; top: 640px; width: 14px; height: 14px; border-radius: 50%; background: var(--coral); opacity: 0; }`;

const DUST_DX = [-90, -55, -25, 25, 55, 90];

export default defineStage({
  beats: {
    date: [0, 1100],
    badges: [1000, 2700],
    stamp: [2900, 3500],
    impact: [3500, 5400],
  },
  cast: (m) => ({
    world: m.group({
      date: m.text("LAUNCH DAY"),
      day: m.text("14 MARCH"),
      one: m.text("Fast"),
      two: m.text("Light"),
      three: m.text("Yours"),
      ring: m.box(),
      dust: m.many(6),
      stamp: m.text("LIVE"),
    }),
  }),
  skins: { dom: { css } },
  scene: ({ time }) => {
    const date = span(0, 700);
    const dateLand = span(700, 1100);
    const badges = span(1000, 2700);
    const stampFly = span(2900, 3500);
    const stampLand = span(3500, 3900);
    const burst = span(3500, 4300);

    const badge = (i: number, dx: number): Pose2d => {
      const t = lanes([1, 1, 1], 0.45).of(badges.of(time), i);
      return combine([
        lob({ dx, dy: -420, apex: 160, facing: "upright" }, t),
        squish({ squash: 0.28, wobbles: 2 }, t),
      ]);
    };

    return {
      world: combine([jolt({ distance: 12, count: 4 }, burst.of(time))]),
      date: combine([
        lob({ dx: -700, dy: -420, apex: 0, facing: "heading" }, date.of(time)),
        squish({ squash: 0.2, wobbles: 2 }, dateLand.of(time)),
      ]),
      day: combine([
        lob({ dx: 700, dy: -420, apex: 0, facing: "heading" }, date.of(time)),
        squish({ squash: 0.12, wobbles: 2 }, dateLand.of(time)),
      ]),
      one: badge(0, -700),
      two: badge(1, 0),
      three: badge(2, 700),
      stamp: combine([
        lob({ dx: 0, dy: -700, apex: 120, facing: "upright" }, stampFly.of(time)),
        squish({ squash: 0.35, wobbles: 3 }, stampLand.of(time)),
      ]),
      ring: shockwave({ grow: 14 }, burst.of(time)),
      dust: each(DUST_DX, (dx) =>
        kick({ dx, rise: 40 + Math.abs(dx) / 3, fall: 6 }, burst.of(time)),
      ),
    };
  },
});
