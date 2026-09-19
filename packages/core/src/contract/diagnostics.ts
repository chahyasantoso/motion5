import { ruleSeverity, type OwnedIds } from "./rule";
import type { Diagnostic, DiagnosticOf } from "./v5";
import type { RuleId } from "./rule-id";

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
 * The return type is `DiagnosticOf<Rule>` rather than `Diagnostic`, and that is what retired
 * `asDiagnostic` and `DiagnosticFields` with it. Both existed to get a producer back out of a union
 * it could not narrow into, and each cost an assertion or a second interface to build against. With
 * `Diagnostic` flat and `ids` required, the object built below is assignable to the pinned shape on
 * its own, so there is nothing left to assert and nothing left for a caller to build against. Every
 * producer in the tree forwards here now, so no module hand-builds a frozen diagnostic and no
 * expression casts one.
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
): DiagnosticOf<Rule> {
  // Widened before it is read, for the reason `CONTRIBUTION_RULES` in `./rule` widens its own derived
  // record: the list is still a parameter here, so no element of it is indexable until `Rule` is
  // instantiated.
  // Always an array, never an omission. `Diagnostic.ids` is required, so a rule that names no ids
  // carries a frozen empty one and the conditional spread that used to choose between a payload and
  // no member at all has nothing left to choose.
  const [carriedIds] = carried as unknown as readonly [(readonly string[])?];
  return Object.freeze({
    ruleId,
    path,
    message,
    severity,
    ids: Object.freeze([...(carriedIds ?? [])]),
  });
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
