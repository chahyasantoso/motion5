import { describe, expect, it } from "vitest";
import { eventLog, liveAt, state, type Events } from "../src/index";
import { changeMetaOf, changesOf } from "../src/state/changes";

describe("changesOf", () => {
  it("keeps returned change lists fixed when later calls observe new changes", () => {
    const count = state(0, (current, event) =>
      event.name === "inc" ? current + (event.value ?? 1) : current,
    );
    const changes = changesOf(count, (value) => value);
    const events: Events = [
      { name: "inc", at: 100, value: 1 },
      { name: "inc", at: 300, value: 2 },
    ];

    const first = changes(liveAt(150), events);
    expect(first.list).toEqual([{ at: 100, to: 1 }]);
    const firstMeta = changeMetaOf(first.list);

    const unchanged = changes(liveAt(200), events);
    expect(unchanged.list).toBe(first.list);

    const second = changes(liveAt(350), events);
    expect(second.list).toEqual([
      { at: 100, to: 1 },
      { at: 300, to: 3 },
    ]);
    expect(first.list).toEqual([{ at: 100, to: 1 }]);
    expect(changeMetaOf(second.list)?.resetId).toBe(firstMeta?.resetId);

    const rewound = changes(liveAt(150), events);
    expect(rewound.list).toEqual([{ at: 100, to: 1 }]);
    expect(changeMetaOf(rewound.list)?.resetId).not.toBe(firstMeta?.resetId);
  });

  it("keeps returned change lists fixed across live retention compaction", () => {
    const log = eventLog({ retention: { kind: "live", windowMs: 1000 } });
    const count = state(0, (current, event) => (event.name === "inc" ? current + 1 : current));
    const changes = changesOf(count, (value) => value);

    for (let i = 1; i <= 5; i += 1) log.add({ name: "inc", at: i * 100 });
    const early = changes(liveAt(550), log.events);
    expect(early.list).toHaveLength(5);

    for (let i = 6; i <= 30; i += 1) log.add({ name: "inc", at: i * 100 });
    const later = changes(liveAt(3050), log.events);
    expect(later.list.length).toBeGreaterThan(0);
    expect(early.list).toHaveLength(5);
    expect(changeMetaOf(later.list)?.resetId).toBe(changeMetaOf(early.list)?.resetId);
    expect(changeMetaOf(later.list)?.base).toBeGreaterThan(0);
  });
});
