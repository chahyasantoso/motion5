import { ruleSeverity, type OwnedIds } from "./rule";
import type { Diagnostic } from "./v5";
import type { RuleId } from "./rule-id";

/**
 * The fields a `Diagnostic` is built from.
 *
 * `Diagnostic` used to be discriminated by which rules own an `ids` payload, so a producer holding
 * its rule id as a `RuleId` variable could not prove which variant it was building: the correlation
 * is a fact about the value, and a rule id known only by its type erases it. That union is gone, so
 * this is no longer an intermediate shape on the way through a narrowing. It is the shape the three
 * remaining raw producers are checked against before the one expression that widens them.
 */
export interface DiagnosticFields {
  readonly ruleId: RuleId;
  readonly path: string;
  readonly message: string;
  readonly severity: Diagnostic["severity"];
  readonly ids?: readonly string[];
}

/**
 * Widens a built diagnostic into `Diagnostic`, and is the only expression that does.
 *
 * It existed to state a correlation. Producers build a diagnostic from a rule id they hold as data
 * rather than as a literal, TypeScript cannot narrow a union by a discriminant it knows only the type
 * of, and each of them would otherwise carry an assertion of its own, which is five owners for one
 * fact. `Diagnostic` is one interface now, so there is no variant left to narrow into and no
 * correlation left for an assertion to state. What remains is a widening, and it asserts and copies
 * nothing, so a frozen object stays the object its caller froze.
 *
 * Three modules call it, and the count is unchanged while the membership is not: they are
 * `domain/plugins.ts`, `domain/keyframe-compiler.ts` and `runtime/report.ts`. `graph/ir.ts` was one
 * of the three and is not any more, because it routes through the constructor below instead. Each of
 * the three that remain builds a frozen object literal of its own, so each is a second owner of the
 * shape rather than a consumer of a narrowing, and naming them here is the inventory of what is still
 * owed. This function is deleted with the last of them.
 *
 * What reaches it is still checked at the producer, which is the half that used to be missing. Each
 * takes its `ids` as `OwnedIds` of the rule id it was handed, so a caller naming a rule by a literal
 * cannot pass a payload the rule does not own nor omit one it always names. `contract/rule.ts` owns
 * that derivation and is the only owner of it, which is what deleting `contract/diagnostic-ids.ts`
 * bought: two records answered four rules differently, and a producer reading one while the
 * constructor read the other was a compile error rather than a drift that went unnoticed.
 *
 * `DiagnosticFields` still keeps its two fields independent, so a module calling this directly can
 * name a rule by a literal and hand over a payload the rule does not own. That is a real boundary and
 * not a proven invariant; what bounds it is the three callers above being the whole population, which
 * is a measurement rather than a type. See ADR-097.
 */
export function asDiagnostic(fields: DiagnosticFields): Diagnostic {
  return fields as Diagnostic;
}

/**
 * The single constructor for a `Diagnostic`.
 *
 * `validate-v5.ts` owns the authored-schema rules, but rule ids are contractual (plan section 0.8)
 * and are also raised by injected adapters such as the trigger factory. Both build diagnostics
 * here so the frozen shape has exactly one owner.
 *
 * `ruleId` is `RuleId` rather than `string`, so the one constructor of a diagnostic cannot mint a
 * rule nothing enumerates, and an injected adapter reaching this with a rule of its own invention
 * fails `typecheck` at its own call site. `contract/rule-id.ts` owns the enumeration. See ADR-097.
 *
 * `ids` is the argument list the rule owns rather than an ordinary parameter, so the two fields are
 * correlated at the call site. An adapter naming `trigger-driver-unavailable` cannot omit its payload
 * and one naming `id-shape` cannot invent one. `contract/rule.ts` owns the derivation, and owns it
 * alone: `contract/diagnostic-ids.ts` held a second answer for four rules and is deleted.
 *
 * `severity` defaults to the rule's own answer through `ruleSeverity`, so a caller that passes
 * nothing gets what `contract/rule.ts` fixed where the rule is defined. That default is the whole of
 * the bug it replaces: the old one was the literal `"error"`, so every warning rule reported by a
 * caller that passed nothing produced an error diagnostic, and nothing noticed because passing
 * nothing is what almost every caller does.
 *
 * The parameter still exists, so a call site can still name a severity. Saying otherwise, as this
 * docblock did, is the overclaim this file exists to keep out of the tree: `contract/validate-v5.ts`
 * names one at several sites and so does `adapters/trigger-factory/default.ts`. Thirteen naming sites
 * are counted rather than estimated, and thirteen is a floor rather than a total, because the sweep
 * behind it did not finish every test file and the adapter site was missed by three hand inventories
 * before it was found. Deleting the parameter is owed, and what it is owed first is the compiler
 * enumerating the sites rather than a comment claiming to have. The eight raw object literals do not
 * block it: they bypass this constructor entirely. No site names a severity that disagrees with its
 * rule, which is measured, so the derived default changes behaviour only where nothing is passed.
 * See ADR-097.
 */
export function diagnostic<Rule extends RuleId>(
  ruleId: Rule,
  path: string,
  message: string,
  severity: Diagnostic["severity"] = ruleSeverity(ruleId),
  ...carried: OwnedIds<Rule>
): Diagnostic {
  // Widened before it is read, for the reason `CONTRIBUTION_RULES` in `./rule` widens its own derived
  // record: the list is still a parameter here, so no element of it is indexable until `Rule` is
  // instantiated.
  // Always an array, never an omission. A rule that names no ids carries a frozen empty one, so no
  // reader has to tell a payload that went missing from a rule that has nothing to name, and the
  // conditional spread that used to decide between them has nothing left to decide.
  const [carriedIds] = carried as unknown as readonly [(readonly string[])?];
  return asDiagnostic(
    Object.freeze({
      ruleId,
      path,
      message,
      severity,
      ids: Object.freeze([...(carriedIds ?? [])]),
    }),
  );
}

/**
 * The single renderer for diagnostics inside a thrown message.
 *
 * Never hand-write `${ruleId} at ${path}: ${message}` anywhere else. Editors consume rule ids, so
 * their rendering must not drift between the validator, the Engine, and injected adapters.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
