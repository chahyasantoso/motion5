import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { code } from "../helpers/source-region";

import { RULES, ruleSeverity } from "../../src/contract/rule";
import {
  BASE_RULE_IDS,
  CONTRIBUTION_RULE_IDS,
  CONTRIBUTION_RULE_ID_ALIASES,
  CONTRIBUTION_RULE_ID_PREFIX,
  KEYFRAME_RULE_IDS,
  RULE_IDS,
  isRuleId,
  scopedRuleId,
} from "../../src/contract/rule-id";

// The enumeration in `contract/rule-id.ts` is a hand-maintained list of subjects, so it gets the
// gate that shape earned in issue #283: a case scans the tree and asserts the list covers the ids
// actually present. Two audits of this union were wrong before it landed, in both directions, so
// the number is never asserted. Coverage is, and so is the scan having found its own subject: a
// scan that matched nothing answers absent for every spelling, which is the one way this gate
// could pass while proving nothing. See ADR-097.
//
// Extraction is anchored to constructor positions rather than to every kebab-shaped string,
// because this tree names rule ids in prose constantly and a docblock citing one is not a
// construction site. `contract/migrate-v4-to-v5.ts` is excluded from the first-argument form on
// purpose: its private `diagnostic(path, message)` puts the path first, and its one id is caught
// by the held form instead, which is why that module holds its rule in a constant.
//
// `buildDiagnostic` is a constructor position too. It is not a second constructor: it is what a
// module that already binds `diagnostic` to a producer of its own calls the one in
// `contract/diagnostics.ts`, because an import cannot shadow a local declaration. A scan that
// knew only the exported spelling went blind the moment a raw literal was routed through the
// alias, and went blind silently for every id but the one asserted below by name.
//
// A rule id held in a module constant is read too, and that form is why: `graph/order.ts`,
// `graph/references.ts`, `runtime/report.ts` and `runtime/graph-runtime.ts` each name a rule in a
// constant and assign the constant, so nine ids reached `Diagnostic.ruleId` without ever appearing
// as a literal argument, and `contract/migrate-v4-to-v5.ts` now joins them for a reason of its
// own, stated above. Those declarations all state `satisfies RuleId`, so the compiler
// refuses an unenumerated one where the rule is named; this scan is the measurement beside that
// proof, and it exists because a scan blind to a whole construction shape reports coverage it never
// tested.

const SOURCE_ROOT = fileURLToPath(new URL("../../src/", import.meta.url));
const SOURCE_FILE = /\.tsx?$/;
const VALIDATOR = "contract/validate-v5.ts";
const PATH_FIRST_CONSTRUCTOR = "contract/migrate-v4-to-v5.ts";
const TRIGGER_ADAPTER = "adapters/trigger-factory/default.ts";
// The scope is passed by the contribution adapter in the plugin layer rather than by the validator
// that reports the names. The inventory placed the prefix in `validate-v5.ts`; the scan found it
// here, which is the second thing this gate corrected about its own subject.
const CONTRIBUTION_SCOPE_FILE = "domain/plugins.ts";

const CONSTRUCTED =
  /\b(?:issue|diag|diagnostic|buildDiagnostic|frozenDiagnostic)\(\s*"([a-z][a-z0-9-]*)"/g;
const ASSIGNED = /\bruleId:\s*"([a-z][a-z0-9-]*)"/g;
const DECLARED = /\bruleId\s*=\s*"([a-z][a-z0-9-]*)"/g;
const REPORTED = /\badd\(\s*"([a-z][a-z0-9-]*)"/g;
const HELD = /\b[A-Z][A-Z0-9_]*_RULE(?:_ID)?\s*=\s*"([a-z][a-z0-9-]*)"/g;
const CONTRIBUTION_SCOPE = /scope:\s*"contribution"/;

interface FoundId {
  readonly id: string;
  readonly file: string;
}

function sourceFilesUnder(directory: string): readonly string[] {
  const found: string[] = [];
  for (const entry of readdirSync(`${SOURCE_ROOT}${directory}`, { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) found.push(...sourceFilesUnder(`${path}/`));
    else if (SOURCE_FILE.test(entry.name)) found.push(path);
  }
  return found;
}

function sourceFiles(): readonly string[] {
  return [...sourceFilesUnder("")].sort();
}

// Reading goes through `helpers/source-region`, which is the one owner of source text in this
// suite and erases comments while keeping literal tokens. That is exactly the projection a scan
// for constructed ids wants: a docblock naming a rule cannot register as a construction site.
function sourceOf(relativePath: string): string {
  return code(`${SOURCE_ROOT}${relativePath}`);
}

function matches(source: string, pattern: RegExp): readonly string[] {
  return [...source.matchAll(pattern)].map((match) => match[1] as string);
}

// A rule id always carries a hyphen, so requiring one costs nothing and keeps a lowercase
// single-word argument out of the scan.
function idsIn(relativePath: string): readonly string[] {
  const source = sourceOf(relativePath);
  const found = [
    ...matches(source, ASSIGNED),
    ...matches(source, DECLARED),
    ...matches(source, HELD),
  ];
  if (relativePath !== PATH_FIRST_CONSTRUCTOR) found.push(...matches(source, CONSTRUCTED));
  if (relativePath === VALIDATOR) found.push(...matches(source, REPORTED));
  return found.filter((id) => id.includes("-"));
}

function constructedIds(): readonly FoundId[] {
  return sourceFiles().flatMap((file) => idsIn(file).map((id) => ({ id, file })));
}

describe("rule id enumeration", () => {
  it("covers every rule id constructed under the core source tree", () => {
    const uncovered = constructedIds()
      .filter(({ id }) => !isRuleId(id))
      .map(({ id, file }) => `${id} constructed in ${file}`)
      .sort();
    expect([...new Set(uncovered)]).toEqual([]);
  });

  it("finds the contribution scope site, so a passing scan is never an empty one", () => {
    const withScope = sourceFiles().filter((file) => CONTRIBUTION_SCOPE.test(sourceOf(file)));
    expect(withScope).toEqual([CONTRIBUTION_SCOPE_FILE]);
  });

  // The presence of the site was all this gate used to assert about the family the prefix mints, so
  // a changed alias, a new alias or a newly reachable keyframe rule could emit an uncovered id while
  // the gate stayed green. It asserts the derivation itself now: every id the reporter can produce
  // for every rule it can report, through the one function the run time actually calls.
  it("covers every id the contribution scope can report, rule by rule", () => {
    const reported = KEYFRAME_RULE_IDS.map((name) => scopedRuleId("contribution", name));
    expect(reported.filter((id) => !isRuleId(id))).toEqual([]);
    expect([...reported]).toEqual([...CONTRIBUTION_RULE_IDS]);
  });

  it("leaves an authored rule spelled as authored", () => {
    const reported = KEYFRAME_RULE_IDS.map((name) => scopedRuleId("authored", name));
    expect(reported).toEqual([...KEYFRAME_RULE_IDS]);
  });

  it("covers every rule id a module constant holds, which no argument scan can see", () => {
    const held = [...new Set(sourceFiles().flatMap((file) => matches(sourceOf(file), HELD)))];
    expect(held.filter((id) => !isRuleId(id))).toEqual([]);
    // The scan asserts its own subject was found, for the reason the prefix case does: an empty
    // match set answers covered for every spelling.
    for (const id of [
      "graph-cycle",
      "observation-pending-reference",
      "clock-tick-regression",
      "diagnostic-sink-failure",
      "schema-v4-migration",
    ])
      expect(held).toContain(id);
  });

  it("reaches the construction modules, including the adapter the first inventory missed", () => {
    const files = sourceFiles();
    const found = [...new Set(constructedIds().map(({ id }) => id))];
    expect(files).toContain(TRIGGER_ADAPTER);
    expect(found).toContain("trigger-driver-unavailable");
    expect(found).toContain("schema-v4-migration");
    expect(found).toContain("keyframes-shape");
    expect(files.length).toBeGreaterThan(40);
    expect(found.length).toBeGreaterThan(50);
  });

  it("names every id exactly once", () => {
    expect(RULE_IDS.length).toBe(new Set(RULE_IDS).size);
    expect(BASE_RULE_IDS.length).toBe(new Set(BASE_RULE_IDS).size);
    expect(KEYFRAME_RULE_IDS.length).toBe(new Set(KEYFRAME_RULE_IDS).size);
  });

  it("derives the prefixed family through the alias substitution rather than a second list", () => {
    expect(CONTRIBUTION_RULE_IDS.length).toBe(KEYFRAME_RULE_IDS.length);
    expect(CONTRIBUTION_RULE_IDS).toContain(`${CONTRIBUTION_RULE_ID_PREFIX}stop`);
    expect(CONTRIBUTION_RULE_IDS).not.toContain(`${CONTRIBUTION_RULE_ID_PREFIX}stop-position`);
    for (const name of Object.keys(CONTRIBUTION_RULE_ID_ALIASES))
      expect(KEYFRAME_RULE_IDS).toContain(name);
  });

  it("keeps the standalone contribution literals out of the derived family", () => {
    const derived = new Set<string>(CONTRIBUTION_RULE_IDS);
    const standalone = BASE_RULE_IDS.filter((id) =>
      id.startsWith(CONTRIBUTION_RULE_ID_PREFIX),
    ).filter((id) => derived.has(id));
    expect(standalone).toEqual([]);
  });

  // The scan drops any candidate without a hyphen, so the naming rule that filter assumes is stated
  // here rather than left as an assumption inside the extractor. An id spelled as one word would be
  // invisible to the scan, which would report coverage it never tested; it fails this case instead.
  it("names every rule with a hyphen, which is what lets the scan filter on one", () => {
    expect(RULE_IDS.filter((id) => !id.includes("-"))).toEqual([]);
  });
});

// `ids` ownership and severity are both fixed where the rule is defined, and `contract/rule.ts` is
// the one owner of both. There is no partition of three groups left to read: the second answer in
// `contract/diagnostic-ids.ts` disagreed about four rules and that file is deleted. The record that
// replaced it is keyed by `RuleId`, so a rule answers exactly once and answering twice is
// unrepresentable rather than merely unmeasured. Its `satisfies` refuses a rule with no answer and
// the annotation on `RULES` refuses one the record never reaches; both are compile-time and neither
// is observable from a run. These cases read the record itself, which is the half a type cannot
// see. See ADR-097 and issue #449.
describe("rule id ids ownership", () => {
  it("answers every rule id exactly once, and answers nothing else", () => {
    expect(Object.keys(RULES).sort()).toEqual([...RULE_IDS].sort());
    expect(RULE_IDS.filter((id) => RULES[id].ids !== "none" && RULES[id].ids !== "always")).toEqual(
      [],
    );
  });

  it("owns no ids for any keyframe rule, authored or contributed", () => {
    expect(KEYFRAME_RULE_IDS.filter((id) => RULES[id].ids !== "none")).toEqual([]);
    expect(CONTRIBUTION_RULE_IDS.filter((id) => RULES[id].ids !== "none")).toEqual([]);
  });

  // A rule minted only on an error class has no diagnostic naming it, so nothing measures the ids it
  // would carry. The old answer was the optional group, on the argument that absence of a measurement
  // cannot justify requiring a payload. It cannot justify permitting one either, and these three have
  // no construction site at all, so they own none: the first site that forwards one into a diagnostic
  // with a payload fails at the point the decision is owed rather than compiling and carrying it.
  it("owns no ids for a rule with no construction site", () => {
    for (const id of ["live-value-key", "stale-motion-handle", "stale-track-handle"] as const)
      expect(RULES[id].ids).toBe("none");
  });

  // The warning population is the whole of what deriving severity changed, so it is pinned by
  // enumeration rather than by a count: a rule quietly becoming a warning, or a warning quietly
  // becoming an error, fails here rather than in whichever consumer notices first. The two contributed
  // spellings are derived through `scopedRuleId` rather than written out, because the alias map owns
  // how a keyframe rule is respelled and a literal here could be wrong about it silently.
  it("names exactly the rules that refuse as warnings", () => {
    const keyframeWarnings = ["stop-missing-start", "stop-missing-end"] as const;
    const expected = [
      "observation-pending-reference",
      "perspective-usage",
      "reentrant-flush-deferred",
      "value-batch-deferred",
      ...keyframeWarnings,
      ...keyframeWarnings.map((name) => scopedRuleId("contribution", name)),
    ];
    expect(RULE_IDS.filter((id) => ruleSeverity(id) === "warning").sort()).toEqual(expected.sort());
  });
});
