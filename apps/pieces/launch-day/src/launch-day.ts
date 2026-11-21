import { lanes, motion, type Motion, type Pose2d, type Time } from "@gerak/core";
import { beat, box, group, many, sceneBuilder, text, type MotionContext } from "@gerak/stage";
import { kick } from "./moves/kick";
import { jolt } from "./moves/jolt";
import { lob } from "./moves/lob";
import { shockwave } from "./moves/shockwave";
import { squish } from "./moves/squish";

const DUST_DX = [-90, -55, -25, 25, 55, 90];
const BADGES = lanes([1, 1, 1], 0.45);

const date = beat("date", 700, { at: 0 });
const dateLand = beat("dateLand", 400, { at: 700 });
const badges = beat("badges", 1700, { at: 1000 });
const stampFly = beat("stampFly", 600, { at: 2900 });
const stampLand = beat("stampLand", 400, { at: 3500 });
const burst = beat("burst", 800, { at: 3500 });

const dateText = text("date", "LAUNCH DAY");
const day = text("day", "14 MARCH");
const one = text("one", "Fast");
const two = text("two", "Light");
const three = text("three", "Yours");
const ring = box("ring");
const dust = many("dust", DUST_DX.length);
const stamp = text("stamp", "LIVE");
const world = group("world", [dateText, day, one, two, three, ring, dust, stamp]);

/** A motion posing from a badge's own lane of the badges beat. */
const inLane = (lane: number, pose: (time: Time) => Pose2d): Motion<Pose2d> =>
  motion((time) => pose(BADGES.of(time, lane)));

/** A motion posing each dust part from its own `dx`. */
const dustKick = motion((time, context?: MotionContext): Pose2d => {
  const dx = DUST_DX[context?.index ?? 0] ?? 0;
  return kick({ dx, rise: 40 + Math.abs(dx) / 3, fall: 6 })(time);
});

/** A badge flies in and squishes on landing, in its own lane. */
const badge = (lane: number, dx: number): readonly Motion<Pose2d>[] => [
  inLane(lane, lob({ dx, dy: -420, apex: 160, facing: "upright" })).in(badges),
  inLane(lane, squish({ squash: 0.28, wobbles: 2 })).in(badges),
];

export default sceneBuilder({ length: 5400 })
  .element(world)
  .motion(motion(jolt({ distance: 12, count: 4 })).in(burst))
  .element(dateText)
  .motion(
    motion(lob({ dx: -700, dy: -420, apex: 0, facing: "heading" })).in(date),
    motion(squish({ squash: 0.2, wobbles: 2 })).in(dateLand),
  )
  .element(day)
  .motion(
    motion(lob({ dx: 700, dy: -420, apex: 0, facing: "heading" })).in(date),
    motion(squish({ squash: 0.12, wobbles: 2 })).in(dateLand),
  )
  .element(one)
  .motion(...badge(0, -700))
  .element(two)
  .motion(...badge(1, 0))
  .element(three)
  .motion(...badge(2, 700))
  .element(ring)
  .motion(motion(shockwave({ grow: 14 })).in(burst))
  .element(dust)
  .show(burst)
  .motion(dustKick.in(burst))
  .element(stamp)
  .motion(
    motion(lob({ dx: 0, dy: -700, apex: 120, facing: "upright" })).in(stampFly),
    motion(squish({ squash: 0.35, wobbles: 3 })).in(stampLand),
  );
