import type { ScrollSource } from "../scroll-trigger";
import { createScrollTriggerPort } from "../scroll-trigger";
import type { TriggerFactory, TriggerFactoryContext } from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import { createTimeDriver } from "./time-driver";

export interface TriggerFactoryOptions {
  readonly scroll?: (context: TriggerFactoryContext, sourceKey: string | undefined) => ScrollSource | undefined;
}

export function createTriggerFactory(options: TriggerFactoryOptions = {}): TriggerFactory {
  return {
    create(context) {
      const trigger = context.definition.trigger;
      if (trigger.type === "time") {
        const duration = trigger.duration;
        return createTimeDriver(typeof duration === "number" ? duration : Number.NaN);
      }
      if (trigger.type === "scroll") {
        const source = options.scroll?.(context, trigger.source);
        if (!source)
          throw new TypeError(`trigger-driver-unavailable at motions.${context.motionId}.trigger: No scroll driver is registered for Motion "${context.motionId}" and source "${trigger.source ?? ""}".`);
        const port = createScrollTriggerPort(source);
        return { port, acceptsExternalSignal: false, dispose: port.dispose };
      }
      const port = createManualTriggerPort();
      return { port, acceptsExternalSignal: true, dispose: () => port.dispose() };
    },
  };
}

export function createDefaultTriggerFactory(): TriggerFactory {
  return createTriggerFactory();
}
