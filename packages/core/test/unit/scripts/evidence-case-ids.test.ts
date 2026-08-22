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
//
// `F-` belongs to plugin-named authored keyframe groups (issue #165 and ADR-041): which authored
// spellings of a keyframe are legal, which plugin owns a grouped leaf, and what the group is
// flattened to before compilation. It owns the authored form rather than the published one.
//
// `H-` belongs to internal-key enforcement (issue #166 and ADR-042): which composed keys reach a
// patch at all. It is the published counterpart of `F-` and stays a separate series because the
// authored form and the published surface are separate contracts: a key can be legal to author,
// legal to compose, and still never publishable.
//
// `N-` belongs to per-plugin key ownership (ADR-043): how many plugins may claim one key, which
// one owns an authored entry, and what a flat spelling with several claimants does. It does not
// extend `F-`, which owns the authored shapes a document may use; this owns who is allowed to
// answer for a key at all, and it is the reason the group form stopped being pure sugar.
//
// `Q-` belongs to plugin-owned input requirements (issue #173 and ADR-044): which input slots a
// plugin declares, how an author binds one inside that plugin's authored group, what edge the
// binding derives, and how a bound upstream value reaches composition without entering the
// track's authored value namespace. `F-` and `N-` both own authored keyframe *properties*; this
// owns an authored section that is not a property at all, and the graph dependency it creates.
//
// `U-` belongs to transactional Track replacement (issue #176 and ADR-045): what a refused
// recompile, a refused Motion entry rewrite, or a rejected candidate graph leaves behind when an
// existing node is replaced. `P-` owns which error a caller sees once a rollback can fail, and
// `M-` owns what a refused mutation inside one `Motion` commits; `U-` owns whether the graph, the
// compiled map, and the Motion entry are allowed to disagree with each other at all.
//
// `V-` belongs to the removal of `ObservationDefinition.target` (issue #175 and ADR-046): whether
// an authored field with no consumer is refused rather than quietly accepted, and what edge
// identity, edge ordering, and live state carry once it is gone. `E-` owns how an edge is encoded,
// ordered, and labelled, and it kept a case pinning an authored empty target as its own edge;
// `V-` owns whether that field is authorable at all, which is why it retires that case instead of
// extending the series.
//
// `Z-` belongs to edge-construction symmetry in `graph/ir.ts` (issue #181): both authored forms
// which derive an edge are resolved by a named function of the same shape, and neither the edge
// nor its diagnostics change when that becomes true. `E-` owns how an edge is encoded, ordered,
// and labelled; `Z-` owns who is allowed to build one.
//
// `J-` belongs to the single input channel (issue #180 and ADR-047): that `observes` declares an
// output edge only, that a plugin requirement is the only way a value enters composition, and that
// no parameter exists by which an upstream value could reach a track's authored namespace. `Q-`
// owns what a declared requirement does; `J-` owns that it is the only thing that does it.
//
// `W-` belongs to entrypoint tiers (issue #167 and ADR-048): which declared subpaths a production
// consumer may import, and whether a mechanical gate can see the workspaces that would get it
// wrong. `K-` owns what a consumer outside the package can construct and name; `W-` owns which of
// those things it is allowed to name at all, and where the scan is looking when it decides.
const TEST_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SELF = "unit/scripts/evidence-case-ids.test.ts";
const CASE_TITLE = /it\(\s*"((?:B|C|D|E|F|G|H|J|K|L|M|N|P|Q|R|S|T|U|V|W|Z)-\d+)/g;

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
    const files = testFiles().filter((file) => declaredCaseIds(file).length > 0);
    const total = files.reduce((count, file) => count + declaredCaseIds(file).length, 0);
    expect(files.length).toBeGreaterThanOrEqual(3);
    expect(total).toBeGreaterThan(15);
  });
});
