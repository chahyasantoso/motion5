import { combine, drop, ease, fade, mix, span, type Events, type Time } from "@gerak/moves";
import { actor, story } from "@gerak/stage";
import { thud } from "./moves/thud";

export const frame = { width: 600, height: 400 };

export const beats = story(3000, {
  hang: [0, 450],
  fall: [500, 850],
  land: [850, 1950],
  tint: [880, 1700],
  word: [1500, 2300],
});

export const cast = {
  step: actor({ still: true }),
  tether: actor(),
  parcel: actor(),
  word: actor({ text: () => "Delivered" }),
};

export const design = {
  parcel: {
    y: { fall: "heavy" },
    scaleY: { land: "loose" },
    rotation: { land: "loose" },
    tint: { tint: "calm" },
    shadowBlur: { fall: "heavy" },
  },
  tether: { scaleY: { fall: "quick" } },
  word: { opacity: { word: "calm" }, y: { word: "calm" } },
};

export const skins = {
  dom: {
    css: `
[data-cast="step"] { position: absolute; left: 100px; top: 300px; width: 400px; height: 40px; background: #cfc6bb; border-radius: 4px; }
[data-cast="tether"] { position: absolute; left: 299px; top: 0; width: 2px; height: 80px; background: #5b5148; }
[data-cast="parcel"] { position: absolute; left: 260px; top: 220px; width: 80px; height: 80px; border-radius: 6px;
  background: oklch(from color-mix(in oklch, #f5731e, var(--gerak-tint-to, white) calc(var(--gerak-tint, 0) * 100%)) calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)));
  --gerak-tint-to: #2fa866; --gerak-shadow: rgba(40, 30, 20, 0.45); }
[data-cast="word"] { position: absolute; left: 0; top: 330px; width: 600px; height: 50px; display: flex; justify-content: center; font: 700 34px sans-serif; color: #2b6b45; }
`,
  },
};

export const scene = (time: Time, _events: Events) => {
  const fall = drop({ distance: 140, squash: 0.12 }, beats.fall.of(time));
  const height = -(fall.y ?? 0);
  const tinted = mix(0, 1, beats.tint.of(time, ease.sineInOut).progress);
  const parcel = combine([
    fall,
    thud({ squash: 0.2, tilt: 6, rings: 3 }, beats.land.of(time)),
    {
      tint: tinted,
      shadowY: height,
      shadowBlur: 3 + height * 0.1,
    },
  ]);
  const release = span(500, 720).of(time, ease.quadOut).progress;
  const word = combine([
    { y: mix(18, 0, beats.word.of(time, ease.sineInOut).progress) },
    fade({}, beats.word.of(time)),
  ]);
  return {
    step: {},
    tether: { scaleY: 1 - release, anchor: "top" as const },
    parcel,
    word,
  };
};
