import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphPublisher } from "../../../src/runtime/graph-publisher";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import {
  emptySeedPublications,
  publicationsFor,
  statedPublications,
  type PublicationSpy,
} from "../../helpers/publication-spy";

/**
 * Issue #381's last ask: one case proving a scheduled drain cannot be mistaken for the publication
 * a write asked for.
 *
 * No rig in the twenty affected cases currently leaves a drain pending, which is why CI was green
 * and why #381 is a test-quality finding rather than a bug. This is the case that makes the risk
 * concrete instead of argued: it drives a real deferral, lets the drain run, and shows that a bare
 * count now reads two where the write asked for one, while the three filtered answers each still
 * say the true thing. Without it, the helpers those twenty cases now depend on would themselves be
 * unproven. See ADR-087.
 *
 * Issue #404 asks the next question: what may a helper here claim? `drains` claimed an origin a seed
 * list cannot prove, so the two cases at the end of this file pin the scope of the renamed answer
 * from both sides -- an empty-seed publication no drain made, and a drain this spy never sees -- and
 * the second of them pins the member a publication spy is allowed to watch, at compile time.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("a scheduled drain is not the publication a write asked for", () => {
  it("states no seeds, so it satisfies no assertion about a stated seed list", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");
    const publication = vi.spyOn(runtime, "flush");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    clock.tick();

    // One caller-stated publication, and the drain it booked has not run yet. The clock's own
    // publication is not here at all, because `#flushTick` goes through `flushAtTick`, which is the
    // half of #381's worry ADR-082 already answered.
    expect(publicationsFor(publication, ["caption/label"])).toHaveLength(1);
    expect(emptySeedPublications(publication)).toEqual([]);

    scheduler.flush();

    // And now the point. A bare count says two where the write asked for one, so an assertion of
    // `toHaveBeenCalledTimes(1)` in a case about a write would have gone red for a reason the case
    // is not about; equally, had the write published nothing, that same count would have been
    // satisfied by the drain alone.
    expect(publication).toHaveBeenCalledTimes(2);
    expect(emptySeedPublications(publication)).toHaveLength(1);
    expect(statedPublications(publication)).toHaveLength(1);
    expect(publicationsFor(publication, ["caption/label"])).toHaveLength(1);
    // Exactly, not by containment: the drain states nothing, so it is not a publication for this
    // node under any reading of the seed list.
    expect(publicationsFor(publication, [])).toHaveLength(1);
    runtime.dispose();
  });
});

/**
 * What an empty seed list proves, from both sides of the claim `drains` used to make.
 *
 * Issue #404. A rename is only honest if the scope it leaves behind is pinned rather than described,
 * and one case does both halves: an empty-seed publication no drain made, and a drain this spy
 * cannot see. The two together are why origin belongs to the case above, which watches the scheduler
 * callback, and not to any filter over seed lists. See ADR-087.
 */
describe("an empty seed list is a reading rather than an origin", () => {
  it("counts a direct empty publication and misses a drain that carried a frame", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");
    const publication = vi.spyOn(runtime, "flush");

    // Half one. `flush` is public and an empty list is a real publication rather than a cheap one,
    // so this is an empty-seed publication with no scheduler anywhere near it.
    runtime.flush([]);
    expect(emptySeedPublications(publication)).toHaveLength(1);

    // Half two. A reentrant call that names a frame is deferred with it, so the drain replays through
    // `flushAtTick`, the verb that owns a clock transition, and this spy is not on that verb.
    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flushAtTick(["caption/label"], 7);
    });
    clock.tick();
    scheduler.flush();

    // The drain ran: it reached the frame the deferral carried and published the seed it held.
    expect(runtime.tick).toBe(7);
    expect(runtime.pendingSeeds).toEqual([]);
    // And this answer did not move for it. Still one, and it is the direct call: an empty seed list
    // counts a publication no drain made and misses one a drain did, in the same case.
    expect(emptySeedPublications(publication)).toHaveLength(1);
    expect(statedPublications(publication)).toEqual([]);
    runtime.dispose();
  });

  it("is not satisfied by a spy on another member, and the type is what refuses it", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    // The one-character mistake #404 names: `replaceGraph` states a project rather than a seed list,
    // and it was structurally assignable, so every answer was empty and a negative assertion passed
    // while watching the wrong member. The error is the assertion; the spy is never called.
    // @ts-expect-error a publication spy states its seed list first.
    const wrong: PublicationSpy = vi.spyOn(runtime, "replaceGraph");
    // And the member this tier is about is accepted, so the refusal above is about the call shape
    // rather than about spies.
    const right: PublicationSpy = vi.spyOn(runtime, "flush");
    expect(wrong.mock.calls).toEqual([]);
    expect(emptySeedPublications(right)).toEqual([]);
    runtime.dispose();
  });

  it("refuses a member that states no seed list first, and accepts the verb that does", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    // Issue #424 asks the boundary to be pinned rather than exemplified, because the case above
    // refuses one member and the tuple refuses a whole shape. These three are the surface: the
    // widest spy there is, the same verb one tier down, and the other verb that does state a seed
    // list first. Each error is the assignment; no spy here is ever called.
    //
    // An untyped mock states nothing first, so its `any[]` call tuple is not assignable to a tuple
    // with a required first element. That is what makes the deleted `seedsOf` guard unnecessary
    // rather than merely unwanted: the shape it used to answer `undefined` for cannot be handed to
    // these readers by a typed consumer at all.
    // @ts-expect-error an untyped mock records no seed list first.
    const untyped: PublicationSpy = vi.fn();
    // `GraphPublisher.flush` is the same verb one tier down and states a snapshot first, so it is
    // the near miss `replaceGraph` is not: a reader watching the publisher rather than the runtime
    // is watching a real publication and still cannot be answered by a seed-list filter.
    const publisherFlush = vi.spyOn(GraphPublisher.prototype, "flush");
    // @ts-expect-error the publisher's flush states a snapshot first.
    const publisher: PublicationSpy = publisherFlush;
    // And `flushAtTick` is accepted, which keeps the two refusals about the first argument rather
    // than about which member this tier happens to name. It is also the verb a frame-carrying
    // deferral replays through, so the type does not stand between a case and the member it needs.
    const atTick: PublicationSpy = vi.spyOn(runtime, "flushAtTick");
    expect(untyped.mock.calls).toEqual([]);
    expect(publisher.mock.calls).toEqual([]);
    expect(statedPublications(atTick)).toEqual([]);
    publisherFlush.mockRestore();
    runtime.dispose();
  });
});
