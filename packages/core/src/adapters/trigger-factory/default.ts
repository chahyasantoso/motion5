import type { ScrollSource } from "../scroll-trigger";
import { createScrollTriggerPort } from "../scroll-trigger";
import type { ScrollTriggerDefinition } from "../../contract/v5";
import { describeDiagnostics, diagnostic } from "../../contract/diagnostics";
import type {
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "../../ports/trigger-factory";
import { createManualTriggerPort } from "../../ports/trigger";
import { createTimeDriver } from "./time-driver";

/**
 * A scroll resolver only ever runs for a scroll trigger, so a time trigger is unrepresentable at
 * the call site. The authored `source` key is already on the context, which is why the resolver
 * takes no second `sourceKey` argument: it would pass the same value twice.
 */
export interface ScrollSourceResolverContext extends TriggerFactoryContext {
  readonly trigger: ScrollTriggerDefinition;
}

export type ScrollSourceResolver = (
  context: ScrollSourceResolverContext,
) => ScrollSource | undefined;

export interface TriggerFactoryOptions {
  readonly scroll?: ScrollSourceResolver;
}

export function createTriggerFactory(options: TriggerFactoryOptions = {}): TriggerFactory {
  return {
    create(context): CreatedTrigger {
      // context.trigger is the canonical narrowed read. context.definition.trigger is raw authored
      // input and is not interchangeable with it.
      const trigger = context.trigger;
      if (trigger.type === "time") return createTimeDriver(trigger.duration);
      if (trigger.type === "scroll") {
        const source = options.scroll?.({ ...context, trigger });
        if (source === undefined) {
          const key = trigger.source ?? "";
          const message = `No scroll source is registered for Motion "${context.motionId}" with source key "${key}".`;
          throw new TypeError(
            describeDiagnostics([
              diagnostic(
                "trigger-driver-unavailable",
                `motions.${context.motionId}.trigger.source`,
                message,
                "error",
                [context.motionId],
              ),
            ]),
          );
        }
        const port = createScrollTriggerPort(source);
        return {
          port,
          acceptsExternalSignal: false,
          clockBinding: { kind: "none" },
          dispose: () => port.dispose(),
        };
      }
      const port = createManualTriggerPort();
      return {
        port,
        acceptsExternalSignal: true,
        clockBinding: { kind: "motion" },
        dispose: () => port.dispose(),
      };
    },
  };
}

export function createDefaultTriggerFactory(): TriggerFactory {
  return createTriggerFactory();
}
