import { eventDriver } from "@motion5/dom";
import { combine, drop, follow, span, type Events, type Pose2d, type Time } from "@motion5/moves";

/** How long the intro runs, in ms; the tools sample this much, and the card answers the pointer after it too. */
export const durationMs = 900;

const intro = span(0, 700, durationMs);
/** Up on hover and back down on leave, from wherever it is when the pointer changes its mind. */
const lift = follow({
  start: 0,
  on: { enter: -14, leave: 0 },
  target: "card",
  stiffness: 260,
  damping: 20,
});
/** A quick sink while pressed. */
const press = follow({
  start: 1,
  on: { down: 0.95, up: 1, leave: 1 },
  target: "card",
  stiffness: 600,
  damping: 28,
});

export const scene = (time: Time, events: Events) => {
  const y = lift(time, events);
  const raised = -y / 14;
  return {
    card: combine([
      drop({ distance: 420, squash: 0.06 }, intro.of(time)),
      { y, scale: press(time, events) },
    ]),
    shadow: {
      scale: 1 - 0.12 * raised,
      opacity: intro.of(time).progress * (0.55 - 0.25 * raised),
    } satisfies Pose2d,
  };
};

export const clock = () => eventDriver({ introMs: durationMs });
