import { clockDriver } from "@motion5/dom";
import { combine, mergeEvents, react, seeded, type Events, type Time } from "@motion5/moves";
import { builtinWorld, simulate } from "@motion5/physics";

export const durationMs = 3600;
export const WORD = "TUMBLE";
export const FLOOR = 600;
export const SIZE = { width: 120, height: 150 };

const random = seeded(5);
/** Where each letter's box starts, above the stage, scattered a little; the page lays each letter out here. */
export const STARTS = [...WORD].map((_, index) => ({
  id: `letter${index}`,
  x: 250 + index * 156 + (random() - 0.5) * 40,
  y: -200 - index * 170 - random() * 80,
}));

const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: FLOOR }, { restitution: 0.35, friction: 0.6 });
  world.addCollider("left", { kind: "wall", x: 0, side: "left" });
  world.addCollider("right", { kind: "wall", x: 1280, side: "right" });
  for (const start of STARTS)
    world.addBody({ ...start, shape: { kind: "box", ...SIZE }, restitution: 0.35, friction: 0.6 });
});

/** Each letter squashes on every contact it starts, harder than it springs back. */
const squash = STARTS.map(({ id }) =>
  react({ on: ["contact"], target: id, kind: "recoil", amplitude: 0.16, decay: 11, frequency: 3 }),
);

export const scene = (time: Time, events: Events) => {
  const all = mergeEvents(events, sim.events(time));
  return {
    letters: STARTS.map(({ id }, index) => {
      const give = squash[index]?.(time, all) ?? 0;
      return combine([
        sim.pose(id, time),
        { scaleY: 1 - give, scaleX: 1 + 0.7 * give, anchor: "bottom" },
      ]);
    }),
  };
};

export const clock = () => clockDriver({ duration: durationMs });
