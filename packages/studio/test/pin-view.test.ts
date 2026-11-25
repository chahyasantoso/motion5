import { describe, expect, it } from "vitest";
import type { Card } from "../src/graph";
import type { Pin } from "../src/pins";
import {
  castCardNamed,
  centreOf,
  focusNames,
  rulerMs,
  rulerPercent,
  showsOnStage,
  unscalePoint,
} from "../src/canvas/pin-view";

const card = (kind: Card["kind"], name: string): Card => ({ id: `${kind}:${name}`, kind, name });

const pin = (atMs: number, preset: string): Pin => ({
  id: 1,
  piece: "reel",
  place: { kind: "moment" },
  card: undefined,
  scene: undefined,
  shot: undefined,
  file: undefined,
  part: undefined,
  viewport: { preset, safeZone: undefined },
  atMs,
  scrollY: 0,
  preset: undefined,
  pose: undefined,
  restBox: undefined,
  note: "",
  status: "open",
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("pin view helpers", () => {
  it("unscales a frame point into page px", () => {
    expect(unscalePoint({ x: 150, y: 70 }, { left: 50, top: 20 }, 0.5)).toEqual({ x: 200, y: 100 });
    expect(unscalePoint({ x: 10, y: 10 }, { left: 0, top: 0 }, 0)).toEqual({ x: 10, y: 10 });
  });

  it("shows a stage marker only within 100 ms and on the same preset", () => {
    expect(showsOnStage(pin(1000, "mobile"), 1100, "mobile")).toBe(true);
    expect(showsOnStage(pin(1000, "mobile"), 900, "mobile")).toBe(true);
    expect(showsOnStage(pin(1000, "mobile"), 1101, "mobile")).toBe(false);
    expect(showsOnStage(pin(1000, "mobile"), 1000, "desktop")).toBe(false);
  });

  it("maps ruler x to ms and back", () => {
    const box = { left: 100, width: 400 };
    expect(rulerMs(300, box, 4000, undefined)).toBe(2000);
    expect(rulerMs(310, box, 4000, 100)).toBe(2100);
    expect(rulerMs(0, box, 4000, undefined)).toBe(0);
    expect(rulerMs(900, box, 4000, undefined)).toBe(4000);
    expect(rulerMs(300, { left: 0, width: 0 }, 4000, undefined)).toBe(0);
    expect(rulerPercent(1000, 4000)).toBe(25);
    expect(rulerPercent(1000, 0)).toBe(0);
  });

  it("names the scene and shot a focus holds", () => {
    const cards = [card("shot", "hook"), card("shot", "body")];
    expect(focusNames({ kind: "all" }, cards)).toEqual({ scene: undefined, shot: undefined });
    expect(focusNames({ kind: "scene", name: "reel" }, cards)).toEqual({
      scene: "reel",
      shot: undefined,
    });
    expect(focusNames({ kind: "shot", name: "body" }, cards).shot).toBe("body");
    expect(focusNames({ kind: "shot-index", index: 1 }, cards).shot).toBe("body");
    expect(focusNames({ kind: "shot-index", index: 5 }, cards).shot).toBeUndefined();
  });

  it("finds the cast card of a name and the centre of a box", () => {
    const cards = [card("shot", "a"), card("box", "a"), card("text", "b")];
    expect(castCardNamed(cards, "a")?.kind).toBe("box");
    expect(castCardNamed(cards, "zzz")).toBeUndefined();
    expect(centreOf({ x: 10, y: 20, width: 100, height: 40 })).toEqual({ x: 60, y: 40 });
  });
});
