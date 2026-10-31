# ADR-083: One lifecycle value, and a memo that carries its whole key

**Status:** Accepted, 2026-09-16

**Context.** [Issue #376](https://github.com/chahyasantoso/motion5/issues/376) reads `GraphRuntime` at
`e4d2be0d611ebfbfe86132d7e46d2473c2a456a6` (main after
[#375](https://github.com/chahyasantoso/motion5/pull/375)), finds two state machines encoded as six independent
fields. Lifecycle = `#disposed`, `#flushing`, `#scheduledDrain`: three booleans, eight combinations, two meaning
nothing, each written in more than one place → lifecycle property reader reconstructs from writes, not value class
holds. Snapshot memo = `#snapshot`, `#snapshotGraph`, `#snapshotMembers` with `-1` standing in for cold,
`replaceGraph` clears two of three, leaves membership revision. Deferred half of
[#374](https://github.com/chahyasantoso/motion5/issues/374), which ADR-082 recorded as owed to own slice rather than
declined: second invariant, second blast radius, landing atop thirty-three moving call sites would make one review
unable to separate rename from rewrite.

**Decision one. Lifecycle is one discriminated value, `disposed` carries nothing.** `#phase: RuntimePhase` replaces
three booleans. Every transition one assignment, `#assertLive`, `#deferIfFlushing`, `#onTick`, `#flushTick` each read
one discriminant not field, two meaningless combinations gone not avoided: disposed runtime cannot be mid-flush,
cannot owe scheduler drain. Second previously kept unreached by hand-written `this.#scheduledDrain = false` inside
`dispose()` — exactly difference this record is about. Unreached = property of today's call graph. Unrepresentable =
property of type.

**Decision two. Memo is one value carrying whole key.** `#memo: SnapshotMemo` replaces other three fields. Cold =
discriminant not sentinel → no number stands in for absence, `-1` deleted. `warmMemo` requires snapshot, graph
identity, membership revision together → warm memo cannot exist without whole key it is read by; `replaceGraph`,
`dispose` each assign `COLD_MEMO` where they cleared two fields of three. Half-cleared key harmless at that head only
because warmth also required value beside it → stale revision never read; memo whose key can be half-cleared = shape
ADR-058 refuses one layer up, refused here for same reason not because it already cost something.

**Decision three, which #376 left open. Booked drain is field of live phases, not phase beside them.** Sketch in #376
and ADR-082's alternatives offers `draining` as fourth `kind`, issue asks that case decided explicitly not inherited.
Refused as written, reason measured not aesthetic: booking made inside `#deferIfFlushing`, runs only while
subscribers notified → runtime flushing **and** already owing drain = ordinary reentrant case, case
`scheduler-reentrancy` drives from outside. Fourth `kind` beside `flushing` cannot hold that pair → would either lose
coalescing that case measures, or need boolean beside it = defect this record exists to retire. So `idle` and
`flushing` each carry `drain: "unbooked" | "booked"`, `disposed` carries nothing, reachable state space five values
where all four live combinations real: quiet, deferral pending, publishing, publishing with deferral already pending.

```ts
type RuntimePhase =
  | { readonly kind: "idle"; readonly drain: DrainBooking }
  | { readonly kind: "flushing"; readonly drain: DrainBooking }
  | { readonly kind: "disposed" };
```

**Why `sequence` is not in phase.** Sketch puts it inside `flushing` member. Refused: `sequence` public monotonic read
must answer between flushes as readily as during → copy inside phase = second owner of one question, getter must
reconcile them. ADR-076 names that defect this project cares about most; field only ever increasing not state
machine. `#lastTick`, `#membersRevision`, `#lastFlushError` stay own fields same reason; `pendingSeeds`, `tick`,
`sequence`, `lastFlushError` all answer exactly as before.

**Why states live in own module.** `runtime/graph-runtime-state.ts` owns what legal state **is**: two unions, interned
values, total transitions over them. `GraphRuntime` owns **when** transition happens. One owner each not two owners of
one question, buys what issue asks and boolean pair could not: four live phase values not exported → reachable only
through `beginFlush`, `endFlush`, `bookingDrain`, `unbookDrain`, no second place can invent combination. Also what
makes failing-first evidence possible at all — next paragraph. Interning values keeps transition lookup not allocation
→ steady-state ticking allocates nothing here, as optimisation 7c of issue #223 intended for memo.

**What evidence can and cannot be.** Neither illegal combination reachable before change → no behavioural case can go
red on either. `dispose` cleared drain flag by hand, memo warmth required value beside key. Case asserting what class
does green before and after, proves nothing; case asserting private field names pins spelling of fix not invariant —
what #376's acceptance means by evidence pinning invariant not field names. So evidence = state space itself,
`packages/core/test/unit/runtime/graph-runtime-state.test.ts`, red at
`397bbe0e2dc9d13631309a884d87f7536791e68a` for honest reason module it imports does not exist there: set reachable
under every transition exactly five values and closed, disposal terminal under all four, booking survives flush it was
made inside, second booking for one drain refused, memo answers only for whole key. Three `@ts-expect-error` arrows
carry compile-time half in shape `membership-gating` used for #374: disposed phase has no `drain` to read, cold memo no
`snapshot` to read, `warmMemo` cannot be called with half key. One behavioural case deliberately green both sides —
regression keeping this record honest.

**What blast radius says, measured not feared.** Every ordering booleans had preserved, preserved by placing same
writes at same positions not by reasoning where they could move. `#flushSeeds` releases booking, derives snapshot,
moves `#sequence`, opens flush in that order, closes in `finally` whose first statement total → subscriber disposing
runtime mid-flush leaves it disposed not idle. `#drainScheduled` releases booking before asking about disposal — order
inline job had, load-bearing both directions: releasing first lets flush it runs book own follow-up, asking after stops
job scheduler accepted before `dispose` publishing over retired registry. `#scheduleDrain` still spells `flush([])`
for reason ADR-082 gives. `scheduler-reentrancy`, `publisher-reentrancy`, `clock-tick-identity`,
`publisher-snapshot-memo` untouched — acceptance criterion #376 states from other side: phase refactor needing one
edited would be evidence it changed behaviour, not evidence it worked.

**Superseded in part by [ADR-088](./ADR-088-the-deferred-payload-is-one-closed-value.md), 2026-09-16.** One sentence above says `#scheduleDrain` still spells `flush([])`, and two things in it moved. `#drainScheduled` is the member that publishes, `#scheduleDrain` only books, and since ADR-088 that publication spells `flush([])` for a deferral that carried no frame and `flushAtTick` for one that did. Every ordering claim in this paragraph stands, including the one this sentence sits between. [Issue #418](https://github.com/chahyasantoso/motion5/issues/418).

**One case worth naming, deliberately not fixed here.** `#flushSeeds` releases booking on every publication, including
one no drain scheduled → direct `flush` between booking and scheduler running it leaves job outstanding while phase
says none booked, next deferral books second. Both jobs harmless: second finds `#pendingSeeds` empty, returns. Real
disagreement between booking and scheduler holding it, older than this slice, repair would move behaviour
`scheduler-reentrancy` measures. Gets own issue rather than quiet correction inside refactor whose whole claim = nothing
observable moved.

**Superseded by [ADR-084](./ADR-084-a-deferred-publication-carries-its-whole-payload.md), and in part by [ADR-088](./ADR-088-the-deferred-payload-is-one-closed-value.md), 2026-09-16.** The case above did get its own issue and that issue was answered: ADR-084's decision three made the booking a claim about the scheduler, so `#releaseBooking` holds the handle with the booking and a publication that consumes a drain cancels the job it consumed. One drain is one outstanding job, so there is no second job to be harmless. The sentence that described it also named `#pendingSeeds`, which was a private set and is now a public getter over one `#pending` payload. [Issue #418](https://github.com/chahyasantoso/motion5/issues/418).

**Consequences.** No public surface, no behaviour, no diagnostic, no rule id. `GraphRuntime` still not exported from
`packages/core/src/index.ts`, neither new module → nothing in `apps/` or `packages/react` reaches either. Every
diagnostic id, rule id, message survives byte-for-byte, `#report` still reads `#members` for each, every publication
happens for same seeds at same sequence. Six fields deleted, two added. `#scheduleDrain`'s scheduler job becomes named
private `#drainScheduled` — name not mechanism: closure it replaces did same three things same order.

**Where reasoning lives.** `graph-runtime.ts` 19,528 bytes at `e4d2be0d`, 23,138 bytes formatted at
`b70f10ea95dce777ffe5f6c603ec464c1a75539f`, measured not estimated → stays under 30,000 that would oblige sister
document, members keep reasoning in source docblocks where citations stay legal. #376 asked that number specifically.
`graph-runtime-state.ts` 7,141 bytes, carries own. ADR-058, ADR-076, ADR-080, ADR-081, ADR-082 deliberately not edited:
project supersedes record with record rather than amending decided one → ADR-082's "deferred" status answered here, its
text as written, exactly as ADR-082 did to ADR-081's decision two.

**Status file, why in this slice.** [Issue #384](https://github.com/chahyasantoso/motion5/issues/384) found
`docs/SESSION-STATUS.md` at 7,960 bytes against 8,000 ceiling, ceiling already shaping edits not bounding them: #375
could not name follow-up issue carrying this slice — link cost ~fifty bytes, forty left. Makes #384 precondition for
this slice's own status rewrite rather than second invariant beside it → land together; #384 names `#376` as entry file
owes. Trim issue recommends: `#362` bullet stops enumerating seven merged phases and evidence ids, `57,567`-to-`47,208`
arithmetic back to #363 and #364 owning it, "Just landed and exercised" goes entirely now #336, #337, #338 all merged.
File 7,175 bytes after → headroom 825 not 40. `CEILING` not raised, reason test's own comment gives and #384 repeats:
number not problem; status file edited under budget it can breach in one honest sentence gets edited to satisfy budget
instead of stating status.

**Alternatives refused.** Implementing sketch literally with fourth `draining` phase — refused as decision three: cannot
represent booking made during flush, case `scheduler-reentrancy` drives. Keeping `#scheduledDrain` boolean beside
three-member union — refused: same defect one field smaller, `disposed` beside booking still writable. Putting
`sequence` in `flushing` member — refused above. Defining both unions inside `graph-runtime.ts` — refused: four live
values either exported for evidence to reach (second place invents combination) or unreachable by any test (invariant
asserted only by code having it). Fixing outstanding-job case above — refused as behaviour change inside slice claiming
none. Raising status ceiling — refused as #384 recommends.
