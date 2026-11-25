import { describe, expect, it } from "vitest";
import { Follow } from "../src/canvas/follow";
import type { FollowState } from "../src/protocol";

function inState(state: FollowState): Follow {
  const follow = new Follow();
  if (state === "idle") return follow;
  follow.command();
  if (state === "detached") follow.human();
  return follow;
}

const STATES: readonly FollowState[] = ["idle", "following", "detached"];

describe("Follow", () => {
  it("command moves idle to following and nothing else", () => {
    const after = STATES.map((state) => {
      const follow = inState(state);
      follow.command();
      return follow.snapshot();
    });
    expect(after).toEqual(["following", "following", "detached"]);
  });

  it("human moves following to detached and nothing else", () => {
    const after = STATES.map((state) => {
      const follow = inState(state);
      follow.human();
      return follow.snapshot();
    });
    expect(after).toEqual(["idle", "detached", "detached"]);
  });

  it("resume moves detached to following and says whether it did", () => {
    const after = STATES.map((state) => {
      const follow = inState(state);
      const moved = follow.resume();
      return [follow.snapshot(), moved];
    });
    expect(after).toEqual([
      ["idle", false],
      ["following", false],
      ["following", true],
    ]);
  });

  it("tells subscribers once per change and not after unsubscribing", () => {
    const follow = new Follow();
    let heard = 0;
    const stop = follow.subscribe(() => (heard += 1));
    follow.command();
    follow.command();
    expect(heard).toBe(1);
    follow.human();
    follow.human();
    expect(heard).toBe(2);
    follow.resume();
    expect(heard).toBe(3);
    stop();
    follow.human();
    expect(heard).toBe(3);
  });
});
