import type { Events, Time } from "@gerak/moves";
import { actor, group, letters, story } from "@gerak/stage";

export const frame = { width: 600, height: 400 };

export const beats = story(3000, {
  hang: [0, 450],
  fall: [450, 900],
  land: [900, 2000],
  tint: [950, 1700],
  word: [1500, 2300],
});

export const cast = {
  step: actor({ still: true }),
  tether: actor(),
  parcel: actor(),
  word: group({ chars: letters("Delivered", { on: [["word", "word"]] }) }),
};

export const design = {
  parcel: {
    y: { fall: "heavy" },
    scaleY: { land: "loose" },
    rotation: { land: "loose" },
    tint: { tint: "calm" },
    shadowBlur: { land: "heavy" },
  },
  tether: { scaleY: { fall: "quick" } },
  word: { opacity: { word: "calm" } },
};

export const skins = {
  dom: {
    css: `
[data-cast="step"] { position: absolute; left: 100px; top: 300px; width: 400px; height: 40px; background: #cfc6bb; border-radius: 4px; }
[data-cast="tether"] { position: absolute; left: 299px; top: 0; width: 2px; height: 140px; background: #5b5148; }
[data-cast="parcel"] { position: absolute; left: 260px; top: 220px; width: 80px; height: 80px; border-radius: 6px;
  background: oklch(from color-mix(in oklch, #f5731e, var(--gerak-tint-to, white) calc(var(--gerak-tint, 0) * 100%)) calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)));
  --gerak-tint-to: #2fa866; --gerak-shadow: rgba(40, 30, 20, 0.45); }
[data-cast="word"] { position: absolute; left: 0; top: 330px; width: 600px; height: 50px; display: flex; justify-content: center; font: 700 34px sans-serif; color: #2b6b45; }
[data-cast^="word.chars"] { position: relative; }
`,
  },
};

export const scene = (_time: Time, _events: Events) => ({
  step: {},
  tether: {},
  parcel: {},
  word: {},
  "word.chars": [],
});
