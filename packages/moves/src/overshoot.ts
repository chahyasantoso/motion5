import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import type { Time } from "./time";
import { num, whole } from "./whole";

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
    const playing = 1 - share;
    if (time.progress <= playing) return whole(at(time.progress / playing));
    const first = at(0);
    const last = at(1);
    const v = (time.progress - playing) / share;
    const past = amount * Math.sin(Math.PI * v) * (1 - v);
    return {
      ...last,
      x: num(last.x) + past * (num(last.x) - num(first.x)),
      y: num(last.y) + past * (num(last.y) - num(first.y)),
      rotation: num(last.rotation) + past * (num(last.rotation) - num(first.rotation)),
    };
  },
  moments: ({ share }) => ({ settle: 1 - share }),
});
