import type { MotionDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "./clock";
import type { Scheduler } from "./scheduler";
import type { TriggerPort } from "./trigger";

export interface ClockConsumer {
  onTick(event: ClockTick): void;
  dispose(): void;
}

export interface TriggerFactoryContext {
  readonly motionId: string;
  readonly definition: MotionDefinition;
  readonly clock: Clock;
  readonly scheduler: Scheduler;
}

export interface CreatedTrigger {
  readonly port: TriggerPort;
  readonly acceptsExternalSignal: boolean;
  readonly onTick?: (event: ClockTick) => void;
  dispose(): void;
}

export interface TriggerFactory {
  create(context: TriggerFactoryContext): CreatedTrigger;
}

export function assertTriggerFactory(
  factory: unknown,
  context = "TriggerFactory",
): asserts factory is TriggerFactory {
  if (!factory || typeof (factory as { create?: unknown }).create !== "function")
    throw new TypeError(`${context} requires create(context).`);
}
