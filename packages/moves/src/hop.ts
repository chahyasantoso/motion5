import { defineMove } from "./declare";
import { squashed } from "./pose";

const CONTACT_WIDTH = 0.2;
const SETTLE_SHARE = 0.5;

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

export const hop = defineMove({
  id: "hop",
  description: "Lands bounces + 1 times, each flight lower, and settles at rest.",
  options: {
    height: { kind: "number", min: 0, description: "Peak of the first flight above rest, in px." },
    bounces: {
      kind: "number",
      min: 0,
      max: 16,
      description: "Landings after the first; 0 lands once.",
    },
    decay: {
      kind: "number",
      default: 0.5,
      min: 0.01,
      max: 1,
      description: "Each flight's height as a share of the last; default 0.5.",
    },
    squash: {
      kind: "number",
      default: 0,
      min: 0,
      max: 1,
      description: "Height lost at the hardest landing, as a share; default 0.",
    },
    dx: {
      kind: "number",
      default: 0,
      description: "Start this far left of rest, in px, arriving by the last landing.",
    },
  },
  inputs: {},
  output: "pose2d",
  extras: { contact: { hits: "number", justHit: "number" } },
  run({ height, bounces, decay, squash, dx }, { progress }) {
    const { flights, shrink, lastFlight, airtime, total } = schedule(bounces, decay);
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
      ...squashed(squash, weight),
      contact: { hits, justHit: weight },
    };
  },
  moments({ bounces, decay }) {
    const { lengths, airtime, total } = schedule(bounces, decay);
    let start = 0;
    const landings = lengths.map((length) => (start += length) / total);
    return { landings, lastLanding: airtime / total };
  },
});
