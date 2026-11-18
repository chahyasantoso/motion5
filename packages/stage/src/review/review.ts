import type { CompiledStretch } from "../beats/index";

/** Review expectation for a cast member: `"settle"` holds at end, `"ambient"` loops, `"static"` never moves. */
export type MotionExpectation = "settle" | "ambient" | "static";

/** Per-target review thresholds overriding CLI defaults for position, turn, or ratio steps. */
export interface TargetLimits {
  readonly jump?: number | undefined;
  readonly turn?: number | undefined;
  readonly ratio?: number | undefined;
}

/** Resolved review policy for one member or list item, isolated from renderer state. */
export interface ReviewMemberSpec {
  readonly name: string;
  readonly kind: "actor" | "list" | "group" | "item";
  readonly groups: readonly string[];
  readonly on?: readonly CompiledStretch[] | undefined;
  readonly watch: boolean;
  readonly expectation: MotionExpectation;
  readonly hasMorph: boolean;
  readonly hasPath: boolean;
}

/** Complete review metadata produced by `compileStage` for headless and design auditors. */
export interface CompiledReviewSpec {
  readonly members: readonly ReviewMemberSpec[];
  readonly byName: ReadonlyMap<string, ReviewMemberSpec>;
  readonly limits: Readonly<Record<string, TargetLimits>>;
  readonly style?: string | undefined;
  readonly design?: unknown;
}

/** Freezes a `CompiledReviewSpec` from compiled member policies and optional stage metadata. */
export function buildReviewSpec(options: {
  readonly members: readonly ReviewMemberSpec[];
  readonly limits: Readonly<Record<string, TargetLimits>>;
  readonly style?: string | undefined;
  readonly design?: unknown;
}): CompiledReviewSpec {
  const members = Object.freeze([...options.members]);
  const byName = new Map(members.map((entry) => [entry.name, entry] as const));
  return Object.freeze({
    members,
    byName,
    limits: Object.freeze({ ...options.limits }),
    ...(options.style === undefined ? {} : { style: options.style }),
    ...(options.design === undefined ? {} : { design: options.design }),
  });
}
