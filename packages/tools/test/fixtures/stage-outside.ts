import { type Events, type Time } from "@gerak/moves";
import { actor, group, letters, story } from "@gerak/stage";

export const beats = story(2000, { intro: [0, 400], go: [400, 1400], out: [1400, 2000] });

export const cast = {
  stage: group({
    dot: actor({ enters: "go", leaves: "go" }),
    word: letters("AB"),
  }),
};

export const skins = { dom: { css: "" } };

export const scene = (time: Time, _events: Events) => {
  const intro = beats.intro.of(time).progress;
  const out = beats.out.of(time).progress;
  return {
    dot: { x: 100 * intro + 10 * Math.min(1, out * 20) },
    word: [0, 1].map((index) => ({ x: index * 20 + 50 * intro })),
  };
};
