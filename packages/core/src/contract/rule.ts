import { type BaseRuleId, type RuleId } from "./rule-id";

/**
 * How loudly a rule refuses, fixed where it is defined; a caller cannot override it.
 */
export type RuleSeverity = "error" | "warning";

/**
 * Whether a rule names ids in its payload. Two answers, not three: no rule is conditional.
 */
export type IdsOwnership = "none" | "always";

/** What a rule fixes about itself, once, where it is defined. */
export interface RuleFacts {
  readonly severity: RuleSeverity;
  readonly ids: IdsOwnership;
}

// The four combinations, named once. `as const` keeps literals, so `RuleIdOwning`
// derives from these records.
const ERROR_NO_IDS = { severity: "error", ids: "none" } as const;
const ERROR_WITH_IDS = { severity: "error", ids: "always" } as const;
const WARNING_NO_IDS = { severity: "warning", ids: "none" } as const;
const WARNING_WITH_IDS = { severity: "warning", ids: "always" } as const;

/**
 * What each base rule fixes about itself; `satisfies` makes a missing answer fail typecheck.
 * Order follows `BASE_RULE_IDS`; `RuleId` stays owned by `./rule-id`, not derived here. */
const BASE_RULES = {
  "blocked-upstream": ERROR_WITH_IDS,
  "cell-address-unknown": ERROR_NO_IDS,
  "cell-form-invalid": ERROR_NO_IDS,
  "cell-kind-conflict": ERROR_NO_IDS,
  "cell-stops-invalid": ERROR_NO_IDS,
  "clock-consumer-failure": ERROR_WITH_IDS,
  "clock-tick-regression": ERROR_WITH_IDS,
  "composition-failure": ERROR_WITH_IDS,
  "composition-output-shape": ERROR_WITH_IDS,
  "diagnostic-sink-failure": ERROR_WITH_IDS,
  "ease-collision": ERROR_WITH_IDS,
  "edge-duplicate": ERROR_WITH_IDS,
  "edge-self-reference": ERROR_WITH_IDS,
  "edge-unknown-source": ERROR_WITH_IDS,
  "flush-failure": ERROR_WITH_IDS,
  "free-tracks-shape": ERROR_NO_IDS,
  "graph-cycle": ERROR_WITH_IDS,
  "id-qualified-separator": ERROR_NO_IDS,
  "id-reserved-namespace": ERROR_NO_IDS,
  "id-shape": ERROR_NO_IDS,
  "ik-bend-conflicts-flip": ERROR_WITH_IDS,
  "ik-bend-malformed": ERROR_WITH_IDS,
  "ik-chain-unsupported": ERROR_WITH_IDS,
  "ik-goal-conflict": ERROR_WITH_IDS,
  "ik-goal-duplicate": ERROR_WITH_IDS,
  "ik-goal-not-leaf": ERROR_WITH_IDS,
  "ik-goal-unknown-member": ERROR_WITH_IDS,
  "ik-influence-malformed": ERROR_WITH_IDS,
  "ik-influence-without-goal": ERROR_WITH_IDS,
  "ik-inspect-malformed": ERROR_WITH_IDS,
  "ik-joint-key-unused": ERROR_WITH_IDS,
  "ik-joint-malformed": ERROR_WITH_IDS,
  "ik-leaf-without-goal": ERROR_WITH_IDS,
  "ik-limit-empty": ERROR_WITH_IDS,
  "ik-limit-malformed": ERROR_WITH_IDS,
  "ik-limit-without-solver": ERROR_WITH_IDS,
  "ik-mode-ambiguous": ERROR_WITH_IDS,
  "ik-orient-malformed": ERROR_WITH_IDS,
  "ik-orient-without-goal": ERROR_WITH_IDS,
  "ik-pole-without-bend": ERROR_WITH_IDS,
  "ik-pole-without-chain": ERROR_WITH_IDS,
  "ik-solved-rotation-dead": ERROR_WITH_IDS,
  "ik-solver-key-misgrouped": ERROR_WITH_IDS,
  "ik-solver-no-goal": ERROR_WITH_IDS,
  "ik-solver-no-members": ERROR_WITH_IDS,
  "ik-solver-no-root": ERROR_WITH_IDS,
  "ik-solver-unreachable-root": ERROR_WITH_IDS,
  "ik-target-not-single-leaf": ERROR_WITH_IDS,
  "ik-weight-without-solver": ERROR_WITH_IDS,
  "input-schema-on-plugin-track": ERROR_NO_IDS,
  "input-source-shape": ERROR_WITH_IDS,
  "live-values-invalid": ERROR_NO_IDS,
  "motion-duplicate": ERROR_WITH_IDS,
  "motion-duplicate-id": ERROR_WITH_IDS,
  "motion-id": ERROR_NO_IDS,
  "motion-shape": ERROR_NO_IDS,
  "motion-tracks-shape": ERROR_NO_IDS,
  "motions-shape": ERROR_NO_IDS,
  "name-reserved": ERROR_NO_IDS,
  "node-duplicate": ERROR_WITH_IDS,
  "output-invalid": ERROR_NO_IDS,
  "output-missing": ERROR_NO_IDS,
  "output-row-id-duplicate": ERROR_NO_IDS,
  "output-source-shape": ERROR_WITH_IDS,
  "output-undeclared": ERROR_NO_IDS,
  "perspective-shape": ERROR_NO_IDS,
  "perspective-usage": WARNING_WITH_IDS,
  "plugin-duplicate-id": ERROR_WITH_IDS,
  "plugin-duplicate-output": ERROR_WITH_IDS,
  "plugin-duplicate-serializer": ERROR_WITH_IDS,
  "plugin-input-invalid": ERROR_NO_IDS,
  "plugin-requirement-dict-required": ERROR_WITH_IDS,
  "plugin-requirement-dict-unsupported": ERROR_WITH_IDS,
  "plugin-requires-without-plugin": ERROR_NO_IDS,
  "plugin-serializer-without-output": ERROR_WITH_IDS,
  "plugin-shape": ERROR_NO_IDS,
  "plugin-unknown": ERROR_NO_IDS,
  "plugin-unknown-key": ERROR_WITH_IDS,
  "plugin-unknown-requirement": ERROR_WITH_IDS,
  "plugin-validation-failed": ERROR_NO_IDS,
  "plugin-validation-warning": WARNING_NO_IDS,
  "project-id": ERROR_NO_IDS,
  "project-release-failed": ERROR_NO_IDS,
  "project-shape": ERROR_NO_IDS,
  "project-templates-unsupported": ERROR_NO_IDS,
  "reentrant-flush-deferred": WARNING_WITH_IDS,
  "reentrant-flush-deferred-frame": WARNING_NO_IDS,
  "requirement-source": ERROR_WITH_IDS,
  "row-id-duplicate": ERROR_NO_IDS,
  "row-id-invalid": ERROR_NO_IDS,
  "scheduler-failure": ERROR_WITH_IDS,
  "schema-version": ERROR_NO_IDS,
  "slot-binding-mode": ERROR_NO_IDS,
  "slot-incompatible": ERROR_NO_IDS,
  "slot-required-missing": ERROR_NO_IDS,
  "slot-unknown": ERROR_NO_IDS,
  "slot-unproven": ERROR_NO_IDS,
  "source-pending": WARNING_WITH_IDS,
  "spec-field-unknown": ERROR_NO_IDS,
  "stale-motion-handle": ERROR_NO_IDS,
  "stale-track-handle": ERROR_NO_IDS,
  "static-field-stops": ERROR_NO_IDS,
  "track-duplicate-id": ERROR_WITH_IDS,
  "track-field-unknown": ERROR_NO_IDS,
  "track-id": ERROR_NO_IDS,
  "track-legacy-field": ERROR_NO_IDS,
  "track-shape": ERROR_NO_IDS,
  "trigger-driver-unavailable": ERROR_WITH_IDS,
  "trigger-scroll-source": ERROR_NO_IDS,
  "trigger-shape": ERROR_NO_IDS,
  "trigger-time-autoplay-unsupported": ERROR_NO_IDS,
  "trigger-time-duration": ERROR_NO_IDS,
  "trigger-time-repeat-shape": ERROR_NO_IDS,
  "trigger-time-yoyo-requires-repeat": ERROR_NO_IDS,
  "trigger-time-yoyo-shape": ERROR_NO_IDS,
  "upstream-missing": ERROR_WITH_IDS,
  "value-batch-deferred": WARNING_WITH_IDS,
  "values-shape-invalid": ERROR_NO_IDS,
} as const satisfies Record<BaseRuleId, RuleFacts>;

type BaseRules = typeof BASE_RULES;
type AllRules = BaseRules;

/**
 * Every rule's facts, one record. Annotated by `RuleId`, not the source of it: `./rule-id` owns
 * which rules exist, and a rule missing here fails typecheck at this annotation. */
export const RULES: Readonly<Record<RuleId, RuleFacts>> = Object.freeze({
  ...BASE_RULES,
});

/**
 * The severity a rule refuses at, and the only expression that answers it. Diagnostics derive
 * `severity` through this; the constructor takes none, so no call site can name one. */
export function ruleSeverity(ruleId: RuleId): RuleSeverity {
  return RULES[ruleId].severity;
}

/** Every rule whose answer is `Ownership`, as a union rather than as a filtered array. */
export type RuleIdOwning<Ownership extends IdsOwnership> = {
  readonly [Rule in RuleId]: AllRules[Rule]["ids"] extends Ownership ? Rule : never;
}[RuleId];

/** A rule every construction site of which names ids. */
export type IdentifiedRuleId = RuleIdOwning<"always">;

/**
 * The `ids` list a producer takes for a given rule id: `[]`, `[ids]`, or `[ids?]` for a bare
 * `RuleId`. One-element tuples stop the conditional distributing over the union. */
export type OwnedIds<Rule extends RuleId> = [Rule] extends [RuleIdOwning<"none">]
  ? []
  : [Rule] extends [RuleIdOwning<"always">]
    ? [ids: readonly string[]]
    : [ids?: readonly string[]];
