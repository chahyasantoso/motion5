import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock, type Clock, type ClockTick } from "../../../src/ports/clock";
import type { Cancel } from "../../../src/ports/scheduler";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issue #408, found by the quality pass over #405.
 *
 * `dispose` asked whether it had already finished and then called host code before it could answer
 * yes. `#releaseBooking` runs first on purpose, so the scheduler is not left holding a job a retired
 * runtime would only refuse, and it calls `Cancel.cancel`, which is the host's. A cancel that
 * disposes the runtime again therefore found a live phase and ran the whole body a second time.
 *
 * The observable is the clock subscription, because it is the one teardown step whose port contract
 * says nothing about being called twice: `createManualClock` deletes from a `Set` and tolerates it,
 * a real host need not. Counting releases is what a case can check without asserting on the order of
 * private statements, which is the shape of evidence ADR-083's own state-space cases already use.
 *
 * The middle case is green before and after, deliberately. Raising the phase before the port is
 * touched must not silence the last thing this runtime knew, and ADR-088's decision six is about a
 * runtime that has finished retiring rather than one that is retiring. See ADR-090.
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

/** A clock that counts how many times the runtime released the subscription it took. */
function countingClock(base: Clock, onRelease: () => void): Clock {
  return {
    subscribe(listener: (event: ClockTick) => void): () => void {
      const off = base.subscribe(listener);
      return () => {
        onRelease();
        off();
      };
    },
  };
}

describe("disposal runs once, however host code re-enters it", () => {
  it("tears down once when the port's cancel disposes the runtime again", () => {
    const base = createManualClock();
    let releases = 0;
    const holder: { runtime?: GraphRuntime } = {};
    let cancels = 0;
    const runtime = new GraphRuntime(
      project,
      countingClock(base, () => (releases += 1)),
      compose,
      {
        scheduler: {
          schedule(): Cancel {
            return {
              cancel() {
                cancels += 1;
                // Host code, reached by `#releaseBooking` from inside `dispose`. Legal, and the whole
                // of the finding.
                holder.runtime?.dispose();
              },
            };
          },
        },
      },
    );
    holder.runtime = runtime;
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    // A booking the disposal below has to release, which is what puts host code inside `dispose`.
    base.tick();
    expect(cancels).toBe(0);

    expect(() => runtime.dispose()).not.toThrow();

    // Red before this change: the reentrant call read `isDisposed`, found a live runtime because the
    // phase went terminal only after the port was touched, and ran the body again.
    expect(releases).toBe(1);
    expect(cancels).toBe(1);
    // And it finished retiring, so the runtime refuses work and carries none.
    expect(() => runtime.flush([])).toThrow(/disposed/);
    expect(runtime.pendingSeeds).toEqual([]);
  });

  it("still reports a port that refuses to cancel, because retiring is not retired", () => {
    const base = createManualClock();
    let releases = 0;
    const received: Diagnostic[] = [];
    const runtime = new GraphRuntime(
      project,
      countingClock(base, () => (releases += 1)),
      compose,
      {
        scheduler: {
          schedule(): Cancel {
            return {
              cancel() {
                throw new Error("cancel unavailable");
              },
            };
          },
        },
        onFlushError: (diagnostic) => received.push(diagnostic),
      },
    );
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    base.tick();
    runtime.dispose();

    // Green on both sides, and that is the case: the phase now rises before the port is touched, and
    // a runtime that is retiring still owns the failure it is discovering.
    expect(received).toHaveLength(1);
    expect(received[0]?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/cancellation failed/);
    expect(releases).toBe(1);
  });

  it("refuses a publication attempted from inside its own teardown", () => {
    const base = createManualClock();
    let releases = 0;
    const holder: { runtime?: GraphRuntime } = {};
    let refused: unknown;
    const runtime = new GraphRuntime(
      project,
      countingClock(base, () => (releases += 1)),
      compose,
      {
        scheduler: {
          schedule(): Cancel {
            return {
              cancel() {
                try {
                  holder.runtime?.flush(["hero/arm"]);
                } catch (error) {
                  refused = error;
                }
              },
            };
          },
        },
      },
    );
    holder.runtime = runtime;
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    base.tick();
    runtime.dispose();

    // Red before this change: the phase was still live inside the port call, so this published over a
    // registry the statements below it were about to dispose. A retiring runtime is one a caller may
    // no longer use, which is what `#assertLive` now says.
    expect(refused).toBeInstanceOf(Error);
    expect((refused as Error).message).toMatch(/disposed/);
    expect(releases).toBe(1);
  });
});
