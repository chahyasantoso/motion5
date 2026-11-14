import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@gerak/player";
import { NO_EVENTS, liveAt } from "@gerak/moves";
import {
  CROUCH_MS,
  LAND_MS,
  LEAP_MS,
  START_X,
  WORD_MS,
  drag,
  durationMs,
  scene,
} from "../src/principles-scene";

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver);
  driver.seek(ms / durationMs);
  return player.values;
}

const MID_FLIGHT_MS = LAND_MS - 130;

describe("the principles scene", () => {
  it("crouches before it goes, squashed and still", () => {
    const crouched = at(LEAP_MS - 20);
    expect(crouched.body.scaleY ?? 1).toBeLessThan(0.7);
    expect(crouched.body.scaleX ?? 1).toBeGreaterThan(1.2);
    expect(crouched.body.x ?? 0).toBeCloseTo(START_X, 6);
    expect(crouched.body.y ?? 0).toBeCloseTo(0, 6);
    expect(at(CROUCH_MS - 20).body.scaleY ?? 1).toBeCloseTo(1, 6);
  });

  it("flies above its rest on an arc and stretches along it", () => {
    const flying = at(MID_FLIGHT_MS);
    expect(flying.body.y ?? 0).toBeLessThan(-100);
    expect(flying.stretch.rotation ?? 0).not.toBeCloseTo(0, 0);
    expect(flying.stretch.scaleX ?? 1).toBeGreaterThan(1.1);
    expect(flying.face.rotation ?? 0).toBeCloseTo(-(flying.stretch.rotation ?? 0), 6);
  });

  it("lands at rest with its scale back to 1", () => {
    const end = at(durationMs);
    expect(end.body.x ?? 0).toBeCloseTo(0, 6);
    expect(end.body.y ?? 0).toBeCloseTo(0, 6);
    expect(end.body.scaleX ?? 1).toBeCloseTo(1, 6);
    expect(end.body.scaleY ?? 1).toBeCloseTo(1, 6);
  });

  it("drags the antenna behind the body and lets it catch up", () => {
    const flying = at(MID_FLIGHT_MS);
    const pushed = drag(liveAt(MID_FLIGHT_MS), NO_EVENTS);
    expect(Math.abs(pushed)).toBeGreaterThan(5);
    expect(Math.abs((flying.antenna.rotation ?? 0) - pushed)).toBeGreaterThan(3);
    expect(at(durationMs).antenna.rotation ?? 0).toBeCloseTo(0, 1);
  });

  it("starts the word from its centre letters", () => {
    const early = at(WORD_MS + 120).letters;
    const centre = Math.min(early[2]?.opacity ?? 0, early[3]?.opacity ?? 0);
    expect(centre).toBeGreaterThan(0);
    expect(early[0]?.opacity ?? 0).toBeCloseTo(0, 6);
    expect(early[5]?.opacity ?? 0).toBeCloseTo(0, 6);
  });

  it("settles the pad and everything else by the end", () => {
    const end = at(durationMs);
    expect(end.pad.scale ?? 1).toBeCloseTo(1, 2);
    for (const letter of end.letters) {
      expect(letter.y ?? 0).toBeCloseTo(0, 6);
      expect(letter.scale ?? 1).toBeCloseTo(1, 6);
      expect(letter.opacity ?? 0).toBeCloseTo(1, 6);
    }
  });
});
