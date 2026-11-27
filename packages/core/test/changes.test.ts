import { describe, expect, it } from "vitest";
import { createStore, liveAt, state, withProbeStore, withStore } from "../src/index";
import type { Events } from "../src/index";
import { changeMetaOf, changesOf } from "../src/state/changes";

function counter() {
  return state(0, (current, event) =>
    event.name === "inc" ? current + (event.value ?? 1) : current,
  );
}

const EVENTS: Events = [
  { name: "inc", at: 100, value: 1 },
  { name: "inc", at: 300, value: 2 },
];

describe("changesOf", () => {
  it("appends to the same list in one store instead of copying it per change", () => {
    const changes = changesOf(counter(), (value) => value);
    withStore(createStore(), () => {
      const first = changes(liveAt(150), EVENTS);
      expect(first.list).toEqual([{ at: 100, to: 1 }]);
      const second = changes(liveAt(350), EVENTS);
      expect(second.list).toBe(first.list);
      expect(second.list).toEqual([
        { at: 100, to: 1 },
        { at: 300, to: 3 },
      ]);
    });
  });

  it("leaves the parent store's list alone when a probe sees a later change", () => {
    const changes = changesOf(counter(), (value) => value);
    withStore(createStore(), () => {
      const parent = changes(liveAt(150), EVENTS);
      expect(parent.list).toHaveLength(1);
      const probed = withProbeStore(() => changes(liveAt(350), EVENTS));
      expect(probed.list).toHaveLength(2);
      expect(parent.list).toHaveLength(1);
      expect(changes(liveAt(150), EVENTS).list).toHaveLength(1);
    });
  });

  it("keeps the reset id across appends and changes it on a rewind", () => {
    const changes = changesOf(counter(), (value) => value);
    withStore(createStore(), () => {
      const resetId = changeMetaOf(changes(liveAt(150), EVENTS).list)?.resetId;
      expect(changeMetaOf(changes(liveAt(350), EVENTS).list)?.resetId).toBe(resetId);
      expect(changeMetaOf(changes(liveAt(150), EVENTS).list)?.resetId).not.toBe(resetId);
    });
  });
});
