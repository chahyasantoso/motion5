import type { RuleId } from "./rule-id";

/**
 * The shape every capability handle here shares, and how its members fail.
 * `live` and `id` never throw → cleanup guards; the rest throw `StaleHandleError` once stale. */
export interface Handle<T> {
  /** The id this handle was captured against; readable on a stale handle. */
  readonly id: string;
  /** Whether the captured token is current; never throws, stale or disposed. */
  readonly live: boolean;
  /** The authored definition as retained; throws `StaleHandleError` once stale. */
  readonly definition: T;
}

/**
 * The one failure family a stale handle reports, from every member that throws.
 * `TypeError` parent → `instanceof` catches see it; subclasses supply only the noun. */
export abstract class StaleHandleError extends TypeError {
  /** Which rule this refusal reports, from the closed `RuleId` set; branch here, not on its message. */
  abstract readonly ruleId: RuleId;
  /** Builds the refusal naming the given noun and id. */
  constructor(noun: string, id: string) {
    super(`${noun} "${id}" is no longer live.`);
  }
}
