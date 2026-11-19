import type { Pose2d, Time } from "@gerak/core";
import { squashed } from "../parts/coupling/squashed";
import { numberOption } from "./options";

const CONTACT_WIDTH = 0.2;
const SETTLE_SHARE = 0.5;

/** Options of `hop` and `hopLandings`. */
export interface HopOptions {
  /** Peak of the first flight above rest, in px; at least 0, required. */
  readonly height: number;
  /** Landings after the first, from 0 to 16; 0 lands once; required. */
  readonly bounces: number;
  /** Each flight's height as a share of the last, from 0.01 to 1; default 0.5. */
  readonly decay?: number;
  /** Height lost at the hardest landing, as a share from 0 to 1; default 0. */
  readonly squash?: number;
  /** Start this far left of rest, in px, arriving by the last landing; default 0. */
  readonly dx?: number;
}

/** What a hop answers: its pose and its floor contact. */
export type HopPose = Pose2d & {
  readonly contact: { readonly hits: number; readonly justHit: number };
};

/** Squash weight near a contact: 1 at it and exactly 0 from `CONTACT_WIDTH` of a flight away. */
function contactWeight(distance: number): number {
  return Math.max(0, 1 - distance / CONTACT_WIDTH) ** 2;
}

// Lands `bounces + 1` times and settles at rest, arriving from `dx` to the left.
// Each flight is `decay` times as high, so it lasts `sqrt(decay)` as long and hits softer.
/** Each flight's length, in flights of the first, and the whole run with its settle. */
function schedule(bounces: number, decay: number) {
  const flights = Math.floor(bounces) + 1;
  const shrink = Math.sqrt(decay);
  const lastFlight = shrink ** (flights - 1);
  const lengths = Array.from({ length: flights }, (_, flight) => shrink ** flight);
  const airtime = lengths.reduce((sum, length) => sum + length, 0);
  return {
    flights,
    shrink,
    lastFlight,
    lengths,
    airtime,
    total: airtime + lastFlight * SETTLE_SHARE,
  };
}

function read(options: HopOptions) {
  return {
    height: numberOption("hop", "height", options.height, { min: 0 }),
    bounces: numberOption("hop", "bounces", options.bounces, { min: 0, max: 16 }),
    decay: numberOption("hop", "decay", options.decay, { default: 0.5, min: 0.01, max: 1 }),
    squash: numberOption("hop", "squash", options.squash, { default: 0, min: 0, max: 1 }),
    dx: numberOption("hop", "dx", options.dx, { default: 0 }),
  };
}

/** Where in its progress a hop touches the floor: `landings` each as a share from 0 to 1, and
 * `lastLanding`, the final one, where it reaches rest. */
export function hopLandings(options: HopOptions): {
  readonly landings: readonly number[];
  readonly lastLanding: number;
} {
  const { bounces, decay } = read(options);
  const { lengths, airtime, total } = schedule(bounces, decay);
  let start = 0;
  const landings = lengths.map((length) => (start += length) / total);
  return { landings, lastLanding: airtime / total };
}

/** Lands `bounces + 1` times, each flight lower, and settles at rest. Adds `contact { hits, justHit }`:
 * `justHit` runs 1 at a landing to 0 a fifth of a flight on. */
export function hop(options: HopOptions): (time: Time) => HopPose {
  const { height, bounces, decay, squash, dx } = read(options);
  const { flights, shrink, lastFlight, airtime, total } = schedule(bounces, decay);
  const squeeze = squashed({ squash });
  return ({ progress }) => {
    const time = progress * total;

    let start = 0;
    let y = 0;
    let weight = 0;
    let hits = flights;
    for (let flight = 0; flight < flights; flight += 1) {
      const length = shrink ** flight;
      if (time < start + length) {
        const u = (time - start) / length;
        y = 0 - 4 * height * decay ** flight * u * (1 - u);
        const leaving = flight === 0 ? 0 : shrink ** (flight - 1) * contactWeight(u);
        const landing = length * contactWeight(1 - u);
        weight = Math.max(leaving, landing);
        hits = flight;
        break;
      }
      start += length;
    }
    if (hits === flights) {
      const settled = (time - airtime) / (lastFlight * SETTLE_SHARE);
      weight = lastFlight * Math.max(0, 1 - settled) ** 2;
    }

    return {
      x: 0 - dx * (1 - Math.min(1, time / airtime)),
      y,
      ...squeeze(weight),
      contact: { hits, justHit: weight },
    };
  };
}
