import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@motion5/player";
import { NO_EVENTS } from "@motion5/moves";
import { BALL, CATCH, LAND_MS, SHOULDER, cues, durationMs, scene } from "../src/catch-scene";

function at(ms: number, events = cues) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver, { cues: events });
  driver.seek(ms / durationMs);
  return player.values;
}

describe("the catch scene", () => {
  it("lands the ball at rest exactly when the hand reaches it", () => {
    const landed = at(LAND_MS);
    expect(landed.ball.x ?? 0).toBeCloseTo(0, 6);
    expect(landed.ball.y ?? 0).toBeCloseTo(0, 6);
    expect(SHOULDER.x + landed.hand.x).toBeCloseTo(CATCH.x, 3);
    expect(SHOULDER.y + landed.hand.y).toBeCloseTo(CATCH.y, 3);
  });

  it("carries the ball with the hand after the catch", () => {
    const later = at(LAND_MS + 400);
    const hand = { x: SHOULDER.x + later.hand.x, y: SHOULDER.y + later.hand.y };
    const ball = { x: BALL.x + (later.ball.x ?? 0), y: BALL.y + (later.ball.y ?? 0) };
    expect(hand.y).toBeLessThan(CATCH.y);
    expect(ball.x - hand.x).toBeCloseTo(BALL.x - CATCH.x, 3);
    expect(ball.y - hand.y).toBeCloseTo(BALL.y - CATCH.y, 3);
  });

  it("starts the ball off the stage to the right and ends with every letter at rest", () => {
    expect(at(400).ball.x ?? 0).toBeGreaterThan(1280 - BALL.x);
    for (const letter of at(durationMs).letters) {
      expect(letter.y ?? 0).toBeCloseTo(0, 6);
      expect(letter.opacity).toBe(1);
    }
  });

  it("gives under the ball on the catch cue, from rest, and springs back", () => {
    const held = (events = cues) => at(LAND_MS + 80, events).hand.y;
    expect(held()).toBeGreaterThan(held(NO_EVENTS) + 5);
    expect(at(LAND_MS + 1500).hand.y).toBeCloseTo(at(LAND_MS + 1500, NO_EVENTS).hand.y, 1);
  });
});
