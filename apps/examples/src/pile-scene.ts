import { clockDriver } from "@gerak/dom";
import { mergeEvents, react, seeded, type Events, type Pose2d, type Time } from "@gerak/moves";
import { builtinWorld, simulate } from "@gerak/physics";

export const durationMs = 4200;
export const WORD = "TUMBLE";
export const FLOOR = 600;
export const SIZE = { width: 110, height: 140 };

const random = seeded(5);
/** Where each letter's box starts, above the stage, turned a little; the page lays each letter out here, upright. */
export const STARTS = [...WORD].map((_, index) => ({
  id: `letter${index}`,
  x: 470 + index * 68 + (random() - 0.5) * 60,
  y: -160 - index * 210 - random() * 60,
  angle: (random() - 0.5) * 50,
  spin: (random() - 0.5) * 240,
}));

const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: FLOOR }, { restitution: 0.25, friction: 0.7 });
  world.addCollider("left", { kind: "wall", x: 0, side: "left" });
  world.addCollider("right", { kind: "wall", x: 1280, side: "right" });
  for (const start of STARTS)
    world.addBody({ ...start, shape: { kind: "box", ...SIZE }, restitution: 0.25, friction: 0.7 });
});

/** Each letter squashes on every contact it starts, harder than it springs back. */
const squash = STARTS.map(({ id }) =>
  react({ on: ["contact"], target: id, kind: "recoil", amplitude: 0.14, decay: 11, frequency: 3 }),
);

/** Each letter's box moves and turns around its centre; its glyph squashes from its foot inside it. */
export const scene = (time: Time, events: Events) => {
  const all = mergeEvents(events, sim.events(time));
  return {
    letters: STARTS.map(({ id }): Pose2d => sim.pose(id, time)),
    glyphs: STARTS.map((_, index): Pose2d => {
      const give = squash[index]?.(time, all) ?? 0;
      return { scaleY: 1 - give, scaleX: 1 + 0.7 * give, anchor: "bottom" };
    }),
  };
};

export const clock = () => clockDriver({ duration: durationMs });
