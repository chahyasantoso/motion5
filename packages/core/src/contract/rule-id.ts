import type { Diagnostic } from "./v5";

/**
 * Every rule id `Diagnostic.ruleId` can carry, as one closed union.
 *
 * `ruleId` was `string`, so the set of rules this project refuses by name was open: nothing
 * enumerated it, nothing could switch on it, and a reader asking which rules exist had to grep for
 * a construction site. Adding a rule now breaks the build here, at the one place the rule is
 * named, rather than being inherited silently by every consumer that pattern-matches a string.
 * See ADR-097 and issue #449.
 *
 * This module is not re-exported from the package entry, so it adds no entry to the export map or
 * to the boundary allow-list. `Diagnostic.ruleId` still declares `string` at this slice: the
 * enumeration is proved complete by `packages/core/test/contract/rule-id.test.ts` before anything
 * depends on it.
 */

/**
 * The rule names `validateKeyframes` reports, held separately because they are the only names the
 * plugin-contribution prefix is applied to.
 *
 * Declaration order follows the construction order in `contract/validate-v5.ts` rather than being
 * sorted, so a reader comparing the two reads them in the same sequence.
 */
export const KEYFRAME_RULE_IDS = [
  "keyframes-shape",
  "keyframes-reserved-separator",
  "keyframes-duplicate-key",
  "stop-position",
  "stop-position-range",
  "stop-position-order",
  "stop-position-duplicate",
  "stop-missing-start",
  "stop-missing-end",
  "property-stops-wrapper",
  "stops-shape",
  "keyframes-requires-dict-empty",
  "keyframes-requires-dict-key",
  "keyframes-requires-dict-source",
  "keyframes-requires-shape",
  "keyframes-requires-empty",
  "keyframes-requires-slot",
  "keyframes-targets-shape",
  "keyframes-requires-source",
  "keyframes-values-shape",
  "keyframes-values-empty",
  "keyframes-unknown-section",
] as const;

/**
 * The prefix `validateContributionProperty` passes as `ruleIdPrefix`.
 *
 * One owner for the string, because it is both a run-time value and half of a type below.
 */
export const CONTRIBUTION_RULE_ID_PREFIX = "plugin-contribution-";

/**
 * The substitution `validateContributionProperty` passes as `ruleIdAliases`.
 *
 * An alias is a different id rather than a spelling of one: the run time emits
 * `plugin-contribution-stop` and never `plugin-contribution-stop-position`. So the type below
 * applies this map rather than unioning an independently maintained list beside it, which would be
 * the two-hand-maintained-lists shape issue #283 refused.
 */
export const CONTRIBUTION_RULE_ID_ALIASES = {
  "stop-position": "stop",
  "stop-position-range": "stop-range",
  "stop-position-order": "stop-order",
  "stop-position-duplicate": "stop-duplicate",
} as const;

/**
 * Every other rule id, sorted, from all fifteen construction modules.
 *
 * The `plugin-contribution-` members here are their own literals in `domain/plugins.ts`,
 * `domain/keyframe-compiler.ts` and `contract/validate-v5.ts`. They are not outputs of the prefix
 * site and share only a spelling with the family derived below.
 */
export const BASE_RULE_IDS = [
  "blocked-upstream",
  "clock-consumer-failure",
  "clock-tick-regression",
  "composition-failure",
  "composition-output-shape",
  "diagnostic-sink-failure",
  "flush-failure",
  "free-tracks-shape",
  "graph-cycle",
  "id-qualified-separator",
  "id-reserved-namespace",
  "id-shape",
  "ik-goal-conflict",
  "ik-goal-duplicate",
  "ik-goal-not-leaf",
  "ik-goal-unknown-member",
  "ik-leaf-without-goal",
  "ik-mode-ambiguous",
  "ik-solved-rotation-dead",
  "ik-solver-no-goal",
  "ik-solver-no-members",
  "ik-solver-no-root",
  "ik-solver-unreachable-root",
  "ik-target-not-single-leaf",
  "ik-weight-without-solver",
  "motion-duplicate",
  "motion-duplicate-id",
  "motion-id",
  "motion-shape",
  "motion-tracks-shape",
  "motions-shape",
  "node-duplicate",
  "observation-duplicate",
  "observation-input-shape",
  "observation-missing-upstream",
  "observation-output-shape",
  "observation-pending-reference",
  "observation-projection-unsupported",
  "observation-role-unsupported",
  "observation-self-reference",
  "observation-source",
  "observation-target-unsupported",
  "observation-unknown-source",
  "observes-shape",
  "perspective-shape",
  "perspective-usage",
  "plugin-ambiguous-key",
  "plugin-contribution-cascade",
  "plugin-contribution-ease-collision",
  "plugin-contribution-failure",
  "plugin-contribution-key-collision",
  "plugin-contribution-output-collision",
  "plugin-contribution-reserved-tween-var",
  "plugin-contribution-shape",
  "plugin-contribution-static-unsupported",
  "plugin-contribution-tween-vars-conflict",
  "plugin-contribution-unsupported-entry",
  "plugin-duplicate-output",
  "plugin-duplicate-serializer",
  "plugin-requirement-dict-required",
  "plugin-requirement-dict-unsupported",
  "plugin-serializer-without-output",
  "plugin-unknown-key",
  "plugin-unknown-requirement",
  "project-id",
  "project-release-failed",
  "project-shape",
  "project-templates-unsupported",
  "reentrant-flush-deferred",
  "requirement-source",
  "scheduler-failure",
  "schema-v4-migration",
  "schema-version",
  "track-duplicate-id",
  "track-id",
  "track-shape",
  "trigger-driver-unavailable",
  "trigger-scroll-source",
  "trigger-shape",
  "trigger-time-autoplay-unsupported",
  "trigger-time-duration",
  "trigger-time-repeat-shape",
  "trigger-time-yoyo-requires-repeat",
  "trigger-time-yoyo-shape",
  "value-batch-deferred",
] as const;

export type BaseRuleId = (typeof BASE_RULE_IDS)[number];
export type KeyframeRuleId = (typeof KEYFRAME_RULE_IDS)[number];
export type ContributionRuleIdAliases = typeof CONTRIBUTION_RULE_ID_ALIASES;

/**
 * One keyframe rule name as the contribution adapter spells it: aliased if the map names it,
 * unchanged otherwise. This is the substitution itself, stated once.
 */
export type ContributionRuleName<Name extends KeyframeRuleId> =
  Name extends keyof ContributionRuleIdAliases ? ContributionRuleIdAliases[Name] : Name;

/**
 * The prefixed family, derived rather than enumerated.
 *
 * Stated as a template literal over the keyframe family because the prefix is applied at run time
 * to whichever name reported, so enumerating both halves would put one fact in two lists that a
 * later slice would have to keep in step by hand.
 *
 * This over-approximates on purpose. Which keyframe rules the adapter can actually reach depends
 * on run-time reachability through `allowGroups: false` and a single computed key, and that set
 * was measured wrong twice before this landed: `plugin-contribution-keyframes-reserved-separator`
 * is constructed today and was absent from the reachable list both audits produced. A family that
 * covers every name the prefix could be applied to can never fail to type a real diagnostic,
 * whereas a hand-picked reachable subset fails the first time a different rule fires, which is the
 * silent drift this union exists to prevent.
 */
export type ContributionRuleId =
  `${typeof CONTRIBUTION_RULE_ID_PREFIX}${ContributionRuleName<KeyframeRuleId>}`;

/** Every id `Diagnostic.ruleId` can carry. */
export type RuleId = BaseRuleId | KeyframeRuleId | ContributionRuleId;

const ALIAS_LOOKUP: Readonly<Record<string, string>> = CONTRIBUTION_RULE_ID_ALIASES;

/**
 * The prefixed family at run time, derived from the same two constants the type derives from, so
 * the enumeration and the type cannot disagree.
 */
export const CONTRIBUTION_RULE_IDS: readonly ContributionRuleId[] = Object.freeze(
  KEYFRAME_RULE_IDS.map(
    (name) => `${CONTRIBUTION_RULE_ID_PREFIX}${ALIAS_LOOKUP[name] ?? name}` as ContributionRuleId,
  ),
);

/** Every member of `RuleId`, for a gate or a reader that needs the set rather than the type. */
export const RULE_IDS: readonly RuleId[] = Object.freeze([
  ...BASE_RULE_IDS,
  ...KEYFRAME_RULE_IDS,
  ...CONTRIBUTION_RULE_IDS,
]);

const RULE_ID_SET: ReadonlySet<string> = new Set<string>(RULE_IDS);

/** Whether a string read from outside the package names a rule this project refuses by. */
export function isRuleId(value: string): value is RuleId {
  return RULE_ID_SET.has(value);
}

/** `Diagnostic` with its rule id narrowed, for a reader that has already proved the id. */
export type IdentifiedDiagnostic = Diagnostic & { readonly ruleId: RuleId };
