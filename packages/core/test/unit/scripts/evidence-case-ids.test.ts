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
//
// `Y-` belongs to the explicit `values` section (issue #177 and ADR-049): which authored spellings
// of a plugin group are legal now that both of a group's members are reserved by name, what an
// unknown or a missing section reports, and that the compiled value domain is the `values` section
// and nothing else. `F-` owns the group form's introduction and `N-` owns who may claim a key;
// `Y-` owns what a group is allowed to contain at all.
//
// `LF-` belongs to the authored leaf form (issue #192): what a single authored property may be
// once the object wrapper is retired, whether a static value enters compilation at all, and who is
// allowed to answer either question. It is the first two-letter series, and that is forced rather
// than chosen. Every single letter is either already claimed above, or excluded by the `M-`
// paragraph's own rule against a letter a plan uses unhyphenated (`A3` and `A5` in the runtime
// mutation model, `X3` in the recovery audit), or unusable in a citation beside a digit (`I` and
// `O`). The `P-` paragraph sets the policy this widening follows: the pattern is widened when a
// series is actually opened. `Y-` owns what a plugin group may contain; `LF-` owns what a leaf may
// be, which is the other half of the same authored record and a separate contract.
//
// `FO-` belongs to the `fk` pivot offset, slice A of issue #195: what an authored `x` and `y` on a
// bone mean, in whose space they are read, and what a bone that authors neither composes. `N-` owns
// how many plugins may claim a key and which one answers for an authored entry; `FO-` owns what the
// two keys do once `fk` claims them, and what the second claim costs their flat spelling. It is the
// second two-letter series, for the reason the `LF-` paragraph gives and under the policy the `P-`
// paragraph sets: every single letter is claimed, excluded, or unusable beside a digit.
//
// `CF-` belongs to the composition split inside `Track`, slice B of issue #195: that the
// interpolated state is readable before any plugin runs, that the plugin chain can be run from a
// given seed rather than only from the timeline, and that both entry points answer from one memo.
// `S-` owns what a rejected timeline write leaves behind in `Track`'s progress bookkeeping; `CF-`
// owns where the values a composition starts from come from, which is a different question about
// the same object. It is the third two-letter series, under the policy the `P-` paragraph sets,
// and `C-` alone is the option C plan. It sorts before `C` in the pattern below, because an
// alternation that offered `C` first would match `C` and then fail on the `F`.
//
// `CN-` belongs to the composer node id contract, slice C1 of issue #195: that a Track carries its
// qualified node id, hands it to every composed plugin as the fourth PluginComposer parameter,
// refuses an empty node id at construction, and leaves a three-argument composer assignable. `CF-`
// owns where the seed comes from; `CN-` owns how a plugin identifies which node it is composing.
// It is the fourth two-letter series, under the policy the `P-` paragraph sets, and `C-` alone is
// the option C plan. It sorts before `C` in the pattern below, because an alternation that offered
// `C` first would match `C` and then fail on the `N`.
//
// `RS-` belongs to solver resolution in `graph/ir.ts`, slice C2 of issue #195: that solver nodes
// derive their member list root-most first, that load-time validation enforces the six IK
// diagnostics ADR-051's table declares, that resolution is deterministic under permutation, that
// one confined walk answers for every chain shape, that a dead-rotation refusal reads the group
// which bound the solver, and that a reference error is reported without a derived chain
// diagnostic beside it. `Z-` owns edge-construction symmetry; `RS-` owns solver derivation.
// It is the fifth two-letter series, under the policy the `P-` paragraph sets, and `R-` alone is
// the progress range fix. It sorts before `R` in the pattern below, because an alternation that
// offered `R` first would match `R` and then fail on the `S`.
//
// `IK-` belongs to the IK solver plugin and runtime wiring, slice C3 of issue #195: the analytic
// two-bone inverse kinematics solve, FK solver override, upstream member delivery, dirty-check
// memoization, seed propagation, and renderer shielding. It is the sixth two-letter series, under
// the policy the `P-` paragraph sets.
//
// `SL-` is retired rather than reserved. It belonged to solver slot arity, slice D0 of issue #195:
// that a plugin may claim a slot family it could not enumerate, and that the goal-addressing
// grammar has one owner. ADR-057 deletes both the predicate and the grammar, so every case it
// owned either moved into `DV-` against the field representation or describes something that no
// longer exists, and the letters are removed from the pattern below rather than left matching
// nothing. Citations of `SL-` in ADR-052 are historical. The `P-` paragraph's policy cuts both
// ways: a series joins the pattern when it is opened, and leaves when it closes.
//
// `MG-` belongs to goal-addressed solving, slice D1 of issue #195: that an authored goal dict
// resolves to a chain leaf, that the bare `target` slot keeps working beside it, and that the six
// load-time rules naming an unknown member, a non-leaf, an unaddressed leaf, a duplicate spelling,
// a conflicting pair of spellings and an ambiguous mode all report from the one owner that knows
// the member set. `DV-` owns whether a slot may carry a dict at all; `MG-` owns whether the member
// a key names exists and what the solve does with it. It is the eighth two-letter series, under the
// policy the `P-` paragraph sets, and `M-` alone is the Motion mutation series. It sorts before `M`
// in the pattern below, because an alternation that offered `M` first would match `M` and then fail
// on the `G`.
//
// `FB-` belongs to the FABRIK solve, slice D2 of issue #195: that a chain past arity two reaches
// its goal and keeps its segment lengths, that both elbow branches agree with the closed form at
// arity two, that the derived seed bends except at full extension, that two goals sharing one
// sub-base are averaged in a derived order rather than an authored one, and that a solve which does
// not converge says whether it stalled or ran out of iterations. `IK-` owns the analytic two-bone
// solve and its runtime wiring; `FB-` owns the iterative one, which nothing wires yet. It is the
// ninth two-letter series, under the policy the `P-` paragraph sets, and `F-` alone is the authored
// keyframe group series. It sorts before `F` in the pattern below, because an alternation that
// offered `F` first would match `F` and then fail on the `B`.
//
// `PV-` belongs to offset-aware solving, issue #214 and ADR-054: that both solves account for the
// pivot offset `fk` applies, that the closed form survives it as a fixed base point and a rigid
// link with a twist, that the iterative one carries pivots beside tips, that a shared sub-base
// averages tips and never twists, and that every zero-offset rig keeps the doubles it published.
// `FO-` owns what an authored `x` and `y` mean on a bone and in whose space `fk` reads them, which
// is unchanged; `IK-` owns the analytic solve and `FB-` owns the iterative one, and both keep every
// number they pinned. This is the one contract that spans all three, which is why it extends none
// of them. It is the tenth two-letter series, under the policy the `P-` paragraph sets, and `P-`
// alone is the rollback error precedence series. It sorts before `P` in the pattern below, because
// an alternation that offered `P` first would match `P` and then fail on the `V`.
//
// `WT-` belongs to the per-member solved-rotation blend, issue #211 and ADR-055: that one `clamp`
// and one wrap-aware `lerpAngle` answer for both halves of the kinematic composition, that both
// ends of the blend are byte-exact rather than computed, that the tie at half a turn is pinned,
// that an omitted weight composes the unconditional override it replaces, and which authored
// shapes the narrowed dead-rotation rule and its new mirror refuse. `IK-` owns the solve and the
// override it publishes, which is unchanged; `FO-` and `PV-` own the offset; `WT-` owns how much of
// a solved angle a bone actually composes with, which is a question none of them ask. It is the
// eleventh two-letter series, under the policy the `P-` paragraph sets, and `W-` alone is the
// entrypoint tier series. It sorts before `W` in the pattern below, because an alternation that
// offered `W` first would match `W` and then fail on the `T`.
//
// `SH-` belongs to the stale `TrackHandle` contract, issue #217 and ADR-056: that every member of
// a handle whose token is no longer current refuses with one named error rather than half of them
// refusing and half returning silently, that the error keeps the message the getter already threw
// and carries a stable rule id beside it, that `live` answers the same question without throwing,
// and that one resolver owns the comparison all of them read. `U-` owns whether the graph, the
// compiled map and the Motion entry may disagree during a replacement, and `P-` owns which error
// a caller sees once a rollback can fail; `SH-` owns what a caller is told when the thing it holds
// is no longer the live one. It is the twelfth two-letter series, under the policy the `P-`
// paragraph sets, and `S-` alone is the progress state commit series. It sorts before `S` in the
// pattern below, because an alternation that offered `S` first would match `S` and then fail on
// the `H`.
//
// `DV-` belongs to dict-valued requirement slots, issue #220 and ADR-057: that a slot whose
// authored value is a record expands to one binding per key under any name, that whether a slot may
// carry one is a declaration the registry reads rather than a predicate a plugin answers, that the
// key participates in edge identity and ordering so two entries of one slot stay two edges, and
// that another plugin's dict is not read as a solver's goals. `Q-` owns what a declared requirement
// does and `J-` owns that it is the only input channel; `SL-` owned how many slots a plugin may
// accept, and this replaces that question rather than extending it, which is why that series
// retires above. It is the thirteenth two-letter series, under the policy the `P-` paragraph sets,
// and `D-` alone is the teardown ownership series. It sorts before `D` in the pattern below,
// because an alternation that offered `D` first would match `D` and then fail on the `V`.
//
// `EV-` belongs to cache residency in `IncrementalGraphBuilder`, issue #225 and ADR-058: that a
// completed build leaves an entry for exactly the tracks it walked, that removal, `destroyMotion`
// and project disposal need no eviction hook to make that true, that the hit path and the freshness
// check survive the sweep, that a build which throws evicts nothing, and what one builder shared by
// two projects costs. Every series above owns something an author writes or a caller is told; `EV-`
// owns what an adapter retains after nobody is looking at it, which is why it extends none of them.
// It is the fourteenth two-letter series, under the policy the `P-` paragraph sets, and `E-` alone
// is the edge identity series. It sorts before `E` in the pattern below, because an alternation
// that offered `E` first would match `E` and then fail on the `V`.
//
// `LV-` belongs to live value updates, issue #218 and ADR-059: that one immutable overlay inside
// `Track` reaches ordinary composition and the publisher-delivered `MemberState` through the same
// read, that a mask is replaced wholesale so an empty record is the clear, that the two runtime
// entry points differ only in whether the retained definition moved with the mask, that neither
// validates a definition or rebuilds the graph, and that an animated key is refused by name until
// the `Interpolator` port grows a per-key write. `CF-` owns where the values a composition starts
// from come from and `SH-` owns what a caller is told when its handle is stale; `LV-` owns what may
// mask those values at all, which is a question neither asks. It is the fifteenth two-letter
// series, under the policy the `P-` paragraph sets, and `L-` alone is the time loop series. It
// sorts before `L` in the pattern below, because an alternation that offered `L` first would match
// `L` and then fail on the `V`.
//
// `PK-` belongs to the record-shaped per-key timeline write, issue #231 and ADR-060: that an
// animated key's tweens are replaced on the still-live timeline against a retained base record,
// that a key dropped from the overlay is restored by the same code that patched a changed one, that
// a rebase is sticky, that the sibling tweens and the terminal padding tween are untouched, that a
// decline is escalation rather than refusal so a patching and a declining backend are
// indistinguishable on success and on failure, and which two leaf-kind refusals replace the one
// this series deletes. `LV-` owns what may mask a track's values at all and retires `LV-11` and
// `LV-12` to this series; `PK-` owns whether a value the interpolator drives can be written live,
// which is the question `LV-` answered with a refusal. It is the sixteenth two-letter series, under
// the policy the `P-` paragraph sets, and `P-` alone is the rollback error precedence series. It
// sorts before `P` in the pattern below, because an alternation that offered `P` first would match
// `P` and then fail on the `K`.
//
// `RA-` belongs to the runtime authoring surface, issue #223: that a structural change has one
// transaction owner rather than one copy of the ordering per entry point, that the hooks a commit
// reaches are applied in one sequence and reverted in apply order, that an effect counts as applied
// only once its call returned, and that the retained definitions and the committed graph are never
// allowed to disagree by identity. `U-` owns whether the graph, the compiled map and the Motion
// entry may disagree during one Track replacement, and `SH-` owns what a caller is told when the
// handle it holds is no longer live; `RA-` owns how many places are allowed to run a structural
// transaction at all, which is a question neither asks. It is the seventeenth two-letter series,
// under the policy the `P-` paragraph sets, and `R-` alone is the progress range fix. It sorts
// before `R` in the pattern below, because an alternation that offered `R` first would match `R`
// and then fail on the `A`.
//
// `RB-` belongs to the read budget on a source file, issue #267: that a file over the measured
// budget is refused, that a file carrying a recorded waiver is held to its own ceiling instead,
// that the refusal a waiver produces names the ceiling it crossed rather than the budget, and that
// a scan which found nothing says so rather than answering clean. Every series above owns something the runtime does or
// something a caller is told; `RB-` owns whether the file that states an invariant can be read at
// all by the implementor about to edit it, which is a question none of them ask. It is the
// eighteenth two-letter series, under the policy the `P-` paragraph sets, and `R-` alone is the
// progress range fix. It sorts before `R` in the pattern below, because an alternation that
// offered `R` first would match `R` and then fail on the `B`.
//
// `AE-` belongs to the AI edit request validation pass, issue #281 and the contract in
// `docs/AI-EDIT-WORKFLOW.md`: the anchor counts a dry run reports, the count each refusal names,
// that a later edit is validated against what an earlier one staged, that a refusal leaves every
// file it named untouched, which subject a dry run's commit carries and which a real run keeps,
// and which of the touched and format lists a deleted path belongs on. `RB-` owns whether the file
// stating an invariant can be read at all by the implementor about to edit it; `AE-` owns whether
// the write that changes it lands as its own report describes. It is the nineteenth two-letter
// series, under the policy the `P-` paragraph sets, and it is the first one to join the pattern
// later than the slice that opened it. That lateness is issue #283 rather than a decision: the
// series was declared, cited by the document owning the workflow and by the header of the script
// it covers, and never gated for uniqueness, because a series the pattern cannot see contributes
// no ids to the collision map and leaves the first case above green by construction. `A` alone is
// not in the alternation and cannot be, by the `M-` paragraph's rule against a letter a plan uses
// unhyphenated, so this is the one two-letter widening with no ordering hazard to avoid, and it
// sorts first rather than ahead of its own initial.
const TEST_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SELF = "unit/scripts/evidence-case-ids.test.ts";
const AI_EDIT = "unit/scripts/apply-ai-edit.test.ts";
const CASE_TITLE =
  /it\(\s*"((?:AE|CF|CN|DV|EV|FB|FO|IK|LF|LV|MG|PK|PV|RA|RB|RS|SH|WT|B|C|D|E|F|G|H|J|K|L|M|N|P|Q|R|S|T|U|V|W|Y|Z)-\d+)/g;
const REACT_RENDER = "packages/react/test/public-hook-render.test.ts";
const SERIES_SHAPED_TITLE = /it\(\s*"([A-Z]{1,2}\d*)-(\d+)(?![\w-])/g;
const SERIES_PREFIX = /^[A-Z]{1,2}$/;

interface SeriesShapedId {
  readonly id: string;
  readonly prefix: string;
}

function testFiles(): readonly string[] {
  return readdirSync(TEST_ROOT, { recursive: true, encoding: "utf8" })
    .map((entry) => entry.split("\\").join("/"))
    .filter((entry) => entry.endsWith(".test.ts") && entry !== SELF)
    .sort();
}

function sourceOf(relativePath: string): string {
  return readFileSync(`${TEST_ROOT}${relativePath}`, "utf8");
}

function declaredCaseIds(relativePath: string): readonly string[] {
  return [...sourceOf(relativePath).matchAll(CASE_TITLE)].map((match) => match[1] as string);
}

function seriesShapedIds(relativePath: string): readonly SeriesShapedId[] {
  const found = [...sourceOf(relativePath).matchAll(SERIES_SHAPED_TITLE)];
  return found.map((match) => ({ id: `${match[1]}-${match[2]}`, prefix: match[1] as string }));
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

  it("reaches the AE- series, which was declared and cited and never scanned", () => {
    const ids = declaredCaseIds(AI_EDIT);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter((id) => !/^AE-\d+$/.test(id))).toEqual([]);
  });

  it("names every series the tree declares, or refuses the id it cannot match", () => {
    const found: string[] = [];
    const ungated: string[] = [];
    for (const file of testFiles()) {
      const gated = new Set(declaredCaseIds(file));
      for (const { id, prefix } of seriesShapedIds(file)) {
        if (!SERIES_PREFIX.test(prefix)) continue;
        found.push(id);
        if (!gated.has(id)) ungated.push(`${id} declared in ${file}`);
      }
    }
    expect(found.length).toBeGreaterThan(15);
    expect(ungated.sort()).toEqual([]);
  });

  it("walks every package the suite runs, and no dependency tree", () => {
    const files = testFiles();
    expect(files).toContain(REACT_RENDER);
    expect(declaredCaseIds(REACT_RENDER)).toContain("H-4");
    expect(files.filter((file) => file.includes("node_modules"))).toEqual([]);
  });
});
