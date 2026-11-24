import { ease, motion, type Pose2d, type Time } from "@gerak/core";
import { beat, box, scene, shot } from "@gerak/stage";

const rise = motion((t: Time): Pose2d => ({ y: 40 * (1 - t.progress), opacity: t.progress }));

/** One shot: its title rises over its own first 400 ms, then holds. */
function titled(name: string): ReturnType<typeof scene> {
  return scene({ name }, box(`${name}Title`).moves(rise.in(beat("in", 400), ease.cubicOut)));
}

export default scene(
  { name: "reel" },
  shot(titled("hook"), { length: 1200 }),
  shot(titled("story"), { length: 1500, overlap: 200 }),
  shot(titled("call"), { length: 1600 }),
);
