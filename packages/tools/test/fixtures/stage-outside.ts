import { defineStage } from "@gerak/stage";

export default defineStage({
  beats: { intro: [0, 400], go: [400, 1400], out: [1400, 2000] },
  cast: (m) => ({
    stage: m.group({
      dot: m.box().on("go"),
      word: m.letters("AB"),
    }),
  }),
  skins: { dom: { css: "" } },
  scene: ({ time, beats }) => {
    const intro = beats.intro.of(time).progress;
    const out = beats.out.of(time).progress;
    return {
      dot: { x: 100 * intro + 10 * Math.min(1, out * 20) },
      word: [0, 1].map((index) => ({ x: index * 20 + 50 * intro })),
    };
  },
});
