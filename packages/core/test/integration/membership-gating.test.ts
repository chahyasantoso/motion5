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
  it("publishes only attached nodes among the seeds it is given", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    expect(runtime.memberCount).toBe(0);

    // The seed list is the caller's rather than the runtime's. This case used to omit it and read
    // the member set back out of `batch.seeds`, which asserted the default's derivation instead of
    // the gate this file is named for: a node that is named and not attached publishes nothing.
    const unattached = runtime.flush(["hero/arm"]);
    expect(unattached.seeds).toEqual(["hero/arm"]);
    expect(unattached.patches).toEqual([]);

    runtime.attach("hero/arm");
    expect(runtime.memberCount).toBe(1);
    const attached = runtime.flush(["hero/arm"]);
    expect(attached.seeds).toEqual(["hero/arm"]);
    expect(attached.patches.map(({ nodeId }) => nodeId)).toEqual(["hero/arm"]);

    runtime.detach("hero/arm");
    expect(runtime.memberCount).toBe(0);
    expect(runtime.flush(["hero/arm"]).patches).toEqual([]);
    runtime.dispose();
  });

  it("declares the seeds it flushes rather than defaulting to every member", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    runtime.attach("hero/arm");

    // Issue #371's follow-up, finding 2. `flush` defaulted its seed list to `[...this.#members]`,
    // so an omitted argument asked for the most expensive answer this method has, a full graph
    // recompute, and chose it by saying nothing. The parameter carries no default now, so a flush
    // costs the seeds its caller named. `Function.length` counts the parameters before the first
    // one with a default, so it reads 0 while `seeds` carries one and 2 once neither does.
    expect(GraphRuntime.prototype.flush.length).toBe(2);

    // @ts-expect-error `flush` states its seeds, so there is no default left to omit.
    const omitted = () => runtime.flush();
    expect(typeof omitted).toBe("function");

    // `invalidate` survives finding 1 rather than being folded into `flush`. It is the entry the
    // project tier reaches and the one that cannot carry a tick, so a publication through it
    // leaves the clock's own frame number where it was.
    const batch = runtime.invalidate(["hero/arm"]);
    expect(batch.seeds).toEqual(["hero/arm"]);
    expect(runtime.tick).toBe(0);

    // And it still refuses a disposed runtime, which is what makes deleting its own second
    // liveness assertion a deduplication rather than a hole: `flush` asserts the same condition as
    // its first statement, with nothing in between that could change the answer.
    runtime.dispose();
    expect(() => runtime.invalidate(["hero/arm"])).toThrow("GraphRuntime is disposed.");
  });
});
