import { attack, decay, taper, wave, type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";

const fade = taper({ power: 2 });
const fall = decay({ rate: 3 });
const rise = attack({ rate: 25 });

export const jolt = defineMove({
  id: "jolt",
  role: "emphasis",
  description:
    "Jolts up and down from an impact, with a smaller side-to-side shudder, dying away; for a camera or a floor that takes a hit.",
  options: {
    distance: { kind: "number", min: 0, description: "The most it moves up or down, in px." },
    count: {
      kind: "number",
      min: 1,
      max: 6,
      default: 4,
      description: "Up-and-down cycles over the span; default 4.",
    },
    sideways: {
      kind: "number",
      min: 0,
      max: 1,
      default: 0.35,
      description: "Side-to-side shudder as a share of the distance; default 0.35.",
    },
  },
  example: { options: { distance: 10, count: 5, sideways: 0.35 } },
  moments: () => ({}),
  run: ({ distance, count, sideways }, { progress: p }): Pose2d => {
    const envelope = fade(p) * fall(p) * rise(p);
    return {
      y: distance * envelope * wave({ count })(p),
      x: distance * sideways * envelope * wave({ count: count * 0.64 })(p),
    };
  },
});
