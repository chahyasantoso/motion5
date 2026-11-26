import { aim, motion, timeAt, type Lens3d, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  object,
  poseOf,
  restReader,
  scene,
  travel,
  type Scene,
  type Stage,
} from "../src";

const at = (ms: number, length = 2000): Time =>
  timeAt({ progress: 0, clock: { kind: "timed", elapsed: 0, length } }, ms);

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const slide = (to: number) => motion((time: Time): Pose2d => ({ x: to * time.progress }));

describe("scene: sub-scenes", () => {
  it("merges another scene's elements, beats and motions onto one clock", () => {
    const enter = beat("enter", 400);
    const later = beat("later", 400, { after: enter });
    const hero = scene(box("title").moves(slide(100).in(enter)));
    const page = scene({ length: 1000 }, box("card").moves(slide(50).in(later)), hero);
    const stage = compiled(page);
    expect(stage.members.map((member) => member.name)).toEqual(["card", "title"]);
    expect(Object.keys(stage.beats).sort()).toEqual(["enter", "later"]);
    const out = frame(stage, { time: at(800, 1000) }).targets;
    expect(poseOf(out["title"])?.x).toBeCloseTo(100);
    expect(poseOf(out["card"])?.x).toBeCloseTo(50);
  });

  it("refuses motions on an element an included scene already holds", () => {
    const enter = beat("enter", 400);
    const title = box("title");
    const hero = scene(title);
    expect(() => scene(hero, title.moves(slide(80).in(enter)))).toThrow(/twice/);
  });

  it("refuses two scenes whose elements share a name, naming both", () => {
    const one = scene({ name: "one" }, box("card"));
    const two = scene({ name: "two" }, box("card"));
    expect(() => scene(one, two)).toThrow(/"card" \(box\) of scene "two" takes the name of "card"/);
  });

  it("refuses a scene that sets what only the mounted scene sets", () => {
    const hero = scene({ name: "hero", length: 900 }, box("title"));
    expect(() => scene(hero)).toThrow(/scene "hero" sets `length`/);
  });

  it("refuses a scene included twice in the same parent, while allowing reuse across scenes", () => {
    const hero = scene({ name: "hero" }, box("title"));
    expect(() => scene({ name: "page" }, hero, hero)).toThrow(/already included in "page"/);
    expect(() => scene({ name: "pageA" }, hero)).not.toThrow();
    expect(() => scene({ name: "pageB" }, hero)).not.toThrow();
  });

  it("refuses a beat that means two windows across scenes", () => {
    const hero = scene(box("a").shows(beat("enter", 400)));
    const page = scene(box("b").shows(beat("enter", 600)));
    expect(() => scene(page, hero)).toThrow(/beat "enter"/);
  });

  it("allows sibling scenes to share read-only canvas, edge, and travel slot references in either include order", () => {
    const sharedCanvas = box("canvas");
    const sharedSection = box("section");
    const sharedSlot = box("slot");
    const enter = beat("enter", 400);
    const lens: Lens3d = {
      x: 0,
      y: 0,
      z: 5,
      ...aim({ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }),
      fov: 40,
    };
    const rest = restReader({
      canvas: { x: 400, y: 300, width: 800, height: 600 },
      section: { x: 400, y: 500, width: 800, height: 1000 },
      slot: { x: 500, y: 300, width: 100, height: 100 },
    });

    // Scene 1 reads sharedCanvas via object.view, sharedSlot via 3D travel, and sharedSection via edge beat.
    const objScene = scene(
      { name: "objScene" },
      object("can", { view: { canvas: sharedCanvas, lens } }).moves(travel({ to: sharedSlot })),
      box("tag").moves(
        slide(20).in(beat("sec", { scroll: [sharedSection.top, sharedSection.end] })),
      ),
    );

    // Scene 2 owns sharedCanvas (gives it a motion!) and also reads sharedSlot and sharedSection.
    const uiScene = scene(
      { name: "uiScene" },
      sharedCanvas.moves(slide(40).in(enter)),
      box("badge").moves(
        travel({ to: sharedSlot }).in(enter),
        slide(10).in(beat("sec2", { scroll: [sharedSection.top, sharedSection.end] })),
      ),
    );

    // Order A: reader included first, then owner -> owner's Entry must not be overwritten!
    const orderA = compiled(scene({ length: 1000 }, objScene, uiScene));
    expect(poseOf(frame(orderA, { time: at(400, 1000), rest }).targets["canvas"])?.x).toBeCloseTo(
      40,
    );

    // Order B: owner included first, then reader -> reader's NO_ENTRY must not overwrite owner's Entry!
    const ownedCanvas = box("ownedCanvas");
    const readerB = scene(
      { name: "readerB" },
      object("canB", { view: { canvas: ownedCanvas, lens } }).moves(travel({ to: sharedSlot })),
    );
    const ownerB = scene({ name: "ownerB" }, ownedCanvas.moves(slide(60).in(enter)));
    const orderB = compiled(scene({ length: 1000 }, ownerB, readerB));
    expect(
      poseOf(frame(orderB, { time: at(400, 1000), rest }).targets["ownedCanvas"])?.x,
    ).toBeCloseTo(60);
  });

  it("refuses two sub-scenes in one scene that both bind the same element", () => {
    const owned = box("owned");
    const firstOwner = scene({ name: "firstOwner" }, owned);
    const secondOwner = scene({ name: "secondOwner" }, owned);
    expect(() => scene({ name: "parent" }, firstOwner, secondOwner)).toThrow(
      /owned.*firstOwner.*secondOwner/,
    );
  });
});
