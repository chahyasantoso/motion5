# Trigger article: complete topic index

**Status: assessment / intent.** Companion to `docs/TRIGGER-ARTICLE-FEASIBILITY-ASSESSMENT.md`, which graded the 11 load-bearing proposals. This document indexes **every** topic raised in the article, including the ones the conversation raised and then abandoned. `docs/SESSION-STATUS.md` remains the only file allowed to assert what is true in the tree.

- Reviewed ref: `phase5/membership-base` @ `824c7e9605bcf167a6894bbf54f120eeecf0d905`
- 41 discrete topics across 7 turns.
- **The source article is truncated** mid-way through its final turn ("make a report about this"). Anything after that point is unassessed. If there is more, re-attach it.

---

## How to read this

The article is a live design conversation, not a proposal. It **revises itself five times**, and each revision silently retires the previous one. That is why it is hard to track: roughly a third of the concrete code sketches in it are already dead by the end of the same conversation.

So read section 2 first. It tells you which sketches are corpses.

Status values:

- **Verified** — claim checked against the tree, holds.
- **Partial** — true but the framing is misleading or incomplete.
- **Reject** — checked, does not hold, or actively harmful to implement.
- **Retired** — the article itself superseded this later in the same conversation. Do not implement.
- **Open** — speculative or unresolvable from the tree.

---

## 1. Turn map

| Turn | Prompt | What it produced |
|---|---|---|
| 1 | "review the trigger part, compare with the oracles" | Positives list, 4 issues, oracle comparison table, fix #1 |
| 2 | "why are they implemented nearly identically" | Flow trace, schema-vs-behavior split, fix #2 |
| 3 | "so the adapter layer should own the trigger" | Ownership argument, layer table, flow diagram |
| 4 | "what would it look like, is domain trigger just an enum" | `ports/trigger.ts` sketch, adapter sketch, fix #3 |
| 5 | "can this be simplified further" | Subscribe pattern, progress observable, fix #4 |
| 6 | "so a trigger is a clock?" | Structural-vs-semantic split, "time trigger is no trigger" |
| 7 | "so really there should just be a boolean?" | Optional `TriggerPort`, fix #5 (final) |

---

## 2. The self-supersession chain — read this before implementing anything

Five successive designs. **Only #5 stands.**

| # | Turn | Design | Killed by |
|---|---|---|---|
| 1 | 1 | Keep `BaseTrigger`, make `handle()` concrete, delete the 3 subclasses | Turn 2 |
| 2 | 2 | Single `ProgressTrigger extends BaseTrigger` + validating `createTrigger` switch | Turn 4 |
| 3 | 4 | `ports/trigger.ts` with `TriggerPort { attach, detach }` + `TriggerCommand` | Turn 5 |
| 4 | 5 | `TriggerPort { subscribe(cb: (progress: number) => void): () => void }` | Turn 7 (partially) |
| 5 | 7 | `MotionOptions { trigger?: TriggerPort }`. Absent = clock-driven | — stands |

Design 4 survives *inside* design 5 as the port's shape; it is only its mandatory-ness that changed. Designs 1–3 are dead ends. If you are cherry-picking code sketches out of the article, you will probably grab design 2 or 3, because they are the most fully written out. Don't.

---

## 3. Full topic inventory

### Turn 1 — the review

| ID | Topic | Status | Note |
|---|---|---|---|
| A1 | `BaseTrigger` uses true `#emit` private field, good encapsulation | Verified | Subclasses reach it via `protected emit()`. Correct pattern. |
| A2 | `TriggerDelegate` cleanly separates the contract | Verified | And this is exactly why it is a port, not domain (T8). |
| A3 | `createTrigger` factory centralizes instantiation | Verified | Also the only place trigger type is validated at runtime. |
| A4 | `assertProgress` does `isFinite` + range check | Verified | Keep it. See E9 for where it must *not* go. |
| A5 | `Object.freeze(command)` prevents downstream mutation | Partial | Shallow freeze of an inline literal that only `Motion` reads, and it reads one number off it. Near-zero actual protection. Design 5 deletes it; record the rationale. |
| A6 | Three subclasses are identical | Verified | Graded T1. |
| A7 | `play` / `pause` are dead API surface | Verified | Graded T2. |
| A8 | `signal()` type-mismatch throw is fragile | Partial | Graded T3. There is no dispatcher, so the check is not redundant. |
| A9 | `attach` throws / `detach` no-ops asymmetry | Verified | Graded T4. Design 4 deletes the problem instead of documenting it. |
| A10 | Oracle has no trigger module at all | Verified | Graded T5. `oracle/motionpath-v5/README.md` lists 7 files, none a trigger. |
| A11 | Oracle comparison table (5 rows) | Verified | Accurate but not decision-relevant; the oracle is a behavioral reference, not an architecture template (ADR-001). |
| A12 | "Your trigger layer is architecturally superior to the oracle" | Partial | True and irrelevant. Beating a prototype is not a reason to keep an abstraction. |
| A13 | **"The concern is internal redundancy, not correctness"** | **Reject** | The single most wrong sentence in the article. See section 5. |
| A14 | Fix #1: collapse into `BaseTrigger` | Retired | Superseded turn 2. |

### Turn 2 — why they are identical

| ID | Topic | Status | Note |
|---|---|---|---|
| C1 | `engine.ts` reads the schema type string and builds a trigger | Verified | `trigger: createTrigger(motionDefinition.trigger.type)`. |
| C2 | `Motion.#onTrigger` handles only `setProgress` | Verified | |
| C3 | `play` / `pause` are never read anywhere | Verified | |
| C4 | `#onTick` advances independently, never consults trigger type | Verified | This is where accumulate-vs-assign lives. See G3, B17. |
| C5 | All three types funnel into one `setProgress` pathway | Verified | |
| C6 | The three types carry intent for the adapter layer | Verified as intent | Zero code implements it. |
| C7 | "Correct for now, incomplete by design" | Partial | "By design" is generous. See A13. |
| C8 | Type lets validators warn when `"time"` is used without a clock adapter | **Open / good idea, absent** | `validate-v5.ts` has no such rule, and cannot: validation sees a project document, not the host's adapter wiring. This belongs at `Engine.load`, not `validateV5`. Worth building; it is the only concrete argument for keeping the type string that survives. |
| C9 | Type lets adapters inspect and wire the right driver | Verified as intent | No adapter exists. |
| C10 | Reserve space for divergence: `"time"` emits play/pause, `"scroll"` carries velocity | Open | **Collides with design 4.** See U1. |
| C11 | `play`/`pause` fields prove divergence was anticipated | Reject | Charitable. More likely leftover scaffolding. Nothing else in the tree corroborates the intent. |
| C12 | Fix #2: single `ProgressTrigger` class | Retired | Superseded turn 4. |

### Turn 3 — adapter ownership

| ID | Topic | Status | Note |
|---|---|---|---|
| D1 | The DOM adapter has zero trigger awareness | Verified | Read `adapters/dom.ts`: `createDomPatchAdapter` exposes `apply` / `clear`, pure patch writing. Confirmed. |
| D2 | Trigger responsibility is misplaced | Verified | Graded T7. Already the brief's stated policy. |
| D3 | What each type actually needs (scroll listener / clock tick / user call) | Verified | |
| D4 | None of that wiring exists in engine or domain | Verified | `adapters/` holds only `browser-clock.ts`, `dom.ts`, `interpolator/`. |
| D5 | Domain trigger is only the receiver; the sender is platform-specific | Verified | The core insight of the whole article. |
| D6 | Flow diagram: Adapter → Motion.signal → TriggerDelegate → #onTrigger → Track | **Reject as a guide** | The diagram **omits the Scheduler hop and `ProjectRuntime`**, both of which the brief mandates. Actual path: `#onTrigger` → `#scheduler.schedule` → `#setProgress` → `invalidate` → `ProjectRuntime.seek` → `GraphRuntime.invalidate`. Anyone implementing from this diagram will drop two required owners. |
| D7 | Layer responsibility table (Schema / Adapter / Domain trigger / Motion) | Verified | Sound, and consistent with the brief. |
| D8 | Domain-side `type` is "just a tag" | Verified | |
| D9 | `play`/`pause` belong on a future `InViewTrigger`, not `TimeTrigger` | Open | And an in-view gate is a **boolean, not a progress source** — a fourth shape nothing models. See U2. |
| D10 | Time play/pause is already handled by `motion.play()` / `pause()` | Verified | Both public on `Motion`. |

### Turn 4 — the port

| ID | Topic | Status | Note |
|---|---|---|---|
| E1 | `Clock` is the port precedent: interface in domain, impl in adapter | Verified | `ports/clock.ts` + `adapters/browser-clock.ts`. |
| E2 | `TriggerDelegate` is already a port in domain clothing | Verified | Graded T8. |
| E3 | Design 3: `ports/trigger.ts` with `attach` / `detach` + `TriggerCommand` | Retired | Superseded turn 5. |
| E4 | Drop `type`, `signal()`, `TriggerSignal` from the port | Partial | Not free: `TriggerSignal` is in the public `ProjectHandle.signal` signature (B14). Deleting it is a public API change. |
| E5 | `TriggerType` stays in the contract layer only | Verified | Already lives in `contract/v5.ts`; `domain/triggers.ts` merely re-exports it. |
| E6 | `ScrollTriggerAdapter` sketch over a `ScrollSource` (Lenis / ScrollTrigger / window) | Verified as feasible | Amusing detail: the sketch stores `#emit` and never reads it, and its `detach` has no double-call guard. It reproduces both smells it criticized in A7 and A9. |
| E7 | `Engine.load` calls `triggerFactory(motionDefinition.trigger)` from the adapter layer | **Reject** | This inverts a dependency: `engine.ts` currently imports only `contract`, `domain`, `graph`, `ports`, `runtime`. Making core's engine import an adapter factory drags DOM-capable code into the engine's dependency graph and will likely trip the P2-07 boundary scan. Correct shape: the **host** supplies the `TriggerPort` (via `EngineOptions` or per-motion), same as it already supplies `clock`, `interpolator`, and `scheduler`. See U4. |
| E8 | Full boundary diagram (contract / ports / domain / adapters / engine) | Partial | Sound except for the E7 arrow. |
| E9 | `assertProgress` moves into each adapter | **Reject** | Pushes validation outside the trust boundary; a third-party adapter could then feed `NaN` straight to `Track.setProgress`. Keep one validation point at `Motion`. |

### Turn 5 — simplify

| ID | Topic | Status | Note |
|---|---|---|---|
| F1 | Unify on subscribe-returns-unsubscribe, matching `Clock` | Verified | Graded T9. |
| F2 | Deletes `detach` asymmetry and `Motion.#triggerAttached` | Verified | Two guards with two failure modes become zero. |
| F3 | Drop `TriggerCommand`; the port becomes a bare progress observable | Partial | Agree, with the `Object.freeze` rationale recorded (A5) and U1 acknowledged. |
| F4 | `Motion` subscribes on mount, cleans up on pause/dispose | Verified | `Motion` already does exactly this for `Clock` via `#subscribe` / `#unsubscribe`. Symmetry is nearly free. But see B15. |
| F5 | The whole file collapses to a 3-line interface | Verified | ~95 lines net deletion including `test/unit/domain/triggers.test.ts`. |

### Turn 6 — is a trigger a clock

| ID | Topic | Status | Note |
|---|---|---|---|
| G1 | `Clock` and `Trigger` are structurally identical | Verified | |
| G2 | Do not merge them: autonomous playback vs external control | Verified | **The strongest paragraph in the article.** |
| G3 | Merging loses the ability to reason about *why* progress changed | Verified | `#onTick` accumulates (`#position + delta/duration`); `#onTrigger` assigns. That is the only real difference in `Motion`. |
| G4 | "Time trigger is no trigger at all; the clock is the trigger" | Partial | Right in principle. In the tree it is worse: `Engine.load` hardcodes `listenToClock: false`, so through the engine `"time"` is neither trigger nor clock. It is nothing (B3). |
| G5 | Scroll should **replace** the clock; the clock should go silent | **Open, and this is the missing mechanism** | `Motion` has `listenToClock`, but `Engine` sets it `false` for every motion regardless of type. Nothing switches it. If both were ever live, `#onTick` and `#onTrigger` would race over `#position` with last-job-wins. |
| G6 | Manual behaves the same as scroll | Verified | |
| G7 | Keep them separately named; "the name is the documentation" | Verified | |
| G8 | (implicit) contradicts `docs/TRIGGER-REFACTORING-FEASIBILITY.md` | Verified | Resolved in section 5 of the feasibility assessment. The article wins. |

### Turn 7 — the boolean

| ID | Topic | Status | Note |
|---|---|---|---|
| H1 | Scroll and manual are indistinguishable from the engine's view | Verified | |
| H2 | Three types collapse to a binary `driven` flag | Verified logically | |
| H3 | Better: an optional `TriggerPort` on `MotionOptions` | Verified | Design 5. `MotionOptions` already has `trigger?` and `listenToClock?`, so the shape nearly exists. |
| H4 | Present = external owns progress, clock silent. Absent = clock drives, `play()` starts | **Open** | This *is* the G5 mechanism, stated properly. Blocked on B3: the clock-driven branch has nothing behind it today. Graded T11. |
| H5 | Scroll-vs-manual is purely an adapter-factory hint, never reaches domain | Verified | |
| H6 | "No enum, no type string, no factory, no subclasses" | Partial | True of **domain only**. `SUPPORTED_TRIGGER_TYPES` and `TriggerType` stay in `contract/v5.ts` and are exported publicly from `index.ts`; `validate-v5.ts` needs them for the `trigger-shape` rule. The enum survives. |
| H7 | The domain question reduces to "does Motion have a TriggerPort or not" | Verified | Good final formulation. |

---

## 4. Unresolved tensions the article never closes

These are the things that will bite during implementation, because the conversation moved on before settling them.

**U1 — Scroll velocity vs the bare-number port.** C10 wants `"scroll"` to eventually carry velocity. F3 reduces the port to `(progress: number) => void`. These are mutually exclusive. Pick: either the port carries a small readonly signal object (and A5's freeze rationale stays relevant), or velocity is permanently an adapter-internal concern that never crosses into domain. Recommend the latter; velocity is a driver detail, and a scroll adapter can smooth internally before emitting progress.

**U2 — In-view is a fourth shape.** D9 floats `InViewTrigger` emitting play/pause. That is a **boolean gate**, not a progress source. Neither the schema's three types nor the proposed port models it. If in-view is real, it is a separate concept (a gate on whether the clock runs), not a trigger variant. Do not let it smuggle `play`/`pause` back into the port.

**U3 — `TriggerSignal` is public.** E4 says delete it. `index.ts` exports `ProjectHandle`, whose `signal(motionId, signal: TriggerSignal)` names it. It is currently unexported, which is already a defect (B14), but "delete it" and "export it" are different fixes and the choice changes the public surface. Decide before touching either.

**U4 — Who resolves the port?** E7 puts a `triggerFactory` call inside `Engine.load`. That inverts core's dependency direction and probably fails the boundary gate. The host should inject, matching how `clock` / `interpolator` / `scheduler` already arrive through `EngineOptions`.

**U5 — The clock-suppression switch does not exist.** G5 and H4 both assume `Motion` can be told "clock silent, external owns progress." `listenToClock` is that flag, but `Engine` never varies it. Building this is a prerequisite, not a consequence, of design 5.

**U6 — The article's field of view is one file.** It never mentions `stagger`, multi-track seeding, or failure containment, all of which are broken in the same pathway (B1, B2, B4). Its "redundancy, not correctness" verdict (A13) is an artifact of only reading `triggers.ts`. A reader who trusts A13 will conclude the trigger area is healthy. It is not.

---

## 5. Where the article is actually wrong

One substantive error, three overreaches.

**A13, the error.** "The concern is internal redundancy, not correctness." In the tree, on this exact pathway: `"time"` triggers never advance through `Engine` (B3), multi-track motions publish only their first track (B1), `stagger` is computed and discarded (B2), and a mid-load throw leaks a live graph and clock subscription (B4). Redundancy is the *least* of it.

**D6, the overreach.** A flow diagram that omits the Scheduler and `ProjectRuntime` is not a simplification, it is a trap, because those two are brief non-negotiables.

**E7 and E9, the overreaches.** Both push responsibility outward past a boundary that exists for a reason: E7 past the package boundary, E9 past the validation boundary.

Everything else in 41 topics holds up. That is a good hit rate for a design conversation.

---

## 6. Additional findings from this pass

Continuing the numbering from the feasibility assessment (which ran B1–B12 and B14; B13 was never issued).

**B15 — Medium. `pause()` destroys the trigger subscription, not just delivery.** `Motion.pause()` calls `#trigger?.detach()` and `#lifecycle.detach()`; `play()` then re-`mount()`s and re-attaches. Harmless with today's inert trigger class. Under T7, every pause/play cycle would **tear down and rebuild a live DOM scroll listener** (or a Lenis subscription). Design 5 needs to separate "suspend delivery" from "unsubscribe from the source."

**B16 — Low. Inconsistent post-destroy surface.** `play`, `seek`, and `signal` all `assertActive()` and throw "Motion is destroyed." `pause()` has no guard and silently no-ops, because `dispose` → `beforeDispose` calls it internally. Defensible, undocumented, and asymmetric to every sibling method.

**B17 — Medium. No coalescing of queued progress jobs.** `#onTrigger` queues one scheduler job per signal, each of which calls `#setProgress` → `invalidate` → `ProjectRuntime.seek` → a full `GraphRuntime.invalidate`. A scroll adapter emitting three signals before a flush causes **three graph invalidations for one frame**, only the last of which matters. This is precisely the T7 scroll use case, so it should be fixed as part of it: keep one pending progress value per motion and overwrite it, rather than queueing N jobs.

**B18 — Low. `createTrigger`'s `default` branch is unreachable and untestable.** `TriggerType` is a closed union, so the `Unsupported trigger type` throw cannot be hit without an `as` cast. `stryker.config.json` is in the tree; expect this to show up as a surviving mutant.

**B19 — Low. A test that does not test its own name.** `triggers.test.ts` has `it("does not depend on browser or DOM globals")` whose entire body asserts `trigger.type === "time"`. It promises an environment-independence guarantee it never checks. Under T7 this is the test that should be **strengthened** into a real boundary assertion, not deleted with the file.

---

## 7. What is decided vs still open

**Decided** (from the feasibility assessment, unchanged): adopt design 5's direction. Trigger becomes a port with one implementation; drivers live in adapters; `Clock` and `Trigger` stay separately named. Sequence Stage 0 correctness fixes before any refactor.

**Newly closed by this pass:** reject E7 (host injects, engine does not call adapter factories), reject E9 (validation stays at `Motion`), reject D6 as an implementation diagram, treat U1 as "velocity never crosses into domain," treat U2 as out of scope.

**Still open and needing a decision from you:** U3 (delete vs export `TriggerSignal`), U5 (who owns clock suppression, and whether `ProjectRuntime` grows a motion-advance responsibility to fix B3), and C8 (whether `Engine.load` should diagnose a `"time"` motion with no driver wired).
