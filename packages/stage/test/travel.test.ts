import { INPUT_EVENTS, motion, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  NO_REST,
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  poseOf,
  restReader,
  scene,
  scrollPoint,
  stagger,
  travel,
  type Scene,
  type Stage,
} from "../src";
import { boxInViewport, withPlacement } from "../src/render";

const at = (ms: number, length = 1000): Time => ({
  progress: length <= 0 ? 0 : ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

describe("travel", () => {
  it("validates its target element and finite arc option", () => {
    // @ts-expect-error travel requires an Element target
    expect(() => travel({ to: "#slot" })).toThrow(TypeError);
    // @ts-expect-error travel requires a complete Element with options
    expect(() => travel({ to: { kind: "box", name: "forged" } })).toThrow(TypeError);
    // @ts-expect-error travel requires an options object with `to`
    expect(() => travel({})).toThrow(TypeError);

    const slot = box("slot");
    expect(() => travel({ to: slot, arc: Number.NaN })).toThrow(RangeError);
    expect(() => travel({ to: slot, arc: Number.POSITIVE_INFINITY })).toThrow(RangeError);
    expect(() => travel({ to: slot, arc: Number.NEGATIVE_INFINITY })).toThrow(RangeError);
  });

  it("moves center and size from rest to the target slot's box across a beat with fit fill", () => {
    const heroSlot = box("heroSlot");
    const drink = box("drink");
    const move = beat("move", 400);
    const stage = compiled(
      scene({ length: 400 }, drink.moves(travel({ to: heroSlot, fit: "fill" }).in(move))),
    );

    const rest = restReader({
      drink: { x: 100, y: 200, width: 100, height: 200 },
      heroSlot: { x: 500, y: 400, width: 150, height: 100 },
    });

    const start = poseOf(frame(stage, { time: at(0, 400), rest }).targets["drink"]);
    expect(start).toEqual({});

    const mid = poseOf(frame(stage, { time: at(200, 400), rest }).targets["drink"]);
    expect(mid?.x).toBeCloseTo(200, 9);
    expect(mid?.y).toBeCloseTo(100, 9);
    expect(mid?.scaleX).toBeCloseTo(1.25, 9);
    expect(mid?.scaleY).toBeCloseTo(0.75, 9);

    const end = poseOf(frame(stage, { time: at(400, 400), rest }).targets["drink"]);
    expect(end?.x).toBeCloseTo(400, 9);
    expect(end?.y).toBeCloseTo(200, 9);
    expect(end?.scaleX).toBeCloseTo(1.5, 9);
    expect(end?.scaleY).toBeCloseTo(0.5, 9);
  });

  it("scales evenly to fit inside the slot, centred, by default", () => {
    const slot = box("slot");
    const stage = compiled(
      scene({ length: 400 }, box("drink").moves(travel({ to: slot }).in(beat("move", 400)))),
    );
    const rest = restReader({
      drink: { x: 100, y: 200, width: 100, height: 200 },
      slot: { x: 500, y: 400, width: 150, height: 100 },
    });
    const mid = poseOf(frame(stage, { time: at(200, 400), rest }).targets["drink"]);
    expect(mid?.scaleX).toBeCloseTo(0.75, 9);
    expect(mid?.scaleY).toBeCloseTo(0.75, 9);
    const end = poseOf(frame(stage, { time: at(400, 400), rest }).targets["drink"]);
    expect(end?.x).toBeCloseTo(400, 9);
    expect(end?.y).toBeCloseTo(200, 9);
    expect(end?.scaleX).toBeCloseTo(0.5, 9);
    expect(end?.scaleY).toBeCloseTo(0.5, 9);
    // @ts-expect-error fit is "contain" or "fill"
    expect(() => travel({ to: slot, fit: "cover" })).toThrow(TypeError);
  });

  it("supports fit: none without scaling", () => {
    const slot = box("slot");
    const stage = compiled(
      scene({ length: 400 }, box("drink").moves(travel({ to: slot, fit: "none" }))),
    );
    const rest = restReader({
      drink: { x: 100, y: 200, width: 100, height: 200 },
      slot: { x: 500, y: 400, width: 50, height: 50 },
    });
    const pose = poseOf(frame(stage, { time: at(400, 400), rest }).targets["drink"]);
    expect(pose).toEqual({ x: 400, y: 200 });
  });

  it("sits on its slot with no window across live, timed, and untimed clocks", () => {
    const slot = box("slot");
    const stage = compiled(scene({ length: 400 }, box("drink").moves(travel({ to: slot }))));
    const rest = restReader({
      drink: { x: 100, y: 200, width: 100, height: 200 },
      slot: { x: 500, y: 400, width: 50, height: 100 },
    });
    for (const ms of [0, 200, 400]) {
      const clocks: readonly Time[] = [
        { progress: 0, clock: { kind: "live", elapsed: ms } },
        at(ms, 400),
        { progress: ms / 400, clock: { kind: "untimed" } },
      ];
      for (const time of clocks) {
        const pose = poseOf(frame(stage, { time, rest }).targets["drink"]);
        expect(pose?.x).toBeCloseTo(400, 9);
        expect(pose?.y).toBeCloseTo(200, 9);
        expect(pose?.scaleX).toBeCloseTo(0.5, 9);
        expect(pose?.scaleY).toBeCloseTo(0.5, 9);
      }
    }
  });

  it("bows perpendicular to travel with arc, holding 0 bow at both ends and handling zero-distance", () => {
    const slot = box("slot");
    const same = box("same");
    const orb = box("orb");
    const still = box("still");
    const b1 = beat("b1", 400);

    const stage = compiled(
      scene(
        { length: 400 },
        orb.moves(travel({ to: slot, arc: 80 }).in(b1)),
        still.moves(travel({ to: same, arc: -60 }).in(b1)),
      ),
    );
    const stageNeg = compiled(
      scene({ length: 400 }, box("orbNeg").moves(travel({ to: box("slotNeg"), arc: -80 }).in(b1))),
    );

    const rest = restReader({
      orb: { x: 100, y: 100, width: 50, height: 50 },
      slot: { x: 400, y: 500, width: 50, height: 50 },
      same: { x: 100, y: 100, width: 50, height: 50 },
      still: { x: 100, y: 100, width: 50, height: 50 },
    });
    const negRest = restReader({
      orbNeg: { x: 100, y: 100, width: 50, height: 50 },
      slotNeg: { x: 400, y: 500, width: 50, height: 50 },
    });

    // Travel vector = (300, 400), length = 500. Perp unit = (-400/500, 300/500) = (-0.8, 0.6).
    const start = poseOf(frame(stage, { time: at(0, 400), rest }).targets["orb"]);
    expect(start).toEqual({});

    const mid = poseOf(frame(stage, { time: at(200, 400), rest }).targets["orb"]);
    expect(mid?.x).toBeCloseTo(150 - 0.8 * 80, 9);
    expect(mid?.y).toBeCloseTo(200 + 0.6 * 80, 9);

    const midNeg = poseOf(frame(stageNeg, { time: at(200, 400), rest: negRest }).targets["orbNeg"]);
    expect(midNeg?.x).toBeCloseTo(150 + 0.8 * 80, 9);
    expect(midNeg?.y).toBeCloseTo(200 - 0.6 * 80, 9);

    const end = poseOf(frame(stage, { time: at(400, 400), rest }).targets["orb"]);
    expect(end?.x).toBeCloseTo(300, 9);
    expect(end?.y).toBeCloseTo(400, 9);

    const zeroDist = poseOf(frame(stage, { time: at(200, 400), rest }).targets["still"]);
    expect(zeroDist?.x).toBeCloseTo(0, 9);
    expect(zeroDist?.y).toBeCloseTo(0, 9);
  });

  it("chains multiple travels smoothly from the current pose and preserves unrelated fields", () => {
    const slotA = box("slotA");
    const slotB = box("slotB");
    const drink = box("drink");
    const zeroDrink = box("zeroDrink");
    const b1 = beat("b1", 400, { at: 0 });
    const b2 = beat("b2", 400, { at: 600 });

    const stage = compiled(
      scene(
        { length: 1000 },
        drink
          .moves(motion((t: Time): Pose2d => ({ opacity: 0.7, rotation: 12, scale: 0.5 })).in(b1))
          .moves(travel({ to: slotA }).in(b1))
          .moves(travel({ to: slotB, arc: -60 }).in(b2)),
        zeroDrink
          .moves(motion((): Pose2d => ({ scale: 0 })).in(b1))
          .moves(travel({ to: slotB }).in(b2)),
      ),
    );

    const rest = restReader({
      drink: { x: 100, y: 100, width: 100, height: 200 },
      zeroDrink: { x: 100, y: 100, width: 100, height: 200 },
      slotA: { x: 500, y: 100, width: 200, height: 400 },
      slotB: { x: 500, y: 500, width: 100, height: 200 },
    });

    // Hold between b1 and b2 stays at slotA without resetting scale or unrelated fields.
    const hold = poseOf(frame(stage, { time: at(500, 1000), rest }).targets["drink"]);
    expect(hold?.x).toBeCloseTo(400, 9);
    expect(hold?.y).toBeCloseTo(0, 9);
    expect(hold?.scale).toBeUndefined();
    expect(hold?.scaleX).toBeCloseTo(2, 9);
    expect(hold?.scaleY).toBeCloseTo(2, 9);
    expect(hold?.opacity).toBeCloseTo(0.7, 9);
    expect(hold?.rotation).toBeCloseTo(12, 9);

    // Mid b2 travels straight down from slotA (x=400, y=0) to slotB (x=400, y=400).
    // Right of downward travel is -x; with arc = -60, push is leftward (+60) -> x = 460, y = 200.
    const mid = poseOf(frame(stage, { time: at(800, 1000), rest }).targets["drink"]);
    expect(mid?.x).toBeCloseTo(460, 9);
    expect(mid?.y).toBeCloseTo(200, 9);
    expect(mid?.scale).toBeUndefined();
    expect(mid?.scaleX).toBeCloseTo(1.5, 9);
    expect(mid?.scaleY).toBeCloseTo(1.5, 9);
    expect(mid?.opacity).toBeCloseTo(0.7, 9);
    expect(mid?.rotation).toBeCloseTo(12, 9);

    // At end of b2, slotB matches drink's own size -> scaleX/scaleY clear cleanly to undefined.
    const end = poseOf(frame(stage, { time: at(1000, 1000), rest }).targets["drink"]);
    expect(end?.x).toBeCloseTo(400, 9);
    expect(end?.y).toBeCloseTo(400, 9);
    expect(end?.scale).toBeUndefined();
    expect(end?.scaleX).toBeUndefined();
    expect(end?.scaleY).toBeUndefined();
    expect(end?.opacity).toBeCloseTo(0.7, 9);

    // Even when prior motion had scale: 0, travel reaches slotB cleanly.
    const endZero = poseOf(frame(stage, { time: at(1000, 1000), rest }).targets["zeroDrink"]);
    expect(endZero?.x).toBeCloseTo(400, 9);
    expect(endZero?.y).toBeCloseTo(400, 9);
    expect(endZero?.scale).toBeUndefined();
    expect(endZero?.scaleX).toBeUndefined();
    expect(endZero?.scaleY).toBeUndefined();
  });

  it("lands fixed elements onto flow and sticky slots at two viewport sizes", () => {
    const hero = box("hero");
    const features = box("features");
    const story = box("story");
    const slotFeatures = box("slotFeatures");
    const slotStory = box("slotStory");
    const drink = box("drink");

    const toFeatures = beat("toFeatures", { scroll: [hero.top, features.top] });
    const toStory = beat("toStory", { scroll: [features.top, story.top] });

    const stage = compiled(
      scene(
        drink.moves(
          travel({ to: slotFeatures }).in(toFeatures),
          travel({ to: slotStory }).in(toStory),
        ),
      ),
    );

    const desktopRest = restReader({
      hero: { x: 640, y: 360, width: 1280, height: 720 },
      features: { x: 640, y: 1080, width: 1280, height: 720 },
      story: { x: 640, y: 2160, width: 1280, height: 1440 },
      drink: withPlacement({ x: 640, y: 360, width: 200, height: 320 }, { kind: "fixed" }),
      slotFeatures: withPlacement({ x: 300, y: 1080, width: 160, height: 256 }, { kind: "flow" }),
      slotStory: withPlacement(
        { x: 900, y: 1800, width: 180, height: 288 },
        { kind: "sticky", minY: 1440, maxY: 2000, pinY: 360 },
      ),
    });

    // At scrollY = 720 (features.top), fixed drink lands on slotFeatures viewport box (300, 360).
    const desktopFeatures = poseOf(
      frame(stage, {
        time: at(100, stage.durationMs),
        rest: desktopRest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 720 }],
      }).targets["drink"],
    );
    expect(desktopFeatures?.x).toBeCloseTo(300 - 640, 9);
    expect(desktopFeatures?.y).toBeCloseTo(360 - 360, 9);
    expect(desktopFeatures?.scaleX).toBeCloseTo(0.8, 9);
    expect(desktopFeatures?.scaleY).toBeCloseTo(0.8, 9);

    // Inside sticky pin [1440, 2000], slotStory stays at pinY=360.
    for (const scrollY of [1440, 1700, 2000]) {
      const pinned = poseOf(
        frame(stage, {
          time: at(200, stage.durationMs),
          rest: desktopRest,
          events: [{ name: INPUT_EVENTS.scroll, at: 50, value: scrollY }],
        }).targets["drink"],
      );
      expect(pinned?.x).toBeCloseTo(900 - 640, 9);
      expect(pinned?.y).toBeCloseTo(360 - 360, 9);
      expect(pinned?.scaleX).toBeCloseTo(0.9, 9);
    }

    // Past maxY (scrollY = 2200), slotStory scrolls away upward (360 - 200 = 160).
    const unpinned = poseOf(
      frame(stage, {
        time: at(200, stage.durationMs),
        rest: desktopRest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 2200 }],
      }).targets["drink"],
    );
    expect(unpinned?.y).toBeCloseTo(160 - 360, 9);

    // Narrow mobile rest boxes (390x844 layout): lands accurately on slotFeatures and slotStory too.
    const mobileRest = restReader({
      hero: { x: 195, y: 422, width: 390, height: 844 },
      features: { x: 195, y: 1266, width: 390, height: 844 },
      story: { x: 195, y: 2532, width: 390, height: 1688 },
      drink: withPlacement({ x: 195, y: 422, width: 120, height: 192 }, { kind: "fixed" }),
      slotFeatures: withPlacement({ x: 195, y: 1120, width: 120, height: 192 }, { kind: "flow" }),
      slotStory: withPlacement(
        { x: 195, y: 2040, width: 144, height: 230.4 },
        { kind: "sticky", minY: 1688, maxY: 2200, pinY: 280 },
      ),
    });
    const mobileFeatures = poseOf(
      frame(stage, {
        time: at(100, stage.durationMs),
        rest: mobileRest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 844 }],
      }).targets["drink"],
    );
    const expectedFeatures = boxInViewport(mobileRest.get("slotFeatures"), 844);
    expect(mobileFeatures?.x).toBeCloseTo(expectedFeatures.x - 195, 9);
    expect(mobileFeatures?.y).toBeCloseTo(expectedFeatures.y - 422, 9);

    const mobileStory = poseOf(
      frame(stage, {
        time: at(200, stage.durationMs),
        rest: mobileRest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 1900 }],
      }).targets["drink"],
    );
    expect(mobileStory?.x).toBeCloseTo(0, 9);
    expect(mobileStory?.y).toBeCloseTo(280 - 422, 9);
    expect(mobileStory?.scaleX).toBeCloseTo(1.2, 9);
  });

  it("handles zero-size slots and unmeasured rest readers cleanly", () => {
    const pointSlot = box("pointSlot");
    const mover = box("mover");
    const b1 = beat("b1", 400);
    const stage = compiled(scene({ length: 400 }, mover.moves(travel({ to: pointSlot }).in(b1))));

    expect(
      poseOf(
        frame(stage, {
          time: at(200, 400),
          rest: NO_REST,
        }).targets["mover"],
      ),
    ).toEqual({});

    const zeroSlotPose = poseOf(
      frame(stage, {
        time: at(400, 400),
        rest: restReader({
          mover: { x: 100, y: 100, width: 80, height: 120 },
          pointSlot: { x: 300, y: 250, width: 0, height: 0 },
        }),
      }).targets["mover"],
    );
    expect(zeroSlotPose?.x).toBeCloseTo(200, 9);
    expect(zeroSlotPose?.y).toBeCloseTo(150, 9);
    expect(zeroSlotPose?.scaleX).toBeUndefined();
    expect(zeroSlotPose?.scaleY).toBeUndefined();
  });

  it("auto-registers slot targets statically, allows shared read-only slots, and rolls back on collision", () => {
    const enter = beat("enter", 400);
    const autoSlot = box("autoSlot");
    const explicitSlot = box("explicitSlot");
    const sharedSlot = box("sharedSlot");

    const stage = compiled(
      scene(
        { length: 400 },
        box("a").moves(travel({ to: autoSlot }).in(enter), travel({ to: explicitSlot }).in(enter)),
        explicitSlot,
      ),
    );
    expect(stage.members.find((m) => m.name === "autoSlot")?.expect).toBe("static");
    expect(stage.members.find((m) => m.name === "explicitSlot")?.expect).toBe("static");

    // Read-only `travel({ to: sharedSlot })` can be shared across sibling scenes and one owner.
    const s1 = scene(
      { name: "firstScene" },
      box("one").moves(travel({ to: sharedSlot }).in(enter)),
    );
    const s2 = scene(
      { name: "secondScene" },
      box("two").moves(travel({ to: sharedSlot }).in(enter)),
    );
    const s3 = scene({ name: "thirdScene" }, sharedSlot);
    const merged = compiled(scene(s1, s2, s3));
    expect(merged.members.filter((m) => m.name === "sharedSlot")).toHaveLength(1);

    // Binding `sharedSlot` in another scene still throws, naming both owners.
    expect(() => scene({ name: "fourthScene" }, sharedSlot)).toThrow(
      /sharedSlot.*thirdScene.*fourthScene/,
    );

    // Atomic rollback: two colliding elements in one `.moves(...)` leaves `freshSlot` unowned.
    const freshSlot = box("freshSlot");
    const collidingHero = box("hero");
    const collidingSlot = box("hero");
    expect(() =>
      scene(
        { name: "atomicFail" },
        box("mover").moves(
          travel({ to: freshSlot }).in(enter),
          travel({ to: collidingSlot }).in(
            beat("move", { scroll: [collidingHero.top, collidingHero.end] }),
          ),
        ),
      ),
    ).toThrow(TypeError);
    expect(() => scene({ name: "afterRollback" }, freshSlot)).not.toThrow();
  });

  it("supports stagger on lists, .take() windows, fractional scales, flow/0x0 slots", () => {
    const b1 = beat("b1", 400, { at: 0 });
    const b2 = beat("b2", 400, { at: 600 });
    const items = box("items", { parts: true });
    const listSlot = box("listSlot");
    const slotA = box("slotA");
    const slotB = box("slotB");
    const zeroSlot = box("zeroSlot");
    const hero = box("hero");
    const zeroFollower = box("zeroFollower");
    const flowMover = box("flowMover");

    const stage = compiled(
      scene(
        { length: 1000 },
        items.moves(stagger(travel({ to: listSlot }), { spread: 0.2 }).in(b1)),
        hero
          .moves(motion((): Pose2d => ({ scale: 1 / 3 })).in(b1))
          .moves(travel({ to: slotA }).in(b1))
          .moves(travel({ to: slotB }).take().in(b2)),
        zeroFollower
          .moves(motion((): Pose2d => ({ scale: 2 })))
          .moves(travel({ to: zeroSlot }).in(b1)),
        flowMover.moves(
          travel({ to: slotA }).in(
            beat("scrollMove", { scroll: [scrollPoint(0), scrollPoint(200)] }),
          ),
        ),
      ),
    );
    expect(stage.members.find((m) => m.name === "listSlot")?.expect).toBe("static");

    const rest = restReader({
      "items.0": { x: 0, y: 0, width: 100, height: 100 },
      "items.1": { x: 0, y: 100, width: 100, height: 100 },
      listSlot: { x: 200, y: 100, width: 100, height: 100 },
      hero: { x: 50, y: 50, width: 100, height: 100 },
      slotA: { x: 250, y: 150, width: 150, height: 150 },
      slotB: { x: 500, y: 300, width: 100, height: 100 },
      zeroFollower: { x: 20, y: 30, width: 80, height: 80 },
      zeroSlot: { x: 120, y: 130, width: 0, height: 0 },
      flowMover: withPlacement({ x: 50, y: 300, width: 100, height: 100 }, { kind: "flow" }),
    });

    // stagger delays items.1 relative to items.0 while reaching exact listSlot at b1.to.
    const staggerMid = frame(stage, { time: at(200, 1000), rest }).targets["items"];
    const p0Mid = listPose(staggerMid, 0, 2);
    const p1Mid = listPose(staggerMid, 1, 2);
    expect(p0Mid?.x ?? 0).toBeGreaterThan(p1Mid?.x ?? 0);
    const staggerEnd = frame(stage, { time: at(400, 1000), rest }).targets["items"];
    expect(listPose(staggerEnd, 1, 2)?.x).toBeCloseTo(200, 9);
    expect(listPose(staggerEnd, 1, 2)?.y).toBeCloseTo(0, 9);

    // Before b2 starts, .take() leaves hero at slotA; at b2.to, fractional prior scale settles with undefined scaleX/scaleY.
    const beforeTake = poseOf(frame(stage, { time: at(500, 1000), rest }).targets["hero"]);
    expect(beforeTake?.x).toBeCloseTo(200, 9);
    expect(beforeTake?.scaleX).toBeCloseTo(1.5, 9);
    const afterTake = poseOf(frame(stage, { time: at(1000, 1000), rest }).targets["hero"]);
    expect(afterTake?.x).toBeCloseTo(450, 9);
    expect(afterTake?.y).toBeCloseTo(250, 9);
    expect(afterTake?.scaleX).toBeUndefined();
    expect(afterTake?.scaleY).toBeUndefined();

    // 0x0 slot moves center while preserving non-identity prior scale.
    const zeroEnd = poseOf(frame(stage, { time: at(400, 1000), rest }).targets["zeroFollower"]);
    expect(zeroEnd?.x).toBeCloseTo(100, 9);
    expect(zeroEnd?.y).toBeCloseTo(100, 9);
    expect(zeroEnd?.scale).toBeCloseTo(2, 9);

    // Flow -> flow cancels shared scrollY offset cleanly.
    const flowEnd = poseOf(
      frame(stage, {
        time: at(100, 1000),
        rest,
        events: [{ name: INPUT_EVENTS.scroll, at: 50, value: 200 }],
      }).targets["flowMover"],
    );
    expect(flowEnd?.x).toBeCloseTo(200, 9);
    expect(flowEnd?.y).toBeCloseTo(-150, 9);
  });
});
