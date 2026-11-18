import { defineStage } from "@gerak/stage";

export default defineStage({
  beats: { intro: [0, 400], go: [400, 1400], out: [1400, 2000] },
  cast: (m) => ({
    stage: m.group({
      dot: m.box().on("go"),
      word: m.letters("AB"),
      mark: m.box().static(),
    }),
  }),
  skins: { dom: { css: "" } },
  scene: ({ time, beats, rest }) => {
    const go = beats.go.of(time).progress;
    const intro = beats.intro.of(time).progress;
    return {
      dot: { x: rest.get("dot").x + 100 * go },
      word: (index) => ({ x: index * 20 + 50 * intro }),
    };
  },
});
