import type { CreatedTrigger } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import type { ClockTick } from "../../ports/clock";
import { createLoopCycle, type LoopCycleOptions } from "./loop-cycle";
import { unreachable } from "../../domain/exhaustive";

interface ActiveDriverState {
  readonly kind: "active";
}

interface DisposedDriverState {
  readonly kind: "disposed";
}

type TimeDriverState = ActiveDriverState | DisposedDriverState;

/** The loop half of a `time` trigger. `duration` stays a positional argument of the driver. */
export type TimeLoopOptions = Omit<LoopCycleOptions, "duration">;

export function createTimeDriver(duration: number, loop: TimeLoopOptions = {}): CreatedTrigger {
  if (!Number.isFinite(duration) || duration <= 0)
    throw new TypeError("Time driver duration must be a finite number greater than zero.");
  // Loop state and cycle arithmetic have exactly one owner and it is not this function. The driver
  // keeps what it always owned: the emission channel, the rule that a finished loop stops emitting,
  // and disposal. With no repeat this is the previous single-pass driver value for value. ADR-040.
  const cycle = createLoopCycle({ duration, ...loop });
  const port = createManualTriggerPort();
  let state: TimeDriverState = { kind: "active" };
  return {
    port,
    clockBinding: {
      kind: "driver",
      onTick(event: ClockTick) {
        switch (state.kind) {
          case "active":
            break;
          case "disposed":
            return;
          default:
            return unreachable(state);
        }
        switch (cycle.state.kind) {
          case "running":
            break;
          case "finished":
            return;
          default:
            return unreachable(cycle.state);
        }
        // One emission per tick, unchanged. A tick that crossed several cycles is still one frame
        // the clock delivered, and Motion coalesces to the latest progress per scheduler pass, so
        // replaying the skipped cycles would only queue values that can never be applied.
        port.emit(cycle.advance(event.delta).progress);
      },
    },
    dispose() {
      switch (state.kind) {
        case "active":
          state = { kind: "disposed" };
          port.dispose();
          return;
        case "disposed":
          return;
        default:
          return unreachable(state);
      }
    },
  };
}
