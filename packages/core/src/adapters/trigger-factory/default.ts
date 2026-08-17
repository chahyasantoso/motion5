import type { TriggerFactory } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";

/**
 * T1 compatibility factory. It provides the existing manual port for every trigger kind;
 * real time and scroll driver selection is deliberately deferred to T2/T3.
 */
export function createDefaultTriggerFactory(): TriggerFactory {
  return {
    create() {
      const port = createManualTriggerPort();
      return {
        port,
        acceptsExternalSignal: true,
        dispose: () => port.dispose(),
      };
    },
  };
}
