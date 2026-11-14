import { clockDriver } from "@gerak/dom";
import {
  aim,
  combine,
  drop,
  ease,
  fade,
  follow,
  lane,
  lanes,
  mergeEvents,
  mix,
  mixPose3d,
  orbit,
  project3d,
  reversed,
  rise,
  seeded,
  sequence,
  slide,
  span,
  springEase,
  tally,
  wipe,
  type Events,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/moves";
import { simulate, type BodyState3d } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, posedJoints3d } from "@gerak/rig";
import rig from "../references/dragonling.joints.json" with { type: "json" };
import talk from "../references/talk.json" with { type: "json" };

/** How long the scene runs, in ms. */
export const durationMs = 10000;

/** The page's size in px; the page sizes its renderer and stage from it. */
export const stage = { width: 1280, height: 720 } as const;

const FOV = 38;
const FOCUS = { x: 0, y: 0.24, z: 0.02 };

const cameraAt = (push: number): Pose3d => {
  const eye = orbit({
    target: FOCUS,
    radius: mix(2.2, 1.38, push),
    azimuth: mix(22, 0, push),
    elevation: mix(14, 8, push),
  });
  return { ...eye, ...aim(eye, FOCUS) };
};

/** The camera as the page first draws it. */
export const lens: Lens3d = { ...cameraAt(0), fov: FOV };

/* The story's beats, in ms. */
const TITLE_AT = 200;
const PUSH = span(0, 6600);
const TURN = span(1700, 2800);
const TALK_AT = 2800;
const TALK_MS = 4300;
const TALK_END = TALK_AT + TALK_MS;
const CARD_IN = span(5500, 6300);
const LOOK = span(5750, 6700);
const TITLE_OUT = span(8000, 8800);

/* The recorded talk shifted onto the story. */
const talkCues: Events = [
  ...talk
    .filter((sample) => sample.name === "mouthOpen" && sample.at <= TALK_MS)
    .map((sample) => ({
      name: "mouthOpen",
      at: sample.at + TALK_AT,
      target: "dragon",
      value: sample.value,
    })),
  { name: "mouthOpen", at: TALK_END, target: "dragon", value: 0 },
];
export const speech =
  "Hello, visitor! I keep this little hoard. Everything that lands here is counted, and everything counted is mine.".split(
    " ",
  );
const mouth = follow({
  start: 0,
  on: { mouthOpen: "value" },
  target: "dragon",
  stiffness: 420,
  damping: 40,
});
const said = tally({ start: 0, on: { mouthOpen: "value" }, target: "dragon" });
const SAID_TOTAL = said.total(talkCues);

/* Blinks: a few on beats of the story, the rest drawn once from a seed. */
const BLINK_MS = 170;
const BEATS = [TURN.at(1), 4200, LOOK.at(0.1)];
const blinkTimes = (() => {
  const random = seeded(11);
  const times = [...BEATS];
  let at = 600;
  while (at < 9000) {
    at += 1000 + random() * 1500;
    if (BEATS.every((beat) => Math.abs(beat - at) > 400)) times.push(at);
  }
  return times.sort((a, b) => a - b);
})();
const shutAt = (time: Time): number => {
  let shut = 0;
  for (const start of blinkTimes) {
    const p = span(start, start + BLINK_MS).of(time).progress;
    if (p > 0 && p < 1) shut = Math.max(shut, p < 0.35 ? p / 0.35 : (1 - p) / 0.65);
  }
  return shut;
};

/* Props spawned from cues, falling through 3D physics. */
const PROP_COUNT = 8;
const SPAWN_Y = 1.15;
const scatter = seeded(5);
const PROPS = Array.from({ length: PROP_COUNT }, (_, i) => {
  const side = i % 2 === 0 ? 1 : -1;
  return {
    id: `p${i}`,
    at: 700 + i * 520,
    x: side * (0.17 + scatter() * 0.16),
    z: -0.05 + scatter() * 0.32,
    box: i % 3 === 0,
    size: 0.024 + scatter() * 0.014,
    spin: (scatter() - 0.5) * 240,
  };
});
export const cues: Events = [
  ...PROPS.map((prop) => ({ name: "prop", at: prop.at, target: prop.id })),
  ...talkCues,
];
export const propSpecs = PROPS;

const rapier3d = await rapierEngine3d();
const sim = simulate(
  rapier3d(),
  (world) => {
    world.setGravity(0, -2.6, 0);
    world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.45, friction: 0.7 });
    world.addCollider("torso", {
      kind: "box",
      x: 0,
      y: 0.15,
      z: -0.02,
      width: 0.2,
      height: 0.3,
      depth: 0.3,
    });
    world.addCollider("head", {
      kind: "box",
      x: 0,
      y: 0.37,
      z: 0.14,
      width: 0.11,
      height: 0.14,
      depth: 0.14,
    });
  },
  {
    durationMs,
    dt: 1 / 60,
    checkpointMs: 100,
    maxCheckpoints: 100,
    spawn: (event, world) => {
      const prop = PROPS.find((entry) => entry.id === event.target);
      if (event.name !== "prop" || prop === undefined) return;
      world.addBody({
        id: prop.id,
        shape: prop.box
          ? { kind: "box", width: prop.size * 1.7, height: prop.size * 1.7, depth: prop.size * 1.7 }
          : { kind: "sphere", radius: prop.size },
        x: prop.x,
        y: SPAWN_Y,
        z: prop.z,
        wx: prop.spin,
        wz: prop.spin * 0.6,
        restitution: 0.5,
        friction: 0.6,
        drag: 2,
      });
    },
  },
);

/* The dragonling. */
const AWAY: Pose3d = { rotationY: -75 };
const TO_VIEWER: Pose3d = { rotationY: 0 };

const bonesAt = (time: Time, events: Events): Readonly<Record<string, Pose3d>> => {
  const open = mouth(time, events);
  const look = LOOK.of(time, springEase({ stiffness: 90, damping: 13 })).progress;
  const settle = TURN.of(time, springEase({ stiffness: 110, damping: 12 })).progress;
  return {
    Jaw: { rotationX: open * 18 },
    Head: { rotationY: look * 34 + open * 1.5, rotationX: -open * 2 },
    Neck: { rotationY: look * 12, rotationX: (1 - settle) * 6 },
  };
};

const rootAt = (time: Time): Pose3d =>
  mixPose3d(AWAY, TO_VIEWER, TURN.of(time, springEase({ stiffness: 90, damping: 11 })).progress);

/* 2D over 3D. */
const TITLE_WORDS = 3;
const titleWord = (time: Time, i: number): Pose2d => {
  const mine = lane(span(TITLE_AT, TITLE_AT + 1600).of(time), i, lanes([1, 1, 1], 0.45));
  return combine([drop({ distance: 300, squash: 0.2 }, mine), fade({}, mine)]);
};
const titleWipe = (time: Time): Pose2d =>
  sequence(time, [
    [span(0, TITLE_OUT.at(0)), (): Pose2d => ({})],
    [TITLE_OUT, (t): Pose2d => wipe({ radius: 620, x: 470, y: 60 }, reversed(t))],
  ]);

const plusAt = (all: Events, time: Time, id: string, lensNow: Lens3d): Pose2d => {
  const landing = all.find(
    (event) => event.name === "contact" && event.target === id && event.other === "floor",
  );
  if (landing === undefined || landing.point === undefined) return { opacity: 0 };
  const here = project3d(
    { x: landing.point.x, y: landing.point.y, z: landing.point.z ?? 0 },
    lensNow,
    stage,
  );
  const life = span(landing.at, landing.at + 900).of(time);
  const lift = rise({ distance: 46 }, life);
  const gone = fade({}, reversed(life));
  return {
    x: here.x,
    y: here.y - 14 + (lift.y ?? 0),
    opacity: here.visible ? (gone.opacity ?? 0) : 0,
  };
};

const MOUTH_REACH = 0.07;
const bubbleAt = (
  time: Time,
  events: Events,
  bones: Readonly<Record<string, Pose3d>>,
  root: Pose3d,
  lensNow: Lens3d,
): Pose2d => {
  const joints = posedJoints3d(rig.joints, bones, root);
  const turn = (root.rotationY ?? 0) + (bones.Neck?.rotationY ?? 0) + (bones.Head?.rotationY ?? 0);
  const yaw = turn * (Math.PI / 180);
  const jaw = joints.Jaw;
  const point = project3d(
    {
      x: jaw.x + Math.sin(yaw) * MOUTH_REACH,
      y: jaw.y - 0.008,
      z: jaw.z + Math.cos(yaw) * MOUTH_REACH,
    },
    lensNow,
    stage,
  );
  const share = Math.min(1, said(time, events) / SAID_TOTAL);
  const show = span(TALK_AT - 200, TALK_AT + 250).of(time).progress;
  const hide = span(TALK_END + 600, TALK_END + 1000).of(time).progress;
  return {
    x: point.x,
    y: point.y,
    opacity: point.visible ? show * (1 - hide) : 0,
    custom: { spoken: share },
  };
};

const offsetFrom = (prop: { x: number; z: number }, state: BodyState3d | undefined): Pose3d => {
  const pose = bodyPose3d(state);
  return {
    ...pose,
    x: (pose.x ?? 0) - prop.x,
    y: (pose.y ?? 0) - SPAWN_Y,
    z: (pose.z ?? 0) - prop.z,
  };
};

/** Every target's pose at `time`. */
export const scene = (time: Time, events: Events) => {
  const push = PUSH.of(time, ease.cubicInOut).progress;
  const lensNow: Lens3d = { ...cameraAt(push), fov: FOV };
  const root = rootAt(time);
  const bones = bonesAt(time, events);
  const all = mergeEvents(events, sim.events(time, events));
  const states = sim.at(time, events);
  const present = Object.keys(states);
  return {
    camera: cameraAt(push),
    dragon: root,
    bones,
    face: { custom: { shut: shutAt(time) } } satisfies Pose3d,
    props: PROPS.map((prop): Pose3d => {
      return present.includes(prop.id) ? offsetFrom(prop, states[prop.id]) : { scale: 0 };
    }),
    title: Array.from({ length: TITLE_WORDS }, (_, i) => titleWord(time, i)),
    titleWipe: titleWipe(time),
    plus: PROPS.map((prop) => plusAt(all, time, prop.id, lensNow)),
    bubble: bubbleAt(time, events, bones, root, lensNow),
    card: combine([
      slide({ distance: 560, from: "right" }, CARD_IN.of(time)),
      fade({}, CARD_IN.of(time)),
    ]),
  };
};

export const clock = () => clockDriver({ duration: durationMs });
