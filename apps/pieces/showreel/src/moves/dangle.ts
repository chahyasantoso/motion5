import {
  NO_EVENTS,
  defineMove,
  elapsedOf,
  timeAt,
  trail,
  type Pose2d,
  type Time,
} from "@gerak/moves";

/** What a hanging thing hangs from: the carrier's sideways position at a time, in px. */
export interface Carrier {
  readonly carrier: (time: Time) => number;
}

export const dangle = defineMove({
  id: "dangle",
  role: "follow",
  description:
    "Hangs on a string from a moving carrier and swings behind it whenever the carrier speeds up or stops, then rings down; letters on strings under a bar, a sign on a moving hook.",
  options: {
    length: {
      kind: "number",
      min: 20,
      max: 1000,
      description:
        "The string's length in px: a longer string swings slower and turns less for the same push.",
    },
    pace: {
      kind: "number",
      min: 0.1,
      max: 4,
      default: 1,
      description:
        "Swing rate against a 160 px string's 1.25 swings a second, which scales as one over the root of the length; default 1.",
    },
    damping: {
      kind: "number",
      min: 0.05,
      max: 1,
      default: 0.2,
      description: "How fast the swinging dies: 0.05 rings on, 1 barely swings past; default 0.2.",
    },
    gain: {
      kind: "number",
      min: 0,
      max: 40,
      default: 1,
      description:
        "How far it turns for a given lag behind the carrier; default 1, a true pendulum.",
    },
    lag: {
      kind: "number",
      min: 0,
      max: 500,
      default: 0,
      description: "Ms it feels the carrier late, so a row of them swings in a wave; default 0.",
    },
    limit: {
      kind: "number",
      min: 1,
      max: 90,
      default: 60,
      description: "The widest turn either way, in degrees; default 60.",
    },
  },
  example: {
    options: { length: 160, damping: 0.2, gain: 4, lag: 30 },
    input: { carrier: (time: Time) => -400 * (1 - time.progress) ** 2 },
  },
  moments: () => ({}),
  run: ({ length, pace, damping, gain, lag, limit }, time, { carrier }: Carrier): Pose2d => {
    const omega = 2 * Math.PI * 1.25 * pace * Math.sqrt(160 / length);
    const late = (t: Time) => carrier(timeAt(t, (elapsedOf(t.clock) ?? 0) - lag));
    const follower = trail((t) => late(t), {
      stiffness: omega * omega,
      damping: 2 * damping * omega,
    })(time, NO_EVENTS);
    const turn = (gain * Math.atan((late(time) - follower) / length) * 180) / Math.PI;
    return { rotation: Math.max(-limit, Math.min(limit, turn)), anchor: "top" };
  },
});
