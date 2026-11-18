import { attack, decay, taper, wave, type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";

const rise = attack({ rate: 60 });
const fall = decay({ rate: 4 });
const fade = taper({ power: 1 });

export const squish = defineMove({
  id: "squish",
  role: "emphasis",
  description:
    "Squashes against the floor on an impact and springs back through a few quick, dying wobbles of height and width; a landing that jiggles.",
  options: {
    squash: {
      kind: "number",
      min: 0,
      max: 0.9,
      description: "Height lost at the deepest squash, as a share.",
    },
    bulge: {
      kind: "number",
      min: 0,
      max: 1.5,
      default: 0.7,
      description: "How much it widens, as a share of the squash; default 0.7.",
    },
    wobbles: {
      kind: "number",
      min: 0,
      max: 8,
      default: 2,
      description: "Swings between squash and stretch over the span; default 2.",
    },
  },
  example: { options: { squash: 0.3, bulge: 0.7, wobbles: 2 } },
  moments: () => ({ deepest: 0.04 }),
  run: ({ squash, bulge, wobbles }, { progress: p }): Pose2d => {
    const envelope = rise(p) * fall(p) * fade(p);
    const h = squash * envelope * wave({ count: wobbles, phase: 0.25 })(p);
    return { scaleY: 1 - h, scaleX: 1 + bulge * h, anchor: "bottom" };
  },
});
