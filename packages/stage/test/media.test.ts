import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  mediaMs,
  scene,
  shot,
  type Member,
  type Scene,
  type Stage,
} from "../src";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

function memberOf(stage: Stage, name: string): Member {
  const found = stage.members.find((member) => member.name === name);
  if (found === undefined) throw new Error(`missing member "${name}"`);
  return found;
}

describe("box media option", () => {
  it("carries media: true onto the compiled actor member and omits it otherwise", () => {
    const stage = compiled(scene({ length: 1000 }, box("clip", { media: true }), box("card")));
    const clip = memberOf(stage, "clip");
    const card = memberOf(stage, "card");
    expect(clip.kind).toBe("actor");
    expect(clip.kind === "actor" ? clip.media : undefined).toBe(true);
    expect(card.kind).toBe("actor");
    expect(card.kind === "actor" ? card.media : undefined).toBeUndefined();
    expect("media" in card).toBe(false);
  });

  it("refuses media together with parts: true", () => {
    expect(() => scene(box("clip", { parts: true, media: true }))).toThrow(
      /media.*parts|parts.*media/,
    );
  });
});

describe("mediaMs", () => {
  it("returns max(0, ms) when the member has no window", () => {
    const stage = compiled(scene({ length: 1000 }, box("clip", { media: true })));
    const clip = memberOf(stage, "clip");
    expect(mediaMs(clip, -50)).toBe(0);
    expect(mediaMs(clip, 0)).toBe(0);
    expect(mediaMs(clip, 450)).toBe(450);
    expect(mediaMs(clip, 1500)).toBe(1500);
  });

  it("returns 0 before the window opens, ms - from inside, and keeps counting after it closes", () => {
    const show = beat("show", 500, { at: 400 });
    const stage = compiled(scene({ length: 1500 }, box("clip", { media: true }).shows(show)));
    const clip = memberOf(stage, "clip");
    expect(mediaMs(clip, 200)).toBe(0);
    expect(mediaMs(clip, 400)).toBe(0);
    expect(mediaMs(clip, 650)).toBe(250);
    expect(mediaMs(clip, 1200)).toBe(800);
  });

  it("uses the earliest window start even when shows windows are written out of order", () => {
    const early = beat("early", 300, { at: 200 });
    const late = beat("late", 300, { at: 800 });
    const stage = compiled(
      scene({ length: 1200 }, box("clip", { media: true }).shows(late, early)),
    );
    const clip = memberOf(stage, "clip");
    expect(mediaMs(clip, 150)).toBe(0);
    expect(mediaMs(clip, 500)).toBe(300);
  });

  it("starts at 0 when a shot opens at 600 ms and counts up inside the shot", () => {
    const intro = scene({ name: "intro" }, box("title"));
    const demo = scene({ name: "demo" }, box("clip", { media: true }));
    const stage = compiled(scene(shot(intro, { length: 600 }), shot(demo, { length: 800 })));
    const clip = memberOf(stage, "clip");
    expect(mediaMs(clip, 300)).toBe(0);
    expect(mediaMs(clip, 600)).toBe(0);
    expect(mediaMs(clip, 1000)).toBe(400);
  });
});
