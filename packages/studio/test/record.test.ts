import { describe, expect, it } from "vitest";
import {
  eventLabel,
  nextTakeName,
  onlyEvents,
  recordingOf,
  sliceSince,
} from "../src/canvas/record";

describe("recording helpers", () => {
  it("names the next take after the largest one", () => {
    expect(nextTakeName([])).toBe("take-1");
    expect(nextTakeName(["hero", "take-2", "take-10", "take-x"])).toBe("take-11");
  });

  it("slices the log past its start length", () => {
    expect(sliceSince([1, 2, 3, 4], 2)).toEqual([3, 4]);
    expect(sliceSince([1, 2], 0)).toEqual([1, 2]);
    expect(sliceSince([1, 2], 5)).toEqual([]);
  });

  it("drops entries that are not events", () => {
    const click = { name: "click", at: 10, target: "cta" };
    expect(onlyEvents([click, { nope: 1 }, "x", null, { name: "scroll", at: "3" }])).toEqual([
      click,
    ]);
    expect(recordingOf([{ name: "old", at: 1 }, click, 7], 1)).toEqual([click]);
  });

  it("labels an event with its target and time", () => {
    expect(eventLabel({ name: "click", at: 120.4, target: "cta" })).toBe("click:cta @120ms");
    expect(eventLabel({ name: "scroll", at: 5 })).toBe("scroll @5ms");
  });
});
