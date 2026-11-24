import { motion, type Pose2d, type Time } from "@gerak/core";
import { mount } from "@gerak/dom";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  poseOf,
  scene,
  scrollPoint,
} from "@gerak/stage";

const rise = motion((t: Time): Pose2d => ({ y: 40 * (1 - t.progress), opacity: t.progress }));
const NAMES = ["reverse", "stay", "replay"] as const;

const piece = scene(
  { name: "triggers" },
  ...NAMES.map((back) =>
    box(back).moves(
      rise.in(beat(`reveal-${back}`, 1000, { when: scrollPoint(300).reached, back })),
    ),
  ),
);

const compiled = compileScene(piece);
if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
const { stage } = compiled;
const mounted = mount(stage, { clock: "live" });

// The engine's pose of each card now, for the browser test to hold the drawn one against.
Reflect.set(window, "__expected", () => {
  const { targets } = frame(stage, { time: mounted.driver.now(), events: mounted.events() });
  return Object.fromEntries(
    NAMES.map((name) => {
      const pose = poseOf(targets[name]);
      return [name, { y: pose?.y ?? 0, opacity: pose?.opacity ?? 1 }];
    }),
  );
});
