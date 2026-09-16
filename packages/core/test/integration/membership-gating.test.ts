import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
  freeTracks: [{ id: "cursor" }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("GraphRuntime membership", () => {
  it("publishes the attached nodes a tick seeds, and answers a named list as named", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    expect(runtime.memberCount).toBe(0);

    // Where the gate is, measured rather than assumed. `GraphPublisher.flush` publishes every node
    // its seeds reach and consults `members` at one place only, to decide whether to pull an
    // unpublished upstream source in, so a caller that names a non-member is answered a patch for
    // it. Membership gates the seed list, and `flush`'s member-set default was that gate for a
    // caller who named none. With the default gone the tick path is the only caller that asks for
    // every member, so the gate is read from the clock here. Issue #371's follow-up.
    clock.tick();
    expect(runtime.registry.get("hero/arm")).toBeUndefined();

    runtime.attach("hero/arm");
    expect(runtime.memberCount).toBe(1);
    clock.tick();
    expect(runtime.registry.get("hero/arm")?.values).toEqual({ node: "hero/arm" });

    // And a stated list is the one the batch reports, unfiltered: `beginBatch` is handed the seeds
    // themselves, so membership never rewrites what a caller asked for.
    expect(runtime.flush(["hero/arm"]).seeds).toEqual(["hero/arm"]);

    runtime.detach("hero/arm");
    expect(runtime.memberCount).toBe(0);
    runtime.dispose();
  });

  it("separates the seed list from the clock transition, and keeps one name per operation", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    runtime.attach("hero/arm");

    // Issue #374. `flush(seeds, tick?)` carried two operations behind one name: publish, and
    // publish while advancing and validating `#lastTick`. An optional parameter is the weakest
    // possible statement of which of the two a caller meant, and the clock-owning one was the one
    // reachable by accident. `flush(seeds)` states its seeds and nothing else, `flushAtTick(seeds,
    // tick)` states both and makes the clock transition mandatory rather than optional, and one
    // private owns the publication machinery the two of them share.
    //
    // Read through a cast rather than through the declarations, so the red this commit is pushed
    // for is a failing assertion in a real run rather than a compile error that never gets to run.
    // `Function.length` counts the parameters before the first one carrying a default, so it reads
    // 2 for a flush that also accepts the clock's frame number and 1 once it cannot.
    const api = GraphRuntime.prototype as unknown as Record<string, (...args: never[]) => unknown>;
    expect(api.flush.length).toBe(1);
    expect(typeof api.flushAtTick).toBe("function");
    expect(api.flushAtTick.length).toBe(2);

    // And one operation keeps one name. `invalidate` was `flush` with the clock's parameter
    // removed, which is exactly what `flush` is now, so retaining it would be a second name for a
    // single operation rather than the narrower entry ADR-081 kept it as. That record held the tick
    // out of the project tier by keeping a second member; this one holds it out of `flush` itself,
    // so the member is no longer what carries the segregation and stops paying for itself.
    expect(api.invalidate).toBeUndefined();
    expect(Object.getOwnPropertyNames(GraphRuntime.prototype)).not.toContain("invalidate");

    // What a caller states is what the batch reports, and the seed-list entry still cannot move the
    // clock's frame number. Both halves are unchanged by the split, which is the point of it.
    expect(runtime.flush(["hero/arm"]).seeds).toEqual(["hero/arm"]);
    expect(runtime.tick).toBe(0);

    // And it refuses a disposed runtime through its own first statement.
    runtime.dispose();
    expect(() => runtime.flush(["hero/arm"])).toThrow("GraphRuntime is disposed.");
  });
});
