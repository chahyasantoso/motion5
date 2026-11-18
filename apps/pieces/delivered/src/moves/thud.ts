import { attack, taper, wave, type Pose2d } from "@gerak/core";
import { defineMove, squashed } from "@gerak/moves";

const rise = attack({ rate: 40 });
const fade = taper({ power: 2 });

export const thud = defineMove({
  id: "thud",
  role: "emphasis",
  description:
    "A heavy body takes an impact on its base: it is crushed at once, then rings in height and tips side to side, each swing smaller; a parcel landing.",
  options: {
    squash: {
      kind: "number",
      min: 0,
      max: 0.6,
      default: 0.2,
      description: "Height lost at the first crush, as a share; default 0.2.",
    },
    tilt: {
      kind: "number",
      min: 0,
      max: 30,
      default: 5,
      description: "Widest tip about its base, in degrees; default 5.",
    },
    rings: {
      kind: "number",
      min: 1,
      max: 8,
      default: 3,
      description: "Crush-and-stretch cycles over the span; default 3.",
    },
  },
  example: { options: { squash: 0.2, tilt: 5, rings: 3 } },
  moments: () => ({}),
  run: ({ squash, tilt, rings }, { progress }): Pose2d => {
    const built = rise(progress);
    const left = fade(progress);
    const crush = squash * built * left * wave({ count: rings, phase: 0.25 })(progress);
    const sway = tilt * built * left * wave({ count: rings * 0.7 })(progress);
    return { ...squashed(crush, 1, "bottom"), rotation: sway };
  },
});
