import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import type { Time } from "./time";
import { customNames, pushed, whole } from "./whole";

/** Plays its input, then passes its last pose and settles back onto it. */
export const overshoot = defineMove({
  id: "overshoot",
  role: "modifier",
  description: "Plays another move, then goes a little past its end and settles back.",
  options: {
    share: {
      kind: "number",
      default: 0.3,
      min: 0,
      max: 0.9,
      description: "Share of the progress spent past the end; default 0.3.",
    },
    amount: {
      kind: "number",
      default: 0.1,
      min: 0,
      max: 1,
      description: "How far past the end, as a share of the input's whole travel; default 0.1.",
    },
  },
  example: {
    options: { share: 0.3, amount: 0.1 },
    input: (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) }),
  },
  run({ share, amount }, time, input: (time: Time) => Pose2d): Pose2d {
    const at = (progress: number) => input({ ...time, progress });
    const first = at(0);
    const last = at(1);
    const names = customNames(first, last);
    const playing = 1 - share;
    if (time.progress <= playing) {
      const played = at(time.progress / playing);
      return whole(played, customNames(first, last, played));
    }
    const v = (time.progress - playing) / share;
    return pushed(last, first, amount * Math.sin(Math.PI * v) * (1 - v), names);
  },
  moments: ({ share }) => ({ settle: 1 - share }),
});
