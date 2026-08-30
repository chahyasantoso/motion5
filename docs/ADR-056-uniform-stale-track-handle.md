# ADR-056: A stale TrackHandle refuses uniformly, and `live` is the non-throwing question

**Status:** Accepted, 2026-08-29

**Context.** `ProjectRuntime.#handle` exposed a token-guarded `TrackHandle` with two public failure contracts for one condition. The `track` getter threw `TypeError: Track "<id>" is no longer live.` when its token was stale; `remove()`, `replace()`, `addObserve()` and `removeObserve()` returned silently. A stale mutator therefore reported success by doing nothing while the getter failed loudly, and the same comparison was copied into `#removeTrack`, `#replaceTrack`, `#replaceWithObservation` and the getter. `TrackHandle` itself was declared twice, in `runtime/project-runtime.ts` and in `engine.ts`, which is the defect shape the two private `readNumber` copies had before `plugins/frame.ts` existed.

**Decision.** All-throw. Every handle member routes through one resolver, `#liveEntry(id, token)`, which throws `StaleTrackHandleError` when the captured token is not current. The error extends `TypeError` and keeps the existing message verbatim, so a caller narrowing on `instanceof TypeError` or anchored on that string keeps matching; it carries a stable `ruleId` of `stale-track-handle`, which is what a caller branches on instead. A non-throwing `readonly live: boolean` probe answers the same question for callers whose second call is expected rather than mistaken, and `TrackHandle` is declared once and named by both consumers.

Ownership does not move. `ProjectRuntime` holds the tokens and the `TrackEntry` map, so it stays the only thing that answers whether a token is current, the only thing that builds a handle, and the only thing that throws. Nothing enters `Track`, graph code, an adapter, or a new lifecycle service, and there is no injection seam: token validation is pure in-memory policy against state this object already holds, so a port with exactly one implementation would buy a second owner for nothing.

The comparison has one owner and two readers. `#entryIfLive` performs it, `#liveEntry` is that plus the throw, and `live` reads the probe, so the refusal and the report cannot disagree about the same handle. `SH-7` pins it as a count: exactly one token comparison in the module, and no branch at all inside the handle factory.

**Alternatives rejected.** All-silent would have made the getter return `undefined` and given every caller a nullable to thread through for a condition that is a caller bug. A boolean return from each mutator is the same silence with a value nobody checks. A fifth copied guard beside the four existing ones was the shape the slice exists to delete.

**Consequences.** Four members now throw where they returned silently. The repository audit in issue #217 reported no caller relying on that silence and was wrong by one: `unified-mutation-surface.test.ts` called `remove()` twice across an ABA reuse and asserted the no-op. It is migrated to assert the refusal, and the guarantee it was really about, that a stale handle can never reach the node that reused its id, is unchanged.

A handle survives its own `replace()`. Replacement preserves node identity and therefore the token, which is what keeps a React consumer from seeing a node disappear and come back, so `live` stays `true` across it. The issue's wording said `live` is `false` after replace; that would have invalidated the handle every existing replacement case reuses, and the wording is corrected here rather than implemented.

On a disposed project `live` is `false` and never throws, but `remove()` reports the disposal rather than the staleness, because `#assertLive()` runs first. The runtime's own lifecycle outranks one handle's, and `if (handle.live) handle.remove()` is correct either way.

`StaleTrackHandleError` and `TrackHandle` are declared in `contract/track-handle.ts` rather than beside the runtime that owns the policy, and that is a gate rather than a preference. `public-declaration-surface` refuses any `runtime/` or `graph/` module reachable from the package entry's declaration closure, and a caller cannot `instanceof` an error it cannot name, so a public error type cannot live under `runtime/`. The dependency arrow is the one every layer already uses.

**Supersedes in part.** [ADR-026](./DECISIONS.md) said `remove` and `replace` are idempotent for stale handles. That is withdrawn. Its token and its ABA guarantee are unchanged; the idempotence is replaced by the refusal plus `live`.

**Evidence.** Cases `SH-1` through `SH-7`. Red run [33249505343](https://github.com/chahyasantoso/motion5/actions/runs/33249505343), archived at `logs/33249505343/` on `ci-logs`: `typecheck` and `format:check` both passed first, then `npm test` reported `6 failed | 734 passed`, one failed file out of 155, with integration, boundaries, build, end-to-end and performance all green. `SH-6` passed as a guard by design.
