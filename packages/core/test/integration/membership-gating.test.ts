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
    // `Function.length` counts the parameters before the first one carrying a default, so this is
    // the runtime-observable form of a compile-time contract: it read 2 for a flush that also
    // accepted the clock's frame number, and reads 1 now that it cannot. Read through a cast whose
    // new members are optional, so the red the evidence commit was pushed for is a failing
    // assertion in a real run rather than a `tsc` diagnostic that stops the file from executing.
    const api = GraphRuntime.prototype as unknown as {
      flush: (...args: never[]) => unknown;
      flushAtTick?: (...args: never[]) => unknown;
      invalidate?: unknown;
    };
    expect(api.flush.length).toBe(1);
    expect(typeof api.flushAtTick).toBe("function");
    expect(api.flushAtTick?.length).toBe(2);

    // And one operation keeps one name. `invalidate` was `flush` with the clock's parameter
    // removed, which is exactly what `flush` is now, so retaining it would be a second name for a
    // single operation rather than the narrower entry ADR-081 kept it as. That record held the tick
    // out of the project tier by keeping a second member; this one holds it out of `flush` itself,
    // so the member is no longer what carries the segregation and stops paying for itself.
    expect(api.invalidate).toBeUndefined();
    expect(Object.getOwnPropertyNames(GraphRuntime.prototype)).not.toContain("invalidate");

    // The compile-time half of the same claim: a tick handed to `flush` is an error rather than an
    // argument it quietly ignores. The arrow is deliberately never called.
    // @ts-expect-error `flush` states its seeds; the clock transition belongs to `flushAtTick`.
    const withTick = () => runtime.flush(["hero/arm"], 1);
    expect(typeof withTick).toBe("function");

    // What a caller states is what the batch reports, and the seed-list entry still cannot move the
    // clock's frame number. Both halves are unchanged by the split, which is the point of it.
    expect(runtime.flush(["hero/arm"]).seeds).toEqual(["hero/arm"]);
    expect(runtime.tick).toBe(0);

    // The clock's verb is the only member that moves that number, and it refuses a value that does
    // not advance and one that is not a number at all, both before `#lastTick` moves.
    expect(runtime.flushAtTick(["hero/arm"], 1).seeds).toEqual(["hero/arm"]);
    expect(runtime.tick).toBe(1);
    expect(() => runtime.flushAtTick(["hero/arm"], 0)).toThrow("Runtime ticks must be monotonic.");
    expect(() => runtime.flushAtTick(["hero/arm"], Number.NaN)).toThrow(
      "Runtime ticks must be finite.",
    );
    expect(runtime.tick).toBe(1);

    // And both refuse a disposed runtime, each through its own first statement.
    runtime.dispose();
    expect(() => runtime.flush(["hero/arm"])).toThrow("GraphRuntime is disposed.");
    expect(() => runtime.flushAtTick(["hero/arm"], 2)).toThrow("GraphRuntime is disposed.");
  });
});
