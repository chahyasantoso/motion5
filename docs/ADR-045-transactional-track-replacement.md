# ADR-045: Track replacement is staged and committed once

**Status:** accepted  
**Date:** 2026-08-21  
**Issue:** [#176](https://github.com/chahyasantoso/motion5/issues/176)

## Context

`ProjectRuntime.#replaceTrack` used to commit the candidate graph, dispose the live compiled `Track`, compile its replacement, update the runtime definition, and finally update the owning `Motion`. Compilation, graph validation, and `Motion.replaceTrack` can each reject independently. That order therefore allowed a rejected operation to leave the graph, compiled map, runtime definition, and Motion entry describing different Tracks.

ADR-031 requires `Motion` to resolve a compiled Track by id from the live map and seed it before committing its own entry. The replacement cannot stay private until the end: Motion must see the candidate compiled Track while it validates. It also cannot destroy the displaced Track until every acceptance step succeeds, because that instance is the rollback value.

## Decision

The compiled-map owner exposes one injected `stageTrack(track, nodeId)` operation. Staging compiles a fresh Track, publishes it under the existing id, and retains the displaced instance. It returns exactly two terminal operations:

- `commit()` releases the displaced Track.
- `rollback()` republishes the displaced Track before releasing the candidate.

`ProjectRuntime` owns transaction sequencing, not compiled Track lifetime. Replacement now runs in this order:

1. Validate the authored replacement.
2. Stage the compiled Track.
3. Ask the owning Motion to validate, seed, and commit its replacement entry.
4. Ask the candidate graph to accept the replacement.
5. Commit the runtime definition and staged Track.

A refused Motion entry rolls back only the staged Track because `Motion.replaceTrack` is already atomic. A refused graph rolls back the staged Track first and then restores the Motion entry, so Motion resolves and seeds the republished displaced Track. Every rollback step is attempted even when an earlier step throws, and ADR-035 keeps the original rejection ahead of rollback failures.

`Engine` remains the single owner of the compiled map. It temporarily removes the live entry only inside the synchronous compile call so the existing compilation path builds a fresh instance. A compile rejection restores the displaced entry before escaping. No graph or Motion call can observe that preparation gap.

This amends ADR-031's old statement that replacement commits the graph before recompiling. Resolution by id remains unchanged; only the transaction around the live map is corrected.

## Consequences

A rejected compile, Motion entry, or graph commits no replacement state and leaves the original Track composable and retryable. Successful replacement still preserves Motion index, stagger timing, subscriber identity, and the public API.

The new seam is package-internal dependency injection. It does not add a public export, flag, compatibility path, or second compiled Track owner. `compileTrack` and `disposeTrack` keep add/remove ownership; `stageTrack` owns only replacement preparation and settlement.

Disposing the displaced Track happens after all acceptance steps. If that teardown throws, the replacement is already committed and remains live; rolling back after a potentially partial disposal would manufacture a disposed rollback value.

## Evidence

Cases `U-1` through `U-4` exercise the public Engine surface. Cases `U-5` through `U-8` pin the injected transaction order, rollback order, and ADR-035 precedence.

Failing-first run [32484448662](https://github.com/chahyasantoso/motion5/actions/runs/32484448662) reported `U-1` and `U-3` as assertion failures while 207 integration tests passed. Its quality job also named the absent `StagedTrack` and `stageTrack` seam at typecheck. The durable archive is `logs/32484448662/` on `ci-logs`.

Source-only green run [32486813523](https://github.com/chahyasantoso/motion5/actions/runs/32486813523) proves the staged implementation against quality, integration, boundaries, build, end-to-end, and performance checks.
