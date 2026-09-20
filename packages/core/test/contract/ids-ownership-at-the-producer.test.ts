import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { diagnostic } from "../../src/contract/diagnostics";
import { scopedRuleId } from "../../src/contract/rule-id";
import { reportDiagnostic } from "../../src/runtime/report";
import type { RetainTrace } from "../../src/runtime/report";
import { code } from "../helpers/source-region";

/**
 * Issue #449: ownership of `ids` is enforced at the producer rather than asserted past it.
 *
 * `asDiagnostic` took a `RuleId` and an `ids` that were independent of each other, so a call naming a
 * rule that owns no ids and passing a payload compiled, and produced a diagnostic the union called
 * unrepresentable. Both that union and that assertion are deleted rather than reasoned about. The call
 * sites were always the half that mattered, and the two producers below take their ids as the
 * argument list `contract/rule.ts` derives from the rule they were handed. Neither names a severity
 * either, because the one constructor has no parameter for one.
 *
 * Two rather than five, and the three that went were not weakened away. `graph/ir.ts`'s `diag` and
 * the private `diagnostic` in `domain/plugins.ts` and `domain/keyframe-compiler.ts` each declared the
 * constructor's whole signature and then forwarded to it unchanged, so what this suite read in those
 * three files was a restatement rather than a second mechanism. `OwnedIds<Rule>` is referenced from
 * `contract/rule.ts` and never redefined, so an alias of the constructor resolves to the same type
 * and stops compiling in the same commit the registry's shape moves in: the restatement bought reader
 * locality and no guarantee, and three duplicate declarations plus three cases is a steep price for
 * reader locality. All three call the constructor directly now, the same form `contract/validate-v5.ts`
 * already called it in once its own `issue` alias was collapsed the same way. What is left below is the
 * constructor and the one producer that is not a forward.
 *
 * No type can observe itself and this suite cannot run `tsc`, so the claim is read off the
 * declarations as text. That is the shape `RA-78` established for a subject with no run-time form: a
 * declaration is code, reading it typechecks on both sides of the change, and the case fails on an
 * assertion rather than on a compile. It is spelled once per declaration rather than once across the
 * two, because a span has no bound that belongs to it and a rename in one file would otherwise be
 * reported as a claim about another.
 *
 * The accepting direction is asserted in the same file, because a producer that refused every payload
 * would be green against the refusal alone. Those last two cases are green on both sides of this
 * change on purpose: nothing a diagnostic carries at run time moved, and saying so is the report
 * `docs/GUARDRAILS.md` asks for rather than a red count engineered by asserting less.
 */

const source = (relative: string): string =>
  code(fileURLToPath(new URL(`../../src/${relative}`, import.meta.url)));

/** Each producer that reaches the one assertion, and the declaration its derived list sits in. */
const PRODUCERS: readonly (readonly [path: string, declaration: string])[] = [
  ["contract/diagnostics.ts", "export function diagnostic<Rule extends RuleId>("],
  ["runtime/report.ts", "export function reportDiagnostic<Rule extends RuleId>("],
];

describe("a producer takes the ids its rule owns", () => {
  for (const [path, declaration] of PRODUCERS) {
    it(`derives the ids argument list from the rule id it was handed in ${path}`, () => {
      const text = source(path);

      // The scan asserts it found its own subject before it asserts anything about it. A read that
      // matched nothing answers "absent" for every spelling, which is green for the wrong reason.
      expect(text.length).toBeGreaterThan(0);
      expect(text.split(declaration)).toHaveLength(2);
      expect(text.split("...carried: OwnedIds<Rule>")).toHaveLength(2);
    });
  }

  it("reads the totality proof rather than trusting it", () => {
    const text = source("contract/rule.ts");

    expect(text.split("export type OwnedIds<Rule extends RuleId>")).toHaveLength(2);
    // The proof moved with its owner rather than being dropped. `EveryRuleIdIsGrouped` refused a rule
    // that reached none of three groups; with two answers held in one total record there is no group
    // left to miss, so what is read here instead is that totality. A rule with no answer fails at the
    // `satisfies`, and a rule the record never reaches fails at the annotation on `RULES`. Both fail
    // the build only at their own declaration, which is exactly what made the old proof deletable
    // with nothing going red, so both are read rather than trusted.
    expect(text.split("as const satisfies Record<BaseRuleId, RuleFacts>")).toHaveLength(2);
    expect(text.split("Readonly<Record<RuleId, RuleFacts>>")).toHaveLength(2);
  });

  it("still carries the payload of a rule that owns one", () => {
    const built = diagnostic("track-duplicate-id", "$.motions[0]", "duplicate", ["hero"]);

    expect(built.ruleId).toBe("track-duplicate-id");
    expect(built.ids).toEqual(["hero"]);
    expect(Object.isFrozen(built.ids)).toBe(true);
  });

  it("carries a frozen empty payload for a rule that owns none", () => {
    const built = diagnostic("id-shape", "$.motions[0].id", "bad id");

    expect(built.ruleId).toBe("id-shape");
    // The claim moved with the shape rather than being dropped. It used to be the absence of the
    // member, which a flat `Diagnostic` retires: `ids` is always present, so a reader spelling `ids`
    // and a reader spelling `ids ?? []` are one reader rather than two. What this rule still cannot
    // do is carry a payload, and the `@ts-expect-error` probe below is what asks the compiler for
    // that, which is where the refusal always lived. Frozen, because an empty payload no caller can
    // mutate is the same promise as a populated one.
    expect(built.ids).toEqual([]);
    expect(Object.isFrozen(built.ids)).toBe(true);
  });
});

/**
 * The compile-time half, and the compiler is the assertion rather than a case.
 *
 * The cases above read the declarations as text, which proves the spelling and proves nothing about
 * what TypeScript does with it. An edit that kept both searched substrings while widening `OwnedIds`
 * back to an optional list for every rule would leave every one of them green, and because every call
 * site in the tree passes an array, `typecheck` would not notice either: a green case is evidence only
 * of what it would fail without, and those cases would not fail without the refusal. So the refusal is
 * asked of the compiler directly. Each `@ts-expect-error` fails `typecheck` when the line below it
 * stops being an error, which turns that mutant into a build failure instead of a green suite.
 *
 * Neither function is called. They are exported so that neither is an unused local, and their whole
 * content is the two directions this change is about. Both are stated, because a producer that refused
 * every payload would satisfy the refusing half on its own. `graph/ir.ts`'s `diag` was an alias of
 * this same constructor and carried no signature of its own, so a probe through it asked the compiler
 * about the identical thing a probe through `diagnostic` already does; `diag` is gone from `graph/ir.ts`
 * entirely now (callers there and in the relocated `graph/builders/incremental.ts` call `diagnostic`
 * directly), so what remains below probes the two spellings that are not aliases of one another.
 */
export function refusedByTheCompiler(retain: RetainTrace): void {
  // @ts-expect-error `id-shape` owns no ids, so a payload is unrepresentable.
  diagnostic("id-shape", "$", "x", ["unexpected"]);
  // @ts-expect-error `track-duplicate-id` always names ids, so omitting them is unrepresentable.
  diagnostic("track-duplicate-id", "$", "x");
  // @ts-expect-error `id-shape` owns no ids, so a payload is unrepresentable.
  reportDiagnostic(undefined, retain, "id-shape", "x", 0, ["unexpected"]);
  // @ts-expect-error `flush-failure` always names ids, so omitting them is unrepresentable.
  reportDiagnostic(undefined, retain, "flush-failure", "x", 0);
  // Every rule the scoped validator path can report owns no ids, authored or contributed, so a
  // payload is unrepresentable through it. `scopedRuleId` answered `RuleId` until this case existed,
  // which fell through to the open branch of `OwnedIds`, and the line below compiled. Nothing was
  // red for it, because that branch makes no claim: the refusal is asked of the compiler here
  // rather than recorded as landed in a comment. See issue #449.
  // @ts-expect-error the scoped path owns no ids, so a payload is unrepresentable.
  diagnostic(scopedRuleId("contribution", "stop-position"), "$", "x", ["unexpected"]);
}

/**
 * The accepting direction, in the same file, so the refusals above cannot be green against a
 * producer that refuses everything.
 */
export function acceptedByTheCompiler(retain: RetainTrace): void {
  diagnostic("id-shape", "$", "x");
  diagnostic("track-duplicate-id", "$", "x", ["hero"]);
  reportDiagnostic(undefined, retain, "flush-failure", "x", 0, ["hero"]);
  diagnostic(scopedRuleId("contribution", "stop-position"), "$", "x");
  diagnostic(scopedRuleId("authored", "stop-missing-start"), "$", "x");
}
