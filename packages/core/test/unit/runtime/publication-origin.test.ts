import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import { drains, publicationsFor, statedPublications } from "../../helpers/publication-spy";

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
    expect(drains(publication)).toEqual([]);

    scheduler.flush();

    // And now the point. A bare count says two where the write asked for one, so an assertion of
    // `toHaveBeenCalledTimes(1)` in a case about a write would have gone red for a reason the case
    // is not about; equally, had the write published nothing, that same count would have been
    // satisfied by the drain alone.
    expect(publication).toHaveBeenCalledTimes(2);
    expect(drains(publication)).toHaveLength(1);
    expect(statedPublications(publication)).toHaveLength(1);
    expect(publicationsFor(publication, ["caption/label"])).toHaveLength(1);
    // Exactly, not by containment: the drain states nothing, so it is not a publication for this
    // node under any reading of the seed list.
    expect(publicationsFor(publication, [])).toHaveLength(1);
    runtime.dispose();
  });
});
