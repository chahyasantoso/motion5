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
// to edge identity, ordering, and labels (issue #137 and ADR-034). `R-` belongs to the trigger
// progress range fix, issue #138 and ADR-037.
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
// `S-` belongs to progress state commits inside `Track` (issue #149). It answers what internal
// bookkeeping a rejected interpolation timeline write may expose, not which Track a Motion owns
// or what a refused Motion mutation commits, so it does not extend either `C-` or `M-`.
//
// `K-` belongs to the public port surface: the shipped Scheduler implementation (issue #155) and
// the five port contracts the entry now names (issue #158). Every series above owns behavior
// inside one object; `K-` owns what a consumer outside the package can construct and name at all,
// which is why the scheduler cases and the declaration cases share one series rather than two.
//
// `B-` belongs to the tick error boundaries inside `GraphRuntime` (issue #154 and ADR-039): which
// owner a tick failure is attributed to once the clock consumers and the graph flush can fail
// independently. Every series above owns what an operation does or what it leaves behind; `B-`
// owns what the diagnostic says happened, which is why it does not extend `D-` or `P-`.
//
// `L-` belongs to time loop semantics: repeat, yoyo, and ping-pong playback (issue #156 and
// ADR-040). It owns how elapsed clock time becomes a cycle index, a direction, and a progress
// value. `T-` owns which driver a declared trigger gets and `R-` owns what range may reach
// `Motion` at all, so this extends neither: it is the arithmetic between those two questions.
//
// `G-` belongs to the GSAP-backed scroll source producer seam (issue #163): extracting the demo's
// ScrollTrigger wiring into a core adapter that takes `ScrollTrigger` as an injected structural
// dependency. It owns how a producer turns subscriber churn into exactly one lazily created
// instance and its teardown.
const TEST_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SELF = "unit/scripts/evidence-case-ids.test.ts";
const CASE_TITLE = /it\(\s*"((?:B|C|D|E|G|K|L|M|P|R|S|T)-\d+)/g;

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
