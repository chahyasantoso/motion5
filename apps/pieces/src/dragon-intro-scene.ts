import { clockDriver } from "@gerak/dom";
import {
  aim,
  combine,
  drop,
  ease,
  elapsedOf,
  fade,
  follow,
  lane,
  liveAt,
  lanes,
  mergeEvents,
  mix,
  orbit,
  overshoot,
  pop,
  project3d,
  reversed,
  seeded,
  slide,
  span,
  springEase,
  timeAt,
  wipe,
  type Events,
  type Lens3d,
  type Pose3d,
  type Time,
} from "@gerak/moves";
import { simulate } from "@gerak/physics";
import { rapierEngine3d } from "@gerak/rapier";
import { bodyPose3d, posedJoints3d } from "@gerak/rig";
import rig from "../references/dragonling.joints.json" with { type: "json" };
import talk from "../references/talk.json" with { type: "json" };

/** The piece is 10 s: the title, the pushed-in camera, the falling hoard, the talk and the card. */
export const durationMs = 10000;

/** The page's size in px; the page sizes its renderer and stage from it. */
export const stage = { width: 1280, height: 720 } as const;

const FOV = 40;
const FOCUS = { x: 0.1, y: 0.3, z: 0 };

/** Where the talk recording starts on the clock; the recording is 8 s long. */
const TALK_AT = 1100;
/** Mouth movement, summed in ms, of the whole recording: the caption's last word shows as it ends. */
const TALK_TOTAL = 2312;
const TALK_STEP = 48;

export const WORDS = [
  "Hello!",
  "I",
  "am",
  "small,",
  "but",
  "I",
  "collect",
  "shiny",
  "things.",
  "Gems,",
  "gold,",
  "whatever",
  "falls.",
  "Mind",
  "my",
  "head,",
  "please.",
  "Oh!",
  "A",
  "card",
  "has",
  "come",
  "for",
  "me.",
] as const;

export const PROP_TARGETS = [
  "prop0",
  "prop1",
  "prop2",
  "prop3",
  "prop4",
  "prop5",
  "prop6",
] as const;
export const PLUS_TARGETS = [
  "plus0",
  "plus1",
  "plus2",
  "plus3",
  "plus4",
  "plus5",
  "plus6",
] as const;
export const WORD_TARGETS = ["word0", "word1", "word2", "word3"] as const;

export const TITLE = ["TINY", "DRAGON,", "BIG", "HOARD"] as const;

const BEATS = {
  titleFirst: 300,
  titleStagger: 0.17,
  turn: [700, 1900],
  bubbleIn: [1500, 1900],
  card: [5700, 6500],
  look: [6100, 7100],
  lookBack: [8200, 8900],
  wipeOut: [8300, 9100],
  push: [150, 4800],
} as const;

/** The samples the dragon talks from, moved to start at `TALK_AT`, and when each prop is tossed in. */
interface Prop {
  readonly shape:
    | { readonly kind: "sphere"; readonly radius: number }
    | {
        readonly kind: "box";
        readonly width: number;
        readonly height: number;
        readonly depth: number;
      };
  readonly x: number;
  readonly z: number;
  readonly at: number;
  readonly spin: number;
  readonly color: number;
}

export const PROPS: readonly Prop[] = [
  {
    shape: { kind: "sphere", radius: 0.045 },
    x: -0.3,
    z: 0.1,
    at: 1050,
    spin: 120,
    color: 0x2fd6a0,
  },
  {
    shape: { kind: "box", width: 0.1, height: 0.05, depth: 0.06 },
    x: 0.34,
    z: 0.05,
    at: 1500,
    spin: 90,
    color: 0xffc233,
  },
  {
    shape: { kind: "sphere", radius: 0.04 },
    x: -0.22,
    z: -0.12,
    at: 2100,
    spin: -100,
    color: 0xff4a6b,
  },
  {
    shape: { kind: "box", width: 0.09, height: 0.05, depth: 0.06 },
    x: 0.26,
    z: 0.2,
    at: 2900,
    spin: -80,
    color: 0xffc233,
  },
  {
    shape: { kind: "sphere", radius: 0.05 },
    x: 0.4,
    z: -0.1,
    at: 3700,
    spin: 140,
    color: 0x5aa8ff,
  },
  {
    shape: { kind: "box", width: 0.1, height: 0.05, depth: 0.06 },
    x: -0.34,
    z: 0.22,
    at: 4600,
    spin: 70,
    color: 0xffc233,
  },
  {
    shape: { kind: "sphere", radius: 0.04 },
    x: 0.18,
    z: 0.3,
    at: 5300,
    spin: -110,
    color: 0xb36bff,
  },
];

const tosses: Events = PROPS.map((prop, index) => ({ name: "toss", at: prop.at, value: index }));
const shifted: Events = talk.map((cue) => ({ ...cue, at: cue.at + TALK_AT }));

/** Talk samples and tosses, played beside the page's own events. */
export const cues: Events = mergeEvents(shifted, tosses);

const SPAWN_Y = 1.3;
const rapier3d = await rapierEngine3d();

const sim = simulate(
  rapier3d(),
  (world) => {
    world.setGravity(0, -9.81, 0);
    world.addCollider("floor", { kind: "floor", y: 0 }, { restitution: 0.4, friction: 0.7 });
    world.addCollider(
      "body",
      { kind: "box", x: 0, y: 0.15, z: 0, width: 0.2, height: 0.22, depth: 0.34 },
      { restitution: 0.2, friction: 0.7 },
    );
    world.addCollider(
      "head",
      { kind: "box", x: 0, y: 0.4, z: 0.14, width: 0.14, height: 0.16, depth: 0.16 },
      { restitution: 0.2, friction: 0.7 },
    );
  },
  {
    spawn: (event, world) => {
      if (event.name !== "toss") return;
      const prop = PROPS[event.value ?? 0];
      if (prop === undefined) return;
      world.addBody({
        id: `prop${event.value ?? 0}`,
        shape: prop.shape,
        x: prop.x,
        y: SPAWN_Y,
        z: prop.z,
        vy: -0.4,
        wy: prop.spin,
        wx: prop.spin * 0.4,
        drag: 0.35,
        restitution: 0.4,
        friction: 0.7,
      });
    },
  },
);

const jaw = follow({
  start: 0,
  on: { mouthOpen: "value" },
  stiffness: 240,
  damping: 30,
  rest: 0.01,
});
const spokenLevel = follow({
  start: 0,
  on: { mouthOpen: "value" },
  stiffness: 240,
  damping: 30,
  rest: 0.01,
});

const ms = (time: Time): number => elapsedOf(time.clock) ?? 0;

const clamp = (value: number, low: number, high: number): number =>
  Math.min(high, Math.max(low, value));

/** Blinks: a few on beats of the story, and between them times drawn once from a seed. */
const BEAT_BLINKS = [1900, 4300, 6250, 9000];
const BLINK_LENGTH = 170;
const blinkTimes = ((): readonly number[] => {
  const random = seeded(11);
  const drawn: number[] = [];
  let at = 600;
  while (at < durationMs - 400) {
    at += 1100 + random() * 1700;
    const near = [...BEAT_BLINKS, ...drawn].some((other) => Math.abs(other - at) < 700);
    if (!near && at < durationMs - 400) drawn.push(at);
  }
  return [...BEAT_BLINKS, ...drawn].sort((a, b) => a - b);
})();

const blinkShut = (now: number): number => {
  let shut = 0;
  for (const start of blinkTimes) {
    const share = (now - start) / BLINK_LENGTH;
    if (share <= 0 || share >= 1) continue;
    shut = Math.max(shut, share < 0.4 ? share / 0.4 : 1 - (share - 0.4) / 0.6);
  }
  return shut;
};

const MOUTH_JOINTS = {
  ...rig.joints,
  Mouth: { x: 0, y: 0.36, z: 0.215, parent: "Head" },
};

const turnSpan = span(BEATS.turn[0], BEATS.turn[1]);
const lookSpan = span(BEATS.look[0], BEATS.look[1]);
const lookBackSpan = span(BEATS.lookBack[0], BEATS.lookBack[1]);
const pushSpan = span(BEATS.push[0], BEATS.push[1]);

const spoken = (time: Time, events: Events): number => {
  const now = ms(time);
  let sum = 0;
  for (let at = TALK_AT; at < now; at += TALK_STEP)
    sum += spokenLevel(timeAt(time, at), events) * TALK_STEP;
  return clamp(sum / TALK_TOTAL, 0, 1);
};

const lensAt = (time: Time): Lens3d => {
  const share = pushSpan.of(time, ease.sineInOut).progress;
  const eye = orbit({
    target: FOCUS,
    radius: mix(3.4, 1.75, share),
    azimuth: mix(9, 0, share),
    elevation: mix(11, 7, share),
  });
  return { ...eye, ...aim(eye, FOCUS), fov: FOV };
};

const spotOf = (
  id: string,
  time: Time,
  events: Events,
  index: number,
): { x: number; y: number; z: number } => {
  const hit = hitOf(id, time, events);
  const at = hit === undefined ? time : timeAt(time, hit);
  const now = sim.at(at, events)[id];
  const prop = PROPS[index];
  return now ?? { x: prop?.x ?? 0, y: SPAWN_Y, z: prop?.z ?? 0 };
};

const hitOf = (id: string, time: Time, events: Events): number | undefined =>
  sim.events(time, events).find((event) => event.name === "contact" && event.target === id)?.at;

const TITLE_LANES = lanes([1, 1, 1, 1], BEATS.titleStagger);

/** Every target's value at `time`. 3D targets are in world units (y up, degrees); labels are in stage px. */
export const scene = (time: Time, events: Events) => {
  const now = ms(time);
  const lens = lensAt(time);
  const level = jaw(time, events);

  const turn = mix(-80, 0, turnSpan.of(time, springEase({ stiffness: 90, damping: 11 })).progress);
  const dragon: Pose3d = { rotationY: turn };

  const look =
    lookSpan.of(time, springEase({ stiffness: 120, damping: 14 })).progress *
    (1 - lookBackSpan.of(time, springEase({ stiffness: 110, damping: 16 })).progress);
  const idle = 1 - ease.sineInOut(clamp((now - 8200) / 800, 0, 1));
  const sway = Math.sin(now / 430);
  const bones: Record<string, Pose3d> = {
    Jaw: { rotationX: level * 18 },
    Head: { rotationY: 30 * look, rotationX: -3 * look - level * 1.5 },
    Neck: { rotationY: 12 * look },
    Chest: { rotationX: 1.2 * idle * Math.sin(now / 650) },
    Tail: { rotationY: 7 * idle * sway },
    TailMid: { rotationY: 10 * idle * Math.sin(now / 430 - 0.9) },
    TailTip: { rotationY: 12 * idle * Math.sin(now / 430 - 1.8) },
  };

  const mouth = posedJoints3d(MOUTH_JOINTS, bones, dragon).Mouth;
  const mouthAt = project3d(mouth, lens, stage);
  const centreAt = project3d({ x: 0, y: 0.2, z: 0 }, lens, stage);
  const facing = clamp((centreAt.depth - mouthAt.depth) / 0.04 + 0.5, 0, 1);
  const bubbleIn = span(BEATS.bubbleIn[0], BEATS.bubbleIn[1]).of(time).progress;
  const bubble = { x: mouthAt.x, y: mouthAt.y, opacity: mouthAt.visible ? facing * bubbleIn : 0 };

  const titleWipe = reversed(span(BEATS.wipeOut[0], BEATS.wipeOut[1]).of(time, ease.sineInOut));
  const titleWords = TITLE.map((_, index) => {
    const own = lane(span(BEATS.titleFirst, BEATS.titleFirst + 1100).of(time), index, TITLE_LANES);
    return combine([drop({ distance: 260, squash: 0.12 }, own), fade({}, own)]);
  });

  const cardTime = span(BEATS.card[0], BEATS.card[1]).of(time);
  const card = overshoot({ amount: 0.06 }, cardTime, (t) =>
    slide({ distance: 560, from: "right" }, t),
  );

  const props = PROPS.map((_, index) => {
    const id = `prop${index}`;
    const exists = sim.bodies(time, events).includes(id);
    return exists ? bodyPose3d(sim.pose(id, time, events)) : { scale: 0 };
  });

  const plus = PROPS.map((_, index) => {
    const id = `prop${index}`;
    const hit = hitOf(id, time, events);
    const spot = spotOf(id, time, events, index);
    const at = project3d({ x: spot.x, y: spot.y + 0.05, z: spot.z }, lens, stage);
    if (hit === undefined) return { x: at.x, y: at.y, scale: 0, opacity: 0 };
    const age = now - hit;
    const popped = pop({ overshoot: 0.6 }, span(hit, hit + 280).of(time)).scale ?? 1;
    const float = ease.quadOut(clamp(age / 1100, 0, 1)) * 46;
    const fadeOut = 1 - clamp((age - 650) / 450, 0, 1);
    return { x: at.x, y: at.y - float, scale: popped, opacity: Math.min(1, age / 90) * fadeOut };
  });

  return {
    lens,
    dragon,
    bones,
    blink: { custom: { shut: blinkShut(now) } },
    caption: { custom: { share: spoken(time, events) } },
    bubble,
    title: wipe({ radius: 760, x: stage.width / 2, y: 45 }, titleWipe),
    word0: titleWords[0] ?? {},
    word1: titleWords[1] ?? {},
    word2: titleWords[2] ?? {},
    word3: titleWords[3] ?? {},
    card,
    prop0: props[0] ?? {},
    prop1: props[1] ?? {},
    prop2: props[2] ?? {},
    prop3: props[3] ?? {},
    prop4: props[4] ?? {},
    prop5: props[5] ?? {},
    prop6: props[6] ?? {},
    plus0: plus[0] ?? {},
    plus1: plus[1] ?? {},
    plus2: plus[2] ?? {},
    plus3: plus[3] ?? {},
    plus4: plus[4] ?? {},
    plus5: plus[5] ?? {},
    plus6: plus[6] ?? {},
  };
};

/** The camera at its first frame: the page builds its camera from this and its field of view. */
export const lens: Lens3d = lensAt(liveAt(0));

const propLimit = { jump: 0.12, turn: 40 };
/** Per-target limits for the review: world units for the 3D targets, px for the labels. */
export const limits = {
  lens: { jump: 0.1, turn: 30 },
  dragon: { jump: 0.05, turn: 30 },
  bones: { jump: 0.05, turn: 30 },
  prop0: propLimit,
  prop1: propLimit,
  prop2: propLimit,
  prop3: propLimit,
  prop4: propLimit,
  prop5: propLimit,
  prop6: propLimit,
  caption: { ratio: 30 },
  blink: { ratio: 30 },
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
