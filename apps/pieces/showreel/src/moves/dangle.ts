import { NO_EVENTS, elapsedOf, timeAt, type Pose2d, type Time } from "@gerak/core";
import { trail } from "@gerak/core";

/** Options of `dangle`. */
export interface DangleOptions {
  /** The sideways position of what it hangs from at a time, in px. */
  readonly carrier: (time: Time) => number;
  /** The string's length in px: a longer string swings slower and turns less for the same push. */
  readonly length: number;
  /** Swing rate against a 160 px string's 1.25 swings a second, which scales as one over the root of the length; default 1. */
  readonly pace?: number;
  /** How fast the swinging dies: 0.05 rings on, 1 barely swings past; default 0.2. */
  readonly damping?: number;
  /** How far it turns for a given lag behind the carrier; default 1, a true pendulum. */
  readonly gain?: number;
  /** Ms it feels the carrier late, so a row of them swings in a wave; default 0. */
  readonly lag?: number;
  /** The widest turn either way, in degrees; default 60. */
  readonly limit?: number;
}

/** Hangs on a string from a moving carrier and swings behind it whenever the carrier speeds up or stops, then rings down. */
export function dangle(options: DangleOptions): (time: Time) => Pose2d {
  const { carrier, length, pace = 1, damping = 0.2, gain = 1, lag = 0, limit = 60 } = options;
  return (time): Pose2d => {
    const omega = 2 * Math.PI * 1.25 * pace * Math.sqrt(160 / length);
    const late = (t: Time) => carrier(timeAt(t, (elapsedOf(t.clock) ?? 0) - lag));
    const follower = trail((t) => late(t), {
      stiffness: omega * omega,
      damping: 2 * damping * omega,
    })(time, NO_EVENTS);
    const turn = (gain * Math.atan((late(time) - follower) / length) * 180) / Math.PI;
    return { rotation: Math.max(-limit, Math.min(limit, turn)), anchor: "top" };
  };
}
