import type { CreatedTrigger } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import type { ClockTick } from "../../ports/clock";

export function createTimeDriver(duration: number): CreatedTrigger {
  if (!Number.isFinite(duration) || duration <= 0)
    throw new TypeError("Time driver duration must be a finite number greater than zero.");
  const port = createManualTriggerPort();
  let elapsed = 0;
  let completed = false;
  let disposed = false;
  return {
    port,
    acceptsExternalSignal: false,
    onTick(event: ClockTick) {
      if (disposed || completed) return;
      elapsed += event.delta;
      const progress = Math.min(1, elapsed / duration);
      port.emit(progress);
      if (progress >= 1) completed = true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      port.dispose();
    },
  };
}
