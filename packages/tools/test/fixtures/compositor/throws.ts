import { motion, type Pose2d, type Time } from "@gerak/core";
import { mount } from "@gerak/dom";
import { beat, box, scene, scrollPoint } from "@gerak/stage";

// A motion that throws once scroll passes 2000 px, which the page has not reached.
const late = beat("late", { scroll: [scrollPoint(1500), scrollPoint(2000)] });

mount(
  scene(
    { name: "throws" },
    box("late").moves(
      motion((t: Time): Pose2d => {
        if (t.progress >= 1) throw new RangeError("late: past the end");
        return { x: 100 * t.progress };
      }).in(late),
    ),
  ),
  { clock: "live" },
);
Reflect.set(window, "__mounted", true);
