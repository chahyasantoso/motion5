import { liveClock } from "@gerak/dom";
import { combine, span, state, unreachable, type Input, type Pose2d, type Time } from "@gerak/core";
import { drop, follow } from "@gerak/moves";

/** How long the intro runs, in ms; the tools sample this much, and the card answers the pointer after it too. */
export const durationMs = 900;

const intro = span(0, 700);
const liftGoal = state(
  0,
  (current, entry) => {
    switch (entry.kind) {
      case "trigger":
        return entry.name === "enter" ? -14 : entry.name === "leave" ? 0 : current;
      case "value":
        return current;
      default:
        return unreachable(entry.kind);
    }
  },
  { target: "card" },
);
/** Up on hover and back down on leave, from wherever it is when the pointer changes its mind. */
const lift = follow(liftGoal, { stiffness: 260, damping: 20 });
const pressGoal = state(
  1,
  (current, entry) => {
    switch (entry.kind) {
      case "trigger":
        return entry.name === "down"
          ? 0.95
          : entry.name === "up" || entry.name === "leave"
            ? 1
            : current;
      case "value":
        return current;
      default:
        return unreachable(entry.kind);
    }
  },
  { target: "card" },
);
/** A quick sink while pressed. */
const press = follow(pressGoal, { stiffness: 600, damping: 28 });

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
