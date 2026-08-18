import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The citation series are this project's evidence keys: implementation plans, ADRs, and every
// pull request body name evidence by id rather than by test title. Two cases sharing one id makes
// each of those citations ambiguous, so the gate is uniqueness across the whole suite, not within
// a file. Titles are matched instead of bare ids so a comment referring to another case cannot
// register as a second declaration.
//
// `C-` belongs to the option C plan (ADR-031). `T-` belongs to the T4/T5 trigger parity plan,
// which needed its own prefix because that plan already uses `T4-n` and `T5-n` for its locked
// decisions; reusing those for test cases would have made every citation two-valued. `E-` belongs
// to edge identity, ordering, and labels (issue #137 and ADR-034). `R-` is reserved for the next
// series, so the pattern does not have to be widened again to admit one.
// decisions; reusing those for test cases would have made every citation two-valued. `R-` belongs
// to the trigger progress range fix, issue #138 and ADR-034. `E-` is reserved here for the
// edgeKey separator fix, issue #137, so that whichever of those two lands second rebases instead
// of widening this pattern a second time.
//
// `P-` belongs to the rollback error precedence fix (issue #133 and ADR-035). Reserving a spare
// letter has now failed twice to prevent a widening, because both reservations above were claimed
// by the issues they were reserved against. The pattern is therefore widened when a series is
// actually opened, and nothing here is reserved for a series that does not exist yet.
//
// `D-` belongs to teardown ownership inside `Engine` (issues #143 and #145): disposing the
// ProjectRuntime a failed `load()` created, and running every remaining cleanup step when one of
// them throws. It is a separate series from `P-` on purpose. `P-` owns which error a caller sees
// when a rollback fails, in `ProjectRuntime`; `D-` owns whether the cleanup ran at all, in
// `Engine`. One citation, one owner, per the paragraph above.
//
// `M-` belongs to single-track mutation atomicity inside `Motion` (issue #147): what a refused
// `addTrack` or `replaceTrack` leaves behind. It is separate from `C-` even though both live in
// the domain and both were opened against `Motion`, because `C-` owns how a Track is reached and
// `M-` owns what a refusal costs. A letter is chosen that no plan already uses unhyphenated, so
// `A3` and `A5` from the runtime mutation model cannot be misread as cases in this series.
//
// `L-` belongs to the `Track` leaf's own progress transition (issue #149): whether a refused
// `setProgress` leaves the leaf reporting a value its timeline never accepted. Separate from `M-`
// even though PR #148 found it, because `M-` owns a `Motion`'s entry list and `L-` owns one
// leaf's bookkeeping, and separate from `C-` for the same reason `M-` is. `L` for the leaf, and
// like `M` it is a letter no plan already uses unhyphenated, so `S4` and `S7` from the plugin and
// recovery slices cannot be misread as cases here.
const TEST_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SELF = "unit/scripts/evidence-case-ids.test.ts";
const CASE_TITLE = /it\(\s*"((?:C|D|E|L|M|P|R|T)-\d+)/g;

function testFiles(): readonly string[] {
  return readdirSync(TEST_ROOT, { recursive: true, encoding: "utf8" })
    .map((entry) => entry.split("\\").join("/"))
    .filter((entry) => entry.endsWith(".test.ts") && entry !== SELF)
    .sort();
}

function declaredCaseIds(relativePath: string): readonly string[] {
  const source = readFileSync(`${TEST_ROOT}${relativePath}`, "utf8");
  return [...source.matchAll(CASE_TITLE)].map((match) => match[1] as string);
}

describe("evidence case ids", () => {
  it("declares every citation case id exactly once across the suite", () => {
    const owners = new Map<string, string[]>();
    for (const file of testFiles())
      for (const id of declaredCaseIds(file)) owners.set(id, [...(owners.get(id) ?? []), file]);
    const collisions = [...owners.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([id, files]) => `${id} declared in ${files.join(" and ")}`)
      .sort();
    expect(collisions).toEqual([]);
  });

  it("finds the series at all, so a passing run is never an empty scan", () => {
    // Guards the gate itself: a broken directory walk or regex would otherwise report zero
    // collisions forever. A floor, not an exact count, so adding evidence never fails this.
    const files = testFiles().filter((file) => declaredCaseIds(file).length > 0);
    const total = files.reduce((count, file) => count + declaredCaseIds(file).length, 0);
    expect(files.length).toBeGreaterThanOrEqual(3);
    expect(total).toBeGreaterThan(15);
  });
});
