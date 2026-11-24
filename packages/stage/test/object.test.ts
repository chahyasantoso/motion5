import {
  INPUT_EVENTS,
  aim,
  liveAt,
  motion,
  orbit,
  project3d,
  scroll,
  timeAt,
  viewSize3d,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bindEach,
  box,
  check,
  compileScene,
  formatStageError,
  frame,
  listPose,
  listPose3d,
  object,
  pose3dOf,
  poseOf,
  restReader,
  scene,
  slot3d,
  stagger,
  travel,
  type Drive,
  type MotionContext,
  type Moves,
  type Scene,
  type Slot3d,
  type Stage,
} from "../src";
import { withPlacement } from "../src/render";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const turn = motion((t: Time): Pose3d => ({ rotationY: 90 * t.progress, z: -2 * t.progress }));
const lift = motion((t: Time): Pose3d => ({ y: t.progress, z: 1 }));
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));

describe("an object in a scene", () => {
  it("compiles with kind object beside a box, with no node and no content", () => {
    const stage = compiled(
      scene(
        object("cube").moves(turn.in(beat("spin", 1000))),
        box("label").moves(slide.in(beat("spin", 1000))),
      ),
    );
    const cube = stage.members.find((member) => member.name === "cube");
    expect(cube?.kind).toBe("object");
    expect(cube !== undefined && "content" in cube).toBe(false);
    expect(cube?.node).toBeUndefined();
  });

  it("answers a Pose3d, layering by each field's rule and taking with take()", () => {
    const spin = beat("spin", 1000);
    const stage = compiled(
      scene(
        object("cube").moves(turn.in(spin), lift.in(spin)),
        object("taken").moves(turn.in(spin), lift.in(beat("late", 400, { at: 600 })).take()),
      ),
    );
    const at500 = frame(stage, { time: liveAt(500) }).targets;
    expect(poseOf(at500["cube"])).toEqual({ rotationY: 45, z: 0, y: 0.5 });
    expect(poseOf(at500["taken"])).toEqual({ rotationY: 45, z: -1 });
    const at800 = frame(stage, { time: liveAt(800) }).targets;
    expect(poseOf(at800["taken"])).toEqual({ rotationY: 72, z: 1, y: 0.5 });
    expect(check(stage, at800)).toEqual([]);
  });

  it("shows only in its .show windows", () => {
    const stage = compiled(
      scene(
        { length: 2000 },
        object("cube")
          .moves(turn.in(beat("spin", 1000)))
          .shows(beat("spin", 1000)),
      ),
    );
    expect(frame(stage, { time: liveAt(500) }).visible["cube"]).toBe(true);
    expect(frame(stage, { time: liveAt(1500) }).visible["cube"]).toBe(false);
  });

  it("needs no node in a page scene", () => {
    const result = compileScene(
      scene(
        object("cube").moves(turn.in(beat("spin", 1000))),
        box("label").moves(slide.in(beat("spin", 1000))),
      ),
    );
    expect(result.ok).toBe(true);
  });

  it("refuses a 2D motion on an object and a 3D motion on a box, in types and at run time", () => {
    const cube = object("cube");
    // @ts-expect-error: an object takes 3D motions.
    cube.moves(slide);
    // @ts-expect-error: a box takes 2D motions.
    scene(box("label").moves(turn));
    expect(() => scene(cube.moves(turn))).not.toThrow();
  });

  it("types a plain function motion on an object from its context", () => {
    const stage = compiled(
      scene(
        { length: 1000 },
        object("cube").moves((time, context) => ({ y: time.progress + context.events.length })),
      ),
    );
    expect(pose3dOf(frame(stage, { time: liveAt(0) }).targets["cube"])).toEqual({ y: 0 });
  });

  it("refuses a read of an object's pose from an element", () => {
    const stage = compiled(
      scene(
        object("cube").moves(turn.in(beat("spin", 1000))),
        box("label").moves((_t, context) => ({ x: context.read("cube").x ?? 0 })),
      ),
    );
    expect(() => frame(stage, { time: liveAt(100) })).toThrow(/is an object; its pose is 3D/);
  });
});

describe("travel on an object", () => {
  const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 8, azimuth: 20, elevation: 10 });
  const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };
  const canvas = box("gl");
  const slot = box("slot");
  // The canvas fills an 800x600 viewport; the slot sits right of centre and low.
  const rest = restReader({
    gl: { x: 400, y: 300, width: 800, height: 600 },
    slot: { x: 620, y: 450, width: 80, height: 80 },
  });
  const go = beat("go", 1000);
  const start = motion((): Pose3d => ({ x: 0.5, y: 0.2, z: -0.4 }));

  it("lands on the slot's centre as the lens sees it, at the depth it starts from", () => {
    const stage = compiled(
      scene(object("drink", { view: { canvas, lens } }).moves(start, travel({ to: slot }).in(go))),
    );
    const size = { width: 800, height: 600 };
    const from = project3d({ x: 0.5, y: 0.2, z: -0.4 }, lens, size);
    const landed = pose3dOf(frame(stage, { time: liveAt(1000), rest }).targets["drink"]);
    const seen = project3d(
      { x: landed?.x ?? NaN, y: landed?.y ?? NaN, z: landed?.z ?? NaN },
      lens,
      size,
    );
    expect(seen.x).toBeCloseTo(620, 6);
    expect(seen.y).toBeCloseTo(450, 6);
    expect(seen.depth).toBeCloseTo(from.depth, 6);
    const half = pose3dOf(frame(stage, { time: liveAt(500), rest }).targets["drink"]);
    expect(half?.x).toBeCloseTo((0.5 + (landed?.x ?? NaN)) / 2, 9);
  });

  it("sits on its slot with no window across live, timed, and untimed clocks", () => {
    const ownCanvas = box("gl");
    const ownSlot = box("slot");
    const stage = compiled(
      scene(
        { length: 1000 },
        object("drink", { view: { canvas: ownCanvas, lens } }).moves(
          start,
          travel({ to: ownSlot }),
        ),
      ),
    );
    const size = { width: 800, height: 600 };
    const from = project3d({ x: 0.5, y: 0.2, z: -0.4 }, lens, size);
    for (const ms of [0, 500, 1000]) {
      const clocks: readonly Time[] = [
        liveAt(ms),
        { progress: ms / 1000, clock: { kind: "timed", elapsed: ms, length: 1000 } },
        { progress: ms / 1000, clock: { kind: "untimed" } },
      ];
      for (const time of clocks) {
        const landed = pose3dOf(frame(stage, { time, rest }).targets["drink"]);
        const seen = project3d(
          { x: landed?.x ?? NaN, y: landed?.y ?? NaN, z: landed?.z ?? NaN },
          lens,
          size,
        );
        expect(seen.x).toBeCloseTo(620, 6);
        expect(seen.y).toBeCloseTo(450, 6);
        expect(seen.depth).toBeCloseTo(from.depth, 6);
      }
    }
  });

  it("refuses a travel on an object with no view, an arc, fit fill, and a take, while allowing fit none and contain", () => {
    expect(() => scene(object("bare").moves(travel({ to: slot }).in(go)))).toThrow(
      /travels only with/,
    );
    expect(() =>
      scene(object("bent", { view: { canvas, lens } }).moves(travel({ to: slot, arc: 40 }).in(go))),
    ).toThrow(/travels straight/);
    expect(() =>
      scene(
        object("filled", { view: { canvas, lens } }).moves(
          travel({ to: slot, fit: "fill" }).in(go),
        ),
      ),
    ).toThrow(/fit/);
    expect(() =>
      scene(object("taking", { view: { canvas, lens } }).moves(travel({ to: slot }).in(go).take())),
    ).toThrow(/travels as a layer/);
    expect(() =>
      scene(
        object("noneOk", { view: { canvas, lens } }).moves(
          travel({ to: slot, fit: "none" }).in(go),
        ),
      ),
    ).not.toThrow();
  });

  it("scales uniformly to contain the CSS slot at desktop and mobile sizes when fit is contain", () => {
    const objCanvas = box("gl");
    const objSlot = box("slot");
    const fitScene = compiled(
      scene(
        { length: 1000 },
        object("can", { view: { canvas: objCanvas, lens } }).moves(
          motion((): Pose3d => ({ x: 0.5, y: 0.2, z: -0.4, scale: 0.5 })),
          travel({ to: objSlot, fit: "contain" }).in(beat("move", 1000)),
        ),
      ),
    );
    const bounds = { width: 1.2, height: 2.4, depth: 1.2 };
    const startDepth = project3d({ x: 0.5, y: 0.2, z: -0.4 }, lens, {
      width: 1440,
      height: 900,
    }).depth;

    for (const [vpW, vpH, slotW, slotH] of [
      [1440, 900, 320, 480],
      [390, 844, 180, 220],
    ] as const) {
      const r = restReader(
        {
          gl: { x: vpW / 2, y: vpH / 2, width: vpW, height: vpH },
          slot: { x: vpW * 0.65, y: vpH * 0.45, width: slotW, height: slotH },
        },
        { can: bounds },
      );
      const u = viewSize3d(lens, { width: vpW, height: vpH }, startDepth).unitsPerPx;
      const expectedScale = Math.min((slotW * u) / bounds.width, (slotH * u) / bounds.height);
      const end = pose3dOf(frame(fitScene, { time: liveAt(1000), rest: r }).targets["can"]);
      expect(end?.scale).toBeCloseTo(expectedScale, 6);
      const mid = pose3dOf(frame(fitScene, { time: liveAt(500), rest: r }).targets["can"]);
      expect(mid?.scale).toBeCloseTo((0.5 + expectedScale) / 2, 6);
    }

    // Without measured object bounds, fit contain gracefully moves position without setting scale.
    const unmeasured = pose3dOf(frame(fitScene, { time: liveAt(1000), rest }).targets["can"]);
    expect(unmeasured?.scale).toBe(0.5);

    // fit: "none" preserves prior scale and per-axis scales even when measured bounds exist.
    const keepScaleScene = compiled(
      scene(
        { length: 1000 },
        object("can", { view: { canvas: objCanvas, lens } }).moves(
          motion((): Pose3d => ({ scale: 2, scaleX: 1.5, scaleY: 0.75, scaleZ: 0.5 })),
          travel({ to: objSlot, fit: "none" }).in(beat("move", 1000)),
        ),
      ),
    );
    const rDesk = restReader(
      {
        gl: { x: 720, y: 450, width: 1440, height: 900 },
        slot: { x: 900, y: 400, width: 320, height: 480 },
      },
      { can: bounds },
    );
    const keepPose = pose3dOf(
      frame(keepScaleScene, { time: liveAt(1000), rest: rDesk }).targets["can"],
    );
    expect(keepPose?.scale).toBe(2);
    expect(keepPose?.scaleX).toBe(1.5);
    expect(keepPose?.scaleY).toBe(0.75);
    expect(keepPose?.scaleZ).toBe(0.5);

    // fit: "contain" folds prior uniform and per-axis scales cleanly without dropping or double-applying scale.
    const axisContainScene = compiled(
      scene(
        { length: 1000 },
        object("can", { view: { canvas: objCanvas, lens } }).moves(
          motion((): Pose3d => ({ scale: 2, scaleX: 1.5, scaleY: 0.5 })),
          travel({ to: objSlot, fit: "contain" }).in(beat("move", 1000)),
        ),
      ),
    );
    const axisStartDepth = project3d({ x: 0, y: 0, z: 0 }, lens, {
      width: 1440,
      height: 900,
    }).depth;
    const toScaleAxis = Math.min(
      (320 * viewSize3d(lens, { width: 1440, height: 900 }, axisStartDepth).unitsPerPx) /
        bounds.width,
      (480 * viewSize3d(lens, { width: 1440, height: 900 }, axisStartDepth).unitsPerPx) /
        bounds.height,
    );
    const midAxis = pose3dOf(
      frame(axisContainScene, { time: liveAt(500), rest: rDesk }).targets["can"],
    );
    expect(midAxis?.scale).toBeUndefined();
    expect(midAxis?.scaleX).toBeCloseTo((3 + toScaleAxis) / 2, 6);
    expect(midAxis?.scaleY).toBeCloseTo((1 + toScaleAxis) / 2, 6);
    expect(midAxis?.scaleZ).toBeCloseTo((2 + toScaleAxis) / 2, 6);
    const endAxis = pose3dOf(
      frame(axisContainScene, { time: liveAt(1000), rest: rDesk }).targets["can"],
    );
    expect(endAxis?.scale).toBeUndefined();
    expect(endAxis?.scaleX).toBeCloseTo(toScaleAxis, 6);
    expect(endAxis?.scaleY).toBeCloseTo(toScaleAxis, 6);
    expect(endAxis?.scaleZ).toBeCloseTo(toScaleAxis, 6);
  });
});

describe("3D list objects", () => {
  const spin = beat("spin", 1000);
  const rise3d = motion((t: Time): Pose3d => ({ z: 2 * t.progress, rotationY: 90 * t.progress }));

  it("compiles object(..., { parts: true }), distinguishes signature, returns ListPose3d, and checks parts", () => {
    const single = compiled(scene({ length: 1000 }, object("cookies").moves(rise3d)));
    const stage = compiled(
      scene(
        { length: 1000 },
        object("cookies", { parts: true }).moves(stagger(rise3d, { spread: 1 }).in(spin)),
      ),
    );
    const member = stage.members.find((m) => m.name === "cookies");
    expect(member?.kind).toBe("object");
    expect(member?.kind === "object" && member.parts).toBe(true);
    expect(stage.signature).not.toBe(single.signature);

    const out = frame(stage, { time: liveAt(500), counts: { cookies: 3 } });
    expect([0, 1, 2].map((i) => listPose3d(out.targets["cookies"], i, 3)?.z)).toEqual([2, 1, 0]);
    expect(check(stage, out.targets, { cookies: 3 })).toEqual([]);
    expect(check(stage, { cookies: [{ z: 1 }] }, { cookies: 3 }).map(formatStageError)).toContain(
      'scene: "cookies" is a list: give it `(index, count) => pose`, got an array.',
    );
    expect(
      check(stage, { cookies: (i: number) => (i === 1 ? 7 : {}) }, { cookies: 3 }).map(
        formatStageError,
      ),
    ).toContain('scene: "cookies" answered no pose object for item 1.');
  });

  it("supports stagger factories and bindEach over shared and 3D-only fields while rejecting crossed dimensions", () => {
    const stage = compiled(
      scene(
        { length: 1000 },
        object("chips", { parts: true }).moves(
          stagger(
            (i, count) =>
              motion((t: Time): Pose3d => ({ z: (i + 1) * t.progress, rotationX: count * 10 })),
            { spread: 0.5, from: "center" },
          ).in(spin),
        ),
        object("bound3d", { parts: true }).moves(
          bindEach({
            x: (i) => () => i * 2,
            z: (i) => (t) => -i + scroll.y(t, []),
            rotationY: (i) => () => i * 15,
            scaleZ: () => () => 0.5,
          }),
        ),
        box("boundSharedOn2d", { parts: true }).moves(
          bindEach({ x: (i) => () => i * 10, scale: () => () => 2 }),
        ),
        object("boundSharedOn3d", { parts: true }).moves(
          bindEach({ x: (i) => () => i * 0.5, scale: () => () => 1.5 }),
        ),
      ),
    );

    // @ts-expect-error z is 3D-only and refused on a box
    box("bad2d", { parts: true }).moves(bindEach({ z: () => () => 1 }));
    // @ts-expect-error drawn is 2D-only and refused on an object
    object("bad3d", { parts: true }).moves(bindEach({ drawn: () => () => 0.5 }));

    const out = frame(stage, {
      time: liveAt(500),
      counts: { chips: 3, bound3d: 2, boundSharedOn2d: 2, boundSharedOn3d: 2 },
    });
    const center = listPose3d(out.targets["chips"], 1, 3);
    const edge = listPose3d(out.targets["chips"], 0, 3);
    expect(center?.z ?? 0).toBeGreaterThan(0);
    expect(edge?.rotationX).toBe(30);
    expect(listPose3d(out.targets["bound3d"], 1, 2)).toEqual({
      x: 2,
      z: -1,
      rotationY: 15,
      scaleZ: 0.5,
    });
    expect(listPose(out.targets["boundSharedOn2d"], 1, 2)).toEqual({ x: 10, scale: 2 });
    expect(listPose3d(out.targets["boundSharedOn3d"], 1, 2)).toEqual({ x: 0.5, scale: 1.5 });
  });

  it("travels each 3D list part with fit contain using per-part rest bounds and falling back to parent bounds", () => {
    const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 8, azimuth: 0, elevation: 0 });
    const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };
    const gl = box("gl");
    const slot = box("slot");
    const stage = compiled(
      scene(
        { length: 1000 },
        object("tray", { parts: true, view: { canvas: gl, lens } }).moves(
          travel({ to: slot, fit: "contain" }).in(spin),
        ),
      ),
    );
    const rest = restReader(
      {
        gl: { x: 500, y: 300, width: 1000, height: 600 },
        slot: { x: 700, y: 300, width: 200, height: 200 },
      },
      {
        tray: { width: 2, height: 2, depth: 2 },
        "tray.0": { width: 1, height: 1, depth: 1 },
      },
    );
    const targets = frame(stage, { time: liveAt(1000), rest, counts: { tray: 2 } }).targets;
    const p0 = listPose3d(targets["tray"], 0, 2);
    const p1 = listPose3d(targets["tray"], 1, 2);
    expect((p0?.scale ?? 0) / (p1?.scale ?? 1)).toBeCloseTo(2, 6);
  });
});

describe("context.read(object)", () => {
  it("reads an object's Pose3d from another object at current and offset times", () => {
    const leader = object("leader");
    const follower = object("follower");
    const spin = beat("spin", 1000);
    const stage = compiled(
      scene(
        { length: 1000 },
        leader.moves(
          motion(
            (t: Time): Pose3d => ({
              x: 2 * t.progress,
              y: 1 + t.progress,
              z: -t.progress,
              rotationY: 90 * t.progress,
              scale: 1 + t.progress,
            }),
          ).in(spin),
        ),
        follower.moves((_t, context) => {
          const now = context.read(leader);
          const earlier = context.read(leader, { time: timeAt(context.time, 250) });
          return {
            x: (now.x ?? 0) + 10,
            y: earlier.y ?? 0,
            z: now.z ?? 0,
            rotationY: now.rotationY ?? 0,
            scale: earlier.scale ?? 1,
          };
        }),
      ),
    );

    const moves = new Map<string, Moves>();
    const drives = new Map<string, Drive>();
    const out = frame(stage, { time: liveAt(500), moves, drives });
    expect(pose3dOf(out.targets["follower"])).toEqual({
      x: 11,
      y: 1.25,
      z: -0.5,
      rotationY: 45,
      scale: 1.25,
    });
    expect(moves.get("follower")).toBe("time");
    expect(drives.get("follower")).toEqual({ kind: "more" });
  });

  it("lets a 2D label read an object's Pose3d and project it with project3d", () => {
    const eye = { x: 0, y: 0, z: 6 };
    const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };
    const orb = object("orb");
    const label = box("label");
    const stage = compiled(
      scene(
        { length: 1000 },
        orb.moves(
          motion((t: Time): Pose3d => ({ x: t.progress * 1.2, y: 0.4, z: 0 })).in(beat("go", 1000)),
        ),
        label.moves((_t, context) => {
          const pose = context.read(orb);
          const pt = project3d({ x: pose.x ?? 0, y: pose.y ?? 0, z: pose.z ?? 0 }, lens, {
            width: 800,
            height: 600,
          });
          return { x: pt.x, y: pt.y, opacity: pt.visible ? 1 : 0 };
        }),
      ),
    );

    const expected = project3d({ x: 0.6, y: 0.4, z: 0 }, lens, { width: 800, height: 600 });
    const out = frame(stage, { time: liveAt(500) });
    expect(poseOf(out.targets["label"])).toEqual({
      x: expected.x,
      y: expected.y,
      opacity: 1,
    });
  });

  it("reads a 3D list part by index and count, including an earlier part of the same list", () => {
    const cookies = object("cookies", { parts: true });
    const marker = box("marker");
    const go = beat("go", 1000);
    const stage = compiled(
      scene(
        { length: 1000 },
        cookies.moves(
          motion((t: Time, context?: MotionContext): Pose3d => {
            const index = context?.index ?? 0;
            if (index === 0) return { x: t.progress, y: 1, scale: 1.5 };
            const prev = context?.read(cookies, { index: index - 1, count: context.count ?? 2 });
            return { x: (prev?.x ?? 0) + 0.5, y: prev?.y ?? 0, scale: prev?.scale ?? 1 };
          }).in(go),
        ),
        marker.moves((_t, context) => {
          const part1 = context.read(cookies, { index: 1, count: 2 });
          return { x: (part1.x ?? 0) * 100, y: (part1.scale ?? 0) * 10 };
        }),
      ),
    );

    const out = frame(stage, { time: liveAt(500), counts: { cookies: 2 } });
    expect(listPose3d(out.targets["cookies"], 1, 2)).toEqual({ x: 1, y: 1, scale: 1.5 });
    expect(poseOf(out.targets["marker"])).toEqual({ x: 100, y: 15 });
  });

  it("refuses mismatched kinds and unknown targets with RangeError", () => {
    const wrongKindBox = compiled(
      scene(
        { length: 1000 },
        object("orb").moves(() => ({ x: 1 })),
        box("caller").moves((_t, context) => ({ x: context.read(box("orb")).x ?? 0 })),
      ),
    );
    expect(() => frame(wrongKindBox, { time: liveAt(100) })).toThrow(RangeError);
    expect(() => frame(wrongKindBox, { time: liveAt(100) })).toThrow(
      /is an object; its pose is 3D/,
    );

    const wrongKindObj = compiled(
      scene(
        { length: 1000 },
        box("card").moves(() => ({ x: 1 })),
        object("caller").moves((_t, context) => ({ x: context.read(object("card")).x ?? 0 })),
      ),
    );
    expect(() => frame(wrongKindObj, { time: liveAt(100) })).toThrow(RangeError);
    expect(() => frame(wrongKindObj, { time: liveAt(100) })).toThrow(
      /is not an object; its pose is 2D/,
    );

    const missing = compiled(
      scene(
        { length: 1000 },
        object("caller").moves((_t, context) => ({ x: context.read(object("ghost")).x ?? 0 })),
      ),
    );
    expect(() => frame(missing, { time: liveAt(100) })).toThrow(RangeError);
    expect(() => frame(missing, { time: liveAt(100) })).toThrow(/is not an element/);
  });

  it("refuses 3D-3D, 2D-3D, self-read, and list-part mutual read cycles", () => {
    const a = object("a");
    const b = object("b");
    const cycle3d = compiled(
      scene(
        { length: 1000 },
        a.moves((_t, ctx) => ({ x: (ctx.read(b).x ?? 0) + 1 })),
        b.moves((_t, ctx) => ({ x: (ctx.read(a).x ?? 0) + 1 })),
      ),
    );
    expect(() => frame(cycle3d, { time: liveAt(100) })).toThrow(RangeError);
    expect(() => frame(cycle3d, { time: liveAt(100) })).toThrow(/loop|cycle|reads itself/i);

    const flat = box("flat");
    const mesh = object("mesh");
    const cycleMixed = compiled(
      scene(
        { length: 1000 },
        flat.moves((_t, ctx) => ({ x: ctx.read(mesh).x ?? 0 })),
        mesh.moves((_t, ctx) => ({ x: ctx.read(flat).x ?? 0 })),
      ),
    );
    expect(() => frame(cycleMixed, { time: liveAt(100) })).toThrow(RangeError);

    const self = object("self");
    const selfRead = compiled(
      scene(
        { length: 1000 },
        self.moves((_t, ctx) => ({ x: ctx.read(self, { time: timeAt(ctx.time, 0) }).x ?? 0 })),
      ),
    );
    expect(() => frame(selfRead, { time: liveAt(100) })).toThrow(RangeError);

    const ring = object("ring", { parts: true });
    const listCycle = compiled(
      scene(
        { length: 1000 },
        ring.moves((_t, ctx) => {
          const i = ctx.index ?? 0;
          const other = i === 0 ? 1 : 0;
          return { x: ctx.read(ring, { index: other, count: 2 }).x ?? 0 };
        }),
      ),
    );
    expect(() =>
      listPose3d(
        frame(listCycle, { time: liveAt(100), counts: { ring: 2 } }).targets["ring"],
        0,
        2,
      ),
    ).toThrow(RangeError);
  });

  it("propagates maybe moves and more drives when reading a static object", () => {
    const anchor = object("anchor");
    const follower = object("follower");
    const stage = compiled(
      scene(
        { length: 1000 },
        anchor,
        follower.moves((_t, ctx) => ({ x: ctx.read(anchor).x ?? 0 })),
      ),
    );
    const moves = new Map<string, Moves>();
    const drives = new Map<string, Drive>();
    frame(stage, { time: liveAt(200), moves, drives });
    expect(moves.get("follower")).toBe("maybe");
    expect(drives.get("follower")).toEqual({ kind: "more" });
  });
});

describe("slot3d", () => {
  const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 8, azimuth: 20, elevation: 10 });
  const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0, z: 0 }), fov: 40 };
  const canvas = box("gl");
  const view = { canvas, lens };

  it("matches travel({ fit: 'contain' }) across flow, fixed, and sticky placements", () => {
    const flowSlot = box("flowSlot");
    const fixedSlot = box("fixedSlot");
    const stickySlot = box("stickySlot");
    const results: {
      flow?: Slot3d | undefined;
      fixed?: Slot3d | undefined;
      sticky?: Slot3d | undefined;
      stickyPinned?: Slot3d | undefined;
      noneFit?: Slot3d | undefined;
    } = {};

    const travelled = object("travelled", { view });
    const probed = object("probed");
    const stage = compiled(
      scene(
        { length: 1000 },
        flowSlot,
        fixedSlot,
        stickySlot,
        canvas,
        travelled.moves(travel({ to: stickySlot, fit: "contain" })),
        probed.moves((_t, ctx) => {
          results.flow = slot3d(flowSlot, view, ctx, { fit: "contain" });
          results.fixed = slot3d(fixedSlot, view, ctx, { fit: "contain" });
          results.sticky = slot3d(stickySlot, view, ctx, { fit: "contain" });
          results.stickyPinned = slot3d(stickySlot, view, ctx, {
            fit: "contain",
            scrollY: 100,
          });
          results.noneFit = slot3d(stickySlot, view, ctx);
          return results.sticky ? { ...results.sticky.center, scale: results.sticky.scale } : {};
        }),
      ),
    );

    const bounds = { width: 1.2, height: 2.4, depth: 1.2 };
    const rest = restReader(
      {
        gl: withPlacement({ x: 720, y: 450, width: 1440, height: 900 }, { kind: "fixed" }),
        flowSlot: withPlacement({ x: 360, y: 920, width: 220, height: 320 }, { kind: "flow" }),
        fixedSlot: withPlacement({ x: 1100, y: 240, width: 180, height: 260 }, { kind: "fixed" }),
        stickySlot: withPlacement(
          { x: 980, y: 560, width: 320, height: 480 },
          { kind: "sticky", minY: 100, maxY: 800, pinY: 420 },
        ),
      },
      { travelled: bounds, probed: bounds },
    );

    for (const scrollY of [0, 450, 950]) {
      const out = frame(stage, {
        time: liveAt(500),
        rest,
        events: [{ name: INPUT_EVENTS.scroll, at: 0, value: scrollY }],
      });
      const travelPose = pose3dOf(out.targets["travelled"]);
      expect(results.sticky).toBeDefined();
      expect(results.sticky?.center.x).toBeCloseTo(travelPose?.x ?? NaN, 9);
      expect(results.sticky?.center.y).toBeCloseTo(travelPose?.y ?? NaN, 9);
      expect(results.sticky?.center.z).toBeCloseTo(travelPose?.z ?? NaN, 9);
      expect(results.sticky?.scale).toBeCloseTo(travelPose?.scale ?? NaN, 9);
      const expectedDepth = project3d({ x: 0, y: 0, z: 0 }, lens, {
        width: 1440,
        height: 900,
      }).depth;
      const expectedView = viewSize3d(lens, { width: 1440, height: 900 }, expectedDepth);
      expect(results.sticky?.width).toBeCloseTo(320 * expectedView.unitsPerPx, 9);
      expect(results.sticky?.height).toBeCloseTo(480 * expectedView.unitsPerPx, 9);
      expect(results.flow?.view).toEqual(expectedView);
      expect(results.fixed?.center.y).toBeGreaterThan(0);
      expect(results.noneFit?.scale).toBe(1);
    }

    frame(stage, {
      time: liveAt(500),
      rest,
      events: [{ name: INPUT_EVENTS.scroll, at: 0, value: 0 }],
    });
    expect(results.sticky?.center.y).not.toBeCloseTo(results.stickyPinned?.center.y ?? 0, 2);
  });

  it("handles explicit depth, per-part bounds, missing rests, behind-lens, and invalid arguments", () => {
    const slot = box("slot");
    const localCanvas = box("gl");
    const localView = { canvas: localCanvas, lens };
    let unmeasured: Slot3d | undefined = undefined;
    let unmeasuredScale: Slot3d | undefined = undefined;
    let shallow: Slot3d | undefined = undefined;
    let behindLens: Slot3d | undefined = undefined;
    let part0Scale = 0;
    let part1Scale = 0;
    let capturedCtx: MotionContext | undefined;

    const listObj = object("listObj", { parts: true });
    const stage = compiled(
      scene(
        { length: 1000 },
        slot,
        localCanvas,
        listObj.moves((_t, ctx) => {
          capturedCtx = ctx;
          const res = slot3d(slot, localView, ctx, { fit: "contain" });
          if (ctx.index === 0) part0Scale = res?.scale ?? -1;
          else part1Scale = res?.scale ?? -1;
          return res ? { ...res.center, scale: res.scale } : {};
        }),
      ),
    );

    const restUnmeasured = restReader({ gl: { x: 400, y: 300, width: 800, height: 600 } });
    const outUnmeasured = frame(stage, {
      time: liveAt(0),
      rest: restUnmeasured,
      counts: { listObj: 1 },
    });
    listPose3d(outUnmeasured.targets["listObj"], 0, 1);
    if (capturedCtx === undefined) throw new Error("expected captured context");
    unmeasured = slot3d(slot, localView, capturedCtx);
    expect(unmeasured).toBeUndefined();

    const restNoObj = restReader({
      gl: { x: 400, y: 300, width: 800, height: 600 },
      slot: { x: 400, y: 300, width: 200, height: 200 },
    });
    const outNoObj = frame(stage, { time: liveAt(0), rest: restNoObj, counts: { listObj: 1 } });
    listPose3d(outNoObj.targets["listObj"], 0, 1);
    unmeasuredScale = slot3d(slot, localView, capturedCtx, { fit: "contain" });
    expect(unmeasuredScale?.scale).toBe(1);

    const restParts = restReader(
      {
        gl: { x: 500, y: 300, width: 1000, height: 600 },
        slot: { x: 700, y: 300, width: 200, height: 200 },
      },
      {
        listObj: { width: 2, height: 2, depth: 2 },
        "listObj.0": { width: 1, height: 1, depth: 1 },
      },
    );
    const outParts = frame(stage, { time: liveAt(0), rest: restParts, counts: { listObj: 2 } });
    listPose3d(outParts.targets["listObj"], 0, 2);
    listPose3d(outParts.targets["listObj"], 1, 2);
    expect(part0Scale / part1Scale).toBeCloseTo(2, 6);

    shallow = slot3d(slot, localView, capturedCtx, { depth: 0 });
    expect(shallow).toBeUndefined();

    const behindView = {
      canvas: localCanvas,
      lens: { x: 0, y: 0, z: -5, rotationY: 0, fov: 40 },
    };
    behindLens = slot3d(slot, behindView, capturedCtx);
    expect(behindLens).toBeUndefined();

    const ctx = capturedCtx;
    expect(() => slot3d(slot, localView, ctx, { depth: Number.NaN })).toThrow(RangeError);
    expect(() => slot3d(slot, localView, ctx, { scrollY: Number.POSITIVE_INFINITY })).toThrow(
      RangeError,
    );
    expect(() => {
      // @ts-expect-error slot must be an Element
      slot3d(listObj, localView, ctx);
    }).toThrow(TypeError);
    expect(() => {
      // @ts-expect-error fit "fill" is refused by slot3d
      slot3d(slot, localView, ctx, { fit: "fill" });
    }).toThrow(TypeError);
  });
});
