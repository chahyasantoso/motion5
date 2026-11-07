import { Spec, definePlugin } from "@motion5/core/plugin-api";
import { Sprite2d } from "../models/index";
import { moveProgress, numberParam } from "./param";

const CONTACT_WIDTH = 0.2;
const SETTLE_SHARE = 0.5;

/** Squash weight near a contact: 1 at it and exactly 0 from `CONTACT_WIDTH` of a flight away. */
function contactWeight(distance: number): number {
  return Math.max(0, 1 - distance / CONTACT_WIDTH) ** 2;
}

/**
 * A ballistic hop that lands `bounces + 1` times and settles.
 * Each flight is `decay` times as high as the last, so it lasts `sqrt(decay)` as long and hits softer.
 */
export const hopPlugin = definePlugin({
  id: "hop",
  inputs: {
    param: Spec.record({
      height: Spec.number({ min: 0 }),
      bounces: Spec.number({ min: 0, max: 16 }),
      decay: Spec.number({ optional: true, min: 0.01, max: 1 }),
      squash: Spec.number({ optional: true, min: 0, max: 1 }),
      dx: Spec.number({ optional: true }),
      from: Spec.number({ optional: true, min: 0, max: 1 }),
      to: Spec.number({ optional: true, min: 0, max: 1 }),
    }),
  },
  outputs: {
    values: Sprite2d,
    contact: Spec.record({ hits: Spec.number(), justHit: Spec.number() }),
  },
  transform({ param }, { progress }) {
    const height = numberParam(param, "height", 0);
    const flights = Math.floor(numberParam(param, "bounces", 0)) + 1;
    const decay = numberParam(param, "decay", 0.5);
    const squash = numberParam(param, "squash", 0);
    const dx = numberParam(param, "dx", 0);
    const local = moveProgress(param, progress);

    const shrink = Math.sqrt(decay);
    const lastFlight = shrink ** (flights - 1);
    let airtime = 0;
    for (let flight = 0; flight < flights; flight += 1) airtime += shrink ** flight;
    const total = airtime + lastFlight * SETTLE_SHARE;
    const time = local * total;

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
      values: {
        x: dx * Math.min(1, time / airtime),
        y,
        scaleX: 1 + 0.9 * squash * weight,
        scaleY: 1 - squash * weight,
      },
      contact: { hits, justHit: weight },
    };
  },
});
