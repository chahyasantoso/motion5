import type { TriggerFactory } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import { createTimeDriver } from "./time-driver";

/**
 * T2 factory. Manual and scroll remain compatibility ports; time uses the project clock.
 * Scroll source injection is deliberately deferred to T3.
 */
export function createDefaultTriggerFactory(): TriggerFactory {
  return {
    create({ definition }) {
      if (definition.trigger.type === "time") {
        const duration = definition.trigger.duration;
        return createTimeDriver(typeof duration === "number" ? duration : Number.NaN);
      }
      const port = createManualTriggerPort();
      return {
        port,
        acceptsExternalSignal: true,
        dispose: () => port.dispose(),
      };
    },
  };
}
