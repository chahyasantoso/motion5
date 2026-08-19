import type { CreatedTrigger } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import type { ClockTick } from "../../ports/clock";
import { createLoopCycle, type LoopCycleOptions } from "./loop-cycle";

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
  let disposed = false;
  return {
    port,
    acceptsExternalSignal: false,
    clockBinding: {
      kind: "driver",
      onTick(event: ClockTick) {
        if (disposed || cycle.completed) return;
        // One emission per tick, unchanged. A tick that crossed several cycles is still one frame
        // the clock delivered, and Motion coalesces to the latest progress per scheduler pass, so
        // replaying the skipped cycles would only queue values that can never be applied.
        port.emit(cycle.advance(event.delta).progress);
      },
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      port.dispose();
    },
  };
}
