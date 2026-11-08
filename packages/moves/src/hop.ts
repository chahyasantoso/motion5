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
    const flights = Math.floor(bounces) + 1;
    const shrink = Math.sqrt(decay);
    const lastFlight = shrink ** (flights - 1);
    let airtime = 0;
    for (let flight = 0; flight < flights; flight += 1) airtime += shrink ** flight;
    const total = airtime + lastFlight * SETTLE_SHARE;
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
});
