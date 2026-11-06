import { describe, expect, it } from "vitest";
import { createManualClock, type Clock } from "@motion5/core";
import { createBrowserClock, type FrameSource } from "@motion5/core/adapters/browser-clock";

function assertOrder(clock: Clock, tick: () => void) {
  const calls: string[] = [];
  let first = true;
  clock.subscribe(() => {
    calls.push("a");
    if (first) {
      first = false;
      clock.subscribe(() => {
        calls.push("c");
      });
    }
  });
  clock.subscribe(() => {
    calls.push("b");
  });
  tick();
  expect(calls).toEqual(["a", "b"]);
  calls.length = 0;
  tick();
  expect(calls).toEqual(["a", "b", "c"]);
}

describe("runner clock ordering", () => {
  it("R13 shipped clocks dispatch in subscription order and defer new listeners to the next tick", () => {
    const manual = createManualClock();
    assertOrder(manual, () => {
      manual.tick(16);
    });
    manual.dispose();
    let callback: ((time: number) => void) | undefined;
    let time = 0;
    const source: FrameSource = {
      requestFrame(listener) {
        callback = listener;
        return 1;
      },
      cancelFrame() {
        callback = undefined;
      },
    };
    const browser = createBrowserClock(source);
    assertOrder(browser, () => {
      time += 16;
      callback?.(time);
    });
    browser.dispose();
  });
});
