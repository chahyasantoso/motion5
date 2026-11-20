import { motion, type Pose2d, type Time } from "@gerak/core";
import { mountPage } from "@gerak/dom";
import {
  beat,
  box,
  compileScene,
  el,
  formatStageError,
  frame,
  poseOf,
  sceneBuilder,
  scrollPoint,
} from "@gerak/stage";

const across = beat("across", { scroll: [scrollPoint(200), scrollPoint(1200)] });
const reveal = beat("reveal", 1000, { when: scrollPoint(300).reached, back: "stay" });

const compiled = compileScene(
  sceneBuilder({ name: "scroll" })
    .element(box("bar", { node: el("#bar") }))
    .motion(motion((t: Time): Pose2d => ({ x: 300 * t.progress })).in(across))
    .element(box("card", { node: el("#card") }))
    .motion(motion((t: Time): Pose2d => ({ y: 40 * (1 - t.progress) })).in(reveal)),
);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const { stage } = compiled;
const mounted = mountPage(stage);

// The engine's pose of each element now, for the browser test to hold the drawn one against.
Reflect.set(window, "__expected", () => {
  const { targets } = frame(stage, { time: mounted.driver.now(), events: mounted.events() });
  return Object.fromEntries(
    ["bar", "card"].map((name) => {
      const pose = poseOf(targets[name]);
      return [name, { x: pose?.x ?? 0, y: pose?.y ?? 0 }];
    }),
  );
});
