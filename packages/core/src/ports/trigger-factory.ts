import type { MotionDefinition, TriggerDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "./clock";
import type { Scheduler } from "./scheduler";
import type { TriggerPort } from "./trigger";

export interface ClockConsumer {
  onTick(event: ClockTick): void;
}

export interface TriggerFactoryContext {
  readonly motionId: string;
  /** Raw authored definition: id, tracks, stagger. Open shape, so never read its trigger. */
  readonly definition: MotionDefinition;
  /** Canonical narrowed trigger. The only supported way to read trigger fields. */
  readonly trigger: TriggerDefinition;
  readonly clock: Clock;
  readonly scheduler: Scheduler;
}

/**
 * A Motion's relationship to the one project clock, as a total tagged union.
 *
 * The behavior space has exactly three members, so it is three states rather than an optional
 * callback plus a flag. Two fields encoding one decision would need a runtime invariant to police
 * a state the type system should have forbidden. Here "never a driver *and* `motion.onTick`" is
 * unrepresentable, and the registration site is an exhaustive switch with no fallback.
 *
 * - `driver`: the driver owns time semantics and is fed project ticks. Used by `time`.
 * - `motion`: the Motion itself is clock-advanced. Used by `manual`, which is an implicit time
 *   trigger today; naming that state makes the plan section 6.3 unification a later one-liner.
 * - `none`: push-driven, no clock consumer at all. Used by `scroll`.
 */
export type ClockBinding =
  | { readonly kind: "driver"; onTick(event: ClockTick): void }
  | { readonly kind: "motion" }
  | { readonly kind: "none" };

export interface CreatedTrigger {
  readonly port: TriggerPort;
  /** False for driver-backed Motions. Enforces locked decision 4 without type branching. */
  readonly acceptsExternalSignal: boolean;
  readonly clockBinding: ClockBinding;
  /** Must be idempotent. */
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
