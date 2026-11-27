import { liveClock } from "@gerak/dom";
import {
  combine,
  pageInputs,
  span,
  springTo,
  value,
  type Input,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { drop } from "@gerak/moves";

/** How long the intro runs, in ms; the tools sample this much, and the card answers the pointer after it too. */
export const durationMs = 900;

const intro = span(0, 700);
/** Up on hover and back down on leave, from wherever it is when the pointer changes its mind. */
const lift = springTo(value(pageInputs, "hovered", "card"), (hovered) => (hovered > 0 ? -14 : 0), {
  stiffness: 260,
  damping: 20,
});
/** A quick sink while pressed. */
const press = springTo(
  value(pageInputs, "pressed", "card"),
  (pressed) => (pressed > 0 ? 0.95 : 1),
  {
    stiffness: 600,
    damping: 28,
  },
);

export const scene = (time: Time, events: Input) => {
  const y = lift(time, events);
  const raised = -y / 14;
  return {
    card: combine([
      drop({ distance: 420, squash: 0.06 })(intro.of(time)),
      { y, scale: press(time, events) },
    ]),
    shadow: {
      scale: 1 - 0.12 * raised,
      opacity: intro.of(time).progress * (0.55 - 0.25 * raised),
    } satisfies Pose2d,
  };
};

export const clock = () => liveClock({ introMs: durationMs });
