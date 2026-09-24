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
 * to the boundary allow-list. `Diagnostic.ruleId` declares `RuleId`, so the compiler answers for
 * every id named at a construction site, and this module owns no import from `./v5`: a narrowed
 * alias of a type that already carries the narrowing was the one thing it held, and it is gone.
 * The coverage case in `packages/core/test/contract/rule-id.test.ts` answers for the shape a type
 * cannot see, which is an id assembled at run time, and it asserts coverage rather than a count.
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
  "keyframes-reserved-section",
  "keyframes-missing-values-section",
] as const;

/**
 * The prefix a keyframe rule reports under when the contribution adapter is the reporter.
 *
 * One owner for the string, because it is both a run-time value and half of a type below.
 * `validateContributionProperty` used to hand it over as a `ruleIdPrefix` option. It states a scope
 * now, and this module derives the prefix from that.
 */
export const CONTRIBUTION_RULE_ID_PREFIX = "plugin-contribution-";

/**
 * The substitution the contribution scope applies, handed over as a `ruleIdAliases` option before
 * this module owned it.
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
 * Every other rule id, sorted.
 *
 * No module count is stated. Three inventories of this union disagreed about that number, in both
 * directions, and a figure in a comment is a claim no gate reads: the coverage case owns it.
 *
 * The `plugin-contribution-` members here are their own literals in `domain/plugins.ts`,
 * `contract/keyframe-compiler.ts` and `contract/validate-v5.ts`. They are not outputs of the prefix
 * site and share only a spelling with the family derived below.
 *
 * Four members are minted on a thrown error class rather than at a diagnostic construction site.
 * `composition-output-shape`, `live-value-key`, `stale-motion-handle` and `stale-track-handle` are
 * each declared as a `ruleId` field on an error, and `graph-publisher.ts` already forwards one of
 * them into a diagnostic. A field spelled `ruleId` names a rule wherever it sits, so these are
 * members rather than a second population, which is what the message prefixes in
 * `runtime/refusal.ts` genuinely are. All four are found by the scan's declaration form rather than
 * by its argument form, which is the reason that form exists; neither audit named them.
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
  "ik-bend-conflicts-flip",
  "ik-bend-malformed",
  "ik-chain-unsupported",
  "ik-goal-conflict",
  "ik-goal-duplicate",
  "ik-goal-not-leaf",
  "ik-goal-unknown-member",
  "ik-influence-malformed",
  "ik-influence-without-goal",
  "ik-inspect-malformed",
  "ik-leaf-without-goal",
  "ik-limit-empty",
  "ik-limit-malformed",
  "ik-limit-without-solver",
  "ik-mode-ambiguous",
  "ik-solved-rotation-dead",
  "ik-solver-key-misgrouped",
  "ik-solver-no-goal",
  "ik-solver-no-members",
  "ik-solver-no-root",
  "ik-solver-unreachable-root",
  "ik-target-not-single-leaf",
  "ik-weight-without-solver",
  "live-value-key",
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
  "observation-source-shape",
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
  "reentrant-flush-deferred-frame",
  "requirement-source",
  "scheduler-failure",
  "schema-v4-migration",
  "schema-version",
  "stale-motion-handle",
  "stale-track-handle",
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
 * on run-time reachability through the group refusal the contribution scope answers and a single
 * computed key, and that set was measured wrong twice before this landed:
 * `plugin-contribution-keyframes-reserved-separator`
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
 * The id one keyframe rule reports under when the contribution adapter is the reporter, and the one
 * expression that applies the prefix.
 *
 * `validateKeyframes` took the prefix and the substitution as open `string` options, so this union
 * was closed everywhere except at the site minting a fifth of it, and two modules held one
 * namespace. The cast is confined here for the reason `mint` in `runtime/report.ts` confines its
 * own: a derived family needs exactly one expression that mints a member. `ContributionRuleId`
 * states the same substitution in the type, so a spelling this can produce that the type cannot is
 * unrepresentable rather than merely unlikely. See ADR-097 and issue #449.
 */
export function contributionRuleId(name: KeyframeRuleId): ContributionRuleId {
  return `${CONTRIBUTION_RULE_ID_PREFIX}${ALIAS_LOOKUP[name] ?? name}` as ContributionRuleId;
}

/**
 * The prefixed family at run time, derived through the one substitution the type derives through, so
 * the enumeration, the type and the reporter cannot disagree.
 */
export const CONTRIBUTION_RULE_IDS: readonly ContributionRuleId[] = Object.freeze(
  KEYFRAME_RULE_IDS.map((name) => contributionRuleId(name)),
);

/**
 * Which reporter is reading a keyframe rule, which is the whole of what decides the id it reports
 * under.
 *
 * Three correlated options said this before: a `ruleIdPrefix`, a `ruleIdAliases` map and an
 * `allowGroups` flag, all three set together by the single caller that set any of them, and two of
 * them open `string` data. Options with one legal spelling per caller are one value, so the scope
 * names who is reading and the prefix, the substitution and group permission are derived from it.
 */
export type KeyframeRuleScope = "authored" | "contribution";

/**
 * Every scope's answer, as a total map rather than a branch.
 *
 * A record keyed by the union is as closed as a `switch` ending at `unreachable`: a third scope fails
 * `typecheck` here, at the one place a scope is answered, rather than inheriting whichever branch was
 * written first. `lang/exhaustive` is deliberately not imported, because the contract layer does
 * not read the domain layer for a totality it can state in the type. See ADR-092 and ADR-099.
 */
const SCOPED_RULE_ID: Readonly<
  Record<KeyframeRuleScope, (name: KeyframeRuleId) => KeyframeRuleId | ContributionRuleId>
> = {
  authored: (name) => name,
  contribution: (name) => contributionRuleId(name),
};

/**
 * The id one keyframe rule reports under for one scope.
 *
 * The answer is `KeyframeRuleId | ContributionRuleId` rather than `RuleId`, and the narrowing is
 * enforcement rather than precision. Every member of both families owns no ids, so `OwnedIds` of
 * this answer is the empty argument list, and the scoped path through `contract/validate-v5.ts` is
 * checked against it. Answering `RuleId` fell through to the open branch instead, which enforces
 * nothing: that caller could have passed a payload for a rule that owns none and compiled. Nothing
 * was ever red for it, because the branch it landed on is the one with no claim in it.
 *
 * The narrowing was designed with the registry, written up in the past tense as though it had
 * landed, carried through four inventories of what this slice still owed, and submitted only now. A
 * review found the gap and no gate did, which is the argument for the negative type case in
 * `test/contract/ids-ownership-at-the-producer.test.ts`: it asks the compiler for the refusal rather
 * than describing it here. See ADR-097 and issue #449.
 */
export function scopedRuleId(
  scope: KeyframeRuleScope,
  name: KeyframeRuleId,
): KeyframeRuleId | ContributionRuleId {
  return SCOPED_RULE_ID[scope](name);
}

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
